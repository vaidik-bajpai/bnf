'use client';

import { useState, useEffect, useMemo } from "react";
import {
    ChevronLeft,
    Clock,
    MessageSquare,
    Eye,
    TrendingUp,
    Hash,
    Loader2,
    Layers,
    Share2,
    Bookmark,
    Check,
    ThumbsUp,
    Edit3,
    Trash2,
    Flag,
} from "lucide-react";
import { TricolorStripe } from "../Symbols";
import type { Discussion, Post } from "@/types/forum";
import {
    getThreadById,
    postReply,
    toggleLike,
    deleteDiscussion,
    updatePost,
    deletePost,
    toggleBookmark,
} from "@/app/actions/forum";
import { useAuth } from "@/context/AuthContext";
import {
    getMegaThreadById,
    forumCategories,
} from "@/data/forumData";
import PostCard from "./PostCard";
import ReplyComposer from "./ReplyComposer";
import FormattedBody from "./FormattedBody";
import EditDiscussionModal from "../modals/EditDiscussionModal";
import ReportModal from "../modals/ReportModal";
import ShareModal from "../modals/ShareModal";

interface ThreadViewProps {
    threadId: string;
    onBack: () => void;
    onViewMegaThread?: (megaThreadId: string) => void;
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

export default function ThreadView({
    threadId,
    onBack,
    onViewMegaThread,
}: ThreadViewProps) {
    const { user, requireAuth } = useAuth();
    const [discussion, setDiscussion] = useState<Discussion | null>(null);
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);

    // State for interactions
    const [likedSet, setLikedSet] = useState<Set<string>>(new Set());
    const [isDiscussionLiked, setIsDiscussionLiked] = useState(false);
    const [isDiscussionBookmarked, setIsDiscussionBookmarked] = useState(false);
    const [showShareModal, setShowShareModal] = useState(false);
    const [reportTarget, setReportTarget] = useState<{
        discussionId?: string;
        postId?: string;
        itemTitle?: string;
        itemAuthor?: string;
    } | null>(null);

    // Replying state
    const [replyingToPost, setReplyingToPost] = useState<Post | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Anchor highlight state
    const [highlightedPostId, setHighlightedPostId] = useState<string | null>(null);

    // Discussion edit and delete states
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [isDeletingDiscussion, setIsDeletingDiscussion] = useState(false);

    useEffect(() => {
        let active = true;

        getThreadById(threadId, user?.id)
            .then((data) => {
                if (!active) return;
                if (data) {
                    setDiscussion(data as unknown as Discussion);
                    setIsDiscussionLiked(Boolean(data.isLiked));
                    setIsDiscussionBookmarked(Boolean(data.isBookmarked));
                    const initialLiked = new Set<string>();
                    data.posts.forEach((p) => {
                        if (p.isLiked) initialLiked.add(p.id);
                    });
                    setLikedSet(initialLiked);
                    setPosts(data.posts as unknown as Post[]);
                }
                setLoading(false);
            })
            .catch((err) => {
                console.error("Failed to load thread from backend:", err);
                if (active) setLoading(false);
            });

        return () => {
            active = false;
        };
    }, [threadId, user?.id]);

    // Parent MegaThread if associated
    const parentMegaThread = useMemo(() => {
        if (!discussion?.megaThreadId) return null;
        if (discussion.megaThread) {
            return {
                id: discussion.megaThread.id,
                title: discussion.megaThread.title,
                category: discussion.megaThread.category || discussion.category,
                categoryLabel: discussion.categoryLabel,
                description: "",
                createdAt: "",
                updatedAt: "",
                discussionCount: 0,
                participantCount: 0,
            };
        }
        return getMegaThreadById(discussion.megaThreadId);
    }, [discussion]);

    // Category styling
    const categoryObj = forumCategories.find((c) => c.id === discussion?.category);
    const categoryColor = discussion?.categoryColor || categoryObj?.color || "#B85428";
    const categoryName = discussion?.categoryLabel || categoryObj?.name || "General";

    // Build efficient Map lookup for O(1) post resolution (replyToPostId -> referenced Post)
    const postLookup = useMemo(() => {
        const map = new Map<string, Post>();
        posts.forEach((p) => map.set(p.id, p));
        return map;
    }, [posts]);

