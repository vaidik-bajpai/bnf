'use client';

import { useState, useMemo, useEffect } from "react";
import {
    ChevronLeft,
    Layers,
    Plus,
    Bell,
    Check,
    Search,
    MessageSquare,
    Users,
    TrendingUp,
    Sparkles,
    BookOpen,
} from "lucide-react";
import { AshokaCakra, TricolorStripe } from "../Symbols";
import {
    getMegaThreadById,
    getDiscussionsByMegaThread,
    forumCategories,
    getMegaThreads,
} from "@/data/forumData";
import { getMegaThreadByIdAction } from "@/app/actions/forum";
import type { MegaThread, Discussion } from "@/types/forum";
import DiscussionCard from "./DiscussionCard";

interface MegaThreadPageProps {
    megaThreadId: string;
    onBack: () => void;
    onViewDiscussion: (id: string) => void;
    onNewDiscussion: (megaThreadId?: string) => void;
    onViewMegaThread?: (id: string) => void;
}

export default function MegaThreadPage({
    megaThreadId,
    onBack,
    onViewDiscussion,
    onNewDiscussion,
    onViewMegaThread,
}: MegaThreadPageProps) {
    const [megaThread, setMegaThread] = useState<MegaThread | null>(() => getMegaThreadById(megaThreadId) || null);
    const [allDiscussions, setAllDiscussions] = useState<Discussion[]>(() => getDiscussionsByMegaThread(megaThreadId));
    const allMegaThreads = getMegaThreads().filter((m) => m.id !== megaThreadId);

    const [activeTab, setActiveTab] = useState<"featured" | "recent" | "popular">("featured");
    const [searchQuery, setSearchQuery] = useState("");
    const [isFollowing, setIsFollowing] = useState(false);
    const [followerCount, setFollowerCount] = useState(() => megaThread?.participantCount || 120);

    useEffect(() => {
        let active = true;
        getMegaThreadByIdAction(megaThreadId).then((data) => {
            if (!active || !data) return;
            setMegaThread(data as unknown as MegaThread);
            if (data.participantCount) {
                setFollowerCount(data.participantCount);
            }
            const threadData = data as unknown as { discussions?: Discussion[] };
            if (threadData.discussions) {
                setAllDiscussions(threadData.discussions);
            }
        }).catch((err) => {
            console.error("Backend fetch error in MegaThreadPage:", err);
        });

        return () => {
            active = false;
        };
    }, [megaThreadId]);

    const categoryObj = forumCategories.find((c) => c.id === megaThread?.category);
    const categoryColor = categoryObj?.color || "#B85428";
    const categoryName = categoryObj?.name || megaThread?.categoryLabel || "General";

    const handleToggleFollow = () => {
        setIsFollowing((prev) => {
            const next = !prev;
            setFollowerCount((count) => (next ? count + 1 : count - 1));
            return next;
        });
    };

    const filteredDiscussions = useMemo(() => {
        let list = [...allDiscussions];

        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase().trim();
            list = list.filter(
                (d) =>
                    d.title.toLowerCase().includes(q) ||
                    d.excerpt.toLowerCase().includes(q) ||
                    d.tags?.some((t) => t.toLowerCase().includes(q))
            );
        }

        if (activeTab === "featured") {
            list.sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0) || (b.views || 0) - (a.views || 0));
        } else if (activeTab === "recent") {
            list.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
        } else if (activeTab === "popular") {
            list.sort((a, b) => (b.replies || 0) - (a.replies || 0) || (b.views || 0) - (a.views || 0));
        }

        return list;
    }, [allDiscussions, searchQuery, activeTab]);

    if (!megaThread) {
        return (
            <div className="min-h-screen bg-[#FAFAF7] pt-28 px-6 text-center" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                <h2 className="text-xl font-bold text-[#1C1917] mb-3">MegaThread not found</h2>
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
            {/* Header Banner */}
            <div className="bg-[#0F1C3F] pt-24 pb-14 px-6 relative overflow-hidden">
                <div className="max-w-6xl mx-auto relative z-10">
                    {/* Back Link */}
                    <button
                        onClick={onBack}
                        className="flex items-center gap-1.5 text-white/60 hover:text-white text-xs font-semibold uppercase tracking-wider mb-6 transition-colors cursor-pointer"
                    >
                        <ChevronLeft className="w-4 h-4" /> Back to Forum
                    </button>

                    <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
                        <div className="max-w-3xl">
                            <div className="flex items-center gap-3 mb-3">
                                <span
                                    className="text-xs font-semibold tracking-wider uppercase px-3 py-1 rounded-full text-white"
                                    style={{ backgroundColor: categoryColor }}
                                >
                                    {categoryName}
                                </span>
                                <span className="text-xs text-[#C8971A] font-semibold tracking-wider uppercase flex items-center gap-1.5">
                                    <Layers className="w-3.5 h-3.5" /> Category
                                </span>
                            </div>

                            <h1
                                className="text-white text-2xl sm:text-3xl md:text-4xl font-bold leading-tight mb-4"
                                style={{ fontFamily: "'Fraunces', serif" }}
                            >
                                {megaThread.title}
                            </h1>

                            <p
                                className="text-white/70 text-base sm:text-lg leading-relaxed max-w-2xl"
                                style={{ fontFamily: "'Spectral', Georgia, serif" }}
                            >
                                {megaThread.description}
                            </p>

                            {/* Metadata Strip */}
                            <div className="flex flex-wrap items-center gap-6 mt-6 text-sm text-white/60">
                                <span className="flex items-center gap-2">
                                    <MessageSquare className="w-4 h-4 text-[#C8971A]" />
                                    <strong className="text-white">{allDiscussions.length}</strong> Discussions
                                </span>
                                <span className="flex items-center gap-2">
                                    <Users className="w-4 h-4 text-[#C8971A]" />
                                    <strong className="text-white">{followerCount}</strong> Participants
                                </span>
                            </div>
                        </div>

                        {/* CTA Buttons */}
                        <div className="flex flex-wrap items-center gap-3 shrink-0">
                            <button
                                onClick={handleToggleFollow}
                                className={`flex items-center gap-2 px-5 py-3 text-xs font-semibold tracking-wide uppercase transition-all cursor-pointer border ${isFollowing
                                    ? "bg-white/10 text-white border-white/30 hover:bg-white/15"
                                    : "bg-white text-[#0F1C3F] border-white hover:bg-[#FAFAF7]"
                                    }`}
                            >
                                {isFollowing ? (
                                    <>
                                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                                        <span>Following</span>
                                    </>
                                ) : (
                                    <>
                                        <Bell className="w-3.5 h-3.5 text-[#B85428]" />
                                        <span>Follow Category</span>
                                    </>
                                )}
                            </button>

                            <button
                                onClick={() => onNewDiscussion(megaThreadId)}
                                className="flex items-center gap-2 bg-[#B85428] hover:bg-[#A04820] text-white px-6 py-3 text-xs font-semibold tracking-wide uppercase transition-colors cursor-pointer shadow-md"
                            >
                                <Plus className="w-4 h-4" />
                                <span>Start Discussion</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <TricolorStripe />

            {/* Main Content Area */}
            <div className="max-w-6xl mx-auto px-6 py-10">
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Left 2 Cols: Discussions */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Search & Filter Bar */}
                        <div className="bg-white border border-[#EDE8DF] p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                            {/* Filter Tabs */}
                            <div className="flex items-center gap-1 border-b sm:border-b-0 border-[#EDE8DF] pb-2 sm:pb-0">
                                <button
                                    onClick={() => setActiveTab("featured")}
                                    className={`px-3.5 py-1.5 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer rounded-xs ${activeTab === "featured"
                                        ? "bg-[#B85428] text-white"
                                        : "text-[#6B5B4E] hover:text-[#1C1917]"
                                        }`}
                                >
                                    <Sparkles className="w-3.5 h-3.5" /> Featured
                                </button>
                                <button
                                    onClick={() => setActiveTab("recent")}
                                    className={`px-3.5 py-1.5 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer rounded-xs ${activeTab === "recent"
                                        ? "bg-[#B85428] text-white"
                                        : "text-[#6B5B4E] hover:text-[#1C1917]"
                                        }`}
                                >
                                    Recent
                                </button>
                                <button
                                    onClick={() => setActiveTab("popular")}
                                    className={`px-3.5 py-1.5 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer rounded-xs ${activeTab === "popular"
                                        ? "bg-[#B85428] text-white"
                                        : "text-[#6B5B4E] hover:text-[#1C1917]"
                                        }`}
                                >
                                    <TrendingUp className="w-3.5 h-3.5" /> Popular
                                </button>
                            </div>

                            {/* Search */}
                            <div className="relative flex-1 sm:max-w-xs">
                                <Search className="w-3.5 h-3.5 text-[#9E8F85] absolute left-3 top-1/2 -translate-y-1/2" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search in this MegaThread..."
                                    className="w-full pl-9 pr-3 py-1.5 text-xs border border-[#EDE8DF] bg-[#FAFAF7] focus:bg-white focus:outline-none focus:border-[#B85428] text-[#1C1917] placeholder-[#9E8F85] transition-colors"
                                />
                            </div>
                        </div>

                        {/* Discussions List */}
                        <div className="space-y-3">
                            {filteredDiscussions.length === 0 ? (
                                <div className="bg-white border border-[#EDE8DF] p-12 text-center text-[#9E8F85]">
                                    <BookOpen className="w-10 h-10 mx-auto mb-3 opacity-30 text-[#B85428]" />
                                    <p className="text-sm text-[#4A403A] font-medium mb-1">
                                        No discussions found in this MegaThread.
                                    </p>
                                    <p className="text-xs text-[#9E8F85] mb-4">
                                        Be the first scholar to initiate an inquiry.
                                    </p>
                                    <button
                                        onClick={() => onNewDiscussion(megaThreadId)}
                                        className="inline-flex items-center gap-2 bg-[#B85428] text-white px-5 py-2.5 text-xs font-semibold tracking-wide uppercase transition-colors hover:bg-[#A04820] cursor-pointer"
                                    >
                                        <Plus className="w-3.5 h-3.5" /> Start Discussion
                                    </button>
                                </div>
                            ) : (
                                filteredDiscussions.map((d) => (
                                    <DiscussionCard
                                        key={d.id}
                                        discussion={d}
                                        onClick={() => onViewDiscussion(d.id)}
                                    />
                                ))
                            )}
                        </div>
                    </div>

                    {/* Right 1 Col: Sidebar */}
                    <div className="space-y-6">
                        {/* MegaThread Charter */}
                        <div className="bg-white border border-[#EDE8DF] p-5 shadow-sm">
                            <h4 className="font-bold text-[#1C1917] text-xs uppercase tracking-widest mb-3 flex items-center gap-2">
                                <AshokaCakra className="w-4 h-4 text-[#C8971A]" />
                                Category Scope
                            </h4>
                            <p
                                className="text-xs text-[#5C524A] leading-relaxed mb-4"
                                style={{ fontFamily: "'Spectral', Georgia, serif" }}
                            >
                                All discussions in this MegaThread explore interconnected inquiries under{" "}
                                <strong className="text-[#1C1917]">{megaThread.title}</strong>. Contributions must maintain rigorous textual fidelity, civil discourse, and source citations.
                            </p>
                            <div className="flex flex-wrap gap-1.5 pt-3 border-t border-[#EDE8DF]">
                                {megaThread.tags?.map((tag) => (
                                    <span
                                        key={tag}
                                        className="text-[11px] text-[#B85428] bg-[#B85428]/8 px-2 py-0.5 rounded-xs"
                                    >
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* CTA Box */}
                        <div className="bg-[#0F1C3F] p-6 text-center shadow-sm">
                            <Layers className="w-8 h-8 text-[#C8971A] mx-auto mb-2 opacity-80" />
                            <h4
                                className="text-white font-bold text-base mb-2"
                                style={{ fontFamily: "'Fraunces', serif" }}
                            >
                                Have a Thesis to Share?
                            </h4>
                            <p className="text-white/60 text-xs leading-relaxed mb-5">
                                Propose an in-depth topic under this MegaThread to invite peer review and debate.
                            </p>
                            <button
                                onClick={() => onNewDiscussion(megaThreadId)}
                                className="w-full bg-[#B85428] hover:bg-[#A04820] text-white py-2.5 text-xs font-semibold tracking-wide uppercase transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                            >
                                <Plus className="w-3.5 h-3.5" /> Start Discussion
                            </button>
                        </div>

                        {/* Other MegaThreads */}
                        {allMegaThreads.length > 0 && (
                            <div className="bg-white border border-[#EDE8DF] p-5 shadow-sm">
                                <h4 className="font-bold text-[#1C1917] text-xs uppercase tracking-widest mb-4">
                                    Other Categories
                                </h4>
                                <div className="space-y-3">
                                    {allMegaThreads.slice(0, 4).map((mt) => (
                                        <button
                                            key={mt.id}
                                            onClick={() => onViewMegaThread ? onViewMegaThread(mt.id) : onBack()}
                                            className="w-full text-left p-2.5 hover:bg-[#FAF6F0] border border-transparent hover:border-[#EDE8DF] transition-all group cursor-pointer block"
                                        >
                                            <div className="text-xs font-semibold text-[#1C1917] group-hover:text-[#B85428] transition-colors leading-snug line-clamp-1 mb-1">
                                                {mt.title}
                                            </div>
                                            <div className="text-[11px] text-[#9E8F85] flex items-center gap-3">
                                                <span>{mt.discussionCount} discussions</span>
                                                <span>•</span>
                                                <span>{mt.participantCount} scholars</span>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
