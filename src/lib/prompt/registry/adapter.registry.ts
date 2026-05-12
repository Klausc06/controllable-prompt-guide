import type { TargetAdapter, TargetToolId } from "../types";
import { adapterMap } from "./state";

export function registerAdapter(
  targetId: TargetToolId,
  adapter: TargetAdapter
): void {
  if (adapterMap.has(targetId)) {
    throw new Error(`Duplicate adapter for target: ${targetId}`);
  }
  adapterMap.set(targetId, adapter);
}

export function resolveAdapter(id: TargetToolId): TargetAdapter {
  const adapter = adapterMap.get(id);
  if (!adapter) {
    throw new Error(`No adapter registered for target: ${id}`);
  }
  return adapter;
}

export function getAllAdapters(): Map<TargetToolId, TargetAdapter> {
  return new Map(adapterMap);
}
