import { getAllOptionSets, registerWorkType } from "../registry";
import type { WorkTypeConfig } from "../types";

export const videoPromptWorkType: WorkTypeConfig = {
  id: "video_prompt",
  version: "0.1.0",
  label: { zh: "视频提示词", en: "Video prompt" },
  description: {
    zh: "通过选择题把模糊想法整理成可复制的视频生成提示词。",
    en: "Turn a rough idea into a copy-ready video generation prompt through guided choices."
  },
  questions: [
    {
      id: "use_case",
      version: "0.1.0",
      title: { zh: "你想做哪类视频？", en: "What kind of video do you want?" },
      helper: {
        zh: "先选作品目标，系统会自动把粗糙意图写进 prompt。",
        en: "Choose the use case first; the system turns it into the prompt intent."
      },
      mode: "single",
      level: "core",
      required: true,
      optionSetId: "use_case"
    },
    {
      id: "subject",
      version: "0.1.0",
      title: { zh: "主体是哪一种？", en: "What type is the main subject?" },
      helper: {
        zh: "不用自己描述主体，选最接近的类别即可。",
        en: "No writing needed; choose the closest subject type."
      },
      mode: "single",
      level: "core",
      required: true,
      optionSetId: "subject"
    },
    {
      id: "scene",
      version: "0.1.0",
      title: { zh: "发生在哪里？", en: "Where does it happen?" },
      helper: {
        zh: "选择一个能承载这个视频的典型场景。",
        en: "Choose a typical scene that supports this video."
      },
      mode: "single",
      level: "core",
      required: true,
      optionSetId: "scene"
    },
    {
      id: "motion",
      version: "0.1.0",
      title: { zh: "画面里发生什么动作？", en: "What action happens in the shot?" },
      helper: {
        zh: "选一个最关键的动作，避免一次塞太多。",
        en: "Choose the key action and avoid overloading the clip."
      },
      mode: "single",
      level: "core",
      required: true,
      optionSetId: "motion"
    },
    {
      id: "shot_type",
      version: "0.1.0",
      title: { zh: "镜头构图怎么选？", en: "What shot framing?" },
      helper: {
        zh: "决定画面包含多少内容：远景看环境，特写看细节。",
        en: "How much does the shot include — wide for context, close-up for detail."
      },
      mode: "single",
      level: "core",
      required: true,
      optionSetId: "shot_type"
    },
    {
      id: "camera_movement",
      version: "0.1.0",
      title: { zh: "镜头怎么动？", en: "How should the camera move?" },
      helper: {
        zh: "不动更稳，推进更有情绪，环绕更有展示感。（Seedance 要求镜头构图和运动分开设置以避免画面抖动）",
        en: "Static is stable, push-in builds emotion, orbit showcases. (Seedance requires separating shot type from camera movement to avoid jitter.)"
      },
      mode: "single",
      level: "core",
      required: true,
      optionSetId: "camera_movement"
    },
    {
      id: "lighting",
      version: "0.1.0",
      title: { zh: "光线是什么感觉？", en: "What should the lighting feel like?" },
      helper: {
        zh: "光线会直接影响专业感和情绪。",
        en: "Lighting strongly affects polish and emotion."
      },
      mode: "single",
      level: "core",
      required: true,
      optionSetId: "lighting"
    },
    {
      id: "style",
      version: "0.1.0",
      title: { zh: "整体风格是什么？", en: "What is the overall style?" },
      helper: {
        zh: "不用懂术语，选最接近你脑中画面的感觉。",
        en: "No jargon needed; choose the feeling closest to your idea."
      },
      mode: "single",
      level: "core",
      required: true,
      optionSetId: "style"
    },
    {
      id: "constraints",
      version: "0.1.0",
      title: { zh: "需要避免什么问题？", en: "What should be avoided?" },
      helper: {
        zh: "这些限制能降低变形、侵权、乱码等风险。",
        en: "These constraints reduce distortion, rights, and text risks."
      },
      mode: "multi",
      level: "core",
      required: true,
      optionSetId: "constraints",
      minSelections: 1,
      maxSelections: 4
    },
    {
      id: "audio",
      version: "0.1.0",
      title: { zh: "声音怎么处理？", en: "How should audio be handled?" },
      helper: {
        zh: "如果目标工具不支持声音，这部分也可以作为后期说明。",
        en: "If the target tool does not support audio, this becomes post-production guidance."
      },
      mode: "single",
      level: "advanced",
      required: false,
      optionSetId: "audio"
    },
    {
      id: "format",
      version: "0.1.0",
      title: { zh: "比例和时长", en: "Aspect ratio and duration" },
      helper: {
        zh: "选择常见平台规格，后续可以继续增加更多尺寸。",
        en: "Choose a common platform format; more sizes can be added later."
      },
      mode: "single",
      level: "advanced",
      required: false,
      optionSetId: "format"
    },
    {
      id: "text_handling",
      version: "0.1.0",
      title: { zh: "画面文字", en: "On-screen text" },
      helper: {
        zh: "生成模型写字不稳定，先选安全的文字策略。",
        en: "Generated text is unstable, so choose a safer text strategy."
      },
      mode: "single",
      level: "advanced",
      required: false,
      optionSetId: "text_handling"
    }
  ]
};

export const workTypes = [videoPromptWorkType] satisfies WorkTypeConfig[];

// Pre-registration validation: duplicate question IDs + optionSet refs (TEST-02, TEST-03)
const qIds = new Set<string>();
for (const q of videoPromptWorkType.questions) {
  if (qIds.has(q.id)) {
    throw new Error(`Duplicate question ID "${q.id}" in work type "video_prompt"`);
  }
  qIds.add(q.id);
}
const registeredSetIds = new Set(getAllOptionSets().map((s) => s.id));
for (const q of videoPromptWorkType.questions) {
  if (q.optionSetId && !registeredSetIds.has(q.optionSetId)) {
    throw new Error(
      `Question "${q.id}" references unknown optionSetId "${q.optionSetId}"`
    );
  }
}
registerWorkType(videoPromptWorkType);
