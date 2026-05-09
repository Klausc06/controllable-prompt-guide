# Architecture Patterns

**Domain:** Config-driven prompt generation system
**Researched:** 2026-05-10
**Confidence:** HIGH (direct codebase analysis + established patterns)

## Executive Summary

The current architecture has the right bones -- configuration-driven pipeline, schema-based questions, option catalogs, target-aware rendering. But four hardcoded coupling points prevent extensibility: (1) `TargetToolId` is a closed union type, (2) `adapters.ts` uses if/else routing, (3) `prompt-guide.tsx` directly imports `videoPromptWorkType`, and (4) renderers use magic question ID strings. The fix is to replace each hardcoded coupling with a registry pattern where modules self-register, consumers look up by ID, and all cross-references are validated at test time.

## Recommended Architecture

```
                           REGISTRY LAYER (src/lib/prompt/registry.ts)
                          ┌──────────────────────────────────────────┐
                          │  workTypeById: Map<WorkTypeId, Config>    │
                          │  targetById: Map<TargetToolId, Config>    │
                          │  adapterById: Map<TargetToolId, Adapter>  │
                          │  optionSetById: Map<string, OptionSet>    │
                          │  optionById: Map<string, OptionItem>      │
                          │                                          │
                          │  registerWorkType(config)                 │
                          │  registerTarget(config)                   │
                          │  registerAdapter(targetId, adapter)       │
                          │  registerOptionSet(set)                   │
                          │                                          │
                          │  resolveWorkType(id) => Config            │
                          │  resolveAdapter(targetId) => Adapter      │
                          │  getOptionsForTarget(targetId, setId)     │
                          └────────────────┬─────────────────────────┘
                                           │
          ┌────────────────────────────────┼────────────────────────────────┐
          │                                │                                │
  ┌───────▼──────────┐      ┌─────────────▼──────────────┐    ┌───────────▼──────────┐
  │  UI Layer         │      │  Pipeline Layer             │    │  Config Layer         │
  │  (prompt-guide)   │──────▶  adapters.ts               │◀───│  (self-registering)   │
  │                   │      │  brief.ts                   │    │                       │
  │  Reads from       │      │  renderers/                 │    │  work-types/*.ts      │
  │  registry to      │      │                             │    │  targets/*.ts         │
  │  render questions │      │  Looks up adapter           │    │  options/*.ts         │
  │  and targets      │      │  by ID, delegates           │    │  renderers/*.ts       │
  └───────────────────┘      │  to adapter.render()        │    │                       │
                              └────────────────────────────┘    │  Each file calls      │
                                                                │  registerXxx()        │
                                                                └───────────────────────┘
```

### Component Boundaries

| Component | Responsibility | Communicates With |
|-----------|---------------|-------------------|
| `registry.ts` | Central map of all registered configs. Single source of truth for lookup. | Imported by UI, adapters, renderers, validation. Never by option/target/work-type files directly (they only write to it). |
| `work-types/*.ts` | Define a WorkTypeConfig, call `registerWorkType()` at module level. | Exports config object. Depends on registry import for registration side-effect. |
| `targets/*.ts` | Define a TargetToolConfig, call `registerTarget()` at module level. | Exports config object. Depends on registry. |
| `options/*.ts` | Define an OptionSet, call `registerOptionSet()` at module level. Options include `appliesTo: string[]`. | Exports option set. Depends on registry. |
| `renderers/*.ts` | Each renderer is an object implementing `TargetAdapter { target, render(brief) }`. Registered via `registerAdapter(targetId, adapter)`. | Depends on registry (to register), uses `brief.ts` for text extraction. |
| `adapters.ts` | Single entry point for rendering. Looks up adapter from registry by targetToolId, calls `adapter.render(brief)`. No if/else. | Imports registry for lookup, brief.ts for building. |
| `brief.ts` | Builds PromptBrief from WorkTypeConfig + selections. Unchanged from current -- already config-driven. | Imports registry for option lookup (Map-based, not linear scan). |
| `validation.ts` | CI-time cross-reference checks: every `appliesTo` target exists, every `safetyDefaults` option exists, every renderer's referenced question IDs exist in the work type, every target has a registered adapter. | Imports registry to iterate all registered configs. |
| `prompt-guide.tsx` | UI component. Resolves work type from registry. Renders target selector from registry. Renders question blocks driven by worktype.questions schema. Filters options by targetToolId via `appliesTo`. | Imports registry, adapters, QuestionBlock. |
| `QuestionBlock` (inline) | Pure schema-driven: reads `question.mode`, `question.optionSetId`, renders appropriate control. Receives target-filtered options from parent. | Props from PromptGuide. No direct registry import. |
| `usePromptReducer` (new hook) | Manages selections state with reducer: handles select, deselect, target-switch, inject-safety-defaults, suppress-incompatible actions. | Used by PromptGuide. Dispatches to registry for target-switch logic. |

