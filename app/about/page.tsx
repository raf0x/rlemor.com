import type { Metadata } from "next";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import styles from "./about.module.css";

export const metadata: Metadata = {
  title: "About | Rafael Lemor",
  description:
    "About Rafael Lemor: customer-facing operations, major events, product building, and travel.",
};

export default function AboutPage() {
  return (
    <>
      <SiteHeader />

      <main className={styles.page}>
        <section className={styles.intro}>
          <h1>About</h1>
          <p>
            I&apos;ve spent more than seven years in customer-facing and
            operational roles across SaaS, major events, and complex service
            environments. The settings changed, but the job was often similar:
            understand what the customer needs, make sense of a complicated
            system, coordinate the people involved, and keep things moving when
            the plan meets reality.
          </p>
        </section>

        <section className={styles.paragraphSection}>
          <p>
            Most recently, at FIFA, I managed commercial-partner ticketing
            relationships across four global tournaments, including the 2026
            World Cup. Earlier roles gave me other sides of the same problem:
            enterprise Customer Success, technology implementation, and
            operations leadership.
          </p>
        </section>

        <section className={styles.paragraphSection}>
          <p>
            Building products is a newer extension of how I already worked. AI
            and modern development tools gave me a practical way to move from
            noticing a problem to building and testing a working solution. I
            approach that work like an operator: understand the user, make the
            tradeoffs explicit, simplify aggressively, and keep improving the
            parts that matter. MyPepProtocol is the clearest expression of that
            so far.
          </p>
        </section>

        <section className={styles.paragraphSection}>
          <p>
            Outside work, travel is one of the things I care about most.
            I&apos;ve visited roughly 25–30 countries, including a three-month
            backpacking trip through Southeast Asia that covered about eight
            countries and 25 cities. Football has been another constant, which
            made working around the World Cup a particularly memorable chapter.
          </p>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
