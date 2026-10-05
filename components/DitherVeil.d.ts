import React from 'react';

export type DitherPattern = 'floyd' | 'atkinson' | 'bayer' | 'noise' | 'lines';
export type DitherPalette = 'duotone' | 'rgb';
export type DitherFit = 'contain' | 'cover';
export type DitherTintStyle = 'single' | 'chromatic';

export interface DitherVeilProps {
  /** Source image URL (defaults to classical sculpted head) */
  src?: string;
  /** Image fitting mode: 'contain' to preserve aspect ratio centered, or 'cover' */
  fit?: DitherFit;
  /** Dithering algorithm pattern */
  pattern?: DitherPattern;
  /** Pixel block size in screen pixels (default: 2; 1 for high density) */
  pixelSize?: number;
  /** Number of discrete quantization color levels (default: 2) */
  levels?: number;
  /** Color palette format: 'duotone' or full 'rgb' */
  palette?: DitherPalette;
  /** Primary dark/ink color (default: '#000000' for pitch black) */
  inkColor?: string;
  /** Primary light/paper color (default: '#ffffff', e.g. '#e2e8f0' for Silver Head) */
  paperColor?: string;
  /** Image tone contrast multiplier (default: 1.15) */
  contrast?: number;
  /** Image tone brightness offset (default: 0) */
  brightness?: number;
  /** Cursor hover reveal radius in pixels (default: 200) */
  revealRadius?: number;
  /** Edge softness for pointer reveal mask (default: 0.6) */
  softness?: number;
  /** Reveal trail decay duration in seconds (default: 1) */
  linger?: number;
  /** Color of the edge highlight rim */
  rimColor?: string;
  /** Intensity of the rim highlight (0 to 0.95) */
  rim?: number;
  /** Invert reveal mask: hides photo by default and reveals dither on hover */
  reverse?: boolean;
  /** Allow cursor target point to wander organically when mouse is idle */
  wander?: boolean;
  /** Emit expanding shockwave ripple rings on pointer clicks */
  clickBurst?: boolean;
  /** Scale factor of the head relative to the viewport, pinned to center (e.g. 0.65 for reduced size, default: 1.0) */
  scale?: number;
  /** Underlying color applied to the revealed photographic face (e.g. '#e2e8f0' for Silver Chrome, '#ffffff', etc.) */
  underlyingColor?: string;
  /** Amount of tint applied to the underlying photographic face (0 = raw photo, 1 = fully tinted metallic monochrome) */
  underlyingTint?: number;

  /** Tint mode: 'single' for uniform chroma or 'chromatic' for multi-stop harmonic gradient */
  tintStyle?: DitherTintStyle;
  /** Chromatic highlight tone (e.g. '#ff7a00' for sunset/saffron orange) */
  tintHighlight?: string;
  /** Chromatic midtone (e.g. '#10b981' for vibrant emerald green) */
  tintMidtone?: string;
  /** Chromatic shadow tone (e.g. '#041e24' for deep complementary teal / navy) */
  tintShadow?: string;
  /** Chromatic specular peak (e.g. '#fff2a3' for sunfire champagne gold) */
  tintPeak?: string;

  /** Whether to enable periodic upward tint wash sweeping across the head from bottom to top (default: true) */
  washEnabled?: boolean;
  /** Cycle period in seconds for the upward tint wash wave (default: 4.5) */
  washPeriod?: number;
  /** Normalized width/thickness of the upward tint wash wave (default: 0.35) */
  washWidth?: number;
  /** Peak intensity of the upward tint wash wave (default: 0.95) */
  washIntensity?: number;

  /** Whether to use silky smooth continuous reveal instead of crunchy Bayer dither pixels / 'x' pattern (default: true) */
  smoothReveal?: boolean;

  /** Whether hovering/moving the cursor unmasks the head (default: false, so only the periodic wash animation animates) */
  cursorEnabled?: boolean;

  /** Whether the background around the 3D head is transparent to reveal underlying layers (default: false) */
  transparent?: boolean;

  /** Optional additional CSS class names */
  className?: string;
  /** Inline style overrides */
  style?: React.CSSProperties;
}

export declare const DitherVeil: React.FC<DitherVeilProps>;
export default DitherVeil;
