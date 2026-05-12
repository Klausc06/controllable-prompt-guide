# Phase 04: Catalog Expansion - Discussion Log

> **Audit trail only.**

**Date:** 2026-05-12
**Phase:** 04-catalog-expansion
**Mode:** discuss
**Areas discussed:** OPT-05 namespace prefixes, OPT-01 catalog expansion, OPT-02 metadata completeness

---

## OPT-05: Option ID Namespace Prefixes

| Option | Selected |
|--------|----------|
| Don't do it (0 files changed) | |
| **Full migration: 136 IDs → catalog:id format** | ✓ |
| Progressive: new IDs only, old IDs unchanged | |

**User's choice:** Full migration. All option IDs get `{catalogId}:{optionId}` prefix. All references updated.

## OPT-01: Catalog Expansion

| Option | Selected |
|--------|----------|
| Add ~7 more to reach 143 | |
| **Expand to 180+ options** | ✓ |
| Keep current 136 | |

**User's choice:** Expand to 180+ (~45 new options). Each catalog at least 15.

## OPT-02: Metadata Completeness

| Option | Selected |
|--------|----------|
| **Complete riskHint for all options** | ✓ |
| Skip riskHint | |

**User's choice:** Add riskHint to all. Substantive for risky catalogs, empty for safe ones.

## OPT-03 / OPT-06: Already Done
- Camera split (shot_type + camera_movement) already exists
- Markdown export (renderMarkdown + CopyButton) already exists

## Claude's Discretion
- New option content creation
- riskHint content for borderline cases
- D-01 migration order
- Exact option counts per catalog
