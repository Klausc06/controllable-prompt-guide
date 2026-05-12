# Phase 04: Catalog Expansion - Research

**Researched:** 2026-05-12
**Domain:** Option catalog expansion, namespace migration, metadata completion
**Confidence:** HIGH

## Summary

Phase 04 expands 12 option catalogs from 136 to 180+ options, migrates all option IDs to a `catalogId:optionId` namespace format, and completes `riskHint` metadata for all options. The phase is primarily a data expansion and rename operation -- no new architecture, no new dependencies, no UI changes. The camera split (shot-type + camera-movement) and Markdown export (OPT-03, OPT-06) are already implemented.

**Primary recommendation:** Execute D-01 (namespace migration) first as a single pass across all files, then D-02 (expansion) with the new naming convention already in place, then D-03 (riskHint completion) as a metadata sweep. This ordering avoids migrating new options created during expansion, saving approximately 44 renames.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

1. **D-01: Full namespace prefix migration (OPT-05)**
   - ALL 136 option IDs gain namespace prefix: `{catalogId}:{optionId}`.
   - New format: `"use_case:gym_opening"`, `"shot_type:medium_shot"`, `"constraints:no_ip_or_celebrity"`.
   - ALL references updated: defaults in prompt-guide.tsx, safetyDefaults in 3 target configs, templateMap keys in 3 target configs, test fixtures in registry.test.ts + validation.test.ts.
   - `validateOptionIdFormat()` added to validation.ts -- CI checks that every option ID starts with its catalog prefix.

2. **D-02: Catalog expansion to 180+ options (OPT-01)**
   - Each catalog must have at least 15 options.
   - Weak spots to prioritize: format (5->15), camera-movement (9->15), shot-type (9->15), text-handling (9->15).

3. **D-03: Complete metadata for all options (OPT-02)**
   - Every option must have: label (zh/en), plain (zh/en), professionalTerms (en[]), promptFragment (zh/en), appliesTo, riskHint (zh/en, may be empty string if no risk).
   - riskHint must be substantive for constraints and text_handling catalogs (where risk is real). May be empty for lighting, style, scene, audio, use-case (where risk is low or non-existent).

### Claude's Discretion

- New option content (labels, plain, promptFragments) -- planner decides creative specifics
- riskHint content for borderline catalogs
- Migration order for D-01
- Exact option counts per catalog above the 15 minimum

### Deferred Ideas (OUT OF SCOPE)

None.
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| OPT-01 | Expand all 11 catalogs to minimum counts (~143 options), covering subject, scene, motion, camera, lighting, style, audio, format, text, constraints | See Section: Content Gap Analysis. 44 new options needed across 11 catalogs to reach 180+. Detailed by-catalog gap analysis provided. |
| OPT-02 | Each option has complete label/plain/professionalTerms/promptFragment.{zh,en}/appliesTo/riskHint | See Section: Risk Classification Framework. riskHint classification rules per catalog. Existing riskHint coverage inventoried. |
| OPT-03 | Camera dimension split: shot type + camera movement as independent dimensions | ALREADY DONE. shot-type.options.ts (9 options) + camera-movement.options.ts (9 options) independently registered. Verified in validation.test.ts. |
| OPT-05 | Option ID namespace prefix `{optionSetId}:{optionId}` format, validateOptionIdFormat() CI check | See Section: Migration Strategy. 136 IDs across 12 catalog files to rename. 7 reference update locations identified. validateOptionIdFormat() spec provided. |
| OPT-06 | Markdown export format | ALREADY DONE. renderMarkdown() in brief.ts + CopyButton in prompt-guide.tsx. Verified in tests. |
</phase_requirements>

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| TypeScript | ^5.7.3 | Compile-time validation for option shape | Already in project [VERIFIED: package.json] |
| Vitest | ^3.0.4 | Unit tests for validation and migration | Already in project [VERIFIED: package.json] |
| Next.js | ^15.1.6 | Static export for the wizard UI | Already in project [VERIFIED: package.json] |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| None new needed | -- | -- | Phase is entirely data expansion -- no new dependencies required |

**Key insight:** This phase modifies only `.ts` and `.tsx` source files. No new npm packages, no new infrastructure, no external APIs.

## Architecture Patterns

