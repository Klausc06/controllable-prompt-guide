<!--
Language switcher / 语言切换
-->

[中文](./README.zh.md) | English

---

# Controllable Prompt Guide

> A video prompt wizard for non-expert users. No jargon required — turn vague ideas into copy-ready professional prompts through guided choices. Supports Seedance 2.0, Veo 3, and generic video models.

## Why

Most AI video tools expect English technical vocabulary (cinematography, depth of field, dolly zoom...). Ordinary users only know vague terms like "cinematic feel" or "4K" — this tool breaks down professional dimensions into understandable choices and outputs production-ready prompts.

- **Zero typing** — All input is selection-based
- **Zero cost** — Local static site, no paid API calls
- **Zero login** — No accounts, databases, or payments
- **Instant copy** — Chinese prompt, English prompt, JSON brief, and Markdown export

## Supported Targets

| Target | Style | Notes |
|--------|-------|-------|
| **Seedance 2.0** | Director-style natural language | Safety constraint warnings |
| **Veo 3 (Google)** | Cinematographic | Native audio generation |
| **Generic Video** | Structured field list | Platform-agnostic |

## Video Dimensions (12 dimensions, 134+ options)

Use case · Subject · Scene · Shot type · Camera movement · Motion · Lighting · Style · Constraints · Audio · Format · On-screen text

Every option includes: plain-language labels + professional terms + bilingual prompt fragments + target applicability + risk hints.

## Quick Start

```bash
git clone https://github.com/Klausc06/controllable-prompt-guide.git
cd controllable-prompt-guide
npm install
npm run dev        # http://localhost:3000
```

## Verification

```bash
npm test           # 51 tests
npm run lint       # ESLint
npm run typecheck  # tsc --noEmit
npm run build      # static export → out/
```

## Architecture

Config-driven — adding a new target requires only 2 new files + 2 import lines, zero changes to core code.

```
src/lib/prompt/
├── types.ts          # Type definitions
├── registry.ts       # Central registry (5 Maps, register/resolve/getAll)
├── init.ts           # Import-order barrel file
├── adapters.ts       # resolveAdapter().render() — no if/else
├── brief.ts          # Brief builder + shared utilities
├── heuristics.ts     # Prompt quality heuristics (4 rules)
├── options/          # 12 option catalogs
├── targets/          # 3 target tool configs
├── renderers/        # 3 TargetAdapter implementations
├── work-types/       # Work type definitions
└── validation.ts     # CI cross-reference validation
```

## Roadmap

- Expand option catalog to 200+
- Runway Gen-4 adapter
- Canva design brief work type
- Tailwind v4 migration

## License

MIT
