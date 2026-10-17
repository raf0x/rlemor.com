import type { Metadata, Viewport } from "next";
import { Lora, DM_Sans } from "next/font/google";
import "./globals.css";

const lora = Lora({
  subsets: ["latin"],
  variable: "--font-lora",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

const siteDescription =
  "Rafael Lemor — customer success, enterprise account management, and large-event operations. Experience with FIFA, IMG Tickets, and enterprise customers.";

export const viewport: Viewport = {
  themeColor: "#fffcf7",
  colorScheme: "light",
};

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
      <body className={`${lora.variable} ${dmSans.variable}`}>
        {children}
      </body>
    </html>
  );
}
