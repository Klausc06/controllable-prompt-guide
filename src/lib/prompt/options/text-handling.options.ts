import type { OptionSet } from "../types";

export const textHandlingOptions: OptionSet = {
  id: "text_handling",
  version: "0.1.0",
  label: { zh: "画面文字", en: "On-screen text" },
  options: [
    {
      id: "text_handling:no_text",
      version: "0.1.0",
      label: { zh: "不在画面生成文字", en: "No generated text" },
      plain: { zh: "最稳，后期再加标题和价格", en: "Most reliable; add titles and prices in post" },
      professionalTerms: ["post-production typography", "avoid text artifacts", "clean footage"],
      promptFragment: { zh: "画面中不生成文字，所有标题、价格和活动信息都建议后期添加", en: "do not generate on-screen text; add titles, prices, and campaign information in post-production" },
      appliesTo: ["seedance", "generic_video", "veo3"]
    },
    {
      id: "text_handling:short_title_only",
      version: "0.1.0",
      label: { zh: "只要短标题", en: "Short title only" },
      plain: { zh: "最多一行，适合开业、新品、活动名", en: "One short line for openings, launches, or campaign names" },
      professionalTerms: ["minimal title card", "single-line text", "legible overlay"],
      promptFragment: { zh: "如需文字，只保留一行短标题，位置清楚、字数少、不要复杂排版", en: "if text is needed, keep only one short title line, clearly placed with minimal typography" },
      appliesTo: ["seedance", "generic_video", "veo3"],
      riskHint: { zh: "生成模型仍可能写错字，重要文字建议后期添加。", en: "Generated text can still be wrong; add critical copy in post." }
    },
    {
      id: "text_handling:placeholder_signage",
      version: "0.1.0",
      label: { zh: "只保留模糊招牌感", en: "Implied signage only" },
      plain: { zh: "有店招氛围，但不要求可读字", en: "Creates signage atmosphere without requiring readable text" },
      professionalTerms: ["implied signage", "non-readable background text", "brand-safe ambience"],
      promptFragment: { zh: "背景可以有模糊招牌或装饰性文字氛围，但不要求任何文字可读", en: "background may include blurred signage or decorative text mood, but no text needs to be readable" },
      appliesTo: ["seedance", "generic_video", "veo3"]
    },
    {
      id: "text_handling:bottom_subtitle_bar",
      version: "0.1.0",
      label: { zh: "底部字幕条", en: "Bottom subtitle bar" },
      plain: { zh: "画面底部保留字幕条区域，方便后期加字", en: "Reserve a subtitle bar area at the bottom for post-production text" },
      professionalTerms: ["subtitle safe area", "lower third", "legibility zone"],
      promptFragment: {
        zh: "底部预留字幕条安全区域，确保重要画面元素不遮挡文字位置",
        en: "reserve a subtitle safe zone at the bottom of the frame, keeping visual elements clear of the text area"
      },
      appliesTo: ["seedance", "generic_video", "veo3"]
    },
    {
      id: "text_handling:opening_title_card",
      version: "0.1.0",
      label: { zh: "标题开场大字", en: "Opening title card with large text" },
      plain: { zh: "视频开头用大字标题吸引注意力", en: "Grab attention with a large title at the start of the video" },
      professionalTerms: ["title card", "opening splash", "hero typography"],
      promptFragment: {
        zh: "视频开头设计大字号标题画面，字体醒目、居中或占据主要画面",
        en: "design the opening frame with large title typography, bold and centered or filling the main composition"
      },
      appliesTo: ["seedance", "generic_video", "veo3"],
      riskHint: { zh: "AI 生成文字可能出现错字，重要文案建议后期替换。", en: "AI-generated text may contain errors; replace critical copy in post." }
    },
    {
      id: "text_handling:price_tag_popup",
      version: "0.1.0",
      label: { zh: "价格/标签弹出", en: "Price/tag popup overlay" },
      plain: { zh: "画面内出现价格或标签浮层，适合促销场景", en: "Show price or tag overlays in-frame, ideal for promotional scenes" },
      professionalTerms: ["price popup", "tag overlay", "promotional slug"],
      promptFragment: {
        zh: "画面中包含价格标签或文字弹出效果，信息突出、位置明显",
        en: "include price tags or popup text overlays in the scene, with clear placement and strong visibility"
      },
      appliesTo: ["seedance", "generic_video", "veo3"],
      riskHint: { zh: "AI 生成数字和文字可能不准确，关键价格请后期确认。", en: "AI-generated numbers and text may be inaccurate; verify key prices in post." }
    },
    {
      id: "text_handling:end_card_cta",
      version: "0.1.0",
      label: { zh: "结尾 CTA 按钮文字", en: "End card with CTA text" },
      plain: { zh: "视频结尾出现行动号召文字（关注/购买/预约）", en: "End with a call-to-action text (follow, buy, book)" },
      professionalTerms: ["CTA end card", "call to action", "closing slug"],
      promptFragment: {
        zh: "视频结尾包含行动号召文字，如关注、购买或预约按钮提示",
        en: "include a call-to-action at the end of the video, such as follow, purchase, or booking prompts"
      },
      appliesTo: ["seedance", "generic_video", "veo3"],
      riskHint: { zh: "AI 生成的 CTA 文案和图标可能不准确，建议后期替换为真实按钮。", en: "AI-generated CTA copy and icons may be inaccurate; replace with real buttons in post." }
    },
    {
      id: "text_handling:no_text_pure_visual",
      version: "0.1.0",
      label: { zh: "无文字/纯画面", en: "No text, pure visual" },
      plain: { zh: "画面中完全不出现文字，全靠图像叙事", en: "Zero text on screen — the visuals tell the entire story" },
      professionalTerms: ["visual-only storytelling", "zero typography", "pure imagery"],
      promptFragment: {
        zh: "画面不包含任何文字元素，完全依靠图像构图、光影和动作来传达信息",
        en: "no text elements appear in the frame; rely entirely on composition, lighting, and motion to convey the message"
      },
      appliesTo: ["seedance", "generic_video", "veo3"]
    }
  ]
};
