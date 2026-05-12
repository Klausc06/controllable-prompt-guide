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
      appliesTo: ["seedance", "generic_video"]
    },
    {
      id: "format:vertical_15s",
      version: "0.1.0",
      label: { zh: "9:16 竖屏 15 秒", en: "9:16 vertical, 15s" },
      plain: { zh: "比 10 秒更完整，适合三段式小故事", en: "More complete than 10s, good for a three-beat story" },
      professionalTerms: ["9:16 vertical", "15-second narrative", "social ad"],
      promptFragment: { zh: "9:16 竖屏，约 15 秒，适合三段式短视频叙事", en: "9:16 vertical, around 15 seconds, suitable for a three-beat short video narrative" },
      appliesTo: ["seedance", "generic_video"]
    },
    {
      id: "format:square_8s",
      version: "0.1.0",
      label: { zh: "1:1 方形 8 秒", en: "1:1 square, 8s" },
      plain: { zh: "适合信息流、商品卡片、轻量展示", en: "Good for feeds, product cards, and compact showcases" },
      professionalTerms: ["1:1 square", "feed creative", "compact product shot"],
      promptFragment: { zh: "1:1 方形画幅，约 8 秒，主体居中，适合信息流展示", en: "1:1 square format, around 8 seconds, centered subject for feed placement" },
      appliesTo: ["seedance", "generic_video"]
    },
    {
      id: "format:horizontal_12s",
      version: "0.1.0",
      label: { zh: "16:9 横屏 12 秒", en: "16:9 horizontal, 12s" },
      plain: { zh: "适合官网、展会屏幕、横版广告", en: "Good for websites, event screens, and horizontal ads" },
      professionalTerms: ["16:9 horizontal", "wide composition", "brand film cut"],
      promptFragment: { zh: "16:9 横屏，约 12 秒，画面留出横向空间，适合官网或展示屏", en: "16:9 horizontal, around 12 seconds, with wide composition for websites or display screens" },
      appliesTo: ["seedance", "generic_video"]
    }
  ]
};
