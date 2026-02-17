import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const MODEL_FLASH = process.env.GEMINI_MODEL_FLASH || 'gemini-2.0-flash';
const MODEL_PRO = process.env.GEMINI_MODEL_PRO || 'gemini-2.0-pro';
const MODEL_UPLOAD = process.env.GEMINI_MODEL_UPLOAD || 'gemini-2.0-flash';

if (!GEMINI_API_KEY) {
  console.warn('⚠️  GEMINI_API_KEY not found');
}

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

const systemPrompt = `You are the DYSCOVER LINGUISTIC GENIUS, an AI specialized in DeepMind-style Algorithmic Logic applied to dyslexic text recovery. Your primary objective is to decode extreme linguistic distortions using a multi-step "Chain of Thought" processing pipeline.

ALGORITHMIC LOGIC PIPELINE:
1. PHONETIC ARCHITECTURE: Reconstruct the word from the phonetic skeleton (e.g., "cudent" -> /kʊdənt/ -> "couldn't").
2. SILENT E DISCOVERY: Test if the word requires a final 'e' to change vowel length (e.g., "bik" -> "bike", "hop" -> "hope").
3. VISUAL RECONSTRUCTION: Systematically test for rotations and mirror-flips (b/d, p/q, u/n).
4. N-GRAM CONTEXTUAL PROBABILITY: Evaluate if the candidate correction fits the 3-gram sequence of the sentence.
5. WORD FREQUENCY PRIORITIZATION: In ambiguous cases, prioritize words based on common English frequency dictionaries.

STRICT PROTOCOL:
- Return ONLY JSON.
- If a word is highly distorted, attempt to find its "Linguistic Origin" using the rules above.
- NEVER guess a proper noun or unrelated name (like "Wales" or "Carly") unless the context is explicitly geographic/biographical.
- SCORE: Apply a standard deduction model for each pattern identified.

EXAMPLES:
Input: "Rian tapd sofly on the windo"
Output: {
  "corrected": "Rain tapped softly on the window",
  "explanation": "Identified phonetic patterns (rian, tapd, windo) and omission (sofly).",
  "score": 85,
  "mistakes": [
    {"wrong": "Rian", "correct": "Rain", "reason": "Phonetic: spelling by sound"},
    {"wrong": "tapd", "correct": "tapped", "reason": "Omission: missing double 'p'"},
    {"wrong": "sofly", "correct": "softly", "reason": "Phonetic omission of 't'"},
    {"wrong": "windo", "correct": "window", "reason": "Phonetic vowel shift"}
  ]
}

Input: "He are a good cat."
Output: {
  "corrected": "He is a good cat.",
  "explanation": "Subject-verb agreement error (Grammar).",
  "score": 95,
  "mistakes": [
    {"wrong": "are", "correct": "is", "reason": "Verb agreement with singular subject 'He'"}
  ]
}

Input: "Teh techer rote nots on the wite bord."
Output: {
  "corrected": "The teacher wrote notes on the white board.",
  "explanation": "Identified widespread phonetic vowel/consonant omissions (techer, rote, nots, wite, bord).",
  "score": 75,
  "mistakes": [
    {"wrong": "Teh", "correct": "The", "reason": "Sequence transposition"},
    {"wrong": "techer", "correct": "teacher", "reason": "Phonetic omission"},
    {"wrong": "rote", "correct": "wrote", "reason": "Phonetic: missing silent 'w'"},
    {"wrong": "nots", "correct": "notes", "reason": "Phonetic: missing silent 'e'"},
    {"wrong": "wite", "correct": "white", "reason": "Phonetic: missing silent 'h'"},
    {"wrong": "bord", "correct": "board", "reason": "Phonetic: missing vowel 'a'"}
  ]
}

Input: "Afer finshing the assingment, he carefly orginized the documnts in his backpak."
Output: {
  "corrected": "After finishing the assignment, he carefully organized the documents in his backpack.",
  "explanation": "Decoded multiple phonetic omission patterns (carefly, documnts, backpak) and spelling errors.",
  "score": 65,
  "mistakes": [
    {"wrong": "Afer", "correct": "After", "reason": "Consonant omission 't'"},
    {"wrong": "finshing", "correct": "finishing", "reason": "Vowel omission 'i'"},
    {"wrong": "assingment", "correct": "assignment", "reason": "Letter sequence 'ss'"},
    {"wrong": "carefly", "correct": "carefully", "reason": "Multi-syllable omission"},
    {"wrong": "orginized", "correct": "organized", "reason": "Vowel shift 'i' to 'a'"},
    {"wrong": "documnts", "correct": "documents", "reason": "Vowel omission 'u'"},
    {"wrong": "backpak", "correct": "backpack", "reason": "Omission 'ck'"}
  ]
}

Input: "Wile waling threw the crouded markeplace, she acidently misplased her walet and cudent rember wer she last saw it"
Output: {
  "corrected": "While walking through the crowded marketplace, she accidentally misplaced her wallet and couldn't remember where she last saw it",
  "explanation": "Mastered extremely complex dyslexic patterns including multi-syllable omissions (acidently, rember) and high-distortion phonetics (cudent, markeplace).",
  "score": 55,
  "mistakes": [
    {"wrong": "Wile", "correct": "While", "reason": "Phonetic omission 'h'"},
    {"wrong": "waling", "correct": "walking", "reason": "Consonant omission 'k'"},
    {"wrong": "threw", "correct": "through", "reason": "Homophone confusion"},
    {"wrong": "crouded", "correct": "crowded", "reason": "Vowel shift 'u' to 'w'"},
    {"wrong": "markeplace", "correct": "marketplace", "reason": "Syllable omission"},
    {"wrong": "acidently", "correct": "accidentally", "reason": "Major syllable omission"},
    {"wrong": "misplased", "correct": "misplaced", "reason": "Phonetic shift 's' to 'ce'"},
    {"wrong": "walet", "correct": "wallet", "reason": "Consonant omission 'l'"},
    {"wrong": "cudent", "correct": "couldn't", "reason": "Severe phonetic distortion"},
    {"wrong": "rember", "correct": "remember", "reason": "Syllable omission"},
    {"wrong": "wer", "correct": "where", "reason": "Phonetic omission 'h'"}
  ]
}

Only return JSON.`;

