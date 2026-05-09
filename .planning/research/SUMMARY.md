# Project Research Summary

**Project:** Controllable Prompt Guide (可控提示词向导)
**Domain:** Config-driven video prompt wizard for non-expert Chinese-speaking users
**Researched:** 2026-05-10
**Confidence:** HIGH

## Executive Summary

This is a **config-driven, deterministic, local-only video prompt wizard** for Chinese-speaking non-expert users. The core value proposition is unique: users make structured selections from curated option catalogs, and the system outputs production-ready prompts for Seedance 2.0 and other AI video generation tools. No free-text input as primary interaction, no AI rewriting, no API calls, no backend.

**The recommended approach** based on four parallel research streams is to (1) refactor the architecture to a registry pattern that eliminates hardcoded `TargetToolId` unions and if/else adapter routing, (2) activate five dead metadata fields (`appliesTo`, `prefer`, `suppress`, `safetyDefaults`, `preferred`) so they execute at runtime rather than sitting unused in type definitions, (3) expand the option catalog from ~80 to ~143+ table-stakes options with complete metadata, and (4) layer on quality heuristics and Chinese-to-professional translation as competitive differentiators. The existing stack (Next.js 15 + TypeScript 5.7 + React 19 + Tailwind v3 + Vitest 3) is correct and requires only one config change: enabling static export via `output: "export"`.

**The critical risk is legal exposure from `safetyDefaults` being defined but never enforced.** The `TargetToolConfig.safetyDefaults` field specifies constraint options that should be auto-injected into every prompt — including IP/commercial-safety constraints that are legally load-bearing given ByteDance's ongoing Disney IP dispute (Variety, May 2026). Currently, these defaults are dead metadata. A user can generate a "coffee shop promo featuring Mickey Mouse" prompt with zero warnings. This must be fixed before any other feature work. The registry pattern is the technical prerequisite, so the recommended Phase 1 merges safety defaults enforcement with registry foundation — the legal priority and the architectural priority converge.

## Key Findings

### Recommended Stack

**The current stack is correct.** No framework migration, no new dependencies. One config change required.

The four researchers independently confirm that the existing foundation (Next.js 15 + TypeScript 5.7 + React 19 + Tailwind v3.4 + Vitest 3 + Testing Library) is the right stack for this project. P0 verification passes: `npm test` (8/8), `npm run lint` (clean), `npm run typecheck` (clean), `npm run build` (success).

**Core technologies:**
- **Next.js 15 with static export (`output: "export"`):** Produces a zero-server static site (`out/index.html`). No Node.js runtime in production. Deployable anywhere. This single config addition eliminates the server dependency entirely. Vite migration rejected: migration cost for zero functional gain on a working build.
- **React 19 `useReducer` + `useMemo`:** No external state library. `useReducer` handles selection changes, target-switching (with safetyDefaults injection and incompatible option suppression), and advanced toggle as discrete, testable state transitions. `useMemo` handles derived prompt computation from selections. Zustand, Jotai, Redux, and XState all rejected as overengineering for a single-component state machine.
- **Tailwind CSS v3 (stay on v3):** v4 migration is a non-trivial change (CSS-first config, Lightning CSS, removed `tailwind.config.ts`) and should be a dedicated future phase. v3 is not deprecated and fully supports the custom theme.
- **TypeScript 5.7 with `strict: true`:** The discriminated union types and structural type system are load-bearing for the configuration layer.
- **Vitest 3 + @testing-library/react 16:** Tiered testing strategy: catalog integrity (option ID uniqueness, reference validity) at Tier 1, rendering correctness at Tier 2, component integration at Tier 3, and E2E smoke at Tier 4. No Playwright/Cypress as project dependencies.
- **No new dependencies at this stage.** The existing set is complete.

**Conflict resolved: Context vs. no Context.** STACK.md recommends `useReducer + Context`; ARCHITECTURE.md explicitly argues Context adds indirection without benefit for a single-component tree. **Resolution:** Adopt `useReducer` immediately. Defer `useContext` until `QuestionBlock` is extracted to a separate file and prop drilling becomes real. Both sources agree on `useReducer` as the core pattern.

### Expected Features

The feature landscape is shaped by two converging official sources: Seedance 2.0's 6-step prompt formula and Veo 3's 7-element structure. Both independently converge on the same 11 video prompt dimensions.

