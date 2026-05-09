# Phase 02: Registry Architecture — Context

**Gathered:** 2026-05-10
**Status:** Ready for planning
**Requirements:** ARCH-01, ARCH-02, ARCH-03, TEST-01, TEST-02, TEST-03, TEST-05

## Phase Boundary

Convert the hardcoded prompt type system into a true registry architecture. TargetToolId becomes `string` (not a closed union). Adapters self-register into a Map-based registry, eliminating if/else routing. PromptGuide resolves workType from registry instead of direct import. Add registration-time validation for option ID uniqueness, question ID uniqueness, optionSet references, and adapter completeness.

## Implementation Decisions

### D-01: Registry pattern (ARCH-01, ARCH-02)
- **Locked:** Use explicit Map-based registries with register()/resolve() functions. NOT module augmentation (declare module + interface merging).
- **Locked:** TargetToolId = string, WorkTypeId = string (from closed unions to open strings).
- **Locked:** Throw on duplicate registration and unresolved lookup. No silent fallback.
- **Claude's Discretion:** Registry file structure (single registry.ts vs separate per domain). Whether to use a class or module-level Maps.

### D-02: Adapter self-registration (ARCH-02)
- **Locked:** Each adapter calls registerAdapter() at module import time.
- **Locked:** adapters.ts uses resolveAdapter(targetToolId).render(brief) — no if/else.
- **Locked:** The existing TargetAdapter interface in types.ts is already correct: { target: TargetToolConfig; render(brief: PromptBrief): RenderedPrompt }.
- **Claude's Discretion:** Whether to merge renderSeedancePrompt and renderGenericVideoPrompt into adapter objects in-place, or create new adapter files.

### D-03: UI decoupling (ARCH-03)
- **Locked:** PromptGuide no longer imports videoPromptWorkType directly.
- **Locked:** PromptGuide resolves workType by ID from registry.
- **Claude's Discretion:** How to pass workTypeId — hardcoded "video_prompt" for now (only one exists), or via a more general mechanism.

### D-04: Validation at registration time (TEST-01, TEST-02, TEST-03, TEST-05)
- **Locked:** Duplicate option IDs detected at registerOptionSet() time (throw).
- **Locked:** Duplicate question IDs detected at registerWorkType() time.
- **Locked:** OptionSet reference validity checked at registerWorkType() time.
- **Locked:** Adapter completeness checked at validation time (every registered target has an adapter).
- **Claude's Discretion:** Whether to make validation throw or return error arrays.

## Claude's Discretion

- Registry file organization (single file vs domain-split)
- Class-based vs module-level Maps
- Whether to create separate adapter files or refactor in-place
- How workTypeId flows into the UI component
- Validation: throw vs return errors
- Whether to add an init.ts barrel file now or defer to Phase 3
- OptionById Map construction strategy (build on register vs lazy)

## Key References

- .planning/research/ARCHITECTURE.md — Full registry pattern design, adapter template map approach, data flow
- .planning/research/SUMMARY.md — Architecture recommendations
- .planning/codebase/ARCHITECTURE.md — Current architecture analysis
- .planning/codebase/CONCERNS.md — Hardcoded coupling concerns
- .omx/plans/phase-2-architecture-hardening.md — Detailed Phase 2 plan from earlier analysis
