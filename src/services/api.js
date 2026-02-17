// Frontend API service for DYSCOVER backend
const API_BASE = (import.meta.env.PROD || window.location.hostname !== 'localhost')
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

const handleResponse = async (response, context) => {
    if (!response.ok) {
        const errorText = await response.text();
        console.error(`${context} failed:`, errorText);
        let errorData;
        try {
            errorData = JSON.parse(errorText);
        } catch (e) {
            throw new Error(`Server error (${response.status}) at ${context}: ${errorText.substring(0, 50)}...`);
        }
        throw new Error(errorData.message || errorData.error || `${context} failed`);
    }
    return response.json();
};

/**
 * Simplify text for dyslexic learners using Gemini AI
 */
export const simplifyText = async (text, usePro = false) => {
    const user = getCurrentUser();
    const response = await fetch(`${API_BASE}/ai/simplify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, usePro, userId: user?.uid || null })
    });
    return handleResponse(response, 'Simplify');
};

/**
 * Generate audio-optimized text using Gemini AI
 */
export const getAudioText = async (text) => {
    const response = await fetch(`${API_BASE}/ai/audio-text`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
    });
    return handleResponse(response, 'Audio Text');
};

/**
 * Analyze content for difficulty and suggestions using Gemini AI
 */
export const analyzeContent = async (content, contentType = 'text') => {
    const user = getCurrentUser();
    const response = await fetch(`${API_BASE}/ai/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, contentType, userId: user?.uid || null })
    });
    return handleResponse(response, 'Analyze');
};

/**
 * Process uploaded content (text or image) using Gemini AI
 */
export const processUpload = async (content, contentType = 'text', metadata = {}) => {
    const user = getCurrentUser();
    const response = await fetch(`${API_BASE}/upload/process`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, contentType, metadata, userId: user?.uid || null })
    });
    return handleResponse(response, 'Upload');
};

/**
 * Get syllable breakdown and mnemonics for a specific word
 */
export const getWordLabData = async (word) => {
    const response = await fetch(`${API_BASE}/ai/word-lab`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ word })
    });
    return handleResponse(response, 'Word Lab');
};

/**
 * Generate a comprehension quiz for the text
 */
export const generateQuiz = async (text) => {
    const response = await fetch(`${API_BASE}/ai/generate-quiz`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
    });
    return handleResponse(response, 'Quiz');
};

/**
 * Get user progress records
 */
export const getUserProgress = async (userId) => {
    const response = await fetch(`${API_BASE}/progress/${userId}`);
    return handleResponse(response, 'Get Progress');
};

/**
 * Get user statistics
 */
export const getUserStats = async (userId) => {
    const response = await fetch(`${API_BASE}/progress/${userId}/stats`);
    return handleResponse(response, 'Get Stats');
};

/**
 * Save user progress
 */
export const saveUserProgress = async (progressData) => {
    const user = getCurrentUser();
    const response = await fetch(`${API_BASE}/progress/${user?.uid}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(progressData)
    });
    return handleResponse(response, 'Save Progress');
};

export { getCurrentUser };

