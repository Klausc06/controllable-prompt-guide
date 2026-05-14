import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("D-02: adapters.ts — independent adapter registration", () => {
  it("imports veo3 renderer in adapters.ts (D-02)", () => {
    const content = readFileSync("src/lib/prompt/adapters.ts", "utf-8");
    // veo3.renderer must be imported so that importing renderPrompt from
    // adapters.ts (without init.ts) resolves the veo3 adapter.
    expect(content).toContain('import "./renderers/veo3.renderer"');
  });

  it("imports all 4 renderers in correct order (matching init.ts)", () => {
    const content = readFileSync("src/lib/prompt/adapters.ts", "utf-8");
    const importLines = content
      .split("\n")
      .filter((line) => line.includes('import "./renderers/'))
      .map((line) => line.trim());

    expect(importLines).toHaveLength(4);
    // Order must match init.ts: seedance, generic-video, veo3, generic-image
    expect(importLines[0]).toBe('import "./renderers/seedance.renderer";');
    expect(importLines[1]).toBe('import "./renderers/generic-video.renderer";');
    expect(importLines[2]).toBe('import "./renderers/veo3.renderer";');
    expect(importLines[3]).toBe('import "./renderers/generic-image.renderer";');
  });
});

describe("D-01: vitest config excludes worktree copies", () => {
  it("has exclude property in test config with .claude/**", () => {
    const content = readFileSync("vitest.config.ts", "utf-8");
    // The exclude must contain .claude/** to prevent worktree snapshot
    // copies from polluting test discovery (36 false failures).
    expect(content).toContain(".claude/**");
    expect(content).toContain("exclude");
  });
});