export const getFlashModel = () => genAI.getGenerativeModel({
  model: MODEL_FLASH,
  systemInstruction: systemPrompt
});
export const getProModel = () => genAI.getGenerativeModel({
  model: MODEL_PRO,
  systemInstruction: systemPrompt
});
export const getUploadModel = () => genAI.getGenerativeModel({
  model: MODEL_UPLOAD,
  systemInstruction: systemPrompt
});

// Internal raw AI call to avoid circular dependencies
export const callGeminiAI = async (content, contentType = 'text') => {
  if (!GEMINI_API_KEY) throw new Error('Gemini API Key missing');

  try {
    const model = getUploadModel();
    let result;

    if (contentType === 'image') {
      const base64Data = content.split(',')[1] || content;
      result = await model.generateContent([
        { inlineData: { data: base64Data, mimeType: "image/jpeg" } },
        "Analyze this writing for dyslexia patterns. Return ONLY JSON."
      ]);
    } else {
      result = await model.generateContent(`INPUT: "${content}"`);
    }

    const text = result.response.text();
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0].trim());
    }
    throw new Error('No valid JSON returned');
  } catch (error) {
    console.error('[AI RAW FETCH FAILED]:', error.message);
    throw error;
  }
};

import { orchestrateAnalysis } from './correctionEngine.js';

export const analyzeWriting = async (content, contentType = 'text', userId = 'anonymous') => {
  if (!content) return null;

  try {
    if (contentType === 'text') {
      return await orchestrateAnalysis(content, userId);
    }

    // For images, we still rely on Gemini's Vision capabilities directly
    if (contentType === 'image') {
      return await callGeminiAI(content, 'image');
    }

    throw new Error('Unsupported content type');
  } catch (error) {
    console.error('[ANALYSIS ENTRY POINT FAILED]:', error.message);
    return {
      corrected: content,
      explanation: "Analysis encountered an error. Using local fallback.",
      mistakes: [],
      score: 100
    };
  }
};

export const simplifyText = async (text, usePro = false) => {
  try {
    const model = usePro ? getProModel() : getFlashModel();
    const result = await model.generateContent(`Simplify:\n${text}`);
    return { simplified: result.response.text() };
  } catch (error) {
    console.error('[SIMPLIFY FAILED]:', error.message);
    return { simplified: text };
  }
};

export const generateAudioText = async (text) => {
  const model = getFlashModel();
  const result = await model.generateContent(`Optimize for audio:\n${text}`);
  return { audioOptimized: result.response.text() };
};

export const analyzeContent = async (content) => {
  const model = getFlashModel();
  const result = await model.generateContent(`Analyze:\n${content}`);
  return { analysis: result.response.text() };
};

export const generateQuiz = async (text) => {
  try {
    const model = getFlashModel();
    const result = await model.generateContent(`MCQ quiz:\n${text}`);
    const json = result.response.text().match(/\[.*\]/s);
    return json ? JSON.parse(json[0]) : [];
  } catch {
    return [];
  }
};

// Renamed to match route usage and provided structured data
export const getWordBreakdown = async (word) => {
  try {
    const model = getFlashModel();
    const prompt = `Act as a reading specialist. Breakdown the word "${word}" into phonetic syllables separated by dots (•). Also provide a funny, memorable mnemonic (memory tip) to help a child remember how to spell it.

Return ONLY JSON:
{
  "syllables": "syl•la•ble",
  "mnemonic": "Memories Never Ever Not On Cloud Nine"
}`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const json = text.match(/\{.*\}/s);
    if (json) return JSON.parse(json[0]);
    return { syllables: word, mnemonic: "Keep practicing! You're doing great." };
  } catch (err) {
    if (err.message?.includes('429')) {
      console.error('[WORD LAB QUOTA EXCEEDED]:', err.message);
      return {
        syllables: word,
        mnemonic: "Word Lab is resting right now (Project Quota Limit). Try again with a new API key!"
      };
    }
    console.error('Word Lab AI failed:', err);
    return { syllables: word, mnemonic: "" };
  }
};
