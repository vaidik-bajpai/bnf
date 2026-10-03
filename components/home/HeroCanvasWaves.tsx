'use client';

import React, { useEffect, useRef } from 'react';

interface Streamline {
  band: 'saffron' | 'white' | 'green' | 'wisp';
  color: string;
  glowColor: string;
  glowBlur: number;
  width: number;
  alpha: number;
  vBase: number; // Normalized transverse coordinate across the fan (-1.35 to +1.35)

  // Independent multi-harmonic wave parameters for broad outer fans
  freq1: number;
  freq2: number;
  freq3: number;
  amp1: number;
  amp2: number;
  amp3: number;
  speed1: number;
  speed2: number;
  speed3: number;
  phase1: number;
  phase2: number;
  phase3: number;

  // Billowing arches flaring at extremities
  hasBillow: boolean;
  billowCenter: number;
  billowWidth: number;
  billowAmp: number;
  billowSpeed: number;
  billowPhase: number;
  billowHarmonicFreq: number;

  // Concentrated twining & crossover parameters in the narrow center knot
  twineFreq: number;
  twineAmp: number;
  twineSpeed: number;
  twinePhase: number;
}

interface Stardust {
  u: number;
  v: number;
  speed: number;
  size: number;
  baseAlpha: number;
  twinklePhase: number;
  twinkleSpeed: number;
  colorType: 'saffron' | 'white' | 'green' | 'cyan';
  jitterPhase: number;
  jitterSpeed: number;
  followBillow: boolean;
  billowCenter: number;
  billowWidth: number;
  billowAmp: number;
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

    // Center convergence point of the hourglass / bowtie
    let centerPt = { x: 0, y: 0 };
    let chakraRadius = 225;

    const handleResize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.parentElement?.clientWidth || window.innerWidth;
      height = canvas.parentElement?.clientHeight || window.innerHeight;

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      centerPt = { x: width * 0.5, y: height * 0.5 };

      let wheelPx = 280;
      if (width >= 1280) wheelPx = 480;
      else if (width >= 1024) wheelPx = 450;
      else if (width >= 768) wheelPx = 400;
      else if (width >= 640) wheelPx = 350;
      wheelPx = Math.min(wheelPx, height * 0.62);
      chakraRadius = wheelPx / 2;
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    // =========================================================================
    // PROCEDURAL GENERATION OF STREAMLINES
    // Designed for an Hourglass / Bowtie silhouette:
    // Narrow compressed knot with concentrated crossover at center,
    // blooming into a broad, loose fan shape at the extremities.
    // =========================================================================
    const rand = (min: number, max: number) => min + Math.random() * (max - min);
    const streamlines: Streamline[] = [];

    // -------------------------------------------------------------------------
    // 1. SAFFRON CLUSTER (26 Filaments - Opens into broad upper fan)
    // -------------------------------------------------------------------------
    const SAFFRON_COUNT = 26;
    for (let i = 0; i < SAFFRON_COUNT; i++) {
      const norm = i / (SAFFRON_COUNT - 1); // 0 (outer fan edge) to 1 (near core)
      const vBase = -1.35 + norm * 1.18; // -1.35 to -0.17

      let color: string;
      let glowColor: string;
      if (norm < 0.25) {
        color = i % 2 === 0 ? '#E65100' : '#FF5722';
        glowColor = 'rgba(230, 81, 0, 0.45)';
      } else if (norm < 0.65) {
        color = i % 2 === 0 ? '#FF8800' : '#FF9933';
        glowColor = 'rgba(255, 136, 0, 0.6)';
      } else {
        color = i % 2 === 0 ? '#FFA726' : '#FFC107';
        glowColor = 'rgba(255, 179, 0, 0.7)';
      }

      // Billow loops flare out only at the extremities
      const hasBillow = i % 2 === 0 || norm < 0.4;
      const billowCenter = Math.random() > 0.5 ? rand(0.08, 0.28) : rand(0.72, 0.92);
      const billowWidth = rand(0.14, 0.25);
      const billowAmp = -rand(120, 260); // Expands high into the upper fan

      streamlines.push({
        band: 'saffron',
        color,
        glowColor,
        glowBlur: norm > 0.5 ? 14 : 8,
        width: norm > 0.5 ? rand(1.2, 2.6) : rand(0.6, 1.6),
        alpha: rand(0.5, 0.88),
        vBase,

        freq1: rand(1.8, 3.2),
        freq2: rand(3.8, 6.0),
        freq3: rand(6.8, 10.5),
        amp1: rand(35, 75),
        amp2: rand(15, 35),
        amp3: rand(5, 14),
        speed1: rand(0.45, 0.85),
        speed2: rand(0.85, 1.45),
        speed3: rand(1.4, 2.5),
        phase1: rand(0, Math.PI * 2),
        phase2: rand(0, Math.PI * 2),
        phase3: rand(0, Math.PI * 2),

        hasBillow,
        billowCenter,
        billowWidth,
        billowAmp,
        billowSpeed: rand(0.5, 0.95),
        billowPhase: rand(0, Math.PI * 2),
        billowHarmonicFreq: rand(2.2, 3.8),

        // Concentrated twining parameters for the center knot
        twineFreq: rand(8.0, 16.0),
        twineAmp: rand(10, 20),
        twineSpeed: rand(1.4, 2.8),
        twinePhase: rand(0, Math.PI * 2),
      });
    }

