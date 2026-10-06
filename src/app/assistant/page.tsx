import type { Metadata } from "next";
import AssistantPanel from "@/components/assistant/AssistantPanel";

export const metadata: Metadata = { title: "CareBot Assistant · CareAgents" };

export default function Page() {
  return (
    <div className="mx-auto flex h-[calc(100vh-61px)] max-w-[1400px] flex-col px-4 py-4 md:px-6">
      <div className="mb-3 flex flex-wrap items-end gap-3">
        <div>
          <div className="text-sm font-bold uppercase tracking-[.2em] text-cyan-300">AI Assistant · watch it think</div>
          <h1 className="text-2xl font-extrabold tracking-tight md:text-3xl">
            Ask CareBot, and see <span className="grad-text">every agent step</span> live
          </h1>
        </div>
      </div>
      <div className="min-h-0 flex-1">
        <AssistantPanel variant="page" />
      </div>
    </div>
  );
}
