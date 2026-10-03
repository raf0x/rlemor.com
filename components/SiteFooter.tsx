import Link from "next/link";
import styles from "./site-footer.module.css";

export default function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <span>Rafael Lemor</span>

      <nav className={styles.nav} aria-label="Footer navigation">
        <Link href="/work">Work</Link>
        <Link href="/about">About</Link>
        <Link href="/contact">Contact</Link>
      </nav>
    </footer>
  );
}
