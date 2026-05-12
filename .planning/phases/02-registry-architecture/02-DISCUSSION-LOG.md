# Phase 02: Registry Architecture - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.

**Date:** 2026-05-12
**Phase:** 02-registry-architecture
**Mode:** discuss (update existing)

## Discussion Summary

Code already implements D-01 through D-04 from original CONTEXT.md. Discussion focused on 3 new architecture decisions.

### Area: Registry file organization

| Option | Selected |
|--------|----------|
| Keep single file (148 lines) | |
| Split by domain (work-type, target, adapter, option) | ✓ |

**User's choice:** Split by domain. Structure: `src/lib/prompt/registry/{work-type,target,adapter,option}.registry.ts` + `index.ts` barrel.

### Area: Validation style

| Option | Selected |
|--------|----------|
| Registration throw, CI return [] (status quo) | ✓ |
| Unified throw | |
| Unified return [] | |

**User's choice:** Keep current split — fail-fast on register, batch on CI. Maximizes early error detection and developer productivity.

### Area: Adapter import pattern

| Option | Selected |
|--------|----------|
| Side-effect imports (status quo) | ✓ |
| Explicit init() function | |

**User's choice:** Keep side-effect imports. One-line import per adapter, doubles as registry manifest.

## Claude's Discretion

- Module-level Maps (not class-based) — already in place
- Adapter refactoring approach — planner decides in-place vs new files
- workTypeId flow into UI — planner decides
