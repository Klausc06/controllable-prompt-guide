---
phase: 02
slug: registry-architecture
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-05-12
---

# Phase 02 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Vitest 3.x |
| **Config file** | `vitest.config.ts` (jsdom environment, `@/` path alias) |
| **Quick run command** | `npx vitest run src/lib/prompt/registry.test.ts --reporter=verbose` |
| **Full suite command** | `npm test` |
| **Estimated runtime** | ~3 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npx vitest run src/lib/prompt/registry.test.ts src/lib/prompt/validation.test.ts`
- **After every plan wave:** Run `npm test`
- **Before `/gsd-verify-work`:** Full suite must be green
- **Max feedback latency:** 5 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 02-04-01 | 04 | 1 | ARCH-01, ARCH-02 | T-02-07 / — | registry split preserves all exports, barrel re-exports match old API | unit | `npx vitest run` | — | pending |
| 02-04-02 | 04 | 1 | ARCH-01 | — | old registry.ts deleted, consumers resolve through barrel | build | `npx tsc --noEmit` | — | pending |
| 02-05-01 | 05 | 2 | TEST-03 | — | registerWorkType throws on unknown optionSetId | unit | `npx vitest run src/lib/prompt/registry.test.ts -t "unknown optionSetId"` | No (Wave 0) | pending |
| 02-05-02 | 05 | 2 | TEST-01 | — | validateOptionIdsUnique returns duplicate IDs | unit | `npx vitest run src/lib/prompt/validation.test.ts -t "duplicate"` | No (Wave 0) | pending |
| 02-05-03 | 05 | 2 | TEST-01 | — | validateOptionIdsUnique defaults to getAllOptionSets() | unit | `npx vitest run src/lib/prompt/validation.test.ts` | No (Wave 0) | pending |

*Status: pending · green · red · flaky*

---

## Wave 0 Requirements

- [ ] `src/lib/prompt/registry.test.ts` — add test for `registerWorkType` rejecting unknown `optionSetId`
- [ ] `src/lib/prompt/validation.test.ts` — add test for `validateOptionIdsUnique` error path

---

## Manual-Only Verifications

None — all phase behaviors have automated verification.

---

## Validation Sign-Off

- [ ] All tasks have automated verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 5s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
