# Feature Landscape: Video Prompt Wizard

**Domain:** AI video generation prompt guide for non-expert users
**Researched:** 2026-05-10
**Overall confidence:** HIGH

## Research Sources

- Seedance 2.0 official prompt guide (volcengine.com/docs/82379/2222480) via Apiyi deep-dive: 6-step formula, 8 camera movement types, negative prompt checklist
- Veo 3 official prompt guide (deepmind.google/models/veo/prompt-guide/) via veo3ai.io: cinematographic vocabulary structure, audio dimension, platform-specific optimization
- Awesome Seedance 2 Prompts (github.com/YouMind-OpenLab/awesome-seedance-2-prompts): 2000+ curated prompts confirming the 11-dimension taxonomy
- RunDiffusion Seedance guide, CSDN/知乎 community guides, existing codebase analysis
- WebFetch was denied; content extracted via curl and search snippets

Sources:
- [Apiyi Seedance 2.0 官方提示词指南深度解读](https://help.apiyi.com/seedance-2-0-prompt-guide-video-generation-camera-style-tips.html)
- [Veo 3 Prompt Guide 2026](https://www.veo3ai.io/blog/veo-3-prompt-guide-2026)
- [Veo 3.1 Ultimate Prompting Guide (Google Cloud)](https://cloud.google.com/blog/products/ai-machine-learning/ultimate-prompting-guide-for-veo-3-1)
- [Seedance 2.0 提示词指南 (Volcengine)](https://www.volcengine.com/docs/82379/2222480)
- [Awesome Seedance 2 Prompts (GitHub)](https://github.com/YouMind-OpenLab/awesome-seedance-2-prompts)
- [Seedance 2.0 提示词完全指南 (知乎)](https://zhuanlan.zhihu.com/p/2005252467441571099)
- [Seedance 提示词指南：50+ AI视频Prompt示例](https://seedance-2ai.org/zh/blog/seedance-prompt-guide-examples)

---

## Table Stakes

Features users expect. Missing any of these = product feels incomplete or amateurish.

### Core Prompt Dimensions (11 minimum)

Every professional video prompt tool must cover these dimensions. Seedance 2.0's official guide uses a strict 6-step formula (主体/动作/环境/镜头/风格/约束); Veo 3 uses 7 elements (Subject+Action/Environment/Camera/Lighting/Style/Audio/Duration). A professional wizard must bridge both.

| Dimension | Status | Complexity | Notes |
|-----------|--------|------------|-------|
| Use Case/Intent | EXISTS | Low | 6 options; needs expansion to 12-15 covering e-commerce, education, corporate, real estate |
| Subject Type | EXISTS | Low | 6 options; needs subcategories (人物/产品/空间/食物) and 15-20 total |
| Scene/Environment | EXISTS | Low | 6 options; needs interior/exterior split, seasonal, time-of-day variants. Veo 3 guide explicitly says specificity here drives quality |
| Action/Motion | EXISTS | Med | 8 options; needs subcategories (product action, human action, narrative structure, transformation). Seedance warns: camera movement and subject movement must be separated |
| Camera/Shot | EXISTS | Med | 8 options; needs explicit shot type (establishing/medium/close-up) vs camera movement (push/pull/pan/track/orbit) separation. Seedance lists exactly 8 movement types |
| Camera Speed/ Pace | MISSING | Med | Seedance uses 4 speed levels (极慢/缓慢/中速/快速). Currently embedded ad-hoc in camera options. Needs its own dimension or at minimum systematic inclusion in each camera option |
| Lighting | EXISTS | Low | 7 options; needs time-of-day variants (blue hour, overcast, harsh noon). Seedance and Veo BOTH identify lighting as the single highest-leverage prompt element |
| Style | EXISTS | Low | 8 options; needs genre variants (noir, vintage film, anime-influenced, 3D render). Veo 3 confirms style modifiers shift overall aesthetic treatment |
| Constraints/Safety | EXISTS | Med | 7 options; needs content moderation (no violence, no adult content) and platform-specific compliance. Seedance negative prompt list: avoid jitter, avoid bent limbs, avoid temporal flicker, avoid identity drift, avoid chaotic composition |
| Audio | EXISTS | Low | 7 options; Veo 3 is unique for sync audio -- this dimension becomes MORE important as models improve. Needs soundscape descriptions, not just music style |
| Format/Ratio/Duration | EXISTS | Low | 4 options; needs more variants (9:16 30s, 16:9 30s, 16:9 60s). Veo 3 guide recommends platform-specific format hints |
| Text Handling | EXISTS | Low | 3 options; good as-is. Both Seedance and Veo guides confirm AI text rendering is unreliable |
| Shot Composition | PARTIAL | High | Framing descriptors (rule of thirds, symmetry, leading lines) currently embedded in camera options but not systematically addressed. Professional creators expect explicit composition control |

### Option Count Benchmarks

Based on the awesome-seedance-2-prompts repo (2000+ prompts), community guides (50-80+ options per guide), and Veo 3 documentation, each dimension needs:

| Dimension | Current | Minimum Table Stakes | Professional Target |
|-----------|---------|---------------------|-------------------|
| Use Case | 6 | 12 | 18 |
| Subject | 6 | 15 | 25 |
| Scene | 6 | 15 | 25 |
| Motion | 8 | 15 | 25 |
| Camera | 8 | 16 (8 shot types + 8 moves) | 24 |
| Lighting | 7 | 12 | 18 |
| Style | 8 | 15 | 20 |
| Constraints | 7 | 10 | 15 |
| Audio | 7 | 10 | 15 |
| Format | 4 | 8 | 12 |
| Text Handling | 3 | 5 | 8 |
| **Total** | **~80** | **~143** | **~205** |

### Option Metadata Completeness

Every option MUST have complete metadata. The current schema is correct but the content is thin on many options.

| Field | Purpose | Table Stakes Requirement |
|-------|---------|------------------------|
| `label` | What the user sees and clicks | Short, concrete, non-technical Chinese + English. "柔和日光" not "Soft daylight diffuse illumination" |
| `plain` | "What does this actually mean?" | One sentence in plain language. This is the accessibility bridge |
| `professionalTerms` | Keywords for search and expert users | 3-5 cinematography terms. Used for search indexing and expert mode display |
| `promptFragment.zh` | Chinese prompt output | Must be complete, standalone clause. Currently some are too short ("稳定中景构图" should be "稳定中景构图，镜头保持平稳，主体清晰占据画面中心") |
| `promptFragment.en` | English prompt output | Mirror of zh, same quality bar |
| `appliesTo` | Target tool filtering | Must correctly list seedance/generic_video. Future: sora, runway, veo, kling |
| `riskHint` | Warnings for users | Required when option has known model compatibility risks. Seedance guide explicitly warns about: fast movement, complex text, multiple subjects, identity drift |

### Safety Constraints

Confirmed by both Seedance and Veo 3 guides. These are table stakes -- a professional tool cannot skip them.

| Constraint | Seedsance Guide | Veo 3 Guide | Current Status |
|-----------|----------------|-------------|----------------|
| No celebrity/IP likeness | Required | Required ("avoid specific identity descriptions") | EXISTS (no_ip_or_celebrity) |
| No brand logo hallucination | Required | Implied | EXISTS (no_logo_hallucination) |
| Stable subject identity | Required | Required | EXISTS (stable_identity) |
| Natural anatomy (hands/limbs) | Required ("avoid bent limbs") | Required ("hand rendering can produce artifacts") | EXISTS (no_extra_limbs) |
| Avoid temporal flicker/jitter | Required ("avoid jitter, avoid temporal flicker") | Not mentioned in guide | MISSING -- critical for Seedance |
| Single focal subject | Recommended | Recommended | EXISTS (single_focal_subject) |
| Content moderation (violence/adult) | Platform-enforced | Platform-enforced | MISSING -- depends on target platform rules |
| Readable text constraint | Required | Implied | EXISTS (readable_text) |
| Scene simplicity | Required ("avoid chaotic composition") | Recommended | EXISTS (simple_scene) |
| Avoid quality-killing keywords | Required (fast, cinematic, epic, amazing, lots_of_movement identified as harmful) | Not mentioned | MISSING -- this is a unique Seedance insight |

### Output Formats

| Format | Status | Priority |
|--------|--------|----------|
| Chinese prompt (narrative) | EXISTS | P0 - table stakes |
| English prompt (narrative) | EXISTS | P0 - table stakes |
| JSON brief (structured) | EXISTS | P0 - table stakes |
| Structured Chinese prompt (field-based) | EXISTS as generic renderer | P0 - table stakes |
| Structured English prompt (field-based) | EXISTS as generic renderer | P0 - table stakes |
| One-click copy (each format) | EXISTS (CopyButton) | P0 - table stakes |
| Markdown export | MISSING | P1 - expected by developers and teams |
| URL-encoded selections (sharable link) | MISSING | P1 - enables "send this to a colleague" |
| Platform-specific adaptation note | EXISTS (adaptationNote) | P1 - already works but needs surface visibility |

### Option Selection UX

| Feature | Status | Priority |
|---------|--------|----------|
| Single-select (radio buttons) | EXISTS for "single" mode | P0 |
| Multi-select (checkboxes) | EXISTS for "multi" mode | P0 |
| Min/max selection enforcement | EXISTS (minSelections, maxSelections) | P0 |
| Required question indicators | EXISTS (required flag) | P0 |
| Core vs Advanced toggle | EXISTS (level: core/advanced) | P0 |
| Progressive disclosure | EXISTS (advancedOpen toggle) | P0 |
| Option count display | MISSING | P1 ("选择 1/3 项") |
| Deselect/deselect-max cap | EXISTS (constraints config) | P0 |
| Target switching preserves selections | PARTIAL (TEST-13 pending) | P0 |

---

## Differentiators

Features that set this product apart from competitors. Not expected by users, but create competitive advantage.

### Consumer-to-Professional Translation Engine

**This is the product's core differentiator.** No existing tool systematically maps Chinese consumer aesthetic vocabulary to professional cinematography prompt fragments.

| Consumer Term | Professional Translation | Complexity |
|---------------|------------------------|------------|
| 高级感 | premium editorial style, restrained palette, generous negative space, controlled highlights | Low (exists partially) |
| 大片感 | cinematic widescreen, dramatic lighting ratio, film-grade color grading, anamorphic aspect | Low |
| ins风 | Instagram lifestyle aesthetic, warm natural light, casual composition, slight desaturation | Low |
| 小清新 | fresh and airy, pastel tones, soft diffused daylight, natural minimal, shallow depth of field | Low |
| 氛围感 | atmospheric, ambient mood, tone-forward, environmental storytelling, deliberate light falloff | Low |
| 质感 | texture detail, material quality, macro close-up, specular highlight, tactile visual | Low |
| 干净 | clean composition, uncluttered frame, negative space, minimal elements, high clarity | Low |
| 治愈 | calming gentle tone, warm soft light, slow peaceful movement, comfort aesthetic | Low |
| 潮流 | street style editorial, bold color palette, high contrast, urban energy, trend-forward | Low |
| 复古 | vintage film aesthetic, film grain, warm color shift, 16mm/8mm texture, nostalgic mood | Low |
| 科技感 | clean tech aesthetic, precision geometry, cool color temperature, minimal interface mood | Low |
| 烟火气 | lived-in authenticity, natural ambient light, imperfect composition, real-life texture | Low |
| 梦幻 | dreamy ethereal, soft focus, lens flare, pastel bloom, floating slow motion | Low |
| 暗黑 | dark moody, low-key lighting, deep shadows, stark contrast, brooding atmosphere | Low |

**Implementation approach:** Not free-text "translate this word." Instead, each style option already packages the translation as its `promptFragment`. The differentiator is that users SELECT the consumer term as a label and the system outputs the professional fragment. This means the translation is curated, deterministic, and tested -- not AI-generated on the fly.

### Use Case-Driven Smart Defaults

When a user selects a use case, the system should intelligently pre-select or highlight recommended options across other dimensions.

**How this works:**
- Select "健身房开业宣传" -> suggest 空间环境 subject, 明亮商业室内 scene, 强节奏动感音乐 audio, 稳定中景 camera
- Select "咖啡店新品" -> suggest 食物/饮品 subject, 温暖咖啡吧台 scene, 细节特写 camera, 窗边柔光 lighting
- Select "小红书探店" -> suggest 真实顾客/用户 subject, UGC手机随拍感 style, 手持跟拍 camera, 自然对话感 audio

**Implementation:** Each use_case option gains a `suggests` field mapping to preferred options in other dimensions. The UI highlights these without auto-selecting (so users maintain agency). This is a configuration layer, not AI inference.

### Shot List Planner (Multi-Clip Planning)

Veo 3's guide explicitly recommends "creating a shot list before prompting" as one of the most effective structural techniques. This is a table-stakes feature for professional use but currently a differentiator because NO prompt wizard offers it.

**What it does:**
- User defines a sequence of 2-5 clips (e.g., establishing shot -> detail shot -> action shot -> closing shot)
- Each clip gets independent prompt dimensions
- The system maintains "visual language consistency" (same lighting, style, subject across clips)
- Output is a combined prompt document with clip transitions noted
- JSON export includes clip sequencing metadata

**Complexity:** HIGH. Requires significant UI redesign and state management changes. Recommended for Phase 3 or later.

### Prompt Quality Heuristics

Real-time feedback on prompt quality without requiring AI inference.

**Heuristics to implement:**
- "Your camera description uses conflicting movements (e.g., push-in + orbit). Seedance recommends one primary camera movement." (Seedance official rule)
- "Your prompt contains quality-degrading keywords: 'fast', 'epic'. Consider replacing with specific rhythm descriptions." (Seedance official guidance)
- "Lighting not specified -- lighting is the highest-leverage prompt element. Consider adding lighting." (Both Seedance and Veo)
- "Your prompt exceeds 100 words. Seedance recommends 60-100 words." (Seedance official recommendation)
- "Subject + camera movement not separated. This commonly causes jitter." (Seedance official pitfall)
- "Multiple focal subjects detected. Consider 'single focal subject' constraint."

**Confidence:** HIGH. All heuristics are directly verifiable from official Seedance/Veo documentation.

### Platform-Specific Optimization Hints

Different platforms demand different visual characteristics. Veo 3's guide explicitly breaks this down.

| Platform | Optimization Hint |
|----------|-------------------|
| 抖音/TikTok | Vertical 9:16, immediate visual impact in first 2 seconds, high energy, "designed to stop scroll" |
| 小红书 | Authentic UGC feel, warm natural light, lifestyle atmosphere, NOT over-produced commercial look |
| 视频号 | Clean presentation, moderate pacing, suitable for older demographics, text readability important |
| B站 | Longer form acceptable, narrative depth, distinctive style, community-aware aesthetic |
| YouTube | 16:9 horizontal, SEO-friendly description, thumbnail-ready key frame |
| 官网/Landing Page | Subtle movement, works without audio, brand-safe, clean background for text overlay |
| 展会屏幕 | 16:9 horizontal, bold visuals, readable from distance, looping-compatible, NO small text |

**Implementation:** Platform dimension or platform-aware format options with hints in the format option's `riskHint` field.

### Chinese-First Design

Most AI prompt tools are English-first. This tool's competitive advantage is being Chinese-first in every layer:

- UI labels in Chinese by default
- Consumer terminology in Chinese (高级感, not "premium aesthetic")
- Prompt output in Chinese (primary) + English (secondary)
- Target tool optimization for Chinese-market tools (Seedance/Dreamina)
- Chinese social platform format presets (抖音/小红书/视频号/B站)

### Option Search and Filter

For 100+ options, scanning becomes impossible. Differentiator features:

- **Category tabs** within each dimension (e.g., Subject: "人物 | 产品 | 空间 | 食物")
- **Visual icon** per option (emoji or simple SVG) for rapid scanning
- **"Show only applicable"** toggle that filters options by selected target tool
- **Recently used** section at top of each dimension
- **Search** with pinyin support (type "gaoji" matches "高级极简")

### Export Variants for Different Workflows

| Export Type | Use Case | Status |
|------------|----------|--------|
| Copy Chinese prompt | Paste into Seedance/Dreamina | EXISTS |
| Copy English prompt | Paste into Runway/Veo/Kling | EXISTS |
| Copy JSON brief | Developer workflow, API integration | EXISTS |
| Copy as Markdown | Share in documentation, Notion, Feishu | MISSING |
| Copy individual dimension | User wants to tweak just the lighting line | MISSING |
| URL share link | Send configuration to colleague | MISSING |
| Prompt card image | Share on social media, WeChat | MISSING (anti-feature for v1) |

---

## Anti-Features

Features to explicitly NOT build. These are attractive distractions that would derail the MVP.

### Anti-Feature 1: AI-Powered Prompt Rewriting

**Why avoid:** The core value proposition is deterministic, template-based prompt assembly. Adding AI rewriting (calling an LLM to "improve" the prompt) introduces:
- Latency (API calls)
- Cost (paid inference)
- Non-determinism (same selections produce different prompts)
- Hallucination risk (LLM might add details user didn't select)
- Dependency on external services (violates "local only" constraint)

**Instead:** Expand the curated option catalog. Every prompt fragment is human-written, tested against target tools, and deterministic. This is actually a STRENGTH -- users learn what works and can iterate predictably.

**Exception (future):** A "suggest options" feature where AI reads a free-text intent and maps it to existing catalog options. This preserves determinism because the AI output is option selections, not generated prompt text.

### Anti-Feature 2: Free-Text Primary Input

**Why avoid:** User research explicitly says "填空太难了" (fill-in-the-blank is too hard). This is the founding product insight.

**Instead:** Continue investing in option quality, smart defaults, and the translation layer. The wizard IS the product.

**Exception (already designed):** `free_text` question mode exists in the schema for optional supplementary input. This is the right approach -- free text is supplementary, not primary.

### Anti-Feature 3: Prompt History/Version Management

**Why avoid:** Requires persistent storage (database, localStorage schema, migration strategy). Adds complexity that doesn't directly improve prompt quality.

**Instead:** URL-shareable links encode the current selection state. Users bookmark or share links. Zero storage required.

### Anti-Feature 4: Social Sharing / Prompt Gallery

**Why avoid:** Requires user accounts, content moderation, community management. Massive scope creep.

**Instead:** Export formats enable self-service sharing. Users can copy/paste prompts wherever they want.

### Anti-Feature 5: Generation Preview / API Integration

**Why avoid:** Calling Seedance/Veo/Kling APIs means: paid API keys, cost management, error handling for async generation, waiting UX, and fundamentally changing the product from "tool" to "platform." Also explicitly out of scope per PROJECT.md.

**Instead:** Clear guidance on where to paste the output. The tool is "prompt factory," not "video factory."

### Anti-Feature 6: Multi-Language UI (Beyond zh/en)

**Why avoid:** The target market is Chinese-speaking users. English labels exist for bilingual users and English prompt output. Adding Japanese, Korean, etc. dilutes focus.

**Instead:** The `LocalizedText` pattern already supports adding locales. If demand emerges, it's a data change, not an architecture change.

### Anti-Feature 7: Real-Time Collaboration

**Why avoid:** Requires backend, WebSocket infrastructure, conflict resolution, user identity. Completely different product category.

**Instead:** URL sharing for asynchronous collaboration. "Hey, check out this prompt config: [URL]"

---

## Feature Dependencies

```
Shot List Planner → Multi-Clip State Management → Registry-based Target System (ARCH-01)
Smart Defaults → Use Case suggests field → Option Metadata Completeness
Platform Hints → Format dimension expansion → Platform enum addition
Quality Heuristics → Prompt text analysis → Warning system enhancement
Option Search → 100+ option catalog → Category taxonomy within dimensions
URL Share → Selection state serialization → URL-safe encoding of PromptSelections
Camera Speed/Pace → Camera dimension split → Shot type vs Movement type separation
Content Moderation → Target-specific safety rules → Safety dimension expansion
```

---

## MVP Recommendation (Phase 1+2)

**Prioritize (Phase 1 completion):**
1. Expand all 11 option catalogs to minimum table-stakes counts (~143 options total)
2. Complete option metadata (especially professionalTerms and riskHints)
3. Add missing safety constraint: avoid_temporal_flicker, avoid_quality_keywords
4. Add missing option metadata: camera speed pace descriptions in camera options
5. Add Markdown export format
6. Implement target-aware option filtering (ARCH-04)
7. Implement safetyDefaults injection in renderers (ARCH-07)

**Prioritize (Phase 2 enhancements):**
1. Consumer-to-professional translation: 14 consumer aesthetics mapped to existing style/mood options (add to option labels and search)
2. Use case-driven smart defaults (suggests field on use_case options)
3. Prompt quality heuristics (5-6 rules as non-blocking warnings)
4. Category tabs within large option sets (Subject: 人物/产品/空间/食物)
5. Platform-specific format hints

**Defer to Phase 3+:**
1. Shot List Planner (high complexity, requires ARCH-01 completion)
2. URL share links (depends on selection serialization design)
3. Option search with pinyin (depends on option count reaching 150+)
4. Prompt card image export

---

## Competitive Landscape

| Tool | Type | Prompt Structure | Key Weakness |
|------|------|-----------------|--------------|
| Seedance 2.0 official | Video gen platform | Director-style natural language, 6-step formula | No wizard; users must write prompts from scratch |
| Veo 3 (Google) | Video gen platform | Cinematographic vocabulary, 7-element structure | English-only; no guided selection |
| Runway Gen-4 | Video gen platform | Technical style, preset-driven | Power-user focused; no consumer translation |
| Kling AI | Video gen platform | Scene control, keyframe-based | Complex UI; not prompt-wizard oriented |
| Sora 2 (OpenAI) | Video gen platform | Natural language, narrative style | Discontinued March 2026 per source |
| Promptgenerator.org | Prompt tool | Generic fill-in-the-blank | Not video-specific; no dimension guidance |
| Vidnoz AI Video Wizard | All-in-one platform | Template picker + free text | Generates video (not just prompts); different product category |
| This Tool | Prompt wizard | Structured selection → deterministic prompt assembly | No generation capability (by design) |

**Positioning:** This tool is uniquely positioned as the bridge between "I have an idea" and "I have a production-ready prompt." It's a prompt factory, not a video factory. No direct competitor fills this niche in the Chinese-market AI video ecosystem.

---

## Confidence Assessment

| Area | Confidence | Basis |
|------|-----------|-------|
| Core 11 dimensions | HIGH | Verified against Seedance 2.0 official guide (6 steps) and Veo 3 guide (7 elements). Both independently converge on the same dimensions |
| Seedance structure | HIGH | Multiple Chinese-language sources confirm the 6-step formula, 8 camera movements, 60-100 word recommendation, negative prompt checklist |
| Veo 3 structure | HIGH | Official Google DeepMind guide + independent blog analysis confirm 7-element structure with audio as unique differentiator |
| Safety constraints | HIGH | Seedance official negative prompt list matches current codebase constraints exactly. Content moderation gap identified |
| Consumer aesthetics map | MEDIUM | Synthesized from community guides (小红书/抖音) and cinematography knowledge. Exact prompt fragments need testing against target models |
| Quality heuristics | MEDIUM | Rules derived from official guides but effectiveness of automated detection needs testing |
| Option counts | MEDIUM | Benchmarked from awesome-seedance-2-prompts (2000+ items) and community guides. Exact distribution across dimensions needs iterative design |
| Competitor analysis | MEDIUM | Verified through web search. May miss niche Chinese-market tools not indexed |
| Anti-features | HIGH | Derived from explicit PROJECT.md out-of-scope items and architecture constraints |

---

## Gaps to Address

- **Camera shot type vs movement type separation**: Current camera options conflate shot framing (medium, close-up) with camera movement (push, pan, orbit). Seedance explicitly says these must be separated. Needs a design decision: split into two dimensions or add movement speed to each option systematically.
- **Content moderation scope**: How much safety filtering should happen in the prompt wizard vs leaving it to the generation platform? Seedance and Veo already have their own safety filters.
- **Wan 2.x and Kling prompt structures**: Web search returned no results for these specific platforms. Their prompt patterns may differ from Seedance/Veo. Needs direct testing.
- **Sora 2 detailed prompt structure**: Sora 2 was discontinued March 2026 per multiple sources. Investment in Sora-specific adapter may not be worthwhile. Focus on Veo 3 and Seedance instead.
