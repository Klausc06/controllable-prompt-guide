# Roadmap: Controllable Prompt Guide

**Project:** 可控提示词向导 (Controllable Prompt Guide)
**Created:** 2026-05-10 | **Updated:** 2026-05-10
**Granularity:** fine (8 phases)
**Total v1 requirements:** 37 | **Completed:** 37/37

---

## Phases

### Phase 1: Safety Foundation ✓
**Goal**: safetyDefaults injected into every prompt; missing safety constraints added; static export
**Depends on**: None
**Requirements**: ARCH-07, OPT-04, TEST-08
**Status**: Complete. Plans: `01-01-PLAN.md`, `01-02-PLAN.md`

### Phase 2: Registry Architecture ✓
**Goal**: Open string target IDs; adapter registry; PromptGuide decoupled; registration-time validation
**Depends on**: Phase 1
**Requirements**: ARCH-01, ARCH-02, ARCH-03, TEST-01, TEST-02, TEST-03, TEST-05
**Status**: Complete. Plans: `02-01-PLAN.md`, `02-02-PLAN.md`, `02-03-PLAN.md`

### Phase 3: Metadata Execution ✓
**Goal**: appliesTo filtering; suppress/warn; renderer template maps; useReducer state; target switching preserves selections
**Depends on**: Phase 2
**Requirements**: ARCH-04, ARCH-05, ARCH-06, ARCH-08, TEST-04, TEST-06, TEST-07, TEST-09, TEST-13
**Status**: Complete. Executed inline. Context: `03-CONTEXT.md`

### Phase 4: Catalog Expansion ✓
**Goal**: 11 dimensions expanded; shot/movement split; Markdown export
**Depends on**: Phase 2
**Requirements**: OPT-01, OPT-02, OPT-03, OPT-05, OPT-06
**Status**: Complete. Executed inline. Camera split done. Markdown export + copy button added.

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
| 1. Safety Foundation | 2/2 | ✓ Complete |
| 2. Registry Architecture | 3/3 | ✓ Complete |
| 3. Metadata Execution | 1/1 | ✓ Complete |
| 4. Catalog Expansion | 1/1 | ✓ Complete |
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

All phases complete. 37/37 requirements addressed. 44 tests passing. Static export verified.

---

*Roadmap created: 2026-05-10*
*Last updated: 2026-05-10 after Phase 1-8 completion*
