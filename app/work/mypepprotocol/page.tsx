import type { Metadata } from "next";
import styles from "./case-study.module.css";

export const metadata: Metadata = {
  title: "MyPepProtocol — Setup journey | Rafael Lemor",
  description:
    "A product decision from MyPepProtocol: carrying recorded inventory details into protocol setup while keeping the user in control.",
};

export default function MyPepProtocolSetupJourney() {
  return (
    <main className={styles.page}>
      <section className={styles.story}>
        <p className={styles.eyebrow}>MyPepProtocol / Setup journey</p>

        <h1>From inventory to a protocol.</h1>

        <div className={styles.problem}>
          <p className={styles.label}>The user problem</p>
          <p className={styles.problemCopy}>
            People could record an inventory item, but starting a protocol meant
            entering the same details again.
          </p>
        </div>

        <div
          className={styles.capture}
          role="img"
          aria-label="Development placeholder for the missing share-safe MyPepProtocol inventory-to-protocol capture"
        >
          <div className={styles.desktopCaptureCopy}>
            <strong>Inventory → protocol screenshot required</strong>
            <span>
              Need a share-safe real capture showing recorded details entering
              protocol setup
            </span>
            <span>
              Desktop crop must keep the relevant controls and prefilled values
              legible
            </span>
            <span>No product UI has been simulated</span>
          </div>

          <div className={styles.mobileCaptureCopy}>
            <strong>Inventory → protocol screenshot required</strong>
            <span>Use a genuine mobile capture or deliberate detail crop</span>
            <span>
              Prefilled values and review controls must remain legible
            </span>
            <span>No simulated UI</span>
          </div>
        </div>

        <p className={styles.desktopEvidence}>
          Required evidence: prefilled known details plus the user-controlled
          start choice.
        </p>

        <p className={styles.mobileEvidence}>
          Mobile validation remains pending until the real capture is
          substituted. Do not shrink a desktop screenshot into this column.
        </p>

        <div className={styles.decision}>
          <p className={styles.label}>Product decision</p>

          <div className={styles.decisionContent}>
            <h2>
              Reuse known details.
              <br />
              Keep the user in control.
            </h2>

            <p>
              Prefill only recorded name, strength, unit and compatible
              preparation details. Let the user review the values and choose
              when to start. Do not infer dose, schedule or inventory quantity.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
