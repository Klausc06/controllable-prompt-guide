---
phase: 1
slug: safety-foundation
status: draft
shadcn_initialized: false
preset: none
created: 2026-05-11
---

# Phase 1 — UI Design Contract

> Visual and interaction contract for the Controllable Prompt Guide. Documents the custom design system as-implemented. Generated retroactively from the existing codebase (all 8 phases complete). This contract applies project-wide since the design system is consistent across all phases.

---

## Design System

| Property | Value |
|----------|-------|
| Tool | none (custom CSS variables + Tailwind CSS v3) |
| Preset | not applicable |
| Component library | none (hand-built React components) |
| Icon library | lucide-react v0.475.0 |
| Font | System font stack (Tailwind CSS v3 default: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif) |

---

## Spacing Scale

Declared values from Tailwind CSS default scale (1 unit = 4px). Only values actually used in source are listed.

| Token | Value | Tailwind Class | Usage |
|-------|-------|---------------|-------|
| xs | 4px | `p-1`, `mt-1` | Tight inline spacing, icon+text gap in nav |
| sm | 8px | `p-2`, `mt-2`, `gap-2` | Compact padding, tag padding, inline gaps, nav item spacing |
| md-sm | 12px | `p-3`, `mt-3`, `gap-3` | Compact section padding, option grid gap |
| md | 16px | `p-4`, `mt-4`, `gap-4` | Default element padding, layout gaps, section spacing |
| lg-sm | 20px | `p-5`, `py-5` | Section padding, header bottom padding |
| lg | 24px | `py-6` | Question block vertical padding |
| xl | 32px | — | Available on scale, not directly used in current UI |
| 2xl | 40px | `h-10` | Button height |
| compact-button | 36px | `h-9` | Compact button height (copy buttons) |
| option-card-min | 144px | `min-h-36` | Option card minimum height |
| textarea-min | 96px | `min-h-24` | Free-text textarea minimum height |

**Border radius:** 6px (`rounded-md`) on all interactive elements (buttons, cards, inputs, panels).

**Shadows:**
| Token | Value | Usage |
|-------|-------|-------|
| `shadow-panel` | `0 18px 48px rgba(15, 23, 42, 0.08)` | Available for elevated panels (defined but not used in current components) |
| `shadow-soft` | `0 2px 8px rgba(15, 23, 42, 0.06)` | Primary button, hovered option cards |

Exceptions: none. All spacing follows Tailwind's default 4px-based scale.

---

## Typography

| Role | Size | Weight | Line Height | Tailwind Classes |
|------|------|--------|-------------|-----------------|
| Body | 14px | 400 (regular) | 1.5 (21px) | `text-sm leading-6` |
| Label / Tag | 12px | 500 (medium) | 1.25 (15px) | `text-xs leading-5 font-medium` |
| Heading (section) | 16px | 600 (semibold) | 1.5 (24px) | `text-base leading-6 font-semibold` |
| Display (page title) | 24px–30px | 600 (semibold) | normal (tracking-normal) | `text-2xl md:text-3xl font-semibold` |

**Weight palette used:**
- 400 (regular): body text, option descriptions, placeholder text
- 500 (medium): labels, tags, button text, nav items, status badges
- 600 (semibold): section headings, question titles, nav section label, option card titles, target card titles

**Tracking:** `tracking-normal` on page title. All other text uses default tracking.

**Font smoothing:** Not explicitly declared. Inherits browser defaults.

**Consistency rule:** All user-facing body copy uses `text-sm leading-6`. Never use `text-sm` without `leading-6`. Section headings use `text-base leading-6 font-semibold`. Never use `text-base` for body copy.

---

## Color

### CSS Custom Properties (source of truth in `globals.css`)

