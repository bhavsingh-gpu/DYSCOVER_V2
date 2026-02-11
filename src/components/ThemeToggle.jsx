import React from 'react';

const ThemeToggle = () => {
  const [isDark, setIsDark] = React.useState(() => {
    if (typeof window === 'undefined') return false;
    return document.body.classList.contains('dark');
  });

  React.useEffect(() => {
    document.body.classList.toggle('dark', isDark);
  }, [isDark]);

  return (
    <button
      type="button"
      onClick={() => setIsDark((v) => !v)}
      className="dys-focus relative inline-flex items-center gap-2 rounded-full border border-dysGray/40 bg-white/80 px-3 py-1.5 text-sm font-medium text-softSlate shadow-sm transition hover:bg-cream/80 dark:border-white/20 dark:bg-softSlate/80 dark:text-cream dark:hover:bg-softSlate"
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <span
        className={`inline-flex h-5 w-5 items-center justify-center rounded-full text-[0.7rem] transition ${
          isDark ? 'bg-cream text-softSlate' : 'bg-softSlate text-cream'
        }`}
      >
        {isDark ? '🌙' : '☀'}
      </span>
      <span className="select-none">{isDark ? 'Calm night' : 'Soft day'}</span>
    </button>
  );
};

export default ThemeToggle;


