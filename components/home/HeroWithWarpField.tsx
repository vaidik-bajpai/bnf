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
import Navbar, { type NavbarSignInButtonStyle } from '../Navbar';
import type { PageState } from '@/types/forum';
import {
  LiquidMetalButton,
  RectangleButtons,
  ShaderButtons,
} from '@designcodeio/threeui';
import '@designcodeio/threeui/style.css';
import { IgnitionButton } from '@/src/components/ui/threeui/IgnitionButton';

export type HeroJoinButtonStyle =
  | 'amber-heritage'
  | 'liquid-metal'
  | 'bloom-outline'
  | 'ignition'
  | 'book-a-demo'
  | 'tricolor-beam'
  | 'cyber-glass'
  | 'monochrome-minimal';

export interface HeroWithWarpFieldProps {
  /** Optional warp options override (speed, opacities, variant, fov, hue, brightness, saturation, streakThickness) */
  warpOptions?: WarpFieldBackgroundProps;
  /** Direct warp variant shortcut (e.g. 'tricolor' | 'streaks' | 'hyperspace' | 'keycaps' | 'letters') */
  warpVariant?: WarpFieldBackgroundProps['variant'];
  /** Direct streak thickness shortcut in pixels */
  streakThickness?: number;
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
  /** Style variant for the primary "JOIN THE FRONT" button */
  joinButtonStyle?: HeroJoinButtonStyle;
  /** Custom label for the primary Join button */
  joinButtonLabel?: string;
  /** Size preset for the primary Join button ('sm' | 'md' | 'lg' | 'showcase') */
  joinButtonSize?: 'sm' | 'md' | 'lg' | 'showcase';
  /** Style variant for the Navbar "Sign In" button */
  signInButtonStyle?: NavbarSignInButtonStyle;
  /** Custom label for the Navbar Sign In button */
  signInButtonLabel?: string;
}

