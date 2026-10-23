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

  useEffect(() => {
    const root = document.getElementById("main-content");
    if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let disposed = false;
    let disposeAnimation: (() => void) | undefined;

    // Deliberately confined to two existing scenes. Other Studio effects
    // remain untouched. Dynamic import keeps GSAP out of the server bundle.
    void Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(
      ([gsapModule, triggerModule]) => {
        if (disposed) return;
        const gsap = gsapModule.gsap;
        const ScrollTrigger = triggerModule.ScrollTrigger;
        gsap.registerPlugin(ScrollTrigger);

        const hero = root.querySelector<HTMLElement>("[data-gsap-hero]");
        const lighthouse = root.querySelector<HTMLElement>("[data-gsap-lighthouse]");
        if (!hero || !lighthouse) return;

        root.dataset.gsapActive = "true";
        const scope = gsap.context(() => {
          const lines = hero.querySelectorAll("[data-gsap-hero-line]");
          const greeting = hero.querySelector("[data-gsap-greeting]");
          const copy = hero.querySelector("[data-gsap-copy]");
          const actions = hero.querySelector("[data-gsap-actions]");
          const portrait = hero.querySelector("[data-gsap-portrait]");

          const timeline = gsap.timeline({ defaults: { ease: "power3.out" } });
          if (greeting) timeline.from(greeting, { autoAlpha: 0, y: 12, duration: 0.7 }, 0.05);
          if (lines[0]) timeline.from(lines[0], { autoAlpha: 0, y: 42, duration: 1.15 }, 0.2);
          if (lines[1]) timeline.from(lines[1], { autoAlpha: 0, y: 35, duration: 1.25 }, 0.43);
          if (copy) timeline.from(copy, { autoAlpha: 0, y: 24, duration: 0.95 }, 0.72);
          if (actions) timeline.from(actions, { autoAlpha: 0, y: 18, duration: 0.85 }, 0.99);
          if (portrait) timeline.from(portrait, {
            autoAlpha: 0, y: 36, scale: 0.92, duration: 1.35,
          }, 0.42);

          const media = lighthouse.querySelector<HTMLElement>("a[data-motion-tilt]");
          const image = media?.querySelector("img");
          const story = lighthouse.querySelector<HTMLElement>("div[data-mobile-motion-item]");
          // One-shot scene: no scroll scrubbing, clipping, forced pinning or
          // repeated transforms when users scroll back up.
          if (media && image && story) {
            gsap.set(media, { clipPath: "inset(9% 6% 9% 6% round 12px)", autoAlpha: 1 });
            gsap.set(image, { scale: 1.09, transformOrigin: "center center" });
            gsap.set(story, { autoAlpha: 0, y: 28 });
            const reveal = gsap.timeline({ paused: true, defaults: { ease: "power3.out" } });
            reveal.to(media, { clipPath: "inset(0% 0% 0% 0% round 0px)", duration: 1.45 }, 0)
              .to(image, { scale: 1, duration: 1.65 }, 0)
              .to(story, { autoAlpha: 1, y: 0, duration: 1.05 }, 0.35);
            ScrollTrigger.create({
              trigger: lighthouse,
              start: "top 85%",
              once: true,
              onEnter: () => reveal.play(),
            });
            // Deep-linked/restored scroll positions must never hide content.
            if (lighthouse.getBoundingClientRect().top < innerHeight * 0.85) reveal.play();
          }
        }, root);

        disposeAnimation = () => {
          scope.revert();
          delete root.dataset.gsapActive;
        };
      },
    );

    return () => {
      disposed = true;
      disposeAnimation?.();
    };
  }, []);

  return null;
}
