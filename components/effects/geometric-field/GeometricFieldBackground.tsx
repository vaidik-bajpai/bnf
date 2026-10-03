'use client';

import React, { useRef, useEffect } from "react";
import {
  GEOMETRIC_FIELD_DEFAULTS,
  createGeometricFieldRenderer,
  type GeometricFieldOptions,
} from "./geometricFieldRenderer";
import "./styles.css";

export interface GeometricFieldBackgroundProps extends Partial<GeometricFieldOptions> {
  className?: string;
  style?: React.CSSProperties;
  overlay?: boolean;
}

export function GeometricFieldBackground({
  className = "",
  style,
  overlay = false,
  ...userOptions
}: GeometricFieldBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const resolvedOptions: GeometricFieldOptions = {
    ...GEOMETRIC_FIELD_DEFAULTS,
    ...userOptions,
  };

  const optionsRef = useRef<GeometricFieldOptions>(resolvedOptions);

  useEffect(() => {
    optionsRef.current = {
      ...GEOMETRIC_FIELD_DEFAULTS,
      ...userOptions,
    };
  });

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    let animFrameId = 0;
    let isIntersecting = true;
    let isContextLost = false;

    // Detect prefers-reduced-motion
    const mediaQuery =
      typeof window !== "undefined" && window.matchMedia
        ? window.matchMedia("(prefers-reduced-motion: reduce)")
        : null;

    let renderer: ReturnType<typeof createGeometricFieldRenderer> | null = null;

    try {
      renderer = createGeometricFieldRenderer(canvas, () => {
        const opts = optionsRef.current;
        return {
          ...opts,
          reducedMotion: mediaQuery?.matches || opts.reducedMotion,
        };
      });
    } catch (err) {
      console.warn("GeometricField: WebGL initialization failed or unsupported", err);
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

    // ResizeObserver
    const resizeObserver = new ResizeObserver(() => {
      handleResize();
    });
    resizeObserver.observe(container);

    // Initial resize call
    handleResize();
    startAnimation();

    // IntersectionObserver to pause rendering when scrolled out of view
    let intersectionObserver: IntersectionObserver | null = null;
    if ("IntersectionObserver" in window) {
      intersectionObserver = new IntersectionObserver(
        (entries) => {
          const entry = entries[0];
          isIntersecting = entry?.isIntersecting ?? true;
          if (isIntersecting) {
            startAnimation();
          } else {
            stopAnimation();
          }
        },
        { threshold: 0.05 }
      );
      intersectionObserver.observe(container);
    }

    // VisibilityChange handler (tab switching)
    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopAnimation();
      } else if (isIntersecting) {
        startAnimation();
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // WebGL Context Lost / Restored
    const handleContextLost = (e: Event) => {
      e.preventDefault();
      isContextLost = true;
      stopAnimation();
    };
    const handleContextRestored = () => {
      isContextLost = false;
      handleResize();
      startAnimation();
    };
    canvas.addEventListener("webglcontextlost", handleContextLost, false);
    canvas.addEventListener("webglcontextrestored", handleContextRestored, false);

    // Pointer move for smooth 3D parallax
    const handlePointerMove = (e: MouseEvent) => {
      if (!renderer || !container) return;
      const rect = container.getBoundingClientRect();
      renderer.setPointer(e.clientX - rect.left, e.clientY - rect.top, rect.width, rect.height);
    };

    const handlePointerLeave = () => {
      if (renderer) {
        renderer.resetPointer();
      }
    };

    // Attach pointer interaction to hero section if present, else container
    const heroSection = document.getElementById("home") || container;
    heroSection.addEventListener("mousemove", handlePointerMove as EventListener, { passive: true });
    heroSection.addEventListener("mouseleave", handlePointerLeave, { passive: true });

    return () => {
      stopAnimation();
      resizeObserver.disconnect();
      intersectionObserver?.disconnect();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      canvas.removeEventListener("webglcontextlost", handleContextLost);
      canvas.removeEventListener("webglcontextrestored", handleContextRestored);
      heroSection.removeEventListener("mousemove", handlePointerMove as EventListener);
      heroSection.removeEventListener("mouseleave", handlePointerLeave);
      renderer?.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`geometric-field-container ${className}`}
      style={style}
    >
      <canvas ref={canvasRef} />
      {overlay && <div className="geometric-field-hero-overlay" />}
    </div>
  );
}

export default GeometricFieldBackground;
