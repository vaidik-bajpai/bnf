'use client';

import React from "react";
import { BookOpen, ChevronLeft, ChevronRight, HelpCircle, Layers, Tag, Filter } from "lucide-react";

interface ForumBottomBarProps {
    megaCategoryTitle?: string;
    categoryTitle?: string;
    typeFilter?: string;
    tagFilter?: string;
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage?: number;
    onPageChange: (newPage: number) => void;
    onOpenHowToUse: () => void;
}

export default function ForumBottomBar({
    megaCategoryTitle = "Content Gallery",
    categoryTitle,
    typeFilter,
    tagFilter,
    currentPage = 1,
    totalPages = 1,
    totalItems = 0,
    itemsPerPage = 10,
    onPageChange,
    onOpenHowToUse,
}: ForumBottomBarProps) {
    const startItem = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);

    return (
        <div
            className="w-full bg-[#081126] border-t border-[#C8971A]/25 text-white/80 py-4 px-6 select-none"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
        >
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                {/* 1. Page Specifics */}
                <div className="flex flex-wrap items-center gap-2.5 text-xs">
                    <span className="font-semibold text-white/50 uppercase tracking-wider text-[10px]">
                        Page Specifics:
                    </span>

                    {/* Mega Category Specific */}
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white/5 rounded-xs border border-white/10 text-[#C8971A]">
                        <Layers className="w-3.5 h-3.5" />
                        <strong className="text-white font-medium">{megaCategoryTitle}</strong>
                    </span>

                    {/* Category Specific */}
                    {categoryTitle && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-white/5 rounded-xs border border-white/10 text-white/90">
                            <span>Category:</span>
                            <strong className="text-emerald-400 font-semibold">{categoryTitle}</strong>
                        </span>
                    )}

                    {/* Type Filter */}
                    {typeFilter && typeFilter !== "all" && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#C8971A]/10 rounded-xs border border-[#C8971A]/30 text-[#E5A93C]">
                            <Filter className="w-3 h-3" />
                            <span className="capitalize">{typeFilter} Forum</span>
                        </span>
                    )}

                    {/* Tag Filter */}
                    {tagFilter && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-500/10 rounded-xs border border-blue-400/30 text-blue-300">
                            <Tag className="w-3 h-3" />
                            <span>#{tagFilter}</span>
                        </span>
                    )}

                    {/* Items Count Range */}
                    <span className="text-white/60 ml-1">
                        Showing <strong className="text-white font-medium">{startItem}–{endItem}</strong> of{" "}
                        <strong className="text-white font-medium">{totalItems}</strong> threads
                    </span>
                </div>

                {/* 2. Pagination Numbers & Controls */}
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                        disabled={currentPage <= 1}
                        className="px-2.5 py-1 text-xs rounded-xs border border-white/10 bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none transition-colors flex items-center gap-1 cursor-pointer text-white"
                        title="Previous Page"
                    >
                        <ChevronLeft className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Prev</span>
                    </button>

                    <div className="flex items-center gap-1 text-xs">
                        {Array.from({ length: Math.min(totalPages, 5) }).map((_, idx) => {
                            const pageNum = idx + 1;
                            const isActive = pageNum === currentPage;
                            return (
                                <button
                                    key={pageNum}
                                    type="button"
                                    onClick={() => onPageChange(pageNum)}
                                    className={`w-7 h-7 text-xs rounded-xs flex items-center justify-center font-medium transition-colors cursor-pointer ${
                                        isActive
                                            ? "bg-[#C8971A] text-[#0F1C3F] font-bold shadow-xs"
                                            : "bg-white/5 text-white/80 hover:bg-white/15 border border-white/5"
                                    }`}
                                >
                                    {pageNum}
                                </button>
                            );
                        })}
                        {totalPages > 5 && (
                            <span className="text-white/40 px-1">... {totalPages}</span>
                        )}
                    </div>

                    <button
                        type="button"
                        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage >= totalPages}
                        className="px-2.5 py-1 text-xs rounded-xs border border-white/10 bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none transition-colors flex items-center gap-1 cursor-pointer text-white"
                        title="Next Page"
                    >
                        <span className="hidden sm:inline">Next</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                </div>

                {/* 3. Additional Hyperlink to 'How to operate or use forum' */}
                <div>
                    <button
                        type="button"
                        onClick={onOpenHowToUse}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#C8971A]/15 hover:bg-[#C8971A]/25 border border-[#C8971A]/40 text-[#E5A93C] hover:text-[#F3C053] text-xs font-semibold tracking-wide transition-all cursor-pointer shadow-xs group"
                    >
                        <HelpCircle className="w-3.5 h-3.5 text-[#C8971A] group-hover:scale-110 transition-transform" />
                        <span>How to operate or use forum</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
