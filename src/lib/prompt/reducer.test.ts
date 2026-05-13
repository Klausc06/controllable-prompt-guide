import { describe, expect, it } from "vitest";
import "@/lib/prompt/init";
import {
  createInitialState,
  promptGuideReducer,
  type PromptGuideAction,
  type PromptGuideState
} from "./reducer";

const defaults = {
  use_case: "use_case:gym_opening",
  subject: "subject:local_storefront",
  scene: "scene:bright_commercial_interior",
  motion: "motion:three_beat_story",
  constraints: ["constraints:no_ip_or_celebrity", "constraints:stable_identity", "constraints:readable_text"],
  format: "format:vertical_10s"
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
      expect(next.selections.subject).toBe("subject:local_storefront");
      expect(next.selections.format).toBe("format:vertical_10s");
    });

    it("silently drops options incompatible with new target", () => {
      const state = makeState({
        selections: {
          ...defaults,
          constraints: [
            ...defaults.constraints,
            "constraints:avoid_temporal_flicker"  // seedance-only
          ]
        }
      });
      const action: PromptGuideAction = {
        type: "TARGET_CHANGED",
        from: "seedance",
        to: "generic_video"
      };
      const next = promptGuideReducer(state, action);
      expect(next.selections.constraints).not.toContain("constraints:avoid_temporal_flicker");
    });

    it("merges new target safetyDefaults, respecting deselectedSafety", () => {
      const state = makeState({
        deselectedSafety: new Set(["constraints:readable_text"])
      });
      const action: PromptGuideAction = {
        type: "TARGET_CHANGED",
        from: "generic_video",
        to: "seedance"
      };
      const next = promptGuideReducer(state, action);
      expect(next.selections.constraints).toContain("constraints:no_ip_or_celebrity");
      expect(next.selections.constraints).toContain("constraints:stable_identity");
      // readable_text was explicitly deselected — should NOT be re-added
      expect(next.selections.constraints).not.toContain("constraints:readable_text");
    });
  });

  describe("OPTION_SELECTED", () => {
    it("adds to multi-mode question (subject now multi)", () => {
      const state = makeState();
      const action: PromptGuideAction = {
        type: "OPTION_SELECTED",
        questionId: "subject",
        optionId: "person"
      };
      const next = promptGuideReducer(state, action);
      expect(next.selections.subject).toEqual(["subject:local_storefront", "person"]);
    });

    it("adds to multi-mode question, enforcing maxSelections cap", () => {
      const state = makeState({
        selections: {
          ...defaults,
          constraints: ["constraints:no_ip_or_celebrity", "constraints:stable_identity", "constraints:readable_text", "constraints:single_focal_subject"]
        }
      });
      const action: PromptGuideAction = {
        type: "OPTION_SELECTED",
        questionId: "constraints",
        optionId: "constraints:avoid_temporal_flicker"
      };
      const next = promptGuideReducer(state, action);
      // maxSelections for constraints is 4 — 5th should be silently rejected
      expect(next.selections.constraints).toHaveLength(4);
      expect(next.selections.constraints).not.toContain("constraints:avoid_temporal_flicker");
    });
  });

  describe("OPTION_DESELECTED", () => {
    it("tracks deselected safety defaults in deselectedSafety Set", () => {
      const state = makeState();
      const action: PromptGuideAction = {
        type: "OPTION_DESELECTED",
        questionId: "constraints",
        optionId: "constraints:readable_text"
      };
      const next = promptGuideReducer(state, action);
      expect(next.deselectedSafety.has("constraints:readable_text")).toBe(true);
      expect(next.selections.constraints).not.toContain("constraints:readable_text");
    });

    it("removes single-mode selection entirely", () => {
      const state = makeState();
      const action: PromptGuideAction = {
        type: "OPTION_DESELECTED",
        questionId: "subject",
        optionId: "subject:local_storefront"
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
