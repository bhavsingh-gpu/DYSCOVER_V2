import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import ShootingStars from '../components/ShootingStars';
import { BentoGrid, BentoCard } from '../components/MagicBento';
import './Landing.css';

const Landing = () => {
  const [showKnowMore, setShowKnowMore] = useState(false);

  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden bg-[#050816] text-cream">
      {/* Particles Background */}
      <div className="fixed inset-0 z-0 particles-background">
        <ShootingStars />
        <div className="particles-container">
          {useMemo(() => (
            Array.from({ length: 780 }).map((_, i) => (
              <div
                key={i}
                className="particle"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 20}s`,
                  animationDuration: `${10 + Math.random() * 20}s`
                }}
              />
            ))
          ), [])}
        </div>
      </div>

      {/* Centered Content */}
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center">
        {/* Glow behind title */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-orange-500/15 to-orange-600/10 blur-[120px] pointer-events-none"></div>

        {/* Logo */}
        <img
          src="/FAVICON_DYSCOVER.png"
          alt="DYSCOVER logo"
          className="h-20 w-20 rounded-2xl object-contain mb-6 opacity-90"
        />

        {/* Title */}
        <h1
          className="text-6xl sm:text-7xl lg:text-8xl font-bold tracking-tight text-white mb-10"
          style={{
            textShadow: '0 0 60px rgba(255, 138, 74, 0.3), 0 0 120px rgba(255, 138, 74, 0.1)'
          }}
        >
          DYSCOVER
        </h1>

        {/* Buttons */}
        <div className="flex items-center gap-5">
          <Link
            to="/login"
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 px-7 py-3 text-base font-semibold text-white shadow-lg shadow-blue-500/25 transition hover:from-blue-600 hover:to-blue-700 hover:shadow-blue-500/40"
          >
            <span>→</span>
            Login
          </Link>

          <button
            onClick={() => setShowKnowMore(true)}
            className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-7 py-3 text-base font-semibold text-white backdrop-blur-sm transition hover:bg-white/10"
          >
            <img src="/INFO_LANDING_ICON.png" alt="info" className="h-5 w-5" />
            Know More
          </button>
        </div>
      </div>

      {/* Know More Popup Modal */}
      {showKnowMore && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={() => setShowKnowMore(false)}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-fadeIn"></div>

          {/* Modal */}
          <div
            className="relative z-10 w-full max-w-4xl max-h-[85vh] overflow-y-auto rounded-3xl border border-white/10 bg-[#0a0f24]/95 p-8 shadow-2xl animate-popIn"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setShowKnowMore(false)}
              className="absolute top-5 right-5 flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70 transition hover:bg-white/10 hover:text-white"
            >
              ✕
            </button>

            <h2 className="mb-8 text-center text-3xl font-bold text-white">
              Why Choose DYSCOVER?
            </h2>

            <BentoGrid className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 !grid-cols-none">
              <BentoCard
                className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm transition hover:bg-white/8 hover:border-white/15 !min-h-0"
                glowColor="249, 115, 22"
                enableStars={true}
              >
                <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-orange-500/20">
                  <img src="/SIMPLIFIED_TEXT_KNOW_MORE.png" alt="Simplified Text" className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-white">Simplified Text</h3>
                <p className="text-sm leading-relaxed text-cream/70">
                  AI-powered text simplification makes complex content accessible and easy to understand
                  for dyslexic learners.
                </p>
              </BentoCard>

              <BentoCard
                className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm transition hover:bg-white/8 hover:border-white/15 !min-h-0"
                glowColor="249, 115, 22"
                enableStars={true}
              >
                <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-orange-500/20">
                  <img src="/AUDIO_KNOW_MORE.png" alt="Audio Support" className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-white">Audio Support</h3>
                <p className="text-sm leading-relaxed text-cream/70">
                  Text-to-speech features with optimized pacing help learners follow along and improve
                  comprehension.
                </p>
              </BentoCard>

              <BentoCard
                className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm transition hover:bg-white/8 hover:border-white/15 !min-h-0"
                glowColor="59, 130, 246"
                enableStars={true}
              >
                <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/20">
                  <img src="/STAT_UPLOAD_SEC.png" alt="stats" className="h-6 w-6 dark:invert" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-white">Progress Tracking</h3>
                <p className="text-sm leading-relaxed text-cream/70">
                  Gentle progress tracking without pressure, focusing on building confidence and
                  celebrating small wins.
                </p>
              </BentoCard>

              <BentoCard
                className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm transition hover:bg-white/8 hover:border-white/15 !min-h-0"
                glowColor="249, 115, 22"
                enableStars={true}
              >
                <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-orange-500/20">
                  <img src="/TICK_ICON.png" alt="tick" className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-white">Early Detection</h3>
                <p className="text-sm leading-relaxed text-cream/70">
                  AI-assisted screening helps identify early signs of dyslexia, enabling timely support
                  and intervention.
                </p>
              </BentoCard>

              <BentoCard
                className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm transition hover:bg-white/8 hover:border-white/15 !min-h-0"
                glowColor="249, 115, 22"
                enableStars={true}
              >
                <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-orange-500/20">
                  <img src="/INDIAN_KNOW_MORE.png" alt="Indian Context" className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-white">Indian Context</h3>
                <p className="text-sm leading-relaxed text-cream/70">
                  Designed specifically for Indian classrooms, understanding local educational needs and
                  language challenges.
                </p>
              </BentoCard>

              <BentoCard
                className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm transition hover:bg-white/8 hover:border-white/15 !min-h-0"
                glowColor="59, 130, 246"
                enableStars={true}
              >
                <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-orange-500/20">
                  <img src="/DESIGN_KNOW_MORE.png" alt="Inclusive Design" className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-white">Inclusive Design</h3>
                <p className="text-sm leading-relaxed text-cream/70">
                  Calm, accessible interface with dyslexia-friendly fonts, colors, and layouts that
                  reduce visual stress.
                </p>
              </BentoCard>
            </BentoGrid>
          </div>
        </div>
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Landing;
