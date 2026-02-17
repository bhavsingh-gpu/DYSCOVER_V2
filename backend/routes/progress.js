import express from 'express';
import { getUserProgress, saveUserProgress } from '../services/firebase.js';
import { db } from '../services/firebase.js';

const router = express.Router();

// GET /api/progress/:userId - Get user progress
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const progress = await getUserProgress(userId);

    // Format dates for frontend consumption
    const formattedProgress = progress.map(p => {
      let dateStr = p.date;
      if (p.date?.toDate) {
        dateStr = p.date.toDate().toISOString();
      } else if (p.date?._seconds) {
        dateStr = new Date(p.date._seconds * 1000).toISOString();
      }
      return { ...p, date: dateStr };
    });

    res.json({
      success: true,
      progress: formattedProgress,
      count: formattedProgress.length
    });
  } catch (error) {
    console.error('Error fetching progress:', error);
    res.status(500).json({
      error: 'Failed to fetch progress',
      message: error.message
    });
  }
});

// POST /api/progress/:userId - Save user progress
router.post('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { date, level, practiceType, notes } = req.body;

    // Make level mandatory, but date can be defaulted
    if (level === undefined) {
      return res.status(400).json({ error: 'Level is required' });
    }

    const progressData = {
      date: date || new Date().toISOString(),
      level: parseInt(level),
      practiceType: practiceType || 'reading',
      notes: notes || '',
      userId
    };

    const docRef = await saveUserProgress(userId, progressData);

    res.json({
      success: true,
      id: docRef.id,
      progress: progressData
    });
  } catch (error) {
    console.error('Error saving progress:', error);
    res.status(500).json({
      error: 'Failed to save progress',
      message: error.message
    });
  }
});

// GET /api/progress/:userId/stats - Get user statistics
router.get('/:userId/stats', async (req, res) => {
  try {
    const { userId } = req.params;

    // Fetch user progress and user document stats in parallel
    const [progress, userSnap] = await Promise.all([
      getUserProgress(userId),
      db.collection('users').doc(userId).get()
    ]);

    const userData = userSnap.exists ? userSnap.data() : {};
    const userStats = userData.stats || {};

    // Calculate statistics
    const totalSessions = progress.length;

    // Get distinct active days
    const activeDates = new Set();
    progress.forEach(p => {
      const d = p.date?.toDate ? p.date.toDate() : new Date(p.date);
      activeDates.add(d.toISOString().split('T')[0]);
    });
    const totalDays = activeDates.size;

    const averageLevel = progress.length > 0
      ? progress.reduce((sum, p) => sum + (p.level || 0), 0) / progress.length
      : 0;

    const practiceTypes = {};
    progress.forEach(p => {
      const type = p.practiceType || 'reading';
      practiceTypes[type] = (practiceTypes[type] || 0) + 1;
    });

    // Get current streak (consecutive days with practice)
    let streak = 0;
    // Sort distinct dates descending
    const sortedDates = Array.from(activeDates).sort((a, b) => new Date(b) - new Date(a));

    if (sortedDates.length > 0) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      let lastDate = null;

      for (let i = 0; i < sortedDates.length; i++) {
        const currentDate = new Date(sortedDates[i]);
        currentDate.setHours(0, 0, 0, 0);

        const diff = Math.floor((today - currentDate) / (1000 * 60 * 60 * 24));

        // If first item is not today or yesterday, streak might be broken
        // but traditionally streak includes today's progress.
        // If i=0 and diff > 1, streak is already 0.
        if (i === 0 && diff > 1) break;

        // If consecutive
        if (diff === i || (i > 0 && diff === i)) {
          streak++;
        } else {
          // Allow for starting streak "today" or "yesterday"
          // If we are at i=0 and diff=1 (yesterday), we start streak.
          // If we are at i=0 and diff=0 (today), we start streak.
          break;
        }
      }
    }

    res.json({
      success: true,
      stats: {
        totalSessions,
        totalDays,
        averageLevel: Math.round(averageLevel * 10) / 10,
        currentStreak: streak,
        practiceTypes,
        // Include real user stats from the document
        totalPoints: userStats.totalPoints || 0,
        totalStars: userStats.totalStars || 0,
        lastActivity: userStats.lastActivity,
        uploadCount: userStats.uploadCount || 0
      }
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({
      error: 'Failed to fetch statistics',
      message: error.message
    });
  }
});

export default router;

