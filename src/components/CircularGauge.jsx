import React from 'react';

const CircularGauge = ({ solved = 0, total = 100, label = 'Solved' }) => {
    const percentage = Math.min(100, Math.max(0, (solved / total) * 100));
    const radius = 70;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;

    return (
        <div className="flex flex-col items-center justify-center relative">
            <svg className="w-48 h-48 transform -rotate-90">
                {/* Background Track */}
                <circle
                    cx="96"
                    cy="96"
                    r={radius}
                    stroke="currentColor"
                    strokeWidth="10"
                    fill="transparent"
                    className="text-dysGray/10 dark:text-white/5"
                />
                {/* Progress Fill */}
                <circle
                    cx="96"
                    cy="96"
                    r={radius}
                    stroke="currentColor"
                    strokeWidth="10"
                    fill="transparent"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    className="text-orange-500 transition-all duration-1000 ease-out"
                />
            </svg>

            <div className="absolute flex flex-col items-center justify-center text-center">
                <span className="text-3xl font-black text-ink dark:text-white">{solved}</span>
                <span className="text-xs font-bold text-dysGray dark:text-cream/40 uppercase tracking-tighter">/ {total}</span>
                <span className="text-[10px] font-bold text-orange-500 uppercase mt-1">✓ {label}</span>
            </div>
        </div>
    );
};

export default CircularGauge;
