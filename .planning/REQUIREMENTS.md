# Requirements: 可控提示词向导 (Controllable Prompt Guide)

**Defined:** 2026-05-10
**Core Value:** 用户完全不懂专业术语，只靠做选择题，就能得到可复制到 Seedance 2.0 / 通用视频模型里的专业提示词。

## v1 Requirements

Requirements for initial release. Each maps to roadmap phases.

### Architecture Foundation (ARCH)

- [ ] **ARCH-01**: TargetToolId 从硬编码 union type 改为 string + registry 验证，新增 target 不改 types.ts
- [ ] **ARCH-02**: Adapter 从 if/else 分支改为 adapter registry 模式，新增 adapter 不改 adapters.ts
- [ ] **ARCH-03**: PromptGuide 通过 registry/resolver 获取 workType，不直接 import videoPromptWorkType
- [ ] **ARCH-04**: 选项按目标工具的 appliesTo 过滤，UI 不展示不适用的选项
- [ ] **ARCH-05**: Renderer 通过 brief.items 迭代获取内容，不依赖 magic question ID 字符串
- [ ] **ARCH-06**: Generic video renderer 覆盖 text_handling 维度
- [ ] **ARCH-07**: Target safetyDefaults 在渲染时注入 prompt 文本，且 target switch 时预选安全选项
- [ ] **ARCH-08**: 每个 selected option 要么出现在 brief/prompt 中，要么被 suppress 并在 warnings 中说明

### Option Taxonomy (OPT)

- [x] **OPT-01**: 扩充全部 11 个选项目录至最低数量（约 143 个选项），覆盖主体、场景、动作、镜头、运镜、光线、风格、声音、节奏、画面密度、文字处理、安全约束
- [x] **OPT-02**: 每个 option 包含完整的 label/plain/professionalTerms/promptFragment.{zh,en}/appliesTo/riskHint
- [ ] **OPT-03**: 镜头维度拆分为 shot type（构图）和 camera movement（运镜）两个独立维度
- [ ] **OPT-04**: 新增缺失安全约束：avoid_temporal_flicker, avoid_quality_keywords
- [ ] **OPT-05**: Option ID 使用 namespace 前缀（{optionSetId}:{optionId}），防止跨 catalog 碰撞
- [ ] **OPT-06**: Markdown 导出格式

### Validation & Testing (TEST)

- [ ] **TEST-01**: Option ID 唯一性校验（跨所有 catalog）
- [ ] **TEST-02**: Question ID 唯一性校验
- [ ] **TEST-03**: OptionSet 引用有效性校验（question.optionSetId 指向存在的 set）
- [ ] **TEST-04**: AppliesTo target refs 有效性校验（option.appliesTo 中的 target ID 已注册）
- [ ] **TEST-05**: Target adapter 注册完整性校验（每个 target 有对应 adapter）
- [ ] **TEST-06**: Content-level 测试：选择 option X 则 X 的 promptFragment 出现在输出中
- [ ] **TEST-07**: Seedance 和 generic 两种目标输出确实不同
- [ ] **TEST-08**: Seedance 输出包含安全约束文本（不使用明星脸、影视 IP、未授权肖像、品牌侵权）
- [ ] **TEST-09**: Constraints 的 required/min/max/deselect/max cap 行为正确
- [ ] **TEST-10**: JSON brief 可 parse，包含 workTypeId、targetToolId、items
- [ ] **TEST-11**: Copy zh/en/JSON payload 内容正确
- [ ] **TEST-12**: Clipboard failure 有 fallback 状态
- [ ] **TEST-13**: UI 切换 target 不丢失用户选择
- [ ] **TEST-14**: Advanced options 折叠/展开正常
- [ ] **TEST-15**: Browser smoke — 打开 /，切换目标，展开高级，复制 JSON，无 console error

### Research (RES)

- [ ] **RES-01**: 研究 Seedance 2.0 / Dreamina / 火山方舟类视频 prompt 官方或可靠资料
- [ ] **RES-02**: 研究通用视频模型 prompt 最佳实践结构
- [ ] **RES-03**: 预留 Sora / Runway / Veo / Kling / Canva brief 研究

### Differentiators (DIFF)

- [ ] **DIFF-01**: Consumer-to-professional translation — 14 个中国消费者美学词（高级感、ins风、大片感等）映射到专业选项
- [ ] **DIFF-02**: Prompt quality heuristics — 5-6 条来自官方文档的确定性规则作为非阻塞 amber 警告
- [ ] **DIFF-03**: Use case-driven smart defaults — 选择用例后自动高亮建议选项（suggests 字段）
- [ ] **DIFF-04**: Category tabs — 大选项集内部分类标签（如 Subject: 人物/产品/空间/食物）
- [ ] **DIFF-05**: Platform-specific format hints — 抖音/小红书/视频号/B站/YouTube/官网/展会

## v2 Requirements

Deferred to future release. Tracked but not in current roadmap.

