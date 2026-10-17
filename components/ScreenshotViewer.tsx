"use client";

import Image from "next/image";
import { useEffect, useId, useRef, useState } from "react";
import styles from "./screenshot-viewer.module.css";

type ScreenshotViewerProps = {
  src: string;
  alt: string;
  title: string;
  width: number;
  height: number;
  expandedWidth?: number;
  caption?: string;
  sizes?: string;
  mediaType?: "screenshot" | "artwork";
};

export default function ScreenshotViewer({
  src,
  alt,
  title,
  width,
  height,
  expandedWidth = width,
  caption,
  sizes = "(max-width: 640px) calc(100vw - 48px), (max-width: 760px) calc(100vw - 64px), (max-width: 942px) calc(100vw - 222px), 720px",
  mediaType = "screenshot",
}: ScreenshotViewerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();
  const instructionId = useId();

  useEffect(() => {
    if (!isOpen) return;

    const dialog = dialogRef.current;
    if (!dialog) return;

    dialog.showModal();
    const trigger = triggerRef.current;
    const previousOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";

    return () => {
      if (dialog.open) dialog.close();
      document.documentElement.style.overflow = previousOverflow;
      trigger?.focus({ preventScroll: true });
    };
  }, [isOpen]);

  return (
    <figure className={styles.figure}>
      <button
        ref={triggerRef}
        type="button"
        className={styles.trigger}
        onClick={() => setIsOpen(true)}
        aria-label={`Enlarge ${title} ${mediaType}`}
        aria-haspopup="dialog"
      >
        <Image
          className={styles.preview}
          src={src}
          alt={alt}
          width={width}
          height={height}
          sizes={sizes}
        />
        <span className={styles.enlarge} aria-hidden="true">
          Enlarge {mediaType} <span>↗</span>
        </span>
      </button>
      {caption && <figcaption className={styles.caption}>{caption}</figcaption>}

      <dialog
        ref={dialogRef}
        className={styles.dialog}
        aria-labelledby={titleId}
        aria-describedby={instructionId}
        onClose={() => setIsOpen(false)}
      >
        <div className={styles.dialogHeader}>
          <h2 id={titleId}>{title}</h2>
          <button
            type="button"
            className={styles.close}
            onClick={() => dialogRef.current?.close()}
          >
            Close <span aria-hidden="true">×</span>
          </button>
        </div>
        <p className={styles.instructions} id={instructionId}>
          Scroll to explore the {mediaType}. Press Escape or Close to return.
        </p>
        {isOpen && (
          <div
            className={styles.imageScroll}
            tabIndex={0}
            role="region"
            aria-label={`${title} full-size ${mediaType}`}
          >
            <Image
              className={styles.expanded}
              src={src}
              alt={alt}
              width={width}
              height={height}
              style={{ width: expandedWidth, maxWidth: "none" }}
              unoptimized
            />
          </div>
        )}
      </dialog>
    </figure>
  );
}
