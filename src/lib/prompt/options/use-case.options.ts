import type { OptionSet } from "../types";

export const useCaseOptions: OptionSet = {
  id: "use_case",
  version: "0.1.0",
  label: { zh: "作品目标", en: "Use case" },
  options: [
    {
      id: "use_case:gym_opening",
      version: "0.1.0",
      label: { zh: "健身房开业宣传", en: "Gym opening promo" },
      plain: { zh: "突出新店、专业器械、活力氛围和到店冲动", en: "Highlight a new gym, equipment, energy, and visit intent" },
      professionalTerms: ["local business promo", "opening campaign", "conversion CTA"],
      promptFragment: {
        zh: "健身房开业宣传视频，突出新店空间、专业器械、活力训练氛围和到店体验感",
        en: "gym opening promotional video highlighting the new space, professional equipment, energetic training mood, and visit appeal"
      },
      appliesTo: ["seedance", "generic_video", "veo3"]
    },
    {
      id: "use_case:coffee_new_product",
      version: "0.1.0",
      label: { zh: "咖啡店新品短视频", en: "Coffee shop new product" },
      plain: { zh: "突出新品饮品、手作过程、口感联想和店铺气质", en: "Highlight a new drink, craft process, taste cues, and shop mood" },
      professionalTerms: ["food and beverage promo", "sensory cue", "lifestyle commercial"],
      promptFragment: {
        zh: "咖啡店新品短视频，突出新品饮品、制作细节、口感联想和温暖店铺氛围",
        en: "coffee shop new product short video highlighting the drink, preparation details, taste cues, and warm shop atmosphere"
      },
      appliesTo: ["seedance", "generic_video", "veo3"]
    },
    {
      id: "use_case:city_travel_promo",
      version: "0.1.0",
      label: { zh: "旅游城市宣传片", en: "Travel city promo" },
      plain: { zh: "展示城市地标、美食、人文和旅行向往感", en: "Show landmarks, food, culture, and travel desire" },
      professionalTerms: ["destination marketing", "establishing montage", "place branding"],
      promptFragment: {
        zh: "旅游城市宣传片，展示地标景观、街巷生活、美食细节和旅行向往感",
        en: "travel city promotional video showing landmarks, street life, food details, and a sense of travel desire"
      },
      appliesTo: ["seedance", "generic_video", "veo3"]
    },
    {
      id: "use_case:product_showcase",
      version: "0.1.0",
      label: { zh: "产品展示视频", en: "Product showcase" },
      plain: { zh: "让产品看起来清楚、可信、有质感", en: "Make a product look clear, credible, and polished" },
      professionalTerms: ["product hero shot", "feature showcase", "commercial packshot"],
      promptFragment: {
        zh: "产品展示视频，突出产品外观、材质细节、核心卖点和商业质感",
        en: "product showcase video emphasizing appearance, material details, key selling points, and commercial polish"
      },
      appliesTo: ["seedance", "generic_video", "veo3"]
    },
    {
      id: "use_case:xiaohongshu_visit",
      version: "0.1.0",
      label: { zh: "小红书探店视频", en: "RedNote shop visit" },
      plain: { zh: "像真实探店笔记，强调氛围、体验和可分享感", en: "Feel like an authentic shop visit note with atmosphere and shareability" },
      professionalTerms: ["social visit vlog", "UGC review", "experience-led content"],
      promptFragment: {
        zh: "小红书风格探店视频，突出真实体验、店内氛围、细节发现和可分享感",
        en: "RedNote-style shop visit video highlighting real experience, interior atmosphere, small discoveries, and shareability"
      },
      appliesTo: ["seedance", "generic_video", "veo3"]
    },
    {
      id: "use_case:course_promo",
      version: "0.1.0",
      label: { zh: "课程/训练营招生", en: "Course enrollment promo" },
      plain: { zh: "让用户理解课程价值、适合人群和行动理由", en: "Explain course value, target audience, and reason to act" },
      professionalTerms: ["education marketing", "value proposition", "learner outcome"],
      promptFragment: {
        zh: "课程招生宣传视频，突出学习场景、课程价值、适合人群和明确行动理由",
        en: "course enrollment promotional video emphasizing learning context, course value, target audience, and a clear reason to act"
      },
      appliesTo: ["seedance", "generic_video", "veo3"]
    },
    {
      id: "use_case:product_unboxing",
      version: "0.1.0",
      label: { zh: "产品展示/开箱", en: "Product showcase / unboxing" },
      plain: { zh: "突出产品外观、包装细节和第一印象", en: "Highlight product appearance, packaging, and first impressions" },
      professionalTerms: ["unboxing experience", "first impression", "product hero"],
      promptFragment: {
        zh: "产品开箱展示视频，突出包装质感、产品外观细节和开箱第一印象",
        en: "product unboxing video highlighting packaging quality, product details, and first-impression reveal"
      },
      appliesTo: ["seedance", "generic_video", "veo3"]
    },
    {
      id: "use_case:event_recap",
      version: "0.1.0",
      label: { zh: "活动回顾/花絮", en: "Event recap / behind the scenes" },
      plain: { zh: "展示活动现场、精彩瞬间和幕后故事", en: "Show event highlights, candid moments, and backstage stories" },
      professionalTerms: ["event highlight reel", "BTS content", "montage editing"],
      promptFragment: {
        zh: "活动回顾视频，混剪活动现场精彩片段、花絮瞬间和幕后故事，节奏明快",
        en: "event recap video with fast-paced montage of live moments, candid BTS clips, and backstage stories"
      },
      appliesTo: ["seedance", "generic_video", "veo3"]
    },
    {
      id: "use_case:tutorial_demo",
      version: "0.1.0",
      label: { zh: "教程/操作演示", en: "Tutorial / how-to demo" },
      plain: { zh: "清晰展示操作步骤，让用户能跟着做", en: "Clearly demonstrate steps so users can follow along" },
      professionalTerms: ["step-by-step tutorial", "instructional video", "how-to guide"],
      promptFragment: {
        zh: "教程演示视频，分步展示操作过程，画面清晰聚焦每一步关键动作",
        en: "tutorial demonstration video showing each step clearly, with focused framing on key actions"
      },
      appliesTo: ["seedance", "generic_video", "veo3"]
    },
    {
      id: "use_case:brand_image",
      version: "0.1.0",
      label: { zh: "品牌形象片", en: "Brand image / corporate video" },
      plain: { zh: "传递品牌调性、使命和情感，而非具体产品", en: "Convey brand tone, mission, and emotion rather than specific products" },
      professionalTerms: ["brand film", "corporate identity", "emotional storytelling"],
      promptFragment: {
        zh: "品牌形象视频，以意境和情绪传递品牌价值观，画面精致且富有感染力",
        en: "brand image video communicating brand values through mood and emotion, with polished, evocative visuals"
      },
      appliesTo: ["seedance", "generic_video", "veo3"]
    },
    {
      id: "use_case:social_media_quick_clip",
      version: "0.1.0",
      label: { zh: "社交媒体快拍", en: "Social media quick clip" },
      plain: { zh: "适合 Stories / Reels 的快节奏短片", en: "Fast-paced short clip for Stories and Reels" },
      professionalTerms: ["social media short", "vertical video", "viral pacing"],
      promptFragment: {
        zh: "社交媒体快拍风格，竖屏构图、节奏紧凑、前3秒抓住注意力",
        en: "social media quick clip in vertical format, tight pacing, hooking attention in the first 3 seconds"
      },
      appliesTo: ["seedance", "generic_video", "veo3"]
    },
    {
      id: "use_case:livestream_clip",
      version: "0.1.0",
      label: { zh: "直播带货片段", en: "Livestream selling clip" },
      plain: { zh: "直播带货中的产品展示，以主播视角展示商品效果", en: "Product showcase from a livestream host's perspective" },
      professionalTerms: ["livestream highlight", "shoppable clip", "host-driven"],
      promptFragment: { zh: "直播带货中的产品展示片段，以主播视角展示商品使用效果和卖点", en: "product showcase clip from a livestream selling session, from the host's perspective highlighting product features" },
      appliesTo: ["seedance", "generic_video"],
      riskHint: { zh: "", en: "" }
    },
    {
      id: "use_case:real_estate_tour",
      version: "0.1.0",
      label: { zh: "房产/楼盘展示", en: "Real estate property tour" },
      plain: { zh: "楼盘或室内空间的沉浸式展示", en: "Immersive tour of a property or interior space" },
      professionalTerms: ["property walkthrough", "architectural tour", "real estate visual"],
      promptFragment: { zh: "楼盘或室内空间的沉浸式展示，突出空间关系、采光和设计细节", en: "immersive tour of a property or interior space, emphasizing spatial flow, natural light, and design details" },
      appliesTo: ["seedance", "generic_video", "veo3"],
      riskHint: { zh: "", en: "" }
    },
    {
      id: "use_case:corporate_event",
      version: "0.1.0",
      label: { zh: "企业年会/庆典", en: "Corporate annual event" },
      plain: { zh: "企业年会或庆典的精彩集锦", en: "Highlight reel of a corporate celebration" },
      professionalTerms: ["corporate event", "gala highlight", "ceremony recap"],
      promptFragment: { zh: "企业年会、庆典或发布会的精彩集锦，突出品牌氛围、舞台效果和参与者互动", en: "highlight reel of a corporate annual event, celebration, or launch, capturing brand atmosphere, stage effects, and attendee interaction" },
      appliesTo: ["seedance", "generic_video"],
      riskHint: { zh: "", en: "" }
    },
    {
      id: "use_case:restaurant_menu_showcase",
      version: "0.1.0",
      label: { zh: "餐厅菜品展示", en: "Restaurant menu showcase" },
      plain: { zh: "展示多道菜品的摆盘、色彩和诱人细节", en: "Showcase plating, colors, and appetizing details of multiple dishes" },
      professionalTerms: ["food montage", "menu showcase", "plating presentation"],
      promptFragment: { zh: "餐厅菜品展示视频，逐一呈现多道菜品的摆盘、色彩搭配和诱人质感", en: "restaurant menu showcase video presenting multiple dishes with attractive plating, color composition, and appetizing texture" },
      appliesTo: ["seedance", "generic_video", "veo3"],
      riskHint: { zh: "", en: "" }
    }
  ]
};
