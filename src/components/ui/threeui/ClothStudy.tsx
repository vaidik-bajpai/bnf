import React, { useEffect, useRef } from "react";

export interface ClothStudyProps extends React.HTMLAttributes<HTMLDivElement> {
  phrase?: string;
}

export function ClothStudy({
  phrase = "KINETIC TEXTILE PATTERN STUDY",
  className = "",
  style,
  ...props
}: ClothStudyProps) {
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

    const cols = 22;
    const rows = 14;

    const render = () => {
      ctx.fillStyle = "#16090b";
      ctx.fillRect(0, 0, width, height);

      t += 0.03;

      const cellW = (width * 0.75) / cols;
      const cellH = (height * 0.65) / rows;
      const x0 = (width - cols * cellW) / 2;
      const y0 = (height - rows * cellH) / 2;

      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.font = "bold 11px monospace";

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const wave = Math.sin(c * 0.3 + t) * Math.cos(r * 0.4 - t * 0.7);
          const px = x0 + c * cellW + Math.cos(t + r) * 4;
          const py = y0 + r * cellH + wave * 14;

          const ch = phrase[(r * cols + c) % phrase.length];
          const alpha = 0.35 + ((wave + 1) / 2) * 0.65;
          ctx.fillStyle = `rgba(245, 180, 190, ${alpha})`;
          ctx.fillText(ch, px, py);
        }
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [phrase]);

  return (
    <div
      className={`relative overflow-hidden w-full h-full min-h-[350px] bg-[#16090b] ${className}`}
      style={style}
      {...props}
    >
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
}
