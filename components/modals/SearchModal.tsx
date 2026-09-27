'use client';

import React, { useState, useEffect, useMemo } from "react";
import {
    Search,
    X,
    MessageSquare,
    Layers,
    Tag,
    Clock,
    Eye,
    ChevronRight,
    Loader2,
    Sparkles,
} from "lucide-react";
import type { Discussion, ForumCategory } from "@/types/forum";
import { getAllDiscussions, forumCategories } from "@/data/forumData";
import { getDiscussions, getCategoriesAction } from "@/app/actions/forum";

interface SearchModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelectThread: (threadId: string) => void;
    onSelectCategory: (categoryId: string) => void;
}

export default function SearchModal({
    isOpen,
    onClose,
    onSelectThread,
    onSelectCategory,
}: SearchModalProps) {
    const [query, setQuery] = useState("");
    const [selectedTab, setSelectedTab] = useState<"all" | "threads" | "categories" | "tags">("all");
    const [discussions, setDiscussions] = useState<Discussion[]>([]);
    const [categories, setCategories] = useState<ForumCategory[]>(forumCategories);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!isOpen) {
            setQuery("");
            return;
        }

        let active = true;
        setIsLoading(true);

        Promise.all([
            getDiscussions({}),
            getCategoriesAction(),
        ])
            .then(([discs, cats]) => {
                if (!active) return;
                if (discs && discs.length > 0) {
                    setDiscussions(discs as unknown as Discussion[]);
                } else {
                    setDiscussions(getAllDiscussions());
                }
                if (cats && cats.length > 0) {
                    setCategories(cats as unknown as ForumCategory[]);
                }
                setIsLoading(false);
            })
            .catch(() => {
                if (!active) return;
                setDiscussions(getAllDiscussions());
                setIsLoading(false);
            });

        return () => {
            active = false;
        };
    }, [isOpen]);

    // Filter results
    const results = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) {
            return {
                threads: discussions.slice(0, 5),
                categories: categories.slice(0, 4),
                tags: Array.from(new Set(discussions.flatMap((d) => d.tags || []))).slice(0, 6),
            };
        }

        const filteredThreads = discussions.filter(
            (d) =>
                d.title.toLowerCase().includes(q) ||
                (d.body && d.body.toLowerCase().includes(q)) ||
                (d.excerpt && d.excerpt.toLowerCase().includes(q)) ||
                d.tags?.some((t) => t.toLowerCase().includes(q))
        );

        const filteredCategories = categories.filter(
            (c) =>
                c.name.toLowerCase().includes(q) ||
                (c.description && c.description.toLowerCase().includes(q)) ||
                c.tags?.some((t) => t.toLowerCase().includes(q))
        );

        const allTags = Array.from(new Set(discussions.flatMap((d) => d.tags || [])));
        const filteredTags = allTags.filter((t) => t.toLowerCase().includes(q));

        return {
            threads: filteredThreads,
            categories: filteredCategories,
            tags: filteredTags,
        };
    }, [query, discussions, categories]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
            <div
                className="bg-[#0B1528] border border-[#C8971A]/40 rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[80vh]"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
                {/* Search Bar Input */}
                <div className="flex items-center gap-3 px-5 py-4 border-b border-white/10 bg-[#070D1A]">
                    <Search className="w-5 h-5 text-[#E5A93C] shrink-0" />
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search threads, categories, tags, or scholarly posts..."
                        className="w-full bg-transparent text-white placeholder-white/40 text-sm focus:outline-none"
                        autoFocus
                    />
                    {query && (
                        <button
                            type="button"
                            onClick={() => setQuery("")}
                            className="text-white/40 hover:text-white transition-colors cursor-pointer"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    )}
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-2 py-1 text-xs text-white/50 hover:text-white bg-white/5 hover:bg-white/10 rounded-xs transition-colors cursor-pointer ml-1"
                    >
                        ESC
                    </button>
                </div>

                {/* Filter Tabs */}
                <div className="flex items-center gap-2 px-5 py-2.5 bg-[#081124] border-b border-white/10 text-xs">
                    <button
                        type="button"
                        onClick={() => setSelectedTab("all")}
                        className={`px-3 py-1 rounded-full transition-colors cursor-pointer ${
                            selectedTab === "all"
                                ? "bg-[#C8971A] text-[#0F1C3F] font-bold"
                                : "text-white/60 hover:text-white hover:bg-white/5"
                        }`}
                    >
                        All ({results.threads.length + results.categories.length + results.tags.length})
                    </button>
                    <button
                        type="button"
                        onClick={() => setSelectedTab("threads")}
                        className={`px-3 py-1 rounded-full transition-colors cursor-pointer ${
                            selectedTab === "threads"
                                ? "bg-[#C8971A] text-[#0F1C3F] font-bold"
                                : "text-white/60 hover:text-white hover:bg-white/5"
                        }`}
                    >
                        Threads ({results.threads.length})
                    </button>
                    <button
                        type="button"
                        onClick={() => setSelectedTab("categories")}
                        className={`px-3 py-1 rounded-full transition-colors cursor-pointer ${
                            selectedTab === "categories"
                                ? "bg-[#C8971A] text-[#0F1C3F] font-bold"
                                : "text-white/60 hover:text-white hover:bg-white/5"
                        }`}
                    >
                        Categories ({results.categories.length})
                    </button>
                    <button
                        type="button"
                        onClick={() => setSelectedTab("tags")}
                        className={`px-3 py-1 rounded-full transition-colors cursor-pointer ${
                            selectedTab === "tags"
                                ? "bg-[#C8971A] text-[#0F1C3F] font-bold"
                                : "text-white/60 hover:text-white hover:bg-white/5"
                        }`}
                    >
                        Tags ({results.tags.length})
                    </button>
                </div>

                {/* Results List */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {isLoading ? (
                        <div className="py-12 flex items-center justify-center text-[#E5A93C]">
                            <Loader2 className="w-6 h-6 animate-spin" />
                        </div>
                    ) : (
                        <>
                            {/* Categories matching */}
                            {(selectedTab === "all" || selectedTab === "categories") && results.categories.length > 0 && (
                                <div>
                                    <div className="text-[11px] font-bold uppercase tracking-wider text-white/50 mb-2 px-2 flex items-center gap-1.5">
                                        <Layers className="w-3.5 h-3.5 text-[#38BDF8]" />
                                        <span>Categories</span>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                        {results.categories.map((c) => (
                                            <button
                                                key={c.id}
                                                type="button"
                                                onClick={() => {
                                                    onSelectCategory(c.id);
                                                    onClose();
                                                }}
                                                className="w-full text-left p-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-colors flex items-center justify-between group cursor-pointer"
                                            >
                                                <div className="truncate mr-2">
                                                    <span className="font-semibold text-white group-hover:text-[#E5A93C] transition-colors text-xs block">
                                                        {c.name}
                                                    </span>
                                                    <span className="text-[10px] text-white/50 truncate block mt-0.5">
                                                        {c.description}
                                                    </span>
                                                </div>
                                                <ChevronRight className="w-4 h-4 text-white/30 group-hover:text-[#E5A93C] shrink-0 transition-colors" />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Tags matching */}
                            {(selectedTab === "all" || selectedTab === "tags") && results.tags.length > 0 && (
                                <div>
                                    <div className="text-[11px] font-bold uppercase tracking-wider text-white/50 mb-2 px-2 flex items-center gap-1.5">
                                        <Tag className="w-3.5 h-3.5 text-blue-400" />
                                        <span>Tags</span>
                                    </div>
                                    <div className="flex flex-wrap gap-2 px-2">
                                        {results.tags.map((tag) => (
                                            <button
                                                key={tag}
                                                type="button"
                                                onClick={() => {
                                                    setQuery(tag);
                                                    setSelectedTab("threads");
                                                }}
                                                className="px-2.5 py-1 rounded-full bg-blue-500/10 hover:bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs flex items-center gap-1 cursor-pointer transition-colors"
                                            >
                                                <span>#{tag}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Threads matching */}
                            {(selectedTab === "all" || selectedTab === "threads") && (
                                <div>
                                    <div className="text-[11px] font-bold uppercase tracking-wider text-white/50 mb-2 px-2 flex items-center gap-1.5">
                                        <MessageSquare className="w-3.5 h-3.5 text-[#E5A93C]" />
                                        <span>Threads</span>
                                    </div>
                                    {results.threads.length === 0 ? (
                                        <div className="p-6 text-center text-white/50 text-xs">
                                            No matching threads found. Try a different keyword or tag.
                                        </div>
                                    ) : (
                                        <div className="space-y-2">
                                            {results.threads.map((t) => (
                                                <button
                                                    key={t.id}
                                                    type="button"
                                                    onClick={() => {
                                                        onSelectThread(t.id);
                                                        onClose();
                                                    }}
                                                    className="w-full text-left p-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-colors flex items-center justify-between group cursor-pointer"
                                                >
                                                    <div className="truncate mr-3">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#C8971A]/20 text-[#E5A93C]">
                                                                {t.forumType === "suggestion" ? "💡 Suggestion" : t.forumType === "question" ? "❓ Question" : "Discussion"}
                                                            </span>
                                                            <span className="text-[11px] text-white/50">
                                                                by {t.author?.name || "Scholar"}
                                                            </span>
                                                        </div>
                                                        <div className="font-semibold text-white group-hover:text-[#E5A93C] transition-colors text-xs truncate">
                                                            {t.title}
                                                        </div>
                                                        <div className="text-[11px] text-white/50 truncate mt-0.5">
                                                            {t.excerpt}
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-3 shrink-0 text-[11px] text-white/50">
                                                        <span className="flex items-center gap-1">
                                                            <MessageSquare className="w-3 h-3" />
                                                            {t.replies || 0}
                                                        </span>
                                                        <ChevronRight className="w-4 h-4 text-white/30 group-hover:text-[#E5A93C] transition-colors" />
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
