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
    copy: "Commercial partner ticketing across four global tournaments, culminating in the 2026 FIFA World Cup.",
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
    copy: "Customer success and implementations for a mobile commerce platform. Team and venue implementation contexts included Inter Miami, the Miami Marlins, and Hard Rock Stadium.",
  },
  {
    employer: "Shibumi",
    dates: "Sep 2021 – Jan 2023",
    role: "Enterprise Customer Success Manager",
    copy: "Managed 25 enterprise accounts representing $4M in ARR. Achieved 117% net dollar retention with zero churn, partnered with Sales on $500K in expansion, and led C-suite QBRs and account health scoring.",
  },
  {
    employer: "Inktel",
    dates: "Sep 2020 – Sep 2021",
    role: "Operations Manager",
    copy: "Led supervisors and service delivery for the Williams-Sonoma account, scaling the team to 400+ agents in four months.",
  },
  {
    employer: "TEN Lifestyle Group",
    dates: "Jul 2017 – Sep 2020",
    role: "Account Manager",
    copy: "Travel concierge and customer experience for clients across the U.S. and Latin America.",
  },
  {
    employer: "IMG Tickets",
    dates: "2014–2017",
    role: "Box Office Manager · Miami Open",
    copy: "Four editions of the Miami Open at Crandon Park, Key Biscayne, with event ticketing and customer service throughout the year.",
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
            Work built on
            <br />
            <span>relationships.</span>
          </h1>
          <p>
            I’ve worked where enterprise expectations meet real-world
            operations. Understanding the customer, coordinating the details,
            and following through have been the constants.
          </p>
        </section>

        <section
          className={styles.feature}
          id="fifa"
          aria-labelledby="fifa-heading"
        >
          <div className={styles.storyHeading}>
            <p className={styles.eyebrow}>FIFA · Contract</p>
            <h2 id="fifa-heading">
              Behind the tickets.
              <br />
              Alongside the partners.
            </h2>
            <p className={styles.role}>
              Commercial Partner Ticketing / CRM Operations
            </p>
            <p className={styles.dates}>Sep 2024 – Aug 2026</p>
          </div>
          <div className={styles.storyCopy}>
            <p>
              Across four global tournaments culminating in the 2026 FIFA World
              Cup, my work connected commercial partners with the systems and
              operations behind their ticketing needs.
            </p>
            <p>
              That meant managing CRM records, allocations and fulfillment,
              reporting, partner training, escalations, and closeout. The scale
              was global; the day-to-day work depended on clear communication
              and attention to each partner’s needs.
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
            <div className={styles.context}>
              <h3>Accounts, with context</h3>
              <p>
                Coca-Cola and Bank of America were commercial partner accounts I
                personally managed at FIFA.
              </p>
            </div>
          </div>
        </section>

        <section
          className={styles.feature}
          id="miami-open"
          aria-labelledby="miami-heading"
        >
          <div className={styles.storyHeading}>
            <p className={styles.eyebrow}>IMG Tickets · Employer</p>
            <h2 id="miami-heading">
              The Miami Open,
              <br />
              from the box office.
            </h2>
            <p className={styles.role}>Box Office Manager</p>
            <p className={styles.dates}>
              2014–2017 · Crandon Park, Key Biscayne
            </p>
            <p className={styles.eventNote}>
              Four editions: 2014, 2015, 2016, 2017.
            </p>
          </div>
          <div className={styles.storyCopy}>
            <p>
              For four editions of the Miami Open, I managed the box office
              responsibilities that shape a guest’s experience before they ever
              reach their seat.
            </p>
            <p>
              During the two-week event, I managed ticketing staff, VIP entrance
              operations, ticket inventory, sales, and customer escalations. A
              question at the gate or a change to a ticket needed a clear answer
              and a practical next step.
            </p>
            <p>
              Outside event periods, the work continued through customer service
              and support. It was an early foundation in taking ownership of a
              customer’s experience from start to finish.
            </p>
            <div className={styles.context}>
              <h3>The relationship</h3>
              <p>
                IMG Tickets was my employer. The Miami Open was the event;
                Crandon Park was the venue.
              </p>
            </div>
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
            <p>
              Most recent first, across sport, software, service, and
              operations.
            </p>
          </div>
          <ol className={styles.timeline}>
            {career.map((job) => (
              <li key={job.employer}>
                <p className={styles.dates}>{job.dates}</p>
                <div>
                  <h3>{job.employer}</h3>
                  <p className={styles.role}>{job.role}</p>
                  <p>{job.copy}</p>
                  {job.href && (
                    <a href={job.href}>
                      Read the story <span aria-hidden="true">↑</span>
                    </a>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </section>
        <section className={styles.contact}>
          <div>
            <h2>
              Let’s talk about
              <br />
              what comes next.
            </h2>
            <p>
              Customer success, enterprise accounts, and complex event
              operations.
            </p>
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
