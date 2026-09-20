'use client';

import { useState } from "react";
import { X, Flag, Check, AlertCircle, Loader2 } from "lucide-react";
import { TricolorStripe } from "../Symbols";
import { createReport } from "@/app/actions/forum";
import { useAuth } from "@/context/AuthContext";
import type { ReportReason } from "@/types/forum";

interface ReportModalProps {
    isOpen: boolean;
    onClose: () => void;
    discussionId?: string;
    postId?: string;
    itemTitle?: string;
    itemAuthor?: string;
}

const REPORT_REASONS: { value: ReportReason; label: string; desc: string }[] = [
    {
        value: "spam",
        label: "Spam or Advertising",
        desc: "Commercial solicitation, links to malicious sites, or repetitive unwanted content",
    },
    {
        value: "harassment",
        label: "Harassment or Hostility",
        desc: "Personal attacks, bullying, abusive behavior, or hateful conduct",
    },
    {
        value: "misinformation",
        label: "Misinformation or False Claims",
        desc: "Demonstrably false historical claims, altered citations, or fabricated evidence",
    },
    {
        value: "inappropriate",
        label: "Inappropriate Content",
        desc: "Graphic, sexually explicit, or otherwise unsuitable material for a scholarly forum",
    },
    {
        value: "off_topic",
        label: "Off-Topic or Disruptive",
        desc: "Content completely unrelated to the thread's intellectual theme or category",
    },
    {
        value: "other",
        label: "Other Issue",
        desc: "Another violation of civilizational dialogue community guidelines",
    },
];

export default function ReportModal({
    isOpen,
    onClose,
    discussionId,
    postId,
    itemTitle,
    itemAuthor,
}: ReportModalProps) {
    const { user, requireAuth } = useAuth();
    const [selectedReason, setSelectedReason] = useState<ReportReason>("spam");
    const [details, setDetails] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [isSuccess, setIsSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg(null);

        if (!user) {
            requireAuth(() => {});
            return;
        }

        if (!discussionId && !postId) {
            setErrorMsg("No target discussion or post specified.");
            return;
        }

        setIsSubmitting(true);

        try {
            const res = await createReport(
                {
                    discussionId,
                    postId,
                    reason: selectedReason,
                    details: details.trim() || undefined,
                },
                user.id
            );

            setIsSuccess(true);
            setSuccessMessage(res.message);
        } catch (err) {
            const msg = err instanceof Error ? err.message : "Failed to submit report. Please try again.";
            setErrorMsg(msg);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        setIsSuccess(false);
        setErrorMsg(null);
        setDetails("");
        setSelectedReason("spam");
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <div
                className="bg-[#FAF8F5] border border-[#D4A373]/30 rounded-lg shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
                <TricolorStripe />

                {/* Modal Header */}
                <div className="px-6 py-4 border-b border-[#E8E0D4] flex items-center justify-between bg-white">
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-red-50 text-red-600 flex items-center justify-center">
                            <Flag className="w-4 h-4" />
                        </div>
                        <div>
                            <h3 className="font-bold text-base text-[#0F1C3F]" style={{ fontFamily: "'Fraunces', serif" }}>
                                Report {postId ? "Contribution" : "Discussion"}
                            </h3>
                            <p className="text-xs text-[#6B5B4E]">
                                Help uphold rigor, integrity, and mutual respect
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={handleClose}
                        className="text-[#6B5B4E] hover:text-[#0F1C3F] p-1.5 transition-colors cursor-pointer"
                        title="Close"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {isSuccess ? (
                    /* Success State */
                    <div className="p-8 text-center space-y-4">
                        <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                            <Check className="w-6 h-6 stroke-[2.5]" />
                        </div>
                        <h4 className="font-bold text-lg text-[#0F1C3F]" style={{ fontFamily: "'Fraunces', serif" }}>
                            Report Received
                        </h4>
                        <p className="text-sm text-[#6B5B4E] max-w-sm mx-auto leading-relaxed">
                            {successMessage || "Thank you for contributing to community integrity. Our moderation team will review this report."}
                        </p>
                        <div className="pt-2">
                            <button
                                type="button"
                                onClick={handleClose}
                                className="px-6 py-2.5 bg-[#0F1C3F] hover:bg-[#1D3557] text-white text-xs font-semibold tracking-wide uppercase transition-colors cursor-pointer"
                            >
                                Done
                            </button>
                        </div>
                    </div>
                ) : (
                    /* Report Form */
                    <form onSubmit={handleSubmit} className="p-6 space-y-4">
                        {/* Target Info */}
                        {(itemTitle || itemAuthor) && (
                            <div className="bg-white border border-[#EDE8DF] p-3 rounded-xs text-xs text-[#6B5B4E]">
                                <span className="font-semibold text-[#1C1917]">Reporting: </span>
                                {itemTitle ? (
                                    <span className="italic text-[#1C1917]">&ldquo;{itemTitle.length > 70 ? itemTitle.slice(0, 70) + "..." : itemTitle}&rdquo;</span>
                                ) : null}
                                {itemAuthor ? <span> by @{itemAuthor}</span> : null}
                            </div>
                        )}

                        {errorMsg && (
                            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-sm flex items-start gap-2">
                                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                                <span>{errorMsg}</span>
                            </div>
                        )}

                        {/* Reason Selection */}
                        <div className="space-y-2">
                            <label className="block text-xs font-semibold text-[#0F1C3F] uppercase tracking-wider">
                                Select Reason
                            </label>
                            <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                                {REPORT_REASONS.map((r) => (
                                    <label
                                        key={r.value}
                                        className={`flex items-start gap-3 p-2.5 border rounded-xs cursor-pointer transition-colors ${
                                            selectedReason === r.value
                                                ? "border-[#B85428] bg-[#B85428]/5"
                                                : "border-[#EDE8DF] bg-white hover:border-[#D4A373]"
                                        }`}
                                    >
                                        <input
                                            type="radio"
                                            name="reportReason"
                                            value={r.value}
                                            checked={selectedReason === r.value}
                                            onChange={() => setSelectedReason(r.value)}
                                            className="mt-0.5 text-[#B85428] focus:ring-[#B85428]"
                                        />
                                        <div className="text-xs">
                                            <div className="font-semibold text-[#1C1917]">{r.label}</div>
                                            <div className="text-[#9E8F85] text-[11px] leading-snug">{r.desc}</div>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Additional Details */}
                        <div>
                            <label className="block text-xs font-semibold text-[#0F1C3F] uppercase tracking-wider mb-1.5">
                                Additional Details <span className="text-[#9E8F85] font-normal lowercase">(optional)</span>
                            </label>
                            <textarea
                                value={details}
                                onChange={(e) => setDetails(e.target.value)}
                                rows={3}
                                placeholder="Explain why this content violates community guidelines..."
                                className="w-full px-3 py-2 bg-white border border-[#EDE8DF] rounded-xs text-xs text-[#1C1917] placeholder:text-[#9E8F85] focus:outline-none focus:border-[#B85428]"
                            />
                        </div>

                        {/* Footer Buttons */}
                        <div className="pt-3 border-t border-[#E8E0D4] flex items-center justify-end gap-3">
                            <button
                                type="button"
                                onClick={handleClose}
                                disabled={isSubmitting}
                                className="px-4 py-2 text-xs font-semibold text-[#6B5B4E] hover:text-[#0F1C3F] transition-colors cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold tracking-wide uppercase transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                        <span>Submitting...</span>
                                    </>
                                ) : (
                                    <>
                                        <Flag className="w-3.5 h-3.5" />
                                        <span>Submit Report</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}