    // Determine opening post (OP)
    const opPost: Post | null = useMemo(() => {
        if (posts.length > 0) {
            const firstOp = posts.find((p) => p.replyToPostId === null);
            if (firstOp) return firstOp;
            return posts[0];
        }
        if (discussion) {
            return {
                id: `post-${discussion.id}-op`,
                discussionId: discussion.id,
                author: discussion.author,
                content: discussion.body || discussion.excerpt,
                createdAt: discussion.createdAt || new Date().toISOString(),
                replyToPostId: null,
                likes: discussion.likes || 1,
            };
        }
        return null;
    }, [posts, discussion]);

    // Flat list of replies (all posts except OP)
    const flatReplies: Post[] = useMemo(() => {
        if (!opPost) return [];
        return posts.filter((p) => p.id !== opPost.id);
    }, [posts, opPost]);

    // Anchor navigation with smooth scroll & highlight
    const scrollToPost = (targetPostId: string) => {
        const targetElement = document.getElementById(`post-${targetPostId}`);
        if (targetElement) {
            targetElement.scrollIntoView({ behavior: "smooth", block: "center" });
            setHighlightedPostId(targetPostId);
            setTimeout(() => {
                setHighlightedPostId(null);
            }, 2000);
        }
    };

    // Reply trigger: sets replyingToPost and scrolls to composer
    const handleStartReply = (post: Post) => {
        if (!user) {
            requireAuth(() => handleStartReply(post));
            return;
        }
        setReplyingToPost(post);
        setTimeout(() => {
            const composerEl = document.getElementById("reply-composer");
            composerEl?.scrollIntoView({ behavior: "smooth", block: "center" });
            const textarea = composerEl?.querySelector("textarea");
            textarea?.focus();
        }, 100);
    };

    // Toggle like and unlike on Posts
    const handleTogglePostLike = async (postId: string) => {
        if (!user) {
            requireAuth(() => handleTogglePostLike(postId));
            return;
        }

        const isCurrentlyLiked = likedSet.has(postId);
        const actionPref = isCurrentlyLiked ? "unlike" : "like";

        // Optimistic UI update
        setLikedSet((prev) => {
            const next = new Set(prev);
            if (isCurrentlyLiked) next.delete(postId);
            else next.add(postId);
            return next;
        });

        setPosts((prev) =>
            prev.map((p) => {
                if (p.id !== postId) return p;
                const nextLikes = Math.max(0, (p.likes || 0) + (isCurrentlyLiked ? -1 : 1));
                let nextLikedBy = p.likedBy || [];
                if (isCurrentlyLiked) {
                    nextLikedBy = nextLikedBy.filter((a) => a.id !== user.id);
                } else if (!nextLikedBy.some((a) => a.id === user.id)) {
                    nextLikedBy = [
                        ...nextLikedBy,
                        {
                            id: user.id,
                            name: user.name,
                            username: user.username,
                            initials: user.initials,
                            bg: user.bg,
                            image: user.image || undefined,
                        },
                    ];
                }
                return { ...p, likes: nextLikes, isLiked: !isCurrentlyLiked, likedBy: nextLikedBy };
            })
        );

        try {
            const res = await toggleLike("post", postId, actionPref, user.id);
            if (typeof res?.likes === "number") {
                setPosts((prev) =>
                    prev.map((p) => (p.id === postId ? { ...p, likes: res.likes, isLiked: res.liked } : p))
                );
                setLikedSet((prev) => {
                    const next = new Set(prev);
                    if (res.liked) next.add(postId);
                    else next.delete(postId);
                    return next;
                });
            }
        } catch (err) {
            console.error("Failed to toggle post like:", err);
        }
    };

