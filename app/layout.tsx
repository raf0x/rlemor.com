import type { Metadata } from "next";
import { Newsreader, Source_Sans_3 } from "next/font/google";
import "./globals.css";

const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-newsreader",
  display: "swap",
});

const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-source-sans",
  display: "swap",
});

const siteDescription =
  "Operations, customer experience, product judgment, and practical AI execution.";

export const metadata: Metadata = {
  metadataBase: new URL("https://rlemor.com"),
  title: "Rafael Lemor",
  description: siteDescription,
  openGraph: {
    title: "Rafael Lemor",
    description: siteDescription,
    url: "/",
    siteName: "Rafael Lemor",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Rafael Lemor",
    description: siteDescription,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${newsreader.variable} ${sourceSans.variable}`}>
        {children}
      </body>
    </html>
  );
}
