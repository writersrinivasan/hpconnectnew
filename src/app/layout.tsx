import type { Metadata } from "next";
import { JetBrains_Mono, Plus_Jakarta_Sans } from "next/font/google";
import LauncherGate from "@/components/assistant/LauncherGate";
import Nav from "@/components/Nav";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({ variable: "--font-jakarta", subsets: ["latin"] });
const mono = JetBrains_Mono({ variable: "--font-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CareAgents · Agentic AI for MSMEs",
  description: "See how a team of AI agents, built with LangGraph, RAG and MCP and governed by guardrails, runs a healthcare clinic's daily workflow.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${jakarta.variable} ${mono.variable} h-full`}>
      <body className="min-h-full flex flex-col">
        <Nav />
        <main className="flex-1">{children}</main>
        <footer className="border-t border-line py-6 text-center text-sm text-muted">
          CareAgents demo · Built with Next.js + LangGraph · Simulated patient data for education only
        </footer>
        <LauncherGate />
      </body>
    </html>
  );
}
