import { checkInput } from "@/lib/guardrails";

export async function POST(req: Request) {
  const { text } = (await req.json()) as { text: string };
  return Response.json(checkInput(String(text ?? "").slice(0, 2000)));
}
