import type { OptionSet } from "../types";

export const textHandlingOptions: OptionSet = {
  id: "text_handling",
  version: "0.1.0",
  label: { zh: "画面文字", en: "On-screen text" },
  options: [
    {
      id: "text_handling:no_text",
      version: "0.1.0",
      label: { zh: "不在画面生成文字", en: "No generated text" },
      plain: { zh: "最稳，后期再加标题和价格", en: "Most reliable; add titles and prices in post" },
      professionalTerms: ["post-production typography", "avoid text artifacts", "clean footage"],
      promptFragment: { zh: "画面中不生成文字，所有标题、价格和活动信息都建议后期添加", en: "do not generate on-screen text; add titles, prices, and campaign information in post-production" },
      appliesTo: ["seedance", "generic_video", "veo3"],
      riskHint: { zh: "部分模型可能在纯画面场景中仍生成意外文字。生成后检查画面是否完全干净，可考虑后期裁剪意外文字区域。", en: "Some models may still generate unexpected text in text-free scenes. Check if the frame is fully clean after generation; consider cropping accidental text areas in post." },
      suppresses: ["text_handling:no_text_pure_visual"]
    },
    {
      id: "text_handling:short_title_only",
      version: "0.1.0",
      label: { zh: "只要短标题", en: "Short title only" },
      plain: { zh: "最多一行，适合开业、新品、活动名", en: "One short line for openings, launches, or campaign names" },
      professionalTerms: ["minimal title card", "single-line text", "legible overlay"],
      promptFragment: { zh: "如需文字，只保留一行短标题，位置清楚、字数少、不要复杂排版", en: "if text is needed, keep only one short title line, clearly placed with minimal typography" },
      appliesTo: ["seedance", "generic_video", "veo3"],
      riskHint: { zh: "生成模型仍可能写错字，重要文字建议后期添加。", en: "Generated text can still be wrong; add critical copy in post." }
    },
    {
      id: "text_handling:placeholder_signage",
      version: "0.1.0",
      label: { zh: "只保留模糊招牌感", en: "Implied signage only" },
      plain: { zh: "有店招氛围，但不要求可读字", en: "Creates signage atmosphere without requiring readable text" },
      professionalTerms: ["implied signage", "non-readable background text", "brand-safe ambience"],
      promptFragment: { zh: "背景可以有模糊招牌或装饰性文字氛围，但不要求任何文字可读", en: "background may include blurred signage or decorative text mood, but no text needs to be readable" },
      appliesTo: ["seedance", "generic_video", "veo3"],
      riskHint: { zh: "模糊招牌可能被模型解读为可识别文字。如需完全避免文字，选择'无文字/纯画面'选项更稳妥。", en: "Blurred signage may be interpreted as readable text by the model. For complete text avoidance, the 'No text, pure visual' option is more reliable." }
    },
    {
      id: "text_handling:bottom_subtitle_bar",
      version: "0.1.0",
      label: { zh: "底部字幕条", en: "Bottom subtitle bar" },
      plain: { zh: "画面底部保留字幕条区域，方便后期加字", en: "Reserve a subtitle bar area at the bottom for post-production text" },
      professionalTerms: ["subtitle safe area", "lower third", "legibility zone"],
      promptFragment: {
        zh: "底部预留字幕条安全区域，确保重要画面元素不遮挡文字位置",
        en: "reserve a subtitle safe zone at the bottom of the frame, keeping visual elements clear of the text area"
      },
      appliesTo: ["seedance", "generic_video", "veo3"],
      riskHint: { zh: "模型可能忽略或错位字幕条区域。生成后确认底部区域是否按预期留空。", en: "Models may ignore or misplace the subtitle bar area. Verify the bottom zone is correctly reserved after generation." }
    },
    {
      id: "text_handling:opening_title_card",
      version: "0.1.0",
      label: { zh: "标题开场大字", en: "Opening title card with large text" },
      plain: { zh: "视频开头用大字标题吸引注意力", en: "Grab attention with a large title at the start of the video" },
      professionalTerms: ["title card", "opening splash", "hero typography"],
      promptFragment: {
        zh: "视频开头设计大字号标题画面，字体醒目、居中或占据主要画面",
        en: "design the opening frame with large title typography, bold and centered or filling the main composition"
      },
      appliesTo: ["seedance", "generic_video", "veo3"],
      riskHint: { zh: "AI 生成文字可能出现错字，重要文案建议后期替换。", en: "AI-generated text may contain errors; replace critical copy in post." }
    },
    {
      id: "text_handling:price_tag_popup",
      version: "0.1.0",
      label: { zh: "价格/标签弹出", en: "Price/tag popup overlay" },
      plain: { zh: "画面内出现价格或标签浮层，适合促销场景", en: "Show price or tag overlays in-frame, ideal for promotional scenes" },
      professionalTerms: ["price popup", "tag overlay", "promotional slug"],
      promptFragment: {
        zh: "画面中包含价格标签或文字弹出效果，信息突出、位置明显",
        en: "include price tags or popup text overlays in the scene, with clear placement and strong visibility"
      },
      appliesTo: ["seedance", "generic_video", "veo3"],
      riskHint: { zh: "AI 生成数字和文字可能不准确，关键价格请后期确认。", en: "AI-generated numbers and text may be inaccurate; verify key prices in post." }
    },
    {
      id: "text_handling:end_card_cta",
      version: "0.1.0",
      label: { zh: "结尾 CTA 按钮文字", en: "End card with CTA text" },
      plain: { zh: "视频结尾出现行动号召文字（关注/购买/预约）", en: "End with a call-to-action text (follow, buy, book)" },
      professionalTerms: ["CTA end card", "call to action", "closing slug"],
      promptFragment: {
        zh: "视频结尾包含行动号召文字，如关注、购买或预约按钮提示",
        en: "include a call-to-action at the end of the video, such as follow, purchase, or booking prompts"
      },
      appliesTo: ["seedance", "generic_video", "veo3"],
      riskHint: { zh: "AI 生成的 CTA 文案和图标可能不准确，建议后期替换为真实按钮。", en: "AI-generated CTA copy and icons may be inaccurate; replace with real buttons in post." }
    },
    {
      id: "text_handling:no_text_pure_visual",
      version: "0.1.0",
      label: { zh: "无文字/纯画面", en: "No text, pure visual" },
      plain: { zh: "画面中完全不出现文字，全靠图像叙事", en: "Zero text on screen — the visuals tell the entire story" },
      professionalTerms: ["visual-only storytelling", "zero typography", "pure imagery"],
      promptFragment: {
        zh: "画面不包含任何文字元素，完全依靠图像构图、光影和动作来传达信息",
        en: "no text elements appear in the frame; rely entirely on composition, lighting, and motion to convey the message"
      },
      appliesTo: ["seedance", "generic_video", "veo3"],
      riskHint: { zh: "视频模型有时仍会在画面中生成意料之外的文字。如出现，建议后期裁切或遮罩处理。", en: "Video models may still hallucinate unexpected text in the frame. If it occurs, crop or mask in post-production." },
      suppresses: ["text_handling:no_text"]
    },
    {
      id: "text_handling:animated_text_reveal",
      version: "0.1.0",
      label: { zh: "动画文字逐字显现", en: "Animated text reveal" },
      plain: { zh: "文字以逐字动画形式出现，带有节奏感和视觉吸引力", en: "Text appears with character-by-character reveal animation" },
      professionalTerms: ["typewriter effect", "character reveal", "animated typography"],
      promptFragment: { zh: "画面文字以逐字动画形式出现，带有节奏感和视觉吸引力", en: "on-screen text appears with a character-by-character reveal animation, creating rhythm and visual interest" },
      appliesTo: ["seedance", "generic_video", "veo3"],
      riskHint: { zh: "AI 生成的逐字动画可能出现文字错位或抖动。重要文案建议后期用专业工具实现动画效果。", en: "AI-generated text reveal animations may have misalignment or jitter. For critical copy, implement animation in professional post-production tools." }
    },
    {
      id: "text_handling:scrolling_credits",
      version: "0.1.0",
      label: { zh: "滚动字幕/片尾", en: "Scrolling credits" },
      plain: { zh: "片尾滚动字幕，适合演职员表或品牌致谢", en: "Scrolling end credits for cast lists or brand acknowledgments" },
      professionalTerms: ["scrolling credits", "credit roll", "end crawl"],
      promptFragment: { zh: "片尾滚动字幕从下往上匀速移动，适合演职员表或品牌致谢", en: "end credits scroll upward at a steady pace, suitable for cast lists or brand acknowledgments" },
      appliesTo: ["seedance", "generic_video", "veo3"],
      riskHint: { zh: "AI 生成的滚动字幕可能出现文字模糊、变形或速度不均。建议后期用剪辑软件添加专业字幕。", en: "AI-generated scrolling credits may appear blurry, distorted, or uneven in speed. Add credits in professional editing software for best results." }
    },
    {
      id: "text_handling:chapter_markers",
      version: "0.1.0",
      label: { zh: "章节标记/转场字幕", en: "Chapter markers" },
      plain: { zh: "在段落之间插入章节标题卡，用于分段叙事", en: "Chapter title cards between sections for segmented storytelling" },
      professionalTerms: ["chapter markers", "section titles", "transition cards"],
      promptFragment: { zh: "在段落之间插入章节标题卡，用于分段叙事和信息组织", en: "insert chapter title cards between sections for segmented storytelling and information organization" },
      appliesTo: ["seedance", "generic_video", "veo3"],
      riskHint: { zh: "AI 生成的标题卡文字可能不准确或排版混乱。章节标记建议后期替换为设计稿。", en: "AI-generated chapter title text may be inaccurate or poorly laid out. Replace chapter markers with designed graphics in post." }
    },
    {
      id: "text_handling:watermark_corner",
      version: "0.1.0",
      label: { zh: "角标/水印文案", en: "Corner watermark" },
      plain: { zh: "画面角落添加品牌水印，持续但不影响主体", en: "Brand watermark in corner, persistent but unobtrusive" },
      professionalTerms: ["corner watermark", "brand bug", "persistent overlay"],
      promptFragment: { zh: "画面角落添加品牌水印或标识文字，持续显示但不影响主体画面", en: "add a brand watermark or logo text in the corner, persistent but unobtrusive to the main composition" },
      appliesTo: ["seedance", "generic_video", "veo3"],
      riskHint: { zh: "AI 生成的水印可能模糊或位置偏移。品牌水印建议后期添加以保证清晰度和定位准确。", en: "AI-generated watermarks may be blurry or mispositioned. Add brand watermarks in post for guaranteed clarity and placement." }
    },
    {
      id: "text_handling:text_on_object",
      version: "0.1.0",
      label: { zh: "文字跟随物体", en: "Text on moving object" },
      plain: { zh: "文字标签跟随画面中物体移动，适合标注", en: "Text labels track a moving object for labeling" },
      professionalTerms: ["object tracking text", "motion-tracked label", "3D text attachment"],
      promptFragment: { zh: "文字标签跟随画面中的物体移动，适合标注产品或人物", en: "text labels track a moving object in the frame, suitable for product or person labeling" },
      appliesTo: ["seedance", "generic_video", "veo3"],
      riskHint: { zh: "文字跟随移动物体的追踪精度有限，可能出现漂移或错位。关键标注建议后期合成。", en: "Text tracking on moving objects has limited precision and may drift or misalign. Composite critical labels in post-production." }
    },
    {
      id: "text_handling:bilingual_subtitles",
      version: "0.1.0",
      label: { zh: "中英双语字幕", en: "Bilingual subtitles" },
      plain: { zh: "画面包含中英双语字幕，适合国际化内容", en: "Bilingual Chinese-English subtitles for international content" },
      professionalTerms: ["bilingual subtitles", "dual-language captions", "CN-EN layout"],
      promptFragment: { zh: "画面包含中英双语字幕，中文在上英文在下，适合国际化内容", en: "frame includes bilingual Chinese-English subtitles, Chinese above English, suitable for international content" },
      appliesTo: ["seedance", "generic_video", "veo3"],
      riskHint: { zh: "AI 生成的 bilingual 字幕可能有错译、语法错误或排版重叠。正式发布前建议人工校对双语内容。", en: "AI-generated bilingual subtitles may contain mistranslations, grammar errors, or layout overlaps. Manually proofread bilingual content before publishing." }
    },
    {
      id: "text_handling:lower_third_overlay",
      version: "0.1.0",
      label: { zh: "底部信息条/人物介绍", en: "Lower third overlay" },
      plain: { zh: "底部信息条显示姓名和身份，常用于采访和教程", en: "Lower third name/title overlay for interviews and tutorials" },
      professionalTerms: ["lower third", "name strap", "title overlay"],
      promptFragment: { zh: "底部信息条显示人物姓名和身份，常用于采访、教程或宣传片", en: "lower third overlay displays name and title, commonly used in interviews, tutorials, or promotional videos" },
      appliesTo: ["seedance", "generic_video", "veo3"],
      riskHint: { zh: "AI 生成的底部信息条文字可能出现错字、排版错位。真实人物姓名和职位建议后期确认替换。", en: "AI-generated lower third text may have typos or layout misalignment. Verify and replace real names and titles in post." }
    }
  ]
};