| Variable | HSL Value | Hex Equivalent |
|----------|-----------|----------------|
| `--background` | `42 33% 98%` | `#faf8f3` (warm off-white) |
| `--foreground` | `224 22% 12%` | `#181b26` (dark navy) |
| `--surface` | `0 0% 100%` | `#ffffff` (pure white) |
| `--muted` | `210 20% 94%` | `#eef1f4` (light gray) |
| `--muted-foreground` | `220 10% 42%` | `#616a78` (medium gray) |
| `--border` | `220 15% 86%` | `#d7dbe2` (border gray) |
| `--accent` | `171 66% 30%` | `#1a7f72` (teal — reserved, not actively used) |
| `--accent-foreground` | `0 0% 100%` | `#ffffff` (white on accent) |

### Functional Color Roles (60/30/10)

| Role | Value / Token | Usage |
|------|--------------|-------|
| Dominant (60%) | `hsl(var(--background))` + warm gradient | Page background. Includes `linear-gradient(180deg, rgba(255,255,255,0.76), rgba(249,246,239,0.95))` + `radial-gradient(circle at 10% 10%, rgba(20,184,166,0.16), transparent 24rem)` for depth |
| Secondary (30%) | White surfaces (`bg-white`), slate-50/100 (`bg-slate-50`, `bg-slate-100`) | Cards, sidebar, nav, option panels, section containers, tag backgrounds |
| Accent (10%) | Slate-950 (`bg-slate-950`, `border-slate-950`, `text-slate-950`) | Primary button backgrounds, active option borders/rings, active target borders |
| Semantic: success | Emerald-600/700/800 + Emerald-100 | Progress bar fill, checkmark icons, completed step indicators |
| Semantic: warning | Amber-50/200/700/800 (`bg-amber-50`, `border-amber-200`, `text-amber-700`, `text-amber-800`) | Risk hints on options, quality heuristic warnings, "no options for target" message |

**Accent reserved for:**
- Active selection state on option cards (`border-slate-950 ring-4 ring-slate-100`)
- Active selection state on target cards (`border-slate-950 ring-4 ring-slate-100`)
- Primary button background (`bg-slate-950`)
- Focus-visible outline on buttons (`outline-slate-900`)
- Selection check indicator fill (`bg-slate-950`)

**Accent is NOT used for:** hover states (hover uses lighter borders like `hover:border-slate-400` or `hover:bg-slate-50`), section dividers (`border-slate-200`), or non-interactive decorations.

**Destructive color:** Not applicable. This application has no destructive actions (no delete, no reset, no clear-all).

---

## Component Inventory

### 1. Button (`src/components/ui/button.tsx`)

```typescript
type ButtonVariant = "primary" | "secondary" | "ghost";
```

| Variant | Base Classes | States |
|---------|-------------|--------|
| `primary` | `bg-slate-950 text-white shadow-soft` | hover: `bg-slate-800` |
| `secondary` | `border border-slate-200 bg-white text-slate-900` | hover: `border-slate-300 bg-slate-50` |
| `ghost` | `text-slate-700` | hover: `bg-slate-100` |

**Shared:** `inline-flex h-10 items-center justify-center gap-2 rounded-md px-3 text-sm font-medium transition`
**Focus-visible:** `outline outline-2 outline-offset-2 outline-slate-900`
**Disabled:** `pointer-events-none opacity-50`

### 2. QuestionBlock (inline in `prompt-guide.tsx`)

Option selection block supporting `single` and `multi` select modes.

**Option card states:**
- Default: `border-slate-200 bg-white`
- Hover: `hover:border-slate-400 hover:shadow-soft`
- Selected: `border-slate-950 ring-4 ring-slate-100`

**Selection indicator:**
- Default: `border-slate-300 bg-white` (empty circle, 20x20px)
- Selected: `border-slate-950 bg-slate-950 text-white` (filled with checkmark)

**Status badge (required/optional):**
- Required, complete: `bg-slate-100 text-slate-600` — shows "已选"
- Required, incomplete: `bg-slate-100 text-slate-600` — shows "必选"
- Required, multi with min: `bg-slate-100 text-slate-600` — shows "已选 N/M+"
- Optional: `bg-slate-50 text-slate-400` — shows "可选"

