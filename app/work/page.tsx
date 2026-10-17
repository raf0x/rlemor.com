import type { Metadata } from "next";
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

const career = [
  {
    employer: "FIFA",
    dates: "Sep 2024 – Aug 2026",
    role: "Commercial Partner Ticketing / CRM Operations · Contract",
    href: "#fifa",
  },
  {
    employer: "Independent Consulting",
    dates: "Nov 2023 – Aug 2024",
    role: "Operations & Logistics",
    copy: "Operations and logistics support, including vendor coordination and event activations.",
  },
  {
    employer: "CHEQ.io",
    dates: "Apr 2023 – Oct 2023",
    role: "Customer Success Manager",
    href: "#cheq",
  },
  {
    employer: "Shibumi",
    dates: "Sep 2021 – Jan 2023",
    role: "Enterprise Customer Success Manager",
    href: "#shibumi",
  },
  {
    employer: "Inktel",
    dates: "Sep 2020 – Sep 2021",
    role: "Operations Manager",
    href: "#inktel",
  },
  {
    employer: "TEN Lifestyle Group",
    dates: "Jul 2017 – Sep 2020",
    role: "Account Manager",
    href: "#ten-lifestyle",
  },
  {
    employer: "IMG Tickets",
    dates: "2014–2017",
    role: "Box Office Manager · Miami Open",
    href: "#miami-open",
  },
];

export default function WorkPage() {
  return (
    <>
      <SiteHeader />
      <main className={styles.page} id="main-content" tabIndex={-1}>
        <section className={styles.intro}>
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
              <p className={styles.eyebrow}>FIFA · Contract</p>
              <h3 id="fifa-heading">
                Behind the tickets. Alongside the partners.
              </h3>
              <p className={styles.role}>
                Commercial Partner Ticketing / CRM Operations
              </p>
              <p className={styles.dates}>Sep 2024 – Aug 2026</p>
              <p className={styles.storyLead}>
                Across four global tournaments culminating in the 2026 FIFA
                World Cup, my work connected commercial partners with the
                systems and operations behind their ticketing needs.
              </p>
              <p>
                That meant CRM records, allocations and fulfillment, reporting,
                partner training, escalations, and closeout. Clear communication
                and attention to each partner’s needs mattered at every stage.
              </p>
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
                    Across the four-tournament scope, with $50M+ in ticket
                    purchases.
                  </dd>
                </div>
                <div>
                  <dt>97% satisfaction</dt>
                  <dd>Partner satisfaction reported for this work.</dd>
                </div>
              </dl>
              <p className={styles.relationship}>
                <strong>Personally managed at FIFA:</strong> Coca-Cola and Bank
                of America commercial partner accounts.
              </p>
            </article>

            <article
              className={styles.supporting}
              id="miami-open"
              aria-labelledby="miami-heading"
            >
              <h3 id="miami-heading">IMG Tickets / Miami Open</h3>
              <p className={styles.role}>Box Office Manager</p>
              <p className={styles.dates}>
                2014–2017 · Crandon Park, Key Biscayne
              </p>
              <p className={styles.storyLead}>
                At IMG Tickets, I managed the box office for four Miami Open
                editions, from 2014 through 2017. During each two-week event, I
                was responsible for ticketing staff, VIP entrance operations,
                inventory, sales, and customer escalations. Outside event
                periods, I handled customer service and support.
              </p>
            </article>

            <div className={styles.context}>
              <h3>CHEQ / Team &amp; venue implementations</h3>
              <p>
                At CHEQ, a mobile-commerce platform, implementation contexts
                included Inter Miami, the Miami Marlins, and Hard Rock Stadium.{" "}
                <a href="#cheq">
                  More on the customer success role{" "}
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
              <h3 id="shibumi-heading">Shibumi</h3>
              <p className={styles.role}>Enterprise Customer Success Manager</p>
              <p className={styles.dates}>Sep 2021 – Jan 2023</p>
              <p className={styles.storyLead}>
                I managed{" "}
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
              <h3 id="cheq-heading">CHEQ.io</h3>
              <p className={styles.role}>Customer Success Manager</p>
              <p className={styles.dates}>Apr 2023 – Oct 2023</p>
              <p className={styles.storyLead}>
                Customer success and implementations for a mobile-commerce
                platform, with team and venue implementation work connecting
                this role to the{" "}
                <a href="#sports-events">events experience above</a>.
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
              <h3 id="inktel-heading">Inktel</h3>
              <p className={styles.role}>Operations Manager</p>
              <p className={styles.dates}>Sep 2020 – Sep 2021</p>
              <p className={styles.storyLead}>
                I led supervisors and service delivery for the Williams-Sonoma
                account, scaling the team to{" "}
                <strong>400+ agents in four months</strong>.
              </p>
            </article>
            <article
              className={styles.supporting}
              id="ten-lifestyle"
              aria-labelledby="ten-heading"
            >
              <h3 id="ten-heading">TEN Lifestyle Group</h3>
              <p className={styles.role}>Account Manager</p>
              <p className={styles.dates}>Jul 2017 – Sep 2020</p>
              <p className={styles.storyLead}>
                Travel concierge, customer support, and client experience for
                clients across the U.S. and Latin America.
              </p>
            </article>
          </div>
        </section>

        <section
          className={styles.career}
          id="career"
          aria-labelledby="career-heading"
        >
          <div className={styles.sectionTop}>
            <p className={styles.eyebrow}>The full path</p>
            <h2 id="career-heading">Experience, in order.</h2>
            <p>Most recent first.</p>
          </div>
          <ol className={styles.timeline}>
            {career.map((job) => (
              <li key={job.employer}>
                <p className={styles.dates}>{job.dates}</p>
                <div>
                  <h3>
                    {job.href ? (
                      <a href={job.href}>
                        {job.employer} <span aria-hidden="true">↑</span>
                      </a>
                    ) : (
                      job.employer
                    )}
                  </h3>
                  <p className={styles.role}>{job.role}</p>
                  {job.copy && <p>{job.copy}</p>}
                </div>
              </li>
            ))}
          </ol>
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
