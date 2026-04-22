import ServerStatusCheckerPageContent from "@/components/tools/server-status-checker/server-status-checker-page";
import { createToolMetadata } from "@/components/tools/shared/tool-static-page";

export const metadata = createToolMetadata("server-status-checker");

export default function ServerStatusCheckerPage() {
  return <ServerStatusCheckerPageContent />;
}
