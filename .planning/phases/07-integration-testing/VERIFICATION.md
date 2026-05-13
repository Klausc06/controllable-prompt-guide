# Phase 07: Browser Smoke Test (TEST-15)

A manual, step-by-step browser smoke test covering the full user journey — render, target switching, advanced options toggling, all 4 copy formats, and cross-target state persistence. This document provides reproducible manual QA verification for TEST-15.

## Purpose

Verify the complete PromptGuide user journey in a real browser without console errors, visual regressions, or broken output. The automated TEST-15 covers smoke paths programmatically; this manual test confirms real-browser behavior.

## Prerequisites

- Run `npm run dev` from the project root
- Open `http://localhost:3000` in Chrome, Firefox, or Safari
- Open browser DevTools Console (F12 or Cmd+Option+I)
- Clear the console before starting (right-click console area > "Clear console")

***

## Smoke Test Checklist

Check each step as you go. A **fail** on any step means the build should not ship.

### Step 1: Initial Render

- [ ] Page loads without console errors (red entries)
- [ ] Title "可控提示词向导" is visible in the header
- [ ] Seedance 2.0 card is visually selected by default
- [ ] Core questions render (at least 4 question sections visible in the left/center column)
- [ ] Sidebar shows prompt output (right column: 中文 Prompt heading visible)
- [ ] All 4 copy buttons visible: 复制中文, 复制英文, 复制 JSON, 复制 Markdown

### Step 2: Switch to Generic Video (通用视频模型)

- [ ] Click "通用视频模型" target card
- [ ] Card visually becomes selected (check border/shadow change)
- [ ] Sidebar output updates — brief heading, dimension table, and prompt text change to Generic format
- [ ] No new console errors

### Step 3: Switch to Veo 3 (Google)

- [ ] Click "Veo 3 (Google)" target card
- [ ] Card visually becomes selected
- [ ] Sidebar output updates — brief heading shows cinematographic structure elements
- [ ] Format hint references Veo 3 optimization (subject + action + environment + camera + lighting + style + audio + duration)
- [ ] No new console errors

### Step 4: Switch Back to Seedance

- [ ] Click "Seedance 2.0" target card
- [ ] Output returns to Seedance-style format (dash-separated Chinese prompt, duration section)
- [ ] Sidebar heading reverts to Seedance brief format
- [ ] No new console errors

### Step 5: Expand Advanced Options

- [ ] Click "高级选项" toggle button
- [ ] Chevron icon rotates (expanded state)
- [ ] Advanced sections appear: 格式/比例和时长, 声音怎么处理？, 文字怎么处理？
- [ ] Each advanced section is interactive (clickable options within)
- [ ] No new console errors

### Step 6: Copy All 4 Formats

- [ ] Click "复制中文" — button briefly shows "已复制", then reverts to "复制中文"
  - Paste into a text editor: verify it contains Chinese prompt text with descriptive terms
- [ ] Click "复制英文" — button briefly shows "已复制", then reverts to "复制英文"
  - Paste into a text editor: verify it contains English prompt text
- [ ] Click "复制 JSON" — button briefly shows "已复制", then reverts to "复制 JSON"
  - Paste into a text editor: verify valid JSON with `workTypeId`, `targetToolId`, and `items` array
- [ ] Click "复制 Markdown" — button briefly shows "已复制", then reverts to "复制 Markdown"
  - Paste into a text editor: verify content starts with `# Video Prompt Brief`, contains `| Dimension | Selection |` table, and includes `***` separator before prompt sections
- [ ] No new console errors

### Step 7: Collapse Advanced Options

- [ ] Click "高级选项" toggle again
- [ ] Advanced sections disappear (格式/比例和时长, 声音怎么处理？, 文字怎么处理？)
- [ ] Chevron icon rotates back (collapsed state)
- [ ] No new console errors

### Step 8: Cross-Target Advanced Persistence

- [ ] Click "高级选项" to expand (verify advanced sections appear)
- [ ] Click "通用视频模型" to switch target
- [ ] Verify advanced options stay open (sections remain visible)
- [ ] Click "Seedance 2.0" to switch back
- [ ] Verify advanced options still open throughout
- [ ] No new console errors

***

## Failure Criteria

| Criteria | Action |
|----------|--------|
| Console error (red) at any step | **FAIL** — investigate and fix before shipping |
| Console warning count > 5 | **Investigate** — may indicate React key issues, deprecation, or accessibility gaps |
| Copy content is empty or wrong format | **FAIL** — clipboard path is broken |
| Advanced section does not appear on toggle | **FAIL** — collapse/expand state machine broken |
| Visual regression (layout broken, missing text, misaligned elements) | **FAIL** — UI rendering regression |
| Target switch loses user selections | **FAIL** — state preservation broken |

## Results

| Date | Tester | Browser | Result | Notes |
|------|--------|---------|--------|-------|
|      |        |         |        |       |
