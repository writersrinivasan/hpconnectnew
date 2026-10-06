import type { Metadata } from "next";
import LiveDemo from "@/components/live/LiveDemo";

export const metadata: Metadata = { title: "Live Agents · CareAgents" };

export default function Page() {
  return <LiveDemo />;
}
