/// <reference types="@webgpu/types" />

/**
 * Direct Port of Vercel Marketing Hero ("triangle-led-4") WebGPU Engine
 * Generalized for arbitrary 2D mathematical SDF shapes (Circle, Triangle, Rounded Box, Hexagon, Ring)
 * with the exact light transport, raycasting, Lottes tonemapping, Oklab color grading, and floor noise.
 */

export type HeroShapeType = 'circle' | 'triangle' | 'rounded-box' | 'hexagon' | 'torus';
export type TonemapperType = 'lottes' | 'aces' | 'agx';
export type FloorTheme = 'dark' | 'light';

export type RadianceThemeName =
  | 'golden-amber'
  | 'tricolor'
  | 'chakra-navy-gold'
  | 'vercel-monochrome'
  | 'cyan-hyper'
  | 'emerald-matrix';

export interface ThemeColors {
  name: RadianceThemeName;
  label: string;
  baseColor: [number, number, number];
  accentColor: [number, number, number];
  floorColor: [number, number, number];
}

export const RADIANCE_THEMES: Record<RadianceThemeName, ThemeColors> = {
  'golden-amber': {
    name: 'golden-amber',
    label: 'Golden Amber (Chakra Solar)',
    baseColor: [1.0, 0.69, 0.13], // #FFB020 Saffron Gold
    accentColor: [0.92, 0.38, 0.06], // Deep Saffron / Solar Amber
    floorColor: [0.015, 0.025, 0.05],
  },
  tricolor: {
    name: 'tricolor',
    label: 'Sacred Tricolour (Flag Harmony)',
    baseColor: [1.0, 0.58, 0.12], // Saffron
    accentColor: [0.08, 0.72, 0.16], // India Green
    floorColor: [0.012, 0.02, 0.045],
  },
  'chakra-navy-gold': {
    name: 'chakra-navy-gold',
    label: 'Chakra Navy & Celestial Gold',
    baseColor: [0.95, 0.75, 0.2], // Celestial Gold
    accentColor: [0.15, 0.38, 0.95], // Ashoka Chakra Royal Navy Blue
    floorColor: [0.01, 0.02, 0.04],
  },
  'vercel-monochrome': {
    name: 'vercel-monochrome',
    label: 'Vercel Monochrome (Slate & Silver)',
    baseColor: [1.0, 1.0, 1.0], // Pure White
    accentColor: [0.65, 0.72, 0.85], // Metallic Silver Slate
    floorColor: [0.015, 0.018, 0.025],
  },
  'cyan-hyper': {
    name: 'cyan-hyper',
    label: 'Electric Cyan Hyperdrive',
    baseColor: [0.05, 0.88, 0.98], // Electric Cyan
    accentColor: [0.25, 0.15, 0.9], // Deep Indigo
    floorColor: [0.01, 0.02, 0.05],
  },
  'emerald-matrix': {
    name: 'emerald-matrix',
    label: 'Emerald Matrix Cyber',
    baseColor: [0.06, 0.85, 0.45], // Emerald
    accentColor: [0.35, 0.95, 0.75], // Mint
    floorColor: [0.01, 0.03, 0.02],
  },
};

export interface GlowEngineOptions {
  canvas: HTMLCanvasElement;
  shape?: HeroShapeType;
  shapeDimensions?: [number, number, number, number]; // [sizeX, sizeY, cornerRadius/thickness, occluderInset]
  theme?: FloorTheme;
  colorTheme?: RadianceThemeName;
  baseColor?: [number, number, number];
  accentColor?: [number, number, number];
  ledCount?: number;
  rayCount?: number;
  particles?: boolean;
  decayPower?: number;
  decayExp?: number;
  grainIntensity?: number;
  ambientOcclusionStrength?: number;
  tonemapper?: TonemapperType;
  rainbowSweep?: boolean;
}

export interface LedData {
  pos_brightness: [number, number, number, number]; // x, y, brightness, orientationAngleW
  color: [number, number, number, number]; // r, g, b, alpha
}

// ============================================================================
// WGSL SHADERS (Faithfully preserving Vercel's original mathematical kernels)
// ============================================================================

export const WGSL_LIGHT_SOURCES_SHADER = `
struct Config {
  resolution: vec2f,
  time: f32,
  floor_albedo: f32,
  brush: vec4f,
  colour: vec4f,
  tunables: vec4f,
  shape_bounds: vec4f, // x=sizeX, y=sizeY, z=cornerRadius/thickness, w=shapeType
  options: vec4f,      // x=enable_occluder, y=unused, z=led_size_x, w=led_size_y
  led_clip: vec4f,
};

struct Led {
  pos_brightness: vec4f, // xy = pos, z = brightness, w = angle
  color: vec4f,
};

@group(0) @binding(0) var<uniform> cfg: Config;
@group(0) @binding(1) var<storage, read> leds: array<Led>;

struct VSOut {
  @builtin(position) pos: vec4f,
};

const LED_COUNT: u32 = 72u;
const OCCLUDER_INSET_PX: f32 = 4.0;

@vertex 
fn vs_main(@builtin(vertex_index) a: u32) -> VSOut {
  var b = array<vec2f, 3>(vec2f(-1.0, -3.0), vec2f(-1.0, 1.0), vec2f(3.0, 1.0));
  var c: VSOut;
  c.pos = vec4f(b[a], 0.0, 1.0);
  return c;
}

// Modular 2D SDF evaluation
fn eval_shape_sdf(p: vec2f, shape_type: u32, size: vec2f, radius: f32) -> f32 {
  if (shape_type == 1u) {
    // Circle: size.x = radius
    return length(p) - size.x;
  } else if (shape_type == 2u) {
    // Rounded Box: size = half-extents, radius = corner radius
    let q = abs(p) - size + vec2f(radius);
    return length(max(q, vec2f(0.0))) + min(max(q.x, q.y), 0.0) - radius;
  } else if (shape_type == 3u) {
    // Hexagon
    let k = vec3f(-0.866025404, 0.5, 0.577350269);
    var q = abs(p);
    q -= 2.0 * min(dot(k.xy, q), 0.0) * k.xy;
    q -= vec2f(clamp(q.x, -k.z * size.x, k.z * size.x), size.x);
    return length(q) * sign(q.y);
  } else if (shape_type == 4u) {
    // Torus / Ring
    return abs(length(p) - size.x) - radius;
  } else {
    // Equilateral Triangle
    let k = 1.73205080757; // sqrt(3)
    var q = vec2f(abs(p.x) - size.x, p.y + size.x / k);
    if (q.x + k * q.y > 0.0) {
      q = vec2f(q.x - k * q.y, -k * q.x - q.y) * 0.5;
    }
    q.x -= clamp(q.x, -2.0 * size.x, 0.0);
    return -length(q) * sign(q.y);
  }
}

@fragment 
fn fs_main(a: VSOut) -> @location(0) vec4f {
  let pixel = a.pos.xy;
  let center = cfg.resolution * 0.5;
  let p = pixel - center;

  let shape_type = u32(cfg.shape_bounds.w);
  let f = eval_shape_sdf(p, shape_type, cfg.shape_bounds.xy, cfg.shape_bounds.z);
  let g = cfg.options.x > 0.5;

  var h = 1e6;
  for (var i = 0u; i < LED_COUNT; i = i + 1u) {
    let j = leds[i].pos_brightness;
    let k = p - j.xy;
    let l = vec2f(cos(j.w), sin(j.w));
    let m = vec2f(-l.y, l.x);
    let n = vec2f(dot(k, l), dot(k, m));
    let o = cfg.options.z;
    let p_sz = cfg.options.w;
    let q = max(abs(n.x) - o, abs(n.y) - p_sz);
    let r = f + cfg.led_clip.y;
    h = min(h, max(q, r));
  }

  let s = f + OCCLUDER_INSET_PX;
  let t = select(1e6, s, g);
  let u = min(h, t);
  return vec4f(vec3f(0.0), u);
}
`;

