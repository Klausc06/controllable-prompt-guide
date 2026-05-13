import { registerAdapter } from "../registry";
import { genericImageTarget } from "../targets/generic-image.target";
import { assemblePrompt, getBriefText, warningFromBrief } from "../brief";
import type { PromptBrief, RenderedPrompt, TargetAdapter } from "../types";

function render(brief: PromptBrief): RenderedPrompt {
  const tpl = genericImageTarget.templateMap!;
  const parts = assemblePrompt(brief, tpl, "zh");
  const partsEn = assemblePrompt(brief, tpl, "en");

  // Collect non-empty parts and join with locale-appropriate separator.
  // Chinese: full-width comma "，"  /  English: comma + space ", "
  // Filter out undefined/empty values so no dangling separators.

  const zhPhrases: string[] = [];
  const enPhrases: string[] = [];

  // Iterate templateMap keys to maintain consistent order
  // between zh and en output (templateMap keys define the dimension order)
  for (const key of Object.keys(tpl)) {
    if (parts[key]) zhPhrases.push(parts[key]!);
    if (partsEn[key]) enPhrases.push(partsEn[key]!);
  }

  // Prepend intent from rawIntent or use_case as a leading phrase
  const zhIntent = brief.rawIntent || getBriefText(brief, "use_case", "zh");
  const enIntent = brief.rawIntent || getBriefText(brief, "use_case", "en");

  // Build final prompts: intent (if available) followed by comma-separated dimension phrases
  const zhPrompt = (zhIntent ? zhIntent + "，" : "") + zhPhrases.join("，");
  const enPrompt = (enIntent ? enIntent + ", " : "") + enPhrases.join(", ");

  return {
    version: "0.1.0",
    targetToolId: genericImageTarget.id,
    zhPrompt,
    enPrompt,
    brief,
    adaptationNote: genericImageTarget.adaptationNote,
    warnings: warningFromBrief(brief)
  };
}

export const genericImageAdapter: TargetAdapter = {
  target: genericImageTarget,
  render
};

registerAdapter("generic_image", genericImageAdapter);
