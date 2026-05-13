---
phase: 06-quality-intelligence
plan: 02
subsystem: prompt-quality
tags: [suggests, heuristics, tests, use-case, smart-defaults]
completed: 2026-05-13T09:19:41Z
duration: ~10m
tasks_completed: 2
tests_added: 8
test_count: 98
requires: ["06-01"]
provides: [suggests-data, heuristic-tests, suggests-validation-tests]
affects: []
tech-stack:
  added: []
  patterns: [config-driven-suggests, data-validated-by-test]
key-files:
  created: []
  modified:
    - src/lib/prompt/options/use-case.options.ts
    - src/lib/prompt/validation.test.ts
decisions:
  - "Suggests mappings sourced from RESEARCH.md complete mapping table — 7 core visual dimensions per use case"
  - "Camera movement multi-select values use string arrays (not comma-separated strings) to match heuristics code"
  - "Tests added as verification of already-implemented 06-01 code — no new production code needed"
---

# Phase 6 Plan 2: Smart Defaults Data and Heuristic Test Coverage Summary

**One-liner:** Populated 105 suggests mappings across 15 use case options with research-backed data, and added 8 test cases covering new heuristic rules and suggests field integrity validation.

## What Was Built

### Task 1: Suggests Mappings Data

Added `suggests` field to all 15 use case options in `use-case.options.ts`. Each mapping contains 7 dimension keys (subject, scene, shot_type, camera_movement, lighting, style, motion), each pointing to an array of valid option IDs. Mappings sourced directly from the RESEARCH.md complete mapping table, derived from Seedance 6-step formula alignment, cinematography conventions, and 2000+ curated community prompts.

**Key data points:**
- 15 use case options x 7 dimensions = 105 total suggests entries
- All option IDs use dimension-prefixed format (e.g., `subject:space_environment`, `scene:gym_sports_venue`)
- Values wrapped in arrays `["id"]` for future multi-suggest compatibility
- Placed consistently after `appliesTo`, before `riskHint` in each option

### Task 2: Heuristic and Validation Tests

Added 8 new test cases to `validation.test.ts`, split into two blocks:

**Quality heuristics tests (6 tests):**
- No-subject warning (positive and negative cases)
- Static + movement conflict warning for Seedance (positive and negative cases)
- Cross-target verification (Seedance-specific rule does not fire for generic_video)

**Suggests data validation tests (2 tests):**
- All suggests keys reference valid `QuestionId` values from the registry
- All suggests values are non-empty arrays of strings

## Verification Results

- **TypeScript:** `npx tsc --noEmit` — clean, zero errors
- **Validation tests:** `npx vitest run src/lib/prompt/validation.test.ts` — 43/43 passed
- **Full suite:** `npm test` — 98/98 passed (4 test files, zero regressions)
- **Lint:** `npm run lint` — clean
- **Build:** `npm run build` — success (static export to `out/`)

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Camera movement multi-select values used string instead of array format**
- **Found during:** Task 2 TDD RED phase
- **Issue:** Tests initially used comma-separated strings like `"camera_movement:static_locked,camera_movement:slow_push_in"` for multi-select camera_movement values. The heuristics code treats strings as single values (via `typeof === "string" ? [value].filter(Boolean)`), so the comma-separated string was treated as one opaque element — `includes("camera_movement:static_locked")` returned false.
- **Fix:** Changed multi-select camera_movement values to proper string arrays: `["camera_movement:static_locked", "camera_movement:slow_push_in"]`
- **Files modified:** `src/lib/prompt/validation.test.ts` (3 test fixtures)

### Execution Notes

**TDD bypass:** The plan specifies `tdd="true"` but the implementation code (heuristics rules 5 and 6) already existed from plan 06-01. Tests were written as verification tests — they passed immediately on first run (after the array format fix). No separate GREEN/REFACTOR commits needed beyond the test commit.

**Base rebase:** Worktree was at commit `181ac03` which did not contain the 06-01 changes. Fast-forwarded to `442aad0` (target base) to bring in `b514b72` (suggests type) and `aac2d62` (heuristic rules 5-6).

## Known Stubs

- **`riskHint: { zh: "", en: "" }`** on all 15 use case options — empty risk hints were added by plan 06-01 as structural placeholders. Not populated by 06-02 (out of scope for this plan). Future plan may populate these with use-case-specific risk guidance.

## Threat Flags

None. The `suggests` field is static configuration data with no new network endpoints, auth paths, or file access patterns. Both threat items in the plan's threat model (T-06-04 and T-06-05) are mitigated by the suggests validation tests added in Task 2.

## Commits

| Hash | Type | Message |
|------|------|---------|
| `dc4b249` | feat | feat(06-02): add suggests mappings to all 15 use case options |
| `ee95588` | test | test(06-02): add tests for heuristic rules 5-6 and suggests field validation |

## Self-Check

- [x] `src/lib/prompt/options/use-case.options.ts` — 15 suggests mappings present, typecheck clean
- [x] `src/lib/prompt/validation.test.ts` — 8 new tests added, all passing
- [x] Commit `dc4b249` — verified in git log
- [x] Commit `ee95588` — verified in git log
- [x] Full test suite: 98/98 passing, zero regressions