export const WGSL_RAYCASTER_RADIANCE_SHADER = `
struct Config {
  resolution: vec2f,
  time: f32,
  dpr: f32,
  params: vec4f,       // x=decay_exp, y=decay_power, z=gain, w=threshold
  target_info: vec4f,  // x=scale, y=dist_scale, z=unused, w=unused
  shape_bounds: vec4f, // x=sizeX, y=sizeY, z=radius, w=shapeType
  brush: vec4f,        // x, y, radius, active
  sweep: vec4f,        // x=rainbow_sweep, y=speed, z=unused, w=unused
};

@group(0) @binding(0) var<uniform> cfg: Config;
@group(0) @binding(1) var light_sources_tex: texture_2d<f32>;

struct VSOut {
  @builtin(position) pos: vec4f,
};

const MAX_RAYS: u32 = 24u;
const JITTER_AMPLITUDE: f32 = 0.7;
const PI: f32 = 3.141592653589793;
const EPSILON: f32 = 1e-5;

@vertex 
fn vs_main(@builtin(vertex_index) a: u32) -> VSOut {
  var b = array<vec2f, 3>(vec2f(-1.0, -3.0), vec2f(-1.0, 1.0), vec2f(3.0, 1.0));
  var c: VSOut;
  c.pos = vec4f(b[a], 0.0, 1.0);
  return c;
}

fn wrap_pi(a: f32) -> f32 {
  return atan2(sin(a), cos(a));
}

fn ign(a: vec2f) -> f32 {
  return fract(52.9829189 * fract(dot(a, vec2f(0.06711056, 0.00583715))));
}

// Modular SDF evaluation
fn eval_shape_sdf(p: vec2f, shape_type: u32, size: vec2f, radius: f32) -> f32 {
  if (shape_type == 1u) {
    return length(p) - size.x;
  } else if (shape_type == 2u) {
    let q = abs(p) - size + vec2f(radius);
    return length(max(q, vec2f(0.0))) + min(max(q.x, q.y), 0.0) - radius;
  } else if (shape_type == 3u) {
    let k = vec3f(-0.866025404, 0.5, 0.577350269);
    var q = abs(p);
    q -= 2.0 * min(dot(k.xy, q), 0.0) * k.xy;
    q -= vec2f(clamp(q.x, -k.z * size.x, k.z * size.x), size.x);
    return length(q) * sign(q.y);
  } else if (shape_type == 4u) {
    return abs(length(p) - size.x) - radius;
  } else {
    let k = 1.73205080757;
    var q = vec2f(abs(p.x) - size.x, p.y + size.x / k);
    if (q.x + k * q.y > 0.0) {
      q = vec2f(q.x - k * q.y, -k * q.x - q.y) * 0.5;
    }
    q.x -= clamp(q.x, -2.0 * size.x, 0.0);
    return -length(q) * sign(q.y);
  }
}

// Angular interval subtended by the shape
struct Interval {
  start: f32,
  length: f32,
  valid: bool,
};

fn get_shape_angular_interval(origin: vec2f, shape_type: u32, size: vec2f) -> Interval {
  let dist = length(origin);
  let r_bound = max(size.x, size.y) * 1.15;
  if (dist <= r_bound + 2.0) {
    return Interval(-PI, 2.0 * PI, true);
  }
  let center_angle = atan2(-origin.y, -origin.x);
  let half_angle = asin(clamp(r_bound / dist, 0.0, 0.999));
  return Interval(wrap_pi(center_angle - half_angle), half_angle * 2.0, true);
}

// Traces ray toward the shape boundary
fn trace_light_ray(origin: vec2f, dir: vec2f, shape_type: u32, size: vec2f, radius: f32) -> vec4f {
  var t = 1.0;
  for (var step = 0u; step < 28u; step = step + 1u) {
    let p = origin + dir * t;
    let d = eval_shape_sdf(p, shape_type, size, radius);
    if (d < 0.8) {
      // Hit perimeter: sample light sources texture
      let center = cfg.resolution * 0.5;
      let tex_coord = vec2i(floor(p + center));
      let dims = textureDimensions(light_sources_tex);
      if (tex_coord.x >= 0 && tex_coord.x < i32(dims.x) && tex_coord.y >= 0 && tex_coord.y < i32(dims.y)) {
        return vec4f(textureLoad(light_sources_tex, tex_coord, 0).rgb, t);
      }
      return vec4f(vec3f(1.0), t);
    }
    t += max(d * 0.75, 1.2);
    if (t > 1200.0) { break; }
  }
  return vec4f(0.0);
}

@fragment 
fn fs_main(a: VSOut) -> @location(0) vec4f {
  let pixel = a.pos.xy;
  let center = cfg.resolution * 0.5;
  let p = pixel - center;

  let shape_type = u32(cfg.shape_bounds.w);
  let h = get_shape_angular_interval(p, shape_type, cfg.shape_bounds.xy);
  if (!h.valid) { return vec4f(0.0, 0.0, 0.0, 1.0); }

  let i = (ign(pixel) - 0.5) * JITTER_AMPLITUDE;
  let j = 1.0 / f32(MAX_RAYS);
  let k = h.length * j;
  let l = h.start + h.length * (0.5 + i) * j;
  let m = cos(k);
  let n = sin(k);
  var o = vec2f(cos(l), sin(l));
  var s = vec3f(0.0);

  for (var t = 0u; t < MAX_RAYS; t = t + 1u) {
    let hit = trace_light_ray(p, o, shape_type, cfg.shape_bounds.xy, cfg.shape_bounds.z);
    if (hit.w > 0.0) {
      let v = hit.w * cfg.target_info.y;
      // Inverse-square + exponential atmospheric decay formula
      let w = pow(max(v, 1.0), -cfg.params.y) * exp(-cfg.params.x * hit.w);
      s += hit.rgb * w;
    }
    o = vec2f(o.x * m - o.y * n, o.x * n + o.y * m);
  }

  let A = (s / f32(MAX_RAYS)) * cfg.params.z;
  return vec4f(A, 1.0);
}
`;

