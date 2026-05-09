# Phase 01: Safety Foundation — Context

**Gathered:** 2026-05-10
**Status:** Ready for planning
**Requirements:** ARCH-07, OPT-04, TEST-08

## Phase Boundary

Inject `safetyDefaults` from TargetToolConfig into every rendered prompt. Add missing safety constraint options (`avoid_temporal_flicker`, `avoid_quality_keywords`). Enable static export via `output: "export"` in next.config.ts. Verify Seedance output contains IP/commercial-safety constraint text.

## Implementation Decisions

### D-01: safetyDefaults injection (ARCH-07)
- **Locked:** TargetToolConfig.safetyDefaults is an array of option IDs. These MUST be auto-selected as constraints when user switches to a target, and their prompt fragments MUST appear in the rendered prompt text.
- **Locked:** If user explicitly deselects a safety default, respect the deselection but show an amber warning.
- **Claude's Discretion:** Whether to inject safetyDefaults in the renderer, the brief builder, or a new middleware layer. Whether auto-selection happens on target switch in useReducer/useState or in a separate effect.

### D-02: Missing safety constraints (OPT-04)
- **Locked:** Add `avoid_temporal_flicker` → "避免画面闪烁和跳变" / "Avoid temporal flicker and frame jitter"
- **Locked:** Add `avoid_quality_keywords` → "避免使用 'fast, cinematic, epic, amazing, lots_of_movement' 等降低 Seedance 输出质量的关键词" / "Avoid quality-degrading keywords: fast, cinematic, epic, amazing, lots_of_movement"
- **Claude's Discretion:** Whether to add these to the existing constraints.options.ts or keep them separate. Whether to tag them as Seedance-specific via appliesTo.

### D-03: Static export (minor config)
- **Locked:** Add `output: "export"` to next.config.ts. The project already builds; this makes it produce a zero-server static site.
- **Claude's Discretion:** None. One-line change.

### D-04: TEST-08 verification
- **Locked:** Test must assert that Seedance output prompt text contains safety constraint fragments (no celebrity faces, no IP, no unauthorized likenesses, no brand infringement).
- **Claude's Discretion:** Whether to add a new test or extend existing validation.test.ts.

## Claude's Discretion

- Exact implementation pattern for safetyDefaults injection (renderer vs brief builder vs middleware)
- Whether to pre-select safety options in defaults or inject at render time
- How to handle the warning when user deselects a safety default
- Test organization for TEST-08
