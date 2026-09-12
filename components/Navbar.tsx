'use client';

import { useState, useEffect } from "react";
import { Menu, X, Plus, User as UserIcon, LogOut } from "lucide-react";
import { AshokaCakra, TricolorStripe } from "./Symbols";
import type { PageState } from "@/types/forum";
import { useAuth } from "@/context/AuthContext";

interface NavbarProps {
    pageState: PageState;
    onNavigate: (state: PageState) => void;
    onScrollToSection: (id: string) => void;
    onOpenNewDiscussion: () => void;
}

export default function Navbar({
    pageState,
    onNavigate,
    onScrollToSection,
    onOpenNewDiscussion,
}: NavbarProps) {
    const { user, logout, requireAuth } = useAuth();
    const [menuOpen, setMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 60);
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    const isHome = pageState.view === "home";

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled || !isHome ? "bg-[#0F1C3F]/97 backdrop-blur-md shadow-xl" : "bg-transparent"
                }`}
        >
            <TricolorStripe />
            <div className="max-w-7xl mx-auto px-6 py-3.5 flex items-center justify-between">
                <button onClick={() => onNavigate({ view: "home" })} className="flex items-center gap-3 text-left cursor-pointer">
                    <AshokaCakra className="w-8 h-8 text-[#C8971A] group-hover:text-[#B85428] transition-colors" />
                    <div>
                        <div className="text-white font-bold text-sm tracking-[0.15em] uppercase leading-tight" style={{ fontFamily: "'Fraunces', serif" }}>
                            Indic Civilizational Forum
                        </div>
                        <div className="text-[#C8971A]/70 text-[10px] tracking-widest uppercase">
                            भारतीय सभ्यता संगम
                        </div>
                    </div>
                </button>

                <div className="hidden lg:flex items-center gap-6">
                    <button onClick={() => onNavigate({ view: "home" })} className="text-xs font-semibold tracking-[0.15em] uppercase text-white/65 hover:text-white cursor-pointer">Home</button>
                    <button onClick={() => onScrollToSection("heritage")} className="text-xs font-semibold tracking-[0.15em] uppercase text-white/65 hover:text-white cursor-pointer">Heritage</button>
                    <button onClick={() => onScrollToSection("ideas")} className="text-xs font-semibold tracking-[0.15em] uppercase text-white/65 hover:text-white cursor-pointer">Ideas</button>
                    <button onClick={() => onNavigate({ view: "forum" })} className={`text-xs font-semibold tracking-[0.15em] uppercase cursor-pointer ${pageState.view === "forum" ? "text-[#C8971A]" : "text-white/65 hover:text-white"}`}>Forum</button>
                    <button onClick={() => onScrollToSection("about")} className="text-xs font-semibold tracking-[0.15em] uppercase text-white/65 hover:text-white cursor-pointer">About</button>

                    <button
                        onClick={() => requireAuth(onOpenNewDiscussion)}
                        className="flex items-center gap-1.5 bg-[#B85428] hover:bg-[#A04820] text-white text-xs font-semibold px-4 py-2.5 tracking-wide transition-colors ml-2 cursor-pointer"
                    >
                        <Plus className="w-3.5 h-3.5" /> Discuss
                    </button>

                    {user ? (
                        <div className="flex items-center gap-2.5 ml-2 border-l border-white/10 pl-4">
                            <div
                                className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold"
                                style={{ backgroundColor: user.bg }}
                                title={user.email}
                            >
                                {user.initials}
                            </div>
                            <button
                                onClick={logout}
                                className="text-white/40 hover:text-white p-1 cursor-pointer"
                                title="Sign out"
                            >
                                <LogOut className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={() => requireAuth(() => { })}
                            className="text-white/80 hover:text-white text-xs font-semibold border border-white/20 px-3 py-2 rounded-sm cursor-pointer ml-2 flex items-center gap-1.5"
                        >
                            <UserIcon className="w-3.5 h-3.5" /> Sign In
                        </button>
                    )}
                </div>

                <button className="lg:hidden text-white p-1 cursor-pointer" onClick={() => setMenuOpen((o) => !o)}>
                    {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>
        </nav>
    );
}