import { registerAdapter } from "../registry";
import { genericVideoTarget } from "../targets/generic-video.target";
import { getBriefText, getCameraText, warningFromBrief } from "../brief";
import type { PromptBrief, RenderedPrompt, TargetAdapter } from "../types";

function render(brief: PromptBrief): RenderedPrompt {
  const zhIntent = brief.rawIntent || getBriefText(brief, "use_case", "zh");
  const enIntent = brief.rawIntent || getBriefText(brief, "use_case", "en");
  const fields = {
    subject: {
      zh: getBriefText(brief, "subject", "zh") || "明确主体",
      en: getBriefText(brief, "subject", "en") || "clear main subject"
    },
    action: {
      zh: getBriefText(brief, "motion", "zh") || "清晰动作",
      en: getBriefText(brief, "motion", "en") || "clear action"
    },
    scene: {
      zh: getBriefText(brief, "scene", "zh") || "聚焦场景",
      en: getBriefText(brief, "scene", "en") || "focused scene"
    },
    camera: {
      zh: getCameraText(brief, "zh") || "稳定镜头",
      en: getCameraText(brief, "en") || "stable camera"
    },
    lighting: {
      zh: getBriefText(brief, "lighting", "zh") || "清晰光线",
      en: getBriefText(brief, "lighting", "en") || "clear lighting"
    },
    style: {
      zh: getBriefText(brief, "style", "zh") || "真实干净风格",
      en: getBriefText(brief, "style", "en") || "clean realistic style"
    },
    audio: {
      zh: getBriefText(brief, "audio", "zh") || "声音自然或后期添加",
      en:
        getBriefText(brief, "audio", "en") ||
        "natural audio or post-production audio"
    },
    format: {
      zh: getBriefText(brief, "format", "zh") || "短视频规格",
      en: getBriefText(brief, "format", "en") || "short video format"
    },
    text_handling: {
      zh: getBriefText(brief, "text_handling", "zh") || "文字尽量少用",
      en:
        getBriefText(brief, "text_handling", "en") ||
        "use minimal on-screen text"
    },
    constraints: {
      zh:
        getBriefText(brief, "constraints", "zh") ||
        "主体一致，避免变形、侵权和乱码",
      en:
        getBriefText(brief, "constraints", "en") ||
        "stable subject, avoid distortion, rights issues, and garbled text"
    }
  };

  const zhPrompt = [
    `目标：${zhIntent || "生成可控视频"}`,
    `格式：${fields.format.zh}`,
    `主体：${fields.subject.zh}`,
    `动作：${fields.action.zh}`,
    `场景：${fields.scene.zh}`,
    `镜头：${fields.camera.zh}`,
    `光线：${fields.lighting.zh}`,
    `风格：${fields.style.zh}`,
    `声音：${fields.audio.zh}`,
    `画面文字：${fields.text_handling.zh}`,
    `约束：${fields.constraints.zh}`
  ].join("\n");

  const enPrompt = [
    `Goal: ${enIntent || "generate a controlled video"}`,
    `Format: ${fields.format.en}`,
    `Subject: ${fields.subject.en}`,
    `Action: ${fields.action.en}`,
    `Scene: ${fields.scene.en}`,
    `Camera: ${fields.camera.en}`,
    `Lighting: ${fields.lighting.en}`,
    `Style: ${fields.style.en}`,
    `Audio: ${fields.audio.en}`,
    `On-screen text: ${fields.text_handling.en}`,
    `Constraints: ${fields.constraints.en}`
  ].join("\n");

  return {
    version: "0.1.0",
    targetToolId: genericVideoTarget.id,
    zhPrompt,
    enPrompt,
    brief,
    adaptationNote: genericVideoTarget.adaptationNote,
    warnings: warningFromBrief(brief)
  };
}

export const genericVideoAdapter: TargetAdapter = {
  target: genericVideoTarget,
  render
};

registerAdapter("generic_video", genericVideoAdapter);
