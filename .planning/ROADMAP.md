# Roadmap: Controllable Prompt Guide

**Project:** 可控提示词向导 (Controllable Prompt Guide)
**Created:** 2026-05-10
**Granularity:** fine (8 phases)
**Total v1 requirements:** 37

---

## Phases

- [ ] **Phase 1: Safety Foundation** — safetyDefaults injected into every prompt; missing safety constraints added; static export
- [ ] **Phase 2: Registry Architecture** — open string target IDs; adapter registry pattern; PromptGuide decoupled from workType imports; registration-time validation
- [ ] **Phase 3: Metadata Execution** — appliesTo filtering; suppress/warn logic; magic question IDs eliminated; useReducer state management; target switching preserves selections
- [ ] **Phase 4: Catalog Expansion** — 11 dimensions expanded to ~143 options; shot type vs camera movement split; namespace-prefixed option IDs; Markdown export
- [ ] **Phase 5: Consumer Translation** — 14 Chinese consumer aesthetics mapped to professional options; category tabs; platform-specific format hints
- [ ] **Phase 6: Quality Intelligence** — 5-6 deterministic quality heuristics as amber warnings; use case-driven smart defaults; research findings documented
- [ ] **Phase 7: Integration Testing** — all output pathways verified; clipboard reliability; browser smoke test; advanced options behavior
- [ ] **Phase 8: Hardening & Forward Planning** — forward research documented; edge cases resolved; production validation; schema versioning

---

## Phase Details

### Phase 1: Safety Foundation
**Goal**: Safety defaults are no longer dead metadata — they inject into every rendered Seedance prompt, and missing constraints are added. The project builds as a static export.
**Depends on**: Nothing (first phase)
**Requirements**: ARCH-07, OPT-04, TEST-08
**Success Criteria** (what must be TRUE):
  1. Every Seedance prompt output includes safety constraint text: no celebrity faces, no film/TV IP, no unauthorized portraits, no brand infringement — injected from `safetyDefaults` config at render time
  2. The three missing safety constraints (`avoid_temporal_flicker`, `avoid_quality_keywords`) exist in the constraints catalog with complete option metadata
  3. Switching target from Seedance to generic removes Seedance-specific safety constraints from the rendered prompt
  4. `npx next build` produces a fully static `out/` directory with no server-side dependencies
**Plans**: 2 plans

Plans:
- [ ] 01-01-PLAN.md — Add missing safety constraints; enable static export
- [ ] 01-02-PLAN.md — Inject safetyDefaults into renderer; auto-select on target switch; TEST-08 verification

### Phase 2: Registry Architecture
**Goal**: Adding a new target tool (e.g., "veo_3") requires only new registration files — no edits to `types.ts`, `adapters.ts`, or `PromptGuide.tsx`. Open string IDs replace closed union types.
**Depends on**: Phase 1 (for safety baseline; could run in parallel technically)
**Requirements**: ARCH-01, ARCH-02, ARCH-03, TEST-01, TEST-02, TEST-03, TEST-05
**Success Criteria** (what must be TRUE):
  1. Adding a new target (e.g., `"veo_3"`) requires creating a target registration file and adapter file only — zero changes to `types.ts`, `adapters.ts`, or UI components
  2. Duplicate option IDs (across any catalog) or duplicate question IDs are detected at registration time with clear error messages identifying both collisions
  3. Every `question.optionSetId` references an existing option set; orphaned references are caught at registration time with the bad reference name
  4. Every registered target has a corresponding adapter in the adapter registry; missing adapters are detected and reported
  5. All existing 8 tests continue to pass, and new registry validation tests exercise the above detection paths
**Plans**: TBD

### Phase 3: Metadata Execution
**Goal**: All metadata fields defined in option configs (`appliesTo`, `suppress`, `prefer`, `safetyDefaults`) have runtime execution paths. The UI, renderer, and state management respond to this metadata.
**Depends on**: Phase 2 (needs registry pattern for adapter lookups and option filtering)
**Requirements**: ARCH-04, ARCH-05, ARCH-06, ARCH-08, TEST-04, TEST-06, TEST-07, TEST-09, TEST-13
**Success Criteria** (what must be TRUE):
  1. Options with `appliesTo` limited to `"seedance"` do not appear in the wizard UI when generic video target is selected
  2. Selecting an option that triggers a `suppress` rule on another option produces a visible warning in the UI, and the suppressed option's fragment does not appear in the rendered prompt
  3. The generic video renderer produces output that includes text_handling dimension content (currently missing from generic output)
  4. Switching targets in the UI preserves all selections compatible with the new target and warns about dropped selections
  5. Every selected option can be traced to exactly one of: a brief item, a prompt text fragment, or a warning in the output — no silent drops
**Plans**: TBD
**UI hint**: yes

### Phase 4: Catalog Expansion
**Goal**: All 11 option dimensions expanded from ~80 to ~143 table-stakes options, with complete bilingual metadata, namespace-prefixed IDs, shot/movement split, and Markdown export.
**Depends on**: Phase 2 (needs registry for option registration and ID collision detection)
**Requirements**: OPT-01, OPT-02, OPT-03, OPT-05, OPT-06
**Success Criteria** (what must be TRUE):
  1. The camera dimension is split into two independent wizard questions: shot type (composition: close-up, medium, wide, etc.) and camera movement (motion: pan, tilt, dolly, etc.)
  2. Every option across all 12 dimensions (after split) includes: Chinese label, plain explanation, professional terms, Chinese prompt fragment, English prompt fragment, target applicability, and risk hints where relevant
  3. All option IDs use `optionSetId:optionId` namespace format — no two options across any catalog share the same ID
  4. Markdown export produces a readable, structured document containing all selected dimensions, their chosen options with explanations, and both rendered prompts (zh + en)
  5. Each of the 11 original dimensions has at least one new option beyond the current ~80 baseline population
