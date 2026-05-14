# Roadmap: Controllable Prompt Guide

**Project:** 可控提示词向导 | **Updated:** 2026-05-14

## Milestones

- ✅ **v1.0 MVP** — Phases 1-8 (shipped 2026-05-13)
- 🚧 **v1.1 Image Prompts** — Phases 9-14 (review fixes in progress)

## Phases

### v1.1 (review fixes)

### Phase 9: Work Type Foundation ✓
**Goal**: Multi-work-type registry; reducer WORK_TYPE_CHANGED; image_prompt stub
**Requirements**: WORK-01, WORK-02
**Status**: Complete. 3/3 plans.

### Phase 10: Image Option Data ✓
**Goal**: 14 image catalogs (272 options, 80 consumer aesthetics)
**Requirements**: DIM-01..05, AEST-01..04
**Status**: Complete. 3/3 plans.

### Phase 11: Generic Image Renderer
**Goal**: templateMap-driven renderer; image brief; zh/en/JSON/Markdown
**Requirements**: REND-01..05
**Plans:** 2/2 plans complete

Plans:
- [x] 11-01-PLAN.md — Expand image work type to 14 questions + create generic_image target with templateMap
- [x] 11-02-PLAN.md — Create comma-separated natural language image renderer + wire into init.ts and adapters.ts

### Phase 12: Image Quality & Smart Defaults
**Goal**: Extend heuristics+suggests; negative prompt; 6+ image rules
**Requirements**: QUAL-01..04
**Plans:** 3/3 plans complete

Plans:
- [x] 12-01-PLAN.md — Make evaluatePromptQuality() work-type-aware; add 7 image heuristic rules (6 conflict + 1 completeness)
- [x] 12-02-PLAN.md — Fix suggests keys + enrich suggests on 18 image use cases + CI validation
- [x] 12-03-PLAN.md — Three-tier negative prompt injection for generic_image target

### Phase 13: UI Integration & Polish
**Goal**: Work type switcher; URL; localStorage; feature parity
**Requirements**: WORK-03, WORK-04, UI-01..04, BLOG-01, BLOG-02
**Plans:** 3/3 plans complete

Plans:
- [x] 13-01-PLAN.md — Work type switcher; confirmation dialog; dynamic header; consumer tag cap; image defaults
- [x] 13-02-PLAN.md — URL encoding with replaceState; localStorage persistence with debounce
- [x] 13-03-PLAN.md — Two blog posts (feature announcement + practical guide)

### Phase 14: Review Fixes
**Goal**: Fix 12 high-priority issues from v1.1 cross-review audit (critical bugs, test gaps, a11y, data quality, negative prompt tier)
**Requirements**: RVW-01..12
**Plans:** 5 plans

Plans:
- [ ] 14-01-PLAN.md — Critical fixes: vitest exclude, veo3 import, dead barrels, wrong test ID (D-01, D-02, D-06, D-07)
- [ ] 14-02-PLAN.md — Test coverage: renderPrompt image test, WORK_TYPE_CHANGED transitions (D-03, D-04)
- [ ] 14-03-PLAN.md — Data quality: consumerTerms + categories (D-09, D-10)
- [ ] 14-04-PLAN.md — Component ARIA: aria-pressed, aria-live, unused import (D-05, D-08, D-11)
- [ ] 14-05-PLAN.md — Negative prompt tier: user-selectable light/medium/heavy (D-12)

## Progress

| Phase | Plans | Status |
|-------|-------|--------|
| 9. Foundation | 3/3 | ✓ |
| 10. Option Data | 3/3 | ✓ |
| 11. Renderer | 2/2 | ✓ |
| 12. Quality | 3/3 | ✓ |
| 13. UI & Polish | 3/3 | ✓ |
| 14. Review Fixes | 0/5 | ○ |
