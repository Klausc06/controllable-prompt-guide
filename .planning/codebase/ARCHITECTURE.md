# Architecture

**Analysis Date:** 2026-05-10

## Pattern Overview

**Overall:** Configuration-driven prompt generation pipeline

The codebase implements a single-page application (SPA) that guides users through structured choices to produce a video generation prompt. The entire prompt logic is **configuration-driven**: work types define question schemas, option catalogs define selectable items, target tools define adaptation rules, and renderers produce locale-specific output. The core pipeline is stateless -- `PromptSelections` in, `RenderedPrompt` out.

**Key Characteristics:**
- Configuration-driven: All questions, options, targets, and renderers are data, not hardcoded branching.
- Pipeline architecture: Selections -> Brief -> Rendered Prompt (Chinese + English + JSON copy).
- Locale-aware: All user-facing strings and prompt outputs are bilingual (`zh` / `en`).
- Client-side only: No server API routes, no database, no external service calls -- pure React state + memoized computation.
- Single work type: Currently only `video_prompt` is defined, hardcoded into the component.

## Layers

**Prompt Configuration Layer (`src/lib/prompt/`):**
- Purpose: Defines all data types, work type schemas, option catalogs, target tool configs, renderers, validation, and the adapter entry point.
- Location: `src/lib/prompt/`
- Contains:
  - `types.ts` -- All type definitions (WorkTypeConfig, TargetToolConfig, OptionItem, QuestionSchema, PromptBrief, RenderedPrompt, TargetAdapter)
  - `work-types/` -- Work type configs (`video-prompt.worktype.ts`)
  - `options/` -- OptionSet catalogs (11 files: use-case, subject, scene, motion, camera, lighting, style, constraints, audio, format, text-handling)
  - `targets/` -- Target tool configs (`seedance.target.ts`, `generic-video.target.ts`)
  - `renderers/` -- Prompt rendering functions (`video-renderer.ts`)
  - `brief.ts` -- Builds `PromptBrief` from WorkTypeConfig + selections
  - `adapters.ts` -- Orchestrator: builds brief then routes to target-specific renderer
  - `validation.ts` -- Integrity checks for option uniqueness, work type schema, target config
- Depends on: `src/lib/utils.ts` (only the `cn` utility is used by components, not by prompt lib)
- Used by: `src/components/prompt-guide.tsx`

**UI Layer (`src/components/`):**
- Purpose: React components rendering the interactive questionnaire and output panels.
- Location: `src/components/`
- Contains: `prompt-guide.tsx`, `prompt-guide.test.tsx`, `ui/button.tsx`
- Depends on: `src/lib/prompt/` (adapters, options, targets, types, work-types), `src/lib/utils.ts`
- Key behavior: Hardcodes `videoPromptWorkType` directly via import (not resolved dynamically from `WorkTypeId`).

**App Entry Layer (`src/app/`):**
- Purpose: Next.js App Router pages and layout.
- Location: `src/app/`
- Contains: `layout.tsx` (RootLayout), `page.tsx` (renders `<PromptGuide />`), `globals.css`
- Depends on: `src/components/prompt-guide.tsx`

## Data Flow

**Prompt Rendering Pipeline:**

1. User selects options via `QuestionBlock` components -> `setSelections()` updates `PromptSelections` state in `PromptGuide`
2. `useMemo` triggers `renderPrompt()` from `adapters.ts` with current `workType`, `targetToolId`, and `selections`
3. `renderPrompt()` calls `buildPromptBrief()` from `brief.ts` which:
   - Iterates over the work type's `QuestionSchema[]`
   - Resolves each selection's option IDs into full `OptionItem` objects via `getOptionById()`
   - Filters out unanswered optional questions
   - Returns a `PromptBrief` containing only answered items
4. `renderPrompt()` then routes to the target-specific renderer (`renderSeedancePrompt` or `renderGenericVideoPrompt`) based on `targetToolId`
5. The renderer constructs `zhPrompt` and `enPrompt` strings by joining `promptFragment` values from selected options, falling back to hardcoded defaults for each dimension
6. Returns `RenderedPrompt` containing: `zhPrompt`, `enPrompt`, `brief` (for JSON copy), `adaptationNote`, `warnings` (collected `riskHint`s)

