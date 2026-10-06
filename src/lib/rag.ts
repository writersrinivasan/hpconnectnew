// A small, real retrieval engine (BM25) over the clinic's own documents.
// In production this would be a vector database (pgvector, Qdrant…) with
// embeddings; BM25 keeps the demo offline, fast and fully explainable.

export interface KbDoc {
  id: string;
  title: string;
  source: string;
  category: "Clinical protocol" | "Formulary" | "Insurance" | "Policy" | "Operations" | "App guide";
  text: string;
}

export const KNOWLEDGE_BASE: KbDoc[] = [
  {
    id: "CP-01",
    title: "Chest pain / chest tightness triage",
    source: "Sunrise Clinic Protocol Manual v4.2 §3.1",
    category: "Clinical protocol",
    text: "Chest pain or chest tightness on exertion (climbing stairs, walking) in a patient over 45 years with diabetes, hypertension or smoking history is HIGH priority. Arrange same-day cardiology review and ECG within 30 minutes of arrival. Red flags requiring immediate emergency care (call 108): pain at rest lasting more than 20 minutes, sweating, pain spreading to arm, jaw or back, breathlessness or fainting.",
  },
  {
    id: "CP-02",
    title: "Type 2 diabetes follow-up schedule",
    source: "Sunrise Clinic Protocol Manual v4.2 §5.4",
    category: "Clinical protocol",
    text: "Patients with type 2 diabetes need a follow-up check-up every 3 months: HbA1c blood test, blood pressure, weight, foot examination and medication review. Annual eye (retina) screening and kidney function test (eGFR, urine albumin). Fasting of 8-10 hours before the blood test; morning slots preferred.",
  },
  {
    id: "CP-03",
    title: "Fever and suspected dengue",
    source: "Sunrise Clinic Protocol Manual v4.2 §7.2",
    category: "Clinical protocol",
    text: "Fever above 101F for more than 2 days with body ache, headache or rash during monsoon season: medium priority, same or next day general physician visit, platelet count and NS1 antigen test. Warning signs (bleeding, severe abdominal pain, persistent vomiting) need emergency care.",
  },
  {
    id: "CP-04",
    title: "Hypertension management",
    source: "Sunrise Clinic Protocol Manual v4.2 §5.1",
    category: "Clinical protocol",
    text: "Blood pressure review every 3 months for stable hypertension patients on amlodipine or similar. Readings above 180/110 with headache, chest pain or blurred vision need urgent same-day review.",
  },
  {
    id: "RX-07",
    title: "Metformin: formulary & safety notes",
    source: "Clinic Drug Formulary 2026 · Metformin",
    category: "Formulary",
    text: "Metformin 500 mg tablet twice daily is first-line for type 2 diabetes. Hold metformin 48 hours before and after iodinated contrast imaging such as coronary angiography or CT with contrast. Contraindicated if eGFR below 30. No clinically significant interaction with atorvastatin or amlodipine.",
  },
  {
    id: "RX-11",
    title: "Chronic medicine refill policy",
    source: "Pharmacy SOP 2026 §2",
    category: "Formulary",
    text: "Chronic medicine refills (diabetes, blood pressure, cholesterol tablets) can be prepared for up to 30 days if the patient was seen by a doctor within the last 90 days. Every refill must be approved by a doctor before dispensing. Home delivery available within city limits.",
  },
  {
    id: "INS-03",
    title: "Star Health Senior Citizen plan: outpatient cover",
    source: "Insurance Desk Handbook · Star Health",
    category: "Insurance",
    text: "Senior citizen plan covers outpatient cardiology consultation and ECG with cashless pre-authorization. Pre-authorization is requested by the clinic insurance desk and is usually approved within 1 hour for listed procedures. Co-pay of 20 percent applies.",
  },
  {
    id: "INS-05",
    title: "Corporate group health: diagnostics cover",
    source: "Insurance Desk Handbook · Group plans",
    category: "Insurance",
    text: "Corporate group health plans cover HbA1c, lipid profile and kidney function tests for diagnosed diabetic employees up to 4 times a year. No pre-authorization required for routine diagnostics; submit bill for reimbursement or use cashless at network lab.",
  },
  {
    id: "POL-01",
    title: "Patient data privacy (DPDP Act 2023)",
    source: "Sunrise Data Protection Policy v2",
    category: "Policy",
    text: "Collect and share only the minimum necessary patient data for the purpose. Mask Aadhaar numbers, phone numbers and email addresses in logs and AI prompts. Patient consent is required before sharing records with third parties. Bulk export of patient records is never allowed through chat channels.",
  },
  {
    id: "POL-02",
    title: "Patient communication policy",
    source: "Sunrise Communication Guidelines",
    category: "Policy",
    text: "Messages to patients must use the patient's preferred language, avoid giving a final diagnosis over chat, mention the doctor's name and appointment time, and always include the emergency number 108 for urgent symptoms.",
  },
  {
    id: "OPS-02",
    title: "Urgent appointment slots",
    source: "Front Desk Operations Manual §4",
    category: "Operations",
    text: "Each specialist keeps 2 urgent slots per day reserved for high-priority triage cases. Cardiology urgent slots are at 11:30 and 16:00. Routine follow-ups are booked on the patient's preferred day; Saturday morning slots run from 8:00 to 12:00.",
  },
  {
    id: "OPS-05",
    title: "AI agent escalation rules",
    source: "AI Governance Charter v1 §6",
    category: "Policy",
    text: "AI agents may act autonomously only on low-risk administrative tasks. High-priority clinical triage, any prescription or refill, and any message about serious symptoms must be approved by a licensed doctor (human-in-the-loop). All agent actions are written to a tamper-evident audit log.",
  },
];

