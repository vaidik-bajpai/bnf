'use client';

import React, { useState, useRef, useCallback } from 'react';
import {
  Sparkles,
  Maximize2,
  Activity,
  Cpu,
  Sliders,
  Eye,
  RefreshCw,
  Layers,
  Terminal,
  ChevronDown,
  Check,
  Palette,
  Minimize2,
} from 'lucide-react';
import DitherVeil, {
  type DitherPattern,
  type DitherPalette,
  type DitherFit,
  type DitherTintStyle,
} from '@/components/DitherVeil';
import { ConstellationField } from "@designcodeio/threeui";
import "@designcodeio/threeui/style.css";

export interface DitherVeilPageProps {
  /** Source image for the dither head (default: '/dither-head.jpg') */
  src?: string;
  /** Image fitting mode (default: 'contain') */
  fit?: DitherFit;
  /** Active dithering algorithm (default: 'lines' for high-density engraving; 'floyd' for error diffusion) */
  pattern?: DitherPattern;
  /** Size of each dither pixel block in screen pixels (default: 1 for high density) */
  pixelSize?: number;
  /** Quantization levels (default: 2) */
  levels?: number;
  /** Color palette type (default: 'duotone') */
  palette?: DitherPalette;
  /** Primary dark/ink color (default: '#000000' for pitch black) */
  inkColor?: string;
  /** Primary light/paper color (default: '#e2e8f0' for Silver Head) */
  paperColor?: string;
  /** Shading contrast multiplier (default: 1.35) */
  contrast?: number;
  /** Shading brightness offset (default: 0) */
  brightness?: number;
  /** Radius of pointer hover reveal in pixels (default: 220) */
  revealRadius?: number;
  /** Edge softness for reveal brush (default: 0.6) */
  softness?: number;
  /** Decay duration of reveal trail in seconds (default: 1.2) */
  linger?: number;
  /** Highlight rim edge color */
  rimColor?: string;
  /** Highlight rim intensity (default: 0.08) */
  rim?: number;
  /** Invert reveal mask */
  reverse?: boolean;
  /** Whether cursor wanders autonomously when idle */
  wander?: boolean;
  /** Emit expanding shockwave ripple rings on pointer clicks (default: true) */
  clickBurst?: boolean;

  /**
   * Scale multiplier for the centered head (default: 0.65 for reduced size, 1.0 for full contain).
   * The head remains mathematically FIXED in the exact optical center of the page regardless of scale.
   */
  scale?: number;

  /**
   * Color applied to the underlying revealed face when tintStyle is 'single'
   */
  underlyingColor?: string;

  /**
   * Blend factor for the underlying face tint (0.0 = raw photo, 1.0 = fully tinted metallic face).
   */
  underlyingTint?: number;

  /**
   * Tint mode: 'single' for uniform tinting, 'chromatic' for multi-stop harmonic gradient
   */
  tintStyle?: DitherTintStyle;

  /**
   * Chromatic highlight tone (e.g. '#ff7a00' for vibrant sunset/saffron orange)
   */
  tintHighlight?: string;

  /**
   * Chromatic midtone tone (e.g. '#10b981' for rich emerald green/jade)
   */
  tintMidtone?: string;

  /**
   * Chromatic shadow tone (e.g. '#041e24' for complementary midnight abyssal teal/navy)
   */
  tintShadow?: string;

  /**
   * Chromatic specular peak (e.g. '#fff2a3' for sunfire champagne gold)
   */
  tintPeak?: string;

  /**
   * Periodic tint wash sweeping vertically from bottom to top across the head (default: true)
   */
  washEnabled?: boolean;

  /**
   * Duration of one full bottom-to-top wash cycle in seconds (default: 4.5)
   */
  washPeriod?: number;

  /**
   * Width of the sweeping wash band in normalized UV space (default: 0.35)
   */
  washWidth?: number;

  /**
   * Peak opacity / intensity of the periodic wash wave (default: 0.95)
   */
  washIntensity?: number;

  /**
   * Use smooth continuous Hermite edge dissolve instead of pixelated Bayer 'x' pattern (default: true)
   */
  smoothReveal?: boolean;

  /**
   * Whether hovering/moving the cursor unmasks the head (default: false, so only the periodic wash animation animates)
   */
  cursorEnabled?: boolean;

  // Gateway Flow (ConstellationField) Composition Background
  /** Whether to render the Gateway Flow ConstellationField streaming trajectories behind the head (default: true) */
  showGatewayFlow?: boolean;
  /** Speed multiplier for Gateway Flow streaming trajectories (default: 1.0) */
  gatewaySpeed?: number;
  /** Size multiplier for Gateway Flow particles and trajectory paths (default: 1.0) */
  gatewaySize?: number;
  /** Length scale for Gateway Flow trajectory curves (default: 1.0) */
  gatewayLength?: number;
  /** Density scale for Gateway Flow paths (default: 1.0) */
  gatewayDensity?: number;
  /** Opacity for Gateway Flow field (default: 1.0) */
  gatewayOpacity?: number;
  /** Hue rotation in degrees for Gateway Flow (default: 0) */
  gatewayHue?: number;
  /** Saturation for Gateway Flow (default: 1.0) */
  gatewaySaturation?: number;
  /** Brightness for Gateway Flow (default: 1.0) */
  gatewayBrightness?: number;

  // Composition / Page Configuration
  /** Whether to render top navigation bar */
  showNavbar?: boolean;
  /** Whether to show hero typography and action buttons */
  showHeroText?: boolean;
  /** Whether to show technical specification cards */
  showSpecs?: boolean;
  /** Whether to show the on-page interactive control deck */
  showControlDeck?: boolean;
  /** Whether to show technical deep-dive architectural feature cards */
  showFeatures?: boolean;
  /** Whether to render the page footer */
  showFooter?: boolean;
  /** Custom hero headline */
  title?: string;
  /** Custom hero subtitle */
  subtitle?: string;
  /** Tagline or protocol badge text */
  badgeText?: string;
  /** Additional custom className */
  className?: string;
}

