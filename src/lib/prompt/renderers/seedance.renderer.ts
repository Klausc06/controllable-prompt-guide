import { registerAdapter } from "../registry";
import { seedanceTarget } from "../targets/seedance.target";
import { assemblePrompt, getBriefText, getCameraText, warningFromBrief } from "../brief";
import type { PromptBrief, RenderedPrompt, TargetAdapter } from "../types";

function render(brief: PromptBrief): RenderedPrompt {
  const tpl = seedanceTarget.templateMap!;
  const parts = assemblePrompt(brief, tpl, "zh");
  const partsEn = assemblePrompt(brief, tpl, "en");

  const zhIntent = brief.rawIntent || getBriefText(brief, "use_case", "zh");
  const zhFormat = getBriefText(brief, "format", "zh") || "短视频规格，建议 5-15 秒";
  const zhCamera = getCameraText(brief, "zh") || "镜头稳定并突出主体";
  const zhAudio = getBriefText(brief, "audio", "zh");
  const zhText = getBriefText(brief, "text_handling", "zh");
  const zhConstraints = getBriefText(brief, "constraints", "zh");

  const zhPrompt = [
    `生成一段 ${zhFormat} 的视频。`,
    `核心意图：${zhIntent || "按以下描述生成可控视频"}`,
    parts.subject || `主体：明确的主要主体。`,
    parts.scene || `场景：清晰、聚焦的场景。`,
    parts.motion || `动作与叙事：主体进行清晰、连贯的动作。`,
    `镜头调度：${zhCamera}。`,
    parts.lighting || `光线：光线清晰自然。`,
    parts.style || `视觉风格：真实、干净、可控。`,
    zhAudio
      ? `声音：${zhAudio}。`
      : "声音：如模型支持音频，保持自然、不过度抢画面。",
    zhText
      ? `画面文字：${zhText}。重要文字保持短、清楚、可读。`
      : "画面文字：尽量少用，重要文字建议后期添加。",
    zhConstraints
      ? `限制：${zhConstraints}。`
      : "限制：主体保持一致，避免变形、乱码、侵权角色和未授权肖像。"
  ].join("\n");

  const enIntent = brief.rawIntent || getBriefText(brief, "use_case", "en");
  const enFormat = getBriefText(brief, "format", "en") || "short video format, ideally 5-15 seconds";
  const enCamera = getCameraText(brief, "en") || "stable camera work that emphasizes the subject";
  const enAudio = getBriefText(brief, "audio", "en");
  const enText = getBriefText(brief, "text_handling", "en");
  const enConstraints = getBriefText(brief, "constraints", "en");

  const enPrompt = [
    `Generate a ${enFormat} video.`,
    `Core intent: ${enIntent || "create a controlled short video from the following direction"}.`,
    partsEn.subject || `Subject: a clear main subject.`,
    partsEn.scene || `Scene: a focused and readable scene.`,
    partsEn.motion || `Action and story: the subject performs a clear continuous action.`,
    `Camera staging: ${enCamera}.`,
    partsEn.lighting || `Lighting: clear natural lighting.`,
    partsEn.style || `Visual style: realistic, clean, and controlled.`,
    enAudio
      ? `Audio: ${enAudio}.`
      : "Audio: if supported, keep it natural and not distracting.",
    enText
      ? `On-screen text: ${enText}. Keep important text short, clear, and readable.`
      : "On-screen text: use minimal text; add critical text in post-production.",
    enConstraints
      ? `Constraints: ${enConstraints}.`
      : "Constraints: keep subject identity stable, avoid distortion, garbled text, copyrighted characters, and unauthorized likenesses."
  ].join("\n");

  return {
    version: "0.1.0",
    targetToolId: seedanceTarget.id,
    zhPrompt,
    enPrompt,
    brief,
    adaptationNote: seedanceTarget.adaptationNote,
    warnings: warningFromBrief(brief)
  };
}

export const seedanceAdapter: TargetAdapter = {
  target: seedanceTarget,
  render
};

registerAdapter("seedance", seedanceAdapter);
