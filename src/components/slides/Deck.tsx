"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Columns2, ExternalLink, LayoutGrid, Maximize, NotebookPen, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { BRAND } from "./kit";
import { AGENDA, SLIDES, SPEAKER } from "./slides";

const W = 1600;
const H = 900;

function useFit(ref: React.RefObject<HTMLDivElement | null>) {
  const [scale, setScale] = useState(0.5);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setScale(Math.min(e.contentRect.width / W, e.contentRect.height / H)));
    ro.observe(el);
    return () => ro.disconnect();
  }, [ref]);
  return scale;
}

function readHash() {
  if (typeof window === "undefined") return 0;
  const n = Number.parseInt(window.location.hash.slice(1), 10);
  return Number.isFinite(n) ? Math.min(Math.max(n - 1, 0), SLIDES.length - 1) : 0;
}

function SlideFrame({ i, children, onLive }: { i: number; children: ReactNode; onLive?: () => void }) {
  const s = SLIDES[i];
  const bare = s.id === "title" || s.id === "quote";
  return (
    <div className="relative h-full w-full overflow-hidden bg-[#070a17] text-white">
      {/* backdrop */}
      <div className="absolute inset-0" style={{ background: `radial-gradient(900px 600px at 0% 0%, rgba(139,92,246,.22), transparent 60%), radial-gradient(800px 600px at 100% 0%, rgba(6,182,212,.16), transparent 60%), radial-gradient(700px 500px at 100% 100%, ${BRAND.yellow}1f, transparent 60%)` }} />
      <div className="grid-bg absolute inset-0 opacity-60" />
      <div className="absolute bottom-[-150px] right-[30px] select-none text-[560px] font-black leading-none" style={{ color: `${BRAND.yellow}0f` }}>
        1
      </div>
      {/* content */}
      <div className="absolute inset-0 px-[90px] pb-[110px] pt-[80px]">{children}</div>
      {/* live chip */}
      {s.live && (
        <button onClick={onLive} className="absolute right-[60px] top-[36px] flex items-center gap-2 rounded-full border-2 border-cyan-300/60 bg-cyan-400/15 px-5 py-2 text-[20px] font-bold text-cyan-200 hover:bg-cyan-400/25">
          <span className="h-3 w-3 animate-pulse rounded-full bg-red-500" /> LIVE · {s.live.label}
        </button>
      )}
      {/* footer */}
      {!bare && (
        <div className="absolute inset-x-[60px] bottom-[34px] flex items-center gap-5 text-[19px] text-white/50">
          <Image src="/brand/oneyoto-logo.png" alt="OneYoto" width={96} height={40} className="h-auto w-[86px]" />
          <span className="h-6 w-px bg-white/20" />
          <span className="font-semibold">{SPEAKER.name}</span>
          <span className="ml-auto font-semibold uppercase tracking-[.2em]" style={{ color: BRAND.yellow }}>
            {s.section}
          </span>
          <span className="font-mono">
            {String(i + 1).padStart(2, "0")} / {SLIDES.length}
          </span>
        </div>
      )}
      <div className="absolute bottom-0 left-0 h-[6px]" style={{ width: `${((i + 1) / SLIDES.length) * 100}%`, background: `linear-gradient(90deg, ${BRAND.yellow}, ${BRAND.red})` }} />
    </div>
  );
}