### Current Project Structure
```
src/lib/prompt/
├── registry/               # Registration-time validation (> Phase 2)
│   ├── option.registry.ts  # registerOptionSet() + duplicate detection
│   ├── target.registry.ts
│   └── ...
├── options/                # 12 catalog files -- TARGET OF THIS PHASE
│   ├── audio.options.ts    (13 options)
│   ├── camera-movement.options.ts (9 options)
│   ├── constraints.options.ts  (10 options)
│   ├── format.options.ts   (5 options)
│   ├── lighting.options.ts (14 options)
│   ├── motion.options.ts   (14 options)
│   ├── scene.options.ts    (13 options)
│   ├── shot-type.options.ts (9 options)
│   ├── style.options.ts    (15 options)
│   ├── subject.options.ts  (13 options)
│   ├── text-handling.options.ts (9 options)
│   ├── use-case.options.ts (12 options)
│   └── index.ts            # Barrel, imports all sets, registers via registerOptionSet()
├── targets/                # safetyDefaults contain option IDs
│   ├── seedance.target.ts
│   ├── generic-video.target.ts
│   └── veo3.target.ts
├── types.ts                # OptionItem, TargetToolConfig definitions
├── validation.ts           # validateOptionIdsUnique(), etc.
├── brief.ts                # Markdown render, suppress detection
└── registry.test.ts        # Unit tests with option ID fixtures
src/components/
└── prompt-guide.tsx        # defaults: PromptSelections with option IDs
```

### Pattern 1: Option Catalog Format
**What:** Each catalog file exports a single `OptionSet` typed constant. The `index.ts` barrel collects all 12 into an `optionSets` array, iterates to call `registerOptionSet()` on each. Registration validates cross-catalog option ID uniqueness at import time.
**When to use:** Always -- the existing pattern. New options are added to the `options` array in the relevant catalog file.
**Example:**
```typescript
// Source: src/lib/prompt/options/subject.options.ts
import type { OptionSet } from "../types";

export const subjectOptions: OptionSet = {
  id: "subject",
  version: "0.1.0",
  label: { zh: "主体", en: "Subject" },
  options: [
    {
      id: "subject:local_storefront",  // AFTER D-01 migration
      version: "0.1.0",
      label: { zh: "线下店铺/门店", en: "Local storefront" },
      plain: { zh: "...", en: "..." },
      professionalTerms: ["storefront hero", "location branding"],
      promptFragment: { zh: "...", en: "..." },
      appliesTo: ["seedance", "generic_video", "veo3"],
      riskHint: { zh: "...", en: "..." }  // REQUIRED per D-03
    }
  ]
};
```

### Pattern 2: Option Set Registration
**What:** The `index.ts` barrel triggers `registerOptionSet()` for each catalog at import time. If any option ID duplicates across catalogs, registration throws immediately. This is how CI catches collisions early.
**When to use:** No change needed -- existing pattern. New options added to catalogs are automatically registered.

### Pattern 3: Target Config safetyDefaults
**What:** `safetyDefaults` is a `string[]` of option IDs that should be auto-selected when switching to a target. These option IDs must exist in the registered option sets (validated by `validateSafetyDefaultsIntegrity()`).
**When to use:** These option IDs will change format after D-01 migration.

### Anti-Patterns to Avoid
- **Duplicating similar options across catalogs:** Each option should live in exactly one catalog. If the same concept appears in two catalogs, use appliesTo to control visibility per target, not duplication.
- **Copying old option IDs into new options without namespace prefix:** D-01 mandates all option IDs use `catalogId:optionId` format. New options must follow the convention.
- **Skipping riskHint on constraints/text_handling:** D-03 requires substantive riskHint for these two catalogs. Empty strings are not acceptable there.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Option ID format validation | Custom regex in test files | Add `validateOptionIdFormat()` to validation.ts | Consistent CI check, reuses existing validation pattern |
| Option content creativity rules | A "content guidelines document" | Follow existing option patterns as templates | The existing 136 options already demonstrate the content standard |
| ID rename in catalogs | Manual find-and-replace (error-prone) | Sequential rename per catalog, then grep-propagation | Each reference type (defaults, safetyDefaults, tests) updates predictably |

**Key insight:** All three sub-tasks (migration, expansion, metadata) follow existing code patterns. No new architecture, no build pipeline changes, no framework integration.

## Current State Inventory

