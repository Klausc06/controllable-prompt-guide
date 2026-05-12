import { describe, expect, it } from "vitest";
import { renderPrompt } from "./adapters";
import { getBriefText, renderMarkdown, getCameraText, buildPromptBrief } from "./brief";
import { evaluatePromptQuality } from "./heuristics";
import { optionSets } from "./options";
import { getAllTargets, resolveWorkType } from "./registry";
import { targetTools } from "./targets";
import type { PromptSelections, TargetToolConfig, WorkTypeConfig } from "./types";
import type { OptionSet } from "./types";
import { validateAdapterCompleteness, validateOptionIdFormat, validateOptionIdsUnique, validateOptionTargetRefs, validateSafetyDefaultsIntegrity, validateTargetConfig, validateWorkTypeConfig } from "./validation";

const workType = resolveWorkType("video_prompt");

const completeSelections: PromptSelections = {
  use_case: "use_case:coffee_new_product",
  subject: "subject:food_drink",
  scene: "scene:warm_cafe_counter",
  motion: "motion:product_reveal",
  shot_type: "shot_type:close_up",
  camera_movement: "camera_movement:slow_push_in",
  lighting: "lighting:soft_daylight",
  style: "style:warm_lifestyle",
  constraints: ["constraints:no_ip_or_celebrity", "constraints:stable_identity", "constraints:readable_text"],
  audio: "audio:ambient_only",
  format: "format:vertical_10s",
  text_handling: "text_handling:short_title_only"
};

