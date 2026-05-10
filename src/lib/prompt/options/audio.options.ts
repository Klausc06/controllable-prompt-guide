import type { OptionSet } from "../types";

export const audioOptions: OptionSet = {
  id: "audio",
  version: "0.1.0",
  label: { zh: "声音", en: "Audio" },
  options: [
    {
      id: "ambient_only",
      version: "0.1.0",
      label: { zh: "只有环境音", en: "Ambient only" },
      plain: { zh: "保留现场感，不说话", en: "Keeps atmosphere without dialogue" },
      professionalTerms: ["ambient sound", "no dialogue", "natural environment audio"],
      promptFragment: {
        zh: "声音以自然环境音为主，不需要人物对白",
        en: "audio is mainly natural ambience with no character dialogue"
      },
      appliesTo: ["seedance", "generic_video"]
    },
    {
      id: "upbeat_music",
      version: "0.1.0",
      label: { zh: "轻快音乐", en: "Upbeat music" },
      plain: { zh: "适合宣传、促销、探店", en: "Good for promotion, offers, and visit-style clips" },
      professionalTerms: ["upbeat background music", "social media pacing", "positive rhythm"],
      promptFragment: {
        zh: "搭配轻快积极的背景音乐，节奏适合短视频传播",
        en: "use upbeat positive background music with pacing suitable for short social videos"
      },
      appliesTo: ["seedance", "generic_video"]
    },
    {
      id: "voiceover",
      version: "0.1.0",
      label: { zh: "旁白说明", en: "Voiceover" },
      plain: { zh: "用旁白解释重点", en: "Narration explains the key message" },
      professionalTerms: ["voiceover", "narration", "clear spoken message"],
      promptFragment: {
        zh: "加入清晰旁白说明核心信息，语气自然可信",
        en: "include a clear voiceover explaining the core message in a natural and trustworthy tone"
      },
      appliesTo: ["seedance", "generic_video"]
    },
    {
      id: "no_audio_requirement",
      version: "0.1.0",
      label: { zh: "声音不重要", en: "Audio not required" },
      plain: { zh: "画面本身能看懂，后期再配音也可以", en: "The visuals should work even if audio is added later" },
      professionalTerms: ["silent-first", "visual-first communication", "post audio ready"],
      promptFragment: {
        zh: "画面本身无需依赖声音也能理解，后期可再添加音乐或配音",
        en: "the video should be understandable without relying on audio, with music or narration added later if needed"
      },
      appliesTo: ["seedance", "generic_video"]
    },
    {
      id: "soft_luxury_music",
      version: "0.1.0",
      label: { zh: "轻奢背景音乐", en: "Soft luxury music" },
      plain: { zh: "更高级、更克制，适合精品、产品和空间展示", en: "More premium and restrained for boutique, product, and space showcases" },
      professionalTerms: ["soft luxury score", "restrained rhythm", "premium ambience"],
      promptFragment: {
        zh: "搭配克制的轻奢背景音乐，节奏平稳，增强高级感但不抢画面",
        en: "use restrained soft luxury background music with steady pacing, adding premium mood without overpowering the visuals"
      },
      appliesTo: ["seedance", "generic_video"]
    },
    {
      id: "energetic_beat",
      version: "0.1.0",
      label: { zh: "强节奏动感音乐", en: "Energetic beat" },
      plain: { zh: "适合健身、活动、潮流产品", en: "Good for fitness, events, and trend products" },
      professionalTerms: ["energetic beat", "rhythmic edit", "high-energy social video"],
      promptFragment: {
        zh: "使用强节奏动感背景音乐，剪辑点和动作节奏保持一致",
        en: "use energetic beat-driven background music, with edit points matching the action rhythm"
      },
      appliesTo: ["seedance", "generic_video"]
    },
    {
      id: "natural_dialogue",
      version: "0.1.0",
      label: { zh: "自然对话感", en: "Natural dialogue feel" },
      plain: { zh: "像真实交流，不是硬广告", en: "Feels like real conversation rather than a hard ad" },
      professionalTerms: ["natural dialogue", "conversational tone", "testimonial feel"],
      promptFragment: {
        zh: "声音呈现自然对话感，语气轻松可信，不像硬性广告播报",
        en: "audio has a natural conversational feel, relaxed and credible rather than hard-sell advertising"
      },
      appliesTo: ["seedance", "generic_video"]
    }
  ]
};
