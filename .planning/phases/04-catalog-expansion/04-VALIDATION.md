---
phase: 04
slug: catalog-expansion
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-05-12
---

# Phase 04 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Vitest 3.x |
| **Config file** | `vitest.config.ts` (jsdom environment) |
| **Quick run command** | `npx vitest run src/lib/prompt/validation.test.ts` |
| **Full suite command** | `npm test` |
| **Estimated runtime** | ~5 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npx vitest run`
- **After every plan wave:** Run `npm test`
- **Before `/gsd-verify-work`:** Full suite must be green
- **Max feedback latency:** 5 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 04-01-01 | 01 | 1 | OPT-05 | T-04-01 | validateOptionIdFormat catches non-prefixed IDs | unit | `npx vitest run src/lib/prompt/validation.test.ts -t "namespace prefix"` | No (Wave 0) | pending |
| 04-01-02 | 01 | 1 | OPT-05 | T-04-02 | All 136 option IDs have catalog prefix | build | `npx tsc --noEmit` | — | pending |
| 04-01-03 | 01 | 1 | OPT-05 | T-04-03 | All references match renamed IDs | unit | `npx vitest run` | — | pending |
| 04-02-01 | 02 | 2 | OPT-01 | — | 4 weak catalogs expanded, new options valid | unit | `npx tsc --noEmit` | — | pending |
| 04-02-02 | 02 | 2 | OPT-01 | — | All 12 catalogs >= 15, total >= 180 | unit | `npx vitest run` | — | pending |
| 04-03-01 | 03 | 3 | OPT-02 | — | CI validates riskHint completeness | unit | `npx vitest run -t "riskHint"` | No (Wave 0) | pending |
| 04-03-02 | 03 | 3 | OPT-02 | — | HIGH-risk catalogs have substantive riskHint | unit | grep check | — | pending |
| 04-03-03 | 03 | 3 | OPT-02 | — | LOW-risk catalogs have riskHint (may be empty) | unit | grep check | — | pending |

*Status: pending · green · red · flaky*

---

## Wave 0 Requirements

- [ ] `src/lib/prompt/validation.test.ts` — test for `validateOptionIdFormat()`
- [ ] `src/lib/prompt/validation.test.ts` — test for riskHint completeness check

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| New option content quality | OPT-01 | Creative content — no automated quality check | Review zh/en promptFragments for 46 new options |
| riskHint accuracy | OPT-02 | Subjective risk assessment | Review constraints and text_handling riskHints |

---

## Validation Sign-Off

- [ ] All tasks have automated verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 5s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
