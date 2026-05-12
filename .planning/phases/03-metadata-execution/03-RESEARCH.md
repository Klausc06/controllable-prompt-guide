# Phase 03: Metadata Execution — Research

**Researched:** 2026-05-12
**Domain:** React state management (useReducer) + template-driven rendering + data-driven option filtering/suppression
**Confidence:** HIGH

## Summary

Phase 03 turns option catalog metadata into runtime behavior. The four pillars: (1) replace multiple useState hooks with event-sourcing useReducer, (2) add `suppresses` and `templateMap` fields to data types that drive rendering without code changes, (3) build reverse index `getTargetsForOption()` for selection preservation on target switch, (4) refactor renderers from hand-crafted prompt assembly to template-map-driven generic assembly.

This is the first phase that requires actual implementation — no pre-written code exists. All 5 decisions from CONTEXT.md (D-01 through D-05) are locked; research focuses on HOW to implement them within the existing registry architecture.

**Primary recommendation:** Implement in 4 waves: (1) data model + reverse index, (2) reducer with selection preservation, (3) template-map renderer + suppress detection, (4) appliesTo audit + test closure. The reducer and template-map changes are independent enough to develop in parallel within a wave.

## User Constraints (from CONTEXT.md)

### Locked Decisions

| Decision | Summary |
|----------|---------|
| D-01 | useReducer with event-sourcing: TARGET_CHANGED (from/to), OPTION_SELECTED, OPTION_DESELECTED, TOGGLE_ADVANCED. Reducer computes all derived state in one pass. deselectSafetyRef merges into reducer state. |
| D-02 | OptionItem gains optional `suppresses: string[]` field. Brief builder reads it. Suppress rules are DATA, never code in renderer/brief builder. |
| D-03 | TargetToolConfig gains `templateMap: Record<QuestionId, string>`. Template uses `{选项}` placeholder. Generic renderer: iterate brief items, lookup templateMap, replace. New target = templateMap only. |
| D-04 | TARGET_CHANGED in reducer handles selection preservation. Query each option's appliesTo. Compatible = keep, incompatible = silent discard. safetyDefaults merged in same reducer path. |
| D-05 | Audit all 124+ options for appliesTo completeness. Add `getTargetsForOption(optionId: string): TargetToolId[]` reverse index. `getOptionsForTarget()` + `getTargetsForOption()` = canonical filtering pair. |

### Claude's Discretion

- Reducer state shape structure and file location (inline vs separate file)
- Template string syntax details (single vs per-locale slots)
- Whether to pre-compute per-target selection caches
- Warning formatting for suppressed options in UI
- Reverse index build strategy (eager on register vs lazy)

### Deferred Ideas (OUT OF SCOPE)

None — discussion stayed within phase scope.

## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| ARCH-04 | Option filtering by target (appliesTo/prefer/suppress) | D-05 reverse index + D-02 suppress detection in brief builder |
| ARCH-05 | Renderer driven by templateMap, not magic question IDs | D-03 generic template engine replaces hand-crafted render functions |
| ARCH-06 | Generic renderer covers text_handling dimension | D-03 templateMap includes text_handling slot; generic engine processes all brief items uniformly |
| ARCH-08 | Each selection appears in output or is suppressed with warning | D-02 suppress detection pass in buildPromptBrief generates amber warnings |
| TEST-04 | AppliesTo target refs validate | validateOptionTargetRefs() already exists; needs extension for suppresses refs |
| TEST-06 | Selected option promptFragment appears in output | Existing test covers this; needs suppress scenario tests |
| TEST-07 | Seedance and generic outputs differ | Existing test covers this; verify after template-map refactor |
| TEST-09 | Constraints required/min/max/deselect/max cap behavior | Reducer must enforce maxSelections; existing test covers cap |
| TEST-13 | UI target switch doesn't lose selections | Reducer TARGET_CHANGED path; new component test |

## File-Level Impact Analysis

### Files to MODIFY (implement)

