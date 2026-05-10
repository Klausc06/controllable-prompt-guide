import { getAllAdapters, getAllOptionSets, getAllTargets } from "./registry";
import type { OptionSet, TargetToolConfig, WorkTypeConfig } from "./types";

export function validateOptionIdsUnique(optionSets_?: OptionSet[]) {
  const sets = optionSets_ ?? [];
  const seen = new Set<string>();
  const duplicates: string[] = [];

  for (const option of sets.flatMap((set) => set.options)) {
    if (seen.has(option.id)) {
      duplicates.push(option.id);
    }
    seen.add(option.id);
  }

  return duplicates;
}

export function validateWorkTypeConfig(workType: WorkTypeConfig, optionSets_?: OptionSet[]) {
  const errors: string[] = [];
  const sets = optionSets_ ?? [];
  const optionSetIds = new Set(sets.map((set) => set.id));

  for (const question of workType.questions) {
    if (question.required && question.mode !== "free_text" && !question.optionSetId) {
      errors.push(`${question.id}: required choice question needs optionSetId`);
    }

    if (question.optionSetId && !optionSetIds.has(question.optionSetId)) {
      errors.push(`${question.id}: unknown optionSetId ${question.optionSetId}`);
    }

    if (question.mode === "multi" && question.maxSelections && question.minSelections) {
      if (question.minSelections > question.maxSelections) {
        errors.push(`${question.id}: minSelections is greater than maxSelections`);
      }
    }
  }

  return errors;
}

export function validateAdapterCompleteness(): string[] {
  const errors: string[] = [];
  const targets = getAllTargets();
  const adapters = getAllAdapters();

  for (const target of targets) {
    if (!adapters.has(target.id)) {
      errors.push(`${target.id}: no adapter registered`);
    }
  }

  return errors;
}

export function validateOptionTargetRefs(): string[] {
  const errors: string[] = [];
  const targetIds = new Set(getAllTargets().map((t) => t.id));

  for (const set of getAllOptionSets()) {
    for (const option of set.options) {
      for (const ref of option.appliesTo) {
        if (!targetIds.has(ref)) {
          errors.push(
            `Option "${option.id}" in set "${set.id}" references unknown target: ${ref}`
          );
        }
      }
    }
  }

  return errors;
}

export function validateTargetConfig(target: TargetToolConfig) {
  const errors: string[] = [];

  if (target.prefer.length === 0) {
    errors.push(`${target.id}: prefer must not be empty`);
  }

  if (!target.adaptationNote.zh || !target.adaptationNote.en) {
    errors.push(`${target.id}: adaptation note must be localized`);
  }

  return errors;
}
