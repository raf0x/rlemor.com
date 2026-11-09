"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import styles from "./lighthouse-live-preview.module.css";

type Props = {
  variant?: "compact" | "feature";
};

const EMBED_URL = "https://lighthouse-alpha-two.vercel.app/live?embed=1";
const SOURCE_WIDTH = 1280;
const SOURCE_HEIGHT = 880;

/**
 * A scaled, read-only window onto the actual Lighthouse app.
 * Deliberately does not reimplement or fake its continuously running simulation.
 */
export default function LighthouseLivePreview({ variant = "compact" }: Props) {
  const frameRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const element = frameRef.current;
    if (!element) return;

    const observer = new ResizeObserver(([entry]) => {
      setWidth(entry.contentRect.width);
    });
    observer.observe(element);
    setWidth(element.getBoundingClientRect().width);
    return () => observer.disconnect();
  }, []);

  const scale = width > 0 ? width / SOURCE_WIDTH : 0;
  return (
    <div className={styles.root} data-variant={variant}>
      <div ref={frameRef} className={styles.viewport}>
        <Image
          className={styles.poster}
          src="/projects/lighthouse/overview-desktop.webp"
          alt=""
          width={2880}
          height={2000}
          aria-hidden="true"
          sizes="(max-width: 640px) 100vw, (max-width: 1200px) 70vw, 900px"
        />
        {width > 0 && (
          <iframe
            className={styles.frame}
            src={EMBED_URL}
            title="Animated Lighthouse intelligence dashboard, fictional account data"
            loading="lazy"
            tabIndex={-1}
            aria-hidden="true"
            referrerPolicy="strict-origin-when-cross-origin"
            onLoad={() => setLoaded(true)}
            style={{
              width: SOURCE_WIDTH,
              height: SOURCE_HEIGHT,
              transform: `scale(${scale})`,
              opacity: loaded ? 1 : 0,
            }}
          />
        )}
        <div className={styles.corner} aria-hidden="true">
          <span className={styles.dot} />
          LIVE PREVIEW
        </div>
      </div>
      <p className={styles.caption}>
        Animated preview of the working Lighthouse demo. Fictional accounts and
        simulated activity.
      </p>
    </div>
  );
}
