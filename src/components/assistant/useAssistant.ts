"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { AsstEvent, StepId, StepStatus } from "@/lib/assistant/steps";

export interface StepState {
  status: StepStatus;
  detail?: string;
  chips?: string[];
  ms?: number;
}

export interface Msg {
  id: string;
  role: "user" | "assistant";
  text: string;
  steps?: Partial<Record<StepId, StepState>>;
  sources?: Extract<AsstEvent, { type: "sources" }>["hits"];
  meta?: Omit<Extract<AsstEvent, { type: "done" }>, "type">;
  error?: string;
  pending?: boolean;
}

const uid = () => Math.random().toString(36).slice(2, 10);

export function useAssistant() {
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [busy, setBusy] = useState(false);
  const [focusId, setFocusId] = useState<string | null>(null);
  const msgsRef = useRef<Msg[]>([]);
  useEffect(() => {
    msgsRef.current = msgs;
  }, [msgs]);

  const patch = (id: string, fn: (m: Msg) => Msg) => setMsgs((all) => all.map((m) => (m.id === id ? fn(m) : m)));

  const send = useCallback(async (question: string) => {
    const q = question.trim();
    if (!q || busy) return;
    const history = msgsRef.current.filter((m) => !m.error && !m.pending).map((m) => ({ role: m.role, content: m.text }));
    const aid = uid();
    setMsgs((all) => [...all, { id: uid(), role: "user", text: q }, { id: aid, role: "assistant", text: "", steps: {}, pending: true }]);
    setFocusId(aid);
    setBusy(true);
    try {
      const res = await fetch("/api/assistant", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ question: q, history }) });
      const reader = res.body!.getReader();
      const dec = new TextDecoder();
      let buf = "";
      for (;;) {
        const { value, done } = await reader.read();
        if (done) break;
        buf += dec.decode(value, { stream: true });
        const parts = buf.split("\n\n");
        buf = parts.pop() ?? "";
        for (const p of parts) {
          if (!p.startsWith("data:")) continue;
          const e = JSON.parse(p.slice(5)) as AsstEvent;
          if (e.type === "step") patch(aid, (m) => ({ ...m, steps: { ...m.steps, [e.id]: { ...m.steps?.[e.id], status: e.status, detail: e.detail ?? m.steps?.[e.id]?.detail, chips: e.chips ?? m.steps?.[e.id]?.chips, ms: e.ms ?? m.steps?.[e.id]?.ms } } }));
          else if (e.type === "token") patch(aid, (m) => ({ ...m, text: m.text + e.text }));
          else if (e.type === "sources") patch(aid, (m) => ({ ...m, sources: e.hits }));
          else if (e.type === "done") patch(aid, (m) => ({ ...m, pending: false, meta: { model: e.model, tokens: e.tokens, ms: e.ms, topic: e.topic } }));
          else if (e.type === "error") patch(aid, (m) => ({ ...m, pending: false, error: e.message }));
        }
      }
    } catch (err) {
      patch(aid, (m) => ({ ...m, pending: false, error: String(err) }));
    } finally {
      patch(aid, (m) => ({ ...m, pending: false }));
      setBusy(false);
    }
  }, [busy]);

  const clear = useCallback(() => {
    if (!busy) {
      setMsgs([]);
      setFocusId(null);
    }
  }, [busy]);

  return { msgs, busy, send, clear, focusId, setFocusId };
}
