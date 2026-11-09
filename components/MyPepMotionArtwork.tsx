"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import styles from "./mypep-motion-artwork.module.css";

type Props = { variant?: "home" | "feature" };

/**
 * Move the original illustration as one continuous composition.
 * The ambient effects add depth without separating or duplicating objects.
 */
export default function MyPepMotionArtwork({ variant = "feature" }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(true);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    if (!("IntersectionObserver" in window)) {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.04, rootMargin: "80px" },
    );
    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  return (
    <div className={styles.outer} data-variant={variant}>
      <div
        ref={ref}
        className={styles.scene}
        data-motion={visible && !reducedMotion ? "on" : "off"}
      >
        <div className={styles.composition}>
          <Image
            className={styles.image}
            src="/projects/mypepprotocol/concept-artwork.png"
            alt="MyPepProtocol promotional artwork showing a phone, syringe, vial, and floating health dashboard panels. Values are illustrative."
            fill
            sizes={variant === "home"
              ? "(max-width: 640px) calc(100vw - 48px), (max-width: 1244px) 54vw, 630px"
              : "(max-width: 760px) calc(100vw - 48px), 720px"}
          />
          <span className={styles.cyanAtmosphere} aria-hidden="true" />
          <span className={styles.violetAtmosphere} aria-hidden="true" />
          <span className={styles.lightPass} aria-hidden="true" />
        </div>
      </div>
      {variant === "feature" && (
        <p className={styles.caption}>
          Animated promotional artwork. Product screens and values shown here are illustrative.
        </p>
      )}
    </div>
  );
}
