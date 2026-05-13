---
gsd_state_version: 1.0
milestone: v1.1
milestone_name: Image Prompts
current_plan: 3
status: Executing Phase 12
last_updated: "2026-05-14T04:47:00.000Z"
progress:
  total_phases: 5
  completed_phases: 3
  total_plans: 14
  completed_plans: 11
  percent: 79
---

# State: Controllable Prompt Guide

**Project:** 可控提示词向导
**Last updated:** 2026-05-14 — Phase 12 Plan 01 complete (image quality heuristics)
**Phase:** 12
**Current Plan:** 2
**Tests:** 130/130 passing
**CI:** tsc --noEmit: 0 errors, all tests passing

## Architecture

- Registry: 5 Maps with register/resolve/getAll
- Adapters: resolveAdapter().render() — no if/else
- UI: resolveWorkType() + getAllTargets() from registry
- Camera: shot_type + camera_movement (split per Seedance requirement)
- SafetyDefaults: auto-select + amber warning
- Quality: 13 heuristic rules (6 video + 7 image, work-type-gated via workTypeId parameter)
- Export: zh/en/JSON/Markdown via copy buttons
- Work Types: video_prompt + image_prompt (14 questions) with WORK_TYPE_CHANGED action
- Image Options: 14 catalogs, 272 options across all dimensions
- Image Renderer: generic_image adapter with comma-separated natural language output

## Recent Activity

- Phase 12 Plan 01 complete — work-type-aware heuristics: evaluatePromptQuality() now accepts workTypeId parameter; 7 image-specific conflict/completeness rules (amber warnings); adapters.ts wired to pass workType.id; 13 new tests; backward compatible (undefined = video rules only)
- Phase 11 complete — generic image renderer pipeline: 14-question image work type, generic_image target, comma-separated renderer, init.ts + adapters.ts wiring
- Phase 10 complete — 14 image option catalogs with 272 options, barrel index, init.ts wired
- Phase 09 complete — work type foundation (WORK_TYPE_CHANGED action, image_prompt stub, state-driven resolution)
- Phase 07 complete — all 3 plans executed, VERIFICATION.md smoke test created
- Phase 08 planned (3 plans, 1 wave) — deferred to focus on Phase 09-11 (image prompt milestone):
  - 08-01: Schema versioning CI + README + browser compat
  - 08-02: Dead code + lint zero + type safety + edge cases
  - 08-03: Canva brief forward research document

## Decisions Made

- generic_image templateMap: pass-through `{zh: "{选项}", en: "{选项}"}` for all 14 dimensions — option promptFragment carries the descriptive text
- Image renderer: comma-separated natural language output (Midjourney community standard), no model parameters
- Chinese separator: full-width comma "，" / English: comma + space ", "
- constraints maxSelections: 4 to prevent overloading negative prompt
- 7 core (required) + 7 advanced (optional) image question split
- suggestedWorkTypes: WorkTypeId[] on TargetToolConfig (not TargetAdapter) — targets declaratively state capabilities
- WORK_TYPE_CHANGED action atomically clears selections, resets deselectedSafety, picks first compatible target
- Image use_case options use `image_` namespace IDs in suggests field as forward-references
- appliesTo: ["generic_image"] on all image options as forward-reference for future image target
- validation.ts accepts "generic_image" as known future target ID
- Image constraints created FROM SCRATCH — zero video constraint terms leaked (PITFALLS.md Pitfall 7)
- [Phase 12-image-quality]: Backward compat: undefined workTypeId = video rules only (not all-rules mode)
- [Phase 12-image-quality]: Image rules fire ONLY when workTypeId is explicitly image_prompt (not undefined)
- [Phase 12-image-quality]: Conflict detection uses option ID string-matching, not data imports (avoids circular deps)

## Next

- Execute Phase 12 Plan 02 (image suggests enrichments + smart defaults)
- Execute Phase 12 Plan 03 (negative prompt injection)
- Execute Phase 08 plans (hardening: CI, lint, dead code, Canva research) — deferred
- UI integration for image work type selector and image prompt rendering (future phase)
- Additional image targets (Midjourney, DALL-E, etc.) (future phase)
