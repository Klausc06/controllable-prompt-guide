# Testing Patterns

**Analysis Date:** 2026-05-10

## Test Framework

**Runner:**
- Vitest v3.0.4 (`vitest/config` for configuration)
- Config: `vitest.config.ts` (project root)

**Configuration:**
```typescript
// vitest.config.ts
import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

export default defineConfig({
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test/setup.ts"]
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url))
    }
  }
});
```

**Key settings:**
- `environment: "jsdom"` -- DOM environment for React component testing
- `globals: true` -- vitest globals (`describe`, `it`, `expect`, `vi`) available without import (but tests explicitly import them anyway)
- `setupFiles` -- runs `src/test/setup.ts` before each test file
- `resolve.alias` -- `@` maps to `./src`, matching `tsconfig.json` paths

**Assertion Library:**
- Built-in Vitest `expect` (jest-compatible API)
- Extended via `@testing-library/jest-dom/vitest` for DOM matchers like `toBeInTheDocument()`

**Run Commands:**
```bash
npm test              # Runs "vitest run" (single run, no watch)
npm run typecheck     # Runs "tsc --noEmit" for type checking
npm run lint          # Runs "eslint ."
```

## Test File Organization

**Location:**
- Co-located with source files in the same directory:
  - `src/lib/prompt/validation.test.ts` lives alongside `src/lib/prompt/validation.ts`
  - `src/components/prompt-guide.test.tsx` lives alongside `src/components/prompt-guide.tsx`

**Naming:**
- `{sourceName}.test.ts` for pure logic tests
- `{sourceName}.test.tsx` for React component tests

**Structure:**
```
src/
  lib/prompt/
    validation.ts
    validation.test.ts          # co-located unit test
  components/
    prompt-guide.tsx
    prompt-guide.test.tsx       # co-located component test
  test/
    setup.ts                    # vitest setup file
```

## Test Suite Structure

**Pattern:**
- Each file has a single `describe` block wrapping all tests
- Each test uses `it()` (not `test()`)
- Descriptive Chinese question-style names for `it()` blocks

```typescript
import { describe, expect, it } from "vitest";
import { renderPrompt } from "./adapters";
// ... other imports

describe("prompt configuration validation", () => {
  it("keeps option ids unique across reusable catalogs", () => {
    expect(validateOptionIdsUnique(optionSets)).toEqual([]);
  });

  it("accepts the first video prompt work type schema", () => {
    expect(validateWorkTypeConfig(videoPromptWorkType, optionSets)).toEqual([]);
  });

  it("requires configured target tools to expose adapter guidance", () => {
    expect(targetTools.flatMap(validateTargetConfig)).toEqual([]);
  });
});
```

**Component test pattern:**
```typescript
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { PromptGuide } from "./prompt-guide";

describe("PromptGuide", () => {
  beforeEach(() => {
    // mock setup
  });

  it("generates a prompt from the default guided selections", () => {
    render(<PromptGuide />);
    expect(screen.getByText("可控提示词向导")).toBeInTheDocument();
    // ... more assertions
  });
});
```

## Mocking

**Framework:** `vi` from vitest (built-in, no external mocking library).

**Patterns:**

**Navigator clipboard mock:**
```typescript
// prompt-guide.test.tsx
beforeEach(() => {
  Object.assign(navigator, {
    clipboard: {
      writeText: vi.fn().mockResolvedValue(undefined)
    }
  });
});
```

**What to Mock:**
- Browser APIs that are not available in jsdom: `navigator.clipboard.writeText`
- No module-level mocks (`vi.mock`) are used in the current tests
- No HTTP/service mocks since all logic is local template rendering

**What NOT to Mock:**
- Pure data/validation functions -- they are tested directly
- Component rendering -- tested via `@testing-library/react` with real rendering

## Fixtures and Test Data

**Test Data Pattern:**
```typescript
// validation.test.ts -- inline complete selections fixture
const completeSelections: PromptSelections = {
  use_case: "coffee_new_product",
  subject: "food_drink",
  scene: "warm_cafe_counter",
  motion: "product_reveal",
  camera: "close_up_detail",
  lighting: "soft_daylight",
  style: "warm_lifestyle",
  constraints: ["no_ip_or_celebrity", "stable_identity"],
  audio: "ambient_only",
  format: "vertical_10s",
  text_handling: "short_title_only"
};
```

**Location:**
- Test data is defined inline within the test file (no separate fixtures directory).
- No factory functions or test data builders detected.

## Coverage

**Requirements:** None enforced. No coverage configuration in `vitest.config.ts`.

**View Coverage:**
```bash
npx vitest run --coverage   # would need @vitest/coverage-v8 installed
```

**Current state:** No coverage thresholds, no coverage reporter configured.

## Test Types

**Unit Tests:**
- 5 tests in `validation.test.ts` covering:
  1. Option ID uniqueness validation
  2. Work type configuration schema validation
  3. Target tool configuration validation
  4. Question coverage of required prompt dimensions
  5. Rendered output difference between targets (Seedance vs generic video)
- Tests call validation functions and `renderPrompt` directly

**Component Tests:**
- 3 tests in `prompt-guide.test.tsx` covering:
  1. Default prompt generation with guided selections (text assertions + no textbox)
  2. Target switching without losing selections (click use case + switch target tool)
  3. Advanced options toggle and copy action to clipboard

**Integration Tests:**
- Not used. The "render output difference" test in `validation.test.ts` is a borderline integration test calling through `adapters.ts` but is co-located with unit tests.

**E2E Tests:**
- Not used. No E2E framework (Playwright, Cypress) configured.

## Testing Complete Selections Flow

**Source test setup:**
- `src/test/setup.ts` contains a single import:
```typescript
import "@testing-library/jest-dom/vitest";
```
This registers custom DOM matchers (`toBeInTheDocument`, `toHaveTextContent`, etc.) from `@testing-library/jest-dom`.

## Common Assertion Patterns

**Empty result (validation passed):**
```typescript
expect(validateOptionIdsUnique(optionSets)).toEqual([]);
```

**Array containment:**
```typescript
expect(questionIds).toEqual(
  expect.arrayContaining(["use_case", "subject", "scene", ...])
);
```

**String containment:**
```typescript
expect(seedance.zhPrompt).toContain("生成一段");
```

**Inequality:**
```typescript
expect(seedance.zhPrompt).not.toEqual(generic.zhPrompt);
```

**DOM presence:**
```typescript
expect(screen.getByText("可控提示词向导")).toBeInTheDocument();
```

**DOM absence:**
```typescript
expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
```

**Async wait for DOM update:**
```typescript
fireEvent.click(screen.getByText("复制中文"));
await waitFor(() => expect(navigator.clipboard.writeText).toHaveBeenCalled());
```

## Test Count

**Current test inventory:**
| Test file | Tests |
|---|---|
| `src/lib/prompt/validation.test.ts` | 5 |
| `src/components/prompt-guide.test.tsx` | 3 |
| **Total** | **8** |

## Gaps

- No tests for `brief.ts` (particularly `buildPromptBrief` and `getBriefText`)
- No tests for `video-renderer.ts` render functions individually
- No tests for option or target data files (structure/shape validation)
- No coverage thresholds configured
- No integration tests for the full render pipeline
- No snapshot tests for rendered component output
- No type-level tests

---

*Testing analysis: 2026-05-10*
