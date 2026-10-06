import { retrieve } from "@/lib/rag";

export async function POST(req: Request) {
  const { query } = (await req.json()) as { query: string };
  return Response.json({ hits: retrieve(String(query ?? "").slice(0, 500), 3) });
}
