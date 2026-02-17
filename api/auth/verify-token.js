import admin from "firebase-admin";

// Standalone Firebase Admin initialization for Vercel Serverless
if (!admin.apps.length) {
    try {
        const projectId = process.env.FIREBASE_PROJECT_ID;
        const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
        const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

        if (projectId && clientEmail && privateKey) {
            admin.initializeApp({
                credential: admin.credential.cert({
                    projectId,
                    clientEmail,
                    privateKey,
                }),
            });
            console.log('✅ Firebase Admin initialized via individual Env Vars');
        } else if (process.env.FIREBASE_SERVICE_ACCOUNT) {
            // Fallback to the JSON string if available
            const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
            admin.initializeApp({
                credential: admin.credential.cert(serviceAccount)
            });
            console.log('✅ Firebase Admin initialized via JSON Env Var');
        }
    } catch (error) {
        console.error('❌ Firebase Admin initialization failed:', error.message);
    }
}

export default async function handler(req, res) {
    // Support both POST (body) and GET (headers) for flexibility
    try {
        const idToken = req.body?.idToken || req.headers.authorization?.split("Bearer ")[1];
        const role = req.body?.role || 'student';
        const name = req.body?.name || '';

        if (!idToken) {
            return res.status(401).json({ error: "No token provided" });
        }

        // Verify the Firebase ID token
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        const uid = decodedToken.uid;
        const email = decodedToken.email;

        // Database interaction (Firestore)
        const db = admin.firestore();
        const userRef = db.collection('users').doc(uid);
        const userDoc = await userRef.get();

        if (!userDoc.exists) {
            await userRef.set({
                email,
                displayName: name || decodedToken.name || '',
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
                name: decodedToken.name || name || '',
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
