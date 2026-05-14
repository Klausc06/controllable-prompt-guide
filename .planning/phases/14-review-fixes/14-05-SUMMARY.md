---
phase: 14-review-fixes
plan: 05
subsystem: prompt-rendering
tags: [negative-prompt, tier-selector, user-control, state-management, tdd]
depends_on:
  - 14-04
provides:
  - D-12 negative prompt tier user-selectable
affects:
  - render-pipeline
  - state-management
  - ui-components
  - localStorage-persistence
tech-stack:
  added: []
  patterns:
    - "Optional parameter threading through render pipeline (negPromptTier?)"
    - "TDD: RED (failing tests) -> GREEN (implementation) commit pair"
    - "Threat model mitigation: localStorage value validated against literal union"
key-files:
  created: []
  modified:
    - src/lib/prompt/types.ts
    - src/lib/prompt/renderers/generic-image.renderer.ts
    - src/lib/prompt/adapters.ts
    - src/lib/prompt/reducer.ts
    - src/lib/prompt/reducer.test.ts
    - src/lib/prompt/validation.test.ts
    - src/components/prompt-guide.tsx
decisions:
  - "negPromptTier default medium preserves backward compatibility"
  - "Tier selector only appears for targets with negativePrompt config (future-proof)"
  - "URL does not persist negPromptTier (tier is not critical for sharing)"
  - "WORK_TYPE_CHANGED resets negPromptTier to medium"
  - "localStorage restore validates tier against literal union (T-14-05 mitigation)"
metrics:
  duration: "~12 minutes"
  completed_date: "2026-05-14"
---

# Phase 14 Plan 05: Negative Prompt Tier User-Selectable

**One-liner:** Made negative prompt tier user-selectable (light/medium/heavy) with UI selector, state management, localStorage persistence, and validated fallback -- D-12 resolved.

## Tasks

| # | Name | Type | Commit | Key Files |
|---|------|------|--------|-----------|
| 1 | Thread negPromptTier through render pipeline | auto | `bc30a7f` | types.ts, generic-image.renderer.ts, adapters.ts |
| 2 | Add negPromptTier state management and UI selector | auto (TDD) | `dd3c34e` (RED), `7f55d5b` (GREEN) | reducer.ts, reducer.test.ts, validation.test.ts, prompt-guide.tsx |

## Pipeline Flow

```
UI (radio group) -> dispatch SET_NEG_PROMPT_TIER -> state.negPromptTier
  -> renderPrompt({ ..., negPromptTier }) -> adapter.render(brief, negPromptTier)
  -> generic-image.renderer uses texts[tier] instead of texts[default]
```

## Changes Summary

### Task 1: Render Pipeline (1 commit, 3 files)
- **types.ts**: `TargetAdapter.render` now accepts optional `negPromptTier?: NegativePromptTier`
- **generic-image.renderer.ts**: Uses `negPromptTier || negConfig.default` instead of hardcoded default
- **adapters.ts**: `renderPrompt` accepts and forwards `negPromptTier` to adapter.render()
- Backward compatible: video renderers ignore the new optional parameter, existing callers (no tier) fall back to "medium"

### Task 2: State Management + UI (2 commits, 4 files)
- **reducer.ts**: `PromptGuideState.negPromptTier`, `SET_NEG_PROMPT_TIER` action, `WORK_TYPE_CHANGED` reset
- **reducer.test.ts**: 4 new reducer tests covering light/heavy set, medium default init, reset on work type switch
- **validation.test.ts**: 2 new integration tests verifying tier text injection (light excludes medium+ terms, heavy includes heavy-only terms)
- **prompt-guide.tsx**: Three-button radio group in advanced section (light/medium/heavy), bilingual labels, helper text per tier, localStorage persistence with validated restore (T-14-05 mitigation), conditional rendering only for targets with `negativePrompt` config

## Test Results

- **Before**: 142 pass / 5 pre-existing failures / 147 total
- **After**: 148 pass / 5 pre-existing failures / 153 total
- **New tests**: 6 (4 reducer + 2 integration) -- all passing
- **TypeScript**: `tsc --noEmit` clean (0 errors)

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Integration test assertion used tier-ambiguous terms**
- **Found during:** Task 2 TDD GREEN phase
- **Issue:** Test 5 asserted "畸形" NOT appearing in light-tier output, but this term also appears in constraint option promptFragments (e.g., `image_constraints:no_bad_anatomy`). The constraint text was conflated with negative prompt text.
- **Fix:** Changed assertions to use tier-unique markers: "水印" (medium+ only, not in constraints) and "混沌背景" (heavy-only, not in constraints).
- **Files modified:** src/lib/prompt/validation.test.ts
- **Commit:** `dd3c34e` (caught and fixed before GREEN commit)

## Threat Flags

None -- no new attack surface beyond planned surface. T-14-05 mitigation (localStorage tier validation) implemented in `readFromLocalStorage`. T-14-06 accepted (TypeScript literal union provides compile-time safety; runtime falls back to default on invalid).

## Self-Check

### Files Exist
- FOUND: src/lib/prompt/types.ts (modified)
- FOUND: src/lib/prompt/renderers/generic-image.renderer.ts (modified)
- FOUND: src/lib/prompt/adapters.ts (modified)
- FOUND: src/lib/prompt/reducer.ts (modified)
- FOUND: src/lib/prompt/reducer.test.ts (modified)
- FOUND: src/lib/prompt/validation.test.ts (modified)
- FOUND: src/components/prompt-guide.tsx (modified)

### Commits Exist
- FOUND: bc30a7f -- feat(14-review-fixes-05): thread negPromptTier through render pipeline
- FOUND: dd3c34e -- test(14-review-fixes-05): add failing tests for negPromptTier state management and render pipeline
- FOUND: 7f55d5b -- feat(14-review-fixes-05): add negPromptTier state management and UI selector

### Verification
- tsc --noEmit: PASSED (0 errors)
- vitest run: PASSED (148/153, 5 pre-existing failures unchanged)
- All new tests pass

## Self-Check: PASSED
