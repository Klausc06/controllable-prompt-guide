import { registerAdapter } from "../registry";
import { veo3Target } from "../targets/veo3.target";
import { assemblePrompt, getCameraText, warningFromBrief } from "../brief";
import type { PromptBrief, RenderedPrompt, TargetAdapter } from "../types";

function render(brief: PromptBrief): RenderedPrompt {
  const tpl = veo3Target.templateMap!;
  const parts = assemblePrompt(brief, tpl, "zh");
  const partsEn = assemblePrompt(brief, tpl, "en");

  const zhCamera = getCameraText(brief, "zh") || "稳定电影镜头";
  const enCamera = getCameraText(brief, "en") || "stable cinematic camera";

  const zhPrompt = [
    parts.format || "生成一段 8-15 秒短片 的视频。",
    parts.subject || "主体：清晰主体",
    parts.motion || "动作：自然连贯动作",
    parts.scene || "环境：明确场景",
    parts.shot_type || parts.camera_movement || `镜头：${zhCamera}`,
    parts.lighting || "光线：自然光线",
    parts.style || "风格：真实电影风格",
    parts.audio || "音频：环境音与画面同步",
    parts.constraints || "约束：主体一致，内容安全"
  ].join("\n");

  const enPrompt = [
    partsEn.format || "Generate a 8-15 second short video.",
    partsEn.subject || "Subject: clear subject",
    partsEn.motion || "Action: natural continuous action",
    partsEn.scene || "Environment: defined environment",
    partsEn.shot_type || partsEn.camera_movement || `Camera: ${enCamera}`,
    partsEn.lighting || "Lighting: natural lighting",
    partsEn.style || "Style: realistic cinematic style",
    partsEn.audio || "Audio: ambient sound synchronized with visuals",
    partsEn.constraints || "Constraints: consistent subject, safe content"
  ].join("\n");

  return {
    version: "0.1.0",
    targetToolId: veo3Target.id,
    zhPrompt,
    enPrompt,
    brief,
    adaptationNote: veo3Target.adaptationNote,
    warnings: warningFromBrief(brief)
  };
}

export const veo3Adapter: TargetAdapter = {
  target: veo3Target,
  render
};

registerAdapter("veo3", veo3Adapter);
