"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import type { CSSProperties, PointerEvent } from "react";
import styles from "./mypep-motion-artwork.module.css";

type Focus = "overview" | "doses" | "labs" | "timeline";
type Props = {
  variant?: "home" | "feature";
};

const AREAS: Record<Focus, { x: number; y: number; label: string }> = {
  overview: { x: 53, y: 49, label: "Overview" },
  doses: { x: 66, y: 27, label: "Doses" },
  labs: { x: 83, y: 32, label: "Labs" },
  timeline: { x: 82, y: 72, label: "Timeline" },
};

/**
 * Motion treatment of existing promotional artwork, not a second application.
 * All displayed health values are part of the illustrative source image.
 */
export default function MyPepMotionArtwork({ variant = "feature" }: Props) {
  const [focus, setFocus] = useState<Focus>("overview");
  const [reducedMotion, setReducedMotion] = useState(true);
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReducedMotion(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (!("IntersectionObserver" in window)) {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { rootMargin: "80px", threshold: 0.05 });
    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  const updatePointer = useCallback((event: PointerEvent<HTMLDivElement>) => {
    const root = rootRef.current;
    if (!root || reducedMotion || event.pointerType === "touch") return;
    const bounds = root.getBoundingClientRect();
    const nx = (event.clientX - bounds.left) / bounds.width;
    const ny = (event.clientY - bounds.top) / bounds.height;
    root.style.setProperty("--pointer-x", `${(nx * 100).toFixed(1)}%`);
    root.style.setProperty("--pointer-y", `${(ny * 100).toFixed(1)}%`);
    root.style.setProperty("--rotate-y", `${((nx - .5) * 2.6).toFixed(2)}deg`);
    root.style.setProperty("--rotate-x", `${((.5 - ny) * 1.7).toFixed(2)}deg`);
  }, [reducedMotion]);

  const resetPointer = () => {
    setHovered(false);
    rootRef.current?.style.setProperty("--rotate-y", "0deg");
    rootRef.current?.style.setProperty("--rotate-x", "0deg");
  };

  const active = AREAS[focus];
  const vars = {
    "--focus-x": `${active.x}%`,
    "--focus-y": `${active.y}%`,
  } as CSSProperties;

  return (
    <div className={styles.outer} data-variant={variant}>
      <div
        className={styles.artwork}
        ref={rootRef}
        data-active={focus}
        data-motion={visible && !reducedMotion ? "on" : "off"}
        data-hovered={hovered ? "true" : undefined}
        style={vars}
        onPointerMove={updatePointer}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={resetPointer}
        aria-label="MyPepProtocol promotional illustration, with animated highlights on the phone, syringe, laboratory vial and timeline. All values are illustrative."
        role="img"
      >
        <div className={styles.plane}>
          <Image
            className={styles.image}
            src="/projects/mypepprotocol/concept-artwork.png"
            alt=""
            fill
            sizes={variant === "home" ? "(max-width: 640px) calc(100vw - 48px), (max-width: 1244px) 54vw, 630px" : "(max-width: 760px) calc(100vw - 48px), 720px"}
            priority={false}
          />
          <span className={styles.lightSweep} aria-hidden="true" />
          <span className={styles.phoneGlow} aria-hidden="true" />
          <span className={styles.vialGlow} aria-hidden="true" />
          <span className={styles.traceGlow} aria-hidden="true" />
          <span className={styles.focusGlow} aria-hidden="true" />
          <span className={styles.pointerLight} aria-hidden="true" />
          <span className={styles.shimmer} aria-hidden="true" />
        </div>
      </div>
      {variant === "feature" && (
        <div className={styles.toolbar}>
          <div className={styles.selector} role="group" aria-label="Highlight an illustrated product area">
            {(["overview", "doses", "labs", "timeline"] as Focus[]).map((area) => (
              <button
                type="button"
                className={styles.focusButton}
                key={area}
                aria-pressed={focus === area}
                onClick={() => setFocus(area)}
              >
                {AREAS[area].label}
              </button>
            ))}
          </div>
          <span className={styles.caption}>Animated promotional concept · Illustrative data</span>
        </div>
      )}
    </div>
  );
}
