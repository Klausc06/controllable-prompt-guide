# Phase 02: Registry Architecture - Research

**Researched:** 2026-05-12
**Domain:** TypeScript module-level registry pattern, structural refactoring (file split), validation architecture
**Confidence:** HIGH

## Summary

The Phase 02 registry implementation is already functionally complete: 149-line `registry.ts` with 5 Maps, 4 register functions (throw on duplicate), 4 resolve/get functions, 4 getAll iterators, and 1 filtered lookup. Three targets (seedance, generic_video, veo3) each have adapter objects that self-register at import time. The PromptGuide UI resolves workType and targets from the registry. All 58 tests pass, CI green.

Three new decisions (D-05, D-06, D-07) were made 2026-05-12. D-05 (throw on register, return string[] on CI) and D-06 (keep side-effect imports) are **already implemented** in the codebase — they confirm existing practice. D-07 (split registry.ts into domain files) requires structural refactoring with zero behavior change: extracting shared state, 4 domain registry modules, and a barrel index.ts.

Additionally, two test coverage gaps were identified for Phase 02 requirements: (1) no explicit test for `registerWorkType` rejecting an unknown `optionSetId`, and (2) `validateOptionIdsUnique` is only tested with the passing case, not the error-returning case. These are small but load-bearing for TEST-03 completeness.

**Primary recommendation:** Add 2 plans: Plan 02-04 (D-07 registry domain split) and Plan 02-05 (test gap closure + D-05 formalization).

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

- **D-01:** Map-based registries with register()/resolve() functions. TargetToolId = string, WorkTypeId = string. Throw on duplicate and unresolved lookup.
- **D-02:** Each adapter calls registerAdapter() at module import time. adapters.ts uses resolveAdapter().render() — no if/else.
- **D-03:** PromptGuide resolves workType by ID from registry, not direct import.
- **D-04:** Duplicate option/question IDs detected at registration time (throw). OptionSet reference validity checked at registration time. Adapter completeness checked at validation time (return string[]).
- **D-05:** Registration-time checks throw Error (fail-fast). CI-time checks return `string[]` (batch all errors).
- **D-06:** Side-effect imports in adapters.ts trigger registerAdapter(). Keep this pattern.
- **D-07:** Split registry.ts into `src/lib/prompt/registry/` subdirectory with domain files: `work-type.registry.ts`, `target.registry.ts`, `adapter.registry.ts`, `option.registry.ts`, `index.ts` barrel. Must preserve `from "./registry"` import path for all external consumers.

### Claude's Discretion

- Module-level Maps (not class-based) — already in place, confirmed correct
- Adapter refactoring approach — already done (separate renderer files)
- How workTypeId flows into UI — already done (lazy-resolved in component)
- OptionById Map construction strategy — already done (built during registerOptionSet)

### Deferred Ideas (OUT OF SCOPE)

None — all decisions within phase scope.
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| ARCH-01 | TargetToolId from hardcoded union to open string type + registry | Already implemented: `type TargetToolId = string` in both types.ts and registry.ts |
| ARCH-02 | Adapter from if/else to adapter registry pattern | Already implemented: `resolveAdapter().render()` in adapters.ts, no if/else |
| ARCH-03 | PromptGuide decoupled from direct workType/targets imports | Already implemented: `resolveWorkType("video_prompt")` + `getAllTargets()` |
| TEST-01 | Option ID uniqueness across all option sets | Already implemented: `registerOptionSet` throws on duplicate. `validateOptionIdsUnique` returns string[]. Both tested. |
| TEST-02 | Question ID uniqueness | Already implemented: `registerWorkType` throws on duplicate question IDs. Tested in registry.test.ts. |
| TEST-03 | OptionSet reference validity | **Gap identified:** `registerWorkType` checks optionSetId validity but only when `optionSetMap.size > 0`. No explicit test for the rejection path. |
| TEST-05 | Adapter completeness for every registered target | Already implemented: `validateAdapterCompleteness()` returns string[]. Tested for 3-target case. |