### By-Catalog Option Counts
| Catalog | Current Count | Target Minimum | Options Needed | veo3 Coverage |
|---------|---------------|----------------|----------------|---------------|
| audio | 13 | 15 | +2 | Full (12/13 already) |
| camera-movement | 9 | 15 | +6 | None (0/9 include veo3) |
| constraints | 10 | 15 | +5 | None (0/10 include veo3) |
| format | 5 | 15 | +10 | None (0/5 include veo3) |
| lighting | 14 | 15 | +1 | Full (13/14 already) |
| motion | 14 | 15 | +1 | Full (13/14 already) |
| scene | 13 | 15 | +2 | Full (12/13 already) |
| shot-type | 9 | 15 | +6 | None (0/9 include veo3) |
| style | 15 | 15 | 0 (at minimum) | Full (14/15 already) |
| subject | 13 | 15 | +2 | Full (12/13 already) |
| text-handling | 9 | 15 | +6 | Full (8/9 already) |
| use-case | 12 | 15 | +3 | Full (11/12 already) |
| **TOTAL** | **136** | **180** | **+44** | |

### riskHint Coverage (Current)
| Catalog | Options with riskHint | Total Options | Coverage |
|---------|----------------------|---------------|----------|
| audio | 0 | 13 | 0% |
| camera-movement | 0 | 9 | 0% |
| constraints | 2 | 10 | 20% |
| format | 0 | 5 | 0% |
| lighting | 0 | 14 | 0% |
| motion | 1 | 14 | 7% |
| scene | 2 | 13 | 15% |
| shot-type | 1 | 9 | 11% |
| style | 4 | 15 | 27% |
| subject | 3 | 13 | 23% |
| text-handling | 4 | 9 | 44% |
| use-case | 0 | 12 | 0% |
| **TOTAL** | **17** | **136** | **12.5%** |

### veo3 appliesTo Coverage Gap
Four catalogs currently don't include `"veo3"` in any option's `appliesTo`: shot-type, camera-movement, format, constraints. For new options in these catalogs, veo3 should be considered (Veo 3 is a registered target with its own adapter). [VERIFIED: src/lib/prompt/targets/veo3.target.ts exists and is registered]

### Reference Update Locations for D-01
| File | Option ID Usage | Count | Example (old -> new) |
|------|----------------|-------|----------------------|
| `options/*.options.ts` (12 files) | Option `id` field | 136 | `"gym_opening"` -> `"use_case:gym_opening"` |
| `components/prompt-guide.tsx` | `defaults` object values | 12 single + 3 multi = 15 | `use_case: "gym_opening"` -> `use_case: "use_case:gym_opening"` |
| `targets/seedance.target.ts` | `safetyDefaults` array | 3 | `"no_ip_or_celebrity"` -> `"constraints:no_ip_or_celebrity"` |
| `targets/generic-video.target.ts` | `safetyDefaults` array | 2 | same pattern |
| `targets/veo3.target.ts` | `safetyDefaults` array | 2 | same pattern |
| `validation.test.ts` | `completeSelections` + test fixtures | 14 + ~6 extras | `"food_drink"` -> `"subject:food_drink"` |
| `reducer.test.ts` | `defaults` + test fixtures | 10+ | `"gym_opening"` -> `"use_case:gym_opening"` |

**Important exclusion:** `templateMap` keys in target configs are **question IDs** (e.g., `"use_case"`, `"subject"`), NOT option IDs. These are **NOT affected** by D-01. [VERIFIED: codebase grep of all 3 target files]

**Additional exclusion:** No `suppresses` fields exist on any option yet. [VERIFIED: codebase grep -- zero results]

## Migration Strategy (D-01)

### Recommended Order: IDs First

Execute in this order:
1. Add `validateOptionIdFormat()` to validation.ts (write once, all subsequent tests use it)
2. Update option IDs in all 12 catalog files
3. Update all references: defaults, safetyDefaults, test fixtures
4. Re-run tests to confirm all references resolved

**Rationale:** Namespace prefix format is the source of truth in catalog files. Changing references first would create temporary broken references. Catalog changes propagate deterministically through the system -- all references are simple string values that grep can find.

### validateOptionIdFormat() Specification

```typescript
// Source: to add to src/lib/prompt/validation.ts
export function validateOptionIdFormat(optionSets_?: OptionSet[]): string[] {
  const sets = optionSets_ ?? getAllOptionSets();
  const errors: string[] = [];

  for (const set of sets) {
    const prefix = set.id + ":";
    for (const option of set.options) {
      if (!option.id.startsWith(prefix)) {
        errors.push(
          `Option "${option.id}" in set "${set.id}" must start with prefix "${prefix}"`
        );
      }
      // Also check for empty prefix (bare colon)
      if (option.id.startsWith(":")) {
        errors.push(
          `Option "${option.id}" in set "${set.id}" has empty namespace`
        );
      }
    }
  }

  return errors;
}
```

### Reference Propagation Order (after catalog rename)

After changing an option ID from `"gym_opening"` to `"use_case:gym_opening"`, grep for the old string across the codebase. Each match in a non-catalog file is a reference to update:

