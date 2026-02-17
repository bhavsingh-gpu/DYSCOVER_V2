import { analyzeWriting } from './services/gemini.js';
import dotenv from 'dotenv';
dotenv.config({ path: './.env' });

async function test() {
    const testSentence = "Teh cat sleped under the wram blanekt.";
    console.log('Testing Sentence:', testSentence);

    try {
        const result = await analyzeWriting(testSentence, 'text');
        console.log('AI Result:', JSON.stringify(result, null, 2));
    } catch (err) {
        console.error('Test failed:', err);
    }
}

test();
