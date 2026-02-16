import express from 'express';
import { auth, db } from '../services/firebase.js';

const router = express.Router();

// POST /api/auth/verify-token - Verify Firebase ID token
router.post('/verify-token', async (req, res) => {
  try {
    const { idToken, role } = req.body;

    if (!idToken) {
      return res.status(400).json({ error: 'ID token is required' });
    }

    // Verify the Firebase ID token
    const decodedToken = await auth.verifyIdToken(idToken);

    // Get or create user document in Firestore
    const userRef = db.collection('users').doc(decodedToken.uid);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      // Create new user document
      await userRef.set({
        email: decodedToken.email,
        displayName: decodedToken.name || '',
        role: role || 'student', // use provided role or default to student
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString()
      });
    } else {
      // Update last login
      await userRef.update({
        lastLogin: new Date().toISOString()
      });
    }

    res.json({
      success: true,
      user: {
        uid: decodedToken.uid,
        email: decodedToken.email,
        name: decodedToken.name || '',
        ...(userDoc.exists && { role: userDoc.data().role })
      }
    });
  } catch (error) {
    console.error('Error verifying token:', error);
    res.status(401).json({
      error: 'Invalid or expired token',
      message: error.message
    });
  }
});

// GET /api/auth/user/:uid - Get user profile
router.get('/user/:uid', async (req, res) => {
  try {
    const { uid } = req.params;
    const userDoc = await db.collection('users').doc(uid).get();

    if (!userDoc.exists) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      success: true,
      user: {
        uid,
        ...userDoc.data()
      }
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({
      error: 'Failed to fetch user',
      message: error.message
    });
  }
});

// PUT /api/auth/user/:uid - Update user profile
router.put('/user/:uid', async (req, res) => {
  try {
    const { uid } = req.params;
    const { displayName, role, preferences } = req.body;

    const updateData = {
      updatedAt: new Date().toISOString()
    };

    if (displayName) updateData.displayName = displayName;
    if (role) updateData.role = role;
    if (preferences) updateData.preferences = preferences;

    await db.collection('users').doc(uid).update(updateData);

    res.json({
      success: true,
      message: 'User profile updated'
    });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({
      error: 'Failed to update user',
      message: error.message
    });
  }
});

export default router;

