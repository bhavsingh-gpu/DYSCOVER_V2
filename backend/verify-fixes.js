import { analyzeWriting } from './services/gemini.js';
import dotenv from 'dotenv';
dotenv.config({ path: './.env' });

async function verify() {
    const testCases = [
        {
            name: "Grammar Error (He are)",
            text: "He are a good cat."
        },
        {
            name: "Visual Reversal (Bog -> Dog)",
            text: "The bog is barking."
        },
        {
            name: "Phonetic Spelling (Schol)",
            text: "I am going to schol."
        },
        {
            name: "Complex Mix (Offline Patterns + Grammar)",
            text: "Teh cat are sleped on the wram bord."
        }
    ];

    console.log('--- STARTING VERIFICATION ---');

    for (const tc of testCases) {
        console.log(`\nTest Case: ${tc.name}`);
        console.log(`Input: "${tc.text}"`);
        try {
            const result = await analyzeWriting(tc.text, 'text');
            console.log(`Output: "${result.corrected}"`);
            console.log(`Mistakes Found: ${result.mistakes.length}`);
            result.mistakes.forEach(m => {
                console.log(`  - [${m.type}] ${m.wrong} -> ${m.correct} (${m.reason})`);
            });
            console.log(`Engine used: ${result.engine}`);
        } catch (err) {
            console.error(`  FAILED: ${err.message}`);
        }
    }

    console.log('\n--- VERIFICATION COMPLETE ---');
}

verify();
