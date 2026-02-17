import {
  getFlashModel,
  getProModel,
  getUploadModel,
  callGeminiAI
} from './aiClient.js';
import { orchestrateAnalysis } from './correctionEngine.js';

export { callGeminiAI };

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
