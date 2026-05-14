---
phase: 14-review-fixes
plan: 01
subsystem: testing
tags: [vitest, typescript, dead-code, heuristics, adapter-registry]

# Dependency graph
requires: []
provides:
  - vitest config excludes .claude/worktrees from test discovery (D-01)
  - adapters.ts independently registers all 4 adapters including veo3 (D-02)
  - dead getImageOptionSet/getImageOptionById removed from image barrel (D-06)
  - heuristics.test.ts uses real option ID no_ip_celebrity (D-07)
affects: []

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "File-content static tests for config/code structure verification (TDD RED phase)"
    - "Side-effect import registration tested via source analysis when runtime isolation unavailable"

key-files:
  created:
    - src/lib/prompt/adapters.test.ts
  modified:
    - vitest.config.ts
    - src/lib/prompt/adapters.ts
    - src/lib/prompt/options/image/index.ts
    - src/lib/prompt/heuristics.test.ts

key-decisions:
  - "TDD RED tests use static file-content assertions for config/import checks when runtime test isolation is limited by global setupFiles"
  - "Default vitest exclude includes node_modules but .claude/worktrees had no exclusion, causing 36 false test failures"
  - "Registry functions (getOptionSet, getOptionById) are the canonical lookup; barrel-level duplicates shadow the registry and mislead contributors"

patterns-established: []

requirements-completed:
  - RVW-01
  - RVW-02
  - RVW-06
  - RVW-07

# Metrics
duration: 8min
completed: 2026-05-14
---

# Phase 14 Plan 01: Critical Defect Fixes (D-01, D-02, D-06, D-07) Summary

**Vitest worktree exclusion, veo3 adapter self-sufficiency, dead barrel export removal, and wrong heuristics test data fix**

## Performance

- **Duration:** ~8 min
- **Started:** 2026-05-14T05:03:17Z
- **Completed:** 2026-05-14T05:11:00Z
- **Tasks:** 2
- **Files modified:** 5

## Accomplishments

- D-01: vitest.config.ts now excludes `.claude/**` from test discovery, eliminating 36 false failures from stale worktree snapshot copies
- D-02: adapters.ts imports veo3.renderer via side-effect — all 4 adapters now independently registered without dependency on init.ts
- D-06: Removed dead `getImageOptionSet()`, `getImageOptionById()`, and `imageOptionSetById` from options/image/index.ts (zero callers; registry is canonical lookup)
- D-07: Fixed heuristics.test.ts `validImageSelections` to use real option ID `image_constraints:no_ip_celebrity` instead of non-existent `image_constraints:no_celebrity_likeness`

## Task Commits

Each task was committed atomically:

1. **Task 1 (RED): Add failing tests for D-01 and D-02** - `b4febda` (test)
2. **Task 1 (GREEN): Fix vitest worktree exclusion and veo3 adapter import** - `ebe82b4` (feat)
3. **Task 2: Remove dead barrel exports and fix wrong test option ID** - `964ddc9` (feat)

_Plan 14-01 was interleaved with Plan 14-02 commits in the git history (pre-existing). The three commits above are the 14-01 execution._

## Files Created/Modified

- `src/lib/prompt/adapters.test.ts` — New test: verifies all 4 renderers imported in adapters.ts and vitest config has .claude/ exclude (3 tests)
- `vitest.config.ts` — Added `exclude: [".claude/**", "**/node_modules/**"]` to test config (D-01)
- `src/lib/prompt/adapters.ts` — Added `import "./renderers/veo3.renderer"` between generic-video and generic-image (D-02)
- `src/lib/prompt/options/image/index.ts` — Removed 17 lines of dead exports (imageOptionSetById, getImageOptionSet, getImageOptionById) plus unused OptionItem import (D-06)
- `src/lib/prompt/heuristics.test.ts` — Changed line 14 from `no_celebrity_likeness` to `no_ip_celebrity` (D-07)

## Decisions Made

- TDD RED tests use static file-content assertions for config/import verification when runtime test isolation is limited by global vitest setupFiles importing init.ts
- All 4 adapter imports in adapters.ts now match the order in init.ts: seedance, generic-video, veo3, generic-image

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 2 - Missing Critical] Removed unused OptionItem type import after dead code removal**
- **Found during:** Task 2 (D-06 dead barrel export removal)
- **Issue:** `OptionItem` type was imported only for the removed `getImageOptionById` function signature. After removal, it became an unused import.
- **Fix:** Removed `OptionItem` from the type import, keeping only `OptionSet` (still used by `satisfies OptionSet[]`)
- **Files modified:** src/lib/prompt/options/image/index.ts
- **Verification:** `npx tsc --noEmit` passes with zero errors
- **Committed in:** 964ddc9 (Task 2 commit)

---

**Total deviations:** 1 auto-fixed (Rule 2 - missing critical)
**Impact on plan:** Minor cleanup necessary for type safety. No scope creep.

## Issues Encountered

None.

## User Setup Required

None — no external service configuration required.

## Next Phase Readiness

- Plan 14-01 defects are fixed. Remaining plans (14-02 through 14-05) address additional review findings (D-03, D-04, D-05, D-08, D-09, D-10, D-11).
- 5 pre-existing test failures from Phase 13 remain (unchanged by this plan).
- TypeScript compilation: 0 errors.

---
## Self-Check: PASSED

- `/Users/klaus/controllable-prompt-guide/.planning/phases/14-review-fixes/14-01-SUMMARY.md` — FOUND
- `vitest.config.ts` — FOUND (exclude property present)
- `src/lib/prompt/adapters.ts` — FOUND (veo3 import present)
- `src/lib/prompt/options/image/index.ts` — FOUND (dead exports removed)
- `src/lib/prompt/heuristics.test.ts` — FOUND (no_ip_celebrity)
- `src/lib/prompt/adapters.test.ts` — FOUND (3 tests)
- Commits: b4febda, ebe82b4, 964ddc9 — all FOUND in git log

---
*Phase: 14-review-fixes*
*Completed: 2026-05-14*
