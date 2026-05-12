import type { OptionSet } from "../types";

export const sceneOptions: OptionSet = {
  id: "scene",
  version: "0.1.0",
  label: { zh: "场景", en: "Scene" },
  options: [
    {
      id: "scene:bright_commercial_interior",
      version: "0.1.0",
      label: { zh: "明亮商业室内", en: "Bright commercial interior" },
      plain: { zh: "干净、专业，适合门店、健身房、展厅", en: "Clean and professional for stores, gyms, and showrooms" },
      professionalTerms: ["commercial interior", "clean layout", "brand environment"],
      promptFragment: {
        zh: "明亮整洁的商业室内空间，布局有序，背景干净，品牌环境清楚",
        en: "a bright and tidy commercial interior with orderly layout, clean background, and clear brand environment"
      },
      appliesTo: ["seedance", "generic_video", "veo3"]
    },
    {
      id: "scene:warm_cafe_counter",
      version: "0.1.0",
      label: { zh: "温暖咖啡吧台", en: "Warm cafe counter" },
      plain: { zh: "适合饮品、甜品、生活方式内容", en: "For drinks, desserts, and lifestyle content" },
      professionalTerms: ["cafe counter", "warm ambience", "craft preparation"],
      promptFragment: {
        zh: "温暖咖啡店吧台场景，木质细节、柔和灯光和手作氛围清楚可见",
        en: "a warm cafe counter scene with visible wood details, soft lighting, and handcrafted atmosphere"
      },
      appliesTo: ["seedance", "generic_video", "veo3"]
    },
    {
      id: "scene:urban_street",
      version: "0.1.0",
      label: { zh: "城市街头", en: "Urban street" },
      plain: { zh: "更有生活感，适合探店、潮流、城市宣传", en: "More lived-in, good for visits, trends, and city promos" },
      professionalTerms: ["urban lifestyle", "street-level realism", "ambient movement"],
      promptFragment: {
        zh: "真实城市街头场景，路人、街景、店招和自然环境动势形成生活氛围",
        en: "a real urban street scene with pedestrians, storefronts, signage, and natural ambient movement"
      },
      appliesTo: ["seedance", "generic_video", "veo3"]
    },
    {
      id: "scene:clean_studio_scene",
      version: "0.1.0",
      label: { zh: "干净棚拍", en: "Clean studio" },
      plain: { zh: "背景简单，产品更突出", en: "Simple background that makes the product stand out" },
      professionalTerms: ["studio setup", "seamless background", "controlled environment"],
      promptFragment: {
        zh: "干净棚拍环境，背景简洁无干扰，主体和材质细节被清楚突出",
        en: "a clean studio setup with a simple distraction-free background that clearly highlights the subject and material detail"
      },
      appliesTo: ["seedance", "generic_video", "veo3"]
    },
    {
      id: "scene:landmark_montage",
      version: "0.1.0",
      label: { zh: "城市地标组合", en: "Landmark montage" },
      plain: { zh: "适合旅游城市、活动、区域宣传", en: "For travel cities, events, and regional promos" },
      professionalTerms: ["landmark montage", "destination branding", "wide establishing shots"],
      promptFragment: {
        zh: "城市地标和街巷生活组合场景，远景建立城市感，近景呈现人文细节",
        en: "a montage of city landmarks and street life, using wide views for place identity and close details for culture"
      },
      appliesTo: ["seedance", "generic_video", "veo3"]
    },
    {
      id: "scene:home_daily",
      version: "0.1.0",
      label: { zh: "居家日常", en: "Home daily life" },
      plain: { zh: "亲切自然，适合生活用品、课程、服务类", en: "Approachable and natural for lifestyle products, courses, and services" },
      professionalTerms: ["home lifestyle", "natural context", "relatable scene"],
      promptFragment: {
        zh: "自然居家生活场景，环境真实、有温度，主体使用方式容易理解",
        en: "a natural home lifestyle scene that feels warm and relatable, with easy-to-understand subject usage"
      },
      appliesTo: ["seedance", "generic_video", "veo3"]
    },
    {
      id: "scene:outdoor_forest",
      version: "0.1.0",
      label: { zh: "户外自然/森林", en: "Outdoor nature / forest" },
      plain: { zh: "适合自然风光、户外运动、野餐、旅行内容", en: "For nature scenery, outdoor sports, picnics, and travel content" },
      professionalTerms: ["natural landscape", "forest environment", "organic lighting"],
      promptFragment: {
        zh: "户外自然森林场景，树木植被丰富，自然光线透过枝叶洒落，环境真实生动",
        en: "an outdoor forest scene with rich vegetation, natural light filtering through branches, and an authentic organic environment"
      },
      appliesTo: ["seedance", "generic_video", "veo3"],
      riskHint: {
        zh: "户外光线变化大，建议指定时段（清晨/黄昏）以获得一致光照。",
        en: "Outdoor lighting varies greatly; specify time of day (morning/golden hour) for consistent results."
      }
    },
    {
      id: "scene:beach_poolside",
      version: "0.1.0",
      label: { zh: "海滩/泳池边", en: "Beach / poolside" },
      plain: { zh: "适合度假、泳装、水上运动、夏日主题", en: "For vacations, swimwear, water sports, and summer themes" },
      professionalTerms: ["beach setting", "poolside ambiance", "water reflection"],
      promptFragment: {
        zh: "海滩或泳池边场景，水波光影、开阔视野、假日放松氛围",
        en: "a beach or poolside scene with water reflections, open views, and a relaxing holiday atmosphere"
      },
      appliesTo: ["seedance", "generic_video", "veo3"],
      riskHint: {
        zh: "注意人物隐私，避免出现路过游客的正脸清晰画面。",
        en: "Be mindful of privacy; avoid clear frontal views of bystanders."
      }
    },
    {
      id: "scene:lab_tech_space",
      version: "0.1.0",
      label: { zh: "实验室/科技空间", en: "Lab / tech space" },
      plain: { zh: "适合科技产品、科研、创新、医疗健康类", en: "For tech products, research, innovation, and healthcare" },
      professionalTerms: ["laboratory setting", "high-tech environment", "precision workspace"],
      promptFragment: {
        zh: "科技实验室或专业技术空间，设备整齐、环境干净、功能导向的氛围",
        en: "a tech lab or professional workspace with neat equipment, clean surfaces, and a function-driven atmosphere"
      },
      appliesTo: ["seedance", "generic_video", "veo3"]
    },
    {
      id: "scene:gym_sports_venue",
      version: "0.1.0",
      label: { zh: "健身房/运动场", en: "Gym / sports venue" },
      plain: { zh: "适合健身、运动品牌、赛事宣传、健康生活", en: "For fitness, sports brands, event promos, and healthy lifestyle" },
      professionalTerms: ["fitness environment", "sports venue", "active space"],
      promptFragment: {
        zh: "健身房或运动场馆场景，器材齐全，空间开阔，充满动感和活力",
        en: "a gym or sports venue with full equipment, open space, and a dynamic energetic atmosphere"
      },
      appliesTo: ["seedance", "generic_video", "veo3"]
    },
    {
      id: "scene:bedroom_cozy_home",
      version: "0.1.0",
      label: { zh: "卧室/居家角落", en: "Bedroom / cozy home corner" },
      plain: { zh: "适合家居用品、个人护理、睡前读物、安静时光", en: "For home goods, personal care, bedtime reading, and quiet moments" },
      professionalTerms: ["bedroom setting", "cozy interior", "intimate atmosphere"],
      promptFragment: {
        zh: "温馨卧室或居家角落场景，柔软床品、暖光灯光、安静私密的放松氛围",
        en: "a cozy bedroom or home corner with soft bedding, warm lighting, and a quiet intimate atmosphere"
      },
      appliesTo: ["seedance", "generic_video", "veo3"]
    },
    {
      id: "scene:exhibition_gallery_white",
      version: "0.1.0",
      label: { zh: "展览/画廊白空间", en: "Exhibition / gallery white space" },
      plain: { zh: "适合艺术、设计、品牌展示、高端产品", en: "For art, design, brand displays, and premium products" },
      professionalTerms: ["gallery space", "white cube", "curated environment"],
      promptFragment: {
        zh: "极简画廊或展览空间，纯白墙面，聚焦陈列主体，艺术感和高级感并重",
        en: "a minimalist gallery or exhibition space with white walls, focused display, balancing artistic and premium feel"
      },
      appliesTo: ["seedance", "generic_video", "veo3"]
    },
    {
      id: "scene:medical_wellness",
      version: "0.1.0",
      label: { zh: "医疗/健康空间", en: "Medical / wellness space" },
      plain: { zh: "现代医疗或健康管理空间，干净明亮", en: "Modern medical or wellness space, clean and bright" },
      professionalTerms: ["medical interior", "wellness space", "clinical clean"],
      promptFragment: { zh: "现代医疗或健康管理空间，干净明亮的诊疗环境，适合大健康类内容", en: "modern medical or wellness space, clean and bright clinical environment, suitable for healthcare content" },
      appliesTo: ["seedance", "generic_video"],
      riskHint: { zh: "", en: "" }
    },
    {
      id: "scene:night_market_outdoor",
      version: "0.1.0",
      label: { zh: "户外集市/夜市", en: "Outdoor night market" },
      plain: { zh: "户外集市或夜市，暖光、热闹氛围", en: "Outdoor night market with warm lighting and lively atmosphere" },
      professionalTerms: ["night market", "street fair", "ambient crowd"],
      promptFragment: { zh: "户外集市或夜市场景，暖光、热闹人群和摊位氛围，适合生活类内容", en: "outdoor night market or street fair with warm lighting, lively crowds, and vendor stalls, suitable for lifestyle content" },
      appliesTo: ["seedance", "generic_video", "veo3"],
      riskHint: { zh: "", en: "" }
    },
    {
      id: "scene:classroom_training",
      version: "0.1.0",
      label: { zh: "教室/培训空间", en: "Classroom / training space" },
      plain: { zh: "适合教育、培训、讲座、研讨会场景", en: "For education, training, lectures, and workshop settings" },
      professionalTerms: ["classroom setting", "training environment", "educational space"],
      promptFragment: { zh: "教室或培训空间场景，明亮整洁，学习氛围浓厚，设备齐全", en: "a classroom or training space with bright clean layout, focused learning atmosphere, and well-equipped setup" },
      appliesTo: ["seedance", "generic_video", "veo3"],
      riskHint: { zh: "", en: "" }
    }
  ]
};
