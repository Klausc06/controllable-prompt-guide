---
phase: 04-catalog-expansion
plan: 03
subsystem: option-catalogs
tags: [metadata, riskHint, quality, D-03]
dependency_graph:
  requires: ["04-02"]
  provides: ["riskHint-completeness"]
  affects: ["QuestionBlock UI (amber warning rendering)"]
tech_stack:
  added: []
  patterns: ["LocalizedText for bilingual risk warnings", "CI-enforced metadata completeness"]
key_files:
  created: []
  modified:
    - src/lib/prompt/validation.test.ts
    - src/lib/prompt/options/constraints.options.ts
    - src/lib/prompt/options/text-handling.options.ts
    - src/lib/prompt/options/format.options.ts
    - src/lib/prompt/options/shot-type.options.ts
    - src/lib/prompt/options/camera-movement.options.ts
    - src/lib/prompt/options/subject.options.ts
    - src/lib/prompt/options/motion.options.ts
    - src/lib/prompt/options/audio.options.ts
    - src/lib/prompt/options/use-case.options.ts
    - src/lib/prompt/options/scene.options.ts
    - src/lib/prompt/options/style.options.ts
    - src/lib/prompt/options/lighting.options.ts
decisions:
  - "All 180 options have riskHint field (0 undefined, 0 missing)"
  - "HIGH-risk catalogs (constraints, text_handling): 30/30 substantive zh+en riskHint"
  - "Borderline catalogs: 8 options with substantive riskHint for real-risk scenarios"
  - "LOW-risk catalogs: riskHint field present, mostly empty per D-03"
  - "All existing substantive riskHint values preserved (no modifications)"
  - "consistent_lighting riskHint added via Rule 2 (not in plan but required by D-03)"
metrics:
  duration: 22m
  completed_date: "2026-05-12"
---

# Phase 04 Plan 03: riskHint Completeness Summary

All 180 options across 12 catalogs now have riskHint metadata, fulfilling D-03 requirements. HIGH-risk catalogs get substantive bilingual warnings. LOW-risk catalogs have the field present (empty per design). CI test enforces completeness going forward.

## Execution Summary

### Task 1: riskHint CI test (TDD)
Added 4 sub-tests to `validation.test.ts` under `describe("riskHint completeness (D-03)")`:
1. Every option has riskHint field (not undefined)
2. HIGH-risk catalogs (constraints, text_handling) have non-empty zh+en riskHint
3. LOW-risk catalogs (lighting, style, scene, audio, use_case) have riskHint field present
4. Borderline catalogs (format, shot_type, camera_movement, subject, motion) have riskHint field present

Tests initially failed (107 missing) — RED phase. Passed after Tasks 2-3 — GREEN phase.

### Task 2: HIGH-risk catalogs
- **constraints (15 options):** 13 new substantive riskHints added. 2 existing preserved (readable_text, no_logo_hallucination). Extra: consistent_lighting added via Rule 2.
- **text_handling (15 options):** 11 new substantive riskHints added. 4 existing preserved (short_title_only, opening_title_card, price_tag_popup, end_card_cta).
- All 30 HIGH-risk options have non-empty zh+en content.

### Task 3: Borderline + LOW-risk catalogs
- **Borderline (5 catalogs, 75 options):** 8 substantive riskHints for real-risk options:
  - format:wide_219_15s — ultrawide cropping risk
  - shot_type:low_angle, shot_type:high_angle, shot_type:split_screen — perspective/alignment risk
  - camera_movement:whip_pan, camera_movement:rack_focus — artifact risk
  - subject:baby_children — privacy/likeness risk
  - motion:timelapse_hyperlapse — frame inconsistency risk
- **LOW-risk (5 catalogs, 75 options):** riskHint field present on all options. Existing substantive riskHint on 6 options preserved (style: 4, scene: 2). All others set to empty strings.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 2 - Missing Critical Data] Added riskHint for consistent_lighting**
- **Found during:** Task 2
- **Issue:** constraints:consistent_lighting had empty riskHint but was not listed in the plan's explicit riskHint text block. D-03 requires ALL constraints options to have substantive riskHint.
- **Fix:** Added substantive riskHint: "跨镜头光照一致性在视频模型中较难保证，尤其室外场景的自然光照变化可能被误判为不一致。建议在类似光照条件下拍摄参考素材。" / "Cross-shot lighting consistency is difficult to guarantee in video models..."
- **Files modified:** src/lib/prompt/options/constraints.options.ts
- **Commit:** 07b7b36

**2. [Rule 1 - Bug] Batch script dropped trailing commas**
- **Found during:** Task 3
- **Issue:** Batch-processing script added riskHint after appliesTo lines without adding trailing commas, causing 50+ TS1005 syntax errors across 5 files.
- **Fix:** Ran comma-repair script to add commas to appliesTo lines that gained riskHint.
- **Files modified:** audio.options.ts, use-case.options.ts, scene.options.ts, style.options.ts, lighting.options.ts
- **Commit:** 3952056

## Verification Results

| Check | Result |
|-------|--------|
| `npx vitest run` | 75/75 tests pass (71 existing + 4 new riskHint) |
| `npx tsc --noEmit` | Zero type errors |
| All 180 options have riskHint | 180/180 confirmed |
| HIGH-risk substantive check | 30/30 non-empty zh+en |
| Existing riskHint preserved | 17 existing values untouched |

## Known Stubs

None. All riskHint values are either substantive bilingual warnings (for real-risk options) or intentionally empty strings (for LOW-risk catalogs per D-03).

## Threat Flags

None. No new endpoints, auth paths, or trust boundaries introduced. riskHint is advisory metadata displayed as amber warnings in the existing QuestionBlock UI rendering path.

## Self-Check: PASSED

- All created/modified files exist and compile
- All 3 commits verified in git log
- 75/75 tests pass
- TypeScript compiles clean
