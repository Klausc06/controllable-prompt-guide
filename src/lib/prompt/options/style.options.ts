import type { OptionSet } from "../types";

export const styleOptions: OptionSet = {
  id: "style",
  version: "0.1.0",
  label: { zh: "风格", en: "Style" },
  options: [
    {
      id: "cinematic_realism",
      version: "0.1.0",
      label: { zh: "电影真实感", en: "Cinematic realism" },
      plain: {
        zh: "像电影广告一样真实、有质感 — 电影感、大片感",
        en: "Realistic and polished like a cinematic commercial"
      },
      professionalTerms: ["cinematic realism", "controlled lighting", "premium commercial look"],
      promptFragment: {
        zh: "电影级写实风格，画面真实、光影克制、商业广告质感",
        en: "cinematic realism with controlled lighting and a premium commercial look"
      },
      appliesTo: ["seedance", "generic_video"]
    },
    {
      id: "ugc_handheld",
      version: "0.1.0",
      label: { zh: "手机随拍感", en: "UGC handheld" },
      plain: {
        zh: "像普通人用手机拍的真实短视频",
        en: "Feels like an authentic handheld phone video"
      },
      professionalTerms: ["UGC style", "handheld camera", "natural lighting"],
      promptFragment: {
        zh: "真实 UGC 手机随拍质感，自然光线，手持轻微晃动，亲近真实",
        en: "authentic UGC-style handheld smartphone footage with natural light and subtle camera shake"
      },
      appliesTo: ["seedance", "generic_video"],
      riskHint: {
        zh: "更真实，但不如商业广告精致。",
        en: "More authentic, but less polished than a commercial."
      }
    },
    {
      id: "premium_minimal",
      version: "0.1.0",
      label: { zh: "高级极简", en: "Premium minimal" },
      plain: {
        zh: "少元素、留白多、看起来更贵 — 高级感、极简风",
        en: "Sparse, clean, and premium with plenty of breathing room"
      },
      professionalTerms: ["minimalism", "negative space", "restrained palette"],
      promptFragment: {
        zh: "高级极简视觉，留白充足，低饱和配色，信息克制",
        en: "premium minimal visual style with generous negative space, restrained colors, and clean details"
      },
      appliesTo: ["seedance", "generic_video"]
    },
    {
      id: "cyberpunk_neon",
      version: "0.1.0",
      label: { zh: "赛博霓虹", en: "Cyberpunk neon" },
      plain: {
        zh: "未来城市、霓虹灯、强烈科技感 — 赛博朋克、科幻风",
        en: "Futuristic city mood with neon and a strong tech feel"
      },
      professionalTerms: ["cyberpunk", "neon lighting", "high contrast", "futuristic urban"],
      promptFragment: {
        zh: "赛博朋克霓虹风格，未来城市氛围，高对比光影，蓝紫霓虹反射",
        en: "cyberpunk neon style with futuristic urban atmosphere, high-contrast lighting, and blue-purple reflections"
      },
      appliesTo: ["seedance", "generic_video"],
      riskHint: {
        zh: "容易变得信息很满，适合科技、潮流、夜景主题。",
        en: "Can become visually busy; best for tech, trend, and night scenes."
      }
    },
    {
      id: "warm_lifestyle",
      version: "0.1.0",
      label: { zh: "温暖生活感", en: "Warm lifestyle" },
      plain: {
        zh: "日常、舒服、亲切，有生活气息 — ins风、氛围感",
        en: "Comfortable, approachable, and everyday lifestyle mood"
      },
      professionalTerms: ["lifestyle", "warm palette", "soft natural light"],
      promptFragment: {
        zh: "温暖生活方式风格，柔和自然光，亲切真实的日常氛围",
        en: "warm lifestyle style with soft natural light and an approachable everyday atmosphere"
      },
      appliesTo: ["seedance", "generic_video"]
    },
    {
      id: "luxury_editorial",
      version: "0.1.0",
      label: { zh: "奢华杂志感", en: "Luxury editorial" },
      plain: {
        zh: "像高端杂志或精品品牌大片 — 奢侈品质感、杂志风",
        en: "Feels like a premium magazine or boutique brand film"
      },
      professionalTerms: ["luxury editorial", "refined composition", "premium brand film"],
      promptFragment: {
        zh: "奢华杂志大片风格，构图精致，材质高级，画面克制但有品牌气场",
        en: "luxury editorial style with refined composition, premium material detail, and restrained brand presence"
      },
      appliesTo: ["seedance", "generic_video"]
    },
    {
      id: "clean_tech",
      version: "0.1.0",
      label: { zh: "干净科技感", en: "Clean tech" },
      plain: {
        zh: "现代、理性、适合软件、数码和新产品",
        en: "Modern and precise for software, gadgets, and new products"
      },
      professionalTerms: ["clean tech aesthetic", "precision", "modern interface mood"],
      promptFragment: {
        zh: "干净科技视觉，线条清晰，材质现代，整体理性、专业、可信",
        en: "clean tech aesthetic with crisp lines, modern materials, and a precise professional mood"
      },
      appliesTo: ["seedance", "generic_video"]
    },
    {
      id: "documentary_real",
      version: "0.1.0",
      label: { zh: "纪实真实感", en: "Documentary realism" },
      plain: {
        zh: "像真实纪录片片段，可信、自然、不摆拍",
        en: "Feels like a credible natural documentary moment"
      },
      professionalTerms: ["documentary realism", "observational camera", "authentic moment"],
      promptFragment: {
        zh: "纪实真实风格，观察式镜头，自然动作，不摆拍，强调可信现场感",
        en: "documentary realism with observational camera work, natural action, and credible in-the-moment presence"
      },
      appliesTo: ["seedance", "generic_video"]
    }
  ]
};
