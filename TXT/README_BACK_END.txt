README_BACK_END

AI Assisted Dyslexia Platform – Backend Documentation Node.js + Gemini
SDK + Firebase/Firestore

================================ SECTION 1 — WHAT YOU MUST CREATE
MANUALLY ================================

Before coding, you MUST manually create:

1.  Google Gemini API Key
2.  Firebase Project
3.  Firebase Admin Service Account Key
4.  .env file

  --------------------------------
  A. Generate Gemini API Key
  --------------------------------
  Steps:

  1. Go to:
  https://aistudio.google.com/ 2.
  Sign in with Google 3. Click
  “Get API key” 4. Create new key
  5. Copy it

  You will get:
  GEMINI_KEY=AIzaSyXXXXXX
  --------------------------------

B. Create Firebase Project

Steps:

1.  Go to: https://console.firebase.google.com/
2.  Click “Add project”
3.  Give name (example: dyslexia-ai)
4.  Enable Firestore Database
5.  Enable Authentication (Email/Google login)

  --------------------------------
  C. Generate Firebase Admin Key
  (IMPORTANT)
  --------------------------------
  Steps:

  1. Firebase Console → Project
  Settings 2. Service Accounts tab
  3. Click “Generate new private
  key” 4. Download JSON file

  This is your backend secret key.
  NEVER upload to GitHub.
  --------------------------------

D. Create .env file

Example:

GEMINI_KEY=your_key_here FIREBASE_KEY={“type”:“service_account”, … full
json …}

================================ SECTION 2 — ARCHITECTURE
================================

Recommended structure:

React Frontend ↓ Node/Express Backend ↓ Gemini SDK + Firestore

Flow:

User → Frontend → Backend → Gemini → Firestore → Backend → Frontend

Frontend NEVER calls Gemini directly.

================================ SECTION 3 — PROJECT SETUP
================================

Step 1 — Create backend

npm init -y

Step 2 — Install packages

npm install express dotenv @google/generative-ai firebase-admin cors

Step 3 — Folder structure

backend/ │ ├─ server.js ├─ routes/ │ └─ ai.js ├─ services/ │ ├─
gemini.js │ └─ firebase.js ├─ .env └─ README_BACK_END.txt

================================ SECTION 4 — BASIC CODE
================================

server.js

  --------------------------------
  import express from “express”;
  import cors from “cors”; import
  dotenv from “dotenv”; import
  aiRoutes from “./routes/ai.js”;

  dotenv.config();

  const app = express();
  app.use(cors());
  app.use(express.json());

  app.use(“/api”, aiRoutes);

  app.listen(3000, () =>
  console.log(“Server running”));
  --------------------------------

services/firebase.js

  -------------------------------------------------------------
  import admin from “firebase-admin”;

  admin.initializeApp({ credential:
  admin.credential.cert(JSON.parse(process.env.FIREBASE_KEY))
  });

  export const db = admin.firestore();
  -------------------------------------------------------------

services/gemini.js

  ---------------------------------------------
  import { GoogleGenerativeAI } from
  “@google/generative-ai”;

  const genAI = new
  GoogleGenerativeAI(process.env.GEMINI_KEY);

  export const model =
  genAI.getGenerativeModel({ model:
  “gemini-2.0-flash” });
  ---------------------------------------------

routes/ai.js

  ------------------------------------------------
  import express from “express”; import { model }
  from “../services/gemini.js”; import { db } from
  “../services/firebase.js”;

  const router = express.Router();

  router.post(“/simplify”, async (req, res) => {
  const { text, userId } = req.body;

  const result = await model.generateContent(
  Simplify this for a dyslexic learner:\n${text}
  );

  const output = result.response.text();

  await db.collection(“history”).add({ userId,
  input: text, output, createdAt: new Date() });

  res.json({ output }); });

  export default router;
  ------------------------------------------------

================================ SECTION 5 — WORKFLOW
================================

1.  User enters text
2.  React sends POST /api/simplify
3.  Backend calls Gemini
4.  Gemini returns simplified text
5.  Backend stores in Firestore
6.  Backend sends response to frontend

================================ SECTION 6 — SECURITY RULES (VERY
IMPORTANT) ================================

NEVER: ✘ Put API keys in frontend ✘ Commit .env ✘ Call Gemini directly
from React

ALWAYS: ✔ Use backend proxy ✔ Rate limit requests ✔ Validate input ✔
Store keys in .env ✔ Add .gitignore for secrets

================================ SECTION 7 — FUTURE FEATURES
================================

You can add:

• model switching (flash vs pro) • caching responses • speech synthesis
• progress tracking • analytics • rate limiting • logging

================================ END ================================
