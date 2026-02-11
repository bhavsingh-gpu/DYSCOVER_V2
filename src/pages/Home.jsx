import React from 'react';
import { Link } from 'react-router-dom';
import ProgressCalendar from '../components/ProgressCalendar.jsx';
import ThemeToggle from '../components/ThemeToggle.jsx';

const Home = () => {
  return (
    <div className="min-h-screen bg-cream/90 text-ink transition-colors dark:bg-[#1E2029] dark:text-cream">
      <header className="sticky top-0 z-20 border-b border-dysGray/15 bg-gradient-to-b from-cream/95 to-cream/85 backdrop-blur-md dark:border-white/10 dark:from-[#1E2029]/95 dark:to-[#242736]">
        <nav className="flex w-full items-center justify-between gap-6 px-4 py-4 sm:px-6 sm:py-5">
          <Link to="/" className="flex items-center gap-3 dys-focus">
            <img
              src="/FAVICON_DYSCOVER.png"
              alt="DYSCOVER logo"
              className="h-9 w-9 rounded-xl object-contain sm:h-10 sm:w-10"
            />
            <div className="leading-tight text-left">
              <p className="text-xl font-semibold tracking-tight sm:text-2xl">DYSCOVER</p>
              <p className="text-[0.7rem] font-medium text-dysGray/80 dark:text-cream/80">
                Inclusive dyslexia support.
              </p>
            </div>
          </Link>

          <div className="flex items-center gap-4">
            <div className="hidden items-center gap-5 rounded-full bg-white/70 px-5 py-2 text-sm font-medium text-softSlate shadow-sm dark:bg-softSlate/80 dark:text-cream sm:flex">
              <Link
                to="/"
                className="dys-focus rounded-full px-1.5 py-0.5 hover:bg-accentSoft/70 hover:text-ink"
              >
                Home
              </Link>
              <Link
                to="/upload"
                className="dys-focus rounded-full px-1.5 py-0.5 hover:bg-accentSoft/70 hover:text-ink"
              >
                Upload
              </Link>
              <Link
                to="/dashboard"
                className="dys-focus rounded-full px-1.5 py-0.5 hover:bg-accentSoft/70 hover:text-ink"
              >
                Progress
              </Link>
            </div>
            <Link
              to="/login"
              className="hidden rounded-full border border-dysGray/30 bg-white/90 px-4 py-2 text-sm font-semibold text-softSlate shadow-sm transition hover:bg-cream/90 dark:border-white/25 dark:bg-softSlate/80 dark:text-cream dark:hover:bg-[#343949] sm:inline-flex dys-focus"
            >
              Log in
            </Link>
            <ThemeToggle />
          </div>
        </nav>
      </header>

      <main className="flex w-full flex-col gap-10 px-4 pb-16 pt-8 sm:px-6 sm:pt-12 lg:flex-row lg:items-stretch">
        <section className="flex flex-1 flex-col justify-center gap-6 max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-dysGray/20 bg-white/80 px-3 py-1 text-xs font-medium text-softSlate shadow-sm dark:border-white/20 dark:bg-softSlate/70 dark:text-cream">
            <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-accent/90 text-[0.65rem] text-white">
              ●
            </span>
            Built for dyslexic learners in Indian classrooms
          </div>

          <div className="space-y-3">
            <h1 className="max-w-xl text-3xl font-semibold tracking-tight text-ink sm:text-4xl lg:text-5xl dark:text-cream">
              Turn tricky text into a calm, guided reading journey.
            </h1>
            <p className="max-w-xl text-sm sm:text-base text-softSlate dark:text-cream/90">
              DysCover AI gently screens for dyslexia and reshapes notes into audio-first, visually
              clear lessons—so students focus on understanding, not just decoding letters.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/upload"
              className="dys-focus inline-flex items-center justify-center rounded-full bg-accent px-6 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-accent/90"
            >
              Start a demo session
            </Link>
            <Link
              to="/dashboard"
              className="dys-focus inline-flex items-center justify-center rounded-full border border-dysGray/30 bg-white/80 px-5 py-2.5 text-sm font-semibold text-softSlate transition hover:bg-cream/80 dark:border-white/25 dark:bg-softSlate/70 dark:text-cream"
            >
              View sample progress
            </Link>
          </div>

         
        </section>

        <section className="flex flex-1 flex-col gap-4 items-stretch">
          <div className="w-full">
            <ProgressCalendar />
          </div>
        </section>
      </main>

      <section className="px-4 pb-12 sm:px-6">
        <div className="mx-auto max-w-lg dys-surface relative overflow-hidden p-4 sm:p-5">
          <div className="mb-3 flex items-center justify-between gap-3">
            <p className="text-sm font-semibold text-softSlate dark:text-cream">
              Today&apos;s reading coach
            </p>
            <span className="rounded-full bg-accentSoft px-3 py-1 text-xs font-medium text-softSlate dark:bg-accentSoft/90">
              Demo mode
            </span>
          </div>

          <div className="space-y-3 rounded-2xl bg-cream/70 p-3 text-sm text-softSlate shadow-inner dark:bg-[#272A38] dark:text-cream/90">
            <div className="flex items-start gap-2">
              <div className="mt-1 h-2 w-2 rounded-full bg-accent" />
              <p>
                &ldquo;We&apos;ll read this in small, easy steps. You can listen, follow the words,
                and pause whenever you need.&rdquo;
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <button
                type="button"
                className="dys-focus inline-flex items-center gap-1 rounded-full bg-softSlate px-3 py-1.5 font-medium text-cream shadow-sm transition hover:bg-softSlate/90"
              >
                ▶ Play sample audio
              </button>
              <button
                type="button"
                className="dys-focus inline-flex items-center gap-1 rounded-full border border-dysGray/30 bg-white/80 px-3 py-1.5 font-medium text-softSlate transition hover:bg-cream/80 dark:border-white/25 dark:bg-softSlate/70 dark:text-cream"
              >
                Aa Slow &amp; spaced text
              </button>
            </div>
          </div>

          <p className="mt-3 text-xs text-dysGray/80 dark:text-cream/80">
            This is a visual preview only. Future backend will plug in real handwriting analysis,
            simplified text, and quizzes.
          </p>
        </div>
      </section>

      <footer className="mt-0 bg-[#121218] py-10 text-cream">
        <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 sm:flex-row sm:items-start sm:justify-between sm:px-6">
          <div className="max-w-3xl space-y-3">
            <p className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              DYSCOVER
            </p>
            <p className="text-sm leading-relaxed text-cream/85 sm:text-base">
              DysCover AI is an inclusive learning platform that detects early signs of dyslexia and
              transforms educational content into accessible, adaptive formats to improve reading,
              comprehension, and confidence.
            </p>
          </div>

          <div className="space-y-2 text-right sm:text-left sm:min-w-[220px]">
            <p className="text-sm font-semibold text-cream/90">Still have questions?</p>
            <p className="text-xs text-cream/70">Email us at</p>
            <a
              href="mailto:bhavsingh2911@gmail.com"
              className="inline-flex items-center justify-end gap-2 text-sm font-semibold text-white sm:justify-start"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-cream/10 text-lg">
                ✉
              </span>
              <span>bhavsingh2911@gmail.com</span>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;


