import { initializeApp } from 'firebase/app';
import {
    getAuth,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    updateProfile
} from 'firebase/auth';

// Firebase client configuration
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Backend API base URL
const API_BASE = import.meta.env.PROD
    ? '/api'
    : 'http://localhost:3001/api';

/**
 * Sign in an existing user with email and password
 * then verify the token with the backend.
 */
export const loginUser = async (email, password, role) => {
    // 1. Sign in with Firebase Client SDK
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // 2. Get a fresh ID token (force refresh)
    const idToken = await user.getIdToken(true);

    // 3. Verify with backend & sync user data
    const response = await fetch(`${API_BASE}/auth/verify-token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken, role })
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || errorData.error || 'Backend verification failed');
    }

    const data = await response.json();
    return { user, backendUser: data.user };
};

/**
 * Sign up a new user with email and password,
 * then create a user document in the backend.
 */
export const signUpUser = async (email, password, role, name) => {
    // 1. Create user with Firebase Client SDK
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // 2. Update Firebase display name
    await updateProfile(user, { displayName: name });

    // 3. Get a fresh ID token (force refresh)
    const idToken = await user.getIdToken(true);

    // 4. Verify with backend (this will also create the Firestore doc)
    const response = await fetch(`${API_BASE}/auth/verify-token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken, role, name })
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || errorData.error || 'Backend verification failed');
    }

    const data = await response.json();
    return { user, backendUser: data.user };
};

/**
 * Sign out the current user.
 */
export const logoutUser = async () => {
    await signOut(auth);
};

/**
 * Listen for auth state changes.
 */
export const onAuthChange = (callback) => {
    return onAuthStateChanged(auth, callback);
};

export { auth };
export default app;
