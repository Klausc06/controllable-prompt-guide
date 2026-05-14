---
gsd_state_version: 1.0
milestone: v1.1
milestone_name: Image Prompts
current_plan: 5
status: Executing Phase 14
last_updated: "2026-05-14T05:15:40.274Z"
progress:
  total_phases: 6
  completed_phases: 5
  total_plans: 19
  completed_plans: 18
  percent: 95
---

# State: Controllable Prompt Guide

**Project:** 可控提示词向导
**Last updated:** 2026-05-14 — Phase 14 Plan 03 complete (D-09 consumerTerms on 13 options, D-10 categories on scene and aspect_ratio)
**Phase:** 14
**Current Plan:** 19
**Tests:** 147 total (142 pass, 5 pre-existing failures in prompt-guide.test.tsx — not caused by 14-03)
**CI:** tsc --noEmit: 0 errors

## Architecture

- Registry: 5 Maps with register/resolve/getAll
- Adapters: resolveAdapter().render() — no if/else
- UI: resolveWorkType() + getAllTargets() from registry
- Camera: shot_type + camera_movement (split per Seedance requirement)
- SafetyDefaults: auto-select + amber warning
- Quality: 13 heuristic rules (6 video + 7 image, work-type-gated via workTypeId parameter)
- Export: zh/en/JSON/Markdown via copy buttons
- Work Types: video_prompt + image_prompt (14 questions) with WORK_TYPE_CHANGED action
- Image Options: 14 catalogs, 272 options across all dimensions
- Image Renderer: generic_image adapter with comma-separated natural language output

## Recent Activity

- **Phase 14 Plan 03 complete** — D-09: All 13 missing consumerTerms verified as pre-applied in plan 14-01 commit ebe82b4 (6 art-style + 1 color-palette + 6 mood). D-10: Added categories to image_scene (3 categories covering 15 options) and image_aspect_ratio (2 categories covering 12 options). 1 commit (df8e79a), 2 files modified.
- **Phase 14 Plan 02 complete** — D-03: 6 renderPrompt integration tests for image_prompt (zh/en output, comma separators, negative prompt injection, 14-dimension brief). D-04: 8 WORK_TYPE_CHANGED cross-work-type transition tests (video-image both directions). Zero implementation changes — all 14 new tests pass against existing code. 2 commits, 228 lines added.
- **Phase 14 Plan 04 complete** — D-05: added `aria-pressed={active}` to OptionCard toggle buttons (screen readers announce selection state). D-08: removed unused `getOptionsByConsumerTerm` import. D-11: added `aria-live="polite"` region that announces work type mode switches ("已切换到图片提示词模式" / "已切换到视频提示词模式"). 2 commits, 5 insertions, 1 deletion in prompt-guide.tsx.
- **Phase 13 Plan 02 complete** — URL encoding with replaceState, 300ms debounced localStorage persistence, full priority-chain state recovery (URL > localStorage > defaults). Compact URL params: `?wt=`, `?t=`, `?sel=`, `?adv=1`. LocalStorage format with version validation. `deselectedSafety` not persisted (transient UI state).
- Phase 13 Plan 03 complete — created blog/v1.1-image-prompts.md with two Chinese blog posts: BLOG-01 feature announcement (~310 zh chars) and BLOG-02 practical walkthrough guide (~490 zh chars) with concrete example and tips
- Phase 12 Plan 03 complete — image option riskHints + negative prompt injection
- Phase 12 Plan 02 complete — fixed suggests keys from image_* aliases to actual question IDs, enriched all 18 image use case options with 4-8 visual dimension suggestions each, added CI validation that every suggested option ID references a real registered option
- Phase 12 Plan 01 complete — work-type-aware heuristics: evaluatePromptQuality() now accepts workTypeId parameter; 7 image-specific conflict/completeness rules (amber warnings); adapters.ts wired to pass workType.id; 13 new tests; backward compatible (undefined = video rules only)
- Phase 11 complete — generic image renderer pipeline: 14-question image work type, generic_image target, comma-separated renderer, init.ts + adapters.ts wiring
- Phase 10 complete — 14 image option catalogs with 272 options, barrel index, init.ts wired
- Phase 09 complete — work type foundation (WORK_TYPE_CHANGED action, image_prompt stub, state-driven resolution)
- Phase 07 complete — all 3 plans executed, VERIFICATION.md smoke test created
- Phase 08 planned (3 plans, 1 wave) — deferred to focus on Phase 09-11 (image prompt milestone):
  - 08-01: Schema versioning CI + README + browser compat
  - 08-02: Dead code + lint zero + type safety + edge cases
  - 08-03: Canva brief forward research document

## Decisions Made

