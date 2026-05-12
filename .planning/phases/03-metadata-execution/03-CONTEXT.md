# Phase 03: Metadata Execution — Context

**Gathered:** 2026-05-12
**Status:** Ready for planning
**Requirements:** ARCH-04, ARCH-05, ARCH-06, ARCH-08, TEST-04, TEST-06, TEST-07, TEST-09, TEST-13

<domain>
## Phase Boundary

Make option catalog metadata (appliesTo, suppresses) actually drive rendering and UI behavior. Replace ad-hoc prompt string concatenation with template-map-based rendering. Migrate PromptGuide from multiple useState hooks to a single useReducer with event-sourcing actions. Ensure target switching preserves compatible selections.
</domain>

<decisions>
## Implementation Decisions

### D-01: Event-sourcing useReducer (ARCH-05)
- **Locked:** Replace useState (targetToolId, selections, advancedOpen) + useRef (deselectedSafetyRef) with a single useReducer.
- **Locked:** Action types use event-sourcing semantics: `TARGET_CHANGED` (with `from` and `to`), `OPTION_SELECTED`, `OPTION_DESELECTED`, `TOGGLE_ADVANCED`.
- **Locked:** Reducer computes all derived state in one pass — no useEffect chains, no intermediate renders.
- **Locked:** `deselectedSafetyRef` (Phase 01-04) merges into reducer state as `deselectedSafety: Set<string>`.
- **Claude's Discretion:** State shape structure, reducer file location (inline vs separate file).

### D-02: Catalog-declared suppress/warn (ARCH-08)
- **Locked:** Each option definition gains an optional `suppresses: string[]` field listing option IDs it overrides.
- **Locked:** Brief builder reads `suppresses` metadata. When option A suppresses option B and both are selected, B does NOT appear in prompt output, and an amber warning is generated: `""{B}" 被 "{A}" 覆盖"` / `""{B}" overridden by "{A}"`.
- **Locked:** suppress rules are DATA, not CODE — adding a new suppression relationship only modifies the option catalog file, never the renderer or brief builder.
- **Claude's Discretion:** Warning formatting details, whether suppressed items appear greyed-out in UI.

### D-03: Dimension→slot template maps (ARCH-06)
- **Locked:** Each target config gains a `templateMap: Record<QuestionId, string>` field.
- **Locked:** Template values use `{选项}` as the placeholder for option text. Renderer is generic: iterate brief items, look up templateMap slot, replace placeholder.
- **Locked:** Adding a new target requires only a templateMap — zero renderer code changes.
- **Claude's Discretion:** Whether to keep Seedance-specific formatting nuances as separate template slots or a single template. Template string syntax details.

### D-04: Reducer-managed selection preservation (ARCH-04, TEST-13)
- **Locked:** `TARGET_CHANGED` action in reducer handles selection preservation: iterate current selections, query each option's `appliesTo`, keep if compatible with new target, silently drop if not.
- **Locked:** Incompatible selections are silently discarded — no toast, no notification. User sees the natural result: compatible options stay selected.
- **Locked:** safetyDefaults from Phase 01-02/01-04 are merged in the same reducer path (not a separate mechanism).
- **Claude's Discretion:** Whether to pre-compute per-target selection caches.

### D-05: appliesTo completeness + reverse mapping (ARCH-04, TEST-04)
- **Locked:** Audit all 134+ options and ensure every one has an explicit `appliesTo` field.
- **Locked:** Add `getTargetsForOption(optionId: string): TargetToolId[]` reverse lookup function to the option registry.
- **Locked:** `getOptionsForTarget()` (existing) and `getTargetsForOption()` (new) are the canonical filtering pair — UI uses former to show options, reducer uses latter to check compatibility.
- **Claude's Discretion:** Implementation details of the reverse index (build on register vs lazy compute).

### Claude's Discretion
- Reducer state shape and file location
- Template string syntax details (single vs multi-line templates)
- Whether to pre-compute per-target selection caches
- Warning formatting for suppressed options in UI
- Reverse index build strategy (eager on register vs lazy)
</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Phase 1 decisions (carried forward)
- `.planning/phases/01-safety-foundation/01-CONTEXT.md` — D-01 (safetyDefaults injection), D-02 (safety constraints), deselection tracking pattern

### Phase 2 decisions (carried forward)
- `.planning/phases/02-registry-architecture/02-CONTEXT.md` — D-01 (Map-based registry), D-02 (adapter self-registration), D-07 (registry domain split)
- `.planning/research/ARCHITECTURE.md` — Full registry pattern design
- `.planning/codebase/ARCHITECTURE.md` — Current architecture analysis

### Existing code
- `src/lib/prompt/types.ts` — OptionItem, PromptSelections, TargetToolConfig type definitions
- `src/lib/prompt/registry/option.registry.ts` — getOptionsForTarget, getOptionById
- `src/components/prompt-guide.tsx` — Current PromptGuide with useState (to be refactored)
- `src/lib/prompt/adapters.ts` — renderPrompt entry point
- `src/lib/prompt/brief.ts` — Brief builder (to be extended with suppress logic)
</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/lib/prompt/registry/` — Domain-split registry from Phase 02. option.registry.ts provides getOptionById, getOptionsForTarget. Add getTargetsForOption here.
- `src/lib/prompt/types.ts` — OptionItem already has `appliesTo: TargetToolId[]`. Add `suppresses?: string[]`.
- `src/components/prompt-guide.tsx` — Already uses `getOptionsForTarget` for appliesTo-aware option display. QuestionBlock, updateSelection, target switch handler all in place.

### Established Patterns
- Throw on registration failure, return string[] on CI validation (D-05 from Phase 02)
- Side-effect imports for adapter registration
- Map-based registry with register/resolve/getAll functions
- Bilingual zh/en for all user-facing strings

### Integration Points
- `PromptGuide` component — replace 3 useState + 1 useRef with useReducer
- `brief.ts` buildPromptBrief — add suppress detection pass
- `adapters.ts` renderPrompt — integrate templateMap from target config
- `registry/option.registry.ts` — add getTargetsForOption
- Option catalog files (12 files in options/) — add suppresses fields where needed
</code_context>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.
</deferred>

---

*Phase: 03-metadata-execution*
*Context gathered: 2026-05-12*
