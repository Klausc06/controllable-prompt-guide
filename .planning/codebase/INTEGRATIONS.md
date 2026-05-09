# External Integrations

**Analysis Date:** 2026-05-10

## Overview

This application is entirely client-side. It generates structured prompt text locally using TypeScript template rendering. There are zero external API calls, databases, or network-dependent features at runtime.

## APIs & External Services

**None detected.**
- No HTTP client or fetch wrappers are used anywhere in the source tree.
- No third-party API SDKs are imported (no Stripe, Supabase, AWS, OpenAI, etc.).
- `navigator.clipboard.writeText()` in `src/components/prompt-guide.tsx` (line 61) is the only browser API call -- a standard Web API with no backend dependency.

## Data Storage

**Databases:**
- None. No ORM, no database client, no connection strings.

**File Storage:**
- Local filesystem only. No cloud storage (S3, R2, etc.). No file uploads.

**Caching:**
- None. No Redis, no in-memory cache layer.

## Authentication & Identity

**Auth Provider:**
- None. No login, no sessions, no tokens, no OAuth.

## Monitoring & Observability

**Error Tracking:**
- None. No Sentry, DataDog, or similar SDK.

**Logs:**
- No structured logging. No `console.log` calls detected in source files.

## CI/CD & Deployment

**Hosting:**
- Not configured. No Vercel, Netlify, or other hosting platform config present.
- No `Dockerfile` or deployment scripts found.

**CI Pipeline:**
- None. No GitHub Actions, no `.github/` directory.

## Environment Configuration

**Required env vars:**
- None. The application has zero `process.env` references.
- No `.env` or `.env.local` files found in the repository. The `.gitignore` lists `.env` and `.env*.local` as ignored.

## Webhooks & Callbacks

**Incoming:**
- None. No API route handlers (`src/app/api/` directory does not exist).

**Outgoing:**
- None.

## External Content / Assets

**Fonts:**
- No custom fonts imported. Relies on system/browser defaults.

**Analytics:**
- None. No GA, no Plausible, no telemetry scripts.

## Third-Party Services Referenced (Documentation-Only)

These are prompt target platforms referenced in the application's configuration data, not API integrations:

| Service | References | Nature |
|---------|-----------|--------|
| **Seedance 2.0** (即梦 / Volcano Engine) | `src/lib/prompt/targets/seedance.target.ts` | Output format target -- prompt text is styled for this tool |
| **Generic Video Model** | `src/lib/prompt/targets/generic-video.target.ts` | Fallback output format -- platform-agnostic prompt structure |

Both are configured as local `TargetToolConfig` objects with `prefer`, `suppress`, and `safetyDefaults` lists. No actual API calls are made to either service.

## Summary

The application has zero runtime external integrations. It is a self-contained, offline-capable client-side tool that renders prompt templates from bundled configuration data.

---

*Integration audit: 2026-05-10*