### Data Flow

```
User clicks option in QuestionBlock
  │
  ▼
onChange(questionId, optionId) dispatches SELECT action
  │
  ▼
usePromptReducer updates selections state
  │
  ├──▶ UI re-renders: QuestionBlock shows active state
  │
  └──▶ useMemo triggers renderPrompt():
         │
         1. resolveWorkType(workTypeId) from registry  ──▶ WorkTypeConfig
        2. resolveAdapter(targetToolId) from registry   ──▶ TargetAdapter
        3. buildPromptBrief(workType, targetId, selections)
           │
           ├── For each question in workType.questions:
           │   ├── Look up option IDs in registry.optionById (O(1) Map.get)
           │   ├── Filter: drop options where !option.appliesTo.includes(targetId)
           │   ├── Accumulate warnings for suppressed options
           │   └── Build BriefItem { questionId, title, selectedOptions, freeText }
           │
           └── Returns PromptBrief
              │
        4. adapter.render(brief)
           │
           ├── Iterates over brief.items (NOT hardcoded question IDs)
           ├── For each item, extracts promptFragment by locale
           ├── Applies target-specific template structure
           ├── Injects safetyDefaults text if not explicitly overridden
           └── Returns RenderedPrompt { zhPrompt, enPrompt, brief, warnings }
              │
              ▼
         UI renders output panels + copy buttons
```

**Key change from current:** Step 4 iterates over `brief.items` instead of calling `getBriefText(brief, "use_case", "zh")` with hardcoded strings. Each adapter defines a `template` that maps question IDs to prompt positions, and the renderer applies that template. Unknown question IDs get a warning, not silent omission.

### Target Switch Flow (critical new behavior)

```
User clicks new target tool
  │
  ▼
dispatch(SWITCH_TARGET, newTargetId)
  │
  ├── 1. For each question in workType.questions:
  │      Filter options by newTargetId via appliesTo
  │      If current selection ∉ filtered options → mark for deselect + warn
  │
  ├── 2. For each safetyDefault in target.safetyDefaults:
  │      If not already selected → auto-select (pre-populate)
  │
  ├── 3. For each questionId in target.suppress:
  │      If selected → deselect + warn "this dimension is suppressed for [target]"
  │
  └── 4. Return new selections + accumulated warnings
```

## Patterns to Follow

### Pattern 1: Explicit Registration Registry

**What:** A module-level `Map` where each config/plugin file calls a `register*()` function at import time. The registry is the single source of truth for ID-to-object resolution. This replaces compile-time union types and direct imports.

**Why not module augmentation (`declare module`)?** Module augmentation with interface merging (the "type registry pattern" from Frontend Masters / Mike North) is powerful for library authoring where consumers add plugins without modifying source. But for an application where all config files live in the same repo, module augmentation has footguns: (1) import order determines registration, (2) tree-shaking can drop modules with side effects, (3) debugging "why isn't X registered" is harder than checking a Map. Explicit registration (`registerTarget(config)`) is transparent and greppable.

**When:** Every time a new module needs to be discoverable by ID without hardcoded imports.

