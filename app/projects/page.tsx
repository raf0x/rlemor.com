import type { Metadata } from "next";
import Link from "next/link";
import ScreenshotViewer from "@/components/ScreenshotViewer";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import styles from "./projects.module.css";

const description =
  "Independent projects by Rafael Lemor: Lighthouse account intelligence, MyPepProtocol, and World Cup Tracker. Real problems, product decisions, and working products.";

export const metadata: Metadata = {
  title: "Projects | Rafael Lemor",
  description,
  alternates: {
    canonical: "/projects",
  },
  openGraph: {
    title: "Projects | Rafael Lemor",
    description,
    url: "/projects",
    siteName: "Rafael Lemor",
    locale: "en_US",
    type: "website",
    images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/opengraph-image"],
    title: "Projects | Rafael Lemor",
    description,
  },
};

export default function ProjectsPage() {
  return (
    <>
      <SiteHeader />

      <main className={styles.page} id="main-content" tabIndex={-1}>
        <section className={styles.intro}>
          <p className={styles.eyebrow}>Independent projects</p>
          <h1>Curiosity, put to work.</h1>
          <p>
            My work with customers makes me curious about the systems behind
            their experience. These independent, AI-assisted projects give that
            curiosity somewhere practical to go: from the first question to a
            working product.
          </p>
        </section>

        <section
          className={styles.project}
          id="lighthouse"
        >
          <p className={styles.label}>Customer Success / Account intelligence</p>

          <div className={styles.projectContent}>
            <h2>Lighthouse</h2>

            <div className={styles.copy}>
              <p>
                Lighthouse is an account-intelligence product built around a
                problem I knew firsthand from Customer Success:
                understanding which accounts need attention, why they need it,
                and what to do next.
              </p>

              <p>
                It brings portfolio health, renewal risk, account context, and
                AI-assisted executive briefs into one focused workspace. The
                product explores how AI can turn scattered customer signals into
                clearer priorities without replacing the judgment of the person
                managing the relationship.
              </p>
            </div>

            <div className={styles.projectMedia}>
              <ScreenshotViewer
                title="Lighthouse"
                src="/projects/lighthouse/concept-artwork.webp"
                alt="Promotional Lighthouse concept illustration of an account-health dashboard with renewal risk, AI executive briefs, and a coastal lighthouse."
                width={1672}
                height={941}
                mediaType="artwork"
                caption="Concept illustration with fictional dashboard data, not a screenshot of the actual application."
              />
              <a
                className={styles.textLink}
                href="/projects/lighthouse/overview-desktop.webp"
                target="_blank"
                rel="noreferrer"
              >
                View actual Lighthouse dashboard <span aria-hidden="true">&rarr;</span>
              </a>
            </div>

            <div className={styles.actions}>
              <a
                className={styles.primaryAction}
                href="https://lighthouse-alpha-two.vercel.app/"
                target="_blank"
                rel="noreferrer"
              >
                View demo
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

        <section
          className={styles.project}
          id="mypepprotocol"
        >
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

            <div className={styles.projectMedia}>
              <ScreenshotViewer
                title="MyPepProtocol"
                src="/projects/mypepprotocol/concept-artwork.png"
                alt="MyPepProtocol promotional concept with a rendered phone, syringe, vial, and mock protocol, lab, and schedule widgets."
                width={1672}
                height={941}
                mediaType="artwork"
                caption="Concept artwork for MyPepProtocol. See the case study for authentic product screens and decisions."
              />
            </div>

            <p className={styles.statement}>
              MyPepProtocol is the clearest example of how I approach product
              decisions, tradeoffs, and execution around a real, complex problem.
            </p>

            <div className={styles.actions}>
              <Link className={styles.primaryAction} href="/projects/mypepprotocol">
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
          className={styles.project}
          id="world-cup-tracker"
        >
          <p className={styles.label}>Independent sports project</p>

          <div className={styles.projectContent}>
            <h2>World Cup Tracker</h2>

            <div className={styles.copy}>
              <p>
                World Cup Tracker was built to make the expanded 48-team 2026
                World Cup easier to navigate. It brings the full 104-match
                schedule, group standings, knockout bracket, filters, and
                prediction logic into a single interface designed to make a
                complex tournament structure easier to follow.
              </p>

              <p>
                With the tournament complete, it now serves as a historical
                reference rather than a live-event tool.
              </p>
            </div>

            <div className={styles.projectDecision}>
              <p className={styles.label}>A decision behind the product</p>
              <h3>Make qualification rules visible, not just the bracket.</h3>
              <p>
                With 12 groups, the eight best third-place finishers also move
                into the knockout stage. That means a projected matchup can
                depend on results across other groups. I built the standings
                and bracket logic to apply head-to-head tiebreakers and the
                third-place assignment rules, while keeping outcomes
                provisional until the relevant results were settled.
              </p>
            </div>

            <div className={styles.projectMedia}>
              <ScreenshotViewer
                title="World Cup Tracker"
                src="/projects/world-cup-tracker/concept-artwork.webp"
                alt="World Cup Tracker concept illustration with a mobile tournament interface, match schedule, standings, and knockout bracket in a football stadium."
                width={1672}
                height={941}
                mediaType="artwork"
                caption="Promotional concept only; fixtures are illustrative, not live results. Independent, unofficial project not affiliated with or endorsed by FIFA."
              />
              <div className={styles.actualMedia}>
                <ScreenshotViewer
                  title="World Cup Tracker historical tournament interface"
                  src="/projects/world-cup-tracker/world-cup-overview-desktop.png"
                  alt="Actual historical World Cup Tracker interface showing tournament groups, fixtures, and knockout progression."
                  width={1122}
                  height={1402}
                  sizes="(max-width: 760px) calc(100vw - 48px), 520px"
                  caption="Actual interface captured during the completed 2026 tournament. Historical view, not live scores. Independent project, not affiliated with FIFA. Enlarge to inspect."
                />
              </div>
            </div>

            <div className={styles.actions}>
              <a
                className={styles.textLink}
                href="https://fifa-world-cup-predictor-jet.vercel.app/"
                target="_blank"
                rel="noreferrer"
              >
                View Project <span aria-hidden="true">&rarr;</span>
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

        <section className={styles.careerLink} aria-label="Professional experience">
          <h2>The experience behind the projects.</h2>
          <Link className={styles.textLink} href="/work">
            Explore my professional work <span aria-hidden="true">&rarr;</span>
          </Link>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
