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

  // 5. No subject specified — subject is the most critical dimension per all sources
  // Sources: Apiyi Seedance 2.0 (Subject is Step 1 of 6-step formula);
  // Veo 3 Prompt Guide 2026 (specificity imperative: "a golden retriever running" vs "a dog");
  // Seedance TV ("one primary subject", warns against "crowding with equally important subjects");
  // atlabs.ai (dedicated [Characters] field, "Seedance 2.0 rewards specificity");
  // Community practice: all 2000+ awesome-seedance-2-prompts include explicit subject
  const subject = selections["subject"];
  const hasSubject =
    typeof subject === "string"
      ? subject.trim().length > 0
      : Array.isArray(subject) && subject.length > 0;
  if (!hasSubject) {
    warnings.push({
      zh: "未选择主体 — 主体是视频提示词最关键的维度，建议添加主体选择以帮助模型理解画面焦点。",
      en: "No subject specified — subject is the most critical dimension for any video prompt. Consider adding a subject choice to help the model understand visual focus."
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

    // 6. Static camera + any movement conflict
    // Sources: Apiyi Seedance 2.0 (Rule 1: "Use only one primary camera instruction",
    //   multiple conflicting instructions "will confuse the model, leading to jittery or
    //   incoherent footage." Static/locked is one of 8 supported camera types);
    //   Seedance TV (static/locked for "atmosphere, contemplation" as distinct from
    //   dynamic movements like "slow dolly forward," "orbit around subject");
    //   atlabs.ai (warns against "complex simultaneous movements");
    //   Existing data: camera_movement:static_locked.suppresses already encodes this incompatibility
    const cameraMovement = selections["camera_movement"];
    const movementIds =
      typeof cameraMovement === "string"
        ? [cameraMovement].filter(Boolean)
        : Array.isArray(cameraMovement) ? cameraMovement : [];
    const hasStatic = movementIds.includes("camera_movement:static_locked");
    const hasOtherMovement = movementIds.some(
      (id) => id !== "camera_movement:static_locked"
    );
    if (hasStatic && hasOtherMovement) {
      warnings.push({
        zh: "镜头同时选择了「固定不动」和其他运镜方式 — Seedance 官方建议每次只使用一种主要运镜指令，混合使用可能导致画面抖动或结果不一致。",
        en: "Both static/locked camera and other movement types selected — Seedance officially recommends only one primary camera instruction per prompt. Combining them may cause jitter or inconsistent results."
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
