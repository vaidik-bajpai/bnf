'use client';

import { useState, useEffect } from "react";
import { X, Loader2, Layers } from "lucide-react";
import { TricolorStripe } from "../Symbols";
import { forumCategories, getMegaThreads, addMockDiscussion } from "@/data/forumData";
import { createDiscussion } from "@/app/actions/forum";
import { useAuth } from "@/context/AuthContext";

interface NewDiscussionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCreated?: (newDiscussionId?: string) => void;
    defaultMegaThreadId?: string;
}

export default function NewDiscussionModal({
    isOpen,
    onClose,
    onCreated,
    defaultMegaThreadId,
}: NewDiscussionModalProps) {
    const { user } = useAuth();
    const megaThreads = getMegaThreads();

    const initialMt = defaultMegaThreadId || (megaThreads[0]?.id ?? "");
    const [megaThreadId, setMegaThreadId] = useState(initialMt);
    const [title, setTitle] = useState("");
    const [category, setCategory] = useState(() => {
        const mt = megaThreads.find((m) => m.id === initialMt);
        return mt?.category || "";
    });
    const [body, setBody] = useState("");
    const [tagsInput, setTagsInput] = useState("");

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    // Sync defaultMegaThreadId if passed or changes
    useEffect(() => {
        let active = true;
        Promise.resolve().then(() => {
            if (!active) return;
            if (defaultMegaThreadId) {
                setMegaThreadId(defaultMegaThreadId);
                const mt = megaThreads.find((m) => m.id === defaultMegaThreadId);
                if (mt) {
                    setCategory(mt.category);
                }
            }
        });
        return () => {
            active = false;
        };
    }, [defaultMegaThreadId, megaThreads]);

    // When user changes MegaThread, optionally sync category
    const handleMegaThreadChange = (id: string) => {
        setMegaThreadId(id);
        const mt = megaThreads.find((m) => m.id === id);
        if (mt) {
            setCategory(mt.category);
        }
    };

    if (!isOpen) return null;

    const selectedMegaThread = megaThreads.find((m) => m.id === megaThreadId);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg(null);

        if (!megaThreadId) {
            setErrorMsg("Please select an anchoring MegaThread.");
            return;
        }

        if (!title.trim() || !body.trim()) {
            setErrorMsg("Please provide both a discussion title and substantive content.");
            return;
        }

        setIsSubmitting(true);

        try {
            const parsedTags = tagsInput
                .split(",")
                .map((t) => t.trim().toLowerCase())
                .filter(Boolean);

            const authorData = user
                ? {
                      name: user.name || "Member",
                      username: user.username || user.name?.toLowerCase().replace(/\s+/g, "_") || "scholar",
                      initials: user.initials || "ME",
                      bg: user.bg || "#B85428",
                  }
                : {
                      name: "Guest Scholar",
                      username: "scholar",
                      initials: "GS",
                      bg: "#2D6A4F",
                  };

            // Add to mock repository
            const newDiscussion = addMockDiscussion({
                title: title.trim(),
                body: body.trim(),
                megaThreadId,
                categoryId: category || selectedMegaThread?.category || "history",
                tags: parsedTags,
                author: authorData,
            });

            // If database action is available, try it gracefully
            let finalDiscussionId = newDiscussion.id;
            try {
                const dbDisc = await createDiscussion({
                    title: title.trim(),
                    body: body.trim(),
                    megaThreadId,
                    categoryId: category || selectedMegaThread?.category || "history",
                    tags: parsedTags,
                    authorId: user?.id,
                });
                if (dbDisc && "id" in dbDisc && dbDisc.id) {
                    finalDiscussionId = dbDisc.id;
                }
            } catch {
                // Expected in mock mode if DATABASE_URL is not set
            }

            setTitle("");
            setBody("");
            setTagsInput("");

            if (onCreated) onCreated(finalDiscussionId);
            onClose();
        } catch (err) {
            console.error("Failed to publish discussion:", err);
            setErrorMsg("Failed to publish discussion. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <div
                className="bg-white w-full max-w-2xl shadow-2xl overflow-hidden"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
                <div className="bg-[#0F1C3F] px-7 py-5 flex items-center justify-between">
                    <div>
                        <div className="text-white font-semibold text-lg tracking-tight flex items-center gap-2">
                            <Layers className="w-5 h-5 text-[#C8971A]" />
                            <span>Start a Discussion</span>
                        </div>
                        <div className="text-white/50 text-xs mt-0.5">
                            Posting as <span className="text-[#C8971A]">@{user?.username || user?.name || "guest_scholar"}</span>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        disabled={isSubmitting}
                        className="text-white/60 hover:text-white transition-colors p-1 cursor-pointer disabled:opacity-50"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <TricolorStripe />

                <form onSubmit={handleSubmit} className="p-7 space-y-4 max-h-[80vh] overflow-y-auto">
                    {errorMsg && (
                        <div className="bg-red-50 text-red-700 text-xs px-4 py-2.5 border border-red-200">
                            {errorMsg}
                        </div>
                    )}

                    {/* MegaThread Selection */}
                    <div>
                        <label className="block text-xs font-semibold text-[#6B5B4E] uppercase tracking-widest mb-1.5 flex items-center justify-between">
                            <span>MegaThread *</span>
                            {defaultMegaThreadId && (
                                <span className="text-[10px] text-[#B85428] font-normal normal-case">
                                    Pre-selected from context
                                </span>
                            )}
                        </label>
                        {defaultMegaThreadId && selectedMegaThread ? (
                            <div className="border border-[#EDE8DF] bg-[#FAFAF7] px-3.5 py-2.5 text-sm text-[#1C1917] flex items-center justify-between">
                                <span className="font-semibold flex items-center gap-2">
                                    <Layers className="w-4 h-4 text-[#B85428]" />
                                    {selectedMegaThread.title}
                                </span>
                                <span className="text-xs text-[#9E8F85]">
                                    {selectedMegaThread.categoryLabel}
                                </span>
                            </div>
                        ) : (
                            <select
                                required
                                value={megaThreadId}
                                onChange={(e) => handleMegaThreadChange(e.target.value)}
                                className="w-full border border-[#EDE8DF] px-3.5 py-2.5 text-[#1C1917] focus:outline-none focus:border-[#B85428] text-sm bg-white"
                            >
                                <option value="">Select a MegaThread</option>
                                {megaThreads.map((m) => (
                                    <option key={m.id} value={m.id}>
                                        {m.title} ({m.categoryLabel || m.category})
                                    </option>
                                ))}
                            </select>
                        )}
                    </div>

                    {/* Category Selection */}
                    <div>
                        <label className="block text-xs font-semibold text-[#6B5B4E] uppercase tracking-widest mb-1.5">
                            Category *
                        </label>
                        <select
                            required
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full border border-[#EDE8DF] px-3.5 py-2.5 text-[#1C1917] focus:outline-none focus:border-[#B85428] text-sm bg-white"
                        >
                            <option value="">Select a category</option>
                            {forumCategories.map((c) => (
                                <option key={c.id} value={c.id}>
                                    {c.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Discussion Title */}
                    <div>
                        <label className="block text-xs font-semibold text-[#6B5B4E] uppercase tracking-widest mb-1.5">
                            Discussion Title *
                        </label>
                        <input
                            type="text"
                            required
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="A clear, evocative civilizational topic or question..."
                            className="w-full border border-[#EDE8DF] px-3.5 py-2.5 text-[#1C1917] placeholder-[#9E8F85] focus:outline-none focus:border-[#B85428] text-sm"
                        />
                    </div>

                    {/* Content */}
                    <div>
                        <label className="block text-xs font-semibold text-[#6B5B4E] uppercase tracking-widest mb-1.5">
                            Discussion Content *
                        </label>
                        <textarea
                            required
                            rows={5}
                            value={body}
                            onChange={(e) => setBody(e.target.value)}
                            placeholder="Introduce the question or thesis, cite classical context, and invite perspectives..."
                            className="w-full border border-[#EDE8DF] px-3.5 py-2.5 text-[#1C1917] placeholder-[#9E8F85] focus:outline-none focus:border-[#B85428] text-sm resize-none leading-relaxed"
                            style={{ fontFamily: "'Spectral', Georgia, serif" }}
                        />
                    </div>

                    {/* Tags */}
                    <div>
                        <label className="block text-xs font-semibold text-[#6B5B4E] uppercase tracking-widest mb-1.5">
                            Tags (comma-separated, optional)
                        </label>
                        <input
                            type="text"
                            value={tagsInput}
                            onChange={(e) => setTagsInput(e.target.value)}
                            placeholder="e.g. epics, sanskrit, astronomy, architecture, chanakya"
                            className="w-full border border-[#EDE8DF] px-3.5 py-2.5 text-[#1C1917] placeholder-[#9E8F85] focus:outline-none focus:border-[#B85428] text-sm"
                        />
                    </div>

                    <div className="flex gap-3 pt-3">
                        <button
                            type="button"
                            disabled={isSubmitting}
                            onClick={onClose}
                            className="flex-1 py-3 border border-[#EDE8DF] text-[#6B5B4E] hover:border-[#B85428] text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1 py-3 bg-[#B85428] hover:bg-[#A04820] text-white text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 shadow-sm"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    <span>Publishing...</span>
                                </>
                            ) : (
                                "Publish Discussion"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}