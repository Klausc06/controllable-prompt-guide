# Coding Conventions

**Analysis Date:** 2026-05-10

## Naming Patterns

**Files:**
- kebab-case for all source files: `prompt-guide.tsx`, `use-case.options.ts`, `video-prompt.worktype.ts`, `video-renderer.ts`, `seedance.target.ts`
- Test files mirror source file name with `.test.ts` or `.test.tsx` suffix: `validation.test.ts`, `prompt-guide.test.tsx`

**Functions:**
- camelCase for all function names, including exported ones: `renderPrompt`, `validateOptionIdsUnique`, `buildPromptBrief`, `getOptionSet`
- Named `function` declarations for top-level exports:
```typescript
// validation.ts
export function validateOptionIdsUnique(optionSets_?: OptionSet[]) { ... }
```
- Arrow functions for inline event handlers and callbacks:
```typescript
// prompt-guide.tsx
async function handleCopy() { ... }  // inner named function
const completedCore = coreQuestions.filter((question) => isComplete(question, selections)).length;  // arrow callback
```

**Variables:**
- camelCase for all variables: `completeSelections`, `zhSubject`, `enPrompt`, `jsonBrief`
- PascalCase for constants that are config/data objects:
```typescript
// video-prompt.worktype.ts
export const videoPromptWorkType: WorkTypeConfig = { ... };
// targets/seedance.target.ts
export const seedanceTarget: TargetToolConfig = { ... };
// options/use-case.options.ts
export const useCaseOptions: OptionSet = { ... };
```
- `const` preferred over `let` for all immutable bindings. `let` used only for true reassignment.

**Types:**
- PascalCase for all type/interface names: `PromptSelections`, `OptionItem`, `TargetToolConfig`, `RenderedPrompt`, `QuestionSchema`
- Type aliases for union types and simple mappings: `type TargetToolId = "seedance" | "generic_video"`, `type QuestionMode = "single" | "multi" | "free_text"`, `type SelectionValue = string | string[]`
- Interfaces for object shapes: `interface OptionItem { ... }`, `interface WorkTypeConfig { ... }`

## Code Style

**Formatting:**
- No Prettier config detected. Formatting is managed by ESLint via `eslint.config.mjs` extending `next/core-web-vitals` and `next/typescript`.
- 2-space indentation used throughout.
- No semicolons? Actually semicolons ARE present in all source files.
- Single quotes for strings.

**Linting:**
- ESLint v9 with flat config (`eslint.config.mjs`). Extends `next/core-web-vitals` and `next/typescript`.
- Ignored paths: `.next/**`, `node_modules/**`, `coverage/**`, `next-env.d.ts`.
- Run via: `npm run lint` (which runs `eslint .`).

**TypeScript:**
- Strict mode enabled in `tsconfig.json` (`"strict": true`).
- `noEmit: true` (Next.js handles compilation).
- `moduleResolution: "bundler"`.
- Path alias `@/*` maps to `./src/*`.
- `allowJs: false` -- pure TypeScript project.

## Import Organization

**Order (observed pattern):**

1. **Third-party library imports** (node_modules)
2. **Internal alias imports** (`@/` path)
3. **Relative imports** (`./` or `../`)

Examples:
```typescript
// adapters.ts
import { buildPromptBrief } from "./brief";                    // relative
import { renderGenericVideoPrompt, renderSeedancePrompt } from "./renderers/video-renderer";  // relative
import { getTargetTool } from "./targets";                      // relative
import type { PromptSelections, RenderedPrompt, TargetToolId, WorkTypeConfig } from "./types"; // relative, type-only

// prompt-guide.tsx
import { Check, ChevronDown, Clapperboard, Clipboard, Copy, ShieldCheck, SlidersHorizontal } from "lucide-react";  // third-party
import React, { useMemo, useState } from "react";                // third-party
import { Button } from "@/components/ui/button";                 // alias
import { renderPrompt } from "@/lib/prompt/adapters";            // alias
```

**Type-only imports:**
- `import type` is used consistently instead of inline `import { type Foo }`:
```typescript
import type { PromptSelections } from "./types";
import type { OptionSet, TargetToolConfig, WorkTypeConfig } from "./types";
```

**Barrel imports:**
- Barrel files consolidate sub-module exports: `options/index.ts` re-exports `optionSets`, `getOptionSet`, `getOptionById`; `targets/index.ts` re-exports `targetTools`, `getTargetTool`.
- No explicit `export *` or named re-exports from barrel files -- they import the individual modules and build higher-level APIs.

