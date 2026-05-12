# Deferred Items — Phase 05, Plan 02

## Out-of-scope test failures from parallel worktrees

**Date:** 2026-05-13
**During:** Task 1 verification (`npm test`)
**Issue:** 8 test failures in parallel worktree directories:

1. `.claude/worktrees/agent-acdb6003bc584e15a/src/lib/prompt/reducer.test.ts` — 7 failures
   - Root cause: Stale registry copies in parallel worktree that don't have `video_prompt` work type, `generic_video` target, or `seedance` target registered
   - Error: `Unknown target: generic_video`, `Unknown work type: video_prompt`, `Unknown target: seedance`
   
2. `.claude/worktrees/agent-a54b72766246a3bce/src/components/prompt-guide.test.tsx` — 1 failure
   - Root cause: Text matching failure, likely stale test expectations vs current UI copy
   - Error: Unable to find element with text matching /健身房开业宣传视频/

**Impact:** None — these files are in parallel worktrees, not in the main project source tree. All main project tests (51/51) pass.
**Resolution needed:** These worktrees need their registries initialized or tests updated when their plans execute. Not a blocker for Plan 05-02.
**Category:** pre-existing, out-of-scope
