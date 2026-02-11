# DysCover AI – AI-Powered Dyslexia Screener & Adaptive Reading Coach

**Tagline:** Spot dyslexia early and unlock inclusive learning — one upload at a time.

DysCover AI is an inclusive edutech web app that helps detect early signs of dyslexia (via handwriting analysis) and provides adaptive reading support to bypass phonological decoding struggles. Built for teachers, parents, and students in India where millions remain undiagnosed.

## Problem
Dyslexia affects ~10-15% of students (millions in India), causing difficulties with accurate/fluency word reading due to phonological processing deficits. Undiagnosed cases lead to frustration, low confidence, and higher dropout risks. Traditional tools are expensive or inaccessible; teachers lack quick screening + adaptation aids.

## Solution
- **Quick Dyslexia Screener**: Upload handwriting photo/sample → Gemini Vision analyzes markers (reversals, spacing, slant) + confidence score.
- **Adaptive Reading Coach**: Upload notes/text/PDF → AI simplifies content, highlights syllables, offers paced TTS, and uses mini-quizzes to dynamically adapt (e.g., more audio if quiz scores low).
- **Accessible & Personalized**: Onboarding profile + real-time progress tracking for equity.

## Key Features
- Handwriting/photo upload for dyslexia indicators detection
- Text simplification + syllable highlighting + OpenDyslexic font
- Text-to-Speech (paced, adjustable) via Gemini or browser API
- Post-session mini comprehension quiz → adaptive difficulty
- Basic dashboard: Progress stats + teacher suggestions
- WCAG basics: High contrast, keyboard nav, ARIA labels

## Tech Stack
- **Frontend**: React 18 + Vite (fast dev/build) + Tailwind CSS (rapid accessible styling)
- **Backend/AI**: Google Gemini API (Gemini 1.5 Flash/Pro for vision/text summarization/TTS generation)
- **Database & Auth/Storage**: Firebase (Firestore for user profiles/progress, Firebase Storage for uploads, Authentication for teacher/student logins)
- **Other**:
  - Web Speech API (browser TTS fallback for speed/offline hints)
  - pdf.js or Tesseract.js (if needed for PDF text extraction)
  - React Hook Form + Zod (form validation)
- **Deployment**: Firebase Hosting (free tier sufficient for demo)

## Setup & Run Locally
1. Clone repo: `git clone <your-repo>`
2. Install deps: `npm install`
3. Add `.env` with `VITE_GEMINI_API_KEY=your-key`
4. Run: `npm run dev`
5. Deploy: `firebase deploy` (after `firebase init hosting`)

## Why This Wins
- Focused on India's biggest under-resourced accessibility gap (dyslexia > sensory impairments in prevalence)
- Demo magic: Before/after reading + detection confidence score
- Built on proven winner patterns (e.g., Dyscover at Wharton 2025: handwriting ML + support)
- Feasible in hackathon time with Gemini + Firebase

## Future Scope
- Full ML model fine-tuning (Teachable Machine export)
- Voice input for reading practice
- Mobile app (React Native + Firebase)

Made with ❤️ for AISSMS Hackathon – Accessible Edutech domain.