**Must have (table stakes — Phase 1-2):**
- **Safety defaults enforcement** — auto-inject target-specific constraint options into every rendered prompt. This is a legal priority, not a feature.
- **appliesTo filtering** — options not applicable to the current target tool are hidden from the UI. Currently defined but not executed.
- **Missing safety constraints** — `avoid_temporal_flicker` and `avoid_quality_keywords` (Seedance-specific: "fast", "cinematic", "epic" are quality-killing keywords). Confirmed by official guide.
- **All 11 dimensions expanded to minimum table-stakes counts** — ~143 options total (up from ~80). Each option needs complete metadata: `label`, `plain`, `professionalTerms`, `promptFragment.{zh,en}`, `appliesTo`, `riskHint`.
- **Camera shot type vs. movement type separation** — Seedance officially requires these to be independent dimensions. Currently conflated.
- **Option count display** — "选择 1/3 项" per question.
- **Markdown export format** — expected by developers and teams sharing in Notion/Feishu.
- **Text handling in generic renderer** — `text_handling` selections are silently dropped from generic video output. Gap documented in CONCERNS.md.

**Should have (competitive differentiators — Phase 3):**
- **Consumer-to-professional translation** — 14 Chinese consumer aesthetics (高级感, 大片感, ins风, 小清新, etc.) mapped to professional cinematography prompt fragments. This is the product's **core differentiator** — no existing tool does this.
- **Prompt quality heuristics** — deterministic rules from official Seedance/Veo documentation (conflicting camera movements, quality-killing keywords, missing lighting, word count warnings, subject/camera movement separation). All rules are verifiable without AI inference.
- **Use case-driven smart defaults** — selecting "健身房开业宣传" suggests recommended options across other dimensions via a `suggests` field. Configuration-based, not AI inference.
- **Platform-specific optimization hints** — 抖音/小红书/视频号/B站/YouTube/官网/展会 each have distinct format and aesthetic requirements. Veo 3 guide confirms platform-specific prompting.
- **Category tabs within large option sets** — Subject: 人物/产品/空间/食物. For sets with 15+ options.

**Defer to v2+ (Phase 4-5):**
- **Shot List Planner** — multi-clip planning (2-5 clips with independent dimensions, visual language consistency). HIGH complexity. Requires complete registry + UI redesign.
- **URL-shareable links** — encode selection state in URL. Depends on selection serialization design.
- **Pinyin search** — search options by pinyin input (type "gaoji" to find "高级极简"). Depends on option count reaching 150+.
- **Prompt card image export** — shareable social media image of prompt config.

**Anti-features explicitly confirmed by all research streams (do NOT build):**
- AI-powered prompt rewriting (violates deterministic + local-only constraints)
- Free-text primary input (contradicts founding user insight "填空太难了")
- Prompt history/version management (requires persistent storage)
- Social sharing/prompt gallery (requires accounts, moderation)
- Generation preview/API integration (explicitly out of scope)
- Multi-language UI beyond zh/en (target market is Chinese-speaking)
- Real-time collaboration (requires backend infrastructure)

### Architecture Approach

The current architecture has the correct structure (configuration-driven pipeline, schema-based questions, option catalogs, target-aware rendering) but four hardcoded coupling points prevent extensibility: (1) `TargetToolId` is a closed union type, (2) `adapters.ts` uses if/else routing with silent fallback to generic, (3) `prompt-guide.tsx` directly imports `videoPromptWorkType`, and (4) renderers use magic question ID strings. The fix is a **module-level explicit registration registry** — not module augmentation, not interface merging — where each config file calls `register*()` at import time.

**Four patterns to follow:**

1. **Explicit Registration Registry** — `Map`-based registries with `register*()` and `resolve*()` functions. Throws on duplicate registration and on unresolved lookup. No silent fallback. Greppable. Debuggable.

2. **Adapter as Object with Template Map** — Each `TargetAdapter` carries its `render()` method and a `template` object mapping question IDs to prompt positions. The renderer iterates `brief.items` (not hardcoded IDs). Unknown question IDs generate warnings, not silent omission. Adding a new target means creating a file, implementing `TargetAdapter`, and calling `registerAdapter()` — no other files change.

3. **useReducer for Multi-Dimension State** — Replace three `useState` calls with a single `useReducer` handling SELECT, SWITCH_TARGET, and TOGGLE_ADVANCED actions. The `SWITCH_TARGET` action handles safetyDefaults injection, incompatible option suppression, and warning accumulation in one pure, testable function.

