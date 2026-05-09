# Codebase Structure

**Analysis Date:** 2026-05-10

## Directory Layout

```
controllable-prompt-guide/
├── src/
│   ├── app/                    # Next.js App Router entry
│   │   ├── globals.css         # Global Tailwind CSS
│   │   ├── layout.tsx          # RootLayout (html lang=zh-CN, metadata)
│   │   └── page.tsx            # Home page -> renders <PromptGuide />
│   ├── components/
│   │   ├── prompt-guide.tsx    # Main interactive questionnaire component
│   │   ├── prompt-guide.test.tsx  # Component tests
│   │   └── ui/
│   │       └── button.tsx      # Reusable Button component
│   ├── lib/
│   │   ├── prompt/
│   │   │   ├── adapters.ts     # Render pipeline orchestrator (public API)
│   │   │   ├── brief.ts        # Builds PromptBrief from selections
│   │   │   ├── types.ts        # All type definitions
│   │   │   ├── validation.ts   # Config integrity checks
│   │   │   ├── validation.test.ts  # Validation tests
│   │   │   ├── options/        # OptionSet catalogs (11 files)
│   │   │   │   ├── index.ts              # Registry + lookup helpers
│   │   │   │   ├── audio.options.ts
│   │   │   │   ├── camera.options.ts
│   │   │   │   ├── constraints.options.ts
│   │   │   │   ├── format.options.ts
│   │   │   │   ├── lighting.options.ts
│   │   │   │   ├── motion.options.ts
│   │   │   │   ├── scene.options.ts
│   │   │   │   ├── style.options.ts
│   │   │   │   ├── subject.options.ts
│   │   │   │   ├── text-handling.options.ts
│   │   │   │   └── use-case.options.ts
│   │   │   ├── renders/        # Prompt renderers
│   │   │   │   └── video-renderer.ts  # Seedance + generic video renderer functions
│   │   │   ├── targets/        # Target tool configurations
│   │   │   │   ├── index.ts              # Registry + getTargetTool()
│   │   │   │   ├── seedance.target.ts     # Seedance 2.0 config
│   │   │   │   └── generic-video.target.ts  # Generic video config
│   │   │   └── work-types/     # Work type definitions
│   │   │       └── video-prompt.worktype.ts  # Single work type: video_prompt
│   │   └── utils.ts            # cn() utility (clsx + tailwind-merge)
│   ├── test/
│   │   └── setup.ts            # Vitest setup (imports @testing-library/jest-dom)
│   └── (no other src folders)
├── .planning/
│   └── codebase/               # Architecture / structure analysis docs
├── .memory/                    # Project memory (omx-managed)
├── .omx/                       # omx tool state (logs, metrics, sessions)
├── eslint.config.mjs           # ESLint flat config
├── next.config.ts              # Next.js config
├── package.json                # Dependencies and scripts
├── postcss.config.mjs          # PostCSS config (Tailwind)
├── tailwind.config.ts          # Tailwind theme extensions
├── tsconfig.json               # TypeScript config (path alias @/ -> ./src/)
├── vitest.config.ts            # Vitest config (jsdom, alias @/)
└── WORKLOG.md                  # Development worklog
```

## Directory Purposes

**`src/app/`:**
- Purpose: Next.js App Router entry points and global styles
- Contains: Page components, layout, CSS
- Key files:
  - `src/app/layout.tsx`: Root HTML structure, metadata, font loading
  - `src/app/page.tsx`: Single route `/` rendering `<PromptGuide />`

**`src/components/`:**
- Purpose: React UI components
- Contains: Main prompt guide component and reusable UI primitives
- Key files:
  - `src/components/prompt-guide.tsx`: The entire questionnaire UI (sticky sidebar, question blocks, output panels, copy buttons)
  - `src/components/ui/button.tsx`: Reusable styled button

**`src/lib/prompt/`:**
- Purpose: Core prompt engine -- types, configuration data, rendering logic, validation
- Contains: All prompt-related modules organized by concern
- Key files:
  - `src/lib/prompt/types.ts`: Shared type definitions used by every other module
  - `src/lib/prompt/adapters.ts`: Single public entry point `renderPrompt()` for the pipeline
  - `src/lib/prompt/brief.ts`: Converts raw selections into structured PromptBrief

**`src/lib/prompt/options/`:**
- Purpose: OptionSet catalogs -- one file per question dimension
- Contains: 11 `OptionSet` export constants plus `index.ts` registry
- Key files:
  - `src/lib/prompt/options/index.ts`: Registry array `optionSets`, lookup functions `getOptionSet()` and `getOptionById()`

**`src/lib/prompt/targets/`:**
- Purpose: Target tool configuration data
- Contains: Tool configs and registry
- Key files:
  - `src/lib/prompt/targets/index.ts`: Registry `targetTools` array and `getTargetTool()` lookup

**`src/lib/prompt/renderers/`:**
- Purpose: Render functions that produce locale-specific prompt text
- Contains: Currently one file with two render functions (Seedance + generic video)

**`src/lib/prompt/work-types/`:**
- Purpose: Work type definitions (question schemas)
- Contains: Currently one work type config for video prompts

## Key File Locations

**Entry Points:**
- `src/app/layout.tsx`: Next.js RootLayout
- `src/app/page.tsx`: Application home page
- `src/lib/prompt/adapters.ts`: Prompt engine public API (`renderPrompt()`)

