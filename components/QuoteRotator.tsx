'use client';

import { useState, useEffect } from "react";
import { quotes } from "@/data/siteData";

export default function QuoteRotator() {
    const [quoteIndex, setQuoteIndex] = useState(0);

    useEffect(() => {
        const t = setInterval(() => setQuoteIndex((i) => (i + 1) % quotes.length), 5500);
        return () => clearInterval(t);
    }, []);

    return (
        <div className="bg-[#E8550A] py-20 relative overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-8">
                <span
                    className="text-white select-none"
                    style={{ fontFamily: "'Tiro Devanagari Sanskrit', serif", fontSize: "55vw", lineHeight: 1 }}
                >
                    ॐ
                </span>
            </div>
            <div className="relative z-10 max-w-4xl mx-auto px-8 text-center">
                <div
                    className="text-white/30 text-7xl leading-none mb-4 select-none"
                    style={{ fontFamily: "Georgia, serif" }}
                >
                    &ldquo;
                </div>
                <blockquote
                    className="text-white text-2xl md:text-3xl font-medium italic mb-6 leading-relaxed min-h-[5rem] flex items-center justify-center"
                    style={{ fontFamily: "'EB Garamond', serif" }}
                >
                    {quotes[quoteIndex].text}
                </blockquote>
                <cite
                    className="text-white/70 text-xs tracking-[0.25em] uppercase not-italic block mb-8"
                    style={{ fontFamily: "'Cinzel', serif" }}
                >
                    — {quotes[quoteIndex].author}
                </cite>
                <div className="flex justify-center items-center gap-2">
                    {quotes.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setQuoteIndex(i)}
                            aria-label={`Go to slide ${i + 1}`}
                            className={`rounded-full transition-all duration-300 ${i === quoteIndex ? "bg-white w-6 h-2" : "bg-white/40 w-2 h-2 hover:bg-white/70"
                                }`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}