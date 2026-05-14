<!--
Language switcher / 语言切换
-->

English | [中文](./README.zh.md)

---

# 可控提示词向导

> 面向非专业用户的视频提示词生成工具。不需写任何专业术语，只做选择题就能把模糊需求转成可复制到 Seedance 2.0 / Veo 3 / 通用视频模型里的专业提示词。
>
> **v0.1.0 预览版** — 框架完整，选项在扩充中。还不是打磨好的 1.0 成品，欢迎反馈。

## 为什么用这个

大多数 AI 视频工具要求你写英文专业术语（cinematography、depth of field、dolly zoom……）。普通人只知道「高级感」「赛博朋克」「4K」——这个工具把专业维度拆成看得懂的选择题，选完就出 prompt。

- **零填空** — 所有输入都是选择题
- **零费用** — 本地纯静态页面，不调任何付费生成 API
- **零登录** — 不需要账户、数据库、支付
- **即时复制** — 中文 prompt / 英文 prompt / JSON brief / Markdown 一键复制

## 支持的输出目标

| 目标工具 | 提示词风格 | 特点 |
|----------|-----------|------|
| **Seedance 2.0** | 导演式自然语言 | 安全合规警告 |
| **Veo 3 (Google)** | Cinematographic 结构 | 原生音频生成支持 |
| **通用视频模型** | 结构化字段列表 | 不绑定特定平台 |

## 视频维度（12 维，134+ 选项）

用途 · 主体 · 场景 · 镜头构图 · 镜头运动 · 画面动作 · 光线 · 风格 · 约束 · 声音 · 比例时长 · 画面文字

每个选项包含：通俗标签 + 专业术语 + 中英文提示词片段 + 适用目标 + 风险提示。

## 本地运行

```bash
git clone https://github.com/prompt-tools/controllable-prompt-guide.git
cd controllable-prompt-guide
npm install
npm run dev        # http://localhost:3000
```

## 验证

```bash
npm test           # 51 条测试
npm run lint       # ESLint
npm run typecheck  # tsc --noEmit
npm run build      # 静态导出到 out/
```

## 架构

配置驱动 — 新增一个目标工具只需加 2 个文件 + 2 行导入，不改核心代码。

```
src/lib/prompt/
├── types.ts          # 类型定义
├── registry.ts       # 中央注册表（5 Maps, register/resolve/getAll）
├── init.ts           # 依赖顺序桶文件
├── adapters.ts       # resolveAdapter().render() — 无 if/else
├── brief.ts          # Brief 构建 + 共享工具函数
├── heuristics.ts     # 提示词质量启发规则（4 条）
├── options/          # 12 个选项目录
├── targets/          # 3 个目标工具配置
├── renderers/        # 3 个 TargetAdapter 实现
├── work-types/       # 作品类型定义
└── validation.ts     # CI 交叉引用校验
```

## 后续方向

- 扩充选项目录到 200+
- Runway Gen-4 适配器
- Canva 设计 brief 作品类型
- Tailwind v4 迁移

## License

MIT
