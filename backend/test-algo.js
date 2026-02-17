import { orchestrateAnalysis } from './services/correctionEngine.js';
import dotenv from 'dotenv';
dotenv.config({ path: './.env' });

const sentences = [
    "Rian tapd sofly on the windo",
    "Teh cat sleped under the wram blanekt.",
    "The chifd threm the ball.",
    "He are a good cat.",
    "Teh techer rote nots on the wite bord.",
    "Afer finshing the assingment, he carefly orginized the documnts in his backpak.",
    "Wile waling threw the crouded markeplace, she acidently misplased her walet and cudent rember wer she last saw it",
    "The morning was very beatful.",
    "I luv my fmaly.",
    "I hop you hav a nis day.",
    "She liks to rid her bik.",
    "Altho the instrucshuns wer clerly explaind beforhand, the studnts misinterprited sevral requirments and submited the assingment incorectly at the last minit",
    "Durring the unexpexted thunderstom, the electristey flucuated repetedly, cousing the computors to shut dwn abrubtly and corept sevral importent fiels"
];

async function runTests() {
    console.log("=== DYSCOVER ALGO STRESS TEST ===");
    for (const text of sentences) {
        console.log(`\nTESTING: "${text}"`);
        try {
            const result = await orchestrateAnalysis(text, 'test-user-algo');
            console.log('RESULT:', JSON.stringify(result, null, 2));
        } catch (err) {
            console.error('ALGO Error:', err);
        }
    }
}

runTests();
