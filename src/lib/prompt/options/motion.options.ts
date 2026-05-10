import type { OptionSet } from "../types";

export const motionOptions: OptionSet = {
  id: "motion",
  version: "0.1.0",
  label: { zh: "动作", en: "Motion" },
  options: [
    {
      id: "product_reveal",
      version: "0.1.0",
      label: { zh: "产品亮相", en: "Product reveal" },
      plain: { zh: "让产品从遮挡或背景中出现", en: "The product appears from behind cover or background" },
      professionalTerms: ["product reveal", "hero product moment", "clean reveal"],
      promptFragment: {
        zh: "产品以干净利落的方式亮相，成为画面焦点",
        en: "the product is revealed cleanly and becomes the visual focus"
      },
      appliesTo: ["seedance", "generic_video"]
    },
    {
      id: "person_walks_in",
      version: "0.1.0",
      label: { zh: "人物走入画面", en: "Person enters frame" },
      plain: { zh: "人物自然走进画面，适合开场", en: "A person naturally walks into the frame, good for openings" },
      professionalTerms: ["walk-in action", "motivated entrance", "natural movement"],
      promptFragment: {
        zh: "人物自然走入画面，动作连贯，视线逐渐引向主体",
        en: "a person naturally walks into the frame with continuous motion, guiding attention toward the subject"
      },
      appliesTo: ["seedance", "generic_video"]
    },
    {
      id: "hands_demonstrate",
      version: "0.1.0",
      label: { zh: "手部演示", en: "Hands demonstrate" },
      plain: { zh: "用手展示怎么使用或打开", en: "Hands show how to use or open something" },
      professionalTerms: ["hands-on demo", "product interaction", "instructional action"],
      promptFragment: {
        zh: "手部自然演示使用过程，动作清楚，重点突出操作细节",
        en: "hands naturally demonstrate the usage process with clear action and visible operational details"
      },
      appliesTo: ["seedance", "generic_video"]
    },
    {
      id: "environment_comes_alive",
      version: "0.1.0",
      label: { zh: "环境动起来", en: "Environment comes alive" },
      plain: { zh: "风、灯光、人群或物体让画面更有生命力", en: "Wind, lights, crowds, or objects add life to the scene" },
      professionalTerms: ["environmental motion", "atmospheric movement", "scene dynamics"],
      promptFragment: {
        zh: "环境中出现自然运动，如灯光变化、风吹动细节和背景人群流动",
        en: "the environment includes natural motion such as shifting light, wind-touched details, and background crowd movement"
      },
      appliesTo: ["seedance", "generic_video"]
    },
    {
      id: "three_beat_story",
      version: "0.1.0",
      label: { zh: "三段式小故事", en: "Three-beat story" },
      plain: { zh: "开场、变化、结果，短视频更完整", en: "Opening, change, and result for a complete short clip" },
      professionalTerms: ["three-beat structure", "micro narrative", "setup-payoff"],
      promptFragment: {
        zh: "用三段式微叙事呈现：先建立场景，再出现动作变化，最后给出清晰结果",
        en: "present a three-beat micro narrative: establish the scene, show the action change, then end with a clear result"
      },
      appliesTo: ["seedance", "generic_video"]
    },
    {
      id: "before_after",
      version: "0.1.0",
      label: { zh: "前后对比", en: "Before and after" },
      plain: { zh: "先展示问题，再展示改善后的结果", en: "Show the problem first, then the improved result" },
      professionalTerms: ["before-after structure", "transformation", "result reveal"],
      promptFragment: {
        zh: "用前后对比呈现变化：先展示原始状态，再展示改善后的清晰结果",
        en: "use a before-and-after structure: show the original state first, then reveal the clear improved result"
      },
      appliesTo: ["seedance", "generic_video"]
    },
    {
      id: "customer_experience",
      version: "0.1.0",
      label: { zh: "顾客体验过程", en: "Customer experience flow" },
      plain: { zh: "展示进店、体验、满意离开的过程", en: "Show arrival, experience, and satisfied exit" },
      professionalTerms: ["experience flow", "customer journey", "service sequence"],
      promptFragment: {
        zh: "展示顾客体验流程：进入场景、进行体验、露出自然满意反应",
        en: "show a customer experience flow: entering the scene, trying the service, and showing a natural satisfied reaction"
      },
      appliesTo: ["seedance", "generic_video"]
    },
    {
      id: "step_by_step",
      version: "0.1.0",
      label: { zh: "步骤演示", en: "Step-by-step demo" },
      plain: { zh: "适合教程、产品使用、服务流程", en: "For tutorials, product usage, and service process" },
      professionalTerms: ["step-by-step demo", "process clarity", "instructional sequence"],
      promptFragment: {
        zh: "用清晰步骤演示过程，每一步动作明确，观众能理解操作顺序",
        en: "demonstrate the process step by step, with each action clear enough for viewers to understand the sequence"
      },
      appliesTo: ["seedance", "generic_video"]
    }
  ]
};
