'use client';

import React from "react";
import {
    X,
    BookOpen,
    Compass,
    ThumbsUp,
    MessageSquare,
    Share2,
    Quote,
    Bookmark,
    Star,
    Heart,
    Tag,
    ArrowBigUp,
    ArrowBigDown,
    MoreVertical,
    ChevronLeft,
    ChevronRight,
    Search,
    UserCheck,
    Layers,
    Video,
    Film,
    FileText,
    HelpCircle,
    CheckCircle2,
    Lightbulb,
} from "lucide-react";
import { AshokaCakra, TricolorStripe } from "../Symbols";

interface HowToUseModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function HowToUseModal({ isOpen, onClose }: HowToUseModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
            <div
                className="bg-[#0B1528] text-white border border-[#C8971A]/40 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
                {/* Header */}
                <div className="bg-[#070D1A] px-6 py-4 border-b border-[#C8971A]/30 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-[#C8971A]/20 border border-[#C8971A]/40 flex items-center justify-center text-[#E5A93C]">
                            <BookOpen className="w-5 h-5" />
                        </div>
                        <div>
                            <h2
                                className="text-lg sm:text-xl font-bold text-white tracking-wide flex items-center gap-2"
                                style={{ fontFamily: "'Fraunces', serif" }}
                            >
                                How to Operate or Use Bharat-Ganrajya Forum
                            </h2>
                            <p className="text-xs text-white/60">
                                Complete manual and visual architectural guide for scholars & citizens
                            </p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="p-1.5 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                        title="Close manual"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <TricolorStripe />

                {/* Body Content */}
                <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-8 text-sm leading-relaxed text-white/80">
                    {/* Section 1: Navigation Architecture */}
                    <div className="bg-white/5 border border-white/10 rounded-lg p-5">
                        <div className="flex items-center gap-2 text-[#E5A93C] font-bold text-base mb-3">
                            <Compass className="w-5 h-5" />
                            <span>1. Top Navigation Bar & History Controls</span>
                        </div>
                        <ul className="space-y-2 text-xs sm:text-sm text-white/80 list-disc list-inside">
                            <li>
                                <strong className="text-white">Top Left Three-Dot Menu (⋮):</strong> Opens the navigation panel containing <em>Profile, Activity Management, Favorites, Starred, Bookmarks</em>, and a direct link to <em>How to operate or use forum</em>.
                            </li>
                            <li>
                                <strong className="text-white">Back (&lt;) and Forward (&gt;) Buttons:</strong> Positioned right beside the three-dot menu on every page, allowing instant navigation across recently visited threads and views.
                            </li>
                            <li>
                                <strong className="text-white">Center:</strong> Displays the official forum title: <span className="font-bold text-[#E5A93C]">BHARAT-GANRAJYA FORUMS</span>.
                            </li>
                            <li>
                                <strong className="text-white">Top Right (Sign In vs Authenticated Menus):</strong>
                                <ul className="list-disc list-inside ml-5 mt-1 text-white/70">
                                    <li>When logged out: Presents <span className="text-white font-medium">Sign Up</span> and <span className="text-white font-medium">Log In</span> buttons.</li>
                                    <li>After logging in: Replaced by two dedicated menus: <span className="text-[#38BDF8] font-bold">Search</span> and <span className="text-[#E5A93C] font-bold">Profile</span>.</li>
                                </ul>
                            </li>
                        </ul>
                    </div>

                    {/* Section 2: Mega Categories & Content Gallery */}
                    <div className="bg-white/5 border border-white/10 rounded-lg p-5">
                        <div className="flex items-center gap-2 text-[#38BDF8] font-bold text-base mb-3">
                            <Layers className="w-5 h-5" />
                            <span>2. Mega Categories & Content Gallery</span>
                        </div>
                        <p className="text-xs sm:text-sm text-white/80 mb-3">
                            The forum body organizes discourse into high-level <strong>Mega Categories</strong>, prominently featuring the <strong>Content Gallery</strong>:
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div className="bg-[#0F1C3F] border border-[#38BDF8]/30 rounded-lg p-3">
                                <div className="flex items-center gap-2 text-[#38BDF8] font-semibold text-xs mb-1">
                                    <Video className="w-4 h-4" />
                                    <span>Videos</span>
                                </div>
                                <p className="text-[11px] text-white/70">
                                    Visual lectures, documentaries, and archival footage with dedicated discussion threads.
                                </p>
                            </div>
                            <div className="bg-[#0F1C3F] border border-[#A78BFA]/30 rounded-lg p-3">
                                <div className="flex items-center gap-2 text-[#A78BFA] font-semibold text-xs mb-1">
                                    <Film className="w-4 h-4" />
                                    <span>Vlogs</span>
                                </div>
                                <p className="text-[11px] text-white/70">
                                    Field dispatches, cultural diaries, and grassroots research journals.
                                </p>
                            </div>
                            <div className="bg-[#0F1C3F] border border-[#34D399]/30 rounded-lg p-3">
                                <div className="flex items-center gap-2 text-[#34D399] font-semibold text-xs mb-1">
                                    <FileText className="w-4 h-4" />
                                    <span>Community Posts</span>
                                </div>
                                <p className="text-[11px] text-white/70">
                                    Member-submitted articles, inquiries, photo journals, and open debates.
                                </p>
                            </div>
                        </div>
                        <p className="text-xs text-white/60 mt-3">
                            Inside each category, multiple threads related to that domain are listed with activity statistics and tags.
                        </p>
                    </div>

                    {/* Section 3: Different Forum Types ("Diff types") */}
                    <div className="bg-white/5 border border-white/10 rounded-lg p-5">
                        <div className="flex items-center gap-2 text-[#E5A93C] font-bold text-base mb-3">
                            <Lightbulb className="w-5 h-5 text-[#E5A93C]" />
                            <span>3. Different Forum Types (&ldquo;Diff types&rdquo;)</span>
                        </div>
                        <div className="space-y-4 text-xs sm:text-sm">
                            {/* Suggestion Forum */}
                            <div className="bg-[#0F1C3F] border border-[#E5A93C]/40 rounded-lg p-4">
                                <div className="flex items-center gap-2 font-bold text-white mb-2">
                                    <span className="px-2 py-0.5 rounded-xs bg-[#E5A93C]/20 text-[#E5A93C] border border-[#E5A93C]/40 text-xs uppercase">
                                        Suggestion Forum
                                    </span>
                                </div>
                                <p className="text-white/80 leading-relaxed">
                                    In a <strong>Suggestion Forum</strong>, proposals and ideas are voted upon directly at the root. Therefore:
                                </p>
                                <div className="mt-2 flex items-center gap-2 text-xs text-[#E5A93C] font-semibold bg-black/30 p-2 rounded-xs border border-[#E5A93C]/20">
                                    <div className="flex items-center gap-1 bg-white/10 px-2 py-0.5 rounded-xs">
                                        <ArrowBigUp className="w-4 h-4" />
                                        <span>Upvote</span>
                                        <span className="mx-1">/</span>
                                        <ArrowBigDown className="w-4 h-4" />
                                        <span>Downvote</span>
                                    </div>
                                    <span>Two voting buttons appear <u>ONLY on the first post (Original Post)</u>.</span>
                                </div>
                            </div>

                            {/* Question Forum */}
                            <div className="bg-[#0F1C3F] border border-blue-400/40 rounded-lg p-4">
                                <div className="flex items-center gap-2 font-bold text-white mb-2">
                                    <span className="px-2 py-0.5 rounded-xs bg-blue-500/20 text-blue-300 border border-blue-400/40 text-xs uppercase">
                                        Question Forum
                                    </span>
                                </div>
                                <p className="text-white/80 leading-relaxed">
                                    In a <strong>Question Forum</strong>, scholars ask inquiries, and answers from the community are ranked by credibility. Therefore:
                                </p>
                                <div className="mt-2 flex items-center gap-2 text-xs text-blue-300 font-semibold bg-black/30 p-2 rounded-xs border border-blue-400/20">
                                    <div className="flex items-center gap-1 bg-white/10 px-2 py-0.5 rounded-xs">
                                        <ArrowBigUp className="w-4 h-4" />
                                        <span>Upvote</span>
                                        <span className="mx-1">/</span>
                                        <ArrowBigDown className="w-4 h-4" />
                                        <span>Downvote</span>
                                    </div>
                                    <span>Two voting buttons appear <u>on EVERY post EXCEPT the first</u> (i.e. on answers).</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Section 4: Post Actions & Comment Bookmarks */}
                    <div className="bg-white/5 border border-white/10 rounded-lg p-5">
                        <div className="flex items-center gap-2 text-emerald-400 font-bold text-base mb-3">
                            <CheckCircle2 className="w-5 h-5" />
                            <span>4. Post Actions: Like, Reply, Share, Quote & Comment Bookmarks</span>
                        </div>
                        <p className="text-xs sm:text-sm text-white/80 mb-3">
                            <strong>Every post</strong>, including the first post, provides four essential engagement actions:
                        </p>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs mb-4">
                            <div className="flex items-center gap-2 p-2 rounded-xs bg-white/5 border border-white/10">
                                <ThumbsUp className="w-4 h-4 text-[#B85428]" />
                                <div>
                                    <strong className="text-white block">Like</strong>
                                    <span className="text-white/50 text-[10px]">Endorse thought</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 p-2 rounded-xs bg-white/5 border border-white/10">
                                <MessageSquare className="w-4 h-4 text-[#38BDF8]" />
                                <div>
                                    <strong className="text-white block">Reply</strong>
                                    <span className="text-white/50 text-[10px]">Contribute dialogue</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 p-2 rounded-xs bg-white/5 border border-white/10">
                                <Share2 className="w-4 h-4 text-emerald-400" />
                                <div>
                                    <strong className="text-white block">Share</strong>
                                    <span className="text-white/50 text-[10px]">Spread link</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 p-2 rounded-xs bg-white/5 border border-white/10">
                                <Quote className="w-4 h-4 text-[#E5A93C]" />
                                <div>
                                    <strong className="text-white block">Quote</strong>
                                    <span className="text-white/50 text-[10px]">Cite in reply</span>
                                </div>
                            </div>
                        </div>
                        <div className="p-3 bg-[#C8971A]/10 border border-[#C8971A]/30 rounded-xs text-xs text-[#E5A93C]">
                            <strong>Bookmark Individual Comments:</strong> Users can click the <Bookmark className="w-3.5 h-3.5 inline mx-1" /> icon on any comment to save it directly into their personal bookmarks library for fast retrieval.
                        </div>
                    </div>

                    {/* Section 5: Star & Favorite Categories + Adding Multiple Tags */}
                    <div className="bg-white/5 border border-white/10 rounded-lg p-5">
                        <div className="flex items-center gap-2 text-[#A78BFA] font-bold text-base mb-3">
                            <Star className="w-5 h-5 text-[#E5A93C]" />
                            <span>5. Starring, Favoriting Categories & Adding Multiple Tags</span>
                        </div>
                        <ul className="space-y-2 text-xs sm:text-sm text-white/80 list-disc list-inside">
                            <li>
                                <strong className="text-white">Star a Category (<Star className="w-3.5 h-3.5 inline text-[#E5A93C]" />):</strong> Mark important categories as Starred to feature them in your quick access sidebar and profile.
                            </li>
                            <li>
                                <strong className="text-white">Favorite a Category (<Heart className="w-3.5 h-3.5 inline text-rose-400" />):</strong> Add your most loved categories to your Favorites list.
                            </li>
                            <li>
                                <strong className="text-white">Multiple Tags for Search:</strong> Users can attach multiple tags (e.g. <code>#vedas</code>, <code>#isro</code>, <code>#ayurveda</code>, <code>#maratha</code>) to categories or threads to improve discoverability and enable laser-sharp search results.
                            </li>
                        </ul>
                    </div>

                    {/* Section 6: Bottom Bar Specifications */}
                    <div className="bg-white/5 border border-white/10 rounded-lg p-5">
                        <div className="flex items-center gap-2 text-white font-bold text-base mb-3">
                            <AshokaCakra className="w-5 h-5 text-[#E5A93C]" />
                            <span>6. Page Bottom Bar & Hyperlink</span>
                        </div>
                        <p className="text-xs sm:text-sm text-white/80">
                            At the bottom of every forum view, the persistent bottom bar displays the active <strong>Page Specifics</strong> (current Mega Category, active category, active filters and total counts), full <strong>Page Numbers with pagination</strong>, and the permanent hyperlink to reopen this comprehensive user manual anytime.
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className="bg-[#070D1A] px-6 py-4 border-t border-white/10 flex items-center justify-end">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-5 py-2 rounded-lg bg-[#C8971A] hover:bg-[#D97706] text-slate-950 font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
                    >
                        Got it, Return to Forum
                    </button>
                </div>
            </div>
        </div>
    );
}