function Agenda({ go }: { go: (id: string) => void }) {
  return (
    <div>
      <div className="mb-5 inline-flex rounded-full border-2 px-5 py-1.5 text-[22px] font-extrabold uppercase tracking-[.22em]" style={{ borderColor: `${BRAND.yellow}66`, color: BRAND.yellow }}>
        Today&apos;s agenda
      </div>
      <h2 className="text-[76px] font-extrabold leading-none tracking-tight">
        See it. <span className="grad-text">Then believe it.</span>
      </h2>
      <div className="mt-12 grid grid-cols-2 gap-x-8 gap-y-4">
        {AGENDA.map((a, i) => (
          <motion.button key={a.t} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.08 * i }} onClick={() => go(a.s)} className="flex items-center gap-5 rounded-2xl border-2 bg-white/[.04] px-6 py-4 text-left hover:bg-white/[.08]" style={{ borderColor: `${a.c}55` }}>
            <span className="grid h-14 w-14 shrink-0 place-items-center rounded-xl text-[26px] font-black text-black" style={{ background: a.c }}>
              {i + 1}
            </span>
            <span className="text-[30px]">{a.e}</span>
            <span className="text-[29px] font-bold">{a.t}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}

export default function Deck() {
  const [i, setI] = useState(0);
  const [split, setSplit] = useState(false);
  const [notes, setNotes] = useState(false);
  const [grid, setGrid] = useState(false);
  const [dir, setDir] = useState(1);
  const [liveHref, setLiveHref] = useState("/live");
  const [frameKey, setFrameKey] = useState(0);
  const stage = useRef<HTMLDivElement>(null);
  const scale = useFit(stage);

  const go = useCallback((n: number) => {
    const next = Math.min(Math.max(n, 0), SLIDES.length - 1);
    setI((cur) => {
      setDir(next >= cur ? 1 : -1);
      return next;
    });
    window.history.replaceState(null, "", `#${next + 1}`);
  }, []);

  // initial slide from URL hash (#5)
  useEffect(() => {
    const n = readHash();
    if (n) queueMicrotask(() => go(n));
  }, [go]);

  // keep the side-by-side app in sync with the current slide's live page
  const live = SLIDES[i].live;
  const wanted = live?.href;
  if (wanted && wanted !== liveHref) {
    setLiveHref(wanted);
    setFrameKey((k) => k + 1);
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement)?.closest("input,textarea")) return;
      if (["ArrowRight", "PageDown", " "].includes(e.key)) {
        e.preventDefault();
        go(i + 1);
      } else if (["ArrowLeft", "PageUp"].includes(e.key)) go(i - 1);
      else if (e.key === "Home") go(0);
      else if (e.key === "End") go(SLIDES.length - 1);
      else if (e.key.toLowerCase() === "s") setSplit((v) => !v);
      else if (e.key.toLowerCase() === "n") setNotes((v) => !v);
      else if (e.key.toLowerCase() === "g" || e.key === "Escape") setGrid((v) => (e.key === "Escape" ? false : !v));
      else if (e.key.toLowerCase() === "f") void (document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen());
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [i, go]);

  const s = SLIDES[i];
  const content = s.id === "agenda" ? <Agenda go={(id) => go(SLIDES.findIndex((x) => x.id === id))} /> : s.render();

  return (
    <div className="fixed inset-0 z-[80] flex flex-col bg-black text-white">
      <div className={`grid min-h-0 flex-1 ${split ? "grid-cols-[minmax(0,0.82fr)_minmax(0,1fr)] gap-2 p-2" : ""}`}>
        {/* slide stage */}
        <div ref={stage} className="relative grid min-h-0 place-items-center overflow-hidden" onClick={(e) => { if (!split && e.target === e.currentTarget) go(i + 1); }}>
          <div style={{ width: W * scale, height: H * scale }} className="relative overflow-hidden rounded-lg shadow-2xl">
            <div style={{ width: W, height: H, transform: `scale(${scale})`, transformOrigin: "top left" }} className="absolute left-0 top-0">
              <AnimatePresence mode="popLayout" initial={false} custom={dir}>
                <motion.div key={i} custom={dir} initial={{ opacity: 0, x: 80 * dir }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -80 * dir }} transition={{ duration: 0.35, ease: "easeOut" }} className="absolute inset-0">
                  <SlideFrame i={i} onLive={() => setSplit(true)}>
                    {content}
                  </SlideFrame>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
        {/* live app, side by side */}
        {split && (
          <div className="flex min-h-0 flex-col overflow-hidden rounded-lg border border-white/15 bg-[#060914]">
            <div className="flex items-center gap-3 border-b border-white/10 px-3 py-2 text-sm">
              <span className="flex items-center gap-2 font-bold text-cyan-300">
                <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-red-500" /> LIVE APP
              </span>
              <span className="truncate rounded bg-white/10 px-2 py-0.5 font-mono text-xs">{liveHref}</span>
              <a href={liveHref} target="_blank" rel="noreferrer" className="ml-auto flex items-center gap-1 text-xs text-white/60 hover:text-white">
                <ExternalLink className="h-3.5 w-3.5" /> new tab
              </a>
              <button onClick={() => setSplit(false)} className="rounded p-1 hover:bg-white/10" title="Close (S)">
                <X className="h-4 w-4" />
              </button>
            </div>
            <iframe key={frameKey} src={liveHref} className="min-h-0 flex-1 bg-[#060914]" title="Live app" />
          </div>
        )}
      </div>

      {/* speaker notes */}
      <AnimatePresence>
        {notes && (
          <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden border-t border-white/10 bg-[#0d1226]">
            <div className="flex gap-4 px-5 py-3">
              <NotebookPen className="mt-1 h-5 w-5 shrink-0 text-amber-300" />
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-amber-300">Speaker notes · slide {i + 1}</div>
                <div className="text-[15px] leading-relaxed text-white/85">{s.notes}</div>
                {i + 1 < SLIDES.length && <div className="mt-1 text-xs text-white/40">Next: {SLIDES[i + 1].section} · {SLIDES[i + 1].id}</div>}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* control bar */}
      <div className="flex items-center gap-1 border-t border-white/10 bg-[#070a17] px-3 py-1.5 text-sm">
        <button onClick={() => go(i - 1)} className="rounded-lg p-2 hover:bg-white/10" title="Previous (←)">
          <ChevronLeft className="h-5 w-5" />
        </button>
        <span className="w-16 text-center font-mono text-xs text-white/60">
          {i + 1} / {SLIDES.length}
        </span>
        <button onClick={() => go(i + 1)} className="rounded-lg p-2 hover:bg-white/10" title="Next (→)">
          <ChevronRight className="h-5 w-5" />
        </button>
        <div className="mx-2 h-5 w-px bg-white/15" />
        {[
          { on: split, set: () => setSplit(!split), icon: <Columns2 className="h-4 w-4" />, label: "Side-by-side live app", k: "S" },
          { on: notes, set: () => setNotes(!notes), icon: <NotebookPen className="h-4 w-4" />, label: "Notes", k: "N" },
          { on: grid, set: () => setGrid(!grid), icon: <LayoutGrid className="h-4 w-4" />, label: "Overview", k: "G" },
        ].map((b) => (
          <button key={b.k} onClick={b.set} className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-semibold ${b.on ? "bg-cyan-400/20 text-cyan-200" : "text-white/70 hover:bg-white/10"}`}>
            {b.icon} <span className="hidden md:inline">{b.label}</span> <kbd className="rounded bg-white/10 px-1 font-mono text-[10px]">{b.k}</kbd>
          </button>
        ))}
        <button onClick={() => void (document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen())} className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-semibold text-white/70 hover:bg-white/10">
          <Maximize className="h-4 w-4" /> <span className="hidden md:inline">Fullscreen</span> <kbd className="rounded bg-white/10 px-1 font-mono text-[10px]">F</kbd>
        </button>
        <Link href="/" className="ml-auto rounded-lg px-3 py-1.5 text-xs text-white/50 hover:bg-white/10 hover:text-white">
          Exit to app
        </Link>
      </div>

      {/* overview grid */}
      <AnimatePresence>
        {grid && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="scroll-thin absolute inset-0 z-10 overflow-y-auto bg-black/90 p-6 backdrop-blur">
            <div className="mb-4 flex items-center">
              <div className="text-lg font-bold">All slides</div>
              <button onClick={() => setGrid(false)} className="ml-auto rounded-lg p-2 hover:bg-white/10">
                <X />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
              {SLIDES.map((x, n) => (
                <div
                  key={x.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => { go(n); setGrid(false); }}
                  onKeyDown={(e) => { if (e.key === "Enter") { go(n); setGrid(false); } }}
                  className={`cursor-pointer overflow-hidden rounded-xl border-2 text-left ${n === i ? "border-amber-400" : "border-white/10 hover:border-white/40"}`}
                >
                  <div className="relative aspect-video w-full overflow-hidden">
                    <div style={{ width: W, height: H, transform: "scale(0.205)", transformOrigin: "top left" }} className="pointer-events-none absolute left-0 top-0">
                      <SlideFrame i={n}>{x.id === "agenda" ? <Agenda go={() => {}} /> : x.render()}</SlideFrame>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 text-xs">
                    <span className="font-mono text-white/50">{n + 1}</span>
                    <span className="font-semibold">{x.section}</span>
                    {x.live && <span className="ml-auto text-cyan-300">● live</span>}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