    // Toggle like and unlike on Discussion (OP)
    const handleToggleDiscussionLike = async () => {
        if (!discussion) return;
        if (!user) {
            requireAuth(() => handleToggleDiscussionLike());
            return;
        }

        const willUnlike = isDiscussionLiked;

        // Optimistic UI update
        setIsDiscussionLiked(!willUnlike);
        setDiscussion((prev) => {
            if (!prev) return prev;
            const nextLikes = Math.max(0, (prev.likes || 0) + (willUnlike ? -1 : 1));
            let nextLikedBy = prev.likedBy || [];
            if (willUnlike) {
                nextLikedBy = nextLikedBy.filter((a) => a.id !== user.id);
            } else if (!nextLikedBy.some((a) => a.id === user.id)) {
                nextLikedBy = [
                    ...nextLikedBy,
                    {
                        id: user.id,
                        name: user.name,
                        username: user.username,
                        initials: user.initials,
                        bg: user.bg,
                        image: user.image || undefined,
                    },
                ];
            }
            return { ...prev, likes: nextLikes, isLiked: !willUnlike, likedBy: nextLikedBy };
        });

        try {
            const res = await toggleLike("discussion", discussion.id, willUnlike ? "unlike" : "like", user.id);
            if (typeof res?.likes === "number") {
                setDiscussion((prev) => (prev ? { ...prev, likes: res.likes, isLiked: res.liked } : prev));
                setIsDiscussionLiked(res.liked);
            }
        } catch (err) {
            console.error("Failed to toggle discussion like:", err);
        }
    };

