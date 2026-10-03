import * as THREE from "three";

export const WARP_FIELD_VARIANTS = [
  "streaks",
  "letters",
  "keycaps",
  "hyperspace",
] as const;

export type WarpFieldVariant = (typeof WARP_FIELD_VARIANTS)[number];

export type WarpFieldOptions = {
  variant: WarpFieldVariant;
  speed: number;
  streakOpacity: number;
  tileOpacity: number;
  fov: number;
  brightness: number;
  hue: number;
  saturation: number;
};

export const WARP_FIELD_DEFAULTS: WarpFieldOptions = {
  variant: "streaks",
  speed: 15,
  streakOpacity: 0.6,
  tileOpacity: 0.9,
  fov: 75,
  brightness: 1,
  hue: 0,
  saturation: 1,
};

const WRAP_Z_THRESHOLD = 200; // v = 200
const KEYCAP_NEAR = 110; // C = 110
const KEYCAP_FAR = -1200; // E = -1200
const LETTER_NEAR = 140; // P = 140
const LETTER_FAR = -1300; // b = -1300
const STREAK_RESET_Z = -1800; // S = -1800
const GLYPH_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

const SPEED_SCALES: Record<WarpFieldVariant, number> = {
  streaks: 1,
  letters: 0.5,
  keycaps: 0.7,
  hyperspace: 2.4,
};

const BACKGROUND_COLORS: Record<WarpFieldVariant, number> = {
  streaks: 132106, // 0x02040a deep space
  letters: 132106,
  keycaps: 198412,
  hyperspace: 66058,
};

interface StreakConfig {
  count: number;
  radiusMin: number;
  radiusSpread: number;
  lengthMin: number;
  lengthSpread: number;
  palette: number[];
  opacityScale: number;
}

const STREAK_CONFIGS: Record<WarpFieldVariant, StreakConfig> = {
  streaks: {
    count: 400,
    radiusMin: 20,
    radiusSpread: 800,
    lengthMin: 50,
    lengthSpread: 150,
    palette: [1096065, 366185, 3462041, 16777215], // 4-color emerald additive palette: [0x10B981, 0x059669, 0x34D399, 0xFFFFFF]
    opacityScale: 1,
  },
  letters: {
    count: 260,
    radiusMin: 20,
    radiusSpread: 800,
    lengthMin: 40,
    lengthSpread: 120,
    palette: [1096065, 366185, 3462041, 16777215],
    opacityScale: 1,
  },
  keycaps: {
    count: 220,
    radiusMin: 20,
    radiusSpread: 800,
    lengthMin: 40,
    lengthSpread: 140,
    palette: [1096065, 3462041, 11006928, 16777215],
    opacityScale: 1,
  },
  hyperspace: {
    count: 1200,
    radiusMin: 6,
    radiusSpread: 760,
    lengthMin: 170,
    lengthSpread: 420,
    palette: [16777215, 14412542, 9684477, 6333946, 13095678],
    opacityScale: 1.45,
  },
};

