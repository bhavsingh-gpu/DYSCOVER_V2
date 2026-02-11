import React from 'react';
import { Link } from 'react-router-dom';
import ProgressCalendar from '../components/ProgressCalendar.jsx';
import ThemeToggle from '../components/ThemeToggle.jsx';

const Home = () => {
  return (
    <div className="min-h-screen bg-[#f6f1e6] text-ink transition-colors dark:bg-[#1E2029] dark:text-cream">
      <header className="sticky top-0 z-20 border-b border-dysGray/20 bg-gradient-to-b from-[#fbf7ee] to-[#e6dcc8] shadow-sm backdrop-blur-md dark:border-white/10 dark:from-[#1E2029]/95 dark:to-[#242736]">
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
        <section className="flex flex-1 flex-col justify-center gap-7 max-w-4xl pr-2 lg:pr-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-dysGray/25 bg-[#fdf7ec] px-3 py-1 text-xs font-medium text-softSlate shadow-sm dark:border-white/20 dark:bg-softSlate/70 dark:text-cream">
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

          

         
        </section>

        <section className="flex flex-1 flex-col gap-4 items-stretch">
          <div className="w-full">
            <ProgressCalendar />
          </div>
        </section>
      </main>

      <section className="px-4 pb-10 sm:px-6">
        <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-3">
          {/* Daily goal card */}
          <div className="group relative flex flex-col justify-between rounded-3xl border border-dysGray/30 bg-[#f5efe1] p-6 text-softSlate shadow-md transition-transform transition-shadow duration-200 hover:-translate-y-1 hover:border-orange-400 hover:shadow-[0_0_32px_rgba(249,115,22,0.35)] dark:border-slate-700/60 dark:bg-[#111118] dark:text-cream dark:shadow-lg/40">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#1f2937]/90 dark:bg-orange-500/25">
                <img
                  src="/ICONS/DAILY_GOAL.png"
                  alt="Daily goal icon"
                  className="h-6 w-6 object-contain"
                />
              </div>
              <div>
                <p className="text-sm font-medium text-softSlate/80 dark:text-cream/70">Daily goal</p>
                <p className="text-lg font-semibold text-ink dark:text-white">Start today&apos;s calm reading</p>
              </div>
            </div>
            <div className="mt-6 h-1.5 w-full rounded-full bg-[#e3d7c3]">
              <div className="h-full w-1/5 rounded-full bg-orange-400 transition-all duration-200 group-hover:w-2/5" />
            </div>
          </div>

          {/* Your progress card */}
          <div className="group relative flex flex-col justify-between rounded-3xl border border-dysGray/30 bg-[#f5efe1] p-6 text-softSlate shadow-md transition-transform transition-shadow duration-200 hover:-translate-y-1 hover:border-orange-400 hover:shadow-[0_0_32px_rgba(249,115,22,0.35)] dark:border-slate-700/60 dark:bg-[#111118] dark:text-cream dark:shadow-lg/40">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#1f2937]/90 dark:bg-orange-500/25">
                  <img
                    src="/ICONS/PROGRESS_ARROW.png"
                    alt="Progress icon"
                    className="h-6 w-6 object-contain"
                  />
                </div>
                <div>
                  <p className="text-sm font-medium text-softSlate/80 dark:text-cream/70">Your progress</p>
                  <p className="mt-1 text-3xl font-semibold text-ink dark:text-white">0%</p>
                  <p className="text-xs text-softSlate/70 dark:text-cream/70">Calm reading completed</p>
                </div>
              </div>
            </div>
            <div className="mt-6 h-1.5 w-full rounded-full bg-[#e3d7c3]">
              <div className="h-full w-0 rounded-full bg-orange-400 group-hover:w-1/4 transition-all duration-200" />
            </div>
          </div>

          {/* Recommended card */}
          <div className="group relative flex flex-col rounded-3xl border border-dysGray/30 bg-[#f5efe1] p-6 text-softSlate shadow-md transition-transform transition-shadow duration-200 hover:-translate-y-1 hover:border-orange-400 hover:shadow-[0_0_32px_rgba(249,115,22,0.35)] dark:border-slate-700/60 dark:bg-[#111118] dark:text-cream dark:shadow-lg/40">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#1f2937]/90 dark:bg-orange-500/25">
                  <img
                    src="/ICONS/STAR_RECOMMENDED.png"
                    alt="Recommended icon"
                    className="h-6 w-6 object-contain"
                  />
                </div>
                <div>
                  <p className="text-sm font-medium text-softSlate/80 dark:text-cream/70">Recommended</p>
                  <p className="text-base font-semibold text-ink dark:text-white">
                    Start with this gentle practice
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-auto rounded-2xl bg-[#ebe1cf] px-4 py-3 text-sm dark:bg-black/40">
              <p className="text-xs font-medium text-softSlate/80 dark:text-cream/60">Level</p>
              <p className="mt-1 text-base font-semibold text-ink dark:text-white">Calm reading · Easy</p>
            </div>
          </div>

          {/* Quick actions card */}
          <div className="group relative col-span-1 rounded-3xl border border-dysGray/30 bg-[#f5efe1] p-6 text-softSlate shadow-md transition-transform transition-shadow duration-200 hover:-translate-y-1 hover:border-orange-400 hover:shadow-[0_0_32px_rgba(249,115,22,0.35)] lg:col-span-2 dark:border-slate-700/60 dark:bg-[#111118] dark:text-cream dark:shadow-lg/40">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#1f2937]/90 dark:bg-orange-500/25">
                <img
                  src="/ICONS/BOLT_QUICK_ACTIONS.png"
                  alt="Quick actions icon"
                  className="h-6 w-6 object-contain"
                />
              </div>
              <p className="text-lg font-semibold text-ink dark:text-white">Quick actions</p>
            </div>

            <div className="space-y-3 text-sm">
              <button
                type="button"
                className="flex w-full items-center justify-between rounded-2xl bg-[#ebe1cf] px-4 py-3 text-left text-softSlate/90 transition hover:bg-[#e2d5c0] dys-focus dark:bg-black/40 dark:text-cream/90 dark:hover:bg-black/70"
              >
                <span>Browse all practice stories</span>
              </button>
              <button
                type="button"
                className="flex w-full items-center justify-between rounded-2xl bg-[#ebe1cf] px-4 py-3 text-left text-softSlate/90 transition hover:bg-[#e2d5c0] dys-focus dark:bg-black/40 dark:text-cream/90 dark:hover:bg-black/70"
              >
                <span>Upload a worksheet</span>
              </button>
            </div>
          </div>
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