    // -------------------------------------------------------------------------
    // 2. WHITE & CYAN CORE SPINE (14 Filaments - Braided tightly in knot, laser core)
    // -------------------------------------------------------------------------
    const WHITE_COUNT = 14;
    for (let i = 0; i < WHITE_COUNT; i++) {
      const norm = i / (WHITE_COUNT - 1);
      const vBase = -0.14 + norm * 0.28;
      const isTrueCenter = norm > 0.35 && norm < 0.65;

      let color: string;
      let glowColor: string;
      if (isTrueCenter) {
        color = '#FFFFFF';
        glowColor = 'rgba(255, 255, 255, 0.95)';
      } else if (norm <= 0.35) {
        color = i % 2 === 0 ? '#38BDF8' : '#00E5FF';
        glowColor = 'rgba(0, 229, 255, 0.75)';
      } else {
        color = i % 2 === 0 ? '#A7F3D0' : '#E0F2FE';
        glowColor = 'rgba(167, 243, 208, 0.7)';
      }

      streamlines.push({
        band: 'white',
        color,
        glowColor,
        glowBlur: isTrueCenter ? 24 : 14,
        width: isTrueCenter ? rand(2.4, 4.0) : rand(1.2, 2.2),
        alpha: isTrueCenter ? 0.98 : 0.82,
        vBase,

        freq1: rand(2.0, 3.2),
        freq2: rand(4.5, 7.0),
        freq3: rand(8.0, 14.0),
        amp1: rand(18, 38),
        amp2: rand(8, 18),
        amp3: rand(2, 6),
        speed1: rand(0.6, 1.0),
        speed2: rand(1.0, 1.8),
        speed3: rand(1.8, 3.0),
        phase1: rand(0, Math.PI * 2),
        phase2: rand(0, Math.PI * 2),
        phase3: rand(0, Math.PI * 2),

        hasBillow: false,
        billowCenter: 0.5,
        billowWidth: 0.3,
        billowAmp: 0,
        billowSpeed: 1,
        billowPhase: 0,
        billowHarmonicFreq: 2,

        twineFreq: rand(10.0, 18.0),
        twineAmp: rand(12, 22),
        twineSpeed: rand(1.6, 3.0),
        twinePhase: rand(0, Math.PI * 2),
      });
    }

