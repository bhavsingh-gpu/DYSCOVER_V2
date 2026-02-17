import express from 'express';
import crypto from 'crypto';
import { orchestrateAnalysis } from '../services/correctionEngine.js';
import { analyzeWriting } from '../services/gemini.js';
import { db, saveUserProgress } from '../services/firebase.js';
import { calculateWritingRewards } from '../services/rewardService.js';
import admin from 'firebase-admin';

const router = express.Router();

/**
 * Optimized Upload Process:
 * 1. Rate Limit (Per User/Day)
 * 2. Hashing (Caching)
 * 3. Local Spell Check (Gatekeeper)
 * 4. Gemini AI (If needed)
 * 5. Reward Calculation
 * 6. DB Persistence
 */
router.post('/process', async (req, res) => {
  try {
    const { content, contentType, userId, metadata } = req.body;

    if (!content || !userId) {
      return res.status(400).json({ error: 'Content and UserId are required' });
    }

    // 1. RATE LIMIT CHECK (Configurable, default 50 per day)
    const DAILY_LIMIT = parseInt(process.env.DAILY_UPLOAD_LIMIT) || 50;
    const today = new Date().toISOString().split('T')[0];
    const userRef = db.collection('users').doc(userId);
    const statsRef = userRef.collection('usage').doc(today);

    const usageDoc = await statsRef.get();
    const currentUsage = usageDoc.exists ? usageDoc.data().uploadCount || 0 : 0;

    if (currentUsage >= DAILY_LIMIT) {
      return res.status(429).json({
        error: 'Daily limit reached',
        message: `You have used your ${DAILY_LIMIT} daily uploads. Come back tomorrow!`
      });
    }

    // 2. CACHE CHECK - Temporarily disabled to fix "BUTIFUL" persistent issue
    /*
    let textHash = null;
    if (contentType !== 'image') {
      textHash = crypto.createHash('md5').update(content).digest('hex');
      const cacheRef = db.collection('analysis_cache').doc(textHash);
      const cachedResult = await cacheRef.get();

      if (cachedResult.exists) {
        console.log(`[Upload] Cache Hit for hash: ${textHash}`);
        const data = cachedResult.data();
        await statsRef.set({ uploadCount: admin.firestore.FieldValue.increment(1) }, { merge: true });
        return res.json({
          success: true,
          cached: true,
          analysis: data.analysis,
          rewards: data.rewards
        });
      }
    }
    */
    let textHash = crypto.createHash('md5').update(content).digest('hex');


    // 3. LOGIC GATE: Text vs Image
    let finalAnalysis;
    let rewards;

    if (contentType !== 'image') {
      // THE STRONG ALGO: Orchestrated analysis
      finalAnalysis = await orchestrateAnalysis(content, userId);
    } else {
      // 5. GEMINI VISION FALLBACK (Still handled here for images)
      console.log('[Upload] Processing Image/Handwriting with Vision.');
      try {
        finalAnalysis = await analyzeWriting(content, 'image');
      } catch (visionErr) {
        console.error('[Vision] Analysis failed:', visionErr.message);
        finalAnalysis = {
          corrected: content,
          explanation: "Vision analysis is currently busy, but we've recorded your upload.",
          score: 80,
          mistakes: []
        };
      }
    }

    // FINAL SAFETY: Ensure data is consistent
    if (!finalAnalysis) {
      finalAnalysis = { corrected: content, explanation: "Checked! Great effort.", score: 100, mistakes: [] };
    }

    if (!rewards) {
      const score = finalAnalysis.score || 80;
      rewards = {
        points: Math.max(1, Math.floor(score / 10)),
        stars: score > 90 ? 3 : (score > 70 ? 2 : 1)
      };
    }

    // 6. DB PERSISTENCE
    const uploadData = {
      userId,
      content: contentType === 'image' ? '[IMAGE_DATA]' : content,
      analysis: finalAnalysis,
      rewards,
      textHash,
      metadata: metadata || {},
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    };

    await userRef.collection('uploads').add(uploadData);
    await statsRef.set({ uploadCount: admin.firestore.FieldValue.increment(1) }, { merge: true });

    try {
      await saveUserProgress(userId, {
        level: finalAnalysis.score || 80,
        practiceType: 'analysis',
        notes: `Analyzed: ${content?.substring(0, 30)}...`
      });
    } catch (progErr) {
      console.error('[Upload] Progress save failed:', progErr.message);
    }

    await userRef.set({
      stats: {
        totalPoints: admin.firestore.FieldValue.increment(rewards.points),
        totalStars: admin.firestore.FieldValue.increment(rewards.stars),
        lastActivity: admin.firestore.FieldValue.serverTimestamp()
      }
    }, { merge: true });

    // Cache results
    if (textHash) {
      try {
        await db.collection('analysis_cache').doc(textHash).set({
          analysis: finalAnalysis,
          rewards,
          createdAt: admin.firestore.FieldValue.serverTimestamp()
        });
      } catch (e) {
        console.warn('[Cache] Failed to save:', e.message);
      }
    }

    return res.json({
      success: true,
      analysis: finalAnalysis,
      rewards
    });

  } catch (error) {
    console.error('CRITICAL: Upload process failed:', error);
    return res.status(500).json({
      error: 'Failed to process upload',
      message: error.message
    });
  }
});

export default router;

