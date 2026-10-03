import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import styles from "./case-study.module.css";

const description =
  "How MyPepProtocol uses product rules, evidence, and explicit constraints to manage complex health records.";

export const metadata: Metadata = {
  title: "MyPepProtocol Case Study | Rafael Lemor",
  description,
  alternates: {
    canonical: "/work/mypepprotocol",
  },
  openGraph: {
    title: "MyPepProtocol Case Study | Rafael Lemor",
    description,
    url: "/work/mypepprotocol",
    siteName: "Rafael Lemor",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "MyPepProtocol Case Study | Rafael Lemor",
    description,
  },
};

export default function MyPepProtocolCaseStudy() {
  return (
    <>
      <SiteHeader />

      <main className={styles.page}>
        <article className={styles.caseStudy}>
          <header className={styles.intro}>
            <p className={styles.eyebrow}>MyPepProtocol</p>

            <h1>Designing a health record around evidence, not assumptions.</h1>

            <div className={styles.introCopy}>
              <p>
                MyPepProtocol is a private health product for people managing
                complex protocols and the records that accumulate around them.
              </p>

              <p>
                I started with a practical problem: the same information was
                being repeated across setup, schedules, inventory, labs and
                notes, while the context connecting those records was easy to
                lose.
              </p>

              <p>
                The product is built around a simple idea: record facts once,
                reuse them carefully, and keep the evidence behind any summary
                close enough to inspect.
              </p>
            </div>

            <p className={styles.status}>
              Independent product · Live in early access · Ongoing development
            </p>
          </header>

          <figure className={styles.overviewFigure}>
            <Image
              className={`${styles.productImage} ${styles.desktopImage}`}
              src="/projects/mypepprotocol/overview-desktop.png"
              alt="MyPepProtocol Today view with demo summary metrics and active protocol records."
              width={2048}
              height={1342}
              priority
              sizes="(max-width: 760px) 1px, 1120px"
            />
            <Image
              className={`${styles.productImage} ${styles.mobileImage} ${styles.mobileOverview}`}
              src="/projects/mypepprotocol/overview-mobile.png"
              alt="MyPepProtocol mobile Today view with demo summary metrics and active protocols."
              width={780}
              height={1888}
              priority
              sizes="(max-width: 760px) calc(100vw - 48px), 1px"
            />
          </figure>

          <section className={styles.section}>
            <p className={styles.sectionLabel}>Product rules</p>

            <div className={styles.sectionContent}>
              <h2>Four constraints that shape the product.</h2>

              <div className={styles.rules}>
                <div className={styles.ruleRow}>
                  <h3>Record once.</h3>
                  <p>
                    If the product already has a fact, it should not ask for it
                    again without a reason.
                  </p>
                </div>

                <div className={styles.ruleRow}>
                  <h3>Do not turn missing information into an assumption.</h3>
                  <p>
                    Convenience should reduce unnecessary input, not make
                    decisions for the user.
                  </p>
                </div>

                <div className={styles.ruleRow}>
                  <h3>Keep intent separate from history.</h3>
                  <p>
                    Something planned for the future should not appear as
                    something that already happened.
                  </p>
                </div>

                <div className={styles.ruleRow}>
                  <h3>Make uncertainty visible.</h3>
                  <p>
                    When the record cannot support a comparison or conclusion,
                    the interface should say so.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className={`${styles.decision} ${styles.decisionOne}`}>
            <p className={styles.sectionLabel}>Decision 01</p>

            <div className={styles.decisionContent}>
              <p className={styles.eyebrow}>MyPepProtocol / Setup journey</p>
              <h2>From inventory to a protocol.</h2>

              <div className={styles.problem}>
                <p className={styles.microLabel}>User problem</p>
                <p>
                  People could record an inventory item, but starting a protocol
                  meant entering the same details again.
                </p>
              </div>

              <div className={styles.productDecision}>
                <p className={styles.microLabel}>Product decision</p>
                <h3>
                  Reuse known details.
                  <br />
                  Keep the user in control.
                </h3>

                <div className={styles.bodyCopy}>
                  <p>
                    Prefill only recorded name, strength, unit and compatible
                    preparation details. Let the user review the values and
                    choose when to start. Do not infer dose, schedule or
                    inventory quantity.
                  </p>

                  <p>
                    The distinction matters. Inventory can tell the product what
                    someone owns. It cannot tell the product how, when, or
                    whether that item should be used.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className={styles.decision}>
            <p className={styles.sectionLabel}>Decision 02</p>

            <div className={styles.decisionContent}>
              <p className={styles.eyebrow}>MyPepProtocol / Lifecycle</p>
              <h2>Planned is not the same as active.</h2>

              <div className={styles.problem}>
                <p className={styles.microLabel}>User problem</p>
                <p>
                  Someone may know what they intend to use without knowing when
                  they will begin. Treating that plan as active would
                  immediately give it a week number, schedule and place in the
                  health timeline.
                </p>
              </div>

              <div className={styles.productDecision}>
                <p className={styles.microLabel}>Product decision</p>
                <h3>
                  Preserve the setup.
                  <br />
                  Do not create history before it exists.
                </h3>

                <div className={styles.bodyCopy}>
                  <p>
                    A Planned protocol can keep its compounds and dosing setup
                    without a start date. It stays separate from active
                    protocols, today&apos;s schedule and recorded treatment
                    history.
                  </p>

                  <p>
                    When the user is ready, activation asks for a start date and
                    keeps the setup they already entered.
                  </p>

                  <p>
                    That required treating “planned” as a real product state,
                    not just another label on an active record.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className={styles.decision}>
            <p className={styles.sectionLabel}>Decision 03</p>

            <div className={styles.decisionContent}>
              <p className={styles.eyebrow}>MyPepProtocol / Health history</p>
              <h2>Show the change. Keep the caveat.</h2>

              <div className={styles.problem}>
                <p className={styles.microLabel}>User problem</p>
                <p>
                  A health record can contain dozens of measurements across
                  different dates, units and sources. Showing every delta creates
                  noise. Comparing everything automatically creates false
                  confidence.
                </p>
              </div>

              <div className={styles.productDecision}>
                <p className={styles.microLabel}>Product decision</p>
                <h3>
                  Rank what is useful.
                  <br />
                  Leave unsupported comparisons unresolved.
                </h3>

                <div className={styles.bodyCopy}>
                  <p>
                    MyPepProtocol derives changes from recorded evidence before
                    deciding what deserves attention in the interface.
                  </p>

                  <p>
                    Compatible history can show movement over time and a
                    descriptive personal baseline. Incompatible units stay
                    separate. Ambiguous same-day results are not averaged into a
                    cleaner answer. Imported results with low extraction
                    confidence keep a visible verification warning.
                  </p>

                  <p>
                    The interface then surfaces only a small number of useful
                    findings by default, with the underlying evidence and
                    limitations available when someone wants to inspect them.
                  </p>

                  <p>
                    The ranking is presentation priority, not medical urgency.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className={`${styles.decision} ${styles.decisionFour}`}>
            <p className={styles.sectionLabel}>Decision 04</p>

            <div className={styles.decisionContent}>
              <p className={styles.eyebrow}>MyPepProtocol / Guided analysis</p>
              <h2>Put AI after the evidence.</h2>

              <div className={styles.problem}>
                <p className={styles.microLabel}>User problem</p>
                <p>
                  AI can make a complicated record easier to scan. It can also
                  invent context, overstate a relationship, or turn timing into
                  causality if the boundaries are vague.
                </p>
              </div>

              <div className={styles.productDecision}>
                <p className={styles.microLabel}>Product decision</p>
                <h3>
                  Establish the facts first.
                  <br />
                  Let AI explain within them.
                </h3>

                <div className={styles.bodyCopy}>
                  <p>
                    The Guided Health Analyst begins with focused questions such
                    as what changed since the last labs, what information is
                    missing, or what protocol timing was recorded around a lab
                    date.
                  </p>

                  <p>
                    The product assembles the relevant evidence first. AI
                    processing requires the user&apos;s consent, and each
                    generated finding has to point back to evidence the system
                    actually supplied.
                  </p>

                  <p>
                    The interface keeps that evidence inspectable and shows
                    evidence limits alongside the summary.
                  </p>

                  <p>
                    The same principle carries into Doctor Report: the report
                    facts are deterministic. AI can optionally help phrase a
                    short overview, but the report does not depend on it.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className={styles.section}>
            <p className={styles.sectionLabel}>Constraints</p>

            <div className={styles.sectionContent}>
              <h2>Deliberate constraints</h2>

              <div className={styles.bodyCopy}>
                <p>
                  Some of the most important product decisions were decisions
                  not to automate.
                </p>

                <p>
                  Inventory quantity does not decrease simply because a protocol
                  was created. Planned treatments do not become active history
                  until a start date exists. Mixed or ambiguous lab evidence is
                  not silently normalized into a comparison. Timing between a
                  protocol change and a lab result is not presented as proof
                  that one caused the other.
                </p>

                <p>
                  These choices leave some manual work and some unanswered
                  questions. That is preferable to making the record look more
                  certain than the underlying evidence supports.
                </p>
              </div>
            </div>
          </section>

          <section className={styles.section}>
            <p className={styles.sectionLabel}>Lessons</p>

            <div className={styles.sectionContent}>
              <h2>What the project changed in how I build</h2>

              <div className={styles.lessons}>
                <div className={styles.lessonRow}>
                  <span>01</span>
                  <div>
                    <h3>
                      Reducing input and reducing user control are different
                      things.
                    </h3>
                    <p>
                      Good defaults should remove repetition while leaving
                      consequential decisions visible.
                    </p>
                  </div>
                </div>

                <div className={styles.lessonRow}>
                  <span>02</span>
                  <div>
                    <h3>Uncertainty needs its own product design.</h3>
                    <p>
                      “We do not have enough evidence to say” is a useful state,
                      not an error to hide.
                    </p>
                  </div>
                </div>

                <div className={styles.lessonRow}>
                  <span>03</span>
                  <div>
                    <h3>
                      AI became more useful after the non-AI product rules were
                      explicit.
                    </h3>
                    <p>
                      The stronger the evidence model and constraints became,
                      the narrower and more useful the AI&apos;s job became.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className={styles.section}>
            <p className={styles.sectionLabel}>Status</p>

            <div className={styles.sectionContent}>
              <h2>Current status</h2>

              <div className={styles.bodyCopy}>
                <p>
                  MyPepProtocol is live in early access and remains under active
                  development.
                </p>

                <p>
                  The current direction is consistent with the decisions above:
                  reduce unnecessary maintenance, keep longitudinal records
                  connected, surface useful context quickly, and preserve the
                  evidence and limitations behind it.
                </p>
              </div>
            </div>
          </section>

          <section className={`${styles.section} ${styles.finalCta}`}>
            <p className={styles.sectionLabel}>Current product</p>

            <div className={styles.sectionContent}>
              <h2>See the current product</h2>
              <p>MyPepProtocol is a working product, not a static prototype.</p>

              <div className={styles.actions}>
                <a
                  className={styles.primaryAction}
                  href="https://www.mypepprotocol.app/"
                  target="_blank"
                  rel="noreferrer"
                >
                  Visit MyPepProtocol
                </a>

                <Link className={styles.textLink} href="/work">
                  Back to Work
                </Link>
              </div>
            </div>
          </section>
        </article>
      </main>

      <SiteFooter />
    </>
  );
}
