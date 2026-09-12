// components/modals/NewDiscussionModal.tsx
'use client';

import { useState } from "react";
import { X, Loader2 } from "lucide-react";
import { TricolorStripe } from "../Symbols";
import { forumCategories } from "@/data/forumData";
import { createDiscussion } from "@/app/actions/forum";
import { useAuth } from "@/context/AuthContext";

interface NewDiscussionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCreated?: () => void;
}

export default function NewDiscussionModal({
    isOpen,
    onClose,
    onCreated,
}: NewDiscussionModalProps) {
    const { user } = useAuth();
    const [title, setTitle] = useState("");
    const [category, setCategory] = useState("");
    const [body, setBody] = useState("");
    const [tagsInput, setTagsInput] = useState("");

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg(null);

        if (!title.trim() || !category || !body.trim()) {
            setErrorMsg("Please fill in Category, Title, and Content.");
            return;
        }

        setIsSubmitting(true);

        try {
            const parsedTags = tagsInput
                .split(",")
                .map((t) => t.trim().toLowerCase())
                .filter(Boolean);

            await createDiscussion({
                title: title.trim(),
                body: body.trim(),
                categoryId: category,
                tags: parsedTags,
            });

            setTitle("");
            setCategory("");
            setBody("");
            setTagsInput("");

            if (onCreated) onCreated();
            onClose();
        } catch (err) {
            console.error("Failed to publish discussion:", err);
            setErrorMsg("Failed to publish discussion. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div
                className="bg-white w-full max-w-2xl shadow-2xl overflow-hidden"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
                <div className="bg-[#0F1C3F] px-7 py-5 flex items-center justify-between">
                    <div>
                        <div className="text-white font-semibold text-lg tracking-tight">Start a Discussion</div>
                        <div className="text-white/50 text-sm mt-0.5">
                            Posting as <span className="text-[#C8971A]">@{user?.username || user?.name}</span>
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

                    <div>
                        <label className="block text-xs font-semibold text-[#6B5B4E] uppercase tracking-widest mb-1.5">
                            Discussion Title *
                        </label>
                        <input
                            type="text"
                            required
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="A clear, evocative civilizational topic"
                            className="w-full border border-[#EDE8DF] px-3.5 py-2.5 text-[#1C1917] placeholder-[#9E8F85] focus:outline-none focus:border-[#B85428] text-sm"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-[#6B5B4E] uppercase tracking-widest mb-1.5">
                            Discussion Content *
                        </label>
                        <textarea
                            required
                            rows={5}
                            value={body}
                            onChange={(e) => setBody(e.target.value)}
                            placeholder="Introduce the question or thesis, cite context, and invite perspectives..."
                            className="w-full border border-[#EDE8DF] px-3.5 py-2.5 text-[#1C1917] placeholder-[#9E8F85] focus:outline-none focus:border-[#B85428] text-sm resize-none"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-[#6B5B4E] uppercase tracking-widest mb-1.5">
                            Tags (comma-separated)
                        </label>
                        <input
                            type="text"
                            value={tagsInput}
                            onChange={(e) => setTagsInput(e.target.value)}
                            placeholder="e.g. epics, sanskrit, astronomy, architecture"
                            className="w-full border border-[#EDE8DF] px-3.5 py-2.5 text-[#1C1917] placeholder-[#9E8F85] focus:outline-none focus:border-[#B85428] text-sm"
                        />
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            disabled={isSubmitting}
                            onClick={onClose}
                            className="flex-1 py-3 border border-[#EDE8DF] text-[#6B5B4E] hover:border-[#B85428] text-sm font-semibold transition-colors cursor-pointer disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1 py-3 bg-[#B85428] hover:bg-[#A04820] text-white text-sm font-semibold transition-colors cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" /> Publishing...
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