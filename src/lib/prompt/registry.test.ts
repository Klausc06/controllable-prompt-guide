import { describe, expect, it } from "vitest";
import {
  getAllAdapters,
  getAllOptionSets,
  getAllTargets,
  getAllWorkTypes,
  getOptionById,
  getOptionsByConsumerTerm,
  getOptionsForTarget,
  getOptionSet,
  registerAdapter,
  registerOptionSet,
  registerTarget,
  getTargetsForOption,
  registerWorkType,
  resolveAdapter,
  resolveTarget,
  resolveWorkType
} from "./registry";
import type {
  OptionItem,
  OptionSet,
  PromptBrief,
  RenderedPrompt,
  TargetAdapter,
  TargetToolConfig,
  WorkTypeConfig
} from "./types";

const testWorkType: WorkTypeConfig = {
  id: "test_wt",
  version: "0.1.0",
  label: { zh: "测试", en: "Test" },
  description: { zh: "测试工作类型", en: "Test work type" },
  questions: [
    {
      id: "q1",
      version: "0.1.0",
      title: { zh: "问题1", en: "Q1" },
      helper: { zh: "", en: "" },
      mode: "single",
      level: "core",
      required: true,
      optionSetId: "test_set"
    },
    {
      id: "q2",
      version: "0.1.0",
      title: { zh: "问题2", en: "Q2" },
      helper: { zh: "", en: "" },
      mode: "multi",
      level: "core",
      required: false,
      optionSetId: "test_set",
      minSelections: 1,
      maxSelections: 3
    }
  ]
};

const testTarget: TargetToolConfig = {
  id: "test_target",
  version: "0.1.0",
  label: { zh: "测试目标", en: "Test Target" },
  description: { zh: "测试", en: "Test" },
  adaptationNote: { zh: "测试适配说明", en: "Test adaptation note" },
  prefer: [],
  suppress: [],
  safetyDefaults: [],
  supportedWorkTypes: ["video_prompt"]
};

const testAdapter: TargetAdapter = {
  target: testTarget,
  render(_brief: PromptBrief): RenderedPrompt {
    return {
      version: "0.1.0",
      targetToolId: testTarget.id,
      zhPrompt: "",
      enPrompt: "",
      brief: _brief,
      adaptationNote: testTarget.adaptationNote,
      warnings: []
    };
  }
};

const testSetA: OptionSet = {
  id: "test_set_a",
  version: "0.1.0",
  label: { zh: "测试集A", en: "Test Set A" },
  options: [
    {
      id: "opt_a1",
      version: "0.1.0",
      label: { zh: "选项A1", en: "Option A1" },
      plain: { zh: "", en: "" },
      professionalTerms: [],
      promptFragment: { zh: "", en: "" },
      appliesTo: ["seedance"]
    },
    {
      id: "opt_a2",
      version: "0.1.0",
      label: { zh: "选项A2", en: "Option A2" },
      plain: { zh: "", en: "" },
      professionalTerms: [],
      promptFragment: { zh: "", en: "" },
      appliesTo: ["seedance", "generic_video"]
    }
  ]
};

const testSetB: OptionSet = {
  id: "test_set_b",
  version: "0.1.0",
  label: { zh: "测试集B", en: "Test Set B" },
  options: [
    {
      id: "opt_b1",
      version: "0.1.0",
      label: { zh: "选项B1", en: "Option B1" },
      plain: { zh: "", en: "" },
      professionalTerms: [],
      promptFragment: { zh: "", en: "" },
      appliesTo: ["generic_video"]
    }
  ]
};