## Error Handling

**Patterns:**
- Throw errors with descriptive messages for invalid states:
```typescript
// options/index.ts
if (!optionSet) {
  throw new Error(`Unknown option set: ${optionSetId}`);
}
// targets/index.ts
if (!target) {
  throw new Error(`Unknown target tool: ${targetToolId}`);
}
```
- Return error arrays from validation functions rather than throwing for validation results:
```typescript
export function validateOptionIdsUnique(optionSets_?: OptionSet[]) {
  const seen = new Set<string>();
  const duplicates: string[] = [];
  // ... collect duplicates
  return duplicates;  // empty array = no errors
}
```
- No custom error classes detected.
- No `try/catch` blocks in the codebase (errors are thrown to caller).
- No early returns for error cases in components -- nullish rendering for conditional UI instead.

**Edge cases:**
- Nullable parameters accepted with `_` suffix convention: `optionSets_?: OptionSet[]` -- the trailing underscore denotes an optional parameter that defaults.
- `normalizeSelection` / `selectionArray` helper functions handle `undefined` -> empty array gracefully.
- Filtering with type guard `filter((option): option is NonNullable<typeof option> => Boolean(option))` in `brief.ts`.

## Logging

**Framework:** None detected. No `console.log`, `console.warn`, or `console.error` calls in source files. No logging library (Pino, Winston, etc.).

**Patterns:**
- Warnings surfaced as return values rather than logs: `rendered.warnings` in `RenderedPrompt` interface.
- UI-rendered warnings from `warningFromBrief` in `video-renderer.ts` via `riskHint` on options.

## Comments

**When to Comment:**
- Minimal JSDoc/TSDoc -- none detected on any function or interface.
- No inline comments explaining code logic.
- No `TODO`, `FIXME`, `HACK`, or `XXX` comments in source files.
- The codebase relies on self-documenting code (descriptive names + TypeScript types).

**JSDoc/TSDoc:**
- Not used. No `/** ... */` comment blocks on any functions or types.

## Function Design

**Size:** Functions range from small helpers (1-5 lines like `cn`, `normalizeSelection`) to larger renderers (150 lines for `renderSeedancePrompt`). The component `PromptGuide` is ~190 lines.

**Parameters:** 
- Complex functions use a single params object with destructuring for clarity:
```typescript
export function renderPrompt(params: {
  workType: WorkTypeConfig;
  targetToolId: TargetToolId;
  rawIntent: string;
  selections: PromptSelections;
}): RenderedPrompt { ... }
```
- Simple functions use positional parameters:
```typescript
export function getOptionSet(optionSetId: string): OptionSet { ... }
export function renderSeedancePrompt(brief: PromptBrief, target: TargetToolConfig): RenderedPrompt { ... }
```

**Return Values:**
- Functions explicitly typed with return annotations.
- Validation functions return `string[]` (empty = success).
- Lookup functions throw on not-found for required lookups, return `undefined` for optional lookups.

## Module Design

**Exports:**
- Named exports only. No `export default` in library code.
- Next.js pages (`page.tsx`, `layout.tsx`) use `export default` for the page component (Next.js requirement).
- Each file typically exports 1-2 primary items.

**Barrel Files:**
- `options/index.ts` and `targets/index.ts` serve as barrels. They import from individual modules and export a consolidated API.
- Pattern: `satisfies` keyword used for type-checking arrays:
```typescript
export const optionSets = [
  useCaseOptions,
  // ...
] satisfies OptionSet[];
export const targetTools = [seedanceTarget, genericVideoTarget] satisfies TargetToolConfig[];
```

**File Responsibility:**
- One concept per file: `validation.ts` = validation functions, `brief.ts` = brief building, `adapters.ts` = routing to renderers.
- Option/data files export a single const (e.g., `useCaseOptions`, `seedanceTarget`).

## React Conventions

**Components:**
- Functional components only (`export function ComponentName`), no class components.
- "use client" directive at top of interactive components.
- Props typed inline with destructuring, or via a dedicated interface:
```typescript
function CopyButton({ label, value }: { label: string; value: string }) { ... }
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> { variant?: ButtonVariant; }
export function Button({ className, variant = "secondary", ...props }: ButtonProps) { ... }
```
- State management: `useState` and `useMemo`, no external state library.
- Tailwind CSS classes via `cn()` helper.
- Icons from `lucide-react`.

---

*Convention analysis: 2026-05-10*
