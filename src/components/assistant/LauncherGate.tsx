"use client";

import { usePathname } from "next/navigation";
import { AssistantLauncher } from "./AssistantPanel";

// The floating CareBot appears on every page except the dedicated assistant page.
export default function LauncherGate() {
  return usePathname().startsWith("/assistant") ? null : <AssistantLauncher />;
}
