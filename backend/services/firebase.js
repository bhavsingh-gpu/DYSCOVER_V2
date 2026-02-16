import admin from 'firebase-admin';
import dotenv from 'dotenv';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Initialize Firebase Admin SDK
try {
  let serviceAccount;

  // Try to parse from environment variable first
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    try {
      serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
      console.log('✅ Using Firebase service account from environment variable');
    } catch (parseError) {
      console.warn('⚠️  Failed to parse FIREBASE_SERVICE_ACCOUNT from env, trying JSON file...');
      throw parseError;
    }
  } else {
    // Fallback: read from JSON file
    try {
      const keyPath = join(__dirname, '..', 'FIREBASE_KEY_DYSCOVER.json');
      const keyFile = readFileSync(keyPath, 'utf8');
      serviceAccount = JSON.parse(keyFile);
      console.log('✅ Using Firebase service account from JSON file');
    } catch (fileError) {
      throw new Error('Firebase service account not found. Please set FIREBASE_SERVICE_ACCOUNT in .env or provide FIREBASE_KEY_DYSCOVER.json');
    }
  }

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });

  console.log('✅ Firebase Admin SDK initialized successfully');
} catch (error) {
  console.error('❌ Firebase initialization failed:', error.message);
  throw error;
}

export const db = admin.firestore();
export const auth = admin.auth();

// Helper functions for Firestore operations
export const getUserProgress = async (userId) => {
  try {
    const progressRef = db.collection('users').doc(userId).collection('progress');
    const snapshot = await progressRef.orderBy('date', 'desc').limit(1000).get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error fetching user progress:', error);
    throw error;
  }
};

export const saveUserProgress = async (userId, progressData) => {
  try {
    const progressRef = db.collection('users').doc(userId).collection('progress');
    return await progressRef.add({
      ...progressData,
      date: admin.firestore.FieldValue.serverTimestamp(),
      createdAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error saving user progress:', error);
    throw error;
  }
};

export const saveSimplifiedText = async (userId, originalText, simplifiedText, metadata = {}) => {
  try {
    const historyRef = db.collection('users').doc(userId).collection('history');
    return await historyRef.add({
      originalText,
      simplifiedText,
      metadata,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error saving simplified text:', error);
    throw error;
  }
};

