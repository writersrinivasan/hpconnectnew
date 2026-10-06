import type { CSSProperties, ReactNode } from "react";

// Building blocks for the 1600×900 slide canvas.

export const BRAND = { yellow: "#FCC204", red: "#F7090F" };

export function Kicker({ children, color = BRAND.yellow }: { children: ReactNode; color?: string }) {
  return (
    <div className="mb-5 inline-flex items-center gap-3 rounded-full border-2 px-5 py-1.5 text-[22px] font-extrabold uppercase tracking-[.22em]" style={{ borderColor: `${color}66`, color, background: `${color}14` }}>
      {children}
    </div>
  );
}

export function H({ children, size = 76 }: { children: ReactNode; size?: number }) {
  return (
    <h2 className="font-extrabold leading-[1.04] tracking-tight" style={{ fontSize: size }}>
      {children}
    </h2>
  );
}

export function Sub({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return (
    <p className="mt-5 max-w-[1250px] text-[30px] leading-snug text-white/70" style={style}>
      {children}
    </p>
  );
}

export function Card({ children, color, className = "", style }: { children: ReactNode; color?: string; className?: string; style?: CSSProperties }) {
  return (
    <div className={`rounded-[28px] border-2 bg-white/[.045] p-7 ${className}`} style={{ borderColor: color ? `${color}66` : "rgba(255,255,255,.1)", ...style }}>
      {children}
    </div>
  );
}

export function Y({ children }: { children: ReactNode }) {
  return <span style={{ color: BRAND.yellow }}>{children}</span>;
}

export function Grad({ children }: { children: ReactNode }) {
  return <span className="grad-text">{children}</span>;
}
