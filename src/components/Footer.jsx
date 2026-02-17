import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="relative z-10 bg-[#0a0e1a] border-t border-white/5 py-10 text-cream">
            <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 sm:flex-row sm:items-start sm:justify-between sm:px-6">
                <div className="max-w-3xl space-y-3">
                    <Link to="/" className="text-3xl font-semibold tracking-tight text-white sm:text-4xl hover:opacity-90 transition">
                        DYSCOVER
                    </Link>
                    <p className="text-sm leading-relaxed text-cream/70 sm:text-base">
                        DysCover AI is an inclusive learning platform that detects early signs of dyslexia and
                        transforms educational content into accessible, adaptive formats to improve reading,
                        comprehension, and confidence.
                    </p>
                </div>

                <div className="space-y-2 text-right sm:text-left sm:min-w-[220px]">
                    <p className="text-sm font-semibold text-cream/90">Still have questions?</p>
                    <p className="text-xs text-cream/50">Email us at</p>
                    <a
                        href="mailto:bhavsingh2911@gmail.com"
                        className="inline-flex items-center justify-end gap-2 text-sm font-semibold text-white sm:justify-start hover:text-orange-400 transition"
                    >
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                            </svg>
                        </span>
                        <span>bhavsingh2911@gmail.com</span>
                    </a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
