import type { OptionSet } from "../types";

export const motionOptions: OptionSet = {
  id: "motion",
  version: "0.1.0",
  label: { zh: "动作", en: "Motion" },
  options: [
    {
      id: "motion:product_reveal",
      version: "0.1.0",
      label: { zh: "产品亮相", en: "Product reveal" },
      plain: { zh: "让产品从遮挡或背景中出现", en: "The product appears from behind cover or background" },
      professionalTerms: ["product reveal", "hero product moment", "clean reveal"],
      promptFragment: {
        zh: "产品以干净利落的方式亮相，成为画面焦点",
        en: "the product is revealed cleanly and becomes the visual focus"
      },
      appliesTo: ["seedance", "generic_video", "veo3"],
      riskHint: { zh: "", en: "" }
    },
    {
      id: "motion:person_walks_in",
      version: "0.1.0",
      label: { zh: "人物走入画面", en: "Person enters frame" },
      plain: { zh: "人物自然走进画面，适合开场", en: "A person naturally walks into the frame, good for openings" },
      professionalTerms: ["walk-in action", "motivated entrance", "natural movement"],
      promptFragment: {
        zh: "人物自然走入画面，动作连贯，视线逐渐引向主体",
        en: "a person naturally walks into the frame with continuous motion, guiding attention toward the subject"
      },
      appliesTo: ["seedance", "generic_video", "veo3"],
      riskHint: { zh: "", en: "" }
    },
    {
      id: "motion:hands_demonstrate",
      version: "0.1.0",
      label: { zh: "手部演示", en: "Hands demonstrate" },
      plain: { zh: "用手展示怎么使用或打开", en: "Hands show how to use or open something" },
      professionalTerms: ["hands-on demo", "product interaction", "instructional action"],
      promptFragment: {
        zh: "手部自然演示使用过程，动作清楚，重点突出操作细节",
        en: "hands naturally demonstrate the usage process with clear action and visible operational details"
      },
      appliesTo: ["seedance", "generic_video", "veo3"],
      riskHint: { zh: "", en: "" }
    },
    {
      id: "motion:environment_comes_alive",
      version: "0.1.0",
      label: { zh: "环境动起来", en: "Environment comes alive" },
      plain: { zh: "风、灯光、人群或物体让画面更有生命力", en: "Wind, lights, crowds, or objects add life to the scene" },
      professionalTerms: ["environmental motion", "atmospheric movement", "scene dynamics"],
      promptFragment: {
        zh: "环境中出现自然运动，如灯光变化、风吹动细节和背景人群流动",
        en: "the environment includes natural motion such as shifting light, wind-touched details, and background crowd movement"
      },
      appliesTo: ["seedance", "generic_video", "veo3"],
      riskHint: { zh: "", en: "" }
    },
    {
      id: "motion:three_beat_story",
      version: "0.1.0",
      label: { zh: "三段式小故事", en: "Three-beat story" },
      plain: { zh: "开场、变化、结果，短视频更完整", en: "Opening, change, and result for a complete short clip" },
      professionalTerms: ["three-beat structure", "micro narrative", "setup-payoff"],
      promptFragment: {
        zh: "用三段式微叙事呈现：先建立场景，再出现动作变化，最后给出清晰结果",
        en: "present a three-beat micro narrative: establish the scene, show the action change, then end with a clear result"
      },
      appliesTo: ["seedance", "generic_video", "veo3"],
      riskHint: { zh: "", en: "" }
    },
    {
      id: "motion:before_after",
      version: "0.1.0",
      label: { zh: "前后对比", en: "Before and after" },
      plain: { zh: "先展示问题，再展示改善后的结果", en: "Show the problem first, then the improved result" },
      professionalTerms: ["before-after structure", "transformation", "result reveal"],
      promptFragment: {
        zh: "用前后对比呈现变化：先展示原始状态，再展示改善后的清晰结果",
        en: "use a before-and-after structure: show the original state first, then reveal the clear improved result"
      },
      appliesTo: ["seedance", "generic_video", "veo3"],
      riskHint: { zh: "", en: "" }
    },
    {
      id: "motion:customer_experience",
      version: "0.1.0",
      label: { zh: "顾客体验过程", en: "Customer experience flow" },
      plain: { zh: "展示进店、体验、满意离开的过程", en: "Show arrival, experience, and satisfied exit" },
      professionalTerms: ["experience flow", "customer journey", "service sequence"],
      promptFragment: {
        zh: "展示顾客体验流程：进入场景、进行体验、露出自然满意反应",
        en: "show a customer experience flow: entering the scene, trying the service, and showing a natural satisfied reaction"
      },
      appliesTo: ["seedance", "generic_video", "veo3"],
      riskHint: { zh: "", en: "" }
    },
    {
      id: "motion:step_by_step",
      version: "0.1.0",
      label: { zh: "步骤演示", en: "Step-by-step demo" },
      plain: { zh: "适合教程、产品使用、服务流程", en: "For tutorials, product usage, and service process" },
      professionalTerms: ["step-by-step demo", "process clarity", "instructional sequence"],
      promptFragment: {
        zh: "用清晰步骤演示过程，每一步动作明确，观众能理解操作顺序",
        en: "demonstrate the process step by step, with each action clear enough for viewers to understand the sequence"
      },
      appliesTo: ["seedance", "generic_video", "veo3"],
      riskHint: { zh: "", en: "" }
    },
    {
      id: "motion:model_fashion_walk",
      version: "0.1.0",
      label: { zh: "人物走秀/模特展示", en: "Model walk / fashion showcase" },
      plain: { zh: "模特或人物像走秀一样展示穿着，适合服装和时尚场景", en: "A model or person showcases attire like a runway walk, ideal for fashion scenes" },
      professionalTerms: ["runway walk", "model gait", "fashion presentation", "catwalk motion"],
      promptFragment: {
        zh: "人物以走秀姿态前行，服装/配饰随动作自然摆动，展现整体造型",
        en: "the person moves forward with a runway gait, clothing and accessories flow naturally with the motion, presenting the full look"
      },
      appliesTo: ["seedance", "generic_video", "veo3"],
      riskHint: { zh: "", en: "" }
    },
    {
      id: "motion:product_360_spin",
      version: "0.1.0",
      label: { zh: "产品旋转展示", en: "360-degree product spin" },
      plain: { zh: "产品缓慢旋转一周，观众可以看到各个角度的细节", en: "The product rotates slowly for a full view from every angle" },
      professionalTerms: ["360-degree rotation", "product spin", "full rotation showcase", "turntable shot"],
      promptFragment: {
        zh: "产品在画面中心缓慢匀速旋转，展示各个角度的细节和质感",
        en: "the product rotates slowly and evenly at the center of the frame, revealing detail and texture from every angle"
      },
      appliesTo: ["seedance", "generic_video", "veo3"],
      riskHint: { zh: "", en: "" }
    },
    {
      id: "motion:liquid_pour_fill",
      version: "0.1.0",
      label: { zh: "液体倾倒/注入", en: "Liquid pour / fill" },
      plain: { zh: "液体倒入容器，适合饮品、调酒、水景画面", en: "Liquid pours into a container, great for beverages, cocktails, and water scenes" },
      professionalTerms: ["liquid pour", "fluid dynamics", "pouring shot", "splash motion"],
      promptFragment: {
        zh: "液体流畅注入容器，产生自然的飞溅和流动效果，液体质感清晰",
        en: "liquid pours smoothly into the container, creating natural splash and flow effects with visible liquid texture"
      },
      appliesTo: ["seedance", "generic_video", "veo3"],
      riskHint: { zh: "", en: "" }
    },
    {
      id: "motion:unboxing_reveal",
      version: "0.1.0",
      label: { zh: "展开/打开", en: "Unboxing reveal" },
      plain: { zh: "打开包装或盖子，展现内部物品，适合开箱和收纳展示", en: "Opening a package or lid to reveal contents, ideal for unboxing and storage showcases" },
      professionalTerms: ["unboxing action", "lid removal", "container open", "reveal motion"],
      promptFragment: {
        zh: "包装或容器被缓缓打开，内部物品逐渐显露，产生期待和惊喜感",
        en: "the package or container is slowly opened, with the contents gradually revealed, building anticipation and surprise"
      },
      appliesTo: ["seedance", "generic_video", "veo3"],
      riskHint: { zh: "", en: "" }
    },
    {
      id: "motion:subtle_living_photo",
      version: "0.1.0",
      label: { zh: "微动静态", en: "Subtle living photo" },
      plain: { zh: "画面基本静止，只有极轻微的运动（如飘动的头发、微光闪烁），适合产品静物视频", en: "The scene is nearly still with only minimal motion (like drifting hair or subtle light shimmer), ideal for product still-life videos" },
      professionalTerms: ["living photo", "subtle motion", "barely-there movement", "static with micro-motion"],
      promptFragment: {
        zh: "画面整体保持静态，仅保留极细微的自然运动如发丝飘动、光影变化或气泡缓缓升起",
        en: "the scene remains mostly static with only the slightest natural motion such as a strand of hair drifting, light shifting, or bubbles slowly rising"
      },
      riskHint: {
        zh: "部分视频模型难以精确控制运动幅度，实际输出可能运动量偏大",
        en: "Some video models struggle to precisely control motion amplitude; the output may be more active than intended"
      },
      appliesTo: ["seedance", "generic_video", "veo3"]
    },
    {
      id: "motion:timelapse_hyperlapse",
      version: "0.1.0",
      label: { zh: "延时/加速动作", en: "Time-lapse / hyperlapse" },
      plain: { zh: "延时摄影效果，适合展示过程变化和光影流转", en: "Time-lapse effect for showing process changes and light transitions" },
      professionalTerms: ["time-lapse", "hyperlapse", "accelerated motion"],
      promptFragment: { zh: "延时摄影效果，时间加速流动，适合展示过程变化、光影流转或人流车流", en: "time-lapse effect with accelerated time flow, suitable for showing process changes, light transitions, or crowd/traffic movement" },
      appliesTo: ["seedance", "generic_video", "veo3"],
      riskHint: { zh: "延时效果在视频模型中可能出现帧间不一致，导致画面闪烁或跳帧。建议生成后检查流畅度。", en: "Time-lapse effects may have frame-to-frame inconsistency in video models, causing flicker or skipped frames. Check smoothness after generation." },
      suppresses: ["motion:slow_motion_dramatic"]
    },
    {
      id: "motion:slow_motion_dramatic",
      version: "0.1.0",
      label: { zh: "慢动作/升格", en: "Slow motion / dramatic speed" },
      plain: { zh: "动作放慢，增强戏剧感和视觉冲击力", en: "Slowed-down action for dramatic effect and visual impact" },
      professionalTerms: ["slow motion", "high frame rate", "dramatic speed ramp"],
      promptFragment: { zh: "慢动作效果，将关键动作放慢呈现，增强画面质感和戏剧张力", en: "slow motion effect, presenting key actions at reduced speed for enhanced visual texture and dramatic impact" },
      appliesTo: ["seedance", "generic_video", "veo3"],
      riskHint: { zh: "", en: "" },
      suppresses: ["motion:timelapse_hyperlapse"]
    }
  ]
};
