import ToolStaticPage, { createToolMetadata } from "@/components/tools/shared/tool-static-page";

export const metadata = createToolMetadata("server-status-checker");

export default function ServerStatusCheckerPage() {
  return <ToolStaticPage slug="server-status-checker" />;
}
