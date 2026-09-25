import React from "react";
import Image from "next/image";

// ============================================================================
// AWAKENING CARDS DATA DEFINITION
// ============================================================================

const awakeningCards = [
    {
        id: "nationalism",
        title: "Nationalism",
        desc: "Fostering civilizational pride, sovereign self-reliance, and unwavering unity across all domains.",
        imageSrc: "/lion.png",
        imageAlt: "Nationalism - Lion of Bharat",
        cardGlow: "border-orange-200/90 shadow-[0_12px_32px_rgba(249,115,22,0.14)] hover:shadow-[0_20px_42px_rgba(249,115,22,0.22)]",
    },
    {
        id: "equality",
        title: "Equality",
        desc: "Universal justice, shared opportunity, and social harmony grounded in constitutional dharma.",
        imageSrc: "/hands.png",
        imageAlt: "Equality - Unity and Solidarity",
        cardGlow: "border-emerald-200/90 shadow-[0_12px_32px_rgba(16,185,129,0.12)] hover:shadow-[0_20px_42px_rgba(16,185,129,0.20)]",
    },
    {
        id: "modernization",
        title: "Modernization",
        desc: "Harnessing cutting-edge technology, digital prowess, and future-ready economic infrastructure.",
        imageSrc: "/satellite.png",
        imageAlt: "Modernization - Satellite and Space Technology",
        cardGlow: "border-emerald-200/90 shadow-[0_12px_32px_rgba(16,185,129,0.12)] hover:shadow-[0_20px_42px_rgba(16,185,129,0.20)]",
    },
    {
        id: "pro-culture",
        title: "Pro culture",
        desc: "Nurturing sacred traditions, classical arts, and timeless civilizational knowledge systems.",
        imageSrc: "/aurat.png",
        imageAlt: "Pro culture - Classical Indian Dancer",
        cardGlow: "border-orange-200/90 shadow-[0_12px_32px_rgba(249,115,22,0.14)] hover:shadow-[0_20px_42px_rgba(249,115,22,0.22)]",
    },
];

// ============================================================================
// MAIN AWAKENING SECTION COMPONENT
// ============================================================================

export default function AwakeningSection() {
    return (
        <section id="awakening" className="py-20 sm:py-24 bg-[#FAFAF7] relative overflow-hidden select-none">
            {/* Alias anchor for any legacy links targeting heritage */}
            <span id="heritage" className="absolute -top-24 pointer-events-none" aria-hidden="true" />

            <div className="max-w-6xl mx-auto px-5 sm:px-6">
                {/* Section Header: Centered Title with Larger Left-Aligned Subheading and Reduced Gap to Cards */}
                <div className="mb-4 sm:mb-5">
                    <h2
                        className="text-center text-4xl sm:text-5xl lg:text-[54px] xl:text-[60px] font-black text-[#FF7700] tracking-tight leading-tight mb-5 sm:mb-7"
                        style={{ fontFamily: "'Fraunces', serif" }}
                    >
                        Our Awakening
                    </h2>
                    <p
                        className="text-left text-2xl sm:text-3xl lg:text-[34px] xl:text-[38px] font-bold text-slate-900 tracking-tight leading-tight"
                        style={{ fontFamily: "'Fraunces', serif" }}
                    >
                        What we stand for?
                    </p>
                </div>

                {/* 2x2 Grid of Awakening Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-7 lg:gap-8">
                    {awakeningCards.map((card) => (
                        <div
                            key={card.id}
                            className={`group bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-7 border ${card.cardGlow} transition-all duration-300 hover:-translate-y-1 relative flex flex-col justify-between`}
                        >
                            <div className="grid grid-cols-12 gap-3 sm:gap-5 items-center">
                                {/* Left Side: Title, Description, Tricolor Bar */}
                                <div className="col-span-7 flex flex-col justify-between h-full pr-1 sm:pr-2">
                                    <div>
                                        <h3 className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight mb-2 sm:mb-2.5">
                                            {card.title}
                                        </h3>
                                        <p className="text-xs sm:text-[13.5px] text-slate-600 leading-relaxed font-normal">
                                            {card.desc}
                                        </p>
                                    </div>

                                    {/* Signature Tricolor Pill (Orange, White, Green) */}
                                    <div className="w-16 sm:w-24 h-1.5 sm:h-2 rounded-full bg-gradient-to-r from-[#FF7700] via-white to-[#138808] border border-slate-300/80 shadow-[0_1px_2px_rgba(0,0,0,0.06)] mt-5 sm:mt-7" />
                                </div>

                                {/* Right Side: Custom Card Image */}
                                <div className="col-span-5 flex items-center justify-center p-1 sm:p-2">
                                    <Image
                                        src={card.imageSrc}
                                        alt={card.imageAlt}
                                        width={200}
                                        height={200}
                                        className="w-full h-auto max-h-[140px] sm:max-h-[160px] lg:max-h-[175px] max-w-[140px] sm:max-w-[170px] object-contain select-none transition-transform duration-300 group-hover:scale-105 drop-shadow-sm"
                                        priority
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
