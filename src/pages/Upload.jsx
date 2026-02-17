import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import MistakeHighlighter from '../components/MistakeHighlighter.jsx';
import { extractTextFromImage } from '../services/ocrService';
import { processUpload, getCurrentUser } from '../services/api';
import { BentoCard } from '../components/MagicBento';

const Upload = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [ocrProgress, setOcrProgress] = useState(0);
  const [loadingStatus, setLoadingStatus] = useState('');
  const [canAnalyze, setCanAnalyze] = useState(true);
  const [countdown, setCountdown] = useState(0);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState(null);
  const [results, setResults] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      navigate('/login');
    } else {
      setUser(currentUser);
    }
  }, [navigate]);

  // Throttling Logic
  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else {
      setCanAnalyze(true);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = async (file) => {
    if (!file || !canAnalyze) return;

    setError('');
    setResults(null);
    setOcrProgress(0);
    setCanAnalyze(false);
    setCountdown(10); // 10-second throttle

    // Show preview if image
    let base64Image = null;
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);

      // We'll need the base64 for potential Gemini fallback
      base64Image = await new Promise((resolve) => {
        const r = new FileReader();
        r.onload = () => resolve(r.result);
        r.readAsDataURL(file);
      });
    } else {
      setPreview(null);
    }

    setLoading(true);

    try {
      let textContent;
      let ocrConfidence = 100;

      if (file.type.startsWith('image/')) {
        setLoadingStatus('Extracting text (Local OCR)...');
        const ocrResult = await extractTextFromImage(file, (progress) => {
          setOcrProgress(progress);
        });
        textContent = ocrResult.text;
        ocrConfidence = ocrResult.confidence;
        console.log(`[OCR] Confidence: ${ocrConfidence}%`);
      } else {
        setLoadingStatus('Reading file...');
        textContent = await file.text();
      }

      setLoadingStatus('Analyzing writing...');


      // HACKATHON ARMOR: Check Local Cache first
      // TEMPORARILY DISABLED - Backend just got fixed, need fresh results!
      // const cacheKey = `upload_cache_${textContent.substring(0, 20)}`;
      // const cached = localStorage.getItem(cacheKey);
      // if (cached) {
      //   console.log('[Upload] Hackathon Armor: Local Cache Hit!');
      //   setResults(JSON.parse(cached));
      //   setLoading(false);
      //   return;
      // }

      // Make API call to backend
      let response;
      if (ocrConfidence < 60 && base64Image) {
        console.log('[Upload] Low confidence, falling back to Gemini Vision');
        setLoadingStatus('Low OCR confidence. Asking Gemini Vision to help...');
        response = await processUpload(base64Image, 'image', {
          fallbackReason: 'low_confidence',
          originalConfidence: ocrConfidence
        });
      } else {
        if (!textContent || textContent.trim().length === 0) {
          throw new Error('No text could be extracted. Please try a clearer image or type your text.');
        }
        response = await processUpload(textContent, 'handwriting');
      }

      if (response.success) {
        console.log('[Upload] Analysis Success:', response);
        const resultsToSave = { ...response, content: textContent };

        /*
        // Save to cache
        const cacheKey = `upload_cache_${textContent.substring(0, 20)}`;
        localStorage.setItem(cacheKey, JSON.stringify(resultsToSave));
        */

        setResults(resultsToSave);
      } else {
        throw new Error(response.error || 'Failed to analyze writing');
      }

    } catch (err) {
      console.error('Upload Error:', err);
      setError(err.message || 'Failed to process file. Please try again.');
    } finally {
      setLoading(false);
      setLoadingStatus('');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fdfaf3] text-ink dark:bg-[#050816] dark:text-cream">
      <Navbar />

      <main className="flex-1 mx-auto w-full max-w-4xl px-4 py-12 sm:px-8">
        <div className="space-y-12">
          {/* Header */}
          <div className="text-center space-y-4">
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl sm:text-5xl font-extrabold tracking-tight text-ink dark:text-white"
            >
              Check Your Writing
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-lg text-softSlate dark:text-cream/60 max-w-2xl mx-auto"
            >
              Upload a photo of your notes. We'll help you find mistakes and explain them in a way that makes sense.
            </motion.p>
          </div>

          <AnimatePresence mode="wait">
            {!results && !loading ? (
              <div className="space-y-8">
                {/* Upload Section */}
                <motion.div
                  key="upload-zone"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className={`relative group rounded-[2.5rem] border-4 border-dashed transition-all duration-300 min-h-[300px] flex flex-col items-center justify-center p-12 text-center
                    ${!canAnalyze ? 'cursor-not-allowed opacity-60 grayscale' : 'cursor-pointer'}
                    ${dragActive
                      ? 'border-orange-500 bg-orange-500/5 shadow-2xl shadow-orange-500/10'
                      : 'border-dysGray/20 bg-white hover:border-orange-500/50 hover:bg-orange-500/5 dark:bg-white/5 shadow-xl'
                    }
                  `}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  onClick={() => canAnalyze && fileInputRef.current.click()}
                >
                  {!canAnalyze && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/20 backdrop-blur-[2px] rounded-[2.3rem] z-10">
                      <div className="bg-white px-6 py-3 rounded-2xl shadow-lg border border-orange-100 flex items-center gap-3">
                        <div className="animate-spin h-5 w-5 border-2 border-orange-500 border-t-transparent rounded-full"></div>
                        <span className="font-bold text-orange-600">Please wait {countdown}s...</span>
                      </div>
                    </div>
                  )}
                  <div className="space-y-6">
                    <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-orange-500/10 group-hover:scale-110 transition-transform duration-300 p-5">
                      <img src="/CAMERA_ICON.png" alt="Camera" className="w-full h-full object-contain invert dark:invert-0" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-xl font-bold text-ink dark:text-white">Upload Handwriting Photo</h3>
                      <p className="text-dysGray text-sm">Drop image here or click to browse</p>
                    </div>
                  </div>

                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    accept="image/*,.pdf,.txt"
                  />
                </motion.div>

                {/* Text Input Section */}
                <BentoCard
                  className="rounded-[2.5rem] shadow-2xl p-1"
                  glowColor="59, 130, 246"
                >
                  <div className="bg-white dark:bg-white/5 rounded-[2.4rem] p-8 border border-white/10 space-y-6">
                    <div className="flex items-center gap-4 border-b border-dysGray/10 pb-4">
                      <div className="h-10 w-10 bg-blue-500/10 rounded-xl flex items-center justify-center">
                        <img src="/SIMPLIFIED_TEXT_KNOW_MORE.png" alt="Simplified Text" className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-ink dark:text-white">Quick Text Analysis</h3>
                        <p className="text-xs text-dysGray">Type directly to check your writing</p>
                      </div>
                    </div>

                    <textarea
                      placeholder="Type your sentence here... (e.g., 'Rian tapd sofly on the windo')"
                      className="w-full h-32 bg-dysGray/5 dark:bg-black/20 rounded-2xl p-6 text-lg font-medium text-ink dark:text-white border-0 focus:ring-2 focus:ring-blue-500 transition-all resize-none outline-none"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          if (e.target.value.trim().length > 0) {
                            handleFile(new File([e.target.value], "text_input.txt", { type: "text/plain" }));
                          }
                        }
                      }}
                    />

                    <div className="flex justify-end">
                      <button
                        onClick={(e) => {
                          const ta = e.target.parentElement.previousSibling;
                          if (ta.value.trim().length > 0) {
                            handleFile(new File([ta.value], "text_input.txt", { type: "text/plain" }));
                          }
                        }}
                        className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all flex items-center gap-2 group shadow-lg shadow-blue-500/20"
                      >
                        Analyze Text
                        <span className="group-hover:translate-x-1 transition-transform">→</span>
                      </button>
                    </div>
                  </div>
                </BentoCard>
              </div>
            ) : loading ? (
              <motion.div
                key="loading-state"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center space-y-8 p-20 bg-white/50 rounded-[3rem] dark:bg-white/5 backdrop-blur-md shadow-2xl border border-white/20"
              >
                <div className="relative">
                  <div className="h-24 w-24 border-[6px] border-orange-500/20 rounded-full"></div>
                  <motion.div
                    className="absolute inset-0 h-24 w-24 border-[6px] border-orange-500 border-t-transparent rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                  {ocrProgress > 0 && ocrProgress < 100 && (
                    <div className="absolute inset-0 flex items-center justify-center font-bold text-orange-600">
                      {ocrProgress}%
                    </div>
                  )}
                </div>

                <div className="text-center space-y-2">
                  <h3 className="text-2xl font-bold character-gradient text-orange-600">{loadingStatus}</h3>
                  <p className="text-dysGray max-w-sm">
                    Making it clearer, one word at a time...
                  </p>
                </div>
              </motion.div>
            ) : results ? (
              <motion.div
                key="results-view"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8 pb-12"
              >
                {/* Reward Banner */}
                <BentoCard
                  className="p-1 rounded-[2.2rem] shadow-2xl"
                  glowColor="249, 115, 22"
                  enableTilt={true}
                  enableStars={true}
                >
                  <div className="bg-white/90 dark:bg-[#0a0f24]/80 backdrop-blur-xl p-8 rounded-[2rem] flex flex-wrap items-center justify-between gap-8 border border-orange-500/20">
                    <div className="flex items-center gap-6">
                      <div className="h-20 w-20 bg-orange-500/10 rounded-3xl flex items-center justify-center p-4 shadow-inner">
                        <img src="/TICK_ICON.png" alt="Tick" className="w-full h-full object-contain drop-shadow-lg" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="h-2 w-2 rounded-full bg-orange-500 animate-pulse"></span>
                          <h4 className="text-2xl font-black text-orange-500 m-0 tracking-tight">REWARD EARNED!</h4>
                        </div>
                        <p className="text-slate-600 dark:text-cream/80 text-lg font-bold m-0 italic">{results.rewards?.feedback}</p>
                      </div>
                    </div>

                    <div className="flex gap-8 px-6 py-4 bg-orange-500/5 rounded-3xl border border-orange-500/10">
                      <div className="text-center">
                        <div className="text-4xl font-black text-orange-500 drop-shadow-sm">+{results.rewards?.points}</div>
                        <div className="text-[10px] uppercase tracking-[0.2em] font-black text-orange-500/60">Points</div>
                      </div>
                      {results.rewards?.stars > 0 && (
                        <div className="text-center border-l border-orange-500/20 pl-8">
                          <div className="text-4xl font-black text-amber-500 drop-shadow-sm">+{results.rewards?.stars}</div>
                          <div className="text-[10px] uppercase tracking-[0.2em] font-black text-amber-500/60">Stars</div>
                        </div>
                      )}
                    </div>
                  </div>
                </BentoCard>

                {/* Analysis */}
                <div className="bg-white dark:bg-white/5 rounded-[2.5rem] p-8 sm:p-12 shadow-2xl border border-white/10 space-y-8">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pb-8 border-b border-dysGray/10">
                    <div className="space-y-1">
                      <h2 className="text-3xl font-black text-ink dark:text-white">Analysis Complete</h2>
                      <p className="text-dysGray font-medium">
                        Writing Score: <span className="text-orange-600 font-bold">{results.analysis.score}/100</span>
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setResults(null);
                        setPreview(null);
                      }}
                      className="w-full sm:w-auto px-10 py-5 bg-dysGray/10 hover:bg-dysGray/20 rounded-[1.5rem] font-black text-dysGray uppercase tracking-widest transition-all text-sm border border-dysGray/5 shadow-inner"
                    >
                      Try Again
                    </button>
                  </div>


                  <MistakeHighlighter
                    original={results.content || "Source Content"}
                    corrected={results.analysis.corrected}
                    mistakes={results.analysis.mistakes}
                    explanation={results.analysis.explanation}
                    score={results.analysis.score}
                  />

                  <div className="pt-8 flex justify-center">
                    <button
                      onClick={() => navigate('/dashboard')}
                      className="group relative px-14 py-5 bg-gradient-to-br from-orange-500 to-orange-600 rounded-[1.5rem] font-black text-white text-lg shadow-2xl shadow-orange-500/20 transition-all hover:scale-105 active:scale-95"
                    >
                      <span className="flex items-center gap-3">
                        Visit Progress Dashboard
                        <img src="/STAT_UPLOAD_SEC.png" alt="Stats" className="h-5 w-5 object-contain group-hover:translate-x-1 transition-transform dark:invert" />
                      </span>
                    </button>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="space-y-8">
                {/* Upload Section */}
                <motion.div
                  key="upload-zone"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className={`relative group rounded-[2.5rem] border-4 border-dashed transition-all duration-300 min-h-[300px] flex flex-col items-center justify-center p-12 text-center
                    ${!canAnalyze ? 'cursor-not-allowed opacity-60 grayscale' : 'cursor-pointer'}
                    ${dragActive
                      ? 'border-orange-500 bg-orange-500/5 shadow-2xl shadow-orange-500/10'
                      : 'border-dysGray/20 bg-white hover:border-orange-500/50 hover:bg-orange-500/5 dark:bg-white/5 shadow-xl'
                    }
                  `}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  onClick={() => canAnalyze && fileInputRef.current.click()}
                >
                  {!canAnalyze && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/20 backdrop-blur-[2px] rounded-[2.3rem] z-10">
                      <div className="bg-white px-6 py-3 rounded-2xl shadow-lg border border-orange-100 flex items-center gap-3">
                        <div className="animate-spin h-5 w-5 border-2 border-orange-500 border-t-transparent rounded-full"></div>
                        <span className="font-bold text-orange-600">Please wait {countdown}s...</span>
                      </div>
                    </div>
                  )}
                  <div className="space-y-6">
                    <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-orange-500/10 group-hover:scale-110 transition-transform duration-300 p-5">
                      <img src="/CAMERA_ICON.png" alt="Camera" className="w-full h-full object-contain invert dark:invert-0" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-xl font-bold text-ink dark:text-white">Upload Handwriting Photo</h3>
                      <p className="text-dysGray text-sm">Drop image here or click to browse</p>
                    </div>
                  </div>

                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    accept="image/*,.pdf,.txt"
                  />
                </motion.div>

                {/* Text Input Section */}
                <BentoCard
                  className="rounded-[2.5rem] shadow-2xl p-1"
                  glowColor="59, 130, 246"
                >
                  <div className="bg-white dark:bg-white/5 rounded-[2.4rem] p-8 border border-white/10 space-y-6">
                    <div className="flex items-center gap-4 border-b border-dysGray/10 pb-4">
                      <div className="h-10 w-10 bg-blue-500/10 rounded-xl flex items-center justify-center">
                        <img src="/SIMPLIFIED_TEXT_KNOW_MORE.png" alt="Simplified Text" className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-ink dark:text-white">Quick Text Analysis</h3>
                        <p className="text-xs text-dysGray">Type directly to check your writing</p>
                      </div>
                    </div>

                    <textarea
                      placeholder="Type your sentence here... (e.g., 'Rian tapd sofly on the windo')"
                      className="w-full h-32 bg-dysGray/5 dark:bg-black/20 rounded-2xl p-6 text-lg font-medium text-ink dark:text-white border-0 focus:ring-2 focus:ring-blue-500 transition-all resize-none outline-none"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          if (e.target.value.trim().length > 0) {
                            handleFile(new File([e.target.value], "text_input.txt", { type: "text/plain" }));
                          }
                        }
                      }}
                    />

                    <div className="flex justify-end">
                      <button
                        onClick={(e) => {
                          const ta = e.target.parentElement.previousSibling;
                          if (ta.value.trim().length > 0) {
                            handleFile(new File([ta.value], "text_input.txt", { type: "text/plain" }));
                          }
                        }}
                        className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all flex items-center gap-2 group shadow-lg shadow-blue-500/20"
                      >
                        Analyze Text
                        <span className="group-hover:translate-x-1 transition-transform">→</span>
                      </button>
                    </div>
                  </div>
                </BentoCard>
              </div>
            )}
          </AnimatePresence>

          {/* Error Message */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="bg-red-500/10 border-2 border-red-500/20 text-red-600 p-6 rounded-3xl text-center font-bold"
              >
                ⚠️ {error}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Upload;
