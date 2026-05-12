import type { OptionSet } from "../types";

export const formatOptions: OptionSet = {
  id: "format",
  version: "0.1.0",
  label: { zh: "比例和时长", en: "Format" },
  options: [
    {
      id: "format:vertical_10s",
      version: "0.1.0",
      label: { zh: "9:16 竖屏 10 秒", en: "9:16 vertical, 10s" },
      plain: { zh: "适合抖音、小红书、视频号", en: "Good for Douyin, RedNote, and short social feeds" },
      professionalTerms: ["9:16 vertical", "short-form social", "10-second cut"],
      promptFragment: { zh: "9:16 竖屏，约 10 秒，适合短视频平台", en: "9:16 vertical, around 10 seconds, suitable for short-form social platforms" },
      appliesTo: ["seedance", "generic_video"],
      riskHint: { zh: "", en: "" }
    },
    {
      id: "format:vertical_15s",
      version: "0.1.0",
      label: { zh: "9:16 竖屏 15 秒", en: "9:16 vertical, 15s" },
      plain: { zh: "比 10 秒更完整，适合三段式小故事", en: "More complete than 10s, good for a three-beat story" },
      professionalTerms: ["9:16 vertical", "15-second narrative", "social ad"],
      promptFragment: { zh: "9:16 竖屏，约 15 秒，适合三段式短视频叙事", en: "9:16 vertical, around 15 seconds, suitable for a three-beat short video narrative" },
      appliesTo: ["seedance", "generic_video"],
      riskHint: { zh: "", en: "" }
    },
    {
      id: "format:square_8s",
      version: "0.1.0",
      label: { zh: "1:1 方形 8 秒", en: "1:1 square, 8s" },
      plain: { zh: "适合信息流、商品卡片、轻量展示", en: "Good for feeds, product cards, and compact showcases" },
      professionalTerms: ["1:1 square", "feed creative", "compact product shot"],
      promptFragment: { zh: "1:1 方形画幅，约 8 秒，主体居中，适合信息流展示", en: "1:1 square format, around 8 seconds, centered subject for feed placement" },
      appliesTo: ["seedance", "generic_video"],
      riskHint: { zh: "", en: "" }
    },
    {
      id: "format:horizontal_12s",
      version: "0.1.0",
      label: { zh: "16:9 横屏 12 秒", en: "16:9 horizontal, 12s" },
      plain: { zh: "适合官网、展会屏幕、横版广告", en: "Good for websites, event screens, and horizontal ads" },
      professionalTerms: ["16:9 horizontal", "wide composition", "brand film cut"],
      promptFragment: { zh: "16:9 横屏，约 12 秒，画面留出横向空间，适合官网或展示屏", en: "16:9 horizontal, around 12 seconds, with wide composition for websites or display screens" },
      appliesTo: ["seedance", "generic_video"],
      riskHint: { zh: "", en: "" }
    },
    {
      id: "format:square_15s",
      version: "0.1.0",
      label: { zh: "1:1 方形 15 秒", en: "1:1 square, 15s" },
      plain: { zh: "适合需要更多叙事时间的方形信息流内容", en: "Good for square feed content that needs more storytelling time" },
      professionalTerms: ["1:1 square", "15-second narrative", "social feed"],
      promptFragment: { zh: "1:1 方形画幅，约 15 秒", en: "1:1 square format, around 15 seconds" },
      appliesTo: ["seedance", "generic_video", "veo3"],
      riskHint: { zh: "", en: "" }
    },
    {
      id: "format:horizontal_30s",
      version: "0.1.0",
      label: { zh: "16:9 横屏 30 秒", en: "16:9 horizontal, 30s" },
      plain: { zh: "横屏长版，适合官网品牌片、展会循环播放", en: "Horizontal long-form for website brand films and exhibition loops" },
      professionalTerms: ["16:9 horizontal", "30-second brand film", "widescreen"],
      promptFragment: { zh: "16:9 横屏，约 30 秒，适合官网品牌片和展会循环播放", en: "16:9 horizontal, around 30 seconds, suitable for website brand films and exhibition loops" },
      appliesTo: ["seedance", "generic_video", "veo3"],
      riskHint: { zh: "", en: "" }
    },
    {
      id: "format:horizontal_60s",
      version: "0.1.0",
      label: { zh: "16:9 横屏 60 秒", en: "16:9 horizontal, 60s" },
      plain: { zh: "横屏 1 分钟，适合完整品牌故事或教程", en: "Horizontal 1-minute for complete brand stories or tutorials" },
      professionalTerms: ["16:9 horizontal", "60-second narrative", "brand story"],
      promptFragment: { zh: "16:9 横屏，约 60 秒，用于完整品牌故事或教程", en: "16:9 horizontal, around 60 seconds, for complete brand stories or tutorials" },
      appliesTo: ["seedance", "generic_video", "veo3"],
      riskHint: { zh: "", en: "" }
    },
    {
      id: "format:vertical_3s",
      version: "0.1.0",
      label: { zh: "9:16 竖屏 3 秒", en: "9:16 vertical, 3s" },
      plain: { zh: "超短竖屏，适合快闪/动态海报", en: "Ultra-short vertical for flash cuts and motion posters" },
      professionalTerms: ["9:16 vertical", "3-second flash", "motion poster"],
      promptFragment: { zh: "9:16 竖屏，约 3 秒，用于快闪和动态海报", en: "9:16 vertical, around 3 seconds, for flash cuts and motion posters" },
      appliesTo: ["seedance", "generic_video", "veo3"],
      riskHint: { zh: "", en: "" }
    },
    {
      id: "format:vertical_5s",
      version: "0.1.0",
      label: { zh: "9:16 竖屏 5 秒", en: "9:16 vertical, 5s" },
      plain: { zh: "竖屏 5 秒，适合产品快速展示", en: "Vertical 5-second for quick product showcases" },
      professionalTerms: ["9:16 vertical", "5-second product shot", "quick showcase"],
      promptFragment: { zh: "9:16 竖屏，约 5 秒，用于产品快速展示", en: "9:16 vertical, around 5 seconds, for quick product showcases" },
      appliesTo: ["seedance", "generic_video", "veo3"],
      riskHint: { zh: "", en: "" }
    },
    {
      id: "format:vertical_30s",
      version: "0.1.0",
      label: { zh: "9:16 竖屏 30 秒", en: "9:16 vertical, 30s" },
      plain: { zh: "竖屏长版，适合教程、开箱、探店", en: "Vertical long-form for tutorials, unboxings, and shop tours" },
      professionalTerms: ["9:16 vertical", "30-second content", "long-form social"],
      promptFragment: { zh: "9:16 竖屏，约 30 秒，适合教程、开箱和探店内容", en: "9:16 vertical, around 30 seconds, suitable for tutorials, unboxings, and shop tours" },
      appliesTo: ["seedance", "generic_video", "veo3"],
      riskHint: { zh: "", en: "" }
    },
    {
      id: "format:vertical_60s",
      version: "0.1.0",
      label: { zh: "9:16 竖屏 60 秒", en: "9:16 vertical, 60s" },
      plain: { zh: "竖屏 1 分钟，适合完整短视频叙事", en: "Vertical 1-minute for complete short-form storytelling" },
      professionalTerms: ["9:16 vertical", "60-second narrative", "full story"],
      promptFragment: { zh: "9:16 竖屏，约 60 秒，用于完整短视频叙事", en: "9:16 vertical, around 60 seconds, for complete short-form storytelling" },
      appliesTo: ["seedance", "generic_video", "veo3"],
      riskHint: { zh: "", en: "" }
    },
    {
      id: "format:wide_219_15s",
      version: "0.1.0",
      label: { zh: "21:9 超宽 15 秒", en: "21:9 ultra-wide, 15s" },
      plain: { zh: "超宽画幅，电影感，适合横版开屏", en: "Ultra-wide cinematic format for cinematic opening sequences" },
      professionalTerms: ["21:9 ultrawide", "cinemascope", "15-second cut"],
      promptFragment: { zh: "21:9 超宽电影画幅，约 15 秒，适合电影感开场", en: "21:9 ultrawide cinematic format, around 15 seconds, for cinematic opening sequences" },
      appliesTo: ["seedance", "generic_video", "veo3"],
      riskHint: { zh: "超宽画幅在部分视频模型中可能出现画面裁切异常或构图偏移。生成后确认画面完整性。", en: "Ultrawide formats may cause unexpected cropping or composition shifts in some video models. Verify frame integrity after generation." }
    },
    {
      id: "format:portrait_34_8s",
      version: "0.1.0",
      label: { zh: "3:4 竖版 8 秒", en: "3:4 portrait, 8s" },
      plain: { zh: "竖版略宽，适合小红书信息流", en: "Slightly wider portrait optimized for social media feeds" },
      professionalTerms: ["3:4 portrait", "social-optimized", "8-second feed"],
      promptFragment: { zh: "3:4 竖版画幅，约 8 秒，适合社交媒体信息流", en: "3:4 portrait format, around 8 seconds, optimized for social media feeds" },
      appliesTo: ["seedance", "generic_video", "veo3"],
      riskHint: { zh: "", en: "" }
    },
    {
      id: "format:portrait_45_10s",
      version: "0.1.0",
      label: { zh: "4:5 竖版 10 秒", en: "4:5 portrait, 10s" },
      plain: { zh: "微竖版，适合商品详情页视频", en: "Slightly vertical for product detail page videos" },
      professionalTerms: ["4:5 portrait", "product detail", "10-second showcase"],
      promptFragment: { zh: "4:5 竖版画幅，约 10 秒，适合商品详情页视频", en: "4:5 portrait format, around 10 seconds, suitable for product detail page videos" },
      appliesTo: ["seedance", "generic_video", "veo3"],
      riskHint: { zh: "", en: "" }
    },
    {
      id: "format:square_30s",
      version: "0.1.0",
      label: { zh: "1:1 方形 30 秒", en: "1:1 square, 30s" },
      plain: { zh: "方形长版，适合 IG/多平台通用信息流", en: "Long square format for IG and cross-platform feeds" },
      professionalTerms: ["1:1 square", "30-second feed", "cross-platform"],
      promptFragment: { zh: "1:1 方形画幅，约 30 秒，适合跨平台信息流内容", en: "1:1 square format, around 30 seconds, for cross-platform feed content" },
      appliesTo: ["seedance", "generic_video", "veo3"],
      riskHint: { zh: "", en: "" }
    }
  ]
};
