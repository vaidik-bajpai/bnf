import React, { useEffect, useRef } from "react";

export type WovenClothVariant = "woven-cloth" | "iridescent" | "atelier" | "washi";

export interface WovenClothProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: WovenClothVariant;
  warpDensity?: number;
}

export function WovenCloth({
  variant = "woven-cloth",
  warpDensity = 14,
  className = "",
  style,
  ...props
}: WovenClothProps) {
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

    const render = () => {
      ctx.fillStyle = variant === "iridescent" ? "#160914" : "#140b08";
      ctx.fillRect(0, 0, width, height);

      t += 0.02;

      // Draw cross-hatch warp & weft threads
      for (let x = 0; x < width; x += warpDensity) {
        const wave = Math.sin(x * 0.05 + t) * 6;
        ctx.strokeStyle = variant === "iridescent" ? `hsl(${(x + t * 40) % 360}, 70%, 60%)` : "rgba(230, 180, 140, 0.25)";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x + wave, height);
        ctx.stroke();
      }

      for (let y = 0; y < height; y += warpDensity) {
        const wave = Math.cos(y * 0.05 - t) * 6;
        ctx.strokeStyle = variant === "iridescent" ? `hsl(${(y * 2 + t * 40) % 360}, 70%, 50%)` : "rgba(200, 150, 110, 0.25)";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y + wave);
        ctx.stroke();
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [variant, warpDensity]);

  return (
    <div
      className={`relative overflow-hidden w-full h-full min-h-[350px] ${className}`}
      style={style}
      {...props}
    >
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
}
