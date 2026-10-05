import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from "react";

import liquidMetalButtonSource from "./liquid-metal-button.html?raw";

export type LiquidMetalButtonVariant = "pill" | "circle" | "play";

export type LiquidMetalButtonProps = {
  variant?: LiquidMetalButtonVariant;
  className?: string;
  style?: CSSProperties;
  rendering?: "colored" | "monotone";
  diameter?: number;
  strokeWidth?: number;
  text?: string;
  embedded?: boolean;
  onClick?: () => void;
};

const STANDALONE_STYLE = `
<style id="liquid-metal-standalone-style">
  html, body {
    background: transparent !important;
    margin: 0 !important;
    padding: 0 !important;
    width: 100% !important;
    height: 100% !important;
    overflow: hidden !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
  }
  .stage {
    position: relative !important;
    width: 100% !important;
    height: 100% !important;
    margin: 0 !important;
    display: grid !important;
    place-items: center !important;
  }
  #fx {
    position: absolute !important;
    inset: 0 !important;
    width: 100% !important;
    height: 100% !important;
    display: block !important;
  }
  .plate {
    box-shadow:
      0 calc(var(--h) * 0.08) calc(var(--h) * 0.16) rgba(0,0,0,.45),
      0 calc(var(--h) * 0.16) calc(var(--h) * 0.32) rgba(0,0,0,.30) !important;
  }
  body.hot .plate {
    box-shadow:
      0 calc(var(--h) * 0.10) calc(var(--h) * 0.20) rgba(0,0,0,.55),
      0 calc(var(--h) * 0.20) calc(var(--h) * 0.40) rgba(0,0,0,.35) !important;
  }
  body[data-embedded="true"] .stage {
    --pad: 0px !important;
  }
  body[data-embedded="true"] .plate,
  body[data-embedded="true"] .btn,
  body[data-embedded="true"] #fx {
    width: 100% !important;
    height: 100% !important;
    border-radius: 999px !important;
  }
</style>`;

const LIQUID_METAL_BUTTON_BRIDGE = `
<script id="liquid-metal-button-bridge">
  window.addEventListener('message', event => {
    if(event.source !== parent) return;
    const config = event.data && event.data.liquidMetalButton;
    if(!config) return;
    const text = typeof config.text === 'string' ? config.text.slice(0, 24) : '';
    const label = btn.querySelector('.lbl');
    if(label) label.textContent = text;
    btn.setAttribute('aria-label', text || 'Button');
    if(config.embedded) {
      document.body.setAttribute('data-embedded', 'true');
    }
    if(config.pillWidthUnits) {
      stage.style.setProperty('--bw', 'calc(' + config.pillWidthUnits + ' * var(--u))');
    }
    needResize = true;
    drawn = null;
  });

  btn.addEventListener('click', () => {
    parent.postMessage({ liquidMetalButton: { type: 'activate' } }, '*');
  });
</script>`;

const CIRCLE_RUNTIME_STYLE = `
<style id="liquid-metal-circle-variant">
  body[data-shape="circle"] .stage {
    --h: 56px;
    --bw: var(--h);
  }

  body[data-shape="circle"] .btn {
    gap: 0;
  }

  body[data-shape="circle"] .btn .ico {
    width: 28%;
    height: 28%;
  }

  body[data-shape="circle"] .btn .lbl {
    display: none;
  }
</style>`;

function prepareBaseSource(raw: string) {
  return raw
    .replace(
      /background:\s*radial-gradient[^;]+#000;/,
      "background: transparent !important;",
    )
    .replace(
      "width:calc(var(--bw) + 2 * var(--pad));",
      "width: 100%;",
    )
    .replace(
      "height:calc(var(--bh) + 2 * var(--pad));",
      "height: 100%;",
    )
    .replace(
      "o = vec4(min(rgb, vec3(1.)), a);",
      `
    float edgeDist = max(abs(d.x) / (uRes.x * 0.5), abs(d.y) / (uRes.y * 0.5));
    float edgeFade = 1.0 - smoothstep(0.60, 0.95, edgeDist);
    o = vec4(min(rgb, vec3(1.)) * edgeFade, a * edgeFade);
      `,
    );
}