**Plans**: TBD

### Phase 5: Consumer Translation
**Goal**: Chinese consumer aesthetics vocabulary ("高级感", "ins风", "大片感", etc.) maps concretely to professional cinematography options. Category tabs and platform format hints make navigation intuitive.
**Depends on**: Phase 4 (needs complete option catalog with professional terms for mapping targets)
**Requirements**: DIFF-01, DIFF-04, DIFF-05
**Success Criteria** (what must be TRUE):
  1. Selecting a consumer aesthetics term (e.g., "高级感") from a dedicated wizard step surfaces concrete professional option recommendations across style, lighting, and camera dimensions
  2. Large option sets (8+ options in one question) display category tabs for scannable navigation (e.g., Subject split into 人物 / 产品 / 空间 / 食物)
  3. When a platform-specific use case is selected (e.g., 抖音), relevant format hints appear (e.g., "抖音推荐 9:16 竖屏，时长 15-60 秒")
  4. All 14 consumer aesthetics terms each map to at least one concrete professional option with a brief rationale visible to the user
**Plans**: TBD
**UI hint**: yes

### Phase 6: Quality Intelligence
**Goal**: The wizard proactively warns users about prompt quality issues using deterministic rules from official documentation, and suggests smart defaults when a use case is selected.
**Depends on**: Phase 4 (needs complete catalogs for rule evaluation), Phase 5 (consumer terms may interact with quality heuristics)
**Requirements**: DIFF-02, DIFF-03, RES-01, RES-02
**Success Criteria** (what must be TRUE):
  1. When a user's selections trigger a quality heuristic (e.g., conflicting lighting direction and mood descriptor), a non-blocking amber warning appears in the output panel explaining the conflict
  2. Selecting a use case option (e.g., "产品展示") automatically highlights suggested options across relevant dimensions with a visual indicator
  3. Research findings from Seedance 2.0 official prompt guide and Veo 3 prompt guide are documented, and at least 5 quality heuristics are traceable to specific rules from these sources
  4. At least 5 deterministic quality heuristics exist with distinct trigger conditions — each produces a specific, actionable warning message
**Plans**: TBD
**UI hint**: yes

### Phase 7: Integration Testing
**Goal**: All output pathways (zh prompt, en prompt, JSON brief, Markdown export, clipboard) verified end-to-end. Browser smoke test passes with zero console errors.
**Depends on**: Phase 3 (needs working metadata execution for meaningful output), Phase 4 (needs catalog substance for realistic test scenarios)
**Requirements**: TEST-10, TEST-11, TEST-12, TEST-14, TEST-15
**Success Criteria** (what must be TRUE):
  1. JSON brief output is valid JSON that parses successfully and contains `workTypeId`, `targetToolId`, and `items` array with at least one item per selected dimension
  2. Copy buttons for Chinese prompt, English prompt, and JSON brief each produce the correct payload in the system clipboard
  3. When the Clipboard API is unavailable or fails, a visible fallback state appears (text selection or manual copy area) — user is never left with a silent failure
  4. The advanced options section collapses/expands correctly, preserves expansion state across selections, and is keyboard-accessible
  5. Browser smoke test: open `/`, switch target from Seedance to generic, expand advanced options, select options in 3+ dimensions, copy JSON — no console errors and output contains expected fragments
**Plans**: TBD
**UI hint**: yes

### Phase 8: Hardening & Forward Planning
**Goal**: Production-ready validation complete. Forward-looking research for future targets documented. Edge cases from constraints and suppress logic resolved.
**Depends on**: Phase 7 (after all features and tests are in place)
**Requirements**: RES-03
**Success Criteria** (what must be TRUE):
  1. Forward-looking research for Sora (discontinued — noted), Runway, Veo, Kling, and Canva brief is documented with prompt structure notes for each platform
  2. All 15 TEST requirements pass in CI with no skipped or flaky tests
  3. Manual validation: a Seedance 2.0 prompt generated by the wizard, when submitted to Seedance, produces acceptable video output (subjective but documented)
  4. Schema versioning strategy is documented: how future catalog format changes will be handled without breaking existing option data
  5. No remaining ARCH-08 edge cases — every selected option in every tested scenario traces to output or warning
**Plans**: TBD

---

## Progress

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Safety Foundation | 0/2 | Not started | - |
| 2. Registry Architecture | 0/1 | Not started | - |
| 3. Metadata Execution | 0/1 | Not started | - |
| 4. Catalog Expansion | 0/1 | Not started | - |
| 5. Consumer Translation | 0/1 | Not started | - |
| 6. Quality Intelligence | 0/1 | Not started | - |
| 7. Integration Testing | 0/1 | Not started | - |
| 8. Hardening & Forward Planning | 0/1 | Not started | - |

---

## Dependency Graph

```
Phase 1 (Safety)
  |
  v
Phase 2 (Registry) ------> Phase 4 (Catalog)
  |                            |
  v                            v
Phase 3 (Metadata)        Phase 5 (Consumer Translation)
  |                            |
  |                            v
  |                       Phase 6 (Quality Intelligence)
  |                            |
  v                            |
Phase 7 (Integration Testing) <--+
  |
  v
Phase 8 (Hardening)
```

---

*Roadmap created: 2026-05-10*
*Next: `/gsd-execute-phase 1`*
