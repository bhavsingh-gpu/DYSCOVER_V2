import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const MODEL_FLASH = process.env.GEMINI_MODEL_FLASH || 'gemini-2.0-flash';
const MODEL_PRO = process.env.GEMINI_MODEL_PRO || 'gemini-2.0-pro';
const MAX_TOKENS = parseInt(process.env.AI_MAX_TOKENS) || 2048;
const TIMEOUT_MS = parseInt(process.env.AI_TIMEOUT_MS) || 30000;

if (!GEMINI_API_KEY) {
  console.warn('⚠️  GEMINI_API_KEY not found in environment variables');
}

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// Get model instance
export const getFlashModel = () => {
  return genAI.getGenerativeModel({
    model: MODEL_FLASH,
    generationConfig: {
      maxOutputTokens: MAX_TOKENS,
      temperature: 0.7,
    }
  });
};

export const getProModel = () => {
  return genAI.getGenerativeModel({
    model: MODEL_PRO,
    generationConfig: {
      maxOutputTokens: MAX_TOKENS,
      temperature: 0.7,
    }
  });
};

// Simplify text for dyslexic learners
export const simplifyText = async (text, usePro = false) => {
  if (!GEMINI_API_KEY) {
    throw new Error('Gemini API key not configured');
  }

  const model = usePro ? getProModel() : getFlashModel();

  const prompt = `You are an AI assistant helping dyslexic learners. Simplify and reformat the following text to make it easier to read and understand. 

Guidelines:
- Use shorter sentences
- Break complex ideas into simple steps
- Use clear, simple vocabulary
- Add spacing between syllables where helpful
- Maintain the original meaning
- Keep it friendly and encouraging

Text to simplify:
${text}

Provide only the simplified version without explanations:`;

  try {
    const result = await Promise.race([
      model.generateContent(prompt),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Request timeout')), TIMEOUT_MS)
      )
    ]);

    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Gemini API error:', error);
    throw new Error(`Failed to simplify text: ${error.message}`);
  }
};

// Generate audio-friendly text (for TTS)
export const generateAudioText = async (text) => {
  if (!GEMINI_API_KEY) {
    throw new Error('Gemini API key not configured');
  }

  const model = getFlashModel();

  const prompt = `Convert this text into a format optimized for text-to-speech reading for dyslexic learners. Add natural pauses, emphasize important words, and make it flow naturally when spoken aloud.

Text:
${text}

Provide only the audio-optimized version:`;

  try {
    const result = await Promise.race([
      model.generateContent(prompt),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Request timeout')), TIMEOUT_MS)
      )
    ]);

    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Gemini API error:', error);
    throw new Error(`Failed to generate audio text: ${error.message}`);
  }
};

// Analyze handwriting or uploaded content
export const analyzeContent = async (content, contentType = 'text') => {
  if (!GEMINI_API_KEY) {
    throw new Error('Gemini API key not configured');
  }

  const model = getFlashModel();

  const prompt = `Analyze this ${contentType} content for a dyslexic learner support platform. Provide:
1. Reading difficulty level (1-5, where 1 is easiest)
2. Key concepts identified
3. Suggested simplifications
4. Recommended learning approach

Content:
${content}

Provide a structured analysis:`;

  try {
    const result = await Promise.race([
      model.generateContent(prompt),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Request timeout')), TIMEOUT_MS)
      )
    ]);

    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Gemini API error:', error);
    throw new Error(`Failed to analyze content: ${error.message}`);
  }
};

// In-memory cache to save quota and improve performance
const wordLabCache = new Map();

// Word Lab: Get syllable breakdown and visual mnemonic for a word
export const getWordBreakdown = async (word) => {
  if (!GEMINI_API_KEY) {
    throw new Error('Gemini API key not configured');
  }

  const normalizedWord = word.trim().toUpperCase();

  // 1. Check Cache First (Save Quota!)
  if (wordLabCache.has(normalizedWord)) {
    console.log(`[Word Lab] Cache Hit: "${normalizedWord}"`);
    return wordLabCache.get(normalizedWord);
  }

  // Use ultra-stable model for linguistic tasks
  const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

  const prompt = `You are a linguistic tool. Your ONLY task is to break words into syllables separated by dots.

RULES:
- Word: "${normalizedWord}"
- Output the breakdown in ALL CAPS (e.g., BEAU.TI.FUL).
- Use a period (.) as the ONLY separator.
- Return a JSON object with keys "syllables" and "mnemonic".

EXAMPLES:
- butterfly -> {"syllables": "BUT.TER.FLY", "mnemonic": "A fluttery fly in the butter."}
- education -> {"syllables": "ED.U.CA.TION", "mnemonic": "Edu is at the start of learning."}

Output:`;

  try {
    console.log(`[Word Lab] API Call: "${normalizedWord}" (gemini-flash-latest)`);

    const result = await Promise.race([
      model.generateContent(prompt),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Request timeout')), TIMEOUT_MS)
      )
    ]);

    const response = await result.response;
    const text = response.text();
    console.log(`[Word Lab] AI Response:`, text);

    const jsonMatch = text.match(/\{.*\}/s);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      // Store in cache for future requests
      wordLabCache.set(normalizedWord, parsed);
      return parsed;
    }

    throw new Error("No JSON found in response: " + text.substring(0, 50));
  } catch (error) {
    console.error(`[Word Lab] Error:`, error);
    return {
      syllables: normalizedWord,
      mnemonic: `ERROR: ${error.message.includes('429') ? 'Quota Exceeded. Please try again or use a new key.' : error.message}`
    };
  }
};

// Quiz Generator: Create a 3-question quiz from text
export const generateQuiz = async (text) => {
  if (!GEMINI_API_KEY) {
    throw new Error('Gemini API key not configured');
  }

  const model = getFlashModel();

  const prompt = `You are an educational specialist. Create a 3-question multiple-choice quiz to check comprehension of the following text for a dyslexic student. 
Keep questions simple and direct.

Format your response as a JSON array of objects:
[
  {
    "question": "Simple question?",
    "options": ["Option A", "Option B", "Option C"],
    "correctIndex": 0
  },
  ...
]

Text:
${text}`;

  try {
    const result = await Promise.race([
      model.generateContent(prompt),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Request timeout')), TIMEOUT_MS)
      )
    ]);

    const response = await result.response;
    const responseText = response.text();

    const jsonMatch = responseText.match(/\[.*\]/s);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }

    throw new Error('Failed to generate valid quiz format');
  } catch (error) {
    console.error('Gemini Quiz error:', error);
    throw new Error(`Failed to generate quiz: ${error.message}`);
  }
};

