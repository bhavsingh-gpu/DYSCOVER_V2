/**
 * LanguageTool Service (Native Fetch Implementation)
 * Provides professional grammar and stylistic analysis.
 */

const API_URL = 'https://api.languagetool.org/v2/check';

/**
 * Checks text for grammar and spelling errors using LanguageTool API.
 * @param {string} text 
 * @returns {Promise<Array>} Simplified mistakes list
 */
export const checkGrammar = async (text) => {
    if (!text || typeof text !== 'string') return [];

    try {
        const params = new URLSearchParams();
        params.append('text', text);
        params.append('language', 'en-US');

        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': 'application/json'
            },
            body: params
        });

        if (!response.ok) {
            const errText = await response.text();
            console.warn('[LanguageTool] API Error:', response.status, errText);
            return [];
        }

        const data = await response.json();

        if (!data || !data.matches) return [];

        // Map matches to our "mistakes" format
        return data.matches.map(match => ({
            wrong: text.substring(match.offset, match.offset + match.length),
            correct: match.replacements && match.replacements.length > 0 ? match.replacements[0].value : "suggested change",
            reason: match.message,
            type: match.rule.category.name,
            shortMessage: match.shortMessage || ""
        }));

    } catch (error) {
        console.error('[LanguageTool] Fetch failure:', error.message);
        return [];
    }
};
