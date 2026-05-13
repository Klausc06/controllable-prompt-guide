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
  /** Maps questionId → localized template string. "{选项}" is placeholder for option text. */
  templateMap?: Record<string, LocalizedText>;
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

export interface OptionSet {
  id: string;
  version: string;
  label: LocalizedText;
  options: OptionItem[];
  /** Category groupings within this option set. Only for sets with >= 12 options.
   *  Each category specifies which option IDs it contains. An option may appear in multiple categories. */
  categories?: { id: string; label: LocalizedText; optionIds: string[] }[];
}
