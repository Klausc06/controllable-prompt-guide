import { registerTarget } from "../registry";
import type { TargetToolConfig, TargetToolId } from "../types";
import { genericVideoTarget } from "./generic-video.target";
import { seedanceTarget } from "./seedance.target";
import { veo3Target } from "./veo3.target";

export const targetTools = [seedanceTarget, genericVideoTarget, veo3Target] satisfies TargetToolConfig[];

for (const target of targetTools) {
  registerTarget(target);
}

export function getTargetTool(targetToolId: TargetToolId): TargetToolConfig {
  const target = targetTools.find((tool) => tool.id === targetToolId);
  if (!target) {
    throw new Error(`Unknown target tool: ${targetToolId}`);
  }
  return target;
}