4. **Barrel File for Registration Side-Effects** — A single `init.ts` imports all config modules (options, targets, adapters, work types) in dependency order. The app entry point imports this once. Guarantees all configs are registered before any lookup. Prevents tree-shaking from dropping side-effect-only modules.

**Anti-patterns explicitly rejected:**
- Module augmentation (`declare module` + interface merging) — implicit, fragile, hard to debug
- Silent fallback in adapter routing — masks configuration errors
- Magic question ID strings in renderers — silent data loss when IDs are renamed
- Dead metadata fields — fields in the type system with no runtime executor erode trust

**Major components:**
1. **Registry Layer** (`registry.ts`) — Central Maps: workTypeById, targetById, adapterById, optionSetById, optionById. Single source of truth for all ID-to-object resolution.
2. **Config Layer** (self-registering modules) — Options, targets, adapters, and work types each in their own file. Each calls `register*()` at module level.
3. **Pipeline Layer** (`adapters.ts`, `brief.ts`, `renderers/`) — `adapters.ts` looks up adapter by ID from registry (no if/else). `brief.ts` builds PromptBrief from work type config and selections. Each renderer implements `TargetAdapter.render()`.
4. **UI Layer** (`prompt-guide.tsx`, `QuestionBlock`, `usePromptReducer`) — Reads from registry to render questions and targets. Dispatches reducer actions. Memoizes derived output.
5. **Validation Layer** (`validation.ts`) — CI-time cross-reference checks: option-to-target references, target-to-adapter coverage, renderer-to-question coverage, safetyDefaults-to-option existence.

**Conflict resolved: Phase ordering for safety defaults.** PITFALLS.md says safety defaults must be Phase 1 (legal risk). ARCHITECTURE.md puts metadata execution in Phase 4 (depends on registry). **Resolution:** The safety defaults fix is small and surgical — it can be done immediately by wiring `safetyDefaults` into the existing renderer before the full registry refactor. The registry refactor makes it systematic and testable. Recommended Phase 1 includes both: surgical safety-defaults fix first, then registry foundation.

### Critical Pitfalls

The top 5 pitfalls, ranked by severity:

1. **Safety defaults defined but never enforced (LEGAL RISK)** — `TargetToolConfig.safetyDefaults` specifies constraint options that should auto-inject into every prompt (IP safety, identity stability, readable text). Currently unused. ByteDance faces a Disney IP lawsuit (Variety, May 2026) and Seedance 2.0 aggressively filters outputs with recognizable faces/brands/characters. A user generating a prompt without safety constraints gets blocked at generation time and blames the wizard. **Prevention:** Inject `safetyDefaults` into selections on target selection. Include safety text in every rendered prompt. Allow explicit override with confirmation. Do this first.

2. **Target switching is cosmetic — all metadata is dead** — Five metadata fields (`appliesTo`, `prefer`, `suppress`, `safetyDefaults`, `preferred`) are defined in the type system but have zero runtime execution. Switching from Seedance to Generic Video changes the output template but not the available options, recommended dimensions, or injected constraints. **Prevention:** Implement runtime enforcement of all metadata fields before adding new targets. Filter options by `appliesTo`, highlight by `prefer`, suppress by `suppress`, inject `safetyDefaults`.

3. **Choice overload from 11+ independent dimensions** — Hick's Law research (NNGroup) confirms decision paralysis beyond 7+/-2 choices. The wizard currently presents all dimensions with equal visual weight. No progressive disclosure, no "quick start" path, no dimension prioritization. **Prevention:** Default to core dimensions visible, advanced dimensions collapsed. Use smart defaults to pre-fill common safe choices. Mark dimensions by target preference. Show live prompt preview as it builds.

4. **False confidence from unvalidated option combinations** — Options are validated for structural correctness but never for semantic compatibility. A user can select "cinematic realism" style AND "anime aesthetic" for another dimension — individually valid, contradictory when combined. The wizard says "Done!" with no quality assessment. **Prevention:** Add `conflictsWith` field to option metadata. Implement quality heuristics as non-blocking warnings (amber, not red). Show example outputs for common combinations.

5. **Magic question ID strings cause silent data loss** — Renderers use string literals like `"use_case"`, `"text_handling"` to extract brief text. If a question ID is renamed, the renderer silently returns empty strings. The `text_handling` dimension is already silently dropped from generic video output. **Prevention:** Each adapter defines a template map explicitly listing known question IDs. Renderers iterate `brief.items` and warn on unknown IDs. Validation tests confirm every template key exists in the work type.

## Implications for Roadmap

Based on combined research, the recommended phase structure:

