import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

const ActivityHeatmap = ({ data = [], totalActiveDays = 0, maxStreak = 0 }) => {
    // Build a map of date-string to activity count
    const activityMap = useMemo(() => {
        const map = {};
        data.forEach(item => {
            const date = new Date(item.date?.toDate ? item.date.toDate() : item.date);
            // Use local date string (YYYY-MM-DD) to avoid UTC shifts
            const key = date.getFullYear() + '-' +
                String(date.getMonth() + 1).padStart(2, '0') + '-' +
                String(date.getDate()).padStart(2, '0');
            map[key] = (map[key] || 0) + 1;
        });
        return map;
    }, [data]);

    // Generate the last 365 days
    const calendarData = useMemo(() => {
        const days = [];
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        for (let i = 364; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(today.getDate() - i);
            const key = date.getFullYear() + '-' +
                String(date.getMonth() + 1).padStart(2, '0') + '-' +
                String(date.getDate()).padStart(2, '0');
            days.push({
                date,
                key,
                count: activityMap[key] || 0
            });
        }
        return days;
    }, [activityMap]);

    // Group into weeks (columns)
    const weeks = useMemo(() => {
        const result = [];
        let currentWeek = [];

        // Adjust first day to align with day of week if needed, but for simplicity we show raw blocks
        calendarData.forEach((day, index) => {
            currentWeek.push(day);
            if (currentWeek.length === 7 || index === calendarData.length - 1) {
                result.push(currentWeek);
                currentWeek = [];
            }
        });
        return result;
    }, [calendarData]);

    const getColor = (count) => {
        if (count === 0) return 'bg-dysGray/10 dark:bg-white/5';
        if (count === 1) return 'bg-orange-500/30';
        if (count === 2) return 'bg-orange-500/60';
        return 'bg-orange-500';
    };

    const monthLabels = useMemo(() => {
        const labels = [];
        let lastMonth = -1;

        weeks.forEach((week, weekIndex) => {
            const firstDay = week[0]?.date;
            if (firstDay && firstDay.getMonth() !== lastMonth) {
                labels.push({
                    label: firstDay.toLocaleDateString('en-US', { month: 'short' }),
                    index: weekIndex
                });
                lastMonth = firstDay.getMonth();
            }
        });
        return labels;
    }, [weeks]);

    return (
        <div className="rounded-3xl border border-dysGray/10 bg-white/50 p-6 dark:bg-white/5 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-sm font-bold text-ink/60 dark:text-cream/60 uppercase tracking-widest">
                    {data.length} submissions in the past year
                </h3>
                <div className="flex gap-6 text-xs font-medium text-ink/60 dark:text-cream/60">
                    <span>Total active days: <b className="text-ink dark:text-white">{totalActiveDays}</b></span>
                    <span>Max streak: <b className="text-ink dark:text-white">{maxStreak}</b></span>
                </div>
            </div>

            <div className="relative">
                {/* Month Labels */}
                <div className="flex mb-2 text-[10px] text-dysGray font-medium">
                    {monthLabels.map((m, i) => (
                        <div
                            key={i}
                            className="absolute"
                            style={{ left: `${(m.index / weeks.length) * 100}%` }}
                        >
                            {m.label}
                        </div>
                    ))}
                    <div className="h-4" /> {/* Spacer */}
                </div>

                {/* Heatmap Grid */}
                <div className="flex gap-1.5 h-32 overflow-hidden">
                    {weeks.map((week, wi) => (
                        <div key={wi} className="flex flex-col gap-1.5 flex-1">
                            {week.map((day) => (
                                <motion.div
                                    key={day.key}
                                    whileHover={{ scale: 1.2, zIndex: 10 }}
                                    className={`w-full aspect-square rounded-[3px] ${getColor(day.count)} transition-colors cursor-pointer`}
                                    title={`${day.key}: ${day.count} sessions`}
                                />
                            ))}
                        </div>
                    ))}
                </div>
            </div>

            <div className="mt-4 flex items-center justify-end gap-2 text-[10px] text-dysGray font-medium">
                <span>Less</span>
                <div className="flex gap-1">
                    <div className="w-3 h-3 rounded-[2px] bg-dysGray/10 dark:bg-white/5" />
                    <div className="w-3 h-3 rounded-[2px] bg-orange-500/30" />
                    <div className="w-3 h-3 rounded-[2px] bg-orange-500/60" />
                    <div className="w-3 h-3 rounded-[2px] bg-orange-500" />
                </div>
                <span>More</span>
            </div>
        </div>
    );
};

export default ActivityHeatmap;
