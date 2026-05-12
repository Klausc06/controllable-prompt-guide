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
  safetyDefaults: ["constraints:no_ip_or_celebrity", "constraints:stable_identity"],
  templateMap: {
    use_case:       { zh: "意图：{选项}", en: "Intent: {选项}" },
    format:         { zh: "时长：{选项}", en: "Duration: {选项}" },
    subject:        { zh: "主体：{选项}", en: "Subject: {选项}" },
    motion:         { zh: "动作：{选项}", en: "Action: {选项}" },
    scene:          { zh: "场景：{选项}", en: "Scene: {选项}" },
    shot_type:      { zh: "镜头：{选项}", en: "Camera: {选项}" },
    camera_movement:{ zh: "运镜：{选项}", en: "Camera movement: {选项}" },
    lighting:       { zh: "光线：{选项}", en: "Lighting: {选项}" },
    style:          { zh: "风格：{选项}", en: "Style: {选项}" },
    audio:          { zh: "声音：{选项}", en: "Audio: {选项}" },
    constraints:    { zh: "约束：{选项}", en: "Constraints: {选项}" }
  }
};