const COLOR_PRESETS = [
  { name: 'Silver Head', paper: '#e2e8f0', ink: '#000000', rim: '#00f5d4', rimVal: 0.1 },
  { name: 'Pitch Void', paper: '#ffffff', ink: '#000000', rim: '#38bdf8', rimVal: 0 },
  { name: 'Vedic Amber', paper: '#f59e0b', ink: '#000000', rim: '#d97706', rimVal: 0.08 },
  { name: 'Electric Cyan', paper: '#38bdf8', ink: '#000000', rim: '#0284c7', rimVal: 0.12 },
  { name: 'Emerald Matrix', paper: '#10b981', ink: '#000000', rim: '#059669', rimVal: 0.08 },
];

export interface UnderlyingChromaPreset {
  name: string;
  style: 'single' | 'chromatic';
  color?: string;
  highlight?: string;
  midtone?: string;
  shadow?: string;
  peak?: string;
  rimColor?: string;
  tint: number;
  desc: string;
  swatchGradient: string;
}

const UNDERLYING_PRESETS: UnderlyingChromaPreset[] = [
  {
    name: 'Orange & Emerald Harmonic',
    style: 'chromatic',
    highlight: '#ff7a00',
    midtone: '#10b981',
    shadow: '#041e24',
    peak: '#fff2a3',
    rimColor: '#00f5d4',
    tint: 0.95,
    desc: 'Sunset orange highlights, emerald green contours, deep midnight teal shadows & turquoise rim',
    swatchGradient: 'linear-gradient(135deg, #ff7a00, #10b981, #041e24)',
  },
  {
    name: 'Sunset Jade Triad',
    style: 'chromatic',
    highlight: '#ea580c',
    midtone: '#059669',
    shadow: '#08131f',
    peak: '#fef08a',
    rimColor: '#38bdf8',
    tint: 0.9,
    desc: 'Tangerine orange brow & crests, jade green cheeks, obsidian navy shadows & sky cyan rim',
    swatchGradient: 'linear-gradient(135deg, #ea580c, #059669, #08131f)',
  },
  {
    name: 'Cyberpunk Acid Fire',
    style: 'chromatic',
    highlight: '#ff5500',
    midtone: '#22c55e',
    shadow: '#1a0526',
    peak: '#fef9c3',
    rimColor: '#00f0ff',
    tint: 0.95,
    desc: 'High-voltage electric orange, acid lime-green midtones, dark plum shadows & neon rim',
    swatchGradient: 'linear-gradient(135deg, #ff5500, #22c55e, #1a0526)',
  },
  {
    name: 'Polished Silver Chrome',
    style: 'single',
    color: '#e2e8f0',
    rimColor: '#38bdf8',
    tint: 0.95,
    desc: 'Uniform lustrous chrome silver metallization',
    swatchGradient: 'linear-gradient(135deg, #f8fafc, #cbd5e1, #64748b)',
  },
  {
    name: 'Cold Titanium',
    style: 'single',
    color: '#93c5fd',
    rimColor: '#0284c7',
    tint: 0.85,
    desc: 'Chilled blue-silver aerospace alloy undertone',
    swatchGradient: 'linear-gradient(135deg, #bfdbfe, #93c5fd, #1e3a8a)',
  },
  {
    name: 'Raw Photographic',
    style: 'single',
    color: '#ffffff',
    rimColor: '#38bdf8',
    tint: 0.0,
    desc: 'Original warm classical sculpture photo (untinted)',
    swatchGradient: 'linear-gradient(135deg, #fef3c7, #d97706, #78350f)',
  },
];

const PATTERNS: { id: DitherPattern; label: string; desc: string }[] = [
  { id: 'lines', label: 'Engraving Lines', desc: 'High-density banknote contour (1px)' },
  { id: 'floyd', label: 'Floyd-Steinberg', desc: 'Spatial error diffusion' },
  { id: 'atkinson', label: 'Atkinson', desc: 'Classic 1-bit high-contrast' },
  { id: 'bayer', label: 'Bayer Matrix', desc: '8×8 ordered halftone grid' },
  { id: 'noise', label: 'Blue Noise', desc: '64×64 void-and-cluster matrix' },
];

const SCALE_PRESETS = [
  { label: 'Compact', value: 0.5, desc: '50% scale, deep void margins' },
  { label: 'Reduced', value: 0.65, desc: '65% scale, optimal focal balance' },
  { label: 'Standard', value: 0.85, desc: '85% scale, prominent presence' },
  { label: 'Full', value: 1.0, desc: '100% scale, screen-edge contain' },
];

