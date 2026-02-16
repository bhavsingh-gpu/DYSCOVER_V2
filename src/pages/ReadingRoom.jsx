import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { getAudioText, getWordLabData, generateQuiz } from '../services/api';

const ReadingRoom = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [content, setContent] = useState('');
    const [fontSize, setFontSize] = useState('medium');
    const [spacing, setSpacing] = useState('normal');
    const [theme, setTheme] = useState('cream');
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [loading, setLoading] = useState({ audio: false, word: false, quiz: false });

    // Word Lab State
    const [selectedWord, setSelectedWord] = useState(null);
    const [wordData, setWordData] = useState(null);

    // Quiz State
    const [quiz, setQuiz] = useState(null);
    const [quizActive, setQuizActive] = useState(false);
    const [quizAnswers, setQuizAnswers] = useState({});
    const [quizScore, setQuizScore] = useState(null);

    useEffect(() => {
        if (location.state && location.state.content) {
            setContent(location.state.content);
        } else {
            navigate('/home');
        }
    }, [location, navigate]);

    const toggleAudio = async () => {
        if (isSpeaking) {
            window.speechSynthesis.cancel();
            setIsSpeaking(false);
            return;
        }

        setLoading(prev => ({ ...prev, audio: true }));
        try {
            const result = await getAudioText(content);
            const utterance = new SpeechSynthesisUtterance(result.audioOptimized);
            const voices = window.speechSynthesis.getVoices();
            const preferredVoice = voices.find(v => v.name.includes('Google') && v.lang.startsWith('en')) || voices[0];
            if (preferredVoice) utterance.voice = preferredVoice;
            utterance.rate = 0.85;
            utterance.onstart = () => setIsSpeaking(true);
            utterance.onend = () => setIsSpeaking(false);
            utterance.onerror = () => setIsSpeaking(false);
            window.speechSynthesis.speak(utterance);
        } catch (err) {
            console.error('Audio error:', err);
        } finally {
            setLoading(prev => ({ ...prev, audio: false }));
        }
    };

    const handleWordClick = async (word) => {
        // Clean word (remove punctuation)
        const cleanWord = word.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");
        if (!cleanWord || cleanWord.length < 3) return;

        setSelectedWord(cleanWord);
        setWordData(null);
        setLoading(prev => ({ ...prev, word: true }));

        try {
            const data = await getWordLabData(cleanWord);
            setWordData(data);
        } catch (err) {
            console.error('Word Lab error:', err);
        } finally {
            setLoading(prev => ({ ...prev, word: false }));
        }
    };

    const handleStartQuiz = async () => {
        if (quiz) {
            setQuizActive(true);
            return;
        }

        setLoading(prev => ({ ...prev, quiz: true }));
        try {
            const data = await generateQuiz(content);
            setQuiz(data.quiz);
            setQuizActive(true);
            setQuizAnswers({});
            setQuizScore(null);
        } catch (err) {
            console.error('Quiz error:', err);
        } finally {
            setLoading(prev => ({ ...prev, quiz: false }));
        }
    };

    const submitQuiz = () => {
        let score = 0;
        quiz.forEach((q, idx) => {
            if (quizAnswers[idx] === q.correctIndex) score++;
        });
        setQuizScore({ score, total: quiz.length });
    };

    const themes = {
        cream: 'bg-[#fdfaf3] text-[#2d2d2d]',
        white: 'bg-white text-[#1a1a1a]',
        dark: 'bg-[#121212] text-[#e0e0e0]'
    };

    const fontSizes = {
        small: 'text-lg',
        medium: 'text-2xl',
        large: 'text-4xl'
    };

    const spacings = {
        normal: 'leading-relaxed tracking-normal',
        relaxed: 'leading-loose tracking-wide',
        wide: 'leading-[3] tracking-[0.1em]'
    };

    // Split content into interactive words
    const renderContent = () => {
        return content.split(/\s+/).map((word, idx) => (
            <span
                key={idx}
                onClick={() => handleWordClick(word)}
                className="cursor-pointer hover:bg-orange-500/10 hover:text-orange-600 rounded px-0.5 transition"
            >
                {word}{' '}
            </span>
        ));
    };

    return (
        <div className={`min-h-screen transition-colors duration-500 ${themes[theme]}`}>
            {/* Control Bar */}
            <header className="sticky top-0 z-30 border-b border-black/5 bg-inherit/80 backdrop-blur-md px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-6">
                    <button onClick={() => navigate(-1)} className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-black/5 transition">←</button>
                    <div className="h-4 w-px bg-black/10"></div>
                    <div className="flex gap-2">
                        {['small', 'medium', 'large'].map(s => (
                            <button key={s} onClick={() => setFontSize(s)} className={`px-3 py-1 rounded-lg text-xs font-bold uppercase ${fontSize === s ? 'bg-orange-500 text-white' : 'bg-black/5 hover:bg-black/10'}`}>{s[0]}</button>
                        ))}
                    </div>
                    <div className="flex gap-2">
                        {['normal', 'relaxed', 'wide'].map(sp => (
                            <button key={sp} onClick={() => setSpacing(sp)} className={`px-3 py-1 rounded-lg text-xs font-bold uppercase ${spacing === sp ? 'bg-blue-500 text-white' : 'bg-black/5 hover:bg-black/10'}`}>{sp[0]}</button>
                        ))}
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex gap-2">
                        {Object.keys(themes).map(t => (
                            <button key={t} onClick={() => setTheme(t)} className={`h-8 w-8 rounded-full border-2 transition ${theme === t ? 'border-orange-500 scale-110' : 'border-transparent'} ${themes[t].split(' ')[0]}`} />
                        ))}
                    </div>
                    <button
                        onClick={toggleAudio}
                        disabled={loading.audio}
                        className={`px-6 py-2 rounded-full font-bold text-sm transition ${isSpeaking ? 'bg-red-500 text-white' : 'bg-orange-500 text-white hover:bg-orange-600'}`}
                    >
                        {loading.audio ? '...' : isSpeaking ? 'Stop' : '🔊 Listen'}
                    </button>
                    <button
                        onClick={handleStartQuiz}
                        disabled={loading.quiz}
                        className="px-6 py-2 rounded-full bg-blue-500 text-white font-bold text-sm hover:bg-blue-600 transition"
                    >
                        {loading.quiz ? '...' : '📝 Quiz'}
                    </button>
                </div>
            </header>

            {/* Reading Workspace */}
            <main className="mx-auto max-w-4xl px-8 py-20 animate-fadeIn">
                <article className={`lexend-font ${fontSizes[fontSize]} ${spacings[spacing]} select-text`}>
                    {renderContent()}
                </article>

                <div className="mt-40 mb-20 flex justify-center italic text-sm opacity-40">
                    Click any word to explore it in the Word Lab
                </div>
            </main>

            {/* Word Lab Modal */}
            {selectedWord && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
                    <div className="w-full max-w-md bg-white dark:bg-[#1E2029] rounded-3xl p-8 shadow-2xl animate-popIn">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <p className="text-xs font-bold text-dysGray uppercase tracking-widest">Word Lab</p>
                                <h2 className="text-3xl font-black text-ink dark:text-white capitalize">{selectedWord}</h2>
                            </div>
                            <button onClick={() => setSelectedWord(null)} className="text-2xl opacity-40 hover:opacity-100">×</button>
                        </div>

                        {loading.word ? (
                            <div className="py-10 text-center animate-pulse">Gemini is analyzing the word...</div>
                        ) : wordData ? (
                            <div className="space-y-6">
                                <div className="p-4 bg-orange-500/5 rounded-2xl border border-orange-500/10">
                                    <p className="text-xs font-bold text-orange-600 uppercase mb-2">Syllables</p>
                                    <p className="text-2xl font-bold tracking-[0.2em] text-ink dark:text-white">{wordData.syllables}</p>
                                </div>
                                <div className="p-4 bg-blue-500/5 rounded-2xl border border-blue-500/10">
                                    <p className="text-xs font-bold text-blue-600 uppercase mb-2">Memory Hook (Mnemonic)</p>
                                    <p className="text-base text-softSlate dark:text-cream/80 italic leading-relaxed">"{wordData.mnemonic}"</p>
                                </div>
                            </div>
                        ) : (
                            <div className="text-red-500">Failed to load word data.</div>
                        )}

                        <button
                            onClick={() => setSelectedWord(null)}
                            className="w-full mt-8 py-3 bg-black text-white dark:bg-white dark:text-black rounded-2xl font-bold hover:opacity-90 transition"
                        >
                            Got it!
                        </button>
                    </div>
                </div>
            )}

            {/* Quiz Modal */}
            {quizActive && quiz && (
                <div className="fixed inset-0 z-50 overflow-y-auto bg-[#fdfaf3] dark:bg-[#121212] p-4 sm:p-8">
                    <div className="mx-auto max-w-2xl space-y-8 py-10">
                        <div className="flex justify-between items-center">
                            <h2 className="text-3xl font-bold">Comprehension Quiz</h2>
                            <button onClick={() => setQuizActive(false)} className="text-sm font-bold opacity-60">Close</button>
                        </div>

                        {quizScore ? (
                            <div className="text-center space-y-6 py-20 bg-white dark:bg-white/5 rounded-3xl animate-fadeIn">
                                <p className="text-6xl">🎉</p>
                                <h3 className="text-4xl font-bold">You got {quizScore.score} / {quizScore.total}!</h3>
                                <p className="opacity-60">Keep up the great practice!</p>
                                <button onClick={() => { setQuizActive(false); setQuizScore(null); }} className="px-8 py-3 bg-orange-500 text-white rounded-full font-bold">Back to Reading</button>
                            </div>
                        ) : (
                            <div className="space-y-10">
                                {quiz.map((q, qIdx) => (
                                    <div key={qIdx} className="space-y-4">
                                        <p className="text-xl font-bold">{qIdx + 1}. {q.question}</p>
                                        <div className="grid gap-3">
                                            {q.options.map((opt, oIdx) => (
                                                <button
                                                    key={oIdx}
                                                    onClick={() => setQuizAnswers(prev => ({ ...prev, [qIdx]: oIdx }))}
                                                    className={`w-full text-left px-6 py-4 rounded-2xl border-2 transition ${quizAnswers[qIdx] === oIdx ? 'border-orange-500 bg-orange-500/5' : 'border-dysGray/10 hover:border-black/20'}`}
                                                >
                                                    {opt}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                                <button
                                    onClick={submitQuiz}
                                    disabled={Object.keys(quizAnswers).length < quiz.length}
                                    className="w-full py-4 bg-black text-white dark:bg-white dark:text-black rounded-2xl font-bold disabled:opacity-30"
                                >
                                    Check My Answers
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ReadingRoom;
