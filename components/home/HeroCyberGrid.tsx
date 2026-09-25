'use client';

import React from 'react';

export default function HeroCyberGrid() {
  // Generate perspective grid lines mathematically for crisp rendering
  const horizonY = 560;
  const bottomY = 1080;
  const vpX = 960; // Center vanishing point

  // Perspective radiating rays from horizon vanishing point to bottom
  const rayAngles = [
    -1200, -950, -750, -580, -430, -300, -180, -80, 0,
    80, 180, 300, 430, 580, 750, 950, 1200
  ];

  // Exponentially spaced horizontal transverse grid lines
  const horizontalSteps = 16;
  const horizontalLines = Array.from({ length: horizontalSteps }, (_, i) => {
    const t = Math.pow((i + 1) / horizontalSteps, 2.3);
    return horizonY + t * (bottomY - horizonY);
  });

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <svg
        viewBox="0 0 1920 1080"
        preserveAspectRatio="xMidYMid slice"
        className="w-full h-full opacity-60"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Cyan glow for perspective grid */}
          <linearGradient id="gridLineGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#00E5FF" stopOpacity="0.05" />
            <stop offset="40%" stopColor="#00E5FF" stopOpacity="0.35" />
            <stop offset="85%" stopColor="#38BDF8" stopOpacity="0.65" />
            <stop offset="100%" stopColor="#0284C7" stopOpacity="0.1" />
          </linearGradient>

          {/* Saffron / Cyan horizon glow flare */}
          <radialGradient id="horizonFlare" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#00E5FF" stopOpacity="0.45" />
            <stop offset="35%" stopColor="#0284C7" stopOpacity="0.2" />
            <stop offset="70%" stopColor="#FF9933" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#030712" stopOpacity="0" />
          </radialGradient>

          {/* Fade mask for grid sides */}
          <linearGradient id="gridSideMask" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#000" stopOpacity="0.1" />
            <stop offset="20%" stopColor="#000" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#000" stopOpacity="1" />
            <stop offset="80%" stopColor="#000" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#000" stopOpacity="0.1" />
          </linearGradient>

          <mask id="gridHorizontalFade">
            <rect x="0" y={horizonY - 20} width="1920" height={bottomY - horizonY + 20} fill="url(#gridSideMask)" />
          </mask>
        </defs>

        {/* Horizon glowing light bar */}
        <line
          x1="0"
          y1={horizonY}
          x2="1920"
          y2={horizonY}
          stroke="#00E5FF"
          strokeWidth="1.5"
          strokeOpacity="0.5"
          filter="drop-shadow(0 0 8px #00E5FF)"
        />

        {/* Soft horizon aura */}
        <ellipse
          cx={vpX}
          cy={horizonY + 30}
          rx="650"
          ry="110"
          fill="url(#horizonFlare)"
        />

        {/* Perspective Grid Body */}
        <g mask="url(#gridHorizontalFade)">
          {/* Radiating Perspective Lines */}
          {rayAngles.map((xOffset, idx) => {
            const endX = vpX + xOffset * 1.8;
            return (
              <line
                key={`ray-${idx}`}
                x1={vpX + xOffset * 0.15}
                y1={horizonY}
                x2={endX}
                y2={bottomY}
                stroke="url(#gridLineGrad)"
                strokeWidth={Math.abs(xOffset) < 350 ? "1.5" : "1.2"}
              />
            );
          })}

          {/* Horizontal Transverse Lines */}
          {horizontalLines.map((yVal, idx) => {
            const t = (yVal - horizonY) / (bottomY - horizonY);
            const opacity = 0.1 + t * 0.5;
            const strokeWidth = 0.8 + t * 1.2;
            return (
              <line
                key={`h-line-${idx}`}
                x1="0"
                y1={yVal}
                x2="1920"
                y2={yVal}
                stroke="#00E5FF"
                strokeOpacity={opacity}
                strokeWidth={strokeWidth}
              />
            );
          })}
        </g>
      </svg>
    </div>
  );
}
