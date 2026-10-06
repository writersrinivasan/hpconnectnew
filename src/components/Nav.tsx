"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const LINKS = [
  { href: "/", label: "The Story", n: "01" },
  { href: "/concepts", label: "RAG · MCP · Orchestration", n: "02" },
  { href: "/live", label: "Live Agents", n: "03" },
  { href: "/architecture", label: "Architecture", n: "04" },
  { href: "/trust", label: "Trust & Safety", n: "05" },
  { href: "/takeaways", label: "Take Home", n: "06" },
  { href: "/assistant", label: "🤖 CareBot", n: "AI" },
];

export default function Nav() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 border-b border-line bg-bg/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-[1400px] items-center gap-6 px-4 py-3 md:px-6">
        <Link href="/" className="flex items-center gap-2.5 font-extrabold tracking-tight">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-violet-500 via-cyan-400 to-emerald-400 text-lg shadow-lg shadow-violet-500/30">✚</span>
          <span className="text-lg">
            Care<span className="grad-text">Agents</span>
          </span>
        </Link>
        <nav className="ml-auto hidden items-center gap-1 lg:flex">
          {LINKS.map((l) => {
            const active = l.href === "/" ? path === "/" : path.startsWith(l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`rounded-full px-3.5 py-2 text-sm font-semibold transition ${active ? "bg-white/10 text-white" : "text-muted hover:bg-white/5 hover:text-white"} ${l.href === "/live" && !active ? "text-cyan-300" : ""}`}
              >
                <span className="mr-1.5 font-mono text-[11px] opacity-50">{l.n}</span>
                {l.label}
              </Link>
            );
          })}
        </nav>
        <button className="ml-auto rounded-lg p-2 lg:hidden" onClick={() => setOpen(!open)} aria-label="Menu">
          {open ? <X /> : <Menu />}
        </button>
      </div>
      {open && (
        <nav className="grid gap-1 border-t border-line px-4 py-3 lg:hidden">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)} className="rounded-lg px-3 py-2 font-semibold hover:bg-white/5">
              <span className="mr-2 font-mono text-xs opacity-50">{l.n}</span>
              {l.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
