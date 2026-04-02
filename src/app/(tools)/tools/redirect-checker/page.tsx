import ToolStaticPage, { createToolMetadata } from "@/components/tools/shared/tool-static-page";

export const metadata = createToolMetadata("redirect-checker");

export default function RedirectCheckerPage() {
  return <ToolStaticPage slug="redirect-checker" />;
}
