import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import styles from "./page.module.css";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main className={styles.page} id="main-content" tabIndex={-1}>
        <section className={styles.hero} aria-labelledby="intro-heading">
          <div>
            <p className={styles.greeting}>
              <span aria-hidden="true" />
              Hello from Miami
            </p>
            <h1 id="intro-heading">I’m Rafael.</h1>
            <p className={styles.heroCopy}>
              I’ve managed FIFA commercial-partner accounts and a $4M SaaS
              portfolio. Now I build tools with AI.
            </p>
            <div className={styles.actions}>
              <Link className={styles.button} href="/work">
                Explore work <span aria-hidden="true">↗</span>
              </Link>
              <Link href="/contact">Get in touch</Link>
            </div>
          </div>
          <figure className={styles.portrait}>
            <Image
              src="/images/rafael-portrait.jpg"
              alt="Rafael Lemor"
              width={400}
              height={400}
              sizes="(max-width: 640px) 120px, (max-width: 900px) 220px, 260px"
              preload
            />
            <figcaption>Usually planning my next trip.</figcaption>
          </figure>
        </section>

        <section
          className={styles.experience}
          aria-labelledby="experience-heading"
        >
          <p className={styles.eyebrow}>Professional experience</p>
          <h2 id="experience-heading">From enterprise accounts to the world stage.</h2>
          <article className={styles.experienceRow}>
            <h3>Global sports &amp; events</h3>
            <div>
              <p>
                <strong className={styles.fifa}>FIFA</strong> —
                commercial-partner ticketing and CRM across four tournaments,
                culminating in World Cup 2026. Earlier chapters: IMG Tickets /
                Miami Open and <strong>CHEQ</strong>’s venue implementations.
              </p>
              <Link href="/work#sports-events">
                Explore sports &amp; events <span aria-hidden="true">→</span>
              </Link>
            </div>
          </article>
          <article className={styles.experienceRow}>
            <h3>Enterprise SaaS &amp; customer success</h3>
            <div>
              <p>
                At <strong>Shibumi</strong> and <strong>CHEQ</strong>, helping
                customers get value from software through account ownership,
                implementation, and ongoing support.
              </p>
              <Link href="/work#enterprise">
                Explore customer success <span aria-hidden="true">→</span>
              </Link>
            </div>
          </article>
          <article className={styles.experienceRow}>
            <h3>Service operations &amp; leadership</h3>
            <div>
              <p>
                Leading teams and service delivery at <strong>Inktel</strong>,
                and travel concierge relationships at{" "}
                <strong>TEN Lifestyle Group</strong>.
              </p>
              <Link href="/work#service-operations">
                Explore service operations <span aria-hidden="true">→</span>
              </Link>
            </div>
          </article>
        </section>

        <aside
          className={styles.relationships}
          aria-labelledby="relationships-heading"
        >
          <h2 id="relationships-heading">
            Enterprise accounts, commercial partners &amp; major venues.
          </h2>
          <p className={styles.relationshipsIntro}>
            My experience includes managing a portfolio of 25 enterprise accounts
            representing $4M in ARR at Shibumi, alongside FIFA ticketing operations
            spanning 30+ commercial partners across four tournaments.
          </p>
          <dl>
            <div>
              <dt>
                <strong>Coca-Cola</strong> &amp;{" "}
                <strong>Bank of America</strong>
              </dt>
              <dd>FIFA · Personally managed commercial partners</dd>
            </div>
            <div>
              <dt>
                <strong>Williams-Sonoma</strong>
              </dt>
              <dd>Inktel · Service delivery</dd>
            </div>
            <div>
              <dt>
                <strong>Inter Miami</strong> · <strong>Miami Marlins</strong> ·{" "}
                <strong>Hard Rock Stadium</strong>
              </dt>
              <dd>CHEQ · Team and venue implementations</dd>
            </div>
          </dl>
        </aside>

        <section
          className={styles.projects}
          id="projects"
          aria-labelledby="projects-heading"
        >
          <p className={styles.eyebrow}>Independent projects</p>
          <h2 id="projects-heading">What I’ve built with AI.</h2>
          <p className={styles.projectsIntro}>
            I started building because I kept finding problems I wanted to
            solve, at work and beyond it. AI-assisted tools now help me turn
            those questions into working products.
          </p>
          <article className={styles.lighthouse}>
            <Image
              className={styles.projectImage}
              src="/projects/lighthouse/concept-artwork.webp"
              alt="Illustrative Lighthouse concept artwork featuring account health, renewal risk, and a coastal lighthouse."
              width={1672}
              height={941}
              sizes="(max-width: 640px) calc(100vw - 48px), (max-width: 900px) calc(100vw - 64px), (max-width: 1244px) 56vw, 682px"
            />
            <div>
              <h3>Lighthouse</h3>
              <p>
                Lighthouse is an AI-assisted customer health and account
                intelligence platform that brings customer{" "}
                <strong className={styles.lighthouseSignal}>context</strong>,
                renewal <strong className={styles.lighthouseSignal}>risk</strong>,
                and account{" "}
                <strong className={styles.lighthouseSignal}>
                  health signals
                </strong>{" "}
                into one workspace. It helps Customer Success teams{" "}
                <strong className={styles.lighthouseOutcome}>identify</strong>{" "}
                at-risk accounts, prioritize{" "}
                <strong className={styles.lighthouseOutcome}>action</strong>, and
                use AI-generated executive briefs to make{" "}
                <strong className={styles.lighthouseOutcome}>
                  better decisions
                </strong>.
              </p>
              <Link href="/projects#lighthouse">
                Explore Lighthouse <span aria-hidden="true">→</span>
              </Link>
            </div>
          </article>
          <div className={styles.otherProjects}>
            <div>
              <h3>
                <Link href="/projects/mypepprotocol">
                  MyPepProtocol <span aria-hidden="true">→</span>
                </Link>
              </h3>
              <p>
                A private health-record app that keeps treatment plans,
                schedules, inventory, and lab results connected so information
                does not have to be entered twice.
              </p>
            </div>
            <div>
              <h3>
                <Link href="/projects#world-cup-tracker">
                  World Cup Tracker <span aria-hidden="true">→</span>
                </Link>
              </h3>
              <p>
                An independent tournament tracker and predictor, now a
                historical reference. Not affiliated with FIFA.
              </p>
            </div>
          </div>
        </section>

        <section className={styles.contact} aria-labelledby="contact-heading">
          <div>
            <p className={styles.eyebrow}>Beyond the work</p>
            <h2 id="contact-heading">Let’s talk about what’s next.</h2>
            <p>
              Miami-based, a football fan, and always curious about the next
              place to explore.
            </p>
          </div>
          <div className={styles.contactLinks}>
            <a href="mailto:rlemor@gmail.com">
              rlemor@gmail.com <span aria-hidden="true">↗</span>
            </a>
            <a
              href="https://www.linkedin.com/in/rlemor"
              target="_blank"
              rel="noreferrer"
            >
              LinkedIn <span aria-hidden="true">↗</span>
            </a>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
