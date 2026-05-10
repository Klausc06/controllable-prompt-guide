import type { TargetToolConfig } from "../types";

export const genericVideoTarget: TargetToolConfig = {
  id: "generic_video",
  version: "0.1.0",
  label: { zh: "通用视频模型", en: "Generic video model" },
  description: {
    zh: "不绑定特定平台的通用视频生成提示词。",
    en: "A general video generation prompt that avoids platform-specific syntax."
  },
  adaptationNote: {
    zh: "已按通用视频模型优化：使用 subject + action + scene + camera + lighting + style + audio + constraints 的稳定结构。",
    en: "Optimized for generic video models with a stable subject + action + scene + camera + lighting + style + audio + constraints structure."
  },
  prefer: ["subject", "motion", "scene", "camera", "lighting", "style", "audio", "constraints"],
  suppress: [],
  safetyDefaults: ["no_ip_or_celebrity", "stable_identity"]
};
