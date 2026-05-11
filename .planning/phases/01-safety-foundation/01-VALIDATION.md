---
phase: 01
slug: safety-foundation
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-05-11
---

# Phase 01 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Vitest 3.0.4 |
| **Config file** | `vitest.config.ts` |
| **Quick run command** | `npx vitest run src/lib/prompt/validation.test.ts` |
| **Full suite command** | `npm test` |
| **Estimated runtime** | ~3 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npx vitest run src/lib/prompt/validation.test.ts`
- **After every plan wave:** Run `npm test`
- **Before `/gsd-verify-work`:** Full suite must be green
- **Max feedback latency:** 5 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 01-01-01 | 01 | 1 | OPT-04 | T-01-01 / — | avoid_temporal_flicker + avoid_quality_keywords in catalog | unit | `npx tsc --noEmit` | — | pending |
| 01-01-02 | 01 | 1 | D-03 | T-01-02 / — | next build produces static out/ | build | `npx next build` | — | pending |
| 01-02-01 | 02 | 1 | ARCH-07 | T-01-04 / — | safetyDefaults deselection triggers warning | integration | `npx vitest run src/lib/prompt/validation.test.ts` | — | pending |
| 01-02-02 | 02 | 1 | ARCH-07 | T-01-05 / — | target switch auto-selects safetyDefaults | component | manual | — | pending |
| 01-02-03 | 02 | 1 | TEST-08 | — | safety text assertions pass | integration | `npx vitest run src/lib/prompt/validation.test.ts -t "TEST-08"` | — | pending |

*Status: pending · green · red · flaky*

---

## Wave 0 Requirements

- [ ] `src/lib/prompt/validation.ts` — `validateSafetyDefaults()` function (for plan 01-03)
- [ ] `src/lib/prompt/validation.test.ts` — add test for validateSafetyDefaults (for plan 01-03)
- [ ] `src/components/prompt-guide.test.tsx` — deselection tracking on re-switch (for plan 01-04)

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Target switch auto-selects safety defaults in UI | ARCH-07 | Component state after interaction — no jsdom assertion for setSelections merge | Open app, switch to Seedance, verify constraints pre-selected with no_ip_or_celebrity, stable_identity, readable_text |
| Amber warning visible when safety default deselected | ARCH-07 | Visual warning rendering — jsdom doesn't render Tailwind amber colors | Deselect a safety constraint, verify amber banner in output panel |

---

## Validation Sign-Off

- [ ] All tasks have automated verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 5s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
