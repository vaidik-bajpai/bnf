'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function HeroTricolorRibbons() {
  const containerRef = useRef<HTMLDivElement>(null);
  const saffronGroupRef = useRef<SVGGElement>(null);
  const whiteGroupRef = useRef<SVGGElement>(null);
  const greenGroupRef = useRef<SVGGElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      // 1. Initial smooth fade-in
      gsap.fromTo(
        containerRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 2.2, ease: 'power2.out' }
      );

      // 2. Continuous stroke dashoffset animation for light speed trails
      // We animate all dash-stream elements infinitely
      const dashStreams = containerRef.current?.querySelectorAll('.light-stream');
      if (dashStreams && dashStreams.length > 0) {
        gsap.to(dashStreams, {
          strokeDashoffset: -2000,
          duration: 12,
          repeat: -1,
          ease: 'none',
          stagger: {
            each: 0.8,
            from: 'random',
          },
        });
      }

      // 3. Gentle organic undulation of the ribbons (Sine-wave breathing)
      if (saffronGroupRef.current) {
        gsap.to(saffronGroupRef.current, {
          y: '+=14',
          x: '-=8',
          rotation: 0.6,
          duration: 4.8,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          transformOrigin: '80% 20%',
        });
      }

      if (whiteGroupRef.current) {
        gsap.to(whiteGroupRef.current, {
          y: '-=10',
          x: '+=6',
          rotation: -0.4,
          duration: 5.2,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          transformOrigin: '50% 40%',
        });
      }

      if (greenGroupRef.current) {
        gsap.to(greenGroupRef.current, {
          y: '-=12',
          x: '+=10',
          rotation: -0.8,
          duration: 5.6,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          transformOrigin: '20% 80%',
        });
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-none overflow-hidden select-none z-10"
      style={{ mixBlendMode: 'screen' }}
    >
      <svg
        viewBox="0 0 1920 1080"
        preserveAspectRatio="xMidYMid slice"
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* ================= FILTERS ================= */}
          <filter id="tricolorGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="8" result="blur1" />
            <feGaussianBlur stdDeviation="22" result="blur2" />
            <feGaussianBlur stdDeviation="40" result="blur3" />
            <feMerge>
              <feMergeNode in="blur3" />
              <feMergeNode in="blur2" />
              <feMergeNode in="blur1" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id="softRibbonBlur" x="-10%" y="-10%" width="120%" height="120%">
            <feGaussianBlur stdDeviation="14" />
          </filter>

          {/* ================= GRADIENTS ================= */}
          {/* SAFFRON (Top Right Flow) */}
          <linearGradient id="saffronGradMain" x1="100%" y1="0%" x2="20%" y2="80%">
            <stop offset="0%" stopColor="#FFA726" stopOpacity="0.95" />
            <stop offset="40%" stopColor="#FF7700" stopOpacity="0.85" />
            <stop offset="80%" stopColor="#D97706" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#92400E" stopOpacity="0" />
          </linearGradient>

          <linearGradient id="saffronGlowGrad" x1="100%" y1="10%" x2="30%" y2="70%">
            <stop offset="0%" stopColor="#FDBA74" stopOpacity="0.7" />
            <stop offset="50%" stopColor="#EA580C" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#7C2D12" stopOpacity="0" />
          </linearGradient>

          {/* WHITE / SILVER (Middle Flow) */}
          <linearGradient id="whiteGradMain" x1="100%" y1="10%" x2="10%" y2="90%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.98" />
            <stop offset="35%" stopColor="#F0F9FF" stopOpacity="0.85" />
            <stop offset="70%" stopColor="#7DD3FC" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#0284C7" stopOpacity="0" />
          </linearGradient>

          <linearGradient id="whiteGlowGrad" x1="100%" y1="0%" x2="20%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.6" />
            <stop offset="60%" stopColor="#38BDF8" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#0369A1" stopOpacity="0" />
          </linearGradient>

          {/* GREEN (Bottom Left Flow) */}
          <linearGradient id="greenGradMain" x1="0%" y1="100%" x2="80%" y2="20%">
            <stop offset="0%" stopColor="#00E676" stopOpacity="0.95" />
            <stop offset="45%" stopColor="#10B981" stopOpacity="0.8" />
            <stop offset="80%" stopColor="#059669" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#064E3B" stopOpacity="0" />
          </linearGradient>

          <linearGradient id="greenGlowGrad" x1="0%" y1="100%" x2="70%" y2="30%">
            <stop offset="0%" stopColor="#6EE7B7" stopOpacity="0.6" />
            <stop offset="50%" stopColor="#047857" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#022C22" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* ============================================================== */}
        {/* 1. SAFFRON RIBBON GROUP (Top Right)                             */}
        {/* ============================================================== */}
        <g ref={saffronGroupRef}>
          {/* Broad soft background color wash */}
          <path
            d="M 2000,-50 C 1700,20 1350,140 1050,290 C 850,390 600,480 350,560"
            fill="none"
            stroke="url(#saffronGlowGrad)"
            strokeWidth="110"
            filter="url(#softRibbonBlur)"
            strokeLinecap="round"
          />

          {/* Primary thick glowing ribbon */}
          <path
            d="M 1980,-20 C 1680,60 1360,160 1080,310 C 880,410 650,500 400,580"
            fill="none"
            stroke="url(#saffronGradMain)"
            strokeWidth="42"
            filter="url(#tricolorGlow)"
            strokeLinecap="round"
          />

          {/* Secondary bright core ribbon */}
          <path
            d="M 1970,-10 C 1670,70 1350,170 1070,320 C 870,420 640,510 390,590"
            fill="none"
            stroke="#FDE047"
            strokeWidth="12"
            strokeOpacity="0.85"
            filter="url(#tricolorGlow)"
            strokeLinecap="round"
          />

          {/* Animated Speed Stream Lines */}
          <path
            className="light-stream"
            d="M 1990,-40 C 1690,40 1370,140 1090,290 C 890,390 660,480 410,560"
            fill="none"
            stroke="#FFFBEB"
            strokeWidth="4"
            strokeDasharray="140 380"
            strokeLinecap="round"
          />
          <path
            className="light-stream"
            d="M 1960,10 C 1660,90 1340,190 1060,340 C 860,440 630,530 380,610"
            fill="none"
            stroke="#F59E0B"
            strokeWidth="5"
            strokeDasharray="90 260"
            strokeLinecap="round"
          />
          <path
            className="light-stream"
            d="M 1940,30 C 1640,110 1320,210 1040,360 C 840,460 610,550 360,630"
            fill="none"
            stroke="#EA580C"
            strokeWidth="3"
            strokeDasharray="180 420"
            strokeLinecap="round"
          />
        </g>

        {/* ============================================================== */}
        {/* 2. WHITE / SILVER RIBBON GROUP (Center / Middle)                 */}
        {/* ============================================================== */}
        <g ref={whiteGroupRef}>
          {/* Broad soft aura */}
          <path
            d="M 1950,90 C 1620,180 1280,280 980,440 C 740,560 500,660 200,740"
            fill="none"
            stroke="url(#whiteGlowGrad)"
            strokeWidth="90"
            filter="url(#softRibbonBlur)"
            strokeLinecap="round"
          />

          {/* Primary thick glowing white ribbon */}
          <path
            d="M 1940,110 C 1600,200 1260,300 960,460 C 720,580 480,680 180,760"
            fill="none"
            stroke="url(#whiteGradMain)"
            strokeWidth="34"
            filter="url(#tricolorGlow)"
            strokeLinecap="round"
          />

          {/* Pure white radiant core */}
          <path
            d="M 1930,120 C 1590,210 1250,310 950,470 C 710,590 470,690 170,770"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="10"
            strokeOpacity="0.95"
            filter="url(#tricolorGlow)"
            strokeLinecap="round"
          />

          {/* Animated Speed Stream Lines */}
          <path
            className="light-stream"
            d="M 1945,100 C 1605,190 1265,290 965,450 C 725,570 485,670 185,750"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="4"
            strokeDasharray="160 320"
            strokeLinecap="round"
          />
          <path
            className="light-stream"
            d="M 1920,140 C 1580,230 1240,330 940,490 C 700,610 460,710 160,790"
            fill="none"
            stroke="#BAE6FD"
            strokeWidth="3.5"
            strokeDasharray="100 240"
            strokeLinecap="round"
          />
        </g>

        {/* ============================================================== */}
        {/* 3. GREEN RIBBON GROUP (Bottom Left)                             */}
        {/* ============================================================== */}
        <g ref={greenGroupRef}>
          {/* Broad soft aura */}
          <path
            d="M -50,950 C 220,900 520,840 820,740 C 1080,640 1340,510 1650,380"
            fill="none"
            stroke="url(#greenGlowGrad)"
            strokeWidth="100"
            filter="url(#softRibbonBlur)"
            strokeLinecap="round"
          />

          {/* Primary thick glowing green ribbon */}
          <path
            d="M -30,920 C 240,870 540,810 840,710 C 1100,610 1360,480 1670,350"
            fill="none"
            stroke="url(#greenGradMain)"
            strokeWidth="38"
            filter="url(#tricolorGlow)"
            strokeLinecap="round"
          />

          {/* High-intensity green-cyan core */}
          <path
            d="M -20,910 C 250,860 550,800 850,700 C 1110,600 1370,470 1680,340"
            fill="none"
            stroke="#6EE7B7"
            strokeWidth="11"
            strokeOpacity="0.9"
            filter="url(#tricolorGlow)"
            strokeLinecap="round"
          />

          {/* Animated Speed Stream Lines */}
          <path
            className="light-stream"
            d="M -40,935 C 230,885 530,825 830,725 C 1090,625 1350,495 1660,365"
            fill="none"
            stroke="#A7F3D0"
            strokeWidth="4"
            strokeDasharray="150 350"
            strokeLinecap="round"
          />
          <path
            className="light-stream"
            d="M -10,895 C 260,845 560,785 860,685 C 1120,585 1380,455 1690,325"
            fill="none"
            stroke="#10B981"
            strokeWidth="5"
            strokeDasharray="110 270"
            strokeLinecap="round"
          />
          <path
            className="light-stream"
            d="M 10,875 C 280,825 580,765 880,665 C 1140,565 1400,435 1710,305"
            fill="none"
            stroke="#059669"
            strokeWidth="3"
            strokeDasharray="200 450"
            strokeLinecap="round"
          />
        </g>

        {/* Ambient floating spark particles flowing along the slipstream */}
        <g id="spark-particles" opacity="0.8">
          <circle cx="1400" cy="180" r="3.5" fill="#FDE047" className="animate-ping" style={{ animationDuration: '3s' }} />
          <circle cx="1180" cy="270" r="2.5" fill="#FFA726" className="animate-pulse" />
          <circle cx="1020" cy="430" r="4" fill="#FFFFFF" className="animate-pulse" style={{ animationDuration: '2.5s' }} />
          <circle cx="850" cy="510" r="3" fill="#BAE6FD" />
          <circle cx="620" cy="740" r="3.5" fill="#6EE7B7" className="animate-ping" style={{ animationDuration: '4s' }} />
          <circle cx="430" cy="810" r="2.5" fill="#10B981" />
          <circle cx="1520" cy="380" r="3" fill="#6EE7B7" />
        </g>
      </svg>
    </div>
  );
}