**Phase 2 scope note:** TEST-04 (appliesTo target refs), TEST-06 (output content), TEST-07 (output differences), TEST-08 (safety constraints), and TEST-09 (constraints behavior) are assigned to Phase 3 per REQUIREMENTS.md traceability. They happen to be tested in `validation.test.ts` due to inline execution of Phase 3, but are not Phase 2 deliverables.
</phase_requirements>

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| TypeScript | 5.7 | Registry type safety, open string types | Project constraint [VERIFIED: CLAUDE.md] |
| Vitest | 3.x | Unit tests for registry functions | Project constraint [VERIFIED: CLAUDE.md, package.json] |
| ES module system | — | Side-effect imports for self-registration | Standard JS pattern for plugin/registry architecture [VERIFIED: ES spec] |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| @testing-library/react | — | DOM-based UI tests for PromptGuide | Already in use for component tests, no registry changes needed |
| jsdom | — | Browser-like test environment | Required by vitest config, no changes needed |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Module-level Maps | Class-based Registry | Class adds ceremony; Map operations (get/has/set) are already the API surface. Module-level chosen per Claude's discretion in CONTEXT.md [VERIFIED: CONTEXT.md D-01] |
| Shared state module for Maps | Barrel-only with cross-imports | Cross-imports between domain files risk circular deps. Shared state module is cleaner. [ASSUMED] |

**Installation:**
No new dependencies required. D-07 is a pure structural refactoring of existing TypeScript code.

## Architecture Patterns

### Recommended Domain Split Structure (for D-07)
```
src/lib/prompt/registry/
├── state.ts              # Shared mutable Maps (5 Maps, no functions)
├── work-type.registry.ts # registerWorkType, resolveWorkType, getAllWorkTypes
├── target.registry.ts    # registerTarget, resolveTarget, getAllTargets
├── adapter.registry.ts   # registerAdapter, resolveAdapter, getAllAdapters
├── option.registry.ts    # registerOptionSet, getOptionById, getOptionSet,
│                         #   getOptionsForTarget, getAllOptionSets
└── index.ts              # Barrel re-export — preserves "from "./registry"" path
```

### Pattern 1: Shared State Module
**What:** A module (`state.ts`) that exports only the 5 Map objects. All domain registry files import from `state.ts` to read/write the shared Maps. No functions, no logic — only `export const workTypeMap = new Map<...>()` etc.

**When to use:** When splitting a module that has multiple consumers of shared mutable state, and direct cross-imports between domain files would create circular dependencies.

**Example:**
```typescript
// registry/state.ts — Source: existing registry.ts (to be extracted)
import type { OptionItem, OptionSet, TargetAdapter, TargetToolConfig, TargetToolId, WorkTypeConfig, WorkTypeId } from "../types";

export const workTypeMap = new Map<WorkTypeId, WorkTypeConfig>();
export const targetMap = new Map<TargetToolId, TargetToolConfig>();
export const adapterMap = new Map<TargetToolId, TargetAdapter>();
export const optionSetMap = new Map<string, OptionSet>();
export const optionItemMap = new Map<string, OptionItem>();
```

### Pattern 2: Domain Registry with Shared State
**What:** Each domain file imports the relevant Maps from `state.ts`, defines register/resolve/getAll functions, and re-exports types as needed.

**When to use:** After splitting, each domain file is self-contained for its domain concerns. Barrel re-exports unify the API.

**Example:**
```typescript
// registry/work-type.registry.ts — Source: existing registry.ts lines 19-53 (to be extracted)
import type { WorkTypeConfig, WorkTypeId } from "../types";
import { optionSetMap, workTypeMap } from "./state";

export function registerWorkType(config: WorkTypeConfig): void {
  if (workTypeMap.has(config.id)) {
    throw new Error(`Duplicate work type: ${config.id}`);
  }
  const questionIds = new Set<string>();
  const optionSetIdsInRegistry = new Set(optionSetMap.keys());
  for (const question of config.questions) {
    if (questionIds.has(question.id)) {
      throw new Error(`Duplicate question ID "${question.id}" in work type "${config.id}"`);
    }
    questionIds.add(question.id);
    if (question.optionSetId && optionSetMap.size > 0 && !optionSetIdsInRegistry.has(question.optionSetId)) {
      throw new Error(`Question "${question.id}" in work type "${config.id}" references unknown optionSet: ${question.optionSetId}`);
    }
    if (question.mode === "multi" && question.minSelections && question.maxSelections && question.minSelections > question.maxSelections) {
      throw new Error(`${question.id}: minSelections is greater than maxSelections`);
    }
  }
  workTypeMap.set(config.id, config);
}

export function resolveWorkType(id: WorkTypeId): WorkTypeConfig { /* ... */ }
export function getAllWorkTypes(): WorkTypeConfig[] { /* ... */ }
```

