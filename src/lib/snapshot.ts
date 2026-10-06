import { createHmac, timingSafeEqual } from "crypto";
import type { AuditEntry } from "./events";

// On serverless hosts (Vercel) the resume request may land on a fresh instance with
// no in-memory checkpoint. We hand the paused state to the browser as an
// HMAC-signed token so it can be restored, but never tampered with.

const SECRET = process.env.SNAPSHOT_SECRET ?? process.env.GROQ_API_KEY ?? "careagents-demo-secret";

export interface Snapshot {
  threadId: string;
  values: Record<string, unknown>;
  audit: AuditEntry[];
  exp: number;
}

const sign = (body: string) => createHmac("sha256", SECRET).update(body).digest("base64url");

export function sealSnapshot(s: Omit<Snapshot, "exp">): string {
  const body = Buffer.from(JSON.stringify({ ...s, exp: Date.now() + 30 * 60_000 })).toString("base64url");
  return `${body}.${sign(body)}`;
}

export function openSnapshot(token: string, threadId: string): Snapshot {
  const [body, mac] = token.split(".");
  const expected = Buffer.from(sign(body ?? ""));
  if (!body || !mac || mac.length !== expected.length || !timingSafeEqual(Buffer.from(mac), expected)) throw new Error("Snapshot signature invalid (tampered?)");
  const s = JSON.parse(Buffer.from(body, "base64url").toString()) as Snapshot;
  if (s.threadId !== threadId) throw new Error("Snapshot does not match this run");
  if (s.exp < Date.now()) throw new Error("Approval window expired. Please run the scenario again.");
  return s;
}
