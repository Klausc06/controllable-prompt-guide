import { registerAdapter } from "../registry";
import { genericVideoTarget } from "../targets/generic-video.target";
import { assemblePrompt, getBriefText, getCameraText, warningFromBrief } from "../brief";
import type { PromptBrief, RenderedPrompt, TargetAdapter } from "../types";

function render(brief: PromptBrief): RenderedPrompt {
  const tpl = genericVideoTarget.templateMap!;
  const parts = assemblePrompt(brief, tpl, "zh");
  const partsEn = assemblePrompt(brief, tpl, "en");

  const zhIntent = brief.rawIntent || getBriefText(brief, "use_case", "zh");
  const zhCamera = getCameraText(brief, "zh") || "稳定镜头";

  const zhPrompt = [
    parts.use_case || `目标：${zhIntent || "生成可控视频"}`,
    parts.format || "格式：短视频规格",
    parts.subject || "主体：明确主体",
    parts.motion || "动作：清晰动作",
    parts.scene || "场景：聚焦场景",
    parts.shot_type || parts.camera_movement || `镜头：${zhCamera}`,
    parts.lighting || "光线：清晰光线",
    parts.style || "风格：真实干净风格",
    parts.audio || "声音：声音自然或后期添加",
    parts.text_handling || "画面文字：文字尽量少用",
    parts.constraints || "约束：主体一致，避免变形、侵权和乱码"
  ].join("\n");

  const enIntent = brief.rawIntent || getBriefText(brief, "use_case", "en");
  const enCamera = getCameraText(brief, "en") || "stable camera";

  const enPrompt = [
    partsEn.use_case || `Goal: ${enIntent || "generate a controlled video"}`,
    partsEn.format || "Format: short video format",
    partsEn.subject || "Subject: clear main subject",
    partsEn.motion || "Action: clear action",
    partsEn.scene || "Scene: focused scene",
    partsEn.shot_type || partsEn.camera_movement || `Camera: ${enCamera}`,
    partsEn.lighting || "Lighting: clear lighting",
    partsEn.style || "Style: clean realistic style",
    partsEn.audio || "Audio: natural audio or post-production audio",
    partsEn.text_handling || "On-screen text: use minimal on-screen text",
    partsEn.constraints || "Constraints: stable subject, avoid distortion, rights issues, and garbled text"
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