**Example:**
```typescript
// src/lib/prompt/registry.ts
import type { OptionItem, OptionSet, TargetAdapter, TargetToolConfig, WorkTypeConfig } from "./types";

// WorkTypeId and TargetToolId become open strings
export type WorkTypeId = string;
export type TargetToolId = string;

const workTypeMap = new Map<WorkTypeId, WorkTypeConfig>();
const targetMap = new Map<TargetToolId, TargetToolConfig>();
const adapterMap = new Map<TargetToolId, TargetAdapter>();
const optionSetMap = new Map<string, OptionSet>();
const optionItemMap = new Map<string, OptionItem>();  // O(1) lookup

export function registerWorkType(config: WorkTypeConfig): void {
  if (workTypeMap.has(config.id)) {
    throw new Error(`Duplicate work type: ${config.id}`);
  }
  workTypeMap.set(config.id, config);
}

export function registerTarget(config: TargetToolConfig): void {
  if (targetMap.has(config.id)) {
    throw new Error(`Duplicate target: ${config.id}`);
  }
  targetMap.set(config.id, config);
}

export function registerAdapter(targetId: TargetToolId, adapter: TargetAdapter): void {
  if (adapterMap.has(targetId)) {
    throw new Error(`Duplicate adapter for target: ${targetId}`);
  }
  adapterMap.set(targetId, adapter);
}

export function registerOptionSet(set: OptionSet): void {
  if (optionSetMap.has(set.id)) {
    throw new Error(`Duplicate option set: ${set.id}`);
  }
  optionSetMap.set(set.id, set);
  for (const option of set.options) {
    if (optionItemMap.has(option.id)) {
      throw new Error(`Duplicate option ID across sets: ${option.id} (in ${set.id})`);
    }
    optionItemMap.set(option.id, option);
  }
}

// Resolvers -- throw on miss, no silent fallback
export function resolveWorkType(id: WorkTypeId): WorkTypeConfig {
  const config = workTypeMap.get(id);
  if (!config) throw new Error(`Unknown work type: ${id}`);
  return config;
}

export function resolveTarget(id: TargetToolId): TargetToolConfig {
  const config = targetMap.get(id);
  if (!config) throw new Error(`Unknown target: ${id}`);
  return config;
}

export function resolveAdapter(id: TargetToolId): TargetAdapter {
  const adapter = adapterMap.get(id);
  if (!adapter) throw new Error(`No adapter registered for target: ${id}`);
  return adapter;
}

export function getOptionById(id: string): OptionItem | undefined {
  return optionItemMap.get(id);  // O(1)
}

export function getOptionsForTarget(optionSetId: string, targetId: TargetToolId): OptionItem[] {
  const set = optionSetMap.get(optionSetId);
  if (!set) throw new Error(`Unknown option set: ${optionSetId}`);
  return set.options.filter(opt => opt.appliesTo.includes(targetId));
}

// For iteration in validation and UI
export function getAllWorkTypes(): WorkTypeConfig[] { return [...workTypeMap.values()]; }
export function getAllTargets(): TargetToolConfig[] { return [...targetMap.values()]; }
export function getAllAdapters(): Map<TargetToolId, TargetAdapter> { return new Map(adapterMap); }
export function getAllOptionSets(): OptionSet[] { return [...optionSetMap.values()]; }
```

```typescript
// src/lib/prompt/targets/seedance.target.ts -- self-registers at import time
import { registerTarget } from "../registry";
import type { TargetToolConfig } from "../types";

export const seedanceTarget: TargetToolConfig = {
  id: "seedance",
  // ... rest of config
};

registerTarget(seedanceTarget);  // <-- the critical line
```

### Pattern 2: Adapter as Object with Template Map

**What:** Each target's `TargetAdapter` carries both its config and a `render()` method. The renderer uses the `brief.items` array (not hardcoded question IDs) to extract text. A `template` map inside each adapter defines which question IDs go where in the output prompt.

**Why:** Eliminates the if/else branch in `adapters.ts` AND eliminates magic question ID strings in renderers. Adding a new target means: (1) create target config, (2) create adapter with render(), (3) register both. No other files change.

