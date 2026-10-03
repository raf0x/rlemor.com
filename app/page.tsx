import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import styles from "./page.module.css";

export const metadata: Metadata = {
  alternates: {
    canonical: "/",
  },
};

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

            <div className={styles.projectMedia}>
              <Image
                className={styles.projectImage}
                src="/projects/mypepprotocol/overview-current.webp"
                alt="MyPepProtocol Today view showing demo summary metrics and active protocol records."
                width={500}
                height={750}
                sizes="(max-width: 760px) calc(100vw - 48px), 430px"
              />
            </div>

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

            <Link className={styles.textLink} href="/work#world-cup-tracker">
              Explore the project <span aria-hidden="true">→</span>
            </Link>
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

            <Link className={styles.textLink} href="/about">
              More about me <span aria-hidden="true">→</span>
            </Link>
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

      <SiteFooter />
    </>
  );
}
