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
  safetyDefaults: ["constraints:no_ip_or_celebrity", "constraints:stable_identity"],
  supportedWorkTypes: ["video_prompt"],
  templateMap: {
    use_case:       { zh: "目标：{选项}", en: "Goal: {选项}" },
    format:         { zh: "格式：{选项}", en: "Format: {选项}" },
    subject:        { zh: "主体：{选项}", en: "Subject: {选项}" },
    motion:         { zh: "动作：{选项}", en: "Action: {选项}" },
    scene:          { zh: "场景：{选项}", en: "Scene: {选项}" },
    shot_type:      { zh: "镜头：{选项}", en: "Camera: {选项}" },
    camera_movement:{ zh: "运镜：{选项}", en: "Camera movement: {选项}" },
    lighting:       { zh: "光线：{选项}", en: "Lighting: {选项}" },
    style:          { zh: "风格：{选项}", en: "Style: {选项}" },
    audio:          { zh: "声音：{选项}", en: "Audio: {选项}" },
    text_handling:  { zh: "画面文字：{选项}", en: "On-screen text: {选项}" },
    constraints:    { zh: "约束：{选项}", en: "Constraints: {选项}" }
  }
};
