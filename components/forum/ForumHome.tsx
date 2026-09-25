'use client';

import React, { useState, useMemo, useEffect } from "react";
import {
    Search,
    Plus,
    Layers,
    Sparkles,
    TrendingUp,
    Clock,
    BookOpen,
    Compass,
    Feather,
    Atom,
    Landmark,
    Users2,
    ShieldCheck,
    Loader2,
    Bookmark,
    ArrowRight,
    Play,
    Share2,
    Eye,
    MessageSquare,
    Zap,
    Award,
    Star,
    X,
} from "lucide-react";
import { AshokaCakra, TricolorStripe } from "../Symbols";
import { forumCategories } from "@/data/forumData";
import {
    getMegaThreadsAction,
    getDiscussions,
    getCategoriesAction,
    getForumStatsAction,
    toggleBookmark,
} from "@/app/actions/forum";
import { useAuth } from "@/context/AuthContext";
import type { MegaThread, Discussion } from "@/types/forum";
import MegaThreadCard from "./MegaThreadCard";
import DiscussionCard from "./DiscussionCard";
import WhatsNewCarousel from "./WhatsNewCarousel";
import ShareModal from "../modals/ShareModal";

interface ForumHomeProps {
    onViewThread: (id: string) => void;
    onViewMegaThread: (id: string) => void;
    onNewDiscussion: () => void;
}

// 6 Core Featured Categories matching the 6-card grid from reference layout
const featuredCategoryCards = [
    {
        id: "general",
        filterId: null,
        title: "GENERAL INQUIRIES",
        subtitle: "Connect, dialogue & exchange",
        icon: <Users2 className="w-5 h-5 text-[#38BDF8]" />,
        iconBg: "bg-[#38BDF8]/15 border-[#38BDF8]/30",
        count: "45K Discussions",
        color: "#38BDF8",
    },
    {
        id: "history",
        filterId: "history",
        title: "CIVILIZATIONAL HISTORY",
        subtitle: "Saraswati-Sindhu to modern era",
        icon: <Compass className="w-5 h-5 text-[#E5A93C]" />,
        iconBg: "bg-[#E5A93C]/15 border-[#E5A93C]/30",
        count: "847 Discussions",
        color: "#E5A93C",
    },
    {
        id: "philosophy",
        filterId: "philosophy",
        title: "INDIC PHILOSOPHY",
        subtitle: "Darshanas, logic & epistemology",
        icon: <BookOpen className="w-5 h-5 text-[#A78BFA]" />,
        iconBg: "bg-[#A78BFA]/15 border-[#A78BFA]/30",
        count: "523 Discussions",
        color: "#A78BFA",
    },
    {
        id: "science",
        filterId: "science",
        title: "SCIENCE & KNOWLEDGE",
        subtitle: "Astronomy, math, metallurgy & ISRO",
        icon: <Zap className="w-5 h-5 text-[#34D399]" />,
        iconBg: "bg-[#34D399]/15 border-[#34D399]/30",
        count: "389 Discussions",
        color: "#34D399",
    },
    {
        id: "culture",
        filterId: "culture",
        title: "CULTURE & HERITAGE",
        subtitle: "Traditions, temple arts & architecture",
        icon: <Award className="w-5 h-5 text-[#F43F5E]" />,
        iconBg: "bg-[#F43F5E]/15 border-[#F43F5E]/30",
        count: "634 Discussions",
        color: "#F43F5E",
    },
    {
        id: "development",
        filterId: "development",
        title: "NATIONAL RENEWAL",
        subtitle: "Statecraft, vision & development",
        icon: <ShieldCheck className="w-5 h-5 text-[#FB923C]" />,
        iconBg: "bg-[#FB923C]/15 border-[#FB923C]/30",
        count: "723 Discussions",
        color: "#FB923C",
    },
];

