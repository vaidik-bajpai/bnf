"use client";

import React, {
  useEffect,
  useRef,
  useMemo,
  type ComponentType,
} from "react";

import {
  ConstellationField as ConstellationFieldRenderer,
  ConnectivityGraph,
  DefenseLines,
  GatewayFlow as GatewayFlowRenderer,
  InterfaceLines,
  ParticleDrift,
  ParticleNetwork,
  TopoField,
  type NeuformBatchEffectProps,
} from "../neuform-isolated/NeuformBatchEffects";

export type ConstellationFieldVariant =
  | "constellation-field"
  | "particle-drift"
  | "particle-network"
  | "gateway-flow"
  | "connectivity-graph"
  | "interface-lines"
  | "defense-lines"
  | "topo-field";

export const SAFFRON_BEAD_SHADES = {
  light: "#FFB866",
  base: "#FF9933",
  deep: "#D96B00",
} as const;

export const GREEN_BEAD_SHADES = {
  light: "#5BBF72",
  base: "#138808",
  deep: "#075E2E",
} as const;

export const DEFAULT_SAFFRON_BEADS: [string, string, string] = [
  SAFFRON_BEAD_SHADES.light,
  SAFFRON_BEAD_SHADES.base,
  SAFFRON_BEAD_SHADES.deep,
];

export const DEFAULT_GREEN_BEADS: [string, string, string] = [
  GREEN_BEAD_SHADES.light,
  GREEN_BEAD_SHADES.base,
  GREEN_BEAD_SHADES.deep,
];

export type ConstellationFieldProps = NeuformBatchEffectProps & {
  variant?: ConstellationFieldVariant;
  /** Force using the isolated iframe renderer if desired (defaults to false for gateway-flow) */
  useIframe?: boolean;
  /** Saffron bead shades on the left [light, base, deep] */
  saffronShades?: [string, string, string] | string[];
  /** Green bead shades on the right [light, base, deep] */
  greenShades?: [string, string, string] | string[];
  /** Backward-compatible single color for left */
  leftParticleColor?: string;
  /** Backward-compatible single color for right */
  rightParticleColor?: string;
};

const VARIANT_COMPONENTS: Record<ConstellationFieldVariant, ComponentType<NeuformBatchEffectProps>> = {
  "constellation-field": ConstellationFieldRenderer,
  "particle-drift": ParticleDrift,
  "particle-network": ParticleNetwork,
  "gateway-flow": GatewayFlowRenderer,
  "connectivity-graph": ConnectivityGraph,
  "interface-lines": InterfaceLines,
  "defense-lines": DefenseLines,
  "topo-field": TopoField,
};

type BezierPoint = {
  x: number;
  y: number;
};

type FlowPath = {
  isLeft: boolean;
  startY: number;
  particles: {
    t: number;
    speed: number;
    shadeIndex: number;
  }[];
};

type Explosion = {
  x: number;
  y: number;
  radius: number;
  life: number;
};

function getBezierPoint(t: number, p0: BezierPoint, p1: BezierPoint, p2: BezierPoint, p3: BezierPoint): BezierPoint {
  const u = 1 - t;
  return {
    x: u ** 3 * p0.x + 3 * u ** 2 * t * p1.x + 3 * u * t ** 2 * p2.x + t ** 3 * p3.x,
    y: u ** 3 * p0.y + 3 * u ** 2 * t * p1.y + 3 * u * t ** 2 * p2.y + t ** 3 * p3.y,
  };
}

/**
 * Pure HTML Canvas 2D engine for Gateway Flow.
 * 100% owned by the codebase with ZERO iframe sandboxing,
 * using the exact trajectory geometry, bezier curves, click explosions,
 * and aesthetic timing of ThreeUI's canonical gateway-flow source.
 *
 * Saffron beads on the left:
 * - #FFB866 (Light)
 * - #FF9933 (Base)
 * - #D96B00 (Deep)
 *
 * Green beads on the right:
 * - #5BBF72 (Light)
 * - #138808 (Base)
 * - #075E2E (Deep)
 */
