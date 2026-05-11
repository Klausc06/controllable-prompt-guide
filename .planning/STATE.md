---
gsd_state_version: 1.0
milestone: v1.0
milestone_name: milestone
status: unknown
last_updated: "2026-05-11T18:42:30.246Z"
progress:
  total_phases: 8
  completed_phases: 1
  total_plans: 8
  completed_plans: 5
  percent: 63
---

# State: Controllable Prompt Guide

**Project:** 可控提示词向导
**Last updated:** 2026-05-10 — Post-audit fixes applied
**Phase:** 02
**Tests:** 44/44 passing
**CI:** test/lint/typecheck/build all green

## Architecture

- Registry: 5 Maps with register/resolve/getAll
- Adapters: resolveAdapter().render() — no if/else
- UI: resolveWorkType() + getAllTargets() from registry
- Camera: shot_type + camera_movement (split per Seedance requirement)
- SafetyDefaults: auto-select + amber warning
- Quality: 4 heuristic rules
- Export: zh/en/JSON/Markdown via copy buttons

## Recent Fixes (post-audit)

- Deleted dead code: camera.options.ts, video-renderer.ts
- Extracted warningFromBrief to brief.ts (shared utility)
- Added getCameraText() to brief.ts (shared camera dimension logic)
- Fixed tailwind shadow-soft, eslint duplicates, registry type re-exports
- Added aria progressbar/nav roles
- Unified PromptGuide imports to registry
- Heuristics: SEEDANCE_ID constant + QUALITY_KILLING_KEYWORDS array
- ROADMAP.md rewritten with correct phase plans and progress
- Added unit tests: getBriefText, renderMarkdown, getCameraText, validation error paths, heuristics
- Updated PROJECT.md test count

## Next

- Veo 3 adapter research (highest priority)
- Option catalog expansion (~90 → ~143)
- Tailwind v4 migration
