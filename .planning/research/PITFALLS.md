# Domain Pitfalls

**Domain:** Controllable video prompt guide wizard for non-expert users
**Researched:** 2026-05-10
**Overall confidence:** MEDIUM (some areas backed by official sources, others by community pattern analysis)

---

## Critical Pitfalls

Mistakes that cause rewrites, user abandonment, or legal exposure.

### Pitfall 1: Safety Defaults Defined But Never Enforced

**What goes wrong:** The codebase defines `safetyDefaults` on both targets (`seedance.target.ts` line 17: `["no_ip_or_celebrity", "stable_identity", "readable_text"]`; `generic-video.target.ts` line 17: `["no_ip_or_celebrity", "stable_identity"]`), but these are never injected into selections or enforced in the renderer. A non-expert user generating a "coffee shop promo with a celebrity cameo" prompt would get no warning that this is legally risky.

**Why it happens:** The `TargetToolConfig.safetyDefaults` field was designed into the type system but the runtime code (renderer, UI, brief builder) has no awareness of it. It is dead metadata.

**Consequences:**
- Users can generate prompts that, when fed into Seedance 2.0, produce output violating IP laws
- In May 2026, ByteDance faced a **Disney legal threat** over Seedance 2.0 generating content with copyrighted characters (Variety). This is not theoretical.
- Seedance 2.0 has active content filters that flag/block outputs containing recognizable faces, IP, or celebrity likenesses. A non-expert user who copies a prompt into Seedance and gets blocked has no idea why.

**Prevention:** Inject `safetyDefaults` as pre-selected constraint options when a target is chosen. Allow users to explicitly deselect them, but force a confirmation. Include safety default text in every rendered prompt.

**Detection:** Verify that every rendered Seedance prompt includes the constraint phrases from `safetyDefaults` unless the user explicitly opted out. The existing test gap at CONCERNS.md:149-152 confirms this is untested.

**Phase to address:** Phase 1 (immediate -- this is a legal risk, not a feature).

**Confidence:** HIGH. Confirmed by existing codebase analysis (CONCERNS.md:56-59), the Variety article about ByteDance/Disney, and multiple community guides about Seedance content restrictions.

---

### Pitfall 2: Target Switching Is Cosmetic -- Metadata Is Ignored

**What goes wrong:** When a user switches from Seedance to Generic Video, the UI keeps all selections. The renderer produces a different template format, but `appliesTo` filtering, `prefer` reordering, `suppress` hiding, and `safetyDefaults` injection are all dead code. The user sees no behavioral difference beyond the output template changing, yet some options may be incompatible with the new target.

**Why it happens:** The type system (CONCERNS.md:52-57) defines five metadata fields (`appliesTo`, `prefer`, `suppress`, `safetyDefaults`, `preferred`), but none are wired into the UI component or renderer.

**Consequences:**
- Options that don't apply to a target appear anyway (e.g., Seedance-specific text_handling options shown for generic)
- User selects options for target A, switches to target B, and gets a confusing output
- `text_handling` selections are silently dropped from generic video output (CONCERNS.md:46-49)
- User trust erodes: "Why did my choices disappear?"

**Prevention:** Implement runtime enforcement of all five metadata fields before adding new targets. Filter options by `appliesTo` in the UI. Inject `safetyDefaults` into selections. Use `prefer` to highlight recommended dimensions. Use `suppress` to hide inapplicable questions with a visible warning.

**Detection:** When user switches target, options should change visibility. The existing test gap at CONCERNS.md:140-145 confirms no test for this.

**Phase to address:** Phase 1 or early Phase 2. This is the architectural foundation for all target expansion. Adding Sora, Runway, or Kling without fixing this means every new target requires hacking the renderer directly.

**Confidence:** HIGH. Confirmed by CONCERNS.md analysis and direct code inspection.

---

### Pitfall 3: Choice Overload -- 12 Dimensions Without Guidance

