import { ArrowRight, Plus, MessageSquare, Eye } from "lucide-react";
import { discussions, forumCategories } from "@/data/forumData";

interface ForumPreviewSectionProps {
    onViewForum: () => void;
    onViewThread: (id: string) => void;
    onNewDiscussion: () => void;
}

export default function ForumPreviewSection({
    onViewForum,
    onViewThread,
    onNewDiscussion,
}: ForumPreviewSectionProps) {
    return (
        <section className="py-24 bg-[#FAFAF7]">
            <div className="max-w-6xl mx-auto px-6">
                <div className="grid lg:grid-cols-2 gap-14 items-center">
                    <div>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="h-px w-12 bg-[#B85428]/30" />
                            <span className="text-[#B85428] text-xs font-semibold tracking-[0.35em] uppercase">Community Forum</span>
                        </div>
                        <h2
                            className="text-[#0F1C3F] font-bold mb-5"
                            style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)" }}
                        >
                            Join the Conversation
                        </h2>
                        <p className="text-[#6B5B4E] text-lg leading-relaxed mb-8" style={{ fontFamily: "'Spectral', serif" }}>
                            A growing community of students, researchers, teachers, and curious minds exchanging ideas on India&apos;s history, philosophy, arts, science, and civilizational future. Rigorous, respectful, and open to all.
                        </p>
                        <div className="grid grid-cols-2 gap-4 mb-8">
                            {[
                                { label: "Active Discussions", value: "4,812" },
                                { label: "Community Members", value: "28,400" },
                                { label: "Categories", value: "8" },
                                { label: "Contributions Daily", value: "340+" },
                            ].map((s) => (
                                <div key={s.label} className="bg-[#EDE8DF] p-4">
                                    <div className="text-[#B85428] text-2xl font-bold" style={{ fontFamily: "'Fraunces', serif" }}>
                                        {s.value}
                                    </div>
                                    <div className="text-[#6B5B4E] text-xs mt-1">{s.label}</div>
                                </div>
                            ))}
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={onViewForum}
                                className="flex items-center gap-2 bg-[#B85428] hover:bg-[#A04820] text-white px-7 py-3.5 text-sm font-semibold tracking-wide transition-colors cursor-pointer"
                            >
                                Browse Discussions <ArrowRight className="w-4 h-4" />
                            </button>
                            <button
                                onClick={onNewDiscussion}
                                className="flex items-center gap-2 border border-[#B85428]/30 hover:border-[#B85428] text-[#B85428] px-7 py-3.5 text-sm font-semibold tracking-wide transition-colors cursor-pointer"
                            >
                                <Plus className="w-4 h-4" /> Start a Discussion
                            </button>
                        </div>
                    </div>

                    <div className="space-y-3">
                        {discussions.slice(0, 4).map((d) => (
                            <div
                                key={d.id}
                                onClick={() => onViewThread(d.id)}
                                className="bg-white border border-[#EDE8DF] p-4 cursor-pointer hover:border-[#B85428]/40 hover:shadow-md transition-all group"
                            >
                                <div className="flex gap-3">
                                    <div
                                        className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
                                        style={{ backgroundColor: d.author.bg }}
                                    >
                                        {d.author.initials}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p
                                            className="text-[#1C1917] text-sm font-semibold leading-snug mb-1.5 group-hover:text-[#B85428] transition-colors line-clamp-2"
                                            style={{ fontFamily: "'Spectral', serif" }}
                                        >
                                            {d.title}
                                        </p>
                                        <div className="flex items-center gap-3 text-xs text-[#9E8F85]">
                                            <span className="font-medium" style={{ color: forumCategories.find((c) => c.id === d.category)?.color }}>
                                                {d.categoryLabel}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <MessageSquare className="w-3.5 h-3.5" /> {d.replies}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Eye className="w-3.5 h-3.5" /> {d.views.toLocaleString()}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                        <button
                            onClick={onViewForum}
                            className="w-full py-3 border border-[#EDE8DF] text-[#6B5B4E] hover:text-[#B85428] hover:border-[#B85428] text-sm font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer"
                        >
                            View All Discussions <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}