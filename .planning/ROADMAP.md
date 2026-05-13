# Roadmap: Controllable Prompt Guide

**Project:** 可控提示词向导 | **Updated:** 2026-05-14

## Milestones

- ✅ **v1.0 MVP** — Phases 1-8 (shipped 2026-05-13)
- 🚧 **v1.1 Image Prompts** — Phases 9-13 (in progress)

## Phases

### v1.1 (in progress)

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
**Plans:** 2/3 plans executed

Plans:
- [x] 12-01-PLAN.md — Make evaluatePromptQuality() work-type-aware; add 7 image heuristic rules (6 conflict + 1 completeness)
- [x] 12-02-PLAN.md — Fix suggests keys + enrich suggests on 18 image use cases + CI validation
- [ ] 12-03-PLAN.md — Three-tier negative prompt injection for generic_image target

### Phase 13: UI Integration & Polish
**Goal**: Work type switcher; URL; localStorage; feature parity
**Requirements**: WORK-03, WORK-04, UI-01..04, BLOG-01, BLOG-02

## Progress

| Phase | Plans | Status |
|-------|-------|--------|
| 9. Foundation | 3/3 | ✓ |
| 10. Option Data | 3/3 | ✓ |
| 11. Renderer | 2/2 | ✓ |
| 12. Quality | 0/3 | ○ |
| 13. UI & Polish | 0 | ○ |
