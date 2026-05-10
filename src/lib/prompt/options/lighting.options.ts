import type { OptionSet } from "../types";

export const lightingOptions: OptionSet = {
  id: "lighting",
  version: "0.1.0",
  label: { zh: "光线", en: "Lighting" },
  options: [
    {
      id: "soft_daylight",
      version: "0.1.0",
      label: { zh: "柔和日光", en: "Soft daylight" },
      plain: { zh: "清楚、自然、舒服", en: "Clear, natural, and comfortable" },
      professionalTerms: ["soft daylight", "natural light", "gentle shadows"],
      promptFragment: {
        zh: "柔和自然日光，阴影轻，画面干净清楚",
        en: "soft natural daylight with gentle shadows and a clean clear image"
      },
      appliesTo: ["seedance", "generic_video"]
    },
    {
      id: "golden_hour",
      version: "0.1.0",
      label: { zh: "黄金时刻", en: "Golden hour" },
      plain: { zh: "夕阳暖光，更有氛围", en: "Warm sunset light with a strong atmosphere" },
      professionalTerms: ["golden hour", "warm backlight", "long soft shadows"],
      promptFragment: {
        zh: "黄金时刻暖色光线，柔和逆光和长阴影，氛围感强",
        en: "golden hour warm lighting with soft backlight and long gentle shadows"
      },
      appliesTo: ["seedance", "generic_video"]
    },
    {
      id: "neon_contrast",
      version: "0.1.0",
      label: { zh: "霓虹高对比", en: "Neon contrast" },
      plain: { zh: "夜景、科技感、强烈视觉冲击", en: "Night, tech mood, and strong visual impact" },
      professionalTerms: ["neon lighting", "high contrast", "colored rim light"],
      promptFragment: {
        zh: "霓虹高对比光线，彩色轮廓光，暗部保留细节",
        en: "high-contrast neon lighting with colored rim light and detailed shadows"
      },
      appliesTo: ["seedance", "generic_video"]
    },
    {
      id: "studio_clean",
      version: "0.1.0",
      label: { zh: "干净棚拍", en: "Clean studio" },
      plain: { zh: "产品清楚、背景干净、适合商业展示", en: "Clear product view with a clean commercial setup" },
      professionalTerms: ["studio lighting", "clean background", "commercial product lighting"],
      promptFragment: {
        zh: "干净棚拍光线，背景简洁，主体受光均匀，商业产品展示质感",
        en: "clean studio lighting with a simple background, even subject illumination, and commercial product presentation"
      },
      appliesTo: ["seedance", "generic_video"]
    },
    {
      id: "moody_low_key",
      version: "0.1.0",
      label: { zh: "低调氛围光", en: "Moody low-key" },
      plain: { zh: "更戏剧化，适合高级、夜晚、精品感", en: "More dramatic for premium, night, or boutique mood" },
      professionalTerms: ["low-key lighting", "dramatic contrast", "controlled highlights"],
      promptFragment: {
        zh: "低调氛围光，暗部干净，高光克制，形成高级戏剧感",
        en: "moody low-key lighting with clean shadows, restrained highlights, and a premium dramatic feel"
      },
      appliesTo: ["seedance", "generic_video"]
    },
    {
      id: "bright_retail",
      version: "0.1.0",
      label: { zh: "明亮零售灯光", en: "Bright retail lighting" },
      plain: { zh: "看起来清楚、可信，适合门店和服务展示", en: "Clear and credible for stores and service showcases" },
      professionalTerms: ["retail lighting", "high visibility", "service environment"],
      promptFragment: {
        zh: "明亮零售空间灯光，主体清楚，环境可信，适合门店服务展示",
        en: "bright retail-space lighting with clear subject visibility and a credible service environment"
      },
      appliesTo: ["seedance", "generic_video"]
    },
    {
      id: "soft_window_light",
      version: "0.1.0",
      label: { zh: "窗边柔光", en: "Soft window light" },
      plain: { zh: "自然、安静、适合生活方式和人物体验", en: "Natural and calm for lifestyle and human experience scenes" },
      professionalTerms: ["window light", "soft side light", "natural lifestyle"],
      promptFragment: {
        zh: "窗边柔和侧光，人物和物体边缘自然，生活方式氛围安静舒适",
        en: "soft window side light with natural edges on people and objects, creating a calm lifestyle mood"
      },
      appliesTo: ["seedance", "generic_video"]
    }
  ]
};
