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
            <a className={styles.primaryAction} href="#projects">
              View projects
            </a>
            <a className={styles.textLink} href="#contact">
              Get in touch
            </a>
          </div>
        </section>

        <section className={`${styles.labeledSection} ${styles.experienceSection}`}>
          <p className={styles.sectionLabel}>Experience</p>

          <div className={styles.sectionContent}>
            <h2>Complex environments. Consistent execution.</h2>

            <div className={styles.experienceList}>
              <article className={styles.experienceRow}>
                <h3>Global Sports Operations</h3>
                <p className={styles.experienceMeta}>
                  FIFA · Miami Open · Formula 1 · Hard Rock Stadium
                </p>
                <p>
                  Managed ticketing operations across four FIFA tournaments and
                  four editions of the Miami Open. Work spanned CRM operations,
                  ticket allocations and fulfillment, partner workshops and
                  training, and high-stakes delivery across commercial partners
                  and host-city stakeholders.
                </p>
              </article>

              <article className={styles.experienceRow}>
                <h3>SaaS / Customer Success</h3>
                <p className={styles.experienceMeta}>
                  Shibumi · CHEQ by Cantaloupe
                </p>
                <p>
                  Worked across Shibumi, an enterprise strategic portfolio
                  management platform, and CHEQ by Cantaloupe, a mobile-first
                  commerce platform for stadiums and live venues. Experience
                  spanned Customer Success, implementation, technology, and
                  operational problem solving.
                </p>
              </article>

              <article className={styles.experienceRow}>
                <h3>Commercial Partnerships / B2B</h3>
                <p className={styles.experienceMeta}>
                  Coca-Cola · Bank of America · Qualcomm
                </p>
                <p>
                  Managed complex customer and partner relationships across SaaS
                  and global sports, including Fortune 500 organizations such as
                  Coca-Cola, Bank of America, and Qualcomm. The common thread was
                  translating commercial priorities into coordinated execution
                  across teams, systems, and operations.
                </p>
              </article>
            </div>
          </div>
        </section>

        <section className={styles.work} id="projects">
          <h2>Selected projects</h2>

          <article
            className={`${styles.projectRow} ${styles.primaryProject}`}
            id="lighthouse"
          >
            <div className={styles.projectCopy}>
              <h3>Lighthouse</h3>
              <p>
                An account-intelligence product built from firsthand Customer
                Success experience, combining portfolio health, renewal risk,
                account context, and AI-assisted executive briefs to surface what
                deserves attention.
              </p>

              <Link className={styles.textLink} href="/projects#lighthouse">
                Explore the project <span aria-hidden="true">→</span>
              </Link>
            </div>

            <div className={styles.projectMedia}>
              <Image
                className={styles.projectImage}
                src="/projects/lighthouse/showcase.webp"
                alt="Lighthouse account intelligence dashboard showing portfolio health, renewal risk, account metrics, and AI analysis tools."
                width={800}
                height={600}
                sizes="(max-width: 900px) calc(100vw - 48px), 620px"
                unoptimized
              />
            </div>
          </article>

          <article
            className={`${styles.projectRow} ${styles.secondaryProject}`}
            id="mypepprotocol"
          >
            <div className={styles.projectCopy}>
              <h3>MyPepProtocol</h3>
              <p>
                A private health-tracking product that keeps protocols,
                schedules, inventory, labs, and longitudinal records coherent
                over time, with product rules built around evidence and
                uncertainty.
              </p>

              <Link className={styles.textLink} href="/projects/mypepprotocol">
                Explore the case study <span aria-hidden="true">→</span>
              </Link>
            </div>

            <div className={styles.projectMedia}>
              <Image
                className={styles.projectImage}
                src="/projects/mypepprotocol/showcase.webp"
                alt="MyPepProtocol Today view showing demo summary metrics and active protocol records."
                width={640}
                height={800}
                sizes="(max-width: 900px) calc(100vw - 48px), 520px"
                unoptimized
              />
            </div>
          </article>

          <article className={styles.tertiaryProject}>
            <div className={styles.tertiaryCopy}>
              <h3>World Cup Tracker</h3>
              <p>
                A 104-match tournament tracker built to make the expanded 2026
                FIFA World Cup easier to navigate, from group standings through
                the knockout bracket.
              </p>
            </div>

            <Link className={styles.textLink} href="/projects#world-cup-tracker">
              Explore the project <span aria-hidden="true">→</span>
            </Link>
          </article>
        </section>

        <section className={styles.labeledSection}>
          <p className={styles.sectionLabel}>How I think</p>

          <div className={styles.sectionContent}>
            <h2>A practical operating mindset.</h2>

            <div className={styles.thinkingList}>
              <article className={styles.thinkingRow}>
                <h3>Turn signals into priorities.</h3>
                <p>
                  In Lighthouse, account-health signals, renewal risk, and account
                  context are brought together so the user can focus on what
                  deserves attention instead of manually synthesizing another
                  dashboard.
                </p>
              </article>

              <article className={styles.thinkingRow}>
                <h3>Keep facts separate from assumptions.</h3>
                <p>
                  When information is incomplete, make the uncertainty explicit.
                  MyPepProtocol separates recorded facts from interpretation rather
                  than presenting correlation as causation.
                </p>
              </article>
            </div>
          </div>
        </section>

        <section className={styles.labeledSection} id="about">
          <p className={styles.sectionLabel}>About</p>

          <div className={styles.sectionContent}>
            <h2>More than the résumé.</h2>

            <div className={styles.prose}>
              <p>
                Rafael’s career has moved between enterprise software, global
                sport, and now building products with AI. The common thread is a
                preference for complex problems, useful systems, and work where
                thoughtful execution matters.
              </p>
              <p>
                Outside work, travel and football are constants. He has explored
                30 countries so far, including an extended backpacking trip
                through Southeast Asia, and is usually most interested in
                experiences that expose him to different people, places, and
                ways of thinking.
              </p>
            </div>

            <Link className={styles.textLink} href="/about">
              More about Rafael <span aria-hidden="true">→</span>
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
