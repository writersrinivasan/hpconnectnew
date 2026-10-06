"use client";

import { usePathname } from "next/navigation";
import { AssistantLauncher } from "./AssistantPanel";

// The floating CareBot appears on every page except the assistant page and the slide deck.
export default function LauncherGate() {
  const path = usePathname();
  return path.startsWith("/assistant") || path.startsWith("/slides") ? null : <AssistantLauncher />;
}
