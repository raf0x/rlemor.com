import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import styles from "./work.module.css";

const description =
  "Selected product work by Rafael Lemor, including MyPepProtocol, World Cup Tracker, and Lighthouse.";

export const metadata: Metadata = {
  title: "Work | Rafael Lemor",
  description,
  alternates: {
    canonical: "/work",
  },
  openGraph: {
    title: "Work | Rafael Lemor",
    description,
    url: "/work",
    siteName: "Rafael Lemor",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Work | Rafael Lemor",
    description,
  },
};

export default function WorkPage() {
  return (
    <>
      <SiteHeader />

      <main className={styles.page}>
        <section className={styles.intro}>
          <h1>Work</h1>
          <p>
            These are a few products I have built while learning how to turn
            real problems and ideas into working software. The emphasis is on
            the problem, the decisions, and what shipped, not the technology for
            its own sake.
          </p>
        </section>

        <section className={`${styles.project} ${styles.primaryProject}`}>
          <p className={styles.label}>Health tracking and intelligence</p>

          <div className={styles.projectContent}>
            <h2>MyPepProtocol</h2>

            <div className={styles.copy}>
              <p>
                MyPepProtocol is a private health product for people managing
                complex protocols. I built it to reduce the manual work of
                keeping treatments, schedules, inventory, labs, and other health
                records coherent over time.
              </p>

              <p>
                A core product principle is simple: record information once,
                then reuse it where it is relevant. That idea has shaped
                decisions across protocol setup, inventory workflows,
                longitudinal health data, and AI-assisted analysis.
              </p>
            </div>

            <div className={`${styles.projectMedia} ${styles.portraitMedia}`}>
              <Image
                className={styles.projectImage}
                src="/projects/mypepprotocol/showcase.webp"
                alt="MyPepProtocol dashboard showing summary metrics, active protocols, and active compound details."
                width={640}
                height={800}
                sizes="(max-width: 760px) calc(100vw - 48px), 600px"
              />
            </div>

            <p className={styles.statement}>
              This is the project where my product judgment and execution are
              most developed.
            </p>

            <div className={styles.actions}>
              <Link className={styles.primaryAction} href="/work/mypepprotocol">
                Read case study
              </Link>

              <a
                className={styles.textLink}
                href="https://www.mypepprotocol.app/"
                target="_blank"
                rel="noreferrer"
              >
                Visit MyPepProtocol <span aria-hidden="true">&rarr;</span>
              </a>
            </div>
          </div>
        </section>

        <section
          className={`${styles.project} ${styles.secondaryProject}`}
          id="world-cup-tracker"
        >
          <p className={styles.label}>Independent sports project</p>

          <div className={styles.projectContent}>
            <h2>World Cup Tracker</h2>

            <div className={styles.copy}>
              <p>
                I built World Cup Tracker to make the expanded 48-team 2026
                World Cup easier to understand and follow in one place. It
                brings the tournament&apos;s 104-match schedule, group
                standings, knockout bracket, and prediction logic into a single
                interface.
              </p>

              <p>
                With the tournament complete, it now serves as a historical
                reference rather than a live-event tool.
              </p>
            </div>

            <div className={`${styles.projectMedia} ${styles.portraitMedia}`}>
              <Image
                className={styles.projectImage}
                src="/projects/world-cup-tracker/showcase.webp"
                alt="World Cup Tracker overview showing tournament stats, the Road to the Final bracket, and group-stage standings."
                width={600}
                height={750}
                sizes="(max-width: 760px) calc(100vw - 48px), 600px"
              />
            </div>

            <p className={styles.disclosure}>
              Independent project. Not affiliated with or endorsed by FIFA.
            </p>

            <div className={styles.actions}>
              <a
                className={styles.textLink}
                href="https://fifa-world-cup-predictor-jet.vercel.app/"
                target="_blank"
                rel="noreferrer"
              >
                View live project <span aria-hidden="true">&rarr;</span>
              </a>
              <a
                className={styles.textLink}
                href="https://github.com/raf0x/FIFA-World-Cup-Predictor"
                target="_blank"
                rel="noreferrer"
              >
                GitHub <span aria-hidden="true">&rarr;</span>
              </a>
            </div>
          </div>
        </section>

        <section className={`${styles.project} ${styles.compactProject}`}>
          <p className={styles.label}>Customer Success experiment</p>

          <div className={styles.projectContent}>
            <h2>Lighthouse</h2>

            <div className={styles.copy}>
              <p>
                Lighthouse explores a simple question: can an account dashboard
                help explain what deserves attention instead of only displaying
                more data?
              </p>

              <p>
                The project combines account-health signals, a portfolio view,
                and AI-generated executive briefs. I built it as an early
                portfolio experiment in a domain I already knew well. It remains
                intentionally smaller and less mature than the projects above.
              </p>
            </div>

            <div className={`${styles.projectMedia} ${styles.landscapeMedia}`}>
              <Image
                className={styles.projectImage}
                src="/projects/lighthouse/showcase.webp"
                alt="Lighthouse account intelligence dashboard showing portfolio health, renewal risk, account metrics, and AI analysis tools."
                width={800}
                height={600}
                sizes="(max-width: 760px) calc(100vw - 48px), 800px"
              />
            </div>

            <div className={styles.actions}>
              <a
                className={styles.textLink}
                href="https://lighthouse-alpha-two.vercel.app/"
                target="_blank"
                rel="noreferrer"
              >
                View demo <span aria-hidden="true">&rarr;</span>
              </a>
              <a
                className={styles.textLink}
                href="https://github.com/raf0x/lighthouse"
                target="_blank"
                rel="noreferrer"
              >
                GitHub <span aria-hidden="true">&rarr;</span>
              </a>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
