'use client';

import { MessageSquare, Eye, Clock, Star, Layers } from "lucide-react";
import type { Discussion } from "@/types/forum";
import { forumCategories } from "@/data/forumData";

interface DiscussionCardProps {
    discussion: Discussion;
    onClick: () => void;
    megaThreadTitle?: string;
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
}: DiscussionCardProps) {
    const categoryObj = forumCategories.find((c) => c.id === discussion.category);
    const categoryColor = categoryObj?.color || "#B85428";
    const categoryName = categoryObj?.name || discussion.categoryLabel || "General";

    const author = discussion.author || {
        name: "Member",
        initials: "ME",
        bg: "#B85428",
    };

    return (
        <div
            onClick={onClick}
            className="bg-white border border-[#EDE8DF] p-5 cursor-pointer hover:border-[#B85428]/50 hover:shadow-md transition-all group"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
        >
            <div className="flex items-center gap-2 mb-2.5">
                {discussion.pinned && (
                    <span className="text-[#C8971A] text-[11px] font-semibold tracking-widest uppercase flex items-center gap-1 mr-2">
                        <Star className="w-3 h-3 fill-[#C8971A]" /> Pinned
                    </span>
                )}
                <span
                    className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full text-white"
                    style={{ backgroundColor: categoryColor }}
                >
                    {categoryName}
                </span>

                {megaThreadTitle && (
                    <span className="text-xs text-[#9E8F85] flex items-center gap-1 truncate max-w-[220px]">
                        <Layers className="w-3 h-3 text-[#B85428]" /> {megaThreadTitle}
                    </span>
                )}
            </div>

            <div className="flex gap-3.5 sm:gap-4">
                {author.image ? (
                    <img
                        src={author.image}
                        alt={author.name}
                        className="shrink-0 w-8 h-8 sm:w-9 sm:h-9 rounded-full object-cover border border-[#EDE8DF]"
                    />
                ) : (
                    <div
                        className="shrink-0 w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-white text-xs font-bold"
                        style={{ backgroundColor: author.bg || "#B85428" }}
                    >
                        {author.initials}
                    </div>
                )}

                <div className="flex-1 min-w-0">
                    <h3
                        className="font-semibold text-[#1C1917] text-[0.98rem] leading-snug mb-1.5 group-hover:text-[#B85428] transition-colors line-clamp-2"
                        style={{ fontFamily: "'Spectral', serif" }}
                    >
                        {discussion.title}
                    </h3>

                    <p className="text-[#6B5B4E] text-xs sm:text-sm leading-relaxed line-clamp-2 mb-3">
                        {discussion.excerpt || discussion.description || discussion.body}
                    </p>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-[#9E8F85]">
                        <span className="font-medium text-[#4A403A]">
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
