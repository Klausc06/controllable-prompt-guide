# 可控提示词向导 / Controllable Prompt Guide

> 面向非专业用户的视频提示词生成工具。不需写任何专业术语，只做选择题就能把模糊需求转成可复制到 Seedance 2.0 / Veo 3 / 通用视频模型里的专业提示词。
>
> A video prompt wizard for non-expert users. No jargon required — turn vague ideas into copy-ready professional prompts through guided choices. Supports Seedance 2.0, Veo 3, and generic video models.

---

## 为什么用这个 / Why

大多数 AI 视频工具要求你写英文专业术语（cinematography, depth of field, dolly zoom...）。普通人只知道「高级感」「赛博朋克」「4K」——这个工具把专业维度拆成看得懂的选择题，选完就出 prompt。

Most AI video tools expect English technical vocabulary. Ordinary users only know vague terms like "cinematic feel" or "4K" — this tool breaks down professional dimensions into understandable choices and outputs production-ready prompts.

- **零填空 / Zero typing** — 所有输入都是选择题 / All input is selection-based
- **零费用 / Zero cost** — 本地纯静态页面，不调任何生成 API / Local static site, no paid APIs
- **零登录 / Zero login** — 不需要账户、数据库、支付 / No accounts, databases, or payments
- **即时复制 / Instant copy** — 中文 / 英文 / JSON / Markdown 一键复制

## 支持的输出目标 / Supported Targets

| Target | Style | Notes |
|--------|-------|-------|
| **Seedance 2.0** | 导演式自然语言 / Director-style | 安全合规警告 / Safety constraint warnings |
| **Veo 3 (Google)** | Cinematographic | 原生音频生成 / Native audio generation |
| **Generic Video** | 结构化字段 / Structured fields | 不绑定特定平台 / Platform-agnostic |

## 视频维度 / Video Dimensions (12 dimensions, 134+ options)

用途 / Use case · 主体 / Subject · 场景 / Scene · 镜头构图 / Shot type · 镜头运动 / Camera movement · 画面动作 / Motion · 光线 / Lighting · 风格 / Style · 约束 / Constraints · 声音 / Audio · 比例时长 / Format · 画面文字 / On-screen text

每个选项包含：普通人能看懂的标签和解释 + 专业术语 + 中英文提示词片段 + 适用目标 + 风险提示。

Every option includes: plain-language labels + professional terms + bilingual prompt fragments + target applicability + risk hints.

## 本地运行 / Quick Start

```bash
git clone https://github.com/Klausc06/controllable-prompt-guide.git
cd controllable-prompt-guide
npm install
npm run dev        # http://localhost:3000
```

## 验证 / Verification

```bash
npm test           # 51 tests
npm run lint       # ESLint
npm run typecheck  # tsc --noEmit
npm run build      # static export → out/
```

## 架构 / Architecture

配置驱动 — 新增一个目标工具只需加 2 个文件 + 2 行导入，不改核心代码。
Config-driven — adding a new target requires only 2 new files + 2 import lines, zero changes to core code.

```
src/lib/prompt/
├── types.ts          # 类型定义 / Type definitions
├── registry.ts       # 中央注册表 / Central registry (5 Maps, register/resolve/getAll)
├── init.ts           # 依赖顺序桶文件 / Import-order barrel
├── adapters.ts       # resolveAdapter().render() — no if/else
├── brief.ts          # Brief 构建 + 共享工具 / Brief builder + shared utilities
├── heuristics.ts     # 提示词质量启发 / Prompt quality heuristics
├── options/          # 12 个选项目录 / 12 option catalogs
├── targets/          # 3 个目标工具 / 3 target tool configs
├── renderers/        # 3 个 TargetAdapter 实现 / 3 adapter implementations
├── work-types/       # 作品类型 / Work type definitions
└── validation.ts     # CI 交叉引用校验 / Cross-reference validation
```

## 后续方向 / Roadmap

- 扩充选项目录到 200+ / Expand option catalog to 200+
- Runway Gen-4 adapter
- Canva design brief work type
- Tailwind v4 migration

## License

MIT
