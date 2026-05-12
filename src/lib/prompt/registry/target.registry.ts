import type { TargetToolConfig, TargetToolId } from "../types";
import { targetMap } from "./state";

export function registerTarget(config: TargetToolConfig): void {
  if (targetMap.has(config.id)) {
    throw new Error(`Duplicate target: ${config.id}`);
  }
  targetMap.set(config.id, config);
}

export function resolveTarget(id: TargetToolId): TargetToolConfig {
  const config = targetMap.get(id);
  if (!config) {
    throw new Error(`Unknown target: ${id}`);
  }
  return config;
}

export function getAllTargets(): TargetToolConfig[] {
  return [...targetMap.values()];
}
