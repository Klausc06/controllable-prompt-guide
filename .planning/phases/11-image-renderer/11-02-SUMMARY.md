---
phase: 11-image-renderer
plan: 02
subsystem: prompt-rendering
tags: [renderer, image-prompt, comma-separated, natural-language, adapter]

# Dependency graph
requires:
  - phase: 11-01
    provides: image_prompt work type (14 questions), generic_image target config with templateMap
provides:
  - generic_image TargetAdapter that renders comma-separated natural language image prompts
  - Adapter registration via registerAdapter("generic_image", ...)
  - init.ts and adapters.ts barrel wiring for module-level registration
affects: [UI copy buttons (reuses existing infrastructure), future image targets]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - Comma-separated natural language output (Midjourney community standard)
    - Chinese: full-width comma "，" / English: ", " separator
    - assemblePrompt() from brief.ts drives output (same as video renderers)
    - templateMap iteration over Object.keys() for dimension-order consistency

key-files:
  created:
    - src/lib/prompt/renderers/generic-image.renderer.ts
  modified:
    - src/lib/prompt/init.ts
    - src/lib/prompt/adapters.ts

key-decisions:
  - "Output format is comma-separated phrases (NOT labeled lines like video renderers)"
  - "Chinese separator is full-width comma '，' (not newline '\\n') following Chinese typographic convention"
  - "No getCameraText() — images don't have camera dimensions"
  - "rawIntent prepended as leading phrase; falls back to use_case option text"

patterns-established:
  - "Image renderer: iterate templateMap keys for consistent locale order, filter undefined parts, join with locale-appropriate comma"
  - "Adapter side-effect registration: renderer file calls registerAdapter() at module level, barrel imports trigger it"

requirements-completed: [REND-04, REND-05]

# Metrics
duration: ~5min
completed: 2026-05-13
---

# Phase 11 Plan 02: Generic Image Renderer

**Created generic_image renderer producing comma-separated natural language image prompts, wired into the adapter registry, init barrel, and adapters side-effect imports — all 4 export formats work through existing infrastructure.**

## Performance

- **Duration:** ~5 min
- **Started:** 2026-05-13T19:58:30Z
- **Completed:** 2026-05-13T20:00:31Z
- **Tasks:** 2
- **Files modified:** 3

## Accomplishments
- generic-image.renderer.ts: TargetAdapter with comma-separated natural language output
- Output: `zhPhrases.join("，")` and `enPhrases.join(", ")` — Midjourney community standard
- No model parameters in output (--ar, --stylize, etc.) — D-05 compliant
- Wired into init.ts (after veo3 import) and adapters.ts (after generic-video import)
- All 115 tests pass, npx tsc --noEmit: 0 errors

## Task Commits

Each task was committed atomically:

1. **Task 1: Create generic-image.renderer.ts** - `f44a66e` (feat)
2. **Task 2: Wire renderer into init.ts and adapters.ts** - `fc640e9` (feat)

## Files Created/Modified
- `src/lib/prompt/renderers/generic-image.renderer.ts` - NEW. TargetAdapter implementing comma-separated natural language rendering. Uses assemblePrompt() + getBriefText() + warningFromBrief() from brief.ts. Output: Chinese full-width comma "，" / English ", " separated phrases.
- `src/lib/prompt/init.ts` - Added `import "./renderers/generic-image.renderer"` after veo3 renderer
- `src/lib/prompt/adapters.ts` - Added `import "./renderers/generic-image.renderer"` after generic-video renderer

## Deviations from Plan

None — plan executed exactly as written.

## Phase 11 Complete: End-to-End Image Pipeline

With both plans complete, the generic image rendering pipeline is functional end-to-end:

1. **Work type** (11-01): `image_prompt` with 14 questions across all image dimensions
2. **Target config** (11-01): `generic_image` with pass-through templateMap
3. **Renderer** (11-02): `genericImageAdapter` with comma-separated natural language output
4. **Wiring** (11-02): init.ts + adapters.ts barrel imports trigger registration
5. **Export formats**: zh copy, en copy, JSON brief, Markdown — all reuse existing CopyButton infrastructure
6. **Test suite**: 115/115 tests pass, 0 tsc errors

## Self-Check: PASSED
- [x] `src/lib/prompt/renderers/generic-image.renderer.ts` — exists, exports genericImageAdapter
- [x] `src/lib/prompt/init.ts` — imports generic-image.renderer
- [x] `src/lib/prompt/adapters.ts` — imports generic-image.renderer
- [x] `npx tsc --noEmit` — 0 errors
- [x] `npx vitest run --root src` — 115/115 tests pass
