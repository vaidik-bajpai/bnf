'use client';

import { useEffect, useRef } from "react";
import gsap from "gsap";

interface HeroSpinningWheelProps {
    className?: string;
    opacity?: number;
}

export default function HeroSpinningWheel({
    className = "",
    opacity = 0.25,
}: HeroSpinningWheelProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const spinWrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current || !spinWrapperRef.current) return;

        const ctx = gsap.context(() => {
            // 1. Initial entrance animation: gentle fade-in and scale-in
            gsap.from(containerRef.current, {
                scale: 0.94,
                opacity: 0,
                duration: 1.8,
                ease: "power2.out",
            });

            // 2. Primary clockwise rotation with 100% fixed, rock-solid center axis
            const mainSpin = gsap.to(spinWrapperRef.current, {
                rotation: 360,
                duration: 55,
                repeat: -1,
                ease: "none",
                transformOrigin: "50% 50%",
            });

            // 3. Interactive acceleration on hover
            const heroSection = document.getElementById("home");
            if (heroSection) {
                let speedTween: gsap.core.Tween | null = null;

                const onMouseEnter = () => {
                    speedTween?.kill();
                    speedTween = gsap.to(mainSpin, {
                        timeScale: 2.0,
                        duration: 1.2,
                        ease: "power2.out",
                    });
                };

                const onMouseLeave = () => {
                    speedTween?.kill();
                    speedTween = gsap.to(mainSpin, {
                        timeScale: 1,
                        duration: 2.5,
                        ease: "power2.inOut",
                    });
                };

                heroSection.addEventListener("mouseenter", onMouseEnter);
                heroSection.addEventListener("mouseleave", onMouseLeave);

                return () => {
                    heroSection.removeEventListener("mouseenter", onMouseEnter);
                    heroSection.removeEventListener("mouseleave", onMouseLeave);
                };
            }
        }, containerRef);

        return () => ctx.revert();
    }, []);

    // 24 spokes & beads of the official Indian National Flag Ashoka Chakra
    const spokeIndices = Array.from({ length: 24 }, (_, i) => i);

    return (
        <div
            ref={containerRef}
            style={{ opacity }}
            className={`relative flex items-center justify-center select-none pointer-events-none transition-opacity duration-500 ${className}`}
        >
            {/* Spinning Wrapper rotating strictly around its 50% 50% geometric center axis */}
            <div
                ref={spinWrapperRef}
                className="w-full h-full aspect-square flex items-center justify-center origin-center"
                style={{
                    transformOrigin: "50% 50%",
                }}
            >
                {/* Official Indian Flag Ashoka Chakra SVG with a Much Subtler Drop Shadow */}
                <svg
                    viewBox="0 0 602 602"
                    className="w-full h-full overflow-visible"
                    style={{
                        filter: "drop-shadow(0 3px 10px rgba(0, 0, 0, 0.22))",
                    }}
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <defs>
                        {/* Subtle Flag Navy Blue Gradient */}
                        <linearGradient id="flagNavySubtle" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#93C5FD" />
                            <stop offset="35%" stopColor="#3B82F6" />
                            <stop offset="70%" stopColor="#2563EB" />
                            <stop offset="100%" stopColor="#1D4ED8" />
                        </linearGradient>

                        {/* Subtle SVG Drop Shadow Filter for individual spoke and rim definition */}
                        <filter id="subtleChakraShadow" x="-15%" y="-15%" width="130%" height="130%">
                            <feDropShadow dx="0" dy="2.5" stdDeviation="4.5" floodColor="#000000" floodOpacity="0.2" />
                        </filter>
                    </defs>

                    {/* Ashoka Chakra Elements with Subtle Shadow & Fixed Center at (301, 301) */}
                    <g filter="url(#subtleChakraShadow)">
                        {/* Outer Annular Rim (Transparent center, no white disc) */}
                        <circle
                            cx="301"
                            cy="301"
                            r="280.5"
                            fill="none"
                            stroke="url(#flagNavySubtle)"
                            strokeWidth="41"
                        />

                        {/* Center Hub Outer Ring */}
                        <circle
                            cx="301"
                            cy="301"
                            r="34"
                            fill="none"
                            stroke="url(#flagNavySubtle)"
                            strokeWidth="36"
                        />

                        {/* Center Hub Inner Pip */}
                        <circle
                            cx="301"
                            cy="301"
                            r="8"
                            fill="url(#flagNavySubtle)"
                        />

                        {/* 24 Authentic Diamond-Tapered Spokes & 24 Outer Rim Beads */}
                        {spokeIndices.map((i) => (
                            <g key={`spoke-${i}`} transform={`rotate(${i * 15} 301 301)`}>
                                {/* Spoke: tapers from rim tip (301, 41.18) to wide waist (310.76, 197.83) to hub anchor (301, 275.39) */}
                                <polygon
                                    points="301,41.18 310.76,197.83 301,275.39 291.24,197.83"
                                    fill="url(#flagNavySubtle)"
                                />
                                {/* Bead: semicircular bead along the rim, offset by 7.5° */}
                                <circle
                                    cx="334.7"
                                    cy="44.7"
                                    r="11.4"
                                    fill="url(#flagNavySubtle)"
                                />
                            </g>
                        ))}
                    </g>
                </svg>
            </div>
        </div>
    );
}
