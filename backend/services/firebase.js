import admin from 'firebase-admin';
import dotenv from 'dotenv';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  try {
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

    if (projectId && clientEmail && privateKey) {
      admin.initializeApp({
        credential: admin.credential.cert({ projectId, clientEmail, privateKey })
      });
      console.log('✅ Firebase Admin initialized via individual Env Vars (Backend Service)');
    } else {
      // Fallback: This will still look for the JSON file or JSON env var for local dev
      let serviceAccount;
      if (process.env.FIREBASE_SERVICE_ACCOUNT) {
        serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
      } else {
        const keyPath = join(__dirname, '..', 'FIREBASE_KEY_DYSCOVER.json');
        serviceAccount = JSON.parse(readFileSync(keyPath, 'utf8'));
      }

      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
      });
    }
  } catch (error) {
    console.error('❌ Firebase initialization failed:', error.message);
  }
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

