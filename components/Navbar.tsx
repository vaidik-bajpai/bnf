'use client';

import { useState, useEffect } from "react";
import { Menu, X, Plus, User as UserIcon, LogOut } from "lucide-react";
import { AshokaCakra, NationalEmblemLogo, TricolorStripe } from "./Symbols";
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
    const [currentSection, setCurrentSection] = useState<string>("home");

    useEffect(() => {
        const onScroll = () => {
            const y = window.scrollY;
            setScrolled(y > 50);

            if (pageState.view !== "home") return;

            // When near top, section is home
            if (y < 200) {
                setCurrentSection("home");
                return;
            }

            // Check sections by visibility from bottom to top
            const sections = ["about", "forum", "ideas", "awakening", "heritage"];
            for (const id of sections) {
                const el = document.getElementById(id);
                if (el) {
                    const top = el.getBoundingClientRect().top;
                    if (top <= 250) {
                        setCurrentSection(id);
                        return;
                    }
                }
            }
            setCurrentSection("home");
        };

        window.addEventListener("scroll", onScroll, { passive: true });
        onScroll();
        return () => window.removeEventListener("scroll", onScroll);
    }, [pageState.view]);

    // True only when on landing page AND viewing the home/hero section
    const isHomeSection = pageState.view === "home" && !user && currentSection === "home";

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled || !isHomeSection ? "bg-[#0F1C3F]/97 backdrop-blur-md shadow-xl" : "bg-transparent"
                }`}
        >
            <TricolorStripe />
            <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                {/* 1. Left: Brand Logo & Title with smooth expand/slide/fade transition */}
                <div className="flex items-center mr-6 lg:mr-8 xl:mr-10 shrink-0">
                    <button
                        onClick={() => {
                            if (user) onNavigate({ view: "forum" });
                            else if (pageState.view !== "home") onNavigate({ view: "home" });
                            else window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                        className="flex items-center gap-3 text-left cursor-pointer group shrink-0"
                        title="BHARAT-GANRAJYA Nationalists Front"
                    >
                        <NationalEmblemLogo className="w-12 h-10 transition-transform group-hover:scale-105 shrink-0 drop-shadow-[0_2px_8px_rgba(0,229,255,0.4)]" />
                        <div
                            className={`whitespace-nowrap transition-all duration-500 overflow-hidden ${
                                isHomeSection
                                    ? "max-w-0 opacity-0 -translate-x-3 pointer-events-none"
                                    : "max-w-[340px] opacity-100 translate-x-0"
                            }`}
                        >
                            <div
                                className="text-white font-bold text-xs sm:text-sm tracking-[0.15em] uppercase leading-tight truncate"
                                style={{ fontFamily: "'Fraunces', serif" }}
                            >
                                BHARAT-GANRAJYA Nationalists Front
                            </div>
                        </div>
                    </button>
                </div>

                {/* 2. Center / Nav Items: Smoothly transitions between stretched and centered */}
                <div
                    className={`hidden lg:flex flex-1 items-center transition-all duration-500 ease-in-out ${
                        isHomeSection
                            ? "justify-end gap-10 mr-8 xl:mr-12"
                            : "justify-center gap-8 xl:gap-11 mr-4 xl:mr-8"
                    }`}
                >
                    {user ? (
                        <>
                            <button
                                onClick={() => onNavigate({ view: "forum" })}
                                className={`text-xs font-semibold tracking-[0.18em] uppercase transition-colors cursor-pointer py-1 border-b-2 ${pageState.view === "forum"
                                    ? "text-[#C8971A] border-[#C8971A]"
                                    : "text-white/70 hover:text-white border-transparent"
                                    }`}
                            >
                                Discussions
                            </button>
                            <button
                                onClick={() => onNavigate({ view: "megathreads" })}
                                className={`text-xs font-semibold tracking-[0.18em] uppercase transition-colors cursor-pointer py-1 border-b-2 ${pageState.view === "megathreads"
                                    ? "text-[#C8971A] border-[#C8971A]"
                                    : "text-white/70 hover:text-white border-transparent"
                                    }`}
                            >
                                MegaThreads
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                onClick={() => {
                                    if (pageState.view !== "home") onNavigate({ view: "home" });
                                    else window.scrollTo({ top: 0, behavior: "smooth" });
                                }}
                                className={`text-xs font-semibold tracking-[0.18em] uppercase transition-colors cursor-pointer py-1 border-b-2 ${currentSection === "home" && pageState.view === "home"
                                    ? "text-[#C8971A] border-[#C8971A]"
                                    : "text-white/70 hover:text-white border-transparent"
                                    }`}
                            >
                                Home
                            </button>
                            <button
                                onClick={() => {
                                    if (pageState.view !== "home") {
                                        onNavigate({ view: "home" });
                                        setTimeout(() => onScrollToSection("awakening"), 100);
                                    } else {
                                        onScrollToSection("awakening");
                                    }
                                }}
                                className={`text-xs font-semibold tracking-[0.18em] uppercase transition-colors cursor-pointer py-1 border-b-2 ${(currentSection === "awakening" || currentSection === "heritage") && pageState.view === "home"
                                    ? "text-[#C8971A] border-[#C8971A]"
                                    : "text-white/70 hover:text-white border-transparent"
                                    }`}
                            >
                                Awakening
                            </button>
                            <button
                                onClick={() => {
                                    if (pageState.view !== "home") {
                                        onNavigate({ view: "home" });
                                        setTimeout(() => onScrollToSection("ideas"), 100);
                                    } else {
                                        onScrollToSection("ideas");
                                    }
                                }}
                                className={`text-xs font-semibold tracking-[0.18em] uppercase transition-colors cursor-pointer py-1 border-b-2 ${currentSection === "ideas" && pageState.view === "home"
                                    ? "text-[#C8971A] border-[#C8971A]"
                                    : "text-white/70 hover:text-white border-transparent"
                                    }`}
                            >
                                Ideas
                            </button>
                            <button
                                onClick={() => onNavigate({ view: "forum" })}
                                className={`text-xs font-semibold tracking-[0.18em] uppercase transition-colors cursor-pointer py-1 border-b-2 ${pageState.view === "forum"
                                    ? "text-[#C8971A] border-[#C8971A]"
                                    : "text-white/70 hover:text-white border-transparent"
                                    }`}
                            >
                                Forum
                            </button>
                            <button
                                onClick={() => {
                                    if (pageState.view !== "home") {
                                        onNavigate({ view: "home" });
                                        setTimeout(() => onScrollToSection("about"), 100);
                                    } else {
                                        onScrollToSection("about");
                                    }
                                }}
                                className={`text-xs font-semibold tracking-[0.18em] uppercase transition-colors cursor-pointer py-1 border-b-2 ${currentSection === "about" && pageState.view === "home"
                                    ? "text-[#C8971A] border-[#C8971A]"
                                    : "text-white/70 hover:text-white border-transparent"
                                    }`}
                            >
                                About
                            </button>
                        </>
                    )}
                </div>

                {/* 3. Right: Action Buttons (Discuss + Auth) */}
                <div className="shrink-0 flex items-center justify-end gap-3 sm:gap-4">
                    <button
                        onClick={() => requireAuth(onOpenNewDiscussion)}
                        className="hidden sm:flex items-center gap-1.5 bg-[#B85428] hover:bg-[#A04820] text-white text-xs font-semibold px-4 py-2.5 tracking-wide transition-colors cursor-pointer shadow-sm"
                    >
                        <Plus className="w-3.5 h-3.5" /> Discuss
                    </button>

                    {user ? (
                        <div className="flex items-center gap-2.5 border-l border-white/10 pl-3 sm:pl-4">
                            <div
                                className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold ring-1 ring-white/20"
                                style={{ backgroundColor: user.bg }}
                                title={user.email}
                            >
                                {user.initials}
                            </div>
                            <button
                                onClick={logout}
                                className="text-white/40 hover:text-white p-1 cursor-pointer transition-colors"
                                title="Sign out"
                            >
                                <LogOut className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={() => requireAuth(() => { })}
                            className="text-white/85 hover:text-white text-xs font-semibold border border-white/20 hover:border-white/40 px-3.5 py-2 rounded-xs cursor-pointer flex items-center gap-1.5 transition-colors"
                        >
                            <UserIcon className="w-3.5 h-3.5" /> Sign In
                        </button>
                    )}

                    {/* Mobile Menu Toggle */}
                    <button
                        className="lg:hidden text-white p-1.5 cursor-pointer hover:text-[#C8971A] transition-colors ml-1"
                        onClick={() => setMenuOpen((o) => !o)}
                        aria-label="Toggle navigation menu"
                    >
                        {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Navigation Drawer */}
            {menuOpen && (
                <div className="lg:hidden bg-[#0F1C3F] border-t border-white/10 px-6 py-6 space-y-5 shadow-2xl animate-in slide-in-from-top-2 duration-200">
                    <div className="flex flex-col space-y-3.5">
                        {user ? (
                            <>
                                <button
                                    onClick={() => {
                                        onNavigate({ view: "forum" });
                                        setMenuOpen(false);
                                    }}
                                    className={`text-left text-sm font-semibold tracking-wider uppercase py-2 ${pageState.view === "forum" ? "text-[#C8971A]" : "text-white/80"
                                        }`}
                                >
                                    Discussions
                                </button>
                                <button
                                    onClick={() => {
                                        onNavigate({ view: "megathreads" });
                                        setMenuOpen(false);
                                    }}
                                    className={`text-left text-sm font-semibold tracking-wider uppercase py-2 ${pageState.view === "megathreads" ? "text-[#C8971A]" : "text-white/80"
                                        }`}
                                >
                                    MegaThreads
                                </button>
                            </>
                        ) : (
                            <>
                                <button
                                    onClick={() => {
                                        onNavigate({ view: "home" });
                                        setMenuOpen(false);
                                    }}
                                    className="text-left text-md font-semibold tracking-wider uppercase text-white/80 py-2"
                                >
                                    Home
                                </button>
                                <button
                                    onClick={() => {
                                        onScrollToSection("awakening");
                                        setMenuOpen(false);
                                    }}
                                    className="text-left text-md font-semibold tracking-wider uppercase text-white/80 py-2"
                                >
                                    Awakening
                                </button>
                                <button
                                    onClick={() => {
                                        onScrollToSection("ideas");
                                        setMenuOpen(false);
                                    }}
                                    className="text-left text-md font-semibold tracking-wider uppercase text-white/80 py-2"
                                >
                                    Ideas
                                </button>
                                <button
                                    onClick={() => {
                                        onNavigate({ view: "forum" });
                                        setMenuOpen(false);
                                    }}
                                    className={`text-left text-md font-semibold tracking-wider uppercase py-2 ${pageState.view === "forum" ? "text-[#C8971A]" : "text-white/80"
                                        }`}
                                >
                                    Forum
                                </button>
                                <button
                                    onClick={() => {
                                        onScrollToSection("about");
                                        setMenuOpen(false);
                                    }}
                                    className="text-left text-md font-semibold tracking-wider uppercase text-white/80 py-2"
                                >
                                    About
                                </button>
                            </>
                        )}
                    </div>

                    <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                        <button
                            onClick={() => {
                                requireAuth(onOpenNewDiscussion);
                                setMenuOpen(false);
                            }}
                            className="flex items-center gap-1.5 bg-[#B85428] text-white text-xs font-semibold px-4 py-2.5"
                        >
                            <Plus className="w-3.5 h-3.5" /> Discuss
                        </button>

                        {!user ? (
                            <button
                                onClick={() => {
                                    requireAuth(() => { });
                                    setMenuOpen(false);
                                }}
                                className="text-white/80 text-xs font-semibold border border-white/20 px-3.5 py-2 rounded-xs"
                            >
                                Sign In
                            </button>
                        ) : (
                            <button
                                onClick={() => {
                                    logout();
                                    setMenuOpen(false);
                                }}
                                className="text-white/50 text-xs flex items-center gap-1"
                            >
                                <LogOut className="w-3.5 h-3.5" /> Sign Out
                            </button>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}