export default function HeroWithWarpField({
  warpOptions = {},
  warpVariant,
  streakThickness,
  showNavbar = true,
  showChakraWheel = true,
  showEmbers = true,
  titleLine1 = 'Bharat-Ganrajya',
  titleLine2 = 'Nationalists Front',
  subtitle = "Uniting for our nation's mission of civilizational renewal, unity, and progress across five millennia of living heritage.",
  onJoinClick,
  onMissionClick,
  joinButtonStyle = 'ignition',
  joinButtonLabel = 'JOIN THE FRONT',
  joinButtonSize = 'md',
  signInButtonStyle = 'default',
  signInButtonLabel = 'Sign In',
}: HeroWithWarpFieldProps) {
  const [pageState, setPageState] = React.useState<PageState>({ view: 'home' });

  const activeWarpOptions = {
    ...warpOptions,
    ...(warpVariant ? { variant: warpVariant } : {}),
    ...(streakThickness !== undefined ? { streakThickness } : {}),
  };

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
          signInButtonStyle={signInButtonStyle}
          signInButtonLabel={signInButtonLabel}
        />
      )}

      {/* ================= LAYER 0: WARP FIELD BACKGROUND ================= */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <WarpFieldBackground
          className="w-full h-full"
          {...activeWarpOptions}
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
            {/* 1. Primary Button: JOIN THE FRONT (Customizable) */}
            {(() => {
              switch (joinButtonStyle) {
                case 'liquid-metal':
                  return (
                    <div className="w-[200px] h-[58px] relative flex items-center justify-center">
                      <LiquidMetalButton
                        variant="pill"
                        text={joinButtonLabel}
                        embedded
                        onClick={onJoinClick}
                      />
                    </div>
                  );
                case 'bloom-outline':
                  return (
                    <div className="flex items-center justify-center">
                      <RectangleButtons
                        variant="bloom-outline-button"
                        label={joinButtonLabel}
                        mode="dark"
                        style={{ minHeight: 'auto', height: 'auto' }}
                        className="!min-h-0 !h-auto"
                        onClick={onJoinClick}
                      />
                    </div>
                  );
                case 'ignition':
                  return (
                    <div className="flex items-center justify-center">
                      <IgnitionButton
                        label={joinButtonLabel}
                        size={joinButtonSize}
                        onClick={onJoinClick}
                      />
                    </div>
                  );
                case 'book-a-demo':
                  return (
                    <div onClick={onJoinClick} className="flex items-center justify-center cursor-pointer">
                      <ShaderButtons
                        variant="book-a-demo"
                        mode="dark"
                      />
                    </div>
                  );
                case 'tricolor-beam':
                  return (
                    <button
                      type="button"
                      onClick={onJoinClick}
                      className="w-full sm:w-auto relative group p-[2px] rounded-lg overflow-hidden transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] shadow-[0_0_25px_rgba(255,153,51,0.45)] hover:shadow-[0_0_35px_rgba(255,153,51,0.75)] cursor-pointer"
                    >
                      <span className="absolute inset-0 bg-gradient-to-r from-[#FF9933] via-white to-[#138808] opacity-80 group-hover:opacity-100 transition-opacity animate-pulse" />
                      <span className="relative px-7 py-3 rounded-[6px] bg-[#02040A] text-white font-bold text-xs sm:text-sm tracking-wider uppercase flex items-center justify-center gap-2 border border-white/10 group-hover:bg-[#060D1E]/90 transition-colors">
                        <span>{joinButtonLabel}</span>
                        <ArrowRight className="w-4 h-4 text-[#FF9933] group-hover:translate-x-0.5 transition-transform" />
                      </span>
                    </button>
                  );
                case 'cyber-glass':
                  return (
                    <button
                      type="button"
                      onClick={onJoinClick}
                      className="w-full sm:w-auto px-7 py-3 rounded-lg font-bold text-xs sm:text-sm tracking-wider uppercase text-cyan-200 transition-all duration-300 transform hover:scale-[1.03] active:scale-[0.98] cursor-pointer border border-cyan-400/50 bg-gradient-to-r from-cyan-950/70 via-slate-900/80 to-cyan-950/70 hover:border-cyan-300 hover:text-white backdrop-blur-md shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.6)] flex items-center justify-center gap-2"
                    >
                      <span>{joinButtonLabel}</span>
                      <ArrowRight className="w-4 h-4 text-cyan-400" />
                    </button>
                  );
                case 'monochrome-minimal':
                  return (
                    <button
                      type="button"
                      onClick={onJoinClick}
                      className="w-full sm:w-auto px-7 py-3 rounded-none font-mono text-xs sm:text-sm tracking-[0.2em] uppercase text-black bg-white hover:bg-neutral-200 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.99] cursor-pointer shadow-[0_0_20px_rgba(255,255,255,0.4)] flex items-center justify-center gap-2 border border-white"
                    >
                      <span>{joinButtonLabel}</span>
                      <ArrowRight className="w-4 h-4 text-black" />
                    </button>
                  );
                case 'amber-heritage':
                default:
                  return (
                    <button
                      type="button"
                      onClick={onJoinClick}
                      className="w-full sm:w-auto px-7 py-3 rounded-md font-bold text-xs sm:text-sm tracking-wider uppercase transition-all duration-300 transform hover:scale-[1.03] active:scale-[0.98] cursor-pointer shadow-[0_0_25px_rgba(245,158,11,0.5)] hover:shadow-[0_0_35px_rgba(245,158,11,0.8)] flex items-center justify-center gap-2"
                      style={{
                        backgroundColor: '#E5A93C',
                        color: '#0A1224',
                      }}
                    >
                      <span>{joinButtonLabel}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  );
              }
            })()}

            {/* 2. Secondary Button: OUR MISSION */}
            <button
              type="button"
              onClick={onMissionClick || (() => scrollToSection('about'))}
              className={`w-full sm:w-auto px-7 font-bold text-xs sm:text-sm tracking-wider uppercase text-white transition-all duration-300 transform hover:scale-[1.03] active:scale-[0.98] cursor-pointer border border-[#E5A93C]/80 bg-[#060D1E]/60 hover:bg-[#E5A93C]/15 backdrop-blur-md shadow-[0_0_15px_rgba(0,0,0,0.6)] hover:border-[#E5A93C] flex items-center justify-center gap-2 ${
                joinButtonSize === 'sm'
                  ? 'h-[44px] rounded-[14px]'
                  : joinButtonSize === 'lg'
                  ? 'h-[64px] rounded-[22px]'
                  : joinButtonSize === 'showcase'
                  ? 'h-[78px] rounded-[24px]'
                  : 'h-[52px] rounded-[18px]'
              }`}
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