**What goes wrong:** The wizard presents 12 independent question dimensions (use_case, subject, scene, motion, camera, lighting, style, audio, format, text_handling, constraints, and more). A non-expert user sees a form with potentially 50+ visible options. Choice overload research (Hick's Law, NNGroup) shows that beyond 7 +/- 2 choices, decision paralysis sets in and satisfaction drops.

**Why it happens:** Every dimension is presented as a flat list of choices with equal visual weight. There is no progressive disclosure, no "quick start" path, no dimension prioritization, and no indication of which choices matter most for quality.

**Consequences:**
- Users abandon mid-wizard (too many decisions)
- Users randomly select options to "get through it" (garbage prompts)
- Users skip important dimensions they don't understand (missing critical prompt components)
- "Analysis paralysis" -- user spends 10 minutes choosing options and still feels unsure

**Prevention:**
- **Progressive disclosure**: Show 3-4 essential dimensions first (use case, subject, style), with "Advanced" toggle for the rest
- **Smart defaults**: Auto-select common safe choices, let users change them
- **Visual prioritization**: Mark dimensions as "Recommended" vs "Optional" based on target's `prefer` config
- **Preview feedback**: Show a live preview of the prompt as it builds, so users see the impact of choices

**Detection:** User testing metrics: time-to-completion, abandonment rate, fraction of dimensions left at default.

**Phase to address:** Phase 1 (UX foundation). The "Advanced Options" collapse already exists (TEST-14 in PROJECT.md), but needs to be the default, not an afterthought.

**Confidence:** MEDIUM. Based on well-established UX principles (NNGroup, Hick's Law) applied to this specific domain. No direct user testing data available yet.

---

### Pitfall 4: False Confidence -- User Thinks Good Choices Produce Good Prompts

**What goes wrong:** The wizard lets users assemble options independently. A user could select "cinematic realism" for style AND "anime aesthetic" for another dimension -- the options are individually valid but contradict when combined. The wizard says "Done! Here's your prompt!" with no quality assessment. The user copies it into Seedance, gets garbage output, and blames either the tool or themselves.

**Why it happens:** Options are validated for structural correctness (ID uniqueness, field presence) but never validated for **semantic compatibility**. The system has no awareness that certain option combinations produce poor or contradictory prompts.

**Consequences:**
- User blames the tool ("this wizard is useless")
- User blames themselves ("I'm bad at this") and abandons the product category entirely
- Word-of-mouth: "Just type your own prompt, those wizards don't work"

**Prevention:**
- **Conflict rules in option metadata**: Option pairs that conflict should declare `conflictsWith: ["option_id"]`
- **Warning system**: When conflicting options are selected, show an amber warning: "These two choices may produce inconsistent results"
- **Quality tier indicators**: Simple heuristic scoring (e.g., "Your prompt covers 7/10 recommended dimensions" -- "Good coverage")
- **Example outputs**: Show what a prompt from similar selections has produced (even if static/mock examples)

**Detection:** User feedback interviews, A/B testing completion-to-usage ratio (how many users actually copy and use the prompt).

**Phase to address:** Phase 2 (quality layer). Requires the option metadata system to support `conflictsWith`.

**Confidence:** MEDIUM. Pattern observed in multiple wizard-style tools. The specific conflict between "cinematic realism" and "anime" is hypothetical but representative.

---

## Moderate Pitfalls

### Pitfall 5: Magic Question ID Strings in Renderers

**What goes wrong:** `video-renderer.ts` uses string literals like `"use_case"`, `"subject"`, `"scene"`, `"camera"` to extract brief text. If a question ID is renamed in the work type definition (e.g., `"text_handling"` becomes `"onscreen_text"`), the renderer silently returns empty strings. No compile-time or runtime check catches the mismatch.

**Why it happens:** The question IDs in the work type definition and the renderer are not connected through any shared constant or registry. The renderer "hopes" the IDs match.

**Consequences:** Silent data loss -- user selects text_handling options, prompt output has no text handling guidance, user never knows.

**Prevention:** Extract question ID references into a shared constants/enum file. Add a build-time validation step that checks every question ID referenced in a renderer exists in the work type.

**Detection:** CONCERNS.md:37-41 documents this. The existing test at validation.test.ts does not check renderer question ID coverage.

**Phase to address:** Phase 2 (architecture hardening).

**Confidence:** HIGH. Confirmed by direct code inspection.

---

### Pitfall 6: Option ID Collisions Without Namespacing

**What goes wrong:** All option IDs are flat strings (e.g., `"gym_opening"`, `"bright_commercial_interior"`) defined across 12 separate option files. If two option sets coincidentally define the same ID, one silently overwrites the other. The current duplicate detection in `validation.ts` only checks within a provided array, not across the full catalog.

**Why it happens:** Options are authored independently in separate files with no namespace prefix (e.g., no `use_case:gym_opening` convention).

**Consequences:**
- As the option catalog grows (OPT-01 in PROJECT.md targets expansion), collision probability increases
- A collision silently causes one option's data to be lost
- Debugging: the option shows in the list but its `promptFragment` comes from a different option

**Prevention:**
- Adopt scoped IDs: `{optionSetId}:{optionId}` or at minimum enforce a naming convention
- Make `getOptionById` throw (not silently return first match) on duplicates at registration time
- Add a build-time validation that cross-checks all option IDs across all sets

**Detection:** CONCERNS.md:69-73 documents this. The `getOptionById` function (options/index.ts line 39) uses `.find()` which returns the first match.

**Phase to address:** Phase 2 (architecture hardening), before significant option catalog expansion (OPT-01).

**Confidence:** HIGH. Confirmed by CONCERNS.md.

---

### Pitfall 7: Schema Versioning Is Defined But Unused

**What goes wrong:** Every option file declares `version: "0.1.0"` and every `OptionItem` has `version: "0.1.0"`. But there is no migration system, no compatibility checking, and no version-aware loading. If the option schema changes (e.g., a new required field is added), old option files silently break.

**Why it happens:** Version was added to the type as a future-proofing measure, but no runtime code checks or enforces it.

**Consequences:**
- Future schema changes (e.g., adding `conflictsWith` field to OptionItem) will require manual updating of every option in every file
- No way to have two versions of an option coexist for backward compatibility
- When option files are loaded from external sources or contributed by users in a future release, version mismatches go undetected

**Prevention:**
- Define a `CURRENT_SCHEMA_VERSION` constant
- At load time, validate that all option files match the expected schema version
- For major version changes, implement a migration function that transforms old-format options to new format
- Consider adopting something simple like a versioned type union: `OptionItemV1 | OptionItemV2`

**Detection:** Try changing the OptionItem type (add a new required field) and see how many files break without warning.

**Phase to address:** Phase 2-3 (before external option contributions or plugin system).

**Confidence:** MEDIUM. Pattern observed in many config-driven systems. The current small scale makes this low-risk today but high-risk as the catalog grows.

---

### Pitfall 8: Seedance Content Filter -- User-Generated Prompts Get Flagged

**What goes wrong:** Seedance 2.0 has aggressive content filters that block outputs containing recognizable faces, copyrighted characters, NSFW content, and even some edge cases. A non-expert user who selects "realistic human portrait" or "office scene with people" may get their generation blocked with a cryptic error. They blame the wizard tool.

**Why it happens:** Seedance 2.0 (ByteDance) applies content moderation at generation time, not prompt time. The prompt can pass the input stage but produce output that triggers the face detection or IP filter, resulting in a blocked generation.

**Consequences:**
- User perception: "The wizard gave me a bad prompt"
- Support burden: explaining that the issue is with Seedance, not the wizard
- Churn: user tries once, gets blocked, never returns

**Prevention:**
- Include a `riskHint` field on options that are likely to trigger content filters (already partially done -- `constraints.options.ts` has `riskHint` on `readable_text` and `no_logo_hallucination`)
- Surface risk hints in the UI as inline warnings, not buried in data
- Add a "Seedance Content Policy" note explaining what kinds of prompts may get flagged
- For options involving realistic humans or recognizable elements, add pre-selected safety constraints

**Detection:** Test generated prompts by actually submitting them to Seedance 2.0 (manual testing, not in CI).

**Phase to address:** Phase 2 (quality layer). Expand `riskHint` usage from 2 options to all applicable options.

**Confidence:** HIGH. Multiple community guides document Seedance content restrictions (mindstudio.ai, newly.app, vicsee.com, apidog.com, blog.segmind.com). The Variety article about the Disney legal threat confirms ByteDance is under pressure to enforce these aggressively.

---

### Pitfall 9: TargetToolId Hardcoded Union Type Blocks Extension

**What goes wrong:** `TargetToolId` is defined as a union type `"seedance" | "generic_video"` in `types.ts` line 2. Every option file hardcodes `appliesTo: ["seedance", "generic_video"]`. The adapter uses `if/else` branching. Adding a new target (Sora, Runway, Kling, Canva) requires touching 15+ files.

**Why it happens:** The architecture was built for two known targets. Extensibility was deferred.

**Consequences:**
- Each new target is a high-friction, error-prone change
- The union type is a compile-time constraint with no runtime extensibility
- The `if/else` fallback to generic_video silently masks unrecognized target IDs

**Prevention:**
- Replace `TargetToolId` union with an open string type validated by a runtime registry
- Implement `Map<TargetToolId, TargetAdapter>` for renderer dispatch
- Move `appliesTo` validation to config-time checks against the registry

**Detection:** CONCERNS.md:6-12 documents this. ARCH-01 through ARCH-04 in PROJECT.md already target this.

**Phase to address:** Phase 2 (architecture hardening). This is the largest single refactor needed before adding new targets.

**Confidence:** HIGH. Confirmed by CONCERNS.md and PROJECT.md active requirements.

---

### Pitfall 10: i18n Prompt Fragment Quality Divergence

**What goes wrong:** Every option has `promptFragment.zh` and `promptFragment.en`. These are manually authored strings. Over time, as options are added and updated, the Chinese and English fragments diverge in detail, nuance, and completeness. A Chinese user gets a rich, detailed prompt while an English user gets a terse, lossy translation -- or vice versa.

**Why it happens:**
- No automated parity check between `zh` and `en` fragments
- Option authors may be stronger in one language than the other
- Chinese video models (Seedance, Jimeng/Dreamina) are trained predominantly on Chinese-language training data and may produce better results with Chinese prompts. English models (Sora, Runway) work better with English. The "best" language varies by target.
- Cultural visual preferences differ: what "高级感" (premium feel) means visually in Chinese aesthetic culture differs from "luxury" in Western visual culture

**Consequences:**
- Switching output language produces qualitatively different prompts, not just translated ones
- Users who read both languages notice inconsistencies and lose trust
- When a future target (e.g., Kling) works better with Chinese prompts, English-only users get worse results

**Prevention:**
- Add validation: if `promptFragment.zh` exists, `promptFragment.en` must also exist and be non-empty
- Establish a review process for option contributions: native speaker reviews both languages
- Consider adding field-level parity testing: compare string lengths, token counts, structural similarity
- For each target, document which language produces better results and default accordingly

**Detection:** Automated test: for each option, assert both `zh` and `en` fragments have content and their lengths are within a reasonable ratio (e.g., 0.5x to 2x).

**Phase to address:** Phase 2-3 (during option catalog expansion OPT-01).

**Confidence:** LOW (WebSearch yielded limited results on Chinese vs English video prompt quality -- this is inferred from general i18n patterns and the known training data biases of Chinese video models).

---

## Minor Pitfalls

### Pitfall 11: Testing Structure, Not Quality

**What goes wrong:** The existing tests (validation.test.ts) verify ID uniqueness, option structure, and output format (e.g., "output contains 生成一段"). They do NOT verify that a specific selected option causes its `promptFragment` to appear in the final output. A bug that silently drops `text_handling` from the generic renderer went undetected.

**Why it happens:** It is easy to test structural properties (types, uniqueness, format) and hard to test semantic quality. But the hard part is what matters to users.

**Consequences:** CONCERNS.md:119-122 documents that no test asserts option content appears in output. The `text_handling` gap (CONCERNS.md:46-49) is proof that format-only testing misses real bugs.

**Prevention:**
- Add content-level assertions: selecting option X causes X's `promptFragment` to appear in the rendered output
- Test end-to-end: select a set of options, render, assert all fragments present
- Create "golden" test fixtures: known good option sets + expected output strings

**Detection:** Review test coverage for renderer functions -- do any tests assert on specific option fragment content?

**Phase to address:** Phase 2 (testing infrastructure).

**Confidence:** HIGH. Confirmed by CONCERNS.md.

---

### Pitfall 12: No Real-World Scenario Testing

**What goes wrong:** The wizard is tested with abstract option selections, not with real-world user goals. A user who wants "coffee shop promo video" selects options differently than a developer testing "one of each option." The test cases don't reflect actual usage patterns.

**Why it happens:** Test scenarios are derived from the data model, not from user research.

**Consequences:**
- Bugs in common usage paths go undetected
- Edge cases dominate testing while happy paths break
- When a real user says "I want a gym opening promo," no test validates the full flow for that scenario

**Prevention:**
- Define 3-5 "persona scenarios": gym opening promo, coffee shop new product launch, travel destination highlight, real estate walkthrough, product unboxing
- For each scenario, define the expected option selections and expected prompt output
- Add these as integration tests
- Run these manually against actual Seedance 2.0 generation to validate prompt quality

**Detection:** Count test cases that use realistic option combinations vs. testing one dimension at a time.

**Phase to address:** Phase 2-3 (testing infrastructure and quality validation).

**Confidence:** MEDIUM. Based on software testing best practices applied to this domain.

---

### Pitfall 13: Jargon Leakage -- Professional Terms Visible to Users

**What goes wrong:** Every option has a `professionalTerms` field (e.g., `["copyright safety", "likeness safety", "IP-safe"]`) separate from `label` (user-facing) and `plain` (plain language explanation). If the UI ever falls back to showing `professionalTerms` or if option authors put jargon in `label` instead of `plain`, non-expert users encounter terminology they don't understand.

**Why it happens:** The schema is designed correctly (separate fields for different audiences), but there is no enforcement that `label` and `plain` are jargon-free. An option author might write `label.zh: "景深控制"` instead of `"背景虚化程度"`.

**Prevention:**
- Add a lint rule: each option's `label` must not contain any term from its own `professionalTerms` list
- Review all existing labels against a jargon checklist
- Use the `plain` description as the primary UI text, with `label` as a short title

**Detection:** For each option, verify `professionalTerms` does not appear in `label` in either language.

**Phase to address:** Phase 2 (option quality review, during OPT-01 catalog expansion).

**Confidence:** MEDIUM. Based on UX writing best practices and the project's explicit goal of serving non-experts.

---

### Pitfall 14: O(n) Option Lookups Scaling Issue

**What goes wrong:** `getOptionById` in `options/index.ts` does `optionSets.flatMap(...).find(...)` -- a linear scan through all options every call. `buildPromptBrief` calls this for each selected option per question. Current scale (100+ items) is fine, but after catalog expansion (OPT-01 targets significant growth), this becomes a measurable bottleneck.

**Why it happens:** An `optionSetById` Map already exists, showing the pattern is understood, but `getOptionById` was never optimized.

**Consequences:** Degraded performance at scale, especially on lower-powered mobile devices.

**Prevention:** Replace with `Map<string, OptionItem>` built at module init time. CONCERNS.md:90-95 documents this.

**Phase to address:** Phase 2 (performance hardening).

**Confidence:** HIGH. Confirmed by CONCERNS.md.

---

## Phase-Specific Warnings

| Phase Topic | Likely Pitfall | Mitigation |
|-------------|---------------|------------|
| Safety defaults enforcement | Pitfall 1: safetyDefaults never injected into prompt | Wire up TargetToolConfig.safetyDefaults in renderer before anything else |
| Target switching UX | Pitfall 2: appliesTo/prefer/suppress dead metadata | Implement option filtering by appliesTo in UI component first |
| Wizard UX redesign | Pitfall 3: 12 dimensions cause choice overload | Progressive disclosure + smart defaults per target |
| Option catalog expansion (OPT-01) | Pitfall 6: ID collisions as catalog grows | Namespace option IDs before adding 100+ new options |
| Adding new targets (Sora, Runway, etc.) | Pitfall 9: hardcoded union requires touching 15+ files | Complete ARCH-01 through ARCH-04 refactor first |
| Adding new option files | Pitfall 7: schema versioning unused, migration impossible | Implement schema version check before adding 10+ new option files |
| I18n expansion | Pitfall 10: prompt fragment quality diverges between languages | Add bilingual parity tests before accepting new options |
| Renderer expansion | Pitfall 5: magic question ID strings | Extract constants before adding new renderers |
| Quality assurance | Pitfall 11: testing format not content | Add content-level assertions to test suite |
| Real-world validation | Pitfall 12: no scenario testing | Define persona scenarios and test them manually against Seedance |
| Content safety | Pitfall 8: Seedance content filters block generated output | Expand riskHint usage, document content policy |

---

## Sources

**Codebase analysis (HIGH confidence):**
- `.planning/codebase/CONCERNS.md` -- Comprehensive audit of 11 concern areas, analyzed 2026-05-10
- `src/lib/prompt/options/constraints.options.ts` -- Safety constraint definitions with riskHint fields
- `src/lib/prompt/types.ts` -- Type definitions showing dead metadata fields
- `src/lib/prompt/renderers/video-renderer.ts` -- Renderer with magic question ID strings
- `src/lib/prompt/adapters.ts` -- Hardcoded if/else adapter routing

**Seedance 2.0 safety and content restrictions (HIGH confidence):**
- [What Is the Seedance 2.0 Content Restriction Problem?](https://www.mindstudio.ai/blog/seedance-2-0-content-restrictions-workarounds)
- [Seedance 2.0 Content Restrictions: Face and IP Filter Workarounds](https://newly.app/articles/seedance-2-0-content-restrictions-workarounds)
- [Seedance 2.0 Content Restrictions, NSFW Policy & Face Detected Errors](https://vicsee.com/blog/seedance-content-filter)
- [How to Write Seedance 2 Prompts That Won't Get Flagged](https://apidog.com/blog/seedance-2-prompts-avoid-content-flags/)
- [Why your Seedance 2.0 prompts keep getting flagged](https://morphic.com/resources/how-to/seedance-2-prompts-flagged-how-to-fix)
- [Seedance 2.0 Error Guide: Every Error Explained with Fixes](https://blog.segmind.com/seedance-2-0-error-guide-every-error-explained-with-fixes/)
- [ByteDance Vows Safeguards for Seedance 2.0 After Disney Legal Threat](https://variety.com/2026/global/global/bytedance-safeguards-seedance-disney-legal-threat-ip-violations-1236664395/) (Variety, 2026)

**AI video prompt engineering mistakes (MEDIUM confidence -- community guides):**
- [AI Video Generation: When Prompt Engineering Goes Wrong](https://reelmind.ai/blog/ai-video-generation-when-prompt-engineering-goes-wrong)
- [Why AI Video Prompts Fail: Seven Patterns Behind Unstable Outputs](https://video2prompt.org/blog/why-ai-video-prompts-fail)
- [Seedance 2.0 Complete Guide: Prompt Skills & Pitfall Checklist](https://seedance22.com/en/guide/seedance-2-0-complete-guide-prompts-pitfalls/)

**UX and choice overload (MEDIUM confidence -- established principles):**
- [Choice Overload Impedes User Decision-Making (NNGroup)](https://www.nngroup.com/videos/choice-overload/)
- [Choice Overload in UX/UI (UXGen Studio)](https://uxgenstudio.com/ux-laws/choice-overload-in-ux/)

**Config-driven architecture patterns (MEDIUM confidence):**
- [Building AI-Friendly Apps: Configuration-Driven Architecture](https://www.divotion.com/blog/building-ai-friendly-apps-configuration-driven-architecture)
- [Config Driven UI using ReactJS (GitNation)](https://gitnation.com/contents/config-driven-ui-using-reactjs)