**Example:**
```typescript
// src/lib/prompt/types.ts (updated)
export interface TargetAdapter {
  target: TargetToolConfig;
  render(brief: PromptBrief): RenderedPrompt;
}

// src/lib/prompt/renderers/seedance.renderer.ts
import { registerAdapter } from "../registry";
import { seedanceTarget } from "../targets/seedance.target";
import type { TargetAdapter, PromptBrief, RenderedPrompt, LocalizedText } from "../types";

// Template maps question IDs to prompt section labels and fallback text
// This IS the contract between work type questions and this renderer
const SEEDANCE_TEMPLATE = {
  subject:      { zhLabel: "主体",       enLabel: "Subject",        zhFallback: "明确的主要主体",            enFallback: "a clear main subject" },
  scene:        { zhLabel: "场景",       enLabel: "Scene",          zhFallback: "清晰、聚焦的场景",           enFallback: "a focused and readable scene" },
  motion:       { zhLabel: "动作与叙事",  enLabel: "Action and story", zhFallback: "主体进行清晰、连贯的动作",   enFallback: "the subject performs a clear continuous action" },
  camera:       { zhLabel: "镜头调度",    enLabel: "Camera staging", zhFallback: "镜头稳定并突出主体",       enFallback: "stable camera work that emphasizes the subject" },
  lighting:     { zhLabel: "光线",       enLabel: "Lighting",       zhFallback: "光线清晰自然",             enFallback: "clear natural lighting" },
  style:        { zhLabel: "视觉风格",    enLabel: "Visual style",   zhFallback: "真实、干净、可控",          enFallback: "realistic, clean, and controlled" },
  audio:        { zhLabel: "声音",       enLabel: "Audio",          zhFallback: "如模型支持音频，保持自然",    enFallback: "if supported, keep it natural" },
  format:       { zhLabel: "格式",       enLabel: "Format",         zhFallback: "短视频规格，建议 5-15 秒",    enFallback: "short video format, ideally 5-15 seconds" },
  text_handling:{ zhLabel: "画面文字",    enLabel: "On-screen text", zhFallback: "尽量少用，重要文字建议后期添加", enFallback: "use minimal text; add critical text in post" },
  constraints:  { zhLabel: "限制",       enLabel: "Constraints",    zhFallback: "主体保持一致，避免变形和侵权", enFallback: "keep subject stable, avoid distortion and rights issues" },
} as const;

// Derived: the set of question IDs this renderer knows about
const KNOWN_QUESTION_IDS = new Set(Object.keys(SEEDANCE_TEMPLATE));

function getBriefTextForId(brief: PromptBrief, questionId: string, locale: "zh" | "en"): string {
  const item = brief.items.find(i => i.questionId === questionId);
  if (!item) return "";
  if (item.freeText) return item.freeText;
  return item.selectedOptions.map(o => o.promptFragment[locale]).join(locale === "zh" ? "；" : "; ");
}

export const seedanceAdapter: TargetAdapter = {
  target: seedanceTarget,

  render(brief: PromptBrief): RenderedPrompt {
    const warnings: LocalizedText[] = [];
    const collected: Record<string, { zh: string; en: string }> = {};

    // Iterate brief items and map to template
    for (const item of brief.items) {
      if (KNOWN_QUESTION_IDS.has(item.questionId)) {
        collected[item.questionId] = {
          zh: item.selectedOptions.map(o => o.promptFragment.zh).join("；") || item.freeText || "",
          en: item.selectedOptions.map(o => o.promptFragment.en).join("; ") || item.freeText || "",
        };
      } else {
        // Unknown question ID -- warn, don't silence
        warnings.push({
          zh: `Seedance 渲染器未处理问题 "${item.questionId}"，其选择未包含在提示词中。`,
          en: `Seedance renderer does not handle question "${item.questionId}"; selections are omitted from the prompt.`,
        });
      }
    }

    // Collect risk hints
    for (const item of brief.items) {
      for (const opt of item.selectedOptions) {
        if (opt.riskHint) warnings.push(opt.riskHint);
      }
    }

    // Build zh prompt from template + collected text
    const zhLines: string[] = [
      `生成一段 ${collected.format?.zh || "短视频"} 的视频。`,
      `核心意图：${brief.rawIntent || collected.use_case?.zh || "按以下描述生成可控视频"}`,
    ];
    for (const [qid, tpl] of Object.entries(SEEDANCE_TEMPLATE)) {
      if (qid === "format") continue; // already in intro line
      const text = collected[qid]?.zh || "";
      zhLines.push(`${tpl.zhLabel}：${text || tpl.zhFallback}。`);
    }

    // Build en prompt
    const enLines: string[] = [
      `Generate a ${collected.format?.en || "short video"}.`,
      `Core intent: ${brief.rawIntent || collected.use_case?.en || "create a controlled short video"}.`,
    ];
    for (const [qid, tpl] of Object.entries(SEEDANCE_TEMPLATE)) {
      if (qid === "format") continue;
      const text = collected[qid]?.en || "";
      enLines.push(`${tpl.enLabel}: ${text || tpl.enFallback}.`);
    }

    return {
      version: "0.1.0",
      targetToolId: brief.targetToolId,
      zhPrompt: zhLines.join("\n"),
      enPrompt: enLines.join("\n"),
      brief,
      adaptationNote: seedanceTarget.adaptationNote,
      warnings,
    };
  },
};

registerAdapter("seedance", seedanceAdapter);
```

