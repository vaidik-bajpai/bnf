'use client';

import { useState, useEffect, useTransition } from "react";
import {
    Search,
    MessageSquare,
    Eye,
    Clock,
    TrendingUp,
    Plus,
    Star,
    Loader2,
} from "lucide-react";
import { AshokaCakra, TricolorStripe } from "../Symbols";
import { forumCategories } from "@/data/forumData";
import { getDiscussions } from "@/app/actions/forum";

interface ForumHomeProps {
    onViewThread: (id: string) => void;
    onNewDiscussion: () => void;
}

// Inferred return type from prisma query in getDiscussions
type DbDiscussion = Awaited<ReturnType<typeof getDiscussions>>[number];

function formatRelativeTime(dateInput: Date | string): string {
    const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return "Just now";
    const minutes = Math.floor(diffInSeconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `${days}d ago`;
    return date.toLocaleDateString("en-IN", { month: "short", day: "numeric" });
}

export default function ForumHome({ onViewThread, onNewDiscussion }: ForumHomeProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [activeCategory, setActiveCategory] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<"latest" | "trending" | "pinned">("latest");

    const [discussions, setDiscussions] = useState<DbDiscussion[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isPending, startTransition] = useTransition();

    useEffect(() => {
        let isSubscribed = true;

        async function fetchThreads() {
            setIsLoading(true);
            try {
                const data = await getDiscussions({
                    categoryId: activeCategory,
                    search: searchQuery.trim() || undefined,
                    sortBy: activeTab,
                });
                if (isSubscribed) {
                    setDiscussions(data);
                }
            } catch (err) {
                console.error("Failed to load discussions:", err);
            } finally {
                if (isSubscribed) {
                    setIsLoading(false);
                }
            }
        }

        const timer = setTimeout(() => {
            startTransition(() => {
                fetchThreads();
            });
        }, 250);

        return () => {
            isSubscribed = false;
            clearTimeout(timer);
        };
    }, [activeCategory, searchQuery, activeTab]);

    return (
        <div className="min-h-screen bg-[#FAFAF7]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            {/* Hero */}
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
                            <h1 className="text-white text-3xl md:text-4xl font-bold mb-3" style={{ fontFamily: "'Fraunces', serif" }}>
                                Ideas, History &amp; Civilization
                            </h1>
                            <p className="text-white/55 max-w-xl">
                                A space for rigorous, generous exchange on India&apos;s intellectual, cultural, and civilizational heritage.
                            </p>
                        </div>
                        <button
                            onClick={onNewDiscussion}
                            className="shrink-0 flex items-center gap-2 bg-[#B85428] hover:bg-[#A04820] text-white px-6 py-3.5 text-sm font-semibold tracking-wide transition-colors cursor-pointer"
                        >
                            <Plus className="w-4 h-4" /> Start a Discussion
                        </button>
                    </div>
                </div>
            </div>
            <TricolorStripe />

            <div className="max-w-6xl mx-auto px-6 py-10">
                {/* Search */}
                <div className="relative mb-8">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9E8F85]" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search discussions — history, philosophy, science, arts..."
                        className="w-full pl-11 pr-4 py-3.5 border border-[#EDE8DF] bg-white focus:outline-none focus:border-[#B85428] transition-colors text-sm text-[#1C1917] placeholder-[#9E8F85]"
                    />
                    {(isLoading || isPending) && (
                        <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#B85428] animate-spin" />
                    )}
                </div>

                {/* Categories Bar */}
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 mb-10">
                    <button
                        onClick={() => setActiveCategory(null)}
                        className={`p-3 text-center text-xs font-semibold border transition-all cursor-pointer ${!activeCategory
                                ? "bg-[#B85428] text-white border-[#B85428]"
                                : "bg-white text-[#6B5B4E] border-[#EDE8DF] hover:border-[#B85428]"
                            }`}
                    >
                        All
                    </button>
                    {forumCategories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => setActiveCategory(activeCategory === cat.id ? null : cat.id)}
                            className={`p-3 text-center text-xs font-semibold border transition-all cursor-pointer ${activeCategory === cat.id
                                    ? "text-white border-transparent"
                                    : "bg-white text-[#6B5B4E] border-[#EDE8DF] hover:border-[#B85428]"
                                }`}
                            style={activeCategory === cat.id ? { backgroundColor: cat.color, borderColor: cat.color } : {}}
                            title={cat.name}
                        >
                            <div className="flex flex-col items-center gap-1">
                                <span style={activeCategory === cat.id ? {} : { color: cat.color }}>{cat.icon}</span>
                                <span className="leading-tight">{cat.name.split(" ")[0]}</span>
                            </div>
                        </button>
                    ))}
                </div>

                {/* Main Content Layout */}
                <div className="grid lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        {/* Filter Tabs */}
                        <div className="flex items-center gap-1 mb-5 border-b border-[#EDE8DF]">
                            {(["latest", "trending", "pinned"] as const).map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`px-4 py-2.5 text-sm font-semibold capitalize transition-colors cursor-pointer ${activeTab === tab
                                            ? "text-[#B85428] border-b-2 border-[#B85428]"
                                            : "text-[#9E8F85] hover:text-[#1C1917]"
                                        }`}
                                >
                                    {tab === "trending" ? (
                                        <>
                                            <TrendingUp className="w-3.5 h-3.5 inline mr-1.5" />
                                            Trending
                                        </>
                                    ) : (
                                        tab.charAt(0).toUpperCase() + tab.slice(1)
                                    )}
                                </button>
                            ))}
                            <div className="ml-auto text-xs text-[#9E8F85]">
                                {discussions.length} discussion{discussions.length !== 1 ? "s" : ""}
                            </div>
                        </div>

                        {/* Discussions List / Loading Skeletons */}
                        <div className="space-y-3">
                            {isLoading && discussions.length === 0 ? (
                                <div className="space-y-3">
                                    {[1, 2, 3].map((n) => (
                                        <div key={n} className="bg-white border border-[#EDE8DF] p-5 animate-pulse">
                                            <div className="flex gap-4">
                                                <div className="w-9 h-9 bg-stone-200 rounded-full shrink-0" />
                                                <div className="flex-1 space-y-2">
                                                    <div className="h-4 bg-stone-200 rounded w-3/4" />
                                                    <div className="h-3 bg-stone-100 rounded w-full" />
                                                    <div className="h-3 bg-stone-100 rounded w-1/2" />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                discussions.map((d) => (
                                    <div
                                        key={d.id}
                                        onClick={() => onViewThread(d.id)}
                                        className="bg-white border border-[#EDE8DF] p-5 cursor-pointer hover:border-[#B85428]/40 hover:shadow-md transition-all group"
                                    >
                                        {d.pinned && (
                                            <div className="text-[#C8971A] text-xs font-semibold tracking-widest uppercase mb-2 flex items-center gap-1.5">
                                                <Star className="w-3 h-3" /> Pinned
                                            </div>
                                        )}
                                        <div className="flex gap-4">
                                            <div
                                                className="shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold"
                                                style={{ backgroundColor: d.author.bg || "#B85428" }}
                                            >
                                                {d.author.initials}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3
                                                    className="font-semibold text-[#1C1917] text-[0.95rem] leading-snug mb-1.5 group-hover:text-[#B85428] transition-colors"
                                                    style={{ fontFamily: "'Spectral', serif" }}
                                                >
                                                    {d.title}
                                                </h3>
                                                <p className="text-[#6B5B4E] text-sm leading-relaxed line-clamp-2 mb-3">
                                                    {d.excerpt}
                                                </p>
                                                <div className="flex flex-wrap items-center gap-4 text-xs text-[#9E8F85]">
                                                    <span className="font-medium" style={{ color: d.category.color }}>
                                                        {d.category.name}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <MessageSquare className="w-3.5 h-3.5" /> {d._count.replies}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Eye className="w-3.5 h-3.5" /> {d.views.toLocaleString()}
                                                    </span>
                                                    <span className="flex items-center gap-1 ml-auto">
                                                        <Clock className="w-3.5 h-3.5" /> {formatRelativeTime(d.lastActivity)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}

                            {!isLoading && discussions.length === 0 && (
                                <div className="text-center py-16 text-[#9E8F85]">
                                    <Search className="w-10 h-10 mx-auto mb-3 opacity-30" />
                                    <p>No discussions found in the database matching your criteria.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        <div className="bg-white border border-[#EDE8DF] p-5">
                            <h4 className="font-bold text-[#1C1917] text-sm tracking-wide mb-4 uppercase">Forum Overview</h4>
                            <div className="grid grid-cols-2 gap-4">
                                {[
                                    { label: "Discussions", value: discussions.length.toString() },
                                    { label: "Categories", value: forumCategories.length.toString() },
                                ].map((s) => (
                                    <div key={s.label}>
                                        <div className="text-xl font-bold text-[#B85428]" style={{ fontFamily: "'Fraunces', serif" }}>
                                            {s.value}
                                        </div>
                                        <div className="text-xs text-[#9E8F85] mt-0.5">{s.label}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-white border border-[#EDE8DF] p-5">
                            <h4 className="font-bold text-[#1C1917] text-sm tracking-wide mb-4 uppercase">Categories</h4>
                            <div className="space-y-3">
                                {forumCategories.map((cat) => (
                                    <button
                                        key={cat.id}
                                        onClick={() => setActiveCategory(activeCategory === cat.id ? null : cat.id)}
                                        className="w-full flex items-center justify-between group cursor-pointer"
                                    >
                                        <div className="flex items-center gap-2.5">
                                            <span style={{ color: cat.color }}>{cat.icon}</span>
                                            <span
                                                className={`text-sm transition-colors ${activeCategory === cat.id
                                                        ? "text-[#B85428] font-semibold"
                                                        : "text-[#3C3430] group-hover:text-[#B85428]"
                                                    }`}
                                            >
                                                {cat.name}
                                            </span>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="bg-[#0F1C3F] p-6 text-center">
                            <AshokaCakra className="w-10 h-10 mx-auto text-[#C8971A] mb-3 opacity-70" />
                            <p className="text-white/70 text-sm leading-relaxed mb-4">
                                Have a question, insight, or discovery to share? The community is listening.
                            </p>
                            <button
                                onClick={onNewDiscussion}
                                className="w-full bg-[#B85428] hover:bg-[#A04820] text-white py-3 text-sm font-semibold tracking-wide transition-colors flex items-center justify-center gap-2 cursor-pointer"
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