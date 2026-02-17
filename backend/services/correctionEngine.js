import { checkTextLocally } from './spellCheck.js';
import { checkGrammar } from './languageTool.js';
import { callGeminiAI } from './gemini.js';
import { findBestLinguisticMatch } from './linguisticUtils.js';

/**
 * CorrectionEngine
 * The "Strong Working ALGO" for DYSCOVER.
 * Purpose: Orchestrate multiple analysis layers for maximum accuracy and robustness.
 */

const OFFLINE_PATTERNS = [
    // Visual Reversals (b/d, p/q, u/n, m/w)
    { wrong: 'dab', correct: 'bad', reason: 'Visual reversal (d/b)' },
    { wrong: 'bad', correct: 'dad', reason: 'Visual reversal (b/d)' },
    { wrong: 'bog', correct: 'dog', reason: 'Visual reversal (b/d)' },
    { wrong: 'dig', correct: 'big', reason: 'Visual reversal (d/b)' },
    { wrong: 'pan', correct: 'qan', reason: 'Visual reversal' },
    { wrong: 'went', correct: 'ment', reason: 'Rotational reversal (w/m)' },
    { wrong: 'was', correct: 'saw', reason: 'Visual reversal (mirror)' },
    { wrong: 'on', correct: 'no', reason: 'Visual reversal (order)' },

    // Sequence Transpositions (Adjacent swaps)
    { wrong: 'teh', correct: 'the', reason: 'Letter swap (e/h)' },
    { wrong: 'hte', correct: 'the', reason: 'Letter reversal' },
    { wrong: 'wer', correct: 'were', reason: 'Phonetic/vowel omission' },
    { wrong: 'taht', correct: 'that', reason: 'Letter reversal' },
    { wrong: 'waht', correct: 'what', reason: 'Letter reversal' },
    { wrong: 'wram', correct: 'warm', reason: 'Letter order (transposition)' },
    { wrong: 'blanekt', correct: 'blanket', reason: 'Letter order (transposition)' },
    { wrong: 'aslepp', correct: 'asleep', reason: 'Letter order' },
    { wrong: 'becuase', correct: 'because', reason: 'Letter order' },
    { wrong: 'freind', correct: 'friend', reason: 'Letter order' },
    { wrong: 'thier', correct: 'their', reason: 'Letter order' },
    { wrong: 'form', correct: 'from', reason: 'Letter order (form/from)' },

    // Phonetic Spelling (Sounds-like)
    { wrong: 'sed', correct: 'said', reason: 'Phonetic spelling' },
    { wrong: 'wuz', correct: 'was', reason: 'Phonetic spelling' },
    { wrong: 'uv', correct: 'of', reason: 'Phonetic spelling' },
    { wrong: 'iz', correct: 'is', reason: 'Phonetic spelling' },
    { wrong: 'cuz', correct: 'because', reason: 'Phonetic spelling' },
    { wrong: 'luv', correct: 'love', reason: 'Phonetic spelling' },
    { wrong: 'bin', correct: 'been', reason: 'Phonetic spelling' },
    { wrong: 'rian', correct: 'rain', reason: 'Phonetic shift' },
    { wrong: 'windo', correct: 'window', reason: 'Phonetic omission' },
    { wrong: 'sofly', correct: 'softly', reason: 'Phonetic omission' },
    { wrong: 'tapd', correct: 'tapped', reason: 'Phonetic omission' },
    { wrong: 'sleped', correct: 'slept', reason: 'Phonetic: -ed for -t' },
    { wrong: 'threm', correct: 'threw', reason: 'Phonetic: th-r-em' },
    { wrong: 'chifd', correct: 'child', reason: 'Phonetic reversal' },
    { wrong: 'techer', correct: 'teacher', reason: 'Phonetic omission' },
    { wrong: 'rote', correct: 'wrote', reason: 'Phonetic omission' },
    { wrong: 'nots', correct: 'notes', reason: 'Phonetic omission' },
    { wrong: 'wite', correct: 'white', reason: 'Phonetic omission' },
    { wrong: 'bord', correct: 'board', reason: 'Phonetic omission' },
    { wrong: 'afer', correct: 'after', reason: 'Phonetic: missing consonant' },
    { wrong: 'finshing', correct: 'finishing', reason: 'Omission: missing vowel' },
    { wrong: 'assingment', correct: 'assignment', reason: 'Letter order/omission' },
    { wrong: 'carefly', correct: 'carefully', reason: 'Omission: missing syllables' },
    { wrong: 'orginized', correct: 'organized', reason: 'Vowel shift' },
    { wrong: 'documnts', correct: 'documents', reason: 'Omission: missing vowel' },
    { wrong: 'backpak', correct: 'backpack', reason: 'Omission' },
    { wrong: 'wile', correct: 'while', reason: 'Phonetic omission of h' },
    { wrong: 'waling', correct: 'walking', reason: 'Consonant omission' },
    { wrong: 'threw', correct: 'through', reason: 'Phonetic homophone confusion' },
    { wrong: 'crouded', correct: 'crowded', reason: 'Vowel shift' },
    { wrong: 'markeplace', correct: 'marketplace', reason: 'Omission' },
    { wrong: 'acidently', correct: 'accidentally', reason: 'Syllable omission' },
    { wrong: 'misplased', correct: 'misplaced', reason: 'Phonetic spelling' },
    { wrong: 'walet', correct: 'wallet', reason: 'Consonant omission' },
    { wrong: 'cudent', correct: "couldn't", reason: 'Complex phonetic distortion' },
    { wrong: 'rember', correct: 'remember', reason: 'Syllable omission' },
    { wrong: 'wer', correct: 'where', reason: 'Phonetic omission' },
    { wrong: 'hop', correct: 'hope', reason: 'Silent e omission' },
    { wrong: 'bik', correct: 'bike', reason: 'Silent e omission' },
    { wrong: 'hav', correct: 'have', reason: 'Silent e omission' },
    { wrong: 'nis', correct: 'nice', reason: 'Silent e omission' },
    { wrong: 'liks', correct: 'likes', reason: 'Common omission/suffix' },
    { wrong: 'rid', correct: 'ride', reason: 'Silent e omission' },
    { wrong: 'fmaly', correct: 'family', reason: 'Syllable omission' },
    { wrong: 'durring', correct: 'during', reason: 'Common double consonant' },
    { wrong: 'unexpexted', correct: 'unexpected', reason: 'Phonetic shift (x/ct)' },
    { wrong: 'thunderstom', correct: 'thunderstorm', reason: 'Phonetic omission' },
    { wrong: 'electristey', correct: 'electricity', reason: 'Phonetic spelling' },
    { wrong: 'flucuated', correct: 'fluctuated', reason: 'Phonetic omission' },
    { wrong: 'repetedly', correct: 'repeatedly', reason: 'Vowel omission' },
    { wrong: 'cousing', correct: 'causing', reason: 'Phonetic shift' },
    { wrong: 'computors', correct: 'computers', reason: 'Vowel shift' },
    { wrong: 'abrubtly', correct: 'abruptly', reason: 'Visual reversal' },
    { wrong: 'corept', correct: 'corrupt', reason: 'Vowel shift' },
    { wrong: 'fiels', correct: 'files', reason: 'Letter swap/omission' },
    { wrong: 'dwn', correct: 'down', reason: 'Vowel omission' },
    { wrong: 'whatch', correct: 'watch', reason: 'Over-correction (h)' },
    { wrong: 'thay', correct: 'they', reason: 'Phonetic vowel shift' },

    // Omissions & Common Misspellings
    { wrong: 'butiful', correct: 'beautiful', reason: 'Common misspelling' },
    { wrong: 'beautful', correct: 'beautiful', reason: 'Omission' },
    { wrong: 'somthing', correct: 'something', reason: 'Omission' },
    { wrong: 'whent', correct: 'went', reason: 'Extra letter' },
    { wrong: 'alot', correct: 'a lot', reason: 'Spacing issue' }
];

