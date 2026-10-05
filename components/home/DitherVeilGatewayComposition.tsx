"use client";

import React from "react";
import { ConstellationField } from "@designcodeio/threeui";
import "@designcodeio/threeui/style.css";
import DitherVeil, {
  type DitherPattern,
  type DitherTintStyle,
} from "@/components/DitherVeil";

/**
 * ThreeUI Configured Usage Reference Scene
 */
export function Scene() {
  return (
    <div className="shader-frame relative w-full h-[600px] bg-black overflow-hidden">
      <ConstellationField
        variant="gateway-flow"
        mode="dark"
        speed={1.0}
        size={1.0}
        length={1.0}
        density={1.0}
        opacity={1.0}
        hue={0}
        saturation={1.0}
        brightness={1.0}
        leftParticleColor="#ff671f"
        rightParticleColor="#138808"
      />
    </div>
  );
}

export interface DitherVeilGatewayCompositionProps {
  /** Speed of the streaming gateway trajectories (default: 1.0) */
  gatewaySpeed?: number;
  /** Size multiplier for trajectories and particles (default: 1.0) */
  gatewaySize?: number;
  /** Length curve multiplier for gateway flows (default: 1.0) */
  gatewayLength?: number;
  /** Density multiplier for gateway paths (default: 1.0) */
  gatewayDensity?: number;
  /** Opacity for Gateway Flow field (default: 1.0) */
  gatewayOpacity?: number;
  /** Saffron bead shades on the left [light, base, deep] */
  saffronShades?: [string, string, string] | string[];
  /** Green bead shades on the right [light, base, deep] */
  greenShades?: [string, string, string] | string[];
  /** Scale of the centered 3D DitherVeil head (default: 0.65) */
  headScale?: number;
  /** Dithering pattern (default: 'lines' for micro-engraving) */
  pattern?: DitherPattern;
  /** Tint style for the harmonic wash (default: 'chromatic') */
  tintStyle?: DitherTintStyle;
  /** Whether the harmonic bottom-to-top wash animation is enabled (default: true) */
  washEnabled?: boolean;
  /** Wash period in seconds (default: 4.5) */
  washPeriod?: number;
  /** Additional container className */
  className?: string;
  /** Additional inline styles */
  style?: React.CSSProperties;
}

/**
 * Pitch Black Page Composition:
 * Gateway Constellation + Dither Veil Head
 *
 * Clean pitch-black obsidian void (#000000) with zero text.
 * Gateway Constellation streams trajectories with canonical default animation:
 * - Saffron beads on the left (#FFB866 Light, #FF9933 Base, #D96B00 Deep)
 * - Green beads on the right (#5BBF72 Light, #138808 Base, #075E2E Deep)
 * - Interactive click shockwave explosions
 *
 * Trajectories merge seamlessly behind the centered 3D Dither Veil head,
 * which maintains its harmonic bottom-to-top chromatic wash animation intact.
 */
export function DitherVeilGatewayComposition({
  gatewaySpeed = 1.0,
  gatewaySize = 1.0,
  gatewayLength = 1.0,
  gatewayDensity = 1.0,
  gatewayOpacity = 1.0,
  saffronShades,
  greenShades,
  headScale = 0.65,
  pattern = "lines",
  tintStyle = "chromatic",
  washEnabled = true,
  washPeriod = 4.5,
  className = "",
  style,
}: DitherVeilGatewayCompositionProps) {
  return (
    <div
      className={`relative w-full h-screen min-h-[600px] bg-black overflow-hidden select-none flex items-center justify-center ${className}`}
      style={{ backgroundColor: "#000000", ...style }}
    >
      {/* ─────────────────────────────────────────────────────────────
          LAYER 0: GATEWAY CONSTELLATION (PITCH BLACK BACKGROUND)
          Streaming trajectories with canonical default animation:
          - Saffron beads on left (#FFB866 Light, #FF9933 Base, #D96B00 Deep)
          - Green beads on right (#5BBF72 Light, #138808 Base, #075E2E Deep)
          - Interactive click shockwave explosions
          ───────────────────────────────────────────────────────────── */}
      <div className="absolute inset-0 w-full h-full z-0 pointer-events-auto">
        <ConstellationField
          variant="gateway-flow"
          mode="dark"
          speed={gatewaySpeed}
          size={gatewaySize}
          length={gatewayLength}
          density={gatewayDensity}
          opacity={gatewayOpacity}
          saffronShades={saffronShades}
          greenShades={greenShades}
          hue={0}
          saturation={1.0}
          brightness={1.0}
        />
      </div>

      {/* ─────────────────────────────────────────────────────────────
          LAYER 1: CENTERED DITHERVEIL HEAD (FOREGROUND OBJECT)
          Mathematically centered in the pitch-black void.
          Transparent substrate allows gateway trajectories to flow behind,
          while the head naturally occludes particles.
          Periodic bottom-to-top harmonic wash animation is fully intact.
          ───────────────────────────────────────────────────────────── */}
      <div className="absolute inset-0 w-full h-full z-10 pointer-events-none">
        <DitherVeil
          src="/dither-head.jpg"
          fit="contain"
          pattern={pattern}
          pixelSize={1}
          levels={2}
          palette="duotone"
          inkColor="#000000"
          paperColor="#e2e8f0"
          contrast={1.35}
          brightness={0}
          revealRadius={220}
          softness={0.6}
          linger={1.2}
          rimColor="#00f5d4"
          rim={0.1}
          reverse={false}
          wander={false}
          clickBurst={true}
          scale={headScale}
          underlyingColor="#e2e8f0"
          underlyingTint={0.95}
          tintStyle={tintStyle}
          tintHighlight="#ff7a00"
          tintMidtone="#10b981"
          tintShadow="#041e24"
          tintPeak="#fff2a3"
          washEnabled={washEnabled}
          washPeriod={washPeriod}
          washWidth={0.35}
          washIntensity={0.95}
          smoothReveal={true}
          cursorEnabled={false}
          transparent={true}
          className="w-full h-full"
          style={{ backgroundColor: "transparent" }}
        />
      </div>
    </div>
  );
}

export default DitherVeilGatewayComposition;
