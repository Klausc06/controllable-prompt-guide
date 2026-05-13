---
phase: 11-image-renderer
plan: 01
subsystem: prompt-config
tags: [worktype, target, image-prompt, templateMap, registry]

# Dependency graph
requires:
  - phase: 10-image-option-data
    provides: 14 image option catalogs (272 options) with image_ prefix optionSetIds
provides:
  - image_prompt work type with 14 questions covering all image dimensions
  - generic_image target config with templateMap for all 14 dimensions
  - Target registration in targets/index.ts via targetTools array
affects: [11-02 (renderer consumes these configs)]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - templateMap: { zh: "{选项}", en: "{选项}" } for image prompt pass-through rendering
    - Pre-registration validation: duplicate question IDs + optionSetId reference checks at module load

key-files:
  created:
    - src/lib/prompt/targets/generic-image.target.ts
  modified:
    - src/lib/prompt/work-types/image-prompt.worktype.ts
    - src/lib/prompt/targets/index.ts
    - src/lib/prompt/validation.test.ts

key-decisions:
  - "All 14 templateMap entries use pass-through {选项} templates — option promptFragment text carries the descriptive phrases"
  - "constraints question has maxSelections: 4 to prevent overloading the negative prompt"
  - "7 core (required) + 7 advanced (optional) question split"
  - "generic_image safetyDefaults reference image_constraints: IDs from Phase 10 catalogs"

patterns-established:
  - "Pass-through templateMap: image prompts use {zh: '{选项}', en: '{选项}'} for all dimensions since option promptFragment already contains complete descriptive phrases"
  - "Target self-registration via targets/index.ts barrel + targetTools array"

requirements-completed: [REND-01, REND-02, REND-03]

# Metrics
duration: ~10min
completed: 2026-05-13
---

# Phase 11 Plan 01: Image Work Type and Target Config

**Expanded image_prompt work type from 1-question stub to 14 questions spanning all image dimensions, created generic_image target with pass-through templateMap, and registered in target registry.**

## Performance

- **Duration:** ~10 min
- **Started:** 2026-05-13T19:50:00Z
- **Completed:** 2026-05-13T19:57:58Z
- **Tasks:** 2 + 1 deviation fix
- **Files modified:** 4

## Accomplishments
- image-prompt.worktype.ts: 14 questions (7 core + 7 advanced) with image_ prefix optionSetIds
- generic-image.target.ts: templateMap with all 14 question IDs, supportedWorkTypes: ["image_prompt"]
- targets/index.ts: genericImageTarget imported and registered in targetTools array
- Pre-registration validation passes (no duplicate IDs, all 14 optionSetIds resolve in registry)

## Task Commits

Each task was committed atomically:

1. **Task 1: Expand image-prompt.worktype.ts from 1 to 14 questions** - `0d6c936` (feat)
2. **Task 2: Create generic-image.target.ts and register in targets/index.ts** - `e053fb6` (feat)
3. **Deviation fix: Update safetyDefaults test for image option sets** - `5a1aa6c` (fix)

## Files Created/Modified
- `src/lib/prompt/work-types/image-prompt.worktype.ts` - Expanded from 1 lighting question to 14 questions: use_case, subject, scene, composition, lighting, art_style, constraints (core) + color_palette, mood, perspective, aspect_ratio, detail_level, post_processing, time_season (advanced)
- `src/lib/prompt/targets/generic-image.target.ts` - NEW. generic_image target with id "generic_image", pass-through templateMap, 4 safetyDefaults, supportedWorkTypes: ["image_prompt"]
- `src/lib/prompt/targets/index.ts` - Added genericImageTarget import and registration
- `src/lib/prompt/validation.test.ts` - Updated safetyDefaults test to use getAllOptionSets() (full registry) instead of video-only optionSets

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed safetyDefaults test using video-only optionSets**
- **Found during:** Post-Task-2 test run
- **Issue:** `validateSafetyDefaultsIntegrity(targetTools, optionSets)` only checked video option IDs; `genericImageTarget` references `image_constraints:` IDs that don't exist in the video `optionSets` array.
- **Fix:** Added `import "./options/image"` side-effect import to register image option sets, changed test to use `getAllOptionSets()` from the full registry.
- **Files modified:** `src/lib/prompt/validation.test.ts`
- **Commit:** `5a1aa6c`

## Known Stubs

One test still fails (expected — will be resolved in Plan 11-02):
- **TEST-05: `validateAdapterCompleteness()`** — `generic_image: no adapter registered`. The generic_image target has no adapter yet. Plan 11-02 creates `generic-image.renderer.ts` and registers the adapter, which will resolve this.

## Self-Check: PASSED
- [x] `src/lib/prompt/work-types/image-prompt.worktype.ts` — 14 questions verified
- [x] `src/lib/prompt/targets/generic-image.target.ts` — 14 templateMap entries verified
- [x] `src/lib/prompt/targets/index.ts` — genericImageTarget registered
- [x] `npx tsc --noEmit` — 0 errors
- [x] 114/115 tests pass (1 expected failure: adapter not yet registered for generic_image)
