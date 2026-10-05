import React, { useEffect, useRef } from "react";

export interface CrtBackgroundProps extends React.HTMLAttributes<HTMLDivElement> {
  speed?: number;
  message?: string;
}

export function CrtBackground({
  speed = 1,
  message = "ZION MAINFRAME // TERMINAL ACTIVE",
  className = "",
  style,
  ...props
}: CrtBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 800);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 600);
    let scanlineOffset = 0;

    const render = () => {
      ctx.fillStyle = "#030805";
      ctx.fillRect(0, 0, width, height);

      // Terminal text
      ctx.fillStyle = "#4ade80";
      ctx.font = "14px monospace";
      ctx.fillText(message, 30, 40);
      ctx.fillText("> INITIALIZING BUFFER...", 30, 70);
      ctx.fillText("> SYSTEM INTEGRITY 100%", 30, 95);

      // Scanlines
      scanlineOffset = (scanlineOffset + 1.5 * speed) % 4;
      ctx.fillStyle = "rgba(0, 0, 0, 0.35)";
      for (let y = scanlineOffset; y < height; y += 4) {
        ctx.fillRect(0, y, width, 1.5);
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [speed, message]);

  return (
    <div
      className={`relative overflow-hidden w-full h-full min-h-[300px] bg-[#030805] ${className}`}
      style={style}
      {...props}
    >
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
}
