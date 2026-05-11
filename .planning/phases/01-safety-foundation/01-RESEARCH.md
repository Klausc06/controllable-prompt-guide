# Phase 01: Safety Foundation - Additional Plans Research

**Researched:** 2026-05-11
**Domain:** Safety constraint injection, validation infrastructure, configuration integrity
**Confidence:** HIGH

## Summary

Phase 01 (Safety Foundation) already has two plans: 01-01 (add safety constraints + static export) and 01-02 (safetyDefaults injection, auto-select, TEST-08). Both have been executed -- the code is present in the source tree. This research identifies what safety/foundational work remains uncovered within the Phase 01 scope boundary.

**Primary recommendation:** Add 3 additional plans: (1) CI validation rule for safetyDefaults ID integrity, (2) safety default deselection tracking to respect D-01 explicit deselection, (3) cross-target safety testing for Generic Video and Veo 3 targets.

## What Existing Plans Cover

### 01-01: Safety Constraints + Static Export (EXECUTED)
- Adds `avoid_temporal_flicker` and `avoid_quality_keywords` to `constraints.options.ts` with `appliesTo: ["seedance"]`
- Enables static export via `output: "export"` in `next.config.ts`
- Requirements: OPT-04, D-03

### 01-02: SafetyDefaults Injection + Auto-Select + TEST-08 (EXECUTED)
- Modifies `adapters.ts`: checks `target.safetyDefaults` against selected constraints, appends amber warning for missing ones
- Modifies `prompt-guide.tsx`: merges `tool.safetyDefaults` into constraints on target switch
- Adds TEST-08 assertions: (A) Seedance output contains safety constraint text, (B) deselected safety defaults produce warnings
- Requirements: ARCH-07, TEST-08

## Gaps Identified

### Gap 1: No CI Validation for safetyDefaults Option ID Integrity

**The problem:** `validateTargetConfig()` in `validation.ts` checks that `prefer` is non-empty and `adaptationNote` is localized, but does NOT check that `safetyDefaults` option IDs resolve to valid options in any catalog. A typo in a `safetyDefaults` array (e.g., `"no_celebrity"` instead of `"no_ip_or_celebrity"`) would:
1. Pass all existing CI validation (no check exists)
2. Not crash at runtime (`getOptionById` returns `undefined`, filtered out by `buildPromptBrief`)
3. Produce a false warning "safety defaults deselected" even though they were never selected
4. Leave the user with no actual safety protection

**Current state:** `validation.ts` has 4 validation functions. None cross-reference `TargetToolConfig.safetyDefaults` against option catalogs. The existing `validateTargetConfig` only checks `prefer` length and `adaptationNote` localization.

**Severity:** HIGH -- silent safety degradation with no CI catch.

### Gap 2: Safety Default Deselection Lost on Target Re-Switch

**The problem:** Per D-01 (from CONTEXT.md): "If user explicitly deselects a safety default, respect the deselection but show an amber warning." The current implementation in `prompt-guide.tsx` lines 300-303 does:

```typescript
setSelections((current) => {
  const currentConstraints = selectionArray(current.constraints);
  const merged = [...new Set([...currentConstraints, ...tool.safetyDefaults])];
  return { ...current, constraints: merged };
});
```

This **always** merges safety defaults into constraints. If a user:
1. Opens Seedance target → auto-selects `["no_ip_or_celebrity", "stable_identity", "readable_text"]`
2. Deselects `readable_text` (gets amber warning -- correct per D-01)
3. Switches to Generic Video → auto-selects `["no_ip_or_celebrity", "stable_identity"]`
4. Switches back to Seedance → `readable_text` is **re-added** to constraints

The user's explicit deselection is lost. There is no mechanism to track "user explicitly deselected these safety defaults." The Set dedup prevents duplicates within a single target switch but does not preserve deselection intent across switches.

**Severity:** MEDIUM -- D-01 explicit deselection contract is violated on re-switch.

### Gap 3: TEST-08 Only Covers Seedance Target

**The problem:** `validation.test.ts` TEST-08 assertions only test the Seedance target:

```typescript
it("includes safety constraint text in Seedance output (TEST-08)", () => {
  const result = renderPrompt({ ..., targetToolId: "seedance", ... });
  expect(result.zhPrompt).toContain("不使用明星脸");
  // ... Seedance-specific assertions
});
```

