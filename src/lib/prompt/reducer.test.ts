import { describe, expect, it } from "vitest";
import "@/lib/prompt/init";
import {
  createInitialState,
  promptGuideReducer,
  type PromptGuideAction,
  type PromptGuideState
} from "./reducer";

const defaults = {
  use_case: "gym_opening",
  subject: "local_storefront",
  scene: "bright_commercial_interior",
  motion: "three_beat_story",
  constraints: ["no_ip_or_celebrity", "stable_identity", "readable_text"],
  format: "vertical_10s"
};

function makeState(overrides?: Partial<PromptGuideState>): PromptGuideState {
  return {
    targetToolId: "seedance",
    selections: { ...defaults },
    advancedOpen: false,
    deselectedSafety: new Set<string>(),
    ...overrides
  };
}

describe("promptGuideReducer", () => {
  describe("TARGET_CHANGED", () => {
    it("preserves compatible selections across target switch", () => {
      const state = makeState();
      const action: PromptGuideAction = {
        type: "TARGET_CHANGED",
        from: "seedance",
        to: "generic_video"
      };
      const next = promptGuideReducer(state, action);
      expect(next.targetToolId).toBe("generic_video");
      // Options with appliesTo: ["seedance", "generic_video"] survive
      expect(next.selections.subject).toBe("local_storefront");
      expect(next.selections.format).toBe("vertical_10s");
    });

    it("silently drops options incompatible with new target", () => {
      const state = makeState({
        selections: {
          ...defaults,
          constraints: [
            ...defaults.constraints,
            "avoid_temporal_flicker"  // seedance-only
          ]
        }
      });
      const action: PromptGuideAction = {
        type: "TARGET_CHANGED",
        from: "seedance",
        to: "generic_video"
      };
      const next = promptGuideReducer(state, action);
      expect(next.selections.constraints).not.toContain("avoid_temporal_flicker");
    });

    it("merges new target safetyDefaults, respecting deselectedSafety", () => {
      const state = makeState({
        deselectedSafety: new Set(["readable_text"])
      });
      const action: PromptGuideAction = {
        type: "TARGET_CHANGED",
        from: "generic_video",
        to: "seedance"
      };
      const next = promptGuideReducer(state, action);
      expect(next.selections.constraints).toContain("no_ip_or_celebrity");
      expect(next.selections.constraints).toContain("stable_identity");
      // readable_text was explicitly deselected — should NOT be re-added
      expect(next.selections.constraints).not.toContain("readable_text");
    });
  });

  describe("OPTION_SELECTED", () => {
    it("replaces selection on single-mode question", () => {
      const state = makeState();
      const action: PromptGuideAction = {
        type: "OPTION_SELECTED",
        questionId: "subject",
        optionId: "person"
      };
      const next = promptGuideReducer(state, action);
      expect(next.selections.subject).toBe("person");
    });

    it("adds to multi-mode question, enforcing maxSelections cap", () => {
      const state = makeState({
        selections: {
          ...defaults,
          constraints: ["no_ip_or_celebrity", "stable_identity", "readable_text", "single_focal_subject"]
        }
      });
      const action: PromptGuideAction = {
        type: "OPTION_SELECTED",
        questionId: "constraints",
        optionId: "avoid_temporal_flicker"
      };
      const next = promptGuideReducer(state, action);
      // maxSelections for constraints is 4 — 5th should be silently rejected
      expect(next.selections.constraints).toHaveLength(4);
      expect(next.selections.constraints).not.toContain("avoid_temporal_flicker");
    });
  });

  describe("OPTION_DESELECTED", () => {
    it("tracks deselected safety defaults in deselectedSafety Set", () => {
      const state = makeState();
      const action: PromptGuideAction = {
        type: "OPTION_DESELECTED",
        questionId: "constraints",
        optionId: "readable_text"
      };
      const next = promptGuideReducer(state, action);
      expect(next.deselectedSafety.has("readable_text")).toBe(true);
      expect(next.selections.constraints).not.toContain("readable_text");
    });

    it("removes single-mode selection entirely", () => {
      const state = makeState();
      const action: PromptGuideAction = {
        type: "OPTION_DESELECTED",
        questionId: "subject",
        optionId: "local_storefront"
      };
      const next = promptGuideReducer(state, action);
      expect(next.selections.subject).toBeUndefined();
    });
  });

  describe("TOGGLE_ADVANCED", () => {
    it("toggles advancedOpen", () => {
      const state = makeState();
      const action: PromptGuideAction = { type: "TOGGLE_ADVANCED" };
      expect(promptGuideReducer(state, action).advancedOpen).toBe(true);
      expect(
        promptGuideReducer(
          { ...state, advancedOpen: true },
          action
        ).advancedOpen
      ).toBe(false);
    });
  });
});
