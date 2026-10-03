'use client';

import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import {
  InteractiveSketchbookProps,
  SketchbookPage,
  SketchbookThemeMode,
  SketchbookCustomTheme,
} from './types';
import {
  DEFAULT_BOTANICAL_PAGES,
  CHAKRA_HERITAGE_PAGES,
  CHAKRA_DARK_PAGES,
} from './platesData';
import './sketchbook.css';

const N = 18;          // 18 strips forming a curved surface
const SPAN = 0.449;    // gutter -> outer page edge fraction
const BETA = 0.60;     // peak curl of arc (radians)
const MAG = 2.3;       // optical magnifier magnification
const TILT_X = 4.5;    // restrained vertical tilt (degrees)
const TILT_Y = 7.0;    // restrained horizontal tilt (degrees)
const ZOOM_MIN = 0.9;
const ZOOM_MAX = 1.5;

interface TurnState {
  dir: 'next' | 'prev';
  from: number;
  to: number;
  t: number;
}

export function InteractiveSketchbook({
  pages: userPages,
  theme = 'chakra-heritage',
  initialPage = 0,
  enableLoupe = true,
  enableTilt = true,
  enableZoom = true,
  enableRiffleIntro = false,
  showIndex = true,
  showNavigationArrows = true,
  showToolBar = true,
  showCaptions = true,
  kicker,
  className = '',
  style,
  onPageChange,
  maxWidth = 960,
}: InteractiveSketchbookProps) {
  // Resolve default pages based on theme if not explicitly provided
  const themeMode: SketchbookThemeMode =
    typeof theme === 'string' ? theme : 'chakra-heritage';

  const pages = useMemo<SketchbookPage[]>(() => {
    if (userPages && userPages.length > 0) return userPages;
    if (themeMode === 'chakra-dark') return CHAKRA_DARK_PAGES;
    if (themeMode === 'chakra-heritage') return CHAKRA_HERITAGE_PAGES;
    return DEFAULT_BOTANICAL_PAGES;
  }, [userPages, themeMode]);

  const M = pages.length;

  // Container and canvas DOM refs
  const rootRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const sb3dRef = useRef<HTMLDivElement>(null);
  const bookRef = useRef<HTMLDivElement>(null);
  const zoomWrapRef = useRef<HTMLDivElement>(null);
  const zoomInnerRef = useRef<HTMLDivElement>(null);
  const loupeRef = useRef<HTMLDivElement>(null);
  const capBoxRef = useRef<HTMLDivElement>(null);

  // Component React states
  const [activeIdx, setActiveIdx] = useState<number>(() => {
    const p = Math.max(0, Math.min(M - 1, initialPage));
    return p;
  });
  const [isLoupeActive, setIsLoupeActive] = useState<boolean>(enableLoupe);
  const [zoomPercent, setZoomPercent] = useState<number>(100);
  const [canZoomIn, setCanZoomIn] = useState<boolean>(true);
  const [canZoomOut, setCanZoomOut] = useState<boolean>(true);
  const [hintVisible, setHintVisible] = useState<boolean>(true);

  // Engine mutable state (kept in refs for high-fps animation loop)
  const engineRef = useRef<{
    idx: number;
    turn: TurnState | null;
    strips: HTMLDivElement[];
    raf: number | null;
    last: number;
    spring:
      | { kind: 'spring'; v: number; target: number; done?: () => void; k: number; c: number }
      | { kind: 'tween'; from: number; target: number; dur: number; e: number; done?: () => void }
      | null;
    view: { rx: number; ry: number; z: number; trx: number; try_: number; tz: number };
    viewActive: boolean;
    lastZ: number;
    drag: { dir: 'next' | 'prev'; x0: number; w: number; moved: number; vel: number; tPrev: number } | null;
    lx: number | null;
    ly: number | null;
    lgrab: { cx: number; cy: number; lx0: number; ly0: number } | null;
    lTarget: { x: number; y: number } | null;
    capOut: HTMLElement | null;
    capIn: HTMLElement | null;
    introOn: boolean;
  }>({
    idx: initialPage % M,
    turn: null,
    strips: [],
    raf: null,
    last: 0,
    spring: null,
    view: { rx: 0, ry: 0, z: 1, trx: 0, try_: 0, tz: 1 },
    viewActive: false,
    lastZ: 1,
    drag: null,
    lx: null,
    ly: null,
    lgrab: null,
    lTarget: null,
    capOut: null,
    capIn: null,
    introOn: false,
  });

  // Pre-calculate custom inline styles if theme is object
  const customThemeStyles = useMemo<React.CSSProperties>(() => {
    if (typeof theme !== 'object' || !theme) return {};
    const t = theme as SketchbookCustomTheme;
    const s: Record<string, string> = {};
    if (t.paper) s['--sb-paper'] = t.paper;
    if (t.ink) s['--sb-ink'] = t.ink;
    if (t.inkSoft) s['--sb-ink-soft'] = t.inkSoft;
    if (t.inkFaint) s['--sb-ink-faint'] = t.inkFaint;
    if (t.hairline) s['--sb-hairline'] = t.hairline;
    if (t.accent) s['--sb-accent'] = t.accent;
    if (t.gold) s['--sb-gold'] = t.gold;
    if (t.navy) s['--sb-navy'] = t.navy;
    if (t.loupeRing) s['--sb-loupe-ring'] = t.loupeRing;
    if (t.loupeGrip) s['--sb-loupe-handle'] = t.loupeGrip;
    return s as React.CSSProperties;
  }, [theme]);

  // Keep activeIdx in sync with engine
  const notifyPageChange = useCallback(
    (newIdx: number) => {
      setActiveIdx(newIdx);
      if (onPageChange) onPageChange(newIdx);
    },
    [onPageChange]
  );

  // Helper DOM creator
  const createEl = (tag: string, className?: string) => {
    const el = document.createElement(tag);
    if (className) el.className = className;
    return el;
  };

  const createImgEl = (index: number, side: 'left' | 'right') => {
    const im = new Image();
    im.className = `sb-half-img ${side}`;
    im.draggable = false;
    im.alt = pages[index]?.alt || pages[index]?.title || '';
    im.src = pages[index]?.url || '';
    return im;
  };

  const createHalfEl = (pos: 'left' | 'right', index: number) => {
    const d = createEl('div', `sb-half ${pos}`);
    d.appendChild(createImgEl(index, pos));
    d.appendChild(createEl('div', `gutter-shade ${pos}`));
    return d;
  };

  // Build the 18 nested strips forming the bending sheet
  const buildCurl = (dir: 'next' | 'prev', from: number, to: number) => {
    const eng = engineRef.current;
    eng.strips = [];
    const curlEl = createEl('div', `curl ${dir}`);
    curlEl.style.setProperty('--n', String(N));
    curlEl.style.setProperty('--span', String(SPAN));

    let host = curlEl;
    for (let i = 0; i < N; i++) {
      const stripEl = createEl('div', 'strip') as HTMLDivElement;
      stripEl.style.setProperty('--i', String(i));
      const gut = 'calc(var(--bw) * 0.5)';
      const sw = `calc(var(--bw) * ${SPAN} / ${N})`;
      const A = `calc(-1 * (${gut} + ${i} * ${sw}))`;
      const B = `calc(${i + 1} * ${sw} - ${gut})`;

      const frontFace = createEl('div', 'face front') as HTMLDivElement;
      const backFace = createEl('div', 'face back') as HTMLDivElement;

      const dress = (e: HTMLDivElement, url: string, posX: string) => {
        e.style.backgroundImage = `url("${url}")`;
        e.style.backgroundPositionX = posX;
      };

      dress(frontFace, pages[from].url, dir === 'next' ? A : B);
      dress(backFace, pages[to].url, dir === 'next' ? B : A);

      frontFace.appendChild(createEl('div', 'sh'));
      frontFace.appendChild(createEl('div', 'gl'));
      backFace.appendChild(createEl('div', 'sh'));
      backFace.appendChild(createEl('div', 'gl'));

      stripEl.appendChild(frontFace);
      stripEl.appendChild(backFace);

      if (i === N - 1) stripEl.classList.add('edge');
      host.appendChild(stripEl);
      host = stripEl;
      eng.strips.push(stripEl);
    }
    return curlEl;
  };

  // Apply tangent sweeps and strip shadows
  const applyTurn = (t: number) => {
    const sb3d = sb3dRef.current;
    if (!sb3d) return;
    const eng = engineRef.current;

    const th = Math.PI * t;
    const beta = BETA * Math.sin(Math.PI * t);
    const D = 180 / Math.PI;
    const tt = th + beta;
    const td = (2 * beta) / N;

    sb3d.style.setProperty('--tt', `${(tt * D).toFixed(2)}deg`);
    sb3d.style.setProperty('--td', `${(td * D).toFixed(3)}deg`);
    sb3d.style.setProperty('--shade', Math.sin(Math.PI * t).toFixed(3));

    // Update caption cross-fade
    if (eng.capOut && eng.capIn) {
      const out = 1 - Math.max(0, Math.min(1, (t - 0.1) / 0.28));
      const inn = Math.max(0, Math.min(1, (t - 0.56) / 0.3));
      eng.capOut.style.opacity = out.toFixed(3);
      eng.capIn.style.opacity = inn.toFixed(3);
    }

    // Per-strip illumination & specular highlight
    for (let i = 0; i < eng.strips.length; i++) {
      const l1 = Math.abs(Math.cos(tt - i * td));
      const l2 = Math.abs(Math.cos(tt - (i + 1) * td));
      const st = eng.strips[i].style;
      st.setProperty('--lit', l1.toFixed(3));
      st.setProperty('--a1', ((1 - l1) * 0.62).toFixed(3));
      st.setProperty('--a2', ((1 - l2) * 0.62).toFixed(3));
    }
  };

  // Loupe coordinate & dimension calculations
  const bookBox = () => {
    const book = bookRef.current;
    if (!book) return { x: 0, y: 0, w: 0, h: 0 };
    return { x: 0, y: 0, w: book.clientWidth, h: book.clientHeight };
  };

  const loupeSize = () => {
    const book = bookRef.current;
    if (!book) return 220;
    return Math.round(Math.max(165, Math.min(262, book.clientWidth * 0.235)));
  };

  // Sync zoom mirror layer
  const syncZoomLayer = () => {
    const book = bookRef.current;
    const zoomInner = zoomInnerRef.current;
    if (!book || !zoomInner) return;
    zoomInner.textContent = '';
    for (let i = 0; i < book.children.length; i++) {
      const child = book.children[i];
      if (child.classList.contains('sb-zone')) continue;
      zoomInner.appendChild(child.cloneNode(true));
    }
  };

  const placeLoupe = () => {
    const eng = engineRef.current;
    const loupe = loupeRef.current;
    const zoomWrap = zoomWrapRef.current;
    const zoomInner = zoomInnerRef.current;
    if (eng.lx === null || eng.ly === null || !loupe || !zoomWrap || !zoomInner) return;

    const B = bookBox();
    const bw = B.w;
    const bh = B.h;
    if (!bw || !bh) return;

    const R = loupeSize() / 2;
    const bez = R * 2 * 0.058;
    loupe.style.setProperty('--lr', `${R * 2}px`);
    loupe.style.transform = `translate3d(${(eng.lx - R).toFixed(1)}px, ${(eng.ly - R).toFixed(1)}px, 0)`;

    if (isLoupeActive) loupe.classList.add('on');
    else loupe.classList.remove('on');

    const z = eng.view.z;
    const cx = bw / 2;
    const cy = bh / 2;
    const x0 = cx + (bw * 0.051 - cx) * z;
    const x1 = cx + (bw * 0.949 - cx) * z;
    const y0 = cy + (bh * 0.218 - cy) * z;
    const y1 = cy + (bh * 0.782 - cy) * z;

    const nx = Math.max(x0, Math.min(eng.lx, x1));
    const ny = Math.max(y0, Math.min(eng.ly, y1));

    const inside =
      eng.lx > x0 && eng.lx < x1 && eng.ly > y0 && eng.ly < y1
        ? Math.min(eng.lx - x0, x1 - eng.lx, eng.ly - y0, y1 - eng.ly)
        : -Math.hypot(eng.lx - nx, eng.ly - ny);

    const k = Math.max(0, Math.min(1, (inside + R * 0.3) / (R * 0.55)));
    zoomWrap.style.opacity = (isLoupeActive ? k : 0).toFixed(3);

    if (k <= 0.002) return;
    const r = (R - bez).toFixed(1);
    const mask = `radial-gradient(circle ${r}px at ${eng.lx.toFixed(1)}px ${eng.ly.toFixed(1)}px, #000 calc(100% - 1px), transparent 100%)`;
    zoomWrap.style.webkitMaskImage = mask;
    zoomWrap.style.maskImage = mask;

    const px = cx + (eng.lx - cx) / z;
    const py = cy + (eng.ly - cy) / z;
    const s = MAG * z;
    zoomInner.style.transform = `translate(${(eng.lx - px * s).toFixed(1)}px, ${(eng.ly - py * s).toFixed(1)}px) scale(${s.toFixed(4)})`;
  };

  const restLoupe = () => {
    const eng = engineRef.current;
    const b = bookBox();
    if (!b.w) return;
    eng.lx = b.x + b.w * 0.88;
    eng.ly = b.y + b.h * 0.855;
    placeLoupe();
  };

  // Push loupe aside when turning leaf sweeps past
  const shoveLoupe = (dir: 'next' | 'prev') => {
    const eng = engineRef.current;
    if (!isLoupeActive || eng.lx === null || eng.ly === null || eng.lgrab) return;
    const b = bookBox();
    const nx = (b.w / 2 + (eng.lx - b.x - b.w / 2) / eng.view.z) / b.w;
    const ny = (b.h / 2 + (eng.ly - b.y - b.h / 2) / eng.view.z) / b.h;
    if (nx < 0.02 || nx > 0.98 || ny < 0.17 || ny > 0.83) return;
    eng.lTarget = {
      x: b.x + b.w * (dir === 'next' ? 0.12 : 0.88),
      y: b.y + b.h * 0.855,
    };
    kick();
  };

  const loupeEase = () => {
    const eng = engineRef.current;
    if (!eng.lTarget || eng.lx === null || eng.ly === null) return false;
    if (eng.lgrab) {
      eng.lTarget = null;
      return false;
    }
    const dx = eng.lTarget.x - eng.lx;
    const dy = eng.lTarget.y - eng.ly;
    if (Math.abs(dx) < 0.5 && Math.abs(dy) < 0.5) {
      eng.lx = eng.lTarget.x;
      eng.ly = eng.lTarget.y;
      eng.lTarget = null;
      placeLoupe();
      return false;
    }
    eng.lx += dx * 0.17;
    eng.ly += dy * 0.17;
    placeLoupe();
    return true;
  };

  // Layout bounds on resize
  const layout = () => {
    const book = bookRef.current;
    const sb3d = sb3dRef.current;
    if (!book || !sb3d) return;
    sb3d.style.setProperty('--bw', `${book.clientWidth}px`);
  };

  // Update caption text
  const updateCaptions = () => {
    const capBox = capBoxRef.current;
    if (!capBox) return;
    const eng = engineRef.current;
    capBox.textContent = '';
    eng.capOut = null;
    eng.capIn = null;

    if (eng.turn) {
      const outP = createEl('p', 'sb-caption live') as HTMLParagraphElement;
      outP.textContent = pages[eng.turn.from]?.title || '';
      capBox.appendChild(outP);

      const inP = createEl('p', 'sb-caption live') as HTMLParagraphElement;
      inP.textContent = pages[eng.turn.to]?.title || '';
      capBox.appendChild(inP);

      eng.capOut = outP;
      eng.capIn = inP;
      applyTurn(eng.turn.t);
    } else {
      const p = createEl('p', 'sb-caption') as HTMLParagraphElement;
      p.textContent = pages[eng.idx]?.title || '';
      capBox.appendChild(p);
    }
  };

  // Render the current book state (resting full spread vs turning leaf)
  const paint = () => {
    const book = bookRef.current;
    const sb3d = sb3dRef.current;
    if (!book || !sb3d) return;
    const eng = engineRef.current;

    book.textContent = '';

    if (!eng.turn) {
      const full = createEl('div', 'sb-full');
      const img = new Image();
      img.src = pages[eng.idx]?.url || '';
      img.alt = pages[eng.idx]?.alt || pages[eng.idx]?.title || '';
      img.draggable = false;
      full.appendChild(img);
      book.appendChild(full);
      sb3d.style.setProperty('--shade', '0');
    } else {
      const next = eng.turn.dir === 'next';
      book.appendChild(createHalfEl('left', next ? eng.turn.from : eng.turn.to));
      book.appendChild(createHalfEl('right', next ? eng.turn.to : eng.turn.from));
      book.appendChild(buildCurl(eng.turn.dir, eng.turn.from, eng.turn.to));
      applyTurn(eng.turn.t);
    }

    // Interactive clickable click-zones for quick turning
    const zonePrev = createEl('button', 'sb-zone sb-prev');
    const zoneNext = createEl('button', 'sb-zone sb-next');
    zonePrev.setAttribute('aria-label', 'Previous page');
    zoneNext.setAttribute('aria-label', 'Next page');
    book.appendChild(zonePrev);
    book.appendChild(zoneNext);

    layout();
    updateCaptions();
    syncZoomLayer();
    placeLoupe();
  };

  // Animation RAF kick
  const kick = () => {
    const eng = engineRef.current;
    if (eng.raf === null) {
      eng.last = performance.now();
      eng.raf = requestAnimationFrame(tick);
    }
  };

  const applyView = () => {
    const sb3d = sb3dRef.current;
    if (!sb3d) return;
    const eng = engineRef.current;
    sb3d.style.setProperty('--rx', `${eng.view.rx.toFixed(2)}deg`);
    sb3d.style.setProperty('--ry', `${eng.view.ry.toFixed(2)}deg`);
    sb3d.style.setProperty('--zoom', eng.view.z.toFixed(3));
    if (eng.view.z !== eng.lastZ) {
      eng.lastZ = eng.view.z;
      placeLoupe();
    }
  };

  const viewSpring = () => {
    const eng = engineRef.current;
    const e = 0.14;
    let moved = false;
    const pairs: [keyof typeof eng.view, keyof typeof eng.view][] = [
      ['rx', 'trx'],
      ['ry', 'try_'],
      ['z', 'tz'],
    ];
    for (const [k, t] of pairs) {
      const d = eng.view[t] - eng.view[k];
      if (Math.abs(d) > 0.0006) {
        eng.view[k] += d * e;
        moved = true;
      } else {
        eng.view[k] = eng.view[t];
      }
    }
    if (moved) applyView();
    eng.viewActive = moved;
    return moved;
  };

  const setView = (rx: number, ry: number, z: number) => {
    const eng = engineRef.current;
    eng.view.trx = Math.max(-TILT_X, Math.min(TILT_X, rx));
    eng.view.try_ = Math.max(-TILT_Y, Math.min(TILT_Y, ry));
    eng.view.tz = Math.max(ZOOM_MIN, Math.min(ZOOM_MAX, z));
    eng.viewActive = true;
    kick();

    // Update UI toolbar state
    setZoomPercent(Math.round(eng.view.tz * 100));
    setCanZoomOut(eng.view.tz > ZOOM_MIN + 0.001);
    setCanZoomIn(eng.view.tz < ZOOM_MAX - 0.001);
  };

  const tiltTo = (cx: number, cy: number) => {
    if (!enableTilt) return;
    const book = bookRef.current;
    const eng = engineRef.current;
    if (!book || eng.drag) return;
    const r = book.getBoundingClientRect();
    if (!r.width) return;
    const nx = Math.max(-1, Math.min(1, (cx - (r.left + r.width / 2)) / (r.width * 0.62)));
    const ny = Math.max(-1, Math.min(1, (cy - (r.top + r.height / 2)) / (r.height * 0.9)));
    setView(-ny * TILT_X, nx * TILT_Y, eng.view.tz);
  };

  const animateTo = (target: number, onDone?: () => void, stiff = 150, damp = 22) => {
    const eng = engineRef.current;
    eng.spring = {
      kind: 'spring',
      v: 0,
      target,
      done: onDone,
      k: stiff,
      c: damp,
    };
    kick();
  };

  const tweenTo = (target: number, dur: number, onDone?: () => void) => {
    const eng = engineRef.current;
    eng.spring = {
      kind: 'tween',
      from: eng.turn ? eng.turn.t : 0,
      target,
      dur,
      e: 0,
      done: onDone,
    };
    kick();
  };

  const tick = (now: number) => {
    const eng = engineRef.current;
    eng.raf = null;
    const dt = Math.min(0.032, (now - eng.last) / 1000 || 0.016);
    eng.last = now;

    if (eng.spring && eng.turn) {
      const s = eng.spring;
      if (s.kind === 'tween') {
        s.e += dt;
        const k = Math.min(1, s.e / s.dur);
        eng.turn.t = s.from + (s.target - s.from) * k;
        applyTurn(eng.turn.t);
        if (k >= 1) {
          eng.spring = null;
          if (s.done) s.done();
        }
      } else {
        const x = eng.turn.t - s.target;
        s.v += (-s.k * x - s.c * s.v) * dt;
        eng.turn.t += s.v * dt;
        if (Math.abs(eng.turn.t - s.target) < 0.002 && Math.abs(s.v) < 0.02) {
          eng.turn.t = s.target;
          eng.spring = null;
          applyTurn(eng.turn.t);
          if (s.done) s.done();
        } else {
          applyTurn(eng.turn.t);
        }
      }
    }

    viewSpring();
    const lmoved = loupeEase();

    if ((eng.spring || eng.viewActive || lmoved) && eng.raf === null) {
      eng.raf = requestAnimationFrame(tick);
    }
  };

  // Turn management
  const startTurn = (dir: 'next' | 'prev', t = 0) => {
    const eng = engineRef.current;
    eng.spring = null;
    if (eng.turn) {
      eng.idx = eng.turn.to;
      eng.turn = null;
    }
    shoveLoupe(dir);
    const from = eng.idx;
    eng.turn = {
      dir,
      from,
      to: dir === 'next' ? (from + 1) % M : (from - 1 + M) % M,
      t,
    };
    paint();
  };

  const commitTurn = () => {
    const eng = engineRef.current;
    if (!eng.turn) return;
    const nextIdx = eng.turn.to;
    animateTo(
      1,
      () => {
        eng.idx = nextIdx;
        eng.turn = null;
        paint();
        notifyPageChange(nextIdx);
      },
      170,
      26
    );
    kick();
  };

  const cancelTurn = () => {
    const eng = engineRef.current;
    if (!eng.turn) return;
    animateTo(
      0,
      () => {
        eng.turn = null;
        paint();
      },
      150,
      24
    );
    kick();
  };

  const step = (dir: 'next' | 'prev') => {
    const eng = engineRef.current;
    if (eng.introOn) endIntro();
    if (eng.turn) {
      eng.idx = eng.turn.to;
      eng.turn = null;
    }
    startTurn(dir, 0);
    commitTurn();
  };

  const goTo = (targetIdx: number) => {
    const eng = engineRef.current;
    if (eng.introOn) endIntro();
    if (targetIdx === eng.idx) return;
    if (eng.turn) {
      eng.idx = eng.turn.to;
      eng.turn = null;
    }
    const fwd = (targetIdx - eng.idx + M) % M;
    const back = (eng.idx - targetIdx + M) % M;
    if (Math.min(fwd, back) === 1) {
      step(fwd === 1 ? 'next' : 'prev');
      return;
    }
    eng.idx = targetIdx;
    paint();
    notifyPageChange(targetIdx);
  };

  const endIntro = () => {
    const eng = engineRef.current;
    eng.introOn = false;
  };

  // Pointer drag event handlers on the stage
  const onStagePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    const target = e.target as HTMLElement;
    const onZone = target.closest('.sb-zone');
    const book = bookRef.current;
    const eng = engineRef.current;
    if (!book || (!onZone && !target.closest('.sb-book'))) return;

    e.preventDefault();
    setHintVisible(false);
    if (eng.introOn) return;

    stageRef.current?.setPointerCapture(e.pointerId);
    const r = book.getBoundingClientRect();
    const dir: 'next' | 'prev' = (e.clientX - r.left) / r.width > 0.5 ? 'next' : 'prev';

    startTurn(dir, 0);
    eng.drag = {
      dir,
      x0: e.clientX,
      w: r.width,
      moved: 0,
      vel: 0,
      tPrev: performance.now(),
    };
  };

  const onStagePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const eng = engineRef.current;
    if (eng.drag) {
      const dx = e.clientX - eng.drag.x0;
      eng.drag.moved = Math.max(eng.drag.moved, Math.abs(dx));
      const raw = (eng.drag.dir === 'next' ? -dx : dx) / (eng.drag.w * 0.62);
      const t = Math.max(0, Math.min(1, raw));
      const now = performance.now();
      eng.drag.vel = (t - (eng.turn ? eng.turn.t : 0)) / Math.max(0.001, (now - eng.drag.tPrev) / 1000);
      eng.drag.tPrev = now;
      if (eng.turn) {
        eng.turn.t = t;
        applyTurn(t);
      }
    } else {
      if (e.pointerType !== 'touch') {
        tiltTo(e.clientX, e.clientY);
      }
    }
  };

  const onStagePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    const eng = engineRef.current;
    if (!eng.drag) return;
    const d = eng.drag;
    eng.drag = null;
    if (!eng.turn) return;

    if (d.moved < 6) {
      commitTurn();
      return;
    }
    const go = eng.turn.t > 0.42 || d.vel > 1.1;
    if (go) commitTurn();
    else cancelTurn();
  };

  // Loupe pointer dragging
  const onLoupePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isLoupeActive || e.button !== 0) return;
    e.preventDefault();
    e.stopPropagation();
    const eng = engineRef.current;
    const loupe = loupeRef.current;
    if (!loupe) return;

    eng.lTarget = null;
    eng.lgrab = {
      cx: e.clientX,
      cy: e.clientY,
      lx0: eng.lx || 0,
      ly0: eng.ly || 0,
    };
    loupe.classList.add('held');
    loupe.setPointerCapture(e.pointerId);
    setHintVisible(false);
  };

  const onLoupePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const eng = engineRef.current;
    if (!eng.lgrab) return;
    const b = bookBox();
    const R = loupeSize() / 2;
    eng.lx = Math.max(b.x - R * 0.7, Math.min(b.x + b.w + R * 0.7, eng.lgrab.lx0 + (e.clientX - eng.lgrab.cx)));
    eng.ly = Math.max(b.y - R * 0.7, Math.min(b.y + b.h + R * 1.0, eng.lgrab.ly0 + (e.clientY - eng.lgrab.cy)));
    placeLoupe();
  };

  const onLoupePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    const eng = engineRef.current;
    eng.lgrab = null;
    loupeRef.current?.classList.remove('held');
  };

  // Toggle loupe button
  const toggleLoupe = () => {
    const next = !isLoupeActive;
    setIsLoupeActive(next);
    const eng = engineRef.current;
    if (next && eng.lx === null) restLoupe();
    else placeLoupe();
  };

  // Zoom toolbar buttons
  const zoomIn = () => {
    const eng = engineRef.current;
    setView(eng.view.trx, eng.view.try_, eng.view.tz * 1.16);
    setHintVisible(false);
  };

  const zoomOut = () => {
    const eng = engineRef.current;
    setView(eng.view.trx, eng.view.try_, eng.view.tz / 1.16);
    setHintVisible(false);
  };

  const zoomReset = () => {
    const eng = engineRef.current;
    setView(eng.view.trx, eng.view.try_, 1);
  };

  // Keyboard navigation & resize listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const target = e.target as HTMLElement;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) return;
      e.preventDefault();
      setHintVisible(false);
      step(e.key === 'ArrowRight' ? 'next' : 'prev');
    };

    const handleResize = () => {
      layout();
      const eng = engineRef.current;
      eng.lx = null;
      restLoupe();
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('resize', handleResize);
    };
  }, [M]);

  // Initial mount & riffle boot
  useEffect(() => {
    const eng = engineRef.current;
    eng.idx = initialPage % M;
    paint();
    applyView();
    restLoupe();

    // Riffle intro if requested
    if (enableRiffleIntro) {
      const timer = setTimeout(() => {
        const steps = Math.min(M + 3, 10);
        let stepCount = 0;
        const riffleStep = () => {
          if (stepCount >= steps) return;
          const bell = Math.sin(Math.PI * (stepCount / (steps - 1)));
          const dur = 0.26 - 0.19 * bell;
          startTurn('next', 0);
          tweenTo(1, dur, () => {
            if (eng.turn) {
              eng.idx = eng.turn.to;
              eng.turn = null;
            }
            stepCount++;
            paint();
            notifyPageChange(eng.idx);
            if (stepCount < steps) riffleStep();
          });
        };
        riffleStep();
      }, 350);
      return () => clearTimeout(timer);
    }
  }, [pages, initialPage, enableRiffleIntro]);

  return (
    <div
      ref={rootRef}
      className={`sb-standalone ${className}`}
      data-theme={typeof theme === 'string' ? theme : 'custom'}
      style={{
        ...customThemeStyles,
        ...(maxWidth ? { maxWidth: typeof maxWidth === 'number' ? `${maxWidth}px` : maxWidth } : {}),
        ...style,
      }}
    >
      {/* Optional Top Kicker Badge */}
      {kicker && <p className="sb-kicker">{kicker}</p>}

      {/* Main Sketchbook Stage */}
      <div className="sb-wrap" id="sbWrap">
        <div
          ref={stageRef}
          className="sb-stage"
          onPointerDown={onStagePointerDown}
          onPointerMove={onStagePointerMove}
          onPointerUp={onStagePointerUp}
          onPointerCancel={onStagePointerUp}
          onDoubleClick={zoomReset}
        >
          {/* Navigation Chevron Left */}
          {showNavigationArrows && (
            <button
              className="sb-arrow left"
              onClick={() => step('prev')}
              aria-label="Previous plate"
            >
              <svg viewBox="0 0 14 44" width="14" height="44" fill="none" aria-hidden="true">
                <polyline
                  points="11,3 3,22 11,41"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          )}

          {/* 3D Perspective Box */}
          <div ref={sb3dRef} className="sb-3d">
            <div className="sb-tilt">
              <div className="sb-cast ambient" aria-hidden="true" />
              <div className="sb-cast contact" aria-hidden="true" />
              <div className="sb-cast hair" aria-hidden="true" />
              <div ref={bookRef} className="sb-book" />
            </div>

            {/* Magnifier Mirror Layer */}
            <div ref={zoomWrapRef} className="zoomwrap" aria-hidden="true">
              <div ref={zoomInnerRef} className="zoominner" />
            </div>

            {/* Draggable Optical Loupe */}
            <div
              ref={loupeRef}
              className={`loupe ${isLoupeActive ? 'on' : ''}`}
              onPointerDown={onLoupePointerDown}
              onPointerMove={onLoupePointerMove}
              onPointerUp={onLoupePointerUp}
              onPointerCancel={onLoupePointerUp}
            >
              <span className="grip" />
              <span className="ring">
                <span className="lens">
                  <span className="mag" />
                </span>
              </span>
            </div>
          </div>

          {/* Navigation Chevron Right */}
          {showNavigationArrows && (
            <button
              className="sb-arrow right"
              onClick={() => step('next')}
              aria-label="Next plate"
            >
              <svg viewBox="0 0 14 44" width="14" height="44" fill="none" aria-hidden="true">
                <polyline
                  points="3,3 11,22 3,41"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          )}
        </div>

        {/* Plate Title Captions */}
        {showCaptions && <div ref={capBoxRef} className="sb-captions" />}

        {/* View Controls Toolbar */}
        {showToolBar && (
          <div className="sb-tools" role="group" aria-label="View controls">
            {enableZoom && (
              <>
                <button
                  className="tool"
                  onClick={zoomOut}
                  disabled={!canZoomOut}
                  aria-label="Zoom out"
                  title="Zoom out"
                >
                  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
                    <circle cx="8.6" cy="8.6" r="5.6" />
                    <path d="M12.8 12.8 17.4 17.4M6.2 8.6h4.8" />
                  </svg>
                </button>
                <span className="zoom-read">{zoomPercent}%</span>
                <button
                  className="tool"
                  onClick={zoomIn}
                  disabled={!canZoomIn}
                  aria-label="Zoom in"
                  title="Zoom in"
                >
                  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
                    <circle cx="8.6" cy="8.6" r="5.6" />
                    <path d="M12.8 12.8 17.4 17.4M6.2 8.6h4.8M8.6 6.2v4.8" />
                  </svg>
                </button>
                <span className="tool-sep" aria-hidden="true" />
              </>
            )}

            <button
              className="tool"
              onClick={toggleLoupe}
              aria-label="Toggle magnifier"
              aria-pressed={isLoupeActive}
              title={isLoupeActive ? 'Disable magnifying glass' : 'Enable magnifying glass'}
            >
              <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
                <circle cx="8.8" cy="8.8" r="5.8" />
                <path d="M13 13l4.4 4.4" />
                <path d="M6.4 7.2a3.2 3.2 0 0 1 2.4-1.4" opacity="0.55" />
              </svg>
            </button>
          </div>
        )}

        {/* Interaction Hint */}
        <p className={`sb-hint ${hintVisible ? '' : 'gone'}`}>
          Drag leaf to turn · Drag magnifier to inspect details
        </p>
      </div>

      {/* Editorial Plate Index List */}
      {showIndex && (
        <section className="plates-section" aria-label="Plates Catalog">
          <p className="plates-heading">Catalog of Plates</p>
          <ol className="plate-list">
            {pages.map((p, i) => (
              <li key={p.id || i}>
                <button
                  className="plate-btn"
                  onClick={() => goTo(i)}
                  aria-current={i === activeIdx ? 'true' : 'false'}
                >
                  <span className="n">{String(i + 1).padStart(2, '0')}</span>
                  <span className="t">{p.title}</span>
                  <span className="p">{p.place}</span>
                </button>
              </li>
            ))}
          </ol>
        </section>
      )}
    </div>
  );
}
