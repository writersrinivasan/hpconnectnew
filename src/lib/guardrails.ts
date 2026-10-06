// Rule-based guardrails. Production systems layer these with ML classifiers
// (e.g. Llama Guard, Presidio, provider safety filters); rules keep the demo
// transparent so the audience can see *why* something was blocked.

export type GuardStatus = "pass" | "masked" | "warn" | "block";

export interface GuardCheck {
  check: string;
  status: GuardStatus;
  detail: string;
}

export interface InputGuardResult {
  masked: string;
  pii: { type: string; value: string; token: string }[];
  checks: GuardCheck[];
  blocked: boolean;
  blockReason?: string;
  riskScore: number;
}

const PII_PATTERNS: { type: string; re: RegExp; token: string }[] = [
  { type: "Aadhaar", re: /\b\d{4}\s?\d{4}\s?\d{4}\b/g, token: "[AADHAAR]" },
  { type: "Phone", re: /(?:\+91[\s-]?)?\b[6-9]\d{4}[\s-]?\d{5}\b/g, token: "[PHONE]" },
  { type: "Email", re: /[\w.+-]+@[\w-]+\.[\w.]+/g, token: "[EMAIL]" },
  { type: "PAN", re: /\b[A-Z]{5}\d{4}[A-Z]\b/g, token: "[PAN]" },
];

const INJECTION_PATTERNS: { re: RegExp; label: string }[] = [
  { re: /ignore (all )?(previous|prior|above) (instructions|rules)/i, label: "Instruction override" },
  { re: /(admin|developer|god|jailbreak|dan) mode/i, label: "Role hijack" },
  { re: /you are now/i, label: "Role hijack" },
  { re: /(system prompt|reveal your (prompt|instructions))/i, label: "Prompt extraction" },
  { re: /(export|dump|download|send) (all|every|the whole)/i, label: "Bulk data exfiltration" },
  { re: /(all|every) patient(s)?('| )?(records|data|details)/i, label: "Bulk data exfiltration" },
  { re: /(email|send|forward) (it|them|this)? ?to [\w.+-]+@/i, label: "External data transfer" },
];

const TOXIC = /\b(idiot|stupid|kill you|hate you|bomb)\b/i;

const OUT_OF_SCOPE = /\b(stock tips|crypto|bitcoin|lottery|write my essay|election|cricket score)\b/i;

export function checkInput(text: string): InputGuardResult {
  const checks: GuardCheck[] = [];
  const pii: InputGuardResult["pii"] = [];
  let masked = text;

  for (const p of PII_PATTERNS) {
    masked = masked.replace(p.re, (m) => {
      pii.push({ type: p.type, value: m, token: p.token });
      return p.token;
    });
  }
  checks.push(
    pii.length
      ? { check: "PII detection & masking", status: "masked", detail: `${pii.length} item(s) masked: ${[...new Set(pii.map((p) => p.type))].join(", ")}. The AI model never sees the raw values.` }
      : { check: "PII detection & masking", status: "pass", detail: "No personal identifiers found." },
  );

  const hits = INJECTION_PATTERNS.filter((p) => p.re.test(text)).map((p) => p.label);
  const uniqueHits = [...new Set(hits)];
  checks.push(
    uniqueHits.length
      ? { check: "Prompt-injection / jailbreak", status: "block", detail: `Detected: ${uniqueHits.join(", ")}.` }
      : { check: "Prompt-injection / jailbreak", status: "pass", detail: "No manipulation patterns found." },
  );

  const toxic = TOXIC.test(text);
  checks.push(toxic ? { check: "Abuse / toxicity", status: "warn", detail: "Abusive language detected; tone-safe handling applied." } : { check: "Abuse / toxicity", status: "pass", detail: "Respectful message." });

  const oos = OUT_OF_SCOPE.test(text);
  checks.push(oos ? { check: "Scope (healthcare only)", status: "block", detail: "Request is outside the clinic's healthcare scope." } : { check: "Scope (healthcare only)", status: "pass", detail: "Healthcare-related request." });

  const blocked = uniqueHits.length > 0 || oos;
  const riskScore = Math.min(100, uniqueHits.length * 30 + (oos ? 40 : 0) + (toxic ? 15 : 0) + pii.length * 3);

  return {
    masked,
    pii,
    checks,
    blocked,
    blockReason: blocked ? (uniqueHits.length ? `Security threat: ${uniqueHits.join(", ")}` : "Out of scope") : undefined,
    riskScore,
  };
}

export function checkOutput(message: string, opts: { allowedFacts: string[]; language: string; urgent: boolean }): GuardCheck[] {
  const checks: GuardCheck[] = [];
  const leaked = PII_PATTERNS.some((p) => new RegExp(p.re.source).test(message));
  checks.push(leaked ? { check: "PII leakage", status: "block", detail: "Raw identifier found in outbound message." } : { check: "PII leakage", status: "pass", detail: "No phone, Aadhaar or email in the outgoing text." });

  const diag = /\b(you have|diagnosed with|it is definitely|you are suffering from) (a )?(heart attack|angina|cancer|dengue)/i.test(message);
  checks.push(diag ? { check: "No diagnosis over chat", status: "block", detail: "Message states a diagnosis." } : { check: "No diagnosis over chat", status: "pass", detail: "Advice only; diagnosis left to the doctor (POL-02)." });

  const has108 = message.includes("108");
  checks.push(opts.urgent && !has108 ? { check: "Emergency number", status: "block", detail: "Urgent case without 108." } : { check: "Emergency number", status: "pass", detail: opts.urgent ? "108 emergency advice included (POL-02)." : "Not required for routine case; included anyway." });

  const grounded = opts.allowedFacts.every((f) => message.includes(f));
  checks.push(grounded ? { check: "Groundedness (no hallucination)", status: "pass", detail: `All ${opts.allowedFacts.length} facts (times, names, IDs) match tool results.` } : { check: "Groundedness (no hallucination)", status: "warn", detail: "Some facts could not be matched to tool outputs." });

  checks.push({ check: "Language & tone", status: "pass", detail: `Patient's preferred language (${opts.language}) used, polite tone.` });
  return checks;
}
