import type { LocalizedText } from "../types";

/** Platform-specific format recommendations for quick-entry tags. */
export interface PlatformConfig {
  /** Unique platform identifier */
  id: string;
  /** Display label (zh/en) */
  label: LocalizedText;
  /** Format option IDs recommended for this platform.
   *  Each ID references an option in format.options.ts.
   *  Only formats compatible with the current target tool are applied at runtime. */
  recommendedFormats: string[];
}

/** Domestic Chinese platform format conventions, based on common best practices as of 2026. */
export const platformConfigs: PlatformConfig[] = [
  {
    id: "douyin",
    label: { zh: "抖音", en: "Douyin" },
    recommendedFormats: ["format:vertical_10s", "format:vertical_15s", "format:vertical_5s"]
  },
  {
    id: "rednote",
    label: { zh: "小红书", en: "RedNote" },
    recommendedFormats: ["format:vertical_10s", "format:vertical_15s", "format:portrait_34_8s"]
  },
  {
    id: "bilibili",
    label: { zh: "B站", en: "Bilibili" },
    recommendedFormats: ["format:horizontal_12s", "format:horizontal_30s", "format:horizontal_60s"]
  },
  {
    id: "wechat_channels",
    label: { zh: "视频号", en: "WeChat Channels" },
    recommendedFormats: ["format:vertical_10s", "format:vertical_15s", "format:horizontal_12s"]
  }
];
