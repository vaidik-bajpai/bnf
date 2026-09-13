'use client';

import { useState, useMemo, useEffect } from "react";
import {
    Search,
    Plus,
    Layers,
    Sparkles,
    TrendingUp,
    Clock,
    BookOpen,
} from "lucide-react";
import { AshokaCakra, TricolorStripe } from "../Symbols";
import { forumCategories, getMegaThreads, getAllDiscussions } from "@/data/forumData";
import { getMegaThreadsAction, getDiscussions } from "@/app/actions/forum";
import type { MegaThread, Discussion } from "@/types/forum";
import MegaThreadCard from "./MegaThreadCard";
import DiscussionCard from "./DiscussionCard";

interface ForumHomeProps {
    onViewThread: (id: string) => void;
    onViewMegaThread: (id: string) => void;
    onNewDiscussion: () => void;
}

export default function ForumHome({
    onViewThread,
    onViewMegaThread,
    onNewDiscussion,
}: ForumHomeProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [activeCategory, setActiveCategory] = useState<string | null>(null);
    const [megaThreadFilter, setMegaThreadFilter] = useState<"featured" | "active" | "popular">("featured");
    const [discussionFilter, setDiscussionFilter] = useState<"latest" | "trending" | "pinned">("latest");

    const [allMegaThreads, setAllMegaThreads] = useState<MegaThread[]>(() => getMegaThreads());
    const [allDiscussions, setAllDiscussions] = useState<Discussion[]>(() => getAllDiscussions());

    useEffect(() => {
        let active = true;
        Promise.all([
            getMegaThreadsAction(),
            getDiscussions({
                categoryId: activeCategory,
                search: searchQuery.trim() || undefined,
                sortBy: discussionFilter,
            }),
        ]).then(([dbMts, dbDiscs]) => {
            if (!active) return;
            if (dbMts && dbMts.length > 0) {
                setAllMegaThreads(dbMts as unknown as MegaThread[]);
            }
            if (dbDiscs && dbDiscs.length > 0) {
                setAllDiscussions(dbDiscs as unknown as Discussion[]);
            }
        }).catch((err) => {
            console.error("Backend fetch error in ForumHome:", err);
        });

        return () => {
            active = false;
        };
    }, [activeCategory, searchQuery, discussionFilter]);

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
        } else {
            // Latest
            list.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
        }

        return list;
    }, [allDiscussions, activeCategory, searchQuery, discussionFilter]);

    // MegaThread ID to Title lookup
    const megaThreadMap = useMemo(() => {
        const map = new Map<string, string>();
        allMegaThreads.forEach((m) => map.set(m.id, m.title));
        return map;
    }, [allMegaThreads]);

    return (
        <div className="min-h-screen bg-[#FAFAF7]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            {/* Hero Section */}
            <div className="bg-[#0F1C3F] pt-24 pb-14 px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div>
                            <div className="flex items-center gap-3 mb-3">
                                <AshokaCakra className="w-7 h-7 text-[#C8971A]" />
                                <span className="text-[#C8971A] text-xs font-semibold tracking-[0.3em] uppercase">
                                    Community Forum
                                </span>
                            </div>
                            <h1
                                className="text-white text-3xl md:text-4xl font-bold mb-3"
                                style={{ fontFamily: "'Fraunces', serif" }}
                            >
                                Ideas, History &amp; Civilization
                            </h1>
                            <p className="text-white/60 max-w-xl text-base leading-relaxed" style={{ fontFamily: "'Spectral', Georgia, serif" }}>
                                A space for rigorous, generous exchange on India&apos;s intellectual, cultural, and civilizational heritage. Discover through thematic MegaThreads or delve into specific discussions.
                            </p>
                        </div>
                        <button
                            onClick={onNewDiscussion}
                            className="shrink-0 flex items-center gap-2 bg-[#B85428] hover:bg-[#A04820] text-white px-6 py-3.5 text-xs font-semibold tracking-wide uppercase transition-colors cursor-pointer shadow-md"
                        >
                            <Plus className="w-4 h-4" /> Start a Discussion
                        </button>
                    </div>
                </div>
            </div>
            <TricolorStripe />

            <div className="max-w-6xl mx-auto px-6 py-10">
                {/* Search Bar */}
                <div className="relative mb-8">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9E8F85]" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search MegaThreads and discussions — history, philosophy, science, arts..."
                        className="w-full pl-11 pr-4 py-3.5 border border-[#EDE8DF] bg-white focus:outline-none focus:border-[#B85428] transition-colors text-sm text-[#1C1917] placeholder-[#9E8F85] shadow-xs"
                    />
                </div>

                {/* Categories Filter Bar */}
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-9 gap-2 mb-12">
                    <button
                        onClick={() => setActiveCategory(null)}
                        className={`p-2.5 text-center text-xs font-semibold border transition-all cursor-pointer ${!activeCategory
                                ? "bg-[#B85428] text-white border-[#B85428]"
                                : "bg-white text-[#6B5B4E] border-[#EDE8DF] hover:border-[#B85428]"
                            }`}
                    >
                        All Categories
                    </button>
                    {forumCategories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => setActiveCategory(activeCategory === cat.id ? null : cat.id)}
                            className={`p-2.5 text-center text-xs font-semibold border transition-all cursor-pointer ${activeCategory === cat.id
                                    ? "text-white border-transparent"
                                    : "bg-white text-[#6B5B4E] border-[#EDE8DF] hover:border-[#B85428]"
                                }`}
                            style={activeCategory === cat.id ? { backgroundColor: cat.color, borderColor: cat.color } : {}}
                            title={cat.name}
                        >
                            <div className="flex flex-col items-center gap-1">
                                <span style={activeCategory === cat.id ? {} : { color: cat.color }}>{cat.icon}</span>
                                <span className="leading-tight truncate w-full">{cat.name.split(" ")[0]}</span>
                            </div>
                        </button>
                    ))}
                </div>

                {/* ============================================================ */}
                {/* SECTION 1: MEGATHREADS DISCOVERY (Major discovery mechanism) */}
                {/* ============================================================ */}
                <div className="mb-14">
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6 border-b border-[#EDE8DF] pb-4">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <Layers className="w-4 h-4 text-[#B85428]" />
                                <span className="text-[#B85428] text-xs font-semibold uppercase tracking-wider">
                                    Thematic Anchor
                                </span>
                            </div>
                            <h2
                                className="text-2xl font-bold text-[#1C1917]"
                                style={{ fontFamily: "'Fraunces', serif" }}
                            >
                                Categories
                            </h2>
                            <p className="text-xs text-[#6B5B4E] mt-0.5">
                                Overarching civilizational themes grouping related discussions, archives, and scholarly dialogue.
                            </p>
                        </div>

                        {/* MegaThread Filter Buttons */}
                        <div className="flex items-center gap-1 bg-white border border-[#EDE8DF] p-1 self-start sm:self-auto rounded-xs">
                            <button
                                onClick={() => setMegaThreadFilter("featured")}
                                className={`px-3 py-1.5 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${megaThreadFilter === "featured"
                                        ? "bg-[#B85428] text-white"
                                        : "text-[#6B5B4E] hover:text-[#1C1917]"
                                    }`}
                            >
                                <Sparkles className="w-3.5 h-3.5" /> Featured
                            </button>
                            <button
                                onClick={() => setMegaThreadFilter("active")}
                                className={`px-3 py-1.5 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${megaThreadFilter === "active"
                                        ? "bg-[#B85428] text-white"
                                        : "text-[#6B5B4E] hover:text-[#1C1917]"
                                    }`}
                            >
                                <Clock className="w-3.5 h-3.5" /> Recently Active
                            </button>
                            <button
                                onClick={() => setMegaThreadFilter("popular")}
                                className={`px-3 py-1.5 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${megaThreadFilter === "popular"
                                        ? "bg-[#B85428] text-white"
                                        : "text-[#6B5B4E] hover:text-[#1C1917]"
                                    }`}
                            >
                                <TrendingUp className="w-3.5 h-3.5" /> Popular
                            </button>
                        </div>
                    </div>

                    {/* MegaThread Grid */}
                    {filteredMegaThreads.length === 0 ? (
                        <div className="bg-white border border-[#EDE8DF] p-8 text-center text-[#9E8F85]">
                            No MegaThreads found matching your criteria.
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredMegaThreads.map((mt) => (
                                <MegaThreadCard
                                    key={mt.id}
                                    megaThread={mt}
                                    featured={mt.featured}
                                    onClick={() => onViewMegaThread(mt.id)}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* ============================================================ */}
                {/* SECTION 2: DISCUSSIONS STREAM & SIDEBAR                      */}
                {/* ============================================================ */}
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Discussions Feed */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="flex items-center justify-between border-b border-[#EDE8DF] pb-3">
                            <div className="flex items-center gap-1">
                                {(["latest", "trending", "pinned"] as const).map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => setDiscussionFilter(tab)}
                                        className={`px-3.5 py-2 text-xs font-semibold capitalize transition-colors cursor-pointer ${discussionFilter === tab
                                                ? "text-[#B85428] border-b-2 border-[#B85428]"
                                                : "text-[#9E8F85] hover:text-[#1C1917]"
                                            }`}
                                    >
                                        {tab === "trending" ? (
                                            <>
                                                <TrendingUp className="w-3.5 h-3.5 inline mr-1" />
                                                Trending
                                            </>
                                        ) : (
                                            tab.charAt(0).toUpperCase() + tab.slice(1)
                                        )}
                                    </button>
                                ))}
                            </div>
                            <span className="text-xs text-[#9E8F85]">
                                {filteredDiscussions.length} discussion{filteredDiscussions.length !== 1 ? "s" : ""}
                            </span>
                        </div>

                        {/* Discussions List */}
                        <div className="space-y-3">
                            {filteredDiscussions.length === 0 ? (
                                <div className="bg-white border border-[#EDE8DF] p-10 text-center text-[#9E8F85]">
                                    <BookOpen className="w-8 h-8 mx-auto mb-2 opacity-30" />
                                    <p className="text-sm text-[#4A403A]">No discussions match your filter.</p>
                                </div>
                            ) : (
                                filteredDiscussions.map((d) => (
                                    <DiscussionCard
                                        key={d.id}
                                        discussion={d}
                                        megaThreadTitle={d.megaThreadId ? megaThreadMap.get(d.megaThreadId) : undefined}
                                        onClick={() => onViewThread(d.id)}
                                    />
                                ))
                            )}
                        </div>
                    </div>

                    {/* Sidebar Overview */}
                    <div className="space-y-6">
                        {/* Forum Overview Card */}
                        <div className="bg-white border border-[#EDE8DF] p-5 shadow-sm">
                            <h4 className="font-bold text-[#1C1917] text-xs uppercase tracking-widest mb-4">
                                Forum Overview
                            </h4>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <div
                                        className="text-2xl font-bold text-[#B85428]"
                                        style={{ fontFamily: "'Fraunces', serif" }}
                                    >
                                        {allMegaThreads.length}
                                    </div>
                                    <div className="text-xs text-[#9E8F85] mt-0.5">MegaThreads</div>
                                </div>
                                <div>
                                    <div
                                        className="text-2xl font-bold text-[#0F1C3F]"
                                        style={{ fontFamily: "'Fraunces', serif" }}
                                    >
                                        {allDiscussions.length}
                                    </div>
                                    <div className="text-xs text-[#9E8F85] mt-0.5">Discussions</div>
                                </div>
                                <div>
                                    <div
                                        className="text-2xl font-bold text-[#2D6A4F]"
                                        style={{ fontFamily: "'Fraunces', serif" }}
                                    >
                                        {forumCategories.length}
                                    </div>
                                    <div className="text-xs text-[#9E8F85] mt-0.5">Categories</div>
                                </div>
                                <div>
                                    <div
                                        className="text-2xl font-bold text-[#C8971A]"
                                        style={{ fontFamily: "'Fraunces', serif" }}
                                    >
                                        1,800+
                                    </div>
                                    <div className="text-xs text-[#9E8F85] mt-0.5">Scholars</div>
                                </div>
                            </div>
                        </div>

                        {/* Quick MegaThread List */}
                        <div className="bg-white border border-[#EDE8DF] p-5 shadow-sm">
                            <h4 className="font-bold text-[#1C1917] text-xs uppercase tracking-widest mb-3 flex items-center justify-between">
                                <span>Popular MegaThreads</span>
                                <Layers className="w-3.5 h-3.5 text-[#B85428]" />
                            </h4>
                            <div className="space-y-2.5">
                                {allMegaThreads.slice(0, 5).map((mt) => (
                                    <button
                                        key={mt.id}
                                        onClick={() => onViewMegaThread(mt.id)}
                                        className="w-full text-left p-2 hover:bg-[#FAF6F0] rounded-xs transition-colors flex items-center justify-between text-xs text-[#3C3430] group cursor-pointer"
                                    >
                                        <span className="font-medium group-hover:text-[#B85428] truncate max-w-[200px]">
                                            {mt.title}
                                        </span>
                                        <span className="text-[#9E8F85] shrink-0 font-mono">
                                            {mt.discussionCount}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* CTA Box */}
                        <div className="bg-[#0F1C3F] p-6 text-center shadow-sm">
                            <AshokaCakra className="w-10 h-10 mx-auto text-[#C8971A] mb-3 opacity-80" />
                            <h4
                                className="text-white font-bold text-base mb-2"
                                style={{ fontFamily: "'Fraunces', serif" }}
                            >
                                Initiate an Inquiry
                            </h4>
                            <p className="text-white/65 text-xs leading-relaxed mb-5">
                                Propose a new discussion under any MegaThread to engage scholars, researchers, and students.
                            </p>
                            <button
                                onClick={onNewDiscussion}
                                className="w-full bg-[#B85428] hover:bg-[#A04820] text-white py-3 text-xs font-semibold tracking-wide uppercase transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                            >
                                <Plus className="w-4 h-4" /> Start a Discussion
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}