**Configuration:**
- `src/lib/prompt/types.ts`: All shared types
- `src/lib/prompt/work-types/video-prompt.worktype.ts`: Work type schema (questions, labels)
- `src/lib/prompt/options/index.ts`: Option catalog registry
- `src/lib/prompt/targets/index.ts`: Target tool registry

**Core Logic:**
- `src/lib/prompt/brief.ts`: Brief construction from selections
- `src/lib/prompt/renderers/video-renderer.ts`: Prompt text rendering
- `src/lib/prompt/adapters.ts`: Pipeline orchestration

**Testing:**
- `src/components/prompt-guide.test.tsx`: Component tests for PromptGuide
- `src/lib/prompt/validation.test.ts`: Config integrity tests
- `src/test/setup.ts`: Vitest setup (jest-dom matchers)

## Naming Conventions

**Files:**
- **kebab-case** with dot-separated suffixes for config files: `audio.options.ts`, `seedance.target.ts`, `video-prompt.worktype.ts`, `generic-video.target.ts`, `text-handling.options.ts`
- **kebab-case** for component files: `prompt-guide.tsx`, `prompt-guide.test.tsx`
- **kebab-case** for config files: `vitest.config.ts`, `tailwind.config.ts`, `eslint.config.mjs`, `postcss.config.mjs`

**Directories:**
- **kebab-case** for all directories: `work-types`, `renderers`, `prompt-guide`, `test`

**Functions:**
- **camelCase** for all functions: `renderPrompt`, `buildPromptBrief`, `getOptionSet`, `getTargetTool`, `renderSeedancePrompt`, `validateOptionIdsUnique`, `getBriefText`

**Variables:**
- **camelCase** for local variables: `selectedOptions`, `coreQuestions`, `completedCore`
- **UPPER_SNAKE_CASE** for constants is NOT used (all exports use camelCase: `const seedanceTarget`, `const videoPromptWorkType`)

**Types:**
- **PascalCase** for interfaces and type aliases: `WorkTypeConfig`, `TargetToolConfig`, `OptionItem`, `QuestionSchema`, `PromptBrief`, `RenderedPrompt`, `TargetAdapter`, `OptionSet`
- **Union type suffixes with "Id" or "Mode":** `WorkTypeId`, `TargetToolId`, `QuestionMode`, `QuestionLevel`, `PromptLocale`
- **Interface pattern:** `LocalizedText`, `OptionItem`, `QuestionSchema`, `WorkTypeConfig`, `TargetToolConfig`, `PromptSelections`, `BriefItem`, `PromptBrief`, `RenderedPrompt`, `TargetAdapter`, `OptionSet`

**Ids:**
- **snake_case** for configuration IDs: `"video_prompt"`, `"seedance"`, `"generic_video"`, `"no_ip_or_celebrity"`, `"gym_opening"`, `"vertical_10s"`

## Where to Add New Code

**New Option Catalog:**
- Create file: `src/lib/prompt/options/<name>.options.ts`
- Export a named `const` following the pattern: `export const <name>Options: OptionSet = { ... }`
- Register in: `src/lib/prompt/options/index.ts` -- add import and add to `optionSets` array

**New Target Tool:**
- Create file: `src/lib/prompt/targets/<name>.target.ts`
- Export a named `const`: `export const <name>Target: TargetToolConfig = { ... }`
- Register in: `src/lib/prompt/targets/index.ts` -- add to `targetTools` array
- Add a render function in: `src/lib/prompt/renderers/video-renderer.ts`
- Add routing in: `src/lib/prompt/adapters.ts` -- add `if` or switch branch
- Add type to union: `src/lib/prompt/types.ts` -- extend `TargetToolId` union type

**New Work Type:**
- Create file: `src/lib/prompt/work-types/<name>.worktype.ts`
- Export a named `const`: `export const <name>WorkType: WorkTypeConfig = { ... }`
- Add type to union: `src/lib/prompt/types.ts` -- extend `WorkTypeId` union type
- Wire into component: `src/components/prompt-guide.tsx` -- currently hardcoded to `videoPromptWorkType`

**New Question Schema (to existing work type):**
- Add entry to the `questions` array in the appropriate `*.worktype.ts` file
- If it references an `optionSetId`, ensure the option set exists in `src/lib/prompt/options/`

**Utility/Shared:**
- `src/lib/utils.ts`: Generic shared utilities (currently only `cn()`)

**Tests:**
- Co-located with component: `src/components/prompt-guide.test.tsx`
- Co-located with lib module: `src/lib/prompt/validation.test.ts`
- Follow pattern: `<name>.test.ts` or `<name>.test.tsx` co-located next to the source file

## Special Directories

**`.omx/`:**
- Purpose: omx agent orchestration state and logs
- Generated: Yes (by omx tooling)
- Committed: No (auto-generated operational data)

**`.memory/`:**
- Purpose: Project memory files for omx context management
- Generated: Yes (by omx)
- Committed: Yes (project-specific memory)

**`.planning/`:**
- Purpose: Architecture and planning documents generated by GSD tools
- Generated: Yes
- Committed: Yes (manually generated reference docs)

**`node_modules/`:**
- Purpose: npm dependencies
- Generated: Yes
- Committed: No

---

*Structure analysis: 2026-05-10*
