import admin from "firebase-admin";

// Standalone Firebase Admin initialization as per user guide
if (!admin.apps.length) {
    try {
        const projectId = process.env.FIREBASE_PROJECT_ID;
        const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
        const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

        if (!projectId || !clientEmail || !privateKey) {
            console.error('❌ CRITICAL: Missing Firebase Env Vars in Vercel Dashboard!');
        } else {
            admin.initializeApp({
                credential: admin.credential.cert({
                    projectId: projectId,
                    clientEmail: clientEmail,
                    privateKey: privateKey,
                }),
            });
            console.log('✅ Firebase Admin initialized via individual Env Vars');
        }
    } catch (error) {
        console.error('❌ Firebase Admin initialization failed:', error.message);
    }
}

export default async function handler(req, res) {
    try {
        // 1. Get token from header (Standard) or body (Fallback)
        const authHeader = req.headers.authorization;
        const token = authHeader?.startsWith('Bearer ')
            ? authHeader.split('Bearer ')[1]
            : req.body?.idToken;

        if (!token) {
            return res.status(401).json({ error: "No token provided" });
        }

        // 2. Verify with Firebase
        const decoded = await admin.auth().verifyIdToken(token);
        const uid = decoded.uid;
        const email = decoded.email;

        // 3. Sync with Firestore (Reuse standard singleton)
        const db = admin.firestore();
        const userRef = db.collection('users').doc(uid);
        const userDoc = await userRef.get();

        const role = req.body?.role || 'student';
        const name = req.body?.name || '';

        if (!userDoc.exists) {
            await userRef.set({
                email,
                displayName: name || decoded.name || '',
                role: role,
                createdAt: new Date().toISOString(),
                lastLogin: new Date().toISOString()
            });
        } else {
            await userRef.update({
                lastLogin: new Date().toISOString()
            });
        }

        const finalRole = userDoc.exists ? userDoc.data().role : role;

        return res.status(200).json({
            success: true,
            user: {
                uid,
                email,
                name: decoded.name || name || '',
                role: finalRole
            }
        });

    } catch (err) {
        console.error('Auth handler error:', err);
        return res.status(500).json({
            error: "Authentication failed",
            message: err.message,
            code: err.code
        });
    }
}
