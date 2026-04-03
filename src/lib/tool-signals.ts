import type { ToolDefinition } from "@/lib/tools-catalog";

export type ToolPriority = "High" | "Medium" | "Low";
export type ToolEase = "Easy" | "Moderate" | "Advanced";
export type ToolSpeed = "Fast" | "Standard" | "Deep";

export interface ToolSignals {
  seoRatio: number;
  priority: ToolPriority;
  ease: ToolEase;
  speed: ToolSpeed;
  searchText: string;
}

const CATEGORY_BASE: Record<string, number> = {
  "indexing-crawl": 34,
  "metadata-snippets": 30,
  "keyword-research": 27,
  "backlink-analysis": 24,
  "domain-authority": 22,
};

function scorePriority(seoRatio: number): ToolPriority {
  if (seoRatio >= 84) return "High";
  if (seoRatio >= 70) return "Medium";
  return "Low";
}

function scoreEase(title: string): ToolEase {
  const normalized = title.toLowerCase();
  if (/(checker|generator|validator|tester)/.test(normalized)) return "Easy";
  if (/(analyzer|auditor|monitor|tracker|research|builder)/.test(normalized)) return "Moderate";
  return "Advanced";
}

function scoreSpeed(ease: ToolEase, title: string): ToolSpeed {
  if (ease === "Easy" || /(checker|generator|validator|tester)/.test(title.toLowerCase())) return "Fast";
  if (ease === "Moderate") return "Standard";
  return "Deep";
}

export function getToolSignals(tool: ToolDefinition): ToolSignals {
  const title = tool.title.toLowerCase();
  const keywordCount = tool.intentKeywords.length;
  const keywordBoost = Math.min(18, keywordCount * 3);
  const titleBoost = /(checker|generator|validator|tester)/.test(title)
    ? 16
    : /(analyzer|auditor|tracker|monitor|research)/.test(title)
      ? 12
      : 8;
  const categoryBase = CATEGORY_BASE[tool.categoryId] ?? 20;
  const seoRatio = Math.min(100, categoryBase + keywordBoost + titleBoost + 20);
  const ease = scoreEase(tool.title);
  const speed = scoreSpeed(ease, tool.title);

  return {
    seoRatio,
    priority: scorePriority(seoRatio),
    ease,
    speed,
    searchText: [tool.title, tool.primaryKeyword, tool.description, ...tool.intentKeywords].join(" ").toLowerCase(),
  };
}
