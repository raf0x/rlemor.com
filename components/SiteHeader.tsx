import Link from "next/link";
import styles from "./site-header.module.css";

export default function SiteHeader() {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link className={styles.name} href="/">
          Rafael Lemor
        </Link>

        <nav className={styles.nav} aria-label="Primary navigation">
          <Link href="/work">Work</Link>
          <Link href="/about">About</Link>
          <Link href="/contact">Contact</Link>
        </nav>
      </div>
    </header>
  );
}
