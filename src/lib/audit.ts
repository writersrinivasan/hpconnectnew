import { createHash } from "crypto";
import type { AuditEntry } from "./events";

// Tamper-evident audit log: every entry stores the hash of the previous one,
// so editing any past entry breaks every hash after it (a "hash chain").
const chains: Map<string, AuditEntry[]> =
  ((globalThis as Record<string, unknown>).__auditChains as Map<string, AuditEntry[]>) ?? new Map();
(globalThis as Record<string, unknown>).__auditChains = chains;

export function appendAudit(threadId: string, actor: string, action: string, detail: string): AuditEntry {
  const chain = chains.get(threadId) ?? [];
  const prevHash = chain.at(-1)?.hash ?? "0".repeat(64);
  const seq = chain.length + 1;
  const ts = new Date().toISOString();
  const hash = createHash("sha256").update(`${seq}|${ts}|${actor}|${action}|${detail}|${prevHash}`).digest("hex");
  const entry = { seq, ts, actor, action, detail, prevHash, hash };
  chain.push(entry);
  chains.set(threadId, chain);
  return entry;
}

export function verifyChain(entries: AuditEntry[]): boolean {
  return entries.every((e, i) => {
    const prev = i === 0 ? "0".repeat(64) : entries[i - 1].hash;
    const h = createHash("sha256").update(`${e.seq}|${e.ts}|${e.actor}|${e.action}|${e.detail}|${prev}`).digest("hex");
    return e.prevHash === prev && e.hash === h;
  });
}

export function getChain(threadId: string): AuditEntry[] {
  return chains.get(threadId) ?? [];
}
