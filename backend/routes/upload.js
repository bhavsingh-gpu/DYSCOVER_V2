import express from 'express';
import { analyzeContent } from '../services/gemini.js';
import { db } from '../services/firebase.js';

const router = express.Router();

// POST /api/upload/process - Process uploaded content (text/image)
router.post('/process', async (req, res) => {
  try {
    const { content, contentType, userId, metadata } = req.body;

    if (!content) {
      return res.status(400).json({ error: 'Content is required' });
    }

    // Analyze the content
    const analysis = await analyzeContent(content, contentType || 'text');

    // Save upload record if userId provided
    if (userId) {
      try {
        const uploadRef = db.collection('users').doc(userId).collection('uploads');
        await uploadRef.add({
          content,
          contentType: contentType || 'text',
          analysis,
          metadata: metadata || {},
          createdAt: new Date().toISOString(),
          processedAt: new Date().toISOString()
        });
      } catch (dbError) {
        console.error('Failed to save upload:', dbError);
        // Continue even if save fails
      }
    }

    res.json({
      success: true,
      contentType: contentType || 'text',
      analysis
    });
  } catch (error) {
    console.error('Error processing upload:', error);
    res.status(500).json({
      error: 'Failed to process upload',
      message: error.message
    });
  }
});

export default router;

