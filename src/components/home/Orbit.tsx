"use client";

import { motion } from "framer-motion";
import Icon from "@/components/Icon";
import { AGENTS, MAIN_FLOW } from "@/lib/agents";

export default function Orbit() {
  const agents = MAIN_FLOW.map((id) => AGENTS[id]);
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[560px]">
      <div className="absolute inset-[6%] rounded-full border border-dashed border-white/10" />
      <div className="absolute inset-[22%] rounded-full border border-white/5" />
      <motion.div className="absolute inset-0" animate={{ rotate: 360 }} transition={{ duration: 60, repeat: Infinity, ease: "linear" }}>
        {agents.map((a, i) => {
          const ang = (i / agents.length) * Math.PI * 2 - Math.PI / 2;
          const x = 50 + Math.cos(ang) * 44;
          const y = 50 + Math.sin(ang) * 44;
          return (
            <motion.div
              key={a.id}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${x}%`, top: `${y}%` }}
              animate={{ rotate: -360 }}
              transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
            >
              <div className="flex flex-col items-center">
                <div className="grid h-14 w-14 place-items-center rounded-2xl border-2 md:h-16 md:w-16" style={{ borderColor: a.color, background: `${a.color}2a`, boxShadow: `0 0 30px ${a.color}66` }}>
                  <Icon name={a.icon} className="h-7 w-7" style={{ color: a.color }} />
                </div>
                <span className="mt-1 whitespace-nowrap rounded-full bg-black/50 px-2 text-[11px] font-bold">{a.short}</span>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
      <div className="absolute inset-[30%] grid place-items-center rounded-full bg-gradient-to-br from-violet-600/40 via-fuchsia-500/20 to-cyan-500/30 shadow-[0_0_120px_rgba(168,85,247,.45)]">
        <div className="text-center">
          <div className="text-5xl">👩🏽‍⚕️</div>
          <div className="mt-1 text-lg font-extrabold">You</div>
          <div className="text-xs text-white/70">set goals · approve risk</div>
        </div>
      </div>
    </div>
  );
}
