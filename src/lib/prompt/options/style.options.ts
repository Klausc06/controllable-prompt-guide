import type { OptionSet } from "../types";

export const styleOptions: OptionSet = {
  id: "style",
  version: "0.1.0",
  label: { zh: "风格", en: "Style" },
  options: [
    {
      id: "style:cinematic_realism",
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
      appliesTo: ["seedance", "generic_video", "veo3"]
    },
    {
      id: "style:ugc_handheld",
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
      appliesTo: ["seedance", "generic_video", "veo3"],
      riskHint: {
        zh: "更真实，但不如商业广告精致。",
        en: "More authentic, but less polished than a commercial."
      }
    },
    {
      id: "style:premium_minimal",
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
      appliesTo: ["seedance", "generic_video", "veo3"]
    },
    {
      id: "style:cyberpunk_neon",
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
      appliesTo: ["seedance", "generic_video", "veo3"],
      riskHint: {
        zh: "容易变得信息很满，适合科技、潮流、夜景主题。",
        en: "Can become visually busy; best for tech, trend, and night scenes."
      }
    },
    {
      id: "style:warm_lifestyle",
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
      appliesTo: ["seedance", "generic_video", "veo3"]
    },
    {
      id: "style:luxury_editorial",
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
      appliesTo: ["seedance", "generic_video", "veo3"]
    },
    {
      id: "style:clean_tech",
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
      appliesTo: ["seedance", "generic_video", "veo3"]
    },
    {
      id: "style:documentary_real",
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
      appliesTo: ["seedance", "generic_video", "veo3"]
    },
    {
      id: "style:fresh_natural_forest",
      version: "0.1.0",
      label: { zh: "清新自然/森系", en: "Fresh natural / forest aesthetic" },
      plain: {
        zh: "清新、自然、充满氧气感 — 小清新、森系",
        en: "Fresh, natural, and airy with an organic mood"
      },
      professionalTerms: ["fresh natural", "forest aesthetic", "airy palette"],
      promptFragment: {
        zh: "清新自然森系风格，柔和绿调、日光散射、画面干净有呼吸感",
        en: "fresh natural forest aesthetic with green undertones, diffused daylight, and a clean airy look"
      },
      appliesTo: ["seedance", "generic_video", "veo3"]
    },
    {
      id: "style:dark_moody_textured",
      version: "0.1.0",
      label: { zh: "暗黑/质感调", en: "Dark moody / textured" },
      plain: {
        zh: "低亮度、高对比、强调材质肌理 — 暗调质感、氛围感",
        en: "Low-key, high-contrast, emphasizing texture and grit"
      },
      professionalTerms: ["dark moody", "chiaroscuro", "texture-forward"],
      promptFragment: {
        zh: "暗调质感风格，低亮度高对比，光影强烈，材质纹理突出，氛围浓郁",
        en: "dark moody style with low-key lighting, strong contrast, prominent texture, and a rich atmospheric mood"
      },
      appliesTo: ["seedance", "generic_video", "veo3"],
      riskHint: {
        zh: "暗调可能导致细节丢失，注意主体轮廓清晰度。",
        en: "Dark tones may lose details; ensure the subject silhouette stays clear."
      }
    },
    {
      id: "style:retro_vhs_ccd",
      version: "0.1.0",
      label: { zh: "复古 VHS/CCD 数码感", en: "Retro VHS / CCD digital" },
      plain: {
        zh: "模拟老式摄像机和早期数码相机质感 — 复古胶片感、千禧年风",
        en: "Emulates vintage camcorders and early digital camera aesthetics"
      },
      professionalTerms: ["VHS aesthetic", "CCD sensor look", "vintage video"],
      promptFragment: {
        zh: "复古VHS或CCD数码质感，颗粒明显，色彩偏移，轻度失真，千禧年怀旧风格",
        en: "retro VHS or CCD digital look with visible grain, color shift, light distortion, and early-2000s nostalgia"
      },
      appliesTo: ["seedance", "generic_video", "veo3"]
    },
    {
      id: "style:cg_3d_rendered",
      version: "0.1.0",
      label: { zh: "3D CG/渲染感", en: "3D CG / rendered look" },
      plain: {
        zh: "像三维动画或游戏渲染画面 — CG风、3D渲染",
        en: "Looks like 3D animation or game-rendered footage"
      },
      professionalTerms: ["CG rendering", "3D animation", "stylized render"],
      promptFragment: {
        zh: "三维CG渲染风格，光影经过计算，材质有数字感，画面精致但非真实拍摄",
        en: "3D CG rendered style with calculated lighting, digital material feel, and polished non-realistic visuals"
      },
      appliesTo: ["seedance", "generic_video", "veo3"]
    },
    {
      id: "style:black_white_monochrome",
      version: "0.1.0",
      label: { zh: "黑白/单色", en: "Black and white / monochrome" },
      plain: {
        zh: "去掉色彩，专注光影、构图和情绪 — 黑白调、单色风",
        en: "Removes color to focus on light, shadow, composition, and mood"
      },
      professionalTerms: ["monochrome", "black and white", "luminance contrast"],
      promptFragment: {
        zh: "黑白单色风格，无彩色信息，专注明暗对比、灰度层次和画面结构",
        en: "black and white monochrome style with no color information, focused on luminance contrast, tonal range, and composition"
      },
      appliesTo: ["seedance", "generic_video", "veo3"],
      riskHint: {
        zh: "并非所有视频模型都稳定支持黑白输出，建议在工具端确认兼容性。",
        en: "Not all video models reliably support monochrome output; verify compatibility on the tool side."
      }
    },
    {
      id: "style:pop_art_collage",
      version: "0.1.0",
      label: { zh: "波普/拼贴风", en: "Pop art / collage" },
      plain: {
        zh: "色彩饱和、大胆、图形化 — 波普艺术、拼贴风格",
        en: "Bold, saturated, and graphic — pop art and collage"
      },
      professionalTerms: ["pop art", "collage aesthetic", "bold graphic"],
      promptFragment: {
        zh: "波普或拼贴风格，色彩高饱和，图形大胆，视觉冲击强，有艺术感",
        en: "pop art or collage style with high saturation, bold graphics, strong visual impact, and an artistic feel"
      },
      appliesTo: ["seedance", "generic_video", "veo3"]
    }
  ]
};
