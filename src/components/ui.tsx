import type { ReactNode } from "react";

export function Eyebrow({ children, color = "#22d3ee" }: { children: ReactNode; color?: string }) {
  return (
    <div className="mb-3 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-[.18em]" style={{ borderColor: `${color}55`, color, background: `${color}12` }}>
      {children}
    </div>
  );
}

export function SectionHead({ eyebrow, title, sub, color }: { eyebrow: string; title: ReactNode; sub?: ReactNode; color?: string }) {
  return (
    <div className="mx-auto mb-10 max-w-3xl text-center">
      <Eyebrow color={color}>{eyebrow}</Eyebrow>
      <h2 className="text-3xl font-extrabold tracking-tight md:text-5xl">{title}</h2>
      {sub && <p className="mt-4 text-lg text-muted">{sub}</p>}
    </div>
  );
}

export function PageHero({ eyebrow, title, sub, color }: { eyebrow: string; title: ReactNode; sub: ReactNode; color?: string }) {
  return (
    <section className="mx-auto max-w-5xl px-4 pb-10 pt-14 text-center md:pt-20">
      <Eyebrow color={color}>{eyebrow}</Eyebrow>
      <h1 className="text-4xl font-extrabold leading-[1.05] tracking-tight md:text-6xl">{title}</h1>
      <p className="mx-auto mt-5 max-w-3xl text-lg text-muted md:text-xl">{sub}</p>
    </section>
  );
}
