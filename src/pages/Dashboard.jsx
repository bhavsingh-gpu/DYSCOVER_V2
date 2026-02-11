import React from 'react';
import { Link } from 'react-router-dom';
import ProgressCalendar from '../components/ProgressCalendar.jsx';

const Dashboard = () => {
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

      <main className="flex w-full flex-1 flex-col gap-6 px-4 py-8 sm:px-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-ink dark:text-cream">
              Demo progress dashboard
            </h1>
            <p className="mt-1 text-sm text-dysGray/80 dark:text-cream/80">
              A calm overview of a student&apos;s recent reading practice. All numbers are sample
              data for now.
            </p>
          </div>
        </div>

        <section className="grid gap-4 md:grid-cols-[1fr,1.1fr]">
          <div className="space-y-4">
            <div className="dys-surface p-4 sm:p-5 text-sm text-softSlate dark:text-cream/90">
              <p className="text-xs font-medium uppercase tracking-wide text-dysGray/80 dark:text-cream/80">
                This week
              </p>
              <div className="mt-2 grid grid-cols-3 gap-3 text-center text-xs sm:text-sm">
                <div>
                  <p className="text-2xl font-semibold text-ink dark:text-cream">4</p>
                  <p className="mt-1 text-dysGray/80 dark:text-cream/80">Reading sessions</p>
                </div>
                <div>
                  <p className="text-2xl font-semibold text-ink dark:text-cream">3</p>
                  <p className="mt-1 text-dysGray/80 dark:text-cream/80">Quizzes finished</p>
                </div>
                <div>
                  <p className="text-2xl font-semibold text-ink dark:text-cream">82%</p>
                  <p className="mt-1 text-dysGray/80 dark:text-cream/80">Avg. understanding</p>
                </div>
              </div>
            </div>

            <div className="dys-surface p-4 sm:p-5 text-xs sm:text-sm text-softSlate dark:text-cream/90">
              <p className="text-xs font-medium uppercase tracking-wide text-dysGray/80 dark:text-cream/80">
                Gentle suggestions
              </p>
              <ul className="mt-2 space-y-1">
                <li>• Keep sessions short (10–15 minutes) with one main idea at a time.</li>
                <li>• Encourage listening first, then reading along with highlighted text.</li>
                <li>• Celebrate small streaks instead of pushing for every single day.</li>
              </ul>
            </div>
          </div>

          <div className="md:justify-self-end md:w-full md:max-w-lg">
            <ProgressCalendar />
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;


