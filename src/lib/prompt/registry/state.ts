import type {
  OptionItem,
  OptionSet,
  TargetAdapter,
  TargetToolConfig,
  TargetToolId,
  WorkTypeConfig,
  WorkTypeId
} from "../types";

export type { TargetToolId, WorkTypeId };

export const workTypeMap = new Map<WorkTypeId, WorkTypeConfig>();
export const targetMap = new Map<TargetToolId, TargetToolConfig>();
export const adapterMap = new Map<TargetToolId, TargetAdapter>();
export const optionSetMap = new Map<string, OptionSet>();
export const optionItemMap = new Map<string, OptionItem>();

/** Reverse index: optionId → Set of TargetToolId values that option supports (D-05). */
export const targetsByOption = new Map<string, Set<string>>();
