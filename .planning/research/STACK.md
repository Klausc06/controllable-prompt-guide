# Technology Stack

**Project:** Controllable Prompt Guide (可控提示词向导)
**Researched:** 2026-05-10
**Overall confidence:** HIGH

## Executive Summary

This is a config-driven, local-only, client-side React application. The current stack (Next.js 15 + TypeScript 5.7 + React 19 + Tailwind CSS v3 + Vitest 3) is the correct foundation. No framework migration is warranted. The key stack decisions are: (1) enable static export to eliminate the server dependency entirely, (2) adopt useReducer + Context for state management as option catalogs grow, (3) defer Tailwind v4 migration to a dedicated future phase, and (4) build a tiered testing strategy centered on catalog integrity validation.

## Recommended Stack

### Core Framework

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| Next.js | 15.1.6 | App framework, build tool, dev server | Already configured and validated (P0: build succeeds). Static export via `output: "export"` makes it a true zero-server tool. Migration to Vite offers zero practical benefit for a project that already builds and tests cleanly. |
| React | 19.0.0 | UI runtime | Already in use. React 19's `useReducer`, `useContext`, and `useMemo` are sufficient for all state management needs. No external state library is justified. |
| TypeScript | 5.7.3 | Type system | `strict: true`, `moduleResolution: "bundler"`. The discriminated union types and interfaces used throughout the prompt engine depend on TypeScript's structural type system. |
| Tailwind CSS | 3.4.17 | Utility-first CSS | **Stay on v3.** v4 migration (CSS-first config, Lightning CSS, removed `tailwind.config.ts`) is a non-trivial change that should be a dedicated phase, not mixed with architecture refactoring. v3 is not deprecated and fully supports the current custom theme. |

### State Management

| Technology | Purpose | Why |
|------------|---------|-----|
| React `useReducer` | Core selection state machine | The `PromptSelections` state naturally maps to a reducer: actions like `SELECT_OPTION`, `DESELECT_OPTION`, `SET_TARGET`, `INJECT_SAFETY_DEFAULTS` are explicit, testable, and predictable. Reducers make target-switching logic (filter incompatible selections, inject safety defaults) auditable as discrete state transitions. |
| React `useContext` | Share state across component tree | As the questionnaire grows (more question blocks, output panels, target selector), prop drilling from `PromptGuide` to `QuestionBlock` and `OutputPanel` becomes unwieldy. A single `PromptContext` provider wrapping `selections` + `dispatch` + `targetToolId` eliminates this without adding a library dependency. |
| React `useMemo` | Derived output computation | `rendered` output should remain memoized, recomputing only when `selections` or `targetToolId` change. Already correct in the current codebase. |

**Explicitly NOT added:**
- **Zustand** -- The state is a single record (`PromptSelections`) with straightforward transitions. Zustand adds a dependency and an external store pattern for state that never leaves the React tree.
- **Jotai** -- Atomic state is overkill for a wizard where selections are co-dependent (changing target may invalidate selections).
- **Redux / Redux Toolkit** -- Massive overengineering for a local-only tool with no async state, no middleware needs, no devtools requirement.
- **XState** -- While the wizard is conceptually a state machine, the transitions are simple enough that `useReducer` captures them without adding a state chart library and its learning curve.
- **React Hook Form / Formik** -- This is NOT a form. It is a guided selection wizard. There are no text inputs, no validation-on-blur, no submit handlers. Standard `onClick` handlers dispatching reducer actions are simpler and more appropriate.

### Testing

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| Vitest | 3.0.4 | Test runner | Already configured with jsdom, globals, and `@/` alias. Co-located test pattern (`*.test.ts` next to source) is correct. |
| @testing-library/react | 16.2.0 | Component rendering tests | Already configured. Tests render `PromptGuide` and assert on DOM output. |
| @testing-library/jest-dom | 6.6.3 | DOM matchers | Extended assertions (`toBeInTheDocument`, `toHaveTextContent`). |

**Testing strategy for growing catalogs (tiered approach):**

**Tier 1 -- Catalog Integrity (CI gate, runs on every commit):**
These are pure data validation tests. They do not render React components. They validate that configuration files are internally consistent.
- Option ID uniqueness across all registered option sets
- Question ID uniqueness within each work type
- `optionSetId` references in question schemas resolve to registered option sets
- `appliesTo` target references in options resolve to registered targets
- `safetyDefaults` option IDs exist in the options catalog
- Every registered target has exactly one renderer

**Tier 2 -- Rendering Correctness (CI gate):**
- Individual renderer function tests (call `renderSeedancePrompt` with a known brief, assert output structure)
- Snapshot tests for each target's output given a fixed `completeSelections` fixture
- Cross-target difference tests (Seedance output != generic output -- already exists)
- Option-to-output traceability: select option X, assert `X.promptFragment` appears in rendered output

