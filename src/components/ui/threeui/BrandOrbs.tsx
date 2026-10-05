import React, { useEffect, useRef } from "react";

export interface BrandOrbsProps extends React.HTMLAttributes<HTMLDivElement> {
  orbCount?: number;
  speed?: number;
}

export function BrandOrbs({
  orbCount = 6,
  speed = 1,
  className = "",
  style,
  ...props
}: BrandOrbsProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 800);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 450);
    let t = 0;

    const brandLogos = ["✦", "⚛", "⌘", "▲", "◆", "●"];

    const render = () => {
      ctx.fillStyle = "#07080b";
      ctx.fillRect(0, 0, width, height);

      t += 0.02 * speed;
      const cx = width / 2;
      const cy = height / 2;
      const orbitR = Math.min(width, height) * 0.32;

      for (let i = 0; i < orbCount; i++) {
        const angle = (i / orbCount) * Math.PI * 2 + t * 0.4;
        const x = cx + Math.cos(angle) * orbitR;
        const y = cy + Math.sin(angle) * (orbitR * 0.5) + Math.sin(angle * 2 + t) * 15;
        const z = Math.sin(angle);
        const radius = 28 + z * 10;

        // Orb gradient
        const grad = ctx.createRadialGradient(
          x - radius * 0.3,
          y - radius * 0.3,
          radius * 0.1,
          x,
          y,
          radius
        );
        const hue = (i * 55 + t * 20) % 360;
        grad.addColorStop(0, `hsla(${hue}, 90%, 75%, 0.95)`);
        grad.addColorStop(0.6, `hsla(${hue}, 80%, 45%, 0.7)`);
        grad.addColorStop(1, `hsla(${hue}, 90%, 15%, 0.2)`);

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();

        // Logo inside orb
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = "#ffffff";
        ctx.font = `${Math.round(radius * 0.9)}px sans-serif`;
        ctx.fillText(brandLogos[i % brandLogos.length], x, y);
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [orbCount, speed]);

  return (
    <div
      className={`relative overflow-hidden w-full h-full min-h-[360px] bg-[#07080b] ${className}`}
      style={style}
      {...props}
    >
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
}
