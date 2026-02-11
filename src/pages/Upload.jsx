import React from 'react';
import { Link } from 'react-router-dom';

const Upload = () => {
  return (
    <div className="flex min-h-screen flex-col bg-cream/90 text-ink dark:bg-[#1E2029] dark:text-cream">
      <header className="border-b border-dysGray/15 bg-cream/90 px-4 py-3 sm:px-6 dark:border-white/10 dark:bg-[#1E2029]/95">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <Link to="/" className="flex items-center gap-2 dys-focus">
            <div className="flex h-8 w-8 items-center justify-center rounded-2xl bg-accentSoft text-sm font-semibold text-softSlate">
              Dy
            </div>
            <span className="text-sm font-semibold tracking-tight">DysCover AI</span>
          </Link>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-4 py-8 sm:px-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-ink dark:text-cream">
              Start a demo upload
            </h1>
            <p className="mt-1 text-sm text-dysGray/80 dark:text-cream/80">
              This is a calm preview of the future upload flow. No files are actually sent anywhere
              yet.
            </p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-[1.3fr,1fr]">
          <section className="dys-surface p-4 sm:p-5">
            <div className="flex gap-2 text-xs font-medium text-softSlate dark:text-cream/90">
              <button
                type="button"
                className="flex-1 rounded-full bg-softSlate px-3 py-1.5 text-cream shadow-sm"
              >
                Handwriting photo
              </button>
              <button
                type="button"
                className="flex-1 rounded-full border border-dysGray/30 bg-white/80 px-3 py-1.5 dark:border-white/25 dark:bg-softSlate/70 dark:text-cream"
              >
                Notes / text / PDF
              </button>
            </div>

            <div className="mt-4 rounded-2xl border border-dysGray/20 border-dashed bg-white/80 p-6 text-left text-sm text-dysGray/80 dark:border-white/20 dark:bg-softSlate/60 dark:text-cream/90">
              <p className="font-medium">Drop a sample here (visual only)</p>
              <p className="mt-1 text-xs">
                In the full app, this is where handwriting and notes will be analysed by Gemini.
              </p>
            </div>
          </section>

          <section className="dys-surface p-4 sm:p-5 text-sm text-softSlate dark:text-cream/90">
            <h2 className="text-sm font-semibold text-ink dark:text-cream">
              What happens next?
            </h2>
            <ol className="mt-2 space-y-1 text-xs sm:text-sm">
              <li>1. Gemini checks for gentle signs of dyslexia (spacing, reversals, etc.).</li>
              <li>2. Text is simplified, spaced out, and made ready for audio narration.</li>
              <li>3. Student views it in a calm reader with audio and quick quiz.</li>
            </ol>
            <p className="mt-3 text-xs text-dysGray/80 dark:text-cream/80">
              Today, you can explore the UI. Later, the backend will plug into this same screen.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Upload;


