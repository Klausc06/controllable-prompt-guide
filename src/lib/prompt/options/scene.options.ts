import type { OptionSet } from "../types";

export const sceneOptions: OptionSet = {
  id: "scene",
  version: "0.1.0",
  label: { zh: "场景", en: "Scene" },
  options: [
    {
      id: "bright_commercial_interior",
      version: "0.1.0",
      label: { zh: "明亮商业室内", en: "Bright commercial interior" },
      plain: { zh: "干净、专业，适合门店、健身房、展厅", en: "Clean and professional for stores, gyms, and showrooms" },
      professionalTerms: ["commercial interior", "clean layout", "brand environment"],
      promptFragment: {
        zh: "明亮整洁的商业室内空间，布局有序，背景干净，品牌环境清楚",
        en: "a bright and tidy commercial interior with orderly layout, clean background, and clear brand environment"
      },
      appliesTo: ["seedance", "generic_video"]
    },
    {
      id: "warm_cafe_counter",
      version: "0.1.0",
      label: { zh: "温暖咖啡吧台", en: "Warm cafe counter" },
      plain: { zh: "适合饮品、甜品、生活方式内容", en: "For drinks, desserts, and lifestyle content" },
      professionalTerms: ["cafe counter", "warm ambience", "craft preparation"],
      promptFragment: {
        zh: "温暖咖啡店吧台场景，木质细节、柔和灯光和手作氛围清楚可见",
        en: "a warm cafe counter scene with visible wood details, soft lighting, and handcrafted atmosphere"
      },
      appliesTo: ["seedance", "generic_video"]
    },
    {
      id: "urban_street",
      version: "0.1.0",
      label: { zh: "城市街头", en: "Urban street" },
      plain: { zh: "更有生活感，适合探店、潮流、城市宣传", en: "More lived-in, good for visits, trends, and city promos" },
      professionalTerms: ["urban lifestyle", "street-level realism", "ambient movement"],
      promptFragment: {
        zh: "真实城市街头场景，路人、街景、店招和自然环境动势形成生活氛围",
        en: "a real urban street scene with pedestrians, storefronts, signage, and natural ambient movement"
      },
      appliesTo: ["seedance", "generic_video"]
    },
    {
      id: "clean_studio_scene",
      version: "0.1.0",
      label: { zh: "干净棚拍", en: "Clean studio" },
      plain: { zh: "背景简单，产品更突出", en: "Simple background that makes the product stand out" },
      professionalTerms: ["studio setup", "seamless background", "controlled environment"],
      promptFragment: {
        zh: "干净棚拍环境，背景简洁无干扰，主体和材质细节被清楚突出",
        en: "a clean studio setup with a simple distraction-free background that clearly highlights the subject and material detail"
      },
      appliesTo: ["seedance", "generic_video"]
    },
    {
      id: "landmark_montage",
      version: "0.1.0",
      label: { zh: "城市地标组合", en: "Landmark montage" },
      plain: { zh: "适合旅游城市、活动、区域宣传", en: "For travel cities, events, and regional promos" },
      professionalTerms: ["landmark montage", "destination branding", "wide establishing shots"],
      promptFragment: {
        zh: "城市地标和街巷生活组合场景，远景建立城市感，近景呈现人文细节",
        en: "a montage of city landmarks and street life, using wide views for place identity and close details for culture"
      },
      appliesTo: ["seedance", "generic_video"]
    },
    {
      id: "home_daily",
      version: "0.1.0",
      label: { zh: "居家日常", en: "Home daily life" },
      plain: { zh: "亲切自然，适合生活用品、课程、服务类", en: "Approachable and natural for lifestyle products, courses, and services" },
      professionalTerms: ["home lifestyle", "natural context", "relatable scene"],
      promptFragment: {
        zh: "自然居家生活场景，环境真实、有温度，主体使用方式容易理解",
        en: "a natural home lifestyle scene that feels warm and relatable, with easy-to-understand subject usage"
      },
      appliesTo: ["seedance", "generic_video"]
    }
  ]
};
