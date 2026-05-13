---
phase: 06-quality-intelligence
plan: 03
subsystem: ui
tags: [react, vitest, testing-library, lucide-react, suggestion-badges, use-memo]

# Dependency graph
requires:
  - phase: 06-01
    provides: "OptionItem.suggests field type (Record<string, string[]>)"
  - phase: 06-02
    provides: "Use case options with populated suggests data (15 options x ~7 dimensions each)"
provides:
  - "OptionCard renders amber/gold Star suggestion badge on recommended options"
  - "QuestionBlock computes suggestedIds via useMemo from use_case selections"
  - "CategoryTabs accepts suggestedIds prop and passes to OptionCard"
  - "Component tests for badge rendering, amber styling, non-auto-selection, coexistence"
affects: [phase-07-output-enhancement, prompt-guide-ux, ui-testing]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Visual advisory badge pattern — amber/gold star + '推荐' label, distinct from teal consumer tags and indigo usageHint"
    - "Set-based ID computation via useMemo for O(1) lookup performance"
    - "Props threading — computation at QuestionBlock, passed through CategoryTabs to OptionCard"

key-files:
  created: []
  modified:
    - src/components/prompt-guide.tsx
    - src/components/prompt-guide.test.tsx

key-decisions:
  - "Star icon from lucide-react existing dependency — no new package needed"
  - "Amber-50/amber-700/amber-200 palette — visually distinct from teal-700 (consumer tags) and indigo-700 (usageHint)"
  - "Set<string> for suggestedIds — O(1) lookup per OptionCard, clean union semantics"

patterns-established:
  - "Suggestion badges are purely advisory — no auto-selection, user retains full agency"
  - "Badges coexist with manual selections and persist across interactions"

requirements-completed: [DIFF-03]

# Metrics
duration: 6min
completed: 2026-05-13
---

# Phase 06 Plan 03: Wire Suggestion Badges into PromptGuide UI Summary

**Amber star "推荐" suggestion badges on OptionCard driven by use_case suggests data, with 4 component tests verifying rendering, amber styling, non-auto-selection, and coexistence.**

## Performance

- **Duration:** 6 min
- **Started:** 2026-05-13T09:24:17Z
- **Completed:** 2026-05-13T09:29:53Z
- **Tasks:** 2
- **Files modified:** 2

## Accomplishments
- OptionCard renders amber/gold star badge with "推荐" label when option is in suggestedIds
- QuestionBlock computes suggestedIds via useMemo from selected use_case options' suggests fields
- CategoryTabs receives suggestedIds as prop and passes suggested boolean to OptionCard in both rendering modes
- 4 new component tests pass: badge rendering, amber styling verification, non-auto-selection, coexistence
- Zero regressions — all 102 tests pass, TypeScript clean, ESLint 0 errors

## Task Commits

Each task was committed atomically:

1. **Task 1: Render suggestion badges on OptionCard when use case is selected** - `1a6e857` (feat)
2. **Task 2: Add component tests for suggestion badges** - `4d0e1e0` (test)

## Files Created/Modified
- `src/components/prompt-guide.tsx` — Added Star icon import, suggested prop to OptionCard, amber badge JSX, suggestedIds useMemo in QuestionBlock, suggestedIds prop to CategoryTabs, suggested prop in all 3 OptionCard render locations (+38/-6 lines)
- `src/components/prompt-guide.test.tsx` — Added describe block with 4 tests: badge rendering, amber styling, non-auto-selection, coexistence (+51 lines)

## Decisions Made
None — followed plan exactly as specified. All design decisions (amber palette, Star icon, Set-based computation, props threading) were specified in the plan.

## Deviations from Plan
None — plan executed exactly as written.

## Issues Encountered
None.

## User Setup Required
None — no external service configuration required.

## Next Phase Readiness
- Suggestion badges are user-facing deliverable for DIFF-03 — complete and verified
- Ready for visual smoke test: `npm run dev`, visit http://localhost:3000, verify amber star badges appear when gym_opening is pre-selected
- Future plans can build on the suggestedIds computation and OptionCard suggested prop for additional suggestion-driven features (e.g., suggestion-based sorting, suggestion count display)

---
## Self-Check: PASSED

- SUMMARY.md exists at .planning/phases/06-quality-intelligence/06-03-SUMMARY.md
- Commit `1a6e857` (Task 1) verified in git log
- Commit `4d0e1e0` (Task 2) verified in git log

---
*Phase: 06-quality-intelligence*
*Completed: 2026-05-13*
