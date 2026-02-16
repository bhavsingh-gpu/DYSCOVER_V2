import { motion, AnimatePresence } from 'framer-motion';
import { useRef, useMemo, useState, useEffect } from 'react';
import { getCurrentUser, getUserProgress, saveUserProgress } from '../services/api';

const levelClasses = [
  'bg-white/90 dark:bg-[#1E2230]',
  'bg-orange-500/90 text-white shadow-sm dark:bg-orange-600/95', // Level 1 is now Orange
  'bg-accentSoft/80 dark:bg-accentSoft/80',
  'bg-accent/90 text-white shadow-sm dark:bg-accent/95'
];

const weekdayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const levelColors = [
  'bg-slate-400/50', // No practice
  'bg-orange-500',   // Level 1 (Activity)
  'bg-orange-600',   // Level 2 (Steady)
  'bg-orange-700'    // Level 3 (Intense)
];

// Helper to get local date key YYYY-MM-DD
const getLocalDateKey = (date) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const buildMonthMatrix = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();

  const firstOfMonth = new Date(year, month, 1);
  const lastDateOfMonth = new Date(year, month + 1, 0).getDate();

  // Convert JS Sunday=0..Saturday=6 to Monday=0..Sunday=6
  const firstDayIndex = (firstOfMonth.getDay() + 6) % 7;

  const weeks = [];
  let currentDay = 1;

  while (currentDay <= lastDateOfMonth) {
    const week = [];
    for (let i = 0; i < 7; i++) {
      if (weeks.length === 0 && i < firstDayIndex) {
        week.push(null);
      } else if (currentDay > lastDateOfMonth) {
        week.push(null);
      } else {
        week.push(new Date(year, month, currentDay));
        currentDay += 1;
      }
    }
    weeks.push(week);
  }

  return {
    year,
    monthName: today.toLocaleDateString('en-IN', {
      month: 'long'
    }),
    weeks
  };
};

