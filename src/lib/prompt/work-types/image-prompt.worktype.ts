import { getAllOptionSets, registerWorkType } from "../registry";
import type { WorkTypeConfig } from "../types";

export const imagePromptWorkType: WorkTypeConfig = {
  id: "image_prompt",
  version: "0.1.0",
  label: { zh: "图片提示词", en: "Image prompt" },
  description: {
    zh: "通过选择题生成可复制的图片提示词。",
    en: "Generate copy-ready image prompts through guided choices."
  },
  questions: [
    {
      id: "lighting",
      version: "0.1.0",
      title: { zh: "光线", en: "Lighting" },
      helper: {
        zh: "选择画面光线风格。",
        en: "Choose the lighting style for the image."
      },
      mode: "multi",
      level: "core",
      required: true,
      optionSetId: "lighting",
      minSelections: 1
    }
  ]
};

// Pre-registration validation: duplicate question IDs + optionSet refs
const qIds = new Set<string>();
for (const q of imagePromptWorkType.questions) {
  if (qIds.has(q.id)) {
    throw new Error(`Duplicate question ID "${q.id}" in work type "image_prompt"`);
  }
  qIds.add(q.id);
}
const registeredSetIds = new Set(getAllOptionSets().map((s) => s.id));
for (const q of imagePromptWorkType.questions) {
  if (q.optionSetId && !registeredSetIds.has(q.optionSetId)) {
    throw new Error(
      `Question "${q.id}" references unknown optionSetId "${q.optionSetId}"`
    );
  }
}
registerWorkType(imagePromptWorkType);