function createStreaks(
  group: THREE.Group,
  config: StreakConfig,
  initialOpacity: number
) {
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(config.count * 6);
  const colors = new Float32Array(config.count * 6);
  const palette = config.palette.map((t) => new THREE.Color(t));

  for (let t = 0; t < config.count; t += 1) {
    const angle = Math.random() * Math.PI * 2;
    const radius = Math.random() * config.radiusSpread + config.radiusMin;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    const z = (Math.random() - 0.5) * 2000;
    const length = Math.random() * config.lengthSpread + config.lengthMin;

    positions[t * 6] = x;
    positions[t * 6 + 1] = y;
    positions[t * 6 + 2] = z;
    positions[t * 6 + 3] = x;
    positions[t * 6 + 4] = y;
    positions[t * 6 + 5] = z + length;

    const color = palette[Math.floor(Math.random() * palette.length)];
    colors[t * 6] = color.r;
    colors[t * 6 + 1] = color.g;
    colors[t * 6 + 2] = color.b;
    colors[t * 6 + 3] = color.r;
    colors[t * 6 + 4] = color.g;
    colors[t * 6 + 5] = color.b;
  }

  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

  const material = new THREE.LineBasicMaterial({
    vertexColors: true,
    transparent: true,
    opacity: initialOpacity * config.opacityScale,
    blending: THREE.AdditiveBlending,
  });

  const lines = new THREE.LineSegments(geometry, material);
  group.add(lines);

  const positionAttr = geometry.attributes.position as THREE.BufferAttribute;

  return {
    update(speed: number) {
      for (let r = 0; r < config.count; r += 1) {
        positions[r * 6 + 2] += speed;
        positions[r * 6 + 5] += speed;
        if (positions[r * 6 + 2] > WRAP_Z_THRESHOLD) {
          const delta = positions[r * 6 + 5] - positions[r * 6 + 2];
          positions[r * 6 + 2] = STREAK_RESET_Z;
          positions[r * 6 + 5] = STREAK_RESET_Z + delta;
        }
      }
      positionAttr.needsUpdate = true;
    },
    setOpacity(opacity: number) {
      const scaled = opacity * config.opacityScale;
      if (material.opacity !== scaled) {
        material.opacity = scaled;
      }
    },
    dispose() {
      geometry.dispose();
      material.dispose();
    },
  };
}

function createTiles(group: THREE.Group, initialOpacity: number) {
  const geometry = new THREE.PlaneGeometry(8, 20);
  const baseMaterial = new THREE.MeshBasicMaterial({
    color: 16777215,
    transparent: true,
    opacity: initialOpacity,
    side: THREE.DoubleSide,
  });
  const tiles: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial>[] = [];
  let currentOpacity = initialOpacity;

  for (let p = 0; p < 40; p += 1) {
    const mat = baseMaterial.clone();
    mat.color.setHex(
      Math.random() > 0.6
        ? 11006928 // 0xA7F3D0
        : Math.random() > 0.5
        ? 13761253 // 0xD1FAE5
        : 16777215 // 0xFFFFFF
    );
    const mesh = new THREE.Mesh(geometry, mat);
    const angle = Math.random() * Math.PI * 2;
    const dist = Math.random() * 400 + 100;
    mesh.position.x = Math.cos(angle) * dist;
    mesh.position.y = Math.sin(angle) * dist;
    mesh.position.z = (Math.random() - 0.5) * 2000;
    mesh.lookAt(0, 0, mesh.position.z + 100);
    const scale = Math.random() * 1.5 + 0.5;
    mesh.scale.set(scale, scale, scale);
    group.add(mesh);
    tiles.push(mesh);
  }

  return {
    update(speed: number) {
      tiles.forEach((tile) => {
        tile.position.z += speed;
        if (tile.position.z > WRAP_Z_THRESHOLD) {
          tile.position.z = STREAK_RESET_Z;
        }
      });
    },
    setOpacity(_streakOpacity: number, tileOpacity: number) {
      if (currentOpacity !== tileOpacity) {
        tiles.forEach((tile) => {
          tile.material.opacity = tileOpacity;
        });
        currentOpacity = tileOpacity;
      }
    },
    dispose() {
      geometry.dispose();
      baseMaterial.dispose();
      tiles.forEach((tile) => tile.material.dispose());
    },
  };
}

function createGlyphAtlas(color: string) {
  const canvas = document.createElement("canvas");
  canvas.width = 768;
  canvas.height = 768;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    ctx.fillStyle = color;
    ctx.font = `700 ${Math.round(128 * 0.68)}px ui-monospace, "SF Mono", Menlo, Consolas, monospace`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    GLYPH_CHARS.split("").forEach((char, index) => {
      const col = index % 6;
      const row = Math.floor(index / 6);
      ctx.fillText(char, col * 128 + 128 / 2, row * 128 + 128 * 0.54);
    });
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  return { texture, columns: 6, rows: 6 };
}

