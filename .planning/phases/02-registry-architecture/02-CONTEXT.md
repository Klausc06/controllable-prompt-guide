# Phase 02: Registry Architecture — Context

**Gathered:** 2026-05-12
**Status:** Ready for planning
**Requirements:** ARCH-01, ARCH-02, ARCH-03, TEST-01, TEST-02, TEST-03, TEST-05

<domain>
## Phase Boundary

Convert the hardcoded prompt type system into a true registry architecture. TargetToolId becomes `string` (not a closed union). Adapters self-register into a Map-based registry, eliminating if/else routing. PromptGuide resolves workType from registry instead of direct import. Add registration-time validation for option ID uniqueness, question ID uniqueness, optionSet references, and adapter completeness.
</domain>

<decisions>
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

### D-05: Validation style split (confirmed 2026-05-12)
- **Locked:** Registration-time checks throw Error (fail-fast, bad state must not exist).
- **Locked:** CI-time checks return `string[]` (batch all errors, one pass fixes all).
- **Rationale:** Registration stops bad data at the earliest moment. CI batch reporting lets developers fix all issues at once instead of one-at-a-time.

### D-06: Adapter import pattern (confirmed 2026-05-12)
- **Locked:** Side-effect imports in adapters.ts trigger registerAdapter(). Keep this pattern.
- **Rationale:** JS ecosystem standard self-registration. Adding a new target = 1 new renderer file + 1 import line. The adapters.ts import list doubles as a registry manifest.

### D-07: Registry file split (confirmed 2026-05-12)
- **Locked:** Split single registry.ts into domain files under `src/lib/prompt/registry/`:
  - `work-type.registry.ts`
  - `target.registry.ts`
  - `adapter.registry.ts`
  - `option.registry.ts`
  - `index.ts` (re-export all, preserving `from "./registry"` import path)
- **Rationale:** 148 lines today, growing with Phase 3/4 expansion. Domain split keeps each file focused. External consumers unchanged via barrel re-export.

### Claude's Discretion
- Class-based vs module-level Maps (module-level already in place, working)
- Whether to create separate adapter files or refactor in-place
- How workTypeId flows into the UI component
- OptionById Map construction strategy (build on register vs lazy)
</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Registry design
- `.planning/research/ARCHITECTURE.md` — Full registry pattern design, adapter template map approach, data flow
- `.planning/research/SUMMARY.md` — Architecture recommendations
- `.planning/codebase/ARCHITECTURE.md` — Current architecture analysis
- `.planning/codebase/CONCERNS.md` — Hardcoded coupling concerns

### Phase 1 decisions (carried forward)
- `.planning/phases/01-safety-foundation/01-CONTEXT.md` — safetyDefaults injection pattern used by adapter renderers
</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/lib/prompt/registry.ts` — 148 lines, 14 exports, Map-based registry already in place with full validation
- `src/lib/prompt/adapters.ts` — Already uses `resolveAdapter()` (no if/else), side-effect imports for renderer registration
- `src/components/prompt-guide.tsx` — Already uses `resolveWorkType("video_prompt")` (no direct import of workType)

### Established Patterns
- Throw on registration failure, return empty/undefined on lookup failure
- Side-effect imports at top of adapters.ts for adapter registration
- Module-level Maps (not class-based)
- `validateSafetyDefaultsIntegrity()` returns `string[]` for CI — consistent with D-05

### Integration Points
- `src/lib/prompt/init.ts` — Import-order barrel, will need updating for registry split
- External consumers import `from "./registry"` — barrel in index.ts preserves this path
</code_context>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.
</deferred>

---

*Phase: 02-registry-architecture*
*Context gathered: 2026-05-12*