function sourceForVariant(variant: Exclude<LiquidMetalButtonVariant, "play">) {
  const base = prepareBaseSource(liquidMetalButtonSource);
  if (variant === "pill") {
    return base
      .replace("</head>", `${STANDALONE_STYLE}\n</head>`)
      .replace("</body>", `${LIQUID_METAL_BUTTON_BRIDGE}\n</body>`);
  }

  return base
    .replace("</head>", `${STANDALONE_STYLE}\n${CIRCLE_RUNTIME_STYLE}\n</head>`)
    .replace("<body>", '<body data-shape="circle">')
    .replace(
      '<button class="btn" id="btn" type="button">',
      '<button class="btn" id="btn" type="button" aria-label="Add">',
    )
    .replace("</body>", `${LIQUID_METAL_BUTTON_BRIDGE}\n</body>`);
}

const liquidMetalPlayButtonSource = prepareBaseSource(liquidMetalButtonSource)
  .replace(
    "--bw: calc(1407 * var(--u));",
    "--bw: var(--h);",
  )
  .replace("</head>", `${STANDALONE_STYLE}\n</head>`)
  .replace(
    "</style>",
    `
  body{position:relative}
  .stage{
    --h: 88px;
    --bw: var(--h);
    position: relative !important;
    width: 100% !important;
    height: 100% !important;
    margin: 0 !important;
    display: grid !important;
    place-items: center !important;
  }
  #fx{filter:none;position:absolute !important;inset:0 !important;width:100% !important;height:100% !important;display:block !important;}
  .plate{width:var(--bw) !important;height:var(--h) !important;border-radius:999px !important}
  .btn{width:var(--bw) !important;height:var(--h) !important;border-radius:999px !important;flex-direction:column;gap:0}
  .btn:focus-visible{outline:2px solid rgba(255,255,255,.68);outline-offset:4px}
  .btn .ico{
    width:calc(var(--h) * .25);height:calc(var(--h) * .25);
    transform:translateX(calc(var(--h) * .018));
  }
</style>`,
  )
  .replace(
    `<button class="btn" id="btn" type="button">
    <svg class="ico" viewBox="0 0 115 115" aria-hidden="true">
      <g stroke="currentColor" stroke-width="17" stroke-linecap="round">
        <path d="M57.5 8.5 V106.5"/>
        <path d="M8.5 57.5 H106.5"/>
      </g>
    </svg>
    <span class="lbl">Sign up</span>
  </button>`,
    `<button class="btn" id="btn" type="button" aria-label="Play">
    <svg class="ico" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="currentColor" d="M15.5 10.75a2.2 2.2 0 0 1 3.32-1.9l18.04 13.25a2.35 2.35 0 0 1 0 3.8L18.82 39.15a2.2 2.2 0 0 1-3.32-1.9v-26.5Z"/>
    </svg>
  </button>`,
  )
  .replace(
    "let needResize = true;",
    "let needResize = true;\nlet playStrokeWidth = 3;",
  )
  .replace(
    "const bw = Math.max(1.5, 3.2 * (BH/516));      // stroke half-width, device px",
    "const bw = Math.max(0.5 * DPR, playStrokeWidth * DPR * 0.5); // configurable stroke half-width, device px",
  )
  .replace(
    "window.__seek   = v => { clock = v; drawn = null; };",
    `window.__seek   = v => { clock = v; drawn = null; };

window.addEventListener('message', event => {
  if(event.source !== parent) return;
  const config = event.data && event.data.liquidMetalPlayButton;
  if(!config) return;
  const diameter = Math.min(160, Math.max(44, Number(config.diameter) || 88));
  const strokeWidth = Math.min(8, Math.max(1, Number(config.strokeWidth) || 3));
  const text = typeof config.text === 'string' ? config.text.slice(0, 24) : 'Play';
  stage.style.setProperty('--h', diameter + 'px');
  stage.style.setProperty('--bw', diameter + 'px');
  playStrokeWidth = strokeWidth;
  btn.setAttribute('aria-label', text.trim() || 'Play');
  cv.style.filter = config.rendering === 'monotone' ? 'grayscale(1) contrast(1.04)' : 'none';
  needResize = true;
  drawn = null;
});`,
  )
  .replace("</body>", `${LIQUID_METAL_BUTTON_BRIDGE}\n</body>`);

function clamp(value: number, min: number, max: number, fallback: number) {
  return Number.isFinite(value) ? Math.min(max, Math.max(min, value)) : fallback;
}