function createGlyphGeometries(atlas: {
  texture: THREE.CanvasTexture;
  columns: number;
  rows: number;
}) {
  return GLYPH_CHARS.split("").map((_char, index) => {
    const geom = new THREE.PlaneGeometry(1, 1);
    const col = index % atlas.columns;
    const row = Math.floor(index / atlas.columns);
    const uOffset = col / atlas.columns;
    const vOffset = 1 - (row + 1) / atlas.rows;
    const uv = geom.attributes.uv as THREE.BufferAttribute;
    for (let i = 0; i < uv.count; i += 1) {
      uv.setXY(
        i,
        uOffset + uv.getX(i) / atlas.columns,
        vOffset + uv.getY(i) / atlas.rows
      );
    }
    uv.needsUpdate = true;
    return geom;
  });
}

function createLetters(group: THREE.Group, initialOpacity: number) {
  const atlas = createGlyphAtlas("#ffffff");
  const geometries = createGlyphGeometries(atlas);
  const materials = [16777215, 11006928, 3462041].map(
    (col) =>
      new THREE.MeshBasicMaterial({
        map: atlas.texture,
        color: col,
        transparent: true,
        opacity: initialOpacity,
        depthWrite: false,
        side: THREE.DoubleSide,
      })
  );

  interface LetterItem {
    mesh: THREE.Mesh;
    spin: number;
    swayX: number;
    swayY: number;
    phase: number;
    drift: number;
    radius: number;
  }

  const items: LetterItem[] = [];
  let currentOpacity = initialOpacity;

  for (let i = 0; i < 260; i += 1) {
    const mesh = new THREE.Mesh(
      geometries[Math.floor(Math.random() * geometries.length)],
      materials[Math.floor(Math.random() * materials.length)]
    );
    const angle = Math.random() * Math.PI * 2;
    const dist = Math.random() * 430 + 60;
    mesh.position.set(
      Math.cos(angle) * dist,
      Math.sin(angle) * dist,
      LETTER_FAR + Math.random() * (LETTER_NEAR - LETTER_FAR)
    );
    const scale = Math.random() * 30 + 24;
    mesh.scale.set(scale, scale, scale);
    group.add(mesh);
    items.push({
      mesh,
      spin: (Math.random() - 0.5) * 0.02,
      swayX: Math.random() * 0.5 + 0.2,
      swayY: Math.random() * 0.6 + 0.2,
      phase: Math.random() * Math.PI * 2,
      drift: Math.random() * 0.9 + 0.2,
      radius: dist,
    });
  }

  return {
    update(speed: number, time: number) {
      items.forEach((item) => {
        const { mesh } = item;
        mesh.position.z += speed;
        const progress = time * item.drift + item.phase;
        mesh.position.x += Math.cos(progress) * item.drift * 0.9;
        mesh.position.y += Math.sin(progress * 0.8) * item.drift * 0.9;
        mesh.rotation.z += item.spin;
        mesh.rotation.x = Math.sin(progress * 0.6) * item.swayX;
        mesh.rotation.y = Math.cos(progress * 0.5) * item.swayY;
        if (mesh.position.z > LETTER_NEAR) {
          const angle = Math.random() * Math.PI * 2;
          const dist = Math.random() * 430 + 60;
          mesh.position.set(
            Math.cos(angle) * dist,
            Math.sin(angle) * dist,
            LETTER_FAR
          );
        }
      });
    },
    setOpacity(_streakOpacity: number, tileOpacity: number) {
      if (currentOpacity !== tileOpacity) {
        materials.forEach((mat) => {
          mat.opacity = tileOpacity;
        });
        currentOpacity = tileOpacity;
      }
    },
    dispose() {
      geometries.forEach((g) => g.dispose());
      materials.forEach((m) => m.dispose());
      atlas.texture.dispose();
    },
  };
}

