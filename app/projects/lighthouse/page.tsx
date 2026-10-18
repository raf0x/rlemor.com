import type { Metadata } from "next";
import Link from "next/link";
import ScreenshotViewer from "@/components/ScreenshotViewer";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import styles from "./case-study.module.css";

const description =
  "How Rafael Lemor built Lighthouse, an independent Customer Success account-intelligence demo, to make portfolio signals easier to inspect and act on.";

export const metadata: Metadata = {
  title: "Lighthouse Case Study | Rafael Lemor",
  description,
  alternates: { canonical: "/projects/lighthouse" },
  openGraph: {
    title: "Lighthouse Case Study | Rafael Lemor",
    description,
    url: "/projects/lighthouse",
    siteName: "Rafael Lemor",
    locale: "en_US",
    type: "website",
    images: [{
      url: "/opengraph-image",
      width: 1200,
      height: 630,
      alt: "Rafael Lemor. Customer Success, global events, independent products.",
    }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Lighthouse Case Study | Rafael Lemor",
    description,
    images: [{
      url: "/opengraph-image",
      alt: "Rafael Lemor. Customer Success, global events, independent products.",
    }],
  },
};

export default function LighthouseCaseStudy() {
  return (
    <>
      <SiteHeader />

      <main className={styles.page} id="main-content" tabIndex={-1}>
        <article>
          <header className={styles.intro}>
            <p className={styles.eyebrow}>Lighthouse / Independent product</p>
            <h1>Making customer signals easier to act on.</h1>
            <div className={styles.lead}>
              <p>
                In Customer Success, knowing an account needs attention is only
                the beginning. The harder question is which signals matter,
                what they mean together, and where to focus next.
              </p>
              <p>
                I built Lighthouse to explore that problem in a working
                account-intelligence application. It brings account context,
                portfolio health, renewal exposure, and AI-assisted briefings
                into one place, without pretending a score can manage a
                relationship.
              </p>
            </div>
            <p className={styles.status}>
              Independent working demo · Fictional account data · No production CRM integration
            </p>
          </header>

          <div className={styles.heroMedia}>
            <ScreenshotViewer
              title="Lighthouse actual account dashboard"
              src="/projects/lighthouse/overview-desktop.webp"
              alt="Actual Lighthouse account dashboard interface with illustrative customer health and portfolio information."
              width={2880}
              height={2000}
              sizes="(max-width: 760px) calc(100vw - 48px), (max-width: 1200px) 80vw, 900px"
              caption="Actual Lighthouse interface with fictional account data. Enlarge to inspect the product."
            />
          </div>

          <section className={styles.section} aria-labelledby="problem">
            <p className={styles.sectionLabel}>The problem</p>
            <div className={styles.sectionBody}>
              <h2 id="problem">A portfolio is more than a list of accounts.</h2>
              <p>
                Customer information can sit across usage trends, support
                activity, renewal dates, satisfaction measures, and notes from
                individual conversations. Looking at one number at a time makes
                it easy to miss the bigger picture.
              </p>
              <p>
                The product question was straightforward: could I create a
                workspace that helps someone identify where to look first,
                understand why, and prepare a better conversation?
              </p>
            </div>
          </section>

          <section className={styles.section} aria-labelledby="decisions">
            <p className={styles.sectionLabel}>Product decisions</p>
            <div className={styles.sectionBody}>
              <h2 id="decisions">Three choices that shaped Lighthouse.</h2>
              <div className={styles.decisions}>
                <div className={styles.decision}>
                  <span className={styles.number}>01</span>
                  <div>
                    <h3>Start with the portfolio, not the AI.</h3>
                    <p>
                      A Customer Success manager needs to see where attention
                      may be warranted before asking for an analysis. The
                      Portfolio view brings account health, ARR, renewal dates,
                      and usage changes into a comparable list, with sorting
                      and clear overdue states.
                    </p>
                  </div>
                </div>
                <div className={styles.decision}>
                  <span className={styles.number}>02</span>
                  <div>
                    <h3>Make the signal inspectable.</h3>
                    <p>
                      A health indicator can help prioritize, but it is not a
                      prediction of churn or a substitute for knowing the
                      customer. The Accounts view keeps the underlying usage,
                      support, and satisfaction context close to the score so
                      the person managing the relationship can investigate.
                    </p>
                  </div>
                </div>
                <div className={styles.decision}>
                  <span className={styles.number}>03</span>
                  <div>
                    <h3>Let AI prepare, not decide.</h3>
                    <p>
                      Lighthouse can generate account analyses, possible
                      expansion plays, executive briefings, and draft outreach.
                      These are starting points for human review, not verified
                      forecasts or automated account decisions. When live AI
                      is unavailable, the interface identifies its demo
                      fallback rather than presenting it as a real response.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className={styles.section} aria-labelledby="boundaries">
            <p className={styles.sectionLabel}>Tradeoffs</p>
            <div className={styles.sectionBody}>
              <h2 id="boundaries">Useful signals, explicit limits.</h2>
              <p>
                The dataset is fictional and small. The health score is a
                rule-based demonstration, not a calibrated risk model.
                Lighthouse is not connected to an employer&apos;s CRM, and it
                has not established measured adoption, retention improvements,
                or commercial outcomes.
              </p>
              <p>
                AI-generated recommendations may contain uncertain claims.
                The interface identifies generated versus fallback output,
                but every suggested action and future outcome still needs
                a person to check the evidence and apply account context.
              </p>
            </div>
          </section>

          <section className={styles.section} aria-labelledby="status">
            <p className={styles.sectionLabel}>Current status</p>
            <div className={styles.sectionBody}>
              <h2 id="status">A working demonstration, not a finished platform.</h2>
              <p>
                Lighthouse has working Accounts and Portfolio views,
                responsive light and dark themes, and optional AI-assisted
                analysis. The next meaningful test is not adding more
                features. It is learning whether these views help real
                Customer Success professionals identify priorities and
                prepare better conversations.
              </p>
              <div className={styles.actions}>
                <a
                  className={styles.primaryAction}
                  href="https://lighthouse-alpha-two.vercel.app/"
                  target="_blank"
                  rel="noreferrer"
                >
                  Explore Lighthouse demo
                </a>
                <a
                  className={styles.textLink}
                  href="https://github.com/raf0x/lighthouse"
                  target="_blank"
                  rel="noreferrer"
                >
                  View repository <span aria-hidden="true">↗</span>
                </a>
                <Link className={styles.textLink} href="/projects">
                  Back to Projects
                </Link>
              </div>
            </div>
          </section>
        </article>
      </main>

      <SiteFooter />
    </>
  );
}
