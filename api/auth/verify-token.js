import admin from "firebase-admin";

// Safe initialization pattern for Serverless
try {
    admin.app();
} catch {
    admin.initializeApp({
        credential: admin.credential.cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
        }),
    });
}

export default async function handler(req, res) {
    try {
        // 1. Extract token from header or body
        const token = req.headers.authorization?.split("Bearer ")[1] || req.body?.idToken;
        const role = req.body?.role || 'student';
        const name = req.body?.name || '';

        if (!token) {
            return res.status(401).json({ error: "No token provided" });
        }

        // 2. Verify with Firebase
        const decoded = await admin.auth().verifyIdToken(token);
        const uid = decoded.uid;
        const email = decoded.email;

        // 3. Sync with Firestore
        const db = admin.firestore();
        const userRef = db.collection('users').doc(uid);
        const userDoc = await userRef.get();

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
        return res.status(401).json({
            error: "Authentication failed",
            message: err.message,
        });
    }
}
