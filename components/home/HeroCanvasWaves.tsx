'use client';

import React, { useEffect, useRef } from 'react';

interface Stardust {
  u: number;            // 0 to 1 along the curve from bottom-left to top-right
  v: number;            // -1 to 1 across the ribbon
  speed: number;
  size: number;
  alpha: number;
  baseAlpha: number;
  twinklePhase: number;
  twinkleSpeed: number;
  colorType: 'saffron' | 'white' | 'green';
}

export default function HeroCanvasWaves() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;
    let dpr = 1;

    // Center of hero / chakra
    let chakraCenter = { x: 0, y: 0 };
    let chakraRadius = 230;

    const handleResize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.parentElement?.clientWidth || window.innerWidth;
      height = canvas.parentElement?.clientHeight || window.innerHeight;

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      chakraCenter = { x: width * 0.5, y: height * 0.5 };
      chakraRadius = Math.min(width * 0.28, height * 0.35, 230);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    // =========================================================================
    // STREAMLINE CONFIGURATIONS (Laminar, Clean, Parallel Silk Threads)
    // Cohesive, synchronized, elegant flow matching waves.jpeg
    // =========================================================================
    interface Streamline {
      v: number;               // Normalized position across ribbon: -1 (saffron edge) to +1 (green edge)
      band: 'saffron' | 'white' | 'green';
      color: string;
      glowColor: string;
      width: number;
      alpha: number;
    }

    const streamlines: Streamline[] = [];

    // 1. Saffron Band (14 clean parallel golden-orange streamlines, v = -0.96 to -0.22)
    const SAFFRON_COUNT = 14;
    for (let i = 0; i < SAFFRON_COUNT; i++) {
      const norm = i / (SAFFRON_COUNT - 1);
      const v = -0.96 + norm * 0.74; // -0.96 to -0.22
      const isInner = norm > 0.6;
      streamlines.push({
        v,
        band: 'saffron',
        color: isInner ? '#FFA726' : norm > 0.3 ? '#FF8800' : '#E65100',
        glowColor: 'rgba(255, 120, 0, 0.4)',
        width: 1.2 + Math.sin(norm * Math.PI) * 1.4,
        alpha: 0.55 + Math.sin(norm * Math.PI) * 0.38,
      });
    }

    // 2. White / Luminescent Core Band (8 clean diamond-white / cyan streamlines, v = -0.20 to +0.20)
    const WHITE_COUNT = 8;
    for (let i = 0; i < WHITE_COUNT; i++) {
      const norm = i / (WHITE_COUNT - 1);
      const v = -0.20 + norm * 0.40; // -0.20 to +0.20
      const isCenter = norm > 0.3 && norm < 0.7;
      const isEdge = norm === 0 || norm === 1;
      streamlines.push({
        v,
        band: 'white',
        color: isEdge ? (norm === 0 ? '#00E5FF' : '#38BDF8') : isCenter ? '#FFFFFF' : '#E0F2FE',
        glowColor: isEdge ? 'rgba(0, 229, 255, 0.6)' : 'rgba(255, 255, 255, 0.85)',
        width: isCenter ? 3.0 : 1.8,
        alpha: isCenter ? 0.95 : 0.8,
      });
    }

    // 3. India Green Band (14 clean parallel emerald-green streamlines, v = +0.22 to +0.96)
    const GREEN_COUNT = 14;
    for (let i = 0; i < GREEN_COUNT; i++) {
      const norm = i / (GREEN_COUNT - 1);
      const v = 0.22 + norm * 0.74; // +0.22 to +0.96
      const isInner = norm < 0.4;
      streamlines.push({
        v,
        band: 'green',
        color: isInner ? '#34D399' : norm < 0.7 ? '#10B981' : '#059669',
        glowColor: 'rgba(16, 185, 129, 0.4)',
        width: 1.2 + Math.sin(norm * Math.PI) * 1.4,
        alpha: 0.55 + Math.sin(norm * Math.PI) * 0.38,
      });
    }

    // =========================================================================
    // CLEAN CELESTIAL STARDUST (Quiet, slow-drifting luminous embers)
    // =========================================================================
    const PARTICLE_COUNT = 36;
    const stardust: Stardust[] = [];

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const v = (Math.random() * 2 - 1) * 0.92;
      let colorType: 'saffron' | 'white' | 'green' = 'white';
      if (v < -0.22) colorType = 'saffron';
      else if (v > 0.22) colorType = 'green';

      stardust.push({
        u: Math.random(),
        v,
        speed: 0.0012 + Math.random() * 0.0016,
        size: 0.9 + Math.random() * 1.8,
        alpha: 0.3 + Math.random() * 0.6,
        baseAlpha: 0.35 + Math.random() * 0.55,
        twinklePhase: Math.random() * Math.PI * 2,
        twinkleSpeed: 1.5 + Math.random() * 2.0,
        colorType,
      });
    }

    const startTime = performance.now();

    // =========================================================================
    // MATHEMATICALLY DEFINED LAMINAR WAVE PATH
    // - Compact / gathered near the wheel (u ≈ 0.5)
    // - Spreads wide / fanning out away from the wheel (u → 0 and u → 1)
    // - Clean, smooth laminar S-curve propagation without chaotic jitter
    // =========================================================================
    const getWavePoint = (u: number, v: number, elapsed: number) => {
      // 1. Diagonal Trajectory from bottom-left (-10% W, 95% H) to top-right (110% W, 5% H)
      const startX = -width * 0.10;
      const startY = height * 0.95;
      const endX = width * 1.10;
      const endY = height * 0.05;

      const baseX = startX + (endX - startX) * u;
      const baseY = startY + (endY - startY) * u;

      // Unit normal perpendicular to the diagonal trajectory (pointing up-left)
      const dx = endX - startX;
      const dy = endY - startY;
      const len = Math.hypot(dx, dy) || 1;
      const nx = -dy / len;
      const ny = dx / len;

      // 2. Clean, Majestic Laminar S-Curve Wave Motion (Smooth sine harmonics)
      // Slow, relaxing, regal oscillation without high-frequency chaos
      const wavePhase = elapsed * 0.85;
      const waveUndulation = Math.sin(u * Math.PI * 2.2 - wavePhase) * 44
                           + Math.sin(u * Math.PI * 4.4 - wavePhase * 1.4) * 12;

      // 3. User Requirement: COMPACT near the wheel, SPREAD WIDE away from the wheel
      // Distance from the wheel center (u = 0.5):
      // dCenter is 0 at the wheel, 1 at the far edges (bottom-left and top-right)
      const dCenter = Math.abs(u - 0.5) * 2.0; // 0 to 1

      // Near wheel: compact focused beam (halfWidth = 24px)
      // Far from wheel: expands majestically into wide silk wings (halfWidth = 155px)
      const minHalfWidth = 24;  // Compact waist at wheel
      const maxHalfWidth = 155; // Spread out at ends
      // Smooth power curve gives a sharp focused waist through the wheel that blossoms outward
      const ribbonHalfWidth = minHalfWidth + (maxHalfWidth - minHalfWidth) * Math.pow(dCenter, 1.6);

      // 4. Subtle 3D Silk Twist (Gentle drape tilt across width v, fully coherent)
      const silkTilt = Math.cos(u * Math.PI * 1.4 - wavePhase) * (v * 16);

      // Total displacement along normal
      const normalOffset = waveUndulation + (v * ribbonHalfWidth) + silkTilt;

      const x = baseX + nx * normalOffset;
      const y = baseY + ny * normalOffset;

      return { x, y, nx, ny, ribbonHalfWidth };
    };

    // =========================================================================
    // RENDER LOOP (Clean, 60 FPS, Additive Luminous Rendering)
    // =========================================================================
    const render = (timestamp: number) => {
      const elapsed = (timestamp - startTime) * 0.001;

      ctx.clearRect(0, 0, width, height);

      const U_STEPS = 90;

      ctx.save();
      ctx.globalCompositeOperation = 'lighter';

      // -----------------------------------------------------------------------
      // 1. SOFT VOLUMETRIC GRADIENT UNDERGLOW (Satin Ribbon Body)
      // Follows the compact-to-spread envelope cleanly without noise
      // -----------------------------------------------------------------------
      const drawRibbonSurface = (v1: number, v2: number, color1: string, color2: string, blur: number) => {
        ctx.beginPath();
        for (let i = 0; i <= U_STEPS; i++) {
          const u = i / U_STEPS;
          const pt = getWavePoint(u, v1, elapsed);
          if (i === 0) ctx.moveTo(pt.x, pt.y);
          else ctx.lineTo(pt.x, pt.y);
        }
        for (let i = U_STEPS; i >= 0; i--) {
          const u = i / U_STEPS;
          const pt = getWavePoint(u, v2, elapsed);
          ctx.lineTo(pt.x, pt.y);
        }
        ctx.closePath();

        const grad = ctx.createLinearGradient(0, height, width, 0);
        grad.addColorStop(0, 'rgba(0,0,0,0)');
        grad.addColorStop(0.18, color1);
        grad.addColorStop(0.5, color2);
        grad.addColorStop(0.82, color1);
        grad.addColorStop(1, 'rgba(0,0,0,0)');

        ctx.fillStyle = grad;
        ctx.filter = `blur(${blur}px)`;
        ctx.fill();
        ctx.filter = 'none';
      };

      // Saffron Body
      drawRibbonSurface(-0.96, -0.22, 'rgba(230, 81, 0, 0.22)', 'rgba(255, 140, 20, 0.36)', 8);
      // White Core Body (Brightest through center)
      drawRibbonSurface(-0.20, 0.20, 'rgba(224, 242, 254, 0.4)', 'rgba(255, 255, 255, 0.75)', 6);
      // Green Body
      drawRibbonSurface(0.22, 0.96, 'rgba(16, 185, 129, 0.22)', 'rgba(52, 211, 153, 0.36)', 8);

      // -----------------------------------------------------------------------
      // 2. PARALLEL LAMINAR STREAMLINES (Clean, Smooth Silk Filaments)
      // All threads flow harmonically without random chaotic crossing
      // -----------------------------------------------------------------------
      for (let s = 0; s < streamlines.length; s++) {
        const line = streamlines[s];
        ctx.beginPath();

        for (let i = 0; i <= U_STEPS; i++) {
          const u = i / U_STEPS;
          const pt = getWavePoint(u, line.v, elapsed);

          if (i === 0) ctx.moveTo(pt.x, pt.y);
          else ctx.lineTo(pt.x, pt.y);
        }

        ctx.strokeStyle = line.color;
        ctx.lineWidth = line.width;
        ctx.globalAlpha = line.alpha;
        ctx.shadowColor = line.glowColor;
        ctx.shadowBlur = 10;
        ctx.stroke();
      }

      ctx.shadowBlur = 0;

      // -----------------------------------------------------------------------
      // 3. BRILLIANT DIAMOND-WHITE CENTRAL LASER HIGHLIGHT
      // Extremely bright and focused right as it passes through the wheel
      // -----------------------------------------------------------------------
      ctx.beginPath();
      for (let i = 0; i <= U_STEPS; i++) {
        const u = i / U_STEPS;
        const pt = getWavePoint(u, 0.0, elapsed);
        if (i === 0) ctx.moveTo(pt.x, pt.y);
        else ctx.lineTo(pt.x, pt.y);
      }
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 3.2;
      ctx.globalAlpha = 1.0;
      ctx.shadowColor = '#FFFFFF';
      ctx.shadowBlur = 18;
      ctx.stroke();

      ctx.shadowBlur = 0;

      // -----------------------------------------------------------------------
      // 4. CLEAN CELESTIAL STARDUST (Quietly flowing along the streamlines)
      // -----------------------------------------------------------------------
      for (let i = 0; i < stardust.length; i++) {
        const pt = stardust[i];
        pt.u += pt.speed;
        if (pt.u > 1.0) {
          pt.u = 0.0;
        }

        const wavePt = getWavePoint(pt.u, pt.v, elapsed);

        // Soft twinkle
        pt.twinklePhase += pt.twinkleSpeed * 0.03;
        const twinkle = 0.6 + 0.4 * Math.sin(pt.twinklePhase);
        const alpha = pt.baseAlpha * twinkle;

        // Particle brightens smoothly when passing through the wheel center
        const distChakra = Math.hypot(wavePt.x - chakraCenter.x, wavePt.y - chakraCenter.y);
        const isNearChakra = distChakra < chakraRadius;

        ctx.beginPath();
        ctx.arc(wavePt.x, wavePt.y, isNearChakra ? pt.size * 1.5 : pt.size, 0, Math.PI * 2);

        if (pt.colorType === 'saffron') {
          ctx.fillStyle = `rgba(255, 174, 51, ${alpha})`;
          ctx.shadowColor = '#FF8800';
        } else if (pt.colorType === 'white') {
          ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 1.2})`;
          ctx.shadowColor = '#FFFFFF';
        } else {
          ctx.fillStyle = `rgba(52, 211, 153, ${alpha})`;
          ctx.shadowColor = '#10B981';
        }

        ctx.shadowBlur = isNearChakra ? 10 : 4;
        ctx.fill();
      }

      ctx.shadowBlur = 0;

      // -----------------------------------------------------------------------
      // 5. CLEAN CHAKRA WHEEL RESONANCE GLOW
      // A pristine, subtle golden/cyan pulse where the compact beam focuses
      // -----------------------------------------------------------------------
      const pulseT = (elapsed * 0.7) % 1;
      const pulseRadius = chakraRadius * (0.3 + pulseT * 0.6);
      const pulseAlpha = Math.sin(pulseT * Math.PI) * 0.22;

      ctx.beginPath();
      ctx.arc(chakraCenter.x, chakraCenter.y, pulseRadius, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(0, 229, 255, ${pulseAlpha})`;
      ctx.lineWidth = 1.4;
      ctx.shadowColor = '#00E5FF';
      ctx.shadowBlur = 12;
      ctx.stroke();

      ctx.restore();

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none select-none z-[8]"
      style={{
        mixBlendMode: 'screen',
      }}
    />
  );
}
