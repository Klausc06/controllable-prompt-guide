import type { OptionSet } from "../types";

export const constraintsOptions: OptionSet = {
  id: "constraints",
  version: "0.1.0",
  label: { zh: "限制", en: "Constraints" },
  options: [
    {
      id: "constraints:no_ip_or_celebrity",
      version: "0.1.0",
      label: { zh: "避开明星和影视 IP", en: "Avoid celebrities and IP" },
      plain: {
        zh: "不要出现明星脸、影视角色或明显侵权元素",
        en: "Do not include celebrity likenesses, fictional characters, or obvious IP"
      },
      professionalTerms: ["copyright safety", "likeness safety", "IP-safe"],
      promptFragment: {
        zh: "不使用明星脸、影视 IP、未授权角色或明显品牌侵权元素",
        en: "avoid celebrity likenesses, copyrighted characters, unauthorized roles, or obvious brand-infringing elements"
      },
      appliesTo: ["seedance", "generic_video"]
    },
    {
      id: "constraints:stable_identity",
      version: "0.1.0",
      label: { zh: "人物/主体保持一致", en: "Keep identity stable" },
      plain: { zh: "主体不要变脸、变形或突然变成别的东西", en: "The subject should not morph or change identity" },
      professionalTerms: ["identity consistency", "no morphing", "stable subject"],
      promptFragment: {
        zh: "主体身份、服装和外观保持一致，不变脸、不畸变、不突然切换主体",
        en: "keep the subject identity, clothing, and appearance consistent with no morphing, distortion, or sudden subject changes"
      },
      appliesTo: ["seedance", "generic_video"]
    },
    {
      id: "constraints:readable_text",
      version: "0.1.0",
      label: { zh: "文字少且可读", en: "Readable minimal text" },
      plain: { zh: "如果有文字，就短、清楚、不要乱码", en: "If text appears, keep it short, clear, and not garbled" },
      professionalTerms: ["text legibility", "short on-screen text", "avoid garbled typography"],
      promptFragment: {
        zh: "如需画面文字，只使用短句，位置清楚，避免乱码、错字和过多字幕",
        en: "if on-screen text is needed, keep it short and clearly placed, avoiding garbled letters, typos, and excessive captions"
      },
      appliesTo: ["seedance", "generic_video"],
      riskHint: {
        zh: "多数视频模型对画面文字仍不稳定，重要文字建议后期添加。",
        en: "Most video models still render text unreliably; add critical text in post-production."
      }
    },
    {
      id: "constraints:simple_scene",
      version: "0.1.0",
      label: { zh: "画面不要太复杂", en: "Keep scene simple" },
      plain: { zh: "减少人物和杂物，降低翻车概率", en: "Fewer people and objects reduce failure risk" },
      professionalTerms: ["simple scene", "low visual complexity", "focused composition"],
      promptFragment: {
        zh: "画面保持简洁，减少无关人物和杂物，主体清楚明确",
        en: "keep the scene simple with fewer unrelated people and objects, making the subject clear"
      },
      appliesTo: ["seedance", "generic_video"]
    },
    {
      id: "constraints:no_logo_hallucination",
      version: "0.1.0",
      label: { zh: "不要乱生成品牌标志", en: "Avoid fake logos" },
      plain: { zh: "避免出现奇怪 logo、错误商标或假品牌", en: "Avoid odd logos, incorrect trademarks, or fake branding" },
      professionalTerms: ["brand safety", "no logo hallucination", "trademark-safe"],
      promptFragment: {
        zh: "不要随机生成品牌标志、错误商标或假品牌元素，背景保持品牌安全",
        en: "do not hallucinate random logos, incorrect trademarks, or fake brand elements; keep the background brand-safe"
      },
      appliesTo: ["seedance", "generic_video"],
      riskHint: {
        zh: "真实品牌、价格和活动文案最好后期添加。",
        en: "Real brand names, prices, and campaign copy are safer to add in post."
      }
    },
    {
      id: "constraints:no_extra_limbs",
      version: "0.1.0",
      label: { zh: "避免手脚畸形", en: "Avoid hand and limb defects" },
      plain: { zh: "适合有人物、手部演示、运动动作时使用", en: "Useful for people, hand demos, and athletic actions" },
      professionalTerms: ["anatomy consistency", "natural hands", "no extra limbs"],
      promptFragment: {
        zh: "人物手部和肢体保持自然比例，避免多手指、多肢体、扭曲关节和异常姿态",
        en: "keep hands and limbs anatomically natural, avoiding extra fingers, extra limbs, twisted joints, and unnatural poses"
      },
      appliesTo: ["seedance", "generic_video"]
    },
    {
      id: "constraints:single_focal_subject",
      version: "0.1.0",
      label: { zh: "只保留一个视觉重点", en: "Single focal subject" },
      plain: { zh: "让模型知道谁最重要，减少跑题", en: "Tell the model what matters most and reduce drift" },
      professionalTerms: ["single focal point", "visual hierarchy", "focused composition"],
      promptFragment: {
        zh: "画面只保留一个明确视觉重点，其他元素作为背景辅助，不抢主体",
        en: "keep one clear focal subject, with all other elements supporting the background without competing for attention"
      },
      appliesTo: ["seedance", "generic_video"]
    },
    {
      id: "constraints:avoid_temporal_flicker",
      version: "0.1.0",
      label: { zh: "避免画面闪烁和跳变", en: "Avoid temporal flicker and frame jitter" },
      plain: {
        zh: "减少画面中的闪烁、跳变和不连贯帧，保持输出画面稳定",
        en: "Reduce flicker, jitter, and inconsistent frames in the video output"
      },
      professionalTerms: ["temporal consistency", "frame stability", "no flicker"],
      promptFragment: {
        zh: "避免画面闪烁和跳变，保持帧间连贯一致",
        en: "avoid temporal flicker and frame jitter, maintaining consistent frame-to-frame coherence"
      },
      appliesTo: ["seedance"]
    },
    {
      id: "constraints:avoid_quality_keywords",
      version: "0.1.0",
      label: { zh: "避免降低输出质量的关键词", en: "Avoid quality-degrading keywords" },
      plain: {
        zh: "Seedance 2.0 对 'fast', 'cinematic', 'epic', 'amazing', 'lots_of_movement' 等关键词敏感，会降低输出质量",
        en: "Seedance 2.0 is sensitive to keywords like 'fast', 'cinematic', 'epic', 'amazing', 'lots_of_movement' which degrade output quality"
      },
      professionalTerms: ["prompt engineering", "keyword hygiene", "quality preservation"],
      promptFragment: {
        zh: "避免使用 'fast', 'cinematic', 'epic', 'amazing', 'lots_of_movement' 等会降低 Seedance 输出质量的关键词",
        en: "avoid quality-degrading keywords such as 'fast', 'cinematic', 'epic', 'amazing', 'lots_of_movement'"
      },
      appliesTo: ["seedance"]
    }
  ]
};