const ProgressCalendar = () => {
  const monthData = useMemo(() => buildMonthMatrix(), []);
  const containerRef = useRef(null);
  const [levels, setLevels] = useState({});
  const [selectedKey, setSelectedKey] = useState(null);
  const [hoveredKey, setHoveredKey] = useState(null);
  const [tooltip, setTooltip] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch data and auto-log today
  useEffect(() => {
    const user = getCurrentUser();
    if (!user?.uid) return;

    const initCalendar = async () => {
      try {
        const res = await getUserProgress(user.uid);
        const progressMap = {};
        res.progress?.forEach(p => {
          const key = getLocalDateKey(p.date);
          // Keep the highest level if multiple exists
          progressMap[key] = Math.max(progressMap[key] || 0, p.level || 0);
        });

        // Auto-log today if not already present
        const todayKey = getLocalDateKey(new Date());
        if (!progressMap[todayKey]) {
          progressMap[todayKey] = 1;
          saveUserProgress({
            date: new Date(),
            level: 1,
            practiceType: 'visit',
            notes: 'Daily visit logged'
          }).catch(e => console.error('Failed to auto-log visit:', e));
        }

        setLevels(progressMap);
      } catch (err) {
        console.error('Failed to fetch calendar progress:', err);
      } finally {
        setLoading(false);
      }
    };

    initCalendar();
  }, []);

  const handleDayClick = (date) => {
    if (!date) return;
    const key = getLocalDateKey(date);
    setSelectedKey(key);
    // Removed manual toggling of levels to ensure data integrity
    // The calendar is now a read-only reflection of activity
  };

  const clearTooltip = () => setTooltip(null);

  return (
    <section
      ref={containerRef}
      aria-label="Reading practice calendar for the current month"
      className="relative dys-surface flex flex-col gap-5 rounded-3xl border border-dysGray/30 bg-gradient-to-br from-[#f8f1e4] via-[#f3ebdd] to-[#ffe4c7] p-6 text-softSlate shadow-md transition-transform transition-shadow duration-200 hover:-translate-y-1 hover:border-orange-400 hover:shadow-[0_0_32px_rgba(249,115,22,0.35)] sm:p-7 dark:border-slate-700/60 dark:from-[#262938] dark:via-[#262938] dark:to-softSlate/60 dark:text-cream dark:shadow-lg/40"
    >
      <header className="flex items-baseline justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-dysGray/80 dark:text-cream/80">
            This month
          </p>
          <h3 className="mt-1 text-lg font-semibold text-ink dark:text-cream">
            {monthData.monthName} {monthData.year}
          </h3>
        </div>
        <div className="hidden items-center gap-1 text-xs text-dysGray/80 sm:flex dark:text-cream/80">
          <span>Rest</span>
          <div className="flex items-center gap-1">
            {[0, 1, 2, 3].map((lvl) => {
              const titles = [
                'No practice logged',
                'Calm practice (Level 1)',
                'Steady practice (Level 2)',
                'Intense practice (Level 3)'
              ];
              return (
                <span
                  key={lvl}
                  title={titles[lvl]}
                  className={`h-3 w-3 rounded-md cursor-help ${levelClasses[lvl]}`}
                  aria-hidden="true"
                />
              );
            })}
          </div>
          <span>More practice</span>
        </div>
      </header>

      <div className="space-y-3 text-xs text-softSlate dark:text-cream/90">
        <div className="grid grid-cols-7 gap-1.5">
          {weekdayLabels.map((label) => (
            <div
              key={label}
              className="px-1 py-1 text-left text-[0.65rem] font-medium text-dysGray/80 dark:text-cream/80"
            >
              {label}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1.5">
          {monthData.weeks.map((week, wi) =>
            week.map((date, di) => {
              if (!date) {
                return <div key={`empty-${wi}-${di}`} className="h-10 sm:h-12 w-full rounded-xl" />;
              }

              const key = getLocalDateKey(date);
              const level = levels[key] ?? 0;
              const isSelected = selectedKey === key;

              const labelDay = date.toLocaleDateString('en-IN', { weekday: 'long' });
              const labelDate = date.toLocaleDateString('en-IN', {
                month: 'long',
                day: 'numeric',
                year: 'numeric'
              });

              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => handleDayClick(date)}
                  onMouseEnter={(event) => {
                    setHoveredKey(key);
                    const levelText =
                      level === 0
                        ? 'Rest Day'
                        : `Practice Level ${level}`;

                    const rect = containerRef.current.getBoundingClientRect();
                    setTooltip({
                      x: event.clientX - rect.left,
                      y: event.clientY - rect.top,
                      labelDay,
                      labelDate,
                      levelText,
                      level
                    });
                  }}
                  onMouseMove={(event) => {
                    if (!hoveredKey || !containerRef.current) return;
                    const rect = containerRef.current.getBoundingClientRect();
                    setTooltip((prev) =>
                      prev
                        ? {
                          ...prev,
                          x: event.clientX - rect.left,
                          y: event.clientY - rect.top
                        }
                        : prev
                    );
                  }}
                  onMouseLeave={() => {
                    setHoveredKey(null);
                    clearTooltip();
                  }}
                  className={`flex h-10 sm:h-12 w-full items-center justify-start rounded-xl border border-dysGray/20 px-3 text-sm font-medium transition-transform dys-focus hover:scale-[1.03] ${levelClasses[level]} ${isSelected ? 'ring-2 ring-accent ring-offset-[1px]' : ''
                    } dark:border-white/15`}
                  aria-label={`${labelDay}, ${labelDate} – ${level} practice level`}
                  aria-pressed={isSelected}
                >
                  <span>{date.getDate()}</span>
                </button>
              );
            })
          )}
        </div>
      </div>

      <p className="mt-1 text-xs text-dysGray/80 dark:text-cream/80">
        Tap or hover a date to gently see and mark that day&apos;s reading practice.
      </p>

      <AnimatePresence>
        {tooltip && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 5 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 5 }}
            transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
            className="pointer-events-none absolute z-[100] flex min-w-[240px] flex-col overflow-hidden rounded-3xl border border-white/20 bg-white/10 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] backdrop-blur-2xl dark:bg-[#0a0f24]/80 dark:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.6)]"
            style={{
              left: tooltip.x + 10,
              top: tooltip.y + 10,
            }}
          >
            {/* Glossy top highlight */}
            <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent" />

            {/* Status Indicator Bar */}
            <div className={`h-1.5 w-full ${levelColors[tooltip.level]}`} />

            <div className="relative p-5 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-[0.65rem] font-black uppercase tracking-[0.25em] text-orange-500/80 dark:text-orange-400">
                  Daily Status
                </span>
                <span className={`px-2.5 py-1 rounded-full text-[0.6rem] font-black uppercase tracking-widest text-white ${levelColors[tooltip.level]} bg-opacity-30 border border-white/10`}>
                  {tooltip.levelText}
                </span>
              </div>

              <div className="space-y-0.5">
                <h4 className="text-2xl font-black italic tracking-tighter text-ink dark:text-white">
                  {tooltip.labelDay}
                </h4>
                <p className="text-sm font-bold text-softSlate/60 dark:text-cream/50">
                  {tooltip.labelDate}
                </p>
              </div>
            </div>

            {/* Background dynamic glow */}
            <div className={`absolute -left-10 -top-10 h-32 w-32 rounded-full blur-3xl opacity-30 ${levelColors[tooltip.level]}`} />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default ProgressCalendar;