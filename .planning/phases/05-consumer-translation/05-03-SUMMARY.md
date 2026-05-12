---
phase: 05-consumer-translation
plan: 03
subsystem: UI components (prompt-guide.tsx)
tags: [consumer-tags, category-tabs, platform-tags, tests, question-block, ui]
requires: ["05-01", "05-02"]
provides:
  - QuestionBlock with ConsumerTagGroup (Style dimension)
  - QuestionBlock with CategoryTabs (Subject, Style, Format)
  - QuestionBlock with PlatformTagGroup (Format dimension)
  - OptionCard shared component (no code duplication)
  - getOptionsByConsumerTerm registry unit tests (4 cases)
  - Component tests for all 3 UX features (9 cases)
affects:
  - src/components/prompt-guide.tsx
  - src/components/prompt-guide.test.tsx
  - src/lib/prompt/registry.test.ts
  - src/lib/prompt/work-types/video-prompt.worktype.ts
tech-stack:
  added: []
  patterns:
    - "Shared OptionCard component extracted from inline JSX"
    - "ConsumerTagGroup with useMemo for consumerTerm→optionId map"
    - "CategoryTabs with useState for active category, null='全部' mode"
    - "PlatformTagGroup with additive toggle of recommendedFormats arrays"
key-files:
  created: []
  modified:
    - src/components/prompt-guide.tsx (294 new lines, 38 removed)
    - src/components/prompt-guide.test.tsx (9 new test cases)
    - src/lib/prompt/registry.test.ts (4 new test cases)
    - src/lib/prompt/work-types/video-prompt.worktype.ts (style/format mode change)
  unmodified: []
decisions:
  - "OptionCard extracted as shared component to avoid inline JSX duplication between QuestionBlock and CategoryTabs"
  - "CategoryTabs renders its own option grid internally; standalone grid in QuestionBlock only when no categories"
  - "Style changed from single to multi mode to support additive consumer tag selection (plan mandate)"
  - "Format changed from single to multi mode to support additive platform tag selection (plan mandate)"
  - "ConsumerTagGroup uses useMemo for term→optionId map build (computed from applicableOptions props)"
metrics:
  duration: "automated"
  completed_date: "2026-05-13T04:40:00Z"
  tasks_completed: 3
  files_modified: 4
  tests_added: 13
  tests_total: 92
---

# Phase 5 Plan 3: Consumer Translation — UX Integration Summary

**One-liner:** Integrated consumer tags, category tabs, and platform tags into QuestionBlock with shared OptionCard, plus 13 new tests and multi-mode fixes for additive tag behavior.

## Completed Tasks

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Add ConsumerTagGroup, CategoryTabs, PlatformTagGroup to QuestionBlock | d065dbe | src/components/prompt-guide.tsx |
| 2 | Add registry test for getOptionsByConsumerTerm | 728b877 | src/lib/prompt/registry.test.ts |
| 3 | Add component tests for consumer tags, category tabs, platform tags | 2254c95 | src/components/prompt-guide.test.tsx, src/components/prompt-guide.tsx, src/lib/prompt/work-types/video-prompt.worktype.ts |

## What Was Built

### Task 1: UI Integration (d065dbe)

**Four new components** added to `src/components/prompt-guide.tsx`:

1. **OptionCard** — Shared/reusable option card button, extracted from the inline JSX in QuestionBlock. Used by both QuestionBlock (no-category case) and CategoryTabs.

2. **ConsumerTagGroup** — Renders consumer-friendly term pill tags above the Style option grid. Builds a `consumerTermMap` via `useMemo` from applicable options' `consumerTerms` arrays. Each tag click maps to the corresponding option ID and calls `toggleOption`. Selected tags get `bg-teal-700` styling with `aria-pressed="true"`.

3. **CategoryTabs** — Renders a tab bar (`role="tablist"`) with "全部" (all) + per-category tabs. In "全部" mode, options are grouped by category with `<h3>` section headers. In specific category mode, only that category's options are shown. Uses `useState<string | null>` (null = all) so selected options persist across tab switches.

4. **PlatformTagGroup** — Renders platform format quick-entry tags above the Format option grid. Each platform button toggles ALL of its `recommendedFormats` that are applicable to the current target (appliesTo filtered). Active when ANY applicable format is selected, styled `bg-indigo-700`.

