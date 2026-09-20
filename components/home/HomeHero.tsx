'use client';

import { ArrowRight, ChevronDown, MessageSquare } from "lucide-react";
import { LotusSmall } from "../Symbols";
import HeroSpinningWheel from "./HeroSpinningWheel";

interface HomeHeroProps {
    onViewForum: () => void;
}

const facts = [
    {
        num: "5,000+",
        label: "Years of Continuous Civilization",
        note: "From the Saraswati-Sindhu era to the Space Age — an unbroken, living civilizational story.",
    },
    {
        num: "22",
        label: "Scheduled Languages",
        note: "Home to the world's most sophisticated linguistic traditions, Paninian grammar, and living poetry.",
    },
    {
        num: "40+",
        label: "UNESCO World Heritage Sites",
        note: "From Ajanta and Ellora to Hampi and Thanjavur — monumental architectural and spiritual genius.",
    },
];

export default function HomeHero({ onViewForum }: HomeHeroProps) {
    return (
        <section id="home" className="relative min-h-screen flex flex-col justify-center items-center overflow-hidden pt-28 pb-20 px-6">
            {/* Background Image Layer */}
            <div
                className="absolute inset-0 bg-cover bg-center bg-[#0F1C3F]"
                style={{
                    backgroundImage:
                        "url('https://images.unsplash.com/photo-1587474260584-136574528ed5?w=1920&h=1080&fit=crop&auto=format')",
                }}
            />

            {/* Rich Civilizational Gradient Overlay tuned for India Gate architectural visibility */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#0A1428]/90 via-[#0F1C3F]/78 to-[#1E0C06]/80" />

            {/* Radial Glow Centered Behind Name */}
            <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] rounded-full pointer-events-none opacity-20 blur-3xl"
                style={{
                    background: "radial-gradient(circle, #C8971A 0%, #B85428 50%, transparent 75%)",
                }}
            />

            {/* Solid Spinning Ashoka Chakra with GSAP Animation */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
                <HeroSpinningWheel className="w-[85vw] h-[85vw] max-w-3xl" />
            </div>
            <div className="absolute bottom-16 right-8 sm:right-16 opacity-10 pointer-events-none">
                <LotusSmall className="w-48 h-36 text-[#C8971A]" />
            </div>
            <div className="absolute top-28 left-8 sm:left-16 opacity-10 pointer-events-none -scale-x-100">
                <LotusSmall className="w-48 h-36 text-[#C8971A]" />
            </div>

            {/* Centered Main Content Container */}
            <div className="relative z-10 max-w-5xl mx-auto text-center flex flex-col items-center mt-16">

                {/* Main Centered Website Name */}
                <h1
                    className="text-white font-bold leading-[1.06] text-center tracking-tight mb-4 drop-shadow-[0_4px_32px_rgba(0,0,0,0.9)]"
                    style={{
                        fontFamily: "'Fraunces', serif",
                        fontSize: "clamp(3.2rem, 8vw, 6.5rem)",
                    }}
                >
                    BHARAT-GANRAJYA
                    <br />
                    <span className="text-[#C8971A] drop-shadow-[0_2px_20px_rgba(200,151,26,0.6)]">
                        Nationalists Front
                    </span>
                </h1>

                {/* Sub-heading / Sanskrit Motto */}
                {/* <div className="text-white/65 text-xs sm:text-sm tracking-[0.25em] uppercase font-semibold mb-6 flex items-center gap-2 justify-center">
                    <span>भारतीय सभ्यता संगम</span>
                    <span className="text-[#C8971A]">&bull;</span>
                    <span>सत्यमेव जयते</span>
                </div> */}

                {/* Narrative Description */}
                {/* <p
                    className="text-white/75 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto mb-10"
                    style={{ fontFamily: "'Spectral', Georgia, serif" }}
                >
                    Exploring the depths of India&apos;s intellectual, artistic, and philosophical heritage — an open, rigorous forum for scholars, citizens, and thinkers across five millennia of continuous thought, statecraft, and national renewal.
                </p> */}

                {/* Centered Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 w-full max-w-md mx-auto mt-16">
                    <button
                        onClick={() => document.getElementById("heritage")?.scrollIntoView({ behavior: "smooth" })}
                        className="w-full sm:w-auto flex items-center justify-center gap-3 bg-[#B85428] hover:bg-[#A04820] text-white px-9 py-4 text-sm font-semibold tracking-wide transition-all group cursor-pointer shadow-lg shadow-[#B85428]/25 hover:shadow-xl hover:shadow-[#B85428]/35"
                    >
                        Explore Heritage
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                    </button>
                    <button
                        onClick={onViewForum}
                        className="w-full sm:w-auto flex items-center justify-center gap-2.5 border border-white/25 hover:border-[#C8971A] bg-white/5 hover:bg-[#C8971A]/10 text-white/85 hover:text-[#C8971A] px-9 py-4 text-sm font-semibold tracking-wide transition-all cursor-pointer backdrop-blur-xs"
                    >
                        <MessageSquare className="w-4 h-4 text-[#C8971A]" />
                        Enter the Forum
                    </button>
                </div>

                {/* Symmetrical 3-Card Fact Grid Across the Center */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-5xl mx-auto w-full pt-8 border-t border-white/10">
                    {facts.map((f) => (
                        <div
                            key={f.label}
                            className="bg-white/5 border border-white/10 p-6 backdrop-blur-xs hover:border-[#C8971A]/50 hover:bg-white/8 transition-all group text-center"
                        >
                            <div
                                className="text-[#C8971A] text-3xl sm:text-4xl font-bold mb-1.5 transition-transform group-hover:scale-105"
                                style={{ fontFamily: "'Fraunces', serif" }}
                            >
                                {f.num}
                            </div>
                            <div className="text-white font-semibold text-sm mb-1.5 tracking-wide">{f.label}</div>
                            <div className="text-white/45 text-xs leading-relaxed max-w-xs mx-auto">{f.note}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Bottom Bouncing Scroll Indicator */}
            <div className="relative z-10 mt-12 animate-bounce opacity-30">
                <button
                    onClick={() => document.getElementById("heritage")?.scrollIntoView({ behavior: "smooth" })}
                    className="text-white p-2 hover:text-[#C8971A] transition-colors cursor-pointer"
                    aria-label="Scroll to content"
                >
                    <ChevronDown className="w-5 h-5" />
                </button>
            </div>
        </section>
    );
}