'use client';

import React from "react";

interface FormattedBodyProps {
    content: string;
    className?: string;
}

/**
 * Clean markdown formatter for thread content and replies.
 * Renders headings, dividers, lists, and paragraphs with the civilizational
 * typography of the forum while strictly omitting image rendering.
 */
export default function FormattedBody({ content, className = "" }: FormattedBodyProps) {
    if (!content) return null;

    // Split content into major blocks separated by blank lines
    const rawBlocks = content.split(/\n\s*\n/);

    const renderInline = (text: string): React.ReactNode => {
        // Strip out any image markdown like ![alt](url) to enforce no image rendering
        const stripped = text.replace(/!\[.*?\]\(.*?\)/g, "");

        // Split by bold (**text**) and italic (*text*)
        const parts = stripped.split(/(\*\*.*?\*\*|\*.*?\*)/g);
        return parts.map((part, index) => {
            if (part.startsWith("**") && part.endsWith("**") && part.length >= 4) {
                return <strong key={index} className="font-semibold text-[#1C1917]">{part.slice(2, -2)}</strong>;
            }
            if (part.startsWith("*") && part.endsWith("*") && part.length >= 2) {
                return <em key={index} className="italic text-[#4A403A]">{part.slice(1, -1)}</em>;
            }
            return part;
        });
    };

    return (
        <div
            className={`space-y-4 text-[#2C2420] text-base leading-relaxed ${className}`}
            style={{ fontFamily: "'Spectral', Georgia, serif" }}
        >
            {rawBlocks.map((block, idx) => {
                const trimmed = block.trim();
                if (!trimmed) return null;

                // Horizontal Rule: --- or ***
                if (/^(---|___|\*\*\*)$/.test(trimmed)) {
                    return <hr key={idx} className="my-6 border-t border-[#EDE8DF]" />;
                }

                // Heading 3: ### Heading
                if (trimmed.startsWith("### ")) {
                    const headingText = trimmed.replace(/^###\s+/, "");
                    return (
                        <h4
                            key={idx}
                            className="text-lg sm:text-xl font-bold text-[#1C1917] mt-6 mb-2 tracking-tight flex items-center gap-2"
                            style={{ fontFamily: "'Fraunces', serif" }}
                        >
                            <span className="w-1.5 h-4 bg-[#B85428] inline-block rounded-xs"></span>
                            {renderInline(headingText)}
                        </h4>
                    );
                }

                // Heading 2: ## Heading
                if (trimmed.startsWith("## ")) {
                    const headingText = trimmed.replace(/^##\s+/, "");
                    return (
                        <h3
                            key={idx}
                            className="text-xl sm:text-2xl font-bold text-[#1C1917] mt-7 mb-3 tracking-tight"
                            style={{ fontFamily: "'Fraunces', serif" }}
                        >
                            {renderInline(headingText)}
                        </h3>
                    );
                }

                // Heading 1: # Heading
                if (trimmed.startsWith("# ")) {
                    const headingText = trimmed.replace(/^#\s+/, "");
                    return (
                        <h2
                            key={idx}
                            className="text-2xl sm:text-3xl font-bold text-[#1C1917] mt-8 mb-4 tracking-tight"
                            style={{ fontFamily: "'Fraunces', serif" }}
                        >
                            {renderInline(headingText)}
                        </h2>
                    );
                }

                // Check for lists (unordered or ordered)
                const lines = trimmed.split("\n");
                const isUnorderedList = lines.every((line) => /^[-*]\s+/.test(line.trim()));
                const isOrderedList = lines.every((line) => /^\d+\.\s+/.test(line.trim()));

                if (isUnorderedList) {
                    return (
                        <ul key={idx} className="space-y-2 my-3 pl-6 list-disc marker:text-[#B85428] text-[#2C2420]">
                            {lines.map((line, liIdx) => (
                                <li key={liIdx} className="leading-relaxed pl-1">
                                    {renderInline(line.trim().replace(/^[-*]\s+/, ""))}
                                </li>
                            ))}
                        </ul>
                    );
                }

                if (isOrderedList) {
                    return (
                        <ol key={idx} className="space-y-2 my-3 pl-6 list-decimal marker:text-[#B85428] marker:font-semibold text-[#2C2420]">
                            {lines.map((line, liIdx) => (
                                <li key={liIdx} className="leading-relaxed pl-1">
                                    {renderInline(line.trim().replace(/^\d+\.\s+/, ""))}
                                </li>
                            ))}
                        </ol>
                    );
                }

                // Regular Paragraph: preserve single line breaks within block
                return (
                    <p key={idx} className="leading-relaxed">
                        {lines.map((line, lIdx) => (
                            <React.Fragment key={lIdx}>
                                {renderInline(line)}
                                {lIdx < lines.length - 1 && <br />}
                            </React.Fragment>
                        ))}
                    </p>
                );
            })}
        </div>
    );
}