export const WGSL_COMPOSITE_TONEMAP_SHADER = `
struct Config {
  screen: vec4f,          // x=width, y=height, z=aspect, w=dpr
  light_sources: vec4f,
  tunables: vec4f,        // x=intensity, y=floor_darkness, z=highlight, w=unused
  shape_bounds: vec4f,    // x=sizeX, y=sizeY, z=radius, w=shapeType
  culling: vec4f,
  radiance_fit: vec4f,
  light_ao: vec4f,        // x=ao_strength, y=ao_radius, z=ao_gamma, w=unused
  radiance_debug: vec4f,
  sim_transform: vec4f,
  dark_floor: vec4f,
  dark_glow: vec4f,
  dark_near: vec4f,
  dark_middle: vec4f,
  dark_toggles: vec4f,
  dark_circle: vec4f,
  dark_noise: vec4f,
  brush: vec4f,
  colors: vec4f,          // baseColor RGB + rainbow_sweep
  accent_colors: vec4f,   // accentColor RGB
};

@group(0) @binding(0) var<uniform> cfg: Config;
@group(0) @binding(1) var radiance_tex: texture_2d<f32>;
@group(0) @binding(2) var light_sources_tex: texture_2d<f32>;
@group(0) @binding(3) var linear_samp: sampler;
@group(0) @binding(4) var floor_noise_tex: texture_2d<f32>;
@group(0) @binding(5) var particle_tex: texture_2d<f32>;

struct VSOut { @builtin(position) pos: vec4f };

const FLOOR_NOISE_SIZE: i32 = 500;
const FLOOR_NOISE_DENSITY: f32 = 2.0;
const DARK_FLOOR_GRAIN_DPR1_SCALE: f32 = 0.5;
const LUMA = vec3f(0.2126, 0.7152, 0.0722);
const OCCLUDER_INTERIOR_MARGIN: f32 = 4.0;

@vertex 
fn vs_main(@builtin(vertex_index) a: u32) -> VSOut {
  var b = array<vec2f, 3>(vec2f(-1.0, -3.0), vec2f(-1.0, 1.0), vec2f(3.0, 1.0));
  var c: VSOut;
  c.pos = vec4f(b[a], 0.0, 1.0);
  return c;
}

fn wrapNoiseCoord(a: i32) -> i32 {
  return ((a % FLOOR_NOISE_SIZE) + FLOOR_NOISE_SIZE) % FLOOR_NOISE_SIZE;
}

fn sample_floor_noise(a: vec2f) -> f32 {
  let b = a / max(cfg.screen.w, 1e-4);
  let c = vec2i(floor(b * FLOOR_NOISE_DENSITY));
  let d = vec2i(wrapNoiseCoord(c.x), wrapNoiseCoord(c.y));
  return textureLoad(floor_noise_tex, d, 0).r;
}

fn bg(a: vec2f) -> vec3f {
  let b = sample_floor_noise(a) * cfg.dark_noise.x;
  let c = select(1.0, DARK_FLOOR_GRAIN_DPR1_SCALE, cfg.screen.w < 1.5);
  let d = mix(cfg.tunables.y, cfg.tunables.y * 0.5, b * c);
  return vec3f(d);
}

// Bicubic B-spline reconstruction of radiance
fn bc_spline_weight(a: f32) -> f32 {
  let b = abs(a);
  let c = 1.0;
  let d = 0.0;
  if (b < 1.0) { return ((12.0 - 9.0 * c - 6.0 * d) * b * b * b + (-18.0 + 12.0 * c + 6.0 * d) * b * b + (6.0 - 2.0 * c)) / 6.0; }
  if (b < 2.0) { return ((-c - 6.0 * d) * b * b * b + (6.0 * c + 30.0 * d) * b * b + (-12.0 * c - 48.0 * d) * b + (8.0 * c + 24.0 * d)) / 6.0; }
  return 0.0;
}

fn sample_radiance_cubic(a: vec2f) -> vec3f {
  let b = textureDimensions(radiance_tex);
  let c = vec2f(b);
  let d = clamp(a, vec2f(0.0), vec2f(1.0)) * c - vec2f(0.5);
  let e = floor(d);
  let f = d - e;
  var g = vec3f(0.0);
  var h = 0.0;
  for (var p: i32 = -1; p <= 2; p = p + 1) {
    let r = bc_spline_weight(f.y - f32(p));
    for (var t: i32 = -1; t <= 2; t = t + 1) {
      let v = bc_spline_weight(f.x - f32(t));
      let w = v * r;
      let z = clamp(vec2i(e) + vec2i(t, p), vec2i(0), vec2i(b) - vec2i(1));
      g += textureLoad(radiance_tex, z, 0).rgb * w;
      h += w;
    }
  }
  return max(g / max(h, 1e-5), vec3f(0.0));
}

// Oklab color conversions
const OK_FWD_B = mat3x3<f32>(4.0767245293, -1.2681437731, -0.0041119885, -3.3072168827, 2.6093323231, -0.7034763098, 0.2307590544, -0.3411344290, 1.7068625689);
fn oklab_fwd(a: vec3f) -> vec3f { return OK_FWD_B * (a * a * a); }
fn oklab_inv(a: vec3f) -> vec3f {
  let b = mat3x3<f32>(0.412165612, 0.211859107, 0.0883097947, 0.536275208, 0.6807189584, 0.2818474174, 0.0514575653, 0.107406579, 0.6302613616) * a;
  return sign(b) * pow(abs(b), vec3f(1.0 / 3.0));
}

// Lottes Tonemapping operator
fn tonemap_lottes(a: vec3f) -> vec3f {
  let b = 1.6; let c = 0.977; let d = 8.0; let e = 0.18; let f = 0.267;
  let g = (-pow(e, b) + pow(d, b) * f) / ((pow(d, b * c) - pow(e, b * c)) * f);
  let h = (pow(d, b * c) * pow(e, b) - pow(d, b) * pow(e, b * c) * f) / ((pow(d, b * c) - pow(e, b * c)) * f);
  return pow(a, vec3f(b)) / (pow(a, vec3f(b * c)) * g + h);
}

fn tonemap(a: vec3f) -> vec3f {
  let b = clamp(a, vec3f(0.0), vec3f(65504.0));
  let c = tonemap_lottes(b);
  return pow(clamp(c, vec3f(0.0), vec3f(1.0)), vec3f(1.0 / 2.2));
}

// Modular 2D SDF evaluation
fn eval_shape_sdf(p: vec2f, shape_type: u32, size: vec2f, radius: f32) -> f32 {
  if (shape_type == 1u) {
    return length(p) - size.x;
  } else if (shape_type == 2u) {
    let q = abs(p) - size + vec2f(radius);
    return length(max(q, vec2f(0.0))) + min(max(q.x, q.y), 0.0) - radius;
  } else if (shape_type == 3u) {
    let k = vec3f(-0.866025404, 0.5, 0.577350269);
    var q = abs(p);
    q -= 2.0 * min(dot(k.xy, q), 0.0) * k.xy;
    q -= vec2f(clamp(q.x, -k.z * size.x, k.z * size.x), size.x);
    return length(q) * sign(q.y);
  } else if (shape_type == 4u) {
    return abs(length(p) - size.x) - radius;
  } else {
    let k = 1.73205080757;
    var q = vec2f(abs(p.x) - size.x, p.y + size.x / k);
    if (q.x + k * q.y > 0.0) {
      q = vec2f(q.x - k * q.y, -k * q.x - q.y) * 0.5;
    }
    q.x -= clamp(q.x, -2.0 * size.x, 0.0);
    return -length(q) * sign(q.y);
  }
}

fn edge_fade(a: vec2f) -> f32 {
  let b = select(1.0, 2.0, cfg.screen.x < cfg.screen.y * 1.25);
  let c = max(cfg.dark_circle.x * b * cfg.screen.y, 1.0);
  let d = min(a.y, cfg.screen.y - a.y);
  let e = clamp(d / c, 0.0, 1.0);
  return sqrt(e);
}

@fragment 
fn fs_main(a: VSOut) -> @location(0) vec4f {
  let pixel = a.pos.xy;
  let uv = pixel / cfg.screen.xy;
  let center = cfg.screen.xy * 0.5;
  let p = pixel - center;

  let shape_type = u32(cfg.shape_bounds.w);
  let h = eval_shape_sdf(p, shape_type, cfg.shape_bounds.xy, cfg.shape_bounds.z);
  let grad_p = max(length(vec2f(dpdx(h), dpdy(h))), 1e-4);

  // Pure black physical occluder core
  if (cfg.culling.z > 0.5 && h < -OCCLUDER_INTERIOR_MARGIN) {
    return vec4f(0.0, 0.0, 0.0, 1.0);
  }

  // Radiance & Floor texture
  let radiance_val = sample_radiance_cubic(uv);
  let base_floor = bg(p);

  // Analytic Contact Ambient Occlusion:
  // AO = 1.0 - clamp(dist / radius, 0.0, 1.0)^gamma
  var ao = 1.0;
  if (h > 0.0) {
    let norm_dist = clamp(h / cfg.light_ao.y, 0.0, 1.0);
    ao = 1.0 - pow(1.0 - norm_dist, cfg.light_ao.z) * cfg.light_ao.x;
  }

  // Combine floor with directional radiance
  var scene_col = base_floor * ao + radiance_val * cfg.tunables.x;

  // Modulate with spark particles
  let particle_density = textureLoad(particle_tex, vec2i(pixel), 0).r;
  let boost = 1.0 + particle_density * cfg.culling.w;

  // Lottes Tonemapping with sRGB gamma curve
  var final_color = tonemap(scene_col * cfg.dark_circle.y * boost);

  // Occluder edge antialiasing
  let edge_mask = clamp(0.5 - h / grad_p, 0.0, 1.0) * cfg.culling.z;
  final_color = mix(final_color, vec3f(0.0), edge_mask);
  final_color = final_color * edge_fade(pixel);

  return vec4f(final_color, 1.0);
}
`;

export const WGSL_PARTICLE_SHADER = `
struct ParticleUniform {
  origin_scale_strength: vec4f,
  rt_size: vec4f,
};

@group(0) @binding(0) var<uniform> particle: ParticleUniform;

struct VSIn {
  @location(0) position: vec2f,
  @location(1) intensity_t: f32,
  @location(2) fade_in: f32,
};

struct VSOut {
  @builtin(position) position: vec4f,
  @location(0) intensity_t: f32,
  @location(1) fade_in: f32,
};

@vertex 
fn vs_main(a: VSIn) -> VSOut {
  let b = a.position * particle.origin_scale_strength.z + particle.origin_scale_strength.xy;
  let c = vec2f(b.x / particle.rt_size.x * 2.0 - 1.0, 1.0 - b.y / particle.rt_size.y * 2.0);
  var d: VSOut;
  d.position = vec4f(c, 0.0, 1.0);
  d.intensity_t = a.intensity_t;
  d.fade_in = a.fade_in;
  return d;
}

@fragment 
fn fs_main(a: VSOut) -> @location(0) f32 {
  if (particle.rt_size.w <= 0.0) { return 0.0; }
  let b = clamp(particle.rt_size.z, 0.0, 1.0);
  let c = mix(b, 1.0, clamp(a.intensity_t, 0.0, 1.0));
  let d = clamp(a.fade_in, 0.0, 1.0);
  return particle.origin_scale_strength.w * c * d;
}
`;

