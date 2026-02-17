import React from 'react';
import { motion } from 'framer-motion';
import { BentoCard } from './MagicBento';

/**
 * MistakeHighlighter Component
 * Purpose: Display text with interactive dyslexia-friendly highlighting and tooltips.
 */
const MistakeHighlighter = ({ original, corrected, mistakes = [], explanation, score }) => {
    return (
        <div className="space-y-10">
            {/* Score Banner */}
            <BentoCard
                className="p-1 rounded-3xl"
                glowColor="249, 115, 22"
                enableTilt={true}
            >
                <div className="flex items-center justify-between p-6 bg-white dark:bg-[#0a0f24]/60 backdrop-blur-md rounded-[1.4rem] border border-orange-100 dark:border-white/5 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="h-14 w-14 rounded-2xl bg-orange-500/10 flex items-center justify-center p-2.5 shadow-inner">
                            <img src="/TICK_ICON.png" alt="Tick" className="w-full h-full object-contain drop-shadow-md invert dark:invert-0" />
                        </div>
                        <div>
                            <h4 className="text-xs font-black text-orange-500 uppercase tracking-widest mb-1 opacity-60">Writing Mastery</h4>
                            <p className="text-3xl font-black text-ink dark:text-cream leading-none">{score || 85}<span className="text-sm text-dysGray">/100</span></p>
                        </div>
                    </div>

                    <div className="text-right">
                        <span className={`px-6 py-2.5 rounded-full text-sm font-black uppercase tracking-widest shadow-lg ${(score || 85) > 90 ? 'bg-green-500 text-white shadow-green-500/20' : 'bg-orange-500 text-white shadow-orange-500/20'
                            }`}>
                            {(score || 85) > 90 ? 'Excellent!' : 'Good effort!'}
                        </span>
                    </div>
                </div>
            </BentoCard>

            {/* Comparison Section with Interactive Highlights */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Original with Interactive Highlights */}
                <div className="p-8 bg-white dark:bg-white/5 rounded-[2.5rem] border border-dysGray/10 shadow-xl relative group">
                    <h3 className="text-xs font-black text-softSlate dark:text-cream/40 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-red-400 animate-pulse"></span>
                        Interactive Analysis
                    </h3>
                    <div className="text-xl text-slate-700 dark:text-cream/90 leading-[1.8] font-medium">
                        {original.split(/(\s+)/).map((word, i) => {
                            // Extract just the word part, skipping leading/trailing punctuation for matching
                            const match = word.match(/[a-zA-Z0-9']+/);
                            const cleanWord = match ? match[0].toLowerCase() : "";

                            const mistake = mistakes && Array.isArray(mistakes)
                                ? mistakes.find(m => m.wrong.toLowerCase() === cleanWord)
                                : null;

                            if (mistake) {
                                return (
                                    <span key={i} className="relative group/mistake inline-block">
                                        <span className="bg-red-200/50 text-red-900 dark:text-red-200 border-b-2 border-red-400 px-1 rounded-sm cursor-help transition-all hover:bg-red-300/60 hover:scale-105">
                                            {word}
                                        </span>
                                        {/* Tooltip */}
                                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 w-72 p-4 bg-white dark:bg-[#1a1f35] shadow-2xl rounded-2xl border border-red-100 dark:border-white/10 opacity-0 group-hover/mistake:opacity-100 transition-all duration-300 pointer-events-none z-50 transform translate-y-2 group-hover/mistake:translate-y-0">
                                            <div className="space-y-2">
                                                <div className="flex items-center justify-between border-b pb-2 border-red-50 dark:border-white/5">
                                                    <span className="text-[10px] font-black uppercase text-red-500">Mistake</span>
                                                    <span className="text-[10px] font-black uppercase text-green-500">Fix: {mistake.correct}</span>
                                                </div>
                                                <p className="text-sm font-bold text-ink dark:text-white leading-relaxed">
                                                    {mistake.reason}
                                                </p>
                                            </div>
                                            <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-white dark:border-t-[#1a1f35]"></div>
                                        </div>
                                    </span>
                                );
                            }
                            return word;
                        })}
                    </div>
                </div>

                {/* Final Goal View */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="p-8 bg-green-500/5 dark:bg-green-500/10 rounded-[2.5rem] border-2 border-green-500/20 shadow-xl relative"
                >
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xs font-black text-green-600 dark:text-green-400 uppercase tracking-[0.2em] flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
                            Perfect Version
                        </h3>
                        <button
                            onClick={() => {
                                navigator.clipboard.writeText(corrected);
                                alert("Corrected text copied!");
                            }}
                            className="text-[10px] font-black uppercase text-green-600 hover:text-green-700 bg-green-500/10 px-3 py-1 rounded-lg transition-all"
                        >
                            Copy text
                        </button>
                    </div>
                    <p className="text-2xl text-ink dark:text-cream font-bold leading-relaxed">
                        {corrected || original}
                    </p>
                    <div className="mt-6 pt-4 border-t border-green-500/10">
                        <p className="text-xs text-green-600/60 font-medium italic">
                            This version is ready to post or hand in!
                        </p>
                    </div>
                </motion.div>
            </div>

            {/* Tip / Explanation / Dyscover Insight */}
            {explanation && (
                <BentoCard
                    className="rounded-[3rem] shadow-2xl relative overflow-hidden group"
                    glowColor="59, 130, 246"
                    enableTilt={true}
                    enableStars={true}
                    particleCount={20}
                >
                    <div className="p-10 bg-[#0f172a] dark:bg-[#050816]/90 text-white relative z-10">
                        <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                            <motion.div
                                className="relative flex-shrink-0"
                                animate={{
                                    boxShadow: ["0 0 20px rgba(249, 115, 22, 0.2)", "0 0 40px rgba(249, 115, 22, 0.6)", "0 0 20px rgba(249, 115, 22, 0.2)"]
                                }}
                                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                            >
                                <div className="w-16 h-16 filter drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]">
                                    <img src="/DYSCOVER_INSIGHT_ICON.png" alt="Insight Icon" className="w-full h-full object-contain" />
                                </div>
                                <div className="absolute inset-0 bg-orange-500/20 blur-2xl rounded-full scale-150"></div>
                            </motion.div>

                            <div className="space-y-4 text-center md:text-left">
                                <div className="space-y-1">
                                    <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-orange-500 flex items-center justify-center md:justify-start gap-2">
                                        <span className="h-1.5 w-1.5 rounded-full bg-orange-500 animate-ping"></span>
                                        DYSCOVER INSIGHT
                                    </h3>
                                    <h4 className="text-2xl font-black tracking-tight character-gradient">
                                        Found {mistakes.length} dyslexia pattern{mistakes.length !== 1 ? 's' : ''} in your writing
                                    </h4>
                                </div>

                                <p className="text-lg text-cream/70 leading-relaxed font-medium italic">
                                    "Your unique way of writing shows great character. We've simplified the {mistakes.length} common dyslexic patterns to help you read it back with total confidence!"
                                </p>

                                <div className="pt-4 flex flex-wrap gap-3 justify-center md:justify-start">
                                    <span className="px-4 py-2 bg-white/5 rounded-2xl border border-white/10 text-[10px] font-bold uppercase tracking-widest text-orange-400">
                                        ✨ Creative Thinker
                                    </span>
                                    <span className="px-4 py-2 bg-white/5 rounded-2xl border border-white/10 text-[10px] font-bold uppercase tracking-widest text-blue-400">
                                        🚀 Fast Learner
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </BentoCard>
            )}
        </div>
    );
};

export default MistakeHighlighter;