### Pattern 3: Barrel Re-Export Preserving Import Path
**What:** `registry/index.ts` re-exports all public functions and types from domain files. The barrel file also re-exports `TargetToolId` and `WorkTypeId` types. External consumers still import from `"./registry"` (which resolves to `registry/index.ts` via Node.js module resolution).

**When to use:** When splitting a single file into a directory, the barrel preserves backward compatibility for all existing imports.

**Example:**
```typescript
// registry/index.ts — Source: new file
export { registerWorkType, resolveWorkType, getAllWorkTypes } from "./work-type.registry";
export { registerTarget, resolveTarget, getAllTargets } from "./target.registry";
export { registerAdapter, resolveAdapter, getAllAdapters } from "./adapter.registry";
export { registerOptionSet, getOptionById, getOptionSet, getOptionsForTarget, getAllOptionSets } from "./option.registry";
export type { TargetToolId, WorkTypeId } from "../types";
```

### Anti-Patterns to Avoid
- **Cross-imports between domain files:** Each domain file importing from another domain file (e.g., `work-type.registry.ts` importing from `option.registry.ts`) risks circular dependencies. Always import Maps from `state.ts` instead.
- **Functions on state.ts:** Don't put register/resolve functions in state.ts. It exists only to hold the shared Maps. Functions belong in domain files.
- **Deleting the old registry.ts before verifying barrel:** The old `registry.ts` must be replaced by `registry/index.ts`, not just deleted. The barrel file maintains the module resolution path `"./registry"`.
- **Changing import paths in consumers:** External consumers (adapters.ts, prompt-guide.tsx, init.ts, validation.ts, brief.ts, options/index.ts, targets/index.ts, work-types/*, tests) must NOT change their import paths. The barrel preserves `from "./registry"`.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Class-based registry wrapper | Custom Registry class with get/set methods | Module-level Map consts with named functions | Maps already provide the API; a class adds ceremony without benefit. D-01 locked this choice [VERIFIED: CONTEXT.md D-01] |
| Lazy initialization of registries | `getOrCreateMap()` pattern | Module-level const Maps initialized at declaration | Registration happens at import time — no lazy init needed. The current Maps are created when the module loads. |
| Custom validation runner for CI | Build a new validation harness | Existing `validate*()` functions returning `string[]` | D-05 locked this pattern. All CI functions follow the same signature: `() => string[]` [VERIFIED: CONTEXT.md D-05, existing validation.ts] |

**Key insight:** The registry is pure data-in/data-out. The 5 Maps, register/resolve/getAll functions, and CI validation functions form a complete pattern. D-07 is a structural split, not an architectural redesign — the patterns don't change.

## Runtime State Inventory

> Include this section for rename/refactor/migration phases only.

| Category | Items Found | Action Required |
|----------|-------------|------------------|
| Stored data | None — project is pure frontend with no database, no localStorage persistence, no external datastore | None |
| Live service config | None — no external services, no n8n, no Datadog, no Tailscale | None |
| OS-registered state | None — no Task Scheduler tasks, no pm2 processes, no launchd plists, no systemd units | None |
| Secrets/env vars | None — `.env` and `.env.local` are in `.gitignore`, no SOPS keys reference registry paths | None |
| Build artifacts | None — Next.js static export (`out/` directory) is regenerated on `npm run build`; no stale per-module artifacts survive a rebuild | None |

**All categories clear.** D-07 is a filesystem-level TypeScript refactoring. The module resolution change (`registry.ts` → `registry/index.ts`) is transparent to Node.js and Next.js — both resolve `"./registry"` to `./registry/index.{ts,js}` natively [VERIFIED: Node.js module resolution spec].

## Common Pitfalls

### Pitfall 1: Breaking import paths during domain split
**What goes wrong:** External consumers `import { ... } from "./registry"` break because the old `registry.ts` was deleted but the new `registry/index.ts` barrel wasn't created, or the barrel doesn't re-export all functions.
**Why it happens:** Replacing a file with a directory requires the `index.ts` barrel convention. Forgetting this is the most common split-refactoring error.
**How to avoid:** Create `registry/index.ts` as a complete barrel BEFORE deleting `registry.ts`. Verify `npx tsc --noEmit` passes. Only then delete the old file.
**Warning signs:** `Cannot find module './registry'` or missing export errors in downstream files. CI typecheck fails.

### Pitfall 2: Shared Maps losing mutations across domain files
**What goes wrong:** Each domain file creates its own local Maps instead of importing shared Maps from `state.ts`. Registration functions appear to work but resolve functions can't find entries registered by other domain files.
**Why it happens:** Copying the Map declarations into each domain file instead of extracting them to a shared module.
**How to avoid:** Create `state.ts` FIRST, export the 5 Maps from it, then have every domain file import from `state.ts`. Test: `registerX(data)` in one domain file should make `resolveX(id)` in another domain file return the data.
**Warning signs:** `getAllAdapters()` returns empty after adapters register. `validateAdapterCompleteness()` reports missing adapters that should exist.

### Pitfall 3: init.ts import order breaking after domain split
**What goes wrong:** The barrel `index.ts` re-exports all domain files, but if the barrel imports them in an order that doesn't match the dependency chain (options before work types), the `registerWorkType` optionSetId validation might fail even though the options ARE registered.
**Why it happens:** The barrel file groups re-exports but doesn't control the import EVALUATION order. Module evaluation order in ES modules follows the import graph, not the order of re-export lines.
**How to avoid:** The barrel `index.ts` should only re-export — it should NOT have side-effect imports that trigger registration. Registration is triggered by init.ts, which imports the actual domain files in dependency order. Alternatively, the barrel can use explicit import+re-export statements in the correct order, which DOES control evaluation order in ES modules.
**Warning signs:** `registerWorkType` throws "unknown optionSet" during import, even though option sets are defined. This means options evaluated AFTER work types.

### Pitfall 4: Skipping the `optionSetMap.size > 0` guard
**What goes wrong:** If the `registerWorkType` check for optionSetId validity is unconditional (no `optionSetMap.size > 0` guard), it will incorrectly reject valid work types when option sets register AFTER work types.
**Why it happens:** The guard exists for a reason: if no options have been registered yet, the check is meaningless. Removing it during refactoring would make the validation stricter than intended.
**How to avoid:** Preserve the existing guard logic exactly: `if (question.optionSetId && optionSetMap.size > 0 && !optionSetIdsInRegistry.has(question.optionSetId))`. The `optionSetMap.size > 0` condition ensures the check only runs when options are already registered.
**Warning signs:** Tests that register work types without first registering option sets start failing with "unknown optionSet" errors.

## Code Examples

Verified patterns from the existing codebase (these are the patterns to preserve):

### Option Set Registration with Duplicate Detection
```typescript
// Source: src/lib/prompt/registry.ts lines 72-85 [VERIFIED: existing code]
export function registerOptionSet(set: OptionSet): void {
  if (optionSetMap.has(set.id)) {
    throw new Error(`Duplicate option set: ${set.id}`);
  }
  for (const option of set.options) {
    if (optionItemMap.has(option.id)) {
      throw new Error(
        `Duplicate option ID "${option.id}" in set "${set.id}" conflicts with existing option`
      );
    }
    optionItemMap.set(option.id, option);
  }
  optionSetMap.set(set.id, set);
}
```

### CI Validation Returning string[]
```typescript
// Source: src/lib/prompt/validation.ts lines 43-55 [VERIFIED: existing code]
export function validateAdapterCompleteness(): string[] {
  const errors: string[] = [];
  const targets = getAllTargets();
  const adapters = getAllAdapters();

  for (const target of targets) {
    if (!adapters.has(target.id)) {
      errors.push(`${target.id}: no adapter registered`);
    }
  }

  return errors;
}
```

### Self-Registering Adapter
```typescript
// Source: src/lib/prompt/renderers/veo3.renderer.ts [VERIFIED: existing code]
export const veo3Adapter: TargetAdapter = {
  target: veo3Target,
  render
};

registerAdapter("veo3", veo3Adapter);
```

### Barrel Import Order (init.ts)
```typescript
// Source: src/lib/prompt/init.ts [VERIFIED: existing code]
// Import order matters: option sets must register before work types
import "./options";         // 1. Options first
import "./targets";         // 2. Targets second
import "./renderers/...";   // 3. Adapters third
import "./work-types/...";  // 4. Work types last (validates optionSetId refs)
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `TargetToolId = "seedance" \| "generic_video"` (closed union) | `TargetToolId = string` (open) | Phase 2 | Adding new target requires zero changes to types.ts |
| `if (targetToolId === "seedance") { ... } else { ... }` | `resolveAdapter(id).render(brief)` | Phase 2 | Adding new target requires only renderer file + import line |
| `PromptGuide` importing `videoPromptWorkType` directly | `resolveWorkType("video_prompt")` | Phase 2 | Adding new work type requires only workType file + init.ts import |
| Single `registry.ts` (149 lines, 14 exports) | Domain-split `registry/` subdirectory (5 files) | Phase 2 D-07 | Each domain file < 50 lines, focused on one concern |
| Validation mixed in registry functions | Throw on register, `string[]` on CI | Phase 2 D-05 | Clear separation: registration is fail-fast, CI is batch-reporting |

**Deprecated/outdated:**
- `TargetToolId` as closed union: Replaced by open `string` type. No code uses the old pattern [VERIFIED: grep of codebase].

## Assumptions Log

> All claims tagged `[ASSUMED]` in this research. The planner and discuss-phase use this section to identify decisions that need user confirmation.

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | Shared state module (`state.ts`) is the right pattern for avoiding circular imports between domain files | Architecture Patterns | Low — alternatives (cross-imports) would create circular deps. If user prefers a different approach, only the internal structure changes, not the external API |
| A2 | `optionSetMap.size > 0` guard in `registerWorkType` should be preserved as-is | Common Pitfalls | Low — removing it would make tests fail. The guard is load-bearing for the "options might not be registered yet" scenario |
| A3 | The barrel `index.ts` re-exports from domain files using explicit `export { ... } from` syntax preserves ES module evaluation order | Common Pitfalls | Medium — ES module spec guarantees evaluation order for `import` followed by `export from`, but only if the barrel actually imports before re-exporting. Standard re-export does trigger the source module's evaluation. This assumption is correct per spec but subtle |
| A4 | No existing consumers import internal registry functions by file path (e.g., `from "./registry/state"`) — all use `from "./registry"` | Architecture Patterns | Low — verified via grep. All 7 consumer files use `from "./registry"` or `from "../registry"` [VERIFIED: codebase grep] |

## Open Questions (RESOLVED)

1. **Should `registry.ts` (old file) be deleted or kept as a re-export shim?**
   - What we know: The old `registry.ts` at 149 lines contains all functions. After splitting into `registry/index.ts`, keeping the old file as a re-export (`export * from "./registry/index"`) would support any edge-case imports that reference the exact file (unlikely).
   - What's unclear: Whether any tooling or test file references `registry.ts` by the `.ts` extension.
   - Recommendation: Delete `registry.ts` after creating `registry/index.ts`. Node.js module resolution handles the `"/registry"` → `"/registry/index"` resolution automatically. If any file explicitly imports `"./registry.ts"`, fix that import to `"./registry"` — the `.ts` extension in imports is an anti-pattern in TypeScript projects.

2. **Should `validateOptionIdsUnique` be updated to read from the registry directly?**
   - What we know: Currently `validateOptionIdsUnique(optionSets_?: OptionSet[])` takes an optional parameter and returns `string[]`. If called without arguments (`undefined`), it processes an empty array and returns `[]` (trivially empty).
   - What's unclear: Whether the function should fall back to `getAllOptionSets()` from the registry when called without arguments, matching the pattern used by `validateAdapterCompleteness()` and `validateOptionTargetRefs()`.
   - Recommendation: Update `validateOptionIdsUnique` to use `getAllOptionSets()` as fallback when no parameter is provided. This makes it consistent with other CI functions and ensures it works without manual parameter passing in CI pipelines.

3. **Should domain test files mirror the domain split?**
   - What we know: Currently `registry.test.ts` covers all domains in one file (333 lines). `validation.test.ts` covers CI functions.
   - What's unclear: Whether to split `registry.test.ts` into domain-specific test files matching the registry/ structure.
   - Recommendation: Keep a single `registry.test.ts` for now. The tests are integration tests that exercise cross-domain concerns (e.g., registering an option set before a work type). Splitting would fragment this test logic. The `registry.test.ts` file can import from `"./registry"` (barrel) identically to how it imports today.

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | All build/test commands | Yes | v22 (expected) | — |
| npm | Package scripts | Yes | — | — |
| npx vitest | Test execution (58 tests) | Yes | 3.x | — |
| npx tsc | Type checking | Yes | 5.7 | — |
| npx next | Build verification | Yes | 15.x | — |

**Missing dependencies with no fallback:** None — all tooling is standard Next.js/TypeScript/Vitest.

**Missing dependencies with fallback:** None.

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Vitest 3.x |
| Config file | `./vitest.config.ts` — jsdom environment, `@/` path alias |
| Quick run command | `npx vitest run src/lib/prompt/registry.test.ts --reporter=verbose` |
| Full suite command | `npm test` (runs all 58 tests) |

### Phase Requirements to Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| TEST-01 | Option ID uniqueness across sets | unit | `npx vitest run src/lib/prompt/registry.test.ts -t "duplicate option ID"` | Yes (registry.test.ts) |
| TEST-01 | CI validation returns empty for clean data | unit | `npx vitest run src/lib/prompt/validation.test.ts -t "keeps option ids unique"` | Yes (validation.test.ts) |
| TEST-02 | Question ID uniqueness within work type | unit | `npx vitest run src/lib/prompt/registry.test.ts -t "duplicate question"` | Yes (registry.test.ts) |
| TEST-03 | OptionSet reference validity at registration | unit | **GAP** — no explicit test for unknown optionSetId rejection | No |
| TEST-05 | Adapter completeness for all targets | unit | `npx vitest run src/lib/prompt/validation.test.ts -t "every registered target has a corresponding adapter"` | Yes (validation.test.ts) |

### Sampling Rate
- **Per task commit:** `npx vitest run src/lib/prompt/registry.test.ts src/lib/prompt/validation.test.ts --reporter=verbose`
- **Per wave merge:** `npm test` (full 58-test suite)
- **Phase gate:** `npm test && npx tsc --noEmit && npm run lint && npm run build`

### Wave 0 Gaps
- [ ] `src/lib/prompt/registry.test.ts` — **missing test**: `registerWorkType` rejecting unknown `optionSetId` (TEST-03 registration path). Add test: call `registerWorkType` with `optionSetId: "nonexistent_set"` when `optionSetMap` is non-empty, expect throw.
- [ ] `src/lib/prompt/validation.test.ts` — **missing test**: `validateOptionIdsUnique` returning non-empty array when duplicates exist. Add test: create two option sets with colliding option IDs, verify function returns the duplicate ID.

## Security Domain

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V2 Authentication | No | N/A — pure frontend, no auth |
| V3 Session Management | No | N/A — no server sessions |
| V4 Access Control | No | N/A — no role-based access |
| V5 Input Validation | Yes | TypeScript `satisfies` keyword, registration-time duplicate detection (throw), CI `validate*()` functions returning `string[]` |
| V6 Cryptography | No | N/A — no encryption needed |

### Known Threat Patterns for TypeScript Module-Level Registry

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| Duplicate option ID silently overwrites existing entry | Tampering | `registerOptionSet()` throws on duplicate — prevents overwrite [VERIFIED: registry.ts line 77-83] |
| Unregistered adapter causes silent generic fallback | Denial of Service | `resolveAdapter()` throws on unknown ID — no silent fallback [VERIFIED: registry.ts line 103-109] |
| Import order dependency silently skips validation | Tampering | `init.ts` explicitly documents and enforces import order (options → targets → adapters → work types) [VERIFIED: init.ts] |
| Unknown optionSetId in work type questions | Tampering | `registerWorkType()` validates optionSetId references when options are registered; CI `validateWorkTypeConfig()` checks parameter-based [VERIFIED: registry.ts lines 32-40, validation.ts lines 29-30] |

## Sources

### Primary (HIGH confidence)
- `src/lib/prompt/registry.ts` — Current implementation, 149 lines, all functions verified [VERIFIED: codebase read]
- `src/lib/prompt/types.ts` — Open type definitions, all interfaces [VERIFIED: codebase read]
- `src/lib/prompt/validation.ts` — CI validation functions [VERIFIED: codebase read]
- `src/lib/prompt/init.ts` — Import order barrel [VERIFIED: codebase read]
- `src/lib/prompt/adapters.ts` — Registry-based dispatch [VERIFIED: codebase read]
- `src/components/prompt-guide.tsx` — UI decoupled from direct imports [VERIFIED: codebase read]
- `.planning/phases/02-registry-architecture/02-CONTEXT.md` — Locked decisions D-01 through D-07 [VERIFIED: codebase read]
- `.planning/phases/02-registry-architecture/02-DISCUSSION-LOG.md` — Discussion audit trail [VERIFIED: codebase read]
- `.planning/REQUIREMENTS.md` — Phase-to-requirement mapping [VERIFIED: codebase read]
- `CLAUDE.md` — Project conventions (kebab-case, no `any`, validation returns `string[]`) [VERIFIED: codebase read]

### Secondary (MEDIUM confidence)
- `vitest.config.ts` — Test configuration in codebase [VERIFIED: codebase read]
- `src/test/setup.ts` — Test setup imports init.ts [VERIFIED: codebase read]
- Test run output — 58/58 tests passing, 3 test files [VERIFIED: live test run]

### Tertiary (LOW confidence)
- None — all claims verified against codebase or configuration files.

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — all tools verified via codebase, CLAUDE.md, and live test run
- Architecture: HIGH — domain split pattern verified against existing code structure; shared state pattern is a standard TypeScript module pattern
- Pitfalls: HIGH — based on analysis of current import graph (7 consumer files, init.ts order, registry.ts structure)
- Test gaps: HIGH — manually verified via code review of registry.test.ts and validation.test.ts against Phase 02 requirements

**Research date:** 2026-05-12
**Valid until:** 2026-06-12 (stable — domain split is a structural refactoring of well-understood patterns)

## Recommended Additional Plans

Based on this research, two additional plans are recommended beyond the existing 3:

### Plan 02-04: D-07 Registry Domain Split
**Type:** Structural refactoring, zero behavior change
**Files:** Create `registry/state.ts`, `registry/work-type.registry.ts`, `registry/target.registry.ts`, `registry/adapter.registry.ts`, `registry/option.registry.ts`, `registry/index.ts`. Delete old `registry.ts`.
**Key tasks:**
1. Create `registry/state.ts` with the 5 shared Maps
2. Extract `work-type.registry.ts` (registerWorkType, resolveWorkType, getAllWorkTypes)
3. Extract `target.registry.ts` (registerTarget, resolveTarget, getAllTargets)
4. Extract `adapter.registry.ts` (registerAdapter, resolveAdapter, getAllAdapters)
5. Extract `option.registry.ts` (registerOptionSet, getOptionById, getOptionSet, getOptionsForTarget, getAllOptionSets)
6. Create `registry/index.ts` barrel re-exporting all functions and types
7. Replace old `registry.ts` with the barrel (ensuring `from "./registry"` continues to work)
8. Verify all 58 tests pass, CI green

### Plan 02-05: D-05 Formalization + Test Gap Closure
**Type:** Validation hardening, small scope
**Files:** `src/lib/prompt/registry.test.ts` (add 1 test), `src/lib/prompt/validation.test.ts` (add 1 test), `src/lib/prompt/validation.ts` (optional: update `validateOptionIdsUnique` to use registry as fallback)
**Key tasks:**
1. Add test for `registerWorkType` rejecting unknown optionSetId (TEST-03 registration path)
2. Add test for `validateOptionIdsUnique` returning error array when duplicates exist
3. Optionally update `validateOptionIdsUnique()` to fall back to `getAllOptionSets()` when no parameter provided
4. Add code comments documenting the throw-vs-return validation convention per D-05
5. Verify all 58+ tests pass, CI green
