import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import styles from "./about.module.css";

const description =
  "Meet Rafael Lemor: Miami-based, people-focused, and curious about travel, football, and building useful things.";

export const metadata: Metadata = {
  title: "About | Rafael Lemor",
  description,
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: "About | Rafael Lemor",
    description,
    url: "/about",
    siteName: "Rafael Lemor",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "About | Rafael Lemor",
    description,
  },
};

export default function AboutPage() {
  return (
    <>
      <SiteHeader />

      <main id="main-content" tabIndex={-1} className={styles.page}>
        <section className={styles.intro}>
          <p className={styles.eyebrow}>About me</p>
          <h1>A people person.<br />Always curious.</h1>

          <div className={styles.introLayout}>
            <div className={styles.introCopy}>
              <p className={styles.lead}>
                I&apos;m Rafael, based in Miami. My background is in customer
                success, account management, and operations. The common thread
                is people: understanding what they need and helping things run
                smoothly.
              </p>
              <p>
                I&apos;ve worked across enterprise software, travel, and major
                sporting events. Those settings are different, but they all
                depend on clear communication, thoughtful service, and following
                through on the details.
              </p>
              <Link className={styles.textLink} href="/work">
                Explore my professional experience <span aria-hidden="true">&rarr;</span>
              </Link>
            </div>

            <div className={styles.portraitFrame}>
              <Image
                className={styles.portrait}
                src="/images/rafael-portrait.jpg"
                alt="Rafael Lemor"
                fill
                sizes="(max-width: 380px) calc(100vw - 48px), 320px"
              />
            </div>
          </div>
        </section>

        <section className={styles.storySection} aria-labelledby="beyond-work">
          <figure className={styles.travelFigure}>
            <Image
              className={styles.travelImage}
              src="/images/about-travel2.jpg"
              alt="Rafael looking across the water toward Angkor Wat at sunrise"
              width={4032}
              height={3024}
              sizes="(max-width: 760px) calc(100vw - 48px), (max-width: 1230px) 43vw, 480px"
            />
            <figcaption>A quiet moment on the road in Southeast Asia.</figcaption>
          </figure>
          <div className={styles.storyCopy}>
            <h2 id="beyond-work">Curiosity beyond work.</h2>
            <p>
              Travel is one of my biggest interests. A three-month backpacking
              trip through Southeast Asia gave me time to explore new places,
              meet people, and see everyday life from a different perspective.
            </p>
            <p>
              Football is another constant. That made working around the World
              Cup a particularly meaningful chapter. At FIFA, I helped
              commercial partners navigate ticketing across four global
              tournaments, culminating in the 2026 World Cup.
            </p>
          </div>
        </section>

        <section className={styles.buildingSection} aria-labelledby="building">
          <h2 id="building">Making useful things.</h2>
          <div className={styles.storyCopy}>
            <p>
              More recently, I&apos;ve brought that curiosity into independent
              product building. I use AI and modern development tools to take a
              practical problem from an initial question to a working solution,
              then test and refine it.
            </p>
            <p>
              It&apos;s another way to explore the things I care about at work:
              reducing friction, making information easier to use, and helping
              people get things done.
            </p>
            <Link className={styles.textLink} href="/projects">
              See my independent projects <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
        </section>

        <section className={styles.contactSection} aria-labelledby="say-hello">
          <div>
            <h2 id="say-hello">Good things start with a conversation.</h2>
            <p>Want to talk about my experience or something you&apos;re working on?</p>
          </div>
          <Link className={styles.button} href="/contact">Get in touch <span aria-hidden="true">&rarr;</span></Link>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
