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
            <p className={styles.eyebrow}>
              <span aria-hidden="true" />
              Hello from Miami
            </p>
            <h1 id="intro-heading">
              I’m Rafael.
              <br />
              People are at the{" "}
              <span>heart of my work.</span>
            </h1>
            <p className={styles.heroCopy}>
              Customer success, enterprise account management, and large-event
              operations. From FIFA’s commercial partners to the Miami Open box
              office, I help people navigate complexity and keep things moving.
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
              sizes="(max-width: 640px) 180px, 300px"
              preload
            />
            <figcaption>Miami, Florida · Open to a conversation</figcaption>
          </figure>
        </section>

        <section
          className={styles.section}
          aria-labelledby="experience-heading"
        >
          <div className={styles.sectionTop}>
            <div>
              <p className={styles.eyebrow}>Professional experience</p>
              <h2 id="experience-heading">
                People, partners.
                <br />
                And the details that matter.
              </h2>
            </div>
            <p>
              Global sport, enterprise software, and service operations.
              Different settings, the same care for the customer.
            </p>
          </div>
          <article className={styles.experienceRow}>
            <p className={styles.meta}>
              FIFA
              <br />
              <span>Sep 2024 – Aug 2026 · Contract</span>
            </p>
            <div>
              <h3>Global tournaments. Personal attention.</h3>
              <p>
                Commercial partner ticketing and CRM operations across four
                tournaments, culminating in the 2026 FIFA World Cup.
                Allocations, fulfillment, training, and escalations — with
                relationships at the center.
              </p>
              <Link href="/work#fifa">
                My work with FIFA <span aria-hidden="true">→</span>
              </Link>
            </div>
          </article>
          <article className={styles.experienceRow}>
            <p className={styles.meta}>
              IMG Tickets / Miami Open
              <br />
              <span>2014–2017 · Box Office Manager</span>
            </p>
            <div>
              <h3>Four editions. Every detail counts.</h3>
              <p>
                Ticketing staff, VIP entrances, inventory, sales, and customer
                escalations during the two-week event at Crandon Park. Customer
                service continued beyond tournament week.
              </p>
              <Link href="/work#miami-open">
                Inside the Miami Open role <span aria-hidden="true">→</span>
              </Link>
            </div>
          </article>
          <div className={styles.careerNote}>
            <p>
              Also at <strong>Shibumi</strong> in enterprise customer success,
              <strong> CHEQ</strong> in venue implementations,
              <strong> Inktel</strong> in service delivery, and
              <strong> TEN Lifestyle Group</strong> in travel concierge.
            </p>
            <Link href="/work#career">
              View the full experience <span aria-hidden="true">→</span>
            </Link>
          </div>
        </section>

        <section className={styles.section} aria-labelledby="accounts-heading">
          <div className={styles.sectionTop}>
            <div>
              <p className={styles.eyebrow}>
                Selected accounts &amp; environments
              </p>
              <h2 id="accounts-heading">The relationships behind the work.</h2>
            </div>
          </div>
          <dl className={styles.relationships}>
            <div>
              <dt>Coca-Cola &amp; Bank of America</dt>
              <dd>Commercial partner accounts I personally managed at FIFA.</dd>
            </div>
            <div>
              <dt>Williams-Sonoma</dt>
              <dd>
                Customer service account supported through my operations role at
                Inktel.
              </dd>
            </div>
            <div>
              <dt>
                Inter Miami · Miami Marlins
                <br />
                Hard Rock Stadium
              </dt>
              <dd>Team and venue implementation contexts through CHEQ.</dd>
            </div>
          </dl>
        </section>

        <section
          className={styles.section}
          id="projects"
          aria-labelledby="projects-heading"
        >
          <div className={styles.sectionTop}>
            <div>
              <p className={styles.eyebrow}>Independent projects</p>
              <h2 id="projects-heading">A curious side, put into practice.</h2>
            </div>
            <p>
              Alongside my career, I use AI and modern tools to turn firsthand
              questions into working products.
            </p>
          </div>
          <article className={styles.projectRow}>
            <div className={styles.projectMedia}>
              <Image
                src="/projects/lighthouse/overview-desktop.webp"
                alt="Lighthouse account intelligence dashboard"
                width={2880}
                height={2000}
                sizes="(max-width: 640px) calc(100vw - 48px), 400px"
              />
            </div>
            <div>
              <p className={styles.eyebrow}>From customer success experience</p>
              <h3>Lighthouse</h3>
              <p>
                Account health, renewal risk, and customer context in one
                workspace, with AI-assisted executive briefs to help focus
                attention.
              </p>
              <Link href="/projects#lighthouse">
                Explore Lighthouse <span aria-hidden="true">→</span>
              </Link>
            </div>
          </article>
          <article className={styles.projectRow}>
            <div className={styles.projectMedia}>
              <Image
                src="/projects/mypepprotocol/overview-desktop.png"
                alt="MyPepProtocol dashboard with demo protocol and inventory records"
                width={2048}
                height={1342}
                sizes="(max-width: 640px) calc(100vw - 48px), 400px"
              />
            </div>
            <div>
              <p className={styles.eyebrow}>
                Product judgment &amp; careful tradeoffs
              </p>
              <h3>MyPepProtocol</h3>
              <p>
                A private health-tracking product built around coherent records,
                practical workflows, and an explicit distinction between
                evidence and interpretation.
              </p>
              <Link href="/projects/mypepprotocol">
                Read the case study <span aria-hidden="true">→</span>
              </Link>
            </div>
          </article>
          <article className={styles.compactProject}>
            <div>
              <p className={styles.eyebrow}>
                An independent historical project
              </p>
              <h3>World Cup Tracker</h3>
              <p>
                A tournament’s schedule, standings, and knockout bracket in one
                place. Independently built; not affiliated with or endorsed by
                FIFA.
              </p>
            </div>
            <Link href="/projects#world-cup-tracker">
              Explore the tracker <span aria-hidden="true">→</span>
            </Link>
          </article>
          <Link className={styles.allProjects} href="/projects">
            All independent projects <span aria-hidden="true">→</span>
          </Link>
        </section>

        <section className={styles.personal} aria-labelledby="personal-heading">
          <div>
            <p className={styles.eyebrow}>Away from the desk</p>
            <h2 id="personal-heading">
              Always curious about
              <br />
              the next perspective.
            </h2>
          </div>
          <div>
            <p>
              Travel and football have followed me through different chapters of
              life. Backpacking through Southeast Asia is part of that story — a
              chance to meet people, get a little lost, and see things
              differently.
            </p>
            <Link href="/about">
              A little more about me <span aria-hidden="true">→</span>
            </Link>
          </div>
        </section>
        <section className={styles.contact} aria-labelledby="contact-heading">
          <div>
            <h2 id="contact-heading">
              Good things start
              <br />
              with a conversation.
            </h2>
            <p>
              Let’s talk customer success, enterprise accounts, or your next big
              event.
            </p>
          </div>
          <div className={styles.contactActions}>
            <a className={styles.button} href="mailto:rlemor@gmail.com">
              Say hello <span aria-hidden="true">↗</span>
            </a>
            <a
              href="https://www.linkedin.com/in/rlemor"
              target="_blank"
              rel="noreferrer"
            >
              Connect on LinkedIn <span aria-hidden="true">↗</span>
            </a>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
