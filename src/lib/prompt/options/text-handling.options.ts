import type { OptionSet } from "../types";

export const textHandlingOptions: OptionSet = {
  id: "text_handling",
  version: "0.1.0",
  label: { zh: "画面文字", en: "On-screen text" },
  options: [
    {
      id: "no_text",
      version: "0.1.0",
      label: { zh: "不在画面生成文字", en: "No generated text" },
      plain: { zh: "最稳，后期再加标题和价格", en: "Most reliable; add titles and prices in post" },
      professionalTerms: ["post-production typography", "avoid text artifacts", "clean footage"],
      promptFragment: { zh: "画面中不生成文字，所有标题、价格和活动信息都建议后期添加", en: "do not generate on-screen text; add titles, prices, and campaign information in post-production" },
      appliesTo: ["seedance", "generic_video"]
    },
    {
      id: "short_title_only",
      version: "0.1.0",
      label: { zh: "只要短标题", en: "Short title only" },
      plain: { zh: "最多一行，适合开业、新品、活动名", en: "One short line for openings, launches, or campaign names" },
      professionalTerms: ["minimal title card", "single-line text", "legible overlay"],
      promptFragment: { zh: "如需文字，只保留一行短标题，位置清楚、字数少、不要复杂排版", en: "if text is needed, keep only one short title line, clearly placed with minimal typography" },
      appliesTo: ["seedance", "generic_video"],
      riskHint: { zh: "生成模型仍可能写错字，重要文字建议后期添加。", en: "Generated text can still be wrong; add critical copy in post." }
    },
    {
      id: "placeholder_signage",
      version: "0.1.0",
      label: { zh: "只保留模糊招牌感", en: "Implied signage only" },
      plain: { zh: "有店招氛围，但不要求可读字", en: "Creates signage atmosphere without requiring readable text" },
      professionalTerms: ["implied signage", "non-readable background text", "brand-safe ambience"],
      promptFragment: { zh: "背景可以有模糊招牌或装饰性文字氛围，但不要求任何文字可读", en: "background may include blurred signage or decorative text mood, but no text needs to be readable" },
      appliesTo: ["seedance", "generic_video"]
    }
  ]
};