describe("prompt configuration validation", () => {
  it("keeps option ids unique across reusable catalogs", () => {
    expect(validateOptionIdsUnique(optionSets)).toEqual([]);
  });

  it("validates option IDs have namespace prefix matching their optionSet (OPT-05)", () => {
    expect(validateOptionIdFormat(optionSets)).toEqual([]);
  });

  it("returns duplicate option IDs when they appear across sets (TEST-01)", () => {
    const collidingA: OptionSet = {
      id: "collide_a",
      version: "0.1.0",
      label: { en: "A", zh: "A" },
      options: [
        {
          id: "shared_id",
          version: "0.1.0",
          label: { en: "Shared", zh: "共享" },
          plain: { en: "", zh: "" },
          professionalTerms: [],
          promptFragment: { en: "", zh: "" },
          appliesTo: ["seedance"]
        }
      ]
    };
    const collidingB: OptionSet = {
      id: "collide_b",
      version: "0.1.0",
      label: { en: "B", zh: "B" },
      options: [
        {
          id: "shared_id",
          version: "0.1.0",
          label: { en: "Shared", zh: "共享" },
          plain: { en: "", zh: "" },
          professionalTerms: [],
          promptFragment: { en: "", zh: "" },
          appliesTo: ["seedance"]
        }
      ]
    };
    expect(validateOptionIdsUnique([collidingA, collidingB])).toEqual(["shared_id"]);
  });

  it("accepts the first video prompt work type schema", () => {
    expect(validateWorkTypeConfig(workType, optionSets)).toEqual([]);
  });

  it("requires configured target tools to expose adapter guidance", () => {
    expect(targetTools.flatMap(validateTargetConfig)).toEqual([]);
  });

  it("covers the required video prompt dimensions", () => {
    const questionIds = workType.questions.map((question) => question.id);

    expect(questionIds).toEqual(
      expect.arrayContaining([
        "use_case",
        "subject",
        "scene",
        "motion",
        "shot_type",
        "camera_movement",
        "lighting",
        "style",
        "audio",
        "format",
        "constraints"
      ])
    );
  });

  it("renders complete and different outputs for Seedance and generic video targets", () => {
    const seedance = renderPrompt({
      workType: workType,
      targetToolId: "seedance",
      rawIntent: "",
      selections: completeSelections
    });
    const generic = renderPrompt({
      workType: workType,
      targetToolId: "generic_video",
      rawIntent: "",
      selections: completeSelections
    });

    expect(seedance.zhPrompt).toContain("生成一段");
    expect(seedance.zhPrompt).toContain("镜头调度");
    expect(seedance.enPrompt).toContain("Camera staging");
    expect(generic.zhPrompt).toContain("目标：咖啡店新品短视频");
    expect(generic.zhPrompt).toContain("主体：");
    expect(generic.enPrompt).toContain("Constraints:");
    expect(seedance.zhPrompt).not.toEqual(generic.zhPrompt);
  });

  it("includes safety constraint text in Seedance output (TEST-08)", () => {
    const result = renderPrompt({
      workType: workType,
      targetToolId: "seedance",
      rawIntent: "",
      selections: completeSelections
    });

    expect(result.zhPrompt).toContain("不使用明星脸");
    expect(result.zhPrompt).toContain("影视 IP");
    expect(result.zhPrompt).toContain("未授权角色");
    expect(result.zhPrompt).toContain("品牌侵权");
  });

  it("warns when safety defaults are deselected from Seedance output (TEST-08)", () => {
    const unsafe: PromptSelections = {
      ...completeSelections,
      constraints: ["constraints:simple_scene"]
    };

    const result = renderPrompt({
      workType: workType,
      targetToolId: "seedance",
      rawIntent: "",
      selections: unsafe
    });

    expect(result.warnings.length).toBeGreaterThanOrEqual(1);
    const zhWarnings = result.warnings.map((w) => w.zh).join("");
    expect(zhWarnings).toContain("安全约束");
    expect(zhWarnings).toContain("constraints:no_ip_or_celebrity");
    expect(zhWarnings).toContain("constraints:stable_identity");
    expect(zhWarnings).toContain("constraints:readable_text");
  });

  it("includes safety constraint text in Generic Video output (TEST-08)", () => {
    const result = renderPrompt({
      workType: workType,
      targetToolId: "generic_video",
      rawIntent: "",
      selections: completeSelections
    });

    expect(result.zhPrompt).toContain("不使用明星脸");
    expect(result.zhPrompt).toContain("主体身份");
    expect(result.enPrompt).toContain("avoid celebrity likenesses");
  });

  it("warns when safety defaults are deselected from Generic Video output (TEST-08)", () => {
    const unsafe: PromptSelections = {
      ...completeSelections,
      constraints: ["constraints:simple_scene"]
    };

    const result = renderPrompt({
      workType: workType,
      targetToolId: "generic_video",
      rawIntent: "",
      selections: unsafe
    });

    expect(result.warnings.length).toBeGreaterThanOrEqual(1);
    const zhWarnings = result.warnings.map((w) => w.zh).join("");
    expect(zhWarnings).toContain("安全约束");
    expect(zhWarnings).toContain("constraints:no_ip_or_celebrity");
    expect(zhWarnings).toContain("constraints:stable_identity");
  });

  it("includes safety constraint text in Veo 3 output (TEST-08)", () => {
    const result = renderPrompt({
      workType: workType,
      targetToolId: "veo3",
      rawIntent: "",
      selections: completeSelections
    });

    expect(result.zhPrompt).toContain("不使用明星脸");
    expect(result.zhPrompt).toContain("主体身份");
    expect(result.enPrompt).toContain("avoid celebrity likenesses");
  });

  it("warns when safety defaults are deselected from Veo 3 output (TEST-08)", () => {
    const unsafe: PromptSelections = {
      ...completeSelections,
      constraints: ["constraints:simple_scene"]
    };

    const result = renderPrompt({
      workType: workType,
      targetToolId: "veo3",
      rawIntent: "",
      selections: unsafe
    });

    expect(result.warnings.length).toBeGreaterThanOrEqual(1);
    const zhWarnings = result.warnings.map((w) => w.zh).join("");
    expect(zhWarnings).toContain("安全约束");
    expect(zhWarnings).toContain("constraints:no_ip_or_celebrity");
    expect(zhWarnings).toContain("constraints:stable_identity");
  });

  it("ensures every registered target has a corresponding adapter (TEST-05)", () => {
    expect(validateAdapterCompleteness()).toEqual([]);
  });

  it("resolves the registered video_prompt work type from registry", () => {
    const resolved = resolveWorkType("video_prompt");
    expect(resolved.id).toBe("video_prompt");
    expect(resolved.questions.length).toBeGreaterThan(0);
  });

  it("returns all registered targets via getAllTargets()", () => {
    const targets = getAllTargets();
    expect(targets.length).toBeGreaterThanOrEqual(2);
    expect(targets.find((t) => t.id === "seedance")).toBeDefined();
    expect(targets.find((t) => t.id === "generic_video")).toBeDefined();
    expect(targets.find((t) => t.id === "veo3")).toBeDefined();
  });

  it("rendered prompt uses registered adapter via resolveAdapter", () => {
    const result = renderPrompt({
      workType,
      targetToolId: "seedance",
      rawIntent: "",
      selections: completeSelections
    });
    expect(result.targetToolId).toBe("seedance");
    expect(result.zhPrompt).toContain("镜头调度");
  });

  it("validates option appliesTo target refs exist (TEST-04)", () => {
    expect(validateOptionTargetRefs()).toEqual([]);
  });

  it("confirms all safetyDefaults option IDs resolve to registered options (CI)", () => {
    const errors = validateSafetyDefaultsIntegrity(targetTools, optionSets);
    expect(errors).toEqual([]);
  });

  it("detects unknown option IDs in safetyDefaults", () => {
    const bad: TargetToolConfig = {
      id: "test_bad_target",
      version: "0.1.0",
      label: { zh: "Bad", en: "Bad" },
      description: { zh: "", en: "" },
      adaptationNote: { zh: "test", en: "test" },
      prefer: ["subject"],
      suppress: [],
      safetyDefaults: ["nonexistent_option", "another_fake"]
    };
    const errors = validateSafetyDefaultsIntegrity([bad], optionSets);
    expect(errors.length).toBeGreaterThanOrEqual(1);
    expect(errors[0]).toContain("nonexistent_option");
  });

  it("selected option promptFragment appears in rendered output (TEST-06)", () => {
    const result = renderPrompt({
      workType,
      targetToolId: "seedance",
      rawIntent: "",
      selections: completeSelections
    });

    // Subject selection "food_drink" prompt fragment appears
    expect(result.zhPrompt).toContain("食物或饮品作为主体");
    // Style selection "warm_lifestyle" prompt fragment appears
    expect(result.zhPrompt).toContain("温暖生活方式");
    // Shot type + camera movement combine into camera staging
    expect(result.zhPrompt).toContain("特写镜头");
    expect(result.zhPrompt).toContain("镜头缓慢向主体推进");
  });

  it("respects maxSelections cap on multi-select constraints (TEST-09)", () => {
    const overMax: PromptSelections = {
      ...completeSelections,
      constraints: [
        "constraints:no_ip_or_celebrity",
        "constraints:stable_identity",
        "constraints:readable_text",
        "constraints:simple_scene",
        "no_logo_hallucination"
      ]
    };

    const result = renderPrompt({
      workType,
      targetToolId: "seedance",
      rawIntent: "",
      selections: overMax
    });

    // Should still render (doesn't crash), even with 5 constraints (maxSelections=4)
    expect(result.zhPrompt.length).toBeGreaterThan(0);

    // Brief should cap at 4 selections for constraints question
    const constraintsItem = result.brief.items.find(
      (i) => i.questionId === "constraints"
    );
    expect(constraintsItem).toBeDefined();
    expect(constraintsItem!.selectedOptions.length).toBeLessThanOrEqual(4);
  });

  it("provides quality heuristic warnings for missing lighting (DIFF-02)", () => {
    const selections: PromptSelections = {
      ...completeSelections,
      lighting: ""
    };
    const result = renderPrompt({
      workType,
      targetToolId: "seedance",
      rawIntent: "",
      selections
    });
    const zhWarnings = result.warnings.map((w) => w.zh).join("");
    expect(zhWarnings).toContain("未指定光线");
    expect(zhWarnings).toContain("画面质量");
  });

  it("JSON brief is parseable and contains required fields (TEST-10)", () => {
    const result = renderPrompt({ workType, targetToolId: "seedance", rawIntent: "", selections: completeSelections });
    const json = JSON.stringify(result.brief, null, 2);
    const parsed = JSON.parse(json);
    expect(parsed.workTypeId).toBe("video_prompt");
    expect(parsed.targetToolId).toBe("seedance");
    expect(Array.isArray(parsed.items)).toBe(true);
    expect(parsed.items.length).toBeGreaterThan(0);
  });
});