**Output:**
- Chinese prompt: Narrative paragraph style (Seedance) or structured field list (generic)
- English prompt: Same structure mirrored
- JSON brief: `JSON.stringify(rendered.brief)` -- used as structured copy
- Warnings: Aggregated risk hints from selected constraint options

**State Management:**
- All state is local React state in `PromptGuide` component:
  - `selections: PromptSelections` -- Record of questionId -> SelectionValue
  - `targetToolId: TargetToolId` -- Currently "seedance" or "generic_video"
  - `advancedOpen: boolean` -- Toggle for advanced questions section
- No global state, no context providers, no server state.

## Key Abstractions

**WorkTypeConfig:**
- Purpose: Defines a complete prompt questionnaire (identifies, labels, question schemas).
- Examples: `videoPromptWorkType` in `src/lib/prompt/work-types/video-prompt.worktype.ts`
- Pattern: Static data object conforming to `WorkTypeConfig` interface

**OptionSet:**
- Purpose: A catalog of selectable options for a question dimension (e.g., subject, scene, lighting).
- Examples: `src/lib/prompt/options/use-case.options.ts`, `src/lib/prompt/options/constraints.options.ts`
- Pattern: Static data array of `OptionItem`, each with bilingual labels, professional terms, prompt fragments, and tool applicability.

**TargetToolConfig:**
- Purpose: Configures output adaptation for a specific target tool (prefer/suppress/safety rules).
- Examples: `seedanceTarget` in `src/lib/prompt/targets/seedance.target.ts`, `genericVideoTarget` in `src/lib/prompt/targets/generic-video.target.ts`
- Pattern: Static data object with `prefer[]`, `suppress[]`, `safetyDefaults[]` arrays. Currently `suppress` is unused in the renderer.

**Renderers:**
- Purpose: Convert `PromptBrief` + `TargetToolConfig` into locale-specific prompt strings and metadata.
- Examples: `renderSeedancePrompt`, `renderGenericVideoPrompt` in `src/lib/prompt/renderers/video-renderer.ts`
- Pattern: Pure functions; each target tool has a dedicated render function with its own template structure. Currently co-located in one file.

**PromptBrief:**
- Purpose: Intermediate structured data -- the resolved "answer sheet" between raw selections and rendered output.
- Builder: `buildPromptBrief()` in `src/lib/prompt/brief.ts`
- Contains: version, workTypeId, targetToolId, rawIntent, items[] (each with questionId, title, selected OptionItems, optional freeText)

## Entry Points

**Application Entry:**
- Location: `src/app/page.tsx`
- Triggers: HTTP GET to `/`
- Responsibilities: Renders `<PromptGuide />` component

**Prompt Engine Entry:**
- Location: `src/lib/prompt/adapters.ts`
- Function: `renderPrompt(params)`
- Responsibilities: Validates target tool exists, builds brief, routes to correct renderer. This is the sole public API of the prompt library.

**Validation Entry:**
- Location: `src/lib/prompt/validation.ts`
- Functions: `validateOptionIdsUnique`, `validateWorkTypeConfig`, `validateTargetConfig`
- Used in: `src/lib/prompt/validation.test.ts` for CI-time configuration integrity checks

## Error Handling

**Strategy:** Throw on invalid configuration; fall back to defaults in renderers.

**Patterns:**
- `getTargetTool()` in `src/lib/prompt/targets/index.ts` throws `Error` if `targetToolId` is not found
- `getOptionSet()` in `src/lib/prompt/options/index.ts` throws `Error` for unknown `optionSetId`
- `getOptionById()` in `src/lib/prompt/options/index.ts` returns `undefined` (callers filter with `.filter(Boolean)`)
- Renderers in `video-renderer.ts` use fallback defaults (`|| "clear main subject"`) for every dimension -- never throws on input
- `adapters.ts` has a fallback `return renderGenericVideoPrompt(...)` for unknown targets rather than throwing

## Cross-Cutting Concerns

**Logging:** None. No logging infrastructure exists.

**Validation:** Build-time integrity checks in `validation.ts` (option ID uniqueness, work type schema, target config). Only executed manually or in tests. No runtime validation of user selections before rendering.

**Authentication:** None. The app has no auth, no API routes, no user identity.

**Internationalization:** Simple `LocalizedText { zh: string, en: string }` pattern used throughout. Locale is selected at render time by each renderer (always generates both). The UI currently hardcodes `zh` display language.

---

*Architecture analysis: 2026-05-10*
