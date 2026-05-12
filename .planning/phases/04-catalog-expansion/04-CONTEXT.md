# Phase 04: Catalog Expansion — Context

**Gathered:** 2026-05-12
**Status:** Ready for planning
**Requirements:** OPT-01, OPT-02, OPT-03, OPT-05, OPT-06

<domain>
## Phase Boundary

Expand option catalogs to 180+ options across 12 dimensions. Add namespace prefixes to all option IDs. Complete metadata (riskHint) for all options. Camera dimension already split (shot_type + camera_movement). Markdown export already implemented.
</domain>

<decisions>
## Implementation Decisions

### D-01: Full namespace prefix migration (OPT-05)
- **Locked:** ALL 136 option IDs gain namespace prefix: `{catalogId}:{optionId}`.
- **Locked:** New format: `"use_case:gym_opening"`, `"shot_type:medium_shot"`, `"constraints:no_ip_or_celebrity"`.
- **Locked:** ALL references updated: defaults in prompt-guide.tsx, safetyDefaults in 3 target configs, templateMap keys in 3 target configs, test fixtures in registry.test.ts + validation.test.ts.
- **Locked:** `validateOptionIdFormat()` added to validation.ts — CI checks that every option ID starts with its catalog prefix.
- **Claude's Discretion:** Migration order — whether to rename IDs or update references first.

### D-02: Catalog expansion to 180+ options (OPT-01)
- **Locked:** Each catalog must have at least 15 options.
- **Locked:** Weak spots to prioritize: format (5→15), camera-movement (9→15), shot-type (9→15), text-handling (9→15).
- **Claude's Discretion:** Exact option content, creative decisions for new options. Which catalog gets how many over the minimum.

### D-03: Complete metadata for all options (OPT-02)
- **Locked:** Every option must have: label (zh/en), plain (zh/en), professionalTerms (en[]), promptFragment (zh/en), appliesTo, riskHint (zh/en, may be empty string if no risk).
- **Locked:** riskHint must be substantive for constraints and text_handling catalogs (where risk is real). May be empty for lighting, style, scene, audio, use-case (where risk is low or non-existent).
- **Claude's Discretion:** riskHint content for borderline cases.

### OPT-03: Camera dimension split — ALREADY DONE
shot-type.options.ts (9 options) + camera-movement.options.ts (9 options). Verified independently registered and testable.

### OPT-06: Markdown export — ALREADY DONE
`renderMarkdown()` in brief.ts + CopyButton in prompt-guide.tsx. Verified working.

### Claude's Discretion
- New option content (labels, plain, promptFragments) — planner decides creative specifics
- riskHint content for borderline catalogs
- Migration order for D-01
- Exact option counts per catalog above the 15 minimum
</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Phase 1-3 decisions (carried forward)
- `.planning/phases/01-safety-foundation/01-CONTEXT.md` — safetyDefaults injection, deselection tracking
- `.planning/phases/02-registry-architecture/02-CONTEXT.md` — registry architecture, validation patterns
- `.planning/phases/03-metadata-execution/03-CONTEXT.md` — templateMap, suppress/warn, useReducer, getTargetsForOption

### Existing catalog files
- `src/lib/prompt/options/*.options.ts` (12 files, 136 options) — base data to be renamed and expanded
- `src/lib/prompt/options/index.ts` — option catalog barrel

### Affected files for D-01 migration
- `src/lib/prompt/options/*.options.ts` — 136 option IDs to rename
- `src/components/prompt-guide.tsx` — defaults (12 values)
- `src/lib/prompt/targets/*.target.ts` — safetyDefaults + templateMap keys (3 files, 60+ keys)
- `src/lib/prompt/registry.test.ts` / `src/lib/prompt/validation.test.ts` — test fixtures
</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- 12 option catalog files under `src/lib/prompt/options/` — ready for expansion
- `registerOptionSet()` in `registry/option.registry.ts` — validates duplicates on registration
- `validateOptionIdsUnique()` in `validation.ts` — CI check for cross-catalog collisions
- `getTargetsForOption()` — reverse index (D-05 from Phase 3)

### Established Patterns
- Option format: `{ id, version: "0.1.0", label, plain, professionalTerms, promptFragment, appliesTo, riskHint?, suppresses? }`
- registry/ directory structure from Phase 2 — option.registry.ts handles registration
- templateMap on target configs — keys are questionIds, values are LocalizedText with `{选项}` placeholder

### Integration Points
- `options/index.ts` — barrel file importing all 12 catalogs (triggering registerOptionSet)
- `prompt-guide.tsx` defaults — will need all references updated for D-01
- `targets/*.target.ts` templateMap keys — match questionIds (not option IDs), unaffected by D-01 unless the questionId key itself changes (it doesn't)
</code_context>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.
</deferred>

---

*Phase: 04-catalog-expansion*
*Context gathered: 2026-05-12*