describe("brief utilities", () => {
  it("getBriefText returns correct fragment for a question", () => {
    const brief = buildPromptBrief({ workType, targetToolId: "seedance", rawIntent: "", selections: completeSelections });
    const zh = getBriefText(brief, "subject", "zh");
    expect(zh).toContain("食物");
  });

  it("getBriefText returns empty string for missing question", () => {
    const brief = buildPromptBrief({ workType, targetToolId: "seedance", rawIntent: "", selections: completeSelections });
    expect(getBriefText(brief, "nonexistent", "zh")).toBe("");
  });

  it("getCameraText combines shot_type and camera_movement when camera missing", () => {
    const brief = buildPromptBrief({ workType, targetToolId: "seedance", rawIntent: "", selections: completeSelections });
    const zh = getCameraText(brief, "zh");
    expect(zh).toContain("特写");
    expect(zh).toContain("推进");
  });

  it("renderMarkdown produces valid markdown with all sections", () => {
    const result = renderPrompt({ workType, targetToolId: "seedance", rawIntent: "", selections: completeSelections });
    const md = renderMarkdown(result);
    expect(md).toContain("# Video Prompt Brief");
    expect(md).toContain("## Chinese Prompt");
    expect(md).toContain("## English Prompt");
    expect(md).toContain("## Brief Items");
    expect(md).toContain("| Dimension | Selection |");
    expect(md).toContain("**Target:** seedance");
  });

  it("validateWorkTypeConfig detects missing optionSetId on required choice", () => {
    const bad: WorkTypeConfig = {
      id: "bad_wt", version: "0.1.0",
      label: { zh: "X", en: "X" },
      description: { zh: "", en: "" },
      questions: [{ id: "q", version: "0.1.0", title: { zh: "Q", en: "Q" }, helper: { zh: "", en: "" }, mode: "single", level: "core", required: true }]
    };
    const errors = validateWorkTypeConfig(bad, []);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0]).toContain("needs optionSetId");
  });

  it("validateTargetConfig rejects empty prefer array", () => {
    const bad = { id: "bad", version: "0.1.0", label: { zh: "X", en: "X" }, description: { zh: "", en: "" }, adaptationNote: { zh: "x", en: "x" }, prefer: [], suppress: [], safetyDefaults: [] };
    expect(validateTargetConfig(bad).length).toBeGreaterThan(0);
  });

  it("detects Seedance quality-killing keywords in rawIntent", () => {
    const warnings = evaluatePromptQuality(completeSelections, "seedance", "make it fast and cinematic");
    const zh = warnings.map(w => w.zh).join("");
    expect(zh).toContain("fast");
    expect(zh).toContain("Seedance");
  });
});
