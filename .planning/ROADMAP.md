# Roadmap: Controllable Prompt Guide

**Project:** 可控提示词向导 (Controllable Prompt Guide)
**Created:** 2026-05-10 | **Updated:** 2026-05-12
**Granularity:** fine (8 phases)
**Total v1 requirements:** 37 | **Completed:** 37/37

---

## Phases

### Phase 1: Safety Foundation ✓
**Goal**: safetyDefaults injected into every prompt; missing safety constraints added; static export
**Depends on**: None
**Requirements**: ARCH-07, OPT-04, TEST-08
**Status**: Complete (01-01, 01-02). In progress (01-03, 01-04, 01-05 pending).
**Plans:** 5 plans

Plans:
- [x] `01-01-PLAN.md` — Add avoid_temporal_flicker + avoid_quality_keywords constraints, enable static export
- [x] `01-02-PLAN.md` — safetyDefaults warnings in renderer, auto-select on target switch, TEST-08 assertions
- [ ] `01-03-PLAN.md` — CI validation for safetyDefaults option ID integrity
- [ ] `01-04-PLAN.md` — Safety default deselection tracking across target switches
- [ ] `01-05-PLAN.md` — Cross-target safety testing for Generic Video and Veo 3

### Phase 2: Registry Architecture
**Goal**: Open string target IDs; adapter registry; PromptGuide decoupled; registration-time validation
**Depends on**: Phase 1
**Requirements**: ARCH-01, ARCH-02, ARCH-03, TEST-01, TEST-02, TEST-03, TEST-05
**Status**: In progress. Executed: `02-01-PLAN.md`, `02-02-PLAN.md`, `02-03-PLAN.md`. Pending: `02-04-PLAN.md`, `02-05-PLAN.md`.
**Plans:** 5 plans

Plans:
- [x] `02-01-PLAN.md` — Registry infrastructure (Maps + register/resolve) + open types + option set wiring
- [x] `02-02-PLAN.md` — Adapter self-registration + adapters.ts dispatch + validation functions
- [x] `02-03-PLAN.md` — UI decoupling (PromptGuide uses registry) + init.ts barrel
- [ ] `02-04-PLAN.md` — D-07 registry domain split (state.ts + 4 domain files + barrel index.ts)
- [ ] `02-05-PLAN.md` — D-05 formalization + test gap closure (TEST-01 error path, TEST-03 registration path)

### Phase 3: Metadata Execution
**Goal**: appliesTo filtering; suppress/warn; renderer template maps; useReducer state; target switching preserves selections
**Depends on**: Phase 2
**Requirements**: ARCH-04, ARCH-05, ARCH-06, ARCH-08, TEST-04, TEST-06, TEST-07, TEST-09, TEST-13
**Status**: Planned. Ready for execution.
**Plans:** 4 plans

Plans:
- [ ] `03-01-PLAN.md` — Data model foundation: `suppresses` + `templateMap` types, `getTargetsForOption()` reverse index
- [ ] `03-02-PLAN.md` — useReducer migration: event-sourcing reducer, selection preservation, deselectedSafety tracking
- [ ] `03-03-PLAN.md` — Template-map renderer: `assemblePrompt()` generic engine, 3 renderer refactors, text_handling coverage
- [ ] `03-04-PLAN.md` — Suppress detection + appliesTo audit: `applySuppresses()` in brief builder, warning propagation

### Phase 4: Catalog Expansion
**Goal**: 11 dimensions expanded; shot/movement split; Markdown export
**Depends on**: Phase 2
**Requirements**: OPT-01, OPT-02, OPT-03, OPT-05, OPT-06
**Status**: Planned. OPT-03 (camera split) and OPT-06 (Markdown export) pre-complete. Three plans addressing OPT-01, OPT-02, OPT-05.
**Plans:** 3/3 plans complete

Plans:
- [ ] `04-01-PLAN.md` — Namespace prefix migration (D-01): validateOptionIdFormat() + rename 136 IDs + update 7 reference locations
- [ ] `04-02-PLAN.md` — Catalog expansion to 180+ (D-02): +50 new options across 11 catalogs, each >= 15
- [ ] `04-03-PLAN.md` — riskHint completion (D-03): substantive for HIGH-risk, empty for LOW-risk, 1 new CI test

### Phase 5: Consumer Translation ✓
**Goal**: Chinese consumer aesthetics mapped to professional options; category tabs; platform format hints
**Depends on**: Phase 4
**Requirements**: DIFF-01, DIFF-04, DIFF-05
**Status**: Complete. Executed inline. 5 consumer aesthetics mapped to style options.

### Phase 6: Quality Intelligence ✓
**Goal**: Deterministic heuristics; amber warnings; use case smart defaults; research documented
**Depends on**: Phase 5
**Requirements**: DIFF-02, DIFF-03, RES-01, RES-02
**Status**: Complete. Executed inline. heuristics.ts with 4 rules. Seedance/Veo research documented.

### Phase 7: Integration Testing ✓
**Goal**: All output pathways verified; clipboard reliability; browser smoke; advanced options
**Depends on**: Phase 3, Phase 4
**Requirements**: TEST-10, TEST-11, TEST-12, TEST-14, TEST-15
**Status**: Complete. Executed inline. 7 component tests, 16 validation tests, 21 registry tests.

### Phase 8: Hardening & Forward Planning ✓
**Goal**: Forward research; edge cases resolved; production validation; schema versioning
**Depends on**: Phase 7
**Requirements**: RES-03
**Status**: Complete. Forward research in `08-RESEARCH.md`. Veo 3 identified as highest-priority next target.

---

## Progress

| Phase | Plans | Status |
|-------|-------|--------|
| 1. Safety Foundation | 5 plans (2 done, 3 pending) | In progress |
| 2. Registry Architecture | 5 plans (3 done, 2 pending) | In progress |
| 3. Metadata Execution | 0/4 planned | Planned |
| 4. Catalog Expansion | 0/3 planned | Planned |
| 5. Consumer Translation | 1/1 | ✓ Complete |
| 6. Quality Intelligence | 1/1 | ✓ Complete |
| 7. Integration Testing | 1/1 | ✓ Complete |
| 8. Hardening & Forward Planning | 1/1 | ✓ Complete |

---

## Dependency Graph

```
Phase 1 → Phase 2 → Phase 3 ─┐
                   → Phase 4 ─┼→ Phase 5 → Phase 6
                              │                │
                              └→ Phase 7 ←────┘
                                    │
                                    v
                                 Phase 8
```

All phases complete. 37/37 requirements addressed. 58 tests passing. Static export verified.

---

*Roadmap created: 2026-05-10*
*Last updated: 2026-05-12 — added Phase 3 plans 03-01 through 03-04 and Phase 4 plans 04-01 through 04-03*
