"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./site-header.module.css";

const links = [
  ["/work", "Work"],
  ["/projects", "Projects"],
  ["/about", "About"],
  ["/contact", "Contact"],
] as const;

export default function SiteHeader() {
  const pathname = usePathname();
  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <header className={styles.header}>
        <div className={styles.inner}>
          <Link className={styles.name} href="/">
            Rafael Lemor<span>.</span>
          </Link>
          <nav className={styles.nav} aria-label="Primary navigation">
            {links.map(([href, label]) => (
              <Link
                key={href}
                href={href}
                aria-current={pathname === href ? "page" : undefined}
                className={
                  pathname.startsWith(href) ? styles.active : undefined
                }
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
    </>
  );
}
