import type { OptionSet } from "../types";

export const shotTypeOptions: OptionSet = {
  id: "shot_type",
  version: "0.1.0",
  label: { zh: "镜头构图", en: "Shot type" },
  options: [
    {
      id: "establishing_wide",
      version: "0.1.0",
      label: { zh: "远景/定场", en: "Establishing wide shot" },
      plain: { zh: "先展示环境，再引入主体", en: "Reveal the environment first, then introduce the subject" },
      professionalTerms: ["establishing shot", "wide shot", "environment reveal"],
      promptFragment: { zh: "远景定场构图，先展现场地和环境规模", en: "an establishing wide shot that first reveals the location and environmental scale" },
      appliesTo: ["seedance", "generic_video"]
    },
    {
      id: "full_body",
      version: "0.1.0",
      label: { zh: "全身/全貌", en: "Full body / Full view" },
      plain: { zh: "展示主体完整外形", en: "Show the complete outline of the subject" },
      professionalTerms: ["full shot", "complete view", "whole subject"],
      promptFragment: { zh: "全身镜头，完整展示主体外形和姿态", en: "a full shot showing the complete form and pose of the subject" },
      appliesTo: ["seedance", "generic_video"]
    },
    {
      id: "medium_shot",
      version: "0.1.0",
      label: { zh: "中景", en: "Medium shot" },
      plain: { zh: "主体占画面主体，清晰但不压迫", en: "Subject fills the frame naturally without crowding" },
      professionalTerms: ["medium shot", "waist-up", "balanced framing"],
      promptFragment: { zh: "中景构图，主体占据画面主要区域，比例平衡自然", en: "a medium shot with the subject occupying the main area in balanced proportion" },
      appliesTo: ["seedance", "generic_video"]
    },
    {
      id: "close_up",
      version: "0.1.0",
      label: { zh: "特写", en: "Close-up" },
      plain: { zh: "聚焦产品或表情细节", en: "Focus on product or expression details" },
      professionalTerms: ["close-up", "macro detail", "shallow depth of field"],
      promptFragment: { zh: "特写镜头，浅景深，突出关键纹理、表情或产品细节", en: "a close-up shot with shallow depth of field, emphasizing key texture, expression, or product details" },
      appliesTo: ["seedance", "generic_video"]
    },
    {
      id: "extreme_close_up",
      version: "0.1.0",
      label: { zh: "超特写", en: "Extreme close-up" },
      plain: { zh: "极致细节，眼睛/手部/材质", en: "Extreme detail — eyes, hands, texture" },
      professionalTerms: ["extreme close-up", "macro", "texture focus"],
      promptFragment: { zh: "超特写镜头，仅展示关键细节，画面极简聚焦", en: "an extreme close-up showing only the critical detail in ultra-focused composition" },
      appliesTo: ["seedance", "generic_video"]
    },
    {
      id: "top_down_flat_lay",
      version: "0.1.0",
      label: { zh: "俯拍平铺", en: "Top-down flat lay" },
      plain: { zh: "从正上方拍，食物/产品/桌面", en: "Shot from directly above — food, products, tabletop" },
      professionalTerms: ["top-down shot", "flat lay", "graphic composition"],
      promptFragment: { zh: "俯拍平铺构图，从正上方拍摄，物体排列清晰", en: "a top-down flat lay composition with clearly arranged objects" },
      appliesTo: ["seedance", "generic_video"]
    },
    {
      id: "dutch_angle",
      version: "0.1.0",
      label: { zh: "斜角构图", en: "Dutch angle" },
      plain: { zh: "镜头倾斜，制造紧张或动感", en: "Tilted camera for tension or dynamic feel" },
      professionalTerms: ["dutch angle", "canted frame", "dynamic tension"],
      promptFragment: { zh: "斜角倾斜构图，制造动感和视觉张力", en: "a canted Dutch angle creating visual dynamism and tension" },
      appliesTo: ["seedance", "generic_video"],
      riskHint: { zh: "斜角构图不宜过多使用，建议只在关键转场采用。", en: "Use Dutch angles sparingly — reserve for key transitions." }
    },
    {
      id: "pov_shot",
      version: "0.1.0",
      label: { zh: "主观视角", en: "POV shot" },
      plain: { zh: "用户视角，第一人称看世界", en: "User's perspective — first-person view" },
      professionalTerms: ["POV", "first-person perspective", "immersive view"],
      promptFragment: { zh: "主观视角镜头，模拟用户第一人称视角观察场景", en: "a POV shot simulating the user's first-person perspective through the scene" },
      appliesTo: ["seedance", "generic_video"]
    }
  ]
};
