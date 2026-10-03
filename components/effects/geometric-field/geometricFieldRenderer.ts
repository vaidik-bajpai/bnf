import * as THREE from "three";

export const GEOMETRIC_FIELD_VARIANTS = [
  "monolith",
  "tetrahedron",
  "hyperboloid",
  "horizon-grid",
] as const;

export type GeometricFieldVariant = (typeof GEOMETRIC_FIELD_VARIANTS)[number];

export type DensityLevel = "low" | "medium" | "high" | "ultra";

export type MonochromeTone = "pure" | "cool" | "warm" | "silver";

export interface GeometricFieldOptions {
  variant: GeometricFieldVariant;
  pointDensity: DensityLevel;
  pointSize: number;
  pointBrightness: number;
  lineOpacity: number;
  wireframe: boolean;
  glowIntensity: number;
  speed: number;
  interactive: boolean;
  fov: number;
  cameraDistance: number;
  bloomHaze: boolean;
  tone: MonochromeTone;
  breatheAmplitude: number;
  pulseSpeed: number;
  reducedMotion?: boolean;
}

export const GEOMETRIC_FIELD_DEFAULTS: GeometricFieldOptions = {
  variant: "monolith",
  pointDensity: "high",
  pointSize: 1.8,
  pointBrightness: 1.0,
  lineOpacity: 0.35,
  wireframe: true,
  glowIntensity: 0.85,
  speed: 1.0,
  interactive: true,
  fov: 48,
  cameraDistance: 450,
  bloomHaze: true,
  tone: "pure",
  breatheAmplitude: 1.0,
  pulseSpeed: 1.0,
  reducedMotion: false,
};

const DENSITY_COUNTS: Record<DensityLevel, { points: number; linesScale: number }> = {
  low: { points: 4200, linesScale: 0.6 },
  medium: { points: 8500, linesScale: 0.8 },
  high: { points: 14000, linesScale: 1.0 },
  ultra: { points: 22000, linesScale: 1.2 },
};

const TONE_COLORS: Record<MonochromeTone, { primary: THREE.Color; secondary: THREE.Color; glow: THREE.Color }> = {
  pure: {
    primary: new THREE.Color(0xffffff),
    secondary: new THREE.Color(0x8892b0),
    glow: new THREE.Color(0xdde5f4),
  },
  cool: {
    primary: new THREE.Color(0xf0f4ff),
    secondary: new THREE.Color(0x718096),
    glow: new THREE.Color(0x93c5fd),
  },
  silver: {
    primary: new THREE.Color(0xf8fafc),
    secondary: new THREE.Color(0x94a3b8),
    glow: new THREE.Color(0xe2e8f0),
  },
  warm: {
    primary: new THREE.Color(0xfffdfa),
    secondary: new THREE.Color(0xa39d93),
    glow: new THREE.Color(0xfef3c7),
  },
};

// Shaders for Points
const pointVertexShader = `
  uniform float uTime;
  uniform float uPixelRatio;
  uniform float uPointScale;
  uniform float uPulseSpeed;
  uniform float uBreatheAmp;
  uniform float uBrightness;

  attribute float aSize;
  attribute float aAlpha;
  attribute float aBrightness;
  attribute float aPhase;
  attribute float aLayer;

  varying float vAlpha;
  varying float vBrightness;
  varying float vLayer;

  void main() {
    vLayer = aLayer;
    vec3 pos = position;

    // 1. Subtle organic breathing / geometric oscillation
    float breathe = sin(uTime * 0.5 + aPhase) * (1.2 * uBreatheAmp);
    pos += normalize(pos + vec3(0.0001)) * breathe;

    // 2. Microscopic depth wave (breathing along z-axis)
    pos.z += sin(uTime * 0.35 + pos.y * 0.015 + aPhase) * (1.8 * uBreatheAmp);

    // 3. Traveling illumination wave along Y and Z
    float pulseWave = sin(pos.y * 0.014 - uTime * (1.4 * uPulseSpeed) + pos.z * 0.007);
    float waveIntensity = smoothstep(0.55, 0.98, pulseWave) * 1.5;

    // 4. Focal center illumination boost (around Chakra origin)
    float distFromCenter = length(pos.xy);
    float focalBoost = max(0.0, 1.0 - distFromCenter / 380.0) * 0.45;

    // 5. Total vertex brightness and micro-twinkle
    float twinkle = 0.88 + 0.12 * sin(uTime * 1.5 + aPhase * 4.0);
    vBrightness = (aBrightness + waveIntensity + focalBoost) * twinkle * uBrightness;
    vAlpha = aAlpha * (0.85 + 0.15 * sin(uTime * 0.7 + aPhase));

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);

    // 6. Perspective point scaling
    float pSize = (aSize * uPointScale * uPixelRatio * 320.0) / max(1.0, -mvPosition.z);
    gl_PointSize = clamp(pSize, 0.8, 52.0);

    gl_Position = projectionMatrix * mvPosition;
  }
`;