### Phase 1: Legal Foundation + Registry

**Rationale:** Safety defaults being dead metadata is a legal exposure (ByteDance/Disney IP dispute is active as of May 2026). Simultaneously, the registry pattern is the architectural prerequisite for all subsequent work — activating metadata, adding targets, expanding catalogs. These two concerns converge: the safety defaults fix can be done surgically in the existing renderer, and the registry makes it systematic.

**Delivers:**
- Safety defaults injected into every rendered prompt (surgical fix, immediate)
- `safetyDefaults` verified by test: Seedance output contains IP-safe constraint text
- Registry foundation: Maps for options, targets, adapters, work types
- `TargetToolId` and `WorkTypeId` converted from closed unions to open strings
- All option sets self-register via `registerOptionSet()`
- O(1) option lookup via Map (replacing linear scan)
- Duplicate detection at registration time (throws, no silent overwrite)
- Missing safety constraints added to catalog: `avoid_temporal_flicker`, `avoid_quality_keywords`

**Addresses:** ARCH-01, ARCH-02, ARCH-03, ARCH-07 (partial — surgical safetyDefaults), TEST-01, TEST-02, TEST-03, TEST-05, TEST-08
**Avoids:** Pitfall 1 (legal risk), Pitfall 2 (dead metadata), Pitfall 6 (ID collisions)

### Phase 2: Architecture Completion + Catalog Substance

**Rationale:** With the registry in place, activate remaining metadata fields (`appliesTo`, `suppress`) and fix the renderer fragility (magic question IDs). Then expand the option catalog from ~80 to ~143 table-stakes options. Option ID namespacing must precede catalog expansion to prevent collisions. This is the largest content creation phase.

**Delivers:**
- `appliesTo` filtering in QuestionBlock: options filtered by target before rendering
- `suppress` logic: incompatible questions hidden with visible warning
- `useReducer` replacing `useState` for selections (SELECT, SWITCH_TARGET actions)
- Each adapter defines a template map with known question IDs
- Renderers iterate `brief.items`, warn on unknown question IDs (no silent omission)
- Generic renderer covers `text_handling` dimension
- Barrel file (`init.ts`) for guaranteed registration order
- All 11 option catalogs expanded to minimum table-stakes counts (~143 options total)
- Complete option metadata: `professionalTerms`, `riskHint`, `promptFragment` quality review
- Camera shot type vs. movement type separated into distinct dimensions
- Camera speed/pace explicitly addressed (4 Seedance-defined speed levels)
- Option count display per question ("选择 1/3 项")
- Markdown export format
- Namespace-scoped option IDs (`{optionSetId}:{optionId}`)

**Addresses:** ARCH-04, ARCH-05, ARCH-06, ARCH-07 (systematic — via reducer + registry), ARCH-08, OPT-01, OPT-02, TEST-04, TEST-06, TEST-07, TEST-09, TEST-13
**Avoids:** Pitfall 2 (dead metadata completed), Pitfall 5 (magic strings), Pitfall 6 (ID collisions), Pitfall 10 (i18n divergence)

### Phase 3: Quality Layer + Differentiators

**Rationale:** With a robust architecture and substantive option catalog, layer on the features that make this product competitive: consumer-to-professional translation, quality heuristics, smart defaults, and platform-aware optimization. These are all configuration-layer additions that don't require architectural changes. They depend on Phase 2's complete catalogs.

**Delivers:**
- Consumer-to-professional translation: 14 consumer aesthetics mapped to existing style/mood options (via option `label` + `searchTerms`)
- Prompt quality heuristics: 5-6 deterministic rules as non-blocking amber warnings
- Use case-driven smart defaults: `suggests` field on use_case options
- Category tabs within large option sets (Subject: 人物/产品/空间/食物)
- Platform-specific format hints (抖音/小红书/视频号/B站/YouTube/官网/展会)
- Content moderation scope decisions (which safety rules live in wizard vs. platform)
- Expanded `riskHint` usage across all applicable options (currently only 2 options have riskHints)

**Addresses:** OPT-01 (completion), OPT-02 (quality), RES-01, RES-02, TEST-11, TEST-12, TEST-14
**Avoids:** Pitfall 3 (choice overload — progressive disclosure + smart defaults), Pitfall 4 (false confidence — quality heuristics), Pitfall 8 (Seedance content filter — riskHint expansion), Pitfall 13 (jargon leakage — label review)

### Phase 4: Hardening + Validation

