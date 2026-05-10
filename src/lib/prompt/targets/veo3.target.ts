import type { TargetToolConfig } from "../types";

export const veo3Target: TargetToolConfig = {
  id: "veo3",
  version: "0.1.0",
  label: { zh: "Veo 3 (Google)", en: "Veo 3 (Google)" },
  description: {
    zh: "面向 Google DeepMind Veo 3 的 cinematographic 风格视频提示词，支持音频生成。",
    en: "Cinematographic-style video prompts for Google DeepMind Veo 3, with native audio generation."
  },
  adaptationNote: {
    zh: "已按 Veo 3 优化：使用 subject + action + environment + camera + lighting + style + audio + duration 的 cinematographic 结构。Veo 3 原生支持音频生成 — audio 维度有实际生成效果。",
    en: "Optimized for Veo 3: subject + action + environment + camera + lighting + style + audio + duration cinematographic structure. Veo 3 natively supports audio generation."
  },
  prefer: ["subject", "motion", "scene", "camera", "lighting", "style", "audio", "format"],
  suppress: [],
  safetyDefaults: ["no_ip_or_celebrity", "stable_identity"]
};
