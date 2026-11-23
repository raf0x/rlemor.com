import Image from "next/image";
import styles from "./mypep-editorial.module.css";

export default function MyPepEditorialPhone({ priority = false }: { priority?: boolean }) {
  return <figure className={styles.visual}>
    <div className={styles.halo} aria-hidden="true" />
    <div className={styles.device}>
      <div className={styles.screen}>
        <div className={styles.statusBar} aria-hidden="true"><span>9:41</span><span className={styles.island} /><span>● ▰ ▰</span></div>
        <Image className={styles.screenshot}
          src="/projects/mypepprotocol/privacy-dashboard.webp"
          alt="Actual MyPepProtocol iPhone Today interface with health trends, daily focus and colorful protocol circles. Personal entries are obscured."
          width={450} height={800}
          sizes="(max-width: 640px) min(80vw, 340px), (max-width: 1000px) 330px, 390px"
          priority={priority} />
      </div>
    </div>
    <figcaption className={styles.caption}>Actual app screen. Personal health details obscured.</figcaption>
  </figure>;
}
