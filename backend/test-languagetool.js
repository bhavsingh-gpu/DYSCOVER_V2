import { checkGrammar } from './services/languageTool.js';

async function testLT() {
    const text = "Teh cat sleped under the wram blanekt. He are a good cat.";
    console.log('Testing LT with:', text);

    const mistakes = await checkGrammar(text);
    console.log('LanguageTool Results:', JSON.stringify(mistakes, null, 2));

    if (mistakes.length > 0) {
        console.log('✅ LanguageTool is working!');
    } else {
        console.log('❌ LanguageTool returned no mistakes (or failed).');
    }
}

testLT();
