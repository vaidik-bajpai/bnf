'use client';

import React from 'react';
import { ArrowRight, ChevronDown, Compass } from 'lucide-react';
import {
  WarpFieldBackground,
  type WarpFieldBackgroundProps,
} from '@/components/effects/warp-field/WarpFieldBackground';
import '@/components/effects/warp-field/styles.css';
import HeroChakraWheel from './HeroChakraWheel';
import HeroEmbers from './HeroEmbers';
import Navbar from '../Navbar';
import type { PageState } from '@/types/forum';

export interface HeroWithWarpFieldProps {
  /** Optional warp options override (speed, opacities, variant, fov, hue, brightness, saturation) */
  warpOptions?: WarpFieldBackgroundProps;
  /** Whether to render the App Navbar on top */
  showNavbar?: boolean;
  /** Whether to render the rotating Ashoka Chakra wheel */
  showChakraWheel?: boolean;
  /** Whether to render the ambient floating embers */
  showEmbers?: boolean;
  /** Custom title line 1 */
  titleLine1?: string;
  /** Custom title line 2 */
  titleLine2?: string;
  /** Custom subtitle */
  subtitle?: string;
  /** Callback when JOIN THE FRONT is clicked */
  onJoinClick?: () => void;
  /** Callback when OUR MISSION is clicked */
  onMissionClick?: () => void;
}

export default function HeroWithWarpField({
  warpOptions = {},
  showNavbar = true,
  showChakraWheel = true,
  showEmbers = true,
  titleLine1 = 'Bharat-Ganrajya',
  titleLine2 = 'Nationalists Front',
  subtitle = "Uniting for our nation's mission of civilizational renewal, unity, and progress across five millennia of living heritage.",
  onJoinClick,
  onMissionClick,
}: HeroWithWarpFieldProps) {
  const [pageState, setPageState] = React.useState<PageState>({ view: 'home' });

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between items-center overflow-hidden bg-[#02040A] text-white">
      {/* ================= OPTIONAL APP HEADER / NAVBAR ================= */}
      {showNavbar && (
        <Navbar
          pageState={pageState}
          onNavigate={(state) => setPageState(state)}
          onScrollToSection={scrollToSection}
          onOpenNewDiscussion={() => {}}
        />
      )}

      {/* ================= LAYER 0: WARP FIELD BACKGROUND ================= */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <WarpFieldBackground
          className="w-full h-full"
          {...warpOptions}
        />
        {/* Subtle Vignette & Atmospheric Gradients to Blend Warp Depth with Typography */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-[#02040A]/95 via-transparent to-[#02040A]/50" />
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-[#02040A]/40 via-transparent to-[#02040A]/40" />
      </div>

      {/* ================= LAYER 1: ANIMATED ASHOKA CHAKRA WHEEL ================= */}
      {showChakraWheel && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden z-10 opacity-75">
          <HeroChakraWheel />
        </div>
      )}

      {/* ================= LAYER 2: FLOATING EMBERS & PARTICLES ================= */}
      {showEmbers && <HeroEmbers />}

      {/* ================= LAYER 3: FOREGROUND HERO CONTENT & ACTIONS ================= */}
      <div className="relative z-20 max-w-4xl mx-auto text-center flex flex-col items-center justify-center my-auto px-4 pt-24 sm:pt-28">
        {/* Soft Radial Scrim behind Text for flawless readability and 3D depth */}
        <div
          className="absolute inset-0 -m-8 rounded-3xl pointer-events-none opacity-70 blur-3xl"
          style={{
            background:
              'radial-gradient(ellipse at center, rgba(2, 4, 10, 0.85) 0%, rgba(4, 10, 26, 0.5) 60%, transparent 85%)',
          }}
        />

        {/* Main Title Header */}
        <div className="relative z-10 flex flex-col items-center">
          <h1 className="leading-[1.12] text-center drop-shadow-[0_4px_30px_rgba(0,0,0,0.95)]">
            {/* Line 1: Bharat-Ganrajya in Golden Amber */}
            <span
              className="block text-[#FFB020] font-bold tracking-tight"
              style={{
                fontFamily: "'Fraunces', Georgia, serif",
                fontSize: 'clamp(2.2rem, 5.2vw, 4.4rem)',
                textShadow:
                  '0 2px 28px rgba(255, 176, 32, 0.65), 0 4px 45px rgba(0, 0, 0, 0.9)',
                letterSpacing: '-0.01em',
              }}
            >
              {titleLine1}
            </span>

            {/* Line 2: Nationalists Front in Crisp Bold White */}
            <span
              className="block text-white font-bold tracking-normal mt-0.5 sm:mt-1.5"
              style={{
                fontFamily: "'Fraunces', Georgia, serif",
                fontSize: 'clamp(2.4rem, 6.0vw, 5.0rem)',
                textShadow:
                  '0 4px 35px rgba(0, 0, 0, 0.95), 0 2px 12px rgba(255, 255, 255, 0.25)',
                letterSpacing: '-0.02em',
              }}
            >
              {titleLine2}
            </span>
          </h1>

          {/* Subtitle / Mission Statement */}
          <p
            className="text-white/90 text-xs sm:text-sm md:text-base max-w-xl mx-auto mt-3 sm:mt-4 leading-relaxed font-normal tracking-wide drop-shadow-[0_2px_12px_rgba(0,0,0,0.95)]"
            style={{
              fontFamily: "'Spectral', Georgia, serif",
            }}
          >
            {subtitle}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-4 mt-6 sm:mt-7 w-full max-w-md mx-auto">
            {/* 1. Primary Button: JOIN THE FRONT */}
            <button
              type="button"
              onClick={onJoinClick}
              className="w-full sm:w-auto px-7 py-3 rounded-md font-bold text-xs sm:text-sm tracking-wider uppercase transition-all duration-300 transform hover:scale-[1.03] active:scale-[0.98] cursor-pointer shadow-[0_0_25px_rgba(245,158,11,0.5)] hover:shadow-[0_0_35px_rgba(245,158,11,0.8)] flex items-center justify-center gap-2"
              style={{
                backgroundColor: '#E5A93C',
                color: '#0A1224',
              }}
            >
              <span>JOIN THE FRONT</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* 2. Secondary Button: OUR MISSION */}
            <button
              type="button"
              onClick={onMissionClick || (() => scrollToSection('about'))}
              className="w-full sm:w-auto px-7 py-3 rounded-md font-bold text-xs sm:text-sm tracking-wider uppercase text-white transition-all duration-300 transform hover:scale-[1.03] active:scale-[0.98] cursor-pointer border border-[#E5A93C]/80 bg-[#060D1E]/60 hover:bg-[#E5A93C]/15 backdrop-blur-md shadow-[0_0_15px_rgba(0,0,0,0.6)] hover:border-[#E5A93C] flex items-center justify-center gap-2"
            >
              <Compass className="w-4 h-4 text-[#E5A93C]" />
              <span>OUR MISSION</span>
            </button>
          </div>
        </div>
      </div>

      {/* ================= LAYER 4: BOTTOM SCROLL INDICATOR ================= */}
      <div className="relative z-20 mb-4 sm:mb-6 animate-bounce opacity-60 hover:opacity-100 transition-opacity">
        <button
          type="button"
          onClick={() => scrollToSection('awakening')}
          className="text-white/70 p-1.5 hover:text-[#E5A93C] transition-colors cursor-pointer"
          aria-label="Scroll to content"
        >
          <ChevronDown className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