But:
- `genericVideoTarget` has `safetyDefaults: ["no_ip_or_celebrity", "stable_identity"]`
- `veo3Target` has `safetyDefaults: ["no_ip_or_celebrity", "stable_identity"]`
- The `adapters.ts` safety-check logic (lines 33-48) is target-agnostic and works for ALL targets
- No test verifies that Generic Video or Veo 3 output includes safety constraint text
- No test verifies that deselected safety defaults produce warnings for non-Seedance targets

**Severity:** MEDIUM -- the mechanism works generically but lacks test coverage for 2 of 3 targets.

### Gap 4: `avoid_temporal_flicker` and `avoid_quality_keywords` Not in safetyDefaults

**The problem:** These two constraint options exist in the catalog with `appliesTo: ["seedance"]` but are NOT in Seedance's `safetyDefaults` array. The official Seedance 2.0 prompt guide explicitly warns about temporal flicker and quality-degrading keywords. Users must manually discover and select these constraints.

**Current Seedance safetyDefaults:** `["no_ip_or_celebrity", "stable_identity", "readable_text"]`
**Missing from defaults:** `"avoid_temporal_flicker"`, `"avoid_quality_keywords"`

**Debate:** These are quality concerns, not IP/safety concerns. Adding them to `safetyDefaults` would auto-select them, which could be seen as overreach (the user might intentionally want "cinematic" styling for non-Seedance workflows). However, for Seedance specifically, these are strongly recommended by the official docs.

**Severity:** LOW -- available as user-selectable constraints; quality heuristic (heuristics.ts) already catches quality-killing keywords.

### Gap 5: `buildPromptBrief` Silently Drops Unresolvable Safety Default Option IDs

**The problem:** In `brief.ts` line 64, `getOptionById(optionId)` returns `undefined` for unknown IDs, and `.filter(Boolean)` silently removes them. If a `safetyDefault` ID is misspelled or the option is removed:

1. The option is silently dropped from the brief
2. `adapters.ts` sees it as "missing" and adds an amber warning
3. The warning says "safety defaults deselected: {id}" -- misleading because the user didn't deselect it; the ID was invalid
4. The actual safety constraint is not injected

**Severity:** LOW -- mitigated by Gap 1 (CI validation would catch invalid IDs before deployment). But the misleading warning is a separate UX concern.

### Non-Gaps (Things Already Handled)

| Concern | Status | Why Not a Gap |
|---------|--------|---------------|
| safetyDefaults rendering in adapters.ts | Covered by 01-02 | Already implemented, code present in adapters.ts lines 33-48 |
| Auto-select on target switch | Covered by 01-02 | Already implemented in prompt-guide.tsx lines 298-304 |
| Static export config | Covered by 01-01 | `output: "export"` in next.config.ts |
| Seedance-specific TEST-08 | Covered by 01-02 | Tests exist in validation.test.ts lines 84-117 |
| `avoid_temporal_flicker` constraint option | Covered by 01-01 | Exists in constraints.options.ts lines 104-117 |
| `avoid_quality_keywords` constraint option | Covered by 01-01 | Exists in constraints.options.ts lines 119-132 |
| Quality keyword heuristic for Seedance | Phase 6 | heuristics.ts already detects "fast", "cinematic", "epic" |
| `suppress` metadata execution | Phase 3 scope | Not a safety-foundation concern |
| `prefer` metadata execution | Phase 3 scope | Not a safety-foundation concern |
| Accessibility (ARIA roles, keyboard nav) | Phase 7 scope | Integration testing concern |

## Recommended Additional Plans

### Plan 01-03: CI Validation for Safety Defaults Integrity

**Type:** Safety infrastructure
**Dependencies:** None (independent of 01-01, 01-02)
**Requirements addressed:** New (safety integrity gap)

**What it covers:**
- Add `validateSafetyDefaults()` function to `validation.ts` that:
  - Iterates all targets via `getAllTargets()`
  - For each target's `safetyDefaults`, checks each ID exists in the constraints `OptionSet` (or any option set)
  - Returns `string[]` of errors (empty = success)
- Add test in `validation.test.ts` verifying:
  - All current safetyDefaults pass validation (return `[]`)
  - A target with a bogus safetyDefault ID produces errors containing the bad ID and target name
- Ensure this runs as part of `npm test` (all CI)

**Files:** `src/lib/prompt/validation.ts`, `src/lib/prompt/validation.test.ts`

**Concrete task ideas:**
1. Write `validateSafetyDefaults()` function: resolve each target's safetyDefaults IDs against a Set of all option IDs from all option sets. Report any that don't resolve.
2. Write test: positive case (current config passes), negative case (inject bad ID and verify error).
3. Wire into existing test suite.

