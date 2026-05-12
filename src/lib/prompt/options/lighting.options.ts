import type { OptionSet } from "../types";

export const lightingOptions: OptionSet = {
  id: "lighting",
  version: "0.1.0",
  label: { zh: "光线", en: "Lighting" },
  options: [
    {
      id: "lighting:soft_daylight",
      version: "0.1.0",
      label: { zh: "柔和日光", en: "Soft daylight" },
      plain: { zh: "清楚、自然、舒服", en: "Clear, natural, and comfortable" },
      professionalTerms: ["soft daylight", "natural light", "gentle shadows"],
      promptFragment: {
        zh: "柔和自然日光，阴影轻，画面干净清楚",
        en: "soft natural daylight with gentle shadows and a clean clear image"
      },
      appliesTo: ["seedance", "generic_video", "veo3"]
    },
    {
      id: "lighting:golden_hour",
      version: "0.1.0",
      label: { zh: "黄金时刻", en: "Golden hour" },
      plain: { zh: "夕阳暖光，更有氛围", en: "Warm sunset light with a strong atmosphere" },
      professionalTerms: ["golden hour", "warm backlight", "long soft shadows"],
      promptFragment: {
        zh: "黄金时刻暖色光线，柔和逆光和长阴影，氛围感强",
        en: "golden hour warm lighting with soft backlight and long gentle shadows"
      },
      appliesTo: ["seedance", "generic_video", "veo3"]
    },
    {
      id: "lighting:neon_contrast",
      version: "0.1.0",
      label: { zh: "霓虹高对比", en: "Neon contrast" },
      plain: { zh: "夜景、科技感、强烈视觉冲击", en: "Night, tech mood, and strong visual impact" },
      professionalTerms: ["neon lighting", "high contrast", "colored rim light"],
      promptFragment: {
        zh: "霓虹高对比光线，彩色轮廓光，暗部保留细节",
        en: "high-contrast neon lighting with colored rim light and detailed shadows"
      },
      appliesTo: ["seedance", "generic_video", "veo3"]
    },
    {
      id: "lighting:studio_clean",
      version: "0.1.0",
      label: { zh: "干净棚拍", en: "Clean studio" },
      plain: { zh: "产品清楚、背景干净、适合商业展示", en: "Clear product view with a clean commercial setup" },
      professionalTerms: ["studio lighting", "clean background", "commercial product lighting"],
      promptFragment: {
        zh: "干净棚拍光线，背景简洁，主体受光均匀，商业产品展示质感",
        en: "clean studio lighting with a simple background, even subject illumination, and commercial product presentation"
      },
      appliesTo: ["seedance", "generic_video", "veo3"]
    },
    {
      id: "lighting:moody_low_key",
      version: "0.1.0",
      label: { zh: "低调氛围光", en: "Moody low-key" },
      plain: { zh: "更戏剧化，适合高级、夜晚、精品感", en: "More dramatic for premium, night, or boutique mood" },
      professionalTerms: ["low-key lighting", "dramatic contrast", "controlled highlights"],
      promptFragment: {
        zh: "低调氛围光，暗部干净，高光克制，形成高级戏剧感",
        en: "moody low-key lighting with clean shadows, restrained highlights, and a premium dramatic feel"
      },
      appliesTo: ["seedance", "generic_video", "veo3"]
    },
    {
      id: "lighting:bright_retail",
      version: "0.1.0",
      label: { zh: "明亮零售灯光", en: "Bright retail lighting" },
      plain: { zh: "看起来清楚、可信，适合门店和服务展示", en: "Clear and credible for stores and service showcases" },
      professionalTerms: ["retail lighting", "high visibility", "service environment"],
      promptFragment: {
        zh: "明亮零售空间光线，主体清楚，环境可信，适合门店服务展示",
        en: "bright retail-space lighting with clear subject visibility and a credible service environment"
      },
      appliesTo: ["seedance", "generic_video", "veo3"]
    },
    {
      id: "lighting:soft_window_light",
      version: "0.1.0",
      label: { zh: "窗边柔光", en: "Soft window light" },
      plain: { zh: "自然、安静、适合生活方式和人物体验", en: "Natural and calm for lifestyle and human experience scenes" },
      professionalTerms: ["window light", "soft side light", "natural lifestyle"],
      promptFragment: {
        zh: "窗边柔和侧光，人物和物体边缘自然，生活方式氛围安静舒适",
        en: "soft window side light with natural edges on people and objects, creating a calm lifestyle mood"
      },
      appliesTo: ["seedance", "generic_video", "veo3"]
    },
    {
      id: "lighting:golden_hour_warm",
      version: "0.1.0",
      label: { zh: "黄金时刻暖光", en: "Golden hour warm light" },
      plain: { zh: "日落前后的暖色光，画面整体偏橙黄，温馨浪漫", en: "Warm-toned light around sunset, the whole frame shifts to orange-yellow for a cozy romantic feel" },
      professionalTerms: ["golden hour lighting", "warm color temperature", "sunset warmth", "magic hour"],
      promptFragment: {
        zh: "黄金时刻的暖色光线均匀洒在场景中，色调偏橙黄，产生温暖浪漫的视觉氛围",
        en: "golden hour warm light bathes the scene evenly with an orange-yellow tint, creating a warm romantic visual atmosphere"
      },
      appliesTo: ["seedance", "generic_video", "veo3"]
    },
    {
      id: "lighting:neon_colored_lights",
      version: "0.1.0",
      label: { zh: "霓虹彩色光源", en: "Neon / colored lighting" },
      plain: { zh: "多色霓虹灯管作主要光源，适合赛博朋克、夜店、街头风", en: "Multiple neon tubes as the primary light source, ideal for cyberpunk, nightclub, and street style" },
      professionalTerms: ["neon lighting", "colored light sources", "RGB lighting", "cyberpunk illumination", "practical lights"],
      promptFragment: {
        zh: "彩色霓虹灯光源照射场景，多色交织，高饱和，暗部保留氛围感",
        en: "multicolored neon lights illuminate the scene with interwoven high-saturation hues and atmospheric shadows"
      },
      appliesTo: ["seedance", "generic_video", "veo3"]
    },
    {
      id: "lighting:backlight_silhouette",
      version: "0.1.0",
      label: { zh: "逆光/剪影", en: "Backlight / silhouette" },
      plain: { zh: "光源在主体后方，主体变暗成剪影，轮廓被光勾勒", en: "The light source is behind the subject, turning it into a dark silhouette with a bright rim outline" },
      professionalTerms: ["backlight", "silhouette lighting", "rim light", "contre-jour"],
      promptFragment: {
        zh: "强光源位于主体后方，形成剪影效果，边缘被光线勾勒出轮廓线",
        en: "a strong light source behind the subject creates a silhouette effect with the edges outlined by rim light"
      },
      appliesTo: ["seedance", "generic_video", "veo3"]
    },
    {
      id: "lighting:overhead_spotlight",
      version: "0.1.0",
      label: { zh: "顶光/聚光灯", en: "Overhead spotlight" },
      plain: { zh: "从正上方打下来的集中光线，适合产品主角展示、舞台效果", en: "Concentrated light from directly above, great for hero product shots and stage effects" },
      professionalTerms: ["overhead lighting", "top light", "spotlight", "directional top-down"],
      promptFragment: {
        zh: "顶部聚光灯垂直打向主体，形成强烈的上下明暗对比，主体突出，底部阴影集中",
        en: "an overhead spotlight shines vertically onto the subject, creating strong top-to-bottom contrast with concentrated shadows below"
      },
      appliesTo: ["seedance", "generic_video", "veo3"]
    },
    {
      id: "lighting:candlelight_warm_dim",
      version: "0.1.0",
      label: { zh: "烛光/暖暗调", en: "Candlelight warm dim" },
      plain: { zh: "蜡烛或暖色低亮度光源，营造私密、安静、温馨的氛围", en: "Candle or warm low-level light creates an intimate, quiet, and cozy atmosphere" },
      professionalTerms: ["candlelight", "warm dim lighting", "low-key warm", "firelight ambiance"],
      promptFragment: {
        zh: "烛光或其他暖色低亮度光源为主照明，光线微弱柔和，暗部占画面大部，氛围安静私密",
        en: "candlelight or another warm low-level source provides the primary illumination, with soft dim light, expansive shadows, and a quiet intimate mood"
      },
      appliesTo: ["seedance", "generic_video", "veo3"]
    },
    {
      id: "lighting:overcast_soft_natural",
      version: "0.1.0",
      label: { zh: "自然阴天柔光", en: "Overcast soft natural light" },
      plain: { zh: "阴天云层过滤后的柔光，没有明显阴影，画面柔和均匀", en: "Soft light filtered by overcast clouds with no harsh shadows -- gentle and even across the scene" },
      professionalTerms: ["overcast lighting", "diffused natural light", "softbox sky", "cloudy day lighting"],
      promptFragment: {
        zh: "阴天漫射柔光，云层充当天然柔光箱，无硬阴影，色彩饱和度较低，画面柔和均匀",
        en: "overcast diffused soft light where clouds act as a natural softbox, with no harsh shadows, muted saturation, and an even gentle look across the frame"
      },
      appliesTo: ["seedance", "generic_video", "veo3"]
    }
  ]
};
