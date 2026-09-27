'use client';

import React, { useState, useEffect } from "react";
import {
    Activity,
    Bookmark,
    Star,
    Heart,
    ThumbsUp,
    MessageSquare,
    X,
    ChevronRight,
    Loader2,
    Layers,
    Clock,
    ArrowBigUp,
    Quote,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import type { Discussion, ForumCategory } from "@/types/forum";
import { getDiscussions, getCategoriesAction } from "@/app/actions/forum";
import { getMockBookmarkedPosts, forumCategories } from "@/data/forumData";
import { TricolorStripe } from "../Symbols";

interface ActivityModalProps {
    isOpen: boolean;
    initialTab?: "activity" | "favorites" | "starred" | "bookmarks";
    onClose: () => void;
    onSelectThread: (threadId: string) => void;
    onSelectCategory: (categoryId: string) => void;
}

export default function ActivityModal({
    isOpen,
    initialTab = "activity",
    onClose,
    onSelectThread,
    onSelectCategory,
}: ActivityModalProps) {
    const { user } = useAuth();
    const [currentTab, setCurrentTab] = useState<"activity" | "favorites" | "starred" | "bookmarks">(initialTab);
    const [discussions, setDiscussions] = useState<Discussion[]>([]);
    const [categories, setCategories] = useState<ForumCategory[]>(forumCategories);
    const [bookmarkedPosts, setBookmarkedPosts] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (initialTab) setCurrentTab(initialTab);
    }, [initialTab]);

    useEffect(() => {
        if (!isOpen) return;

        let active = true;
        setIsLoading(true);

        Promise.all([
            getDiscussions({ clientUserId: user?.id }),
            getCategoriesAction(),
        ])
            .then(([discs, cats]) => {
                if (!active) return;
                if (discs) setDiscussions(discs as unknown as Discussion[]);
                if (cats) setCategories(cats as unknown as ForumCategory[]);
                setBookmarkedPosts(getMockBookmarkedPosts());
                setIsLoading(false);
            })
            .catch(() => {
                if (!active) return;
                setBookmarkedPosts(getMockBookmarkedPosts());
                setIsLoading(false);
            });

        return () => {
            active = false;
        };
    }, [isOpen, user?.id]);

    if (!isOpen) return null;

    // Filter data based on tab
    const myThreads = discussions.filter(
        (d) => user && (d.authorId === user.id || d.author?.id === user.id)
    );
    const starredCategories = categories.filter((c) => c.isStarred);
    const favoriteCategories = categories.filter((c) => c.isFavorite);
    const bookmarkedThreads = discussions.filter((d) => d.isBookmarked);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
            <div
                className="bg-[#0B1528] border border-[#C8971A]/40 rounded-xl shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[85vh]"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
                {/* Header */}
                <div className="bg-[#070D1A] px-6 py-4 border-b border-[#C8971A]/30 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#C8971A]/20 border border-[#C8971A]/40 flex items-center justify-center text-[#E5A93C]">
                            {currentTab === "activity" && <Activity className="w-4 h-4" />}
                            {currentTab === "starred" && <Star className="w-4 h-4" />}
                            {currentTab === "favorites" && <Heart className="w-4 h-4" />}
                            {currentTab === "bookmarks" && <Bookmark className="w-4 h-4" />}
                        </div>
                        <div>
                            <h2
                                className="text-base sm:text-lg font-bold text-white tracking-wide capitalize"
                                style={{ fontFamily: "'Fraunces', serif" }}
                            >
                                {currentTab === "activity" && "Activity Management"}
                                {currentTab === "starred" && "Starred Categories"}
                                {currentTab === "favorites" && "Favorite Categories"}
                                {currentTab === "bookmarks" && "My Bookmarks"}
                            </h2>
                            <p className="text-xs text-white/50">
                                {user ? `Scholar: ${user.name} (@${user.username})` : "Guest Scholar Library"}
                            </p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="p-1.5 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <TricolorStripe />

                {/* Navigation Tabs */}
                <div className="flex items-center gap-1 px-6 py-2.5 bg-[#081124] border-b border-white/10 text-xs overflow-x-auto">
                    <button
                        type="button"
                        onClick={() => setCurrentTab("activity")}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-colors cursor-pointer shrink-0 ${
                            currentTab === "activity"
                                ? "bg-[#C8971A] text-[#0F1C3F] font-bold"
                                : "text-white/60 hover:text-white hover:bg-white/5"
                        }`}
                    >
                        <Activity className="w-3.5 h-3.5" />
                        <span>Activity Management</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => setCurrentTab("starred")}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-colors cursor-pointer shrink-0 ${
                            currentTab === "starred"
                                ? "bg-[#C8971A] text-[#0F1C3F] font-bold"
                                : "text-white/60 hover:text-white hover:bg-white/5"
                        }`}
                    >
                        <Star className="w-3.5 h-3.5" />
                        <span>Starred ({starredCategories.length})</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => setCurrentTab("favorites")}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-colors cursor-pointer shrink-0 ${
                            currentTab === "favorites"
                                ? "bg-[#C8971A] text-[#0F1C3F] font-bold"
                                : "text-white/60 hover:text-white hover:bg-white/5"
                        }`}
                    >
                        <Heart className="w-3.5 h-3.5" />
                        <span>Favorites ({favoriteCategories.length})</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => setCurrentTab("bookmarks")}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-colors cursor-pointer shrink-0 ${
                            currentTab === "bookmarks"
                                ? "bg-[#C8971A] text-[#0F1C3F] font-bold"
                                : "text-white/60 hover:text-white hover:bg-white/5"
                        }`}
                    >
                        <Bookmark className="w-3.5 h-3.5" />
                        <span>Bookmarks ({bookmarkedThreads.length + bookmarkedPosts.length})</span>
                    </button>
                </div>

                {/* Tab Body */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {isLoading ? (
                        <div className="py-16 flex items-center justify-center text-[#E5A93C]">
                            <Loader2 className="w-6 h-6 animate-spin" />
                        </div>
                    ) : (
                        <>
                            {/* ACTIVITY MANAGEMENT TAB */}
                            {currentTab === "activity" && (
                                <div className="space-y-5">
                                    <div>
                                        <h3 className="text-xs font-bold uppercase tracking-wider text-white/50 mb-2 flex items-center gap-1.5">
                                            <MessageSquare className="w-3.5 h-3.5 text-[#E5A93C]" />
                                            <span>Your Initiated Inquiries & Threads ({myThreads.length})</span>
                                        </h3>
                                        {myThreads.length === 0 ? (
                                            <div className="p-4 bg-white/5 border border-white/10 rounded-lg text-xs text-white/50 text-center">
                                                You haven&apos;t started any discussions yet. Engage the scholars by starting an inquiry.
                                            </div>
                                        ) : (
                                            <div className="space-y-2">
                                                {myThreads.map((t) => (
                                                    <button
                                                        key={t.id}
                                                        type="button"
                                                        onClick={() => {
                                                            onSelectThread(t.id);
                                                            onClose();
                                                        }}
                                                        className="w-full text-left p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-colors flex items-center justify-between group cursor-pointer"
                                                    >
                                                        <div className="truncate mr-3">
                                                            <div className="font-semibold text-white group-hover:text-[#E5A93C] text-xs transition-colors truncate">
                                                                {t.title}
                                                            </div>
                                                            <div className="text-[11px] text-white/50 truncate mt-0.5">
                                                                {t.replies || 0} replies · {t.likes || 0} likes
                                                            </div>
                                                        </div>
                                                        <ChevronRight className="w-4 h-4 text-white/30 group-hover:text-[#E5A93C] transition-colors" />
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* STARRED CATEGORIES TAB */}
                            {currentTab === "starred" && (
                                <div>
                                    <h3 className="text-xs font-bold uppercase tracking-wider text-white/50 mb-3 flex items-center gap-1.5">
                                        <Star className="w-3.5 h-3.5 text-[#E5A93C]" />
                                        <span>Starred Categories</span>
                                    </h3>
                                    {starredCategories.length === 0 ? (
                                        <div className="p-6 bg-white/5 border border-white/10 rounded-lg text-xs text-white/50 text-center">
                                            No starred categories yet. Click the star icon on any category card in Forum Home to pin it here.
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            {starredCategories.map((c) => (
                                                <button
                                                    key={c.id}
                                                    type="button"
                                                    onClick={() => {
                                                        onSelectCategory(c.id);
                                                        onClose();
                                                    }}
                                                    className="w-full text-left p-3.5 rounded-lg bg-white/5 hover:bg-white/10 border border-[#E5A93C]/30 transition-colors flex items-center justify-between group cursor-pointer"
                                                >
                                                    <div className="truncate mr-3">
                                                        <div className="flex items-center gap-2">
                                                            <Star className="w-3.5 h-3.5 text-[#E5A93C] fill-[#E5A93C]" />
                                                            <span className="font-bold text-white group-hover:text-[#E5A93C] text-xs transition-colors">
                                                                {c.name}
                                                            </span>
                                                        </div>
                                                        <p className="text-[11px] text-white/50 truncate mt-1">
                                                            {c.description}
                                                        </p>
                                                    </div>
                                                    <ChevronRight className="w-4 h-4 text-white/30 group-hover:text-[#E5A93C] transition-colors" />
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* FAVORITE CATEGORIES TAB */}
                            {currentTab === "favorites" && (
                                <div>
                                    <h3 className="text-xs font-bold uppercase tracking-wider text-white/50 mb-3 flex items-center gap-1.5">
                                        <Heart className="w-3.5 h-3.5 text-rose-400" />
                                        <span>Favorite Categories</span>
                                    </h3>
                                    {favoriteCategories.length === 0 ? (
                                        <div className="p-6 bg-white/5 border border-white/10 rounded-lg text-xs text-white/50 text-center">
                                            No favorite categories yet. Click the heart icon on any category card to mark it as favorite.
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            {favoriteCategories.map((c) => (
                                                <button
                                                    key={c.id}
                                                    type="button"
                                                    onClick={() => {
                                                        onSelectCategory(c.id);
                                                        onClose();
                                                    }}
                                                    className="w-full text-left p-3.5 rounded-lg bg-white/5 hover:bg-white/10 border border-rose-500/30 transition-colors flex items-center justify-between group cursor-pointer"
                                                >
                                                    <div className="truncate mr-3">
                                                        <div className="flex items-center gap-2">
                                                            <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
                                                            <span className="font-bold text-white group-hover:text-rose-300 text-xs transition-colors">
                                                                {c.name}
                                                            </span>
                                                        </div>
                                                        <p className="text-[11px] text-white/50 truncate mt-1">
                                                            {c.description}
                                                        </p>
                                                    </div>
                                                    <ChevronRight className="w-4 h-4 text-white/30 group-hover:text-rose-300 transition-colors" />
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* BOOKMARKS TAB */}
                            {currentTab === "bookmarks" && (
                                <div className="space-y-6">
                                    {/* Bookmarked Threads */}
                                    <div>
                                        <h3 className="text-xs font-bold uppercase tracking-wider text-white/50 mb-2 flex items-center gap-1.5">
                                            <Bookmark className="w-3.5 h-3.5 text-[#E5A93C]" />
                                            <span>Bookmarked Discussions ({bookmarkedThreads.length})</span>
                                        </h3>
                                        {bookmarkedThreads.length === 0 ? (
                                            <div className="p-4 bg-white/5 border border-white/10 rounded-lg text-xs text-white/50 text-center">
                                                No bookmarked threads.
                                            </div>
                                        ) : (
                                            <div className="space-y-2">
                                                {bookmarkedThreads.map((t) => (
                                                    <button
                                                        key={t.id}
                                                        type="button"
                                                        onClick={() => {
                                                            onSelectThread(t.id);
                                                            onClose();
                                                        }}
                                                        className="w-full text-left p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-colors flex items-center justify-between group cursor-pointer"
                                                    >
                                                        <div className="truncate mr-3">
                                                            <div className="font-semibold text-white group-hover:text-[#E5A93C] text-xs transition-colors truncate">
                                                                {t.title}
                                                            </div>
                                                            <div className="text-[11px] text-white/50 truncate mt-0.5">
                                                                by {t.author?.name || "Scholar"}
                                                            </div>
                                                        </div>
                                                        <ChevronRight className="w-4 h-4 text-white/30 group-hover:text-[#E5A93C] transition-colors" />
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* Bookmarked Comments */}
                                    <div>
                                        <h3 className="text-xs font-bold uppercase tracking-wider text-white/50 mb-2 flex items-center gap-1.5">
                                            <Quote className="w-3.5 h-3.5 text-blue-400" />
                                            <span>Bookmarked Individual Comments ({bookmarkedPosts.length})</span>
                                        </h3>
                                        {bookmarkedPosts.length === 0 ? (
                                            <div className="p-4 bg-white/5 border border-white/10 rounded-lg text-xs text-white/50 text-center">
                                                No individual comments bookmarked yet. Click the bookmark icon on any comment to save it here.
                                            </div>
                                        ) : (
                                            <div className="space-y-2">
                                                {bookmarkedPosts.map((p) => (
                                                    <button
                                                        key={p.id}
                                                        type="button"
                                                        onClick={() => {
                                                            if (p.discussionId) onSelectThread(p.discussionId);
                                                            onClose();
                                                        }}
                                                        className="w-full text-left p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-colors flex items-center justify-between group cursor-pointer"
                                                    >
                                                        <div className="truncate mr-3">
                                                            <div className="text-[10px] text-[#E5A93C] font-semibold mb-0.5">
                                                                @{p.author?.username || p.author?.name || "scholar"}
                                                            </div>
                                                            <div className="text-xs text-white/80 line-clamp-2">
                                                                &ldquo;{p.content}&rdquo;
                                                            </div>
                                                        </div>
                                                        <ChevronRight className="w-4 h-4 text-white/30 group-hover:text-[#E5A93C] transition-colors" />
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
