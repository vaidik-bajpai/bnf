'use client';

import { ArrowRight, MessageSquare, Users, Layers } from "lucide-react";
import type { MegaThread } from "@/types/forum";
import { forumCategories } from "@/data/forumData";

interface MegaThreadCardProps {
    megaThread: MegaThread;
    onClick: () => void;
    featured?: boolean;
    dark?: boolean;
}

export default function MegaThreadCard({
    megaThread,
    onClick,
    featured = false,
    dark = false,
}: MegaThreadCardProps) {
    const categoryObj = forumCategories.find((c) => c.id === megaThread.category);
    const categoryColor = categoryObj?.color || "#B85428";
    const categoryName = megaThread.categoryLabel || categoryObj?.name || "General";

    return (
        <div
            onClick={onClick}
            className={`group border cursor-pointer transition-all duration-300 flex flex-col justify-between p-6 shadow-sm hover:shadow-xl ${
                dark
                    ? `bg-[#0B1838]/85 hover:bg-[#0E204A] border-white/10 hover:border-[#E5A93C]/50 rounded-xl backdrop-blur-sm ${
                          featured ? "ring-1 ring-[#E5A93C]/40" : ""
                      }`
                    : `bg-white ${
                          featured
                              ? "border-[#B85428]/40 hover:border-[#B85428] relative overflow-hidden"
                              : "border-[#EDE8DF] hover:border-[#B85428]/50"
                      }`
            }`}
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
        >
            {featured && (
                <div className="absolute top-0 right-0 overflow-hidden rounded-tr-xl">
                    <span className="bg-[#B85428] text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 flex items-center gap-1 shadow-sm">
                        <Layers className="w-3 h-3" /> Featured Category
                    </span>
                </div>
            )}

            <div>
                <div className="flex items-center gap-2 mb-3">
                    <span
                        className="text-[11px] font-semibold tracking-wider uppercase px-2.5 py-0.5 rounded-full text-white shadow-xs"
                        style={{ backgroundColor: categoryColor }}
                    >
                        {categoryName}
                    </span>
                    <span className={`text-xs flex items-center gap-1 ml-auto ${dark ? "text-white/40" : "text-[#9E8F85]"}`}>
                        <Layers className="w-3 h-3 text-[#E5A93C]" /> Category
                    </span>
                </div>

                <h3
                    className={`font-bold text-lg sm:text-xl leading-snug mb-2.5 transition-colors ${
                        dark ? "text-white group-hover:text-[#E5A93C]" : "text-[#1C1917] group-hover:text-[#B85428]"
                    }`}
                    style={{ fontFamily: "'Fraunces', serif" }}
                >
                    {megaThread.title}
                </h3>

                <p
                    className={`text-sm leading-relaxed mb-5 line-clamp-2 ${dark ? "text-white/70" : "text-[#6B5B4E]"}`}
                    style={{ fontFamily: "'Spectral', Georgia, serif" }}
                >
                    {megaThread.description}
                </p>
            </div>

            <div className={`pt-4 border-t flex items-center justify-between text-xs ${dark ? "border-white/10 text-white/50" : "border-[#EDE8DF] text-[#9E8F85]"}`}>
                <div className="flex items-center gap-4">
                    <span className={`flex items-center gap-1 font-medium ${dark ? "text-white/80" : "text-[#3C3430]"}`}>
                        <MessageSquare className="w-3.5 h-3.5 text-[#E5A93C]" />
                        {megaThread.discussionCount} {megaThread.discussionCount === 1 ? "Discussion" : "Discussions"}
                    </span>
                    <span className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5" />
                        {megaThread.participantCount} Scholars
                    </span>
                </div>

                <span className="flex items-center gap-1 text-[#E5A93C] font-semibold group-hover:translate-x-1 transition-transform">
                    Explore <ArrowRight className="w-3.5 h-3.5" />
                </span>
            </div>
        </div>
    );
}
