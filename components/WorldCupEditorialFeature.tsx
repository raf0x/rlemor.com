import Image from "next/image";
import Link from "next/link";
import base from "@/app/page.module.css";
import styles from "./homepage-editorial.module.css";

export default function WorldCupEditorialFeature() {
  return (
    <article
      className={`${base.motionItem} ${styles.feature} ${styles.worldCup}`}
      aria-labelledby="world-cup-home-title"
      data-motion-item
    >
      <div className={styles.content} data-mobile-motion-item>
        <span className={styles.eyebrow}>Independent tournament project</span>
        <h3 id="world-cup-home-title" className={styles.title}>
          <Link href="/projects#world-cup-tracker">World Cup Tracker</Link>
        </h3>
        <p className={styles.statement}>A tournament view of the road to the final.</p>
        <div className={styles.details}>
          <div>
            <h4>The idea</h4>
            <p>
              Make the 48-team World Cup easier to navigate, from group
              standings and fixtures to the final bracket.
            </p>
          </div>
          <div>
            <h4>The build</h4>
            <p>
              An independent tracker and predictor with a complete match
              schedule and knockout logic, now a historical reference.
            </p>
          </div>
        </div>
        <div className={styles.actions}>
          <a
            className={styles.primary}
            href="https://fifa-world-cup-predictor-jet.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
          >
            View project <span aria-hidden="true">↗</span>
          </a>
          <Link className={styles.secondary} href="/projects#world-cup-tracker">
            Project details <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
      <figure className={styles.visual} data-mobile-motion-item>
        <div className={styles.halo} aria-hidden="true" />
        <Link
          className={styles.screenLink}
          href="/projects#world-cup-tracker"
          aria-label="Explore the World Cup Tracker historical tournament interface"
        >
          <div className={styles.screen}>
            <Image
              src="/projects/world-cup-tracker/world-cup-overview-desktop.png"
              alt="Actual World Cup Tracker interface showing the 2026 tournament overview and knockout progression."
              width={1122}
              height={1402}
              sizes="(max-width: 640px) calc(100vw - 84px), (max-width: 1000px) 730px, 600px"
            />
          </div>
        </Link>
        <div className={styles.laptopBase} aria-hidden="true" />
        <figcaption className={styles.visualCaption}>
          Actual historical interface capture. Independent project, not affiliated with FIFA.
        </figcaption>
      </figure>
      <footer className={styles.meta} aria-label="World Cup Tracker project details">
        <span><small>Product</small>Tournament tracker &amp; predictor</span>
        <span><small>Platform</small>Web</span>
        <span><small>Scope</small>World Cup 2026 · Historical</span>
      </footer>
    </article>
  );
}
