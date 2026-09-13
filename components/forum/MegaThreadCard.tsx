'use client';

import { ArrowRight, MessageSquare, Users, Layers } from "lucide-react";
import type { MegaThread } from "@/types/forum";
import { forumCategories } from "@/data/forumData";

interface MegaThreadCardProps {
    megaThread: MegaThread;
    onClick: () => void;
    featured?: boolean;
}

export default function MegaThreadCard({
    megaThread,
    onClick,
    featured = false,
}: MegaThreadCardProps) {
    const categoryObj = forumCategories.find((c) => c.id === megaThread.category);
    const categoryColor = categoryObj?.color || "#B85428";
    const categoryName = categoryObj?.name || megaThread.categoryLabel || "General";

    return (
        <div
            onClick={onClick}
            className={`group bg-white border cursor-pointer transition-all duration-300 flex flex-col justify-between p-6 shadow-sm hover:shadow-md ${featured
                ? "border-[#B85428]/40 hover:border-[#B85428] relative overflow-hidden"
                : "border-[#EDE8DF] hover:border-[#B85428]/50"
                }`}
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
        >
            {featured && (
                <div className="absolute top-0 right-0">
                    <span className="bg-[#B85428] text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 flex items-center gap-1 shadow-sm">
                        <Layers className="w-3 h-3" /> Featured Category
                    </span>
                </div>
            )}

            <div>
                <div className="flex items-center gap-2 mb-3">
                    <span
                        className="text-[11px] font-semibold tracking-wider uppercase px-2.5 py-0.5 rounded-full text-white"
                        style={{ backgroundColor: categoryColor }}
                    >
                        {categoryName}
                    </span>
                    <span className="text-xs text-[#9E8F85] flex items-center gap-1 ml-auto">
                        <Layers className="w-3 h-3 text-[#B85428]" /> Category
                    </span>
                </div>

                <h3
                    className="font-bold text-[#1C1917] text-lg sm:text-xl leading-snug mb-2.5 group-hover:text-[#B85428] transition-colors"
                    style={{ fontFamily: "'Fraunces', serif" }}
                >
                    {megaThread.title}
                </h3>

                <p
                    className="text-[#6B5B4E] text-sm leading-relaxed mb-5 line-clamp-2"
                    style={{ fontFamily: "'Spectral', Georgia, serif" }}
                >
                    {megaThread.description}
                </p>
            </div>

            <div className="pt-4 border-t border-[#EDE8DF] flex items-center justify-between text-xs text-[#9E8F85]">
                <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1 font-medium text-[#3C3430]">
                        <MessageSquare className="w-3.5 h-3.5 text-[#B85428]" />
                        {megaThread.discussionCount} {megaThread.discussionCount === 1 ? "Discussion" : "Discussions"}
                    </span>
                    <span className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5" />
                        {megaThread.participantCount} Scholars
                    </span>
                </div>

                <span className="flex items-center gap-1 text-[#B85428] font-semibold group-hover:translate-x-1 transition-transform">
                    Explore <ArrowRight className="w-3.5 h-3.5" />
                </span>
            </div>
        </div>
    );
}
