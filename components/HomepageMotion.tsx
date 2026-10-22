"use client";

import { useEffect } from "react";

export default function HomepageMotion() {
  useEffect(() => {
    const root = document.getElementById("main-content");
    if (!root || !("IntersectionObserver" in window) ||
        window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const items = Array.from(root.querySelectorAll<HTMLElement>("[data-motion-item]"));
    const viewportHeight = window.innerHeight;
    for (const item of items) {
      const bounds = item.getBoundingClientRect();
      if (bounds.top < viewportHeight * 0.9 && bounds.bottom > 0) {
        item.dataset.motionVisible = "true";
      }
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).dataset.motionVisible = "true";
            observer.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -7% 0px", threshold: 0.08 },
    );

    for (const item of items) {
      if (item.dataset.motionVisible !== "true") observer.observe(item);
    }
    root.dataset.motionReady = "true";

    // Motion prototype: image layers scrub gently as the native page scrolls.
    // Read geometry in one animation frame, write CSS variables. No layout changes.
    const layers = Array.from(root.querySelectorAll<HTMLElement>("[data-motion-depth]"));
    let frame = 0;
    const updateDepth = () => {
      frame = 0;
      const viewport = window.innerHeight || 1;
      const multiplier = window.innerWidth <= 640 ? 0.46 : 1;
      for (const layer of layers) {
        const rect = layer.getBoundingClientRect();
        if (rect.bottom < -250 || rect.top > viewport + 250) continue;
        const position = (rect.top + rect.height / 2 - viewport / 2) / (viewport * 0.75);
        const clamped = Math.max(-1, Math.min(1, position));
        const strength = Number(layer.dataset.motionDepth ?? "1");
        layer.style.setProperty("--motion-depth", `${Math.round(-clamped * 30 * strength * multiplier)}px`);
      }
    };
    const scheduleDepth = () => {
      if (!frame) frame = window.requestAnimationFrame(updateDepth);
    };
    window.addEventListener("scroll", scheduleDepth, { passive: true });
    window.addEventListener("resize", scheduleDepth);
    scheduleDepth();

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", scheduleDepth);
      window.removeEventListener("resize", scheduleDepth);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return null;
}