```typescript
// src/lib/prompt/adapters.ts -- simplified to registry lookup
import { buildPromptBrief } from "./brief";
import { resolveAdapter, resolveWorkType } from "./registry";
import type { PromptSelections, RenderedPrompt, TargetToolId, WorkTypeId } from "./types";

export function renderPrompt(params: {
  workTypeId: WorkTypeId;
  targetToolId: TargetToolId;
  rawIntent: string;
  selections: PromptSelections;
}): RenderedPrompt {
  const workType = resolveWorkType(params.workTypeId);
  const adapter = resolveAdapter(params.targetToolId);
  const brief = buildPromptBrief({
    workType,
    targetToolId: params.targetToolId,
    rawIntent: params.rawIntent,
    selections: params.selections,
  });
  return adapter.render(brief);
}
```

### Pattern 3: useReducer for Multi-Dimension State

**What:** Replace `useState<PromptSelections>` with `useReducer` in `PromptGuide`. The reducer handles: selection changes, target switches (which trigger safetyDefaults injection and incompatible-option suppression), and advanced toggle. No prop drilling change needed -- the existing `onChange` callback pattern works fine with one level of component nesting.

**Why:** As selections grow across 11+ dimensions and target switching needs to reconcile selections (inject defaults, suppress incompatibles, accumulate warnings), a reducer centralizes this logic in a pure, testable function. The current `useState` would need increasingly complex setter callbacks scattered in the component.

**When to use:** Any time state transitions need to read the current state AND the registry (for safetyDefaults, appliesTo checks).

