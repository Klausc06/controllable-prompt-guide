---
gsd_state_version: 1.0
milestone: v1.0
milestone_name: milestone
current_plan: 3 / 3
status: Phase complete
last_updated: "2026-05-12T17:29:49.122Z"
progress:
  total_phases: 8
  completed_phases: 4
  total_plans: 17
  completed_plans: 17
  percent: 100
---

# State: Controllable Prompt Guide

**Project:** 可控提示词向导
**Last updated:** 2026-05-10 — Post-audit fixes applied
**Phase:** 4 — Complete (3/3 plans)
**Current Plan:** 3 / 3
**Tests:** 75/75 passing
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

- Phase 04 complete — 180 options across 12 catalogs with namespace prefixes, expanded catalogs (15+ each), and full riskHint metadata
- Tailwind v4 migration
