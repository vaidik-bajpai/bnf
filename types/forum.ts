import type { ReactNode } from "react";

export type PageState =
    | { view: "home" }
    | { view: "forum" }
    | { view: "megathreads" }
    | { view: "megathread"; id: string }
    | { view: "discussion"; id: string }
    | { view: "thread"; id: string };

export interface Author {
    id?: string;
    name: string;
    username?: string;
    initials: string;
    bg: string;
    image?: string;
}

export interface Leader {
    name: string;
    era: string;
    domain: string;
    desc: string;
    initials: string;
    bg: string;
}

export interface ForumCategory {
    id: string;
    name: string;
    icon: ReactNode;
    count: number;
    color: string;
}

export interface MegaThread {
    id: string;
    title: string;
    description: string;
    category: string;
    categoryLabel?: string;
    createdAt: string;
    updatedAt: string;
    discussionCount: number;
    participantCount: number;
    featured?: boolean;
    tags?: string[];
    bannerGradient?: string;
}

export interface Discussion {
    id: string;
    megaThreadId?: string;
    megaThreadTitle?: string;
    megaThread?: { id: string; title: string; category?: string };
    title: string;
    excerpt: string;
    description?: string;
    body?: string;
    authorId?: string;
    author: Author;
    category: string;
    categoryLabel: string;
    categoryColor?: string;
    replies: number;
    replyCount?: number;
    views: number;
    viewCount?: number;
    lastActivity: string;
    createdAt?: string;
    updatedAt?: string;
    pinned?: boolean;
    tags: string[];
    imageUrl?: string | null;
    imageAlt?: string | null;
    photographer?: string | null;
    photographerUrl?: string | null;
    pexelsUrl?: string | null;
    likes?: number;
    isLiked?: boolean;
    likedBy?: Author[];
    shares?: number;
    isBookmarked?: boolean;
    bookmarkCount?: number;
}

export interface Post {
    id: string;
    discussionId: string;
    authorId?: string;
    author: Author;
    content: string;
    createdAt: string;
    updatedAt?: string;
    replyToPostId: string | null;
    likes?: number;
    isLiked?: boolean;
    likedBy?: Author[];
    isReported?: boolean;
}

export type ReportReason =
    | "spam"
    | "harassment"
    | "hate_speech"
    | "misinformation"
    | "inappropriate"
    | "copyright"
    | "off_topic"
    | "other";

export interface Report {
    id: string;
    reason: string;
    details?: string | null;
    status: "PENDING" | "REVIEWED" | "RESOLVED" | "DISMISSED";
    userId: string;
    discussionId?: string | null;
    postId?: string | null;
    createdAt: string;
    updatedAt?: string;
}

export interface Bookmark {
    id: string;
    userId: string;
    discussionId: string;
    createdAt: string;
    discussion?: Discussion;
}

export interface ReplyReference {
    postId: string;
    authorName: string;
    authorUsername?: string;
    excerpt: string;
}

export interface ReplyData {
    id: string;
    author: Author;
    content: string;
    timestamp: string;
    likes: number;
    nested?: ReplyData[];
}

export interface KnowledgeSystem {
    icon: ReactNode;
    title: string;
    items: string[];
    color: string;
}

export interface TimelineEvent {
    year: string;
    event: string;
    note: string;
}