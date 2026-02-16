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
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-lg">
                            ✉
                        </span>
                        <span>bhavsingh2911@gmail.com</span>
                    </a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