**Tier 3 -- Component Integration (CI gate):**
- Target switching preserves compatible selections
- Option filtering by `appliesTo` (verify incompatible options are hidden)
- Safety default injection on target change
- Clipboard interactions (already tested)
- Advanced options toggle (already tested)

**Tier 4 -- E2E Smoke (pre-release, manual or CI):**
- Open `/`, switch targets, expand advanced, copy JSON, no console errors
- Uses Playwright MCP for ad-hoc browser smoke tests (no framework dependency added)

**Explicitly NOT added:**
- **Coverage thresholds** -- Add when the test suite is mature (at least 50+ tests). Premature coverage gates encourage low-value tests.
- **Playwright/Cypress as project dependency** -- The project has no server, no routing, no auth flows. A single-page tool does not need an E2E framework. Ad-hoc MCP-based browser testing is sufficient.

### Build and Output

| Configuration | Value | Why |
|---------------|-------|-----|
| `next.config.ts` | `output: "export"` | Produces a fully static site (`out/` directory). Zero server dependency. Deployable to any CDN (Cloudflare Pages, Vercel, Netlify, GitHub Pages) or opened locally. |
| `reactStrictMode` | `true` (keep) | Catches side-effects in render, stale closures. Already set. |

**Static export implications:**
- The app has no API routes, no `getServerSideProps`, no `useParams()` -- fully compatible
- `layout.tsx` metadata (title, description) is evaluated at build time -- correct for static export
- The `"use client"` directive on `PromptGuide` is necessary and correct: the interactive component cannot be a Server Component
- Build output: `out/index.html` + static assets (JS bundles, CSS). Single HTML file for the single route.

### Supporting Libraries

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| clsx | 2.1.1 | Conditional class names | Used by `cn()` utility. Keep. |
| tailwind-merge | 2.6.0 | Tailwind class conflict resolution | Used by `cn()` utility. Keep. |
| lucide-react | 0.475.0 | Icon library | Tree-shakeable. Only 7 icons currently used. Keep for UI polish. |

### Infrastructure

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| PostCSS | 8.5.1 | CSS processing | Required by Tailwind v3. Remove when migrating to v4. |
| Autoprefixer | 10.4.20 | Vendor prefixes | Standard PostCSS plugin. |
| ESLint | 9.18.0 | Linting | `next/core-web-vitals` + `next/typescript` rules. Keep. |

## Alternatives Considered

| Category | Recommended | Alternative | Why Not |
|----------|-------------|-------------|---------|
| Framework | Next.js 15 (keep) | Vite + React | Migration cost (rewrite app entry, build config, path aliases) for no functional gain. Next.js static export achieves the same zero-server outcome. If starting from scratch, Vite would be a reasonable choice, but this is a brownfield project with a working build. |
| State management | useReducer + Context | Zustand | The state is a single `PromptSelections` record with a dozen action types. Zustand would add a dependency, an external store pattern, and complexity without addressing any actual problem. The reducer pattern makes state transitions (especially target-switching logic) explicitly testable. |
| State management | useReducer + Context | XState | The wizard has simple linear transitions. A full state chart library adds conceptual overhead (guards, actions, services, actors) that this project does not benefit from. |
| Styling | Tailwind v3 (stay) | Tailwind v4 | v4 migration requires: removing `tailwind.config.ts`, converting custom theme to CSS `@theme`, switching to Lightning CSS or configuring PostCSS compat, updating class name changes. This is a dedicated phase, not something to mix with registry refactoring. v3 continues to work and is not deprecated. |
| Build output | Static export | Node.js server | The project has zero server logic. Running a Node.js server in production to serve a single HTML page is wasteful. Static export eliminates the runtime dependency entirely. |
| Testing | Vitest + RTL (keep) | Jest | Vitest is faster, native ESM, shares TypeScript config, and is already configured. Migrating to Jest would be a downgrade. |
| Forms | None | React Hook Form | This is not a form. There are no text inputs, no validation rules, no submit events. The guided selection pattern is closer to a configurator/wizard than a traditional form. |

## Installation

```bash
# Core (already installed -- no changes needed)
npm install next@^15.1.6 react@^19.0.0 react-dom@^19.0.0 typescript@^5.7.3

# Styling (keep current versions)
npm install tailwindcss@^3.4.17 clsx@^2.1.1 tailwind-merge@^2.6.0 lucide-react@^0.475.0

# Dev dependencies (keep current versions)
npm install -D vitest@^3.0.4 @testing-library/react@^16.2.0 @testing-library/jest-dom@^6.6.3 jsdom@^26.0.0
npm install -D postcss@^8.5.1 autoprefixer@^10.4.20
npm install -D eslint@^9.18.0 eslint-config-next@^15.1.6
npm install -D @types/node@^22.10.10 @types/react@^19.0.8 @types/react-dom@^19.0.3
```

**No new dependencies are recommended at this stage.** The existing dependency set is complete for the project's scope.

## What NOT to Add

This section is as important as what TO add. The project's constraints (local-only, no server, no auth, no database) eliminate entire categories of dependencies.

