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
      if (bounds.top < viewportHeight * (isPhone ? 0.9 : 0.9) && bounds.bottom > 0) {
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
        rootMargin: isPhone ? "0px 0px -10% 0px" : "0px 0px -7% 0px",
        threshold: isPhone ? 0.05 : 0.08,
      },
    );

    for (const item of items) {
      if (item.dataset.motionVisible !== "true") observer.observe(item);
    }
    root.dataset.motionReady = "true";

    // Phone-only scroll choreography: drive three image masks and image-depth
    // transforms from the *actual finger scroll position*. This is not a timer,
    // and it reverses naturally when scrolling upward. Desktop stays unchanged.
    const media = isPhone
      ? Array.from(root.querySelectorAll<HTMLElement>("[data-mobile-scroll-media]"))
      : [];
    let scrollFrame = 0;
    const updateMedia = () => {
      scrollFrame = 0;
      const viewport = window.innerHeight || 1;
      for (const layer of media) {
        const rect = layer.getBoundingClientRect();
        if (rect.bottom < -viewport * 0.25 || rect.top > viewport * 1.2) continue;

        const wipeProgress = Math.max(
          0,
          Math.min(1, (viewport * 0.92 - rect.top) / (viewport * 0.48)),
        );
        const center = rect.top + rect.height / 2;
        const position = Math.max(
          -1,
          Math.min(1, (viewport / 2 - center) / (viewport * 0.55)),
        );

        layer.style.setProperty(
          "--mobile-wipe-right",
          `${((1 - wipeProgress) * 100).toFixed(1)}%`,
        );
        layer.style.setProperty(
          "--mobile-image-shift",
          `${(-position * 11).toFixed(1)}px`,
        );
      }
      root.dataset.mobileScrollReady = "true";
    };
    const scheduleMedia = () => {
      if (!scrollFrame) scrollFrame = window.requestAnimationFrame(updateMedia);
    };
    if (isPhone) {
      scheduleMedia();
      window.addEventListener("scroll", scheduleMedia, { passive: true });
      window.addEventListener("resize", scheduleMedia);
    }

    // Desktop-only cinematic depth on existing photographs and project screens.
    // The independent scale/translate properties preserve Studio hover tilt.
    const scenes = !isPhone
      ? Array.from(root.querySelectorAll<HTMLElement>(
          ".motion-cinematic-scene",
        ))
      : [];
    let sceneFrame = 0;
    const updateScenes = () => {
      sceneFrame = 0;
      const viewport = window.innerHeight || 1;
      for (const scene of scenes) {
        const rect = scene.getBoundingClientRect();
        if (rect.bottom < -viewport * 0.2 || rect.top > viewport * 1.2) continue;
        const normalized = Math.max(-1, Math.min(1,
          (rect.top + rect.height / 2 - viewport / 2) / (viewport * 0.7),
        ));
        const image = scene.querySelector<HTMLElement>("img");
        if (!image) continue;
        image.style.setProperty("--scene-scale", (1.035 - Math.abs(normalized) * 0.055).toFixed(3));
        image.style.setProperty("--scene-offset", `${(-normalized * 14).toFixed(1)}px`);
      }
    };
    const scheduleScenes = () => {
      if (!sceneFrame) sceneFrame = window.requestAnimationFrame(updateScenes);
    };
    if (!isPhone && scenes.length) {
      scheduleScenes();
      window.addEventListener("scroll", scheduleScenes, { passive: true });
      window.addEventListener("resize", scheduleScenes);
    }

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
      if (!isPhone) {
        window.removeEventListener("scroll", scheduleScenes);
        window.removeEventListener("resize", scheduleScenes);
        if (sceneFrame) window.cancelAnimationFrame(sceneFrame);
      }
      if (isPhone) {
        window.removeEventListener("scroll", scheduleMedia);
        window.removeEventListener("resize", scheduleMedia);
        if (scrollFrame) window.cancelAnimationFrame(scrollFrame);
      }
    };
  }, []);

  return null;
}
