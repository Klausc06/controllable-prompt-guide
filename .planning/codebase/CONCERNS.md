# Codebase Concerns

**Analysis Date:** 2026-05-10

## Tech Debt

### Hardcoded TargetToolId union blocks extensibility

- Issue: `TargetToolId` is defined as a union type `"seedance" | "generic_video"` in `src/lib/prompt/types.ts` (line 2). Every option file hardcodes `appliesTo: ["seedance", "generic_video"]` on every option. Adding Sora, Runway, Veo, Kling, or Canva requires editing the type definition, every option file, the adapter switch, and the renderer.
- Files: `src/lib/prompt/types.ts`, `src/lib/prompt/adapters.ts`, `src/lib/prompt/renderers/video-renderer.ts`, all 12 option files
- Impact: Blocks scaling. Each new target tool requires touching 15+ files. The union type is a compile-time constraint that provides no runtime extensibility.
- Fix approach: Replace `TargetToolId` union with an open string-based type validated by a registry. Introduce a target registry that maps IDs to adapters. Move `appliesTo` validation to config-time checks.

### if/else target branching in adapter instead of registry

- Issue: `adapters.ts` (lines 20-24) uses an explicit `if/else` on `targetToolId` to route rendering:
  ```
  if (params.targetToolId === "seedance") { return renderSeedancePrompt(...); }
  return renderGenericVideoPrompt(...);
  ```
  This is a hard-coded switch with a fallback fallthrough to "generic_video" as default. The `TargetAdapter` interface exists in `types.ts` (lines 86-89) but is never implemented or used.
- Files: `src/lib/prompt/adapters.ts`, `src/lib/prompt/types.ts` (lines 86-89 unused `TargetAdapter` interface)
- Impact: Adding a new target means modifying `adapters.ts` directly. The fallback to `generic_video` on unknown IDs masks configuration errors silently.
- Fix approach: Implement an adapter registry (`Map<TargetToolId, TargetAdapter>`) populated by each target module. Replace the `if/else` with registry lookup plus explicit error on unknown target.

### PromptGuide directly imports videoPromptWorkType instead of using a registry

- Issue: `src/components/prompt-guide.tsx` (line 10) imports `videoPromptWorkType` directly:
  ```
  import { videoPromptWorkType } from "@/lib/prompt/work-types/video-prompt.worktype";
  ```
  A `workTypes` array exists in `src/lib/prompt/work-types/video-prompt.worktype.ts` (line 160) but is not exported from a barrel or used anywhere. Adding a new work type would require additional direct imports.
- Files: `src/components/prompt-guide.tsx` (line 10), `src/lib/prompt/work-types/video-prompt.worktype.ts` (lines 160-161)
- Impact: Ties the UI component to a specific work type module. A new work type (e.g., image prompt, audio prompt) requires editing the component.
- Fix approach: Create a work type registry (similar to the target registry) and have the component resolve the work type by ID from the registry.

### Renderer depends on hardcoded magic question ID strings

- Issue: `src/lib/prompt/renderers/video-renderer.ts` uses string literals like `"use_case"`, `"subject"`, `"scene"`, `"motion"`, `"camera"`, `"lighting"`, `"style"`, `"audio"`, `"format"`, `"text_handling"`, `"constraints"` as question IDs to extract brief text. These are scattered across both `renderSeedancePrompt` and `renderGenericVideoPrompt` (lines 11-34, 78-114). There is no centralized mapping or validation that all referenced question IDs exist in the work type.
- Files: `src/lib/prompt/renderers/video-renderer.ts` (all question ID references)
- Impact: If a question ID is renamed in the work type definition, the renderer silently returns empty strings. No compile-time or runtime check catches a mismatch.
- Fix approach: Define a constant/enum for question IDs used by renderers. Add a validation step that checks every question ID referenced by a renderer exists in the work type's question list.

### Generic video renderer missing text_handling field

- Issue: `renderSeedancePrompt` in `video-renderer.ts` (line 20) reads `text_handling` from the brief and includes it in the prompt output. `renderGenericVideoPrompt` (lines 77-114) does NOT include `text_handling` in its `fields` object. If a user selects text handling options, they are silently dropped from the generic video prompt output.
- Files: `src/lib/prompt/renderers/video-renderer.ts` (line 20 vs lines 77-114)
- Impact: Users selecting the "通用视频模型" target lose text_handling guidance even though they selected it. The brief contains the data but the rendered prompt does not.
- Fix approach: Add `text_handling` to the generic renderer's `fields` object and include it in the prompt template, similar to the seedance renderer.

### Target metadata (appliesTo, prefer, suppress, safetyDefaults) defined but not executed

