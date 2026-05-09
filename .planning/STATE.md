# State: Controllable Prompt Guide

**Project:** 可控提示词向导
**Last updated:** 2026-05-10

---

## Project Reference

**Core Value:** 用户完全不懂专业术语，只靠做选择题，就能得到可复制到 Seedance 2.0 / 通用视频模型里的专业提示词。

**Current Focus:** Roadmap defined. Ready for Phase 1 planning.

**Milestone:** v1 — Initial release with Seedance 2.0 + generic video support, config-driven architecture.

---

## Current Position

| Attribute | Value |
|-----------|-------|
| Phase | 1. Safety Foundation |
| Plan | Not started |
| Status | Ready for planning |
| Phase progress | 0/1 plans complete |
| Overall progress | `[________]` 0/8 phases complete |

---

## Performance Metrics

| Metric | Current | Target |
|--------|---------|--------|
| Test count | 8 (all pass) | 15+ (all pass) |
| Lint | Clean | Clean |
| Typecheck | Clean | Clean |
| Build | Success | Static export success |
| Option count | ~80 | ~143 |
| UX mode | Selection wizard | Selection wizard + quality warnings + consumer translation |

---

## Accumulated Context

### Key Decisions
- Phase structure: 8 phases (fine granularity per config.json)
- Phase 2 split from research recommendation: Architecture Completion separated from Catalog Expansion
- Phase 3 split from research recommendation: Quality Layer + Differentiators split into Consumer Translation (5) and Quality Intelligence (6)
- ARCH-07 assigned to Phase 1 (safety urgency), with reinforcement in Phase 3
- Static export (`output: "export"`) bundled with Phase 1 safety work
- No new dependencies for v1 — current package.json is complete

### Research Flags
- **Legal urgency:** safetyDefaults not injected — fix in Phase 1 before any other work
- **Architecture risk:** 4 hardcoded coupling points (TargetToolId union type, if/else adapter, direct workType import, magic question IDs) — Phase 2 addresses 3 of 4, Phase 3 addresses the 4th
- **Catalog risk:** Option ID collisions possible without namespace prefixing — Phase 4 addresses
- **Sora 2 discontinued March 2026** — deprioritize; focus on Veo 3 and Seedance

### Open Questions
- Camera shot vs movement separation: exact UI/data model for the split (Phase 4 design detail)
- Content moderation scope: how much filtering in wizard vs platform safety filters
- Consumer aesthetics prompt fragment quality: 14 terms need actual Seedance 2.0 submission testing (Phase 8 manual validation)
- Wan 2.x and Kling prompt structures: no research results yet (Phase 8 forward research)

### Blockers
- None

---

## Session Continuity

**Last action:** Roadmap created. 8 phases, 37 requirements mapped.

**Next action:** `/gsd-plan-phase 1` to plan Safety Foundation phase.

---

*State initialized: 2026-05-10*
*Will update at each phase transition*
