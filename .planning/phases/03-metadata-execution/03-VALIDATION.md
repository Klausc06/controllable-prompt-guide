---
phase: 03
slug: metadata-execution
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-05-12
---

# Phase 03 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Vitest 3.x + @testing-library/react 16.x |
| **Config file** | `vitest.config.ts` (jsdom environment, `@/` path alias) |
| **Quick run command** | `npx vitest run` |
| **Full suite command** | `npx vitest run` |
| **Estimated runtime** | ~5 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npx vitest run`
- **After every plan wave:** Run `npx vitest run`
- **Before `/gsd-verify-work`:** Full suite must be green
- **Max feedback latency:** 5 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 03-01-01 | 01 | 1 | ARCH-04, ARCH-06 | T-03-01 | Type additions (suppresses, templateMap) compile clean | unit | `npx tsc --noEmit` | — | pending |
| 03-01-02 | 01 | 1 | ARCH-04, TEST-04 | T-03-02 | getTargetsForOption returns correct target IDs | unit | `npx vitest run -t "reverse index"` | No (Wave 0) | pending |
| 03-02-01 | 02 | 2 | ARCH-04, TEST-09, TEST-13 | T-03-03 | Reducer handles TARGET_CHANGED, OPTION_SELECTED, OPTION_DESELECTED, TOGGLE_ADVANCED | unit | `npx vitest run src/lib/prompt/reducer.test.ts` | No (Wave 0) | pending |
| 03-02-02 | 02 | 2 | ARCH-04, TEST-13 | T-03-04 | Component uses useReducer, selections preserved across target switch | component | `npx vitest run src/components/prompt-guide.test.tsx` | — | pending |
| 03-03-01 | 03 | 2 | ARCH-05, ARCH-06 | T-03-05 | 3 target configs have templateMap, assemblePrompt renders generic | unit | `npx vitest run -t "template map"` | No (Wave 0) | pending |
| 03-03-02 | 03 | 2 | ARCH-05, TEST-06, TEST-07 | T-03-06 | Renderers simplified to thin wrappers, output byte-identical to pre-refactor | unit | `npx vitest run` | — | pending |
| 03-04-01 | 04 | 2 | ARCH-08 | T-03-07 | applySuppresses detects and removes suppressed options, generates warnings | unit | `npx vitest run -t "suppress"` | No (Wave 0) | pending |
| 03-04-02 | 04 | 2 | ARCH-04, TEST-04 | T-03-08 | appliesTo audit passes, suppress refs validated | unit | `npx vitest run -t "appliesTo"` | — | pending |

*Status: pending · green · red · flaky*

---

## Wave 0 Requirements

- [ ] `src/lib/prompt/reducer.test.ts` — covers TARGET_CHANGED preservation, OPTION_SELECTED max cap, deselectedSafety tracking, TOGGLE_ADVANCED
- [ ] `src/lib/prompt/template-render.test.ts` — covers all 3 target templateMap outputs (or add to validation.test.ts)
- [ ] `src/lib/prompt/brief-build-suppress.test.ts` — covers suppress detection and warning generation (or add to validation.test.ts)
- [ ] `src/components/prompt-guide.test.tsx` — extend with edge cases for target switch selection preservation

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Prompt output identical pre/post refactor | TEST-06, TEST-07 | Golden-file verification — compare rendered output strings | Run `npm run dev`, select all defaults for Seedance, Generic Video, Veo 3. Verify zh/en prompts match pre-refactor output character-for-character |
| UI visually unchanged after useReducer migration | — | Visual regression — jsdom doesn't render CSS | Open app, cycle through target switches, toggle advanced options, verify no visual flicker or unexpected state changes |

---

## Validation Sign-Off

- [ ] All tasks have automated verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 5s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
