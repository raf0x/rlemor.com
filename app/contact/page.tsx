import type { Metadata } from "next";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import styles from "./contact.module.css";

const description =
  "Get in touch with Rafael Lemor about Customer Success, Enterprise Account Management, and large-event operations.";

export const metadata: Metadata = {
  title: "Contact | Rafael Lemor",
  description,
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    title: "Contact | Rafael Lemor",
    description,
    url: "/contact",
    siteName: "Rafael Lemor",
    locale: "en_US",
    type: "website",
    images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/opengraph-image"],
    title: "Contact | Rafael Lemor",
    description,
  },
};

export default function ContactPage() {
  return (
    <>
      <SiteHeader />

      <main id="main-content" tabIndex={-1} className={styles.page}>
        <p className={styles.eyebrow}>Get in touch</p>
        <h1>Good things start<br />with a conversation.</h1>

        <div className={styles.content}>
          <p className={styles.statement}>
            I&apos;m interested in Customer Success, strategic account
            management, and major-event operations where trust, commercial
            judgment, and reliable execution make a difference.
          </p>

          <p className={styles.secondaryCopy}>
            I also enjoy working with teams that use technology to solve
            real customer problems. If my experience could help with yours,
            email is the best place to start.
          </p>

          <div className={styles.rows}>
            <div className={styles.row}>
              <span className={styles.rowLabel}>Email</span>
              <a className={styles.emailLink} href="mailto:rlemor@gmail.com">
                rlemor@gmail.com <span aria-hidden="true">&rarr;</span>
              </a>
            </div>

            <div className={styles.row}>
              <span className={styles.rowLabel}>LinkedIn</span>
              <a
                href="https://www.linkedin.com/in/rlemor"
                target="_blank"
                rel="noopener noreferrer"
              >
                linkedin.com/in/rlemor <span aria-hidden="true">↗</span>
                <span className={styles.srOnly}> (opens in a new tab)</span>
              </a>
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </>
  );
}
