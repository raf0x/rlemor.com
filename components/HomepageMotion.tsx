"use client";

import { useEffect } from "react";

export default function HomepageMotion() {
  useEffect(() => {
    const root = document.getElementById("main-content");
    if (!root || !("IntersectionObserver" in window) ||
        window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const isPhone = window.matchMedia("(max-width: 640px)").matches;
    const sectionItems = Array.from(root.querySelectorAll<HTMLElement>("[data-motion-item]"));

    // Tall mobile stories reveal their image, copy, and partner groups as
    // separate reading moments. Desktop retains the existing Studio motion.
    if (isPhone) {
      for (const item of sectionItems) {
        if (item.querySelector("[data-mobile-motion-item]")) {
          item.dataset.motionVisible = "true";
        }
      }
      root.dataset.mobileMotionReady = "true";
    }

    const items = [
      ...sectionItems,
      ...(isPhone
        ? Array.from(root.querySelectorAll<HTMLElement>("[data-mobile-motion-item]"))
        : []),
    ];
    const viewportHeight = window.innerHeight;
    for (const item of items) {
      const bounds = item.getBoundingClientRect();
      if (bounds.top < viewportHeight * (isPhone ? 1.08 : 0.9) && bounds.bottom > 0) {
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
      {
        rootMargin: isPhone ? "0px 0px 12% 0px" : "0px 0px -7% 0px",
        threshold: isPhone ? 0.01 : 0.08,
      },
    );

    for (const item of items) {
      if (item.dataset.motionVisible !== "true") observer.observe(item);
    }
    root.dataset.motionReady = "true";

    // Prototype: interaction is pointer-driven, not a constant idle animation.
    // Browsers without fine hover pointers keep the native touch experience.
    const cleanups: Array<() => void> = [];
    if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      const targets = Array.from(
        root.querySelectorAll<HTMLElement>("[data-motion-tilt], [data-motion-magnet]"),
      );
      for (const target of targets) {
        const isTilt = target.hasAttribute("data-motion-tilt");
        const move = (event: PointerEvent) => {
          const rect = target.getBoundingClientRect();
          const x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
          const y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
          if (isTilt) {
            target.style.setProperty("--tilt-x", `${(-y * 3).toFixed(2)}deg`);
            target.style.setProperty("--tilt-y", `${(x * 3).toFixed(2)}deg`);
          } else {
            target.style.setProperty("--magnet-x", `${(x * 6).toFixed(1)}px`);
            target.style.setProperty("--magnet-y", `${(y * 4).toFixed(1)}px`);
          }
        };
        const reset = () => {
          if (isTilt) {
            target.style.setProperty("--tilt-x", "0deg");
            target.style.setProperty("--tilt-y", "0deg");
          } else {
            target.style.setProperty("--magnet-x", "0px");
            target.style.setProperty("--magnet-y", "0px");
          }
        };
        target.addEventListener("pointermove", move);
        target.addEventListener("pointerleave", reset);
        target.addEventListener("blur", reset);
        cleanups.push(() => {
          target.removeEventListener("pointermove", move);
          target.removeEventListener("pointerleave", reset);
          target.removeEventListener("blur", reset);
        });
      }
    }
    return () => {
      observer.disconnect();
      cleanups.forEach((cleanup) => cleanup());
    };
  }, []);

  return null;
}
