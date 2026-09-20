'use client';

import { useState, useEffect } from "react";
import { X, Loader2, Layers, Sparkles } from "lucide-react";
import { TricolorStripe } from "../Symbols";
import { forumCategories, getMegaThreads, addMockDiscussion } from "@/data/forumData";
import { createDiscussion, getMegaThreadsAction, getCategoriesAction } from "@/app/actions/forum";
import { useAuth } from "@/context/AuthContext";
import type { MegaThread } from "@/types/forum";

const SAMPLE_N8N_PAYLOAD = JSON.stringify(
    [
        {
            title: "समुदाय के लिए महत्वपूर्ण जानकारी",
            body: "हाल ही में प्राप्त जानकारी के अनुसार, इस विषय पर अभी और विवरण सामने आना बाकी है। स्थानीय नागरिकों से अनुरोध है कि वे आगामी अपडेट पर नजर बनाए रखें और समुदाय हित में सक्रिय रहें।\n\n---\n\n### मुख्य तथ्य\n\n- दिए गए लेख में कोई विशिष्ट तथ्य या घटना उपलब्ध नहीं है।\n\n### चर्चा के बिंदु\n\n1. इस विषय पर आपकी क्या राय है?\n2. समुदाय के विकास के लिए हमें आगे क्या कदम उठाने चाहिए?\n",
            image_url: "https://images.pexels.com/photos/1325754/pexels-photo-1325754.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
            image_alt: "Smiling team members engaging in a positive office discussion.",
            photographer: "Jopwell",
            photographer_url: "https://www.pexels.com/@jopwell",
            pexels_url: "https://www.pexels.com/photo/man-sitting-on-office-chair-1325754/",
        },
    ],
    null,
    2
);

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
    const [megaThreads, setMegaThreads] = useState<MegaThread[]>(() => getMegaThreads());
    const [categories, setCategories] = useState<{ id: string; name: string; count?: number; color?: string }[]>(forumCategories);

    const initialMt = defaultMegaThreadId || (megaThreads[0]?.id ?? "");
    const [megaThreadId, setMegaThreadId] = useState(initialMt);
    const [title, setTitle] = useState("");
    const [category, setCategory] = useState(() => {
        const mt = megaThreads.find((m) => m.id === initialMt);
        return mt?.category || "";
    });
    const [body, setBody] = useState("");
    const [tagsInput, setTagsInput] = useState("");

    // n8n Pipeline Integration state
    const [showPipelineImport, setShowPipelineImport] = useState(false);
    const [pipelineRawJson, setPipelineRawJson] = useState("");
    const [pipelineMetadata, setPipelineMetadata] = useState<{
        image_url?: string;
        image_alt?: string;
        photographer?: string;
        photographer_url?: string;
        pexels_url?: string;
    } | null>(null);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const handleApplyPipelineJson = (raw: string) => {
        try {
            setErrorMsg(null);
            const parsed = JSON.parse(raw);
            const item = Array.isArray(parsed) ? parsed[0] : parsed;
            if (!item || !item.title || !item.body) {
                setErrorMsg("Invalid payload: item must have 'title' and 'body'.");
                return;
            }
            setTitle(item.title);
            setBody(item.body);
            setPipelineMetadata({
                image_url: item.image_url || item.imageUrl,
                image_alt: item.image_alt || item.imageAlt,
                photographer: item.photographer,
                photographer_url: item.photographer_url || item.photographerUrl,
                pexels_url: item.pexels_url || item.pexelsUrl,
            });

            // Auto-tag
            const autoTags = ["समुदाय", "नागरिक", "विकास"];
            setTagsInput(autoTags.join(", "));

            // Category matching
            const matchedCategory = categories.find((c) => c.id === "society" || c.id === "development") || categories[0];
            if (matchedCategory) {
                setCategory(matchedCategory.id);
                const matchedMt = megaThreads.find((m) => m.category === matchedCategory.id) || megaThreads[0];
                if (matchedMt) setMegaThreadId(matchedMt.id);
            }
            setShowPipelineImport(false);
        } catch {
            setErrorMsg("Could not parse JSON. Please verify valid JSON format.");
        }
    };

    useEffect(() => {
        if (!isOpen) return;
        let active = true;
        Promise.all([
            getMegaThreadsAction(),
            getCategoriesAction(),
        ]).then(([dbMts, dbCats]) => {
            if (!active) return;
            if (dbMts && dbMts.length > 0) {
                setMegaThreads(dbMts as unknown as MegaThread[]);
                if (!megaThreadId) {
                    const firstId = defaultMegaThreadId || dbMts[0].id;
                    setMegaThreadId(firstId);
                    const matched = dbMts.find((m) => m.id === firstId);
                    if (matched) setCategory(matched.category);
                }
            }
            if (dbCats && dbCats.length > 0) {
                setCategories(dbCats);
            }
        }).catch(() => {});
        return () => {
            active = false;
        };
    }, [isOpen, defaultMegaThreadId, megaThreadId]);

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
                    imageUrl: pipelineMetadata?.image_url,
                    imageAlt: pipelineMetadata?.image_alt,
                    photographer: pipelineMetadata?.photographer,
                    photographerUrl: pipelineMetadata?.photographer_url,
                    pexelsUrl: pipelineMetadata?.pexels_url,
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
            setPipelineMetadata(null);

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

                    {/* Pipeline Import Toggle */}
                    <div className="bg-[#FAF8F5] border border-[#EDE8DF] p-3 rounded-xs">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Sparkles className="w-4 h-4 text-[#B85428]" />
                                <span className="text-xs font-semibold text-[#1C1917]">
                                    n8n Pipeline Importer
                                </span>
                            </div>
                            <button
                                type="button"
                                onClick={() => setShowPipelineImport(!showPipelineImport)}
                                className="text-xs text-[#B85428] hover:underline font-medium cursor-pointer"
                            >
                                {showPipelineImport ? "Close Importer" : "Import from n8n Pipeline"}
                            </button>
                        </div>

                        {showPipelineImport && (
                            <div className="mt-3 pt-3 border-t border-[#EDE8DF] space-y-2.5">
                                <p className="text-[11px] text-[#6B5B4E]">
                                    Paste a JSON array or object output by your n8n workflow. The thread will be anchored and formatted with typography matching the platform without rendering images.
                                </p>
                                <textarea
                                    value={pipelineRawJson}
                                    onChange={(e) => setPipelineRawJson(e.target.value)}
                                    placeholder='[ { "title": "...", "body": "...", "image_url": "..." } ]'
                                    rows={4}
                                    className="w-full font-mono text-xs p-2.5 bg-white border border-[#EDE8DF] text-[#1C1917] focus:outline-none focus:border-[#B85428]"
                                />
                                <div className="flex items-center gap-2 flex-wrap">
                                    <button
                                        type="button"
                                        onClick={() => handleApplyPipelineJson(pipelineRawJson)}
                                        className="bg-[#B85428] text-white text-xs px-3 py-1.5 font-medium hover:bg-[#A04520] transition-colors cursor-pointer"
                                    >
                                        Apply Payload
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setPipelineRawJson(SAMPLE_N8N_PAYLOAD);
                                            handleApplyPipelineJson(SAMPLE_N8N_PAYLOAD);
                                        }}
                                        className="bg-white border border-[#B85428] text-[#B85428] text-xs px-3 py-1.5 font-medium hover:bg-[#FAF8F5] transition-colors cursor-pointer flex items-center gap-1.5"
                                    >
                                        <Sparkles className="w-3.5 h-3.5" /> Load Sample n8n Response
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

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
                            {categories.map((c) => (
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