export const DitherVeilPage: React.FC<DitherVeilPageProps> = ({
  src = '/dither-head.jpg',
  fit = 'contain',
  pattern: initialPattern = 'lines',
  pixelSize: initialPixelSize = 1,
  levels = 2,
  palette = 'duotone',
  inkColor: initialInkColor = '#000000',
  paperColor: initialPaperColor = '#e2e8f0',
  contrast = 1.35,
  brightness = 0,
  revealRadius = 220,
  softness = 0.6,
  linger = 1.2,
  rimColor: initialRimColor = '#00f5d4',
  rim: initialRim = 0.1,
  reverse: initialReverse = false,
  wander = false,
  clickBurst = true,

  scale: initialScale = 0.65,
  underlyingColor: initialUnderlyingColor = '#e2e8f0',
  underlyingTint: initialUnderlyingTint = 0.95,
  tintStyle: initialTintStyle = 'chromatic',
  tintHighlight: initialTintHighlight = '#ff7a00',
  tintMidtone: initialTintMidtone = '#10b981',
  tintShadow: initialTintShadow = '#041e24',
  tintPeak: initialTintPeak = '#fff2a3',

  washEnabled: initialWashEnabled = true,
  washPeriod: initialWashPeriod = 4.5,
  washWidth = 0.35,
  washIntensity = 0.95,
  smoothReveal: initialSmoothReveal = true,
  cursorEnabled: initialCursorEnabled = false,

  showGatewayFlow: initialShowGatewayFlow = true,
  gatewaySpeed = 1.0,
  gatewaySize = 1.0,
  gatewayLength = 1.0,
  gatewayDensity = 1.0,
  gatewayOpacity = 1.0,
  gatewayHue = 0,
  gatewaySaturation = 1.0,
  gatewayBrightness = 1.0,

  showNavbar = true,
  showHeroText = true,
  showSpecs = true,
  showControlDeck = true,
  showFeatures = true,
  showFooter = true,
  title = 'EMERALD // SOL',
  subtitle = 'High-density 1px micro-engraving on silver head with harmonic orange & emerald chromatic unmasking in pitch-black void.',
  badgeText = 'CHROMATIC HARMONIC // ORANGE & GREEN',
  className = '',
}) => {
  // Live on-page state overrides
  const [activeGatewayFlow, setActiveGatewayFlow] = useState<boolean>(initialShowGatewayFlow);
  const [activeGatewaySpeed, setActiveGatewaySpeed] = useState<number>(gatewaySpeed);
  const [activeGatewayDensity, setActiveGatewayDensity] = useState<number>(gatewayDensity);

  const [activePattern, setActivePattern] = useState<DitherPattern>(initialPattern);
  const [activePixelSize, setActivePixelSize] = useState<number>(initialPixelSize);
  const [activePaperColor, setActivePaperColor] = useState<string>(initialPaperColor);
  const [activeInkColor] = useState<string>(initialInkColor);
  const [activeRimColor, setActiveRimColor] = useState<string>(initialRimColor);
  const [activeRim, setActiveRim] = useState<number>(initialRim);
  const [activeReverse, setActiveReverse] = useState<boolean>(initialReverse);
  const [activeClickBurst, setActiveClickBurst] = useState<boolean>(clickBurst);
  const [activeScale, setActiveScale] = useState<number>(initialScale);
  const [activeUnderlyingColor, setActiveUnderlyingColor] = useState<string>(initialUnderlyingColor);
  const [activeUnderlyingTint, setActiveUnderlyingTint] = useState<number>(initialUnderlyingTint);

  const [activeTintStyle, setActiveTintStyle] = useState<DitherTintStyle>(initialTintStyle);
  const [activeTintHighlight, setActiveTintHighlight] = useState<string>(initialTintHighlight);
  const [activeTintMidtone, setActiveTintMidtone] = useState<string>(initialTintMidtone);
  const [activeTintShadow, setActiveTintShadow] = useState<string>(initialTintShadow);
  const [activeTintPeak, setActiveTintPeak] = useState<string>(initialTintPeak);

  const [activeWashEnabled, setActiveWashEnabled] = useState<boolean>(initialWashEnabled);
  const [activeWashPeriod, setActiveWashPeriod] = useState<number>(initialWashPeriod);
  const [activeSmoothReveal, setActiveSmoothReveal] = useState<boolean>(initialSmoothReveal);
  const [activeCursorEnabled, setActiveCursorEnabled] = useState<boolean>(initialCursorEnabled);

  const heroRef = useRef<HTMLDivElement>(null);

  // Trigger shockwave simulation by dispatching a synthetic pointerdown on hero center
  const handleTriggerShockwave = useCallback(() => {
    if (!heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const event = new PointerEvent('pointerdown', {
      clientX: centerX,
      clientY: centerY,
      bubbles: true,
      cancelable: true,
      pointerType: 'mouse',
      button: 0,
    });
    heroRef.current.dispatchEvent(event);
  }, []);

  const cyclePattern = useCallback(() => {
    const ids: DitherPattern[] = ['lines', 'floyd', 'atkinson', 'bayer', 'noise'];
    const nextIdx = (ids.indexOf(activePattern) + 1) % ids.length;
    setActivePattern(ids[nextIdx]);
  }, [activePattern]);

  const applyUnderlyingPreset = (preset: UnderlyingChromaPreset) => {
    setActiveTintStyle(preset.style);
    setActiveUnderlyingTint(preset.tint);
    if (preset.rimColor) setActiveRimColor(preset.rimColor);
    if (preset.style === 'chromatic') {
      if (preset.highlight) setActiveTintHighlight(preset.highlight);
      if (preset.midtone) setActiveTintMidtone(preset.midtone);
      if (preset.shadow) setActiveTintShadow(preset.shadow);
      if (preset.peak) setActiveTintPeak(preset.peak);
    } else {
      if (preset.color) setActiveUnderlyingColor(preset.color);
    }
  };

  return (
    <div
      className={`min-h-screen w-full text-white selection:bg-white selection:text-black flex flex-col font-sans ${className}`}
      style={{ backgroundColor: '#000000' }}
    >
      {/* ─────────────────────────────────────────────────────────────
          1. NAVIGATION BAR
          ───────────────────────────────────────────────────────────── */}
      {!activeGatewayFlow && showNavbar && (
        <header
          className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 backdrop-blur-md"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.75)' }}
        >
          <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
            {/* Brand Logo & Status */}
            <div className="flex items-center gap-4">
              <a href="#hero" className="flex items-center gap-2 group">
                <span className="font-mono text-sm tracking-widest font-bold text-white group-hover:text-neutral-300 transition-colors">
                  DITHER<span className="text-neutral-500 mx-1">//</span>VEIL
                </span>
              </a>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase bg-neutral-900 border border-neutral-800 text-neutral-300">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                ORANGE & EMERALD CHROMA
              </span>
            </div>

            {/* Nav Links */}
            <nav className="hidden md:flex items-center gap-8 text-xs font-mono tracking-wider text-neutral-400">
              <a href="#hero" className="hover:text-white transition-colors">
                01 // COMPOSITION
              </a>
              <a href="#specs" className="hover:text-white transition-colors">
                02 // SPECS
              </a>
              <a href="#controls" className="hover:text-white transition-colors">
                03 // MATRIX DECK
              </a>
              <a href="#architecture" className="hover:text-white transition-colors">
                04 // THEORY
              </a>
            </nav>

            {/* Quick Action */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleTriggerShockwave}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono tracking-wider bg-white/5 hover:bg-white/10 text-white border border-white/15 transition-all active:scale-95 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-orange-400" />
                <span>PULSE SHOCKWAVE</span>
              </button>
            </div>
          </div>
        </header>
      )}

      {/* ─────────────────────────────────────────────────────────────
          2. HERO VIEWPORT: CENTERED DITHERVEIL HEAD IN PITCH BLACK VOID
          ───────────────────────────────────────────────────────────── */}
      <section
        id="hero"
        ref={heroRef}
        className="relative w-full h-screen min-h-[640px] flex items-center justify-center overflow-hidden"
        style={{ backgroundColor: '#000000' }}
      >
        {/* Gateway Flow - Streaming Constellation Field Trajectories */}
        {activeGatewayFlow && (
          <div className="absolute inset-0 w-full h-full z-0 pointer-events-auto">
            <ConstellationField
              variant="gateway-flow"
              mode="dark"
              speed={activeGatewaySpeed}
              size={gatewaySize}
              length={gatewayLength}
              density={activeGatewayDensity}
              opacity={gatewayOpacity}
              hue={gatewayHue}
              saturation={gatewaySaturation}
              brightness={gatewayBrightness}
            />
          </div>
        )}

        {/* Fullscreen DitherVeil Shader Container */}
        <div className="absolute inset-0 w-full h-full z-10 cursor-default">
          <DitherVeil
            src={src}
            fit={fit}
            pattern={activePattern}
            pixelSize={activePixelSize}
            levels={levels}
            palette={palette}
            inkColor={activeInkColor}
            paperColor={activePaperColor}
            contrast={contrast}
            brightness={brightness}
            revealRadius={revealRadius}
            softness={softness}
            linger={linger}
            rimColor={activeRimColor}
            rim={activeRim}
            reverse={activeReverse}
            wander={wander}
            clickBurst={activeClickBurst}
            scale={activeScale}
            underlyingColor={activeUnderlyingColor}
            underlyingTint={activeUnderlyingTint}
            tintStyle={activeTintStyle}
            tintHighlight={activeTintHighlight}
            tintMidtone={activeTintMidtone}
            tintShadow={activeTintShadow}
            tintPeak={activeTintPeak}
            washEnabled={activeWashEnabled}
            washPeriod={activeWashPeriod}
            washWidth={washWidth}
            washIntensity={washIntensity}
            smoothReveal={activeSmoothReveal}
            cursorEnabled={activeCursorEnabled}
            transparent={activeGatewayFlow}
            className="w-full h-full"
            style={{ backgroundColor: activeGatewayFlow ? 'transparent' : '#000000' }}
          />
        </div>

        {/* Viewport Framing HUD Overlay (Pointer events pass through to canvas) */}
        {!activeGatewayFlow && (
          <div className="absolute inset-0 pointer-events-none z-10 p-6 md:p-10 flex flex-col justify-between">
            {/* Top HUD Row */}
            <div className="flex justify-between items-start text-[10px] font-mono text-neutral-400 uppercase tracking-widest pt-12 md:pt-14">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400/80 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                <span>CENTER // X:50.0% Y:50.0% (LOCKED)</span>
              </div>
              <div className="text-right flex items-center gap-2">
                <span>SCALE // {Math.round(activeScale * 100)}% • {activePattern.toUpperCase()}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-orange-400/80 shadow-[0_0_8px_rgba(255,122,0,0.8)]" />
              </div>
            </div>


            {/* Bottom HUD Row */}
            <div className="flex justify-between items-end text-[10px] font-mono text-neutral-400 uppercase tracking-widest pb-4">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
                <span>
                  SUBSTRATE // PITCH BLACK #000000
                </span>
              </div>
              <div className="text-right flex items-center gap-2">
                <span>
                  WASH // {activeWashEnabled ? `BOTTOM→TOP (${activeWashPeriod}s)` : 'OFF'} • CHROMA // {activeTintStyle.toUpperCase()}
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
              </div>
            </div>
          </div>
        )}

        {/* Hero Editorial Overlay Content */}
        {!activeGatewayFlow && showHeroText && (
          <div className="relative z-20 pointer-events-none w-full max-w-4xl mx-auto px-6 text-center flex flex-col items-center justify-center">
            {/* Badge */}
            <div className="pointer-events-auto inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-mono uppercase bg-black/70 border border-white/15 text-neutral-200 backdrop-blur-md mb-6 shadow-2xl">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
              <span>{badgeText}</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter uppercase text-white drop-shadow-[0_10px_30px_rgba(0,0,0,0.9)] select-none">
              {title}
            </h1>

            {/* Subtitle */}
            <p className="mt-4 max-w-xl text-sm sm:text-base md:text-lg text-neutral-400 font-light leading-relaxed select-none">
              {subtitle}
            </p>

            {/* Interactive Call-To-Action Buttons */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3 pointer-events-auto">
              <button
                type="button"
                onClick={() => setActiveWashEnabled((prev) => !prev)}
                className={`px-5 py-2.5 rounded font-mono text-xs uppercase tracking-wider font-bold transition-all active:scale-95 backdrop-blur-md cursor-pointer flex items-center gap-2 ${
                  activeWashEnabled
                    ? 'border border-emerald-500/60 bg-gradient-to-r from-orange-500 to-emerald-500 text-black shadow-[0_0_25px_rgba(16,185,129,0.3)] hover:brightness-110'
                    : 'border border-white/20 bg-black/80 text-neutral-400 hover:border-white/40'
                }`}
              >
                <Activity className="w-4 h-4 text-current" />
                <span>Wash: {activeWashEnabled ? 'ACTIVE (BOTTOM→TOP)' : 'PAUSED'}</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveGatewayFlow((prev) => !prev)}
                className={`px-4 py-2.5 rounded font-mono text-xs uppercase tracking-wider font-bold border transition-all active:scale-95 backdrop-blur-md cursor-pointer flex items-center gap-1.5 ${
                  activeGatewayFlow
                    ? 'border-cyan-400/60 bg-black/80 text-cyan-300 shadow-[0_0_20px_rgba(6,182,212,0.25)] hover:border-cyan-300'
                    : 'border-white/20 bg-black/80 text-neutral-400 hover:border-white/40'
                }`}
              >
                <Cpu className="w-3.5 h-3.5 text-current" />
                <span>Gateway Flow: {activeGatewayFlow ? 'ONLINE' : 'MUTED'}</span>
              </button>

              <button
                type="button"
                onClick={cyclePattern}
                className="px-4 py-2.5 rounded bg-black/80 hover:bg-black text-white font-mono text-xs uppercase tracking-wider border border-white/20 hover:border-white/40 transition-all active:scale-95 backdrop-blur-md flex items-center gap-2 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5 text-neutral-400" />
                <span>{activePattern.toUpperCase()}</span>
              </button>

              <button
                type="button"
                onClick={() =>
                  setActiveTintStyle((prev) => (prev === 'chromatic' ? 'single' : 'chromatic'))
                }
                className="px-4 py-2.5 rounded font-mono text-xs uppercase tracking-wider border border-white/20 bg-black/80 text-white hover:border-white/40 transition-all active:scale-95 backdrop-blur-md cursor-pointer flex items-center gap-1.5"
              >
                <Palette className="w-3.5 h-3.5 text-orange-400" />
                <span>Chroma: {activeTintStyle.toUpperCase()}</span>
              </button>
            </div>

            {/* Interaction Hint */}
            <div className="mt-6 flex items-center gap-2 text-[11px] font-mono text-neutral-400 tracking-wide select-none">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Floating 3D sculpture in pitch-black void with periodic bottom-to-top harmonic chromatic wash</span>
            </div>
          </div>
        )}

        {/* Scroll Indicator */}
        {!activeGatewayFlow && showSpecs && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 pointer-events-auto flex flex-col items-center gap-1 text-[10px] font-mono text-neutral-500 hover:text-neutral-300 transition-colors">
            <span className="tracking-widest uppercase">Explore Matrix</span>
            <ChevronDown className="w-4 h-4 animate-bounce text-neutral-400" />
          </div>
        )}
      </section>

      {/* ─────────────────────────────────────────────────────────────
          3. ALGORITHMIC SPECIFICATIONS STRIP
          ───────────────────────────────────────────────────────────── */}
      {!activeGatewayFlow && showSpecs && (
        <section
          id="specs"
          className="relative z-20 border-y border-white/10 py-16 px-6"
          style={{ backgroundColor: '#000000' }}
        >
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-neutral-400" />
                <h2 className="text-xs font-mono uppercase tracking-widest text-neutral-300">
                  Harmonic Chromatic Shading & High-Density Geometry
                </h2>
              </div>
              <span className="text-[10px] font-mono text-neutral-500">REV: 2026.04 // GL2</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Card 1 */}
              <div className="p-6 rounded-lg bg-neutral-950 border border-white/10 hover:border-white/20 transition-colors">
                <div className="flex items-center justify-between text-neutral-500 text-xs font-mono mb-3">
                  <span>01 // CHROMATIC TRIAD</span>
                  <Palette className="w-4 h-4 text-orange-400" />
                </div>
                <h3 className="text-lg font-bold uppercase tracking-tight text-white mb-2">
                  Orange & Emerald Split-Tone
                </h3>
                <p className="text-xs text-neutral-400 font-light leading-relaxed">
                  Smooth Hermite luminance ramp mapping: highlights flare with incandescent sunset orange (#ff7a00),
                  mid-planes glow in translucent emerald jade (#10b981), and deep recesses sink into abyssal midnight teal (#041e24).
                </p>
              </div>

              {/* Card 2 */}
              <div className="p-6 rounded-lg bg-neutral-950 border border-white/10 hover:border-white/20 transition-colors">
                <div className="flex items-center justify-between text-neutral-500 text-xs font-mono mb-3">
                  <span>02 // COMPLEMENTARY RIM</span>
                  <Activity className="w-4 h-4 text-emerald-400" />
                </div>
                <h3 className="text-lg font-bold uppercase tracking-tight text-white mb-2">
                  Electric Turquoise Rim
                </h3>
                <p className="text-xs text-neutral-400 font-light leading-relaxed">
                  The boundary frontier between the silver dither matrix and revealed polychromatic face is bordered by a
                  complementary electric turquoise rim (#00f5d4), preventing muddy edges.
                </p>
              </div>

              {/* Card 3 */}
              <div className="p-6 rounded-lg bg-neutral-950 border border-white/10 hover:border-white/20 transition-colors">
                <div className="flex items-center justify-between text-neutral-500 text-xs font-mono mb-3">
                  <span>03 // OPTICAL CENTERING</span>
                  <Minimize2 className="w-4 h-4" />
                </div>
                <h3 className="text-lg font-bold uppercase tracking-tight text-white mb-2">
                  Fixed Centered Geometry
                </h3>
                <p className="text-xs text-neutral-400 font-light leading-relaxed">
                  Head coordinates scale relative to normalized UV center (0.5, 0.5). Rescaling from 30% to 150%
                  preserves exact dead-center optical alignment surrounded by pitch-black margins.
                </p>
              </div>

              {/* Card 4 */}
              <div className="p-6 rounded-lg bg-neutral-950 border border-white/10 hover:border-white/20 transition-colors">
                <div className="flex items-center justify-between text-neutral-500 text-xs font-mono mb-3">
                  <span>04 // SUBSTRATE</span>
                  <Cpu className="w-4 h-4" />
                </div>
                <h3 className="text-lg font-bold uppercase tracking-tight text-white mb-2">
                  Pitch Black #000000
                </h3>
                <p className="text-xs text-neutral-400 font-light leading-relaxed">
                  Zero luminescence ink color calibration guarantees seamless obsidian blending for
                  OLED dynamic ranges without edge bleed or grey seams.
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ─────────────────────────────────────────────────────────────
          4. LIVE INTERACTIVE MATRIX CONTROL DECK
          ───────────────────────────────────────────────────────────── */}
      {!activeGatewayFlow && showControlDeck && (
        <section
          id="controls"
          className="relative z-20 py-20 px-6 border-b border-white/10"
          style={{ backgroundColor: '#000000' }}
        >
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono uppercase bg-neutral-900 border border-neutral-800 text-neutral-400 mb-4">
                <Sliders className="w-3.5 h-3.5 text-neutral-300" />
                <span>Live Parameter Console</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight uppercase text-white">
                Chromatic & Matrix Console
              </h2>
              <p className="mt-3 text-sm text-neutral-400 font-light">
                Tune the live WebGL shader parameters, switch harmonic orange & green tinting, or scale the centered head
                in real time. Scroll up to inspect the centered sculpture as values update instantly.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Card 1: Underlying Face Chroma Presets */}
              <div className="p-6 rounded-lg bg-neutral-950 border border-white/10 flex flex-col justify-between">
                <div>
                  <h3 className="text-xs font-mono uppercase tracking-widest text-neutral-400 mb-4 flex items-center justify-between">
                    <span>1. Underlying Chroma</span>
                    <span className="text-orange-400 font-bold text-[10px] uppercase">{activeTintStyle}</span>
                  </h3>

                  <div className="space-y-1.5 mb-4">
                    {UNDERLYING_PRESETS.map((preset) => {
                      const isSelected =
                        activeTintStyle === preset.style &&
                        (preset.style === 'chromatic'
                          ? activeTintHighlight === preset.highlight
                          : activeUnderlyingColor === preset.color);
                      return (
                        <button
                          key={preset.name}
                          type="button"
                          onClick={() => applyUnderlyingPreset(preset)}
                          className={`w-full text-left p-2 rounded border font-mono text-xs flex items-center justify-between transition-all cursor-pointer ${
                            isSelected
                              ? 'border-white bg-neutral-900 text-white font-semibold shadow-[0_0_15px_rgba(255,255,255,0.1)]'
                              : 'border-white/5 bg-neutral-900/40 text-neutral-400 hover:text-white hover:border-white/20'
                          }`}
                        >
                          <div className="flex items-center gap-2 overflow-hidden">
                            <span
                              className="w-3.5 h-3.5 rounded-full border border-black/40 flex-shrink-0"
                              style={{ background: preset.swatchGradient }}
                            />
                            <span className="text-[11px] truncate">{preset.name}</span>
                          </div>
                          {isSelected && <Check className="w-3.5 h-3.5 text-white flex-shrink-0" />}
                        </button>
                      );
                    })}
                  </div>

                  {/* Range Slider for Tint Blend */}
                  <div className="pt-3 border-t border-white/10">
                    <div className="flex justify-between text-[10px] font-mono text-neutral-400 mb-1">
                      <span>Chroma Blend Amount:</span>
                      <span>{Math.round(activeUnderlyingTint * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={activeUnderlyingTint}
                      onChange={(e) => setActiveUnderlyingTint(parseFloat(e.target.value))}
                      className="w-full accent-orange-400 cursor-pointer"
                    />
                  </div>
                </div>

                <div className="mt-4 text-[9px] font-mono text-neutral-500 leading-tight flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-400/80" />
                  <span>Unmasked when cursor hovers, periodic wash sweeps, or shockwaves expand.</span>
                </div>
              </div>

              {/* Card 2: Head Sizing & Centering */}
              <div className="p-6 rounded-lg bg-neutral-950 border border-white/10 flex flex-col justify-between">
                <div>
                  <h3 className="text-xs font-mono uppercase tracking-widest text-neutral-400 mb-4 flex items-center justify-between">
                    <span>2. Head Scale (Centered)</span>
                    <span className="text-white font-bold">{Math.round(activeScale * 100)}%</span>
                  </h3>

                  <div className="space-y-2 mb-4">
                    {SCALE_PRESETS.map((preset) => {
                      const isSelected = Math.abs(activeScale - preset.value) < 0.03;
                      return (
                        <button
                          key={preset.label}
                          type="button"
                          onClick={() => setActiveScale(preset.value)}
                          className={`w-full text-left p-2.5 rounded font-mono text-xs flex items-center justify-between border transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-white text-black border-white font-semibold'
                              : 'bg-neutral-900/60 text-neutral-300 border-white/5 hover:border-white/20'
                          }`}
                        >
                          <div>
                            <div className="font-bold">{preset.label} ({Math.round(preset.value * 100)}%)</div>
                            <div className={`text-[9px] ${isSelected ? 'text-neutral-600' : 'text-neutral-500'}`}>
                              {preset.desc}
                            </div>
                          </div>
                          {isSelected && <Check className="w-3.5 h-3.5 text-black" />}
                        </button>
                      );
                    })}
                  </div>

                  {/* Range Slider for Granular Scale */}
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <div className="flex justify-between text-[10px] font-mono text-neutral-400 mb-1">
                      <span>Fine Scale:</span>
                      <span>{Math.round(activeScale * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0.3"
                      max="1.2"
                      step="0.02"
                      value={activeScale}
                      onChange={(e) => setActiveScale(parseFloat(e.target.value))}
                      className="w-full accent-white cursor-pointer"
                    />
                  </div>
                </div>

                <div className="mt-4 text-[9px] font-mono text-neutral-500 leading-tight flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400/80" />
                  <span>Fixed at (0.5, 0.5) screen optical center regardless of scale.</span>
                </div>
              </div>

              {/* Card 3: Dithering Pattern */}
              <div className="p-6 rounded-lg bg-neutral-950 border border-white/10 flex flex-col justify-between">
                <div>
                  <h3 className="text-xs font-mono uppercase tracking-widest text-neutral-400 mb-4 flex items-center justify-between">
                    <span>3. Dither Algorithm</span>
                    <span className="text-white font-bold">{activePattern}</span>
                  </h3>
                  <div className="space-y-1.5">
                    {PATTERNS.map((p) => {
                      const isSelected = activePattern === p.id;
                      return (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => setActivePattern(p.id)}
                          className={`w-full text-left p-2.5 rounded font-mono text-xs flex items-center justify-between border transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-white text-black border-white font-semibold'
                              : 'bg-neutral-900/60 text-neutral-300 border-white/5 hover:border-white/20'
                          }`}
                        >
                          <div>
                            <div className="font-bold text-[11px]">{p.label}</div>
                            <div className={`text-[9px] ${isSelected ? 'text-neutral-600' : 'text-neutral-500'}`}>
                              {p.desc}
                            </div>
                          </div>
                          {isSelected && <Check className="w-3.5 h-3.5 text-black" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="mt-4 text-[9px] font-mono text-neutral-500 leading-tight flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-neutral-400" />
                  <span>'lines' provides high-density micro-engraving (1px resolution).</span>
                </div>
              </div>

              {/* Card 4: Density, Wash Engine & Kinetics */}
              <div className="p-6 rounded-lg bg-neutral-950 border border-white/10 flex flex-col justify-between">
                <div>
                  <h3 className="text-xs font-mono uppercase tracking-widest text-neutral-400 mb-4 flex items-center justify-between">
                    <span>4. Kinetics & Wash Engine</span>
                    <span className="text-emerald-400 font-bold text-[10px]">
                      {activeWashEnabled ? 'WASH ACTIVE' : 'MANUAL'}
                    </span>
                  </h3>

                  {/* Periodic Wash Sweep (Bottom to Top) Toggle and Speed */}
                  <div className="p-2.5 rounded bg-neutral-900/80 border border-white/10 mb-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <Activity className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-xs font-mono font-bold text-white">Periodic Wash (↑)</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setActiveWashEnabled((prev) => !prev)}
                        className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold transition-all cursor-pointer ${
                          activeWashEnabled
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                            : 'bg-neutral-800 text-neutral-500 border border-white/5'
                        }`}
                      >
                        {activeWashEnabled ? 'ON (BOTTOM→TOP)' : 'OFF'}
                      </button>
                    </div>

                    {activeWashEnabled && (
                      <div className="pt-1.5 border-t border-white/5">
                        <div className="flex justify-between text-[10px] font-mono text-neutral-400 mb-1">
                          <span>Cycle Duration:</span>
                          <span className="text-white font-bold">{activeWashPeriod.toFixed(1)}s</span>
                        </div>
                        <input
                          type="range"
                          min="1.5"
                          max="8.0"
                          step="0.5"
                          value={activeWashPeriod}
                          onChange={(e) => setActiveWashPeriod(parseFloat(e.target.value))}
                          className="w-full accent-emerald-400 cursor-pointer"
                        />
                      </div>
                    )}
                  </div>

                  {/* Cursor Animation Toggle (Disabled by default) */}
                  <div className="p-2.5 rounded bg-neutral-900/80 border border-white/10 mb-3 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono text-neutral-300">Cursor Animation</span>
                      <button
                        type="button"
                        onClick={() => setActiveCursorEnabled((prev) => !prev)}
                        className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold transition-all cursor-pointer ${
                          activeCursorEnabled
                            ? 'bg-orange-500/20 text-orange-300 border border-orange-500/40'
                            : 'bg-neutral-800 text-neutral-500 border border-white/5'
                        }`}
                      >
                        {activeCursorEnabled ? 'ACTIVE' : 'REMOVED (DEFAULT)'}
                      </button>
                    </div>
                    <div className="text-[9px] font-mono text-neutral-500">
                      {activeCursorEnabled
                        ? 'Pointer unmasks the head interactively.'
                        : 'Cursor animation removed. Head is illuminated purely by the periodic wash.'}
                    </div>
                  </div>

                  {/* Pixel scale options */}
                  <div className="mb-3">
                    <label className="text-[10px] font-mono text-neutral-400 mb-1 block uppercase">
                      Pixel Block Size:
                    </label>
                    <div className="grid grid-cols-4 gap-1.5">
                      {[1, 2, 3, 4].map((size) => (
                        <button
                          key={size}
                          type="button"
                          onClick={() => setActivePixelSize(size)}
                          className={`py-1.5 text-center rounded font-mono text-xs border transition-all cursor-pointer ${
                            activePixelSize === size
                              ? 'bg-white text-black font-bold border-white'
                              : 'bg-neutral-900 text-neutral-400 border-white/10 hover:border-white/20'
                          }`}
                        >
                          {size}px
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Click Shockwave Toggle */}
                  <div>
                    <button
                      type="button"
                      onClick={() => setActiveClickBurst((prev) => !prev)}
                      className="w-full p-2 rounded bg-neutral-900 border border-white/10 flex items-center justify-between font-mono text-[11px] text-neutral-300 hover:border-white/20 transition-all cursor-pointer"
                    >
                      <span>Click Ripple Ring</span>
                      <span
                        className={`px-1.5 py-0.5 rounded text-[9px] uppercase font-bold ${
                          activeClickBurst ? 'bg-emerald-500/20 text-emerald-400' : 'bg-neutral-800 text-neutral-500'
                        }`}
                      >
                        {activeClickBurst ? 'ON' : 'OFF'}
                      </span>
                    </button>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-white/10">
                  <button
                    type="button"
                    onClick={handleTriggerShockwave}
                    className="w-full py-2 rounded bg-gradient-to-r from-orange-500/30 to-emerald-500/30 hover:from-orange-500/50 hover:to-emerald-500/50 text-white font-mono text-xs uppercase tracking-wider font-semibold border border-white/20 transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-orange-400" />
                    <span>Fire Harmonic Shockwave</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ─────────────────────────────────────────────────────────────
          5. TECHNICAL ARCHITECTURAL FEATURE CARDS
          ───────────────────────────────────────────────────────────── */}
      {!activeGatewayFlow && showFeatures && (
        <section
          id="architecture"
          className="relative z-20 py-20 px-6 border-b border-white/10"
          style={{ backgroundColor: '#000000' }}
        >
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-neutral-400 block mb-2">
                  Theoretical Foundations
                </span>
                <h2 className="text-3xl font-bold uppercase tracking-tight text-white">
                  Harmonic Triad Synthesis & Screen-Space Quantization
                </h2>
              </div>
              <p className="mt-3 md:mt-0 max-w-md text-xs font-mono text-neutral-500 leading-relaxed">
                Transforming classical Roman sculptural portraiture into discrete quantum cells through
                mathematical dither passes with harmonic chromatic split-toning.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-8 rounded-lg bg-neutral-950 border border-white/10 hover:border-white/20 transition-all">
                <div className="w-8 h-8 rounded bg-white/5 border border-white/10 flex items-center justify-center font-mono text-xs text-white mb-6">
                  01
                </div>
                <h3 className="text-base font-bold uppercase text-white mb-2">
                  Orange & Emerald Split-Toning
                </h3>
                <p className="text-xs text-neutral-400 leading-relaxed font-light">
                  Smooth Hermite luminance ramps map warm incandescent orange (#ff7a00) to anatomical crests,
                  translucent emerald jade (#10b981) to midtone slopes, and abyssal teal (#041e24) to deep ocular and neck recesses.
                </p>
              </div>

              <div className="p-8 rounded-lg bg-neutral-950 border border-white/10 hover:border-white/20 transition-all">
                <div className="w-8 h-8 rounded bg-white/5 border border-white/10 flex items-center justify-center font-mono text-xs text-white mb-6">
                  02
                </div>
                <h3 className="text-base font-bold uppercase text-white mb-2">
                  Dual-Buffer Half-Float Trails
                </h3>
                <p className="text-xs text-neutral-400 leading-relaxed font-light">
                  Mouse trajectory coordinates ping-pong across two RGBA16F render targets, sustaining
                  smooth exponential temporal decay without frame stepping or banding artifacts.
                </p>
              </div>

              <div className="p-8 rounded-lg bg-neutral-950 border border-white/10 hover:border-white/20 transition-all">
                <div className="w-8 h-8 rounded bg-white/5 border border-white/10 flex items-center justify-center font-mono text-xs text-white mb-6">
                  03
                </div>
                <h3 className="text-base font-bold uppercase text-white mb-2">
                  True Pitch Black Integration
                </h3>
                <p className="text-xs text-neutral-400 leading-relaxed font-light">
                  By strictly mapping the WebGL canvas ink uniforms to RGB [0, 0, 0] alongside the DOM
                  root background, the artwork forms an absolute zero-lux boundary ideal for dark-mode
                  editorial showcases.
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ─────────────────────────────────────────────────────────────
          6. PAGE FOOTER
          ───────────────────────────────────────────────────────────── */}
      {!activeGatewayFlow && showFooter && (
        <footer
          className="relative z-20 py-12 px-6 border-t border-white/10"
          style={{ backgroundColor: '#000000' }}
        >
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-xs font-mono text-neutral-500">
            <div className="flex items-center gap-3">
              <span className="font-bold text-white tracking-widest uppercase">DITHER // VEIL</span>
              <span>•</span>
              <span>ORANGE & EMERALD HARMONIC EDITION</span>
              <span>•</span>
              <span className="text-neutral-400">BHARAT-GANRAJYA SYSTEM</span>
            </div>

            <div className="flex items-center gap-6">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>GPU PIPELINE: NOMINAL (60 FPS)</span>
              </span>
              <a
                href="#hero"
                className="hover:text-white transition-colors uppercase tracking-wider"
              >
                Top [↑]
              </a>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
};

export default DitherVeilPage;
