'use client';

import React, { useState, useEffect, useMemo } from "react";
import {
    Search,
    Plus,
    Layers,
    ArrowRight,
    BookOpen,
    Star,
    Heart,
    Video,
    Film,
    FileText,
    Compass,
    Zap,
    Award,
    ShieldCheck,
    Users2,
    X,
} from "lucide-react";
import { AshokaCakra } from "../Symbols";
import WhatsNewCarousel from "../forum/WhatsNewCarousel";
import { megaCategories, forumCategories } from "@/data/forumData";
import {
    getMegaThreadsAction,
    getCategoriesAction,
    getForumStatsAction,
    toggleCategoryStarAction,
    toggleCategoryFavoriteAction,
    addCategoryTagAction,
} from "@/app/actions/forum";
import { useAuth } from "@/context/AuthContext";
import type { MegaThread, ForumCategory } from "@/types/forum";

interface HomeForumSectionProps {
    onViewForum: (category?: string, megaCategory?: string) => void;
    onViewThread: (id: string) => void;
    onNewDiscussion: () => void;
    onViewMegaThread?: (id: string) => void;
}

export default function HomeForumSection({
    onViewForum,
    onViewThread,
    onNewDiscussion,
    onViewMegaThread,
}: HomeForumSectionProps) {
    const { user, requireAuth } = useAuth();
    const [searchQuery, setSearchQuery] = useState("");
    const [activeCategory, setActiveCategory] = useState<string | null>(null);
    const [activeMegaCategory, setActiveMegaCategory] = useState<string>("content-gallery");
    const [categories, setCategories] = useState<ForumCategory[]>(forumCategories);
    const [allMegaThreads, setAllMegaThreads] = useState<MegaThread[]>([]);
    const [stats, setStats] = useState({
        megaThreadCount: 0,
        discussionCount: 0,
        categoryCount: 0,
        scholarCount: 0,
        postCount: 0,
    });
    const [addingTagCatId, setAddingTagCatId] = useState<string | null>(null);
    const [newTagInput, setNewTagInput] = useState<string>("");

    useEffect(() => {
        let active = true;
        Promise.all([
            getMegaThreadsAction(),
            getCategoriesAction(),
            getForumStatsAction(),
        ]).then(([dbMts, dbCats, dbStats]) => {
            if (!active) return;
            if (dbMts) setAllMegaThreads(dbMts as unknown as MegaThread[]);
            if (dbCats && dbCats.length > 0) setCategories(dbCats as unknown as ForumCategory[]);
            if (dbStats) setStats(dbStats);
        }).catch(() => {});

        return () => {
            active = false;
        };
    }, []);

    // Filter displayed smaller categories according to active Mega Category,
    // presenting 3 categories in a single horizontal row alongside the Search Card (4 cols total)
    const displayedCategories = useMemo(() => {
        let list: ForumCategory[] = [];
        if (!activeMegaCategory || activeMegaCategory === "all") {
            list = categories;
        } else {
            const mega = megaCategories.find((m) => m.id === activeMegaCategory);
            if (mega) {
                list = categories.filter((c) => mega.categoryIds.includes(c.id));
            } else {
                list = categories;
            }
        }

        // Gracefully supplement so exactly 3 categories are always rendered
        // alongside the 1 Search card, creating a balanced 4-column deck in a single row
        if (list.length < 3) {
            const existingIds = new Set(list.map((c) => c.id));
            const remaining = categories.filter((c) => !existingIds.has(c.id));
            list = [...list, ...remaining.slice(0, 3 - list.length)];
        }
        return list.slice(0, 3);
    }, [categories, activeMegaCategory]);

    // Handle toggle category star
    const handleToggleCategoryStar = async (catId: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!user) {
            requireAuth(() => handleToggleCategoryStar(catId, e));
            return;
        }

        setCategories((prev) =>
            prev.map((c) => (c.id === catId ? { ...c, isStarred: !c.isStarred } : c))
        );

        try {
            await toggleCategoryStarAction(catId, user.id);
        } catch {
            setCategories((prev) =>
                prev.map((c) => (c.id === catId ? { ...c, isStarred: !c.isStarred } : c))
            );
        }
    };

    // Handle toggle category favorite
    const handleToggleCategoryFavorite = async (catId: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!user) {
            requireAuth(() => handleToggleCategoryFavorite(catId, e));
            return;
        }

        setCategories((prev) =>
            prev.map((c) => (c.id === catId ? { ...c, isFavorite: !c.isFavorite } : c))
        );

        try {
            await toggleCategoryFavoriteAction(catId, user.id);
        } catch {
            setCategories((prev) =>
                prev.map((c) => (c.id === catId ? { ...c, isFavorite: !c.isFavorite } : c))
            );
        }
    };

    // Handle add tag to category for better search results
    const handleAddCategoryTag = async (catId: string, e: React.FormEvent) => {
        e.preventDefault();
        e.stopPropagation();
        const tag = newTagInput.trim().toLowerCase().replace(/^#/, "");
        if (!tag) {
            setAddingTagCatId(null);
            return;
        }

        try {
            const res = await addCategoryTagAction(catId, tag);
            setCategories((prev) =>
                prev.map((c) => (c.id === catId ? { ...c, tags: res.tags } : c))
            );
            setNewTagInput("");
            setAddingTagCatId(null);
        } catch {
            setAddingTagCatId(null);
        }
    };

    const handleSearchSubmit = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        onViewForum(undefined, activeMegaCategory);
    };

    const getCategoryIcon = (id: string) => {
        switch (id) {
            case "videos":
                return <Video className="w-4 h-4 sm:w-5 sm:h-5 text-white" />;
            case "vlogs":
                return <Film className="w-4 h-4 sm:w-5 sm:h-5 text-white" />;
            case "community-posts":
                return <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-white" />;
            case "history":
                return <Compass className="w-4 h-4 sm:w-5 sm:h-5 text-white" />;
            case "philosophy":
                return <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-white" />;
            case "science":
                return <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-white" />;
            case "culture":
                return <Award className="w-4 h-4 sm:w-5 sm:h-5 text-white" />;
            case "development":
                return <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-white" />;
            case "society":
                return <Users2 className="w-4 h-4 sm:w-5 sm:h-5 text-white" />;
            default:
                return <Layers className="w-4 h-4 sm:w-5 sm:h-5 text-white" />;
        }
    };

    return (
        <section
            id="forum"
            className="relative min-h-screen flex flex-col justify-start bg-[#060D1E] text-white pt-5 sm:pt-6 lg:pt-7 pb-6 sm:pb-7 lg:pb-8 overflow-hidden select-none"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
        >
            {/* Top Atmospheric Gradient Wash */}
            <div className="absolute top-0 left-0 right-0 h-[520px] bg-gradient-to-b from-[#0A1633] via-[#081228] to-transparent pointer-events-none z-0" />

            {/* Glowing Ambient Cyan & Amber Orbs in the background */}
            <div
                className="absolute top-12 left-1/4 w-[550px] h-[380px] rounded-full pointer-events-none opacity-20 blur-[130px] z-0"
                style={{ background: "radial-gradient(circle, #0284C7 0%, transparent 70%)" }}
            />
            <div
                className="absolute top-20 right-10 w-[500px] h-[420px] rounded-full pointer-events-none opacity-15 blur-[140px] z-0"
                style={{ background: "radial-gradient(circle, #F59E0B 0%, transparent 70%)" }}
            />

            {/* Content Container (Calibrated for Windows 1080p 125% zoom screen height) */}
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 w-full flex flex-col gap-4 sm:gap-5">

                {/* ============================================================== */}
                {/* 1. HERO SPLIT: EXPANDED JOIN THE CONVERSATION + SPOTLIGHT      */}
                {/* ============================================================== */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-7 xl:gap-8 items-center">

                    {/* LEFT COLUMN: WHAT'S NEW CARD CAROUSEL (Span 5 on lg, Span 4 on xl) */}
                    <div className="lg:col-span-5 xl:col-span-4">
                        <WhatsNewCarousel
                            onViewMegaThread={onViewMegaThread || ((id) => onViewForum(id))}
                            onViewThread={onViewThread}
                        />
                    </div>

                    {/* RIGHT COLUMN: "JOIN THE CONVERSATION" HERO (Span 7 on lg, Span 8 on xl) */}
                    <div className="lg:col-span-7 xl:col-span-8 flex flex-col justify-center pl-0 lg:pl-3 xl:pl-5 relative w-full">

                        {/* Connected Constellation Network Nodes Background (from Forum.webp) */}
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[320px] h-[320px] opacity-25 pointer-events-none overflow-hidden hidden sm:block">
                            <svg viewBox="0 0 300 300" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <line x1="50" y1="120" x2="120" y2="60" stroke="#38BDF8" strokeWidth="1" strokeOpacity="0.4" />
                                <line x1="120" y1="60" x2="220" y2="90" stroke="#38BDF8" strokeWidth="1" strokeOpacity="0.4" />
                                <line x1="220" y1="90" x2="270" y2="180" stroke="#38BDF8" strokeWidth="1" strokeOpacity="0.4" />
                                <line x1="50" y1="120" x2="140" y2="190" stroke="#38BDF8" strokeWidth="1" strokeOpacity="0.4" />
                                <line x1="140" y1="190" x2="270" y2="180" stroke="#38BDF8" strokeWidth="1" strokeOpacity="0.4" />
                                <line x1="140" y1="190" x2="190" y2="260" stroke="#38BDF8" strokeWidth="1" strokeOpacity="0.4" />
                                <line x1="270" y1="180" x2="190" y2="260" stroke="#38BDF8" strokeWidth="1" strokeOpacity="0.4" />

                                <circle cx="50" cy="120" r="4.5" fill="#38BDF8" filter="drop-shadow(0 0 6px #38BDF8)" />
                                <circle cx="120" cy="60" r="5" fill="#E5A93C" filter="drop-shadow(0 0 6px #E5A93C)" />
                                <circle cx="220" cy="90" r="4" fill="#38BDF8" />
                                <circle cx="270" cy="180" r="6" fill="#FFFFFF" filter="drop-shadow(0 0 8px #FFFFFF)" />
                                <circle cx="140" cy="190" r="5.5" fill="#E5A93C" filter="drop-shadow(0 0 6px #E5A93C)" />
                                <circle cx="190" cy="260" r="4" fill="#38BDF8" />
                            </svg>
                        </div>

                        {/* Preserved Vertical Stack Layout with Increased Scale */}
                        <div className="relative z-10 w-full">
                            <div className="flex items-center gap-2 mb-2">
                                <AshokaCakra className="w-4 h-4 text-[#E5A93C]" />
                                <span className="text-[#E5A93C] text-[11px] sm:text-xs font-bold tracking-[0.25em] uppercase">
                                    NATIONAL CIVILIZATIONAL FORUM
                                </span>
                            </div>

                            <h2
                                className="text-white text-3xl sm:text-4xl md:text-5xl lg:text-[3.2rem] xl:text-[3.7rem] font-bold leading-[0.98] tracking-tight mb-2.5 drop-shadow-[0_4px_30px_rgba(0,0,0,0.8)]"
                                style={{ fontFamily: "'Fraunces', serif" }}
                            >
                                Join the
                                <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-[#F5E6C8] to-[#E5A93C]">
                                    Conversation
                                </span>
                            </h2>

                            <p
                                className="text-white/75 text-xs sm:text-sm lg:text-[14.5px] leading-relaxed max-w-2xl xl:max-w-3xl mb-3"
                                style={{ fontFamily: "'Spectral', Georgia, serif" }}
                            >
                                Connect, share insights, and engage with our vibrant community of scholars, researchers, and citizens exploring India&apos;s living civilizational story.
                            </p>

                            {/* Action Buttons */}
                            <div className="flex flex-wrap items-center gap-3.5 sm:gap-4 mb-3">
                                <button
                                    type="button"
                                    onClick={onNewDiscussion}
                                    className="bg-gradient-to-r from-[#FF7700] via-[#E5A93C] to-[#D97706] hover:brightness-110 text-slate-950 font-bold px-7 py-2.5 sm:px-8 sm:py-3 rounded-full text-xs sm:text-sm tracking-wide flex items-center gap-2.5 shadow-[0_0_22px_rgba(245,158,11,0.45)] hover:shadow-[0_0_32px_rgba(245,158,11,0.7)] hover:scale-105 transition-all cursor-pointer group whitespace-nowrap"
                                >
                                    <span>Start a Discussion</span>
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </button>

                                <button
                                    type="button"
                                    onClick={() => onViewForum()}
                                    className="border border-white/20 hover:border-[#E5A93C] bg-white/5 hover:bg-white/10 text-white/90 px-5 py-2.5 sm:px-6 sm:py-3 rounded-full text-xs sm:text-sm font-semibold tracking-wide transition-all cursor-pointer backdrop-blur-xs flex items-center gap-2 whitespace-nowrap"
                                >
                                    <BookOpen className="w-4 h-4 text-[#E5A93C]" />
                                    <span>Browse Archive</span>
                                </button>
                            </div>

                            {/* Community Stats Bar: Exact Forum Style with bullet dots */}
                            <div className="w-full flex flex-wrap items-center justify-between gap-2.5 text-[11px] sm:text-xs text-white/70 font-medium pt-2 border-t border-white/10">
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

                {/* Subtle Divider Line */}
                <div className="w-full h-px bg-gradient-to-r from-transparent via-white/15 to-transparent my-0.5" />

                {/* ============================================================== */}
                {/* 2. COMPACT CATEGORIES DECK & SEARCH (1-Row Responsive Layout)   */}
                {/* ============================================================== */}
                <div className="flex flex-col gap-2.5">
                    {/* Switcher Bar */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#E5A93C] mr-0.5 flex items-center gap-1.5">
                                <Layers className="w-3.5 h-3.5" /> Mega Category:
                            </span>

                            {megaCategories.map((m) => {
                                const isMegaActive = activeMegaCategory === m.id;
                                return (
                                    <button
                                        key={m.id}
                                        type="button"
                                        onClick={() => {
                                            setActiveMegaCategory(m.id);
                                            setActiveCategory(null);
                                        }}
                                        className={`px-3 py-1 rounded-full text-xs font-semibold tracking-wide transition-all cursor-pointer flex items-center gap-1.5 ${
                                            isMegaActive
                                                ? "bg-gradient-to-r from-[#B85428] to-[#E5A93C] text-white shadow-md shadow-[#E5A93C]/20 border border-[#E5A93C]"
                                                : "bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border border-white/10"
                                        }`}
                                    >
                                        <span>{m.name}</span>
                                        {m.id === "content-gallery" && (
                                            <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-black/30 font-bold uppercase tracking-wider text-amber-200">
                                                Featured
                                            </span>
                                        )}
                                    </button>
                                );
                            })}

                            <button
                                type="button"
                                onClick={() => {
                                    setActiveMegaCategory("all");
                                    setActiveCategory(null);
                                }}
                                className={`px-3 py-1 rounded-full text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                                    activeMegaCategory === "all"
                                        ? "bg-[#E5A93C] text-slate-950 font-bold"
                                        : "bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border border-white/10"
                                }`}
                            >
                                All Categories
                            </button>
                        </div>

                        {activeCategory && (
                            <button
                                type="button"
                                onClick={() => setActiveCategory(null)}
                                className="bg-[#E5A93C]/20 hover:bg-[#E5A93C]/30 text-[#E5A93C] border border-[#E5A93C]/40 px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-semibold flex items-center gap-1 transition-colors cursor-pointer self-start sm:self-auto"
                            >
                                <span>Clear Category Filter</span>
                                <X className="w-3 h-3" />
                            </button>
                        )}
                    </div>

                    {/* 4-Column Grid: 3 Category Cards + 1 Search Card (Single Row on Desktop) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-3.5 items-stretch">
                        {displayedCategories.map((cat) => {
                            const isSelected = activeCategory === cat.id;
                            return (
                                <div
                                    key={cat.id}
                                    onClick={() => {
                                        setActiveCategory(isSelected ? null : cat.id);
                                        onViewForum(cat.id, activeMegaCategory);
                                    }}
                                    className={`rounded-2xl p-3 sm:p-3.5 transition-all duration-300 group cursor-pointer backdrop-blur-md shadow-lg flex flex-col justify-between ${
                                        isSelected
                                            ? "bg-[#102454] border-2 border-[#E5A93C] shadow-[0_0_25px_rgba(229,169,60,0.35)] transform -translate-y-0.5"
                                            : "bg-[#0A1633]/85 hover:bg-[#0D1E45] border border-white/10 hover:border-[#E5A93C]/50 hover:-translate-y-0.5 hover:shadow-xl"
                                    }`}
                                >
                                    <div>
                                        <div className="flex items-start justify-between gap-2 mb-1.5">
                                            <div className="flex items-center gap-2 min-w-0">
                                                <div
                                                    className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center shrink-0 border border-white/20 text-white shadow-sm transition-transform group-hover:scale-105"
                                                    style={{ backgroundColor: cat.color || "#B85428" }}
                                                >
                                                    {getCategoryIcon(cat.id)}
                                                </div>

                                                <div className="min-w-0 flex-1">
                                                    <h3 className="text-xs sm:text-[13px] font-bold tracking-wider uppercase text-white group-hover:text-[#E5A93C] transition-colors truncate">
                                                        {cat.name}
                                                    </h3>
                                                    <p className="text-[10px] sm:text-[11px] text-white/60 truncate leading-snug mt-0.5">
                                                        {cat.description || "Civilizational knowledge domain"}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-1 shrink-0">
                                                <button
                                                    type="button"
                                                    onClick={(e) => handleToggleCategoryStar(cat.id, e)}
                                                    className={`p-1 rounded-lg border transition-colors cursor-pointer ${
                                                        cat.isStarred
                                                            ? "bg-amber-500/20 border-amber-400 text-amber-400"
                                                            : "bg-white/5 border-white/10 text-white/40 hover:text-amber-400"
                                                    }`}
                                                    title={cat.isStarred ? "Starred category (Click to unstar)" : "Star this category"}
                                                >
                                                    <Star className={`w-3 h-3 ${cat.isStarred ? "fill-amber-400" : ""}`} />
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={(e) => handleToggleCategoryFavorite(cat.id, e)}
                                                    className={`p-1 rounded-lg border transition-colors cursor-pointer ${
                                                        cat.isFavorite
                                                            ? "bg-rose-500/20 border-rose-400 text-rose-400"
                                                            : "bg-white/5 border-white/10 text-white/40 hover:text-rose-400"
                                                    }`}
                                                    title={cat.isFavorite ? "Favorite category (Click to unfavorite)" : "Favorite this category"}
                                                >
                                                    <Heart className={`w-3 h-3 ${cat.isFavorite ? "fill-rose-400" : ""}`} />
                                                </button>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap items-center gap-1 mt-1.5 pt-1.5 border-t border-white/10">
                                            {cat.tags && cat.tags.slice(0, 3).map((tag) => (
                                                <button
                                                    key={tag}
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        onViewForum(cat.id, activeMegaCategory);
                                                    }}
                                                    className="text-[9px] px-1.5 py-0.5 rounded-full transition-colors cursor-pointer bg-white/5 hover:bg-white/15 text-white/70 border border-white/10"
                                                    title={`Filter threads by #${tag}`}
                                                >
                                                    #{tag}
                                                </button>
                                            ))}

                                            {addingTagCatId === cat.id ? (
                                                <form
                                                    onSubmit={(e) => handleAddCategoryTag(cat.id, e)}
                                                    className="flex items-center gap-1"
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    <input
                                                        type="text"
                                                        value={newTagInput}
                                                        onChange={(e) => setNewTagInput(e.target.value)}
                                                        placeholder="tag"
                                                        autoFocus
                                                        className="w-12 px-1 py-0.5 text-[9px] bg-slate-950 border border-[#E5A93C] text-white rounded-xs focus:outline-none"
                                                    />
                                                    <button
                                                        type="submit"
                                                        className="text-[9px] bg-[#E5A93C] text-slate-950 px-1 py-0.5 rounded-xs font-bold cursor-pointer"
                                                    >
                                                        Add
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setAddingTagCatId(null);
                                                        }}
                                                        className="text-[9px] text-white/50 hover:text-white px-0.5 cursor-pointer"
                                                    >
                                                        ✕
                                                    </button>
                                                </form>
                                            ) : (
                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setAddingTagCatId(cat.id);
                                                        setNewTagInput("");
                                                    }}
                                                    className="text-[9px] text-[#E5A93C] hover:text-[#FBBF24] font-semibold flex items-center gap-0.5 px-1 py-0.5 rounded-xs bg-[#E5A93C]/10 border border-[#E5A93C]/20 hover:bg-[#E5A93C]/20 transition-colors cursor-pointer"
                                                    title="Add a tag to this category for better search results"
                                                >
                                                    <Plus className="w-2.5 h-2.5" />
                                                    <span>Tag</span>
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between pt-1.5 mt-1.5 border-t border-white/10 text-[11px]">
                                        <span className="text-white/65 font-medium">
                                            {cat.count} {cat.count === 1 ? "Discussion" : "Discussions"}
                                        </span>

                                        <span className="text-[#E5A93C] font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                                            <span>{isSelected ? "Filtered" : "Explore"}</span>
                                            <ArrowRight className="w-3 h-3" />
                                        </span>
                                    </div>
                                </div>
                            );
                        })}

                        {/* 4th Column: Search Categories Card */}
                        <div className="h-full flex flex-col">
                            <div className="bg-[#0A1633]/85 hover:bg-[#0D1E45] border border-white/10 hover:border-[#E5A93C]/40 rounded-2xl p-3 sm:p-3.5 backdrop-blur-md shadow-lg flex flex-col justify-between h-full transition-all group">
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="w-8 h-8 rounded-lg bg-[#E5A93C]/15 border border-[#E5A93C]/30 flex items-center justify-center text-[#E5A93C] shrink-0">
                                            <Search className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <h3 className="text-xs font-bold tracking-wider uppercase text-white group-hover:text-[#E5A93C] transition-colors">
                                                SEARCH CATEGORIES
                                            </h3>
                                            <p className="text-[10px] text-white/55 leading-tight">
                                                215K+ civilizational topics
                                            </p>
                                        </div>
                                    </div>

                                    <div className="relative mb-2">
                                        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/40" />
                                        <input
                                            type="text"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter") handleSearchSubmit(e);
                                            }}
                                            placeholder="Keywords, scholars, texts..."
                                            className="w-full pl-8 pr-7 py-1.5 rounded-xl border border-white/15 bg-[#060D1E]/90 focus:bg-[#060D1E] focus:outline-none focus:border-[#E5A93C] text-[11px] text-white placeholder-white/40 shadow-inner transition-all"
                                        />
                                        {searchQuery && (
                                            <button
                                                type="button"
                                                onClick={() => setSearchQuery("")}
                                                className="absolute right-2 top-1/2 -translate-y-1/2 text-white/40 hover:text-white cursor-pointer"
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                        )}
                                    </div>

                                    <div className="flex flex-wrap items-center gap-1">
                                        <span className="text-[9px] text-white/40 uppercase font-semibold mr-0.5">Trending:</span>
                                        {["Saraswati", "Nyaya", "Astronomy"].map((tag) => (
                                            <button
                                                key={tag}
                                                type="button"
                                                onClick={() => {
                                                    setSearchQuery(tag);
                                                    onViewForum(undefined, activeMegaCategory);
                                                }}
                                                className="text-[9px] bg-white/5 hover:bg-[#E5A93C]/20 text-white/70 hover:text-[#E5A93C] border border-white/10 hover:border-[#E5A93C]/40 px-1.5 py-0.5 rounded-full transition-colors cursor-pointer"
                                            >
                                                {tag}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-1.5 mt-1.5 border-t border-white/10 text-[11px]">
                                    <span className="text-white/60 font-medium truncate max-w-[90px]">
                                        {searchQuery ? `"${searchQuery}"` : "Active Query"}
                                    </span>

                                    <button
                                        type="button"
                                        onClick={() => handleSearchSubmit()}
                                        className="text-[#E5A93C] font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform cursor-pointer shrink-0"
                                    >
                                        <span>View Results</span>
                                        <ArrowRight className="w-3 h-3" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
}
