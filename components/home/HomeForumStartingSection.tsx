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
    X,
} from "lucide-react";
import { AshokaCakra } from "../Symbols";
import WhatsNewCarousel from "../forum/WhatsNewCarousel";
import { megaCategories, forumCategories } from "@/data/forumData";
import {
    getMegaThreadsAction,
    getDiscussions,
    getCategoriesAction,
    getForumStatsAction,
    toggleCategoryStarAction,
    toggleCategoryFavoriteAction,
    addCategoryTagAction,
} from "@/app/actions/forum";
import { useAuth } from "@/context/AuthContext";
import type { MegaThread, Discussion, ForumCategory } from "@/types/forum";

interface HomeForumStartingSectionProps {
    onViewForum: (category?: string, megaCategory?: string) => void;
    onViewThread: (id: string) => void;
    onNewDiscussion: () => void;
    onViewMegaThread?: (id: string) => void;
}

export default function HomeForumStartingSection({
    onViewForum,
    onViewThread,
    onNewDiscussion,
    onViewMegaThread,
}: HomeForumStartingSectionProps) {
    const { user, requireAuth } = useAuth();
    const [searchQuery, setSearchQuery] = useState("");
    const [activeCategory, setActiveCategory] = useState<string | null>(null);
    const [activeMegaCategory, setActiveMegaCategory] = useState<string>("content-gallery");
    const [categories, setCategories] = useState<ForumCategory[]>(forumCategories);
    const [allMegaThreads, setAllMegaThreads] = useState<MegaThread[]>([]);
    const [stats, setStats] = useState({ megaThreadCount: 0, discussionCount: 0, categoryCount: 0, scholarCount: 0, postCount: 0 });
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

    // Displayed smaller categories according to selected Mega Category
    const displayedCategories = useMemo(() => {
        if (!activeMegaCategory || activeMegaCategory === "all") {
            return categories;
        }
        const mega = megaCategories.find((m) => m.id === activeMegaCategory);
        if (!mega) return categories;
        return categories.filter((c) => mega.categoryIds.includes(c.id));
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

    // Handle add category tag
    const handleAddCategoryTag = async (catId: string, e: React.FormEvent) => {
        e.preventDefault();
        e.stopPropagation();
        const trimmed = newTagInput.trim().replace(/^#/, "");
        if (!trimmed) return;

        setCategories((prev) =>
            prev.map((c) => {
                if (c.id === catId) {
                    const currentTags = c.tags || [];
                    if (!currentTags.includes(trimmed)) {
                        return { ...c, tags: [...currentTags, trimmed] };
                    }
                }
                return c;
            })
        );
        setAddingTagCatId(null);
        setNewTagInput("");

        try {
            await addCategoryTagAction(catId, trimmed);
        } catch {
            // Error handling
        }
    };

    return (
        <section id="forum" className="relative bg-[#060D1E] text-white overflow-hidden select-none py-12 lg:py-16" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>

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
            {/* 1. TOP HERO & DOMAINS CONTAINER                                */}
            {/* Fills exactly 100vh on desktop so next section is below fold   */}
            {/* ============================================================== */}
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 flex flex-col justify-center gap-5 lg:gap-7">

                {/* HERO SPLIT SECTION (Directly from Forum.webp Reference) */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6 xl:gap-8 items-center py-1">

                    {/* LEFT COLUMN: WHAT'S NEW CARD CAROUSEL (Span 5 on lg, Span 4 on xl matching Card 1) */}
                    <div className="lg:col-span-5 xl:col-span-4">
                        <WhatsNewCarousel
                            onViewMegaThread={onViewMegaThread || ((id) => onViewForum(id))}
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

                            <h2
                                className="text-white text-4xl sm:text-5xl md:text-6xl lg:text-[4.2rem] xl:text-[5.1rem] font-bold leading-[0.98] tracking-tight mb-2.5 drop-shadow-[0_4px_30px_rgba(0,0,0,0.8)]"
                                style={{ fontFamily: "'Fraunces', serif" }}
                            >
                                Join the
                                <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-[#F5E6C8] to-[#E5A93C]">
                                    Conversation
                                </span>
                            </h2>

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
                                    onClick={() => onViewForum()}
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

                {/* 2. MEGA CATEGORIES & SMALLER CATEGORIES GRID */}
                <div>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                        {/* Mega Categories Switcher Tabs */}
                        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-[#E5A93C] mr-1 flex items-center gap-1.5">
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
                                className="bg-[#E5A93C]/20 hover:bg-[#E5A93C]/30 text-[#E5A93C] border border-[#E5A93C]/40 px-2.5 py-0.5 rounded-full text-[11px] font-semibold flex items-center gap-1 transition-colors cursor-pointer self-start sm:self-auto"
                            >
                                <span>Clear Category Filter</span>
                                <X className="w-3 h-3" />
                            </button>
                        )}
                    </div>

                    {/* Main Grid: 2 Columns for Smaller Category Cards (Videos, Vlogs, Community Posts, etc.), 1 Column for Search Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-3.5 sm:gap-4 lg:gap-4.5 items-stretch">

                        {/* LEFT & CENTER: Smaller Category Cards in 2x2 grid (Col Span 2) */}
                        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4 lg:gap-4.5">
                            {displayedCategories.slice(0, 4).map((cat) => {
                                const isSelected = activeCategory === cat.id;
                                return (
                                    <div
                                        key={cat.id}
                                        onClick={() => {
                                            onViewForum(cat.id, activeMegaCategory);
                                        }}
                                        className={`rounded-2xl p-4 sm:p-4.5 transition-all duration-300 group cursor-pointer backdrop-blur-md shadow-lg flex flex-col justify-between ${
                                            isSelected
                                                ? "bg-[#102454] border-2 border-[#E5A93C] shadow-[0_0_25px_rgba(229,169,60,0.35)] transform -translate-y-1"
                                                : "bg-[#0A1633]/85 hover:bg-[#0D1E45] border border-white/10 hover:border-[#E5A93C]/50 hover:-translate-y-1 hover:shadow-xl"
                                        }`}
                                    >
                                        <div>
                                            <div className="flex items-start justify-between gap-3 mb-2">
                                                <div className="flex items-center gap-3 min-w-0">
                                                    {/* Circular/Rounded Icon Container */}
                                                    <div
                                                        className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl flex items-center justify-center shrink-0 border border-white/20 text-white shadow-sm transition-transform group-hover:scale-105"
                                                        style={{ backgroundColor: cat.color || "#B85428" }}
                                                    >
                                                        {cat.id === "videos" ? (
                                                            <Video className="w-5 h-5 text-white" />
                                                        ) : cat.id === "vlogs" ? (
                                                            <Film className="w-5 h-5 text-white" />
                                                        ) : cat.id === "community-posts" ? (
                                                            <FileText className="w-5 h-5 text-white" />
                                                        ) : (
                                                            <Layers className="w-5 h-5 text-white" />
                                                        )}
                                                    </div>

                                                    {/* Title & Subtitle */}
                                                    <div className="min-w-0 flex-1">
                                                        <h3 className="text-xs sm:text-sm font-bold tracking-wider uppercase text-white group-hover:text-[#E5A93C] transition-colors truncate">
                                                            {cat.name}
                                                        </h3>
                                                        <p className="text-[11px] text-white/60 truncate leading-snug mt-0.5">
                                                            {cat.description || "Civilizational knowledge domain"}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Category Star & Favorite Buttons */}
                                                <div className="flex items-center gap-1 shrink-0">
                                                    <button
                                                        type="button"
                                                        onClick={(e) => handleToggleCategoryStar(cat.id, e)}
                                                        className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                                                            cat.isStarred
                                                                ? "bg-amber-500/20 border-amber-400 text-amber-400"
                                                                : "bg-white/5 border-white/10 text-white/40 hover:text-amber-400"
                                                        }`}
                                                        title={cat.isStarred ? "Starred category (Click to unstar)" : "Star this category"}
                                                    >
                                                        <Star className={`w-3.5 h-3.5 ${cat.isStarred ? "fill-amber-400" : ""}`} />
                                                    </button>

                                                    <button
                                                        type="button"
                                                        onClick={(e) => handleToggleCategoryFavorite(cat.id, e)}
                                                        className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                                                            cat.isFavorite
                                                                ? "bg-rose-500/20 border-rose-400 text-rose-400"
                                                                : "bg-white/5 border-white/10 text-white/40 hover:text-rose-400"
                                                        }`}
                                                        title={cat.isFavorite ? "Favorite category (Click to unfavorite)" : "Favorite this category"}
                                                    >
                                                        <Heart className={`w-3.5 h-3.5 ${cat.isFavorite ? "fill-rose-400" : ""}`} />
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Category Tags List + Add Tag Form */}
                                            <div className="flex flex-wrap items-center gap-1.5 mt-3 pt-2.5 border-t border-white/10">
                                                {cat.tags && cat.tags.slice(0, 4).map((tag) => (
                                                    <button
                                                        key={tag}
                                                        type="button"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            onViewForum(cat.id, activeMegaCategory);
                                                        }}
                                                        className="text-[10px] px-2 py-0.5 rounded-full transition-colors cursor-pointer bg-white/5 hover:bg-white/15 text-white/70 border border-white/10"
                                                        title={`Explore #${tag}`}
                                                    >
                                                        #{tag}
                                                    </button>
                                                ))}

                                                {/* Add Tag Inline Form */}
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
                                                            placeholder="new-tag"
                                                            autoFocus
                                                            className="w-16 sm:w-20 px-1.5 py-0.5 text-[10px] bg-slate-950 border border-[#E5A93C] text-white rounded-xs focus:outline-none"
                                                        />
                                                        <button
                                                            type="submit"
                                                            className="text-[10px] bg-[#E5A93C] text-slate-950 px-1.5 py-0.5 rounded-xs font-bold cursor-pointer"
                                                        >
                                                            Add
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setAddingTagCatId(null);
                                                            }}
                                                            className="text-[10px] text-white/50 hover:text-white px-1 cursor-pointer"
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
                                                        className="text-[10px] text-[#E5A93C] hover:text-[#FBBF24] font-semibold flex items-center gap-0.5 px-1.5 py-0.5 rounded-xs bg-[#E5A93C]/10 border border-[#E5A93C]/20 hover:bg-[#E5A93C]/20 transition-colors cursor-pointer"
                                                        title="Add a tag to this category for better search results"
                                                    >
                                                        <Plus className="w-2.5 h-2.5" />
                                                        <span>Tag</span>
                                                    </button>
                                                )}
                                            </div>
                                        </div>

                                        {/* Bottom Row: Count & Explore Action */}
                                        <div className="flex items-center justify-between pt-3 mt-3 border-t border-white/10 text-xs sm:text-[13px]">
                                            <span className="text-white/65 font-medium">
                                                {cat.count} {cat.count === 1 ? "Discussion" : "Discussions"}
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
                                                if (e.key === "Enter") onViewForum();
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
                                                    onViewForum();
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
                                        onClick={() => onViewForum()}
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
        </section>
    );
}
