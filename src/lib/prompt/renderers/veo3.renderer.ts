import { registerAdapter } from "../registry";
import { veo3Target } from "../targets/veo3.target";
import { getBriefText, getCameraText, warningFromBrief } from "../brief";
import type { PromptBrief, RenderedPrompt, TargetAdapter } from "../types";

function render(brief: PromptBrief): RenderedPrompt {
  const zhSubject = getBriefText(brief, "subject", "zh") || "清晰主体";
  const zhAction = getBriefText(brief, "motion", "zh") || "自然连贯动作";
  const zhEnvironment = getBriefText(brief, "scene", "zh") || "明确场景";
  const zhCamera = getCameraText(brief, "zh") || "稳定电影镜头";
  const zhLighting = getBriefText(brief, "lighting", "zh") || "自然光线";
  const zhStyle = getBriefText(brief, "style", "zh") || "真实电影风格";
  const zhAudio = getBriefText(brief, "audio", "zh") || "环境音与画面同步";
  const zhDuration = getBriefText(brief, "format", "zh") || "8-15 秒短片";
  const zhConstraints = getBriefText(brief, "constraints", "zh") || "主体一致，内容安全";

  const enSubject = getBriefText(brief, "subject", "en") || "clear subject";
  const enAction = getBriefText(brief, "motion", "en") || "natural continuous action";
  const enEnvironment = getBriefText(brief, "scene", "en") || "defined environment";
  const enCamera = getCameraText(brief, "en") || "stable cinematic camera";
  const enLighting = getBriefText(brief, "lighting", "en") || "natural lighting";
  const enStyle = getBriefText(brief, "style", "en") || "realistic cinematic style";
  const enAudio = getBriefText(brief, "audio", "en") || "ambient sound synchronized with visuals";
  const enDuration = getBriefText(brief, "format", "en") || "8-15 second short";
  const enConstraints = getBriefText(brief, "constraints", "en") || "consistent subject, safe content";

  const zhPrompt = [
    `生成一段 ${zhDuration} 的视频。`,
    `主体：${zhSubject}`,
    `动作：${zhAction}`,
    `环境：${zhEnvironment}`,
    `镜头：${zhCamera}`,
    `光线：${zhLighting}`,
    `风格：${zhStyle}`,
    `音频：${zhAudio}`,
    `约束：${zhConstraints}`
  ].join("\n");

  const enPrompt = [
    `Generate a ${enDuration} video.`,
    `Subject: ${enSubject}`,
    `Action: ${enAction}`,
    `Environment: ${enEnvironment}`,
    `Camera: ${enCamera}`,
    `Lighting: ${enLighting}`,
    `Style: ${enStyle}`,
    `Audio: ${enAudio}`,
    `Constraints: ${enConstraints}`
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