1. `defaults` in `prompt-guide.tsx` -- values in the `PromptSelections` object
2. `safetyDefaults` in 3 target files -- string array values
3. `completeSelections` in `validation.test.ts` -- values in the test fixture
4. `defaults` in `reducer.test.ts` -- values in the test fixture
5. Any other explicit option ID strings in test assertions

### What Does NOT Change

- `templateMap` keys (question IDs, not option IDs)
- `optionSet.id` values (already canonical names like `"subject"`, `"motion"`)
- `WorkTypeConfig.question[].optionSetId` values (references to option set IDs, unchanged)
- Any `question.id` values (these are question identifiers, not option identifiers)
- `TargetToolConfig.prefer` and `suppress` arrays (these reference option set IDs, not option IDs)

[VERIFIED: codebase grep confirmed all templateMap keys are dimension question IDs]

## Content Gap Analysis (D-02)

### Expansion Priorities

**Priority 1 (mandatory minimums -- 28 options across 4 catalogs):**

| Catalog | Need | Recommended New Option Domains |
|---------|------|-------------------------------|
| format | +10 | Additional aspect ratios: `4:5`, `3:4`, `21:9`. Additional durations: 30s, 60s, 3s, 5s. Platform-specific: B站横屏, YouTube, Instagram Story 9:16 |
| camera-movement | +6 | Zoom in/out, whip pan, tracking shot (on rails vs. handheld distinction), crane/jib up, rack focus, Steadicam/gimbal float |
| shot-type | +6 | Over-the-shoulder, two-shot, low angle, high angle, insert/detail shot, split-screen |
| text-handling | +6 | Animated text reveal, scrolling credits, chapter markers, watermark/logo placement, text-on-object tracking,双语字幕布局 |

[ASSUMED] These domains are inferred from standard cinematography/video production taxonomy. See Assumptions Log A1.

**Priority 2 (catalogs under 15 -- 16 options across 7 catalogs):**

| Catalog | Need | Recommended New Option Domains |
|---------|------|-------------------------------|
| use-case | +3 | 直播带货片段, 房产/楼盘宣传, 企业年会/庆典 |
| subject | +2 | 化妆品/美妆产品, 儿童/婴幼用品 |
| scene | +2 | 医院/诊所/健康空间, 户外集市/夜市 |
| motion | +1 | Time-lapse / hyperlapse motion |
| lighting | +1 | Harsh midday / direct sunlight |
| audio | +2 | SFX-heavy / 音效设计, 古典管弦乐 |
| constraints | +5 | No rapid cuts, avoid water/caustics, avoid reflections/glass artifacts, background consistency across cuts, limit motion amplitude |

[ASSUMED] Content recommendations based on common video production use cases. See Assumptions Log A2.

### New Option Template

Every new option must follow this exact structure (derived from existing patterns):

```typescript
{
  id: "catalogId:option_id",                  // namespace format per D-01
  version: "0.1.0",                            // all options currently at 0.1.0
  label: { zh: "中文标签（用户可见）", en: "English label" },
  plain: { zh: "普通用户能理解的简单解释", en: "Plain-English explanation" },
  professionalTerms: ["term1", "term2", "term3"],  // 2-4 professional English terms
  promptFragment: {
    zh: "完整的中文prompt片段，包含主体/场景细节",
    en: "Full English prompt fragment with subject/scene detail"
  },
  appliesTo: ["seedance"],  // or ["seedance", "generic_video", "veo3"] depending on scope
  riskHint: { zh: "", en: "" }  // empty or substantive per risk classification
}
```

**Pattern rules extracted from existing 136 options [VERIFIED: codebase analysis]:**
1. `professionalTerms` contains 2-5 English terms in an array
2. `promptFragment.{zh,en}` are complete sentences/paragraphs, not single words
3. `label` is the user-facing short name (UI chip label)
4. `plain` explains what the option means in everyday language
5. `appliesTo` determines which targets show this option

## Risk Classification Framework (D-03)

### Classification Matrix

