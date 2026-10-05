import React, { useEffect, useRef, useState } from "react";

export interface BookshelfSceneProps extends React.HTMLAttributes<HTMLDivElement> {
  bookCount?: number;
}

export function BookshelfScene({
  bookCount = 12,
  className = "",
  style,
  ...props
}: BookshelfSceneProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedBook, setSelectedBook] = useState<number | null>(null);

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

    const books = Array.from({ length: bookCount }, (_, i) => ({
      title: `VOL. ${i + 1}`,
      h: 120 + Math.sin(i * 1.5) * 35,
      w: 22 + (i % 3) * 6,
      color: `hsl(${(i * 32) % 360}, 55%, 35%)`,
      gold: i % 2 === 0,
    }));

    const render = () => {
      ctx.fillStyle = "#0c0a09";
      ctx.fillRect(0, 0, width, height);

      t += 0.02;

      // Wooden shelf
      const shelfY = height * 0.72;
      ctx.fillStyle = "#291d18";
      ctx.fillRect(40, shelfY, width - 80, 20);
      ctx.fillStyle = "#1c130f";
      ctx.fillRect(40, shelfY + 20, width - 80, 10);

      // Books on shelf
      let curX = 70;
      for (let i = 0; i < books.length; i++) {
        const b = books[i];
        const isHovered = selectedBook === i;
        const lean = isHovered ? -8 : Math.sin(i + t * 0.5) * 1.5;
        const liftY = isHovered ? -16 : 0;

        ctx.save();
        ctx.translate(curX + b.w / 2, shelfY + liftY);
        ctx.rotate((lean * Math.PI) / 180);

        // Book body
        ctx.fillStyle = b.color;
        ctx.fillRect(-b.w / 2, -b.h, b.w, b.h);

        // Spine decoration
        ctx.strokeStyle = b.gold ? "#d4af37" : "rgba(255,255,255,0.2)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(-b.w / 2 + 2, -b.h + 12);
        ctx.lineTo(b.w / 2 - 2, -b.h + 12);
        ctx.moveTo(-b.w / 2 + 2, -12);
        ctx.lineTo(b.w / 2 - 2, -12);
        ctx.stroke();

        // Spine title
        ctx.save();
        ctx.translate(0, -b.h / 2);
        ctx.rotate(-Math.PI / 2);
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = b.gold ? "#d4af37" : "#e5e5e5";
        ctx.font = "bold 9px monospace";
        ctx.fillText(b.title, 0, 0);
        ctx.restore();

        ctx.restore();
        curX += b.w + 6;
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [bookCount, selectedBook]);

  return (
    <div
      className={`relative overflow-hidden w-full h-full min-h-[360px] bg-[#0c0a09] ${className}`}
      style={style}
      {...props}
    >
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
}
