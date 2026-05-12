import type { OptionItem, OptionSet, TargetToolId } from "../types";
import { optionItemMap, optionSetMap } from "./state";

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

export function getAllOptionSets(): OptionSet[] {
  return [...optionSetMap.values()];
}
