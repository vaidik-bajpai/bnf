'use client';

import { MessageSquare, Eye, Clock, Star, Layers, Bookmark, Share2 } from "lucide-react";
import type { Discussion } from "@/types/forum";
import { forumCategories } from "@/data/forumData";

interface DiscussionCardProps {
    discussion: Discussion;
    onClick: () => void;
    megaThreadTitle?: string;
    onToggleBookmark?: (discussionId: string) => void;
    onShare?: (discussion: Discussion) => void;
    dark?: boolean;
}

function formatRelativeTime(dateInput?: Date | string): string {
    if (!dateInput) return "Recently";
    const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
    if (isNaN(date.getTime())) return "Recently";
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

export default function DiscussionCard({
    discussion,
    onClick,
    megaThreadTitle,
    onToggleBookmark,
    onShare,
    dark = false,
}: DiscussionCardProps) {
    const categoryObj = forumCategories.find((c) => c.id === discussion.category);
    const categoryColor = discussion.categoryColor || categoryObj?.color || "#B85428";
    const categoryName = discussion.categoryLabel || categoryObj?.name || "General";

    const author = discussion.author || {
        name: "Member",
        initials: "ME",
        bg: "#B85428",
    };

    return (
        <div
            onClick={onClick}
            className={`p-5 cursor-pointer transition-all duration-300 group relative ${
                dark
                    ? "bg-[#0B1838]/85 hover:bg-[#0E204A] border border-white/10 hover:border-[#E5A93C]/50 rounded-xl shadow-lg backdrop-blur-sm"
                    : "bg-white border border-[#EDE8DF] hover:border-[#B85428]/50 hover:shadow-md"
            }`}
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
        >
            <div className="flex items-center gap-2 mb-2.5">
                {discussion.pinned && (
                    <span className="text-[#E5A93C] text-[11px] font-semibold tracking-widest uppercase flex items-center gap-1 mr-2">
                        <Star className="w-3 h-3 fill-[#E5A93C]" /> Pinned
                    </span>
                )}
                <span
                    className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full text-white shadow-xs"
                    style={{ backgroundColor: categoryColor }}
                >
                    {categoryName}
                </span>

                {megaThreadTitle && (
                    <span className={`text-xs flex items-center gap-1 truncate max-w-[220px] ${dark ? "text-white/50" : "text-[#9E8F85]"}`}>
                        <Layers className="w-3 h-3 text-[#E5A93C]" /> {megaThreadTitle}
                    </span>
                )}

                {/* Card Quick Action Icons (Bookmark & Share) */}
                <div className="ml-auto flex items-center gap-1">
                    {onToggleBookmark && (
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                onToggleBookmark(discussion.id);
                            }}
                            className={`p-1.5 rounded-xs transition-colors cursor-pointer ${
                                discussion.isBookmarked
                                    ? "text-[#E5A93C] hover:text-[#FBBF24]"
                                    : dark
                                    ? "text-white/40 hover:text-[#E5A93C]"
                                    : "text-[#9E8F85] hover:text-[#C8971A]"
                            }`}
                            title={discussion.isBookmarked ? "Remove bookmark" : "Save bookmark"}
                        >
                            <Bookmark className={`w-3.5 h-3.5 ${discussion.isBookmarked ? "fill-[#E5A93C]" : ""}`} />
                        </button>
                    )}

                    {onShare && (
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                onShare(discussion);
                            }}
                            className={`p-1.5 rounded-xs transition-colors cursor-pointer ${
                                dark ? "text-white/40 hover:text-[#E5A93C]" : "text-[#9E8F85] hover:text-[#B85428]"
                            }`}
                            title="Share discussion"
                        >
                            <Share2 className="w-3.5 h-3.5" />
                        </button>
                    )}
                </div>
            </div>

            <div className="flex gap-3.5 sm:gap-4">
                {author.image ? (
                    <img
                        src={author.image}
                        alt={author.name}
                        className={`shrink-0 w-8 h-8 sm:w-9 sm:h-9 rounded-full object-cover border ${dark ? "border-white/15" : "border-[#EDE8DF]"}`}
                    />
                ) : (
                    <div
                        className="shrink-0 w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-white text-xs font-bold ring-1 ring-white/20"
                        style={{ backgroundColor: author.bg || "#B85428" }}
                    >
                        {author.initials}
                    </div>
                )}

                <div className="flex-1 min-w-0">
                    <h3
                        className={`font-semibold text-[0.98rem] leading-snug mb-1.5 transition-colors line-clamp-2 ${
                            dark ? "text-white group-hover:text-[#E5A93C]" : "text-[#1C1917] group-hover:text-[#B85428]"
                        }`}
                        style={{ fontFamily: "'Spectral', serif" }}
                    >
                        {discussion.title}
                    </h3>

                    <p className={`text-xs sm:text-sm leading-relaxed line-clamp-2 mb-3 ${dark ? "text-white/70" : "text-[#6B5B4E]"}`}>
                        {discussion.excerpt || discussion.description || discussion.body}
                    </p>

                    <div className={`flex flex-wrap items-center gap-4 text-xs ${dark ? "text-white/50" : "text-[#9E8F85]"}`}>
                        <span className={`font-medium ${dark ? "text-white/85" : "text-[#4A403A]"}`}>
                            {author.name}
                        </span>

                        <span className="flex items-center gap-1">
                            <MessageSquare className="w-3.5 h-3.5" />
                            {discussion.replyCount ?? discussion.replies ?? 0}
                        </span>

                        <span className="flex items-center gap-1">
                            <Eye className="w-3.5 h-3.5" />
                            {(discussion.viewCount ?? discussion.views ?? 0).toLocaleString()}
                        </span>

                        <span className="flex items-center gap-1 sm:ml-auto">
                            <Clock className="w-3.5 h-3.5" />
                            {discussion.lastActivity || formatRelativeTime(discussion.createdAt)}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
