import Link from "next/link";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import styles from "./not-found.module.css";

export default function NotFound() {
  return (
    <>
      <SiteHeader />

      <main className={styles.page}>
        <div className={styles.content}>
          <p className={styles.code}>404</p>
          <h1>Page not found.</h1>
          <p className={styles.copy}>
            That page does not exist or may have moved.
          </p>
          <Link className={styles.homeLink} href="/">
            Back home
          </Link>
        </div>
      </main>

      <SiteFooter />
    </>
  );
}
