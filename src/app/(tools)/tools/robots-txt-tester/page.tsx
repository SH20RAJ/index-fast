import ToolStaticPage, { createToolMetadata } from "@/components/tools/shared/tool-static-page";

export const metadata = createToolMetadata("robots-txt-tester");

export default function RobotsTxtTesterPage() {
  return <ToolStaticPage slug="robots-txt-tester" />;
}