export function NativeGatewayFlow({
  mode = "dark",
  speed = 1.0,
  size = 1.0,
  length = 1.0,
  density = 1.0,
  opacity = 1.0,
  hue = 0,
  saturation = 1.0,
  brightness = 1.0,
  saffronShades = DEFAULT_SAFFRON_BEADS,
  greenShades = DEFAULT_GREEN_BEADS,
  leftParticleColor,
  rightParticleColor,
  className = "",
  style,
  ...props
}: NeuformBatchEffectProps & {
  saffronShades?: [string, string, string] | string[];
  greenShades?: [string, string, string] | string[];
  leftParticleColor?: string;
  rightParticleColor?: string;
} & React.HTMLAttributes<HTMLDivElement>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const resolvedSaffron = useMemo(() => {
    if (leftParticleColor) return [leftParticleColor, leftParticleColor, leftParticleColor];
    return saffronShades || DEFAULT_SAFFRON_BEADS;
  }, [leftParticleColor, saffronShades]);

  const resolvedGreen = useMemo(() => {
    if (rightParticleColor) return [rightParticleColor, rightParticleColor, rightParticleColor];
    return greenShades || DEFAULT_GREEN_BEADS;
  }, [rightParticleColor, greenShades]);

  // Keep live references to dynamic knobs for 60fps raf loop without re-triggering canvas rebuilds
  const knobsRef = useRef({
    speed,
    size,
    length,
    density,
    opacity,
    mode,
    saffronShades: resolvedSaffron,
    greenShades: resolvedGreen,
  });
  useEffect(() => {
    knobsRef.current = {
      speed,
      size,
      length,
      density,
      opacity,
      mode,
      saffronShades: resolvedSaffron,
      greenShades: resolvedGreen,
    };
  }, [speed, size, length, density, opacity, mode, resolvedSaffron, resolvedGreen]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let width = 0;
    let height = 0;
    let explosions: Explosion[] = [];
    let paths: FlowPath[] = [];

    const initPaths = () => {
      paths = [];
      const numPaths = Math.max(12, Math.round(80 * (knobsRef.current.density || 1)));
      for (let i = 0; i < numPaths; i++) {
        paths.push({
          isLeft: i % 2 === 0,
          startY: (i / numPaths) * height * 1.4 - height * 0.2,
          particles: [
            {
              t: Math.random(),
              speed: 0.0015 + Math.random() * 0.002,
              shadeIndex: i % 3,
            },
          ],
        });
      }
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = container.clientWidth || window.innerWidth;
      height = container.clientHeight || window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
      if (paths.length === 0) {
        initPaths();
      }
    };

    const resizeObserver = new ResizeObserver(() => {
      resize();
    });
    resizeObserver.observe(container);
    window.addEventListener("resize", resize);
    resize();
    initPaths();

    // Default interactive shockwave explosion on click from gateway-flow.html
    const handleClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      explosions.push({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        radius: 0,
        life: 1,
      });
    };
    window.addEventListener("click", handleClick);

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      const currentMode = knobsRef.current.mode;
      const currentSpeed = knobsRef.current.speed ?? 1.0;
      const currentSize = knobsRef.current.size ?? 1.0;
      const currentLength = knobsRef.current.length ?? 1.0;
      const currentSaffron = knobsRef.current.saffronShades || DEFAULT_SAFFRON_BEADS;
      const currentGreen = knobsRef.current.greenShades || DEFAULT_GREEN_BEADS;

      const centerX = width / 2;
      const centerY = height / 2;

      // Update click shockwaves
      for (let i = explosions.length - 1; i >= 0; i--) {
        const exp = explosions[i];
        exp.radius += 15;
        exp.life -= 0.015;
        if (exp.life <= 0) {
          explosions.splice(i, 1);
        }
      }

      // Draw streaming gateway trajectories
      for (let i = 0; i < paths.length; i++) {
        const path = paths[i];
        const p0: BezierPoint = { x: path.isLeft ? 0 : width, y: path.startY };
        const p1: BezierPoint = {
          x: path.isLeft ? centerX * 0.5 * currentLength : width - centerX * 0.5 * currentLength,
          y: path.startY,
        };
        const p2: BezierPoint = {
          x: path.isLeft ? centerX * 0.8 : width - centerX * 0.8,
          y: centerY,
        };
        const p3: BezierPoint = { x: centerX, y: centerY };

        // Dashed trajectory path curve
        ctx.beginPath();
        ctx.moveTo(p0.x, p0.y);
        ctx.bezierCurveTo(p1.x, p1.y, p2.x, p2.y, p3.x, p3.y);
        ctx.strokeStyle =
          currentMode === "light" ? "rgba(26, 31, 42, 0.38)" : "rgba(255, 255, 255, 0.35)";
        ctx.lineWidth = Number((1.2 * currentSize).toFixed(2));
        ctx.setLineDash([1, 4]);
        ctx.stroke();
        ctx.setLineDash([]);

        // Trajectory beads
        for (let j = 0; j < path.particles.length; j++) {
          const p = path.particles[j];
          p.t += p.speed * currentSpeed;
          if (p.t > 1) {
            p.t = 0;
            path.startY += (Math.random() - 0.5) * 10;
            p.shadeIndex = Math.floor(Math.random() * 3);
          }

          let pos = getBezierPoint(p.t, p0, p1, p2, p3);

          let dxTotal = 0;
          let dyTotal = 0;

          // Shockwave explosions deflection from gateway-flow.html
          for (let k = 0; k < explosions.length; k++) {
            const exp = explosions[k];
            const dx = pos.x - exp.x;
            const dy = pos.y - exp.y;
            const dist = Math.hypot(dx, dy);
            if (dist < exp.radius + 120 && dist > exp.radius - 120 && dist > 0.0001) {
              const force = (1 - Math.abs(dist - exp.radius) / 120) * exp.life;
              dxTotal += (dx / dist) * force * 80;
              dyTotal += (dy / dist) * force * 80;
            }
          }

          pos.x += dxTotal;
          pos.y += dyTotal;

          // Saffron beads on the left (#FFB866 Light, #FF9933 Base, #D96B00 Deep)
          // Green beads on the right (#5BBF72 Light, #138808 Base, #075E2E Deep)
          const beadShades = path.isLeft ? currentSaffron : currentGreen;
          const beadColor = beadShades[p.shadeIndex % beadShades.length];

          // Natural bead sizing with optical depth:
          // Deep (2): 1.4px, Base (1): 1.8px, Light (0): 2.1px
          const baseRadius = p.shadeIndex === 0 ? 2.1 : p.shadeIndex === 2 ? 1.4 : 1.8;
          const beadRadius = baseRadius * currentSize;

          ctx.fillStyle = beadColor;
          ctx.beginPath();
          ctx.arc(pos.x, pos.y, beadRadius, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      resizeObserver.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("click", handleClick);
    };
  }, []);

  const filter = useMemo(() => {
    if (hue === 0 && saturation === 1 && brightness === 1) return undefined;
    return `hue-rotate(${hue}deg) saturate(${saturation}) brightness(${brightness})`;
  }, [hue, saturation, brightness]);

  const isLight = mode === "light";
  const bg = isLight ? "#eef1f6" : "#000000";

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden w-full h-full select-none ${className}`}
      style={{
        backgroundColor: bg,
        filter,
        ...style,
      }}
      {...props}
    >
      {/* Authored Radial Center Glow from gateway-flow.html */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          opacity: 0.1,
          background: "radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.01) 0%, rgba(0, 0, 0, 0) 80%)",
        }}
      />

      {/* Authored 2x2 SVG Dither Overlay from gateway-flow.html */}
      <div
        className="absolute inset-0 pointer-events-none z-20 opacity-[0.15]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg%20viewBox%3D%220%200%202%202%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20fill%3D%22%23ffffff%22%2F%3E%3Crect%20x%3D%221%22%20y%3D%221%22%20width%3D%221%22%20height%3D%221%22%20fill%3D%22%23ffffff%22%2F%3E%3C%2Fsvg%3E")`,
          backgroundSize: "2px 2px",
        }}
      />

      {/* Trajectory Canvas 2D */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full z-10 block"
        style={{ opacity: opacity ?? 1 }}
      />
    </div>
  );
}