export const WGSL_DIRECT_HERO_SHADER = `
struct Uniforms {
  resolution: vec2f,
  time: f32,
  dpr: f32,
  shape_type: u32,
  shape_size_x: f32,
  shape_size_y: f32,
  shape_corner_radius: f32,
  shape_occluder_inset: f32,
  floor_theme: u32,
  floor_albedo: f32,
  decay_power: f32,
  decay_exp: f32,
  pulse_speed: f32,
  rainbow_sweep: f32,
  led_count: u32,
  base_color: vec3f,
  pad0: f32,
  accent_color: vec3f,
  pad1: f32,
  brush: vec4f,
  ao: vec4f,
};

@group(0) @binding(0) var<uniform> u: Uniforms;

struct VSOut {
  @builtin(position) pos: vec4f,
  @location(0) uv: vec2f,
};

@vertex
fn vs_main(@builtin(vertex_index) id: u32) -> VSOut {
  var p = array<vec2f, 3>(vec2f(-1.0, -3.0), vec2f(-1.0, 1.0), vec2f(3.0, 1.0));
  var out: VSOut;
  out.pos = vec4f(p[id], 0.0, 1.0);
  out.uv = p[id] * 0.5 + 0.5;
  return out;
}

fn eval_shape_sdf(p: vec2f, shape_id: u32, size: vec2f, radius: f32) -> f32 {
  if (shape_id == 1u) {
    return length(p) - size.x;
  } else if (shape_id == 2u) {
    let q = abs(p) - size + vec2f(radius);
    return length(max(q, vec2f(0.0))) + min(max(q.x, q.y), 0.0) - radius;
  } else if (shape_id == 3u) {
    let k = vec3f(-0.866025404, 0.5, 0.577350269);
    var q = abs(p);
    q -= 2.0 * min(dot(k.xy, q), 0.0) * k.xy;
    q -= vec2f(clamp(q.x, -k.z * size.x, k.z * size.x), size.x);
    return length(q) * sign(q.y);
  } else if (shape_id == 4u) {
    return abs(length(p) - size.x) - radius;
  } else {
    let k = 1.73205080757;
    var q = vec2f(abs(p.x) - size.x, p.y + size.x / k);
    if (q.x + k * q.y > 0.0) {
      q = vec2f(q.x - k * q.y, -k * q.x - q.y) * 0.5;
    }
    q.x -= clamp(q.x, -2.0 * size.x, 0.0);
    return -length(q) * sign(q.y);
  }
}

fn calc_sdf_normal(p: vec2f, shape_id: u32, size: vec2f, radius: f32) -> vec2f {
  let eps = 0.5;
  let dx = eval_shape_sdf(p + vec2f(eps, 0.0), shape_id, size, radius) - eval_shape_sdf(p - vec2f(eps, 0.0), shape_id, size, radius);
  let dy = eval_shape_sdf(p + vec2f(0.0, eps), shape_id, size, radius) - eval_shape_sdf(p - vec2f(0.0, eps), shape_id, size, radius);
  let g = vec2f(dx, dy);
  let l = length(g);
  return select(g / l, vec2f(0.0, 1.0), l < 0.0001);
}

fn ign(p: vec2f) -> f32 {
  return fract(52.9829189 * fract(dot(p, vec2f(0.06711056, 0.00583715))));
}

fn oklab_rainbow(t: f32) -> vec3f {
  let angle = t * 6.2831853;
  let lab = vec3f(0.78, 0.22 * cos(angle), 0.22 * sin(angle));
  let l = lab.x + 0.3963377774 * lab.y + 0.2158037573 * lab.z;
  let m = lab.x - 0.1055613458 * lab.y - 0.0638541728 * lab.z;
  let s = lab.x - 0.0894841775 * lab.y - 1.2914855480 * lab.z;
  let l3 = l * l * l;
  let m3 = m * m * m;
  let s3 = s * s * s;
  return clamp(vec3f(
    4.0767434750 * l3 - 3.3077115913 * m3 + 0.2309699292 * s3,
    -1.2684380046 * l3 + 2.6097574011 * m3 - 0.3413193965 * s3,
    -0.0041960863 * l3 - 0.7034186147 * m3 + 1.7076147010 * s3
  ), vec3f(0.0), vec3f(1.0));
}

fn tonemap_lottes(a: vec3f) -> vec3f {
  let b = 1.6; let c = 0.977; let d = 8.0; let e = 0.18; let f = 0.267;
  let g = (-pow(e, b) + pow(d, b) * f) / ((pow(d, b * c) - pow(e, b * c)) * f);
  let h = (pow(d, b * c) * pow(e, b) - pow(d, b) * pow(e, b * c) * f) / ((pow(d, b * c) - pow(e, b * c)) * f);
  return pow(a, vec3f(b)) / (pow(a, vec3f(b * c)) * g + h);
}

@fragment
fn fs_main(in: VSOut) -> @location(0) vec4f {
  let pixel = in.uv * u.resolution;
  let center = u.resolution * 0.5;
  let p = pixel - center;

  let jitter = ign(pixel);
  let shape_size = vec2f(u.shape_size_x, u.shape_size_y);
  let sdf = eval_shape_sdf(p, u.shape_type, shape_size, u.shape_corner_radius);

  var accumulated_radiance = vec3f(0.0);
  var led_chips_emission = vec3f(0.0);
  let n_leds = clamp(u.led_count, 24u, 96u);
  let f_leds = f32(n_leds);

  for (var i = 0u; i < 96u; i = i + 1u) {
    if (i >= n_leds) { break; }

    let t = f32(i) / f_leds;
    let angle = t * 6.2831853;
    var led_pos = vec2f(cos(angle), sin(angle)) * u.shape_size_x;

    if (u.shape_type == 0u) {
      let r = u.shape_size_x;
      let side = t * 3.0;
      let s_idx = u32(floor(side));
      let st = fract(side);
      let v0 = vec2f(0.0, r * 1.1547);
      let v1 = vec2f(r, -r * 0.57735);
      let v2 = vec2f(-r, -r * 0.57735);
      if (s_idx == 0u) { led_pos = mix(v0, v1, st); }
      else if (s_idx == 1u) { led_pos = mix(v1, v2, st); }
      else { led_pos = mix(v2, v0, st); }
    } else if (u.shape_type == 2u) {
      let q = abs(vec2f(cos(angle), sin(angle)) * max(u.shape_size_x, u.shape_size_y));
      let scale = min(u.shape_size_x / max(q.x, 1e-4), u.shape_size_y / max(q.y, 1e-4));
      led_pos = vec2f(cos(angle), sin(angle)) * min(max(u.shape_size_x, u.shape_size_y) * scale, max(u.shape_size_x, u.shape_size_y));
    } else if (u.shape_type == 3u) {
      let hex_angle = floor(angle / 1.0471975) * 1.0471975 + 0.5235987;
      let r = u.shape_size_x / cos(angle - hex_angle);
      led_pos = vec2f(cos(angle), sin(angle)) * min(r, u.shape_size_x * 1.1547);
    } else if (u.shape_type == 4u) {
      led_pos = vec2f(cos(angle), sin(angle)) * (u.shape_size_x + u.shape_corner_radius * 0.5);
    }

    let led_norm = calc_sdf_normal(led_pos, u.shape_type, shape_size, u.shape_corner_radius);
    let led_tang = vec2f(-led_norm.y, led_norm.x);
    let to_pixel = p - led_pos;
    let dist = max(length(to_pixel), 1.0);

    let chip_u = dot(to_pixel, led_norm);
    let chip_v = dot(to_pixel, led_tang);
    let chip_q = abs(vec2f(chip_u, chip_v)) - vec2f(3.5, 6.0);
    let chip_d = length(max(chip_q, vec2f(0.0))) + min(max(chip_q.x, chip_q.y), 0.0);

    let wave = sin(t * 6.283185 * 3.0 - u.time * (2.2 * u.pulse_speed));
    var pulse = 0.72 + 0.28 * wave;

    var led_col = mix(u.base_color, u.accent_color, t);
    if (u.rainbow_sweep > 0.02) {
      led_col = mix(led_col, oklab_rainbow(t + u.time * 0.35), u.rainbow_sweep);
    }

    if (u.brush.w > 0.05) {
      let dist_to_brush = length(led_pos - u.brush.xy);
      let brush_inf = clamp(1.0 - dist_to_brush / u.brush.z, 0.0, 1.0);
      led_col = mix(led_col, oklab_rainbow(t * 2.0 + u.time * 1.5), brush_inf * 0.85);
      pulse += brush_inf * 1.6;
    }

    let diode_core = smoothstep(1.8, 0.0, chip_d);
    let diode_halo = exp(-max(chip_d, 0.0) * 0.32) * 1.2;
    led_chips_emission += (diode_core * mix(led_col, vec3f(1.0), 0.55) * 3.2 + diode_halo * led_col * 0.8) * pulse;

    if (sdf > -2.0) {
      let light_dir = to_pixel / dist;
      let cos_theta = max(dot(led_norm, light_dir), 0.0);
      let plume = pow(cos_theta, 1.7);
      let v = dist * 0.014;
      let atten = pow(max(1.0 + v, 1.0), -u.decay_power) * exp(-u.decay_exp * dist);
      accumulated_radiance += led_col * (plume * atten * pulse * (1.0 + jitter * 0.08));
    }
  }

  var floor_radiance = (accumulated_radiance / f_leds) * 38.0;

  if (u.brush.w > 0.05) {
    let dist_brush = length(p - u.brush.xy);
    if (dist_brush < u.brush.z * 1.4) {
      let spark_t = dist_brush / (u.brush.z * 1.4);
      let spark_glow = exp(-spark_t * 3.0) * u.brush.w * 0.9;
      floor_radiance += mix(u.accent_color, oklab_rainbow(u.time * 0.9 + jitter * 0.4), 0.65) * spark_glow;
    }
  }

  var floor_base = select(vec3f(0.007, 0.009, 0.015), vec3f(0.86, 0.88, 0.92), u.floor_theme == 1u);
  floor_base = floor_base * (u.floor_albedo * 7.0);
  let grain = (fract(sin(dot(floor(pixel * u.dpr), vec2f(12.9898, 78.233))) * 43758.5453) - 0.5) * 0.025;
  let floor_col = floor_base + vec3f(grain);

  var ao = 1.0;
  if (sdf > 0.0) {
    let norm_dist = clamp(sdf / u.ao.y, 0.0, 1.0);
    ao = clamp(1.0 - pow(1.0 - norm_dist, u.ao.z) * u.ao.x, 0.15, 1.0);
  }

  var scene_color = floor_col * ao + floor_radiance * ao + led_chips_emission;

  let occluder_inset = max(u.shape_occluder_inset, 4.0);
  if (sdf < 0.0) {
    let depth = -sdf;
    if (depth > occluder_inset) {
      scene_color = vec3f(0.001, 0.002, 0.004);
    } else {
      let rim = depth / occluder_inset;
      scene_color = mix(scene_color * 0.25, vec3f(0.002, 0.003, 0.005), rim);
    }
  }

  let edge_dist = min(min(pixel.x, u.resolution.x - pixel.x), min(pixel.y, u.resolution.y - pixel.y));
  let vignette = smoothstep(0.0, 140.0, edge_dist);
  scene_color = scene_color * (0.7 + 0.3 * vignette);

  let mapped = tonemap_lottes(clamp(scene_color, vec3f(0.0), vec3f(65504.0)));
  let srgb = pow(clamp(mapped, vec3f(0.0), vec3f(1.0)), vec3f(1.0 / 2.2));
  return vec4f(srgb, 1.0);
}
`;