export function LiquidMetalButton({
  className = "",
  style,
  variant = "pill",
  rendering = "colored",
  diameter = 88,
  strokeWidth = 3,
  text,
  embedded = false,
  onClick,
}: LiquidMetalButtonProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLIFrameElement>(null);
  const intersectsRef = useRef(true);
  const [mounted, setMounted] = useState(true);
  const [ready, setReady] = useState(false);
  const safeVariant: LiquidMetalButtonVariant =
    variant === "circle" || variant === "play" ? variant : "pill";
  const isPlayButton = safeVariant === "play";
  const safeText = String(text ?? (safeVariant === "pill" ? "Sign up" : safeVariant === "circle" ? "Add" : "Play"))
    .slice(0, 24);
  const pillWidthUnits = safeVariant === "pill"
    ? Math.min(3000, Math.max(1407, 820 + safeText.length * 94))
    : undefined;
  const source = useMemo(
    () => isPlayButton ? liquidMetalPlayButtonSource : sourceForVariant(safeVariant),
    [isPlayButton, safeVariant],
  );
  const playConfig = {
    diameter: clamp(diameter, 44, 160, 88),
    strokeWidth: clamp(strokeWidth, 1, 8, 3),
    rendering,
    text: safeText,
  } as const;

  const syncButtonConfig = useCallback(() => {
    frameRef.current?.contentWindow?.postMessage({
      liquidMetalButton: { text: safeText, pillWidthUnits, embedded },
    }, "*");
  }, [embedded, pillWidthUnits, safeText]);

  const syncPlayConfig = useCallback(() => {
    if (!isPlayButton) return;
    frameRef.current?.contentWindow?.postMessage({ liquidMetalPlayButton: playConfig }, "*");
  }, [isPlayButton, playConfig.diameter, playConfig.rendering, playConfig.strokeWidth, playConfig.text]);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const sync = () => setMounted(intersectsRef.current && document.visibilityState !== "hidden");
    const observer = new IntersectionObserver(([entry]) => {
      intersectsRef.current = entry.isIntersecting;
      sync();
    }, { rootMargin: "80px" });

    observer.observe(host);
    document.addEventListener("visibilitychange", sync);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", sync);
    };
  }, []);

  useEffect(() => {
    if (!mounted) setReady(false);
  }, [mounted]);

  useEffect(() => {
    if (!ready) return;
    syncButtonConfig();
    syncPlayConfig();
  }, [ready, syncButtonConfig, syncPlayConfig]);

  useEffect(() => {
    if (!onClick) return undefined;
    const receiveMessage = (event: MessageEvent) => {
      if (event.source !== frameRef.current?.contentWindow) return;
      if (event.data?.liquidMetalButton?.type !== "activate") return;
      onClick();
    };
    window.addEventListener("message", receiveMessage);
    return () => window.removeEventListener("message", receiveMessage);
  }, [onClick]);

  const isCircle = safeVariant === "circle";
  const defaultDimensions: CSSProperties = embedded
    ? {
        position: "relative",
        width: "100%",
        height: "100%",
        display: "block",
        borderRadius: "999px",
        overflow: "hidden",
      }
    : {
        position: "relative",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        verticalAlign: "middle",
        width: isCircle
          ? "130px"
          : isPlayButton
            ? `${playConfig.diameter + 70}px`
            : `${Math.max(240, 140 + safeText.length * 11)}px`,
        height: isCircle
          ? "120px"
          : isPlayButton
            ? `${playConfig.diameter + 70}px`
            : "120px",
        background: "transparent",
        overflow: "visible",
      };

  return (
    <div
      ref={hostRef}
      className={`liquid-metal-button${className ? ` ${className}` : ""}`}
      style={{
        ...defaultDimensions,
        ...style,
      }}
      data-state={!mounted ? "paused" : ready ? "ready" : "loading"}
      data-variant={safeVariant}
      data-embedded={embedded ? "true" : undefined}
    >
      {mounted ? (
        <iframe
          key={safeVariant}
          ref={frameRef}
          className={`liquid-metal-button__frame${ready ? " is-ready" : ""}`}
          title={safeVariant === "circle"
            ? "Interactive liquid metal circle button"
            : isPlayButton
              ? "Interactive liquid metal play button"
              : "Interactive liquid metal button"}
          srcDoc={source}
          sandbox="allow-scripts"
          loading="eager"
          onLoad={() => {
            setReady(true);
            syncButtonConfig();
            syncPlayConfig();
          }}
        />
      ) : null}
    </div>
  );
}