const pointFragmentShader = `
  uniform vec3 uColor;
  uniform vec3 uSecondaryColor;
  uniform float uBrightness;

  varying float vAlpha;
  varying float vBrightness;
  varying float vLayer;

  void main() {
    vec2 coord = gl_PointCoord - vec2(0.5);
    float dist = length(coord);
    if (dist > 0.5) discard;

    // Soft Gaussian bloom profile with crisp central core
    float core = smoothstep(0.48, 0.06, dist);
    float halo = exp(-dist * 5.2) * 0.7;
    float shape = core * 0.75 + halo * 0.55;

    // Monochrome grading: slate gray -> bright white core
    float b = vBrightness * uBrightness;
    vec3 col = mix(uSecondaryColor, uColor, clamp(b * 0.75, 0.0, 1.0));

    // Specular highlight at high brightness
    col += vec3(smoothstep(1.15, 2.4, b) * 0.7);

    float finalAlpha = clamp(shape * vAlpha * min(b, 2.0), 0.0, 1.0);
    gl_FragColor = vec4(col, finalAlpha);
  }
`;

// Shaders for Structural Lines
const lineVertexShader = `
  uniform float uTime;
  uniform float uPulseSpeed;
  uniform float uBreatheAmp;

  attribute float aBrightness;
  varying float vBrightness;
  varying vec3 vPos;

  void main() {
    vBrightness = aBrightness;
    vec3 pos = position;

    // Micro breathing
    pos.y += sin(uTime * 0.45 + pos.x * 0.012) * (0.6 * uBreatheAmp);
    pos.z += sin(uTime * 0.3 + pos.y * 0.01) * (0.8 * uBreatheAmp);

    vPos = pos;
    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const lineFragmentShader = `
  uniform float uLineOpacity;
  uniform float uTime;
  uniform float uPulseSpeed;
  uniform vec3 uColor;
  uniform vec3 uSecondaryColor;

  varying float vBrightness;
  varying vec3 vPos;

  void main() {
    // Traveling pulse of light
    float wave = sin(vPos.y * 0.014 - uTime * (1.4 * uPulseSpeed) + vPos.z * 0.007);
    float pulse = smoothstep(0.65, 0.98, wave) * 0.85;
    float b = vBrightness + pulse;

    vec3 col = mix(uSecondaryColor, uColor, clamp(b * 0.8, 0.0, 1.0));
    float alpha = clamp(uLineOpacity * b, 0.0, 0.92);

    gl_FragColor = vec4(col, alpha);
  }
`;

// Shaders for Volumetric Atmospheric Glow Quad
const glowVertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const glowFragmentShader = `
  uniform float uTime;
  uniform float uIntensity;
  uniform vec3 uGlowColor;

  varying vec2 vUv;

  void main() {
    vec2 p = vUv * 2.0 - 1.0;
    p.x *= 1.15; // slightly wider than tall
    float r = length(p);

    // Soft atmospheric breathing
    float pulse = 1.0 + 0.04 * sin(uTime * 0.45);
    float haze = exp(-r * 2.3 * pulse);
    float innerHotspot = exp(-r * 5.0);

    float alpha = (haze * 0.16 + innerHotspot * 0.28) * uIntensity;
    vec3 col = uGlowColor;

    gl_FragColor = vec4(col, alpha);
  }
