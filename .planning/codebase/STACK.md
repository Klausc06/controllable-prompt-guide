# Technology Stack

**Analysis Date:** 2026-05-10

## Languages

**Primary:**
- TypeScript 5.7.3 - Used throughout the entire source tree (`src/`). All source files (`.ts`, `.tsx`) are authored in TypeScript. JavaScript is not used in source code (allowJs: false).

**Secondary:**
- CSS - Tailwind CSS with custom CSS custom properties defined in `src/app/globals.css`.

## Runtime

**Environment:**
- Node.js v24.14.0 (development runtime)
- Next.js 15.1.6 (production server and build tool)

**Package Manager:**
- npm 11.9.0
- Lockfile: `package-lock.json` present

## Frameworks

**Core:**
- Next.js 15.1.6 - App Router (`src/app/` directory with `layout.tsx` and `page.tsx`). Server-side rendering for the root layout; client-side rendering for the interactive prompt guide (`"use client"` in `src/components/prompt-guide.tsx`).
- React 19.0.0 - UI framework. Uses hooks (`useState`, `useMemo`) in `src/components/prompt-guide.tsx`.

**Testing:**
- Vitest 3.0.4 - Test runner configured in `vitest.config.ts`. Uses `jsdom` environment with globals enabled.
- @testing-library/react 16.2.0 - Component testing in `src/components/prompt-guide.test.tsx`.
- @testing-library/jest-dom 6.6.3 - Custom DOM matchers via setup file `src/test/setup.ts`.
- jsdom 26.0.0 - DOM environment for tests.

**Build/Dev:**
- PostCSS 8.5.1 - CSS processing pipeline configured in `postcss.config.mjs`.
- Autoprefixer 10.4.20 - Vendor prefix insertion via PostCSS.

## Styling

**Framework:**
- Tailwind CSS 3.4.17 - Utility-first CSS framework. Content scanned from `./src/**/*.{ts,tsx}`.
- Custom theme: HSL-based CSS custom properties for colors (`--background`, `--foreground`, `--muted`, `--accent`, `--border`, `--surface`) defined in `src/app/globals.css`.

**Utilities:**
- `tailwind-merge` 2.6.0 - Class conflict resolution via `cn()` helper in `src/lib/utils.ts`.
- `clsx` 2.1.1 - Conditional class name construction, used by `cn()`.
- `lucide-react` 0.475.0 - Icon library. Icons used in `src/components/prompt-guide.tsx`: `Check`, `ChevronDown`, `Clapperboard`, `Clipboard`, `Copy`, `ShieldCheck`, `SlidersHorizontal`.

## Key Dependencies

**Critical:**
- `next` ^15.1.6 - Framework foundation.
- `react` / `react-dom` ^19.0.0 - UI runtime.
- `typescript` ^5.7.3 - Type checking and compilation (via `tsc --noEmit`).

**Infrastructure:**
- `@types/node` ^22.10.10, `@types/react` ^19.0.8, `@types/react-dom` ^19.0.3 - Type definitions.

## Configuration

**TypeScript:**
- Config file: `tsconfig.json`
- `target`: ES2017
- `strict`: true
- `moduleResolution`: "bundler"
- `jsx`: "preserve"
- Path alias: `@/*` maps to `./src/*`

**Next.js:**
- Config file: `next.config.ts`
- Options: `reactStrictMode: true`

**Tailwind CSS:**
- Config file: `tailwind.config.ts`
- Custom colors, shadows, content path specified.

**PostCSS:**
- Config file: `postcss.config.mjs`
- Plugins: `tailwindcss`, `autoprefixer`

**ESLint:**
- Config file: `eslint.config.mjs`
- Extends: `next/core-web-vitals`, `next/typescript` (via `@eslint/eslintrc` FlatCompat)
- Ignores: `.next/`, `node_modules/`, `coverage/`, `next-env.d.ts`

**Vitest:**
- Config file: `vitest.config.ts`
- Aliases mirror tsconfig path alias via `fileURLToPath`.

## Platform Requirements

**Development:**
- Node.js >= 18 (Next.js 15 requirement)
- npm or compatible package manager

**Production:**
- Node.js runtime (Next.js standalone deployment)
- No database, no external services required.

---

*Stack analysis: 2026-05-10*