**Example:**
```typescript
type PromptAction =
  | { type: "SELECT"; questionId: string; value: SelectionValue }
  | { type: "SWITCH_TARGET"; targetId: TargetToolId }
  | { type: "TOGGLE_ADVANCED" };

interface PromptState {
  targetToolId: TargetToolId;
  selections: PromptSelections;
  advancedOpen: boolean;
  warnings: LocalizedText[];
}

function promptReducer(state: PromptState, action: PromptAction): PromptState {
  switch (action.type) {
    case "SELECT": {
      return { ...state, selections: { ...state.selections, [action.questionId]: action.value } };
    }
    case "SWITCH_TARGET": {
      const newTarget = resolveTarget(action.targetId);
      const warnings: LocalizedText[] = [];
      const newSelections = { ...state.selections };

      // Inject safety defaults
      for (const optionId of newTarget.safetyDefaults) {
        const option = getOptionById(optionId);
        if (option) {
          const parentSet = getAllOptionSets().find(s => s.options.some(o => o.id === optionId));
          if (parentSet) {
            const qForSet = resolveWorkType(currentWorkTypeId).questions
              .find(q => q.optionSetId === parentSet.id);
            if (qForSet) {
              const current = newSelections[qForSet.id];
              const currentArr = Array.isArray(current) ? current : current ? [current] : [];
              if (!currentArr.includes(optionId)) {
                if (qForSet.mode === "multi") {
                  newSelections[qForSet.id] = [...currentArr, optionId];
                } else if (qForSet.mode === "single" && currentArr.length === 0) {
                  newSelections[qForSet.id] = optionId;
                }
              }
            }
          }
        }
      }

      // Suppress incompatible options
      for (const [qId, value] of Object.entries(newSelections)) {
        const ids = Array.isArray(value) ? value : [value];
        const incompatible = ids.filter(id => {
          const option = getOptionById(id);
          return option && !option.appliesTo.includes(action.targetId);
        });
        if (incompatible.length > 0) {
          warnings.push({
            zh: `目标 "${newTarget.label.zh}" 不支持选项: ${incompatible.join(", ")}`,
            en: `Target "${newTarget.label.en}" does not support: ${incompatible.join(", ")}`,
          });
          // Remove incompatible
          if (Array.isArray(value)) {
            newSelections[qId] = ids.filter(id => !incompatible.includes(id));
          } else {
            delete newSelections[qId];
          }
        }
      }

      return { ...state, targetToolId: action.targetId, selections: newSelections, warnings };
    }
    case "TOGGLE_ADVANCED": {
      return { ...state, advancedOpen: !state.advancedOpen };
    }
    default:
      return state;
  }
}
```

### Pattern 4: Barrel File for Registration Side-Effects

**What:** A single barrel file (`src/lib/prompt/init.ts`) that imports all modules with registration side effects. The app entry point imports this once. This ensures all configs are registered before any lookup.

**Why:** Without a central import, tree-shaking could drop config modules that are only imported for their side effects. The barrel file guarantees registration order and completeness.

```typescript
// src/lib/prompt/init.ts
// Import order matters: option sets before work types, targets before adapters
import "./options/use-case.options";
import "./options/subject.options";
import "./options/scene.options";
import "./options/motion.options";
import "./options/camera.options";
import "./options/lighting.options";
import "./options/style.options";
import "./options/constraints.options";
import "./options/audio.options";
import "./options/format.options";
import "./options/text-handling.options";

import "./targets/seedance.target";
import "./targets/generic-video.target";

import "./renderers/seedance.renderer";
import "./renderers/generic-video.renderer";

import "./work-types/video-prompt.worktype";
```

```typescript
// src/app/layout.tsx -- app entry ensures registration
import "@/lib/prompt/init";  // side-effect import, must be first
```

## Anti-Patterns to Avoid

### Anti-Pattern 1: Module Augmentation for Application-Level Registry

**What:** Using `declare module` + interface merging so that each plugin file augments a central interface.

**Why bad:** Module augmentation is designed for library consumers to extend library types without modifying library source. For an application where all config lives in the same repo: (1) import order becomes implicit and fragile, (2) TypeScript needs to see all augmentations at compile time, (3) tree-shaking can silently drop modules that only have type-level side effects, (4) debugging "why is X missing from the registry" requires understanding declaration merging semantics rather than a simple Map lookup.

**Instead:** Use explicit `Map` + `register*()` functions. Every registration is a runtime call that throws on duplicate. Every lookup is a `Map.get()` that throws on miss. No implicit behavior.

### Anti-Pattern 2: Silent Fallback in Adapter Routing

**What:** `adapters.ts` line 24 currently falls through to `renderGenericVideoPrompt` for any unknown target ID. This masks configuration errors.

**Why bad:** A new target that needs unique rendering gets generic output with no warning. The user sees plausible-looking prompts that are structurally wrong for their target.

**Instead:** `resolveAdapter()` throws if no adapter is registered for the given target ID. The error message tells the developer exactly what's missing. At the UI level, unknown target IDs should be caught early (target selector only shows registered targets).

