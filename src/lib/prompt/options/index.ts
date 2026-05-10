import { registerOptionSet } from "../registry";
import type { OptionItem, OptionSet } from "../types";
import { audioOptions } from "./audio.options";
import { cameraMovementOptions } from "./camera-movement.options";
import { constraintsOptions } from "./constraints.options";
import { formatOptions } from "./format.options";
import { lightingOptions } from "./lighting.options";
import { motionOptions } from "./motion.options";
import { sceneOptions } from "./scene.options";
import { shotTypeOptions } from "./shot-type.options";
import { styleOptions } from "./style.options";
import { subjectOptions } from "./subject.options";
import { textHandlingOptions } from "./text-handling.options";
import { useCaseOptions } from "./use-case.options";

export const optionSets = [
  useCaseOptions,
  subjectOptions,
  sceneOptions,
  shotTypeOptions,
  cameraMovementOptions,
  styleOptions,
  lightingOptions,
  motionOptions,
  constraintsOptions,
  audioOptions,
  formatOptions,
  textHandlingOptions
] satisfies OptionSet[];

for (const set of optionSets) {
  registerOptionSet(set);
}

export const optionSetById = Object.fromEntries(optionSets.map((set) => [set.id, set]));

export function getOptionSet(optionSetId: string): OptionSet {
  const optionSet = optionSetById[optionSetId];
  if (!optionSet) {
    throw new Error(`Unknown option set: ${optionSetId}`);
  }
  return optionSet;
}

export function getOptionById(optionId: string): OptionItem | undefined {
  return optionSets.flatMap((set) => set.options).find((option) => option.id === optionId);
}