- Issue: Five pieces of metadata across the type system are never applied at runtime:
  - `OptionItem.appliesTo` (types.ts line 20): Every option has this field but no code filters options by target. The UI renders all options regardless of target (prompt-guide.tsx lines 120-161).
  - `TargetToolConfig.prefer` (types.ts line 52): Validated as non-empty (validation.ts line 45) but never used by the renderer or brief builder to reorder or emphasize preferred dimensions.
  - `TargetToolConfig.suppress` (types.ts line 53): Defined on both targets (both are `[]` currently) but never used to hide or warn about incompatible question dimensions.
  - `TargetToolConfig.safetyDefaults` (types.ts line 54): `seedance.target.ts` line 17 defines `safetyDefaults: ["no_ip_or_celebrity", "stable_identity", "readable_text"]`; `generic-video.target.ts` line 17 defines `safetyDefaults: ["no_ip_or_celebrity", "stable_identity"]`. Neither is injected into the selections or enforced in the renderer.
- Files: `src/lib/prompt/types.ts` (lines 20, 52-54), `src/components/prompt-guide.tsx` (lines 120-161), `src/lib/prompt/renderers/video-renderer.ts`, `src/lib/prompt/brief.ts`, `src/lib/prompt/targets/seedance.target.ts` (line 17), `src/lib/prompt/targets/generic-video.target.ts` (line 17)
- Impact: Target tool selection is cosmetic. Swapping targets produces different prompt templates but does not filter options, reorder questions, suppress irrelevant dimensions, or inject safety defaults. The `appliesTo` field is dead code. The `safetyDefaults` are ignored, meaning users of Seedance can generate prompts without celebrity/IP avoidance.
- Fix approach: (1) Filter option display by `appliesTo` in the UI component. (2) Inject `safetyDefaults` into selections unless the user has explicitly chosen otherwise. (3) Use `prefer` to reorder/recommend questions. (4) Use `suppress` to hide or warn about inapplicable questions.

### Default selections hardcoded in the UI component

- Issue: `prompt-guide.tsx` (lines 13-25) defines `defaults` as a hardcoded object with magic string keys (e.g., `use_case: "gym_opening"`) referencing option IDs directly. There is no connection to the work type schema or target config.
- Files: `src/components/prompt-guide.tsx` (lines 13-25)
- Impact: Defaults are not validated against the selected target's `safetyDefaults` or `appliesTo`. Changing the work type requires editing this component. The default target is hardcoded as `"seedance"` (line 167).
- Fix approach: Derive defaults from the target config (e.g., inject `safetyDefaults` as pre-selected constraints). Use a default resolver that reads from config rather than hardcoded values.

### Option IDs are bare strings with no namespace

- Issue: All option IDs (e.g., `"gym_opening"`, `"bright_commercial_interior"`) are flat string IDs defined across 12 option files. There is no namespace or scope to prevent collisions if option sets are merged or reused across work types. Duplicate detection exists (validation.ts lines 5-16) but is opt-in and only checks within the provided array.
- Files: All files under `src/lib/prompt/options/*.options.ts`
- Impact: If two option sets coincidentally define the same ID, one silently overwrites the other via `getOptionById` (options/index.ts line 39: `optionSets.flatMap(...).find(...)` returns the first match, making duplicates silently incorrect).
- Fix approach: Make `getOptionById` throw on duplicates at registration time. Consider scoping IDs (e.g., `"option_set_id:option_id"`).

### Validation is shallow and incomplete

- Issue: `src/lib/prompt/validation.ts` only checks option ID uniqueness (lines 3-16), work type question schema basics (lines 18-40), and target `prefer` non-empty (lines 42-54). Missing validations:
  - Option `appliesTo` references a valid `TargetToolId` (currently always correct because only two exist, but will break when new targets are added)
  - Every target referenced by `appliesTo` has a registered adapter
  - Renderer question ID references match work type questions
  - `safetyDefaults` option IDs exist in the option catalog
  - `prefer`/`suppress` question IDs exist in the work type
  - Default selections exist as valid option IDs
  - Renderer coverage: every target has exactly one registered renderer
- Files: `src/lib/prompt/validation.ts`, `src/lib/prompt/validation.test.ts`
- Impact: Configuration errors are not caught at dev/build time. Mismatched IDs, orphaned options, and missing renderers will produce silent runtime failures (empty prompts, missing fields, thrown errors).
- Fix approach: Expand validation to cover all cross-references between types (option -> target, target -> renderer, renderer -> question, safetyDefaults -> option).

## Performance Bottlenecks

### Option lookups are O(n) linear scans

- Issue: `getOptionById` in `options/index.ts` (line 38-40) flat-maps all option sets and does a linear `Array.find()` every call. `buildPromptBrief` in `brief.ts` (line 42) calls `getOptionById` for each selected option per question. With 10+ questions and up to 4 selections each, this is 40+ linear scans per render.
- Files: `src/lib/prompt/options/index.ts` (line 38-40), `src/lib/prompt/brief.ts` (line 42)
- Impact: Negligible at current scale (200 lines of options) but will degrade as the option catalog grows to hundreds of options.
- Improvement path: Build a `Map<string, OptionItem>` at module init time (like `optionSetById` already does) and use `Map.get()` for O(1) lookups.

