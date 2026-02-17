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
  admin.app();
} catch {
  try {
    let serviceAccount;
    // Priority 1: Individual Env Vars (Recommended for Vercel)
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

    if (projectId && clientEmail && privateKey) {
      serviceAccount = { projectId, clientEmail, privateKey };
      console.log('✅ Using Firebase service account from individual Env Vars');
    }
    // Priority 2: Full JSON string from Env Var
    else if (process.env.FIREBASE_SERVICE_ACCOUNT) {
      try {
        serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
        console.log('✅ Using Firebase service account from JSON Env Var');
      } catch (parseError) {
        console.warn('⚠️  Failed to parse FIREBASE_SERVICE_ACCOUNT from env');
      }
    }
    // Priority 3: JSON File (Local Dev Only)
    else {
      try {
        const keyPath = join(__dirname, '..', 'FIREBASE_KEY_DYSCOVER.json');
        const keyFile = readFileSync(keyPath, 'utf8');
        serviceAccount = JSON.parse(keyFile);
        console.log('✅ Using Firebase service account from JSON file');
      } catch (fileError) {
        // Fallback for local development if no file exists
      }
    }

    if (serviceAccount) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
      });
      console.log('✅ Firebase Admin SDK initialized successfully');
    } else {
      console.error('❌ Firebase service account missing. Some features will fail.');
    }
  } catch (error) {
    console.error('❌ Firebase initialization crashed:', error.message);
    // Do not re-throw here so the server can still boot and serve other routes
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