| Category | Examples | Why NOT |
|----------|----------|---------|
| **Databases** | IndexedDB, localStorage wrappers, Dexie.js | MVP generates output on each interaction. Persistence (remembering last selections) is a future enhancement, not current scope. Adding storage now creates state synchronization complexity (stored state vs reducer state) with no user-facing value. |
| **Auth libraries** | NextAuth, Clerk, Auth0, Lucia | No user concept exists. The tool has no login, no account, no protected routes. |
| **API clients** | fetch wrappers, axios, TanStack Query, SWR, tRPC | The app makes zero external API calls. All rendering is deterministic template composition. |
| **ORM / query builders** | Prisma, Drizzle, Knex | No database. No server. No queries. |
| **Runtime validation** | Zod, Yup, Valibot | The current `validation.ts` pattern (functions returning `string[]` errors) works for build-time config checks. The catalog data is TypeScript-typed at dev time. Adding a schema library would mean maintaining both TypeScript types AND Zod schemas for the same data shapes. Only add Zod if/when user-provided data needs runtime validation (e.g., free text input). |
| **i18n libraries** | next-intl, react-i18next, Lingui | The app supports exactly two hardcoded locales (`zh`, `en`) via a simple `LocalizedText` interface. An i18n framework adds extractors, translation files, and runtime overhead for a bilingual static tool. |
| **UI component libraries** | shadcn/ui, Radix, MUI, Ant Design | The current custom `Button` component and Tailwind-styled UI are sufficient. A component library would increase bundle size, introduce design constraints, and add dependency maintenance burden for a single-page tool. |
| **Animation libraries** | Framer Motion, react-spring, GSAP | CSS transitions handle any needed UI feedback. Animation libraries add bundle weight without proportional UX value for a utility tool. |
| **Form libraries** | React Hook Form, Formik, TanStack Form | The wizard uses `onClick` selection, not form inputs. There are no text fields (by design), no validation-on-submit, no form state tracking. Adding a form library would fight the interaction model. |
| **E2E testing frameworks** | Playwright, Cypress (as npm dependency) | A single-page tool with no routing, no server, no auth does not justify an E2E framework dependency. Use Playwright MCP for ad-hoc browser smoke tests without adding to `package.json`. |
| **Backend / BaaS** | Supabase, Firebase, Convex | The project is explicitly local-only. Adding a backend dependency violates the core constraint. |

## Configuration Changes Required

### `next.config.ts` -- Add static export

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: "export",  // ADD THIS LINE
};

export default nextConfig;
```

This single change eliminates the server dependency. After this change, `npm run build` produces `out/index.html` instead of a Node.js server build.

### `src/app/layout.tsx` -- Verify static export compatibility

The current layout uses `export const metadata` (not `generateMetadata` with dynamic params), which is compatible with static export. No change needed.

## Sources

- [Next.js Static Exports (App Router)](https://nextjs.org/docs/app/guides/static-exports) -- HIGH confidence: official Next.js documentation
- [Next.js App Router Static Export Guide (v15)](https://nextjs.im/docs/15/app/guides/static-exports/) -- MEDIUM confidence: community docs mirroring official
- [Tailwind CSS v4 Upgrade Guide](https://tailwindcss.com/docs/upgrade-guide) -- HIGH confidence: official Tailwind documentation
- [Tailwind CSS v4 vs v3 Comparison (2026)](https://frontend-hero.com/tailwind-v4-vs-v3) -- MEDIUM confidence: community comparison
- [Top 5 React State Management Tools in 2026](https://www.syncfusion.com/blogs/post/react-state-management-libraries) -- MEDIUM confidence: industry survey, confirms Zustand/Jotai recommended for complex global state, not simple forms
- [React State Management in 2025: What You Actually Need](https://www.developerway.com/posts/react-state-management-2025) -- HIGH confidence: well-regarded React educator, recommends useState/useReducer first
- [Vitest Component Testing Guide](https://main.vitest.dev/guide/browser/component-testing) -- HIGH confidence: official Vitest documentation
- [Vitest Snapshot Testing](https://vitest.dev/guide/snapshot.html) -- HIGH confidence: official Vitest documentation
- [React 19: Managing State](https://react.dev/learn/managing-state) -- HIGH confidence: official React documentation
- [Zustand Guide for React 19](https://react.wiki/state-management/zustand-tutorial/) -- MEDIUM confidence: confirms Zustand is for shared/global state, overkill for single-component state
- [Next.js vs Vite: Choosing the Right Tool in 2026](https://dev.to/shadcndeck_dev/nextjs-vs-vite-choosing-the-right-tool-in-2026-38hp) -- LOW confidence: community comparison, useful for framework selection context
- [Tailwind CSS v4 Next.js 15 Integration (2026)](https://staticmania.com/blog/how-to-set-up-tailwind-css-4-in-nextjs-app) -- MEDIUM confidence: confirms v4/Next.js compat requires PostCSS setup or Lightning CSS

---

*Stack research: 2026-05-10*
