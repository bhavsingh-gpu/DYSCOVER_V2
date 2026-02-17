import Typo from 'typo-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Paths to Hunspell dictionaries
const affPath = path.join(__dirname, '../dictionaries/en_US.aff');
const dicPath = path.join(__dirname, '../dictionaries/en_US.dic');

// Initialize Typo.js
let dictionary = null;
try {
    if (fs.existsSync(affPath) && fs.existsSync(dicPath)) {
        const affData = fs.readFileSync(affPath, 'utf8');
        const dicData = fs.readFileSync(dicPath, 'utf8');
        dictionary = new Typo('en_US', affData, dicData);
        console.log('[SpellCheck] Hunspell (en_US) engine loaded.');
    } else {
        console.warn('[SpellCheck] Dictionaries not found at:', affPath);
    }
} catch (err) {
    console.error('[SpellCheck] Initialization failed:', err.message);
}

// Custom words to ignore (e.g., brand names or specific terms)
const CUSTOM_WORDS = new Set(['dyscover', 'magicbento', 'handwriting', 'dyslexia']);

/**
 * Checks if a string has likely spelling errors using Hunspell engine.
 * @param {string} text 
 * @returns {Object} { hasErrors: boolean, errorCount: number }
 */
export const checkTextLocally = (text) => {
    if (!text || typeof text !== 'string') return { hasErrors: false, errorCount: 0 };
    if (!dictionary) return { hasErrors: true, errorCount: 1, note: 'Safe fallback: engine offline' };

    // Normalize: remove punctuation and split
    const cleanText = text.replace(/[.,/#!$%^&*;:{}=\-_`~()"]/g, " ");
    const words = cleanText.split(/\s+/).filter(w => w.length > 0);

    let errorCount = 0;
    const unrecognizedWords = [];

    for (const word of words) {
        // Skip numbers and very short words
        if (!isNaN(word) || word.length <= 1) continue;

        const normalizedWord = word.toLowerCase();

        // Check if word exists in Hunspell or CUSTOM list
        const isCorrect = dictionary.check(word) || dictionary.check(normalizedWord) || CUSTOM_WORDS.has(normalizedWord);

        if (!isCorrect) {
            errorCount++;
            unrecognizedWords.push(word);
        }
    }

    // Threshold: Any unrecognized word triggers Gemini for deep dyslexia analysis
    const hasErrors = errorCount > 0;

    return {
        hasErrors,
        errorCount,
        unrecognizedWords: unrecognizedWords.slice(0, 50)
    };
};
