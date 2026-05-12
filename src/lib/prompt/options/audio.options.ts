import type { OptionSet } from "../types";

export const audioOptions: OptionSet = {
  id: "audio",
  version: "0.1.0",
  label: { zh: "声音", en: "Audio" },
  options: [
    {
      id: "audio:ambient_only",
      version: "0.1.0",
      label: { zh: "只有环境音", en: "Ambient only" },
      plain: { zh: "保留现场感，不说话", en: "Keeps atmosphere without dialogue" },
      professionalTerms: ["ambient sound", "no dialogue", "natural environment audio"],
      promptFragment: {
        zh: "声音以自然环境音为主，不需要人物对白",
        en: "audio is mainly natural ambience with no character dialogue"
      },
      appliesTo: ["seedance", "generic_video", "veo3"]
    },
    {
      id: "audio:upbeat_music",
      version: "0.1.0",
      label: { zh: "轻快音乐", en: "Upbeat music" },
      plain: { zh: "适合宣传、促销、探店", en: "Good for promotion, offers, and visit-style clips" },
      professionalTerms: ["upbeat background music", "social media pacing", "positive rhythm"],
      promptFragment: {
        zh: "搭配轻快积极的背景音乐，节奏适合短视频传播",
        en: "use upbeat positive background music with pacing suitable for short social videos"
      },
      appliesTo: ["seedance", "generic_video", "veo3"]
    },
    {
      id: "audio:voiceover",
      version: "0.1.0",
      label: { zh: "旁白说明", en: "Voiceover" },
      plain: { zh: "用旁白解释重点", en: "Narration explains the key message" },
      professionalTerms: ["voiceover", "narration", "clear spoken message"],
      promptFragment: {
        zh: "加入清晰旁白说明核心信息，语气自然可信",
        en: "include a clear voiceover explaining the core message in a natural and trustworthy tone"
      },
      appliesTo: ["seedance", "generic_video", "veo3"]
    },
    {
      id: "audio:no_audio_requirement",
      version: "0.1.0",
      label: { zh: "声音不重要", en: "Audio not required" },
      plain: { zh: "画面本身能看懂，后期再配音也可以", en: "The visuals should work even if audio is added later" },
      professionalTerms: ["silent-first", "visual-first communication", "post audio ready"],
      promptFragment: {
        zh: "画面本身无需依赖声音也能理解，后期可再添加音乐或配音",
        en: "the video should be understandable without relying on audio, with music or narration added later if needed"
      },
      appliesTo: ["seedance", "generic_video", "veo3"]
    },
    {
      id: "audio:soft_luxury_music",
      version: "0.1.0",
      label: { zh: "轻奢背景音乐", en: "Soft luxury music" },
      plain: { zh: "更高级、更克制，适合精品、产品和空间展示", en: "More premium and restrained for boutique, product, and space showcases" },
      professionalTerms: ["soft luxury score", "restrained rhythm", "premium ambience"],
      promptFragment: {
        zh: "搭配克制的轻奢背景音乐，节奏平稳，增强高级感但不抢画面",
        en: "use restrained soft luxury background music with steady pacing, adding premium mood without overpowering the visuals"
      },
      appliesTo: ["seedance", "generic_video", "veo3"]
    },
    {
      id: "audio:energetic_beat",
      version: "0.1.0",
      label: { zh: "强节奏动感音乐", en: "Energetic beat" },
      plain: { zh: "适合健身、活动、潮流产品", en: "Good for fitness, events, and trend products" },
      professionalTerms: ["energetic beat", "rhythmic edit", "high-energy social video"],
      promptFragment: {
        zh: "使用强节奏动感背景音乐，剪辑点和动作节奏保持一致",
        en: "use energetic beat-driven background music, with edit points matching the action rhythm"
      },
      appliesTo: ["seedance", "generic_video", "veo3"]
    },
    {
      id: "audio:natural_dialogue",
      version: "0.1.0",
      label: { zh: "自然对话感", en: "Natural dialogue feel" },
      plain: { zh: "像真实交流，不是硬广告", en: "Feels like real conversation rather than a hard ad" },
      professionalTerms: ["natural dialogue", "conversational tone", "testimonial feel"],
      promptFragment: {
        zh: "声音呈现自然对话感，语气轻松可信，不像硬性广告播报",
        en: "audio has a natural conversational feel, relaxed and credible rather than hard-sell advertising"
      },
      appliesTo: ["seedance", "generic_video", "veo3"]
    },
    {
      id: "audio:rhythmic_electronic",
      version: "0.1.0",
      label: { zh: "节奏感电子音乐", en: "Rhythmic electronic music" },
      plain: { zh: "现代、动感，适合科技、潮流、运动内容", en: "Modern and dynamic for tech, trend, and sports content" },
      professionalTerms: ["electronic beat", "synth rhythm", "modern pulse"],
      promptFragment: {
        zh: "搭配节奏感强烈的电子音乐，营造现代、动感的听觉氛围",
        en: "pair with strong rhythmic electronic music to create a modern, dynamic audio atmosphere"
      },
      appliesTo: ["seedance", "generic_video", "veo3"]
    },
    {
      id: "audio:light_jazz_piano",
      version: "0.1.0",
      label: { zh: "轻钢琴/爵士背景", en: "Light piano / jazz background" },
      plain: { zh: "舒缓优雅，适合咖啡店、生活方式、空间展示", en: "Calm and elegant for cafés, lifestyle, and space showcases" },
      professionalTerms: ["piano score", "jazz lounge", "soft instrumental"],
      promptFragment: {
        zh: "搭配轻钢琴或爵士背景音乐，氛围舒缓优雅，不过分抢镜",
        en: "use light piano or jazz background music with a calm, elegant mood that does not overpower the scene"
      },
      appliesTo: ["seedance", "generic_video", "veo3"]
    },
    {
      id: "audio:spoken_narration",
      version: "0.1.0",
      label: { zh: "人声旁白/解说", en: "Voiceover narration" },
      plain: { zh: "专业解说贯穿视频，传递完整信息", en: "Professional narration carries the full message throughout" },
      professionalTerms: ["voiceover narration", "explanatory audio", "storytelling voice"],
      promptFragment: {
        zh: "包含人声旁白或解说，贯穿整条视频，清晰传递信息和叙事",
        en: "include a spoken voiceover or narration track throughout the video, clearly conveying information and narrative"
      },
      appliesTo: ["seedance", "generic_video", "veo3"]
    },
    {
      id: "audio:urban_ambient",
      version: "0.1.0",
      label: { zh: "城市环境音", en: "Urban ambient sound" },
      plain: { zh: "街景、咖啡馆、城市氛围感", en: "Street scenes, cafés, city atmosphere" },
      professionalTerms: ["urban ambience", "city soundscape", "street atmosphere"],
      promptFragment: {
        zh: "声音以城市环境音为主，包含街景人声、咖啡馆氛围等城市生活感",
        en: "audio focuses on urban ambient sounds including street noise, café chatter, and city life atmosphere"
      },
      appliesTo: ["seedance", "generic_video", "veo3"]
    },
    {
      id: "audio:silent_post_music",
      version: "0.1.0",
      label: { zh: "完全静音/后期配乐", en: "Silent (music in post)" },
      plain: { zh: "视频原生无声音，后期自行配乐", en: "No native audio; add custom music in post-production" },
      professionalTerms: ["silent master", "post-production audio", "clean dialogue track"],
      promptFragment: {
        zh: "视频本身不包含任何声音，所有音频（音乐、音效等）将在后期制作中添加",
        en: "the video contains no embedded audio; all sound (music, SFX, etc.) will be added in post-production"
      },
      appliesTo: ["seedance", "generic_video", "veo3"]
    }
  ]
};
