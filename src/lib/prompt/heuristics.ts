import type { LocalizedText, PromptSelections, TargetToolId, WorkTypeId } from "./types";

const SEEDANCE_ID = "seedance" as TargetToolId;
const QUALITY_KILLING_KEYWORDS = ["fast", "cinematic", "epic"];

export const IMAGE_PROMPT = "image_prompt" as WorkTypeId;
export const VIDEO_PROMPT = "video_prompt" as WorkTypeId;

/** Art medium option IDs — used by rule 5 (multiple art mediums conflict).
 *  Sources: PITFALLS.md Pitfall 4 (false confidence from unvalidated combinations).
 *  Excludes rendering techniques (photorealistic, vector_flat, 3d_render, pixel_art, graffiti, claymation)
 *  which are not "mediums" in the traditional art sense. */
const IMAGE_ART_MEDIUM_IDS = [
  "image_art_style:oil_painting", "image_art_style:watercolor",
  "image_art_style:pencil_sketch", "image_art_style:acrylic_impasto",
  "image_art_style:digital_painting", "image_art_style:ink_wash",
  "image_art_style:line_art", "image_art_style:marker_drawing",
  "image_art_style:pastel_drawing", "image_art_style:woodcut_print",
  "image_art_style:collage", "image_art_style:paper_cut",
  "image_art_style:embroidery", "image_art_style:mosaic"
];

/** Volumetric/dramatic lighting option IDs — used by rule 6 (flat vector + volumetric lighting conflict).
 *  Flat vector art uses solid colors without gradients; complex lighting contradicts the aesthetic.
 *  Sources: Midjourney/SD community knowledge, PITFALLS.md Pitfall 4. */
const VOLUMETRIC_LIGHTING_IDS = [
  "image_lighting:volumetric_god_rays",
  "image_lighting:hard_dramatic",
  "image_lighting:rim_light"
];