- generic_image templateMap: pass-through `{zh: "{选项}", en: "{选项}"}` for all 14 dimensions — option promptFragment carries the descriptive text
- Image renderer: comma-separated natural language output (Midjourney community standard), no model parameters
- Chinese separator: full-width comma "，" / English: comma + space ", "
- constraints maxSelections: 4 to prevent overloading negative prompt
- 7 core (required) + 7 advanced (optional) image question split
- suggestedWorkTypes: WorkTypeId[] on TargetToolConfig (not TargetAdapter) — targets declaratively state capabilities
- WORK_TYPE_CHANGED action atomically clears selections, resets deselectedSafety, picks first compatible target
- Image use_case options: suggests keys now use actual question IDs (subject, composition, etc.), values use `image_*` prefixed option IDs
- appliesTo: ["generic_image"] on all image options as forward-reference for future image target
- validation.ts accepts "generic_image" as known future target ID
- Image constraints created FROM SCRATCH — zero video constraint terms leaked (PITFALLS.md Pitfall 7)
- [Phase 12-image-quality]: Backward compat: undefined workTypeId = video rules only (not all-rules mode)
- [Phase 12-image-quality]: Image rules fire ONLY when workTypeId is explicitly image_prompt (not undefined)
- [Phase 12-image-quality]: Conflict detection uses option ID string-matching, not data imports (avoids circular deps)
- [Phase 12-02]: suggests keys match work type question IDs (not optionSetIds), values are `optionSetId:optionId` format — same convention as video suggests
- [Phase 12-02]: 9 plan-referenced option IDs didn't exist in catalogs — all mapped to closest valid entries (Rule 1 auto-fix)
- [Phase 12-02]: Removed knownFutureImageQuestionIds workaround — suggests key validation now uses real image_prompt question IDs
- [Phase 12-02]: CI validation cross-references suggests values against getAllOptionSets() flat Set of all registered option IDs
- [Phase 13-03]: Blog tone: BLOG-01 excited-but-professional, BLOG-02 practical walkthrough targeting Chinese content creators who don't know prompt engineering
- [Phase 13-03]: Blog structure: single Markdown file with frontmatter, two sections separated by horizontal rule per UI-SPEC D-24
- [Phase 13-03]: No external links or screenshots in blog — tool is local-only, no deployed URL; screenshots out of scope
- [Phase 13-ui-polish]: Plan-specified imageDefaults IDs corrected to actual registry IDs for 6 mismatched option IDs
- [Phase 13-ui-polish]: Safety default constraints used for imageDefaults: matches generic_image target defaults
- [Phase 13-ui-polish]: PRIORITY_TERMS map drives consumer tag sort: 20 high-value Chinese market aesthetics first
- [Phase 13-ui-polish]: rebuildSelectionsFromOptionIds cross-references option IDs against getAllOptionSets() and work type questions to reconstruct selections — optionSetId != questionId in some cases prevents simple prefix extraction
- [Phase 13-ui-polish]: advancedOpen restored from URL/localStorage via spread override after createInitialState — avoids changing reducer signature
- [Phase 13-ui-polish]: deselectedSafety is NOT persisted — transient UI state (safety defaults can be re-deselected on each session)
- [Phase 13-ui-polish]: Empty selections from URL/localStorage trigger imageDefaults or video defaults based on workTypeId — ensures image mode always has sensible defaults
- [Phase 14-review-fixes]: D-09 consumerTerms on 13 options pre-applied by plan 14-01 — verified complete (60/60 art-style, 18/18 color-palette, 18/18 mood)
- [Phase 14-review-fixes]: D-10 categories added to image_scene (3 categories, 15 options) and image_aspect_ratio (2 categories, 12 options) — placed between label and options per image-art-style convention
- [Phase 14-review-fixes]: Used aria-pressed (not aria-checked) for OptionCard toggle buttons per ARIA spec
- [Phase 14]: D-01: vitest exclude .claude/** prevents 36 false failures from worktree snapshot copies in test discovery
- [Phase 14]: D-02: adapters.ts now imports all 4 renderers (seedance, generic-video, veo3, generic-image) matching init.ts order — no dependency on init.ts for adapter resolution
- [Phase 14]: D-06: Removed dead getImageOptionSet/getImageOptionById from options/image/index.ts — registry is canonical lookup, local duplicates mislead contributors
- [Phase 14]: D-07: Fixed heuristics.test.ts validImageSelections option ID from no_celebrity_likeness to no_ip_celebrity to match actual catalog
- [Phase 14-review-fixes]: Image renderPrompt tests use valid registered option IDs from the 14 image catalogs — all IDs verified against actual registry content before test writing
- [Phase 14-review-fixes]: Cross-work-type reducer tests expect seedance as first video target based on registration order in targets/index.ts
- [Phase 14-review-fixes]: No implementation changes needed for D-03/D-04 — both test suites pass against existing code, confirming image pipeline and WORK_TYPE_CHANGED reducer were already correct

## Next

- v1.1 (Image Prompts) milestone COMPLETE — all 5 phases (9-13), all 14 plans executed
- Phase 08 plans (hardening: CI, lint, dead code, Canva research) — deferred for future milestone
- Additional image targets (Midjourney, DALL-E, etc.) (future phase)
- Fix 5 pre-existing test failures from 13-01 renderer assertions (copy payload format changed)
