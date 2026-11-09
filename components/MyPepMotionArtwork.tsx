"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import type { PointerEvent } from "react";
import styles from "./mypep-motion-artwork.module.css";

type Props = { variant?: "home" | "feature" };

/**
 * The original promotional composition, animated as a layered scene.
 * Elements move on their own. Nothing requires clicks to come alive.
 * The illustrated screen values remain fictional promotional content.
 */
export default function MyPepMotionArtwork({ variant = "feature" }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(true);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (!("IntersectionObserver" in window)) {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.04, rootMargin: "80px" }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const onPointerMove = useCallback((event: PointerEvent<HTMLDivElement>) => {
    if (reducedMotion || event.pointerType === "touch") return;
    const node = ref.current;
    if (!node) return;
    const bounds = node.getBoundingClientRect();
    const x = event.clientX / 1 - bounds.left;
    const y = event.clientY / 1 - bounds.top;
    const dx = x / bounds.width - 0.5;
    const dy = y / bounds.height - 0.5;
    node.style.setProperty("--parallax-x", `${(dx * 8).toFixed(2)}px`);
    node.style.setProperty("--parallax-y", `${(dy * 5).toFixed(2)}px`);
    node.style.setProperty("--tilt-x", `${(-dy * 1.6).toFixed(2)}deg`);
    node.style.setProperty("--tilt-y", `${(dx * 2.1).toFixed(2)}deg`);
  }, [reducedMotion]);

  const resetPointer = () => {
    const node = ref.current;
    if (!node) return;
    node.style.setProperty("--parallax-x", "0px");
    node.style.setProperty("--parallax-y", "0px");
    node.style.setProperty("--tilt-x", "0deg");
    node.style.setProperty("--tilt-y", "0deg");
  };

  return (
    <div className={styles.outer} data-variant={variant}>
      <div
        ref={ref}
        className={styles.scene}
        data-motion={visible && !reducedMotion ? "on" : "off"}
        onPointerMove={onPointerMove}
        onPointerLeave={resetPointer}
      >
        <Image
          className={styles.base}
          src="/projects/mypepprotocol/concept-artwork.png"
          alt="MyPepProtocol promotional concept showing a mobile dashboard, syringe, vial, animated charts, and floating schedule and lab timeline panels. Figures are illustrative."
          fill
          sizes={variant === "home"
            ? "(max-width: 640px) calc(100vw - 48px), (max-width: 1244px) 54vw, 630px"
            : "(max-width: 760px) calc(100vw - 48px), 720px"}
        />
        <div className={styles.camera} aria-hidden="true">
          <span className={styles.bokehOne} />
          <span className={styles.bokehTwo} />
          <span className={styles.bokehThree} />

          <span className={`${styles.underlay} ${styles.phoneMask}`} />
          <span className={`${styles.underlay} ${styles.syringeMask}`} />
          <span className={`${styles.underlay} ${styles.vialMask}`} />
          <span className={`${styles.underlay} ${styles.scheduleMask}`} />
          <span className={`${styles.underlay} ${styles.timelineMask}`} />

          <span className={`${styles.object} ${styles.phone} ${styles.phoneMask}`} />
          <span className={`${styles.object} ${styles.syringe} ${styles.syringeMask}`} />
          <span className={`${styles.object} ${styles.vial} ${styles.vialMask}`} />
          <span className={`${styles.object} ${styles.schedule} ${styles.scheduleMask}`} />
          <span className={`${styles.object} ${styles.timeline} ${styles.timelineMask}`} />

          <svg className={styles.signalPaths} viewBox="0 0 1672 941" preserveAspectRatio="none">
            <defs>
              <linearGradient id="mypep-path-purple" x1="0" y1="0" x2="1" y2="0">
                <stop stopColor="#a83afc" stopOpacity="0" />
                <stop offset=".5" stopColor="#be65ff" stopOpacity=".88" />
                <stop offset="1" stopColor="#8a38ff" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="mypep-path-green" x1="0" y1="0" x2="1" y2="0">
                <stop stopColor="#0affb1" stopOpacity="0" />
                <stop offset=".5" stopColor="#18ffa4" stopOpacity=".78" />
                <stop offset="1" stopColor="#03df9e" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="mypep-path-cyan" x1="0" y1="0" x2="1" y2="0">
                <stop stopColor="#10baf8" stopOpacity="0" />
                <stop offset=".5" stopColor="#17edff" stopOpacity=".74" />
                <stop offset="1" stopColor="#12caff" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path className={styles.signalPurple} d="M890 406 C1000 390 1050 445 1120 479 S1330 573 1450 497 S1590 364 1675 365" />
            <path className={styles.signalGreen} d="M897 447 C1023 402 1068 517 1194 550 S1422 545 1520 471 S1626 436 1675 420" />
            <path className={styles.signalCyan} d="M930 491 C1051 463 1118 583 1230 606 S1461 603 1550 560 S1626 507 1675 494" />
            <circle className={styles.dataParticle} r="6" fill="#a66aff">
              <animateMotion dur="5.6s" repeatCount="indefinite" path="M890 406 C1000 390 1050 445 1120 479 S1330 573 1450 497 S1590 364 1675 365" />
            </circle>
            <circle className={styles.dataParticle} r="5" fill="#28efb0">
              <animateMotion dur="6.7s" repeatCount="indefinite" path="M897 447 C1023 402 1068 517 1194 550 S1422 545 1520 471 S1626 436 1675 420" />
            </circle>
          </svg>

          <span className={styles.sparkOne} />
          <span className={styles.sparkTwo} />
          <span className={styles.sparkThree} />
          <span className={styles.sparkFour} />
        </div>
      </div>
      {variant === "feature" && (
        <p className={styles.caption}>
          Motion study of MyPepProtocol promotional artwork. Illustrative interface and data.
        </p>
      )}
    </div>
  );
}
