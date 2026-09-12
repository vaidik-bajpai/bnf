'use client';

import { useState, useEffect } from "react";
import {
    ChevronLeft,
    Clock,
    MessageSquare,
    Eye,
    ThumbsUp,
    Bookmark,
    Share2,
    TrendingUp,
    Hash,
    Loader2,
    Lock,
} from "lucide-react";
import { TricolorStripe } from "../Symbols";
import { getThreadById, postReply, toggleLike } from "@/app/actions/forum";
import { useAuth } from "@/context/AuthContext";

interface ThreadViewProps {
    threadId: string;
    onBack: () => void;
}

type DbThread = NonNullable<Awaited<ReturnType<typeof getThreadById>>>;
type DbReply = DbThread["replies"][number];

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

export default function ThreadView({ threadId, onBack }: ThreadViewProps) {
    const { user, requireAuth } = useAuth();
    const isAuthenticated = Boolean(user);

    const [thread, setThread] = useState<DbThread | null>(null);
    const [loading, setLoading] = useState(true);

    const [likedSet, setLikedSet] = useState<Set<string>>(new Set());
    const [bookmarked, setBookmarked] = useState(false);

    // Top-level reply form
    const [showReply, setShowReply] = useState(false);
    const [replyText, setReplyText] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Nested inline reply form state
    const [replyingToId, setReplyingToId] = useState<string | null>(null);
    const [nestedReplyText, setNestedReplyText] = useState("");

    const loadThread = async () => {
        try {
            const data = await getThreadById(threadId);
            setThread(data);
        } catch (err) {
            console.error("Failed to load thread:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setLoading(true);
        loadThread();
    }, [threadId]);

    const handleLike = async (type: "discussion" | "reply", id: string) => {
        if (!isAuthenticated || likedSet.has(id)) return;
        setLikedSet((prev) => new Set(prev).add(id));
        await toggleLike(type, id);
        if (type === "discussion" && thread) {
            setThread({ ...thread, likes: thread.likes + 1 });
        }
    };

    const handleSendReply = async (parentId?: string) => {
        if (!isAuthenticated) return;
        const content = parentId ? nestedReplyText.trim() : replyText.trim();
        if (!content) return;

        setIsSubmitting(true);
        try {
            await postReply({
                discussionId: threadId,
                content,
                parentId,
            });

            if (parentId) {
                setReplyingToId(null);
                setNestedReplyText("");
            } else {
                setShowReply(false);
                setReplyText("");
            }

            await loadThread();
        } catch (err) {
            console.error("Failed to post reply:", err);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#FAFAF7] flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-[#B85428] animate-spin" />
            </div>
        );
    }

    if (!thread) {
        return (
            <div className="min-h-screen bg-[#FAFAF7] px-6 py-24 text-center">
                <h2 className="text-xl font-bold text-[#1C1917] mb-4">Discussion not found</h2>
                <button onClick={onBack} className="text-sm text-[#B85428] hover:underline font-semibold cursor-pointer">
                    &larr; Back to Forum
                </button>
            </div>
        );
    }

    const renderReply = (reply: DbReply, isNested = false) => {
        const replyAuthor = reply.author as {
            id: string;
            name: string | null;
            username?: string | null;
            initials?: string | null;
            bg?: string | null;
            image?: string | null;
        };

        const authorName = replyAuthor.name || "Member";
        const authorUsername = replyAuthor.username || "member";
        const authorInitials = replyAuthor.initials || authorName.slice(0, 2).toUpperCase();
        const authorBg = replyAuthor.bg || "#2D6A4F";

        return (
            <div key={reply.id} className={`${isNested ? "ml-8 sm:ml-12 mt-4 pl-4 sm:pl-5 border-l-2 border-[#EDE8DF]" : ""}`}>
                <div className="flex gap-3 sm:gap-4">
                    {replyAuthor.image ? (
                        <img
                            src={replyAuthor.image}
                            alt={authorName}
                            className="shrink-0 w-8 h-8 sm:w-9 sm:h-9 rounded-full object-cover border border-[#EDE8DF]"
                        />
                    ) : (
                        <div
                            className="shrink-0 w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-white text-xs font-bold"
                            style={{ backgroundColor: authorBg, fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                        >
                            {authorInitials}
                        </div>
                    )}
                    <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                            <span className="font-semibold text-[#1C1917] text-sm">{authorName}</span>
                            <span className="text-xs text-[#9E8F85]">@{authorUsername}</span>
                            <span className="text-[#9E8F85] text-xs flex items-center gap-1 sm:ml-auto">
                                <Clock className="w-3 h-3" /> {formatRelativeTime(reply.createdAt)}
                            </span>
                        </div>
                        <p
                            className="text-[#3C3430] text-[0.95rem] leading-relaxed mb-3 whitespace-pre-wrap"
                            style={{ fontFamily: "'Spectral', Georgia, serif" }}
                        >
                            {reply.content}
                        </p>

                        {/* Action Strip */}
                        <div className="flex items-center gap-4 text-xs" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                            <button
                                onClick={() => handleLike("reply", reply.id)}
                                disabled={!isAuthenticated}
                                className={`flex items-center gap-1.5 transition-colors ${!isAuthenticated
                                    ? "opacity-50 cursor-not-allowed text-[#9E8F85]"
                                    : likedSet.has(reply.id)
                                        ? "text-[#B85428] cursor-pointer"
                                        : "text-[#9E8F85] hover:text-[#B85428] cursor-pointer"
                                    }`}
                            >
                                <ThumbsUp className="w-3.5 h-3.5" />
                                {reply.likes + (likedSet.has(reply.id) ? 1 : 0)}
                            </button>

                            {isAuthenticated && !isNested && (
                                <button
                                    onClick={() => setReplyingToId(replyingToId === reply.id ? null : reply.id)}
                                    className="text-[#9E8F85] hover:text-[#B85428] flex items-center gap-1.5 transition-colors cursor-pointer"
                                >
                                    <MessageSquare className="w-3.5 h-3.5" /> Reply
                                </button>
                            )}

                            <button className="text-[#9E8F85] hover:text-[#B85428] flex items-center gap-1.5 transition-colors cursor-pointer">
                                <Share2 className="w-3.5 h-3.5" /> Share
                            </button>
                        </div>

                        {/* Inline Nested Reply Form */}
                        {isAuthenticated && replyingToId === reply.id && (
                            <div className="mt-4 p-4 bg-[#FAFAF7] border border-[#EDE8DF] space-y-3">
                                <div className="text-xs text-[#6B5B4E]">
                                    Replying as <strong className="text-[#B85428]">@{user?.username || "you"}</strong>
                                </div>
                                <textarea
                                    value={nestedReplyText}
                                    onChange={(e) => setNestedReplyText(e.target.value)}
                                    rows={2}
                                    placeholder={`Reply to @${authorUsername}...`}
                                    className="w-full border border-[#EDE8DF] bg-white px-3 py-2 text-xs focus:outline-none focus:border-[#B85428] resize-none text-[#1C1917]"
                                    style={{ fontFamily: "'Spectral', Georgia, serif" }}
                                />
                                <div className="flex gap-2">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setReplyingToId(null);
                                            setNestedReplyText("");
                                        }}
                                        className="px-3 py-1.5 text-xs border border-[#EDE8DF] text-[#6B5B4E] hover:text-[#1C1917] cursor-pointer"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="button"
                                        disabled={isSubmitting || !nestedReplyText.trim()}
                                        onClick={() => handleSendReply(reply.id)}
                                        className="px-3 py-1.5 text-xs bg-[#B85428] hover:bg-[#A04820] text-white font-semibold transition-colors cursor-pointer disabled:opacity-50"
                                    >
                                        {isSubmitting ? "Posting..." : "Reply"}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {reply.nested?.map((n) => renderReply(n as DbReply, true))}
            </div>
        );
    };

    const opAuthor = thread.author as {
        id: string;
        name: string | null;
        username?: string | null;
        initials?: string | null;
        bg?: string | null;
        image?: string | null;
    };

    const opName = opAuthor.name || "Member";
    const opUsername = opAuthor.username || "member";
    const opInitials = opAuthor.initials || opName.slice(0, 2).toUpperCase();
    const opBg = opAuthor.bg || "#B85428";

    return (
        <div className="min-h-screen bg-[#FAFAF7]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            {/* Banner */}
            <div className="bg-[#0F1C3F] pt-24 pb-12 px-6">
                <div className="max-w-4xl mx-auto">
                    <button
                        onClick={onBack}
                        className="flex items-center gap-2 text-white/50 hover:text-white text-sm mb-6 transition-colors cursor-pointer"
                    >
                        <ChevronLeft className="w-4 h-4" /> Back to Forum
                    </button>
                    <div className="flex items-center gap-2 mb-4">
                        <span
                            className="text-xs font-semibold tracking-widest uppercase px-3 py-1 rounded-full text-white"
                            style={{ backgroundColor: thread.category.color }}
                        >
                            {thread.category.name}
                        </span>
                        {thread.pinned && (
                            <span className="text-xs font-semibold tracking-widest uppercase px-3 py-1 bg-[#C8971A]/20 text-[#C8971A]">
                                Pinned
                            </span>
                        )}
                    </div>
                    <h1
                        className="text-white text-2xl md:text-3xl font-bold leading-tight mb-5"
                        style={{ fontFamily: "'Fraunces', serif" }}
                    >
                        {thread.title}
                    </h1>
                    <div className="flex flex-wrap items-center gap-5 text-sm">
                        <div className="flex items-center gap-2.5">
                            {opAuthor.image ? (
                                <img
                                    src={opAuthor.image}
                                    alt={opName}
                                    className="w-8 h-8 rounded-full object-cover border border-white/20"
                                />
                            ) : (
                                <div
                                    className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
                                    style={{ backgroundColor: opBg }}
                                >
                                    {opInitials}
                                </div>
                            )}
                            <div className="flex items-center gap-1.5">
                                <span className="text-white/90 font-medium">{opName}</span>
                                <span className="text-white/40 text-xs">@{opUsername}</span>
                            </div>
                        </div>
                        <span className="text-white/40 flex items-center gap-1.5">
                            <MessageSquare className="w-4 h-4" /> {thread.replies.length} replies
                        </span>
                        <span className="text-white/40 flex items-center gap-1.5">
                            <Eye className="w-4 h-4" /> {thread.views.toLocaleString()} views
                        </span>
                        <span className="text-white/40 flex items-center gap-1.5">
                            <Clock className="w-4 h-4" /> {formatRelativeTime(thread.createdAt)}
                        </span>
                    </div>
                </div>
            </div>
            <TricolorStripe />

            <div className="max-w-4xl mx-auto px-6 py-10">
                {/* Main Post */}
                <div className="bg-white border border-[#EDE8DF] p-6 sm:p-8 mb-6 shadow-sm">
                    <div className="flex items-start gap-4 sm:gap-5">
                        {opAuthor.image ? (
                            <img
                                src={opAuthor.image}
                                alt={opName}
                                className="shrink-0 w-10 h-10 sm:w-11 sm:h-11 rounded-full object-cover border border-[#EDE8DF]"
                            />
                        ) : (
                            <div
                                className="shrink-0 w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center text-white font-bold text-sm"
                                style={{ backgroundColor: opBg }}
                            >
                                {opInitials}
                            </div>
                        )}
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-4">
                                <span className="font-semibold text-[#1C1917]">{opName}</span>
                                <span className="text-xs text-[#9E8F85]">@{opUsername}</span>
                                <span className="text-[11px] uppercase tracking-wider text-[#9E8F85] bg-[#FAFAF7] px-2 py-0.5 border border-[#EDE8DF] ml-auto">
                                    Original Post
                                </span>
                            </div>
                            <div
                                className="text-[#3C3430] leading-relaxed text-base sm:text-lg mb-5 whitespace-pre-wrap"
                                style={{ fontFamily: "'Spectral', Georgia, serif" }}
                            >
                                {thread.body || thread.excerpt}
                            </div>
                            <div className="flex flex-wrap gap-2 mb-5">
                                {thread.tags.map((tag) => (
                                    <span key={tag} className="text-xs text-[#B85428] bg-[#B85428]/8 px-3 py-1 flex items-center gap-1">
                                        <Hash className="w-3 h-3" /> {tag}
                                    </span>
                                ))}
                            </div>

                            {/* OP Action Buttons */}
                            <div className="flex items-center gap-5 pt-4 border-t border-[#EDE8DF]">
                                <button
                                    onClick={() => handleLike("discussion", thread.id)}
                                    disabled={!isAuthenticated}
                                    className={`flex items-center gap-2 text-sm transition-colors ${!isAuthenticated
                                        ? "opacity-50 cursor-not-allowed text-[#9E8F85]"
                                        : likedSet.has(thread.id)
                                            ? "text-[#B85428] cursor-pointer"
                                            : "text-[#9E8F85] hover:text-[#B85428] cursor-pointer"
                                        }`}
                                >
                                    <ThumbsUp className="w-4 h-4" />
                                    {likedSet.has(thread.id) ? "Liked" : "Like"} ({thread.likes})
                                </button>

                                {isAuthenticated && (
                                    <button
                                        onClick={() => setShowReply((r) => !r)}
                                        className="flex items-center gap-2 text-sm text-[#9E8F85] hover:text-[#B85428] transition-colors cursor-pointer"
                                    >
                                        <MessageSquare className="w-4 h-4" /> Reply
                                    </button>
                                )}

                                <button
                                    onClick={() => setBookmarked((b) => !b)}
                                    className={`flex items-center gap-2 text-sm transition-colors cursor-pointer ${bookmarked ? "text-[#C8971A]" : "text-[#9E8F85] hover:text-[#C8971A]"
                                        }`}
                                >
                                    <Bookmark className="w-4 h-4" />
                                    {bookmarked ? "Saved" : "Bookmark"}
                                </button>
                                <button className="flex items-center gap-2 text-sm text-[#9E8F85] hover:text-[#B85428] transition-colors cursor-pointer">
                                    <Share2 className="w-4 h-4" /> Share
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Top-Level Reply Form (Authenticated only) */}
                    {isAuthenticated && showReply && (
                        <div className="mt-5 pt-5 border-t border-[#EDE8DF] space-y-3">
                            <div className="text-xs text-[#6B5B4E]">
                                Replying as <strong className="text-[#B85428]">@{user?.username || "you"}</strong>
                            </div>
                            <textarea
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                                rows={4}
                                placeholder="Write your contribution..."
                                className="w-full border border-[#EDE8DF] px-4 py-3 text-sm text-[#1C1917] placeholder-[#9E8F85] focus:outline-none focus:border-[#B85428] transition-colors resize-none"
                                style={{ fontFamily: "'Spectral', Georgia, serif" }}
                            />
                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowReply(false);
                                        setReplyText("");
                                    }}
                                    className="px-5 py-2.5 border border-[#EDE8DF] text-[#6B5B4E] hover:border-[#B85428] text-sm font-semibold transition-colors cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    disabled={isSubmitting || !replyText.trim()}
                                    onClick={() => handleSendReply()}
                                    className="px-5 py-2.5 bg-[#B85428] hover:bg-[#A04820] text-white text-sm font-semibold transition-colors cursor-pointer flex items-center gap-2 disabled:opacity-50"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="w-3.5 h-3.5 animate-spin" /> Posting...
                                        </>
                                    ) : (
                                        "Post Reply"
                                    )}
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Page-Level Guest Notice */}
                {!isAuthenticated && (
                    <div className="mb-8 p-5 bg-[#0F1C3F]/5 border border-[#EDE8DF] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <Lock className="w-5 h-5 text-[#B85428] shrink-0" />
                            <p className="text-sm text-[#3C3430]">
                                You are viewing this thread as a <strong>guest</strong>. Sign in to join the conversation, post replies, and react.
                            </p>
                        </div>
                        <button
                            onClick={() => requireAuth(() => { })}
                            className="shrink-0 px-5 py-2.5 bg-[#B85428] hover:bg-[#A04820] text-white text-xs font-semibold tracking-wide uppercase transition-colors cursor-pointer"
                        >
                            Sign In
                        </button>
                    </div>
                )}

                {/* Replies List Header */}
                <div className="flex items-center justify-between mb-5">
                    <h2 className="text-[#1C1917] font-semibold" style={{ fontFamily: "'Fraunces', serif" }}>
                        {thread.replies.length} {thread.replies.length === 1 ? "Reply" : "Replies"}
                    </h2>
                    <div className="flex items-center gap-2 text-sm text-[#9E8F85]">
                        <TrendingUp className="w-4 h-4" /> Discussion Feed
                    </div>
                </div>

                {/* Replies Stack */}
                <div className="space-y-6">
                    {thread.replies.length === 0 ? (
                        <div className="bg-white border border-[#EDE8DF] p-8 text-center text-[#9E8F85]">
                            No replies yet.
                        </div>
                    ) : (
                        thread.replies.map((r) => (
                            <div key={r.id} className="bg-white border border-[#EDE8DF] p-6 shadow-sm">
                                {renderReply(r as DbReply)}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}