`;

/**
 * Procedural Geometry Builder
 */
function generateStructureData(variant: GeometricFieldVariant, density: DensityLevel) {
  const { points: targetPointCount } = DENSITY_COUNTS[density];

  const pointPositions: number[] = [];
  const pointSizes: number[] = [];
  const pointAlphas: number[] = [];
  const pointBrightnesses: number[] = [];
  const pointPhases: number[] = [];
  const pointLayers: number[] = [];

  const linePositions: number[] = [];
  const lineBrightnesses: number[] = [];

  const addPoint = (
    x: number,
    y: number,
    z: number,
    size = 1.8,
    alpha = 0.8,
    brightness = 1.0,
    layer = 0
  ) => {
    pointPositions.push(x, y, z);
    pointSizes.push(size);
    pointAlphas.push(alpha);
    pointBrightnesses.push(brightness);
    pointPhases.push(Math.random() * Math.PI * 2);
    pointLayers.push(layer);
  };

  const addLine = (
    x1: number,
    y1: number,
    z1: number,
    x2: number,
    y2: number,
    z2: number,
    brightness1 = 1.0,
    brightness2 = 1.0
  ) => {
    linePositions.push(x1, y1, z1, x2, y2, z2);
    lineBrightnesses.push(brightness1, brightness2);
  };

  // -------------------------------------------------------------
  // VARIANT 1: MONOLITH (Flagship Vercel-inspired 3D Prism Structure)
  // -------------------------------------------------------------
  if (variant === "monolith") {
    const halfWidth = 220;
    const baseZFront = 80;
    const baseZBack = -180;
    const yTop = 180;
    const yBottom = -180;
    const apex = new THREE.Vector3(0, yTop, 20);

    // Base vertices of the primary triangular prism
    const vLeft = new THREE.Vector3(-halfWidth, yBottom, baseZFront);
    const vRight = new THREE.Vector3(halfWidth, yBottom, baseZFront);
    const vRear = new THREE.Vector3(0, yBottom + 20, baseZBack);

    // Primary Ridge Lines (Apex to Base corners)
    addLine(apex.x, apex.y, apex.z, vLeft.x, vLeft.y, vLeft.z, 1.8, 0.9);
    addLine(apex.x, apex.y, apex.z, vRight.x, vRight.y, vRight.z, 1.8, 0.9);
    addLine(apex.x, apex.y, apex.z, vRear.x, vRear.y, vRear.z, 1.5, 0.6);

    // Base frame lines
    addLine(vLeft.x, vLeft.y, vLeft.z, vRight.x, vRight.y, vRight.z, 0.9, 0.9);
    addLine(vLeft.x, vLeft.y, vLeft.z, vRear.x, vRear.y, vRear.z, 0.9, 0.5);
    addLine(vRight.x, vRight.y, vRight.z, vRear.x, vRear.y, vRear.z, 0.9, 0.5);

    // Central Vertical Spine Line
    addLine(apex.x, apex.y, apex.z, 0, yBottom, 40, 1.6, 0.8);

    // Horizontal Contour Rings (Lattice Ribs)
    const contourCount = 22;
    for (let c = 1; c < contourCount; c++) {
      const t = c / contourCount;
      const curY = THREE.MathUtils.lerp(yTop, yBottom, t);

      // Interpolate along the 3 ridge edges
      const pLeft = new THREE.Vector3().lerpVectors(apex, vLeft, t);
      const pRight = new THREE.Vector3().lerpVectors(apex, vRight, t);
      const pRear = new THREE.Vector3().lerpVectors(apex, vRear, t);

      const bFront = THREE.MathUtils.lerp(1.6, 0.7, t);
      const bRear = THREE.MathUtils.lerp(1.0, 0.4, t);

      // Front cross-rib
      addLine(pLeft.x, curY, pLeft.z, pRight.x, curY, pRight.z, bFront, bFront);
      // Left depth rib
      addLine(pLeft.x, curY, pLeft.z, pRear.x, curY, pRear.z, bFront, bRear);
      // Right depth rib
      addLine(pRight.x, curY, pRight.z, pRear.x, curY, pRear.z, bFront, bRear);

      // Contour points along front segment
      const ptsOnFront = Math.floor(25 + t * 45);
      for (let i = 0; i <= ptsOnFront; i++) {
        const u = i / ptsOnFront;
        const pt = new THREE.Vector3().lerpVectors(pLeft, pRight, u);
        const edgeGlow = (1 - Math.abs(u - 0.5) * 2) * 0.4;
        addPoint(pt.x, curY, pt.z, 1.8 + edgeGlow, 0.9, bFront + edgeGlow, 0);
      }

      // Contour points along depth sides
      const ptsOnSide = Math.floor(15 + t * 25);
      for (let i = 0; i <= ptsOnSide; i++) {
        const u = i / ptsOnSide;
        const ptL = new THREE.Vector3().lerpVectors(pLeft, pRear, u);
        const ptR = new THREE.Vector3().lerpVectors(pRight, pRear, u);
        const b = THREE.MathUtils.lerp(bFront, bRear, u);
        addPoint(ptL.x, curY, ptL.z, 1.4, 0.75, b, 0);
        addPoint(ptR.x, curY, ptR.z, 1.4, 0.75, b, 0);
      }

      // Receding Perspective Depth Struts from corners into deep space
      if (c % 3 === 0) {
        const deepZ = -380 - t * 180;
        addLine(pLeft.x, curY, pLeft.z, pLeft.x * 1.3, curY - 20, deepZ, bFront * 0.6, 0.15);
        addLine(pRight.x, curY, pRight.z, pRight.x * 1.3, curY - 20, deepZ, bFront * 0.6, 0.15);
      }
    }

    // Dense Faceted Surface Points (Front Triangular Face Stippling)
    const frontFaceSteps = Math.floor(Math.sqrt(targetPointCount * 0.45));
    for (let i = 0; i < frontFaceSteps; i++) {
      for (let j = 0; j < frontFaceSteps - i; j++) {
        const u = i / frontFaceSteps;
        const v = j / frontFaceSteps;
        const w = 1.0 - u - v;

        // Barycentric interpolation on Front Face
        const pt = new THREE.Vector3()
          .addScaledVector(apex, w)
          .addScaledVector(vLeft, u)
          .addScaledVector(vRight, v);

        // Subtle geometric curvature (precision-machined faceted feel)
        const microCurvature = Math.sin(u * Math.PI) * Math.sin(v * Math.PI) * 4.0;
        pt.z += microCurvature;

        const brightness = THREE.MathUtils.lerp(1.7, 0.6, 1.0 - w);
        const sz = THREE.MathUtils.lerp(2.2, 1.3, 1.0 - w);
        addPoint(pt.x, pt.y, pt.z, sz, 0.85, brightness, 1);
      }
    }

    // Side Depth Faces Stippling (Left and Right facets)
    const sideSteps = Math.floor(Math.sqrt(targetPointCount * 0.2));
    for (let i = 0; i < sideSteps; i++) {
      for (let j = 0; j < sideSteps - i; j++) {
        const u = i / sideSteps;
        const v = j / sideSteps;
        const w = 1.0 - u - v;

        // Left Face
        const ptL = new THREE.Vector3()
          .addScaledVector(apex, w)
          .addScaledVector(vLeft, u)
          .addScaledVector(vRear, v);
        // Right Face
        const ptR = new THREE.Vector3()
          .addScaledVector(apex, w)
          .addScaledVector(vRight, u)
          .addScaledVector(vRear, v);

        const b = THREE.MathUtils.lerp(1.2, 0.35, v) * (0.5 + 0.5 * w);
        addPoint(ptL.x, ptL.y, ptL.z, 1.3, 0.7, b, 1);
        addPoint(ptR.x, ptR.y, ptR.z, 1.3, 0.7, b, 1);
      }
    }

    // Inner Concentric Core Prism (Floating dimensional lattice inside)
    const innerScale = 0.58;
    const inApex = apex.clone().multiplyScalar(innerScale);
    const inLeft = vLeft.clone().multiplyScalar(innerScale);
    const inRight = vRight.clone().multiplyScalar(innerScale);
    const inRear = vRear.clone().multiplyScalar(innerScale);

    addLine(inApex.x, inApex.y, inApex.z, inLeft.x, inLeft.y, inLeft.z, 1.3, 0.7);
    addLine(inApex.x, inApex.y, inApex.z, inRight.x, inRight.y, inRight.z, 1.3, 0.7);
    addLine(inApex.x, inApex.y, inApex.z, inRear.x, inRear.y, inRear.z, 0.9, 0.4);
    addLine(inLeft.x, inLeft.y, inLeft.z, inRight.x, inRight.y, inRight.z, 0.7, 0.7);

    // Ground Spatial Perspective Grid (Plunging into horizon)
    const gridY = yBottom - 25;
    const gridLinesCount = 14;
    const gridSpanX = 420;
    const gridNearZ = 120;
    const gridFarZ = -520;

    for (let gx = -gridLinesCount; gx <= gridLinesCount; gx++) {
      const x = (gx / gridLinesCount) * gridSpanX;
      addLine(x, gridY, gridNearZ, x * 1.4, gridY, gridFarZ, 0.4, 0.08);

      // Add stippling points along ground rays
      for (let pz = 0; pz < 10; pz++) {
        const tz = pz / 10;
        const curZ = THREE.MathUtils.lerp(gridNearZ, gridFarZ, tz);
        const curX = THREE.MathUtils.lerp(x, x * 1.4, tz);
        addPoint(curX, gridY, curZ, 1.2, 0.45 * (1 - tz), 0.5 * (1 - tz), 3);
      }
    }

    for (let gz = 0; gz <= 12; gz++) {
      const tz = gz / 12;
      const curZ = THREE.MathUtils.lerp(gridNearZ, gridFarZ, tz);
      const span = gridSpanX * (1 + tz * 0.4);
      const bLine = 0.35 * (1 - tz * 0.8);
      addLine(-span, gridY, curZ, span, gridY, curZ, bLine, bLine);
    }
  }

  // -------------------------------------------------------------
  // VARIANT 2: TETRAHEDRON (Crystalline Geometric Lattice)
  // -------------------------------------------------------------
  else if (variant === "tetrahedron") {
    const radius = 220;
    // 4 Vertices of regular tetrahedron
    const t0 = new THREE.Vector3(0, radius * 1.1, 0);
    const t1 = new THREE.Vector3(
      radius * Math.sqrt(8 / 9),
      -radius / 3,
      0
    );
    const t2 = new THREE.Vector3(
      -radius * Math.sqrt(2 / 9),
      -radius / 3,
      radius * Math.sqrt(2 / 3)
    );
    const t3 = new THREE.Vector3(
      -radius * Math.sqrt(2 / 9),
      -radius / 3,
      -radius * Math.sqrt(2 / 3)
    );

    const tetraNodes = [t0, t1, t2, t3];
    // Connect all edges
    for (let i = 0; i < 4; i++) {
      for (let j = i + 1; j < 4; j++) {
        const a = tetraNodes[i];
        const b = tetraNodes[j];
        addLine(a.x, a.y, a.z, b.x, b.y, b.z, 1.5, 1.1);

        // Subdivide edge with points
        const steps = 60;
        for (let s = 0; s <= steps; s++) {
          const t = s / steps;
          const pt = new THREE.Vector3().lerpVectors(a, b, t);
          addPoint(pt.x, pt.y, pt.z, 1.9, 0.9, 1.4, 0);
        }
      }
    }

    // Tessellated interior facets for all 4 faces
    const faces = [
      [t0, t1, t2],
      [t0, t2, t3],
      [t0, t3, t1],
      [t1, t3, t2],
    ];

    const faceRes = Math.floor(Math.sqrt(targetPointCount * 0.18));
    faces.forEach(([a, b, c], fIdx) => {
      for (let i = 0; i < faceRes; i++) {
        for (let j = 0; j < faceRes - i; j++) {
          const u = i / faceRes;
          const v = j / faceRes;
          const w = 1 - u - v;
          const pt = new THREE.Vector3()
            .addScaledVector(a, u)
            .addScaledVector(b, v)
            .addScaledVector(c, w);
          const bright = (fIdx === 0 || fIdx === 1 ? 1.2 : 0.6) * (0.8 + 0.4 * w);
          addPoint(pt.x, pt.y, pt.z, 1.5, 0.8, bright, 1);
        }
      }
    });

    // Outer concentric crystalline coordinate rings
    const ringSteps = 96;
    for (let r = 0; r < ringSteps; r++) {
      const theta1 = (r / ringSteps) * Math.PI * 2;
      const theta2 = ((r + 1) / ringSteps) * Math.PI * 2;
      const rad = 290;
      addLine(
        Math.cos(theta1) * rad,
        Math.sin(theta1) * rad,
        0,
        Math.cos(theta2) * rad,
        Math.sin(theta2) * rad,
        0,
        0.5,
        0.5
      );
      addPoint(Math.cos(theta1) * rad, Math.sin(theta1) * rad, 0, 1.4, 0.6, 0.7, 4);
    }
  }

  // -------------------------------------------------------------
  // VARIANT 3: HYPERBOLOID (Ruled-surface Architectural Lattice)
  // -------------------------------------------------------------
  else if (variant === "hyperboloid") {
    const waistRadius = 110;
    const baseRadius = 260;
    const height = 380;
    const halfH = height / 2;
    const struts = 48;

    // Ruled straight lines twisted in 3D
    for (let i = 0; i < struts; i++) {
      const angle1 = (i / struts) * Math.PI * 2;
      const twist = 1.35;
      const angleTop1 = angle1 + twist;
      const angleBottom1 = angle1 - twist;

      const pTop1 = new THREE.Vector3(
        Math.cos(angleTop1) * baseRadius,
        halfH,
        Math.sin(angleTop1) * (baseRadius * 0.7)
      );
      const pBot1 = new THREE.Vector3(
        Math.cos(angleBottom1) * baseRadius,
        -halfH,
        Math.sin(angleBottom1) * (baseRadius * 0.7)
      );

      const angleTop2 = angle1 - twist;
      const angleBottom2 = angle1 + twist;
      const pTop2 = new THREE.Vector3(
        Math.cos(angleTop2) * baseRadius,
        halfH,
        Math.sin(angleTop2) * (baseRadius * 0.7)
      );
      const pBot2 = new THREE.Vector3(
        Math.cos(angleBottom2) * baseRadius,
        -halfH,
        Math.sin(angleBottom2) * (baseRadius * 0.7)
      );

      addLine(pTop1.x, pTop1.y, pTop1.z, pBot1.x, pBot1.y, pBot1.z, 0.9, 0.5);
      addLine(pTop2.x, pTop2.y, pTop2.z, pBot2.x, pBot2.y, pBot2.z, 0.9, 0.5);

      // Points along the struts
      const ptsCount = 55;
      for (let s = 0; s <= ptsCount; s++) {
        const t = s / ptsCount;
        const pt = new THREE.Vector3().lerpVectors(pTop1, pBot1, t);
        const waistFactor = Math.abs(t - 0.5) * 2; // 0 at waist, 1 at edges
        const bright = 1.4 - waistFactor * 0.5;
        addPoint(pt.x, pt.y, pt.z, 1.7, 0.85, bright, 0);
      }
    }

    // Horizontal latitude rings
    const ringCount = 16;
    for (let r = 0; r <= ringCount; r++) {
      const tr = r / ringCount;
      const curY = THREE.MathUtils.lerp(halfH, -halfH, tr);
      const yNorm = (curY / halfH);
      const curR = Math.sqrt(waistRadius * waistRadius + (yNorm * yNorm) * (baseRadius * baseRadius - waistRadius * waistRadius));

      const ringSegs = 64;
      for (let s = 0; s < ringSegs; s++) {
        const th1 = (s / ringSegs) * Math.PI * 2;
        const th2 = ((s + 1) / ringSegs) * Math.PI * 2;
        const x1 = Math.cos(th1) * curR;
        const z1 = Math.sin(th1) * (curR * 0.7);
        const x2 = Math.cos(th2) * curR;
        const z2 = Math.sin(th2) * (curR * 0.7);

        addLine(x1, curY, z1, x2, curY, z2, 0.45, 0.45);
        if (s % 2 === 0) {
          addPoint(x1, curY, z1, 1.3, 0.7, 0.8, 1);
        }
      }
    }
  }

  // -------------------------------------------------------------
  // VARIANT 4: HORIZON-GRID (Architectural Spatial Horizon & Monoliths)
  // -------------------------------------------------------------
  else if (variant === "horizon-grid") {
    // Floor grid
    const floorY = -120;
    const gridCols = 32;
    const spanX = 540;
    const startZ = 160;
    const endZ = -620;

    for (let c = -gridCols / 2; c <= gridCols / 2; c++) {
      const x = (c / (gridCols / 2)) * spanX;
      addLine(x, floorY, startZ, x * 1.5, floorY, endZ, 0.6, 0.05);

      for (let z = 0; z < 14; z++) {
        const tz = z / 14;
        const cz = THREE.MathUtils.lerp(startZ, endZ, tz);
        const cx = THREE.MathUtils.lerp(x, x * 1.5, tz);
        addPoint(cx, floorY, cz, 1.4, 0.6 * (1 - tz), 0.7 * (1 - tz), 3);
      }
    }

    for (let r = 0; r < 20; r++) {
      const tr = r / 20;
      const cz = THREE.MathUtils.lerp(startZ, endZ, tr);
      const span = spanX * (1 + tr * 0.5);
      const b = 0.5 * (1 - tr * 0.85);
      addLine(-span, floorY, cz, span, floorY, cz, b, b);
    }

    // Towering Monolith Columns framing the center
    const columns = [
      { x: -160, z: -40, w: 50, h: 280 },
      { x: 160, z: -40, w: 50, h: 280 },
      { x: 0, z: -140, w: 80, h: 340 },
    ];

    columns.forEach((col) => {
      const hw = col.w / 2;
      const topY = floorY + col.h;
      // 4 vertical edges
      const corners = [
        [col.x - hw, col.z - hw],
        [col.x + hw, col.z - hw],
        [col.x + hw, col.z + hw],
        [col.x - hw, col.z + hw],
      ];

      for (let i = 0; i < 4; i++) {
        const [cx, cz] = corners[i];
        addLine(cx, floorY, cz, cx, topY, cz, 0.8, 1.6);

        // points up the pillars
        const pCount = 45;
        for (let p = 0; p <= pCount; p++) {
          const tp = p / pCount;
          const py = THREE.MathUtils.lerp(floorY, topY, tp);
          addPoint(cx, py, cz, 1.8, 0.85, 0.8 + tp * 0.9, 0);
        }
      }
    });
  }

  // -------------------------------------------------------------
  // UNIVERSAL FOCAL HARMONY RETICLE (Positioned directly behind the Chakra Wheel!)
  // -------------------------------------------------------------
  // The Chakra wheel sits at (0, 0, 0) with a radius of ~200-240px.
  // We place precision geometric alignment rings with 24 spoke coordinates,
  // creating a seamless visual bridge between the 3D structure and the Chakra.
  const chakraRadii = [185, 230, 275, 340];
  chakraRadii.forEach((rad, rIdx) => {
    const ringSegs = 96;
    const ringBrightness = [1.2, 0.85, 0.6, 0.4][rIdx];
    const ringZ = [5, -5, -20, -45][rIdx];

    for (let s = 0; s < ringSegs; s++) {
      const th1 = (s / ringSegs) * Math.PI * 2;
      const th2 = ((s + 1) / ringSegs) * Math.PI * 2;

      addLine(
        Math.cos(th1) * rad,
        Math.sin(th1) * rad,
        ringZ,
        Math.cos(th2) * rad,
        Math.sin(th2) * rad,
        ringZ,
        ringBrightness * 0.7,
        ringBrightness * 0.7
      );

      // Add luminous micro-dots at 24 spoke intervals
      if (s % 4 === 0) {
        addPoint(
          Math.cos(th1) * rad,
          Math.sin(th1) * rad,
          ringZ,
          2.2,
          0.9,
          ringBrightness * 1.4,
          4
        );
      }
    }
  });

  // 24 radiating focal tick lines from inner to outer ring
  for (let spoke = 0; spoke < 24; spoke++) {
    const angle = (spoke / 24) * Math.PI * 2;
    const cosA = Math.cos(angle);
    const sinA = Math.sin(angle);
    const rInner = 230;
    const rOuter = 265;
    addLine(
      cosA * rInner,
      sinA * rInner,
      -5,
      cosA * rOuter,
      sinA * rOuter,
      -10,
      1.1,
      0.5
    );
  }

  // Floating Volumetric Stardust in the Central Core
  const coreParticles = 350;
  for (let i = 0; i < coreParticles; i++) {
    const r = Math.pow(Math.random(), 0.6) * 220;
    const theta = Math.random() * Math.PI * 2;
    const z = (Math.random() - 0.5) * 160;
    addPoint(
      Math.cos(theta) * r,
      Math.sin(theta) * r,
      z,
      1.4 + Math.random() * 1.2,
      0.7,
      0.7 + Math.random() * 0.8,
      2
    );
  }

  return {
    points: {
      positions: new Float32Array(pointPositions),
      sizes: new Float32Array(pointSizes),
      alphas: new Float32Array(pointAlphas),
      brightnesses: new Float32Array(pointBrightnesses),
      phases: new Float32Array(pointPhases),
      layers: new Float32Array(pointLayers),
    },
    lines: {
      positions: new Float32Array(linePositions),
      brightnesses: new Float32Array(lineBrightnesses),
    },
  };
}

export function createGeometricFieldRenderer(
  canvas: HTMLCanvasElement,
  getOptions: () => GeometricFieldOptions
) {
  let isDisposed = false;
  const initialOptions = getOptions();

  // 1. Renderer Setup
  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
    powerPreference: "high-performance",
    stencil: false,
    depth: true,
  });

  const dpr = Math.min(
    typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1,
    2
  );
  renderer.setPixelRatio(dpr);
  renderer.setClearColor(0x000000, 0);

  // 2. Scene & Camera Setup
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    initialOptions.fov,
    canvas.clientWidth / canvas.clientHeight || 1,
    1,
    2500
  );
  camera.position.set(0, 0, initialOptions.cameraDistance);
  camera.lookAt(0, 0, 0);

  // Smooth Interactive Parallax State
  let targetMouseX = 0;
  let targetMouseY = 0;
  let curMouseX = 0;
  let curMouseY = 0;

  // 3. Materials
  const currentTone = TONE_COLORS[initialOptions.tone] || TONE_COLORS.pure;

  const pointsMaterial = new THREE.ShaderMaterial({
    vertexShader: pointVertexShader,
    fragmentShader: pointFragmentShader,
    uniforms: {
      uTime: { value: 0 },
      uPixelRatio: { value: dpr },
      uPointScale: { value: initialOptions.pointSize },
      uPulseSpeed: { value: initialOptions.pulseSpeed },
      uBreatheAmp: { value: initialOptions.breatheAmplitude },
      uBrightness: { value: initialOptions.pointBrightness },
      uColor: { value: currentTone.primary },
      uSecondaryColor: { value: currentTone.secondary },
    },
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    depthTest: true,
  });

  const linesMaterial = new THREE.ShaderMaterial({
    vertexShader: lineVertexShader,
    fragmentShader: lineFragmentShader,
    uniforms: {
      uTime: { value: 0 },
      uPulseSpeed: { value: initialOptions.pulseSpeed },
      uBreatheAmp: { value: initialOptions.breatheAmplitude },
      uLineOpacity: { value: initialOptions.lineOpacity },
      uColor: { value: currentTone.primary },
      uSecondaryColor: { value: currentTone.secondary },
    },
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    depthTest: true,
  });

  const glowGeometry = new THREE.PlaneGeometry(700, 700);
  const glowMaterial = new THREE.ShaderMaterial({
    vertexShader: glowVertexShader,
    fragmentShader: glowFragmentShader,
    uniforms: {
      uTime: { value: 0 },
      uIntensity: { value: initialOptions.glowIntensity },
      uGlowColor: { value: currentTone.glow },
    },
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    depthTest: false,
  });

  const glowMesh = new THREE.Mesh(glowGeometry, glowMaterial);
  glowMesh.position.set(0, 10, -110);
  glowMesh.visible = initialOptions.bloomHaze;
  scene.add(glowMesh);

  // Group containing the entire 3D geometric structure
  const structureGroup = new THREE.Group();
  scene.add(structureGroup);

  let pointsMesh: THREE.Points | null = null;
  let linesMesh: THREE.LineSegments | null = null;
  let pointsGeometry: THREE.BufferGeometry | null = null;
  let linesGeometry: THREE.BufferGeometry | null = null;

  let activeVariant: GeometricFieldVariant = initialOptions.variant;
  let activeDensity: DensityLevel = initialOptions.pointDensity;

  function buildMeshes(variant: GeometricFieldVariant, density: DensityLevel) {
    if (pointsMesh) {
      structureGroup.remove(pointsMesh);
      pointsGeometry?.dispose();
    }
    if (linesMesh) {
      structureGroup.remove(linesMesh);
      linesGeometry?.dispose();
    }

    const data = generateStructureData(variant, density);

    // Points BufferGeometry
    pointsGeometry = new THREE.BufferGeometry();
    pointsGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(data.points.positions, 3)
    );
    pointsGeometry.setAttribute(
      "aSize",
      new THREE.BufferAttribute(data.points.sizes, 1)
    );
    pointsGeometry.setAttribute(
      "aAlpha",
      new THREE.BufferAttribute(data.points.alphas, 1)
    );
    pointsGeometry.setAttribute(
      "aBrightness",
      new THREE.BufferAttribute(data.points.brightnesses, 1)
    );
    pointsGeometry.setAttribute(
      "aPhase",
      new THREE.BufferAttribute(data.points.phases, 1)
    );
    pointsGeometry.setAttribute(
      "aLayer",
      new THREE.BufferAttribute(data.points.layers, 1)
    );

    pointsMesh = new THREE.Points(pointsGeometry, pointsMaterial);
    structureGroup.add(pointsMesh);

    // Lines BufferGeometry
    linesGeometry = new THREE.BufferGeometry();
    linesGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(data.lines.positions, 3)
    );
    linesGeometry.setAttribute(
      "aBrightness",
      new THREE.BufferAttribute(data.lines.brightnesses, 1)
    );

    linesMesh = new THREE.LineSegments(linesGeometry, linesMaterial);
    linesMesh.visible = initialOptions.wireframe;
    structureGroup.add(linesMesh);

    activeVariant = variant;
    activeDensity = density;
  }

  buildMeshes(initialOptions.variant, initialOptions.pointDensity);

  // Resize handling
  function resize(width: number, height: number) {
    if (isDisposed || width <= 0 || height <= 0) return;

    renderer.setSize(width, height, false);
    camera.aspect = width / height;

    // Responsive camera distance: adjust slightly for mobile screens
    const currentOpt = getOptions();
    let camDist = currentOpt.cameraDistance;
    if (width < 640) {
      camDist *= 1.35; // Step back camera on mobile so the monolith fits gracefully
    } else if (width < 1024) {
      camDist *= 1.15;
    }
    camera.position.z = camDist;
    camera.fov = currentOpt.fov;
    camera.updateProjectionMatrix();

    // Check if density needs to scale down for mobile performance
    if (width < 640 && activeDensity !== "medium" && activeDensity !== "low") {
      buildMeshes(currentOpt.variant, "medium");
    }
  }

  // Pointer move for parallax
  function setPointer(clientX: number, clientY: number, width: number, height: number) {
    if (!getOptions().interactive) return;
    targetMouseX = ((clientX / width) * 2 - 1);
    targetMouseY = -((clientY / height) * 2 - 1);
  }

  function resetPointer() {
    targetMouseX = 0;
    targetMouseY = 0;
  }

  const clock = new THREE.Clock();

  // Render loop
  function render() {
    if (isDisposed) return;

    const opt = getOptions();
    const timeScale = opt.reducedMotion ? 0.05 : opt.speed;

    // Check if variant or density changed
    if (opt.variant !== activeVariant || opt.pointDensity !== activeDensity) {
      buildMeshes(opt.variant, opt.pointDensity);
    }

    // Update uniforms
    const elapsedTime = clock.getElapsedTime() * timeScale;
    pointsMaterial.uniforms.uTime.value = elapsedTime;
    pointsMaterial.uniforms.uPointScale.value = opt.pointSize;
    pointsMaterial.uniforms.uBrightness.value = opt.pointBrightness;
    pointsMaterial.uniforms.uPulseSpeed.value = opt.pulseSpeed;
    pointsMaterial.uniforms.uBreatheAmp.value = opt.reducedMotion ? 0.1 : opt.breatheAmplitude;

    linesMaterial.uniforms.uTime.value = elapsedTime;
    linesMaterial.uniforms.uLineOpacity.value = opt.lineOpacity;
    linesMaterial.uniforms.uPulseSpeed.value = opt.pulseSpeed;
    linesMaterial.uniforms.uBreatheAmp.value = opt.reducedMotion ? 0.1 : opt.breatheAmplitude;
    if (linesMesh) {
      linesMesh.visible = opt.wireframe;
    }

    glowMaterial.uniforms.uTime.value = elapsedTime;
    glowMaterial.uniforms.uIntensity.value = opt.glowIntensity;
    glowMesh.visible = opt.bloomHaze;

    // Colors update if tone changed
    const toneCol = TONE_COLORS[opt.tone] || TONE_COLORS.pure;
    pointsMaterial.uniforms.uColor.value = toneCol.primary;
    pointsMaterial.uniforms.uSecondaryColor.value = toneCol.secondary;
    linesMaterial.uniforms.uColor.value = toneCol.primary;
    linesMaterial.uniforms.uSecondaryColor.value = toneCol.secondary;
    glowMaterial.uniforms.uGlowColor.value = toneCol.glow;

    // Smooth Parallax Lerp
    if (opt.interactive && !opt.reducedMotion) {
      curMouseX += (targetMouseX - curMouseX) * 0.05;
      curMouseY += (targetMouseY - curMouseY) * 0.05;

      structureGroup.rotation.y = curMouseX * 0.12;
      structureGroup.rotation.x = -curMouseY * 0.08;
      structureGroup.position.x = curMouseX * 18;
      structureGroup.position.y = curMouseY * 14;
    } else {
      curMouseX += (0 - curMouseX) * 0.05;
      curMouseY += (0 - curMouseY) * 0.05;
      structureGroup.rotation.y = 0;
      structureGroup.rotation.x = 0;
      structureGroup.position.x = 0;
      structureGroup.position.y = 0;
    }

    // Very subtle continuous yaw drift
    if (!opt.reducedMotion) {
      const slowDrift = Math.sin(elapsedTime * 0.25) * 0.035;
      structureGroup.rotation.y += slowDrift;
    }

    renderer.render(scene, camera);
  }

  function dispose() {
    isDisposed = true;
    pointsGeometry?.dispose();
    linesGeometry?.dispose();
    pointsMaterial.dispose();
    linesMaterial.dispose();
    glowGeometry.dispose();
    glowMaterial.dispose();
    renderer.dispose();
  }

  return {
    resize,
    render,
    setPointer,
    resetPointer,
    dispose,
  };
}
