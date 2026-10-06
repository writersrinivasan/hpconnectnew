import type { Metadata } from "next";
import Deck from "@/components/slides/Deck";

export const metadata: Metadata = { title: "Slides · Agentic AI for MSMEs · OneYoto" };

export default function Page() {
  return <Deck />;
}
