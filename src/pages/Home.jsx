import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import ProgressCalendar from '../components/ProgressCalendar.jsx';
import Footer from '../components/Footer.jsx';
import { simplifyText, getAudioText, analyzeContent, getCurrentUser, saveUserProgress } from '../services/api';
import { BentoGrid, BentoCard } from '../components/MagicBento.jsx';

const Home = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [inputText, setInputText] = useState('');
  const [simplifiedText, setSimplifiedText] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState({ simplify: false, analyze: false, audio: false });
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [error, setError] = useState('');
  const [voicesLoaded, setVoicesLoaded] = useState(false);

  // Check for logged in user
  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      navigate('/login');
    } else {
      setUser(currentUser);
    }
  }, [navigate]);

  // Preload TTS voices to avoid empty list on first interaction
  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        setVoicesLoaded(true);
      }
    };

    loadVoices();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  // Handle Text Simplification
  const handleSimplify = async () => {
    if (!inputText.trim()) return;
    setLoading(prev => ({ ...prev, simplify: true }));
    setError('');
    try {
      const result = await simplifyText(inputText);
      setSimplifiedText(result.simplified);
      // Log progress
      saveUserProgress({
        date: new Date(),
        level: 1,
        practiceType: 'reading',
        notes: `Simplified: ${inputText.substring(0, 30)}...`
      }).catch(err => console.error('Failed to log progress:', err));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(prev => ({ ...prev, simplify: false }));
    }
  };

  // Handle Content Analysis
  const handleAnalyze = async () => {
    const contentToAnalyze = simplifiedText || inputText;
    if (!contentToAnalyze.trim()) return;
    setLoading(prev => ({ ...prev, analyze: true }));
    setError('');
    try {
      const result = await analyzeContent(contentToAnalyze);
      // Backend returns string analysis, let's try to format it a bit if needed
      setAnalysis(result.analysis);
      // Log progress
      saveUserProgress({
        date: new Date(),
        level: 2,
        practiceType: 'analysis',
        notes: `Analyzed: ${contentToAnalyze.substring(0, 30)}...`
      }).catch(err => console.error('Failed to log progress:', err));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(prev => ({ ...prev, analyze: false }));
    }
  };

  // Handle Audio Reading (Text-to-Speech)
  const handleReadAloud = async () => {
    const textToRead = simplifiedText || inputText;
    if (!textToRead.trim()) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    setLoading(prev => ({ ...prev, audio: true }));
    setError('');

    try {
      // 1. Get audio-optimized text from Gemini
      const result = await getAudioText(textToRead);
      const optimizedText = result.audioOptimized;

      // 2. Use browser SpeechSynthesis to read it
      const utterance = new SpeechSynthesisUtterance(optimizedText);

      // Enhanced Voice Selection: Prioritize high-quality, soothing voices
      const voices = window.speechSynthesis.getVoices();

      // Preferred Voice Search: Neural/Studio/Chirp -> Google -> Default en-US
      const preferredVoice =
        voices.find(v => (v.name.includes('Neural') || v.name.includes('Studio')) && v.lang.startsWith('en')) ||
        voices.find(v => v.name.includes('Google') && v.lang.startsWith('en')) ||
        voices.find(v => v.lang.startsWith('en-US')) ||
        voices[0];

      if (preferredVoice) utterance.voice = preferredVoice;

      utterance.rate = 0.85; // Slightly slower for a "calm" feel
      utterance.pitch = 1.05; // Slightly higher for an "encouraging" tone

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = (e) => {
        console.error('TTS Error:', e);
        setIsSpeaking(false);
      };

      window.speechSynthesis.speak(utterance);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(prev => ({ ...prev, audio: false }));
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('dyscover_user');
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f6f1e6] text-ink transition-colors dark:bg-[#050816] dark:text-cream">
      <Navbar />

      <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-8 sm:px-8">
        <div className="grid gap-8 lg:grid-cols-12">

          {/* Left Column: AI Assistant Workspace */}
          <div className="lg:col-span-8 space-y-8">

            {/* Quick Word Deep Dive */}
            <BentoCard className="rounded-3xl border border-orange-500/20 bg-gradient-to-r from-orange-500/5 to-transparent p-6 dark:bg-white/5 shadow-sm" glowColor="249, 115, 22" enableStars={true}>
              <div className="flex items-center gap-4 mb-4">
                <div className="bento-icon-container">
                  <img src="/WORD_LAB_ICON.png" alt="word lab" className="h-6 w-6 invert dark:invert-0" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-ink dark:text-white">Quick Word Lab</h3>
                  <p className="text-xs text-softSlate dark:text-cream/60">Type one word to see its rhythm & syllables.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="e.g. Beautiful, Rhythm..."
                  id="quick-word-input"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && e.target.value.trim()) {
                      window.open(`/word-lab?word=${e.target.value.trim()}`, '_blank');
                      e.target.value = '';
                    }
                  }}
                  className="flex-1 rounded-2xl border border-dysGray/20 bg-white/50 px-5 py-3 text-base outline-none focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/10 transition dark:bg-white/10 dark:border-white/10 dark:text-white"
                />
                <button
                  onClick={() => {
                    const input = document.getElementById('quick-word-input');
                    if (input.value.trim()) {
                      window.open(`/word-lab?word=${input.value.trim()}`, '_blank');
                      input.value = '';
                    }
                  }}
                  className="px-6 py-3 rounded-2xl bg-orange-500 text-white font-bold hover:bg-orange-600 transition shadow-lg shadow-orange-500/20"
                >
                  Explore →
                </button>
              </div>
            </BentoCard>

            <section className="space-y-4">
              <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight text-ink dark:text-white">
                  Welcome Back, {user?.displayName || 'Learner'}
                </h1>
                <p className="text-softSlate dark:text-cream/60">
                  Paste your notes below to make them easier to read.
                </p>
              </div>

              {/* Input Area */}
              <div className="relative group">
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Paste difficult text or notes here..."
                  className="w-full min-h-[200px] p-6 rounded-3xl border border-dysGray/20 bg-white/50 text-base leading-relaxed outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500/50 transition dark:bg-white/5 dark:border-white/10 dark:text-white"
                />
                <div className="absolute bottom-4 right-4 flex gap-2">
                  <button
                    onClick={handleAnalyze}
                    disabled={loading.analyze || !inputText.trim()}
                    className="px-4 py-2 rounded-full bg-white/80 text-xs font-bold shadow-sm hover:bg-white transition disabled:opacity-50 dark:bg-white/10 dark:hover:bg-white/20"
                  >
                    {loading.analyze ? 'Analyzing...' : 'Analyze'}
                  </button>
                  <button
                    onClick={handleSimplify}
                    disabled={loading.simplify || !inputText.trim()}
                    className="px-6 py-2 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 text-white text-xs font-bold shadow-lg shadow-orange-500/20 hover:shadow-orange-500/30 transition disabled:opacity-50"
                  >
                    {loading.simplify ? 'Simplifying...' : 'Simplify Text'}
                  </button>
                </div>
              </div>

              {error && (
                <p className="text-sm text-red-500 bg-red-500/10 p-3 rounded-xl border border-red-500/20">
                  {error}
                </p>
              )}
            </section>

            {/* Results Section */}
            {(simplifiedText || analysis) && (
              <section className="grid gap-6 animate-fadeIn">
                {simplifiedText && (
                  <div className="rounded-3xl border border-orange-500/20 bg-white p-6 shadow-sm dark:bg-white/5 space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-bold text-orange-600 dark:text-orange-400">Simplified Version</h3>
                      <button
                        onClick={handleReadAloud}
                        className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition ${isSpeaking
                          ? 'bg-red-500 text-white'
                          : 'bg-orange-500/10 text-orange-600 hover:bg-orange-500/20'
                          }`}
                      >
                        {loading.audio ? (
                          <span className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-current rounded-full animate-bounce"></div>
                            Preparing...
                          </span>
                        ) : (
                          <>
                            {isSpeaking ? '⏹ Stop Reading' : '🔊 Read Aloud'}
                          </>
                        )}
                      </button>
                    </div>
                    <div className="text-lg leading-relaxed text-ink dark:text-white whitespace-pre-wrap">
                      {simplifiedText}
                    </div>
                  </div>
                )}

                {analysis && (
                  <div className="rounded-3xl border border-blue-500/20 bg-white p-6 shadow-sm dark:bg-white/5 space-y-4">
                    <h3 className="text-lg font-bold text-blue-600 dark:text-blue-400">AI Analysis</h3>
                    <div className="text-sm leading-relaxed text-softSlate dark:text-cream/80 whitespace-pre-wrap">
                      {analysis}
                    </div>
                  </div>
                )}
              </section>
            )}
          </div>

          {/* Right Column: Progress & Quick Actions */}
          <div className="lg:col-span-4 space-y-8">
            <div className="rounded-3xl border border-dysGray/10 bg-white/30 p-2 dark:bg-white/5">
              <ProgressCalendar />
            </div>

            <section className="space-y-4">
              <h3 className="px-2 text-sm font-bold uppercase tracking-wider text-dysGray">Quick Tools</h3>
              <BentoGrid className="grid-cols-1 !gap-4">
                <BentoCard className="group !min-h-0" glowColor="249, 115, 22">
                  <Link to="/upload" className="flex items-center justify-between p-4 w-full">
                    <div className="flex items-center gap-3">
                      <div className="bento-icon-container">
                        <img src="/WORKSHEET_ICON.png" alt="worksheet" className="h-6 w-6 invert dark:invert-0" />
                      </div>
                      <div>
                        <p className="font-bold text-sm">Upload Worksheet</p>
                        <p className="text-[0.7rem] text-dysGray">Convert PDFs to easy text</p>
                      </div>
                    </div>
                    <span className="text-dysGray group-hover:text-orange-500 transition">→</span>
                  </Link>
                </BentoCard>

                <BentoCard className="group !min-h-0" glowColor="59, 130, 246">
                  <button className="flex items-center justify-between p-4 w-full text-left">
                    <div className="flex items-center gap-3">
                      <div className="bento-icon-container !bg-blue-500/15 dark:!bg-blue-500/30">
                        <img src="/PRACTICE_ICON.png" alt="practice" className="h-6 w-6 invert dark:invert-0" />
                      </div>
                      <div>
                        <p className="font-bold text-sm">Practice Stories</p>
                        <p className="text-[0.7rem] text-dysGray">Browse our story library</p>
                      </div>
                    </div>
                    <span className="text-dysGray group-hover:text-blue-500 transition">→</span>
                  </button>
                </BentoCard>
              </BentoGrid>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Home;
