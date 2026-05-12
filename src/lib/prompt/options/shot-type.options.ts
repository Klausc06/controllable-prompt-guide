import type { OptionSet } from "../types";

export const shotTypeOptions: OptionSet = {
  id: "shot_type",
  version: "0.1.0",
  label: { zh: "镜头构图", en: "Shot type" },
  options: [
    {
      id: "shot_type:establishing_wide",
      version: "0.1.0",
      label: { zh: "远景/定场", en: "Establishing wide shot" },
      plain: { zh: "先展示环境，再引入主体", en: "Reveal the environment first, then introduce the subject" },
      professionalTerms: ["establishing shot", "wide shot", "environment reveal"],
      promptFragment: { zh: "远景定场构图，先展现场地和环境规模", en: "an establishing wide shot that first reveals the location and environmental scale" },
      appliesTo: ["seedance", "generic_video"]
    },
    {
      id: "shot_type:full_body",
      version: "0.1.0",
      label: { zh: "全身/全貌", en: "Full body / Full view" },
      plain: { zh: "展示主体完整外形", en: "Show the complete outline of the subject" },
      professionalTerms: ["full shot", "complete view", "whole subject"],
      promptFragment: { zh: "全身镜头，完整展示主体外形和姿态", en: "a full shot showing the complete form and pose of the subject" },
      appliesTo: ["seedance", "generic_video"]
    },
    {
      id: "shot_type:medium_shot",
      version: "0.1.0",
      label: { zh: "中景", en: "Medium shot" },
      plain: { zh: "主体占画面主体，清晰但不压迫", en: "Subject fills the frame naturally without crowding" },
      professionalTerms: ["medium shot", "waist-up", "balanced framing"],
      promptFragment: { zh: "中景构图，主体占据画面主要区域，比例平衡自然", en: "a medium shot with the subject occupying the main area in balanced proportion" },
      appliesTo: ["seedance", "generic_video"]
    },
    {
      id: "shot_type:close_up",
      version: "0.1.0",
      label: { zh: "特写", en: "Close-up" },
      plain: { zh: "聚焦产品或表情细节", en: "Focus on product or expression details" },
      professionalTerms: ["close-up", "macro detail", "shallow depth of field"],
      promptFragment: { zh: "特写镜头，浅景深，突出关键纹理、表情或产品细节", en: "a close-up shot with shallow depth of field, emphasizing key texture, expression, or product details" },
      appliesTo: ["seedance", "generic_video"]
    },
    {
      id: "shot_type:extreme_close_up",
      version: "0.1.0",
      label: { zh: "超特写", en: "Extreme close-up" },
      plain: { zh: "极致细节，眼睛/手部/材质", en: "Extreme detail — eyes, hands, texture" },
      professionalTerms: ["extreme close-up", "macro", "texture focus"],
      promptFragment: { zh: "超特写镜头，仅展示关键细节，画面极简聚焦", en: "an extreme close-up showing only the critical detail in ultra-focused composition" },
      appliesTo: ["seedance", "generic_video"]
    },
    {
      id: "shot_type:top_down_flat_lay",
      version: "0.1.0",
      label: { zh: "俯拍平铺", en: "Top-down flat lay" },
      plain: { zh: "从正上方拍，食物/产品/桌面", en: "Shot from directly above — food, products, tabletop" },
      professionalTerms: ["top-down shot", "flat lay", "graphic composition"],
      promptFragment: { zh: "俯拍平铺构图，从正上方拍摄，物体排列清晰", en: "a top-down flat lay composition with clearly arranged objects" },
      appliesTo: ["seedance", "generic_video"]
    },
    {
      id: "shot_type:dutch_angle",
      version: "0.1.0",
      label: { zh: "斜角构图", en: "Dutch angle" },
      plain: { zh: "镜头倾斜，制造紧张或动感", en: "Tilted camera for tension or dynamic feel" },
      professionalTerms: ["dutch angle", "canted frame", "dynamic tension"],
      promptFragment: { zh: "斜角倾斜构图，制造动感和视觉张力", en: "a canted Dutch angle creating visual dynamism and tension" },
      appliesTo: ["seedance", "generic_video"],
      riskHint: { zh: "斜角构图不宜过多使用，建议只在关键转场采用。", en: "Use Dutch angles sparingly — reserve for key transitions." }
    },
    {
      id: "shot_type:pov_shot",
      version: "0.1.0",
      label: { zh: "主观视角", en: "POV shot" },
      plain: { zh: "用户视角，第一人称看世界", en: "User's perspective — first-person view" },
      professionalTerms: ["POV", "first-person perspective", "immersive view"],
      promptFragment: { zh: "主观视角镜头，模拟用户第一人称视角观察场景", en: "a POV shot simulating the user's first-person perspective through the scene" },
      appliesTo: ["seedance", "generic_video"]
    },
    {
      id: "shot_type:over_shoulder",
      version: "0.1.0",
      label: { zh: "过肩镜头", en: "Over-the-shoulder shot" },
      plain: { zh: "前景为肩部轮廓，焦点在对面的主体上，营造对话感", en: "Shoulder silhouette in foreground with focus on facing subject, creating dialogue intimacy" },
      professionalTerms: ["over-the-shoulder", "OTS", "conversation framing"],
      promptFragment: { zh: "过肩镜头，前景为人物肩部轮廓，焦点落在对面主体上，营造对话感和代入感", en: "over-the-shoulder shot, with a shoulder silhouette in the foreground and focus on the facing subject, creating dialogue intimacy" },
      appliesTo: ["seedance", "generic_video", "veo3"],
      riskHint: { zh: "", en: "" }
    },
    {
      id: "shot_type:two_shot",
      version: "0.1.0",
      label: { zh: "双人镜头", en: "Two-shot" },
      plain: { zh: "两人同框，表现互动关系", en: "Two subjects in frame emphasizing their interaction" },
      professionalTerms: ["two-shot", "dual subject", "relationship framing"],
      promptFragment: { zh: "双人同框镜头，两人在画面中占据均衡位置，表现互动关系", en: "two-shot with both subjects balanced in the frame, emphasizing their interaction" },
      appliesTo: ["seedance", "generic_video", "veo3"],
      riskHint: { zh: "", en: "" }
    },
    {
      id: "shot_type:low_angle",
      version: "0.1.0",
      label: { zh: "低角度仰拍", en: "Low angle" },
      plain: { zh: "从下方仰视主体，营造高大权威感", en: "Looking up at subject for scale and authority" },
      professionalTerms: ["low angle", "worm's-eye view", "heroic perspective"],
      promptFragment: { zh: "低角度仰拍，摄影机从下方仰视主体，营造高大、权威或戏剧化的视觉效果", en: "low angle shot looking up at the subject, creating a sense of scale, authority, or drama" },
      appliesTo: ["seedance", "generic_video", "veo3"],
      riskHint: { zh: "", en: "" }
    },
    {
      id: "shot_type:high_angle",
      version: "0.1.0",
      label: { zh: "高角度俯拍", en: "High angle" },
      plain: { zh: "从上方俯视场景，展现空间布局", en: "Looking down at the scene to reveal spatial layout" },
      professionalTerms: ["high angle", "bird's-eye", "overhead perspective"],
      promptFragment: { zh: "高角度俯拍，摄影机从上方俯视场景，展现空间布局和整体关系", en: "high angle shot looking down at the scene, revealing spatial layout and overall relationships" },
      appliesTo: ["seedance", "generic_video", "veo3"],
      riskHint: { zh: "", en: "" }
    },
    {
      id: "shot_type:insert_detail",
      version: "0.1.0",
      label: { zh: "插入特写/细节", en: "Insert detail shot" },
      plain: { zh: "插入镜头聚焦关键细节，打断主镜头节奏", en: "Insert shot focusing on a key detail to interrupt main shot rhythm" },
      professionalTerms: ["insert shot", "detail cutaway", "product close-up"],
      promptFragment: { zh: "插入镜头聚焦于关键细节（产品材质、手部动作、文字内容），打断主镜头节奏", en: "insert shot focusing on a key detail (product texture, hand action, text content), interrupting the main shot rhythm" },
      appliesTo: ["seedance", "generic_video", "veo3"],
      riskHint: { zh: "", en: "" }
    },
    {
      id: "shot_type:split_screen",
      version: "0.1.0",
      label: { zh: "分屏/画中画", en: "Split screen" },
      plain: { zh: "画面分为两个区域，同时展示两个视角", en: "Frame split into two regions showing two perspectives" },
      professionalTerms: ["split screen", "picture-in-picture", "dual frame"],
      promptFragment: { zh: "画面分为两个区域，同时展示两个视角或场景，适合对比、对话或产品演示", en: "frame split into two regions showing two perspectives simultaneously, suitable for comparisons, dialogue, or product demos" },
      appliesTo: ["seedance", "generic_video", "veo3"],
      riskHint: { zh: "", en: "" }
    },
    {
      id: "shot_type:profile_side_view",
      version: "0.1.0",
      label: { zh: "侧面/侧脸镜头", en: "Profile side view" },
      plain: { zh: "从侧面拍摄主体，强调轮廓线条", en: "Shot from the side to emphasize silhouette and contour" },
      professionalTerms: ["profile view", "side angle", "contour emphasis"],
      promptFragment: { zh: "侧面构图，主体以正侧面的姿态呈现，轮廓线条清晰", en: "a profile side shot with the subject in full side view, emphasizing clean contour lines" },
      appliesTo: ["seedance", "generic_video", "veo3"],
      riskHint: { zh: "", en: "" }
    }
  ]
};
