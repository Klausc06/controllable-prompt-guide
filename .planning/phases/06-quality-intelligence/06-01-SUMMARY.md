---
phase: 06-quality-intelligence
plan: 01
subsystem: quality
tags: [typescript, heuristics, prompt-quality, suggests]

# Dependency graph
requires: []
provides:
  - OptionItem.suggests type field (Record<string, string[]>)
  - 6 heuristic rules in evaluatePromptQuality (4 existing + 2 new)
affects: [06-02, 06-03]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - Additive heuristics as pure functions over PromptSelections
    - Optional config fields on OptionItem with JSDoc constraints
    - Target-gated warning rules inside existing target filter block

key-files:
  created: []
  modified:
    - src/lib/prompt/types.ts
    - src/lib/prompt/heuristics.ts

key-decisions: []

patterns-established: []

requirements-completed: [DIFF-02, DIFF-03, RES-01, RES-02]

# Metrics
duration: 3 min
completed: 2026-05-13
---

# Phase 06 Plan 01: Quality Intelligence Foundation Summary

**OptionItem extended with suggests field for smart defaults; heuristics expanded to 6 rules including no-subject and static-motion conflict detection**

## Performance

- **Duration:** 3 min
- **Started:** 2026-05-13T08:59:41Z
- **Completed:** 2026-05-13T09:03:07Z
- **Tasks:** 2
- **Files modified:** 2

## Accomplishments

- Added `suggests?: Record<string, string[]>` field to `OptionItem` type with JSDoc documenting the core visual dimensions constraint (D-07)
- Added Rule 5: no subject specified warning (target-agnostic, cites 5 research sources)
- Added Rule 6: static_locked + camera movement conflict warning (Seedance-targeted, cites 4 research sources)
- All 4 existing heuristic rules preserved untouched — logic, conditions, and warning texts unchanged
- TypeScript compilation passes with zero errors; all 90 tests pass with no regressions

## Task Commits

Each task was committed atomically:

1. **Task 1: Add suggests field to OptionItem type** - `b514b72` (feat)
2. **Task 2: Add Rule 5 (no subject) and Rule 6 (static+motion conflict) to heuristics** - `aac2d62` (feat)

## Files Modified

- `src/lib/prompt/types.ts` — Added `suggests?: Record<string, string[]>` field to `OptionItem` interface after `usageHint`, with JSDoc documenting that it is only populated on use_case options for 7 core visual dimensions
- `src/lib/prompt/heuristics.ts` — Extended `evaluatePromptQuality()` from 4 to 6 rules. Rule 5 (no subject) inserted after Rule 1 (lighting); Rule 6 (static+motion conflict) inserted inside the Seedance-targeted block after Rule 4 (no audio). Rule ordering: 1, 5, 2, 4, 6, 3.

## Decisions Made

None — followed plan exactly as specified.

## Deviations from Plan

None — plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None — no external service configuration required.

## Next Phase Readiness

Ready for Plan 06-02 (populate suggests data on use_case options and add validation tests). The `suggests` type field is in place; Plan 06-02 will populate it with the 15 use-case-to-option mappings documented in 06-RESEARCH.md.

---
*Phase: 06-quality-intelligence*
*Completed: 2026-05-13*
