import type { Metadata } from "next";
import Link from "next/link";
import localFont from "next/font/local";
import { ORG } from "@/lib/config";
import Nav from "@/components/Nav";
import "./globals.css";

// Liberation Serif, SIL Open Font License (see app/fonts/LiberationSerif-LICENSE.txt).
const liberation = localFont({
  variable: "--font-liberation",
  src: [
    { path: "./fonts/LiberationSerif-Regular.ttf", weight: "400", style: "normal" },
    { path: "./fonts/LiberationSerif-Italic.ttf", weight: "400", style: "italic" },
    { path: "./fonts/LiberationSerif-Bold.ttf", weight: "700", style: "normal" },
    { path: "./fonts/LiberationSerif-BoldItalic.ttf", weight: "700", style: "italic" },
  ],
});

export const metadata: Metadata = {
  title: { default: ORG.name, template: `%s · ${ORG.name}` },
  description:
    "A crowd-sourced, spiritual community built from the shared wisdom of the world's mythologies.",
  icons: { icon: "/emblem.svg" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={liberation.variable}>
      <body>
        <header className="site-header">
          <div className="wrap">
            <Link className="brand" href="/">
              <img src="/emblem.svg" alt="" width={40} height={40} />
              <span>{ORG.name}</span>
            </Link>
            <Nav />
          </div>
        </header>
        <main>{children}</main>
        <footer className="site-footer">
          <div className="wrap">
            <div>
              <strong>{ORG.name}</strong>
              <br />
              {ORG.tagline}
            </div>
            <div>
              <Link href="/foundation">Foundational Understanding</Link> &middot;{" "}
              <Link href="/tenets">Tenets</Link> &middot;{" "}
              <Link href="/definitions">Definitions</Link> &middot;{" "}
              <Link href="/books">Books of Considerations</Link> &middot;{" "}
              <Link href="/hear-my-voice">Hear My Voice</Link> &middot;{" "}
              <Link href="/account">Account</Link>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
