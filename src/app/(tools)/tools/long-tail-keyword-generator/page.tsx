import LongTailKeywordGeneratorPageContent from "@/components/tools/long-tail-keyword-generator/long-tail-keyword-generator-page";
import { createToolMetadata } from "@/components/tools/shared/tool-static-page";

export const metadata = createToolMetadata("long-tail-keyword-generator");

export default function LongTailKeywordGeneratorPage() {
  return <LongTailKeywordGeneratorPageContent />;
}
