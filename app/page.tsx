import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import styles from "./page.module.css";

export default function Home() {
  return (
    <>
      <SiteHeader />

      <main className={styles.page}>
        <section className={styles.hero}>
          <p className={styles.eyebrow}>Operations / Customer experience</p>

          <h1>Operations, customers, and useful products.</h1>

          <p className={styles.heroCopy}>
            I’m Rafael Lemor. My background spans global ticketing operations,
            customer success and account management. Today, I also turn ideas
            into working products with AI and modern tools.
          </p>

          <div className={styles.heroActions}>
            <a className={styles.primaryAction} href="#work">
              View selected work
            </a>
            <a className={styles.textLink} href="#contact">
              Get in touch
            </a>
          </div>
        </section>

        <section className={styles.labeledSection}>
          <p className={styles.sectionLabel}>Experience</p>

          <div className={styles.sectionContent}>
            <h2>Experience at a global scale.</h2>

            <div className={styles.experienceList}>
              <article className={styles.experienceRow}>
                <h3>FIFA / Global Ticketing Operations</h3>
                <p>
                  Managed ticketing operations for 30+ commercial partners
                  across four global tournaments, culminating in the 2026 FIFA
                  World Cup.
                </p>
              </article>

              <article className={styles.experienceRow}>
                <h3>Commercial Partnerships</h3>
                <p>
                  Owned day-to-day ticketing relationships with major partners
                  including Coca-Cola and Bank of America, spanning allocations,
                  contracts, distribution, payments, escalations, and tournament
                  closeout.
                </p>
              </article>
            </div>
          </div>
        </section>

        <section className={styles.work} id="work">
          <h2>Selected work</h2>

          <article className={styles.primaryProject} id="mypepprotocol">
            <div className={styles.projectIntro}>
              <h3>MyPepProtocol</h3>
              <p>
                A working product for health and protocol tracking, built with
                AI and modern development tools.
              </p>
            </div>

            <div
              className={styles.capturePlaceholder}
              role="img"
              aria-label="Development placeholder for a future real MyPepProtocol product capture"
            >
              <div className={styles.desktopPlaceholderCopy}>
                <strong>Real MyPepProtocol capture required</strong>
                <span>A current product capture exists in the project library</span>
                <span>
                  Exact share-safe homepage asset is not exportable in this
                  environment
                </span>
              </div>

              <div className={styles.mobilePlaceholderCopy}>
                <strong>Real MyPepProtocol capture required</strong>
                <span>Share-safe mobile or responsive capture pending</span>
                <span>No simulated UI</span>
              </div>
            </div>

            <p className={styles.desktopAssetNote}>
              Asset substitution pending. No simulated interface has been
              introduced.
            </p>
            <p className={styles.mobileAssetNote}>
              Asset substitution pending. Screenshot readability must be
              rechecked with the final capture.
            </p>

            <Link className={styles.textLink} href="/work/mypepprotocol">
              Explore the case study <span aria-hidden="true">→</span>
            </Link>
          </article>

          <article className={styles.secondaryProject}>
            <h3>World Cup Tracker</h3>
            <p>
              Built to make the 2026 FIFA World Cup easier to follow in one
              place, combining the full 104-match schedule, tournament bracket,
              filters, knockout-stage tracking, and scoring. With the tournament
              complete, it now serves as a historical reference.
            </p>

            <a
              className={styles.textLink}
              href="https://fifa-world-cup-predictor-jet.vercel.app/"
              target="_blank"
              rel="noreferrer"
            >
              Explore on Work <span aria-hidden="true">→</span>
            </a>
          </article>
        </section>

        <section className={styles.labeledSection}>
          <p className={styles.sectionLabel}>How I think</p>

          <div className={styles.sectionContent}>
            <h2>A practical approach.</h2>

            <div className={styles.thinkingList}>
              <article className={styles.thinkingRow}>
                <h3>Reduce repeat work.</h3>
                <p>
                  In MyPepProtocol, recorded inventory details carry into
                  protocol setup, while the user reviews the choices.
                </p>
              </article>

              <article className={styles.thinkingRow}>
                <h3>Make uncertainty visible.</h3>
                <p>
                  MyPepProtocol’s product rules distinguish recorded facts from
                  explanations, without treating a change over time as proof of
                  cause.
                </p>
              </article>
            </div>
          </div>
        </section>

        <section className={styles.labeledSection} id="about">
          <p className={styles.sectionLabel}>About</p>

          <div className={styles.sectionContent}>
            <h2>A newer chapter.</h2>

            <div className={styles.prose}>
              <p>
                Customer relationships and large-scale operations have shaped my
                career. Product building is a newer chapter.
              </p>
              <p>
                Beyond work, I’ve spent three months backpacking through
                Southeast Asia.
              </p>
            </div>

            <a className={styles.textLink} href="#about">
              More about me <span aria-hidden="true">→</span>
            </a>
          </div>
        </section>

        <section className={styles.labeledSection} id="contact">
          <p className={styles.sectionLabel}>Contact</p>

          <div className={styles.sectionContent}>
            <h2>Let’s start a conversation.</h2>

            <p className={styles.contactCopy}>
              For opportunities across operations, customer experience and
              product-adjacent work.
            </p>

            <a className={styles.textLink} href="mailto:rlemor@gmail.com">
              Get in touch <span aria-hidden="true">→</span>
            </a>
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        <span>Rafael Lemor</span>
      </footer>
    </>
  );
}
