# Phase 03: Metadata Execution - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.

**Date:** 2026-05-12
**Phase:** 03-metadata-execution
**Mode:** discuss
**Areas discussed:** State management, suppress/warn, renderer templates, target switching, appliesTo filtering

---

## State Management (useReducer)

| Option | Selected |
|--------|----------|
| Event-sourcing: TARGET_CHANGED, OPTION_SELECTED, OPTION_DESELECTED, TOGGLE_ADVANCED | ✓ |
| Per-field: SET_FIELD / MERGE_PROPS | |
| Operation-based: SET_TARGET / SET_SELECTION | |

**User's choice:** Event-sourcing (C). Reducer computes all derived state in one pass. Full action history enables debugging and replay.

---

## suppress/warn (ARCH-08)

| Option | Selected |
|--------|----------|
| Catalog-declared: `suppresses: string[]` on option | ✓ |
| Renderer hardcoded: if/else in render function | |
| Independent resolution layer | |

**User's choice:** Catalog-declared (A). Rules are data, not code. New suppression = catalog change only.

---

## Renderer Template Maps (ARCH-06)

| Option | Selected |
|--------|----------|
| Dimension→slot: `templateMap: { use_case: "{前置语境}", ... }` | ✓ |
| Per-locale full string template | |
| Function-based template | |

**User's choice:** Dimension→slot mapping (A). Pure data. New target = templateMap only.

---

## Target Switching (ARCH-04, TEST-13)

| Decision | Selected |
|----------|----------|
| Logic location | Reducer `TARGET_CHANGED` action |
| Incompatible options | Silently discard |

**User's choice:** Reducer-managed preservation with silent discard.

---

## appliesTo Filtering (ARCH-04, TEST-04)

| Option | Selected |
|--------|----------|
| Complete appliesTo fields | ✓ |
| Reverse mapping `getTargetsForOption` | ✓ |

**User's choice:** Both — audit all 134+ options + add reverse index.

---

## Claude's Discretion

- Reducer state shape and file location
- Template string syntax details
- Pre-computed per-target selection caches
- Warning formatting for suppressed options in UI
- Reverse index build strategy (eager vs lazy)