### Anti-Pattern 3: Magic Question ID Strings in Renderers

**What:** `getBriefText(brief, "use_case", "zh")` scattered across renderers with string literal question IDs.

**Why bad:** If `video-prompt.worktype.ts` renames `"use_case"` to `"purpose"`, the renderer silently returns `""` (empty string) for that dimension. No compile error, no runtime error, just degraded output.

**Instead:** Each adapter defines a template map explicitly listing the question IDs it handles. The renderer iterates `brief.items` and maps them to template slots by question ID. Validation tests confirm every template key exists in the work type. Unknown brief items generate warnings, not silent omission.

### Anti-Pattern 4: Dead Metadata Fields

**What:** `appliesTo`, `prefer`, `suppress`, `safetyDefaults` are defined on every option/target but never executed at runtime.

**Why bad:** Developers maintain data that has no effect. Adding `appliesTo: ["sora"]` to an option feels like it should work, but the option still appears for Seedance users. Trust in the config system erodes.

**Instead:** Every metadata field must have a runtime executor. `appliesTo` filters options in the UI. `safetyDefaults` auto-selects constraints on target switch. `suppress` hides and warns about incompatible questions. `prefer` reorders questions. If a field exists in the type, it must have a code path that reads it.

## State Management Strategy

### Current: Flat useState

```typescript
const [targetToolId, setTargetToolId] = useState<TargetToolId>("seedance");
const [selections, setSelections] = useState<PromptSelections>(defaults);
const [advancedOpen, setAdvancedOpen] = useState(false);
```

### Recommended: useReducer + useMemo pipeline

```
useReducer(PromptState) ──▶ useMemo(render) ──▶ RenderedPrompt
       │                                                 │
       │  dispatches: SELECT,                            │  consumed by:
       │  SWITCH_TARGET,                                 │  - output panels
       │  TOGGLE_ADVANCED                                │  - copy buttons
       │                                                 │  - brief preview
  QuestionBlock ◀── state.selections, state.targetToolId
  TargetSelector
  AdvancedToggle
```

**Why not Context:** The app has one component (`PromptGuide`) with three child components (`QuestionBlock` is inline, `BriefPreview`, `CopyButton` are inline). There is no prop drilling problem to solve with Context. Adding Context adds indirection without benefit for a single-component tree.

**Why not Zustand/Jotai:** Zero benefit. The entire state lives in one component with a well-defined render pipeline. External state management adds a dependency for a problem that `useReducer` solves natively.

**When to introduce Context:** Only if `QuestionBlock` is extracted to a separate file AND needs to read targetToolId for option filtering without passing it as a prop. Even then, passing `filteredOptions` as a prop from the parent is simpler and more testable.

## Scalability Considerations

| Concern | At current scale (11 questions, 80 options, 2 targets) | At planned scale (15+ questions, 200+ options, 8 targets) |
|---------|--------------------------------------------------------|-----------------------------------------------------------|
| Option lookup | O(n) linear scan per call (negligible) | O(1) Map lookup (built at registration time) |
| Question rendering | 11 hardcoded components in one file | Schema-driven: iterate workType.questions, render QuestionBlock dynamically |
| Target switching | 2 targets, trivial if/else | 8+ targets, registry lookup, adapter pattern |
| Option filtering by target | Not implemented | `appliesTo` filter via `Array.filter` per question, memoized |
| Config validation | 3 checks in validation.ts | Comprehensive cross-reference checks (option->target, target->adapter, renderer->question, safetyDefaults->option) |
| Bundle size | ~200 lines of option data | 200+ option items. Keep in TypeScript (treeshakable), not JSON (always loaded). Split by target if needed. |

## Suggested Build Order (Dependencies Between Components)

