# 可控提示词向导 (Controllable Prompt Guide)

## What This Is

一个面向非专业用户的视频提示词向导。通过选择题（非填空）帮普通人把模糊需求转成结构化 brief、中文/英文 prompt 和 JSON 输出。不生成图片/视频，不调用付费 API，不接登录/数据库/支付。第一版目标工具为 Seedance 2.0 和通用视频模型，框架预留扩展到 Canva brief、海报、小红书封面、PPT、skills 创建等。

## Core Value

**用户完全不懂专业术语，只靠做选择题，就能得到可复制到 Seedance 2.0 / 通用视频模型里的专业提示词。**

## Requirements

### Validated

- ✓ **VID-01**: 用户通过选择题（非填空）选择视频用途 — 现有 use_case catalog
- ✓ **VID-02**: 用户通过选择题选择主体类型 — 现有 subject catalog
- ✓ **VID-03**: 用户通过选择题选择场景 — 现有 scene catalog
- ✓ **VID-04**: 用户通过选择题选择画面动作 — 现有 motion catalog
- ✓ **VID-05**: 用户通过选择题选择镜头语言 — 现有 camera catalog
- ✓ **VID-06**: 用户通过选择题选择光线 — 现有 lighting catalog
- ✓ **VID-07**: 用户通过选择题选择风格 — 现有 style catalog
- ✓ **VID-08**: 用户通过选择题选择约束/避免项 — 现有 constraints catalog
- ✓ **VID-09**: 用户通过选择题选择音频处理 — 现有 audio catalog
- ✓ **VID-10**: 用户通过选择题选择格式/比例/时长 — 现有 format catalog
- ✓ **VID-11**: 用户通过选择题选择画面文字策略 — 现有 text_handling catalog
- ✓ **VID-12**: 系统输出结构化 brief — 现有 buildPromptBrief
- ✓ **VID-13**: 系统输出中文 prompt — 现有 renderSeedancePrompt / renderGenericVideoPrompt
- ✓ **VID-14**: 系统输出英文 prompt — 现有 renderSeedancePrompt / renderGenericVideoPrompt
- ✓ **VID-15**: 系统输出 JSON brief 可复制 — 现有 CopyButton + jsonBrief
- ✓ **VID-16**: 用户可在 Seedance 2.0 和通用视频模型间切换 — 现有 target switching
- ✓ **VID-17**: 系统标记为本地模板渲染，不调用生成模型 — 现有 header badge

### Active

- [ ] **ARCH-01**: TargetToolId 从硬编码 union type 改为可扩展注册表
- [ ] **ARCH-02**: Adapter 从 if/else 分支改为 adapter registry 模式
- [ ] **ARCH-03**: PromptGuide 不再直接 import videoPromptWorkType，通过 registry/resolver 驱动
- [ ] **ARCH-04**: 选项按目标工具过滤（appliesTo / prefer / suppress 生效）
- [ ] **ARCH-05**: Renderer 不依赖 magic question ID 字符串
- [ ] **ARCH-06**: Generic renderer 覆盖 text_handling 维度
- [ ] **ARCH-07**: Target safetyDefaults 在渲染时注入 prompt
- [ ] **ARCH-08**: 每个 selected option 要么进入 prompt/brief，要么被 suppress 并给出 warning
- [ ] **OPT-01**: 扩充主体、场景、动作、镜头、运镜、光线、风格、声音、节奏、画面密度、文字处理、安全约束等选项目录
- [ ] **OPT-02**: 每个 option 包含：普通人标签、简短解释、专业词、中文 prompt fragment、英文 prompt fragment、applicable targets、risks/warnings
- [ ] **TEST-01**: 测试 option ID 唯一性（跨 catalog）
- [ ] **TEST-02**: 测试 question ID 唯一性
- [ ] **TEST-03**: 测试 optionSet 引用有效性
- [ ] **TEST-04**: 测试 appliesTo target refs 有效性
- [ ] **TEST-05**: 测试 target adapter 注册完整性
- [ ] **TEST-06**: 测试 selected option 出现在 brief/prompt 或被 suppress/warn
- [ ] **TEST-07**: 测试 Seedance 和 generic 输出确实不同
- [ ] **TEST-08**: 测试 Seedance 输出包含安全约束
- [ ] **TEST-09**: 测试 constraints 的 required/min/max/deselect/max cap
- [ ] **TEST-10**: 测试 JSON brief 可 parse，包含 workTypeId、targetToolId、items
- [ ] **TEST-11**: 测试 copy zh/en/json payload 正确
- [ ] **TEST-12**: 测试 clipboard failure fallback 状态
- [ ] **TEST-13**: 测试 UI 切换 target 不丢选择
- [ ] **TEST-14**: 测试 advanced options 折叠/展开正常
- [ ] **TEST-15**: Browser smoke test — 打开 /，切换目标，展开高级，复制 JSON，无 console error
- [ ] **RES-01**: 研究 Seedance 2.0 / Dreamina / 火山方舟类视频 prompt 官方或可靠资料
- [ ] **RES-02**: 研究通用视频 prompt 最佳实践结构
- [ ] **RES-03**: 预留 Sora / Runway / Veo / Kling / Canva brief 研究

### Out of Scope

| Feature | Reason |
|---------|--------|
| 图片/视频生成 API | MVP 成本和安全边界 |
| 登录/注册/用户系统 | 第一版本地工具，不需账户 |
| 数据库/持久化存储 | 第一版只做即时生成和复制 |
| 付费/支付 | 第一版免费工具 |
| Canva API 集成 | 后续版本 |
| AI 改写 prompt（非模板） | 第一版确定性模板渲染，AI 改写后续增强 |
| 免费文本输入（主要交互） | 用户明确偏好选择题，避免填空 |
| 图片作品类型 | 第一版只做视频提示词 |
| 小红书封面/海报/PPT/skills | 框架预留，后续扩展 |
| 历史记录/项目管理 | 输出稳定后再加 |
| 移动端 App | Web-first |

## Context

- 用户为 macOS 开发者，中文交流
- 项目为 Next.js 15 + TypeScript + Tailwind CSS v3 + Vitest
- 当前全部文件 untracked，需后续整理 git history
- 已有完整代码库地图在 `.planning/codebase/`（7 文档，1197 行）
- 已有项目记忆在 `.memory/`（context, decisions, preferences）
- 已确认 P0 验证通过：npm test (8/8), npm run lint (clean), npm run typecheck (clean), npm run build (success)

## Constraints

- **Tech stack**: Next.js 15 + TypeScript 5.7 + React 19 + Tailwind CSS v3 + Vitest 3
- **No paid APIs**: 不调用任何付费推理或生成 API
- **No backend**: 纯前端，无服务器/数据库
- **No auth**: 无登录/注册
- **Selection-first UX**: 主要交互必须为选择题，避免填空输入
- **Config-driven**: 新增目标工具/作品类型应通过配置和 adapter，不改 UI 主流程
- **Deterministic rendering**: 第一版模板拼接，不做 AI 改写
- **Local only**: 不依赖外部服务（除静态资源 CDN）

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| 第一版只做视频提示词 | 聚焦验证框架，避免过早扩展 | — Pending |
| 选择题优先，不要填空 | 用户明确反馈"填空太难了" | ✓ Good |
| 配置驱动架构 | 方便扩展新目标和作品类型 | — Pending |
| 输出 Seedance + generic 两种格式 | 覆盖具体平台和通用场景 | — Pending |
| 不做图片/视频生成 | 成本和高风险 | ✓ Good |
| 不做登录/数据库/支付 | MVP 只需本地工具 | ✓ Good |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-05-10 after initialization*
