/**
 * Reward Service
 * Purpose: Calculate gamification rewards based on analysis results.
 */

/**
 * Calculate rewards for a piece of writing
 * @param {Object} analysisResult 
 * @returns {Object} { points: number, stars: number, feedback: string }
 */
export const calculateWritingRewards = (analysisResult) => {
    const { errorCount, hasErrors, mistakes = [] } = analysisResult;

    let points = 0;
    let stars = 0;
    let feedback = "";

    // Logic from UPLOAD_READme.txt
    if (!hasErrors || (mistakes && mistakes.length === 0)) {
        points = 10;
        stars = 1;
        feedback = "Perfect! Keep up the great work! ⭐";
    } else if (mistakes.length <= 3) {
        points = 5;
        stars = 0;
        feedback = "Good job! Just a few things to fix. 👍";
    } else {
        points = 0;
        stars = 0;
        feedback = "Let's learn from these mistakes and try again! 📚";
    }

    return { points, stars, feedback };
};