**Risk if skipped:** Safety defaults silently break if options are renamed/removed. No CI catches it.

### Plan 01-04: Safety Default Deselection Tracking

**Type:** Safety UX fix
**Dependencies:** 01-02 (safetyDefaults auto-select must exist)
**Requirements addressed:** ARCH-07 (strengthens D-01 compliance)

**What it covers:**
- Track explicitly deselected safety defaults in a ref or state so re-switching to the same target does not re-add them
- Per D-01: "If user explicitly deselects a safety default, respect the deselection"
- Implementation options:
  - Option A: `useRef<Set<string>>` tracking deselected safety default IDs per target. On target switch, filter out deselected IDs before merging.
  - Option B: `useRef<Set<string>>` tracking user-deselected safety defaults globally. Clear when target changes.
- Option A is preferred: a user who deselects `readable_text` on Seedance should not have it re-added when they switch back, but switching to a different target and back should respect prior deselections for that target.

**Files:** `src/components/prompt-guide.tsx`

**Concrete task ideas:**
1. Add `const deselectedSafetyRef = useRef<Set<string>>(new Set())` tracking user-deselected safety default IDs.
2. Modify target switch handler: when merging safetyDefaults, filter out IDs present in `deselectedSafetyRef`.
3. Add logic to `updateSelection`: when user deselects a constraint that is a safety default for the current target, add it to the ref. When user re-selects it, remove from ref.
4. Write a component test verifying: deselect safety default, switch target, switch back -- safety default stays deselected.

**Risk if skipped:** D-01 explicit deselection contract violated on target re-switch.

### Plan 01-05: Cross-Target Safety Default Testing

**Type:** Test coverage
**Dependencies:** 01-02 (TEST-08 baseline)
**Requirements addressed:** TEST-08 (extends to all targets)

**What it covers:**
- Extend TEST-08 assertions to cover Generic Video and Veo 3 targets
- Positive test for each target: rendered output contains safety constraint text from that target's safetyDefaults
- Negative test for each target: deselected safety defaults produce warnings
- veo3 target: verify `no_ip_or_celebrity` and `stable_identity` prompt fragments appear in Veo 3 output
- generic_video target: same verification for generic output

**Files:** `src/lib/prompt/validation.test.ts`

**Concrete task ideas:**
1. Add "includes safety constraint text in Generic Video output (TEST-08)" test
2. Add "warns when safety defaults deselected from Generic Video output (TEST-08)" test
3. Add "includes safety constraint text in Veo 3 output (TEST-08)" test
4. Add "warns when safety defaults deselected from Veo 3 output (TEST-08)" test

**Risk if skipped:** 2 of 3 targets lack safety output verification. A renderer regression could silently drop safety text for those targets.

## Risks and Concerns

1. **Plan 01-04 complexity:** Tracking deselection state adds complexity to the selection model. The ref-based approach avoids re-render overhead but requires careful synchronization with the selections state. If the user manually re-adds a constraint outside the target switch handler, the ref must be updated accordingly.

2. **Plan 01-03 over-validation risk:** If the constraints OptionSet is refactored (e.g., option ID renamed), the validation will correctly flag it. But the fix requires updating `safetyDefaults` in the target config -- a fragile coupling. Mitigate by keeping safety-related option IDs stable (semantic naming, never rename without updating all targets).

3. **Scope creep warning:** Gap 4 (`avoid_temporal_flicker`/`avoid_quality_keywords` not in safetyDefaults) could be argued either way. Including it would be a policy decision (should quality constraints be auto-selected?), not a technical gap. I recommend against adding it to Phase 01 -- it can be discussed separately.

4. **Test file failure (current state):** Running `npx vitest run` shows 1 test file failing (but 79 tests passing across 6 files). The failing file appears to be a load-time issue (not assertion failure) -- should be investigated before adding new plans to avoid building on broken infrastructure.

## Don't Hand-Roll

