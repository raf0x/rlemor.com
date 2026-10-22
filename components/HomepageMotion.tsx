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
    return () => observer.disconnect();
  }, []);

  return null;
}
