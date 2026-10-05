import React, { useEffect, useRef } from "react";

export interface RippleStudyProps extends React.HTMLAttributes<HTMLDivElement> {
  gridSize?: number;
  speed?: number;
}

export function RippleStudy({
  gridSize = 24,
  speed = 1,
  className = "",
  style,
  ...props
}: RippleStudyProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 700);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 450);

    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    type Ripple = { x: number; y: number; t: number };
    const ripples: Ripple[] = [];

    const handleClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      ripples.push({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        t: performance.now(),
      });
    };

    canvas.addEventListener("click", handleClick);

    const render = (now: number) => {
      ctx.fillStyle = "#0b0b0b";
      ctx.fillRect(0, 0, width, height);

      // Periodic ripple if none active
      if (ripples.length === 0 || now - ripples[ripples.length - 1].t > 3000) {
        ripples.push({ x: width / 2, y: height / 2, t: now });
      }

      // Prune
      while (ripples.length && now - ripples[0].t > 3500) {
        ripples.shift();
      }

      const cell = Math.min(width, height) / (gridSize + 4);
      const fs = cell * 0.9;
      const x0 = width / 2 - (cell * (gridSize - 1)) / 2;
      const y0 = height / 2 - (cell * (gridSize - 1)) / 2;

      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.font = `${fs}px monospace`;

      for (let gy = 0; gy < gridSize; gy++) {
        const py = y0 + gy * cell;
        for (let gx = 0; gx < gridSize; gx++) {
          const px = x0 + gx * cell;
          let wave = 0;

          for (const r of ripples) {
            const age = (now - r.t) / 1000;
            const dist = Math.hypot(px - r.x, py - r.y);
            const radius = age * 180 * speed;
            const diff = dist - radius;
            if (Math.abs(diff) < 40) {
              const env = Math.max(0, 1 - age / 3.5);
              wave += Math.cos((diff / 40) * Math.PI) * env;
            }
          }

          const ch = chars[(gx * 7 + gy * 13) % chars.length];
          const brightness = Math.min(1, Math.max(0.2, 0.35 + wave * 0.65));
          ctx.fillStyle = `rgba(240, 240, 235, ${brightness})`;
          ctx.fillText(ch, px, py - wave * 6);
        }
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => {
      cancelAnimationFrame(animId);
      canvas.removeEventListener("click", handleClick);
    };
  }, [gridSize, speed]);

  return (
    <div
      className={`relative overflow-hidden w-full h-full min-h-[350px] bg-[#0b0b0b] cursor-pointer ${className}`}
      style={style}
      {...props}
    >
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
}