function createKeycapGeometry(
  width: number,
  height: number,
  depth: number
) {
  const geom = new THREE.BoxGeometry(width, height, depth);
  const pos = geom.attributes.position as THREE.BufferAttribute;
  for (let d = 0; d < pos.count; d += 1) {
    if (pos.getY(d) > 0) {
      pos.setXYZ(
        d,
        pos.getX(d) * 0.78,
        pos.getY(d),
        pos.getZ(d) * 0.78
      );
    }
  }
  pos.needsUpdate = true;
  geom.computeVertexNormals();
  return geom;
}

function createPointGlowTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, "rgba(255,255,255,1)");
    grad.addColorStop(0.4, "rgba(255,255,255,0.5)");
    grad.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 64, 64);
  }
  return new THREE.CanvasTexture(canvas);
}

function createDustParticles(
  group: THREE.Group,
  count: number,
  size: number,
  color: number,
  opacity: number,
  spread: number
) {
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(count * 3);
  for (let u = 0; u < count; u += 1) {
    const angle = Math.random() * Math.PI * 2;
    const radius = Math.random() * spread + 20;
    positions[u * 3] = Math.cos(angle) * radius;
    positions[u * 3 + 1] = Math.sin(angle) * radius;
    positions[u * 3 + 2] = (Math.random() - 0.5) * 2000;
  }
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  const glowTexture = createPointGlowTexture();
  const material = new THREE.PointsMaterial({
    map: glowTexture,
    color,
    size,
    transparent: true,
    opacity,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    sizeAttenuation: true,
  });
  const points = new THREE.Points(geometry, material);
  group.add(points);
  const positionAttr = geometry.attributes.position as THREE.BufferAttribute;

  return {
    positions,
    count,
    material,
    update(speed: number) {
      for (let y = 0; y < count; y += 1) {
        positions[y * 3 + 2] += speed;
        if (positions[y * 3 + 2] > WRAP_Z_THRESHOLD) {
          positions[y * 3 + 2] = STREAK_RESET_Z;
        }
      }
      positionAttr.needsUpdate = true;
    },
    dispose() {
      geometry.dispose();
      material.dispose();
      glowTexture.dispose();
    },
  };
}

