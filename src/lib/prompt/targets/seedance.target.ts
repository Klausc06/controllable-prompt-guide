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
  safetyDefaults: ["constraints:no_ip_or_celebrity", "constraints:stable_identity", "constraints:readable_text"],
  templateMap: {
    use_case:       { zh: "核心意图：{选项}", en: "Core intent: {选项}" },
    subject:        { zh: "主体：{选项}。", en: "Subject: {选项}." },
    scene:          { zh: "场景：{选项}。", en: "Scene: {选项}." },
    motion:         { zh: "动作与叙事：{选项}。", en: "Action and story: {选项}." },
    shot_type:      { zh: "镜头类型：{选项}。", en: "Shot type: {选项}." },
    camera_movement:{ zh: "运镜：{选项}。", en: "Camera movement: {选项}." },
    lighting:       { zh: "光线：{选项}。", en: "Lighting: {选项}." },
    style:          { zh: "视觉风格：{选项}。", en: "Visual style: {选项}." },
    audio:          { zh: "声音：{选项}。", en: "Audio: {选项}." },
    format:         { zh: "格式：{选项}。", en: "Format: {选项}." },
    text_handling:  { zh: "画面文字：{选项}。", en: "On-screen text: {选项}." },
    constraints:    { zh: "限制：{选项}。", en: "Constraints: {选项}." }
  }
};
