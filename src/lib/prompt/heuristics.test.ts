import { describe, expect, it } from "vitest";
import { evaluatePromptQuality } from "./heuristics";
import type { PromptSelections } from "./types";

// Sample image prompt selections (valid, no conflicts)
const validImageSelections: PromptSelections = {
  use_case: "image_use_case:social_media_post",
  subject: "image_subject:single_person",
  scene: "image_scene:urban_street",
  composition: "image_composition:rule_of_thirds",
  lighting: "image_lighting:golden_hour",
  art_style: "image_art_style:photorealistic",
  color_palette: "image_color_palette:warm",
  constraints: ["image_constraints:no_ip_celebrity"],
};

describe("evaluatePromptQuality — workTypeId parameter", () => {
  it("fires video rules when workTypeId is undefined (backward compat)", () => {
    const selections: PromptSelections = {
      subject: "",
      lighting: "",
    };
    const warnings = evaluatePromptQuality(selections, "seedance");
    const zh = warnings.map((w) => w.zh).join("");
    // Video rules fire: no subject + no lighting
    expect(zh).toContain("未选择主体");
    expect(zh).toContain("未指定光线");
    // Image rules should NOT fire when workTypeId is undefined
    expect(zh).not.toContain("图片生成");
  });

  it("fires only video rules when workTypeId is video_prompt", () => {
    const selections: PromptSelections = {
      subject: "",
      lighting: "",
      camera_movement: ["camera_movement:static_locked", "camera_movement:slow_push_in"],
    };
    const warnings = evaluatePromptQuality(selections, "seedance", "", "video_prompt");
    const zh = warnings.map((w) => w.zh).join("");
    // Video rules fire
    expect(zh).toContain("未选择主体");
    expect(zh).toContain("未指定光线");
    expect(zh).toContain("固定不动");
    // Image rules should NOT fire
    expect(zh).not.toContain("图片生成");
  });

  it("fires only image rules when workTypeId is image_prompt", () => {
    const selections: PromptSelections = {
      ...validImageSelections,
      subject: "",
      lighting: "",
    };
    const warnings = evaluatePromptQuality(selections, "seedance", "", "image_prompt");
    const zh = warnings.map((w) => w.zh).join("");
    // Image rules fire: no subject
    expect(zh).toContain("未指定主体");
    expect(zh).toContain("图片生成");
    // Video rules should NOT fire (different message for subject)
    expect(zh).not.toContain("视频提示词");
    expect(zh).not.toContain("未指定光线");
  });
});

describe("evaluatePromptQuality — image completeness rule", () => {
  it("warns when image subject is missing", () => {
    const selections: PromptSelections = {
      ...validImageSelections,
      subject: "",
    };
    const warnings = evaluatePromptQuality(selections, "generic_image", "", "image_prompt");
    const zh = warnings.map((w) => w.zh).join("");
    expect(zh).toContain("未指定主体");
    expect(zh).toContain("图片生成最重要的维度");
    expect(zh).toContain("建议添加");
  });

  it("does not warn when image subject IS selected", () => {
    const warnings = evaluatePromptQuality(
      validImageSelections,
      "generic_image",
      "",
      "image_prompt"
    );
    const zh = warnings.map((w) => w.zh).join("");
    expect(zh).not.toContain("未指定主体");
  });
});

describe("evaluatePromptQuality — image conflict rules", () => {
  it("warns when photorealistic + anime_manga both selected", () => {
    const selections: PromptSelections = {
      ...validImageSelections,
      art_style: [
        "image_art_style:photorealistic",
        "image_art_style:anime_manga",
      ],
    };
    const warnings = evaluatePromptQuality(selections, "generic_image", "", "image_prompt");
    const zh = warnings.map((w) => w.zh).join("");
    expect(zh).toContain("写实");
    expect(zh).toContain("动漫");
    expect(zh).toContain("冲突");
  });

  it("warns when monochrome + vibrant color palette both selected", () => {
    const selections: PromptSelections = {
      ...validImageSelections,
      color_palette: [
        "image_color_palette:monochrome",
        "image_color_palette:vibrant",
      ],
    };
    const warnings = evaluatePromptQuality(selections, "generic_image", "", "image_prompt");
    const zh = warnings.map((w) => w.zh).join("");
    expect(zh).toContain("黑白");
    expect(zh).toContain("高饱和");
    expect(zh).toContain("互斥");
  });

  it("warns when watercolor + sharp focus styles both selected", () => {
    const selections: PromptSelections = {
      ...validImageSelections,
      art_style: [
        "image_art_style:watercolor",
        "image_art_style:photorealistic",
      ],
    };
    const warnings = evaluatePromptQuality(selections, "generic_image", "", "image_prompt");
    const zh = warnings.map((w) => w.zh).join("");
    expect(zh).toContain("水彩");
    expect(zh).toContain("锐焦");
  });

  it("warns when 3+ art mediums are selected", () => {
    const selections: PromptSelections = {
      ...validImageSelections,
      art_style: [
        "image_art_style:oil_painting",
        "image_art_style:watercolor",
        "image_art_style:pencil_sketch",
      ],
    };
    const warnings = evaluatePromptQuality(selections, "generic_image", "", "image_prompt");
    const zh = warnings.map((w) => w.zh).join("");
    expect(zh).toContain("创作媒介");
  });

  it("warns when flat vector + volumetric lighting both selected", () => {
    const selections: PromptSelections = {
      ...validImageSelections,
      art_style: "image_art_style:vector_flat",
      lighting: "image_lighting:volumetric_god_rays",
    };
    const warnings = evaluatePromptQuality(selections, "generic_image", "", "image_prompt");
    const zh = warnings.map((w) => w.zh).join("");
    expect(zh).toContain("扁平矢量");
    expect(zh).toContain("体积光");
  });

  it("warns when 3D render + hand-drawn styles both selected", () => {
    const selections: PromptSelections = {
      ...validImageSelections,
      art_style: [
        "image_art_style:3d_render",
        "image_art_style:pencil_sketch",
      ],
    };
    const warnings = evaluatePromptQuality(selections, "generic_image", "", "image_prompt");
    const zh = warnings.map((w) => w.zh).join("");
    expect(zh).toContain("3D渲染");
    expect(zh).toContain("手绘");
  });

  it("produces no image warnings when all image rules conditions are absent", () => {
    const warnings = evaluatePromptQuality(
      validImageSelections,
      "generic_image",
      "",
      "image_prompt"
    );
    // Should have zero warnings — valid selections with no conflicts
    expect(warnings).toEqual([]);
  });

  it("does NOT fire image rules when workTypeId is video_prompt", () => {
    // Even with image-conflicting selections, should not fire image rules for video
    const selections: PromptSelections = {
      ...validImageSelections,
      art_style: [
        "image_art_style:photorealistic",
        "image_art_style:anime_manga",
      ],
    };
    const warnings = evaluatePromptQuality(selections, "seedance", "", "video_prompt");
    const zh = warnings.map((w) => w.zh).join("");
    expect(zh).not.toContain("写实");
    expect(zh).not.toContain("动漫");
  });
});
