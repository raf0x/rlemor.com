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
              <br />I turn <span>human relationships</span>
              <br className={styles.heroLineBreak} /> into a competitive advantage.
            </h1>
            <p className={styles.heroCopy}>
              Managed{" "}
              <Image
                className={styles.fifaHeroLogo}
                src="/images/fifa-wordmark.svg"
                alt="FIFA"
                width={270}
                height={89}
              />{" "}
              commercial partners and a $4M SaaS portfolio. CX leader using AI
              for better decisions and practical tools.
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
                <Image
                  className={styles.fifaExperienceLogo}
                  src="/images/fifa-wordmark.svg"
                  alt="FIFA"
                  width={270}
                  height={89}
                />{" "}— commercial-partner ticketing and CRM across four tournaments,
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
          <div className={styles.partnerGroups} aria-label="Selected partner and client relationships">
            <div className={styles.partnerGroup}>
              <h3 className={styles.partnerAction}>Commercial partnerships</h3>
              <div className={styles.partnerLogos}>
                <Image className={styles.logoCocaCola} src="/brands/coca-cola.svg" alt="Coca-Cola" width={615} height={193} />
                <Image className={styles.logoBankOfAmerica} src="/brands/bank-of-america.svg" alt="Bank of America" width={720} height={73} />
                <Image className={styles.logoAdidas} src="/brands/adidas.svg" alt="Adidas" width={725} height={500} />
                <Image className={styles.logoPanini} src="/brands/panini.svg" alt="Panini" width={168} height={40} />
              </div>
              <div className={styles.employer} aria-label="While working at FIFA">
                <Image className={styles.employerFifa} src="/images/fifa-wordmark.svg" alt="FIFA, employer" width={270} height={89} />
              </div>
            </div>
            <div className={styles.partnerGroup}>
              <h3 className={styles.partnerAction}>Enterprise accounts</h3>
              <div className={styles.shibumiAccounts} aria-label="Selected enterprise accounts managed at Shibumi">
                <Image className={styles.accountQualcomm} src="/brands/qualcomm-client.svg" alt="Qualcomm" width={784} height={144} />
                <Image className={styles.accountCigna} src="/brands/cigna-client.svg" alt="Cigna" width={373} height={122} />
                <Image className={styles.accountDura} src="/brands/dura-shiloh-client.svg" alt="Dura | Shiloh" width={370} height={100} />
                <Image className={styles.accountTec} src="/brands/tec-client.svg" alt="Tecnológico de Monterrey" width={399} height={105} />
              </div>
              <div className={styles.employer} aria-label="While working at Shibumi">
                <Image className={styles.employerShibumi} src="/brands/shibumi-employer.png" alt="Shibumi, employer" width={370} height={81} />
              </div>
            </div>
            <div className={styles.partnerGroup}>
              <h3 className={styles.partnerAction}>Venue implementations</h3>
              <div className={styles.partnerLogos}>
                <Image className={styles.logoInterMiami} src="/brands/inter-miami-crest.png" alt="Inter Miami CF" width={88} height={88} />
                <Image className={styles.logoMiamiMarlins} src="/brands/miami-marlins.svg" alt="Miami Marlins" width={32} height={30} />
                <Image className={styles.logoHardRock} src="/brands/hard-rock-stadium.webp" alt="Hard Rock Stadium" width={332} height={192} />
              </div>
              <div className={styles.employer} aria-label="While working at CHEQ">
                <Image className={styles.employerCheq} src="/brands/cheq-employer.svg" alt="CHEQ, employer" width={300} height={92} />
              </div>
            </div>
          </div>
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
