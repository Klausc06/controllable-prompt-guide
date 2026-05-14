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
    workTypeId: "video_prompt",
    targetToolId: "seedance",
    selections: { ...defaults },
    advancedOpen: false,
    deselectedSafety: new Set<string>(),
    negPromptTier: "medium",
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

  describe("WORK_TYPE_CHANGED", () => {
    it("clears all selections and resets deselectedSafety", () => {
      const state = makeState({
        deselectedSafety: new Set(["constraints:readable_text"])
      });
      const action: PromptGuideAction = {
        type: "WORK_TYPE_CHANGED",
        from: "video_prompt",
        to: "video_prompt"
      };
      const next = promptGuideReducer(state, action);
      // Selections cleared
      expect(next.selections).toEqual({});
      // deselectedSafety reset
      expect(next.deselectedSafety.size).toBe(0);
      // workTypeId updated
      expect(next.workTypeId).toBe("video_prompt");
    });

    it("picks the first compatible target for the new work type", () => {
      const state = makeState();
      // Switch to video_prompt (stays on first target — seedance)
      const action: PromptGuideAction = {
        type: "WORK_TYPE_CHANGED",
        from: "video_prompt",
        to: "video_prompt"
      };
      const next = promptGuideReducer(state, action);
      // seedance is the first target with supportedWorkTypes: ["video_prompt"]
      expect(next.targetToolId).toBe("seedance");
    });

    it("resets advancedOpen to false", () => {
      const state = makeState({ advancedOpen: true });
      const action: PromptGuideAction = {
        type: "WORK_TYPE_CHANGED",
        from: "video_prompt",
        to: "video_prompt"
      };
      const next = promptGuideReducer(state, action);
      expect(next.advancedOpen).toBe(false);
    });

    it("throws for unknown work type", () => {
      const state = makeState();
      const action: PromptGuideAction = {
        type: "WORK_TYPE_CHANGED",
        from: "video_prompt",
        to: "nonexistent_work_type"
      };
      expect(() => promptGuideReducer(state, action)).toThrow("Unknown work type");
    });

    it("preserves workTypeId in returned state", () => {
      const state = makeState();
      const action: PromptGuideAction = {
        type: "WORK_TYPE_CHANGED",
        from: "video_prompt",
        to: "video_prompt"
      };
      const next = promptGuideReducer(state, action);
      expect(next.workTypeId).toBe("video_prompt");
    });
  });

  describe("WORK_TYPE_CHANGED — cross work type transitions", () => {
    it("video_prompt → image_prompt: clears all selections", () => {
      const state = makeState();
      const action: PromptGuideAction = {
        type: "WORK_TYPE_CHANGED",
        from: "video_prompt",
        to: "image_prompt"
      };
      const next = promptGuideReducer(state, action);
      expect(next.selections).toEqual({});
    });

    it("video_prompt → image_prompt: resets deselectedSafety", () => {
      const state = makeState({
        deselectedSafety: new Set(["constraints:readable_text"])
      });
      const action: PromptGuideAction = {
        type: "WORK_TYPE_CHANGED",
        from: "video_prompt",
        to: "image_prompt"
      };
      const next = promptGuideReducer(state, action);
      expect(next.deselectedSafety.size).toBe(0);
    });

    it("video_prompt → image_prompt: picks generic_image as target", () => {
      const state = makeState({ targetToolId: "seedance" });
      const action: PromptGuideAction = {
        type: "WORK_TYPE_CHANGED",
        from: "video_prompt",
        to: "image_prompt"
      };
      const next = promptGuideReducer(state, action);
      expect(next.targetToolId).toBe("generic_image");
    });

    it("video_prompt → image_prompt: resets advancedOpen to false", () => {
      const state = makeState({ advancedOpen: true });
      const action: PromptGuideAction = {
        type: "WORK_TYPE_CHANGED",
        from: "video_prompt",
        to: "image_prompt"
      };
      const next = promptGuideReducer(state, action);
      expect(next.advancedOpen).toBe(false);
    });

    it("video_prompt → image_prompt: updates workTypeId", () => {
      const state = makeState();
      const action: PromptGuideAction = {
        type: "WORK_TYPE_CHANGED",
        from: "video_prompt",
        to: "image_prompt"
      };
      const next = promptGuideReducer(state, action);
      expect(next.workTypeId).toBe("image_prompt");
    });

    it("image_prompt → video_prompt: clears selections and picks first video target", () => {
      const state = makeState({
        workTypeId: "image_prompt",
        targetToolId: "generic_image",
        selections: {
          use_case: "image_use_case:social_media_post",
          subject: "image_subject:hero_product",
          constraints: ["image_constraints:no_bad_anatomy"]
        }
      });
      const action: PromptGuideAction = {
        type: "WORK_TYPE_CHANGED",
        from: "image_prompt",
        to: "video_prompt"
      };
      const next = promptGuideReducer(state, action);
      expect(next.selections).toEqual({});
      expect(next.targetToolId).toBe("seedance");
    });

    it("image_prompt → video_prompt: resets advancedOpen", () => {
      const state = makeState({
        workTypeId: "image_prompt",
        targetToolId: "generic_image",
        advancedOpen: true
      });
      const action: PromptGuideAction = {
        type: "WORK_TYPE_CHANGED",
        from: "image_prompt",
        to: "video_prompt"
      };
      const next = promptGuideReducer(state, action);
      expect(next.advancedOpen).toBe(false);
    });

    it("image_prompt → video_prompt: workTypeId updated correctly", () => {
      const state = makeState({
        workTypeId: "image_prompt",
        targetToolId: "generic_image"
      });
      const action: PromptGuideAction = {
        type: "WORK_TYPE_CHANGED",
        from: "image_prompt",
        to: "video_prompt"
      };
      const next = promptGuideReducer(state, action);
      expect(next.workTypeId).toBe("video_prompt");
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

  describe("SET_NEG_PROMPT_TIER", () => {
    it("changes negPromptTier from medium to light", () => {
      const state = makeState();
      expect(state.negPromptTier).toBe("medium");
      const next = promptGuideReducer(state, { type: "SET_NEG_PROMPT_TIER", tier: "light" });
      expect(next.negPromptTier).toBe("light");
    });

    it("changes negPromptTier to heavy", () => {
      const state = makeState();
      const next = promptGuideReducer(state, { type: "SET_NEG_PROMPT_TIER", tier: "heavy" });
      expect(next.negPromptTier).toBe("heavy");
    });

    it("WORK_TYPE_CHANGED resets negPromptTier to medium", () => {
      const state = makeState({ negPromptTier: "light" });
      const action: PromptGuideAction = { type: "WORK_TYPE_CHANGED", from: "video_prompt", to: "video_prompt" };
      const next = promptGuideReducer(state, action);
      expect(next.negPromptTier).toBe("medium");
    });

    it("createInitialState initializes negPromptTier to medium", () => {
      const state = createInitialState("video_prompt", "seedance", { ...defaults });
      expect(state.negPromptTier).toBe("medium");
    });
  });
});
