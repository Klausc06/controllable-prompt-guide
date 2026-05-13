---
gsd_state_version: 1.0
milestone: v1.1
milestone_name: image-prompts
current_plan: 08-01 (ready for execution)
status: Planned
last_updated: "2026-05-14T03:24:00.000Z"
progress:
  total_phases: 10
  completed_phases: 9
  total_plans: 37
  completed_plans: 34
  percent: 92
---

# State: Controllable Prompt Guide

**Project:** 可控提示词向导
**Last updated:** 2026-05-14 — Phase 10 complete (image option catalogs)
**Phase:** 8 (pending)
**Current Plan:** 08-01 (ready for execution)
**Tests:** 115/115 passing
**CI:** tsc --noEmit: 0 errors, all tests passing

## Architecture

- Registry: 5 Maps with register/resolve/getAll
- Adapters: resolveAdapter().render() — no if/else
- UI: resolveWorkType() + getAllTargets() from registry
- Camera: shot_type + camera_movement (split per Seedance requirement)
- SafetyDefaults: auto-select + amber warning
- Quality: 6 heuristic rules
- Export: zh/en/JSON/Markdown via copy buttons
- Work Types: video_prompt + image_prompt (stub) with WORK_TYPE_CHANGED action
- Image Options: 14 catalogs, 272 options across all dimensions

## Recent Activity

- Phase 10 complete — 14 image option catalogs with 272 options, barrel index, init.ts wired
- Phase 09 complete — work type foundation (WORK_TYPE_CHANGED action, image_prompt stub, state-driven resolution)
- Phase 07 complete — all 3 plans executed, VERIFICATION.md smoke test created
- Phase 08 planned (3 plans, 1 wave) — deferred to focus on Phase 09-10 (image prompt milestone):
  - 08-01: Schema versioning CI + README + browser compat
  - 08-02: Dead code + lint zero + type safety + edge cases
  - 08-03: Canva brief forward research document

## Decisions Made

- suggestedWorkTypes: WorkTypeId[] on TargetToolConfig (not TargetAdapter) — targets declaratively state capabilities
- WORK_TYPE_CHANGED action atomically clears selections, resets deselectedSafety, picks first compatible target
- Image use_case options use `image_` namespace IDs in suggests field as forward-references
- appliesTo: ["generic_image"] on all image options as forward-reference for future image target
- validation.ts accepts "generic_image" as known future target ID
- Image constraints created FROM SCRATCH — zero video constraint terms leaked (PITFALLS.md Pitfall 7)

## Next

- Execute Phase 08 plans (hardening: CI, lint, dead code, Canva research)
- Expand image work type from stub to 10+ questions (future phase)
- Add image target (midjourney or generic_image) (future phase)
