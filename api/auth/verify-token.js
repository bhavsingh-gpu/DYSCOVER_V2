import admin from "../../lib/firebaseAdmin";

export default async function handler(req, res) {
    try {
        const token = req.headers.authorization?.split("Bearer ")[1];

        if (!token) {
            return res.status(401).json({ error: "No token provided" });
        }

        const decoded = await admin.auth().verifyIdToken(token);

        return res.status(200).json({ user: decoded });

    } catch (err) {
        return res.status(401).json({ error: err.message });
    }
}