**Rationale:** Once the feature set stabilizes, invest in comprehensive testing, real-world validation, schema versioning, and preparation for multi-target expansion. This phase ensures the foundation can support Sora/Runway/Veo/Kling targets in future releases.

**Delivers:**
- Comprehensive cross-reference validation (CI gate): every `appliesTo` target exists, every target has a registered adapter, every renderer template key exists in work type questions, every safetyDefaults option ID exists in registry
- Content-level assertions: selecting option X causes X's `promptFragment` to appear in output
- Persona scenario tests: 5 real-world scenarios (gym opening, coffee shop launch, travel highlight, real estate walkthrough, product unboxing)
- Manual validation: test generated prompts against actual Seedance 2.0 generation
- Schema versioning: define `CURRENT_SCHEMA_VERSION`, validate at load time
- Static export verified: `npm run build` produces deployable `out/` directory
- Browser smoke test via Playwright MCP

**Addresses:** ARCH-08 (completion), TEST-05 through TEST-15 (completion), RES-03 (preparation)
**Avoids:** Pitfall 7 (schema versioning), Pitfall 11 (testing structure not quality), Pitfall 12 (no scenario testing)

### Phase 5 (v2+): Advanced Features

**Deferred beyond initial release to maintain focus on core wizard quality.**

- Shot List Planner (multi-clip planning with visual language consistency)
- URL-shareable links with selection state encoding
- Pinyin search for 150+ options
- New targets: Sora (discontinued — skip), Runway, Veo, Kling, Canva brief
- Tailwind v4 migration (dedicated phase)
- Prompt card image export

### Phase Ordering Rationale

- **Legal before features:** Safety defaults enforcement comes before option catalog expansion because generating unsafe prompts has legal implications. The fix is surgical and doesn't depend on the full registry.
- **Registry before catalog expansion:** Option ID namespacing, O(1) lookup, and duplicate detection must exist before adding 60+ new options. Otherwise collisions are inevitable.
- **Metadata execution before quality heuristics:** `appliesTo`, `suppress`, and `safetyDefaults` must execute at runtime before adding quality warnings — otherwise the warnings fire on options that should have been filtered out.
- **Architecture before new targets:** Adding Sora/Runway/Veo/Kling adapters requires the registry pattern. Without it, each new target requires touching 15+ files with union type changes.
- **Substance before differentiators:** Consumer-to-professional translation and quality heuristics depend on having complete, high-quality catalogs to attach them to.

### Research Flags

**Phases likely needing deeper research during planning:**
- **Phase 3 (Quality Heuristics):** The 5-6 heuristic rules are derived from official Seedance/Veo documentation, but effectiveness of automated detection needs testing. Specifically: quality-killing keyword detection, conflicting camera movement detection, and word count warnings. Consider a dedicated `/gsd-research-phase` for heuristic rule specification.
- **Phase 5 (New Targets):** Veo 3 prompt structure is well-documented (Google Cloud official guide). Runway Gen-4 and Kling AI prompt structures are less documented and need direct testing. Sora 2 was discontinued March 2026 — investment in Sora adapter is questionable.
- **Phase 5 (Shot List Planner):** Requires significant UI redesign and multi-clip state management. The complexity justifies dedicated architecture research before implementation.

