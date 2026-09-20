'use client';

import { useState } from "react";
import {
    X,
    Copy,
    Check,
    Share2,
    MessageCircle,
    Send,
} from "lucide-react";
import { TricolorStripe } from "../Symbols";
import { recordShare } from "@/app/actions/forum";

interface ShareModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    url?: string;
    discussionId?: string;
}

export default function ShareModal({
    isOpen,
    onClose,
    title,
    url,
    discussionId,
}: ShareModalProps) {
    const [copied, setCopied] = useState(false);

    if (!isOpen) return null;

    const shareUrl = url || (typeof window !== "undefined" ? window.location.href : "");
    const encodedUrl = encodeURIComponent(shareUrl);
    const encodedTitle = encodeURIComponent(title || "Check out this discussion on BHARAT-GANRAJYA Forum");

    const trackShare = () => {
        if (discussionId) {
            recordShare(discussionId).catch(() => {});
        }
    };

    const handleCopy = () => {
        if (typeof window !== "undefined") {
            navigator.clipboard.writeText(shareUrl);
            setCopied(true);
            trackShare();
            setTimeout(() => setCopied(false), 2500);
        }
    };

    const handleNativeShare = async () => {
        if (typeof navigator !== "undefined" && navigator.share) {
            try {
                await navigator.share({
                    title,
                    url: shareUrl,
                });
                trackShare();
                onClose();
            } catch {
                // User cancelled or failed
            }
        }
    };

    const shareOptions = [
        {
            name: "WhatsApp",
            icon: <MessageCircle className="w-4 h-4 text-emerald-600" />,
            href: `https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`,
            color: "hover:border-emerald-500 hover:bg-emerald-50/40",
        },
        {
            name: "X (Twitter)",
            icon: (
                <svg className="w-4 h-4 fill-current text-black" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
            ),
            href: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
            color: "hover:border-black hover:bg-gray-50",
        },
        {
            name: "LinkedIn",
            icon: (
                <svg className="w-4 h-4 fill-current text-[#0A66C2]" viewBox="0 0 24 24">
                    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.78a1.62 1.62 0 1 0 0 3.24 1.62 1.62 0 0 0 0-3.24z" />
                </svg>
            ),
            href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
            color: "hover:border-[#0A66C2] hover:bg-blue-50/40",
        },
        {
            name: "Telegram",
            icon: <Send className="w-4 h-4 text-[#229ED9]" />,
            href: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`,
            color: "hover:border-[#229ED9] hover:bg-sky-50/40",
        },
        {
            name: "Reddit",
            icon: (
                <svg className="w-4 h-4 fill-current text-[#FF4500]" viewBox="0 0 24 24">
                    <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z" />
                </svg>
            ),
            href: `https://reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}`,
            color: "hover:border-[#FF4500] hover:bg-orange-50/40",
        },
    ];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <div
                className="bg-[#FAF8F5] border border-[#D4A373]/30 rounded-lg shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
                <TricolorStripe />

                {/* Modal Header */}
                <div className="px-5 py-4 border-b border-[#E8E0D4] flex items-center justify-between bg-white">
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-[#B85428]/10 text-[#B85428] flex items-center justify-center">
                            <Share2 className="w-4 h-4" />
                        </div>
                        <div>
                            <h3 className="font-bold text-base text-[#0F1C3F]" style={{ fontFamily: "'Fraunces', serif" }}>
                                Share Discussion
                            </h3>
                            <p className="text-xs text-[#6B5B4E]">
                                Circulate ideas and invite perspectives
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

                <div className="p-5 space-y-5">
                    {/* Thread Preview */}
                    <div className="bg-white border border-[#EDE8DF] p-3 rounded-xs">
                        <p
                            className="font-semibold text-sm text-[#1C1917] line-clamp-2"
                            style={{ fontFamily: "'Spectral', Georgia, serif" }}
                        >
                            {title}
                        </p>
                    </div>

                    {/* Copy Link Row */}
                    <div>
                        <label className="block text-xs font-semibold text-[#0F1C3F] uppercase tracking-wider mb-1.5">
                            Discussion Link
                        </label>
                        <div className="flex items-center gap-2">
                            <input
                                type="text"
                                readOnly
                                value={shareUrl}
                                className="flex-1 px-3 py-2 bg-white border border-[#EDE8DF] rounded-xs text-xs text-[#4A403A] select-all focus:outline-none focus:border-[#B85428]"
                            />
                            <button
                                type="button"
                                onClick={handleCopy}
                                className={`shrink-0 px-3.5 py-2 text-xs font-semibold rounded-xs transition-colors flex items-center gap-1.5 cursor-pointer ${
                                    copied
                                        ? "bg-emerald-600 text-white"
                                        : "bg-[#B85428] hover:bg-[#A04820] text-white"
                                }`}
                            >
                                {copied ? (
                                    <>
                                        <Check className="w-3.5 h-3.5" />
                                        <span>Copied!</span>
                                    </>
                                ) : (
                                    <>
                                        <Copy className="w-3.5 h-3.5" />
                                        <span>Copy Link</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Web Share API on mobile / supported devices */}
                    {typeof navigator !== "undefined" && typeof navigator.share === "function" && (
                        <div>
                            <button
                                type="button"
                                onClick={handleNativeShare}
                                className="w-full py-2.5 px-4 bg-white border border-[#EDE8DF] hover:border-[#B85428] text-xs font-semibold text-[#0F1C3F] rounded-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                            >
                                <Share2 className="w-4 h-4 text-[#B85428]" />
                                <span>Share via device apps...</span>
                            </button>
                        </div>
                    )}

                    {/* Social Share Grid */}
                    <div>
                        <label className="block text-xs font-semibold text-[#0F1C3F] uppercase tracking-wider mb-2">
                            Share to Platform
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                            {shareOptions.map((opt) => (
                                <a
                                    key={opt.name}
                                    href={opt.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={trackShare}
                                    className={`flex items-center gap-2 p-2.5 bg-white border border-[#EDE8DF] rounded-xs text-xs font-medium text-[#1C1917] transition-all cursor-pointer ${opt.color}`}
                                >
                                    {opt.icon}
                                    <span className="truncate">{opt.name}</span>
                                </a>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-5 py-3 border-t border-[#E8E0D4] bg-[#F5F0E6]/50 flex justify-end">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-1.5 text-xs text-[#6B5B4E] hover:text-[#0F1C3F] font-semibold transition-colors cursor-pointer"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}