| Catalog | Risk Level | riskHint Required | Typical Risk Content |
|---------|-----------|-------------------|---------------------|
| constraints | **HIGH** | Substantive (zh+en) | Model-specific limitations, output quality warnings |
| text_handling | **HIGH** | Substantive (zh+en) | Text accuracy warnings, post-production recommendations |
| format | BORDERLINE | Discretion | Platform compatibility caveats, duration constraints |
| shot-type | BORDERLINE | Discretion | Aesthetic risk (extreme angles), composition warnings |
| camera-movement | BORDERLINE | Discretion | Motion artifacts, gimbal limitations |
| subject | BORDERLINE | Discretion | IP/privacy risk for people/vehicles/brands |
| motion | BORDERLINE | Discretion | Motion control precision limitations |
| audio | LOW | Empty string "" or omitted | N/A |
| use-case | LOW | Empty string "" or omitted | N/A |
| scene | LOW | Empty string "" or omitted | N/A |
| style | LOW | Empty string "" or omitted | N/A |
| lighting | LOW | Empty string "" or omitted | N/A |

**Locked per D-03:** "riskHint must be substantive for constraints and text_handling catalogs."
**Locked per D-03:** "May be empty for lighting, style, scene, audio, use-case."

### Existing riskHint Patterns to Follow

For constraints (HIGH risk):
```typescript
// Pattern from constraints.options.ts (existing: readable_text, no_logo_hallucination)
riskHint: {
  zh: "多数视频模型对画面文字仍不稳定，重要文字建议后期添加。",
  en: "Most video models still render text unreliably; add critical text in post-production."
}
```
Pattern: `"{limitation}. {recommendation}"` -- state what might go wrong, suggest mitigation.

For text_handling (HIGH risk):
```typescript
// Pattern from text-handling.options.ts (existing: short_title_only, opening_title_card, price_tag_popup, end_card_cta)
riskHint: {
  zh: "AI 生成文字可能出现错字，重要文案建议后期替换。",
  en: "AI-generated text may contain errors; replace critical copy in post."
}
```
Pattern: Consistent warning that AI-generated text is unreliable.

For borderline catalogs (e.g., subject, shot-type):
```typescript
// Pattern from subject.options.ts
riskHint: {
  zh: "不要指定明星、网红或真实未授权人物。",
  en: "Do not specify celebrities, influencers, or unauthorized real people."
}
```

### Missing riskHint in HIGH-Risk Catalogs

**constraints (8 of 10 missing):**
- `no_ip_or_celebrity` -- needs riskHint (why this constraint matters)
- `stable_identity` -- needs riskHint (model identity drift is common)
- `simple_scene` -- needs riskHint (complex scenes increase failure rate)
- `no_extra_limbs` -- needs riskHint (anatomy artifacts are well-known)
- `single_focal_subject` -- needs riskHint (models often lose focus with multiple subjects)
- `avoid_temporal_flicker` -- needs riskHint (Seedance-specific frame consistency)
- `avoid_quality_keywords` -- needs riskHint (Seedance-specific keyword sensitivity)

**text_handling (5 of 9 missing):**
- `no_text` -- needs riskHint (some models ignore text suppression)
- `placeholder_signage` -- needs riskHint (blurred text may still be partially readable)
- `bottom_subtitle_bar` -- needs riskHint (model may ignore composition instructions)
- `no_text_pure_visual` -- needs riskHint (models may hallucinate text anyway)

[VERIFIED: manual inspection of all 9 text_handling options and 10 constraints options]

## Common Pitfalls

### Pitfall 1: Reference Breakage During Migration
**What goes wrong:** Changing an option ID in a catalog file but forgetting to update one of the 7 reference locations. Tests fail with mysterious "option not found" errors because `safetyDefaults` or `defaults` point to old IDs.
**Why it happens:** References are spread across 7 files in 3 different directories. Visual scan misses some.
**How to avoid:** After migrating each catalog, grep for the old ID strings across the entire `src/` directory. Any remaining matches are missed references. Run `npm test` after each catalog migration batch.
**Warning signs:** `validateSafetyDefaultsIntegrity` CI failing. `getOptionById` returning undefined for known options.

### Pitfall 2: Namespace Mismatch
**What goes wrong:** Setting option ID prefix to `"use_case"` but the catalog's `set.id` is actually `"use_case"` (underscore, not hyphen). The `validateOptionIdFormat()` check catches this, but the human planning step should get it right.
**Why it happens:** Some catalogs use underscores (shot_type, camera_movement, text_handling, use_case), others don't (subject, scene, motion, lighting, style, audio, format, constraints). Pattern is consistent but not uniform.
**How to avoid:** Always use `set.id + ":"` as the prefix. Copy directly from the catalog's `id` field -- never from memory.

### Pitfall 3: Missing veo3 in appliesTo
**What goes wrong:** New options default to `appliesTo: ["seedance", "generic_video"]` (pattern from older catalogs) but forget Veo 3. Veo 3 users can't see relevant new options.
**Why it happens:** 4 catalogs currently don't include veo3 at all. Expansion defaults may copy existing patterns without checking the Veo 3 target.
**How to avoid:** For each new option, ask: "Would a Veo 3 user benefit from this?" If yes, include `"veo3"` in appliesTo.

