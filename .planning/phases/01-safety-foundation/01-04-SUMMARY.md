---
phase: 01-safety-foundation
plan: 04
subsystem: safety-defaults
tags: [safety, ux, state-management, react-ref]
requires:
  - ARCH-07
provides:
  - safety-default-deselection-tracking
affects:
  - src/components/prompt-guide.tsx
  - src/components/prompt-guide.test.tsx
tech-stack:
  added: []
  patterns:
    - "useRef<Set<string>> for tracking explicit user intent across renders without triggering re-renders"
    - "Functional setState callback with prev-vs-new comparison for detecting state transitions"
key-files:
  created: []
  modified:
    - src/components/prompt-guide.tsx
    - src/components/prompt-guide.test.tsx
decisions:
  - "Track deselections in updateSelection by comparing old/new constraint arrays against current target safetyDefaults"
  - "Filter deselected safety defaults from target switch auto-merge via deselectedSafetyRef.current.has()"
  - "Auto-clear ref entry when user re-selects a previously deselected safety default on the same target"
metrics:
  duration: "~4 minutes"
  completed_date: "2026-05-11"
---

# Phase 01 Plan 04: Safety Default Deselection Tracking

Preserve user deselection intent for safety defaults across target switches using `useRef<Set<string>>`.

## What Changed

The prompt guide's target switch handler previously merged all safety defaults unconditionally. If a user explicitly deselected a safety default constraint, switching to another target and back would silently re-add it — erasing the user's intent.

**Fix:** A `useRef<Set<string>>` (`deselectedSafetyRef`) now tracks which safety defaults the user has explicitly deselected. When switching targets, the auto-merge skips any safety default present in this set. If the user re-selects a previously deselected safety default, it is removed from the set.

### Changes in `prompt-guide.tsx`

1. **`deselectedSafetyRef`** (line 203): `useRef<Set<string>>(new Set())` persists deselected safety default IDs across renders without triggering re-renders.

2. **`updateSelection`** (lines 223-240): When the constraints question changes, compares old vs new selection arrays against the current target's `safetyDefaults`. Detects deselections (adds to ref) and re-selections (removes from ref).

3. **Target switch handler** (lines 314-323): Filters `tool.safetyDefaults` through `deselectedSafetyRef` so only non-deselected defaults are merged into the constraints array.

### Test Coverage

Added `"preserves safety default deselection across target switches (ARCH-07)"` to `prompt-guide.test.tsx`:
- Deselects a safety default on Seedance
- Switches to Generic Video and back
- Asserts the deselected option does NOT appear in the Brief output section

## Verification

| Check | Result |
|-------|--------|
| `npx tsc --noEmit` | Pass (zero errors) |
| `npm test` (52/52) | Pass |
| `npx next build` | Pass (static export OK) |
| `npx next lint` | Pass (no warnings) |

## Deviations from Plan

None — plan executed exactly as written.

## Self-Check: PASSED

- `src/components/prompt-guide.tsx` — exists and modified
- `src/components/prompt-guide.test.tsx` — exists and modified
- Commit `d2de45b` — feat(01-safety-foundation): track deselected safety defaults with useRef<Set<string>>
- Commit `eef1057` — test(01-safety-foundation): verify safety default deselection persists across target switches
- `.planning/phases/01-safety-foundation/01-04-SUMMARY.md` — created
