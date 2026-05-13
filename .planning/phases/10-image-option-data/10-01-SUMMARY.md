---
phase: 10-image-option-data
plan: 01
type: execute
requirements: [DIM-01, DIM-02, DIM-04, DIM-05]
status: completed
completed: "2026-05-14"
duration: "~15 min"
commits:
  - f783e98: "feat(10-image-option-data): create 4 foundational image option catalogs (72 options)"
key-files:
  - src/lib/prompt/options/image/image-use-case.options.ts (created, 18 options)
  - src/lib/prompt/options/image/image-subject.options.ts (created, 24 options)
  - src/lib/prompt/options/image/image-scene.options.ts (created, 15 options)
  - src/lib/prompt/options/image/image-composition.options.ts (created, 15 options)
decisions:
  - "suggests field on use_case options uses image_ namespace IDs referencing future question IDs"
  - "appliesTo: ['generic_image'] used as forward-reference for image target (not yet registered)"
---

# Phase 10 Plan 01: Create Foundational Image Option Catalogs

**One-liner:** Created 4 foundational image option catalogs (use_case, subject, scene, composition) with 72 options, establishing the "what am I making and what does it show" dimensions for image prompts.

## Tasks Executed

### Task 1: Create image-use-case.options.ts and image-subject.options.ts
- `image-use-case.options.ts`: 18 use case options across 5 categories (宣传物料, 社交媒体, 电商/产品, 个人使用, 专业设计)
- `image-subject.options.ts`: 24+ subject options across 9 categories (人物, 产品, 动物, 自然风景, 建筑空间, 食物, 抽象概念, 交通工具, 植物花卉)
- use_case options drive smart defaults via `suggests` field (3-6 option IDs across 3-4 dimensions each)
- Every option has complete bilingual metadata: label, plain, professionalTerms, promptFragment (zh+en), appliesTo, riskHint
- All option IDs use `image_` namespace prefix

### Task 2: Create image-scene.options.ts and image-composition.options.ts
- `image-scene.options.ts`: 15 background/scene options with complete bilingual metadata
- `image-composition.options.ts`: 15 composition/layout options across 2 categories (经典构图, 动态构图)
- All options have appliesTo: ["generic_image"] and image_ namespace prefix IDs

## Deviations from Plan

None — plan executed exactly as written.

## Verification

- `npx tsc --noEmit`: 0 errors
- Option counts: 18 (use_case) + 24 (subject) + 15 (scene) + 15 (composition) = 72 options
- All option IDs follow `image_{dimension}:{key}` naming convention
- Categories defined on sets with >= 12 options (use_case: 5, subject: 9, composition: 2)
