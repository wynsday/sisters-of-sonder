import type { Metadata } from "next";
import glossary from "@/lib/glossary.json";
import GlossaryBrowser from "./GlossaryBrowser";

export const metadata: Metadata = {
  title: glossary.title,
  description: "Named and numbered behaviors that harm groups of people, so they can be recognized and avoided.",
};

export default function Glossary() {
  return (
    <>
      <div className="page-hero">
        <div className="wrap">
          <h1>{glossary.title}</h1>
        </div>
      </div>
      <section>
        <div className="wrap read">
          <GlossaryBrowser glossary={glossary} />
        </div>
      </section>
    </>
  );
}
