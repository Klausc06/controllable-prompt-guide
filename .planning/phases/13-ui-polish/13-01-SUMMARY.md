---
phase: 13-ui-polish
plan: 01
subsystem: ui
tags:
  - work-type-switcher
  - confirm-dialog
  - consumer-tags
  - image-defaults
  - react
  - lucide-react

# Dependency graph
requires:
  - phase: 09-work-type-foundation
    provides: WORK_TYPE_CHANGED action, image_prompt stub, state-driven resolution
  - phase: 10-image-catalogs
    provides: 14 image option catalogs with 272 options, consumerTerms on art_style
  - phase: 11-image-renderer
    provides: generic_image target, comma-separated renderer, adapter wiring
  - phase: 12-image-quality
    provides: work-type-aware heuristics, suggests enrichment
provides:
  - WorkTypeSwitcher toggle bar with iOS segment control style (视频/图片)
  - ConfirmDialog with Esc/Enter keyboard and click-outside-to-close
  - Dynamic header icon (Image/Clapperboard) and mode descriptor (当前模式：xxx提示词)
  - imageDefaults with 7 core image dimensions for image_prompt initialization
  - resolveInitialWorkType() with URL > localStorage > "video_prompt" priority chain
  - ConsumerTagGroup trigger expanded to any option set with consumerTerms
  - Consumer tag cap at 20 most relevant with "+ N 更多" expand / "收起" collapse
affects: [13-02-state-portability, 13-04-verification, future-image-targets]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "resolveInitialWorkType(): multi-tiered state resolution (URL > localStorage > default)"
    - "Pending action pattern: useRef stores pending work type, dialog confirms before dispatch"
    - "ConsumerTerm priority sorting: Map-based priority lookup with stable fallback (999)"

key-files:
  modified:
    - src/components/prompt-guide.tsx (655 -> 885 lines)

key-decisions:
  - "Plan-specified imageDefaults IDs corrected to actual registry IDs: social_media -> social_media_post, product -> hero_product, indoor_studio -> studio_env, center -> centered, soft_diffused -> soft_dreamy, no_ip_or_celebrity -> no_ip_celebrity (image_constraints prefix)"
  - "Safety default constraints used for imageDefaults: no_ip_celebrity, no_nsfw, no_bad_anatomy, no_low_quality (matches generic_image target)"
  - "PRIORITY_TERMS map drives consumer tag sort: 20 high-value Chinese market aesthetics first, rest by stable source order (999 fallback)"
  - "ConfirmDialog renders inline in component tree (no portal) with fixed overlay; acceptable for v1.1 single-dialog UI"

requirements-completed:
  - WORK-03
  - UI-01
  - UI-02
  - UI-03

# Metrics
duration: 11min
completed: 2026-05-14
---

# Phase 13 Plan 01: UI Integration -- Work Type Switcher, Confirm Dialog, Dynamic Header, Consumer Tag Cap

**Integrates the image_prompt work type into the UI with a dual-button toggle bar, confirmation dialog on switch, dynamic header icon/label, and capped consumer tags with expand.**

## Performance

- **Duration:** ~11 min
- **Started:** 2026-05-14T03:01:58Z
- **Completed:** 2026-05-14T03:12:52Z
- **Tasks:** 3 completed
- **Files modified:** 1 (`src/components/prompt-guide.tsx`: 655 -> 885 lines, +230 net)

## Accomplishments

- Work type toggle bar (视频/图片) renders between header and target selector with iOS segment control styling
- Confirmation dialog appears only when selections exist; supports Esc (cancel), Enter (confirm), and click-outside-to-close
- Dynamic header: Image icon for image_prompt, Clapperboard for video_prompt; "当前模式：xxx提示词" descriptor
- Image mode initializes with poster (social_media_post) + realistic (photorealistic) + center (centered) defaults
- Consumer tags now appear for any option set with consumerTerms, capped at 20 with priority sorting and "+ N 更多" expand
- Zero-target error state with "切换回视频模式" recovery button
- All 3 tasks committed atomically; npm run typecheck passes clean

## Task Commits

1. **Task 1: Add imageDefaults and resolve initial work type from URL/localStorage** - `6761c4a` (feat)
2. **Task 2: Build WorkTypeSwitcher toggle bar and ConfirmDialog** - `84a90b9` (feat)
3. **Task 3: Dynamic header icon/label and consumer tag cap with expand** - `78fb8ae` (feat)

## Files Modified

- `src/components/prompt-guide.tsx` - All Phase 13 Plan 01 UI components (WorkTypeSwitcher, ConfirmDialog, dynamic header, capped ConsumerTagGroup, imageDefaults, resolveInitialWorkType)

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Corrected 6 imageDefaults option IDs to match registry**
- **Found during:** Task 1
- **Issue:** Plan specified IDs that don't exist in the registry:
  - `image_use_case:social_media` -> `image_use_case:social_media_post`
  - `image_subject:product` -> `image_subject:hero_product`
  - `image_scene:indoor_studio` -> `image_scene:studio_env`
  - `image_composition:center` -> `image_composition:centered`
  - `image_lighting:soft_diffused` -> `image_lighting:soft_dreamy`
  - `image_constraint:no_ip_or_celebrity` -> `image_constraints:no_ip_celebrity` (wrong prefix + wrong ID)
  - `image_constraint:stable_identity` -> not in image registry (removed; substituted with `image_constraints:no_nsfw`)
  - `image_constraint:readable_text` -> not in image registry (removed; substituted with `image_constraints:no_bad_anatomy`, `image_constraints:no_low_quality`)
- **Fix:** Used actual IDs from image option catalog files. Constraints now use the 4 safety defaults from generic_image target.
- **Files modified:** `src/components/prompt-guide.tsx`
- **Commit:** `6761c4a`

**2. [Rule 1 - Bug] Lucide Image icon triggered jsx-a11y/alt-text warning**
- **Found during:** Task 3
- **Issue:** ESLint `jsx-a11y/alt-text` fires on `Image` component name (false positive for SVG icon).
- **Fix:** Attempted `alt=""` (TypeScript error: not a valid Lucide prop) and `aria-hidden="true"` (same). Reverted to no extra prop -- the warning is a known false positive for Lucide's `Image` SVG component.
- **Files modified:** `src/components/prompt-guide.tsx`
- **Commit:** `78fb8ae`

## Pre-existing Issues (Not Fixed)

- `src/lib/prompt/validation.test.ts`: 1 test failure in "renders negative prompt after '避免：'" assertion -- pre-existing, unrelated to Plan 13-01 changes
- Worktree directories under `.claude/worktrees/`: contain stale test files and lint errors -- not in scope

## Threat Flags

None -- all new surface (URL params, localStorage reads, user click dispatch) is covered by the plan's threat model (T-13-01 through T-13-05). Mitigations verified in implementation:
- T-13-01: URL `wt` param validated via `resolveWorkType()` (throws on unknown, caught silently)
- T-13-02: localStorage validated for `version === 1` and valid `workTypeId`
- T-13-04: Consumer tags capped at 20 with manual expand; only visible DOM nodes rendered by default

## Self-Check: PASSED

- [x] SUMMARY.md exists at `.planning/phases/13-ui-polish/13-01-SUMMARY.md`
- [x] All 3 commits verified: `6761c4a`, `84a90b9`, `78fb8ae`
- [x] `src/components/prompt-guide.tsx` exists (885 lines)
- [x] `npm run typecheck` passes with 0 errors
