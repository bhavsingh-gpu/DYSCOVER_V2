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