    // -------------------------------------------------------------------------
    // 3. INDIA GREEN CLUSTER (26 Filaments - Opens into broad lower fan)
    // -------------------------------------------------------------------------
    const GREEN_COUNT = 26;
    for (let i = 0; i < GREEN_COUNT; i++) {
      const norm = i / (GREEN_COUNT - 1);
      const vBase = 0.17 + norm * 1.18; // +0.17 to +1.35

      let color: string;
      let glowColor: string;
      if (norm < 0.35) {
        color = i % 2 === 0 ? '#34D399' : '#10B981';
        glowColor = 'rgba(52, 211, 153, 0.65)';
      } else if (norm < 0.75) {
        color = i % 2 === 0 ? '#059669' : '#047857';
        glowColor = 'rgba(16, 185, 129, 0.55)';
      } else {
        color = i % 2 === 0 ? '#065F46' : '#22C55E';
        glowColor = 'rgba(34, 197, 94, 0.45)';
      }

      const hasBillow = i % 2 === 0 || norm > 0.4;
      const billowCenter = Math.random() > 0.5 ? rand(0.08, 0.28) : rand(0.72, 0.92);
      const billowWidth = rand(0.14, 0.25);
      const billowAmp = rand(120, 260); // Expands deep into the lower fan

      streamlines.push({
        band: 'green',
        color,
        glowColor,
        glowBlur: norm < 0.5 ? 14 : 8,
        width: norm < 0.5 ? rand(1.2, 2.6) : rand(0.6, 1.6),
        alpha: rand(0.5, 0.88),
        vBase,

        freq1: rand(1.8, 3.2),
        freq2: rand(3.8, 6.0),
        freq3: rand(6.8, 10.5),
        amp1: rand(35, 75),
        amp2: rand(15, 35),
        amp3: rand(5, 14),
        speed1: rand(0.45, 0.85),
        speed2: rand(0.85, 1.45),
        speed3: rand(1.4, 2.5),
        phase1: rand(0, Math.PI * 2),
        phase2: rand(0, Math.PI * 2),
        phase3: rand(0, Math.PI * 2),

        hasBillow,
        billowCenter,
        billowWidth,
        billowAmp,
        billowSpeed: rand(0.5, 0.95),
        billowPhase: rand(0, Math.PI * 2),
        billowHarmonicFreq: rand(2.2, 3.8),

        twineFreq: rand(8.0, 16.0),
        twineAmp: rand(10, 20),
        twineSpeed: rand(1.4, 2.8),
        twinePhase: rand(0, Math.PI * 2),
      });
    }

    // -------------------------------------------------------------------------
    // 4. ETHEREAL WISPS (8 Gossamer Filaments)
    // -------------------------------------------------------------------------
    for (let i = 0; i < 8; i++) {
      const isSaffronSide = i % 2 === 0;
      streamlines.push({
        band: 'wisp',
        color: isSaffronSide ? '#FDE68A' : '#A7F3D0',
        glowColor: isSaffronSide ? 'rgba(253, 230, 138, 0.6)' : 'rgba(167, 243, 208, 0.6)',
        glowBlur: 10,
        width: rand(0.6, 1.2),
        alpha: rand(0.35, 0.65),
        vBase: isSaffronSide ? rand(-1.25, -0.35) : rand(0.35, 1.25),

        freq1: rand(2.5, 5.0),
        freq2: rand(5.5, 9.0),
        freq3: rand(10.0, 16.0),
        amp1: rand(45, 90),
        amp2: rand(20, 45),
        amp3: rand(6, 16),
        speed1: rand(0.7, 1.3),
        speed2: rand(1.2, 2.0),
        speed3: rand(2.0, 3.5),
        phase1: rand(0, Math.PI * 2),
        phase2: rand(0, Math.PI * 2),
        phase3: rand(0, Math.PI * 2),

        hasBillow: true,
        billowCenter: isSaffronSide ? rand(0.1, 0.3) : rand(0.7, 0.9),
        billowWidth: rand(0.16, 0.30),
        billowAmp: (isSaffronSide ? -1 : 1) * rand(140, 280),
        billowSpeed: rand(0.6, 1.1),
        billowPhase: rand(0, Math.PI * 2),
        billowHarmonicFreq: rand(2.5, 4.5),

        twineFreq: rand(10.0, 18.0),
        twineAmp: rand(12, 22),
        twineSpeed: rand(1.5, 3.0),
        twinePhase: rand(0, Math.PI * 2),
      });
    }

    // =========================================================================
    // DUST EMBERS & STARDUST LANES
    // Tightly gathered in the knot, dispersing into broad clouds in the fans
    // =========================================================================
    const PARTICLE_COUNT = 75;
    const stardust: Stardust[] = [];

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const v = rand(-1.3, 1.3);
      let colorType: 'saffron' | 'white' | 'green' | 'cyan' = 'white';
      if (v < -0.22) {
        colorType = Math.random() > 0.3 ? 'saffron' : 'white';
      } else if (v > 0.22) {
        colorType = Math.random() > 0.3 ? 'green' : 'cyan';
      } else {
        colorType = Math.random() > 0.5 ? 'white' : 'cyan';
      }