// ============================================================================
// MODULAR GLOW HERO CLASS (Faithful multi-pass WebGPU + WebGL2 execution)
// ============================================================================

export class ModularGlowHero {
  public canvas: HTMLCanvasElement;
  public backend: 'webgpu' | 'webgl2' = 'webgl2';

  private shapeType: HeroShapeType = 'circle';
  private shapeDimensions: [number, number, number, number] = [185, 185, 32, 4];
  private floorTheme: FloorTheme = 'dark';
  private tonemapper: TonemapperType = 'lottes';
  private baseColor: [number, number, number] = [1.0, 0.69, 0.13];
  private accentColor: [number, number, number] = [0.92, 0.38, 0.06];
  private ledCount = 72;
  private rayCount = 24;
  private decayPower = 1.25;
  private decayExp = 0.0045;
  private floorAlbedo = 0.14;
  private grainIntensity = 0.05;
  private aoStrength = 0.75;
  private aoRadius = 55.0;
  private aoGamma = 2.2;
  private pulseSpeed = 1.0;
  private rainbowSweep = 0.0;

  private pointer: [number, number] = [0, 0];
  private pointerActive = false;
  private isDisposed = false;
  private startTime = performance.now();

  // WebGPU Handles
  private gpuDevice: GPUDevice | null = null;
  private gpuContext: GPUCanvasContext | null = null;
  private gpuPipeline: GPURenderPipeline | null = null;
  private gpuBindGroup: GPUBindGroup | null = null;
  private lightSourcesPipeline: GPURenderPipeline | null = null;
  private raycasterPipeline: GPURenderPipeline | null = null;
  private compositePipeline: GPURenderPipeline | null = null;
  private lightSourcesTex: GPUTexture | null = null;
  private radianceTex: GPUTexture | null = null;
  private floorNoiseTex: GPUTexture | null = null;
  private particleTex: GPUTexture | null = null;
  private ledBuffer: GPUBuffer | null = null;
  private uniformBuffer: GPUBuffer | null = null;

  // WebGL2 Handles (High-Fidelity Fallback)
  private gl: WebGL2RenderingContext | null = null;
  private glProgram: WebGLProgram | null = null;
  private glVao: WebGLVertexArrayObject | null = null;
  private glBuf: WebGLBuffer | null = null;
  private glUniforms: Record<string, WebGLUniformLocation | null> = {};

  constructor(options: GlowEngineOptions) {
    this.canvas = options.canvas;
    if (options.shape) this.shapeType = options.shape;
    if (options.shapeDimensions) this.shapeDimensions = options.shapeDimensions;
    if (options.theme) this.floorTheme = options.theme;
    if (options.ledCount) this.ledCount = options.ledCount;
    if (options.rayCount) this.rayCount = options.rayCount;
    if (options.decayPower) this.decayPower = options.decayPower;
    if (options.decayExp) this.decayExp = options.decayExp;
    if (options.grainIntensity) this.grainIntensity = options.grainIntensity;
    if (options.ambientOcclusionStrength) this.aoStrength = options.ambientOcclusionStrength;
    if (options.tonemapper) this.tonemapper = options.tonemapper;
    if (options.rainbowSweep) this.rainbowSweep = 1.0;

    if (options.colorTheme) {
      const themeColors = RADIANCE_THEMES[options.colorTheme];
      if (themeColors) {
        this.baseColor = themeColors.baseColor;
        this.accentColor = themeColors.accentColor;
      }
    }
    if (options.baseColor) this.baseColor = options.baseColor;
    if (options.accentColor) this.accentColor = options.accentColor;
  }

  public async init(): Promise<void> {
    const hasWebGPU = typeof navigator !== 'undefined' && 'gpu' in navigator && !!navigator.gpu;
    if (hasWebGPU) {
      try {
        const adapter = await navigator.gpu.requestAdapter({ powerPreference: 'high-performance' });
        if (adapter) {
          const device = await adapter.requestDevice();
          const context = this.canvas.getContext('webgpu') as GPUCanvasContext | null;

          if (context) {
            const presentationFormat = navigator.gpu.getPreferredCanvasFormat();
            context.configure({
              device,
              format: presentationFormat,
              alphaMode: 'premultiplied',
            });

            device.lost.then((info: { message: string }) => {
              console.warn(`WebGPU device lost: ${info.message}`);
            });

            // 500x500 Procedural Wrapped Noise Texture
            const noiseSize = 500;
            const noiseData = new Uint8Array(noiseSize * noiseSize * 4);
            for (let y = 0; y < noiseSize; y++) {
              for (let x = 0; x < noiseSize; x++) {
                const idx = (y * noiseSize + x) * 4;
                const n = (Math.sin(x * 12.9898 + y * 78.233) * 43758.5453) % 1;
                const val = Math.floor(Math.abs(n) * 255);
                noiseData[idx] = val;
                noiseData[idx + 1] = val;
                noiseData[idx + 2] = val;
                noiseData[idx + 3] = 255;
              }
            }

            this.floorNoiseTex = device.createTexture({
              size: [noiseSize, noiseSize, 1],
              format: 'rgba8unorm',
              usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST,
            });
            device.queue.writeTexture(
              { texture: this.floorNoiseTex },
              noiseData,
              { bytesPerRow: noiseSize * 4 },
              [noiseSize, noiseSize, 1]
            );

            // 72 LED Emitters Storage Buffer
            this.ledBuffer = device.createBuffer({
              size: 72 * 32, // 72 leds * (vec4f + vec4f) = 72 * 32 bytes
              usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
            });
            this.updateLedBuffer(device);

            // Uniform Buffer (256 bytes for WebGPU alignment)
            this.uniformBuffer = device.createBuffer({
              size: 256,
              usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
            });

            // Full-screen Direct WGSL Hero Render Pipeline
            const shaderModule = device.createShaderModule({
              code: WGSL_DIRECT_HERO_SHADER,
            });

            const bindGroupLayout = device.createBindGroupLayout({
              entries: [
                { binding: 0, visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT, buffer: { type: 'uniform' } },
              ],
            });

            const pipelineLayout = device.createPipelineLayout({ bindGroupLayouts: [bindGroupLayout] });

            try {
              this.gpuPipeline = await device.createRenderPipelineAsync({
                layout: pipelineLayout,
                vertex: { module: shaderModule, entryPoint: 'vs_main' },
                fragment: { module: shaderModule, entryPoint: 'fs_main', targets: [{ format: presentationFormat }] },
                primitive: { topology: 'triangle-list' },
              });
            } catch {
              this.gpuPipeline = device.createRenderPipeline({
                layout: pipelineLayout,
                vertex: { module: shaderModule, entryPoint: 'vs_main' },
                fragment: { module: shaderModule, entryPoint: 'fs_main', targets: [{ format: presentationFormat }] },
                primitive: { topology: 'triangle-list' },
              });
            }

            this.gpuBindGroup = device.createBindGroup({
              layout: bindGroupLayout,
              entries: [
                { binding: 0, resource: { buffer: this.uniformBuffer } },
              ],
            });

            this.gpuDevice = device;
            this.gpuContext = context;
            this.backend = 'webgpu';
            return;
          }
        }
      } catch (err) {
        console.info('WebGPU unavailable; initializing WebGL2 fallback:', err);
      }
    }

    // Initialize WebGL2 Fallback
    this.initWebGL2Fallback();
  }

