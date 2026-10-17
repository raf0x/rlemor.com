import Link from "next/link";
import styles from "./site-footer.module.css";

export default function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <span>Rafael Lemor · Miami, Florida</span>
      <nav className={styles.nav} aria-label="Footer navigation">
        <Link href="/work">Work</Link>
        <Link href="/projects">Projects</Link>
        <Link href="/about">About</Link>
        <Link href="/contact">Contact</Link>
        <a href="mailto:rlemor@gmail.com">Email</a>
        <a href="https://www.linkedin.com/in/rlemor" target="_blank" rel="noreferrer">LinkedIn <span aria-hidden="true">↗</span></a>
      </nav>
    </footer>
  );
}