**Free-text textarea:**
- Default: `border-slate-200 bg-white placeholder:text-slate-400`
- Focus: `border-slate-500 ring-4 ring-slate-100`

### 3. CopyButton (inline in `prompt-guide.tsx`)

- Base: `Button variant="secondary"` at `h-9` (36px compact)
- Default icon: `<Copy />` (16x16px)
- Copied state (1200ms): `<Check />` icon, label changes to "已复制"
- Error (clipboard denied): Silently ignored — no visual feedback

### 4. TargetSelector (inline in `prompt-guide.tsx`)

Radio-like card selector for target tool.

**States:**
- Default: `border-slate-200 bg-white`
- Hover: `hover:border-slate-400`
- Selected: `border-slate-950 ring-4 ring-slate-100` with `<Check />` icon in emerald-700

### 5. ProgressSidebar (inline in `prompt-guide.tsx`)

Left sidebar with navigation and progress tracking.

**Progress bar:** `h-2 rounded-full` with emerald-600 fill (`transition-all`). Shows "核心项 N/M" count.

**Nav items:**
- Default: `text-slate-700` with numbered badge `bg-slate-100 text-slate-500`
- Hover: `hover:bg-slate-100`
- Completed: badge becomes `bg-emerald-100 text-emerald-800` with `<Check />` icon
- Link behavior: anchor scroll to `#questionId`

### 6. AdvancedToggle (inline in `prompt-guide.tsx`)

Collapsible section for advanced options.

- Trigger: `border-slate-200 bg-slate-50` with `<SlidersHorizontal />` icon
- Chevron: rotates 180deg when open (`rotate-180` transition)
- Content: slides in/out (CSS transition via conditional render)

### 7. OutputPanel (inline in `prompt-guide.tsx`)

Right sidebar with rendered output.

- Brief cards: `border-slate-200 bg-white rounded-md p-3` with `text-xs font-semibold text-slate-500` label
- Chinese prompt: inverted code block `bg-slate-950 text-slate-50`
- English prompt: subtle code block `bg-slate-50 text-slate-800`
- Warning box: `border-amber-200 bg-amber-50 text-amber-800` (deduplicated warnings)

---

## Interactive States Contract

| Element | Default | Hover | Active/Selected | Focus | Disabled | Transient |
|---------|---------|-------|----------------|-------|----------|-----------|
| Button (primary) | `bg-slate-950 text-white` | `bg-slate-800` | Same as hover | `outline-2 outline-slate-900` | `opacity-50` | — |
| Button (secondary) | `border bg-white` | `border-slate-300 bg-slate-50` | Same as hover | `outline-2 outline-slate-900` | `opacity-50` | — |
| Button (ghost) | `text-slate-700` | `bg-slate-100` | Same as hover | `outline-2 outline-slate-900` | `opacity-50` | — |
| Option card | `border-slate-200 bg-white` | `border-slate-400 shadow-soft` | `border-slate-950 ring-4 ring-slate-100` | Same as default | — | — |
| Target card | `border-slate-200 bg-white` | `border-slate-400` | `border-slate-950 ring-4 ring-slate-100` | Same as default | — | — |
| Nav item | `text-slate-700` | `bg-slate-100` | — | Same as default | — | — |
| Copy button | Default icon | — | — | — | — | 1200ms checkmark "已复制" |
| Advanced toggle | `bg-slate-50` | — | Chevron rotates 180deg | Same as default | — | — |
| Textarea | `border-slate-200` | — | `border-slate-500 ring-4 ring-slate-100` | Same as active | — | — |

**Transition timing:** All interactive state changes use `transition` class (Tailwind default: 150ms cubic-bezier). The exception is the progress bar which uses `transition-all` for width animation.

