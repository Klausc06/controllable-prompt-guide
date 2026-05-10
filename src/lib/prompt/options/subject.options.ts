import type { OptionSet } from "../types";

export const subjectOptions: OptionSet = {
  id: "subject",
  version: "0.1.0",
  label: { zh: "主体", en: "Subject" },
  options: [
    {
      id: "local_storefront",
      version: "0.1.0",
      label: { zh: "线下店铺/门店", en: "Local storefront" },
      plain: { zh: "适合餐饮、咖啡、健身、美业、零售店", en: "For restaurants, coffee shops, gyms, salons, and retail stores" },
      professionalTerms: ["storefront hero", "location branding", "service environment"],
      promptFragment: {
        zh: "一家线下门店作为核心主体，门头、室内空间、服务细节和顾客体验清晰可见",
        en: "a local storefront as the main subject, with visible signage, interior space, service details, and customer experience"
      },
      appliesTo: ["seedance", "generic_video"]
    },
    {
      id: "hero_product",
      version: "0.1.0",
      label: { zh: "单个产品", en: "Single hero product" },
      plain: { zh: "适合杯子、饮品、护肤品、数码配件等", en: "For cups, drinks, skincare, gadgets, and accessories" },
      professionalTerms: ["hero product", "packshot", "material detail"],
      promptFragment: {
        zh: "单个产品作为画面主角，外观轮廓、材质细节和使用价值被清楚突出",
        en: "a single hero product as the visual focus, with clear silhouette, material details, and usage value"
      },
      appliesTo: ["seedance", "generic_video"]
    },
    {
      id: "human_customer",
      version: "0.1.0",
      label: { zh: "真实顾客/用户", en: "Real customer or user" },
      plain: { zh: "用普通人的体验带出可信度", en: "Use a normal person's experience to build credibility" },
      professionalTerms: ["customer testimonial feel", "human-centered framing", "relatable subject"],
      promptFragment: {
        zh: "一位自然真实的普通顾客作为主体，通过体验动作带出产品或服务价值",
        en: "a natural everyday customer as the subject, showing the product or service value through experience"
      },
      appliesTo: ["seedance", "generic_video"],
      riskHint: {
        zh: "不要指定明星、网红或真实未授权人物。",
        en: "Do not specify celebrities, influencers, or unauthorized real people."
      }
    },
    {
      id: "staff_expert",
      version: "0.1.0",
      label: { zh: "工作人员/专家", en: "Staff or expert" },
      plain: { zh: "适合展示专业、服务流程、可信背书", en: "Good for professionalism, service process, and credibility" },
      professionalTerms: ["expert-led demonstration", "service process", "trust signal"],
      promptFragment: {
        zh: "一位专业工作人员或专家作为主体，动作熟练、表情自然，展示服务流程和专业可信感",
        en: "a professional staff member or expert as the subject, skilled and natural, demonstrating the service process and credibility"
      },
      appliesTo: ["seedance", "generic_video"]
    },
    {
      id: "space_environment",
      version: "0.1.0",
      label: { zh: "空间环境", en: "Space and environment" },
      plain: { zh: "让场地本身成为主角，适合旅游、门店、展厅", en: "Let the location itself be the hero, for travel, stores, and showrooms" },
      professionalTerms: ["environment-first", "establishing space", "spatial storytelling"],
      promptFragment: {
        zh: "空间环境本身作为主体，布局、氛围、动线和关键区域被清楚展示",
        en: "the space itself as the subject, clearly showing layout, atmosphere, movement path, and key zones"
      },
      appliesTo: ["seedance", "generic_video"]
    },
    {
      id: "food_drink",
      version: "0.1.0",
      label: { zh: "食物/饮品", en: "Food or drink" },
      plain: { zh: "突出新鲜、口感、制作过程和诱人细节", en: "Highlight freshness, taste, preparation, and appetizing detail" },
      professionalTerms: ["food styling", "appetite appeal", "macro texture"],
      promptFragment: {
        zh: "食物或饮品作为主体，突出新鲜质感、制作过程、诱人细节和口感联想",
        en: "food or drink as the main subject, emphasizing freshness, preparation, appetizing details, and taste cues"
      },
      appliesTo: ["seedance", "generic_video"]
    }
  ]
};
