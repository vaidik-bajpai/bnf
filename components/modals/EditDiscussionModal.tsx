'use client';

import { useState } from "react";
import { X, Loader2, Edit3 } from "lucide-react";
import { TricolorStripe } from "../Symbols";
import { forumCategories } from "@/data/forumData";
import { updateDiscussion } from "@/app/actions/forum";
import { useAuth } from "@/context/AuthContext";
import type { Discussion } from "@/types/forum";

interface EditDiscussionModalProps {
    isOpen: boolean;
    onClose: () => void;
    discussion: Discussion;
    onUpdated: (updated: Discussion) => void;
}

export default function EditDiscussionModal({
    isOpen,
    onClose,
    discussion,
    onUpdated,
}: EditDiscussionModalProps) {
    const { user } = useAuth();
    const [title, setTitle] = useState(discussion.title);
    const [category, setCategory] = useState(discussion.category || "history");
    const [body, setBody] = useState(discussion.body || discussion.excerpt || "");
    const [tagsInput, setTagsInput] = useState((discussion.tags || []).join(", "));
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const [prevDiscussion, setPrevDiscussion] = useState(discussion);
    if (discussion !== prevDiscussion) {
        setPrevDiscussion(discussion);
        setTitle(discussion.title);
        setCategory(discussion.category || "history");
        setBody(discussion.body || discussion.excerpt || "");
        setTagsInput((discussion.tags || []).join(", "));
        setErrorMsg(null);
    }

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg(null);

        if (!title.trim() || !body.trim()) {
            setErrorMsg("Please provide both a discussion title and substantive content.");
            return;
        }

        setIsSubmitting(true);

        const tags = tagsInput
            .split(",")
            .map((t) => t.trim().toLowerCase().replace(/[^a-z0-9-]/g, ""))
            .filter(Boolean);

        try {
            const updated = await updateDiscussion(
                discussion.id,
                {
                    title: title.trim(),
                    body: body.trim(),
                    categoryId: category,
                    tags,
                },
                user?.id
            );

            if (updated) {
                const catObj = forumCategories.find((c) => c.id === category);
                onUpdated({
                    ...discussion,
                    title: title.trim(),
                    body: body.trim(),
                    excerpt: body.length > 160 ? body.slice(0, 160) + "..." : body,
                    category,
                    categoryLabel: catObj?.name || discussion.categoryLabel,
                    categoryColor: catObj?.color || discussion.categoryColor,
                    tags,
                    updatedAt: new Date().toISOString(),
                });
                onClose();
            }
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : "Failed to update discussion. Please try again.";
            setErrorMsg(msg);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <div className="bg-[#FAF8F5] border border-[#D4A373]/30 rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                <TricolorStripe />

                {/* Header */}
                <div className="px-6 py-5 border-b border-[#E8E0D4] flex items-center justify-between bg-white">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-[#B85428]/10 text-[#B85428] flex items-center justify-center">
                            <Edit3 className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg text-[#0F1C3F]" style={{ fontFamily: "'Fraunces', serif" }}>
                                Edit Discussion
                            </h3>
                            <p className="text-xs text-[#6B5B4E]">
                                Refine your civilizational inquiry, thesis, or category
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-[#6B5B4E] hover:text-[#0F1C3F] p-1.5 transition-colors cursor-pointer"
                        title="Close"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Form Body */}
                <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1">
                    {errorMsg && (
                        <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-sm">
                            {errorMsg}
                        </div>
                    )}

                    {/* Title */}
                    <div>
                        <label className="block text-xs font-semibold text-[#0F1C3F] uppercase tracking-wider mb-1.5">
                            Discussion Title
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full px-3.5 py-2.5 bg-white border border-[#D4A373]/40 rounded-sm text-sm text-[#0F1C3F] placeholder:text-[#9E8F85] focus:outline-none focus:border-[#B85428] focus:ring-1 focus:ring-[#B85428]"
                            required
                        />
                    </div>

                    {/* Category Selector */}
                    <div>
                        <label className="block text-xs font-semibold text-[#0F1C3F] uppercase tracking-wider mb-1.5">
                            Category
                        </label>
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full px-3.5 py-2.5 bg-white border border-[#D4A373]/40 rounded-sm text-sm text-[#0F1C3F] focus:outline-none focus:border-[#B85428] focus:ring-1 focus:ring-[#B85428] cursor-pointer"
                        >
                            {forumCategories.map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Substantive Body / Thesis */}
                    <div>
                        <label className="block text-xs font-semibold text-[#0F1C3F] uppercase tracking-wider mb-1.5">
                            Thesis & Background
                        </label>
                        <textarea
                            value={body}
                            onChange={(e) => setBody(e.target.value)}
                            rows={6}
                            className="w-full px-3.5 py-2.5 bg-white border border-[#D4A373]/40 rounded-sm text-sm text-[#0F1C3F] placeholder:text-[#9E8F85] focus:outline-none focus:border-[#B85428] focus:ring-1 focus:ring-[#B85428] leading-relaxed"
                            style={{ fontFamily: "'Spectral', serif" }}
                            required
                        />
                    </div>

                    {/* Tags */}
                    <div>
                        <label className="block text-xs font-semibold text-[#0F1C3F] uppercase tracking-wider mb-1.5">
                            Tags (comma-separated)
                        </label>
                        <input
                            type="text"
                            value={tagsInput}
                            onChange={(e) => setTagsInput(e.target.value)}
                            placeholder="e.g. aryabhata, calculus, kerala-school"
                            className="w-full px-3.5 py-2 bg-white border border-[#D4A373]/40 rounded-sm text-xs text-[#0F1C3F] placeholder:text-[#9E8F85] focus:outline-none focus:border-[#B85428] focus:ring-1 focus:ring-[#B85428]"
                        />
                    </div>

                    {/* Footer / Buttons */}
                    <div className="pt-4 border-t border-[#E8E0D4] flex items-center justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-xs font-semibold text-[#6B5B4E] hover:text-[#0F1C3F] transition-colors cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-5 py-2.5 bg-[#B85428] hover:bg-[#A04820] text-white text-xs font-semibold tracking-wide transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                    <span>Saving...</span>
                                </>
                            ) : (
                                <span>Save Changes</span>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