### Pitfall 4: Empty riskHint for HIGH-Risk Catalogs
**What goes wrong:** New constraints or text_handling options get `riskHint: { zh: "", en: "" }` (empty string) despite D-03 requiring substantive riskHint for these catalogs.
**Why it happens:** Template copying from LOW-risk catalogs where empty is permitted.
**How to avoid:** Enforce per-catalog checks during review. constraints and text_handling options must have non-empty riskHint.

## Code Examples

### New Option: Format Catalog (representative)
```typescript
// Pattern for format options using namespace prefix
{
  id: "format:vertical_30s",
  version: "0.1.0",
  label: { zh: "9:16 竖屏 30 秒", en: "9:16 vertical, 30s" },
  plain: { zh: "适合需要详细讲解的短视频内容", en: "Good for detailed short-form content needing explanation" },
  professionalTerms: ["9:16 vertical", "30-second cut", "short-form narrative"],
  promptFragment: {
    zh: "9:16 竖屏，约 30 秒，适合中等长度的短视频叙事",
    en: "9:16 vertical, around 30 seconds, suitable for mid-length short-form narratives"
  },
  appliesTo: ["seedance", "generic_video", "veo3"],
  riskHint: { zh: "", en: "" }  // format is BORDERLINE, Claude's discretion
}
```

### New Option: Constraints Catalog (HIGH risk)
```typescript
{
  id: "constraints:avoid_water_reflections",
  version: "0.1.0",
  label: { zh: "避免水面反射失常", en: "Avoid water reflection artifacts" },
  plain: { zh: "水面、玻璃等反射面容易产生错误的反射内容", en: "Reflective surfaces like water and glass often produce incorrect reflections" },
  professionalTerms: ["specular artifact avoidance", "reflection stability", "surface consistency"],
  promptFragment: {
    zh: "避免水面、玻璃等反射面产生不符合场景的错误反射和内容",
    en: "avoid incorrect reflections and hallucinated content on water, glass, and other specular surfaces"
  },
  appliesTo: ["seedance", "generic_video", "veo3"],
  riskHint: {  // SUBSTANTIVE required per D-03
    zh: "视频模型对反射和透明表面的处理仍不稳定，水面和玻璃内容可能出现高差错。若场景必须包含这些元素，建议减少镜头停留时间。",
    en: "Video models still struggle with reflections and transparent surfaces; water and glass content may have high error rates. If these elements are essential, minimize camera dwell time."
  }
}
```

### validateOptionIdFormat() Test
```typescript
// Source: to add to validation.test.ts
it("requires option IDs to use namespace prefix format (D-01)", () => {
  const good: OptionSet = {
    id: "test_ns",
    version: "0.1.0",
    label: { zh: "测试", en: "Test" },
    options: [{
      id: "test_ns:opt_a",
      version: "0.1.0",
      label: { zh: "A", en: "A" },
      plain: { zh: "", en: "" },
      professionalTerms: [],
      promptFragment: { zh: "", en: "" },
      appliesTo: ["seedance"]
    }]
  };
  const bad: OptionSet = {
    id: "bad_ns",
    version: "0.1.0",
    label: { zh: "坏", en: "Bad" },
    options: [{
      id: "orphan_id",   // no namespace prefix
      version: "0.1.0",
      label: { zh: "X", en: "X" },
      plain: { zh: "", en: "" },
      professionalTerms: [],
      promptFragment: { zh: "", en: "" },
      appliesTo: ["seedance"]
    }]
  };
  expect(validateOptionIdFormat([good])).toEqual([]);
  const errors = validateOptionIdFormat([bad]);
  expect(errors.length).toBeGreaterThanOrEqual(1);
  expect(errors[0]).toContain("orphan_id");
});
```

## Recommended Plan Structure

Based on the research findings, the planner should create the following plan files:

### Plan 04-01: Namespace Prefix Migration (D-01)
- Add `validateOptionIdFormat()` to validation.ts + test
- Rename all 136 option IDs in 12 catalog files (batch by catalog)
- Update `defaults` in prompt-guide.tsx (15 value changes)
- Update `safetyDefaults` in 3 target files (7 value changes)
- Update test fixtures in validation.test.ts and reducer.test.ts (30+ value changes)
- Verify: all tests pass, validateOptionIdFormat() returns empty

