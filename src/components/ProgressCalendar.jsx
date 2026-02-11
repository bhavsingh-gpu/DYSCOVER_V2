import React from 'react';

const levelClasses = [
  'bg-white/90 dark:bg-[#1E2230]',
  'bg-dysGray/10 dark:bg-cream/10',
  'bg-accentSoft/80 dark:bg-accentSoft/80',
  'bg-accent/90 text-white shadow-sm dark:bg-accent/95'
];

const weekdayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

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
  const monthData = React.useMemo(() => buildMonthMatrix(), []);
  const [levels, setLevels] = React.useState({});
  const [selectedKey, setSelectedKey] = React.useState(null);
  const [hoveredKey, setHoveredKey] = React.useState(null);
  const [tooltip, setTooltip] = React.useState(null);

  const handleDayClick = (date) => {
    if (!date) return;
    const key = date.toISOString().slice(0, 10);
    setLevels((prev) => {
      const current = prev[key] ?? 0;
      const next = (current + 1) % 4;
      return {
        ...prev,
        [key]: next
      };
    });
    setSelectedKey(key);
  };

  const clearTooltip = () => setTooltip(null);

  return (
    <section
      aria-label="Reading practice calendar for the current month"
      className="relative dys-surface flex flex-col gap-5 rounded-3xl border border-slate-700/60 bg-gradient-to-br from-cream/80 via-white/90 to-accentSoft/40 p-6 text-softSlate shadow-lg/40 transition-transform transition-shadow duration-200 hover:-translate-y-1 hover:border-orange-400 hover:shadow-[0_0_32px_rgba(249,115,22,0.45)] sm:p-7 dark:from-[#262938] dark:via-[#262938] dark:to-softSlate/60 dark:text-cream"
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
            {[0, 1, 2, 3].map((lvl) => (
              <span
                key={lvl}
                className={`h-3 w-3 rounded-md ${levelClasses[lvl]}`}
                aria-hidden="true"
              />
            ))}
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

              const key = date.toISOString().slice(0, 10);
              const level = levels[key] ?? 0;
              const isSelected = selectedKey === key;

              const label = date.toLocaleDateString('en-IN', {
                weekday: 'long',
                month: 'short',
                day: 'numeric'
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
                        ? 'No practice logged — a gentle rest day.'
                        : `Level ${level} — calm practice here.`;
                    setTooltip({
                      x: event.clientX + 12,
                      y: event.clientY + 16,
                      label,
                      levelText
                    });
                  }}
                  onMouseMove={(event) => {
                    if (!hoveredKey) return;
                    setTooltip((prev) =>
                      prev
                        ? {
                            ...prev,
                            x: event.clientX + 12,
                            y: event.clientY + 16
                          }
                        : prev
                    );
                  }}
                  onMouseLeave={() => {
                    setHoveredKey(null);
                    clearTooltip();
                  }}
                  className={`flex h-10 sm:h-12 w-full items-center justify-start rounded-xl border border-dysGray/20 px-3 text-sm font-medium transition-transform dys-focus hover:scale-[1.03] ${levelClasses[level]} ${
                    isSelected ? 'ring-2 ring-accent ring-offset-[1px]' : ''
                  } dark:border-white/15`}
                  aria-label={`${label} – ${level} practice level`}
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

      {tooltip && (
        <div
          className="pointer-events-none fixed z-30 max-w-xs rounded-xl bg-white/95 px-3 py-2 text-xs text-softSlate shadow-lg ring-1 ring-dysGray/15 dark:bg-[#1F2230] dark:text-cream dark:ring-white/10"
          style={{ left: tooltip.x, top: tooltip.y }}
        >
          <p className="font-semibold">{tooltip.label}</p>
          <p className="mt-1 text-[0.75rem] text-dysGray/90 dark:text-cream/80">
            {tooltip.levelText}
          </p>
        </div>
      )}
    </section>
  );
};

export default ProgressCalendar;