export function evaluatePromptQuality(
  selections: PromptSelections,
  targetToolId: TargetToolId,
  rawIntent: string = "",
  workTypeId?: WorkTypeId
): LocalizedText[] {
  const warnings: LocalizedText[] = [];

  // Backward compat: undefined workTypeId = video rules only (matches legacy behavior).
  // Image rules only fire when workTypeId is explicitly "image_prompt".
  const isVideo = !workTypeId || workTypeId === "video_prompt";
  const isImage = workTypeId === "image_prompt";

  // ══════════════════════════════════════════════════════════════════
  // Video heuristic rules (fire only when workTypeId is undefined or "video_prompt")
  // ══════════════════════════════════════════════════════════════════

  if (isVideo) {
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

    // 3. Check for conflicting styles (video)
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
  }

  // ══════════════════════════════════════════════════════════════════
  // Image heuristic rules (fire only when workTypeId is "image_prompt")
  // Sources: FEATURES.md image quality rules taxonomy; PITFALLS.md Pitfall 4
  // (false confidence from unvalidated combinations); Midjourney/SD community knowledge.
  // All rules are amber warnings — never block copy or prompt generation (D-03).
  // ══════════════════════════════════════════════════════════════════

  if (isImage) {
    // Helper: extract option IDs from a selections key (handles single string or array)
    const getIds = (key: string): string[] => {
      const value = selections[key];
      if (!value) return [];
      return typeof value === "string" ? [value] : Array.isArray(value) ? value : [];
    };

    const artStyleIds = getIds("art_style");
    const colorPaletteIds = getIds("color_palette");
    const lightingIds = getIds("lighting");

    // ═══ Rule 1: Completeness — No subject selected (D-02 #1) ═══
    // Sources: FEATURES.md (subject is most critical image dimension);
    // Midjourney community consensus — subject-first prompting.
    const subjectVal = selections["subject"];
    const hasSubject =
      typeof subjectVal === "string"
        ? subjectVal.trim().length > 0
        : Array.isArray(subjectVal) && subjectVal.length > 0;
    if (!hasSubject) {
      warnings.push({
        zh: "未指定主体 — 主体是图片生成最重要的维度，建议添加。",
        en: "No subject specified — subject is the most critical dimension for image generation. Consider adding one."
      });
    }

    // ═══ Rule 2: Photorealistic + anime styles (D-02 #2) ═══
    // Sources: PITFALLS.md Pitfall 4 (false confidence from unvalidated combinations);
    // Midjourney community: photorealistic and anime/aesthetic are contradictory visual languages.
    if (
      artStyleIds.includes("image_art_style:photorealistic") &&
      artStyleIds.includes("image_art_style:anime_manga")
    ) {
      warnings.push({
        zh: "同时选择了写实和动漫风格 — 两套视觉语言冲突，建议只保留其一。",
        en: "Both photorealistic and anime style selected — these visual languages conflict. Consider keeping only one."
      });
    }

    // ═══ Rule 3: B&W monochrome + vibrant color (D-02 #3) ═══
    // Sources: PITFALLS.md Pitfall 4; Midjourney/SD community —
    // monochrome and vibrant are mutually exclusive color schemes.
    if (
      colorPaletteIds.includes("image_color_palette:monochrome") &&
      colorPaletteIds.includes("image_color_palette:vibrant")
    ) {
      warnings.push({
        zh: "黑白单色和高饱和色彩不能同时生效 — 两种色彩方案互斥，建议只保留其一。",
        en: "Black-and-white monochrome and vibrant color cannot coexist — these color schemes are mutually exclusive. Consider keeping only one."
      });
    }

    // ═══ Rule 4: Watercolor + sharp focus styles (D-02 #4) ═══
    // Sources: PITFALLS.md Pitfall 4; watercolor relies on soft edges and bleeding;
    // photorealistic/photorealistic_render/macro_photography demand sharp focus and high detail.
    const sharpFocusIds = [
      "image_art_style:photorealistic",
      "image_art_style:photorealistic_render",
      "image_art_style:macro_photography"
    ];
    if (
      artStyleIds.includes("image_art_style:watercolor") &&
      sharpFocusIds.some((id) => artStyleIds.includes(id))
    ) {
      warnings.push({
        zh: "水彩风格通常使用柔和焦点，与锐焦/写实风格冲突 — 建议只保留其一。",
        en: "Watercolor style typically uses soft focus and conflicts with sharp/realistic rendering. Consider keeping only one."
      });
    }

    // ═══ Rule 5: Multiple art mediums (D-02 #5) ═══
    // Sources: PITFALLS.md Pitfall 4; Midjourney/SD community —
    // multiple physical mediums cause conflicting texture instructions.
    const selectedMediums = IMAGE_ART_MEDIUM_IDS.filter((id) =>
      artStyleIds.includes(id)
    );
    if (selectedMediums.length >= 3) {
      // Extract human-readable labels from option IDs for the warning message
      const mediumLabels = selectedMediums
        .map((id) => id.replace("image_art_style:", ""))
        .join("、");
      warnings.push({
        zh: `选择了多种创作媒介（${mediumLabels}）— 建议只保留一个主要媒介。`,
        en: `Multiple art mediums selected (${selectedMediums.map((id) => id.replace("image_art_style:", "")).join(", ")}) — consider keeping only one primary medium.`
      });
    }

    // ═══ Rule 6: Flat vector + volumetric lighting (D-02 #6) ═══
    // Sources: PITFALLS.md Pitfall 4; flat vector uses solid colors without gradients;
    // volumetric/dramatic lighting contradicts the minimalist flat aesthetic.
    if (
      artStyleIds.includes("image_art_style:vector_flat") &&
      VOLUMETRIC_LIGHTING_IDS.some((id) => lightingIds.includes(id))
    ) {
      warnings.push({
        zh: "扁平矢量风格不需要体积光 — 建议移除光线选择或改用其他风格。",
        en: "Flat vector style does not require volumetric lighting — consider removing lighting choices or switching art style."
      });
    }

    // ═══ Rule 7: 3D rendered + hand-drawn styles (D-02 #7) ═══
    // Sources: PITFALLS.md Pitfall 4; Midjourney/SD community —
    // 3D rendering and hand-drawn are fundamentally different creation approaches.
    const handDrawnIds = [
      "image_art_style:pencil_sketch",
      "image_art_style:line_art",
      "image_art_style:marker_drawing",
      "image_art_style:pastel_drawing"
    ];
    if (
      artStyleIds.includes("image_art_style:3d_render") &&
      handDrawnIds.some((id) => artStyleIds.includes(id))
    ) {
      warnings.push({
        zh: "3D渲染和手绘感是两种不同的创作方式 — 建议只保留其一。",
        en: "3D render and hand-drawn are different creative approaches — consider keeping only one."
      });
    }
  }

  return warnings;
}
