import type { ReactNode } from "react";

export type PageState =
    | { view: "home" }
    | { view: "forum" }
    | { view: "thread"; id: string };

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

export interface Discussion {
    id: string;
    title: string;
    excerpt: string;
    author: { name: string; initials: string; bg: string };
    category: string;
    categoryLabel: string;
    replies: number;
    views: number;
    lastActivity: string;
    pinned?: boolean;
    tags: string[];
}

export interface ReplyData {
    id: string;
    author: { name: string; initials: string; bg: string };
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