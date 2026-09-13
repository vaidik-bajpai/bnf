'use client';

import { CornerDownRight, AlertCircle } from "lucide-react";
import type { Post } from "@/types/forum";

interface ReplyReferenceProps {
    replyToPostId: string;
    referencedPost?: Post | null;
    onNavigateToPost?: (postId: string) => void;
    compact?: boolean;
}

export default function ReplyReference({
    replyToPostId,
    referencedPost,
    onNavigateToPost,
    compact = false,
}: ReplyReferenceProps) {
    if (!referencedPost) {
        return (
            <div
                title={`Referenced post (${replyToPostId}) is unavailable or deleted`}
                className="flex items-center gap-1.5 text-xs text-[#9E8F85] italic bg-[#F5F2EC] border border-[#EDE8DF] px-3 py-1.5 rounded-sm mb-2.5 w-fit"
            >
                <AlertCircle className="w-3.5 h-3.5 shrink-0 opacity-60" />
                <span>Original post unavailable</span>
            </div>
        );
    }

    const authorName = referencedPost.author?.name || "Member";
    const authorHandle = referencedPost.author?.username || authorName.toLowerCase().replace(/\s+/g, "_");

    // Truncate excerpt cleanly
    const maxLength = compact ? 80 : 120;
    const content = referencedPost.content || "";
    const excerpt = content.length > maxLength ? content.slice(0, maxLength).trim() + "…" : content;

    const handleClick = () => {
        if (onNavigateToPost) {
            onNavigateToPost(referencedPost.id);
        } else {
            // Default anchor scroll behavior
            const targetEl = document.getElementById(`post-${referencedPost.id}`);
            if (targetEl) {
                targetEl.scrollIntoView({ behavior: "smooth", block: "center" });
                targetEl.classList.add("ring-2", "ring-[#B85428]", "bg-[#B85428]/5");
                setTimeout(() => {
                    targetEl.classList.remove("ring-2", "ring-[#B85428]", "bg-[#B85428]/5");
                }, 2000);
            }
        }
    };

    return (
        <button
            type="button"
            onClick={handleClick}
            title={`Jump to post by @${authorHandle}`}
            className="group block text-left w-full max-w-2xl mb-3 bg-[#F8F6F1] hover:bg-[#F2ECE1] border-l-2 border-[#B85428]/50 hover:border-[#B85428] px-3.5 py-2 transition-all cursor-pointer rounded-r-sm"
        >
            <div className="flex items-center gap-1.5 text-xs text-[#6B5B4E] mb-1 font-medium" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                <CornerDownRight className="w-3 h-3 text-[#B85428] shrink-0 transition-transform group-hover:translate-x-0.5" />
                <span>Replying to</span>
                <span className="font-semibold text-[#B85428] group-hover:underline">@{authorHandle}</span>
            </div>
            <p
                className="text-xs text-[#4A403A] line-clamp-1 italic leading-relaxed"
                style={{ fontFamily: "'Spectral', Georgia, serif" }}
            >
                &ldquo;{excerpt}&rdquo;
            </p>
        </button>
    );
}
