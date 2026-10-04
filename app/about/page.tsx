import type { Metadata } from "next";
import Image from "next/image";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import styles from "./about.module.css";

const description =
  "About Rafael Lemor: customer-facing operations, major events, product building, and travel.";

export const metadata: Metadata = {
  title: "About | Rafael Lemor",
  description,
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: "About | Rafael Lemor",
    description,
    url: "/about",
    siteName: "Rafael Lemor",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "About | Rafael Lemor",
    description,
  },
};

export default function AboutPage() {
  return (
    <>
      <SiteHeader />

      <main className={styles.page}>
        <section className={styles.intro}>
          <h1>About</h1>

          <div className={styles.introLayout}>
            <p>
              Rafael is a seasoned professional with more than seven years across
              enterprise SaaS and global sports operations. He has managed customer
              and partner relationships for Fortune 500 companies including
              Coca-Cola, Bank of America, and Qualcomm, with experience spanning
              Customer Success, account management, technology implementation, and
              large-scale CRM and ticketing operations. Today, he is applying AI to
              how work gets done, building workflows and agentic systems that reduce
              repetitive work, make complex information easier to use, and improve
              execution.
            </p>

            <div className={styles.portraitFrame}>
              <Image
                className={styles.portrait}
                src="/images/rafael-portrait.jpg"
                alt="Rafael Lemor"
                fill
                sizes="(max-width: 800px) 288px, 304px"
              />
            </div>
          </div>
        </section>

        <section className={styles.paragraphSection}>
          <div className={styles.storyRow}>
            <Image
              className={`${styles.storyImage} ${styles.fifaImage}`}
              src="/images/about-fifa.png"
              alt="FIFA"
              width={144}
              height={144}
              sizes="(max-width: 760px) 128px, 144px"
            />
            <p>
              Most recently, at FIFA, Rafael managed commercial-partner ticketing
              relationships across four global tournaments, including the 2026
              World Cup. Earlier roles gave him other sides of the same problem:
              enterprise Customer Success, technology implementation, and
              operations leadership.
            </p>
          </div>
        </section>

        <section className={styles.paragraphSection}>
          <div className={styles.storyRow}>
            <Image
              className={styles.storyImage}
              src="/images/about-product-building.png"
              alt="Product-building workspace"
              width={144}
              height={144}
              sizes="(max-width: 760px) 128px, 144px"
            />
            <p>
              Building products is a newer extension of how Rafael already worked.
              AI and modern development tools gave him a practical way to move from
              noticing a problem to building and testing a working solution. He
              approaches that work with the same mindset: understand the user, make
              the tradeoffs explicit, simplify aggressively, and keep improving the
              parts that matter. MyPepProtocol is the clearest expression of that
              so far.
            </p>
          </div>
        </section>

        <section className={styles.paragraphSection}>
          <div className={styles.storyRow}>
            <Image
              className={styles.storyImage}
              src="/images/about-travel.jpg"
              alt="Rafael Lemor traveling"
              width={144}
              height={144}
              sizes="(max-width: 760px) 128px, 144px"
            />
            <p>
              Outside work, travel is one of the things Rafael cares about most.
              He has visited roughly 25–30 countries, including a three-month
              backpacking trip through Southeast Asia that covered about eight
              countries and 25 cities. Football has been another constant, making
              his work around the World Cup a particularly memorable chapter.
            </p>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}