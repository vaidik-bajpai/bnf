import React, { useEffect, useRef } from "react";

export interface OutlineTypeflowProps extends React.HTMLAttributes<HTMLDivElement> {
  phrase?: string;
  speed?: number;
}

export function OutlineTypeflow({
  phrase = "CODEX READS THE PATH AND WRITES IT BACK AGAIN ",
  speed = 1,
  className = "",
  style,
  ...props
}: OutlineTypeflowProps) {
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
    let t = 0;

    const render = () => {
      ctx.fillStyle = "#08090a";
      ctx.fillRect(0, 0, width, height);

      t += 0.02 * speed;
      const cx = width / 2;
      const cy = height / 2;

      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.font = "bold 13px monospace";

      const totalChars = phrase.length * 3;
      const a = width * 0.35;
      const b = height * 0.28;

      for (let i = 0; i < totalChars; i++) {
        const u = (i / totalChars) * Math.PI * 2 + t * 0.3;
        // Lemniscate of Bernoulli (figure-8 path)
        const denom = 1 + Math.sin(u) * Math.sin(u);
        const x = cx + (a * Math.cos(u)) / denom;
        const y = cy + (b * Math.sin(u) * Math.cos(u)) / denom;

        const char = phrase[i % phrase.length];
        const alpha = 0.3 + Math.sin(u * 2 + t) * 0.4 + 0.3;
        ctx.fillStyle = `rgba(230, 240, 255, ${alpha})`;
        ctx.fillText(char, x, y);
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [phrase, speed]);

  return (
    <div
      className={`relative overflow-hidden w-full h-full min-h-[350px] bg-[#08090a] ${className}`}
      style={style}
      {...props}
    >
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
}
