import RobotsTxtTesterPageContent from "@/components/tools/robots-txt-tester/robots-txt-tester-page";
import { createToolMetadata } from "@/components/tools/shared/tool-static-page";

export const metadata = createToolMetadata("robots-txt-tester");

export default function RobotsTxtTesterPage() {
  return <RobotsTxtTesterPageContent />;
}