```
Phase 1: Registry Foundation (no UI changes)
├── 1a. Convert types.ts: TargetToolId = string, WorkTypeId = string
├── 1b. Create registry.ts: Maps + register/resolve functions
├── 1c. OptionSets self-register via registerOptionSet()
├── 1d. O(1) getOptionById via Map
└── 1e. Tests: verify registration, duplicate detection

Phase 2: Target + Adapter Registry
├── 2a. Targets self-register via registerTarget()
├── 2b. Create adapter objects implementing TargetAdapter
├── 2c. Adapters self-register via registerAdapter()
├── 2d. adapters.ts uses resolveAdapter() -- no if/else
├── 2e. Tests: adapter lookup, unknown target throws

Phase 3: Work Type Registry + UI Decoupling
├── 3a. Work types self-register via registerWorkType()
├── 3b. prompt-guide.tsx uses resolveWorkType(workTypeId) instead of direct import
├── 3c. Target selector reads from getAllTargets()
├── 3d. Create init.ts barrel file
├── 3e. Tests: UI renders from registry, not hardcoded import

Phase 4: Metadata Execution
├── 4a. appliesTo filtering in QuestionBlock (filter options by target)
├── 4b. safetyDefaults injection on target switch
├── 4c. suppress logic: hide/warn incompatible questions
├── 4d. useReducer for state with SWITCH_TARGET action
├── 4e. Tests: filtering, defaults, suppression, warnings

Phase 5: Renderer Question ID Safety
├── 5a. Each adapter defines template map with known question IDs
├── 5b. Renderers iterate brief.items, warn on unknown question IDs
├── 5c. Generic renderer adds text_handling field
├── 5d. Tests: renderer coverage, unknown question ID warnings

Phase 6: Validation Layering
├── 6a. Cross-reference validation: appliesTo refs valid targets
├── 6b. Every target has a registered adapter
├── 6c. Every renderer template key exists in workType.questions
├── 6d. safetyDefaults option IDs exist in registry
├── 6e. Tests: all validation rules
```

**Phase ordering rationale:**
- Phases 1-2 are pure infrastructure (registry) with no behavior change. They establish the foundation safely.
- Phase 3 is the first user-facing change (UI reads from registry instead of hardcoded import). Builds on 1-2.
- Phase 4 activates the dead metadata (appliesTo, safetyDefaults, suppress). Depends on registry for lookup and on UI for rendering.
- Phase 5 fixes the renderer fragility. Can be done in parallel with Phase 4 since they touch different files (renderers vs UI).
- Phase 6 (validation) should ideally be built incrementally alongside each phase, but is listed last because comprehensive cross-reference checks can only be written once all registries exist.

## Sources

- Project codebase analysis (`.planning/codebase/ARCHITECTURE.md`, `.planning/codebase/CONCERNS.md`)
- Direct inspection of all source files in `src/lib/prompt/` and `src/components/`
- [TypeScript Registry Pattern - GeeksforGeeks](https://www.geeksforgeeks.org/system-design/registry-pattern/) — Registry pattern fundamentals (MEDIUM confidence)
- [Type-Safe Adapter Registries with as const and satisfies - Paulund](https://paulund.co.uk/notebook/typescript/type-safe-adapter-registries-with-as-const-and-satisfies/) — Pattern for type-safe registries (MEDIUM confidence, verified against TypeScript documentation)
- [TypeScript Module Augmentation: Three Patterns and One Foot-Gun - dev.to](https://dev.to/gabrielanhaia/module-augmentation-in-typescript-three-patterns-and-one-foot-gun-474h) — Footguns of module augmentation vs explicit patterns (MEDIUM confidence)
- [TypeScript Design Patterns - refactoring.guru](https://refactoring.guru/design-patterns/adapter/typescript/example) — Adapter pattern canonical form (HIGH confidence, well-established pattern)
- [React useReducer for Complex State - GeeksforGeeks](https://www.geeksforgeeks.org/reactjs/how-to-handle-complex-state-logic-with-usereducer/) — useReducer pattern for multi-field state (MEDIUM confidence)
- TypeScript Handbook on [satisfies operator](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-9.html#the-satisfies-operator) — TypeScript 4.9 `satisfies` for config validation (HIGH confidence, official docs)
