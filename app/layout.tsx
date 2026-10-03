import type { Metadata } from "next";
import Link from "next/link";
import { Cormorant_Garamond, EB_Garamond } from "next/font/google";
import { ORG, SITE } from "@/lib/config";
import Nav from "@/components/Nav";
import "./globals.css";

const display = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const body = EB_Garamond({
  variable: "--font-body",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: { default: SITE.name, template: `%s · ${SITE.name}` },
  description:
    "A crowd-sourced, spiritual community built from the shared wisdom of the world's mythologies.",
  icons: { icon: "/emblem.svg" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body>
        <header className="site-header">
          <div className="wrap">
            <Link className="brand" href="/">
              <img src="/emblem.svg" alt="" width={34} height={34} />
              <span>{SITE.name}</span>
            </Link>
            <Nav />
          </div>
        </header>
        <main>{children}</main>
        <footer className="site-footer">
          <div className="wrap">
            <div>
              <strong>{SITE.name}</strong>
              <br />
              {ORG.name}
            </div>
            <div>
              <Link href="/aspirations">Sacred Aspirations</Link> &middot;{" "}
              <Link href="/books">Books of Considerations</Link> &middot;{" "}
              <Link href="/hear-my-voice">Hear My Voice</Link> &middot;{" "}
              <Link href="/council">Council</Link> &middot; <Link href="/account">Account</Link>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
