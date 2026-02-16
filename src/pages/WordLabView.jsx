import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getWordLabData, saveUserProgress } from '../services/api';

const WordLabView = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [word, setWord] = useState('');
    const [syllables, setSyllables] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [mnemonic, setMnemonic] = useState('');

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const wordParam = params.get('word') || (location.state && location.state.word);

        if (wordParam) {
            setWord(wordParam);
            fetchBreakdown(wordParam);
        } else {
            navigate('/home');
        }
    }, [location, navigate]);

    // Preload TTS voices
    useEffect(() => {
        const loadVoices = () => {
            if (window.speechSynthesis.getVoices().length > 0) {
                setVoicesLoaded(true);
            }
        };
        loadVoices();
        window.speechSynthesis.onvoiceschanged = loadVoices;
    }, []);

    const fetchBreakdown = async (wordToProcess) => {
        setLoading(true);
        setError(null);
        try {
            const data = await getWordLabData(wordToProcess);
            console.log('Word Lab Response:', data); // Debugging

            if (data.syllables) {
                // Split by hyphen, dot, middle dot, or space
                const rawParts = data.syllables.split(/[-·•. ]+/);
                const parts = rawParts.filter(v => v.trim().length > 0);

                setSyllables(parts.length > 0 ? parts : [wordToProcess]);
                setMnemonic(data.mnemonic || '');

                // Record progress
                try {
                    await saveUserProgress({
                        date: new Date().toISOString(),
                        practiceType: 'word-lab',
                        level: 1,
                        notes: `Analyzed word: ${wordToProcess}`
                    });
                } catch (err) {
                    console.warn('Progress save failed:', err);
                }
            } else {
                setSyllables([wordToProcess]);
                setMnemonic('');
            }
        } catch (err) {
            console.error('Word Lab Error:', err);
            setError(err.message || 'Connection failed.');
            setSyllables([wordToProcess]);
        } finally {
            setLoading(false);
        }
    };

    const handleSpeech = () => {
        const utterance = new SpeechSynthesisUtterance(word);

        // Use the same soothing voice settings as the main assistant
        const voices = window.speechSynthesis.getVoices();
        const preferredVoice =
            voices.find(v => (v.name.includes('Neural') || v.name.includes('Studio')) && v.lang.startsWith('en')) ||
            voices.find(v => v.name.includes('Google') && v.lang.startsWith('en')) ||
            voices.find(v => v.lang.startsWith('en-US')) ||
            voices[0];

        if (preferredVoice) utterance.voice = preferredVoice;

        utterance.rate = 0.8; // Intentional focus on clarity for word lab
        utterance.pitch = 1.05; // Encouraging tone
        window.speechSynthesis.speak(utterance);
    };

    return (
        <div className="min-h-screen bg-[#373737] flex flex-col items-center justify-center p-8 relative font-lexend">
            {/* Back button */}
            <button
                onClick={() => {
                    if (window.history.length <= 1) {
                        window.close();
                    } else {
                        navigate('/home');
                    }
                }}
                className="absolute top-8 left-8 text-white/40 hover:text-white transition text-sm font-medium"
            >
                ← Back
            </button>

            <div className="w-full max-w-7xl flex flex-col items-center justify-center">
                {loading ? (
                    <div className="text-orange-500 text-4xl font-black animate-pulse uppercase tracking-widest">
                        Analyzing...
                    </div>
                ) : (
                    <>
                        <div className="flex flex-col md:flex-row items-center justify-center gap-10 sm:gap-14 animate-fadeIn">
                            {/* Syllable Breakdown */}
                            <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-6">
                                {syllables.map((part, index) => (
                                    <React.Fragment key={index}>
                                        <span className="text-6xl sm:text-9xl font-black text-[#F97316] uppercase tracking-tighter drop-shadow-2xl">
                                            {part}
                                        </span>
                                        {index < syllables.length - 1 && (
                                            <div className="flex items-center justify-center pt-2">
                                                <div className="w-4 h-4 sm:w-6 sm:h-6 rounded-full bg-[#F97316]/80" />
                                            </div>
                                        )}
                                    </React.Fragment>
                                ))}
                            </div>

                            {/* Speaker Link */}
                            <button
                                onClick={handleSpeech}
                                className="p-6 sm:p-8 text-white/90 hover:text-white hover:scale-110 transition-all duration-300 flex items-center justify-center"
                                title="Listen"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                    className="w-14 h-14 sm:w-24 sm:h-24"
                                >
                                    <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.018.83-2.145 1.917a10.517 10.517 0 00-.202 2.852 10.51 10.51 0 00.202 2.852c.127 1.087 1.004 1.917 2.145 1.917h1.932l4.5 4.5c.944.945 2.56.276 2.56-1.06V4.06zM18.75 12c0-1.748-.684-3.342-1.789-4.532a.75.75 0 10-1.102 1.018A4.99 4.99 0 0117.25 12a4.99 4.99 0 01-1.391 3.514.75.75 0 101.102 1.018A6.49 6.49 0 0018.75 12z" />
                                    <path d="M22.121 12c0-2.822-1.11-5.385-2.91-7.285a.75.75 0 10-1.082 1.042A8.742 8.742 0 0120.621 12a8.742 8.742 0 01-2.492 6.243.75.75 0 101.082 1.042A10.242 10.242 0 0022.121 12z" />
                                </svg>
                            </button>
                        </div>

                        {/* Memory Hook / Error Debug */}
                        {error ? (
                            <div className="mt-8 text-red-400 text-sm font-medium bg-red-400/10 p-4 rounded-2xl border border-red-400/20">
                                {error}
                            </div>
                        ) : (
                            <div className="mt-12 text-center max-w-2xl animate-fadeIn">
                                <p className="text-white/40 text-sm uppercase tracking-widest mb-2 font-bold select-none">Memory Tip</p>
                                <p className="text-white/80 text-xl font-medium leading-relaxed italic">
                                    "{mnemonic || 'Analyzing syllables...'}"
                                </p>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default WordLabView;
