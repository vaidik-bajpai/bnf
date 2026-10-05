import React, { useEffect, useRef } from "react";

export interface UplinkLoaderProps extends React.HTMLAttributes<HTMLDivElement> {
  statusText?: string;
  speed?: number;
}

export function UplinkLoader({
  statusText = "UPLINK ESTABLISHED",
  speed = 1,
  className = "",
  style,
  ...props
}: UplinkLoaderProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let angle = 0;

    const render = () => {
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);
      const cx = w / 2;
      const cy = h / 2;

      // Radar circles
      ctx.strokeStyle = "rgba(16, 185, 129, 0.25)";
      ctx.lineWidth = 1;
      [18, 32, 45].forEach((r) => {
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.stroke();
      });

      // Rotating sweep
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(angle);
      const sweep = ctx.createLinearGradient(0, 0, 45, 0);
      sweep.addColorStop(0, "rgba(16, 185, 129, 0)");
      sweep.addColorStop(1, "rgba(16, 185, 129, 0.8)");
      ctx.strokeStyle = sweep;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(45, 0);
      ctx.stroke();
      ctx.restore();

      angle += 0.05 * speed;
      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [speed]);

  return (
    <div
      className={`inline-flex flex-col items-center gap-3 p-6 rounded-2xl border border-emerald-500/20 bg-neutral-950/80 backdrop-blur-md ${className}`}
      style={{ fontFamily: "inherit", ...style }}
      {...props}
    >
      <canvas ref={canvasRef} width={100} height={100} className="w-[100px] h-[100px]" />
      <span className="font-mono text-xs tracking-widest text-emerald-400 uppercase">
        {statusText}
      </span>
    </div>
  );
}