      const followBillow = Math.random() > 0.45;
      const isSaffron = v < 0;

      stardust.push({
        u: Math.random(),
        v,
        speed: rand(0.0010, 0.0030),
        size: rand(0.9, 2.2),
        baseAlpha: rand(0.35, 0.85),
        twinklePhase: rand(0, Math.PI * 2),
        twinkleSpeed: rand(1.8, 3.5),
        colorType,
        jitterPhase: rand(0, Math.PI * 2),
        jitterSpeed: rand(3.0, 7.0),
        followBillow,
        billowCenter: isSaffron ? rand(0.10, 0.30) : rand(0.70, 0.90),
        billowWidth: rand(0.16, 0.28),
        billowAmp: isSaffron ? -rand(100, 220) : rand(100, 220),
      });
    }

    const startTime = performance.now();

    // =========================================================================
    // MATHEMATICALLY DEFINED HOURGLASS / BOWTIE SILHOUETTE POINT EVALUATOR
    // =========================================================================
    const computePoint = (
      u: number,
      line: Streamline,
      elapsed: number,
      baseHalfWidth: number
    ) => {
      // Extended diagonal trajectory across the canvas
      const startX = -width * 0.18;
      const startY = height * 1.12;
      const endX = width * 1.18;
      const endY = -height * 0.12;

      const dx = endX - startX;
      const dy = endY - startY;
      const len = Math.hypot(dx, dy) || 1;
      const nx = -dy / len; // Unit normal pointing up-left (saffron side)
      const ny = dx / len;
      const tx = dx / len;  // Unit tangent pointing along wave flow
      const ty = dy / len;

      // Distance from center convergence point in [0, 1]
      // dCenter = 0 at the exact center (u = 0.5), 1 at the extremities (u = 0, 1)
      const dCenter = Math.abs(u - 0.5) * 2.0;

      // -----------------------------------------------------------------------
      // 1. HOURGLASS / BOWTIE ENVELOPE (Smooth continuous flare)
      // Tightly congested & narrow at center (W_min = 8px)
      // Blossoms outward into a broad, loose fan shape (W_max = 500px+)
      // -----------------------------------------------------------------------
      const W_min = 8; // Compressed knot half-width at center (~16px total waist)
      const W_max = baseHalfWidth * 1.55; // Broad fan half-width at extremities (~550px)
      const flareCurve = Math.pow(dCenter, 1.75); // Smooth quadratic flare with zero-slope waist
      const envelope = W_min + (W_max - W_min) * flareCurve;

      // Transverse offset: tightly squeezed at center, widely separated in fans
      const transverseOffset = line.vBase * envelope;

      // -----------------------------------------------------------------------
      // 2. CONCENTRATED TWINING & CROSSOVER IN THE NARROW CENTER ZONE
      // Rapid braiding and intercrossing directly inside the compressed knot
      // -----------------------------------------------------------------------
      const distFromCenterU = Math.abs(u - 0.5);
      // Gaussian concentration envelope peaked right at u = 0.5, vanishes in fans
      const twineConcentration = Math.exp(-Math.pow(distFromCenterU / 0.11, 2));
      const twineOffset = Math.sin(u * line.twineFreq * Math.PI + elapsed * line.twineSpeed + line.twinePhase)
                        * (line.twineAmp * twineConcentration);

      // -----------------------------------------------------------------------
      // 3. BROAD LOOSE FAN TURBULENCE & BILLOWING AT EXTREMITIES
      // Increases smoothly with distance from center; zero at the knot
      // -----------------------------------------------------------------------
      const outerChaos = Math.pow(dCenter, 1.6);
      const h1 = Math.sin(u * line.freq1 - elapsed * line.speed1 + line.phase1) * (line.amp1 * outerChaos);
      const h2 = Math.sin(u * line.freq2 + elapsed * line.speed2 + line.phase2) * (line.amp2 * outerChaos);
      const h3 = Math.cos(u * line.freq3 - elapsed * line.speed3 + line.phase3) * (line.amp3 * outerChaos);
      const chaoticHarmonics = h1 + h2 + h3;

      // Peeling billowing loops flaring high/low in the loose fans
      let billowOffset = 0;
      if (line.hasBillow) {
        const dist = (u - line.billowCenter) / line.billowWidth;
        const bell = Math.exp(-dist * dist);
        const dynamicAmp = line.billowAmp * (1.0 + 0.3 * Math.sin(elapsed * line.billowSpeed + line.billowPhase));
        const harmonic = Math.sin(u * line.billowHarmonicFreq * Math.PI - elapsed * line.billowSpeed * 1.4 + line.billowPhase);
        billowOffset = bell * dynamicAmp * (0.65 + 0.35 * harmonic) * outerChaos;
      }

      // -----------------------------------------------------------------------
      // 4. GLOBAL S-CURVE BACKBONE
      // Damped to zero right at the knot to lock the center waist in place
      // -----------------------------------------------------------------------
      const backboneDamping = Math.pow(dCenter, 1.4);
      const backbone = (Math.sin(u * Math.PI * 2.2 - elapsed * 0.65) * 55
                     + Math.sin(u * Math.PI * 4.4 - elapsed * 1.15) * 22) * backboneDamping;

      // Total displacement along normal
      const totalNormalOffset = backbone + transverseOffset + twineOffset + chaoticHarmonics + billowOffset;

      // Subtle along-tangent drift
      const tangentialDrift = Math.sin(u * Math.PI * 3.0 - elapsed * 0.75 + line.phase1) * (14 * outerChaos);

      const baseX = startX + tx * (len * u + tangentialDrift);
      const baseY = startY + ty * (len * u + tangentialDrift);

      const x = baseX + nx * totalNormalOffset;
      const y = baseY + ny * totalNormalOffset;

      return { x, y };
    };

    // =========================================================================
    // RENDER LOOP (Fluid 60 FPS, Additive Blending)
    // =========================================================================
    const render = (timestamp: number) => {
      const elapsed = (timestamp - startTime) * 0.001;

      ctx.clearRect(0, 0, width, height);

      const baseHalfWidth = Math.max(200, Math.min(width * 0.32, height * 0.42));
      const U_STEPS = 120;

      ctx.save();
      ctx.globalCompositeOperation = 'lighter';

      // -----------------------------------------------------------------------
      // 1. VOLUMETRIC SATIN AURORA BOWTIE / HOURGLASS
      // Tapers into slender waist at center, blooms into wide fans at extremities
      // -----------------------------------------------------------------------
      const drawVolumetricBand = (
        vStart: number,
        vEnd: number,
        colorStart: string,
        colorMid: string,
        colorEnd: string,
        blurPx: number
      ) => {
        ctx.beginPath();
        const makeDummy = (v: number): Streamline => ({
          band: 'wisp',
          color: '',
          glowColor: '',
          glowBlur: 0,
          width: 1,
          alpha: 1,
          vBase: v,
          freq1: 2.2, freq2: 4.4, freq3: 7.0,
          amp1: 25, amp2: 10, amp3: 4,
          speed1: 0.6, speed2: 1.0, speed3: 1.5,
          phase1: 0, phase2: 1, phase3: 2,
          hasBillow: Math.abs(v) > 0.4,
          billowCenter: v < 0 ? 0.2 : 0.8,
          billowWidth: 0.24,
          billowAmp: v < 0 ? -120 : 120,
          billowSpeed: 0.65,
          billowPhase: 0.5,
          billowHarmonicFreq: 2.5,
          twineFreq: 12, twineAmp: 10, twineSpeed: 1.5, twinePhase: 0,
        });

        // Top edge of volumetric band
        for (let i = 0; i <= U_STEPS; i += 2) {
          const u = i / U_STEPS;
          const pt = computePoint(u, makeDummy(vStart), elapsed, baseHalfWidth);
          if (i === 0) ctx.moveTo(pt.x, pt.y);
          else ctx.lineTo(pt.x, pt.y);
        }
        // Bottom edge of volumetric band
        for (let i = U_STEPS; i >= 0; i -= 2) {
          const u = i / U_STEPS;
          const pt = computePoint(u, makeDummy(vEnd), elapsed, baseHalfWidth);
          ctx.lineTo(pt.x, pt.y);
        }
        ctx.closePath();

        const grad = ctx.createLinearGradient(0, height, width, 0);
        grad.addColorStop(0, 'rgba(0,0,0,0)');
        grad.addColorStop(0.2, colorStart);
        grad.addColorStop(0.5, colorMid);
        grad.addColorStop(0.8, colorEnd);
        grad.addColorStop(1, 'rgba(0,0,0,0)');

        ctx.fillStyle = grad;
        ctx.filter = `blur(${blurPx}px)`;
        ctx.fill();
        ctx.filter = 'none';
      };

      // Upper Saffron Fan Bloom
      drawVolumetricBand(-1.3, -0.18, 'rgba(230, 81, 0, 0.16)', 'rgba(255, 140, 0, 0.28)', 'rgba(255, 180, 50, 0.18)', 16);
      // Core Channel Bloom
      drawVolumetricBand(-0.16, 0.16, 'rgba(0, 229, 255, 0.25)', 'rgba(255, 255, 255, 0.6)', 'rgba(0, 229, 255, 0.25)', 10);
      // Lower Green Fan Bloom
      drawVolumetricBand(0.18, 1.3, 'rgba(16, 185, 129, 0.16)', 'rgba(52, 211, 153, 0.28)', 'rgba(5, 150, 105, 0.18)', 16);

      // -----------------------------------------------------------------------
      // 2. PROCEDURAL STREAMLINES (All 74 dynamic filaments)
      // -----------------------------------------------------------------------
      for (let s = 0; s < streamlines.length; s++) {
        const line = streamlines[s];
        ctx.beginPath();

        for (let i = 0; i <= U_STEPS; i++) {
          const u = i / U_STEPS;
          const pt = computePoint(u, line, elapsed, baseHalfWidth);

          if (i === 0) ctx.moveTo(pt.x, pt.y);
          else ctx.lineTo(pt.x, pt.y);
        }

        ctx.strokeStyle = line.color;
        ctx.lineWidth = line.width;
        ctx.globalAlpha = line.alpha;
        ctx.shadowColor = line.glowColor;
        ctx.shadowBlur = line.glowBlur;
        ctx.stroke();
      }

      ctx.shadowBlur = 0;

      // -----------------------------------------------------------------------
      // 3. INTENSE CENTRAL DIAMOND-WHITE LASER SPINE
      // Seering laser core threading through the compressed knot
      // -----------------------------------------------------------------------
      ctx.beginPath();
      const dummyLaser: Streamline = {
        band: 'white',
        color: '#FFFFFF',
        glowColor: '#FFFFFF',
        glowBlur: 26,
        width: 3.8,
        alpha: 1.0,
        vBase: 0.0,
        freq1: 2.2, freq2: 4.8, freq3: 8.5,
        amp1: 18, amp2: 8, amp3: 2,
        speed1: 0.65, speed2: 1.2, speed3: 2.2,
        phase1: 0, phase2: 1.2, phase3: 2.4,
        hasBillow: false,
        billowCenter: 0.5, billowWidth: 0.3, billowAmp: 0,
        billowSpeed: 1, billowPhase: 0, billowHarmonicFreq: 2,
        twineFreq: 14.0, twineAmp: 14, twineSpeed: 2.2, twinePhase: 0,
      };

      for (let i = 0; i <= U_STEPS; i++) {
        const u = i / U_STEPS;
        const pt = computePoint(u, dummyLaser, elapsed, baseHalfWidth);
        if (i === 0) ctx.moveTo(pt.x, pt.y);
        else ctx.lineTo(pt.x, pt.y);
      }
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 3.6;
      ctx.globalAlpha = 1.0;
      ctx.shadowColor = '#FFFFFF';
      ctx.shadowBlur = 24;
      ctx.stroke();

      ctx.shadowBlur = 0;

      // -----------------------------------------------------------------------
      // 4. STARDUST PARTICLES & BILLOWING EMBERS
      // Pinched tightly in the knot, dispersing broadly into the fan wings
      // -----------------------------------------------------------------------
      for (let i = 0; i < stardust.length; i++) {
        const pt = stardust[i];
        pt.u += pt.speed;
        if (pt.u > 1.08) {
          pt.u = -0.04;
        }

        const dCenter = Math.abs(pt.u - 0.5) * 2.0;

        const dummyParticleLine: Streamline = {
          band: pt.colorType === 'saffron' ? 'saffron' : pt.colorType === 'green' ? 'green' : 'white',
          color: '',
          glowColor: '',
          glowBlur: 0,
          width: 1,
          alpha: 1,
          vBase: pt.v,
          freq1: 2.5, freq2: 4.8, freq3: 8.0,
          amp1: 30, amp2: 12, amp3: 4,
          speed1: 0.65, speed2: 1.15, speed3: 1.8,
          phase1: pt.twinklePhase, phase2: pt.twinklePhase * 1.5, phase3: pt.twinklePhase * 2,
          hasBillow: pt.followBillow,
          billowCenter: pt.billowCenter,
          billowWidth: pt.billowWidth,
          billowAmp: pt.billowAmp,
          billowSpeed: 0.75,
          billowPhase: pt.twinklePhase,
          billowHarmonicFreq: 2.8,
          twineFreq: 12.0, twineAmp: 12, twineSpeed: 2.0, twinePhase: pt.twinklePhase,
        };

        const wavePt = computePoint(pt.u, dummyParticleLine, elapsed, baseHalfWidth);

        // Particle spread and jitter increase with distance from center
        const jitterSpread = 1.0 + 16.0 * Math.pow(dCenter, 1.5);
        pt.jitterPhase += pt.jitterSpeed * 0.03;
        const jx = Math.sin(pt.jitterPhase) * jitterSpread;
        const jy = Math.cos(pt.jitterPhase * 1.3) * jitterSpread;

        pt.twinklePhase += pt.twinkleSpeed * 0.03;
        const twinkle = 0.55 + 0.45 * Math.sin(pt.twinklePhase);
        const alpha = Math.min(1.0, pt.baseAlpha * twinkle);

        ctx.beginPath();
        ctx.arc(wavePt.x + jx, wavePt.y + jy, pt.size, 0, Math.PI * 2);

        if (pt.colorType === 'saffron') {
          ctx.fillStyle = `rgba(255, 180, 50, ${alpha})`;
          ctx.shadowColor = '#FF8800';
        } else if (pt.colorType === 'cyan') {
          ctx.fillStyle = `rgba(0, 229, 255, ${alpha})`;
          ctx.shadowColor = '#00E5FF';
        } else if (pt.colorType === 'white') {
          ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 1.1})`;
          ctx.shadowColor = '#FFFFFF';
        } else {
          ctx.fillStyle = `rgba(52, 211, 153, ${alpha})`;
          ctx.shadowColor = '#10B981';
        }

        ctx.shadowBlur = dCenter < 0.2 ? 12 : 5;
        ctx.fill();
      }

      ctx.shadowBlur = 0;

      // -----------------------------------------------------------------------
      // 5. CENTER CONVERGENCE KNOT FLARE & CHAKRA HARMONY
      // Searing, high-energy focal pinch right at the center convergence point
      // -----------------------------------------------------------------------
      const knotPulse = 0.5 + 0.5 * Math.sin(elapsed * 2.8);

      // Hyper-concentrated white/cyan focal flare at the knot center
      const coreKnotGrad = ctx.createRadialGradient(centerPt.x, centerPt.y, 2, centerPt.x, centerPt.y, 28);
      coreKnotGrad.addColorStop(0, 'rgba(255, 255, 255, 1.0)');
      coreKnotGrad.addColorStop(0.25, `rgba(0, 229, 255, ${0.85 + knotPulse * 0.15})`);
      coreKnotGrad.addColorStop(0.65, `rgba(255, 180, 50, ${0.45 + knotPulse * 0.2})`);
      coreKnotGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = coreKnotGrad;
      ctx.beginPath();
      ctx.arc(centerPt.x, centerPt.y, 28, 0, Math.PI * 2);
      ctx.fill();

      // Delicate concentric energy ring expanding from the knot through the chakra
      const pulseT = (elapsed * 0.6) % 1;
      const pulseRadius = 14 + pulseT * (chakraRadius * 0.95);
      const pulseAlpha = Math.sin(pulseT * Math.PI) * 0.28;
      ctx.beginPath();
      ctx.arc(centerPt.x, centerPt.y, pulseRadius, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(0, 229, 255, ${pulseAlpha})`;
      ctx.lineWidth = 1.4;
      ctx.shadowColor = '#00E5FF';
      ctx.shadowBlur = 10;
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
