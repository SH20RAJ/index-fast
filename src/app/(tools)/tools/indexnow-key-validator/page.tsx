import IndexnowKeyValidatorPageContent from "@/components/tools/indexnow-key-validator/indexnow-key-validator-page";
import { createToolMetadata } from "@/components/tools/shared/tool-static-page";

export const metadata = createToolMetadata("indexnow-key-validator");

export default function IndexnowKeyValidatorPage() {
  return <IndexnowKeyValidatorPageContent />;
}