/**
 * ConstellationField Component from ThreeUI.
 * Renders the Gateway Flow variant natively in pure Canvas 2D + HTML without iframes,
 * using the canonical default animation with:
 * - Saffron beads on the left (#FFB866 Light, #FF9933 Base, #D96B00 Deep)
 * - Green beads on the right (#5BBF72 Light, #138808 Base, #075E2E Deep)
 * while maintaining full compatibility with the ThreeUI variant registry and props.
 */
export function ConstellationField({
  variant = "gateway-flow",
  useIframe = false,
  saffronShades = DEFAULT_SAFFRON_BEADS,
  greenShades = DEFAULT_GREEN_BEADS,
  leftParticleColor,
  rightParticleColor,
  ...props
}: ConstellationFieldProps) {
  // If gateway-flow is requested without useIframe, render the native pure code implementation
  if (variant === "gateway-flow" && !useIframe) {
    return (
      <NativeGatewayFlow
        saffronShades={saffronShades}
        greenShades={greenShades}
        leftParticleColor={leftParticleColor}
        rightParticleColor={rightParticleColor}
        {...props}
      />
    );
  }

  // Otherwise, use the canonical ThreeUI batch isolated component
  const Variant = VARIANT_COMPONENTS[variant] ?? VARIANT_COMPONENTS["gateway-flow"];
  return <Variant {...props} />;
}

export default ConstellationField;
