# DYSCOVER Backend API

Backend server for DYSCOVER - AI-powered dyslexia support platform using Node.js, Gemini 2.5 Flash, and Firebase/Firestore.

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Set Up Environment Variables

1. Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

2. Fill in your environment variables:
   - **GEMINI_API_KEY**: Get from [Google AI Studio](https://aistudio.google.com/)
   - **FIREBASE_SERVICE_ACCOUNT**: Copy the full JSON from `FIREBASE_KEY_DYSCOVER.json` as a single-line string

### 3. Start the Server

**Development:**
```bash
npm run dev
```

**Production:**
```bash
npm start
```

Server will run on `http://localhost:3000`

## 📁 Project Structure

```
backend/
├── server.js              # Main Express server
├── routes/                 # API route handlers
│   ├── ai.js              # AI/Gemini endpoints
│   ├── auth.js            # Authentication endpoints
│   ├── upload.js          # File upload endpoints
│   └── progress.js        # Progress tracking endpoints
├── services/               # Service modules
│   ├── firebase.js        # Firebase Admin SDK
│   └── gemini.js          # Gemini AI SDK
├── .env                   # Environment variables (not in git)
└── package.json           # Dependencies
```

## 🔌 API Endpoints

### AI Endpoints

- `POST /api/ai/simplify` - Simplify text for dyslexic learners
- `POST /api/ai/audio-text` - Generate audio-optimized text
- `POST /api/ai/analyze` - Analyze content difficulty

### Auth Endpoints

- `POST /api/auth/verify-token` - Verify Firebase ID token
- `GET /api/auth/user/:uid` - Get user profile
- `PUT /api/auth/user/:uid` - Update user profile

### Progress Endpoints

- `GET /api/progress/:userId` - Get user progress
- `POST /api/progress/:userId` - Save user progress
- `GET /api/progress/:userId/stats` - Get user statistics

### Upload Endpoints

- `POST /api/upload/process` - Process uploaded content

## 🔒 Security Notes

- ✅ Never commit `.env` file
- ✅ Never expose API keys in frontend
- ✅ All AI requests go through backend
- ✅ Rate limiting enabled on AI endpoints
- ✅ CORS configured for frontend origin only

## 📝 Environment Variables

See `.env.example` for all required variables.

## 🛠️ Technologies

- **Node.js** - Runtime
- **Express** - Web framework
- **Gemini 2.5 Flash** - AI text simplification
- **Firebase Admin SDK** - Database & authentication
- **Firestore** - NoSQL database

## 📚 Documentation

See `README_BACK_END.txt` in the root directory for detailed architecture and setup instructions.

