// Simulated MCP (Model Context Protocol) servers.
// Each call produces a faithful JSON-RPC 2.0 `tools/call` request/response pair
// so the audience can see exactly what crosses the wire between agent and tool.

export interface McpToolDef {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
}

export interface McpServerDef {
  id: string;
  label: string;
  system: string;
  color: string;
  tools: McpToolDef[];
}

export const MCP_SERVERS: McpServerDef[] = [
  {
    id: "ehr",
    label: "EHR Server",
    system: "Hospital records (HIS / EMR)",
    color: "#0ea5e9",
    tools: [
      { name: "get_patient_summary", description: "Return demographics, conditions, medicines, allergies and recent labs for a patient id.", inputSchema: { type: "object", properties: { patient_id: { type: "string" }, fields: { type: "array" } }, required: ["patient_id"] } },
      { name: "lookup_patient", description: "Find a patient by masked phone token or name.", inputSchema: { type: "object", properties: { query: { type: "string" } } } },
    ],
  },
  {
    id: "pharmacy",
    label: "Pharmacy Server",
    system: "Pharmacy inventory & dispensing",
    color: "#10b981",
    tools: [
      { name: "check_stock", description: "Check stock for a drug and strength.", inputSchema: { type: "object", properties: { drug: { type: "string" }, strength: { type: "string" } } } },
      { name: "check_interactions", description: "Check interactions across a list of drugs.", inputSchema: { type: "object", properties: { drugs: { type: "array" } } } },
      { name: "draft_refill", description: "Create a refill draft that requires doctor approval.", inputSchema: { type: "object", properties: { patient_id: { type: "string" }, drug: { type: "string" }, days: { type: "number" } } } },
    ],
  },
  {
    id: "calendar",
    label: "Calendar Server",
    system: "Doctor scheduling",
    color: "#6366f1",
    tools: [
      { name: "find_slots", description: "Find available slots by department and date.", inputSchema: { type: "object", properties: { department: { type: "string" }, date: { type: "string" }, urgent: { type: "boolean" } } } },
      { name: "hold_slot", description: "Place a 30-minute hold on a slot pending confirmation.", inputSchema: { type: "object", properties: { slot_id: { type: "string" }, patient_id: { type: "string" } } } },
    ],
  },
  {
    id: "insurance",
    label: "Insurance Server",
    system: "TPA / insurer gateway",
    color: "#a855f7",
    tools: [
      { name: "verify_coverage", description: "Verify a policy covers the given services.", inputSchema: { type: "object", properties: { policy_no: { type: "string" }, services: { type: "array" } } } },
      { name: "request_preauth", description: "Raise a cashless pre-authorization.", inputSchema: { type: "object", properties: { policy_no: { type: "string" }, services: { type: "array" } } } },
    ],
  },
  {
    id: "whatsapp",
    label: "WhatsApp Server",
    system: "WhatsApp Business API",
    color: "#22c55e",
    tools: [{ name: "send_message", description: "Send a templated WhatsApp message to a patient.", inputSchema: { type: "object", properties: { to_token: { type: "string" }, language: { type: "string" }, body: { type: "string" } } } }],
  },
  {
    id: "security",
    label: "SecOps Server",
    system: "SIEM / incident desk",
    color: "#ef4444",
    tools: [{ name: "raise_incident", description: "Open a security incident and alert the on-call admin.", inputSchema: { type: "object", properties: { severity: { type: "string" }, summary: { type: "string" } } } }],
  },
];

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  phoneToken: string;
  language: string;
  conditions: string[];
  medicines: { drug: string; strength: string; dose: string }[];
  allergies: string[];
  labs: { test: string; value: string; date: string }[];
  lastVisit: string;
  doctor: string;
  insurance: { insurer: string; plan: string; policyNo: string };
}

export const PATIENTS: Record<string, Patient> = {
  "P-1042": {
    id: "P-1042",
    name: "Lakshmi Narayanan",
    age: 58,
    gender: "F",
    phoneToken: "tok_ph_7f3a",
    language: "Tamil",
    conditions: ["Type 2 diabetes (8 yrs)", "Hypertension"],
    medicines: [
      { drug: "Metformin", strength: "500 mg", dose: "1-0-1" },
      { drug: "Amlodipine", strength: "5 mg", dose: "1-0-0" },
      { drug: "Atorvastatin", strength: "10 mg", dose: "0-0-1" },
    ],
    allergies: ["Penicillin"],
    labs: [
      { test: "HbA1c", value: "7.9 %", date: "2026-07-14" },
      { test: "eGFR", value: "78 mL/min", date: "2026-07-14" },
      { test: "BP", value: "142/88", date: "2026-08-21" },
    ],
    lastVisit: "2026-08-21",
    doctor: "Dr. Meena Krishnan (Physician)",
    insurance: { insurer: "Star Health", plan: "Senior Citizen Red Carpet", policyNo: "SH-****-4471" },
  },
  "P-2077": {
    id: "P-2077",
    name: "Ravi Kumar",
    age: 46,
    gender: "M",
    phoneToken: "tok_ph_19c2",
    language: "English",
    conditions: ["Type 2 diabetes (3 yrs)"],
    medicines: [{ drug: "Metformin", strength: "500 mg", dose: "1-0-1" }],
    allergies: [],
    labs: [{ test: "HbA1c", value: "7.1 %", date: "2026-07-04" }],
    lastVisit: "2026-07-04",
    doctor: "Dr. Meena Krishnan (Physician)",
    insurance: { insurer: "ICICI Lombard", plan: "Corporate Group Health", policyNo: "IL-****-9020" },
  },
  "P-3001": {
    id: "P-3001",
    name: "Arun S",
    age: 39,
    gender: "M",
    phoneToken: "tok_ph_a011",
    language: "English",
    conditions: [],
    medicines: [],
    allergies: [],
    labs: [],
    lastVisit: "2025-12-02",
    doctor: "Dr. Meena Krishnan (Physician)",
    insurance: { insurer: "Self-pay", plan: "-", policyNo: "-" },
  },
};

