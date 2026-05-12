import { getOptionById } from "./registry";
import type {
  BriefItem,
  LocalizedText,
  PromptBrief,
  PromptSelections,
  RenderedPrompt,
  SelectionValue,
  TargetToolId,
  WorkTypeConfig
} from "./types";

export function warningFromBrief(brief: PromptBrief): LocalizedText[] {
  return brief.items.flatMap((item) =>
    item.selectedOptions.flatMap((option) =>
      option.riskHint ? [option.riskHint] : []
    )
  );
}

export function getCameraText(
  brief: PromptBrief,
  locale: "zh" | "en"
): string {
  const join = locale === "zh" ? "；" : "; ";
  const camera = getBriefText(brief, "camera", locale);
  if (camera) return camera;
  return [getBriefText(brief, "shot_type", locale), getBriefText(brief, "camera_movement", locale)]
    .filter(Boolean)
    .join(join);
}

function normalizeSelection(value: SelectionValue | undefined): string[] {
  if (!value) {
    return [];
  }
  return Array.isArray(value) ? value : [value];
}

export function buildPromptBrief(params: {
  version?: string;
  workType: WorkTypeConfig;
  targetToolId: TargetToolId;
  rawIntent: string;
  selections: PromptSelections;
}): PromptBrief {
  const items: BriefItem[] = params.workType.questions
    .map((question): BriefItem | undefined => {
      const value = params.selections[question.id];
      if (question.mode === "free_text") {
        const freeText = typeof value === "string" ? value.trim() : "";
        if (!freeText) {
          return undefined;
        }
        return {
          questionId: question.id,
          title: question.title,
          selectedOptions: [],
          freeText
        };
      }

      let selectedOptions = normalizeSelection(value)
        .map((optionId) => getOptionById(optionId))
        .filter((option): option is NonNullable<typeof option> => Boolean(option));

      if (question.maxSelections && selectedOptions.length > question.maxSelections) {
        selectedOptions = selectedOptions.slice(0, question.maxSelections);
      }

      if (selectedOptions.length === 0) {
        return undefined;
      }

      return {
        questionId: question.id,
        title: question.title,
        selectedOptions
      };
    })
    .filter((item): item is BriefItem => Boolean(item));

  const { visible: visibleItems, warnings: suppressWarnings } = applySuppresses(items);

  return {
    version: params.version ?? "0.1.0",
    workTypeId: params.workType.id,
    targetToolId: params.targetToolId,
    rawIntent: params.rawIntent,
    items: visibleItems,
    suppressWarnings: suppressWarnings.length > 0 ? suppressWarnings : undefined
  };
}

/** Data-driven suppress detection (D-02). When option A suppresses option B and both are selected, B is removed and a warning generated. */
export function applySuppresses(
  items: BriefItem[]
): { visible: BriefItem[]; warnings: LocalizedText[] } {
  const warnings: LocalizedText[] = [];
  const allSelectedIds = new Set(
    items.flatMap((item) => item.selectedOptions.map((o) => o.id))
  );
  const suppressorIds = new Set<string>();

  // Find suppressors
  for (const item of items) {
    for (const opt of item.selectedOptions) {
      if (opt.suppresses?.length) {
        for (const suppressedId of opt.suppresses) {
          if (allSelectedIds.has(suppressedId)) {
            suppressorIds.add(suppressedId);
            warnings.push({
              zh: `已选"${opt.label.zh}"，因此"${suppressedId}"不生效`,
              en: `"${opt.label.en}" overrides "${suppressedId}"`
            });
          }
        }
      }
    }
  }

  // Filter suppressed options
  const visible = items.map((item) => ({
    ...item,
    selectedOptions: item.selectedOptions.filter((o) => !suppressorIds.has(o.id))
  })).filter((item) => item.selectedOptions.length > 0);

  return { visible, warnings };
}

export function getBriefText(brief: PromptBrief, questionId: string, locale: "zh" | "en") {
  const item = brief.items.find((briefItem) => briefItem.questionId === questionId);
  if (!item) {
    return "";
  }
  if (item.freeText) {
    return item.freeText;
  }
  return item.selectedOptions.map((option) => option.promptFragment[locale]).join(locale === "zh" ? "；" : "; ");
}

export function renderMarkdown(rendered: RenderedPrompt): string {
  const lines: string[] = [];

  lines.push("# Video Prompt Brief");
  lines.push(`**Target:** ${rendered.targetToolId}`);
  lines.push(`**Work Type:** ${rendered.brief.workTypeId}`);
  lines.push("");
  lines.push("## Chinese Prompt");
  lines.push(rendered.zhPrompt);
  lines.push("");
  lines.push("## English Prompt");
  lines.push(rendered.enPrompt);
  lines.push("");
  lines.push("## Brief Items");
  lines.push("| Dimension | Selection |");
  lines.push("|-----------|-----------|");
  for (const item of rendered.brief.items) {
    const selection = item.freeText || item.selectedOptions.map((o) => o.label.zh).join("、");
    lines.push(`| ${item.title.zh} | ${selection} |`);
  }

  const uniqueWarnings = Array.from(
    new Set(rendered.warnings.map((w) => w.zh))
  );
  if (uniqueWarnings.length > 0) {
    lines.push("");
    lines.push("## Warnings");
    for (const warning of uniqueWarnings) {
      lines.push(`- ${warning}`);
    }
  }

  return lines.join("\n");
}

/** Generic template-driven prompt assembly (D-03). Iterates brief items, looks up templateMap slots, replaces {选项} with option text. */
export function assemblePrompt(
  brief: PromptBrief,
  templateMap: Record<string, LocalizedText>,
  locale: "zh" | "en"
): Record<string, string | undefined> {
  const result: Record<string, string | undefined> = {};
  for (const item of brief.items) {
    const tpl = templateMap[item.questionId];
    if (!tpl) continue;
    const text =
      item.freeText ??
      item.selectedOptions.map((o) => o.promptFragment[locale]).join("，");
    if (!text) continue;
    result[item.questionId] = tpl[locale].replace("{选项}", text);
  }
  return result;
}
