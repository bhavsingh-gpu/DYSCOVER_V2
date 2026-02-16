import express from 'express';
import { simplifyText, generateAudioText, analyzeContent } from '../services/gemini.js';
import { saveSimplifiedText } from '../services/firebase.js';
import rateLimit from 'express-rate-limit';

const router = express.Router();

// Rate limiting for AI endpoints (protect against excessive API costs)
const aiRateLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 60000, // 1 minute
  max: parseInt(process.env.RATE_LIMIT_MAX) || 10, // 10 requests per minute
  message: 'Too many requests, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// POST /api/ai/simplify - Simplify text for dyslexic learners
router.post('/simplify', aiRateLimiter, async (req, res) => {
  try {
    const { text, userId, usePro } = req.body;

    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return res.status(400).json({ error: 'Text is required and must be a non-empty string' });
    }

    if (text.length > 5000) {
      return res.status(400).json({ error: 'Text is too long. Maximum 5000 characters.' });
    }

    // Simplify text using Gemini
    const simplifiedText = await simplifyText(text, usePro === true);

    // Save to Firestore if userId provided
    if (userId) {
      try {
        await saveSimplifiedText(userId, text, simplifiedText, {
          model: usePro ? 'pro' : 'flash',
          originalLength: text.length,
          simplifiedLength: simplifiedText.length
        });
      } catch (dbError) {
        console.error('Failed to save to database:', dbError);
        // Continue even if save fails
      }
    }

    res.json({
      success: true,
      original: text,
      simplified: simplifiedText,
      model: usePro ? 'pro' : 'flash'
    });
  } catch (error) {
    console.error('Error in /simplify:', error);
    res.status(500).json({
      error: 'Failed to simplify text',
      message: error.message
    });
  }
});

// POST /api/ai/audio-text - Generate audio-optimized text
router.post('/audio-text', aiRateLimiter, async (req, res) => {
  try {
    const { text, userId } = req.body;

    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return res.status(400).json({ error: 'Text is required and must be a non-empty string' });
    }

    const audioText = await generateAudioText(text);

    res.json({
      success: true,
      original: text,
      audioOptimized: audioText
    });
  } catch (error) {
    console.error('Error in /audio-text:', error);
    res.status(500).json({
      error: 'Failed to generate audio text',
      message: error.message
    });
  }
});

// POST /api/ai/analyze - Analyze content for difficulty and suggestions
router.post('/analyze', aiRateLimiter, async (req, res) => {
  try {
    const { content, contentType = 'text', userId } = req.body;

    if (!content || typeof content !== 'string' || content.trim().length === 0) {
      return res.status(400).json({ error: 'Content is required and must be a non-empty string' });
    }

    const analysis = await analyzeContent(content, contentType);

    res.json({
      success: true,
      content,
      contentType,
      analysis
    });
  } catch (error) {
    console.error('Error in /analyze:', error);
    res.status(500).json({
      error: 'Failed to analyze content',
      message: error.message
    });
  }
});

router.post('/word-lab', aiRateLimiter, async (req, res) => {
  try {
    const { word } = req.body;

    if (!word || typeof word !== 'string' || word.trim().length === 0) {
      return res.status(400).json({ error: 'Word is required' });
    }

    const { getWordBreakdown } = await import('../services/gemini.js');
    const breakdown = await getWordBreakdown(word.trim());

    res.json({
      success: true,
      word: word.trim(),
      ...breakdown
    });
  } catch (error) {
    console.error('Error in /word-lab:', error);
    res.status(500).json({
      error: 'Failed to get word breakdown',
      message: error.message
    });
  }
});

// POST /api/ai/generate-quiz - Generate a comprehension quiz
router.post('/generate-quiz', aiRateLimiter, async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return res.status(400).json({ error: 'Text is required' });
    }

    const { generateQuiz } = await import('../services/gemini.js');
    const quiz = await generateQuiz(text);

    res.json({
      success: true,
      quiz
    });
  } catch (error) {
    console.error('Error in /generate-quiz:', error);
    res.status(500).json({
      error: 'Failed to generate quiz',
      message: error.message
    });
  }
});

export default router;