    // Submit new reply (FLAT model with replyToPostId)
    const handleSubmitReply = async (content: string, replyToPostId: string | null) => {
        if (!discussion) return;
        setIsSubmitting(true);

        try {
            const newPost = await postReply({
                discussionId: discussion.id,
                content,
                replyToPostId,
                authorId: user?.id,
            });

            if (newPost) {
                setPosts((prev) => [...prev, newPost as unknown as Post]);
            }
            setReplyingToPost(null);

            // Update discussion stats
            setDiscussion((prev) =>
                prev
                    ? {
                          ...prev,
                          replies: (prev.replies || 0) + 1,
                          replyCount: (prev.replyCount || 0) + 1,
                          lastActivity: "Just now",
                      }
                    : prev
            );

            // Scroll to new reply and highlight
            if (newPost?.id) {
                setTimeout(() => {
                    scrollToPost(newPost.id);
                }, 250);
            }
        } catch (err) {
            console.error("Failed to post reply:", err);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Discussion updated handler
    const handleDiscussionUpdated = (updated: Discussion) => {
        setDiscussion(updated);
        setPosts((prev) =>
            prev.map((p) => {
                if (p.replyToPostId === null) {
                    return {
                        ...p,
                        content: updated.body || updated.excerpt,
                        updatedAt: new Date().toISOString(),
                    };
                }
                return p;
            })
        );
    };

    // Discussion delete handler
    const handleDeleteDiscussion = async () => {
        if (!discussion) return;
        setIsDeletingDiscussion(true);
        try {
            await deleteDiscussion(discussion.id, user?.id);
            setShowDeleteConfirm(false);
            onBack();
        } catch (err) {
            console.error("Failed to delete discussion:", err);
            alert(err instanceof Error ? err.message : "Failed to delete discussion.");
            setIsDeletingDiscussion(false);
        }
    };

    // Reply / Post edit handler
    const handleEditPost = async (postId: string, newContent: string) => {
        if (!user) return;
        const updated = await updatePost(postId, { content: newContent }, user.id);
        if (updated) {
            setPosts((prev) =>
                prev.map((p) => {
                    if (p.id === postId) {
                        return {
                            ...p,
                            content: newContent,
                            updatedAt: updated.updatedAt || new Date().toISOString(),
                        };
                    }
                    return p;
                })
            );
            if (opPost && opPost.id === postId) {
                setDiscussion((prev) =>
                    prev
                        ? {
                              ...prev,
                              body: newContent,
                              excerpt: newContent.length > 160 ? newContent.slice(0, 160) + "..." : newContent,
                          }
                        : prev
                );
            }
        }
    };

    // Reply / Post delete handler
    const handleDeletePost = async (postId: string) => {
        if (!user) return;
        const res = await deletePost(postId, user.id);
        if (res?.success) {
            setPosts((prev) => prev.filter((p) => p.id !== postId));
            setDiscussion((prev) =>
                prev
                    ? {
                          ...prev,
                          replies: Math.max(0, (prev.replies || 0) - 1),
                          replyCount: Math.max(0, (prev.replyCount || 0) - 1),
                      }
                    : prev
            );
        }
    };

    // Check if current authenticated user is the author of this discussion
    const isDiscussionAuthor = Boolean(
        user && (user.id === discussion?.authorId || user.id === discussion?.author?.id)
    );

    // Bookmark toggle handler backed by database
    const handleToggleBookmark = async () => {
        if (!discussion) return;
        if (!user) {
            requireAuth(() => handleToggleBookmark());
            return;
        }

        const nextBookmarked = !isDiscussionBookmarked;
        setIsDiscussionBookmarked(nextBookmarked);
        setDiscussion((prev) =>
            prev
                ? {
                      ...prev,
                      isBookmarked: nextBookmarked,
                      bookmarkCount: Math.max(0, (prev.bookmarkCount || 0) + (nextBookmarked ? 1 : -1)),
                  }
                : prev
        );

        try {
            const res = await toggleBookmark(discussion.id, user.id);
            setIsDiscussionBookmarked(res.bookmarked);
            setDiscussion((prev) =>
                prev
                    ? {
                          ...prev,
                          isBookmarked: res.bookmarked,
                          bookmarkCount: res.bookmarkCount,
                      }
                    : prev
            );
        } catch (err) {
            console.error("Failed to toggle bookmark:", err);
            setIsDiscussionBookmarked(!nextBookmarked);
        }
    };

    // Report modal trigger
    const handleOpenReport = (target: {
        discussionId?: string;
        postId?: string;
        itemTitle?: string;
        itemAuthor?: string;
    }) => {
        if (!user) {
            requireAuth(() => setReportTarget(target));
            return;
        }
        setReportTarget(target);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#FAFAF7] flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-[#B85428] animate-spin" />
            </div>
        );
    }

    if (!discussion) {
        return (
            <div className="min-h-screen bg-[#FAFAF7] px-6 py-28 text-center" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                <h2 className="text-xl font-bold text-[#1C1917] mb-4">Discussion not found</h2>
                <button
                    onClick={onBack}
                    className="text-sm text-[#B85428] hover:underline font-semibold cursor-pointer"
                >
                    &larr; Back to Forum
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FAFAF7]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            {/* Thread Header Banner */}
            <div className="bg-[#0F1C3F] pt-24 pb-12 px-6">
                <div className="max-w-4xl mx-auto">
                    {/* Navigation & Breadcrumb */}
                    <div className="flex flex-wrap items-center gap-2 text-xs text-white/50 mb-6">
                        <button
                            onClick={onBack}
                            className="hover:text-white transition-colors cursor-pointer flex items-center gap-1"
                        >
                            <ChevronLeft className="w-3.5 h-3.5" /> Back
                        </button>
                        <span>/</span>
                        <button onClick={onBack} className="hover:text-white transition-colors cursor-pointer">
                            Forum
                        </button>
                        {parentMegaThread && (
                            <>
                                <span>/</span>
                                <button
                                    onClick={() =>
                                        onViewMegaThread
                                            ? onViewMegaThread(parentMegaThread.id)
                                            : onBack()
                                    }
                                    className="hover:text-[#C8971A] text-white/70 transition-colors cursor-pointer flex items-center gap-1"
                                >
                                    <Layers className="w-3 h-3 text-[#C8971A]" />
                                    <span>{parentMegaThread.title}</span>
                                </button>
                            </>
                        )}
                    </div>

                    {/* Category & Badges */}
                    <div className="flex flex-wrap items-center gap-2.5 mb-4">
                        <span
                            className="text-xs font-semibold tracking-wider uppercase px-3 py-1 rounded-full text-white"
                            style={{ backgroundColor: categoryColor }}
                        >
                            {categoryName}
                        </span>

                        {parentMegaThread && (
                            <button
                                onClick={() =>
                                    onViewMegaThread
                                        ? onViewMegaThread(parentMegaThread.id)
                                        : onBack()
                                }
                                className="text-xs font-semibold tracking-wider uppercase px-3 py-1 bg-[#C8971A]/20 hover:bg-[#C8971A]/30 text-[#C8971A] border border-[#C8971A]/30 transition-colors flex items-center gap-1.5 cursor-pointer"
                            >
                                <Layers className="w-3 h-3" />
                                <span>MegaThread</span>
                            </button>
                        )}
                    </div>

                    {/* Discussion Title */}
                    <h1
                        className="text-white text-2xl sm:text-3xl font-bold leading-snug mb-5"
                        style={{ fontFamily: "'Fraunces', serif" }}
                    >
                        {discussion.title}
                    </h1>

                    {/* Metadata Strip */}
                    <div className="flex flex-wrap items-center gap-5 text-xs sm:text-sm text-white/60">
                        <div className="flex items-center gap-2">
                            {discussion.author.image ? (
                                <img
                                    src={discussion.author.image}
                                    alt={discussion.author.name}
                                    className="w-7 h-7 rounded-full object-cover border border-white/20"
                                />
                            ) : (
                                <div
                                    className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold"
                                    style={{ backgroundColor: discussion.author.bg || "#B85428" }}
                                >
                                    {discussion.author.initials}
                                </div>
                            )}
                            <span className="text-white/90 font-medium">{discussion.author.name}</span>
                        </div>

                        <span className="flex items-center gap-1.5">
                            <MessageSquare className="w-3.5 h-3.5" />
                            {flatReplies.length} {flatReplies.length === 1 ? "reply" : "replies"}
                        </span>

                        <span className="flex items-center gap-1.5">
                            <Eye className="w-3.5 h-3.5" />
                            {(discussion.viewCount ?? discussion.views ?? 0).toLocaleString()} views
                        </span>

                        <span className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5" />
                            {formatRelativeTime(discussion.createdAt)}
                        </span>

                        {/* Quick action buttons in header */}
                        <div className="flex items-center gap-2 sm:ml-auto">
                            <button
                                type="button"
                                onClick={() => handleStartReply(opPost || ({ id: `post-${discussion.id}-op` } as Post))}
                                className="flex items-center gap-1.5 px-2.5 py-1 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-xs transition-colors cursor-pointer"
                                title="Contribute a reply to this discussion"
                            >
                                <MessageSquare className="w-3.5 h-3.5 text-[#C8971A]" />
                                <span>Reply</span>
                            </button>

                            <button
                                type="button"
                                onClick={handleToggleBookmark}
                                className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-xs transition-colors cursor-pointer ${
                                    isDiscussionBookmarked
                                        ? "bg-[#C8971A] text-[#0F1C3F]"
                                        : "bg-white/10 hover:bg-white/20 text-white"
                                }`}
                                title={isDiscussionBookmarked ? "Saved in your bookmarks" : "Save to bookmarks"}
                            >
                                <Bookmark className={`w-3.5 h-3.5 ${isDiscussionBookmarked ? "fill-[#0F1C3F]" : ""}`} />
                                <span className="hidden sm:inline">{isDiscussionBookmarked ? "Bookmarked" : "Bookmark"}</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => setShowShareModal(true)}
                                className="flex items-center gap-1.5 px-2.5 py-1 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-xs transition-colors cursor-pointer"
                                title="Share discussion"
                            >
                                <Share2 className="w-3.5 h-3.5" />
                                <span className="hidden sm:inline">Share</span>
                            </button>

                            <button
                                type="button"
                                onClick={() =>
                                    handleOpenReport({
                                        discussionId: discussion.id,
                                        itemTitle: discussion.title,
                                        itemAuthor: discussion.author.name,
                                    })
                                }
                                className="flex items-center gap-1.5 px-2 py-1 bg-white/5 hover:bg-red-500/20 text-white/70 hover:text-red-300 text-xs transition-colors cursor-pointer"
                                title="Report this discussion"
                            >
                                <Flag className="w-3.5 h-3.5" />
                                <span className="hidden md:inline">Report</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <TricolorStripe />

            {/* Main Content: Original Post -> Flat Replies List -> Reply Composer */}
            <div className="max-w-4xl mx-auto px-6 py-10 space-y-8">
                {/* ============================================================ */}
                {/* 1. ORIGINAL POST (OP)                                        */}
                {/* ============================================================ */}
                {opPost && (
                    <div
                        id={`post-${opPost.id}`}
                        className={`bg-white border transition-all duration-500 p-6 sm:p-8 shadow-sm ${
                            highlightedPostId === opPost.id
                                ? "border-[#B85428] ring-2 ring-[#B85428]/30 bg-[#FAF6F0]"
                                : "border-[#EDE8DF]"
                        }`}
                    >
                        <div className="flex items-start gap-4 sm:gap-5">
                            {opPost.author.image ? (
                                <img
                                    src={opPost.author.image}
                                    alt={opPost.author.name}
                                    className="shrink-0 w-10 h-10 sm:w-11 sm:h-11 rounded-full object-cover border border-[#EDE8DF]"
                                />
                            ) : (
                                <div
                                    className="shrink-0 w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center text-white font-bold text-sm"
                                    style={{ backgroundColor: opPost.author.bg || "#B85428" }}
                                >
                                    {opPost.author.initials}
                                </div>
                            )}

                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-3">
                                    <span className="font-semibold text-[#1C1917] text-base sm:text-lg">
                                        {opPost.author.name}
                                    </span>
                                    <span className="text-xs text-[#9E8F85]">
                                        @{opPost.author.username || opPost.author.name.toLowerCase().replace(/\s+/g, "_")}
                                    </span>
                                    {((discussion.updatedAt && discussion.createdAt && new Date(discussion.updatedAt).getTime() - new Date(discussion.createdAt).getTime() > 2000) ||
                                      (opPost.updatedAt && opPost.createdAt && new Date(opPost.updatedAt).getTime() - new Date(opPost.createdAt).getTime() > 2000)) && (
                                        <span className="text-[11px] text-[#9E8F85] italic">
                                            (edited)
                                        </span>
                                    )}
                                    <span className="text-[11px] uppercase tracking-wider font-semibold text-[#B85428] bg-[#B85428]/10 px-2.5 py-0.5 border border-[#B85428]/20 ml-auto">
                                        Original Post
                                    </span>
                                </div>

                                <div className="mb-6">
                                    <FormattedBody content={opPost.content} className="text-base sm:text-lg" />
                                </div>

                                {/* Discussion Tags */}
                                {discussion.tags && discussion.tags.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mb-6">
                                        {discussion.tags.map((tag) => (
                                            <span
                                                key={tag}
                                                className="text-xs text-[#B85428] bg-[#B85428]/8 px-3 py-1 flex items-center gap-1 border border-[#B85428]/15"
                                            >
                                                <Hash className="w-3 h-3" /> {tag}
                                            </span>
                                        ))}
                                    </div>
                                )}

                                {/* OP Action Strip with Like and Unlike */}
                                <div className="flex items-center gap-5 pt-4 border-t border-[#EDE8DF] text-xs text-[#9E8F85]">
                                    <button
                                        type="button"
                                        onClick={handleToggleDiscussionLike}
                                        className={`flex items-center gap-1.5 transition-colors cursor-pointer ${
                                            isDiscussionLiked
                                                ? "text-[#B85428] font-semibold"
                                                : "hover:text-[#B85428]"
                                        }`}
                                        title={
                                            discussion.likedBy && discussion.likedBy.length > 0
                                                ? isDiscussionLiked
                                                    ? discussion.likedBy.length > 1
                                                        ? `Liked by you and ${discussion.likedBy.length - 1} other scholar${discussion.likedBy.length > 2 ? 's' : ''} · Click to unlike`
                                                        : "Liked by you · Click to unlike"
                                                    : `Liked by ${discussion.likedBy.slice(0, 3).map((a) => a.name).join(", ")}${discussion.likedBy.length > 3 ? ` and ${discussion.likedBy.length - 3} others` : ""}`
                                                : isDiscussionLiked
                                                ? "Liked by you · Click to unlike"
                                                : user
                                                ? "Like this discussion"
                                                : "Sign in to like this discussion"
                                        }
                                    >
                                        <ThumbsUp className={`w-4 h-4 ${isDiscussionLiked ? "fill-[#B85428]" : ""}`} />
                                        <span>
                                            {isDiscussionLiked ? "Liked" : "Like"} ({discussion.likes || 0})
                                        </span>
                                    </button>

                                    {discussion.likedBy && discussion.likedBy.length > 0 && (
                                        <span
                                            className="text-[11px] text-[#9E8F85] hidden sm:inline-flex items-center gap-1"
                                            title={discussion.likedBy.map((a) => a.name).join(", ")}
                                        >
                                            <span>
                                                Liked by{" "}
                                                <strong className="text-[#6B5B4E] font-medium">
                                                    {isDiscussionLiked ? "you" : discussion.likedBy[0].name.split(" ")[0]}
                                                </strong>
                                                {discussion.likedBy.length > 1 && (
                                                    <span> and {discussion.likedBy.length - 1} other{discussion.likedBy.length > 2 ? "s" : ""}</span>
                                                )}
                                            </span>
                                        </span>
                                    )}

                                    <button
                                        type="button"
                                        onClick={() => handleStartReply(opPost)}
                                        className="flex items-center gap-1.5 hover:text-[#B85428] transition-colors cursor-pointer"
                                    >
                                        <MessageSquare className="w-4 h-4" />
                                        <span>Reply to OP</span>
                                    </button>

                                    {/* Author actions: Edit and Delete Discussion */}
                                    {isDiscussionAuthor && (
                                        <>
                                            <button
                                                type="button"
                                                onClick={() => setShowEditModal(true)}
                                                className="flex items-center gap-1.5 hover:text-[#B85428] transition-colors cursor-pointer text-[#6B5B4E]"
                                                title="Edit discussion thesis and metadata"
                                            >
                                                <Edit3 className="w-4 h-4 text-[#B85428]" />
                                                <span>Edit</span>
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => setShowDeleteConfirm(true)}
                                                className="flex items-center gap-1.5 hover:text-red-700 transition-colors cursor-pointer text-red-600/80"
                                                title="Delete discussion"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                                <span>Delete</span>
                                            </button>
                                        </>
                                    )}

                                    <button
                                        type="button"
                                        onClick={handleToggleBookmark}
                                        className={`flex items-center gap-1.5 transition-colors cursor-pointer ${
                                            isDiscussionBookmarked ? "text-[#C8971A] font-semibold" : "hover:text-[#C8971A]"
                                        }`}
                                        title={isDiscussionBookmarked ? "Saved to your bookmarks · Click to remove" : "Save to bookmarks"}
                                    >
                                        <Bookmark className={`w-4 h-4 ${isDiscussionBookmarked ? "fill-[#C8971A]" : ""}`} />
                                        <span>
                                            {isDiscussionBookmarked ? "Bookmarked" : "Bookmark"}
                                            {(discussion.bookmarkCount ?? 0) > 0 ? ` (${discussion.bookmarkCount})` : ""}
                                        </span>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleOpenReport({
                                                discussionId: discussion.id,
                                                itemTitle: discussion.title,
                                                itemAuthor: discussion.author.name,
                                            })
                                        }
                                        className="flex items-center gap-1.5 hover:text-red-600 transition-colors cursor-pointer text-[#9E8F85]"
                                        title="Report this discussion"
                                    >
                                        <Flag className="w-4 h-4" />
                                        <span>Report</span>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setShowShareModal(true)}
                                        className="flex items-center gap-1.5 hover:text-[#B85428] transition-colors cursor-pointer ml-auto"
                                        title="Share this discussion"
                                    >
                                        <Share2 className="w-4 h-4" />
                                        <span>Share</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* ============================================================ */}
                {/* 2. FLAT LIST OF REPLIES (Never nested, supports like/unlike) */}
                {/* ============================================================ */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-[#EDE8DF] pb-2.5">
                        <h2
                            className="text-[#1C1917] font-bold text-lg"
                            style={{ fontFamily: "'Fraunces', serif" }}
                        >
                            {flatReplies.length} {flatReplies.length === 1 ? "Contribution" : "Contributions"}
                        </h2>
                        <span className="text-xs text-[#9E8F85] flex items-center gap-1">
                            <TrendingUp className="w-3.5 h-3.5 text-[#B85428]" /> Flat Conversation Stream
                        </span>
                    </div>

                    {flatReplies.length === 0 ? (
                        <div className="bg-white border border-[#EDE8DF] p-8 text-center text-[#9E8F85]">
                            <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-30 text-[#B85428]" />
                            <p className="text-sm text-[#4A403A]">No replies yet.</p>
                            <p className="text-xs text-[#9E8F85] mt-1">
                                Initiate the dialogue by sharing your perspectives below.
                            </p>
                        </div>
                    ) : (
                        flatReplies.map((replyPost) => {
                            const referenced = replyPost.replyToPostId
                                ? postLookup.get(replyPost.replyToPostId)
                                : null;

                            return (
                                <PostCard
                                    key={replyPost.id}
                                    post={replyPost}
                                    referencedPost={referenced}
                                    isHighlighted={highlightedPostId === replyPost.id}
                                    currentUserId={user?.id}
                                    onReply={(p) => handleStartReply(p)}
                                    onNavigateToPost={(targetId) => scrollToPost(targetId)}
                                    onLike={(id) => handleTogglePostLike(id)}
                                    onEdit={handleEditPost}
                                    onDelete={handleDeletePost}
                                    onReport={(p) =>
                                        handleOpenReport({
                                            postId: p.id,
                                            itemTitle: p.content.slice(0, 60),
                                            itemAuthor: p.author.name,
                                        })
                                    }
                                    isLiked={likedSet.has(replyPost.id)}
                                />
                            );
                        })
                    )}
                </div>

                {/* ============================================================ */}
                {/* 3. REPLY COMPOSER                                            */}
                {/* ============================================================ */}
                <ReplyComposer
                    replyingToPost={replyingToPost}
                    onCancelReplyReference={() => setReplyingToPost(null)}
                    onSubmitReply={handleSubmitReply}
                    isSubmitting={isSubmitting}
                />
            </div>

            {/* Edit Discussion Modal */}
            {discussion && (
                <EditDiscussionModal
                    isOpen={showEditModal}
                    onClose={() => setShowEditModal(false)}
                    discussion={discussion}
                    onUpdated={handleDiscussionUpdated}
                />
            )}

            {/* Delete Discussion Confirmation Modal */}
            {showDeleteConfirm && discussion && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
                    <div className="bg-[#FAF8F5] border border-[#D4A373]/30 rounded-lg shadow-2xl w-full max-w-md p-6 animate-in fade-in zoom-in-95 duration-150">
                        <div className="flex items-center gap-3 text-red-600 mb-3">
                            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                                <Trash2 className="w-5 h-5 text-red-600" />
                            </div>
                            <div>
                                <h3 className="font-bold text-base text-[#0F1C3F]" style={{ fontFamily: "'Fraunces', serif" }}>
                                    Delete Discussion?
                                </h3>
                                <p className="text-xs text-[#6B5B4E]">This action cannot be undone.</p>
                            </div>
                        </div>
                        <p className="text-sm text-[#4A403A] mb-6 leading-relaxed" style={{ fontFamily: "'Spectral', Georgia, serif" }}>
                            Are you sure you want to permanently delete <strong className="text-[#0F1C3F] font-semibold">&ldquo;{discussion.title}&rdquo;</strong> and all associated contributions?
                        </p>
                        <div className="flex items-center justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => setShowDeleteConfirm(false)}
                                disabled={isDeletingDiscussion}
                                className="px-4 py-2 text-xs font-semibold text-[#6B5B4E] hover:text-[#0F1C3F] transition-colors cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleDeleteDiscussion}
                                disabled={isDeletingDiscussion}
                                className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold tracking-wide transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50"
                            >
                                {isDeletingDiscussion ? (
                                    <>
                                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                        <span>Deleting...</span>
                                    </>
                                ) : (
                                    <span>Delete Permanently</span>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Share Modal */}
            {discussion && (
                <ShareModal
                    isOpen={showShareModal}
                    onClose={() => setShowShareModal(false)}
                    title={discussion.title}
                    discussionId={discussion.id}
                />
            )}

            {/* Report Modal */}
            <ReportModal
                isOpen={Boolean(reportTarget)}
                onClose={() => setReportTarget(null)}
                discussionId={reportTarget?.discussionId}
                postId={reportTarget?.postId}
                itemTitle={reportTarget?.itemTitle}
                itemAuthor={reportTarget?.itemAuthor}
            />
        </div>
    );
}