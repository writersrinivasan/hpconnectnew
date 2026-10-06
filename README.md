# CareAgents: Agentic AI for MSMEs (Healthcare demo)

An interactive web app that shows MSME owners how a **multi-agent AI system** runs a small clinic's daily work, and how it's kept **safe, governed and auditable**.

Built with **Next.js 16**, **LangGraph.js**, **Groq** and optionally **Claude**.

## What's inside

| Page | What it shows |
| --- | --- |
| `/` The Story | The shift to agentic AI, a day at Sunrise Clinic (before/after), the 9 agents, other industries |
| `/concepts` | RAG, MCP and Orchestration, explained with interactive demos |
| `/live` | **Live LangGraph run**: 9 agents, parallel fan-out, RAG, MCP tool calls, doctor approval (human-in-the-loop), guardrails, hash-chained audit trail, trace and evals |
| `/architecture` | Layered architecture, request lifecycle, deployment options, documentation pack |
| `/trust` | Guardrail playground, AI security threats, governance and risk tiers, evals, observability, tamper-evident audit demo |
| `/takeaways` | 7 lessons, readiness self-check, ROI calculator, 90-day plan |
| `/assistant` | **CareBot**: Groq-powered assistant (healthcare module only) that animates its 5-step agent workflow for every question |

## Run it

```bash
npm install
cp .env.example .env.local   # add your GROQ_API_KEY
npm run dev                  # http://localhost:3000
```

- The `/live` demo works **without any API key** (deterministic, offline-safe agents). Set `ANTHROPIC_API_KEY` to let Claude write the triage reasoning.
- CareBot needs `GROQ_API_KEY`. It uses `openai/gpt-oss-120b` (answers), `openai/gpt-oss-20b` (router) and `meta-llama/llama-prompt-guard-2-86m` (prompt-injection guard).

## Code map

- `src/lib/graph.ts`: the clinic's LangGraph multi-agent workflow, plus evals
- `src/lib/rag.ts`: BM25 retriever and clinic knowledge base
- `src/lib/mcp.ts`: simulated MCP servers (JSON-RPC `tools/call`)
- `src/lib/guardrails.ts`: input and output guardrails
- `src/lib/audit.ts`: SHA-256 hash-chained audit log
- `src/lib/assistant/`: CareBot's LangGraph pipeline and Groq client
- `src/app/api/{run,assistant,guardrail,rag}`: streaming (SSE) API routes

All patient data is fictional, for education only.