### Plan 04-02: Catalog Expansion (D-02)
- Expand format: 5 -> 15 (+10 new options)
- Expand shot-type: 9 -> 15 (+6 new options)
- Expand camera-movement: 9 -> 15 (+6 new options)
- Expand text-handling: 9 -> 15 (+6 new options)
- Expand constraints: 10 -> 15 (+5 new options)
- Expand remaining catalogs to 15+: use-case (+3), subject (+2), scene (+2), motion (+1), lighting (+1), audio (+2)
- Include veo3 in appliesTo where appropriate
- Verify: validateOptionIdsUnique() returns empty, all new IDs use namespace format

### Plan 04-03: riskHint Completion (D-03)
- Add substantive riskHint to all constraints options (current + new)
- Add substantive riskHint to all text_handling options (current + new)
- Add riskHint to borderline catalogs per planner discretion
- Set empty riskHint for LOW-risk catalogs
- Verify: every option has riskHint field (empty or substantive)

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Vitest 3.0.4 |
| Config file | vite.config.ts (project root) |
| Quick run command | `npx vitest run src/lib/prompt/validation.test.ts` |
| Full suite command | `npx vitest run` |

### Phase Requirements -> Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| OPT-01 | 180+ options, each catalog >= 15 | unit | `npx vitest run src/lib/prompt/validation.test.ts -t "unique"` | ✅ existing test |
| OPT-02 | Each option has complete metadata | unit | `npx vitest run` (TypeScript compiler enforces shape) | ✅ type-checked at build |
| OPT-05 | Namespace prefix format on all IDs | unit | `npx vitest run src/lib/prompt/validation.test.ts -t "namespace"` | ❌ Wave 0 -- need new test |
| OPT-05 | No broken references after migration | unit | `npx vitest run` (all existing tests) | ✅ existing tests will catch broken refs |
| OPT-03 | Camera split independent registration | unit | Already verified | ✅ done |

### Sampling Rate
- **Per task commit:** `npx vitest run src/lib/prompt/validation.test.ts` (validates uniqueness, format, integrity)
- **Per wave merge:** `npx vitest run` (full suite)
- **Phase gate:** Full suite green, `npm run typecheck` clean, `npm run build` succeeds

### Wave 0 Gaps
- [ ] Add test for `validateOptionIdFormat()` in validation.test.ts
- [ ] Update validateOptionIdsUnique() test to verify 180+ unique IDs (current test uses 136)
- [ ] Add test verifying all options have riskHint field (TypeScript compiler enforces type, but a runtime check could verify all 180+ have the field populated)

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | TypeScript compilation, tests | Yes | v24.14.0 | -- |
| npm | Package installation | Yes | 11.9.0 | -- |
| TypeScript | Static type checking on option shapes | Yes | 5.7.3 | -- |
| Vitest | Test runner | Yes | 3.0.4 | -- |

**Missing dependencies with no fallback:** None -- all required tooling is installed.

## Security Domain

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V2 Authentication | No | N/A -- no auth in this project |
| V3 Session Management | No | N/A -- no sessions |
| V4 Access Control | No | N/A -- no access control |
| V5 Input Validation | Yes | TypeScript `satisfies` + registry validation at import time |
| V6 Cryptography | No | N/A |

### Known Threat Patterns for Option Catalog Data

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| Option ID collision across catalogs | Denial of Service | `validateOptionIdsUnique()` CI check (exists) |
| Broken safetyDefaults references | Information Disclosure | `validateSafetyDefaultsIntegrity()` CI check (exists) |
| Malformed option IDs (no prefix) | Tampering | `validateOptionIdFormat()` to be added in this phase |
| Untranslated zh/en pairs | Spoofing | TypeScript compiler enforces `LocalizedText` type -- all fields required |

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | New option domain recommendations (cinematography terms for camera-movement, use-case niches) are based on standard video production taxonomy, not on user research or Seedance/Veo 3 documentation | Content Gap Analysis | Options may not match actual user needs or model capabilities. Low risk -- options are config data that can be refined later. |
| A2 | The total expansion target of 180+ is achievable by adding 44 options as listed. Some catalogs may need more than the minimum to feel "complete" -- particularly format (aspect ratio x duration matrix is large) and constraints (model limitations list is long) | Content Gap Analysis | 180 is a minimum; going over is harmless. The real risk is going under, which D-02 prohibits. |
| A3 | templateMap keys in target configs are question IDs, not option IDs, so they do NOT need D-01 migration | Migration Strategy | If any templateMap key accidentally references an option ID, it would break after migration. Verified by grepping all 3 target files -- all keys match question dimension IDs. LOW risk. |

