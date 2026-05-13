import { getAllTargets, resolveTarget, resolveWorkType } from "./registry";
import { getTargetsForOption } from "./registry";
import type { PromptSelections, TargetToolId, WorkTypeId } from "./types";

export interface PromptGuideState {
  workTypeId: WorkTypeId;
  targetToolId: TargetToolId;
  selections: PromptSelections;
  advancedOpen: boolean;
  deselectedSafety: Set<string>;
}

export type PromptGuideAction =
  | { type: "TARGET_CHANGED"; from: TargetToolId; to: TargetToolId }
  | { type: "WORK_TYPE_CHANGED"; from: WorkTypeId; to: WorkTypeId }
  | { type: "OPTION_SELECTED"; questionId: string; optionId: string }
  | { type: "OPTION_DESELECTED"; questionId: string; optionId: string }
  | { type: "TOGGLE_ADVANCED" };

export function createInitialState(
  workTypeId: WorkTypeId,
  targetToolId: TargetToolId,
  defaultSelections: PromptSelections
): PromptGuideState {
  return {
    workTypeId,
    targetToolId,
    selections: defaultSelections,
    advancedOpen: false,
    deselectedSafety: new Set<string>()
  };
}

function selectionArray(value: string | string[] | undefined): string[] {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

export function promptGuideReducer(
  state: PromptGuideState,
  action: PromptGuideAction
): PromptGuideState {
  switch (action.type) {
    case "TARGET_CHANGED": {
      const newTarget = resolveTarget(action.to);
      const newSelections: PromptSelections = {};

      for (const [questionId, value] of Object.entries(state.selections)) {
        const ids = Array.isArray(value) ? value : [value];
        // Keep options compatible with new target AND not explicitly deselected
        const compatible = ids.filter((id) => {
          if (questionId === "raw_intent") return true;
          if (state.deselectedSafety.has(id)) return false;
          const targets = getTargetsForOption(id);
          return targets.length === 0 || targets.includes(action.to);
        });
        if (compatible.length > 0) {
          newSelections[questionId] = Array.isArray(value)
            ? compatible
            : compatible[0];
        }
        // Silently discard if no compatible options remain
      }

      // Merge safetyDefaults (minus deselected)
      const currentConstraints = selectionArray(newSelections.constraints);
      const safetyToAdd = newTarget.safetyDefaults.filter(
        (id) => !state.deselectedSafety.has(id)
      );
      const merged = [...new Set([...currentConstraints, ...safetyToAdd])];
      newSelections.constraints = merged;

      return {
        ...state,
        targetToolId: action.to,
        selections: newSelections
      };
    }

    case "OPTION_SELECTED": {
      const workType = resolveWorkType(state.workTypeId);
      const question = workType.questions.find(
        (q) => q.id === action.questionId
      );
      if (!question) return state;

      if (question.mode === "free_text") {
        return {
          ...state,
          selections: { ...state.selections, [action.questionId]: action.optionId }
        };
      }

      if (question.mode === "single") {
        // Check if re-selecting a previously deselected safety default
        const target = resolveTarget(state.targetToolId);
        const wasDeselected = state.deselectedSafety.has(action.optionId);
        if (wasDeselected && target.safetyDefaults.includes(action.optionId)) {
          const nextDeselected = new Set(state.deselectedSafety);
          nextDeselected.delete(action.optionId);
          return {
            ...state,
            selections: { ...state.selections, [action.questionId]: action.optionId },
            deselectedSafety: nextDeselected
          };
        }
        return {
          ...state,
          selections: { ...state.selections, [action.questionId]: action.optionId }
        };
      }

      if (question.mode === "multi") {
        const current = selectionArray(state.selections[action.questionId]);
        if (current.includes(action.optionId)) return state;
        let next = [...current, action.optionId];
        // Enforce maxSelections cap
        if (question.maxSelections && next.length > question.maxSelections) {
          next = next.slice(0, question.maxSelections);
        }
        // If re-selecting a deselected safety default
        const target = resolveTarget(state.targetToolId);
        let nextDeselected = state.deselectedSafety;
        if (
          question.id === "constraints" &&
          target.safetyDefaults.includes(action.optionId) &&
          state.deselectedSafety.has(action.optionId)
        ) {
          nextDeselected = new Set(state.deselectedSafety);
          nextDeselected.delete(action.optionId);
        }
        return {
          ...state,
          selections: { ...state.selections, [action.questionId]: next },
          deselectedSafety: nextDeselected
        };
      }

      return state;
    }

    case "OPTION_DESELECTED": {
      const workType = resolveWorkType(state.workTypeId);
      const question = workType.questions.find(
        (q) => q.id === action.questionId
      );
      if (!question) return state;

      if (question.mode === "single") {
        const nextSelections = { ...state.selections };
        delete nextSelections[action.questionId];
        return { ...state, selections: nextSelections };
      }

      if (question.mode === "multi") {
        const current = selectionArray(state.selections[action.questionId]);
        const next = current.filter((id) => id !== action.optionId);
        const nextSelections = { ...state.selections };

        if (next.length === 0) {
          delete nextSelections[action.questionId];
        } else {
          nextSelections[action.questionId] = next;
        }

        // Track safety default deselection
        let nextDeselected = state.deselectedSafety;
        if (question.id === "constraints") {
          const target = resolveTarget(state.targetToolId);
          if (target.safetyDefaults.includes(action.optionId)) {
            nextDeselected = new Set([...state.deselectedSafety, action.optionId]);
          }
        }

        return { ...state, selections: nextSelections, deselectedSafety: nextDeselected };
      }

      return state;
    }

    case "WORK_TYPE_CHANGED": {
      const newWorkType = resolveWorkType(action.to);
      const firstCompatible = getAllTargets().find(
        (t) => t.supportedWorkTypes.includes(action.to)
      );
      if (!firstCompatible) {
        // No target supports this work type — leave state unchanged
        return state;
      }
      return {
        ...state,
        workTypeId: action.to,
        targetToolId: firstCompatible.id,
        selections: {},
        advancedOpen: false,
        deselectedSafety: new Set<string>()
      };
    }

    case "TOGGLE_ADVANCED":
      return { ...state, advancedOpen: !state.advancedOpen };

    default:
      return state;
  }
}
