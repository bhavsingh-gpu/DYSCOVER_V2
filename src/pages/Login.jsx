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
    <div className="flex min-h-screen flex-col bg-[#050816] text-cream">
      <header className="border-b border-white/10 bg-[#050816]/95 px-4 py-4 sm:px-8">
        <div className="mx-auto flex max-w-6xl items-center gap-2">
          <Link to="/" className="flex items-center gap-2 dys-focus">
            <img
              src="/FAVICON_DYSCOVER.png"
              alt="DYSCOVER logo"
              className="h-9 w-9 rounded-xl object-contain sm:h-10 sm:w-10"
            />
            <span className="text-sm font-semibold tracking-tight sm:text-base">DYSCOVER</span>
          </Link>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-6xl flex-1 items-center px-4 py-10 sm:px-8">
        <div className="grid w-full items-center gap-12 lg:grid-cols-2">
          {/* Left: login card */}
          <section className="w-full max-w-lg rounded-3xl border border-white/10 bg-[#050814] p-7 text-cream shadow-2xl sm:p-8">
            <h2 className="text-2xl font-semibold tracking-tight text-cream sm:text-3xl">
              Log in
            </h2>
            <p className="mt-1 text-xs text-cream/70">
              Choose your role, then enter your details. This is a demo – passwords are not stored.
            </p>

            <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
              <div className="flex gap-2 text-xs font-medium text-cream/90">
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
                          ? 'bg-white text-[#050816] shadow-sm'
                          : 'border border-white/15 bg-transparent text-cream/80 hover:border-white/30'
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>

              <label className="block text-sm">
                <span className="text-cream">Email</span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-sm text-cream shadow-sm outline-none placeholder:text-cream/40 focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-[#050816]"
                  placeholder="you@example.com"
                  autoComplete="email"
                />
              </label>

              <label className="block text-sm">
                <span className="text-cream">Password</span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-sm text-cream shadow-sm outline-none placeholder:text-cream/40 focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-[#050816]"
                  placeholder="Enter a secure password"
                  autoComplete="current-password"
                />
              </label>

              <button
                type="submit"
                className="mt-4 inline-flex w-full items-center justify-center rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-accent/90 dys-focus"
              >
                Continue as {role}
              </button>

              {message && (
                <p className="mt-2 text-xs text-cream/75" role="status">
                  {message}
                </p>
              )}
            </form>
          </section>

          {/* Right: hero panel with blur + favicon */}
          <section className="relative hidden h-full min-h-[360px] flex-col justify-center gap-5 text-left text-cream lg:flex">
            {/* Blurred glow background */}
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute inset-0 flex items-center justify-center">
                <img
                  src="/FAVICON_DYSCOVER.png"
                  alt="DYSCOVER background mark"
                  className="h-64 w-64 opacity-15 blur-md"
                />
              </div>
              <div className="absolute -right-10 top-10 h-64 w-64 rounded-full bg-gradient-to-tr from-orange-400/45 via-amber-300/30 to-emerald-300/20 blur-2xl" />
              <div className="absolute right-16 bottom-8 h-52 w-52 rounded-full bg-gradient-to-tr from-emerald-300/18 via-sky-400/22 to-orange-400/26 blur-2xl" />
            </div>

            <div className="relative z-10 flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5 ring-1 ring-white/15 shadow-lg">
                <img
                  src="/FAVICON_DYSCOVER.png"
                  alt="DYSCOVER mark"
                  className="h-10 w-10 rounded-xl object-contain"
                />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cream/70">
                  Welcome to DYSCOVER
                </p>
                <p className="text-sm text-cream/70">
                  Calm support for dyslexic learners, teachers, and families.
                </p>
              </div>
            </div>

            <div className="relative z-10 mt-4 space-y-3">
              <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                Welcome back.
              </h1>
              <p className="max-w-md text-sm leading-relaxed text-cream/80">
                DYSCOVER turns dense notes into calmer, audio‑first reading experiences. It tracks
                practice gently, highlights progress without pressure, and keeps every screen soft
                and predictable for dyslexic learners.
              </p>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Login;


