---
phase: 07-integration-testing
plan: 03
subsystem: testing
tags: [vitest, react-testing-library, smoke-test, manual-qa]

# Dependency graph
requires:
  - phase: 07-integration-testing
    provides: "Existing TEST-15 stub test and component structure from phases 01-06"
provides:
  - "Enhanced TEST-15 automated smoke test covering full user journey (3-target round-trip, 4 copy buttons, advanced toggle)"
  - "Manual browser smoke test procedure document (VERIFICATION.md) with 8-step reproducible QA checklist"
affects: []

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "describe() block nesting for test categories (browser smoke grouping)"
    - "console.spyOn pattern for error/warn silence verification"

key-files:
  created:
    - ".planning/phases/07-integration-testing/VERIFICATION.md"
  modified:
    - "src/components/prompt-guide.test.tsx"

key-decisions:
  - "Used 'Veo 3 (Google)' label to match actual target config label (not 'Veo 3' as plan interfaces suggested)"
  - "Kept act() warnings as acceptable stderr noise — they do not cause console.error spy failures"

patterns-established:
  - "TEST-15 smoke: console.error spy → render → full user journey → spy.assert"

requirements-completed: [TEST-15]

# Metrics
duration: 3min
completed: 2026-05-13
---

# Phase 07 Plan 03: TEST-15 Smoke Test Strengthening Summary

**Enhanced console-error smoke test covering full user journey + documented manual browser QA procedure**

## Performance

- **Duration:** 3 min
- **Started:** 2026-05-13T11:24:12Z
- **Completed:** 2026-05-13T11:27:39Z
- **Tasks:** 2
- **Files modified:** 2

## Accomplishments
- Automated TEST-15 now covers render, switch to all 3 targets (Seedance -> Generic -> Veo 3 -> Seedance round-trip), open advanced, and all 4 copy button clicks — verifying zero console errors throughout
- Second automated test verifies no excessive console warnings on basic smoke path
- Manual browser smoke test document (VERIFICATION.md) with 8-step reproducible checklist, prerequisites, failure criteria, and dated results table

## Task Commits

Each task was committed atomically:

1. **Task 1: Strengthen automated TEST-15 console error smoke test** - `fea5bed` (test)
2. **Task 2: Create manual browser smoke test VERIFICATION.md** - `ccde262` (docs)

## Files Created/Modified
- `src/components/prompt-guide.test.tsx` - Replaced single-target TEST-15 with describe block containing 2 tests: full user journey without console errors, and console warnings check
- `.planning/phases/07-integration-testing/VERIFICATION.md` - 106-line manual smoke test document with 8-step checklist, prerequisites, failure criteria, and results table

## Decisions Made
- Used `"Veo 3 (Google)"` label in test instead of `"Veo 3"` — the plan's interface hints had the wrong label; the actual target config uses the full label including `(Google)`
- React `act()` warnings from CopyButton state changes are acceptable stderr noise — they do not trigger the `console.error` spy, so tests pass correctly

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed incorrect Veo target button label in test**
- **Found during:** Task 1 (TEST-15 smoke test expansion)
- **Issue:** Plan interfaces specified `screen.getByText("Veo 3")` but actual target config uses `"Veo 3 (Google)"` — test failed with "Unable to find an element with the text: Veo 3"
- **Fix:** Changed test to use `screen.getByText("Veo 3 (Google)")` matching the actual `veo3.target.ts` label
- **Files modified:** `src/components/prompt-guide.test.tsx`
- **Verification:** All 52 tests pass (8/8 in prompt-guide.test.tsx)
- **Committed in:** `fea5bed` (Task 1 commit)

---

**Total deviations:** 1 auto-fixed (1 bug)
**Impact on plan:** Minimal — label correction was necessary for test correctness. No scope change.

## Issues Encountered
None — tasks executed smoothly after label fix.

## User Setup Required
None — no external service configuration required. Manual smoke test procedure in VERIFICATION.md requires only `npm run dev` and a browser.

## Next Phase Readiness
- TEST-15 requirement is now fully addressed with both automated and manual verification coverage
- All 8 phases already marked complete in STATE.md and ROADMAP.md per prior inline execution

## Self-Check: PASSED

- FOUND: `.planning/phases/07-integration-testing/VERIFICATION.md`
- FOUND: `.planning/phases/07-integration-testing/07-03-SUMMARY.md`
- FOUND: `src/components/prompt-guide.test.tsx`
- FOUND: commit `fea5bed`
- FOUND: commit `ccde262`
- 52/52 tests passing, zero failures

---
*Phase: 07-integration-testing*
*Plan: 03*
*Completed: 2026-05-13*