### Advanced Features

- **ADV-01**: Shot List Planner — 多镜头计划（2-5 clips with independent dimensions）
- **ADV-02**: URL-shareable links — 选择状态编入 URL
- **ADV-03**: Pinyin search — 拼音搜索选项（输入 "gaoji" 匹配 "高级极简"）
- **ADV-04**: Prompt card image export — 可分享的社交媒体图片
- **ADV-05**: localStorage 持久化 — 保存最近选择
- **ADV-06**: 新 target 支持 — Veo 3, Runway, Kling, Canva brief

### Infrastructure

- **INF-01**: Tailwind v4 迁移（dedicated phase）
- **INF-02**: @vitest/coverage-v8 覆盖率报告（测试超过 50 条后启用）

## Out of Scope

Explicitly excluded. Documented to prevent scope creep.

| Feature | Reason |
|---------|--------|
| 图片/视频生成 API | MVP 成本和安全边界 |
| 登录/注册/用户系统 | 第一版本地工具，不需账户 |
| 数据库/持久化存储 | 第一版只做即时生成和复制 |
| 付费/支付 | 第一版免费工具 |
| Canva API 集成 | 后续版本 |
| AI 改写 prompt（LLM 调用） | 违反 deterministic + local-only 约束 |
| 免费文本输入（主要交互） | 用户明确偏好选择题，避免填空 |
| 图片作品类型 | 第一版只做视频提示词 |
| 小红书封面/海报/PPT/skills | 框架预留，后续扩展 |
| 历史记录/项目管理 | 输出稳定后再加 |
| 移动端 App | Web-first |
| Sora 2 adapter | Sora 2 已于 2026 年 3 月停用 |
| 多语言 UI（zh/en 以外） | 目标市场为中文用户 |
| 实时协作 | 需要后端/WebSocket 基础设施 |
| 社交分享/提示词画廊 | 需要账户/内容审核 |
| Zod 验证库 | TypeScript satisfies 足够配置验证 |
| Zustand/Redux 状态管理 | 单组件树不需要，useReducer 足够 |

## Traceability

Every v1 requirement mapped to exactly one phase. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| ARCH-01 | Phase 2: Registry Architecture | Pending |
| ARCH-02 | Phase 2: Registry Architecture | Pending |
| ARCH-03 | Phase 2: Registry Architecture | Pending |
| ARCH-04 | Phase 3: Metadata Execution | Pending |
| ARCH-05 | Phase 3: Metadata Execution | Pending |
| ARCH-06 | Phase 3: Metadata Execution | Pending |
| ARCH-07 | Phase 1: Safety Foundation | Pending |
| ARCH-08 | Phase 3: Metadata Execution | Pending |
| OPT-01 | Phase 4: Catalog Expansion | Complete |
| OPT-02 | Phase 4: Catalog Expansion | Complete |
| OPT-03 | Phase 4: Catalog Expansion | Pending |
| OPT-04 | Phase 1: Safety Foundation | Pending |
| OPT-05 | Phase 4: Catalog Expansion | Pending |
| OPT-06 | Phase 4: Catalog Expansion | Pending |
| TEST-01 | Phase 2: Registry Architecture | Pending |
| TEST-02 | Phase 2: Registry Architecture | Pending |
| TEST-03 | Phase 2: Registry Architecture | Pending |
| TEST-04 | Phase 3: Metadata Execution | Pending |
| TEST-05 | Phase 2: Registry Architecture | Pending |
| TEST-06 | Phase 3: Metadata Execution | Pending |
| TEST-07 | Phase 3: Metadata Execution | Pending |
| TEST-08 | Phase 1: Safety Foundation | Pending |
| TEST-09 | Phase 3: Metadata Execution | Pending |
| TEST-10 | Phase 7: Integration Testing | Pending |
| TEST-11 | Phase 7: Integration Testing | Pending |
| TEST-12 | Phase 7: Integration Testing | Pending |
| TEST-13 | Phase 3: Metadata Execution | Pending |
| TEST-14 | Phase 7: Integration Testing | Pending |
| TEST-15 | Phase 7: Integration Testing | Pending |
| RES-01 | Phase 6: Quality Intelligence | Pending |
| RES-02 | Phase 6: Quality Intelligence | Pending |
| RES-03 | Phase 8: Hardening & Forward Planning | Pending |
| DIFF-01 | Phase 5: Consumer Translation | Planned |
| DIFF-02 | Phase 6: Quality Intelligence | Pending |
| DIFF-03 | Phase 6: Quality Intelligence | Pending |
| DIFF-04 | Phase 5: Consumer Translation | Planned |
| DIFF-05 | Phase 5: Consumer Translation | Planned |

**Coverage:**
- v1 requirements: 37 total
- Mapped to phases: 37
- Unmapped: 0

---
*Requirements defined: 2026-05-10*
*Last updated: 2026-05-10 after roadmap creation*
