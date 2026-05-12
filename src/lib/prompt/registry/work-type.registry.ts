import type { WorkTypeConfig, WorkTypeId } from "../types";
import { optionSetMap, workTypeMap } from "./state";

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

export function resolveWorkType(id: WorkTypeId): WorkTypeConfig {
  const config = workTypeMap.get(id);
  if (!config) {
    throw new Error(`Unknown work type: ${id}`);
  }
  return config;
}

export function getAllWorkTypes(): WorkTypeConfig[] {
  return [...workTypeMap.values()];
}