| File | Current State | Changes Needed | Risk |
|------|--------------|----------------|------|
| `src/lib/prompt/types.ts` | OptionItem (8 fields), TargetToolConfig (8 fields) | +`suppresses?: string[]` on OptionItem; +`templateMap: Record<string, LocalizedText>` on TargetToolConfig | LOW — additive, backward-compatible |
| `src/lib/prompt/registry/option.registry.ts` | getOptionById, getOptionsForTarget, etc. | +`getTargetsForOption(optionId): TargetToolId[]` reverse index | MEDIUM — new data structure (reverse map) |
| `src/lib/prompt/registry/index.ts` | Re-exports 11 functions | +`getTargetsForOption` export | TRIVIAL |
| `src/lib/prompt/brief.ts` | buildPromptBrief, getBriefText, getCameraText, renderMarkdown, warningFromBrief | +`suppressDetectionPass` inside buildPromptBrief; generates amber warnings | MEDIUM — brief builder is central, must not regress |
| `src/lib/prompt/adapters.ts` | renderPrompt entry point; safety+warnings post-processing | +`assemblePrompt(brief, templateMap, locale)` generic render; existing post-processing preserved | MEDIUM — consolidates 3 renderers into 1 engine |
| `src/components/prompt-guide.tsx` | 3 useState + 1 useRef in PromptGuide | Replace with single useReducer; refactor targetSwitch handler into reducer | HIGH — most complex change, UI must not regress |
| `src/lib/prompt/targets/seedance.target.ts` | 8 fields | +`templateMap` field (12 slot templates) | LOW — data only |
| `src/lib/prompt/targets/generic-video.target.ts` | 8 fields | +`templateMap` field (12 slot templates) | LOW — data only |
| `src/lib/prompt/targets/veo3.target.ts` | 8 fields | +`templateMap` field (11 slot templates) | LOW — data only |
| `src/lib/prompt/renderers/seedance.renderer.ts` | 89 lines, hand-crafted zh/en assembly | Simplify to adapter wrapper calling generic assemblePrompt | MEDIUM — output must not regress |
| `src/lib/prompt/renderers/generic-video.renderer.ts` | 101 lines, hand-crafted zh/en assembly | Simplify to adapter wrapper calling generic assemblePrompt | MEDIUM — output must not regress |
| `src/lib/prompt/renderers/veo3.renderer.ts` | 68 lines, hand-crafted zh/en assembly | Simplify to adapter wrapper calling generic assemblePrompt | MEDIUM — output must not regress |
| `src/lib/prompt/options/*.options.ts` (12 files) | 124 options, all have appliesTo, none have suppresses | Audit appliesTo (already complete); add suppresses where needed | LOW — data only, no options currently suppress others |
| `src/lib/prompt/registry/state.ts` | 5 Maps | +`targetsByOption` Map for reverse index | LOW — additive |

### Files to ADD

