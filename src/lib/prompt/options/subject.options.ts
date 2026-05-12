import type { OptionSet } from "../types";

export const subjectOptions: OptionSet = {
  id: "subject",
  version: "0.1.0",
  label: { zh: "主体", en: "Subject" },
  options: [
    {
      id: "subject:local_storefront",
      version: "0.1.0",
      label: { zh: "线下店铺/门店", en: "Local storefront" },
      plain: { zh: "适合餐饮、咖啡、健身、美业、零售店", en: "For restaurants, coffee shops, gyms, salons, and retail stores" },
      professionalTerms: ["storefront hero", "location branding", "service environment"],
      promptFragment: {
        zh: "一家线下门店作为核心主体，门头、室内空间、服务细节和顾客体验清晰可见",
        en: "a local storefront as the main subject, with visible signage, interior space, service details, and customer experience"
      },
      appliesTo: ["seedance", "generic_video", "veo3"]
    },
    {
      id: "subject:hero_product",
      version: "0.1.0",
      label: { zh: "单个产品", en: "Single hero product" },
      plain: { zh: "适合杯子、饮品、护肤品、数码配件等", en: "For cups, drinks, skincare, gadgets, and accessories" },
      professionalTerms: ["hero product", "packshot", "material detail"],
      promptFragment: {
        zh: "单个产品作为画面主角，外观轮廓、材质细节和使用价值被清楚突出",
        en: "a single hero product as the visual focus, with clear silhouette, material details, and usage value"
      },
      appliesTo: ["seedance", "generic_video", "veo3"]
    },
    {
      id: "subject:human_customer",
      version: "0.1.0",
      label: { zh: "真实顾客/用户", en: "Real customer or user" },
      plain: { zh: "用普通人的体验带出可信度", en: "Use a normal person's experience to build credibility" },
      professionalTerms: ["customer testimonial feel", "human-centered framing", "relatable subject"],
      promptFragment: {
        zh: "一位自然真实的普通顾客作为主体，通过体验动作带出产品或服务价值",
        en: "a natural everyday customer as the subject, showing the product or service value through experience"
      },
      appliesTo: ["seedance", "generic_video", "veo3"],
      riskHint: {
        zh: "不要指定明星、网红或真实未授权人物。",
        en: "Do not specify celebrities, influencers, or unauthorized real people."
      }
    },
    {
      id: "subject:staff_expert",
      version: "0.1.0",
      label: { zh: "工作人员/专家", en: "Staff or expert" },
      plain: { zh: "适合展示专业、服务流程、可信背书", en: "Good for professionalism, service process, and credibility" },
      professionalTerms: ["expert-led demonstration", "service process", "trust signal"],
      promptFragment: {
        zh: "一位专业工作人员或专家作为主体，动作熟练、表情自然，展示服务流程和专业可信感",
        en: "a professional staff member or expert as the subject, skilled and natural, demonstrating the service process and credibility"
      },
      appliesTo: ["seedance", "generic_video", "veo3"]
    },
    {
      id: "subject:space_environment",
      version: "0.1.0",
      label: { zh: "空间环境", en: "Space and environment" },
      plain: { zh: "让场地本身成为主角，适合旅游、门店、展厅", en: "Let the location itself be the hero, for travel, stores, and showrooms" },
      professionalTerms: ["environment-first", "establishing space", "spatial storytelling"],
      promptFragment: {
        zh: "空间环境本身作为主体，布局、氛围、动线和关键区域被清楚展示",
        en: "the space itself as the subject, clearly showing layout, atmosphere, movement path, and key zones"
      },
      appliesTo: ["seedance", "generic_video", "veo3"]
    },
    {
      id: "subject:food_drink",
      version: "0.1.0",
      label: { zh: "食物/饮品", en: "Food or drink" },
      plain: { zh: "突出新鲜、口感、制作过程和诱人细节", en: "Highlight freshness, taste, preparation, and appetizing detail" },
      professionalTerms: ["food styling", "appetite appeal", "macro texture"],
      promptFragment: {
        zh: "食物或饮品作为主体，突出新鲜质感、制作过程、诱人细节和口感联想",
        en: "food or drink as the main subject, emphasizing freshness, preparation, appetizing details, and taste cues"
      },
      appliesTo: ["seedance", "generic_video", "veo3"]
    },
    {
      id: "subject:person_model",
      version: "0.1.0",
      label: { zh: "人物/模特", en: "Person / model" },
      plain: { zh: "通过人物形象展示产品、服装、妆容或生活方式", en: "Use a person to showcase products, clothing, makeup, or lifestyle" },
      professionalTerms: ["human model", "portrait framing", "lifestyle subject"],
      promptFragment: {
        zh: "一位人物作为主体，自然不做作，通过动作和表情带出产品或氛围",
        en: "a person as the main subject, natural and unposed, expressing the product or mood through action and expression"
      },
      appliesTo: ["seedance", "generic_video", "veo3"],
      riskHint: {
        zh: "不要指定明星、网红或真实未授权人物。",
        en: "Do not specify celebrities, influencers, or unauthorized real people."
      }
    },
    {
      id: "subject:vehicles_transportation",
      version: "0.1.0",
      label: { zh: "汽车/交通工具", en: "Vehicles / transportation" },
      plain: { zh: "适合汽车广告、出行服务、交通工具展示", en: "For car ads, travel services, and vehicle showcases" },
      professionalTerms: ["vehicle hero", "automotive detail", "dynamic movement"],
      promptFragment: {
        zh: "交通工具作为主体，突出外观造型、动态姿态、材质细节和行驶场景",
        en: "a vehicle as the main subject, highlighting its silhouette, dynamic stance, material detail, and driving context"
      },
      appliesTo: ["seedance", "generic_video", "veo3"],
      riskHint: {
        zh: "避免指定具体品牌车型，防止侵权风险。",
        en: "Avoid specifying real car brands/models to prevent trademark issues."
      }
    },
    {
      id: "subject:electronics_gadgets",
      version: "0.1.0",
      label: { zh: "电子数码产品", en: "Electronics / gadgets" },
      plain: { zh: "适合手机、耳机、电脑、智能设备等数码产品", en: "For phones, headphones, computers, smart devices, and gadgets" },
      professionalTerms: ["tech product", "digital device", "product detail shot"],
      promptFragment: {
        zh: "电子产品作为主体，突出工业设计、屏幕内容、接口细节和使用交互",
        en: "an electronic device as the main subject, emphasizing industrial design, screen content, port details, and user interaction"
      },
      appliesTo: ["seedance", "generic_video", "veo3"]
    },
    {
      id: "subject:jewelry_accessories",
      version: "0.1.0",
      label: { zh: "珠宝/配饰", en: "Jewelry / accessories" },
      plain: { zh: "适合项链、戒指、手表、包袋、眼镜等配饰", en: "For necklaces, rings, watches, bags, glasses, and accessories" },
      professionalTerms: ["jewelry close-up", "accessory showcase", "luxury detail"],
      promptFragment: {
        zh: "珠宝或配饰为主体，突出材质光泽、工艺细节、精致质感和佩戴效果",
        en: "jewelry or accessories as the subject, highlighting material luster, craftsmanship, refined texture, and wear effect"
      },
      appliesTo: ["seedance", "generic_video", "veo3"]
    },
    {
      id: "subject:architecture_interior",
      version: "0.1.0",
      label: { zh: "建筑/室内空间", en: "Architecture / interior space" },
      plain: { zh: "适合地产、设计、空间改造、酒店民宿展示", en: "For real estate, design, renovations, hotels, and B&Bs" },
      professionalTerms: ["architectural subject", "interior design", "spatial composition"],
      promptFragment: {
        zh: "建筑或室内空间作为主体，突出结构线条、空间层次、材质搭配和设计语言",
        en: "architecture or interior space as the subject, emphasizing structural lines, spatial layering, material palettes, and design language"
      },
      appliesTo: ["seedance", "generic_video", "veo3"]
    },
    {
      id: "subject:pets_animals",
      version: "0.1.0",
      label: { zh: "宠物/动物", en: "Pets / animals" },
      plain: { zh: "适合宠物用品、动物主题、温馨生活内容", en: "For pet products, animal themes, and warm lifestyle content" },
      professionalTerms: ["animal subject", "pet close-up", "natural behavior"],
      promptFragment: {
        zh: "宠物或动物作为主体，捕捉自然动作和神态，突出毛发光泽和可爱互动瞬间",
        en: "a pet or animal as the subject, capturing natural movement and expression, highlighting fur texture and endearing interaction"
      },
      appliesTo: ["seedance", "generic_video", "veo3"]
    }
  ]
};