**Ring width:** Selection rings are always `ring-4` (4px) in `ring-slate-100`. Focus rings on buttons use `outline-2 outline-offset-2`.

---

## Color Token Mapping (Tailwind)

Tailwind color tokens mapped to semantic roles. All values use the default Tailwind palette.

| Role | Slate | Emerald | Amber | White |
|------|-------|---------|-------|-------|
| Page background | — | — | — | warm gradient over `--background` |
| Card/panel surface | — | — | — | `bg-white` |
| Subtle surface | `bg-slate-50`, `bg-slate-100` | — | — | — |
| Border (default) | `border-slate-200` | — | — | — |
| Border (hover) | `border-slate-300`, `border-slate-400` | — | — | — |
| Border (active/selected) | `border-slate-950` + `ring-slate-100` | — | — | — |
| Primary text | `text-slate-950`, `text-slate-900` | — | — | — |
| Secondary text | `text-slate-600`, `text-slate-700` | — | — | — |
| Muted text | `text-slate-500`, `text-slate-400` | — | — | — |
| Inverted text | `text-white`, `text-slate-50` | — | — | — |
| Success indicator | — | `bg-emerald-600` | — | — |
| Success text/icon | — | `text-emerald-700`, `text-emerald-800` | — | — |
| Success surface | — | `bg-emerald-100` | — | — |
| Warning surface | — | — | `bg-amber-50` | — |
| Warning border | — | — | `border-amber-200` | — |
| Warning text | — | — | `text-amber-700`, `text-amber-800` | — |

**No custom colors beyond default Tailwind palette.** The `--accent` CSS variable (teal `hsl(171 66% 30%)`) is defined but not used in any component classes. Retained in `globals.css` for potential future use.

---

## Copywriting Contract

| Element | Copy (zh) | Copy (en) | Context |
|---------|-----------|-----------|---------|
| Page title | 可控提示词向导 | Controllable Prompt Guide | `<h1>` page heading |
| Page subtitle | 用选择题补齐专业维度，输出可复制的结构化 brief、中文提示词和英文提示词。 | — | Hero description |
| Privacy notice | 本地模板渲染，不调用生成模型 | — | Header badge with ShieldCheck icon |
| Target section label | 目标工具 | Target Tool | Section heading |
| Progress label | 核心项 {N}/{M} | Core items {N}/{M} | Progress bar count |
| Navigation label | 流程进度 | Progress | Sidebar section heading |
| Required badge | 必选 | Required | Incomplete required question |
| Completed badge | 已选 | Selected | Completed question |
| Multi-select badge | 已选 {N}/{M}+ | Selected {N}/{M}+ | Multi-select with minSelections |
| Optional badge | 可选 | Optional | Non-required question |
| Advanced toggle | 高级选项 | Advanced Options | Collapsible trigger |
| Copy zh prompt | 复制中文 | Copy Chinese | Primary CTA button |
| Copy en prompt | 复制英文 | Copy English | Primary CTA button |
| Copy JSON | 复制 JSON | Copy JSON | Primary CTA button |
| Copy Markdown | 复制 Markdown | Copy Markdown | Primary CTA button |
| Copy success | 已复制 | Copied | 1200ms transient state |
| Output section label | 实时输出 | Live Output | Output panel heading |
| Brief section label | Brief | Brief | Output section subheading |
| Zh prompt label | 中文 Prompt | Chinese Prompt | Output section subheading |
| En prompt label | English Prompt | English Prompt | Output section subheading |
| No options for target | 当前目标工具不支持此维度的选项。请切换到其他目标工具以展开选择。 | The current target tool does not support options for this dimension. Switch to another target tool to expand choices. | Empty state when target has no options for a dimension |
| Warning label | (dynamic — from heuristics or risk hints) | (dynamic) | Amber warning box in output panel |
| Safety deselection warning | 安全默认项已取消：{id} | Safety defaults deselected: {id} | When user deselects a safetyDefault |

