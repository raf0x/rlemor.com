import Link from "next/link";
import MyPepEditorialPhone from "./MyPepEditorialPhone";
import styles from "./mypep-editorial.module.css";

export default function MyPepEditorialFeature() {
  return <article className={styles.feature} aria-labelledby="mypep-feature-title">
    <div className={styles.copy}>
      <p className={styles.eyebrow}>Independently shipped for iPhone</p>
      <h3 id="mypep-feature-title" className={styles.title}><Link href="/projects/mypepprotocol">MyPepProtocol</Link></h3>
      <p className={styles.statement}>One place for the details that matter.</p>
      <div className={styles.details}>
        <div><h4>The idea</h4><p>Keep treatment plans, schedules, inventory, and health records connected, without entering the same information twice.</p></div>
        <div><h4>The build</h4><p>An independent iPhone app that makes complex personal tracking easier to inspect and manage over time.</p></div>
      </div>
      <div className={styles.actions}>
        <a className={styles.primary} href="https://apps.apple.com/us/app/mypepprotocol/id6819932878" target="_blank" rel="noopener noreferrer">View on App Store <span aria-hidden="true">↗</span></a>
        <Link className={styles.secondary} href="/projects/mypepprotocol">Read case study <span aria-hidden="true">→</span></Link>
      </div>
    </div>
    <MyPepEditorialPhone />
    <div className={styles.meta}><span><small>Product</small>Personal health tracking</span><span><small>Platform</small>iPhone · iOS</span><span><small>Release</small>2026</span></div>
  </article>;
}