This phase is pure validation/test/config work. No new libraries needed. Key principle:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Selection dedup | Custom dedup logic | `new Set([...a, ...b])` | Already used in prompt-guide.tsx, well-understood |
| Option ID lookup | Linear scan of flat arrays | Existing `getOptionById` from registry | Already O(1) via Map in registry |
| Component ref tracking | Complex state machine | `useRef<Set<string>>` | Mutable ref doesn't trigger re-renders, perfect for tracking deselection intent |

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | `avoid_temporal_flicker` and `avoid_quality_keywords` should remain as user-selectable constraints, not safetyDefaults | Gap 4 | If user expectation is that Seedance-critical constraints are auto-selected, users may miss these. Low risk -- they are visible in the UI. |
| A2 | Veo 3 `safetyDefaults` not including `readable_text` is intentional | Gap 3 | If Veo 3 also has text rendering issues, Veo 3 users lack the `readable_text` safety default. Medium risk -- needs Veo 3 documentation verification. |
| A3 | Tracking deselection per-target (Option A) is the right design for Plan 01-04 | Gap 2 | If users expect cross-target deselection persistence (deselect once, gone everywhere), Option B would be needed. Low risk -- per-target tracking aligns with D-01's per-target safety defaults concept. |

## Open Questions

1. **Should Veo 3 get `readable_text` as a safety default?**
   - What we know: Seedance has it because the official guide warns about text instability. Generic Video and Veo 3 don't have it.
   - What's unclear: Does Veo 3 handle on-screen text reliably? The Veo 3 research in Phase 8 may have this information.
   - Recommendation: Verify against Phase 8 research (`08-RESEARCH.md`). If Veo 3 text rendering is reliable, current config is correct. If not, add to Veo 3 safetyDefaults.

2. **Should `avoid_temporal_flicker` be a Seedance safety default?**
   - What we know: It's in the catalog with `appliesTo: ["seedance"]` but not in `safetyDefaults`. The official Seedance guide warns about temporal flicker.
   - What's unclear: Is temporal flicker a universal Seedance issue or only for certain prompt styles?
   - Recommendation: Leave as user-selectable for now. Can be promoted to safetyDefault after user feedback confirms it's universally needed.

## Environment Availability

Step 2.6: SKIPPED (no external dependencies identified for these plans -- all changes are to TypeScript validation functions, React component state, and Vitest test files within the existing codebase).

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Vitest 3.0.4 |
| Config file | `vitest.config.ts` |
| Quick run command | `npx vitest run src/lib/prompt/validation.test.ts` |
| Full suite command | `npm test` |

### Phase Requirements -> Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| ARCH-07 | safetyDefaults injected, deselection warns | integration | `npx vitest run src/lib/prompt/validation.test.ts` | Yes |
| OPT-04 | avoid_temporal_flicker + avoid_quality_keywords exist | unit (typecheck) | `npx tsc --noEmit` | Yes |
| TEST-08 | Seedance safety text assertion | integration | `npx vitest run src/lib/prompt/validation.test.ts -t "TEST-08"` | Yes |
| NEW (01-03) | safetyDefaults IDs valid | unit | `npx vitest run src/lib/prompt/validation.test.ts` | No - Wave 0 |
| NEW (01-04) | deselection tracking | component | `npx vitest run src/components/prompt-guide.test.tsx` | No - Wave 0 |
| NEW (01-05) | cross-target safety testing | integration | `npx vitest run src/lib/prompt/validation.test.ts -t "TEST-08"` | No - Wave 0 |

### Wave 0 Gaps
- [ ] `src/lib/prompt/validation.ts` -- needs `validateSafetyDefaults()` function
- [ ] `src/lib/prompt/validation.test.ts` -- needs test for validateSafetyDefaults
- [ ] `src/components/prompt-guide.test.tsx` -- needs test for deselection tracking on re-switch

## Sources

### Primary (HIGH confidence)
- Source code inspection of all relevant files in the project (verified against current state)
- `.planning/CONTEXT.md` Phase 01 decisions -- authoritative for D-01 through D-04
- `.planning/codebase/CONCERNS.md` -- pre-audit concerns, verified which are still unresolved

### Secondary (MEDIUM confidence)
- ROADMAP.md -- confirms all 8 phases complete, 37/37 requirements addressed
- REQUIREMENTS.md -- maps requirements to phases, confirms ARCH-07, OPT-04, TEST-08 are Phase 1

### Tertiary (LOW confidence)
- [ASSUMED] Veo 3 text rendering reliability (Gap 3 / A2) -- Phase 8 research may have authoritative information

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- no new libraries, pure TypeScript/Vitest/React as per project stack
- Architecture: HIGH -- all findings verified by source code inspection
- Pitfalls: HIGH -- gaps identified by cross-referencing D-01 through D-04 decisions against implementation

**Research date:** 2026-05-11
**Valid until:** 2026-06-11 (stable domain, project in maintenance phase)