describe("registry", () => {
  describe("work type registration", () => {
    // Register prerequisite option set before testing work types
    registerOptionSet({
      id: "test_set",
      version: "0.1.0",
      label: { zh: "测试集", en: "Test Set" },
      options: []
    });

    it("registers and resolves a work type", () => {
      registerWorkType(testWorkType);
      const resolved = resolveWorkType("test_wt");
      expect(resolved.id).toBe("test_wt");
      expect(resolved.questions).toHaveLength(2);
      expect(getAllWorkTypes().some((w) => w.id === "test_wt")).toBe(true);
    });

    it("throws on duplicate work type ID", () => {
      expect(() => registerWorkType(testWorkType)).toThrow(
        "Duplicate work type: test_wt"
      );
    });

    it("throws on unknown work type ID", () => {
      expect(() => resolveWorkType("no_such_wt")).toThrow(
        "Unknown work type: no_such_wt"
      );
    });

    it("throws on duplicate question IDs within work type", () => {
      const dupQuestions: WorkTypeConfig = {
        id: "dup_q",
        version: "0.1.0",
        label: { zh: "", en: "" },
        description: { zh: "", en: "" },
        questions: [
          {
            id: "same_q",
            version: "0.1.0",
            title: { zh: "A", en: "A" },
            helper: { zh: "", en: "" },
            mode: "single",
            level: "core",
            required: false
          },
          {
            id: "same_q",
            version: "0.1.0",
            title: { zh: "B", en: "B" },
            helper: { zh: "", en: "" },
            mode: "single",
            level: "core",
            required: false
          }
        ]
      };
      expect(() => registerWorkType(dupQuestions)).toThrow(
        'Duplicate question ID "same_q"'
      );
    });

    it("validates minSelections <= maxSelections", () => {
      const bad: WorkTypeConfig = {
        id: "bad_minmax",
        version: "0.1.0",
        label: { zh: "", en: "" },
        description: { zh: "", en: "" },
        questions: [
          {
            id: "q",
            version: "0.1.0",
            title: { zh: "Q", en: "Q" },
            helper: { zh: "", en: "" },
            mode: "multi",
            level: "core",
            required: false,
            minSelections: 5,
            maxSelections: 3
          }
        ]
      };
      expect(() => registerWorkType(bad)).toThrow(
        "minSelections is greater than maxSelections"
      );
    });

    it("throws on unknown optionSetId reference when options are registered (TEST-03)", () => {
      const badWorkType: WorkTypeConfig = {
        id: "bad_optset_ref",
        version: "0.1.0",
        label: { en: "Bad Refs", zh: "坏引用" },
        description: { en: "", zh: "" },
        questions: [
          {
            id: "bad_q",
            version: "0.1.0",
            title: { en: "Bad", zh: "坏" },
            helper: { en: "", zh: "" },
            mode: "single",
            level: "core",
            required: false,
            optionSetId: "nonexistent_set"
          }
        ]
      };
      expect(() => registerWorkType(badWorkType)).toThrow("unknown optionSet");
    });
  });

  describe("target registration", () => {
    it("registers and resolves a target", () => {
      registerTarget(testTarget);
      const resolved = resolveTarget("test_target");
      expect(resolved.id).toBe("test_target");
      expect(getAllTargets().some((t) => t.id === "test_target")).toBe(true);
    });

    it("throws on duplicate target ID", () => {
      expect(() => registerTarget(testTarget)).toThrow(
        "Duplicate target: test_target"
      );
    });

    it("throws on unknown target ID", () => {
      expect(() => resolveTarget("no_such_target")).toThrow(
        "Unknown target: no_such_target"
      );
    });
  });

  describe("adapter registration", () => {
    it("registers and resolves an adapter", () => {
      registerAdapter("test_target", testAdapter);
      const resolved = resolveAdapter("test_target");
      expect(resolved.target.id).toBe("test_target");
      expect(getAllAdapters().has("test_target")).toBe(true);
    });

    it("throws on duplicate adapter", () => {
      expect(() => registerAdapter("test_target", testAdapter)).toThrow(
        "Duplicate adapter for target: test_target"
      );
    });

    it("throws on unregistered target adapter", () => {
      expect(() => resolveAdapter("no_adapter")).toThrow(
        "No adapter registered for target: no_adapter"
      );
    });
  });

  describe("option set registration", () => {
    it("registers option set and indexes option items", () => {
      registerOptionSet(testSetA);
      const opt = getOptionById("opt_a1");
      expect(opt).toBeDefined();
      expect(opt!.id).toBe("opt_a1");
    });

    it("returns undefined for unknown option ID", () => {
      expect(getOptionById("no_such_option")).toBeUndefined();
    });

    it("throws on duplicate option set ID", () => {
      expect(() => registerOptionSet(testSetA)).toThrow(
        "Duplicate option set: test_set_a"
      );
    });

    it("throws on duplicate option ID across different sets", () => {
      const setWithDup: OptionSet = {
        id: "collision_set",
        version: "0.1.0",
        label: { zh: "", en: "" },
        options: [
          {
            id: "opt_a1",
            version: "0.1.0",
            label: { zh: "", en: "" },
            plain: { zh: "", en: "" },
            professionalTerms: [],
            promptFragment: { zh: "", en: "" },
            appliesTo: []
          }
        ]
      };
      expect(() => registerOptionSet(setWithDup)).toThrow(
        'Duplicate option ID "opt_a1"'
      );
      expect(() => registerOptionSet(setWithDup)).toThrow("collision_set");
    });

    it("resolves option set by ID", () => {
      const set = getOptionSet("test_set_a");
      expect(set.id).toBe("test_set_a");
      expect(set.options).toHaveLength(2);
    });

    it("throws on unknown option set ID", () => {
      expect(() => getOptionSet("nope")).toThrow("Unknown option set: nope");
    });
  });

  describe("filtered lookup", () => {
    it("filters options by target via appliesTo", () => {
      registerOptionSet(testSetB);
      const seedanceOpts = getOptionsForTarget("test_set_a", "seedance");
      const genericOpts = getOptionsForTarget("test_set_a", "generic_video");

      expect(seedanceOpts.map((o) => o.id)).toEqual(["opt_a1", "opt_a2"]);
      expect(genericOpts.map((o) => o.id)).toEqual(["opt_a2"]);
    });

    it("returns empty array for unknown option set", () => {
      expect(getOptionsForTarget("nope", "seedance")).toEqual([]);
    });
  });

  describe("reverse index (D-05)", () => {
    it("getTargetsForOption returns correct targets for a multi-target option", () => {
      const targets = getTargetsForOption("opt_a2");
      expect(targets).toContain("seedance");
      expect(targets).toContain("generic_video");
    });

    it("getTargetsForOption returns empty array for unknown option ID", () => {
      expect(getTargetsForOption("nonexistent")).toEqual([]);
    });
  });

  describe("option type extensions (05-01 consumerTerms + categories)", () => {
    it("allows consumerTerms field on OptionItem", () => {
      const opt: OptionItem = {
        id: "opt_with_terms",
        version: "0.1.0",
        label: { zh: "测试", en: "Test" },
        plain: { zh: "", en: "" },
        professionalTerms: [],
        promptFragment: { zh: "", en: "" },
        appliesTo: [],
        consumerTerms: ["高级感"]
      };
      expect(opt.consumerTerms).toEqual(["高级感"]);
    });

    it("allows categories field on OptionSet", () => {
      const set: OptionSet = {
        id: "cat_set",
        version: "0.1.0",
        label: { zh: "分类集", en: "Cat Set" },
        options: [],
        categories: [
          { id: "cat1", label: { zh: "类别1", en: "Cat 1" }, optionIds: ["opt1"] }
        ]
      };
      expect(set.categories).toHaveLength(1);
      expect(set.categories![0].id).toBe("cat1");
    });

    it("existing OptionItem without consumerTerms is still valid", () => {
      const opt: OptionItem = {
        id: "plain_opt",
        version: "0.1.0",
        label: { zh: "", en: "" },
        plain: { zh: "", en: "" },
        professionalTerms: [],
        promptFragment: { zh: "", en: "" },
        appliesTo: []
      };
      expect(opt.consumerTerms).toBeUndefined();
    });

    it("existing OptionSet without categories is still valid", () => {
      const set: OptionSet = {
        id: "plain_set",
        version: "0.1.0",
        label: { zh: "", en: "" },
        options: []
      };
      expect(set.categories).toBeUndefined();
    });
  });

  describe("consumer term lookup", () => {
    // Register a test set with consumerTerms
    const testSetConsumer: OptionSet = {
      id: "test_set_consumer",
      version: "0.1.0",
      label: { zh: "消费者测试", en: "Consumer Test" },
      options: [
        {
          id: "opt_consumer_1",
          version: "0.1.0",
          label: { zh: "测试选项1", en: "Test Option 1" },
          plain: { zh: "", en: "" },
          professionalTerms: [],
          promptFragment: { zh: "", en: "" },
          appliesTo: ["seedance"],
          consumerTerms: ["测试词A", "测试词B"]
        },
        {
          id: "opt_consumer_2",
          version: "0.1.0",
          label: { zh: "测试选项2", en: "Test Option 2" },
          plain: { zh: "", en: "" },
          professionalTerms: [],
          promptFragment: { zh: "", en: "" },
          appliesTo: ["seedance"],
          consumerTerms: ["测试词B", "测试词C"]
        },
        {
          id: "opt_consumer_3",
          version: "0.1.0",
          label: { zh: "测试选项3", en: "Test Option 3" },
          plain: { zh: "", en: "" },
          professionalTerms: [],
          promptFragment: { zh: "", en: "" },
          appliesTo: ["seedance"]
          // No consumerTerms — intentional
        }
      ]
    };
    registerOptionSet(testSetConsumer);

    it("returns options matching a consumer term", () => {
      const results = getOptionsByConsumerTerm("测试词A");
      expect(results).toHaveLength(1);
      expect(results[0].id).toBe("opt_consumer_1");
    });

    it("returns multiple options when term appears on multiple options", () => {
      const results = getOptionsByConsumerTerm("测试词B");
      expect(results).toHaveLength(2);
      expect(results.map((o) => o.id)).toContain("opt_consumer_1");
      expect(results.map((o) => o.id)).toContain("opt_consumer_2");
    });

    it("returns empty array for unmatched term", () => {
      const results = getOptionsByConsumerTerm("不存在的词");
      expect(results).toEqual([]);
    });

    it("does not return options without consumerTerms", () => {
      const results = getOptionsByConsumerTerm("测试词C");
      expect(results).toHaveLength(1);
      expect(results[0].id).toBe("opt_consumer_2");
      // opt_consumer_3 has no consumerTerms, should never appear
      expect(results.map((o) => o.id)).not.toContain("opt_consumer_3");
    });
  });

  describe("getAll iterators", () => {
    it("returns iterables for all registered items", () => {
      expect(getAllWorkTypes().length).toBeGreaterThanOrEqual(1);
      expect(getAllTargets().length).toBeGreaterThanOrEqual(1);
      expect(getAllOptionSets().length).toBeGreaterThanOrEqual(2);
    });

    it("getAllAdapters returns a Map copy", () => {
      const adapters = getAllAdapters();
      expect(adapters instanceof Map).toBe(true);
      expect(adapters.has("test_target")).toBe(true);
    });
  });
});