| File | Purpose |
|------|---------|
| `src/lib/prompt/reducer.ts` | PromptGuideReducer with 4 event-sourcing actions (if separate file per Claude's discretion) |

### Files to NOT modify

| File | Reason |
|------|--------|
| `src/lib/prompt/init.ts` | Import order unchanged; renderers still self-register via side-effect imports |
| `src/lib/prompt/registry/work-type.registry.ts` | No work type changes in this phase |
| `src/lib/prompt/registry/adapter.registry.ts` | Adapter interface unchanged |
| `src/lib/prompt/registry/target.registry.ts` | No new registration behavior needed |
| `src/lib/prompt/heuristics.ts` | Quality heuristics unchanged by template-map refactor |
| `src/lib/prompt/validation.ts` | May need minor extension for suppresses ref validation |

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| React useReducer | 19.x (built-in) | Single reducer for complex state + cross-cutting transitions | Built-in; event-sourcing semantics require exactly this; no external dependency |
| TypeScript discriminated unions | 5.7 (built-in) | Type-safe action types | Enables exhaustive switch checks on action.type; compiler catches missing cases |
| Vitest | 3.x | Unit + component tests | Already configured with jsdom; 60 tests passing; no change needed |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| @testing-library/react | 16.x | Component render testing | prompt-guide.test.tsx; needed for reducer-driven UI tests |
| @testing-library/jest-dom | 6.x | DOM assertions | Already in setup.ts; toBeInTheDocument() etc. |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| useReducer | Zustand | Removed from consideration per REQUIREMENTS.md: "Zustand/Redux 状态管理 — 单组件树不需要" |
| useReducer | Multiple useState + useEffect | Breaks D-01: must compute all derived state in one pass, no useEffect chains |
| Template literal in renderer | Hand-crafted string assembly per renderer | Hand-crafted is current approach; templateMap eliminates per-target renderer code (D-03) |

**Installation:** No new packages needed. All infrastructure uses existing React 19 + TypeScript 5.7 + Vitest 3.

**Version verification:**
```bash
npm view react version           # 19.2.0 (verified 2026-05-12)
npm view typescript version      # 5.8.3 (project uses 5.7)
npm view vitest version          # 3.1.3 (verified 2026-05-12)
```
[VERIFIED: npm registry]

## Architecture Patterns

### Pattern 1: Event-Sourcing Reducer (D-01)

**What:** Single `useReducer` with action types that describe what happened (not what to change). Reducer computes all derived state from action + previous state in one pure function.

**When to use:** All state transitions in PromptGuide component. The reducer replaces:
- `useState(targetToolId)` — `TARGET_CHANGED` action
- `useState(selections)` — `OPTION_SELECTED` / `OPTION_DESELECTED` actions
- `useState(advancedOpen)` — `TOGGLE_ADVANCED` action
- `useRef(deselectedSafety)` — Merge into reducer state

**State shape (recommended):**
```typescript
// Source: project convention + D-01 requirements
interface PromptGuideState {
  targetToolId: TargetToolId;
  selections: PromptSelections;
  advancedOpen: boolean;
  deselectedSafety: Set<string>;  // was useRef
}
```

**Action types:**
```typescript
type PromptGuideAction =
  | { type: "TARGET_CHANGED"; from: TargetToolId; to: TargetToolId }
  | { type: "OPTION_SELECTED"; questionId: string; optionId: string }
  | { type: "OPTION_DESELECTED"; questionId: string; optionId: string }
  | { type: "TOGGLE_ADVANCED" }
```

**File location recommendation:** Separate file `src/lib/prompt/reducer.ts`. Rationale: reducer is ~80-120 lines of pure logic with no React imports (only types + registry imports for appliesTo lookups). This makes it unit-testable without React, and keeps prompt-guide.tsx focused on rendering. [ASSUMED — Claude's discretion area; inline is also valid but harder to test]

### Pattern 2: Reverse Index for Target Switching (D-05)

**What:** Map `optionId → Set<TargetToolId>` built eagerly when option sets register. Used by reducer's `TARGET_CHANGED` path to check compatibility quickly.

**Implementation:**
```typescript
// In option.registry.ts or state.ts
const targetsByOption = new Map<string, Set<TargetToolId>>();

// Populated in registerOptionSet()
for (const option of set.options) {
  targetsByOption.set(option.id, new Set(option.appliesTo));
}

// Query function
export function getTargetsForOption(optionId: string): TargetToolId[] {
  return [...(targetsByOption.get(optionId) ?? [])];
}
```

**Build strategy:** Eager on register (O(n) once at startup for 124 options). Lazy would require iterating all option sets per query. Eager is preferred because (a) option count is bounded (~200 max), (b) TARGET_CHANGED queries all selected options — lazy would be O(selections × options) per switch.

### Pattern 3: Template-Map Rendering (D-03)

**What:** Each target config carries `templateMap` — a mapping from question IDs to localized template strings. A generic `assemblePrompt()` function replaces hand-crafted render functions.

**Template format:** Each template string uses `{选项}` as the placeholder for option text. The generic engine replaces `{选项}` with the joined promptFragment text for each brief item.

**TemplateMap shape (recommended extension of D-03's `Record<QuestionId, string>`):**
```typescript
// D-03 says Record<QuestionId, string> but bilingual output requires both locales.
// Recommended: use LocalizedText to match project convention.
templateMap: Record<string, { zh: string; en: string }>
// Example entry:
// "subject": { zh: "主体：{选项}。", en: "Subject: {选项}." }
```

**Generic engine pseudo-code:**
```typescript
// Source: project design (D-03 locked decision), implementation Claude's discretion
function assemblePrompt(
  brief: PromptBrief,
  templateMap: Record<string, { zh: string; en: string }>,
  locale: "zh" | "en"
): string {
  const lines: string[] = [];
  for (const item of brief.items) {
    const template = templateMap[item.questionId];
    if (!template) continue;  // Skip dimensions without template slot
    const optionText = item.freeText 
      || item.selectedOptions.map(o => o.promptFragment[locale]).join(
          locale === "zh" ? "；" : "; "
        );
    lines.push(template[locale].replace("{选项}", optionText));
  }
  return lines.join("\n");
}
```

**How existing renderers change:** Each renderer's custom `render()` function is replaced by a call to `assemblePrompt()`. The adapter still exists (for registration) but its render method is trivial:
```typescript
function render(brief: PromptBrief): RenderedPrompt {
  const zhPrompt = assemblePrompt(brief, this.target.templateMap, "zh");
  const enPrompt = assemblePrompt(brief, this.target.templateMap, "en");
  return {
    version: "0.1.0",
    targetToolId: this.target.id,
    zhPrompt, enPrompt, brief,
    adaptationNote: this.target.adaptationNote,
    warnings: warningFromBrief(brief)
  };
}
```

**Seedance-specific formatting:** The current Seedance renderer has custom labels ("镜头调度" not "镜头", "动作与叙事" not "动作"). These are encoded in the templateMap's template strings. The generic engine is format-agnostic — it just replaces placeholders. Formatting nuances are DATA in templateMap, not CODE in renderer.

### Pattern 4: Data-Driven Suppress Detection (D-02)

**What:** A pass in `buildPromptBrief` that removes suppressed options from output and generates amber warnings. Rules come from `OptionItem.suppresses` field — zero code in renderer or brief builder.

**Where it runs:** Inside `buildPromptBrief`, after the initial selectedOptions assembly, before returning the BriefItem.

**Algorithm:**
```typescript
// Pass added to buildPromptBrief, per BriefItem
function applySuppressRules(selectedOptions: OptionItem[]): {
  visible: OptionItem[];
  warnings: LocalizedText[];
} {
  const suppressedIds = new Set<string>();
  const suppressors: OptionItem[] = [];
  
  // Pass 1: collect all suppression targets
  for (const opt of selectedOptions) {
    if (opt.suppresses) {
      suppressors.push(opt);
      for (const targetId of opt.suppresses) {
        suppressedIds.add(targetId);
      }
    }
  }
  
  // Pass 2: filter + generate warnings
  const warnings: LocalizedText[] = [];
  const visible: OptionItem[] = [];
  for (const opt of selectedOptions) {
    if (suppressedIds.has(opt.id)) {
      const suppressor = suppressors.find(s => s.suppresses?.includes(opt.id));
      if (suppressor) {
        warnings.push({
          zh: `"${opt.label.zh}" 被 "${suppressor.label.zh}" 覆盖`,
          en: `"${opt.label.en}" overridden by "${suppressor.label.en}"`
        });
      }
    } else {
      visible.push(opt);
    }
  }
  
  return { visible, warnings };
}
```

**Data initialization:** None of the current 124 options have `suppresses` defined. The field and mechanism are built now; catalog authors add relationships in future catalog work. This satisfies ARCH-08 (the mechanism exists and is testable).

### Anti-Patterns to Avoid

- **Reducer with side effects:** Never call `resolveTarget()`, `getTargetsForOption()`, or any registry function inside the reducer that could throw. The reducer must remain pure. Wrap throws in the dispatch wrapper or caller.
- **Importing registry in reducer:** The reducer needs registry data (appliesTo for selection preservation, safetyDefaults for target switch). If the reducer imports registry directly, it couples logic to runtime state. Recommended: pass needed registry lookups as parameters through the action payload, or use a curried reducer `createPromptGuideReducer(workType)` that closes over workType config.
- **Mutating Set in reducer state:** `new Set()` must be used for every state update. Never `.add()` or `.delete()` on the previous state's Set.
- **Rebuilding reverse index per query:** The `targetsByOption` reverse map should be built once in `registerOptionSet()`, not recomputed per `getTargetsForOption()` call.
- **Dropping suppress warnings:** The `suppressedOptions` with their warnings must be propagated from buildPromptBrief to the RenderedPrompt's `warnings` array, not silently discarded.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Complex state transitions | Multi-useState + useEffect chains | useReducer with event-sourcing actions | D-01 locked; useEffect chains cause intermediate renders and stale closure bugs |
| Imperative target switch selection reconciliation | Manual loops in event handlers | Reducer TARGET_CHANGED path with getTargetsForOption() | Single pass, pure function, testable in isolation |
| Custom template engine | String.replace with regex | Simple `"{选项}"` replacement (D-03 locked format) | Over-engineering; the format is simple enough that String.replace is the right tool |
| Set deep-copy utility | Lodash cloneDeep | `new Set(prevSet)` | One built-in call, no dependency |
| Reducer action type narrowing | Manually typed switch | TypeScript discriminated union on `action.type` | Compiler catches missing cases automatically |

**Key insight:** The complexity in this phase is structural (coordination between reducer, registry, brief builder, and renderer), not algorithmic. The most error-prone part is ensuring all data flows preserved during the refactor (safety defaults, deselection tracking, maxSelections cap).

## Runtime State Inventory

> This phase is refactoring (useState to useReducer) + feature addition (templateMap, suppresses). It does NOT rename anything or migrate stored state. The project is a pure frontend with no database, no external services, no OS-level registrations.

| Category | Items Found | Action Required |
|----------|-------------|----------------|
| Stored data | None — no database, localStorage, or persistent storage | None |
| Live service config | None — no external services configured | None |
| OS-registered state | None — no systemd, launchd, pm2, or Task Scheduler entries | None |
| Secrets/env vars | None — no .env files, no API keys, no SOPS | None |
| Build artifacts | `out/` static export directory (stale after any source change) | Rebuild: `npm run build` after phase completion; no migration needed |

**Nothing found in any category.** This is a code-only phase. No data migration, no service reconfiguration, no secret rotation required.

## Environment Availability

**Step 2.6: SKIPPED (no external dependencies identified).**

Phase 03 is a pure code/config change using existing build tooling (Node.js, npm, TypeScript, Vitest — all confirmed present by the 60 passing tests). No database, service, runtime, or CLI tool beyond what Phase 2 already required.

## Common Pitfalls

### Pitfall 1: Reducer Loses Safety Default Deselection State

**What goes wrong:** When `TARGET_CHANGED` fires, safetyDefaults from the new target are merged into constraints. If the user previously deselected a safety default on target A, switched to B, then back to A — the deselection tracking must survive the round-trip. The `deselectedSafety` Set tracks this, but only if the reducer correctly checks it before adding safety defaults.

**Why it happens:** The current useState pattern handles this with a separate useRef that survives re-renders. In the reducer, the Set must be part of state and must be correctly referenced in the TARGET_CHANGED path.

**How to avoid:** The TARGET_CHANGED reducer path must:
1. Resolve the new target config's `safetyDefaults`
2. Filter out any IDs present in `state.deselectedSafety`
3. Merge the remaining safety defaults into constraints
4. On user deselection of a safety default (in OPTION_DESELECTED for constraints), add to deselectedSafety
5. On user re-selection of a previously deselected safety default (in OPTION_SELECTED for constraints), remove from deselectedSafety

**Warning signs:** Test "switches target without losing selections" (TEST-13) passes but "preserves safety default deselection across target switches" (ARCH-07 from Phase 1) regresses.

### Pitfall 2: TemplateMap Causes Render Regression

**What goes wrong:** The current renderers have hand-crafted prompts with specific formatting, defaults for missing dimensions, and locale-specific joiners. The generic template engine produces different output, breaking existing output assertion tests.

**Root cause:** The template engine must exactly replicate the current output format for all 3 targets. Any template string mismatch produces visible prompt differences.

**How to avoid:**
1. Extract current render output for a complete selection set (as golden test data)
2. Build templateMaps by reverse-engineering the current renderers
3. Run existing tests after template-map refactor; fix any output differences
4. Add golden-file or snapshot tests for prompt output if not present

**Warning signs:** "selected option promptFragment appears in rendered output (TEST-06)" fails after templateMap changes. Seedance/GV output diff test (TEST-07) fails.

### Pitfall 3: Reducer Does Not Enforce maxSelections on multi Dimensions

**What goes wrong:** With useState, the UI's `toggleOption` function enforces maxSelections (line 114 of prompt-guide.tsx: `const limited = question.maxSelections ? next.slice(0, question.maxSelections) : next`). After moving to useReducer, this enforcement must be in the reducer's OPTION_SELECTED path, not in UI code.

**Root cause:** If the reducer blindly adds to the array without checking question.maxSelections, the brief builder's slice-to-max becomes the only enforcement — which is correct but violates the "reducer computes all derived state" principle and could cause UI display issues.

**How to avoid:** The reducer's OPTION_SELECTED handler must:
1. Get the question schema for the questionId (passed via action or from workType)
2. For multi mode: check maxSelections; if adding would exceed, reject or trim
3. The QuestionBlock component should still visually indicate the cap via the badge text

**Warning signs:** TEST-09 (constraints cap) passes (brief builder slices) but UI shows 5 selected constraints when maxSelections=4.

### Pitfall 4: Suppress Warnings Lost Between Brief Builder and Renderer

**What goes wrong:** buildPromptBrief generates suppress warnings, but they're returned alongside the BriefItem and must be collected and added to RenderedPrompt.warnings. If the propagation chain breaks, the user never sees the amber warning.

**Root cause:** The current `warningFromBrief()` function collects `riskHint` warnings from options in the brief. It does NOT collect suppress warnings. A new warning collection mechanism is needed.

**How to avoid:** Two options:
1. Add a `suppressWarnings` field to PromptBrief so they travel with the brief
2. Generate suppress warnings in the renderer (post-brief, like safety/default warnings)
Option 1 is cleaner (brief carries all its metadata) but requires a types.ts change. Option 2 is simpler to implement but splits warning logic. Recommend Option 1.

### Pitfall 5: Inline Reducer Makes prompt-guide.tsx Untestable in Isolation

**What goes wrong:** If the reducer is defined inside PromptGuide component (closure), it can only be tested via component rendering. Reducer logic (selection preservation, safety default merging, maxSelections cap) has ~10 edge cases that need unit tests.

**Root cause:** Inline reducers are common in simple React apps, but this reducer has business logic that benefits from isolated testing.

**How to avoid:** Define reducer as an exported function in a separate file (`src/lib/prompt/reducer.ts`). Import into prompt-guide.tsx. Import into test file for direct unit testing. This costs 1 file but eliminates the need for complex component-test setups for reducer edge cases.

## Code Examples

### Reducer: TARGET_CHANGED Path (D-04)

```typescript
// Source: project design D-04, implementation Claude's discretion
// This is the most complex reducer branch. It must:
// 1. Filter current selections by compatibility with new target
// 2. Merge safetyDefaults (respecting deselectedSafety)
// 3. Return new state

function handleTargetChanged(
  state: PromptGuideState,
  action: { type: "TARGET_CHANGED"; from: TargetToolId; to: TargetToolId }
): PromptGuideState {
  const newTarget = resolveTarget(action.to);
  
  // Filter selections: keep options compatible with new target
  const newSelections: PromptSelections = {};
  for (const [questionId, value] of Object.entries(state.selections)) {
    if (typeof value === "string") {
      // free_text — always compatible
      newSelections[questionId] = value;
    } else if (Array.isArray(value)) {
      const compatible = value.filter(optionId => {
        const targets = getTargetsForOption(optionId);
        return targets.includes(action.to);
      });
      if (compatible.length > 0) {
        newSelections[questionId] = compatible;
      }
      // Incompatible options silently dropped (D-04)
    }
  }
  
  // Merge safety defaults (respect deselectedSafety)
  const currentConstraints = newSelections["constraints"] 
    ? newSelections["constraints"] as string[]
    : [];
  const safetyToAdd = newTarget.safetyDefaults.filter(
    id => !state.deselectedSafety.has(id)
  );
  const merged = [...new Set([...currentConstraints, ...safetyToAdd])];
  newSelections["constraints"] = merged;
  
  return {
    ...state,
    targetToolId: action.to,
    selections: newSelections
  };
}
```

### Generic Template Assembly (D-03)

```typescript
// Source: D-03 locked decision, implementation Claude's discretion
export function assemblePrompt(
  brief: PromptBrief,
  templateMap: Record<string, { zh: string; en: string }>,
  locale: "zh" | "en"
): string {
  const joiner = locale === "zh" ? "；" : "; ";
  const lines: string[] = [];
  
  for (const item of brief.items) {
    const template = templateMap[item.questionId];
    if (!template) continue;
    
    const optionText = item.freeText ?? 
      item.selectedOptions
        .map(opt => opt.promptFragment[locale])
        .join(joiner);
    
    if (!optionText) continue;
    lines.push(template[locale].replace("{选项}", optionText));
  }
  
  return lines.join("\n");
}
```

### Suppress Detection in Brief Builder (D-02)

```typescript
// Source: D-02 locked decision, implementation Claude's discretion
// Inside buildPromptBrief, after selectedOptions assembly:
function applySuppresses(
  options: OptionItem[]
): { visible: OptionItem[]; warnings: LocalizedText[] } {
  const suppressed = new Set(
    options.flatMap(o => o.suppresses ?? [])
  );
  const warnings: LocalizedText[] = [];
  const visible: OptionItem[] = [];
  
  for (const opt of options) {
    if (suppressed.has(opt.id)) {
      const suppressor = options.find(
        s => s.suppresses?.includes(opt.id)
      );
      if (suppressor) {
        warnings.push({
          zh: `"${opt.label.zh}" 被 "${suppressor.label.zh}" 覆盖`,
          en: `"${opt.label.en}" overridden by "${suppressor.label.en}"`
        });
      }
    } else {
      visible.push(opt);
    }
  }
  
  return { visible, warnings };
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| useState per field (4 hooks in PromptGuide) | Single useReducer with event-sourcing | Phase 03 | All state transitions in one place; no stale closures |
| Hand-crafted render functions per target | Generic assemblePrompt + templateMap | Phase 03 | New target = target config file only, zero renderer code |
| No suppress mechanism | Data-driven suppresses field on OptionItem | Phase 03 | Brief builder detects and warns; rules are catalog data |
| No reverse option-to-target index | getTargetsForOption() reverse lookup | Phase 03 | Enables O(1) compatibility check in TARGET_CHANGED reducer |

**Deprecated/outdated after Phase 03:**
- `useRef<Set<string>>` for deselectedSafety tracking — replaced by reducer state `deselectedSafety: Set<string>`
- Custom per-question-ID string interpolation in renderers — replaced by templateMap + generic engine
- Manual target-switch logic in onClick handler (prompt-guide.tsx lines 314-323) — replaced by reducer TARGET_CHANGED action

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Vitest 3.x + @testing-library/react 16.x |
| Config file | `vitest.config.ts` (jsdom environment, @/ path alias) |
| Quick run command | `npx vitest run src/lib/prompt/reducer.test.ts` |
| Full suite command | `npx vitest run` |

### Phase Requirements to Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| ARCH-04 | Options filtered by target appliesTo | unit | `npx vitest run src/lib/prompt/registry.test.ts` | Existing test covers getOptionsForTarget |
| ARCH-04 | getTargetsForOption returns correct targets | unit | `npx vitest run -t "reverse index"` | Wave 0 create `reducer.test.ts` |
| ARCH-05 | Template map produces correct prompt for all 3 targets | unit | `npx vitest run -t "template map"` | Wave 0 create `renderer.test.ts` or add to validation.test.ts |
| ARCH-06 | Generic renderer covers text_handling | unit | `npx vitest run -t "text_handling"` | Existing test; extend for generic renderer |
| ARCH-08 | Suppressed option excluded from brief, warning generated | unit | `npx vitest run -t "suppress"` | Wave 0 add to `brief.test.ts` or `validation.test.ts` |
| TEST-04 | AppliesTo target refs all valid | unit | `npx vitest run -t "validates option appliesTo"` | Existing test passes (line 251) |
| TEST-06 | Selected option fragment in output | unit | `npx vitest run -t "promptFragment appears"` | Existing test (line 276); extend with suppress scenario |
| TEST-07 | Seedance vs generic output differ | unit | `npx vitest run -t "different outputs"` | Existing test (line 98); verify post-refactor |
| TEST-09 | maxSelections cap enforced | unit | `npx vitest run -t "maxSelections"` | Existing test (line 293); add reducer-level test |
| TEST-13 | Target switch preserves selections | component | `npx vitest run src/components/prompt-guide.test.tsx -t "switches target"` | Existing test (line 25); extend for edge cases |

### Sampling Rate
- **Per task commit:** `npx vitest run --reporter=verbose` (all tests, <5s)
- **Per wave merge:** `npx vitest run` (60 current + ~15 new)
- **Phase gate:** Full suite green (0 failures) before `/gsd-verify-work`

### Wave 0 Gaps
- [ ] `src/lib/prompt/reducer.test.ts` — covers TARGET_CHANGED preservation, OPTION_SELECTED max cap, deselectedSafety tracking, TOGGLE_ADVANCED
- [ ] `src/lib/prompt/brief-build-suppress.test.ts` — covers suppress detection, warning generation (or add to validation.test.ts)
- [ ] `src/lib/prompt/template-render.test.ts` — covers all 3 targets produce correct prompt output via templateMap (or add to validation.test.ts)
- [ ] `src/components/prompt-guide.test.tsx` — extend existing "switches target" test with edge cases (switch to target where some options don't apply)

## Security Domain

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V2 Authentication | No | N/A — no auth system |
| V3 Session Management | No | N/A — no sessions |
| V4 Access Control | No | N/A — no backend |
| V5 Input Validation | Yes | TypeScript type narrowing on action payloads; reducer validates questionId/optionId against registry |
| V6 Cryptography | No | N/A — no crypto operations |

### Phase-Specific Security Considerations

This phase introduces no new security surface. The useReducer actions are internal to React component state — no user-controlled input determines action type. However:

- **TypeScript discriminated unions** on action types serve as input validation. The reducer's switch statement on `action.type` is exhaustive — unrecognized types are caught at compile time.
- **Registry lookups** in reducer paths (resolveTarget, getTargetsForOption) throw on unknown IDs. These are caught by the registry layer, not the reducer.
- **No injection risk** from templateMap — all template strings are authored by developers in statically-imported TypeScript files, not user-supplied.

### Known Threat Patterns for useReducer + template systems

| Pattern | STRIDE | Mitigation |
|---------|--------|------------|
| Action type confusion (passing wrong action shape) | Tampering | TypeScript `discriminated union` on `action.type` — compiler enforces correct payload shape per action type |
| Template injection via option promptFragment | Information Disclosure / Tampering | All promptFragment values are developer-authored in statically-imported `.options.ts` files; no user-supplied templates; `{选项}` replacement is literal string substitution only |

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | Reducer should be in separate file `src/lib/prompt/reducer.ts` rather than inline in prompt-guide.tsx | Architecture Pattern 1 | LOW — inline works correctly; separation is for testability. Planner can choose either. |
| A2 | templateMap values should be `{ zh: string; en: string }` (LocalizedText-like) rather than single `string` | Architecture Pattern 3 | LOW — D-03 says `Record<QuestionId, string>`; single-string approach could work if template is locale-agnostic, but Chinese labels (镜头调度 vs Camera staging) make bilingual templates necessary |
| A3 | `targetsByOption` reverse index should be built eagerly in registerOptionSet() | Architecture Pattern 2 | LOW — lazy build would also work (iterate all sets per query); just slower for large catalogs. 124 options makes lazy viable. |
| A4 | No current options have `suppresses` relationships — all 124 options need `suppresses` set to `undefined` or empty array initially | Architecture Pattern 4 | LOW — the field is optional; existing options not having it means no suppresses fire, which is the correct initial behavior. |
| A5 | The existing prompt output for all 3 targets can be exactly reproduced by templateMap-based assembly | Architecture Pattern 3 | MEDIUM — Seedance has special formatting (first line combines format + intent, uses "镜头调度" not "镜头", "动作与叙事" not "动作"). TemplateMap must encode these differences. If the template syntax can't capture all nuances, some renderer logic may remain target-specific. |
| A6 | Current 124 options all have `appliesTo` populated — audit is verification, not filling gaps | File-Level Impact | LOW — grep confirmed zero options with empty appliesTo; all have explicit target arrays. |

## Sources

### Primary (HIGH confidence)
- `src/lib/prompt/types.ts` — Current OptionItem (no suppresses, no templateMap on TargetToolConfig)
- `src/lib/prompt/renderers/seedance.renderer.ts` — Current hand-crafted render format (89 lines)
- `src/lib/prompt/renderers/generic-video.renderer.ts` — Current hand-crafted render format (101 lines)
- `src/lib/prompt/renderers/veo3.renderer.ts` — Current hand-crafted render format (68 lines)
- `src/lib/prompt/targets/seedance.target.ts` — Current target config (no templateMap, no suppress)
- `src/lib/prompt/targets/generic-video.target.ts` — Current target config
- `src/lib/prompt/targets/veo3.target.ts` — Current target config
- `src/components/prompt-guide.tsx` — Current useState hooks (3 useState + 1 useRef)
- `src/lib/prompt/brief.ts` — Current buildPromptBrief (no suppress logic)
- `src/lib/prompt/registry/option.registry.ts` — Current getOptionsForTarget (no reverse index)
- `src/lib/prompt/registry/state.ts` — Current registry Maps (5 maps)
- `src/lib/prompt/validation.ts` — Current validation functions
- `.planning/phases/03-metadata-execution/03-CONTEXT.md` — Locked decisions D-01 through D-05
- `.planning/phases/01-safety-foundation/01-CONTEXT.md` — safetyDefaults injection pattern
- `.planning/phases/02-registry-architecture/02-CONTEXT.md` — Registry domain split convention

### Secondary (MEDIUM confidence)
- `src/lib/prompt/options/*.options.ts` (12 files) — Verified: 124 options, all have appliesTo, none have suppresses [verified by grep]
- `src/components/prompt-guide.test.tsx` — Existing test patterns for component-testing PromptGuide
- `src/lib/prompt/validation.test.ts` — Existing test patterns for validation testing
- `src/lib/prompt/registry.test.ts` — Existing test patterns for registry testing
- `vitest.config.ts` — Test environment: jsdom, globals, @/ alias

### Tertiary (LOW confidence)
- React 19 useReducer documentation — [ASSUMED] standard pattern, not verified via Context7 in this session

## Open Questions (RESOLVED)

1. **Can the Seedance renderer's special first-line formatting be encoded in templateMap alone?**
   - What we know: Seedance opens with "生成一段 {format} 的视频。\n核心意图：{use_case}" — format and use_case are separate brief items. The combined first line requires either a composite template or special handling.
   - What's unclear: Whether D-03's "iterate brief items" strictly means one line per brief item, or if the template engine can support multi-line or composite slots.
   - Recommendation: Implement templateMap with one slot per questionId. If the combined first line is essential, add a synthetic "lead_in" slot that the generic renderer handles specially, or keep a thin per-target wrapper for structure while delegating dimension text to templateMap.

2. **Should the brief builder or the reducer handle maxSelections enforcement?**
   - What we know: Currently enforced in both UI toggleOption (line 114) and buildPromptBrief (line 68). D-01 says reducer computes all derived state.
   - What's unclear: Whether maxSelections is "derived state" (belongs in reducer) or "rendering concern" (belongs in brief builder).
   - Recommendation: Enforce in both. Reducer trims selections to maxSelections for UI consistency. Brief builder also trims as defense-in-depth. Double enforcement is acceptable redundancy.

3. **TemplateMap for dimensions not in a target's prefer list?**
   - What we know: generic-video's `prefer` excludes `format` and `text_handling`. But ARCH-06 requires generic renderer to cover `text_handling`. Should templateMap include slots for all possible dimensions, or only preferred ones?
   - What's unclear: Whether templateMap should mirror `prefer` or be a superset.
   - Recommendation: templateMap should include all 12 question IDs that exist (superset of prefer). The `prefer` field controls UI ordering; templateMap controls rendering. If a dimension has no template slot, the generic renderer skips it. ARCH-06 requires text_handling coverage, so it must be in generic-video's templateMap.

## Recommended Plan Structure (4 Waves)

### Wave 0: Test Infrastructure (prerequisite)
- Create `src/lib/prompt/reducer.test.ts` (Wave 0 gap)
- Create `src/lib/prompt/brief-suppress.test.ts` or extend `validation.test.ts` (Wave 0 gap)
- Ensure all 60 existing tests still pass as baseline

### Wave 1: Data Model + Reverse Index (D-05, ARCH-04 foundations)
- Add `suppresses?: string[]` to OptionItem (types.ts)
- Add `templateMap` field to TargetToolConfig (types.ts)
- Add `targetsByOption` Map + `getTargetsForOption()` (option.registry.ts)
- Export `getTargetsForOption` from registry barrel (index.ts)
- Populate templateMap on all 3 target configs (seedance, generic-video, veo3)
- Audit: confirm all 124 options have appliesTo (already verified complete)
- Tests: getTargetsForOption unit test, templateMap structure tests

### Wave 2: Reducer with Selection Preservation (D-01, D-04, TEST-13)
- Create `src/lib/prompt/reducer.ts` with PromptGuideState, PromptGuideAction, promptGuideReducer
- Implement TARGET_CHANGED path (selection preservation + safetyDefaults merge)
- Implement OPTION_SELECTED / OPTION_DESELECTED paths (with maxSelections cap + deselectedSafety tracking)
- Implement TOGGLE_ADVANCED path
- Replace useState/useRef in prompt-guide.tsx with useReducer
- Refactor target switch onClick to dispatch TARGET_CHANGED
- Tests: reducer unit tests (all 4 actions, edge cases), component test for TEST-13

### Wave 3: Template-Map Renderer + Suppress Detection (D-02, D-03, ARCH-05, ARCH-06, ARCH-08)
- Add `assemblePrompt()` generic renderer (adapters.ts or new render.ts)
- Refactor 3 renderers to use assemblePrompt (thin adapter wrappers)
- Add suppress detection pass in buildPromptBrief (brief.ts)
- Propagate suppress warnings to RenderedPrompt.warnings (adapters.ts post-processing)
- Tests: template output regression tests (all 3 targets), suppress detection tests (ARCH-08), TEST-06 extension

### Wave 4: Integration + Test Closure (TEST-04, TEST-06, TEST-07, TEST-09)
- Full test suite verification (existing 60 + new tests all green)
- Extend prompt-guide.test.tsx with edge cases
- TypeScript typecheck, ESLint, and build verification
- Static export (`npm run build`) verification

**Wave dependencies:** Wave 1 must complete first (types changes cascade to everything). Wave 2 and Wave 3 can be developed in parallel after Wave 1, but must merge before Wave 4 integration.

**Risk mitigation:** Wave 1's templateMap data entry is tedious but low-risk. Wave 2's reducer is the highest-risk change (UI regression possible). Wave 3's renderer refactor must exactly preserve current output — run validation.test.ts after each renderer change.

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — React 19 useReducer, no new dependencies; codebase conventions confirmed
- Architecture: HIGH — patterns derived directly from locked decisions D-01 through D-05; verified against existing code
- Pitfalls: MEDIUM — identified from codebase analysis and React patterns; renderer regression and reducer purity are the main risks
- Test strategy: HIGH — existing test infrastructure is solid; gaps are identifiable; new test files follow established conventions

**Research date:** 2026-05-12
**Valid until:** 2026-06-11 (30 days — stable React/TypeScript patterns)
