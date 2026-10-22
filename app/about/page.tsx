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
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Rafael Lemor. Customer Success, global events, independent products.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: [
      {
        url: "/opengraph-image",
        alt: "Rafael Lemor. Customer Success, global events, independent products.",
      },
    ],
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
          <h1>A little more about me.</h1>

          <div className={styles.introLayout}>
            <div className={styles.introCopy}>
              <p className={styles.lead}>
                I&apos;m Rafael, based in Miami. Enterprise software and global
                sporting events have taken me into some complex situations,
                but the moments that stay with me are often surprisingly personal.
              </p>
              <p>
                During the 2026 World Cup, I supported the Miami Host City
                Committee throughout the tournament. Just two or three days
                before the sold-out Mexico–England match in Mexico City, my point
                of contact called me directly. Four tickets intended for the
                organization&apos;s CEO had mistakenly gone to other people
                during their internal distribution.
              </p>
              <p>
                I started coordinating across FIFA teams, eventually reaching
                our ticketing director, who helped us secure four replacement
                tickets in time.
              </p>
              <p>
                After the committee&apos;s tournament participation ended with
                the third-place match in Miami, they invited me to their
                offices to celebrate together. It&apos;s still one of my
                favorite memories from that World Cup.
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
            <h2 id="beyond-work">Outside of work.</h2>
            <p>
              Travel is one of my biggest interests. A three-month backpacking
              trip through Southeast Asia gave me time to explore new places,
              meet people, and see everyday life from a different perspective.
            </p>
            <p>
              Football is another constant. It was part of my life long before
              I worked at FIFA, and seeing the World Cup from behind the scenes
              was a rare way to experience something I already loved.
            </p>
          </div>
        </section>

        <section className={styles.buildingSection} aria-labelledby="building">
          <h2 id="building">Making useful things.</h2>
          <div className={styles.storyCopy}>
            <p>
              I&apos;ve also started building independent products. I use AI and
              modern development tools to take a practical problem from an
              initial question to a working solution, then test and refine it.
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
