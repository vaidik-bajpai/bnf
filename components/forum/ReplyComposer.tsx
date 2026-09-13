'use client';

import { useState } from "react";
import { CornerDownRight, X, Loader2, Send, Lock } from "lucide-react";
import type { Post } from "@/types/forum";
import { useAuth } from "@/context/AuthContext";

interface ReplyComposerProps {
    replyingToPost: Post | null;
    onCancelReplyReference: () => void;
    onSubmitReply: (content: string, replyToPostId: string | null) => Promise<void> | void;
    isSubmitting?: boolean;
}

export default function ReplyComposer({
    replyingToPost,
    onCancelReplyReference,
    onSubmitReply,
    isSubmitting = false,
}: ReplyComposerProps) {
    const { user, requireAuth } = useAuth();
    const isAuthenticated = Boolean(user);
    const [replyText, setReplyText] = useState("");

    const authorName = replyingToPost?.author?.name || "Member";
    const authorHandle = replyingToPost?.author?.username || authorName.toLowerCase().replace(/\s+/g, "_");
    const excerpt = replyingToPost?.content
        ? replyingToPost.content.length > 90
            ? replyingToPost.content.slice(0, 90).trim() + "…"
            : replyingToPost.content
        : "";

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!replyText.trim() || isSubmitting) return;

        if (!isAuthenticated) {
            requireAuth(() => {});
            return;
        }

        await onSubmitReply(replyText.trim(), replyingToPost?.id || null);
        setReplyText("");
    };

    return (
        <div
            id="reply-composer"
            className="bg-white border border-[#EDE8DF] shadow-sm p-5 sm:p-6 transition-all"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
        >
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-[#1C1917]" style={{ fontFamily: "'Fraunces', serif" }}>
                        Join the Conversation
                    </span>
                    {user && (
                        <span className="text-xs text-[#9E8F85]">
                            as <strong className="text-[#B85428]">@{user.username || user.name || "you"}</strong>
                        </span>
                    )}
                </div>
                {!isAuthenticated && (
                    <span className="text-xs text-[#9E8F85] flex items-center gap-1">
                        <Lock className="w-3 h-3 text-[#B85428]" /> Sign in required
                    </span>
                )}
            </div>

            {/* Referenced Post Banner if active */}
            {replyingToPost && (
                <div className="mb-4 bg-[#F8F6F1] border-l-3 border-[#B85428] px-4 py-2.5 flex items-start justify-between gap-3 rounded-r-sm">
                    <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 text-xs text-[#6B5B4E] mb-0.5">
                            <CornerDownRight className="w-3.5 h-3.5 text-[#B85428] shrink-0" />
                            <span>Replying to</span>
                            <span className="font-semibold text-[#B85428]">@{authorHandle}</span>
                        </div>
                        <p
                            className="text-xs text-[#4A403A] line-clamp-2 italic"
                            style={{ fontFamily: "'Spectral', Georgia, serif" }}
                        >
                            &ldquo;{excerpt}&rdquo;
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={onCancelReplyReference}
                        className="shrink-0 flex items-center gap-1 text-[11px] text-[#9E8F85] hover:text-[#B85428] font-medium border border-[#EDE8DF] hover:border-[#B85428]/40 px-2 py-1 bg-white transition-colors cursor-pointer"
                        title="Remove reference and post as regular reply"
                    >
                        <X className="w-3 h-3" />
                        <span>Remove reference</span>
                    </button>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3">
                <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    rows={4}
                    placeholder={
                        isAuthenticated
                            ? replyingToPost
                                ? `Reply to @${authorHandle}...`
                                : "Contribute your perspective, cite sources, or ask a question..."
                            : "Sign in to share your perspective on this discussion..."
                    }
                    disabled={!isAuthenticated && false}
                    onClick={() => {
                        if (!isAuthenticated) {
                            requireAuth(() => {});
                        }
                    }}
                    className="w-full border border-[#EDE8DF] p-3.5 text-sm text-[#1C1917] placeholder-[#9E8F85] focus:outline-none focus:border-[#B85428] transition-colors resize-y min-h-[100px] bg-white leading-relaxed"
                    style={{ fontFamily: "'Spectral', Georgia, serif" }}
                />

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                    <span className="text-xs text-[#9E8F85]">
                        Replies render in a flat stream preserving chronological and referential clarity.
                    </span>

                    <div className="flex items-center gap-2 self-end sm:self-auto">
                        {replyingToPost && (
                            <button
                                type="button"
                                onClick={onCancelReplyReference}
                                className="px-3 py-2 text-xs border border-[#EDE8DF] text-[#6B5B4E] hover:text-[#1C1917] transition-colors cursor-pointer"
                            >
                                Clear
                            </button>
                        )}
                        <button
                            type="submit"
                            disabled={isSubmitting || !replyText.trim()}
                            className="flex items-center gap-2 bg-[#B85428] hover:bg-[#A04820] text-white px-5 py-2.5 text-xs font-semibold tracking-wide uppercase transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                    <span>Posting...</span>
                                </>
                            ) : (
                                <>
                                    <Send className="w-3.5 h-3.5" />
                                    <span>Post Reply</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}
