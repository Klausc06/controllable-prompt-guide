---
phase: 07-integration-testing
plan: 01
subsystem: testing
tags: [integration-testing, json-brief, copy-payload, clipboard, vitest]
requires: []
provides: [TEST-10, TEST-11]
affects: [src/lib/prompt/validation.test.ts, src/components/prompt-guide.test.tsx]
tech-stack:
  added: []
  patterns: [parameterized-tests, describe-wrapping, clipboard-mock-assertion]
key-files:
  created: []
  modified:
    - src/lib/prompt/validation.test.ts
    - src/components/prompt-guide.test.tsx
decisions:
  - "D-01: Extended TEST-10 to parameterized describe covering seedance, generic_video, veo3"
  - "D-02: Replaced TEST-11 button-existence checks with clipboard payload content-correctness verification"
metrics:
  duration: "~3 minutes"
  completed_date: 2026-05-13
---

# Phase 7 Plan 1: JSON Brief & Copy Payload Integration Tests Summary

**One-liner:** Extended TEST-10 to all 3 targets and replaced TEST-11 with clipboard payload content-correctness assertions.

## Tasks Executed

| # | Task | Type | Commit | Status |
|---|------|------|--------|--------|
| 1 | Extend TEST-10 JSON brief test to cover all 3 targets | test (tdd) | `1ea2e82` | complete |
| 2 | Add copy payload content-correctness tests (TEST-11) | test (tdd) | `1a65aed` | complete |

## What Changed

### Task 1: TEST-10 — JSON brief across all 3 targets

**File:** `src/lib/prompt/validation.test.ts` (+42/-8 lines)

Replaced the single seedance-only `it("JSON brief is parseable...")` with a `describe("JSON brief (TEST-10)")` block containing 4 tests:

- **seedance target** — `JSON.parse(JSON.stringify(brief))` succeeds, `workTypeId`, `targetToolId`, `items` verified
- **generic_video target** — same pattern with `targetToolId: "generic_video"`
- **veo3 target** — same pattern with `targetToolId: "veo3"`
- **cross-target distinctness** — `new Set([...3 targetToolIds...]).size === 3` proves all 3 targets produce unique briefs

All 4 tests pass against existing `renderPrompt()` — no production code changes needed. The renderers already produce valid JSON briefs for all targets.

### Task 2: TEST-11 — Copy payload content verification

**File:** `src/components/prompt-guide.test.tsx` (+55/-5 lines)

Replaced the button-existence-only `it("copy buttons expose correct payload content (TEST-11)")` with a `describe("copy payload content (TEST-11)")` block containing 5 tests:

- **all 4 copy buttons are rendered** — preserves button-existence assertions
- **复制中文 payload** — clicks button, asserts `navigator.clipboard.writeText` called with string > 50 chars containing `"生成一段"`
- **复制英文 payload** — clicks button, asserts clipboard payload contains `"Generate"`
- **复制 JSON payload** — clicks button, asserts `JSON.parse(callArg)` succeeds and has `workTypeId`, `targetToolId`, `items`
- **复制 Markdown payload** — clicks button, asserts payload contains `"# Video Prompt Brief"` and `"| Dimension | Selection |"`

Mock strategy: Uses existing `beforeEach` mock of `navigator.clipboard.writeText` via `vi.fn().mockResolvedValue(undefined)`. Each `it` clicks one button and inspects `mock.calls[0][0]`.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed enPrompt assertion: "Video Prompt" not found in rendered output**
- **Found during:** Task 2 (GREEN phase)
- **Issue:** Test asserted `callArg.toContain("Video Prompt")` but the default Seedance enPrompt starts with "Generate a 9:16 vertical..." and does not contain that literal string
- **Fix:** Changed assertion to `callArg.toContain("Generate")` which reliably matches the enPrompt output
- **Files modified:** `src/components/prompt-guide.test.tsx`
- **Commit:** `1a65aed`

## Verification

- `npm test` — 109 tests pass (0 failures), up from 102 baseline
- validation.test.ts: 46 tests (was 43, +3 from parameterized TEST-10)
- prompt-guide.test.tsx: 23 tests (was 19, +4 from expanded TEST-11)

## Known Stubs

None. All tests exercise real code paths with full assertions — no placeholder data, no mock-only paths.

## Threat Flags

None. Both test files operate entirely within the existing trust boundaries documented in the plan's threat model (jsdom with mocked clipboard, no real network or clipboard access).

## Self-Check: PASSED

- [x] `src/lib/prompt/validation.test.ts` exists and was modified
- [x] `src/components/prompt-guide.test.tsx` exists and was modified
- [x] Commit `1ea2e82` exists: test(07-01): extend TEST-10 JSON brief to all 3 targets
- [x] Commit `1a65aed` exists: test(07-01): add copy payload content-correctness tests (TEST-11)
- [x] `npm test` exits 0 with 109 tests passing
