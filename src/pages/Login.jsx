import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser, signUpUser } from '../services/firebase';
import Footer from '../components/Footer';
import '../pages/Landing.css';

const Login = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState('teacher');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage({ text: '', type: '' });

    if (isSignUp && !name.trim()) {
      setMessage({ text: 'Please enter your full name.', type: 'error' });
      return;
    }

    if (!email.trim() || !password.trim()) {
      setMessage({ text: 'Please enter your email and password.', type: 'error' });
      return;
    }

    if (isSignUp && password.length < 6) {
      setMessage({ text: 'Password must be at least 6 characters.', type: 'error' });
      return;
    }

    setLoading(true);

    try {
      let result;

      if (isSignUp) {
        result = await signUpUser(email, password, role, name);
        setMessage({ text: 'Account created successfully! Redirecting...', type: 'success' });
      } else {
        result = await loginUser(email, password, role);
        setMessage({ text: 'Signed in successfully! Redirecting...', type: 'success' });
      }

      // Store user data in localStorage for the session
      localStorage.setItem('dyscover_user', JSON.stringify({
        uid: result.user.uid,
        email: result.user.email,
        role: result.backendUser?.role || role,
        displayName: result.backendUser?.name || name || result.user.displayName || ''
      }));

      // Redirect to dashboard after short delay
      setTimeout(() => {
        navigate('/home');
      }, 1000);

    } catch (error) {
      console.error('Auth error:', error);

      // Map Firebase error codes to friendly messages
      const errorMap = {
        'auth/user-not-found': 'No account found with this email. Try signing up.',
        'auth/wrong-password': 'Incorrect password. Please try again.',
        'auth/invalid-credential': 'Invalid email or password. Please try again.',
        'auth/email-already-in-use': 'An account with this email already exists. Try signing in.',
        'auth/weak-password': 'Password is too weak. Use at least 6 characters.',
        'auth/invalid-email': 'Please enter a valid email address.',
        'auth/too-many-requests': 'Too many attempts. Please wait a moment and try again.',
        'auth/network-request-failed': 'Network error. Check your internet connection.',
      };

      const friendlyMessage = errorMap[error.code] || error.message || 'Something went wrong. Please try again.';
      setMessage({ text: friendlyMessage, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col bg-[#050816] text-cream">
      {/* Particles Background */}
      <div className="fixed inset-0 z-0 particles-background">
        <div className="particles-container">
          {useMemo(() => (
            Array.from({ length: 400 }).map((_, i) => (
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

      {/* Main Content – Centered Login Card */}
      <main className="relative z-10 flex flex-1 items-center justify-center px-4 py-16">
        {/* Glow behind card */}
        <div className="absolute w-[400px] h-[400px] rounded-full bg-gradient-to-br from-orange-500/10 to-blue-500/10 blur-[100px] pointer-events-none"></div>

        <section className="relative w-full max-w-md rounded-3xl border border-white/10 bg-[#0a0f24]/80 p-8 sm:p-10 shadow-2xl backdrop-blur-md">
          {/* Logo + Title */}
          <div className="flex flex-col items-center mb-7">
            <Link to="/" className="mb-4 transition hover:opacity-80">
              <img
                src="/FAVICON_DYSCOVER.png"
                alt="DYSCOVER logo"
                className="h-14 w-14 rounded-2xl object-contain"
              />
            </Link>
            <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              {isSignUp ? 'Create Account' : 'Welcome back'}
            </h2>
            <p className="mt-1 text-sm text-cream/50">
              {isSignUp ? 'Sign up to start your learning journey' : 'Sign in to continue your learning journey'}
            </p>
          </div>

          {/* Sign In / Sign Up Toggle */}
          <div className="flex gap-2 text-xs font-medium text-cream/90 mb-5">
            <button
              type="button"
              onClick={() => { setIsSignUp(false); setMessage({ text: '', type: '' }); }}
              className={`flex-1 rounded-full px-3 py-2 transition ${!isSignUp
                ? 'bg-white/10 text-white border border-white/20'
                : 'border border-white/5 bg-transparent text-cream/50 hover:text-cream/70'
                }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setIsSignUp(true); setMessage({ text: '', type: '' }); }}
              className={`flex-1 rounded-full px-3 py-2 transition ${isSignUp
                ? 'bg-white/10 text-white border border-white/20'
                : 'border border-white/5 bg-transparent text-cream/50 hover:text-cream/70'
                }`}
            >
              Sign Up
            </button>
          </div>

          {/* Role Selector */}
          <div className="flex gap-2 text-xs font-medium text-cream/90 mb-5">
            {['teacher', 'parent', 'student'].map((option) => {
              const isActive = role === option;
              const label = option.charAt(0).toUpperCase() + option.slice(1);
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => setRole(option)}
                  className={`flex-1 rounded-full px-3 py-2 transition ${isActive
                    ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md shadow-orange-500/20'
                    : 'border border-white/10 bg-white/5 text-cream/70 hover:bg-white/10 hover:text-cream'
                    }`}
                >
                  {label}
                </button>
              );
            })}
          </div>

          {/* Form */}
          <form className="space-y-4" onSubmit={handleSubmit}>
            {isSignUp && (
              <label className="block text-sm">
                <span className="text-cream/80 font-medium">Full Name</span>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-cream shadow-sm outline-none placeholder:text-cream/30 focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 transition"
                  placeholder="Enter your full name"
                  disabled={loading}
                  required
                />
              </label>
            )}

            <label className="block text-sm">
              <span className="text-cream/80 font-medium">Email</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-cream shadow-sm outline-none placeholder:text-cream/30 focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 transition"
                placeholder="you@example.com"
                autoComplete="email"
                disabled={loading}
              />
            </label>

            <label className="block text-sm">
              <span className="text-cream/80 font-medium">Password</span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-cream shadow-sm outline-none placeholder:text-cream/30 focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 transition"
                placeholder={isSignUp ? 'Create a password (min 6 chars)' : 'Enter your password'}
                autoComplete={isSignUp ? 'new-password' : 'current-password'}
                disabled={loading}
              />
            </label>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r from-orange-500 to-orange-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-500/20 transition hover:from-orange-600 hover:to-orange-700 hover:shadow-orange-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  {isSignUp ? 'Creating Account...' : 'Signing In...'}
                </span>
              ) : (
                `${isSignUp ? 'Sign Up' : 'Continue'} as ${role.charAt(0).toUpperCase() + role.slice(1)}`
              )}
            </button>

            {/* Status Message */}
            {message.text && (
              <p
                className={`mt-2 text-center text-xs ${message.type === 'error' ? 'text-red-400' : 'text-green-400'
                  }`}
                role="status"
              >
                {message.text}
              </p>
            )}
          </form>

          {/* Back to home link */}
          <p className="mt-6 text-center text-xs text-cream/40">
            <Link to="/" className="text-cream/60 hover:text-white transition underline underline-offset-2">
              ← Back to home
            </Link>
          </p>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Login;