## Fragile Areas

### Silent option dropping in brief builder

- Issue: `brief.ts` (lines 42-43) calls `getOptionById(optionId)` which can return `undefined`. The `.filter(Boolean)` on line 44 silently removes any option ID that doesn't resolve. A user could select an option that was removed or renamed, and it would vanish from the brief with no warning.
- Files: `src/lib/prompt/brief.ts` (lines 41-44)
- Why fragile: No logging, no warnings to the user, no validation at selection time. A typo in option ID renames can corrupt briefs silently.
- Test coverage: The test at `src/lib/prompt/validation.test.ts` tests option ID uniqueness but does not test that `buildPromptBrief` handles unknown option IDs gracefully with a warning.
- Safe modification: Add a warning accumulation mechanism to `buildPromptBrief` that collects unknown option IDs and surfaces them in `RenderedPrompt.warnings`.

### adapters.ts has a silent fallback to generic_video

- Issue: `adapters.ts` (line 24) uses `return renderGenericVideoPrompt(brief, target)` as the default/else branch. Any unknown `targetToolId` that passes TypeScript's narrowed type check will fall through to the generic renderer with no warning. If TypeScript's union check is bypassed (e.g., via `as` cast), this creates a silent misrouting.
- Files: `src/lib/prompt/adapters.ts` (lines 20-24)
- Why fragile: The fallback creates an implicit assumption that "generic_video" is the default for all video targets. A new target that needs unique rendering would silently get generic output instead of throwing a helpful error.
- Test coverage: The test at `validation.test.ts` (lines 55-76) tests both known targets but does not test behavior for unknown targets.
- Safe modification: Replace fallthrough with an explicit error or a registry lookup that throws on unknown IDs.

## Missing Critical Features

### No evidence that selected options actually appear in the rendered prompt

- Problem: There is no end-to-end assertion that selecting a particular option causes its `promptFragment` to appear in the rendered output. The test in `validation.test.ts` (lines 55-76) checks that seedance output contains "生成一段" and "镜头调度" and generic output contains "目标：咖啡店新品短视频" but does NOT assert on individual option content like `promptFragment` strings.
- Blocks: Confident regression detection. If `buildPromptBrief` or a renderer silently drops data (as happens with `text_handling` in the generic renderer), no test catches it.
- Priority: Medium

### No suppression with warnings for incompatible options

- Problem: When the user switches target tools, previously selected options that are incompatible with the new target (i.e., `appliesTo` does not include the new target) should either be deselected with a warning or explicitly flagged. Currently, switching targets retains all selections and the brief silently includes them regardless of `appliesTo`.
- Blocks: User trust. A user could submit a prompt containing options that the rendering model does not support.
- Priority: High

### No free_text input used despite schema support

- Problem: `QuestionMode` includes `"free_text"` (types.ts line 3) and `break.ts` (lines 28-39) handles free_text in `buildPromptBrief`. But no question in the work type uses `mode: "free_text"` -- all are `"single"` or `"multi"`. The textarea in `QuestionBlock` (prompt-guide.tsx lines 111-117) is wired up but never rendered because no question has `free_text` mode.
- Files: `src/lib/prompt/types.ts` (line 3), `src/lib/prompt/brief.ts` (lines 28-39), `src/components/prompt-guide.tsx` (lines 111-117)
- Impact: Unused code paths that could rot if not exercised. Schema complexity without payoff.
- Priority: Low (deferred feature)

## Test Coverage Gaps

### Untested area: option filtering by target tool

- What's not tested: No test verifies that changing `targetToolId` hides/shows options based on `appliesTo`. Currently no filtering exists -- but when it is added, there are no tests for it.
- Files: `src/components/prompt-guide.test.tsx`, `src/lib/prompt/validation.test.ts`
- Risk: The `appliesTo` field on every option is dead code with no test coverage. When filtering is implemented, bugs in filtering logic would go undetected.
- Priority: Medium

### Untested area: safetyDefaults injection

- What's not tested: No test verifies that selecting a target with `safetyDefaults` automatically includes those constraint options. No test verifies that changing target updates safety default selections.
- Files: `src/lib/prompt/validation.test.ts`, `src/lib/prompt/targets/seedance.target.ts`, `src/lib/prompt/targets/generic-video.target.ts`
- Risk: Security-related defaults (no celebrities, stable identity) are unenforced. Users can generate prompts that violate safety constraints.
- Priority: High

### Untested area: renderer question ID coverage

- What's not tested: No test verifies that every question ID referenced in a renderer (e.g., `"text_handling"`) actually exists in the work type definition.
- Files: `src/lib/prompt/renderers/video-renderer.ts`, `src/lib/prompt/work-types/video-prompt.worktype.ts`, `src/lib/prompt/validation.test.ts`
- Risk: Renaming `text_handling` to `onscreen_text` in the work type would break the seedance renderer silently (empty output for that dimension), but no test catches it.
- Priority: Medium

---

*Concerns audit: 2026-05-10*