**QuestionBlock modifications:**
- ConsumerTagGroup renders when `optionSetId === "style"`
- CategoryTabs render when `optionSet?.categories` exists
- PlatformTagGroup renders when `optionSetId === "format"`
- Standalone option grid only renders when no categories exist (`!optionSet.categories`)
- All use `OptionCard` component
- New imports: `getOptionsByConsumerTerm`, `platformConfigs`

### Task 2: Registry Tests (728b877)

New `describe("consumer term lookup")` block in `src/lib/prompt/registry.test.ts` with 4 tests:
- Single match: term maps to one option
- Multi-match: term appears on multiple options
- Unmatched term: returns empty array
- Exclusion: options without consumerTerms are never returned

### Task 3: Component Tests (2254c95)

9 new test cases in `src/components/prompt-guide.test.tsx`:

**Consumer aesthetics tags (3 tests):**
- Tag rendering in Style section
- Click selects mapped option card
- Additive multi-select (both tags stay active)

**Category tabs (3 tests):**
- Tab rendering with "全部" and named tabs
- Option filtering when category tab clicked
- Selection persistence across tab switches

**Platform format tags (3 tests):**
- Tag rendering after expanding advanced options
- Toggle select/deselect (handles default pre-selection)
- Additive merge of multiple platform selections

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Style question was single-select mode, preventing additive consumer tag behavior**
- **Found during:** Task 3
- **Issue:** Plan mandates "consumer term tags support additive multi-select" but `style` question was `mode: "single"`. Clicking a second consumer tag replaced the first.
- **Fix:** Changed style question mode from "single" to "multi" with `minSelections: 1` in `video-prompt.worktype.ts`. Updated default value from string to array in prompt-guide.tsx.
- **Files modified:** src/lib/prompt/work-types/video-prompt.worktype.ts, src/components/prompt-guide.tsx
- **Commit:** 2254c95

**2. [Rule 1 - Bug] Format question was single-select mode, preventing additive platform tag behavior**
- **Found during:** Task 3
- **Issue:** PlatformTagGroup toggles multiple format options, but `format` question was `mode: "single"`. Each `onToggle` call replaced the previous selection.
- **Fix:** Changed format question mode from "single" to "multi" with `minSelections: 1` in `video-prompt.worktype.ts`. Updated default value from string to array in prompt-guide.tsx.
- **Files modified:** src/lib/prompt/work-types/video-prompt.worktype.ts, src/components/prompt-guide.tsx
- **Commit:** 2254c95

**3. [Rule 1 - Bug] Component tests failed due to text ambiguity between option cards and Brief preview sidebar**
- **Found during:** Task 3
- **Issue:** Multiple tests used `screen.getByText("option label").closest("button")` but the same text appeared in both the option card button and the Brief preview div in the right sidebar. `getByText` threw for multiple matches.
- **Fix:** Replaced with `screen.getAllByText("label").find(el => el.closest("button"))?.closest("button")` pattern to filter for button ancestors only.
- **Files modified:** src/components/prompt-guide.test.tsx
- **Commit:** 2254c95

**4. [Rule 1 - Bug] Platform tag test expected active state after click but tag starts active due to default selection**
- **Found during:** Task 3
- **Issue:** Default format selection (`format:vertical_10s`) is a douyin format, so douyin tag starts `active=true`. Clicking toggles it OFF instead of ON.
- **Fix:** Updated test to verify toggle-off then toggle-on, confirming both states work correctly.
- **Files modified:** src/components/prompt-guide.test.tsx
- **Commit:** 2254c95

## Verification

| Check | Result |
|-------|--------|
| `npx tsc --noEmit` | PASS |
| `npm test` | 92/92 PASS (79 existing + 13 new) |
| Consumer tags render in Style section | PASS |
| Category tabs render in Subject, Style, Format | PASS |
| Platform tags render in Format section | PASS |
| `getOptionsByConsumerTerm` in registry test | PASS |
| Consumer term tests via "高级感" | PASS |
| Category tab tests via "全部" | PASS |
| Platform tag tests via "抖音" | PASS |

## Test Counts

| Test File | Before | After | Added |
|-----------|--------|-------|-------|
| src/lib/prompt/registry.test.ts | 28 | 32 | +4 |
| src/lib/prompt/reducer.test.ts | 8 | 8 | 0 |
| src/lib/prompt/validation.test.ts | 35 | 35 | 0 |
| src/components/prompt-guide.test.tsx | 8 | 17 | +9 |
| **Total** | **79** | **92** | **+13** |
