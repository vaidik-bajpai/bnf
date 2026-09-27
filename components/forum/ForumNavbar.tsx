'use client';

import React, { useState, useRef, useEffect } from "react";
import {
    MoreVertical,
    ChevronLeft,
    ChevronRight,
    Search,
    User as UserIcon,
    HelpCircle,
    Activity,
    Star,
    Heart,
    Bookmark,
    LogOut,
    LogIn,
    Plus,
    Flame,
    MessageSquare,
    ExternalLink,
    Compass,
    SlidersHorizontal,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import type { PageState } from "@/types/forum";
import { NationalEmblemLogo, TricolorStripe } from "../Symbols";

interface ForumNavbarProps {
    onNavigate: (state: PageState) => void;
    canGoBack?: boolean;
    canGoForward?: boolean;
    onGoBack?: () => void;
    onGoForward?: () => void;
    onOpenSearch: () => void;
    onOpenHowToUse: () => void;
    onOpenActivity: (tab?: "activity" | "favorites" | "starred" | "bookmarks") => void;
    onOpenNewDiscussion?: () => void;
}

export default function ForumNavbar({
    onNavigate,
    canGoBack = false,
    canGoForward = false,
    onGoBack,
    onGoForward,
    onOpenSearch,
    onOpenHowToUse,
    onOpenActivity,
    onOpenNewDiscussion,
}: ForumNavbarProps) {
    const { user, logout, requireAuth } = useAuth();
    const [threeDotOpen, setThreeDotOpen] = useState(false);
    const [profileMenuOpen, setProfileMenuOpen] = useState(false);
    const threeDotRef = useRef<HTMLDivElement>(null);
    const profileRef = useRef<HTMLDivElement>(null);

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (threeDotRef.current && !threeDotRef.current.contains(e.target as Node)) {
                setThreeDotOpen(false);
            }
            if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
                setProfileMenuOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleProfileClick = () => {
        if (!user) {
            requireAuth(() => {});
        } else {
            setProfileMenuOpen(!profileMenuOpen);
        }
    };

    return (
        <header
            className="fixed top-0 left-0 right-0 z-50 bg-[#070D1A]/95 backdrop-blur-md border-b border-[#C8971A]/30 shadow-lg text-white"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
        >
            <TricolorStripe />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
                {/* 1. LEFT: Three-dot menu and Back / Forward navigation buttons */}
                <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                    {/* Top Left Three-Dot Menu */}
                    <div className="relative" ref={threeDotRef}>
                        <button
                            type="button"
                            onClick={() => setThreeDotOpen(!threeDotOpen)}
                            className={`p-2 rounded-lg border transition-all cursor-pointer ${
                                threeDotOpen
                                    ? "bg-[#C8971A]/20 border-[#C8971A] text-[#E5A93C]"
                                    : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20 text-white/80 hover:text-white"
                            }`}
                            title="Forum Actions & Menus"
                            aria-label="Forum Menu"
                        >
                            <MoreVertical className="w-5 h-5" />
                        </button>

                        {/* Three-Dot Dropdown Menu */}
                        {threeDotOpen && (
                            <div className="absolute left-0 mt-2 w-64 bg-[#0B1528] border border-[#C8971A]/40 rounded-xl shadow-2xl py-2 z-50 text-xs animate-in fade-in zoom-in-95 duration-150">
                                <div className="px-3.5 py-2 border-b border-white/10 text-[10px] uppercase font-bold tracking-widest text-[#C8971A]">
                                    Forum Controls & Navigation
                                </div>

                                {/* Profile item */}
                                <button
                                    type="button"
                                    onClick={() => {
                                        setThreeDotOpen(false);
                                        if (user) onOpenActivity("activity");
                                        else requireAuth(() => onOpenActivity("activity"));
                                    }}
                                    className="w-full px-3.5 py-2.5 flex items-center gap-2.5 text-left hover:bg-white/5 text-white/90 hover:text-white transition-colors cursor-pointer"
                                >
                                    <UserIcon className="w-4 h-4 text-[#C8971A]" />
                                    <span>Profile</span>
                                </button>

                                {/* Activity Management */}
                                <button
                                    type="button"
                                    onClick={() => {
                                        setThreeDotOpen(false);
                                        onOpenActivity("activity");
                                    }}
                                    className="w-full px-3.5 py-2.5 flex items-center gap-2.5 text-left hover:bg-white/5 text-white/90 hover:text-white transition-colors cursor-pointer"
                                >
                                    <Activity className="w-4 h-4 text-emerald-400" />
                                    <span>Activity Management</span>
                                </button>

                                {/* Favorites */}
                                <button
                                    type="button"
                                    onClick={() => {
                                        setThreeDotOpen(false);
                                        onOpenActivity("favorites");
                                    }}
                                    className="w-full px-3.5 py-2.5 flex items-center gap-2.5 text-left hover:bg-white/5 text-white/90 hover:text-white transition-colors cursor-pointer"
                                >
                                    <Heart className="w-4 h-4 text-rose-400 fill-rose-400/20" />
                                    <span>Favorites</span>
                                </button>

                                {/* Starred */}
                                <button
                                    type="button"
                                    onClick={() => {
                                        setThreeDotOpen(false);
                                        onOpenActivity("starred");
                                    }}
                                    className="w-full px-3.5 py-2.5 flex items-center gap-2.5 text-left hover:bg-white/5 text-white/90 hover:text-white transition-colors cursor-pointer"
                                >
                                    <Star className="w-4 h-4 text-amber-400 fill-amber-400/20" />
                                    <span>Starred Categories</span>
                                </button>

                                {/* Bookmarks */}
                                <button
                                    type="button"
                                    onClick={() => {
                                        setThreeDotOpen(false);
                                        onOpenActivity("bookmarks");
                                    }}
                                    className="w-full px-3.5 py-2.5 flex items-center gap-2.5 text-left hover:bg-white/5 text-white/90 hover:text-white transition-colors cursor-pointer"
                                >
                                    <Bookmark className="w-4 h-4 text-blue-400 fill-blue-400/20" />
                                    <span>Saved Comments & Posts</span>
                                </button>

                                <div className="my-1 border-t border-white/10" />

                                {/* How to operate or use forum hyperlink */}
                                <button
                                    type="button"
                                    onClick={() => {
                                        setThreeDotOpen(false);
                                        onOpenHowToUse();
                                    }}
                                    className="w-full px-3.5 py-2.5 flex items-center gap-2.5 text-left bg-[#C8971A]/10 hover:bg-[#C8971A]/20 text-[#E5A93C] font-semibold transition-colors cursor-pointer"
                                >
                                    <HelpCircle className="w-4 h-4 text-[#C8971A]" />
                                    <span>How to operate or use forum</span>
                                </button>

                                <div className="my-1 border-t border-white/10" />

                                {/* Return to Main Website */}
                                <button
                                    type="button"
                                    onClick={() => {
                                        setThreeDotOpen(false);
                                        onNavigate({ view: "home" });
                                    }}
                                    className="w-full px-3.5 py-2.5 flex items-center gap-2.5 text-left hover:bg-white/5 text-white/70 hover:text-white transition-colors cursor-pointer"
                                >
                                    <Compass className="w-4 h-4 text-white/50" />
                                    <span>Main Landing Page</span>
                                </button>

                                {/* Auth item */}
                                {user ? (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setThreeDotOpen(false);
                                            logout();
                                        }}
                                        className="w-full px-3.5 py-2.5 flex items-center gap-2.5 text-left hover:bg-rose-500/10 text-rose-400 transition-colors cursor-pointer"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        <span>Sign Out ({user.name.split(" ")[0]})</span>
                                    </button>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setThreeDotOpen(false);
                                            requireAuth(() => {});
                                        }}
                                        className="w-full px-3.5 py-2.5 flex items-center gap-2.5 text-left hover:bg-[#C8971A]/15 text-[#E5A93C] transition-colors cursor-pointer"
                                    >
                                        <LogIn className="w-4 h-4" />
                                        <span>Sign In / Sign Up</span>
                                    </button>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Back and Forward navigation buttons near three-dot menu */}
                    <div className="flex items-center gap-1 bg-white/5 p-1 rounded-lg border border-white/10">
                        <button
                            type="button"
                            onClick={() => onGoBack?.()}
                            disabled={!canGoBack}
                            className={`p-1.5 rounded-md transition-colors ${
                                canGoBack
                                    ? "hover:bg-white/10 text-white cursor-pointer active:scale-95"
                                    : "opacity-30 text-white/40 cursor-not-allowed"
                            }`}
                            title="Go Back"
                            aria-label="Back"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>

                        <button
                            type="button"
                            onClick={() => onGoForward?.()}
                            disabled={!canGoForward}
                            className={`p-1.5 rounded-md transition-colors ${
                                canGoForward
                                    ? "hover:bg-white/10 text-white cursor-pointer active:scale-95"
                                    : "opacity-30 text-white/40 cursor-not-allowed"
                            }`}
                            title="Go Forward"
                            aria-label="Forward"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* 2. CENTER: Forums Name */}
                <div className="flex items-center justify-center flex-1">
                    <button
                        type="button"
                        onClick={() => onNavigate({ view: "forum" })}
                        className="flex items-center gap-2.5 group cursor-pointer text-center"
                    >
                        <NationalEmblemLogo className="w-9 h-8 group-hover:scale-105 transition-transform drop-shadow-[0_2px_8px_rgba(200,151,26,0.4)]" />
                        <div className="flex flex-col items-center">
                            <span
                                className="text-sm sm:text-base md:text-lg font-bold tracking-[0.14em] uppercase text-white group-hover:text-[#E5A93C] transition-colors"
                                style={{ fontFamily: "'Fraunces', serif" }}
                            >
                                BHARAT-GANRAJYA FORUMS
                            </span>
                            <span className="text-[9px] tracking-[0.25em] uppercase text-[#C8971A]/80 hidden sm:inline">
                                Civilizational Dialogue & Knowledge Exchange
                            </span>
                        </div>
                    </button>
                </div>

                {/* 3. RIGHT: Logged out -> Sign Up or Login. Logged in -> Search and Profile menus in place */}
                <div className="flex items-center gap-2 shrink-0">
                    {!user ? (
                        <button
                            type="button"
                            onClick={() => requireAuth(() => {})}
                            className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#B85428] to-[#C8971A] hover:brightness-110 text-white font-semibold text-xs tracking-wider uppercase shadow-md transition-all cursor-pointer flex items-center gap-2"
                        >
                            <LogIn className="w-3.5 h-3.5" />
                            <span>Sign Up / Login</span>
                        </button>
                    ) : (
                        <>
                            {/* Menu 1: Search */}
                            <button
                                type="button"
                                onClick={onOpenSearch}
                                className="px-3.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/15 border border-white/10 hover:border-white/20 text-white/90 hover:text-white transition-all text-xs font-medium flex items-center gap-2 cursor-pointer shadow-xs"
                                title="Search Forum Threads, Categories, Tags"
                            >
                                <Search className="w-4 h-4 text-[#C8971A]" />
                                <span className="hidden sm:inline">Search</span>
                            </button>

                            {/* Menu 2: Profile */}
                            <div className="relative" ref={profileRef}>
                                <button
                                    type="button"
                                    onClick={handleProfileClick}
                                    className={`px-3 py-1.5 rounded-lg border transition-all text-xs font-medium flex items-center gap-2 cursor-pointer ${
                                        profileMenuOpen
                                            ? "bg-[#C8971A]/20 border-[#C8971A] text-white"
                                            : "bg-white/5 hover:bg-white/10 border-white/10 text-white/90"
                                    }`}
                                    title="User Profile Menu"
                                >
                                    <div
                                        className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0 shadow-xs"
                                        style={{ backgroundColor: user.bg || "#B85428" }}
                                    >
                                        {user.initials || user.name.slice(0, 2).toUpperCase()}
                                    </div>
                                    <span className="max-w-[90px] truncate hidden md:inline">
                                        {user.name.split(" ")[0]}
                                    </span>
                                </button>

                                {/* Profile Dropdown Menu */}
                                {profileMenuOpen && (
                                    <div className="absolute right-0 mt-2 w-56 bg-[#0B1528] border border-[#C8971A]/40 rounded-xl shadow-2xl py-2 z-50 text-xs animate-in fade-in zoom-in-95 duration-150">
                                        <div className="px-3.5 py-2 border-b border-white/10">
                                            <div className="font-bold text-white truncate">{user.name}</div>
                                            <div className="text-[10px] text-white/50 truncate">@{user.username || "scholar"}</div>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() => {
                                                setProfileMenuOpen(false);
                                                onOpenActivity("activity");
                                            }}
                                            className="w-full px-3.5 py-2 flex items-center gap-2.5 text-left hover:bg-white/5 text-white/90 hover:text-white transition-colors cursor-pointer"
                                        >
                                            <Activity className="w-4 h-4 text-emerald-400" />
                                            <span>My Activity</span>
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => {
                                                setProfileMenuOpen(false);
                                                onOpenActivity("favorites");
                                            }}
                                            className="w-full px-3.5 py-2 flex items-center gap-2.5 text-left hover:bg-white/5 text-white/90 hover:text-white transition-colors cursor-pointer"
                                        >
                                            <Heart className="w-4 h-4 text-rose-400 fill-rose-400/20" />
                                            <span>Favorite Categories</span>
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => {
                                                setProfileMenuOpen(false);
                                                onOpenActivity("starred");
                                            }}
                                            className="w-full px-3.5 py-2 flex items-center gap-2.5 text-left hover:bg-white/5 text-white/90 hover:text-white transition-colors cursor-pointer"
                                        >
                                            <Star className="w-4 h-4 text-amber-400 fill-amber-400/20" />
                                            <span>Starred Categories</span>
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => {
                                                setProfileMenuOpen(false);
                                                onOpenActivity("bookmarks");
                                            }}
                                            className="w-full px-3.5 py-2 flex items-center gap-2.5 text-left hover:bg-white/5 text-white/90 hover:text-white transition-colors cursor-pointer"
                                        >
                                            <Bookmark className="w-4 h-4 text-blue-400 fill-blue-400/20" />
                                            <span>Saved Posts & Comments</span>
                                        </button>

                                        {onOpenNewDiscussion && (
                                            <>
                                                <div className="my-1 border-t border-white/10" />
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setProfileMenuOpen(false);
                                                        onOpenNewDiscussion();
                                                    }}
                                                    className="w-full px-3.5 py-2 flex items-center gap-2.5 text-left hover:bg-[#C8971A]/15 text-[#E5A93C] font-semibold transition-colors cursor-pointer"
                                                >
                                                    <Plus className="w-4 h-4" />
                                                    <span>New Discussion</span>
                                                </button>
                                            </>
                                        )}

                                        <div className="my-1 border-t border-white/10" />

                                        <button
                                            type="button"
                                            onClick={() => {
                                                setProfileMenuOpen(false);
                                                logout();
                                            }}
                                            className="w-full px-3.5 py-2 flex items-center gap-2.5 text-left hover:bg-rose-500/10 text-rose-400 transition-colors cursor-pointer"
                                        >
                                            <LogOut className="w-4 h-4" />
                                            <span>Sign Out</span>
                                        </button>
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}