function createKeycaps(
  scene: THREE.Scene,
  group: THREE.Group,
  initialOpacity: number
) {
  const atlas = createGlyphAtlas("#ffffff");
  const glyphGeometries = createGlyphGeometries(atlas);
  const capGeometry = createKeycapGeometry(26, 14, 26);

  const baseMaterials = [4016196, 5266519, 2831409].map(
    (col) =>
      new THREE.MeshLambertMaterial({
        color: col,
        emissive: 200971,
        transparent: true,
        opacity: initialOpacity,
      })
  );

  const labelMaterials = [10352079, 16777215].map(
    (col) =>
      new THREE.MeshBasicMaterial({
        map: atlas.texture,
        color: col,
        transparent: true,
        opacity: initialOpacity,
        depthWrite: false,
        side: THREE.DoubleSide,
      })
  );

  const ambient = new THREE.AmbientLight(989719, 1);
  const dirLight1 = new THREE.DirectionalLight(16056315, 1.9);
  dirLight1.position.set(0.4, 1, 0.7);
  const dirLight2 = new THREE.DirectionalLight(3462041, 0.45);
  dirLight2.position.set(-0.7, -0.4, 0.5);
  const pointLight = new THREE.PointLight(1096065, 0.8, 900);
  pointLight.position.set(0, 0, 140);
  scene.add(ambient, dirLight1, dirLight2, pointLight);

  interface KeycapItem {
    mesh: THREE.Mesh;
    spin: number;
    swayX: number;
    swayY: number;
    phase: number;
    drift: number;
    radius: number;
  }

  const items: KeycapItem[] = [];
  let currentOpacity = initialOpacity;

  for (let i = 0; i < 95; i += 1) {
    const baseMesh = new THREE.Mesh(
      capGeometry,
      baseMaterials[Math.floor(Math.random() * baseMaterials.length)]
    );
    const labelMesh = new THREE.Mesh(
      glyphGeometries[Math.floor(Math.random() * glyphGeometries.length)],
      labelMaterials[Math.floor(Math.random() * labelMaterials.length)]
    );
    labelMesh.scale.set(15, 15, 15);
    labelMesh.position.y = 7.2;
    labelMesh.rotation.x = -Math.PI / 2;
    baseMesh.add(labelMesh);

    const angle = Math.random() * Math.PI * 2;
    const dist = Math.random() * 430 + 130;
    baseMesh.position.set(
      Math.cos(angle) * dist,
      Math.sin(angle) * dist,
      KEYCAP_FAR + Math.random() * (KEYCAP_NEAR - KEYCAP_FAR)
    );
    baseMesh.rotation.set(
      Math.random() * Math.PI,
      Math.random() * Math.PI,
      Math.random() * Math.PI
    );
    const scale = Math.random() * 1.15 + 0.8;
    baseMesh.scale.set(scale, scale, scale);
    group.add(baseMesh);
    items.push({
      mesh: baseMesh,
      spin: (Math.random() - 0.5) * 0.03,
      swayX: (Math.random() - 0.5) * 0.026,
      swayY: (Math.random() - 0.5) * 0.03,
      phase: 0,
      drift: 0,
      radius: dist,
    });
  }

  const dust = createDustParticles(
    group,
    750,
    7,
    7268279,
    initialOpacity,
    620
  );

  return {
    update(speed: number) {
      items.forEach((item) => {
        item.mesh.position.z += speed;
        item.mesh.rotation.x += item.swayX;
        item.mesh.rotation.y += item.swayY;
        item.mesh.rotation.z += item.spin;
        if (item.mesh.position.z > KEYCAP_NEAR) {
          const angle = Math.random() * Math.PI * 2;
          const dist = Math.random() * 430 + 130;
          item.mesh.position.set(
            Math.cos(angle) * dist,
            Math.sin(angle) * dist,
            KEYCAP_FAR
          );
        }
      });
      dust.update(speed * 1.35);
    },
    setOpacity(streakOpacity: number, tileOpacity: number) {
      if (dust.material.opacity !== streakOpacity) {
        dust.material.opacity = streakOpacity;
      }
      if (currentOpacity !== tileOpacity) {
        baseMaterials.forEach((m) => (m.opacity = tileOpacity));
        labelMaterials.forEach((m) => (m.opacity = tileOpacity));
        currentOpacity = tileOpacity;
      }
    },
    dispose() {
      capGeometry.dispose();
      glyphGeometries.forEach((g) => g.dispose());
      baseMaterials.forEach((m) => m.dispose());
      labelMaterials.forEach((m) => m.dispose());
      atlas.texture.dispose();
      dust.dispose();
      scene.remove(ambient, dirLight1, dirLight2, pointLight);
    },
  };
}

function createHyperspaceTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, 512, 512);
    for (let i = 0; i < 240; i += 1) {
      const x = Math.random() * 512;
      const width = Math.random() * 3 + 0.6;
      const height = Math.random() * 320 + 90;
      const y = Math.random() * 512;
      const alpha = (Math.random() * 0.45 + 0.08).toFixed(3);
      for (const offset of [-512, 0, 512]) {
        const grad = ctx.createLinearGradient(
          0,
          y + offset,
          0,
          y + offset + height
        );
        grad.addColorStop(0, "rgba(191,219,254,0)");
        grad.addColorStop(0.5, `rgba(224,238,255,${alpha})`);
        grad.addColorStop(1, "rgba(147,197,253,0)");
        ctx.fillStyle = grad;
        ctx.fillRect(x, y + offset, width, height);
      }
    }
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 2);
  return texture;
}

function createCoreGlowTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    const grad = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
    grad.addColorStop(0, "rgba(255,255,255,1)");
    grad.addColorStop(0.18, "rgba(219,234,254,0.55)");
    grad.addColorStop(0.45, "rgba(96,165,250,0.16)");
    grad.addColorStop(1, "rgba(2,6,23,0)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 256, 256);
  }
  return new THREE.CanvasTexture(canvas);
}

