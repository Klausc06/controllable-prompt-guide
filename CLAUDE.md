# Controllable Prompt Guide / 可控提示词向导

## Project / 项目

A video prompt wizard for non-expert users. Turn vague ideas into copy-ready professional prompts through guided choices — no typing, no jargon, no paid APIs.
面向非专业用户的视频提示词向导。只需做选择题，把模糊需求转成专业提示词。不填字、不讲术语、不调付费 API。

- **Config-driven / 配置驱动**: Adding a new target tool requires 2 new files + 2 imports, zero core code changes
- **Selection-first UX / 选择优先**: No free-text fields — all input is choice-based
- **Deterministic rendering / 确定性渲染**: Template stitching, not AI rewriting
- **Static export / 静态导出**: `npm run build` → `out/`, deployable anywhere
- **3 targets / 目标**: Seedance 2.0, Veo 3 (Google), Generic Video
- **4 export formats / 导出**: zh prompt, en prompt, JSON, Markdown

## Stack / 技术栈

Next.js 15, TypeScript 5.7, React 19, Tailwind CSS v3, Vitest 3

## Conventions / 规范

- kebab-case for files / 文件名: `prompt-guide.tsx`, `seedance.renderer.ts`
- camelCase for functions / 函数: `renderPrompt`, `buildPromptBrief`
- PascalCase for components and types / 组件和类型: `PromptGuide`, `OptionItem`
- All user-facing strings are bilingual (zh/en) / 所有界面文案中英双语
- All documentation must have en/zh versions / 文档必须有中英版本
- No `any` types; no `as` casts bypassing type checking
- Validation functions return `string[]` (empty = success)
- Lookup functions throw on not-found, return `undefined` for optional

## Architecture / 架构

```
src/lib/prompt/
├── registry.ts       # Central registry / 中央注册表 (5 Maps)
├── init.ts           # Import-order barrel / 导入顺序桶
├── adapters.ts       # resolveAdapter().render() — no if/else
├── brief.ts          # Brief builder + shared utilities
├── heuristics.ts     # Quality warnings (4 rules)
├── types.ts          # All type definitions
├── validation.ts     # CI cross-reference checks
├── options/          # 12 catalogs, 134+ options
├── targets/          # 3 target configs
├── renderers/        # 3 TargetAdapter implementations
└── work-types/       # Work type definitions
```

## Commands / 命令

```bash
npm run dev        # http://localhost:3000
npm test           # 51 tests
npm run lint       # ESLint
npm run typecheck  # tsc --noEmit
```

## Constraints / 约束

- No image/video generation APIs / 不接生成 API
- No backend, database, auth / 无后端、数据库、登录
- Do not reintroduce free-text as primary input / 不把填空作为主要交互
- Do not add dependencies without explicit need / 不随意加依赖
- Config over code: prefer adding adapters/options over UI changes / 配置优先于代码
