'use client';

import React, { useRef, useEffect } from "react";
import {
  WARP_FIELD_DEFAULTS,
  createWarpFieldRenderer,
  type WarpFieldOptions,
} from "./warpFieldRenderer";

export interface WarpFieldBackgroundProps extends Partial<WarpFieldOptions> {
  className?: string;
  style?: React.CSSProperties;
}

export function WarpFieldBackground({
  className = "",
  style,
  ...userOptions
}: WarpFieldBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const resolvedOptions: WarpFieldOptions = {
    ...WARP_FIELD_DEFAULTS,
    ...userOptions,
  };

  const optionsRef = useRef<WarpFieldOptions>(resolvedOptions);

  useEffect(() => {
    optionsRef.current = resolvedOptions;
  });

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    let animFrameId = 0;
    let isIntersecting = true;
    let isContextLost = false;

    // Check prefers-reduced-motion
    const mediaQuery =
      typeof window !== "undefined" && window.matchMedia
        ? window.matchMedia("(prefers-reduced-motion: reduce)")
        : null;

    let renderer: ReturnType<typeof createWarpFieldRenderer> | null = null;

    try {
      renderer = createWarpFieldRenderer(canvas, () => optionsRef.current);
    } catch (err) {
      console.warn("WarpField: WebGL initialization failed or unsupported", err);
      return;
    }

    const handleResize = () => {
      if (!renderer || !container) return;
      const rect = container.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        renderer.resize(rect.width, rect.height);
        renderer.render();
      }
    };

    const renderLoop = () => {
      if (isContextLost || !isIntersecting || document.hidden) {
        animFrameId = 0;
        return;
      }

      if (renderer) {
        renderer.render();
      }

      // If user prefers reduced motion, render single frame and pause RAF
      if (mediaQuery?.matches) {
        animFrameId = 0;
        return;
      }

      animFrameId = requestAnimationFrame(renderLoop);
    };

    const startAnimation = () => {
      if (
        !animFrameId &&
        !isContextLost &&
        isIntersecting &&
        !document.hidden &&
        !mediaQuery?.matches
      ) {
        animFrameId = requestAnimationFrame(renderLoop);
      }
    };

    const stopAnimation = () => {
      if (animFrameId) {
        cancelAnimationFrame(animFrameId);
        animFrameId = 0;
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopAnimation();
      } else {
        startAnimation();
      }
    };

    const handleContextLost = (event: Event) => {
      event.preventDefault();
      isContextLost = true;
      stopAnimation();
    };

    const handleContextRestored = () => {
      isContextLost = false;
      if (renderer && container) {
        handleResize();
        startAnimation();
      }
    };

    const handleReducedMotionChange = () => {
      if (mediaQuery?.matches) {
        stopAnimation();
        renderer?.render(); // render current state as static
      } else {
        startAnimation();
      }
    };

    const resizeObserver = new ResizeObserver(handleResize);
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      isIntersecting = entry?.isIntersecting ?? true;
      if (isIntersecting) {
        startAnimation();
      } else {
        stopAnimation();
      }
    });

    resizeObserver.observe(container);
    intersectionObserver.observe(container);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    canvas.addEventListener("webglcontextlost", handleContextLost, false);
    canvas.addEventListener(
      "webglcontextrestored",
      handleContextRestored,
      false
    );
    mediaQuery?.addEventListener?.("change", handleReducedMotionChange);

    handleResize();
    startAnimation();

    return () => {
      stopAnimation();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      canvas.removeEventListener("webglcontextlost", handleContextLost);
      canvas.removeEventListener(
        "webglcontextrestored",
        handleContextRestored
      );
      mediaQuery?.removeEventListener?.("change", handleReducedMotionChange);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      renderer?.dispose();
    };
  }, [userOptions.variant, userOptions.palette]); // Re-create renderer if variant or palette changes

  const { hue, saturation, brightness } = resolvedOptions;

  return (
    <div
      ref={containerRef}
      className={`threeui-background warp-field${className ? ` ${className}` : ""}`}
      style={style}
    >
      <canvas
        ref={canvasRef}
        style={{
          filter: `hue-rotate(${hue}deg) saturate(${saturation}) brightness(${brightness})`,
        }}
      />
    </div>
  );
}

export default WarpFieldBackground;