function createHyperspace(group: THREE.Group, initialOpacity: number) {
  const tunnelTexture = createHyperspaceTexture();
  const cylinderGeometry = new THREE.CylinderGeometry(
    900,
    240,
    3000,
    64,
    1,
    true
  );
  cylinderGeometry.rotateX(Math.PI / 2);

  const tunnelMaterial = new THREE.MeshBasicMaterial({
    map: tunnelTexture,
    side: THREE.BackSide,
    transparent: true,
    opacity: initialOpacity * 0.6,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  const tunnelMesh = new THREE.Mesh(cylinderGeometry, tunnelMaterial);
  tunnelMesh.position.z = -1400;
  group.add(tunnelMesh);

  const glowTexture = createCoreGlowTexture();
  const spriteMaterial = new THREE.SpriteMaterial({
    map: glowTexture,
    transparent: true,
    opacity: initialOpacity,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  const glowSprite = new THREE.Sprite(spriteMaterial);
  glowSprite.position.z = -900;
  glowSprite.scale.set(760, 760, 1);
  group.add(glowSprite);

  let currentOpacity = initialOpacity;

  return {
    update(speed: number, time: number) {
      tunnelTexture.offset.y -= speed * 0.0016;
      tunnelMesh.rotation.z += 0.0016;
      const pulse = 1 + Math.sin(time * 1.6) * 0.06;
      glowSprite.scale.set(760 * pulse, 760 * pulse, 1);
    },
    setOpacity(_streakOpacity: number, tileOpacity: number) {
      if (currentOpacity !== tileOpacity) {
        tunnelMaterial.opacity = tileOpacity * 0.6;
        spriteMaterial.opacity = tileOpacity;
        currentOpacity = tileOpacity;
      }
    },
    dispose() {
      cylinderGeometry.dispose();
      tunnelMaterial.dispose();
      tunnelTexture.dispose();
      spriteMaterial.dispose();
      glowTexture.dispose();
    },
  };
}

export function createWarpFieldRenderer(
  canvas: HTMLCanvasElement,
  getOptions: () => WarpFieldOptions
) {
  const options = getOptions();
  const variant = WARP_FIELD_VARIANTS.includes(options.variant)
    ? options.variant
    : WARP_FIELD_DEFAULTS.variant;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(BACKGROUND_COLORS[variant]);
  scene.fog = new THREE.FogExp2(BACKGROUND_COLORS[variant], 0.001);

  const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 2000);
  camera.position.z = 0;

  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
    powerPreference: "high-performance",
  });
  renderer.setPixelRatio(
    Math.min(typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1, 2)
  );

  const group = new THREE.Group();
  scene.add(group);

  const layers: {
    update?: (speed: number, time: number) => void;
    setOpacity?: (streakOpacity: number, tileOpacity: number) => void;
    dispose: () => void;
  }[] = [createStreaks(group, STREAK_CONFIGS[variant], options.streakOpacity)];

  if (variant === "streaks") {
    layers.push(createTiles(group, options.tileOpacity));
  } else if (variant === "letters") {
    layers.push(createLetters(group, options.tileOpacity));
  } else if (variant === "keycaps") {
    layers.push(createKeycaps(scene, group, options.tileOpacity));
  } else if (variant === "hyperspace") {
    layers.push(createHyperspace(group, options.tileOpacity));
  }

  let time = 0;

  return {
    resize(width: number, height: number) {
      camera.aspect = width / Math.max(1, height);
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
    },
    render() {
      const currentOpts = getOptions();
      if (camera.fov !== currentOpts.fov) {
        camera.fov = currentOpts.fov;
        camera.updateProjectionMatrix();
      }
      time += 1 / 60;
      const speed = currentOpts.speed * SPEED_SCALES[variant];
      layers.forEach((layer) => {
        layer.setOpacity?.(currentOpts.streakOpacity, currentOpts.tileOpacity);
        layer.update?.(speed, time);
      });
      renderer.render(scene, camera);
    },
    dispose() {
      layers.forEach((layer) => layer.dispose());
      renderer.dispose();
    },
  };
}