## Open Questions (RESOLVED)

1. **Should existing options with riskHint in LOW-risk catalogs be emptied or kept?**
   - What we know: scene has 2 riskHint, style has 4, shot-type has 1, motion has 1 -- all in catalogs D-03 says "may be empty."
   - What's unclear: Does "may be empty" mean "should be emptied" or "may be empty if no risk is present"?
   - Recommendation: Keep existing riskHint on options where the warning is genuinely useful (e.g., scene/beach_poolside warns about bystander privacy -- that's real). Remove riskHint only if the warning is vague or unnecessary. Planners should flag each existing borderline riskHint for review.

2. **Should veo3 be added to appliesTo for the 4 catalogs that currently exclude it?**
   - What we know: shot-type, camera-movement, format, and constraints have 0 veo3 coverage. Veo 3 is a registered, tested target with a full adapter.
   - What's unclear: Is this exclusion intentional (Veo 3's cinematographic style doesn't use these dimensions the same way) or an oversight?
   - Recommendation: Add veo3 to new options in these catalogs. For existing options, review case-by-case. Format and constraints seem universally applicable; shot-type and camera-movement may need veo3-specific prompt fragment wording given Veo 3's distinct rendering style.

3. **How many options beyond 180 is "enough"?**
   - What we know: D-02 says "180+", minimum 15 per catalog. Weak spots get ~30 additions, under-15 catalogs get ~16, that's exactly 180.
   - What's unclear: Is 180 the ceiling or the floor? Some catalogs (format) have natural matrix expansion (aspect ratio x duration).
   - Recommendation: Target 180-190. Avoid unbounded expansion -- each new option needs zh/en pairs for 6 fields plus professionalTerms. Content quality degrades with volume.

## Sources

### Primary (HIGH confidence)
- `src/lib/prompt/options/*.options.ts` -- All 12 catalog files read in full. 136 existing options verified by count. riskHint coverage manually audited per option. [VERIFIED: codebase]
- `src/lib/prompt/types.ts` -- OptionItem, TargetToolConfig, OptionSet type definitions. [VERIFIED: codebase]
- `src/lib/prompt/validation.ts` -- Existing validation functions: validateOptionIdsUnique, validateSafetyDefaultsIntegrity, validateOptionTargetRefs. [VERIFIED: codebase]
- `src/lib/prompt/targets/*.target.ts` -- All 3 target configs read. safetyDefaults and templateMap content verified. [VERIFIED: codebase]
- `src/components/prompt-guide.tsx` -- defaults object values verified. [VERIFIED: codebase]
- `src/lib/prompt/validation.test.ts` -- completeSelections fixture and test patterns verified. [VERIFIED: codebase]
- `src/lib/prompt/reducer.test.ts` -- Option ID references in test cases verified. [VERIFIED: codebase]
- `src/lib/prompt/registry.test.ts` -- Registration test fixtures verified. [VERIFIED: codebase]
- `src/lib/prompt/options/index.ts` -- Barrel file pattern and registration flow verified. [VERIFIED: codebase]
- `.planning/phases/04-catalog-expansion/04-CONTEXT.md` -- Locked decisions D-01, D-02, D-03. [VERIFIED: phase context]
- `.planning/config.json` -- workflow.nyquist_validation enabled. [VERIFIED: config]
- `package.json` -- Dependency versions verified. [VERIFIED: package.json]

### Secondary (MEDIUM confidence)
- `.planning/phases/01-safety-foundation/01-CONTEXT.md` -- safetyDefaults injection pattern. [CITED: phase archives]
- `.planning/phases/02-registry-architecture/02-CONTEXT.md` -- Registry validation patterns. [CITED: phase archives]
- `.planning/phases/03-metadata-execution/03-CONTEXT.md` -- templateMap, suppress/warn patterns. [CITED: phase archives]

### Tertiary (LOW confidence)
- None. All claims are codebase-verified or tagged as ASSUMED.

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- no new dependencies, verified against package.json
- Architecture: HIGH -- all patterns verified by reading actual source files
- Migration strategy: HIGH -- reference locations verified by grep audit, exclusion list verified
- Content gap analysis: MEDIUM -- counts are verified (codebase grep), recommended domains are ASSUMED
- riskHint classification: HIGH -- locked by D-03 decision, existing patterns verified
- Pitfalls: HIGH -- based on systematic analysis of reference locations and migration scope
- Test infrastructure: HIGH -- vitest config and test files verified

**Research date:** 2026-05-12
**Valid until:** 2026-06-12 (stable data -- option catalogs don't change from external factors)
