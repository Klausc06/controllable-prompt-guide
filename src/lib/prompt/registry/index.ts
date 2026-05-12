export type { TargetToolId, WorkTypeId } from "./state";

export { registerWorkType, resolveWorkType, getAllWorkTypes } from "./work-type.registry";
export { registerTarget, resolveTarget, getAllTargets } from "./target.registry";
export { registerAdapter, resolveAdapter, getAllAdapters } from "./adapter.registry";
export {
  registerOptionSet,
  getOptionById,
  getOptionSet,
  getOptionsForTarget,
  getTargetsForOption,
  getOptionsByConsumerTerm,
  getAllOptionSets
} from "./option.registry";