  private updateLedBuffer(device: GPUDevice): void {
    if (!this.ledBuffer) return;
    const leds = this.generatePerimeterLeds(72);
    const data = new Float32Array(72 * 8);

    for (let i = 0; i < 72; i++) {
      const led = leds[i];
      const offset = i * 8;
      data[offset] = led.pos_brightness[0];
      data[offset + 1] = led.pos_brightness[1];
      data[offset + 2] = led.pos_brightness[2];
      data[offset + 3] = led.pos_brightness[3];
      data[offset + 4] = led.color[0];
      data[offset + 5] = led.color[1];
      data[offset + 6] = led.color[2];
      data[offset + 7] = led.color[3];
    }
    device.queue.writeBuffer(this.ledBuffer, 0, data);
  }

  private generatePerimeterLeds(total = 72): LedData[] {
    const leds: LedData[] = [];
    const sizeX = this.shapeDimensions[0];
    const sizeY = this.shapeDimensions[1];

    for (let i = 0; i < total; i++) {
      const t = i / total;
      const angle = t * Math.PI * 2;
      let posX = 0;
      let posY = 0;
      let normAngle = angle;

      if (this.shapeType === 'triangle') {
        const side = t * 3.0;
        const sideIdx = Math.floor(side);
        const st = side - sideIdx;
        const v0 = [0, sizeX * 1.1547];
        const v1 = [sizeX, -sizeX * 0.57735];
        const v2 = [-sizeX, -sizeX * 0.57735];
        if (sideIdx === 0) {
          posX = v0[0] + (v1[0] - v0[0]) * st;
          posY = v0[1] + (v1[1] - v0[1]) * st;
          normAngle = Math.atan2(v1[0] - v0[0], -(v1[1] - v0[1]));
        } else if (sideIdx === 1) {
          posX = v1[0] + (v2[0] - v1[0]) * st;
          posY = v1[1] + (v2[1] - v1[1]) * st;
          normAngle = Math.atan2(v2[0] - v1[0], -(v2[1] - v1[1]));
        } else {
          posX = v2[0] + (v0[0] - v2[0]) * st;
          posY = v2[1] + (v0[1] - v2[1]) * st;
          normAngle = Math.atan2(v0[0] - v2[0], -(v0[1] - v2[1]));
        }
      } else if (this.shapeType === 'rounded-box') {
        posX = Math.cos(angle) * sizeX;
        posY = Math.sin(angle) * sizeY;
        normAngle = Math.atan2(posY, posX);
      } else {
        // Circle / Torus / Hexagon
        posX = Math.cos(angle) * sizeX;
        posY = Math.sin(angle) * sizeX;
        normAngle = angle;
      }

      // Color interpolation
      const colR = this.baseColor[0] + (this.accentColor[0] - this.baseColor[0]) * t;
      const colG = this.baseColor[1] + (this.accentColor[1] - this.baseColor[1]) * t;
      const colB = this.baseColor[2] + (this.accentColor[2] - this.baseColor[2]) * t;

      leds.push({
        pos_brightness: [posX, posY, 1.0, normAngle],
        color: [colR, colG, colB, 1.0],
      });
    }

    return leds;
  }

