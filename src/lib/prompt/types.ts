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
}