export const orchestrateAnalysis = async (content, userId) => {
    if (!content) return null;

    console.log(`[ALGO] Starting Orchestration: "${content}"`);

    // LAYER 1: Parallel preparation (Local + LanguageTool)
    const local = checkTextLocally(content);
    const ltMistakesPromise = checkGrammar(content);

    // LAYER 2: Deterministic Specialist Patterns (FORCED)
    let finalCorrected = content;
    const finalMistakes = [];

    OFFLINE_PATTERNS.forEach(p => {
        const escapedWrong = p.wrong.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(`\\b${escapedWrong}\\b`, 'gi');
        if (regex.test(finalCorrected)) {
            finalCorrected = finalCorrected.replace(regex, (match) => {
                const replacement = p.correct;
                if (match === match.toUpperCase()) return replacement.toUpperCase();
                if (match[0] === match[0].toUpperCase()) return replacement.charAt(0).toUpperCase() + replacement.slice(1);
                return replacement.toLowerCase();
            });
            finalMistakes.push({
                wrong: p.wrong,
                correct: p.correct,
                reason: p.reason,
                type: "Specialist Pattern (Forced)"
            });
        }
    });

    // LAYER 3: AI Deep Analysis (The context helper)
    let aiAnalysis = null;
    try {
        aiAnalysis = await callGeminiAI(finalCorrected, 'text');
    } catch (e) {
        console.warn('[ALGO] Layer 3 (AI) Failed. Falling back to offline heuristics.');
    }

    const ltMistakes = await ltMistakesPromise;

    // LAYER 4: Synthesis & Grammar Injection
    const aiCorrected = aiAnalysis?.corrected || aiAnalysis?.corrected_text || aiAnalysis?.perfect_version;
    const aiMistakes = aiAnalysis?.mistakes || [];

    // If AI worked, it becomes the new baseline
    if (aiCorrected) {
        finalCorrected = aiCorrected;
    }

    // Merge AI mistakes
    aiMistakes.forEach(m => {
        if (!finalMistakes.some(fm => fm.wrong.toLowerCase() === m.wrong.toLowerCase())) {
            finalMistakes.push(m);
        }
    });

    // Merge & Apply Grammar Mistakes (only if AI didn't catch them or is offline)
    ltMistakes.forEach(lt => {
        const wrong = lt.wrong || lt.text || (lt.context ? lt.context.text.substr(lt.context.offset, lt.context.length) : "");
        if (!wrong) return;

        const alreadyHandled = finalMistakes.some(fm => fm.wrong.toLowerCase() === wrong.toLowerCase());

        if (!alreadyHandled) {
            const correction = lt.correct || (lt.replacements?.[0]?.value);
            finalMistakes.push({
                wrong: wrong,
                correct: correction,
                reason: lt.reason || "Grammar/Style issue",
                type: "Grammar"
            });

            // If AI is offline, we MUST apply the grammar fix manually
            if (!aiCorrected && correction) {
                const escapedWrong = wrong.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                const regex = new RegExp(`\\b${escapedWrong}\\b`, 'gi');
                finalCorrected = finalCorrected.replace(regex, (match) => {
                    if (match === match.toUpperCase()) return correction.toUpperCase();
                    if (match[0] === match[0].toUpperCase()) return correction.charAt(0).toUpperCase() + correction.slice(1);
                    return correction.toLowerCase();
                });
            }
        }
    });

    // LAYER 5: Dynamic Linguistic Recovery (The "Genius" Layer)
    // ONLY run on words that are still "unrecognized" and haven't been fixed yet.
    const remainingSuspects = local.unrecognizedWords.filter(word =>
        !finalMistakes.some(fm => fm.wrong.toLowerCase() === word.toLowerCase())
    );

    remainingSuspects.forEach(word => {
        const dynamicMatch = findBestLinguisticMatch(word, finalCorrected);

        if (dynamicMatch && dynamicMatch.confidence >= 0.85) {
            const escapedWord = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const regex = new RegExp(`\\b${escapedWord}\\b`, 'gi');

            if (regex.test(finalCorrected)) {
                finalCorrected = finalCorrected.replace(regex, (match) => {
                    const replacement = dynamicMatch.correct;
                    if (match === match.toUpperCase()) return replacement.toUpperCase();
                    if (match[0] === match[0].toUpperCase()) return replacement.charAt(0).toUpperCase() + replacement.slice(1);
                    return replacement.toLowerCase();
                });

                finalMistakes.push({
                    wrong: word,
                    correct: dynamicMatch.correct,
                    reason: dynamicMatch.reason,
                    type: "Linguistic Logic"
                });
            }
        }
    });

    const score = aiAnalysis?.score || (finalMistakes.length > 0 ? Math.max(40, 100 - (finalMistakes.length * 5)) : 100);

    return {
        corrected: finalCorrected.trim().replace(/\.$/, '') + (content.endsWith('.') ? '.' : ''),
        explanation: aiAnalysis?.explanation || "Synthesized using DYSCOVER's specialist patterns and linguistic heuristics.",
        score: Math.min(100, score),
        mistakes: finalMistakes,
        engine: aiAnalysis ? 'AI_HYBRID' : 'DETERMINISTIC_OFFLINE'
    };
};
