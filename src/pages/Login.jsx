import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Login = () => {
  const [role, setRole] = useState('teacher');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!email.trim() || !password.trim()) {
      setMessage('Please enter your email and password to continue.');
      return;
    }

    // Placeholder for future backend integration
    setMessage('This is a demo login. Secure authentication will be added soon.');
  };

  return (
    <div className="flex min-h-screen flex-col bg-cream/90 text-ink dark:bg-[#1E2029] dark:text-cream">
      <header className="border-b border-dysGray/15 bg-cream/90 px-4 py-3 sm:px-6 dark:border-white/10 dark:bg-[#1E2029]/95">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <Link to="/" className="flex items-center gap-2 dys-focus">
            <img
              src="/FAVICON_DYSCOVER.png"
              alt="DYSCOVER logo"
              className="h-8 w-8 rounded-xl object-contain sm:h-9 sm:w-9"
            />
            <span className="text-sm font-semibold tracking-tight sm:text-base">DYSCOVER</span>
          </Link>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-5xl flex-1 items-center px-4 py-10 sm:px-6">
        <div className="grid w-full gap-8 lg:grid-cols-[minmax(0,1.1fr),minmax(0,0.9fr)]">
          <section className="hidden flex-col justify-center gap-4 text-softSlate dark:text-cream/90 lg:flex">
            <p className="inline-flex max-w-xs items-center gap-2 rounded-full bg-white/80 px-3 py-1 text-xs font-medium text-softSlate shadow-sm dark:bg-softSlate/70 dark:text-cream">
              <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-accent/90 text-[0.65rem] text-white">
                ●
              </span>
              Calm, low-stress login for learners and teachers
            </p>
            <h1 className="text-3xl font-semibold tracking-tight text-ink dark:text-cream">
              Welcome back to a calmer reading journey.
            </h1>
            <p className="max-w-md text-sm leading-relaxed">
              Use this space to step into DysCover, where reading support, gentle tracking, and
              accessible layouts are designed for dyslexic learners in real classrooms.
            </p>
          </section>

          <section className="dys-surface w-full max-w-md justify-self-end p-5 sm:p-6">
            <h2 className="text-xl font-semibold tracking-tight text-ink dark:text-cream">
              Log in
            </h2>
            <p className="mt-1 text-xs text-dysGray/80 dark:text-cream/75">
              Choose your role, then enter your details. This is a demo – passwords are not stored.
            </p>

            <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
              <div className="flex gap-2 text-xs font-medium text-softSlate dark:text-cream/90">
                {['teacher', 'parent', 'student'].map((option) => {
                  const isActive = role === option;
                  const label = option.charAt(0).toUpperCase() + option.slice(1);
                  return (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setRole(option)}
                      className={`flex-1 rounded-full px-3 py-1.5 transition dys-focus ${
                        isActive
                          ? 'bg-softSlate text-cream shadow-sm'
                          : 'border border-dysGray/30 bg-white/80 text-softSlate dark:border-white/25 dark:bg-softSlate/70 dark:text-cream'
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>

              <label className="block text-sm">
                <span className="text-softSlate dark:text-cream">Email</span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-dysGray/30 bg-white/90 px-3 py-2 text-sm text-softSlate shadow-sm outline-none placeholder:text-dysGray/60 focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-cream dark:border-white/20 dark:bg-softSlate/70 dark:text-cream dark:focus-visible:ring-offset-[#1E2029]"
                  placeholder="you@example.com"
                  autoComplete="email"
                />
              </label>

              <label className="block text-sm">
                <span className="text-softSlate dark:text-cream">Password</span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-dysGray/30 bg-white/90 px-3 py-2 text-sm text-softSlate shadow-sm outline-none placeholder:text-dysGray/60 focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-cream dark:border-white/20 dark:bg-softSlate/70 dark:text-cream dark:focus-visible:ring-offset-[#1E2029]"
                  placeholder="Enter a secure password"
                  autoComplete="current-password"
                />
              </label>

              <button
                type="submit"
                className="mt-2 inline-flex w-full items-center justify-center rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-accent/90 dys-focus"
              >
                Continue as {role}
              </button>

              {message && (
                <p className="mt-2 text-xs text-dysGray/80 dark:text-cream/80" role="status">
                  {message}
                </p>
              )}
            </form>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Login;


