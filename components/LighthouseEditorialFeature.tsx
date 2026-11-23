import Link from "next/link";
import LighthouseLivePreview from "./LighthouseLivePreview";
import base from "@/app/page.module.css";
import styles from "./homepage-editorial.module.css";

/**
 * The actual Lighthouse app remains an animated, read-only iframe.
 * The editorial frame is homepage-only and never substitutes generated UI.
 */
export default function LighthouseEditorialFeature() {
  return (
    <article
      className={`${base.lighthouse} ${base.motionItem} ${styles.feature} ${styles.lighthouse}`}
      aria-labelledby="lighthouse-home-title"
      data-motion-item
      data-gsap-lighthouse
    >
      <div className={styles.content} data-mobile-motion-item>
        <span className={styles.eyebrow}>Account intelligence</span>
        <h3 id="lighthouse-home-title" className={styles.title}>
          <Link href="/projects/lighthouse">Lighthouse</Link>
        </h3>
        <p className={styles.statement}>Customer account intelligence, made visible.</p>
        <div className={styles.details} data-lighthouse-support>
          <div>
            <h4>The idea</h4>
            <p>
              Bring account health, renewal risk, and customer context into one
              place, so teams can see what needs attention.
            </p>
          </div>
          <div>
            <h4>The build</h4>
            <p>
              An AI-assisted workspace that connects signals, prioritizes
              action, and produces executive briefs for Customer Success.
            </p>
          </div>
        </div>
        <div className={styles.actions} data-lighthouse-support>
          <Link className={styles.primary} href="/projects/lighthouse">
            Explore project <span aria-hidden="true">→</span>
          </Link>
          <a
            className={styles.secondary}
            href="https://lighthouse-alpha-two.vercel.app/live"
            target="_blank"
            rel="noopener noreferrer"
          >
            View live demo <span aria-hidden="true">↗</span>
          </a>
        </div>
      </div>
      <div className={styles.visual}>
        <div className={styles.halo} aria-hidden="true" />
        <div className={`${base.lighthouseStage} ${styles.lighthouseStage}`} data-gsap-lighthouse-stage>
          <Link
            className={`${base.lighthouseImageLink} ${styles.lighthouseFrame} motion-cinematic-scene`}
            data-mobile-motion-item
            href="/projects/lighthouse"
            aria-label="Explore Lighthouse and its animated customer intelligence dashboard"
          >
            <LighthouseLivePreview />
          </Link>
          <div className={base.lighthouseCurtain} data-gsap-lighthouse-curtain aria-hidden="true">
            <span>01 / SELECTED WORK</span>
            <span>LIGHTHOUSE</span>
          </div>
          <div className={base.lighthouseStageCaption} data-gsap-lighthouse-caption aria-hidden="true">
            <span>ACCOUNT INTELLIGENCE</span>
            <span>↗</span>
          </div>
        </div>
        <p className={styles.visualCaption}>
          Animated view of the working dashboard. Fictional accounts and simulated activity.
        </p>
      </div>
      <footer className={styles.meta} aria-label="Lighthouse project details">
        <span><small>Product</small>Customer intelligence</span>
        <span><small>Platform</small>Web</span>
        <span><small>Stage</small>Live prototype</span>
      </footer>
    </article>
  );
}