const STOP = new Set(
  "a an the is are was were be to of and or in on at for with my me i you your it this that can will do does please also since have has had am any need get by as from up out about into than then so if not".split(" "),
);

const SYNONYMS: Record<string, string[]> = {
  heart: ["cardiology", "chest"],
  tablets: ["medicine", "refill"],
  tablet: ["medicine", "refill"],
  checkup: ["follow-up", "check-up"],
  stairs: ["exertion"],
  insurance: ["cover", "plan"],
  data: ["records", "privacy"],
  export: ["bulk", "records"],
};

function tokenize(text: string): string[] {
  const base = text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/\s+/)
    .filter((t) => t.length > 1 && !STOP.has(t));
  return base.flatMap((t) => [t, ...(SYNONYMS[t] ?? [])]);
}

export interface RagHit {
  id: string;
  title: string;
  source: string;
  category: string;
  score: number; // normalised 0..1
  snippet: string;
  matched: string[];
}

export function createRetriever(docs: KbDoc[]) {
  const docTokens = docs.map((d) => tokenize(`${d.title} ${d.title} ${d.text}`));
  const avgLen = docTokens.reduce((s, t) => s + t.length, 0) / docTokens.length;
  const df = new Map<string, number>();
  for (const toks of docTokens) for (const t of new Set(toks)) df.set(t, (df.get(t) ?? 0) + 1);

  return function retrieveFrom(query: string, k = 3, filter?: KbDoc["category"][]): RagHit[] {
    const q = [...new Set(tokenize(query))];
    const N = docs.length;
    const k1 = 1.4;
    const b = 0.75;
    const scored = docs
      .map((doc, i) => {
        if (filter && !filter.includes(doc.category)) return null;
        const toks = docTokens[i];
        let score = 0;
        const matched: string[] = [];
        for (const term of q) {
          const tf = toks.filter((t) => t === term).length;
          if (!tf) continue;
          matched.push(term);
          const idf = Math.log(1 + (N - (df.get(term) ?? 0) + 0.5) / ((df.get(term) ?? 0) + 0.5));
          score += idf * ((tf * (k1 + 1)) / (tf + k1 * (1 - b + (b * toks.length) / avgLen)));
        }
        return { doc, score, matched };
      })
      .filter((x): x is { doc: KbDoc; score: number; matched: string[] } => !!x && x.score > 0);

    scored.sort((a, b2) => b2.score - a.score);
    const top = scored[0]?.score ?? 1;
    return scored.slice(0, k).map(({ doc, score, matched }) => ({
      id: doc.id,
      title: doc.title,
      source: doc.source,
      category: doc.category,
      score: Math.round((score / top) * 100) / 100,
      snippet: doc.text,
      matched: [...new Set(matched)].slice(0, 8),
    }));
  };
}

export const retrieve = createRetriever(KNOWLEDGE_BASE);