export function identifyPatient(text: string): Patient {
  const t = text.toLowerCase();
  if (t.includes("lakshmi")) return PATIENTS["P-1042"];
  if (t.includes("ravi")) return PATIENTS["P-2077"];
  return PATIENTS["P-3001"];
}

let rpcId = 100;

export interface McpCall {
  server: string;
  tool: string;
  request: unknown;
  response: unknown;
  latencyMs: number;
  ok: boolean;
}

function slotDate(offsetDays: number) {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().slice(0, 10);
}

function nextSaturday() {
  const d = new Date();
  d.setDate(d.getDate() + ((6 - d.getDay() + 7) % 7 || 7));
  return d.toISOString().slice(0, 10);
}

function execute(server: string, tool: string, args: Record<string, unknown>): unknown {
  const key = `${server}.${tool}`;
  switch (key) {
    case "ehr.get_patient_summary": {
      const p = PATIENTS[String(args.patient_id)];
      return {
        patient_id: p.id,
        age: p.age,
        gender: p.gender,
        conditions: p.conditions,
        medicines: p.medicines,
        allergies: p.allergies,
        recent_labs: p.labs,
        last_visit: p.lastVisit,
        primary_doctor: p.doctor,
        note: "Fields filtered to minimum-necessary set (DPDP)",
      };
    }
    case "pharmacy.check_stock":
      return { drug: args.drug, strength: args.strength, in_stock: 340, unit: "tablets", batch: "MTF-2609", expiry: "2028-03" };
    case "pharmacy.check_interactions":
      return { drugs: args.drugs, severe: [], moderate: [], advisory: ["Hold metformin 48h around iodinated contrast (angiography / contrast CT)"] };
    case "pharmacy.draft_refill":
      return { refill_id: "RF-55821", status: "PENDING_DOCTOR_APPROVAL", days: args.days, drug: args.drug };
    case "calendar.find_slots":
      return args.urgent
        ? { department: args.department, date: slotDate(0), slots: [{ slot_id: "CARD-1130", time: "11:30", doctor: "Dr. Arvind Rao (Cardiology)", type: "urgent" }, { slot_id: "CARD-1600", time: "16:00", doctor: "Dr. Arvind Rao (Cardiology)", type: "urgent" }] }
        : { department: args.department, date: nextSaturday(), slots: [{ slot_id: "GP-SAT-0830", time: "08:30", doctor: "Dr. Meena Krishnan", type: "routine" }, { slot_id: "GP-SAT-0900", time: "09:00", doctor: "Dr. Meena Krishnan", type: "routine" }] };
    case "calendar.hold_slot":
      return { slot_id: args.slot_id, status: "HELD", hold_expires_in_min: 30, confirmation: `APT-${Math.floor(70000 + Math.random() * 9999)}` };
    case "insurance.verify_coverage":
      return String(args.policy_no).startsWith("SH")
        ? { policy_no: args.policy_no, active: true, covered: args.services, copay_pct: 20, preauth_required: true }
        : String(args.policy_no).startsWith("IL")
          ? { policy_no: args.policy_no, active: true, covered: args.services, copay_pct: 0, preauth_required: false, remaining_annual_tests: 3 }
          : { policy_no: args.policy_no, active: false, covered: [], note: "Self-pay patient" };
    case "insurance.request_preauth":
      return { preauth_id: "PA-SH-882134", status: "APPROVED", approved_amount_inr: 2400, turnaround_min: 7 };
    case "whatsapp.send_message":
      return { message_id: "wamid.HBgM" + Math.random().toString(36).slice(2, 10), status: "delivered", to_token: args.to_token };
    case "security.raise_incident":
      return { incident_id: `SEC-${new Date().getFullYear()}-0${Math.floor(100 + Math.random() * 899)}`, status: "OPEN", notified: ["it-admin@sunrise-clinic", "DPO"] };
    default:
      return { error: "unknown tool" };
  }
}

export function callTool(server: string, tool: string, args: Record<string, unknown>): McpCall {
  const id = ++rpcId;
  const request = { jsonrpc: "2.0", id, method: "tools/call", params: { name: tool, arguments: args } };
  const result = execute(server, tool, args);
  const response = {
    jsonrpc: "2.0",
    id,
    result: { content: [{ type: "text", text: JSON.stringify(result) }], structuredContent: result, isError: false },
  };
  return { server, tool, request, response, latencyMs: Math.floor(80 + Math.random() * 260), ok: true };
}
