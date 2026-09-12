'use client';

import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { navLinks } from "@/data/siteData";

interface NavbarProps {
    onNavigate: (id: string) => void;
}

export default function Navbar({ onNavigate }: NavbarProps) {
    const [menuOpen, setMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 60);
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    const handleNavClick = (id: string) => {
        onNavigate(id);
        setMenuOpen(false);
    };

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? "bg-[#0D1B3E]/96 backdrop-blur-md shadow-2xl" : "bg-transparent"
                }`}
        >
            <div className="h-[3px] bg-gradient-to-r from-[#E8550A] via-[#D4A017] to-[#E8550A]" />
            <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
                <button onClick={() => handleNavClick("home")} className="flex items-center gap-3 group text-left">
                    <span
                        className="text-[#FF6B1A] text-4xl leading-none select-none"
                        style={{ fontFamily: "'Tiro Devanagari Sanskrit', serif" }}
                    >
                        ॐ
                    </span>
                    <div>
                        <div
                            className="text-white font-bold text-base tracking-[0.2em] uppercase leading-tight"
                            style={{ fontFamily: "'Cinzel', serif" }}
                        >
                            Sanatan Dharma Sangha
                        </div>
                        <div
                            className="text-[#D4A017] text-xs tracking-wide"
                            style={{ fontFamily: "'Tiro Devanagari Sanskrit', serif" }}
                        >
                            सनातन धर्म संघ
                        </div>
                    </div>
                </button>

                <div className="hidden lg:flex items-center gap-7">
                    {navLinks.map((l) => (
                        <button
                            key={l.id}
                            onClick={() => handleNavClick(l.id)}
                            className="text-white/75 hover:text-[#FF6B1A] text-xs tracking-[0.2em] uppercase transition-colors"
                            style={{ fontFamily: "'Cinzel', serif" }}
                        >
                            {l.label}
                        </button>
                    ))}
                    <button
                        onClick={() => handleNavClick("join")}
                        className="bg-[#E8550A] hover:bg-[#FF6B1A] text-white text-xs px-6 py-2.5 tracking-[0.15em] uppercase transition-colors ml-2"
                        style={{ fontFamily: "'Cinzel', serif" }}
                    >
                        Join Now
                    </button>
                </div>

                <button
                    className="lg:hidden text-white p-1"
                    onClick={() => setMenuOpen((o) => !o)}
                    aria-label="Toggle menu"
                >
                    {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>

            {menuOpen && (
                <div className="lg:hidden bg-[#0D1B3E]/98 px-6 py-6 flex flex-col gap-1 border-t border-white/10">
                    {navLinks.map((l) => (
                        <button
                            key={l.id}
                            onClick={() => handleNavClick(l.id)}
                            className="text-white/75 hover:text-[#FF6B1A] text-left py-3 text-sm tracking-[0.15em] uppercase border-b border-white/10 transition-colors"
                            style={{ fontFamily: "'Cinzel', serif" }}
                        >
                            {l.label}
                        </button>
                    ))}
                    <button
                        onClick={() => handleNavClick("join")}
                        className="mt-4 bg-[#E8550A] text-white py-3 text-sm tracking-[0.2em] uppercase"
                        style={{ fontFamily: "'Cinzel', serif" }}
                    >
                        Join the Sangha
                    </button>
                </div>
            )}
        </nav>
    );
}