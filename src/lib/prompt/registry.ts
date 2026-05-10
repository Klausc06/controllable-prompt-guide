import type {
  OptionItem,
  OptionSet,
  TargetAdapter,
  TargetToolConfig,
  TargetToolId,
  WorkTypeConfig,
  WorkTypeId
} from "./types";

export type { TargetToolId, WorkTypeId };

const workTypeMap = new Map<WorkTypeId, WorkTypeConfig>();
const targetMap = new Map<TargetToolId, TargetToolConfig>();
const adapterMap = new Map<TargetToolId, TargetAdapter>();
const optionSetMap = new Map<string, OptionSet>();
const optionItemMap = new Map<string, OptionItem>();

export function registerWorkType(config: WorkTypeConfig): void {
  if (workTypeMap.has(config.id)) {
    throw new Error(`Duplicate work type: ${config.id}`);
  }
  const questionIds = new Set<string>();
  const optionSetIdsInRegistry = new Set(optionSetMap.keys());
  for (const question of config.questions) {
    if (questionIds.has(question.id)) {
      throw new Error(
        `Duplicate question ID "${question.id}" in work type "${config.id}"`
      );
    }
    questionIds.add(question.id);
    if (
      question.optionSetId &&
      optionSetMap.size > 0 &&
      !optionSetIdsInRegistry.has(question.optionSetId)
    ) {
      throw new Error(
        `Question "${question.id}" in work type "${config.id}" references unknown optionSet: ${question.optionSetId}`
      );
    }
    if (
      question.mode === "multi" &&
      question.minSelections &&
      question.maxSelections &&
      question.minSelections > question.maxSelections
    ) {
      throw new Error(
        `${question.id}: minSelections is greater than maxSelections`
      );
    }
  }
  workTypeMap.set(config.id, config);
}

export function registerTarget(config: TargetToolConfig): void {
  if (targetMap.has(config.id)) {
    throw new Error(`Duplicate target: ${config.id}`);
  }
  targetMap.set(config.id, config);
}

export function registerAdapter(
  targetId: TargetToolId,
  adapter: TargetAdapter
): void {
  if (adapterMap.has(targetId)) {
    throw new Error(`Duplicate adapter for target: ${targetId}`);
  }
  adapterMap.set(targetId, adapter);
}

export function registerOptionSet(set: OptionSet): void {
  if (optionSetMap.has(set.id)) {
    throw new Error(`Duplicate option set: ${set.id}`);
  }
  for (const option of set.options) {
    if (optionItemMap.has(option.id)) {
      throw new Error(
        `Duplicate option ID "${option.id}" in set "${set.id}" conflicts with existing option`
      );
    }
    optionItemMap.set(option.id, option);
  }
  optionSetMap.set(set.id, set);
}

export function resolveWorkType(id: WorkTypeId): WorkTypeConfig {
  const config = workTypeMap.get(id);
  if (!config) {
    throw new Error(`Unknown work type: ${id}`);
  }
  return config;
}

export function resolveTarget(id: TargetToolId): TargetToolConfig {
  const config = targetMap.get(id);
  if (!config) {
    throw new Error(`Unknown target: ${id}`);
  }
  return config;
}

export function resolveAdapter(id: TargetToolId): TargetAdapter {
  const adapter = adapterMap.get(id);
  if (!adapter) {
    throw new Error(`No adapter registered for target: ${id}`);
  }
  return adapter;
}

export function getOptionById(id: string): OptionItem | undefined {
  return optionItemMap.get(id);
}

export function getOptionSet(id: string): OptionSet {
  const set = optionSetMap.get(id);
  if (!set) {
    throw new Error(`Unknown option set: ${id}`);
  }
  return set;
}

export function getOptionsForTarget(
  optionSetId: string,
  targetId: TargetToolId
): OptionItem[] {
  const set = optionSetMap.get(optionSetId);
  if (!set) {
    return [];
  }
  return set.options.filter((option) => option.appliesTo.includes(targetId));
}

export function getAllWorkTypes(): WorkTypeConfig[] {
  return [...workTypeMap.values()];
}

export function getAllTargets(): TargetToolConfig[] {
  return [...targetMap.values()];
}

export function getAllOptionSets(): OptionSet[] {
  return [...optionSetMap.values()];
}

export function getAllAdapters(): Map<TargetToolId, TargetAdapter> {
  return new Map(adapterMap);
}
