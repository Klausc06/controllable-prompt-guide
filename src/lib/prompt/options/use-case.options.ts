import type { OptionSet } from "../types";

export const useCaseOptions: OptionSet = {
  id: "use_case",
  version: "0.1.0",
  label: { zh: "作品目标", en: "Use case" },
  options: [
    {
      id: "gym_opening",
      version: "0.1.0",
      label: { zh: "健身房开业宣传", en: "Gym opening promo" },
      plain: { zh: "突出新店、专业器械、活力氛围和到店冲动", en: "Highlight a new gym, equipment, energy, and visit intent" },
      professionalTerms: ["local business promo", "opening campaign", "conversion CTA"],
      promptFragment: {
        zh: "健身房开业宣传视频，突出新店空间、专业器械、活力训练氛围和到店体验感",
        en: "gym opening promotional video highlighting the new space, professional equipment, energetic training mood, and visit appeal"
      },
      appliesTo: ["seedance", "generic_video"]
    },
    {
      id: "coffee_new_product",
      version: "0.1.0",
      label: { zh: "咖啡店新品短视频", en: "Coffee shop new product" },
      plain: { zh: "突出新品饮品、手作过程、口感联想和店铺气质", en: "Highlight a new drink, craft process, taste cues, and shop mood" },
      professionalTerms: ["food and beverage promo", "sensory cue", "lifestyle commercial"],
      promptFragment: {
        zh: "咖啡店新品短视频，突出新品饮品、制作细节、口感联想和温暖店铺氛围",
        en: "coffee shop new product short video highlighting the drink, preparation details, taste cues, and warm shop atmosphere"
      },
      appliesTo: ["seedance", "generic_video"]
    },
    {
      id: "city_travel_promo",
      version: "0.1.0",
      label: { zh: "旅游城市宣传片", en: "Travel city promo" },
      plain: { zh: "展示城市地标、美食、人文和旅行向往感", en: "Show landmarks, food, culture, and travel desire" },
      professionalTerms: ["destination marketing", "establishing montage", "place branding"],
      promptFragment: {
        zh: "旅游城市宣传片，展示地标景观、街巷生活、美食细节和旅行向往感",
        en: "travel city promotional video showing landmarks, street life, food details, and a sense of travel desire"
      },
      appliesTo: ["seedance", "generic_video"]
    },
    {
      id: "product_showcase",
      version: "0.1.0",
      label: { zh: "产品展示视频", en: "Product showcase" },
      plain: { zh: "让产品看起来清楚、可信、有质感", en: "Make a product look clear, credible, and polished" },
      professionalTerms: ["product hero shot", "feature showcase", "commercial packshot"],
      promptFragment: {
        zh: "产品展示视频，突出产品外观、材质细节、核心卖点和商业质感",
        en: "product showcase video emphasizing appearance, material details, key selling points, and commercial polish"
      },
      appliesTo: ["seedance", "generic_video"]
    },
    {
      id: "xiaohongshu_visit",
      version: "0.1.0",
      label: { zh: "小红书探店视频", en: "RedNote shop visit" },
      plain: { zh: "像真实探店笔记，强调氛围、体验和可分享感", en: "Feel like an authentic shop visit note with atmosphere and shareability" },
      professionalTerms: ["social visit vlog", "UGC review", "experience-led content"],
      promptFragment: {
        zh: "小红书风格探店视频，突出真实体验、店内氛围、细节发现和可分享感",
        en: "RedNote-style shop visit video highlighting real experience, interior atmosphere, small discoveries, and shareability"
      },
      appliesTo: ["seedance", "generic_video"]
    },
    {
      id: "course_promo",
      version: "0.1.0",
      label: { zh: "课程/训练营招生", en: "Course enrollment promo" },
      plain: { zh: "让用户理解课程价值、适合人群和行动理由", en: "Explain course value, target audience, and reason to act" },
      professionalTerms: ["education marketing", "value proposition", "learner outcome"],
      promptFragment: {
        zh: "课程招生宣传视频，突出学习场景、课程价值、适合人群和明确行动理由",
        en: "course enrollment promotional video emphasizing learning context, course value, target audience, and a clear reason to act"
      },
      appliesTo: ["seedance", "generic_video"]
    }
  ]
};
