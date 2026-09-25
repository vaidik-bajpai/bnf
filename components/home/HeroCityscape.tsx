'use client';

import React from 'react';

export default function HeroCityscape() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <svg
        viewBox="0 0 1920 1080"
        preserveAspectRatio="xMidYMid slice"
        className="w-full h-full opacity-75"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Cyan building gradient fill */}
          <linearGradient id="cityBuildingGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#0B1B3D" stopOpacity="0.85" />
            <stop offset="50%" stopColor="#07132B" stopOpacity="0.92" />
            <stop offset="100%" stopColor="#040A1A" stopOpacity="0.98" />
          </linearGradient>

          {/* Building edge glow */}
          <linearGradient id="buildingEdgeCyan" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#00E5FF" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#38BDF8" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#0284C7" stopOpacity="0.1" />
          </linearGradient>

          <linearGradient id="windowPatternGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#7DD3FC" stopOpacity="0.65" />
            <stop offset="100%" stopColor="#0284C7" stopOpacity="0.15" />
          </linearGradient>

          <pattern id="cityWindows" width="12" height="18" patternUnits="userSpaceOnUse">
            <rect x="2" y="3" width="3" height="4" fill="#38BDF8" fillOpacity="0.4" />
            <rect x="7" y="3" width="3" height="4" fill="#7DD3FC" fillOpacity="0.6" />
            <rect x="2" y="10" width="3" height="4" fill="#00E5FF" fillOpacity="0.5" />
            <rect x="7" y="10" width="3" height="4" fill="#38BDF8" fillOpacity="0.3" />
          </pattern>
        </defs>

        {/* ================= LEFT CITY SKYLINE ================= */}
        <g id="left-skyline" className="transition-all duration-700">
          {/* Far Skyscraper 1 */}
          <path
            d="M 40,700 L 40,320 L 110,260 L 170,260 L 170,700 Z"
            fill="url(#cityBuildingGrad)"
            stroke="url(#buildingEdgeCyan)"
            strokeWidth="1.2"
          />
          <rect x="55" y="340" width="100" height="320" fill="url(#cityWindows)" opacity="0.35" />

          {/* Tall Signature Skyscraper (Left 2 - Diagonal Crown) */}
          <path
            d="M 140,750 L 140,210 L 220,150 L 290,190 L 290,750 Z"
            fill="url(#cityBuildingGrad)"
            stroke="url(#buildingEdgeCyan)"
            strokeWidth="1.5"
            filter="drop-shadow(0 0 10px rgba(0, 229, 255, 0.25))"
          />
          {/* Vertical light spine */}
          <line x1="215" y1="155" x2="215" y2="700" stroke="#00E5FF" strokeWidth="1.5" strokeOpacity="0.7" />
          <rect x="155" y="230" width="50" height="460" fill="url(#cityWindows)" opacity="0.5" />
          <rect x="225" y="220" width="50" height="470" fill="url(#cityWindows)" opacity="0.4" />
          {/* Antenna beacon */}
          <line x1="220" y1="150" x2="220" y2="100" stroke="#00E5FF" strokeWidth="1.5" />
          <circle cx="220" cy="100" r="3" fill="#38BDF8" className="animate-pulse" />

          {/* Mid Skyscraper 3 */}
          <path
            d="M 270,720 L 270,290 L 350,290 L 370,330 L 370,720 Z"
            fill="url(#cityBuildingGrad)"
            stroke="url(#buildingEdgeCyan)"
            strokeWidth="1.2"
          />
          <rect x="285" y="320" width="70" height="380" fill="url(#cityWindows)" opacity="0.45" />

          {/* Near Lower Complex 4 */}
          <path
            d="M 340,740 L 340,410 L 430,410 L 430,740 Z"
            fill="url(#cityBuildingGrad)"
            stroke="url(#buildingEdgeCyan)"
            strokeWidth="1.2"
          />
          <rect x="355" y="430" width="60" height="290" fill="url(#cityWindows)" opacity="0.35" />
        </g>

        {/* ================= RIGHT CITY SKYLINE ================= */}
        <g id="right-skyline" className="transition-all duration-700">
          {/* Mid Skyscraper 1 */}
          <path
            d="M 1520,740 L 1520,430 L 1590,430 L 1610,460 L 1610,740 Z"
            fill="url(#cityBuildingGrad)"
            stroke="url(#buildingEdgeCyan)"
            strokeWidth="1.2"
          />
          <rect x="1535" y="450" width="60" height="270" fill="url(#cityWindows)" opacity="0.35" />

          {/* Stepped Skyscraper 2 */}
          <path
            d="M 1580,720 L 1580,310 L 1660,310 L 1660,720 Z"
            fill="url(#cityBuildingGrad)"
            stroke="url(#buildingEdgeCyan)"
            strokeWidth="1.2"
          />
          <rect x="1595" y="330" width="50" height="370" fill="url(#cityWindows)" opacity="0.45" />

          {/* Tall Signature Skyscraper (Right 3) */}
          <path
            d="M 1640,750 L 1640,230 L 1710,180 L 1780,210 L 1780,750 Z"
            fill="url(#cityBuildingGrad)"
            stroke="url(#buildingEdgeCyan)"
            strokeWidth="1.5"
            filter="drop-shadow(0 0 10px rgba(0, 229, 255, 0.25))"
          />
          {/* Vertical light spine */}
          <line x1="1710" y1="185" x2="1710" y2="700" stroke="#00E5FF" strokeWidth="1.5" strokeOpacity="0.7" />
          <rect x="1655" y="250" width="45" height="440" fill="url(#cityWindows)" opacity="0.5" />
          <rect x="1720" y="240" width="45" height="450" fill="url(#cityWindows)" opacity="0.4" />
          {/* Antenna beacon */}
          <line x1="1710" y1="180" x2="1710" y2="120" stroke="#00E5FF" strokeWidth="1.5" />
          <circle cx="1710" cy="120" r="3" fill="#38BDF8" className="animate-pulse" />

          {/* Edge Skyscraper 4 */}
          <path
            d="M 1760,720 L 1760,340 L 1830,290 L 1890,340 L 1890,720 Z"
            fill="url(#cityBuildingGrad)"
            stroke="url(#buildingEdgeCyan)"
            strokeWidth="1.2"
          />
          <rect x="1775" y="360" width="100" height="340" fill="url(#cityWindows)" opacity="0.35" />
        </g>
      </svg>
    </div>
  );
}
