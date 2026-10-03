import type { Metadata } from "next";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import styles from "./contact.module.css";

export const metadata: Metadata = {
  title: "Contact | Rafael Lemor",
  description:
    "Contact Rafael Lemor about operations, customer understanding, product judgment, and practical AI execution.",
};

export default function ContactPage() {
  return (
    <>
      <SiteHeader />

      <main className={styles.page}>
        <h1>Contact</h1>

        <div className={styles.content}>
          <p className={styles.statement}>
            I&apos;m most interested in roles and projects that call for strong
            operations, customer understanding, product judgment, and practical
            AI execution.
          </p>

          <p className={styles.secondaryCopy}>
            If that sounds relevant to what you&apos;re working on, email is the
            best place to start. You can also find me on LinkedIn.
          </p>

          <div className={styles.rows}>
            <div className={styles.row}>
              <span>Email</span>
              <a href="mailto:rlemor@gmail.com">rlemor@gmail.com</a>
            </div>

            <div className={styles.row}>
              <span>LinkedIn</span>
              <a
                href="https://www.linkedin.com/in/rlemor"
                target="_blank"
                rel="noreferrer"
              >
                linkedin.com/in/rlemor
              </a>
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </>
  );
}
