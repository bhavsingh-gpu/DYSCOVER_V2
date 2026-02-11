import React from 'react';
import { Link } from 'react-router-dom';

const Login = () => {
  return (
    <div className="flex min-h-screen flex-col bg-cream/90 text-ink dark:bg-[#1E2029] dark:text-cream">
      <header className="border-b border-dysGray/15 bg-cream/90 px-4 py-3 sm:px-6 dark:border-white/10 dark:bg-[#1E2029]/95">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <Link to="/" className="flex items-center gap-2 dys-focus">
            <div className="flex h-8 w-8 items-center justify-center rounded-2xl bg-accentSoft text-sm font-semibold text-softSlate">
              Dy
            </div>
            <span className="text-sm font-semibold tracking-tight">DysCover AI</span>
          </Link>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-4xl flex-1 items-center px-4 py-8 sm:px-6">
        <div className="dys-surface w-full max-w-md p-5 sm:p-6">
          <h1 className="text-xl font-semibold tracking-tight text-ink dark:text-cream">
            Log in (UI only)
          </h1>
          <p className="mt-1 text-sm text-dysGray/80 dark:text-cream/80">
            This screen is just a visual placeholder. Backend login will be added later.
          </p>

          <form className="mt-4 space-y-3">
            <div className="flex gap-2 text-xs font-medium text-softSlate dark:text-cream/90">
              <button
                type="button"
                className="flex-1 rounded-full bg-softSlate px-3 py-1.5 text-cream shadow-sm"
              >
                Teacher
              </button>
              <button
                type="button"
                className="flex-1 rounded-full border border-dysGray/30 bg-white/80 px-3 py-1.5 dark:border-white/25 dark:bg-softSlate/70 dark:text-cream"
              >
                Parent
              </button>
              <button
                type="button"
                className="flex-1 rounded-full border border-dysGray/30 bg-white/80 px-3 py-1.5 dark:border-white/25 dark:bg-softSlate/70 dark:text-cream"
              >
                Student
              </button>
            </div>

            <label className="block text-sm">
              <span className="text-softSlate dark:text-cream">Email</span>
              <input
                type="email"
                disabled
                className="mt-1 w-full rounded-xl border border-dysGray/30 bg-white/70 px-3 py-2 text-sm text-softSlate shadow-sm outline-none placeholder:text-dysGray/60 disabled:cursor-not-allowed disabled:bg-gray-100/60 dark:border-white/20 dark:bg-softSlate/60 dark:text-cream"
                placeholder="Coming soon"
              />
            </label>

            <label className="block text-sm">
              <span className="text-softSlate dark:text-cream">Password</span>
              <input
                type="password"
                disabled
                className="mt-1 w-full rounded-xl border border-dysGray/30 bg-white/70 px-3 py-2 text-sm text-softSlate shadow-sm outline-none placeholder:text-dysGray/60 disabled:cursor-not-allowed disabled:bg-gray-100/60 dark:border-white/20 dark:bg-softSlate/60 dark:text-cream"
                placeholder="Coming soon"
              />
            </label>
          </form>

          <p className="mt-4 text-xs text-dysGray/80 dark:text-cream/80">
            For now, use the navigation to explore the Home page and demo dashboard UI.
          </p>
        </div>
      </main>
    </div>
  );
};

export default Login;


