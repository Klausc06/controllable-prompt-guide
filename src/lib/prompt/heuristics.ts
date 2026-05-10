import type { LocalizedText, PromptSelections, TargetToolId } from "./types";

const SEEDANCE_ID = "seedance" as TargetToolId;
const QUALITY_KILLING_KEYWORDS = ["fast", "cinematic", "epic"];

export function evaluatePromptQuality(
  selections: PromptSelections,
  targetToolId: TargetToolId,
  rawIntent: string = ""
): LocalizedText[] {
  const warnings: LocalizedText[] = [];

  // 1. Check if lighting is specified
  const lighting = selections["lighting"];
  const hasLighting =
    typeof lighting === "string"
      ? lighting.trim().length > 0
      : Array.isArray(lighting) && lighting.length > 0;
  if (!hasLighting) {
    warnings.push({
      zh: "未指定光线 — 光线是影响画面质量最高的因素。建议添加光线选择。",
      en: "No lighting specified — lighting is the highest-impact factor for visual quality. Consider adding a lighting choice."
    });
  }

  // 2. Seedance-specific: check for quality-killing keywords
  if (targetToolId === SEEDANCE_ID) {
    const selectionTexts = Object.values(selections)
      .flatMap((v) => (Array.isArray(v) ? v : [v]))
      .filter((v): v is string => Boolean(v))
      .join(" ")
      .toLowerCase();
    const combined = (rawIntent + " " + selectionTexts).toLowerCase();
    const found = QUALITY_KILLING_KEYWORDS.filter((k) => combined.includes(k));
    if (found.length > 0) {
      warnings.push({
        zh: `提示词包含"${found.join("、")}"等 Seedance 不友好关键词 — 这些词可能降低生成质量。建议移除后重试。`,
        en: `Prompt contains Seedance-unfriendly keywords ("${found.join(", ")}") — these may degrade output quality. Consider removing them.`
      });
    }

    // 4. Check if audio is specified for Seedance
    const audio = selections["audio"];
    const hasAudio =
      typeof audio === "string"
        ? audio.trim().length > 0
        : Array.isArray(audio) && audio.length > 0;
    if (!hasAudio) {
      warnings.push({
        zh: "声音未指定 — 建议至少选择环境音或后期配音。",
        en: "Audio not specified — consider selecting ambient audio or post-production voiceover."
      });
    }
  }

  // 3. Check for conflicting styles
  const style = selections["style"];
  const styleIds =
    typeof style === "string" ? [style].filter(Boolean) : Array.isArray(style) ? style : [];
  if (
    styleIds.includes("cinematic_realism") &&
    (styleIds.includes("anime_aesthetic") || styleIds.includes("anime"))
  ) {
    warnings.push({
      zh: "同时选择了电影真实感和动漫风格 — 两套视觉语言冲突，建议只保留其一。",
      en: "Both cinematic realism and anime style selected — these visual languages conflict. Consider keeping only one."
    });
  }

  return warnings;
}
