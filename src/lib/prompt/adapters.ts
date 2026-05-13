import { buildPromptBrief } from "./brief";
import { evaluatePromptQuality } from "./heuristics";
import { resolveAdapter, resolveTarget } from "./registry";
import type {
  LocalizedText,
  PromptSelections,
  RenderedPrompt,
  TargetToolId,
  WorkTypeConfig
} from "./types";

// Side-effect imports: trigger registerAdapter() calls
import "./renderers/seedance.renderer";
import "./renderers/generic-video.renderer";
import "./renderers/generic-image.renderer";

export function renderPrompt(params: {
  workType: WorkTypeConfig;
  targetToolId: TargetToolId;
  rawIntent: string;
  selections: PromptSelections;
}): RenderedPrompt {
  const target = resolveTarget(params.targetToolId);
  const adapter = resolveAdapter(params.targetToolId);
  const brief = buildPromptBrief({
    workType: params.workType,
    targetToolId: params.targetToolId,
    rawIntent: params.rawIntent,
    selections: params.selections
  });

  let rendered = adapter.render(brief);

  const constraintsItem = brief.items.find(
    (item) => item.questionId === "constraints"
  );
  if (constraintsItem && target.safetyDefaults.length > 0) {
    const selectedIds = new Set(
      constraintsItem.selectedOptions.map((opt) => opt.id)
    );
    const missing = target.safetyDefaults.filter((id) => !selectedIds.has(id));
    if (missing.length > 0) {
      const warning: LocalizedText = {
        zh: `已取消预选的安全约束：${missing.join("、")}。这可能影响生成结果的安全合规性。`,
        en: `Safety defaults deselected: ${missing.join(", ")}. This may affect output safety compliance.`
      };
      rendered = { ...rendered, warnings: [...rendered.warnings, warning] };
    }
  }

  const heuristicWarnings = evaluatePromptQuality(
    params.selections,
    params.targetToolId,
    params.rawIntent,
    params.workType.id
  );
  if (heuristicWarnings.length > 0) {
    rendered = { ...rendered, warnings: [...rendered.warnings, ...heuristicWarnings] };
  }

  if (brief.suppressWarnings && brief.suppressWarnings.length > 0) {
    rendered = { ...rendered, warnings: [...rendered.warnings, ...brief.suppressWarnings] };
  }

  return rendered;
}