**Primary CTA:** The application has four co-equal copy actions: "复制中文", "复制英文", "复制 JSON", "复制 Markdown". No single primary CTA dominates.

**Empty state:** One empty state exists — when a target tool has no applicable options for a dimension (e.g., Seedance-specific dimension viewed under Generic Video). Copy: "当前目标工具不支持此维度的选项。请切换到其他目标工具以展开选择。"

**Error state:** No blocking error states. Warnings are non-blocking amber alerts. Clipboard failure is silently ignored (design decision: no error feedback for denied clipboard access).

**Destructive actions:** None in this application. No delete, reset, clear-all, or undo operations.

**Tone:** Professional, instructional, concise. Bilingual zh-CN primary with en labels for technical terms. No playful or casual language.

---

## Accessibility

| Element | Pattern | Status |
|---------|---------|--------|
| Progress bar | `role="progressbar"`, `aria-valuenow`, `aria-valuemin`, `aria-valuemax` | Implemented |
| Navigation | `role="navigation"` on sidebar `<nav>` | Implemented |
| Focus management | `focus-visible:outline-2 focus-visible:outline-offset-2` on buttons | Implemented |
| Keyboard navigation | Native `<button>` elements for all interactive controls | Implemented |
| Selection indicator | `aria-hidden="true"` on decorative check indicator spans | Implemented |
| Disabled state | `disabled:pointer-events-none disabled:opacity-50` on buttons | Implemented |
| Screen reader text | Not explicitly implemented — relies on visible labels | Acceptable for v1 |
| Language | `<html lang="zh-CN">` on root layout | Implemented |
| Color contrast | Slate-950 (#0f172a) on white: 15.8:1 ratio. Slate-600 (#475569) on white: 6.1:1 ratio. Emerald-600 (#059669) on white: 4.6:1 ratio | Acceptable |

---

## Registry Safety

| Registry | Blocks Used | Safety Gate |
|----------|-------------|-------------|
| none | not applicable | not applicable |

No third-party component registries. All components are hand-built in `src/components/`. Icons from lucide-react v0.475.0 (official npm package, MIT license).

---

## Implementation Notes

### CSS Variable Architecture

CSS custom properties in `:root` define the design token layer. Tailwind `theme.extend.colors` maps these to Tailwind utility classes. Components use Tailwind classes exclusively — no direct `var()` references in component code.

This means:
- Tokens in `globals.css` are the single source of truth for brand colors
- Tailwind config is the bridge layer
- Components only use Tailwind utility classes (`bg-background`, `text-foreground`, etc.)
- Changing a token value in `globals.css` propagates everywhere without component changes

### Color Usage Pattern

The `--accent` CSS variable (teal) is defined but unused by components. Instead, the design uses:
- Slate-950 for interactive emphasis (active borders, primary buttons)
- Emerald-600/700 for success and completion indicators
- Amber-50/200/700 for warnings and risk information

This is intentional: the teal accent is reserved for a potential brand refresh, not deprecated. The current slate+emerald+amber palette was chosen for its neutrality and accessibility.

### Tailwind v3 Specifics

- All spacing uses Tailwind's default 4px-based scale (no custom spacing tokens)
- All typography uses Tailwind's default type scale (no custom font sizes)
- All colors use Tailwind's default palette plus CSS variable bridge colors
- No arbitrary value overrides (`text-[14px]`, `h-[37px]`, etc.) in any component
- No custom Tailwind plugins
- `tailwind-merge` + `clsx` via `cn()` utility for class composition

---

## Checker Sign-Off

- [ ] Dimension 1 Copywriting: PENDING
- [ ] Dimension 2 Visuals: PENDING
- [ ] Dimension 3 Color: PENDING
- [ ] Dimension 4 Typography: PENDING
- [ ] Dimension 5 Spacing: PENDING
- [ ] Dimension 6 Registry Safety: PENDING

**Approval:** pending
