import React, { useEffect, useRef, useState } from "react";

export const TOWER_COUNTRIES = ["japan", "china", "vietnam", "thailand", "cambodia", "turkey"] as const;
export type TowerCountry = (typeof TOWER_COUNTRIES)[number];

export interface JapaneseTowerLandscapeProps extends React.HTMLAttributes<HTMLDivElement> {
  country?: TowerCountry;
}

export function JapaneseTowerLandscape({
  country: initialCountry = "japan",
  className = "",
  style,
  ...props
}: JapaneseTowerLandscapeProps) {
  const [country, setCountry] = useState<TowerCountry>(initialCountry);
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

    const petals = Array.from({ length: 45 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vy: 0.8 + Math.random() * 1.5,
      vx: 1 + Math.random() * 2,
      rot: Math.random() * Math.PI,
    }));

    const render = () => {
      // Sky gradient
      const skyGrad = ctx.createLinearGradient(0, 0, 0, height);
      skyGrad.addColorStop(0, "#0e1118");
      skyGrad.addColorStop(0.6, "#241829");
      skyGrad.addColorStop(1, "#59273c");
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, width, height);

      t += 0.02;

      // Rising moon
      ctx.fillStyle = "#fff8e7";
      ctx.shadowColor = "#fff8e7";
      ctx.shadowBlur = 30;
      ctx.beginPath();
      ctx.arc(width * 0.78, height * 0.28, 48, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Distant mountain layers
      ctx.fillStyle = "rgba(18, 15, 28, 0.85)";
      ctx.beginPath();
      ctx.moveTo(0, height);
      ctx.lineTo(0, height * 0.65);
      ctx.lineTo(width * 0.35, height * 0.45);
      ctx.lineTo(width * 0.65, height * 0.7);
      ctx.lineTo(width, height * 0.55);
      ctx.lineTo(width, height);
      ctx.fill();

      // Pagoda / Tower silhouette
      const cx = width * 0.32;
      const baseY = height * 0.88;
      ctx.fillStyle = "#09080c";

      for (let tier = 0; tier < 5; tier++) {
        const ty = baseY - tier * 42;
        const tw = 90 - tier * 14;

        // Roof curve
        ctx.beginPath();
        ctx.moveTo(cx - tw, ty);
        ctx.quadraticCurveTo(cx, ty - 12, cx + tw, ty);
        ctx.lineTo(cx + tw * 0.7, ty + 20);
        ctx.lineTo(cx - tw * 0.7, ty + 20);
        ctx.closePath();
        ctx.fill();
      }

      // Spire
      ctx.fillRect(cx - 2, baseY - 5 * 42 - 25, 4, 30);

      // Cherry blossom petals drift
      ctx.fillStyle = "rgba(251, 207, 232, 0.75)";
      for (const p of petals) {
        p.y += p.vy;
        p.x += Math.sin(t + p.y * 0.02) * p.vx;
        if (p.y > height) p.y = 0;
        if (p.x > width) p.x = 0;

        ctx.beginPath();
        ctx.ellipse(p.x, p.y, 4, 2, p.rot, 0, Math.PI * 2);
        ctx.fill();
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [country]);

  return (
    <div
      className={`relative overflow-hidden w-full h-full min-h-[380px] flex flex-col ${className}`}
      style={style}
      {...props}
    >
      <div className="absolute top-4 left-4 z-20 flex gap-2">
        {TOWER_COUNTRIES.map((c) => (
          <button
            key={c}
            onClick={() => setCountry(c)}
            className={`px-2.5 py-1 text-[11px] font-mono rounded backdrop-blur border ${
              country === c
                ? "bg-white/20 border-white text-white font-bold"
                : "bg-black/40 border-white/10 text-neutral-300 hover:text-white"
            }`}
          >
            {c}
          </button>
        ))}
      </div>
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
}