**Phases with standard patterns (skip dedicated research-phase):**
- **Phase 1 (Registry):** Well-established pattern. Adapter pattern, registry pattern, and `useReducer` are all documented with canonical examples. All four research files provide detailed implementation examples.
- **Phase 2 (Catalog Expansion):** Content creation, not architecture. The schema is defined. The research sources (Seedance guide, Veo guide, awesome-seedance-2-prompts repo) provide the taxonomy.
- **Phase 4 (Validation):** Standard testing patterns. No novel research needed. The ARCHITECTURE.md provides a comprehensive test tier structure.

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | 12 official/community sources analyzed. Current stack verified via P0 checks (build, test, lint, typecheck all pass). Only change: `output: "export"` in next.config.ts. All dependency recommendations verified against official docs. |
| Features | HIGH | Verified against Seedance 2.0 official prompt guide (Volcengine docs), Veo 3 official prompt guide (Google DeepMind), and awesome-seedance-2-prompts repo (2000+ curated prompts). Core 11 dimensions independently confirmed by both guides. Consumer aesthetics map is MEDIUM confidence (synthesized from community). |
| Architecture | HIGH | Based on direct codebase analysis (7 audit documents, all source files in `src/lib/prompt/` and `src/components/`). Registry pattern is well-established (refactoring.guru adapter pattern, GeeksforGeeks registry pattern). TypeScript `satisfies` operator and structural type system confirmed by official handbook. |
| Pitfalls | HIGH for safety/architecture (verified by codebase audit CONCERNS.md + Variety article on Disney legal threat + 6 Seedance content restriction sources). MEDIUM for UX pitfalls (Hick's Law/NNGroup principles applied to domain, no direct user testing). LOW for i18n prompt quality divergence (inferred from i18n patterns). |

**Overall confidence:** HIGH

The research is comprehensive and well-sourced. The strongest areas (stack, core architecture, safety pitfalls) are verified by official documentation and direct code inspection. The moderate-confidence areas (consumer aesthetics map, quality heuristics effectiveness, user choice overload) are inherently empirical and will be validated during implementation through testing against actual video generation output.

### Gaps to Address

- **Camera shot vs. movement separation design:** Research confirms this is required (Seedance official guide), but the exact UI and data model design is TBD. Needs a design decision during Phase 2: split into two dimensions (shot type, camera movement) or systematically add movement speed to each camera option.
- **Content moderation scope boundary:** How much safety filtering happens in the prompt wizard vs. leaving it to the generation platform? Seedance and Veo already have their own safety filters. The wizard's role — preventing prompts that will get blocked vs. simply noting risks — needs clarification.
- **Consumer aesthetics prompt fragment quality:** 14 Chinese consumer terms mapped to professional fragments. The exact prompt text needs testing against Seedance 2.0 generation to validate effectiveness. Consider small-scale A/B testing (render prompt with and without consumer-level translation, submit to Seedance, compare output quality).
- **Wan 2.x and Kling prompt structures:** Web search returned no usable results. Their prompt patterns may differ from Seedance/Veo. Needs direct testing before building adapters. Can be deferred until Phase 5.
- **Sora 2 investment decision:** Sora 2 was discontinued March 2026 per multiple sources. Any Sora-specific adapter work should be paused until the situation stabilizes. Focus on Veo 3 and Seedance as primary targets.

## Sources

### Primary (HIGH confidence)
- Seedance 2.0 Official Prompt Guide (volcengine.com/docs/82379/2222480) — 6-step formula, 8 camera movement types, negative prompt checklist
- Veo 3 Official Prompt Guide (deepmind.google/models/veo/prompt-guide/) — 7-element cinematographic vocabulary structure
- Veo 3.1 Ultimate Prompting Guide (cloud.google.com/blog) — platform-specific optimization
- Awesome Seedance 2 Prompts GitHub repo (YouMind-OpenLab) — 2000+ curated prompts confirming 11-dimension taxonomy
- Next.js Static Exports documentation (nextjs.org) — static export configuration
- Tailwind CSS v4 Upgrade Guide (tailwindcss.com) — v4 migration requirements
- React 19 Managing State documentation (react.dev) — useReducer and useMemo patterns
- TypeScript Handbook (typescriptlang.org) — satisfies operator, structural typing, discriminated unions
- Vitest Component Testing Guide (vitest.dev) — component testing and snapshot strategies
- Variety (2026) — ByteDance/Disney IP legal threat article
- Seedance 2.0 content restriction and filtering guides (mindstudio.ai, newly.app, vicsee.com, apidog.com, morphic.com, blog.segmind.com) — 6 sources confirming content filter behavior and workarounds
- Project codebase audit: `.planning/codebase/ARCHITECTURE.md`, `.planning/codebase/CONCERNS.md`, direct inspection of all source files

### Secondary (MEDIUM confidence)
- Apiyi Seedance 2.0 prompt guide deep-dive (help.apiyi.com) — community interpretation of official guide
- Veo 3 AI blog (veo3ai.io) — independent analysis confirming Google guide structure
- Seedance 2.0 community guides (zhihu.com, seedance-2ai.org, CSDN) — Chinese-language community practices
- React State Management in 2025 (developerway.com) — useReducer-first recommendation
- NNGroup Choice Overload research — Hick's Law applied to wizard UX
- AI video prompt failure analysis (reelmind.ai, video2prompt.org) — common prompt engineering pitfalls

### Tertiary (LOW confidence)
- Next.js vs Vite comparison (dev.to) — community opinion, not authoritative
- Frontend Hero Tailwind v4 comparison — community comparison
- Syncfusion React state management survey — industry survey, not primary research

---
*Research completed: 2026-05-10*
*Ready for roadmap: yes*
