import type { TargetToolConfig } from "../types";

export const seedanceTarget: TargetToolConfig = {
  id: "seedance",
  version: "0.1.0",
  label: { zh: "Seedance 2.0", en: "Seedance 2.0" },
  description: {
    zh: "面向 Seedance / 即梦 / 火山方舟类视频生成工具的导演式提示词。",
    en: "Director-style prompts for Seedance, Dreamina, or Volcano Engine video workflows."
  },
  adaptationNote: {
    zh: "已按 Seedance 2.0 优化：强调导演式自然语言、镜头调度、主体一致性、音视频说明和合规约束。",
    en: "Optimized for Seedance 2.0: director-style natural language, camera staging, subject consistency, audio-visual notes, and safety constraints."
  },
  prefer: ["subject", "scene", "motion", "camera", "lighting", "style", "audio", "format", "constraints"],
  suppress: [],
  safetyDefaults: ["no_ip_or_celebrity", "stable_identity", "readable_text"]
};