export default function ForumHome({
    onViewThread,
    onViewMegaThread,
    onNewDiscussion,
}: ForumHomeProps) {
    const { user, requireAuth } = useAuth();
    const [searchQuery, setSearchQuery] = useState("");
    const [activeCategory, setActiveCategory] = useState<string | null>(null);
    const [viewMode, setViewMode] = useState<"discussions" | "megathreads">("discussions");
    const [megaThreadFilter, setMegaThreadFilter] = useState<"featured" | "active" | "popular">("featured");
    const [discussionFilter, setDiscussionFilter] = useState<"latest" | "trending" | "pinned" | "bookmarked">("latest");
    const [sharingDiscussion, setSharingDiscussion] = useState<Discussion | null>(null);

    const [allMegaThreads, setAllMegaThreads] = useState<MegaThread[]>([]);
    const [allDiscussions, setAllDiscussions] = useState<Discussion[]>([]);
    const [categories, setCategories] = useState<{ id: string; name: string; count: number; color: string }[]>([]);
    const [stats, setStats] = useState({ megaThreadCount: 0, discussionCount: 0, categoryCount: 0, scholarCount: 0, postCount: 0 });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let active = true;
        Promise.resolve().then(() => {
            if (active) setIsLoading(true);
        });

        Promise.all([
            getMegaThreadsAction(),
            getDiscussions({
                categoryId: activeCategory,
                search: searchQuery.trim() || undefined,
                sortBy: discussionFilter,
                clientUserId: user?.id,
            }),
            getCategoriesAction(),
            getForumStatsAction(),
        ]).then(([dbMts, dbDiscs, dbCats, dbStats]) => {
            if (!active) return;
            setAllMegaThreads((dbMts || []) as unknown as MegaThread[]);
            setAllDiscussions((dbDiscs || []) as unknown as Discussion[]);
            if (dbCats && dbCats.length > 0) {
                setCategories(dbCats);
            }
            if (dbStats) {
                setStats(dbStats);
            }
            setIsLoading(false);
        }).catch((err) => {
            console.error("Backend fetch error in ForumHome:", err);
            if (active) setIsLoading(false);
        });

        return () => {
            active = false;
        };
    }, [activeCategory, searchQuery, discussionFilter, user?.id]);

    // Handle toggle bookmark
    const handleToggleBookmark = async (discussionId: string) => {
        if (!user) {
            requireAuth(() => handleToggleBookmark(discussionId));
            return;
        }

        setAllDiscussions((prev) =>
            prev.map((d) => {
                if (d.id !== discussionId) return d;
                const nextB = !d.isBookmarked;
                return {
                    ...d,
                    isBookmarked: nextB,
                    bookmarkCount: Math.max(0, (d.bookmarkCount || 0) + (nextB ? 1 : -1)),
                };
            })
        );

        try {
            const res = await toggleBookmark(discussionId, user.id);
            setAllDiscussions((prev) =>
                prev.map((d) =>
                    d.id === discussionId
                        ? { ...d, isBookmarked: res.bookmarked, bookmarkCount: res.bookmarkCount }
                        : d
                )
            );
        } catch (err) {
            console.error("Failed to toggle bookmark:", err);
        }
    };

    // Filtered MegaThreads
    const filteredMegaThreads = useMemo(() => {
        let list = [...allMegaThreads];
        if (activeCategory) {
            list = list.filter((m) => m.category === activeCategory);
        }
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase().trim();
            list = list.filter(
                (m) =>
                    m.title.toLowerCase().includes(q) ||
                    m.description.toLowerCase().includes(q) ||
                    m.tags?.some((t) => t.toLowerCase().includes(q))
            );
        }
        if (megaThreadFilter === "featured") {
            list.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
        } else if (megaThreadFilter === "active") {
            list.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
        } else if (megaThreadFilter === "popular") {
            list.sort((a, b) => b.participantCount - a.participantCount);
        }
        return list;
    }, [allMegaThreads, activeCategory, searchQuery, megaThreadFilter]);

    // Filtered Discussions
    const filteredDiscussions = useMemo(() => {
        let list = [...allDiscussions];
        if (activeCategory) {
            list = list.filter((d) => d.category === activeCategory);
        }
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase().trim();
            list = list.filter(
                (d) =>
                    d.title.toLowerCase().includes(q) ||
                    d.excerpt.toLowerCase().includes(q) ||
                    d.tags?.some((t) => t.toLowerCase().includes(q))
            );
        }
        if (discussionFilter === "pinned") {
            list = list.filter((d) => d.pinned);
        } else if (discussionFilter === "trending") {
            list.sort((a, b) => (b.views || 0) - (a.views || 0));
        } else if (discussionFilter === "bookmarked") {
            list = list.filter((d) => d.isBookmarked);
        } else {
            list.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
        }
        return list;
    }, [allDiscussions, activeCategory, searchQuery, discussionFilter]);

    // MegaThread lookup map
    const megaThreadMap = useMemo(() => {
        const map = new Map<string, string>();
        allMegaThreads.forEach((m) => map.set(m.id, m.title));
        return map;
    }, [allMegaThreads]);

    // Scroll to feed smoothly
    const scrollToFeed = () => {
        const el = document.getElementById("community-feed");
        if (el) {
            el.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        <div className="min-h-screen bg-[#060D1E] text-white relative overflow-hidden select-none" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>

            {/* Top Atmospheric Gradient Wash */}
            <div className="absolute top-0 left-0 right-0 h-[600px] bg-gradient-to-b from-[#0A1633] via-[#081228] to-transparent pointer-events-none z-0" />

            {/* Glowing Ambient Cyan & Amber Orbs in the background */}
            <div
                className="absolute top-24 left-1/4 w-[600px] h-[450px] rounded-full pointer-events-none opacity-25 blur-[120px] z-0"
                style={{ background: "radial-gradient(circle, #0284C7 0%, transparent 70%)" }}
            />
            <div
                className="absolute top-48 right-10 w-[550px] h-[500px] rounded-full pointer-events-none opacity-20 blur-[130px] z-0"
                style={{ background: "radial-gradient(circle, #F59E0B 0%, transparent 70%)" }}
            />

            {/* ============================================================== */}
            {/* ============================================================== */}
            {/* ============================================================== */}
            {/* 1. TOP HERO & DOMAINS CONTAINER                                */}
            {/* Fills exactly 100vh on desktop so next section is below fold   */}
            {/* ============================================================== */}
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 min-h-screen pt-20 pb-6 flex flex-col justify-center gap-5 lg:gap-7">

                {/* HERO SPLIT SECTION (Directly from Forum.webp Reference) */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6 xl:gap-8 items-center py-1">

                    {/* LEFT COLUMN: WHAT'S NEW CARD CAROUSEL (Span 5 on lg, Span 4 on xl matching Card 1) */}
                    <div className="lg:col-span-5 xl:col-span-4">
                        <WhatsNewCarousel
                            onViewMegaThread={onViewMegaThread}
                            onViewThread={onViewThread}
                        />
                    </div>

                    {/* RIGHT COLUMN: "JOIN THE CONVERSATION" HERO (Span 7 on lg, Span 8 on xl matching Cards 2 & 3) */}
                    <div className="lg:col-span-7 xl:col-span-8 flex flex-col justify-center pl-0 lg:pl-3 xl:pl-6 relative w-full">

                        {/* Connected Constellation Network Nodes Background (from Forum.webp) */}
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[340px] h-[340px] opacity-25 pointer-events-none overflow-hidden hidden sm:block">
                            <svg viewBox="0 0 300 300" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
                                {/* Connecting Network Strands */}
                                <line x1="50" y1="120" x2="120" y2="60" stroke="#38BDF8" strokeWidth="1" strokeOpacity="0.4" />
                                <line x1="120" y1="60" x2="220" y2="90" stroke="#38BDF8" strokeWidth="1" strokeOpacity="0.4" />
                                <line x1="220" y1="90" x2="270" y2="180" stroke="#38BDF8" strokeWidth="1" strokeOpacity="0.4" />
                                <line x1="50" y1="120" x2="140" y2="190" stroke="#38BDF8" strokeWidth="1" strokeOpacity="0.4" />
                                <line x1="140" y1="190" x2="270" y2="180" stroke="#38BDF8" strokeWidth="1" strokeOpacity="0.4" />
                                <line x1="140" y1="190" x2="190" y2="260" stroke="#38BDF8" strokeWidth="1" strokeOpacity="0.4" />
                                <line x1="270" y1="180" x2="190" y2="260" stroke="#38BDF8" strokeWidth="1" strokeOpacity="0.4" />

                                {/* Glowing Nodes */}
                                <circle cx="50" cy="120" r="4.5" fill="#38BDF8" filter="drop-shadow(0 0 6px #38BDF8)" />
                                <circle cx="120" cy="60" r="5" fill="#E5A93C" filter="drop-shadow(0 0 6px #E5A93C)" />
                                <circle cx="220" cy="90" r="4" fill="#38BDF8" />
                                <circle cx="270" cy="180" r="6" fill="#FFFFFF" filter="drop-shadow(0 0 8px #FFFFFF)" />
                                <circle cx="140" cy="190" r="5.5" fill="#E5A93C" filter="drop-shadow(0 0 6px #E5A93C)" />
                                <circle cx="190" cy="260" r="4" fill="#38BDF8" />
                            </svg>
                        </div>

                        {/* Preserved Vertical Stack Layout */}
                        <div className="relative z-10 w-full">
                            <div className="flex items-center gap-2 mb-2">
                                <AshokaCakra className="w-4 h-4 text-[#E5A93C]" />
                                <span className="text-[#E5A93C] text-[11px] font-bold tracking-[0.25em] uppercase">
                                    NATIONAL CIVILIZATIONAL FORUM
                                </span>
                            </div>

                            <h1
                                className="text-white text-4xl sm:text-5xl md:text-6xl lg:text-[4.2rem] xl:text-[5.1rem] font-bold leading-[0.98] tracking-tight mb-2.5 drop-shadow-[0_4px_30px_rgba(0,0,0,0.8)]"
                                style={{ fontFamily: "'Fraunces', serif" }}
                            >
                                Join the
                                <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-[#F5E6C8] to-[#E5A93C]">
                                    Conversation
                                </span>
                            </h1>

                            <p
                                className="text-white/75 text-xs sm:text-sm lg:text-[15px] leading-relaxed max-w-2xl xl:max-w-3xl mb-3.5"
                                style={{ fontFamily: "'Spectral', Georgia, serif" }}
                            >
                                Connect, share insights, and engage with our vibrant community of scholars, researchers, and citizens exploring India&apos;s living civilizational story.
                            </p>

                            {/* Action Buttons with increased horizontal spacing */}
                            <div className="flex flex-wrap items-center gap-4 sm:gap-5 mb-3.5">
                                <button
                                    onClick={onNewDiscussion}
                                    className="bg-gradient-to-r from-[#FF7700] via-[#E5A93C] to-[#D97706] hover:brightness-110 text-slate-950 font-bold px-7 py-3 sm:px-8 sm:py-3.5 rounded-full text-xs sm:text-sm tracking-wide flex items-center gap-2.5 shadow-[0_0_25px_rgba(245,158,11,0.45)] hover:shadow-[0_0_35px_rgba(245,158,11,0.7)] hover:scale-105 transition-all cursor-pointer group whitespace-nowrap"
                                >
                                    <span>Start a Discussion</span>
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </button>

                                <button
                                    onClick={scrollToFeed}
                                    className="border border-white/20 hover:border-[#E5A93C] bg-white/5 hover:bg-white/10 text-white/90 px-5 py-3 rounded-full text-xs sm:text-sm font-semibold tracking-wide transition-all cursor-pointer backdrop-blur-xs flex items-center gap-2 whitespace-nowrap"
                                >
                                    <BookOpen className="w-4 h-4 text-[#E5A93C]" />
                                    <span>Browse Archive</span>
                                </button>
                            </div>

                            {/* Community Stats Bar: Full-width spanning to align with the end of the Categories component */}
                            <div className="w-full flex flex-wrap items-center justify-between gap-3 text-[11px] sm:text-xs text-white/70 font-medium pt-2 border-t border-white/10">
                                <span><strong className="text-white font-bold">{stats.scholarCount > 0 ? `${stats.scholarCount}+` : "128K"}</strong> Scholars</span>
                                <span className="text-white/30">•</span>
                                <span><strong className="text-white font-bold">{stats.postCount > 0 ? `${stats.postCount}+` : "6.4M"}</strong> Contributions</span>
                                <span className="text-white/30">•</span>
                                <span><strong className="text-white font-bold">{stats.discussionCount > 0 ? `${stats.discussionCount}+` : "215K"}</strong> Inquiries</span>
                                <span className="text-white/30">•</span>
                                <span><strong className="text-white font-bold">{stats.megaThreadCount || allMegaThreads.length || 42}</strong> MegaThreads</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. CATEGORIES (4 Cards) + INTEGRATED SEARCH SECTION (Spanning the right column) */}
                <div>
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                            <span className="text-[#E5A93C] text-[11px] font-bold tracking-[0.2em] uppercase">
                                EXPLORE INQUIRIES & SEARCH ARCHIVE
                            </span>
                        </div>

                        {activeCategory && (
                            <button
                                onClick={() => setActiveCategory(null)}
                                className="bg-[#E5A93C]/20 hover:bg-[#E5A93C]/30 text-[#E5A93C] border border-[#E5A93C]/40 px-2.5 py-0.5 rounded-full text-[11px] font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                            >
                                <span>Clear Filter</span>
                                <X className="w-3 h-3" />
                            </button>
                        )}
                    </div>

                    {/* Main Grid: 2 Columns for 4 Category Cards, 1 Column for Search Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-3.5 sm:gap-4 lg:gap-4.5 items-stretch">

                        {/* LEFT & CENTER: 4 Category Cards in 2x2 grid (Col Span 2) */}
                        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4 lg:gap-4.5">
                            {featuredCategoryCards.slice(0, 4).map((cat) => {
                                const isSelected = activeCategory === cat.filterId;
                                return (
                                    <div
                                        key={cat.id}
                                        onClick={() => {
                                            setActiveCategory(isSelected ? null : cat.filterId);
                                            scrollToFeed();
                                        }}
                                        className={`rounded-2xl p-4 sm:p-4.5 lg:p-5 transition-all duration-300 group cursor-pointer backdrop-blur-md shadow-lg flex flex-col justify-between ${isSelected
                                            ? "bg-[#102454] border-2 border-[#E5A93C] shadow-[0_0_25px_rgba(229,169,60,0.35)] transform -translate-y-1"
                                            : "bg-[#0A1633]/85 hover:bg-[#0D1E45] border border-white/10 hover:border-[#E5A93C]/50 hover:-translate-y-1 hover:shadow-xl"
                                            }`}
                                    >
                                        <div className="flex items-center gap-3.5 sm:gap-4">
                                            {/* Circular/Rounded Icon Container */}
                                            <div className={`w-11 h-11 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center shrink-0 border ${cat.iconBg} transition-transform group-hover:scale-110 shadow-sm [&>svg]:w-5 [&>svg]:h-5 sm:[&>svg]:w-6 sm:[&>svg]:h-6`}>
                                                {cat.icon}
                                            </div>

                                            {/* Title & Subtitle */}
                                            <div className="min-w-0 flex-1">
                                                <h3 className="text-xs sm:text-sm font-bold tracking-wider uppercase text-white group-hover:text-[#E5A93C] transition-colors truncate">
                                                    {cat.title}
                                                </h3>
                                                <p className="text-[11px] sm:text-xs text-white/60 truncate leading-snug mt-0.5">
                                                    {cat.subtitle}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Bottom Row: Count & Explore Action */}
                                        <div className="flex items-center justify-between pt-3 mt-3 border-t border-white/10 text-xs sm:text-[13px]">
                                            <span className="text-white/65 font-medium">
                                                {cat.count}
                                            </span>

                                            <span className="text-[#E5A93C] font-semibold flex items-center gap-1.5 group-hover:translate-x-1.5 transition-transform">
                                                <span>Explore</span>
                                                <ArrowRight className="w-3.5 h-3.5" />
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* RIGHT: SEARCH SECTION SPANNING THE ENTIRE 2-ROW SPACE (Col Span 1) */}
                        <div className="lg:col-span-1 h-full flex flex-col">
                            <div className="bg-[#0A1633]/85 hover:bg-[#0D1E45] border border-white/10 hover:border-[#E5A93C]/40 rounded-2xl p-4.5 sm:p-5 backdrop-blur-md shadow-lg flex flex-col justify-between h-full transition-all group">
                                {/* Top Content */}
                                <div>
                                    <div className="flex items-center gap-2.5 mb-3">
                                        <div className="w-10 h-10 rounded-xl bg-[#E5A93C]/15 border border-[#E5A93C]/30 flex items-center justify-center text-[#E5A93C] shrink-0">
                                            <Search className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h3 className="text-xs sm:text-sm font-bold tracking-wider uppercase text-white group-hover:text-[#E5A93C] transition-colors">
                                                SEARCH CATEGORIES
                                            </h3>
                                            <p className="text-[11px] text-white/55 leading-tight mt-0.5">
                                                Search 215K+ civilizational topics
                                            </p>
                                        </div>
                                    </div>

                                    {/* Search Input Field */}
                                    <div className="relative mb-3">
                                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                                        <input
                                            type="text"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter") scrollToFeed();
                                            }}
                                            placeholder="Keywords, scholars, texts, history..."
                                            className="w-full pl-10 pr-8 py-3 rounded-2xl border border-white/15 bg-[#060D1E]/90 focus:bg-[#060D1E] focus:outline-none focus:border-[#E5A93C] text-xs sm:text-sm text-white placeholder-white/40 shadow-inner transition-all"
                                        />
                                        {searchQuery && (
                                            <button
                                                onClick={() => setSearchQuery("")}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
                                            >
                                                <X className="w-3.5 h-3.5" />
                                            </button>
                                        )}
                                    </div>

                                    {/* Quick Search Tags */}
                                    <div className="flex flex-wrap items-center gap-1.5">
                                        <span className="text-[10px] text-white/40 uppercase font-semibold mr-1">Trending:</span>
                                        {["Saraswati", "Nyaya", "Astronomy", "Vedic Math"].map((tag) => (
                                            <button
                                                key={tag}
                                                onClick={() => {
                                                    setSearchQuery(tag);
                                                    scrollToFeed();
                                                }}
                                                className="text-[10px] bg-white/5 hover:bg-[#E5A93C]/20 text-white/70 hover:text-[#E5A93C] border border-white/10 hover:border-[#E5A93C]/40 px-2 py-0.5 rounded-full transition-colors cursor-pointer"
                                            >
                                                {tag}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Bottom Status & View Results Action */}
                                <div className="flex items-center justify-between pt-3 mt-3 border-t border-white/10 text-xs sm:text-[13px]">
                                    <span className="text-white/60 font-medium truncate max-w-[150px]">
                                        {searchQuery ? `"${searchQuery}"` : "Active Query"}
                                    </span>

                                    <button
                                        onClick={scrollToFeed}
                                        className="text-[#E5A93C] font-semibold flex items-center gap-1.5 group-hover:translate-x-1.5 transition-transform cursor-pointer shrink-0"
                                    >
                                        <span>View Results</span>
                                        <ArrowRight className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            {/* ============================================================== */}
            {/* 3. COMMUNITY FEED & STREAM NAVIGATION TABS                     */}
            {/* ============================================================== */}
            <div id="community-feed" className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 mb-8 pt-4 sm:pt-6">

                {/* Active search filter banner if search is active */}
                {searchQuery && (
                    <div className="flex items-center justify-between bg-[#102454]/80 border border-[#E5A93C]/40 rounded-xl px-4 py-2.5 mb-4 text-xs">
                        <span className="text-white/80">
                            Showing inquiries matching <strong className="text-[#E5A93C]">&ldquo;{searchQuery}&rdquo;</strong>
                        </span>
                        <button
                            onClick={() => setSearchQuery("")}
                            className="text-[#E5A93C] hover:text-white flex items-center gap-1 text-xs font-semibold cursor-pointer"
                        >
                            <span>Clear Search</span>
                            <X className="w-3.5 h-3.5" />
                        </button>
                    </div>
                )}

                {/* Filter Controls Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
                    {/* Stream View Modes & Filter Tabs */}
                    <div className="flex flex-wrap items-center gap-2">
                        {/* Discussions vs MegaThreads Toggle */}
                        <div className="flex items-center bg-[#0A1633] p-1 rounded-lg border border-white/10 mr-2">
                            <button
                                onClick={() => setViewMode("discussions")}
                                className={`px-4 py-2 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${viewMode === "discussions"
                                    ? "bg-[#E5A93C] text-slate-950 shadow-sm"
                                    : "text-white/70 hover:text-white"
                                    }`}
                            >
                                <MessageSquare className="w-3.5 h-3.5" /> Discussions
                            </button>
                            <button
                                onClick={() => setViewMode("megathreads")}
                                className={`px-4 py-2 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${viewMode === "megathreads"
                                    ? "bg-[#E5A93C] text-slate-950 shadow-sm"
                                    : "text-white/70 hover:text-white"
                                    }`}
                            >
                                <Layers className="w-3.5 h-3.5" /> MegaThreads
                            </button>
                        </div>

                        {/* Sub-Filters for Discussions */}
                        {viewMode === "discussions" && (
                            <div className="flex items-center gap-1">
                                {(["latest", "trending", "pinned"] as const).map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => setDiscussionFilter(tab)}
                                        className={`px-3.5 py-1.5 rounded-full text-xs font-semibold capitalize transition-all cursor-pointer ${discussionFilter === tab
                                            ? "bg-white/15 text-[#E5A93C] border border-[#E5A93C]/40"
                                            : "text-white/60 hover:text-white hover:bg-white/5"
                                            }`}
                                    >
                                        {tab === "trending" ? (
                                            <>
                                                <TrendingUp className="w-3.5 h-3.5 inline mr-1 text-[#E5A93C]" />
                                                Trending
                                            </>
                                        ) : tab === "pinned" ? (
                                            <>
                                                <Star className="w-3.5 h-3.5 inline mr-1 text-[#E5A93C]" />
                                                Pinned
                                            </>
                                        ) : (
                                            <>
                                                <Clock className="w-3.5 h-3.5 inline mr-1 text-white/50" />
                                                Latest
                                            </>
                                        )}
                                    </button>
                                ))}

                                <button
                                    onClick={() => {
                                        if (!user) {
                                            requireAuth(() => setDiscussionFilter("bookmarked"));
                                        } else {
                                            setDiscussionFilter("bookmarked");
                                        }
                                    }}
                                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${discussionFilter === "bookmarked"
                                        ? "bg-white/15 text-[#E5A93C] border border-[#E5A93C]/40"
                                        : "text-white/60 hover:text-white hover:bg-white/5"
                                        }`}
                                >
                                    <Bookmark className={`w-3.5 h-3.5 inline mr-1 ${discussionFilter === "bookmarked" ? "fill-[#E5A93C] text-[#E5A93C]" : ""}`} />
                                    Bookmarked
                                </button>
                            </div>
                        )}

                        {/* Sub-Filters for MegaThreads */}
                        {viewMode === "megathreads" && (
                            <div className="flex items-center gap-1">
                                {(["featured", "active", "popular"] as const).map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => setMegaThreadFilter(tab)}
                                        className={`px-3.5 py-1.5 rounded-full text-xs font-semibold capitalize transition-all cursor-pointer ${megaThreadFilter === tab
                                            ? "bg-white/15 text-[#E5A93C] border border-[#E5A93C]/40"
                                            : "text-white/60 hover:text-white hover:bg-white/5"
                                            }`}
                                    >
                                        {tab}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Results Counter */}
                    <span className="text-xs text-white/50 font-mono">
                        {viewMode === "discussions"
                            ? `${filteredDiscussions.length} Inquiry${filteredDiscussions.length !== 1 ? "ies" : ""}`
                            : `${filteredMegaThreads.length} MegaThread${filteredMegaThreads.length !== 1 ? "s" : ""}`}
                    </span>
                </div>
            </div>

            {/* ============================================================== */}
            {/* 4. DISCUSSIONS STREAM & COMMUNITY SIDEBAR                      */}
            {/* ============================================================== */}
            <div className="relative z-10 max-w-7xl mx-auto px-6 pb-20">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* MAIN FEED COLUMN (Span 8) */}
                    <div className="lg:col-span-8">
                        {viewMode === "discussions" ? (
                            <div className="space-y-4">
                                {isLoading && allDiscussions.length === 0 ? (
                                    <div className="bg-[#0A1633]/80 border border-white/10 rounded-2xl p-16 text-center text-white/60 backdrop-blur-md">
                                        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-3 text-[#E5A93C]" />
                                        <p className="text-sm font-medium">Loading civilizational discussions from database...</p>
                                    </div>
                                ) : filteredDiscussions.length === 0 ? (
                                    <div className="bg-[#0A1633]/80 border border-white/10 rounded-2xl p-14 text-center text-white/60 backdrop-blur-md">
                                        <BookOpen className="w-10 h-10 mx-auto mb-3 text-white/30" />
                                        <h3 className="text-white font-bold text-base mb-1">No Inquiries Found</h3>
                                        <p className="text-sm text-white/55 max-w-md mx-auto mb-5">
                                            {discussionFilter === "bookmarked"
                                                ? "You haven't bookmarked any discussions yet. Click the bookmark icon on any card to save it."
                                                : "No discussions match your filter or search query. Start a new one to begin the dialogue!"}
                                        </p>
                                        <button
                                            onClick={onNewDiscussion}
                                            className="bg-[#E5A93C] text-slate-950 font-bold px-6 py-2.5 rounded-full text-xs uppercase tracking-wide hover:brightness-110 transition-all cursor-pointer"
                                        >
                                            Start a Discussion
                                        </button>
                                    </div>
                                ) : (
                                    filteredDiscussions.map((d) => (
                                        <DiscussionCard
                                            key={d.id}
                                            discussion={d}
                                            megaThreadTitle={d.megaThreadId ? megaThreadMap.get(d.megaThreadId) : undefined}
                                            onClick={() => onViewThread(d.id)}
                                            onToggleBookmark={handleToggleBookmark}
                                            onShare={(item) => setSharingDiscussion(item)}
                                            dark={true}
                                        />
                                    ))
                                )}
                            </div>
                        ) : (
                            /* MegaThreads Stream */
                            <div className="grid md:grid-cols-2 gap-6">
                                {filteredMegaThreads.length === 0 ? (
                                    <div className="col-span-2 bg-[#0A1633]/80 border border-white/10 rounded-2xl p-12 text-center text-white/60">
                                        No MegaThreads found matching criteria.
                                    </div>
                                ) : (
                                    filteredMegaThreads.map((mt) => (
                                        <MegaThreadCard
                                            key={mt.id}
                                            megaThread={mt}
                                            featured={mt.featured}
                                            onClick={() => onViewMegaThread(mt.id)}
                                            dark={true}
                                        />
                                    ))
                                )}
                            </div>
                        )}
                    </div>

                    {/* SIDEBAR COLUMN (Span 4) */}
                    <div className="lg:col-span-4 space-y-6">

                        {/* Community Overview Box */}
                        <div className="bg-[#0A1633]/85 border border-white/10 rounded-2xl p-6 backdrop-blur-md shadow-xl">
                            <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-4 flex items-center justify-between">
                                <span>Platform Metrics</span>
                                <Sparkles className="w-3.5 h-3.5 text-[#E5A93C]" />
                            </h4>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                                    <div className="text-2xl font-bold text-[#E5A93C]" style={{ fontFamily: "'Fraunces', serif" }}>
                                        {stats.megaThreadCount || allMegaThreads.length || 42}
                                    </div>
                                    <div className="text-xs text-white/55 mt-0.5">MegaThreads</div>
                                </div>
                                <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                                    <div className="text-2xl font-bold text-[#38BDF8]" style={{ fontFamily: "'Fraunces', serif" }}>
                                        {stats.discussionCount || allDiscussions.length || 215}
                                    </div>
                                    <div className="text-xs text-white/55 mt-0.5">Discussions</div>
                                </div>
                                <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                                    <div className="text-2xl font-bold text-[#34D399]" style={{ fontFamily: "'Fraunces', serif" }}>
                                        {categories.length || forumCategories.length || 8}
                                    </div>
                                    <div className="text-xs text-white/55 mt-0.5">Domains</div>
                                </div>
                                <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                                    <div className="text-2xl font-bold text-[#A78BFA]" style={{ fontFamily: "'Fraunces', serif" }}>
                                        {stats.scholarCount > 0 ? stats.scholarCount : "128K"}
                                    </div>
                                    <div className="text-xs text-white/55 mt-0.5">Scholars</div>
                                </div>
                            </div>
                        </div>

                        {/* Popular MegaThreads List */}
                        <div className="bg-[#0A1633]/85 border border-white/10 rounded-2xl p-6 backdrop-blur-md shadow-xl">
                            <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-4 flex items-center justify-between">
                                <span>Flagship MegaThreads</span>
                                <Layers className="w-3.5 h-3.5 text-[#E5A93C]" />
                            </h4>

                            <div className="space-y-2.5">
                                {allMegaThreads.slice(0, 5).map((mt) => (
                                    <button
                                        key={mt.id}
                                        onClick={() => onViewMegaThread(mt.id)}
                                        className="w-full text-left p-3 hover:bg-white/5 rounded-xl border border-transparent hover:border-white/10 transition-all flex items-center justify-between text-xs group cursor-pointer"
                                    >
                                        <div className="truncate mr-3">
                                            <div className="font-semibold text-white/90 group-hover:text-[#E5A93C] transition-colors truncate">
                                                {mt.title}
                                            </div>
                                            <div className="text-[10px] text-white/45 truncate mt-0.5">
                                                {mt.categoryLabel}
                                            </div>
                                        </div>
                                        <span className="text-[#E5A93C] shrink-0 font-mono font-bold bg-[#E5A93C]/10 px-2 py-0.5 rounded-full text-[10px]">
                                            {mt.discussionCount}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Community Dialogue CTA Box */}
                        <div className="bg-gradient-to-br from-[#0F224D] to-[#0A1633] border border-[#E5A93C]/30 rounded-2xl p-6 text-center shadow-xl relative overflow-hidden">
                            <AshokaCakra className="w-10 h-10 mx-auto text-[#E5A93C] mb-3 opacity-90" />
                            <h4
                                className="text-white font-bold text-base mb-2"
                                style={{ fontFamily: "'Fraunces', serif" }}
                            >
                                Initiate an Inquiry
                            </h4>
                            <p className="text-white/70 text-xs leading-relaxed mb-5" style={{ fontFamily: "'Spectral', Georgia, serif" }}>
                                Propose a rigorous discussion under any thematic domain to engage scholars, researchers, and citizens worldwide.
                            </p>
                            <button
                                onClick={onNewDiscussion}
                                className="w-full bg-[#E5A93C] hover:bg-[#D97706] text-slate-950 font-bold py-3 rounded-full text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md hover:scale-102"
                            >
                                <Plus className="w-4 h-4" /> Start a Discussion
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* ============================================================== */}
            {/* 5. MINIMALIST FOOTER (Matching Forum.webp Bottom Bar)          */}
            {/* ============================================================== */}
            <div className="relative z-10 border-t border-white/10 bg-[#040A1A] py-8 px-6 text-xs text-white/50">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                    {/* Left Links */}
                    <div className="flex flex-wrap items-center gap-5">
                        <button onClick={() => setActiveCategory(null)} className="hover:text-white transition-colors cursor-pointer">
                            All Inquiries
                        </button>
                        <button onClick={() => setActiveCategory("history")} className="hover:text-white transition-colors cursor-pointer">
                            History
                        </button>
                        <button onClick={() => setActiveCategory("philosophy")} className="hover:text-white transition-colors cursor-pointer">
                            Philosophy
                        </button>
                        <button onClick={() => setActiveCategory("science")} className="hover:text-white transition-colors cursor-pointer">
                            Science
                        </button>
                        <button onClick={() => setActiveCategory("culture")} className="hover:text-white transition-colors cursor-pointer">
                            Heritage
                        </button>
                    </div>

                    {/* Center Copyright */}
                    <div className="text-center font-medium">
                        Copyright © 2026 BHARAT-GANRAJYA Nationalists Front. All rights reserved.
                    </div>

                    {/* Right Tag / Status
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-white/70 font-semibold">Community Active</span>
                    </div> */}
                </div>
            </div>

            {/* Share Modal */}
            <ShareModal
                isOpen={Boolean(sharingDiscussion)}
                onClose={() => setSharingDiscussion(null)}
                title={sharingDiscussion?.title || ""}
                discussionId={sharingDiscussion?.id}
            />
        </div>
    );
}