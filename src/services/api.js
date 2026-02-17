// Frontend API service for DYSCOVER backend
const API_BASE = import.meta.env.PROD
    ? '/api'
    : 'http://localhost:3001/api';

/**
 * Get the current user from localStorage
 */
const getCurrentUser = () => {
    try {
        const userData = localStorage.getItem('dyscover_user');
        return userData ? JSON.parse(userData) : null;
    } catch {
        return null;
    }
};

/**
 * Simplify text for dyslexic learners using Gemini AI
 * @param {string} text - The text to simplify
 * @param {boolean} usePro - Whether to use the Pro model (default: false = Flash)
 */
export const simplifyText = async (text, usePro = false) => {
    const user = getCurrentUser();

    const response = await fetch(`${API_BASE}/ai/simplify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            text,
            usePro,
            userId: user?.uid || null
        })
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || errorData.error || 'Failed to simplify text');
    }

    return response.json();
};

/**
 * Generate audio-optimized text using Gemini AI
 * @param {string} text - The text to optimize for audio
 */
export const getAudioText = async (text) => {
    const response = await fetch(`${API_BASE}/ai/audio-text`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || errorData.error || 'Failed to generate audio text');
    }

    return response.json();
};

/**
 * Analyze content for difficulty and suggestions using Gemini AI
 * @param {string} content - The content to analyze
 * @param {string} contentType - Type of content (default: 'text')
 */
export const analyzeContent = async (content, contentType = 'text') => {
    const user = getCurrentUser();

    const response = await fetch(`${API_BASE}/ai/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            content,
            contentType,
            userId: user?.uid || null
        })
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || errorData.error || 'Failed to analyze content');
    }

    return response.json();
};

/**
 * Process uploaded content (text or image) using Gemini AI
 * @param {string} content - The content (text or base64 data)
 * @param {string} contentType - Type of content ('text', 'image', 'handwriting')
 * @param {object} metadata - Optional metadata
 */
export const processUpload = async (content, contentType = 'text', metadata = {}) => {
    const user = getCurrentUser();

    const response = await fetch(`${API_BASE}/upload/process`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            content,
            contentType,
            metadata,
            userId: user?.uid || null
        })
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || errorData.error || 'Failed to process upload');
    }

    return response.json();
};

/**
 * Get syllable breakdown and mnemonics for a specific word
 * @param {string} word - The word to analyze
 */
export const getWordLabData = async (word) => {
    const response = await fetch(`${API_BASE}/ai/word-lab`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ word })
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || errorData.error || 'Failed to get word lab data');
    }

    return response.json();
};

/**
 * Generate a comprehension quiz for the text
 * @param {string} text - The text to quiz on
 */
export const generateQuiz = async (text) => {
    const response = await fetch(`${API_BASE}/ai/generate-quiz`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || errorData.error || 'Failed to generate quiz');
    }

    return response.json();
};

/**
 * Get user progress records
 * @param {string} userId - User ID
 */
export const getUserProgress = async (userId) => {
    const response = await fetch(`${API_BASE}/progress/${userId}`);
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || errorData.error || 'Failed to fetch progress');
    }
    return response.json();
};

/**
 * Get user statistics
 * @param {string} userId - User ID
 */
export const getUserStats = async (userId) => {
    const response = await fetch(`${API_BASE}/progress/${userId}/stats`);
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || errorData.error || 'Failed to fetch statistics');
    }
    return response.json();
};

/**
 * Save user progress
 * @param {object} progressData - Progress info
 */
export const saveUserProgress = async (progressData) => {
    const user = getCurrentUser();
    const response = await fetch(`${API_BASE}/progress/${user?.uid}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(progressData)
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || errorData.error || 'Failed to save progress');
    }
    return response.json();
};

export { getCurrentUser };