  private initWebGL2Fallback(): void {
    const gl = this.canvas.getContext('webgl2', {
      alpha: false,
      antialias: true,
      powerPreference: 'high-performance',
    });

    if (!gl) {
      throw new Error('Neither WebGPU nor WebGL2 could be initialized.');
    }

    this.gl = gl;
    this.backend = 'webgl2';

    const vsSource = `#version 300 es
      in vec2 a_pos;
      out vec2 v_uv;
      void main() {
        v_uv = a_pos * 0.5 + 0.5;
        gl_Position = vec4(a_pos, 0.0, 1.0);
      }
    `;

    const fsSource = `#version 300 es
      precision highp float;
      in vec2 v_uv;
      out vec4 fragColor;

      uniform vec2 u_resolution;
      uniform float u_time;
      uniform float u_dpr;
      uniform int u_shape_type;
      uniform vec4 u_shape_params;
      uniform vec4 u_brush;
      uniform int u_theme;
      uniform float u_floor_albedo;
      uniform vec4 u_ao;
      uniform vec3 u_base_color;
      uniform vec3 u_accent_color;
      uniform float u_decay_power;
      uniform float u_decay_exp;
      uniform float u_pulse_speed;
      uniform float u_rainbow_sweep;
      uniform int u_led_count;
      uniform int u_ray_count;

      float eval_shape_sdf(vec2 p, int shape_id, vec4 params) {
        if (shape_id == 1) {
          return length(p) - params.x;
        } else if (shape_id == 2) {
          vec2 q = abs(p) - params.xy + vec2(params.z);
          return length(max(q, vec2(0.0))) + min(max(q.x, q.y), 0.0) - params.z;
        } else if (shape_id == 3) {
          const vec3 k = vec3(-0.866025404, 0.5, 0.577350269);
          vec2 q = abs(p);
          q -= 2.0 * min(dot(k.xy, q), 0.0) * k.xy;
          q -= vec2(clamp(q.x, -k.z * params.x, k.z * params.x), params.x);
          return length(q) * sign(q.y);
        } else if (shape_id == 4) {
          return abs(length(p) - params.x) - params.z;
        } else {
          const float k = 1.73205080757;
          vec2 q = vec2(abs(p.x) - params.x, p.y + params.x / k);
          if (q.x + k * q.y > 0.0) {
            q = vec2(q.x - k * q.y, -k * q.x - q.y) * 0.5;
          }
          q.x -= clamp(q.x, -2.0 * params.x, 0.0);
          return -length(q) * sign(q.y);
        }
      }

      vec2 calc_sdf_normal(vec2 p, int shape_id, vec4 params) {
        float eps = 0.5;
        float dx = eval_shape_sdf(p + vec2(eps, 0.0), shape_id, params) - eval_shape_sdf(p - vec2(eps, 0.0), shape_id, params);
        float dy = eval_shape_sdf(p + vec2(0.0, eps), shape_id, params) - eval_shape_sdf(p - vec2(0.0, eps), shape_id, params);
        vec2 g = vec2(dx, dy);
        float l = length(g);
        return (l < 0.0001) ? vec2(0.0, 1.0) : (g / l);
      }

      float ign(vec2 p) {
        return fract(52.9829189 * fract(dot(p, vec2(0.06711056, 0.00583715))));
      }

      vec3 rgb_to_oklab(vec3 c) {
        float l = 0.4122214708 * c.r + 0.5363325363 * c.g + 0.0514459929 * c.b;
        float m = 0.2119034982 * c.r + 0.6806995451 * c.g + 0.1073969566 * c.b;
        float s = 0.0883024619 * c.r + 0.2817188376 * c.g + 0.6299787005 * c.b;
        float l_ = pow(max(l, 0.0), 1.0 / 3.0);
        float m_ = pow(max(m, 0.0), 1.0 / 3.0);
        float s_ = pow(max(s, 0.0), 1.0 / 3.0);
        return vec3(
          0.2104542553 * l_ + 0.7936177850 * m_ - 0.0040720468 * s_,
          1.9779984951 * l_ - 2.4285922050 * m_ + 0.4505937099 * s_,
          0.0259040371 * l_ + 0.7827717662 * m_ - 0.8086757660 * s_
        );
      }

      vec3 oklab_to_rgb(vec3 c) {
        float l_ = c.x + 0.3963377774 * c.y + 0.2158037573 * c.z;
        float m_ = c.x - 0.1055613458 * c.y - 0.0638541728 * c.z;
        float s_ = c.x - 0.0894841775 * c.y - 1.2914855480 * c.z;
        float l = l_ * l_ * l_;
        float m = m_ * m_ * m_;
        float s = s_ * s_ * s_;
        return vec3(
          4.0767434750 * l - 3.3077115913 * m + 0.2309699292 * s,
          -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
          -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s
        );
      }

      vec3 oklab_rainbow(float t) {
        float angle = t * 6.2831853;
        vec3 lab = vec3(0.78, 0.22 * cos(angle), 0.22 * sin(angle));
        return clamp(oklab_to_rgb(lab), vec3(0.0), vec3(1.0));
      }

      vec3 tonemap_lottes(vec3 a) {
        float b = 1.6; float c = 0.977; float d = 8.0; float e = 0.18; float f = 0.267;
        float g = (-pow(e, b) + pow(d, b) * f) / ((pow(d, b * c) - pow(e, b * c)) * f);
        float h = (pow(d, b * c) * pow(e, b) - pow(d, b) * pow(e, b * c) * f) / ((pow(d, b * c) - pow(e, b * c)) * f);
        return pow(a, vec3(b)) / (pow(a, vec3(b * c)) * g + h);
      }

      void main() {
        vec2 pixel = v_uv * u_resolution;
        vec2 center = u_resolution * 0.5;
        vec2 p = pixel - center;

        float jitter = ign(pixel);
        float sdf = eval_shape_sdf(p, u_shape_type, u_shape_params);

        // 72 Discrete Perimeter LEDs & Volumetric Light Cones
        vec3 accumulated_radiance = vec3(0.0);
        vec3 led_chips_emission = vec3(0.0);
        int n_leds = clamp(u_led_count, 24, 96);
        float f_leds = float(n_leds);

        for (int i = 0; i < 96; i++) {
          if (i >= n_leds) break;

          float t = float(i) / f_leds;
          float angle = t * 6.2831853;
          vec2 led_pos = vec2(cos(angle), sin(angle)) * u_shape_params.x;

          if (u_shape_type == 0) {
            // Equilateral Triangle Perimeter
            float r = u_shape_params.x;
            float side = t * 3.0;
            int s_idx = int(floor(side));
            float st = fract(side);
            vec2 v0 = vec2(0.0, r * 1.1547);
            vec2 v1 = vec2(r, -r * 0.57735);
            vec2 v2 = vec2(-r, -r * 0.57735);
            if (s_idx == 0) led_pos = mix(v0, v1, st);
            else if (s_idx == 1) led_pos = mix(v1, v2, st);
            else led_pos = mix(v2, v0, st);
          } else if (u_shape_type == 2) {
            // Rounded Box Perimeter
            vec2 b = u_shape_params.xy;
            float cr = u_shape_params.z;
            vec2 q = abs(vec2(cos(angle), sin(angle)) * max(b.x, b.y));
            float scale = min(b.x / max(q.x, 1e-4), b.y / max(q.y, 1e-4));
            led_pos = vec2(cos(angle), sin(angle)) * min(max(b.x, b.y) * scale, max(b.x, b.y));
          } else if (u_shape_type == 3) {
            // Hexagon Perimeter
            float hex_angle = floor(angle / 1.0471975) * 1.0471975 + 0.5235987;
            float r = u_shape_params.x / cos(angle - hex_angle);
            led_pos = vec2(cos(angle), sin(angle)) * min(r, u_shape_params.x * 1.1547);
          } else if (u_shape_type == 4) {
            // Torus outer ring
            led_pos = vec2(cos(angle), sin(angle)) * (u_shape_params.x + u_shape_params.z * 0.5);
          }

          vec2 led_norm = calc_sdf_normal(led_pos, u_shape_type, u_shape_params);
          vec2 led_tang = vec2(-led_norm.y, led_norm.x);
          vec2 to_pixel = p - led_pos;
          float dist = max(length(to_pixel), 1.0);

          // LED Chip / Diode rendering in local frame
          float chip_u = dot(to_pixel, led_norm);
          float chip_v = dot(to_pixel, led_tang);
          vec2 chip_q = abs(vec2(chip_u, chip_v)) - vec2(3.5, 6.0);
          float chip_d = length(max(chip_q, vec2(0.0))) + min(max(chip_q.x, chip_q.y), 0.0);

          // Pulse & Traveling wave animation
          float wave = sin(t * 6.283185 * 3.0 - u_time * (2.2 * u_pulse_speed));
          float pulse = 0.72 + 0.28 * wave;

          // LED Color interpolation & Oklab Rainbow sweep
          vec3 led_col = mix(u_base_color, u_accent_color, t);
          if (u_rainbow_sweep > 0.02) {
            led_col = mix(led_col, oklab_rainbow(t + u_time * 0.35), u_rainbow_sweep);
          }

          // Interactive brush flare on nearby LEDs
          if (u_brush.w > 0.05) {
            float dist_to_brush = length(led_pos - u_brush.xy);
            float brush_inf = clamp(1.0 - dist_to_brush / u_brush.z, 0.0, 1.0);
            led_col = mix(led_col, oklab_rainbow(t * 2.0 + u_time * 1.5), brush_inf * 0.85);
            pulse += brush_inf * 1.6;
          }

          // Render crisp rectangular LED chip
          float diode_core = smoothstep(1.8, 0.0, chip_d);
          float diode_halo = exp(-max(chip_d, 0.0) * 0.32) * 1.2;
          led_chips_emission += (diode_core * mix(led_col, vec3(1.0), 0.55) * 3.2 + diode_halo * led_col * 0.8) * pulse;

          // Directional volumetric light plumes casting into floor
          if (sdf > -2.0) {
            vec2 light_dir = to_pixel / dist;
            float cos_theta = max(dot(led_norm, light_dir), 0.0);
            float plume = pow(cos_theta, 1.7);

            // Physically bounded distance attenuation
            float v = dist * 0.014;
            float atten = pow(max(1.0 + v, 1.0), -u_decay_power) * exp(-u_decay_exp * dist);
            accumulated_radiance += led_col * (plume * atten * pulse * (1.0 + jitter * 0.08));
          }
        }

        // Calibrated exposure gain over ray samples
        vec3 floor_radiance = (accumulated_radiance / f_leds) * 38.0;

        // Interactive spark billow from mouse pointer
        if (u_brush.w > 0.05) {
          float dist_brush = length(p - u_brush.xy);
          if (dist_brush < u_brush.z * 1.4) {
            float spark_t = dist_brush / (u_brush.z * 1.4);
            float spark_glow = exp(-spark_t * 3.0) * u_brush.w * 0.9;
            floor_radiance += mix(u_accent_color, oklab_rainbow(u_time * 0.9 + jitter * 0.4), 0.65) * spark_glow;
          }
        }

        // Deep off-black slate floor with fine micro-noise texture
        vec3 floor_base = (u_theme == 1) ? vec3(0.86, 0.88, 0.92) : vec3(0.007, 0.009, 0.015);
        floor_base *= u_floor_albedo * 7.0; // Scaled to natural floor albedo
        float grain = (fract(sin(dot(floor(pixel * u_dpr), vec2(12.9898, 78.233))) * 43758.5453) - 0.5) * 0.025;
        vec3 floor_col = floor_base + grain;

        // Contact Ambient Occlusion
        float ao = 1.0;
        if (sdf > 0.0) {
          float norm_dist = clamp(sdf / u_ao.y, 0.0, 1.0);
          ao = clamp(1.0 - pow(1.0 - norm_dist, u_ao.z) * u_ao.x, 0.15, 1.0);
        }

        // Composite floor, ambient shadow, radiance plumes, and glowing LED chips
        vec3 scene_color = floor_col * ao + floor_radiance * ao + led_chips_emission;

        // Physical Occluder Core Mask (Pitch Black)
        float occluder_inset = max(u_shape_params.w, 4.0);
        if (sdf < 0.0) {
          float depth = -sdf;
          if (depth > occluder_inset) {
            scene_color = vec3(0.001, 0.002, 0.004); // Pure opaque pitch black occluder
          } else {
            float rim = depth / occluder_inset;
            scene_color = mix(scene_color * 0.25, vec3(0.002, 0.003, 0.005), rim);
          }
        }

        // Soft corner vignette
        float edge_dist = min(min(pixel.x, u_resolution.x - pixel.x), min(pixel.y, u_resolution.y - pixel.y));
        float vignette = smoothstep(0.0, 140.0, edge_dist);
        scene_color *= (0.7 + 0.3 * vignette);

        // Lottes Tonemapping with sRGB gamma curve (2.2)
        vec3 mapped = tonemap_lottes(clamp(scene_color, vec3(0.0), vec3(65504.0)));
        vec3 srgb = pow(clamp(mapped, vec3(0.0), vec3(1.0)), vec3(1.0 / 2.2));
        fragColor = vec4(srgb, 1.0);
      }
    `;

    const createShader = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(s));
      }
      return s;
    };

    const program = gl.createProgram()!;
    gl.attachShader(program, createShader(gl.VERTEX_SHADER, vsSource));
    gl.attachShader(program, createShader(gl.FRAGMENT_SHADER, fsSource));
    gl.linkProgram(program);
    this.glProgram = program;

    this.glVao = gl.createVertexArray();
    gl.bindVertexArray(this.glVao);
    this.glBuf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.glBuf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(program, 'a_pos');
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    gl.useProgram(program);
    this.glUniforms = {
      u_resolution: gl.getUniformLocation(program, 'u_resolution'),
      u_time: gl.getUniformLocation(program, 'u_time'),
      u_dpr: gl.getUniformLocation(program, 'u_dpr'),
      u_shape_type: gl.getUniformLocation(program, 'u_shape_type'),
      u_shape_params: gl.getUniformLocation(program, 'u_shape_params'),
      u_brush: gl.getUniformLocation(program, 'u_brush'),
      u_theme: gl.getUniformLocation(program, 'u_theme'),
      u_floor_albedo: gl.getUniformLocation(program, 'u_floor_albedo'),
      u_ao: gl.getUniformLocation(program, 'u_ao'),
      u_base_color: gl.getUniformLocation(program, 'u_base_color'),
      u_accent_color: gl.getUniformLocation(program, 'u_accent_color'),
      u_decay_power: gl.getUniformLocation(program, 'u_decay_power'),
      u_decay_exp: gl.getUniformLocation(program, 'u_decay_exp'),
      u_pulse_speed: gl.getUniformLocation(program, 'u_pulse_speed'),
      u_rainbow_sweep: gl.getUniformLocation(program, 'u_rainbow_sweep'),
      u_led_count: gl.getUniformLocation(program, 'u_led_count'),
      u_ray_count: gl.getUniformLocation(program, 'u_ray_count'),
    };
  }

  // --------------------------------------------------------------------------
  // Dynamic API Methods
  // --------------------------------------------------------------------------

  public setShape(type: HeroShapeType, params?: number[]): void {
    this.shapeType = type;
    if (params) {
      this.shapeDimensions = [
        params[0] ?? this.shapeDimensions[0],
        params[1] ?? this.shapeDimensions[1],
        params[2] ?? this.shapeDimensions[2],
        params[3] ?? this.shapeDimensions[3],
      ];
    }
    if (this.gpuDevice) {
      this.updateLedBuffer(this.gpuDevice);
    }
  }

  public setTheme(theme: FloorTheme): void {
    this.floorTheme = theme;
  }

  public setColors(baseColor: [number, number, number], accentColor: [number, number, number]): void {
    this.baseColor = baseColor;
    this.accentColor = accentColor;
    if (this.gpuDevice) {
      this.updateLedBuffer(this.gpuDevice);
    }
  }

  public setLighting(options: {
    ledCount?: number;
    rayCount?: number;
    decayPower?: number;
    decayExp?: number;
    pulseSpeed?: number;
    rainbowSweep?: number;
  }): void {
    if (options.ledCount !== undefined) this.ledCount = options.ledCount;
    if (options.rayCount !== undefined) this.rayCount = options.rayCount;
    if (options.decayPower !== undefined) this.decayPower = options.decayPower;
    if (options.decayExp !== undefined) this.decayExp = options.decayExp;
    if (options.pulseSpeed !== undefined) this.pulseSpeed = options.pulseSpeed;
    if (options.rainbowSweep !== undefined) this.rainbowSweep = options.rainbowSweep;
  }

  public setTonemapper(tm: TonemapperType): void {
    this.tonemapper = tm;
  }

  public setPointer(x: number, y: number, isEngaged: boolean): void {
    const rectW = this.canvas.clientWidth || 1;
    const rectH = this.canvas.clientHeight || 1;
    this.pointer = [
      (x / rectW) * this.canvas.width - this.canvas.width * 0.5,
      (y / rectH) * this.canvas.height - this.canvas.height * 0.5,
    ];
    this.pointerActive = isEngaged;
  }

  public resize(width: number, height: number, dpr = 1): void {
    const targetW = Math.max(1, Math.floor(width * Math.min(dpr, 2)));
    const targetH = Math.max(1, Math.floor(height * Math.min(dpr, 2)));
    if (this.canvas.width !== targetW || this.canvas.height !== targetH) {
      this.canvas.width = targetW;
      this.canvas.height = targetH;
    }
  }

  private shapeTypeToId(st: HeroShapeType): number {
    switch (st) {
      case 'triangle': return 0;
      case 'circle': return 1;
      case 'rounded-box': return 2;
      case 'hexagon': return 3;
      case 'torus': return 4;
      default: return 1;
    }
  }

  public render(): void {
    if (this.isDisposed || this.canvas.width === 0 || this.canvas.height === 0) return;
    const now = (performance.now() - this.startTime) * 0.001;
    const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;

    if (this.backend === 'webgpu' && this.gpuDevice && this.gpuContext && this.gpuPipeline && this.gpuBindGroup && this.uniformBuffer) {
      const uniforms = new Float32Array(32);
      const uniformsU32 = new Uint32Array(uniforms.buffer);
      uniforms[0] = this.canvas.width;
      uniforms[1] = this.canvas.height;
      uniforms[2] = now;
      uniforms[3] = dpr;
      uniformsU32[4] = this.shapeTypeToId(this.shapeType);
      uniforms[5] = this.shapeDimensions[0];
      uniforms[6] = this.shapeDimensions[1];
      uniforms[7] = this.shapeDimensions[2];
      uniforms[8] = this.shapeDimensions[3];
      uniformsU32[9] = this.floorTheme === 'light' ? 1 : 0;
      uniforms[10] = this.floorAlbedo;
      uniforms[11] = this.decayPower;
      uniforms[12] = this.decayExp;
      uniforms[13] = this.pulseSpeed;
      uniforms[14] = this.rainbowSweep;
      uniformsU32[15] = this.ledCount;
      uniforms[16] = this.baseColor[0];
      uniforms[17] = this.baseColor[1];
      uniforms[18] = this.baseColor[2];
      uniforms[19] = 0.0;
      uniforms[20] = this.accentColor[0];
      uniforms[21] = this.accentColor[1];
      uniforms[22] = this.accentColor[2];
      uniforms[23] = 0.0;
      uniforms[24] = this.pointer[0];
      uniforms[25] = this.pointer[1];
      uniforms[26] = 130.0;
      uniforms[27] = this.pointerActive ? 1.0 : 0.0;
      uniforms[28] = this.aoStrength;
      uniforms[29] = this.aoRadius;
      uniforms[30] = this.aoGamma;
      uniforms[31] = 0.0;

      this.gpuDevice.queue.writeBuffer(this.uniformBuffer, 0, uniforms);

      const commandEncoder = this.gpuDevice.createCommandEncoder();
      const textureView = this.gpuContext.getCurrentTexture().createView();
      const renderPass = commandEncoder.beginRenderPass({
        colorAttachments: [{
          view: textureView,
          clearValue: { r: 0.005, g: 0.007, b: 0.012, a: 1.0 },
          loadOp: 'clear',
          storeOp: 'store',
        }],
      });
      renderPass.setPipeline(this.gpuPipeline);
      renderPass.setBindGroup(0, this.gpuBindGroup);
      renderPass.draw(3);
      renderPass.end();
      this.gpuDevice.queue.submit([commandEncoder.finish()]);
      return;
    }

    if (this.gl && this.glProgram && this.glVao) {
      const gl = this.gl;
      gl.viewport(0, 0, this.canvas.width, this.canvas.height);
      gl.useProgram(this.glProgram);
      gl.bindVertexArray(this.glVao);

      const u = this.glUniforms;
      gl.uniform2f(u.u_resolution, this.canvas.width, this.canvas.height);
      gl.uniform1f(u.u_time, now);
      gl.uniform1f(u.u_dpr, dpr);
      gl.uniform1i(u.u_shape_type, this.shapeTypeToId(this.shapeType));
      gl.uniform4f(u.u_shape_params, this.shapeDimensions[0], this.shapeDimensions[1], this.shapeDimensions[2], this.shapeDimensions[3]);
      gl.uniform4f(u.u_brush, this.pointer[0], this.pointer[1], 130.0, this.pointerActive ? 1.0 : 0.0);
      gl.uniform1i(u.u_theme, this.floorTheme === 'light' ? 1 : 0);
      gl.uniform1f(u.u_floor_albedo, this.floorAlbedo);
      gl.uniform4f(u.u_ao, this.aoStrength, this.aoRadius, this.aoGamma, 0.0);
      gl.uniform3fv(u.u_base_color, this.baseColor);
      gl.uniform3fv(u.u_accent_color, this.accentColor);
      gl.uniform1f(u.u_decay_power, this.decayPower);
      gl.uniform1f(u.u_decay_exp, this.decayExp);
      gl.uniform1f(u.u_pulse_speed, this.pulseSpeed);
      gl.uniform1f(u.u_rainbow_sweep, this.rainbowSweep);
      gl.uniform1i(u.u_led_count, this.ledCount);
      gl.uniform1i(u.u_ray_count, this.rayCount);

      gl.drawArrays(gl.TRIANGLES, 0, 6);
    }
  }

  public destroy(): void {
    this.isDisposed = true;
    if (this.gpuPipeline) {
      this.gpuPipeline = null;
    }
    if (this.gpuBindGroup) {
      this.gpuBindGroup = null;
    }
    if (this.uniformBuffer) {
      this.uniformBuffer.destroy();
      this.uniformBuffer = null;
    }
    if (this.ledBuffer) {
      this.ledBuffer.destroy();
      this.ledBuffer = null;
    }
    if (this.floorNoiseTex) {
      this.floorNoiseTex.destroy();
      this.floorNoiseTex = null;
    }
    if (this.gpuDevice) {
      this.gpuDevice.destroy();
      this.gpuDevice = null;
    }
    if (this.gl && this.glProgram) {
      this.gl.deleteProgram(this.glProgram);
      if (this.glBuf) this.gl.deleteBuffer(this.glBuf);
      if (this.glVao) this.gl.deleteVertexArray(this.glVao);
      this.gl = null;
    }
  }
}
