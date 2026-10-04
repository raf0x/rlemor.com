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
              At FIFA, Rafael managed ticketing operations and commercial-partner
              relationships across four global tournaments, culminating in the 2026
              World Cup. His work spanned allocations, contracts, distribution,
              payments, escalations, and tournament closeout, coordinating across
              partners and internal teams in an environment where accuracy, timing,
              and execution mattered at global scale.
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
              More recently, Rafael has extended that experience into product
              building. Using AI and modern development tools, he moves from
              identifying a real problem to designing, building, and testing a
              working solution. His focus is not technology for its own sake, but
              practical systems that reduce friction, make information more useful,
              and improve execution. MyPepProtocol is the clearest example of that
              approach.
            </p>
          </div>
        </section>

        <section className={styles.paragraphSection}>
          <div className={styles.storyRow}>
            <Image
              className={styles.storyImage}
              src="/images/about-travel2.jpg"
              alt="Rafael Lemor traveling"
              width={144}
              height={144}
              sizes="(max-width: 760px) 128px, 144px"
            />
            <p>
              Outside work, Rafael has traveled to roughly 25–30 countries,
              including a three-month backpacking trip through Southeast Asia
              spanning about eight countries and 25 cities. Travel remains one of
              his biggest personal interests, alongside football, which made the
              opportunity to work around the World Cup a particularly meaningful
              chapter.
            </p>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}