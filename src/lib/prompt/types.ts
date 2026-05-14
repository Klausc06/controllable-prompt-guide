export type WorkTypeId = string;
export type TargetToolId = string;
export type QuestionMode = "single" | "multi" | "free_text";
export type QuestionLevel = "core" | "advanced";

export type PromptLocale = "zh" | "en";

export interface LocalizedText {
  zh: string;
  en: string;
}

export interface OptionItem {
  id: string;
  version: string;
  label: LocalizedText;
  plain: LocalizedText;
  professionalTerms: string[];
  promptFragment: LocalizedText;
  appliesTo: TargetToolId[];
  riskHint?: LocalizedText;
  /** Option IDs this option overrides when both are selected. Data-driven — rules live in catalog, not code. */
  suppresses?: string[];
  /** Consumer-facing vocabulary terms that map to this option. Used for quick-entry tag selection. */
  consumerTerms?: string[];
  /** Inline usage hint displayed as a small badge on option cards. Used for format options to indicate platform/scenario suitability. */
  usageHint?: LocalizedText;
  /** Option IDs in other dimensions that are recommended when this option is selected.
   *  Keys are QuestionId strings (e.g., "subject", "lighting", "shot_type").
   *  Values are arrays of option ID strings (e.g., ["subject:food_drink", "subject:space_environment"]).
   *  Only populated on use_case options (D-07: core visual dimensions only — style, lighting, motion,
   *  scene, subject, shot_type, camera_movement. Excludes: format, audio, text_handling, constraints). */
  suggests?: Record<string, string[]>;
}

export interface QuestionSchema {
  id: string;
  version: string;
  title: LocalizedText;
  helper: LocalizedText;
  mode: QuestionMode;
  level: QuestionLevel;
  required: boolean;
  optionSetId?: string;
  minSelections?: number;
  maxSelections?: number;
  placeholder?: LocalizedText;
}

export interface WorkTypeConfig {
  id: WorkTypeId;
  version: string;
  label: LocalizedText;
  description: LocalizedText;
  questions: QuestionSchema[];
}

export interface TargetToolConfig {
  id: TargetToolId;
  version: string;
  label: LocalizedText;
  description: LocalizedText;
  adaptationNote: LocalizedText;
  prefer: string[];
  suppress: string[];
  safetyDefaults: string[];
  /** Work types this target tool supports. Targets declare their capabilities declaratively — not coupled to adapters. */
  supportedWorkTypes: WorkTypeId[];
  /** Maps questionId → localized template string. "{选项}" is placeholder for option text. */
  templateMap?: Record<string, LocalizedText>;
  /** Three-tier negative prompt protection. Only for image targets.
   *  Renderer appends the selected tier's negative prompt text. */
  negativePrompt?: NegativePromptConfig;
}

export type SelectionValue = string | string[];

export type PromptSelections = Record<string, SelectionValue>;

export interface BriefItem {
  questionId: string;
  title: LocalizedText;
  selectedOptions: OptionItem[];
  freeText?: string;
}

export interface PromptBrief {
  version: string;
  workTypeId: WorkTypeId;
  targetToolId: TargetToolId;
  rawIntent: string;
  items: BriefItem[];
  suppressWarnings?: LocalizedText[];
}

export interface RenderedPrompt {
  version: string;
  targetToolId: TargetToolId;
  zhPrompt: string;
  enPrompt: string;
  brief: PromptBrief;
  adaptationNote: LocalizedText;
  warnings: LocalizedText[];
}

export interface TargetAdapter {
  target: TargetToolConfig;
  render(brief: PromptBrief): RenderedPrompt;
}

/** Three-tier negative prompt protection configuration.
 *  Per D-08/D-09: user-selectable quality protection injected by renderer. */
export type NegativePromptTier = "light" | "medium" | "heavy";

export interface NegativePromptConfig {
  /** Default tier when user hasn't explicitly selected one. Per D-08: medium. */
  default: NegativePromptTier;
  /** Negative prompt text for each tier. Comma-separated natural language keywords. */
  texts: Record<NegativePromptTier, LocalizedText>;
}

export interface OptionSet {
  id: string;
  version: string;
  label: LocalizedText;
  options: OptionItem[];
  /** Category groupings within this option set. Only for sets with >= 12 options.
   *  Each category specifies which option IDs it contains. An option may appear in multiple categories. */
  categories?: { id: string; label: LocalizedText; optionIds: string[] }[];
}
