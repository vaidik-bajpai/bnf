import { useState } from "react";
import { Clock, ThumbsUp, MessageSquare, Share2, Check, Edit3, Trash2, Loader2 } from "lucide-react";
import type { Post } from "@/types/forum";
import ReplyReference from "./ReplyReference";

interface PostCardProps {
    post: Post;
    referencedPost?: Post | null;
    isOriginalPost?: boolean;
    isHighlighted?: boolean;
    currentUserId?: string;
    onReply: (post: Post) => void;
    onNavigateToPost: (postId: string) => void;
    onLike?: (postId: string) => void;
    onEdit?: (postId: string, newContent: string) => Promise<void>;
    onDelete?: (postId: string) => Promise<void>;
    isLiked?: boolean;
}

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

export default function PostCard({
    post,
    referencedPost,
    isOriginalPost = false,
    isHighlighted = false,
    currentUserId,
    onReply,
    onNavigateToPost,
    onLike,
    onEdit,
    onDelete,
    isLiked = false,
}: PostCardProps) {
    const [copied, setCopied] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editContent, setEditContent] = useState(post.content);
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(false);
    const author = post.author || {
        name: "Member",
        username: "member",
        initials: "ME",
        bg: "#B85428",
    };

    const authorName = author.name || "Member";
    const authorHandle = author.username || authorName.toLowerCase().replace(/\s+/g, "_");
    const authorInitials = author.initials || authorName.slice(0, 2).toUpperCase();
    const authorBg = author.bg || "#B85428";

    const isAuthor = Boolean(
        currentUserId && (currentUserId === post.authorId || currentUserId === post.author?.id)
    );
    const isEdited = Boolean(
        post.updatedAt &&
        post.createdAt &&
        new Date(post.updatedAt).getTime() - new Date(post.createdAt).getTime() > 2000
    );

    const handleShare = () => {
        const url = `${window.location.origin}#post-${post.id}`;
        navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleSaveEdit = async () => {
        if (!onEdit || !editContent.trim()) return;
        setIsSaving(true);
        try {
            await onEdit(post.id, editContent.trim());
            setIsEditing(false);
        } catch (err) {
            console.error("Failed to edit post:", err);
        } finally {
            setIsSaving(false);
        }
    };

    const handleConfirmDelete = async () => {
        if (!onDelete) return;
        setIsDeleting(true);
        try {
            await onDelete(post.id);
        } catch (err) {
            console.error("Failed to delete post:", err);
            setIsDeleting(false);
            setConfirmDelete(false);
        }
    };

    return (
        <div
            id={`post-${post.id}`}
            className={`bg-white border transition-all duration-500 p-5 sm:p-6 shadow-sm ${
                isHighlighted
                    ? "border-[#B85428] ring-2 ring-[#B85428]/30 bg-[#FAF6F0]"
                    : "border-[#EDE8DF] hover:border-[#D6CEC2]"
            }`}
        >
            <div className="flex items-start gap-3 sm:gap-4">
                {/* Avatar */}
                {author.image ? (
                    <img
                        src={author.image}
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
                    {/* Header Row */}
                    <div
                        className="flex flex-wrap items-center gap-x-2 gap-y-1 mb-2.5"
                        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                    >
                        <span className="font-semibold text-[#1C1917] text-sm">{authorName}</span>
                        <span className="text-xs text-[#9E8F85]">@{authorHandle}</span>

                        {isOriginalPost && (
                            <span className="text-[10px] font-semibold uppercase tracking-wider text-[#B85428] bg-[#B85428]/10 px-2 py-0.5 border border-[#B85428]/20 rounded-xs">
                                Original Post
                            </span>
                        )}

                        {isEdited && (
                            <span className="text-[11px] text-[#9E8F85] italic">
                                (edited)
                            </span>
                        )}

                        <span className="text-[#9E8F85] text-xs flex items-center gap-1 sm:ml-auto">
                            <Clock className="w-3 h-3" /> {formatRelativeTime(post.createdAt)}
                        </span>
                    </div>

                    {/* Compact Reply Reference (if replying to another post) */}
                    {post.replyToPostId && (
                        <ReplyReference
                            replyToPostId={post.replyToPostId}
                            referencedPost={referencedPost}
                            onNavigateToPost={onNavigateToPost}
                        />
                    )}

                    {/* Post Content or Inline Edit */}
                    {isEditing ? (
                        <div className="mb-4 space-y-2">
                            <textarea
                                value={editContent}
                                onChange={(e) => setEditContent(e.target.value)}
                                rows={4}
                                className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#B85428]/40 rounded-sm text-sm text-[#2C2420] focus:outline-none focus:border-[#B85428] focus:ring-1 focus:ring-[#B85428] leading-relaxed"
                                style={{ fontFamily: "'Spectral', Georgia, serif" }}
                                autoFocus
                            />
                            <div className="flex items-center gap-2 justify-end">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setEditContent(post.content);
                                        setIsEditing(false);
                                    }}
                                    disabled={isSaving}
                                    className="px-3 py-1.5 text-xs text-[#6B5B4E] hover:text-[#1C1917] transition-colors cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={handleSaveEdit}
                                    disabled={isSaving || !editContent.trim()}
                                    className="px-3.5 py-1.5 bg-[#B85428] hover:bg-[#A04820] text-white text-xs font-semibold rounded-xs transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                                >
                                    {isSaving ? <Loader2 className="w-3 h-3 animate-spin" /> : null}
                                    <span>Save Changes</span>
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div
                            className="text-[#2C2420] text-[0.95rem] leading-relaxed mb-4 whitespace-pre-wrap"
                            style={{ fontFamily: "'Spectral', Georgia, serif" }}
                        >
                            {post.content}
                        </div>
                    )}

                    {/* Action Strip */}
                    <div
                        className="flex items-center gap-4 sm:gap-5 text-xs pt-3 border-t border-[#EDE8DF]/70 text-[#9E8F85]"
                        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                    >
                        <button
                            type="button"
                            onClick={() => onLike && onLike(post.id)}
                            title={
                                post.likedBy && post.likedBy.length > 0
                                    ? isLiked
                                        ? post.likedBy.length > 1
                                            ? `Liked by you and ${post.likedBy.length - 1} other scholar${post.likedBy.length > 2 ? 's' : ''} · Click to unlike`
                                            : "Liked by you · Click to unlike"
                                        : `Liked by ${post.likedBy.slice(0, 3).map((a) => a.name).join(", ")}${post.likedBy.length > 3 ? ` and ${post.likedBy.length - 3} others` : ""}`
                                    : isLiked
                                    ? "Liked by you · Click to unlike"
                                    : "Like post"
                            }
                            className={`flex items-center gap-1.5 transition-colors cursor-pointer ${
                                isLiked
                                    ? "text-[#B85428] font-semibold"
                                    : "hover:text-[#B85428]"
                            }`}
                        >
                            <ThumbsUp className={`w-3.5 h-3.5 ${isLiked ? "fill-[#B85428]" : ""}`} />
                            <span>{post.likes || 0}</span>
                        </button>

                        {post.likedBy && post.likedBy.length > 0 && (
                            <span
                                className="text-[11px] text-[#9E8F85] hidden sm:inline-flex items-center gap-1"
                                title={post.likedBy.map((a) => a.name).join(", ")}
                            >
                                <span>
                                    Liked by{" "}
                                    <strong className="text-[#6B5B4E] font-medium">
                                        {isLiked ? "you" : post.likedBy[0].name.split(" ")[0]}
                                    </strong>
                                    {post.likedBy.length > 1 && (
                                        <span> and {post.likedBy.length - 1} other{post.likedBy.length > 2 ? "s" : ""}</span>
                                    )}
                                </span>
                            </span>
                        )}

                        <button
                            type="button"
                            onClick={() => onReply(post)}
                            className="flex items-center gap-1.5 hover:text-[#B85428] transition-colors cursor-pointer"
                        >
                            <MessageSquare className="w-3.5 h-3.5" />
                            <span>Reply</span>
                        </button>

                        {/* Author Edit */}
                        {isAuthor && onEdit && !isEditing && (
                            <button
                                type="button"
                                onClick={() => {
                                    setEditContent(post.content);
                                    setIsEditing(true);
                                }}
                                className="flex items-center gap-1.5 hover:text-[#B85428] transition-colors cursor-pointer text-[#9E8F85]"
                                title="Edit reply"
                            >
                                <Edit3 className="w-3.5 h-3.5" />
                                <span>Edit</span>
                            </button>
                        )}

                        {/* Author Delete */}
                        {isAuthor && onDelete && !isOriginalPost && (
                            confirmDelete ? (
                                <div className="flex items-center gap-2 bg-red-50 px-2 py-0.5 rounded-xs border border-red-200">
                                    <span className="text-red-700 text-[11px]">Delete?</span>
                                    <button
                                        type="button"
                                        onClick={handleConfirmDelete}
                                        disabled={isDeleting}
                                        className="text-[11px] font-semibold text-red-700 hover:text-red-900 cursor-pointer"
                                    >
                                        {isDeleting ? "..." : "Yes"}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setConfirmDelete(false)}
                                        disabled={isDeleting}
                                        className="text-[11px] text-[#6B5B4E] hover:text-[#1C1917] cursor-pointer"
                                    >
                                        No
                                    </button>
                                </div>
                            ) : (
                                <button
                                    type="button"
                                    onClick={() => setConfirmDelete(true)}
                                    className="flex items-center gap-1.5 hover:text-red-600 transition-colors cursor-pointer text-[#9E8F85]"
                                    title="Delete reply"
                                >
                                    <Trash2 className="w-3.5 h-3.5" />
                                    <span>Delete</span>
                                </button>
                            )
                        )}

                        <button
                            type="button"
                            onClick={handleShare}
                            className="flex items-center gap-1.5 hover:text-[#B85428] transition-colors cursor-pointer ml-auto"
                            title="Copy link to this post"
                        >
                            {copied ? (
                                <>
                                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                                    <span className="text-emerald-600 font-medium">Copied</span>
                                </>
                            ) : (
                                <>
                                    <Share2 className="w-3.5 h-3.5" />
                                    <span>Share</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
