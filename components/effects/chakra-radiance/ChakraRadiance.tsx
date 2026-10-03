'use client';

import React, { useRef, useEffect, useState } from 'react';
import {
  ModularGlowHero,
  RADIANCE_THEMES,
  type HeroShapeType,
  type RadianceThemeName,
  type TonemapperType,
  type FloorTheme,
} from './radianceEngine';
import HeroChakraWheel from '@/components/home/HeroChakraWheel';
import './styles.css';

export interface ChakraRadianceProps {
  /** The 2D SDF shape of the radiance occluder */
  shapeType?: HeroShapeType;
  /** Radius or [width, height] dimensions of the shape in pixels */
  size?: [number, number];
  /** Corner radius for rounded-box shape or ring thickness for torus */
  cornerRadius?: number;
  /** Inset padding in pixels before the core blocks light */
  occluderInset?: number;
  /** Color theme preset */
  theme?: RadianceThemeName;
  /** Custom base color [r, g, b] (0..1) overriding preset */
  baseColor?: [number, number, number];
  /** Custom accent color [r, g, b] (0..1) overriding preset */
  accentColor?: [number, number, number];
  /** Number of discrete perimeter LEDs (default: 72) */
  ledCount?: number;
  /** Number of raycast trace samples (default: 24) */
  rayCount?: number;
  /** Polynomial distance decay exponent p */
  decayPower?: number;
  /** Exponential atmospheric decay coefficient alpha */
  decayExp?: number;
  /** LED light pulse & travelling wave speed */
  speed?: number;
  /** Floor surface appearance theme ('dark' | 'light') */
  floorTheme?: FloorTheme;
  /** Surface reflectivity / albedo */
  floorAlbedo?: number;
  /** Procedural micro-noise grain intensity */
  grainIntensity?: number;
  /** Contact ambient occlusion shadow strength */
  ambientOcclusionStrength?: number;
  /** Filmic tonemapper operator in WGSL */
  tonemapper?: TonemapperType;
  /** Deploy chromatic rainbow sweep evaluated through Oklab space */
  rainbowSweep?: boolean;
  /** Whether to render the spinning Ashoka Chakra wheel at the center */
  showChakraWheel?: boolean;
  /** Scale factor for the center Chakra wheel */
  chakraScale?: number;
  /** Show technical engine backend badge (WebGPU vs WebGL2) */
  showBadge?: boolean;
  /** Interactive mouse-following radiance highlight */
  interactive?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export function ChakraRadiance({
  shapeType = 'circle',
  size = [185, 185],
  cornerRadius = 32,
  occluderInset = 8,
  theme = 'golden-amber',
  baseColor,
  accentColor,
  ledCount = 72,
  rayCount = 24,
  decayPower = 1.25,
  decayExp = 0.0045,
  speed = 1.0,
  floorTheme = 'dark',
  floorAlbedo = 0.14,
  grainIntensity = 0.05,
  ambientOcclusionStrength = 0.65,
  tonemapper = 'lottes',
  rainbowSweep = false,
  showChakraWheel = true,
  chakraScale = 1.0,
  showBadge = true,
  interactive = true,
  className = '',
  style,
}: ChakraRadianceProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [activeBackend, setActiveBackend] = useState<'webgpu' | 'webgl2'>('webgl2');

  const engineRef = useRef<ModularGlowHero | null>(null);

  // Active theme colors
  const activeThemeColors = RADIANCE_THEMES[theme] || RADIANCE_THEMES['golden-amber'];
  const resolvedBaseColor = baseColor || activeThemeColors.baseColor;
  const resolvedAccentColor = accentColor || activeThemeColors.accentColor;

  const optionsRef = useRef({
    shapeType,
    size,
    cornerRadius,
    occluderInset,
    resolvedBaseColor,
    resolvedAccentColor,
    ledCount,
    rayCount,
    decayPower,
    decayExp,
    speed,
    floorTheme,
    floorAlbedo,
    grainIntensity,
    ambientOcclusionStrength,
    tonemapper,
    rainbowSweep,
    interactive,
  });

  useEffect(() => {
    optionsRef.current = {
      shapeType,
      size,
      cornerRadius,
      occluderInset,
      resolvedBaseColor,
      resolvedAccentColor,
      ledCount,
      rayCount,
      decayPower,
      decayExp,
      speed,
      floorTheme,
      floorAlbedo,
      grainIntensity,
      ambientOcclusionStrength,
      tonemapper,
      rainbowSweep,
      interactive,
    };
    if (engineRef.current) {
      engineRef.current.setShape(shapeType, [size[0], size[1], cornerRadius, occluderInset]);
      engineRef.current.setColors(resolvedBaseColor, resolvedAccentColor);
      engineRef.current.setTheme(floorTheme);
      engineRef.current.setTonemapper(tonemapper);
      engineRef.current.setLighting({
        ledCount,
        rayCount,
        decayPower,
        decayExp,
        pulseSpeed: speed,
        rainbowSweep: rainbowSweep ? 1.0 : 0.0,
      });
    }
  });

  // Initialize Engine
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    let animId = 0;
    let isMounted = true;

    async function init() {
      if (!canvas || !container) return;
      const opts = optionsRef.current;

      const engine = new ModularGlowHero({
        canvas,
        shape: opts.shapeType,
        shapeDimensions: [opts.size[0], opts.size[1], opts.cornerRadius, opts.occluderInset],
        theme: opts.floorTheme,
        baseColor: opts.resolvedBaseColor,
        accentColor: opts.resolvedAccentColor,
        ledCount: opts.ledCount,
        rayCount: opts.rayCount,
        decayPower: opts.decayPower,
        decayExp: opts.decayExp,
        grainIntensity: opts.grainIntensity,
        ambientOcclusionStrength: opts.ambientOcclusionStrength,
        tonemapper: opts.tonemapper,
        rainbowSweep: opts.rainbowSweep,
      });

      await engine.init();

      if (!isMounted) {
        engine.destroy();
        return;
      }

      engineRef.current = engine;
      setActiveBackend(engine.backend);

      const rect = container.getBoundingClientRect();
      const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;
      engine.resize(rect.width, rect.height, dpr);

      const loop = () => {
        if (!isMounted) return;
        engine.render();
        animId = requestAnimationFrame(loop);
      };
      animId = requestAnimationFrame(loop);
    }

    init();

    // Resize handling
    const resizeObserver = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry && engineRef.current) {
        const { width, height } = entry.contentRect;
        const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;
        engineRef.current.resize(width, height, dpr);
      }
    });
    resizeObserver.observe(container);

    // Pointer tracking
    const handlePointerMove = (e: MouseEvent) => {
      if (!optionsRef.current.interactive || !engineRef.current) return;
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      engineRef.current.setPointer(x, y, true);
    };

    const handlePointerDown = () => {
      if (!engineRef.current) return;
      // Trigger dynamic spark / rainbow flare boost on click
      engineRef.current.setLighting({ rainbowSweep: 1.0 });
    };

    const handlePointerUp = () => {
      if (!engineRef.current) return;
      if (!optionsRef.current.rainbowSweep) {
        engineRef.current.setLighting({ rainbowSweep: 0.0 });
      }
    };

    const handlePointerLeave = () => {
      if (engineRef.current) {
        engineRef.current.setPointer(0, 0, false);
      }
    };

    container.addEventListener('mousemove', handlePointerMove, { passive: true });
    container.addEventListener('mousedown', handlePointerDown);
    window.addEventListener('mouseup', handlePointerUp);
    container.addEventListener('mouseleave', handlePointerLeave);

    return () => {
      isMounted = false;
      if (animId) cancelAnimationFrame(animId);
      resizeObserver.disconnect();
      container.removeEventListener('mousemove', handlePointerMove);
      container.removeEventListener('mousedown', handlePointerDown);
      window.removeEventListener('mouseup', handlePointerUp);
      container.removeEventListener('mouseleave', handlePointerLeave);
      engineRef.current?.destroy();
      engineRef.current = null;
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`chakra-radiance-container ${className}`}
      style={style}
    >
      <canvas ref={canvasRef} />

      {/* Ashoka Chakra Wheel Overlay (Layered directly inside the Radiance core) */}
      {showChakraWheel && shapeType === 'circle' && (
        <div
          className="chakra-radiance-chakra-layer"
          style={{ transform: `scale(${chakraScale})` }}
        >
          <HeroChakraWheel size={Math.round(size[0] * 2 * 0.85 * chakraScale)} />
        </div>
      )}

      {/* Engine Technical Status Badge */}
      {showBadge && (
        <div className="chakra-radiance-badge">
          {activeBackend === 'webgpu' ? '⚡ WebGPU (WGSL Multi-Pass)' : '✦ WebGL2 (Shader Fallback)'}
        </div>
      )}
    </div>
  );
}

export default ChakraRadiance;
