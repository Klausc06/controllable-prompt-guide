---
phase: 12-image-quality
plan: 01
subsystem: prompt-quality-heuristics
tags: [heuristics, image-quality, work-type-gating, conflict-detection, amber-warnings]
requires:
  - "Existing evaluatePromptQuality() with 6 video rules"
  - "image_prompt work type (phase 09)"
  - "image option catalogs (phase 10)"
  - "generic-image renderer (phase 11)"
provides:
  - "Work-type-aware quality evaluation with 7 image-specific heuristic rules"
  - "adapters.ts wired to pass workType.id through render pipeline"
affects:
  - "heuristics.ts — 7 new image rules, workTypeId parameter, existing rules gated"
  - "adapters.ts — 1 call site modified (adds 4th argument)"
  - "heuristics.test.ts — 13 new tests"
tech-stack:
  added: []
  patterns:
    - "Work-type gating pattern: isVideo/isImage booleans gate rule evaluation"
    - "Option ID string-matching for conflict detection (no data imports)"
key-files:
  created:
    - "src/lib/prompt/heuristics.test.ts — 13 tests covering work-type gating + 7 image rules"
  modified:
    - "src/lib/prompt/heuristics.ts — workTypeId parameter, isVideo/isImage gating, 7 image rules"
    - "src/lib/prompt/adapters.ts — passes params.workType.id to evaluatePromptQuality()"
decisions:
  - "Backward compat: undefined workTypeId = video rules only (not all-rules mode)"
  - "Image rules fire ONLY when workTypeId is explicitly 'image_prompt' (not undefined)"
  - "All image rules are amber warnings — never block or throw (D-03)"
  - "Conflict detection uses option ID string-matching, not data imports (avoids circular deps)"
  - "Volumetric lighting IDs use actual option IDs from codebase (volumetric_god_rays, hard_dramatic, rim_light)"
  - "Art medium IDs exclude rendering techniques (photorealistic, vector_flat, 3d_render, pixel_art, graffiti, claymation)"
metrics:
  duration_seconds: 780
  completed_date: "2026-05-14"
  tasks: 2
  files_created: 1
  files_modified: 2
  tests_added: 13
  total_test_count: 130
---

# Phase 12 Plan 01: Image Quality Heuristics — Work-Type-Aware Rules

**One-liner:** Extended evaluatePromptQuality() with work-type gating to add 7 image-specific conflict/completeness rules as amber warnings, preventing contradictory AI-generated images.

## Tasks Executed

### Task 1: Extend evaluatePromptQuality with workTypeId + 7 image rules (TDD)

- **RED:** Created `heuristics.test.ts` with 13 tests covering work-type gating (backward compat, video-only, image-only) and all 7 image rules
- **GREEN:** Added optional `workTypeId` parameter to `evaluatePromptQuality()`; gated existing 6 video rules behind `isVideo`; added 7 image rules behind `isImage`
- **REFACTOR:** Not needed — code is clean and well-structured
- **Commits:**
  - `927e5a9` — test(12-01): add failing test for workTypeId + 7 image quality rules
  - `45e8577` — feat(12-01): add workTypeId parameter + 7 image quality rules to evaluatePromptQuality

### Task 2: Wire workTypeId through adapters.ts + verify backward compatibility

- Modified `adapters.ts` call site to pass `params.workType.id` as 4th argument
- Verified: all 130 src/ tests pass, `tsc --noEmit` reports zero errors
- **Commit:** `3f3ef97` — feat(12-01): wire workType.id through adapters.ts to evaluatePromptQuality

## 7 Image Rules Implemented

| # | Rule | Type | Condition |
|---|------|------|-----------|
| 1 | No subject selected | Completeness | `selections["subject"]` empty |
| 2 | Photorealistic + anime_manga | Conflict | Both in `selections["art_style"]` |
| 3 | Monochrome + vibrant color | Conflict | Both in `selections["color_palette"]` |
| 4 | Watercolor + sharp focus | Conflict | Watercolor + any of {photorealistic, photorealistic_render, macro_photography} |
| 5 | Multiple art mediums (3+) | Conflict | 3+ medium IDs in `selections["art_style"]` |
| 6 | Flat vector + volumetric lighting | Conflict | vector_flat + any volumetric lighting ID |
| 7 | 3D render + hand-drawn | Conflict | 3d_render + any of {pencil_sketch, line_art, marker_drawing, pastel_drawing} |

All rules produce bilingual (zh/en) amber warnings. None block copy or prompt generation.

## Verification Results

- **npx vitest run src/ --exclude '**/.claude/**':** 5 test files passed, 130 tests passed
- **npx tsc --noEmit:** Zero errors
- **Backward compat:** All existing tests pass without modification — undefined workTypeId = video rules only
- **Must-have verification:**
  - `evaluatePromptQuality()` accepts workTypeId parameter: YES
  - Video rules fire for `"video_prompt"` or `undefined`: YES
  - Image rules fire only for `"image_prompt"`: YES
  - 7 image rules produce amber warnings with zh/en text: YES
  - No image rule fires when conditions absent: YES (tested explicitly)
  - adapters.ts passes workType.id: YES

## Deviations from Plan

None — plan executed exactly as written. Two minor implementation clarifications:

1. **Volumetric lighting IDs:** Plan referenced `image_lighting:volumetric_backlight` and `image_lighting:dramatic_cross` as examples. Actual codebase IDs used: `image_lighting:volumetric_god_rays`, `image_lighting:hard_dramatic`, `image_lighting:rim_light`. This is per the plan's note that IDs are examples ("like...").

2. **Test file location:** Plan specified `src/lib/prompt/__tests__/heuristics.test.ts`. Co-located test convention (`src/lib/prompt/heuristics.test.ts`) used instead to match project pattern (`reducer.test.ts`, `registry.test.ts`, `validation.test.ts`).

## Threat Surface Scan

No new threat surface introduced. All image rules operate on internal UI state (`PromptSelections`) at the same trust boundary as existing video rules. No new network endpoints, file access patterns, or auth paths.

## Requirements Satisfied

- **QUAL-01:** Work-type-aware quality evaluation — `evaluatePromptQuality()` now gates rules by work type
- **QUAL-04:** 7 image heuristic rules for conflict detection and completeness checking

## Self-Check: PASSED

- SUMMARY.md: FOUND
- Commit 927e5a9 (RED): FOUND
- Commit 45e8577 (GREEN): FOUND
- Commit 3f3ef97 (adapters.ts): FOUND
- src/lib/prompt/heuristics.test.ts: FOUND
- src/lib/prompt/heuristics.ts: FOUND
- src/lib/prompt/adapters.ts: FOUND
