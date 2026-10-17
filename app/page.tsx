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
            <h1 id="intro-heading">
              I’m Rafael.
              <br />I bring people and <br />
              <span>operations together.</span>
            </h1>
            <p className={styles.heroCopy}>
              Customer Success, enterprise Account Management, and global event
              operations. I help customers and partners move from complex needs
              to clear next steps.
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
            <figcaption>Based in Miami, Florida.</figcaption>
          </figure>
        </section>

        <section
          className={styles.experience}
          aria-labelledby="experience-heading"
        >
          <p className={styles.eyebrow}>Professional experience</p>
          <h2 id="experience-heading">Three ways I help things work.</h2>
          <article className={styles.experienceRow}>
            <h3>Global sports &amp; events</h3>
            <div>
              <p>
                <strong className={styles.fifa}>FIFA</strong> —
                commercial-partner ticketing and CRM across four tournaments,
                culminating in World Cup 2026. Earlier chapters: IMG Tickets /
                Miami Open and CHEQ’s venue implementations.
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
                At Shibumi and CHEQ, helping customers get value from software
                through account ownership, implementation, and ongoing support.
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
                Leading teams and service delivery at Inktel, and travel
                concierge relationships at TEN Lifestyle Group.
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
          <h2 id="relationships-heading">Selected relationships</h2>
          <dl>
            <div>
              <dt>Coca-Cola &amp; Bank of America</dt>
              <dd>FIFA · Personally managed commercial partners</dd>
            </div>
            <div>
              <dt>Williams-Sonoma</dt>
              <dd>Inktel · Service delivery</dd>
            </div>
            <div>
              <dt>Inter Miami · Miami Marlins · Hard Rock Stadium</dt>
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
          <h2 id="projects-heading">Curiosity, put to work.</h2>
          <article className={styles.lighthouse}>
            <Image
              className={styles.projectImage}
              src="/projects/lighthouse/overview-desktop.webp"
              alt="Lighthouse’s account-intelligence workspace, captured from the public demo"
              width={2880}
              height={2000}
              sizes="(max-width: 640px) calc(100vw - 48px), (max-width: 900px) calc(100vw - 64px), (max-width: 1244px) 56vw, 682px"
            />
            <div>
              <h3>Lighthouse</h3>
              <p>
                A customer-success question, turned into an account-intelligence
                workspace: health, renewal risk, and AI-assisted briefs that
                help focus attention.
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
                A health-record product built around coherent information and
                explicit evidence.
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
