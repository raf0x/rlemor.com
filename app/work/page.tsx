import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import styles from "./work.module.css";

const description =
  "Rafael Lemor’s experience in customer success, enterprise accounts, and event operations: FIFA, IMG Tickets / Miami Open, Shibumi, CHEQ, Inktel, and TEN Lifestyle Group.";
export const metadata: Metadata = {
  title: "Work | Rafael Lemor",
  description,
  alternates: { canonical: "/work" },
  openGraph: { title: "Work | Rafael Lemor", description, url: "/work" },
  twitter: { card: "summary", title: "Work | Rafael Lemor", description },
};

export default function WorkPage() {
  return (
    <>
      <SiteHeader />
      <main className={styles.page} id="main-content" tabIndex={-1}>
        <section className={styles.intro} id="career">
          <p className={styles.eyebrow}>Professional experience</p>
          <h1>
            Work built on <span>relationships.</span>
          </h1>
          <p>
            Across global events, enterprise software, and service teams, the
            constant has been understanding the customer and following through.
          </p>
        </section>

        <section
          className={styles.specialty}
          id="sports-events"
          aria-labelledby="events-heading"
        >
          <div className={styles.specialtyHeading}>
            <p className={styles.eyebrow}>01 / Experience</p>
            <h2 id="events-heading">Global Sports &amp; Events</h2>
          </div>
          <div className={styles.specialtyBody}>
            <article
              className={styles.feature}
              id="fifa"
              aria-labelledby="fifa-heading"
            >
              <p className={styles.eyebrow}>
                <strong>FIFA</strong>
              </p>
              <h3 id="fifa-heading">
                Behind the tickets. Alongside the partners.
              </h3>
              <p className={styles.storyLead}>
                Across four global tournaments culminating in the 2026{" "}
                <strong className={styles.fifa}>FIFA</strong> World Cup, my
                work connected commercial partners with the
                systems and operations behind their ticketing needs.
              </p>
              <p>
                That meant CRM records, allocations and fulfillment, reporting,
                partner training, escalations, and closeout. Clear communication
                and attention to each partner’s needs mattered at every stage.
              </p>
              <figure className={styles.matchdayFigure}>
                <Image
                  className={styles.matchdayImage}
                  src="/images/fifa-world-cup-2026-matchday.webp"
                  alt="FIFA World Cup 2026 stadium ceremony with France and England flags displayed across the pitch."
                  width={1600}
                  height={1200}
                  sizes="(max-width: 640px) calc(100vw - 48px), (max-width: 760px) calc(100vw - 64px), (max-width: 1000px) calc(66vw - 66px), (max-width: 1244px) calc(66vw - 88.44px), 733px"
                />
                <figcaption>
                  FIFA World Cup 2026. A matchday view I photographed while working
                  in tournament ticketing operations.
                </figcaption>
              </figure>
              <dl className={styles.scope}>
                <div>
                  <dt>30+ partners</dt>
                  <dd>
                    Commercial-partner ticketing scope across four tournaments.
                  </dd>
                </div>
                <div>
                  <dt>350K+ tickets</dt>
                  <dd>
                    Across the four-tournament commercial-partner ticketing scope.
                  </dd>
                </div>
                <div>
                  <dt>$50M+</dt>
                  <dd>
                    Ticket purchases I personally processed and managed for my
                    FIFA commercial-partner accounts.
                  </dd>
                </div>
              </dl>
              <p className={styles.relationship}>
                Personally managed at <strong className={styles.fifa}>FIFA</strong>:{" "}
                <strong>Coca-Cola</strong> and <strong>Bank of America</strong>{" "}
                commercial-partner accounts.
              </p>
            </article>

            <article
              className={styles.supporting}
              id="miami-open"
              aria-labelledby="miami-heading"
            >
              <h3 id="miami-heading">Four editions of the Miami Open.</h3>
              <p className={styles.storyLead}>
                With <strong>IMG Tickets</strong>, I managed the Miami Open box
                office at Crandon Park, Key Biscayne. During each two-week event,
                I was responsible for ticketing staff, VIP entrance operations,
                inventory, sales, and customer escalations, with customer service
                and support continuing outside event periods.
              </p>
            </article>

            <div className={styles.context}>
              <h3>Team &amp; venue implementations</h3>
              <p>
                At <strong>CHEQ</strong>, a mobile-commerce platform,
                implementation contexts included <strong>Inter Miami</strong>,
                the <strong>Miami Marlins</strong>, and{" "}
                <strong>Hard Rock Stadium</strong>.{" "}
                <a href="#cheq">
                  More on the customer work{" "}
                  <span aria-hidden="true">↓</span>
                </a>
              </p>
            </div>
          </div>
        </section>

        <section
          className={`${styles.specialty} ${styles.enterprise}`}
          id="enterprise"
          aria-labelledby="enterprise-heading"
        >
          <div className={styles.specialtyHeading}>
            <p className={styles.eyebrow}>02 / Experience</p>
            <h2 id="enterprise-heading">
              Enterprise SaaS &amp; Customer Success
            </h2>
          </div>
          <div className={styles.specialtyBody}>
            <article
              className={styles.chapter}
              id="shibumi"
              aria-labelledby="shibumi-heading"
            >
              <h3 id="shibumi-heading">Lasting relationships. Measurable growth.</h3>
              <p className={styles.storyLead}>
                At <strong>Shibumi</strong>, I managed{" "}
                <strong>25 enterprise accounts representing $4M in ARR</strong>,
                achieving 117% net dollar retention with zero churn.
              </p>
              <p>
                I led C-suite QBRs and account health scoring, and partnered
                with Sales on $500K in expansion.
              </p>
            </article>
            <article
              className={styles.supporting}
              id="cheq"
              aria-labelledby="cheq-heading"
            >
              <h3 id="cheq-heading">Connecting software with its customers.</h3>
              <p className={styles.storyLead}>
                My customer success work at <strong>CHEQ</strong> centered on
                implementations for a mobile-commerce platform, including the{" "}
                <a href="#sports-events">team and venue contexts above</a>.
              </p>
            </article>
          </div>
        </section>

        <section
          className={`${styles.specialty} ${styles.service}`}
          id="service-operations"
          aria-labelledby="service-heading"
        >
          <div className={styles.specialtyHeading}>
            <p className={styles.eyebrow}>03 / Experience</p>
            <h2 id="service-heading">Service Operations &amp; Leadership</h2>
          </div>
          <div className={styles.specialtyBody}>
            <article
              className={styles.chapter}
              id="inktel"
              aria-labelledby="inktel-heading"
            >
              <h3 id="inktel-heading">Scaling the team behind the service.</h3>
              <p className={styles.storyLead}>
                At <strong>Inktel</strong>, I led supervisors and service
                delivery for the <strong>Williams-Sonoma</strong> account,
                scaling the team to{" "}
                <strong>400+ agents in four months</strong>.
              </p>
            </article>
            <article
              className={styles.supporting}
              id="ten-lifestyle"
              aria-labelledby="ten-heading"
            >
              <h3 id="ten-heading">Personal service, across borders.</h3>
              <p className={styles.storyLead}>
                At <strong>TEN Lifestyle Group</strong>, my account management
                work spanned travel concierge, customer support, and client
                experience across the U.S. and Latin America.
              </p>
            </article>
          </div>
        </section>

        <section className={styles.contact}>
          <div>
            <h2>What comes next?</h2>
            <p>I’d be glad to hear what you’re working on.</p>
          </div>
          <Link href="/contact">
            Get in touch <span aria-hidden="true">↗</span>
          </Link>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
