"use client";

import "@/lib/prompt/init";
import { AlertTriangle, Check, ChevronDown, Clapperboard, Clipboard, Copy, Image, ShieldCheck, SlidersHorizontal, Star } from "lucide-react";
import React, { useEffect, useMemo, useReducer, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { renderPrompt } from "@/lib/prompt/adapters";
import { renderMarkdown } from "@/lib/prompt/brief";
import { getAllOptionSets, getAllTargets, getOptionSet, getOptionsByConsumerTerm, getOptionsForTarget, resolveWorkType } from "@/lib/prompt/registry";
import { createInitialState, promptGuideReducer, type PromptGuideState } from "@/lib/prompt/reducer";
import type { PromptSelections, QuestionSchema, RenderedPrompt, SelectionValue, TargetToolId, WorkTypeId } from "@/lib/prompt/types";
import { cn } from "@/lib/utils";

const defaults: PromptSelections = {
  use_case: ["use_case:gym_opening"],
  subject: ["subject:local_storefront"],
  scene: ["scene:bright_commercial_interior"],
  motion: ["motion:three_beat_story"],
  shot_type: ["shot_type:medium_shot"],
  camera_movement: ["camera_movement:slow_push_in"],
  lighting: ["lighting:studio_clean"],
  style: ["style:cinematic_realism"],
  constraints: ["constraints:no_ip_or_celebrity", "constraints:stable_identity", "constraints:readable_text"],
  audio: ["audio:upbeat_music"],
  format: ["format:vertical_10s"],
  text_handling: ["text_handling:short_title_only"]
};

const imageDefaults: PromptSelections = {
  use_case: ["image_use_case:social_media_post"],
  subject: ["image_subject:hero_product"],
  scene: ["image_scene:studio_env"],
  composition: ["image_composition:centered"],
  lighting: ["image_lighting:soft_dreamy"],
  art_style: ["image_art_style:photorealistic"],
  constraints: [
    "image_constraints:no_ip_celebrity",
    "image_constraints:no_nsfw",
    "image_constraints:no_bad_anatomy",
    "image_constraints:no_low_quality"
  ]
};

function selectionArray(value: SelectionValue | undefined): string[] {
  if (!value) {
    return [];
  }
  return Array.isArray(value) ? value : [value];
}

function isComplete(question: QuestionSchema, selections: PromptSelections) {
  const value = selections[question.id];
  if (question.mode === "free_text") {
    return typeof value === "string" && value.trim().length > 0;
  }
  return selectionArray(value).length >= (question.minSelections ?? 1);
}

function BriefPreview({ rendered }: { rendered: RenderedPrompt }) {
  return (
    <div className="space-y-3">
      {rendered.brief.items.map((item) => (
        <div key={item.questionId} className="rounded-md border border-slate-200 bg-white p-3">
          <div className="text-xs font-semibold text-slate-500">{item.title.zh}</div>
          <div className="mt-1 text-sm text-slate-900">
            {item.freeText || item.selectedOptions.map((option) => option.label.zh).join("、")}
          </div>
        </div>
      ))}
    </div>
  );
}

function CopyButton({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);
  const [fallbackValue, setFallbackValue] = useState<string | null>(null);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1200);
    } catch {
      setFallbackValue(value);
    }
  }

  return (
    <>
      <Button type="button" onClick={handleCopy} className="h-9">
        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
        {copied ? "已复制" : label}
      </Button>
      {fallbackValue && (
        <textarea
          readOnly
          value={fallbackValue}
          onClick={(e) => (e.target as HTMLTextAreaElement).select()}
          className="mt-2 w-full h-20 text-xs font-mono rounded border border-amber-200 bg-amber-50 p-2"
        />
      )}
    </>
  );
}

// ── Shared Option Card ─────────────────────────────────────────────────
function OptionCard({
  option,
  active,
  onToggle,
  suggested = false
}: {
  option: {
    id: string;
    label: { zh: string; en: string };
    plain: { zh: string; en: string };
    professionalTerms: string[];
    riskHint?: { zh: string; en: string };
    usageHint?: { zh: string; en: string };
  };
  active: boolean;
  onToggle: (id: string) => void;
  suggested?: boolean;
}) {
  return (
    <button
      key={option.id}
      type="button"
      onClick={() => onToggle(option.id)}
      className={cn(
        "min-h-36 rounded-md border bg-white p-4 text-left transition hover:border-slate-400 hover:shadow-soft",
        active ? "border-slate-950 ring-4 ring-slate-100" : "border-slate-200"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-sm font-semibold text-slate-950">{option.label.zh}</div>
          <p className="mt-2 text-sm leading-6 text-slate-600">{option.plain.zh}</p>
        </div>
        <span
          className={cn(
            "flex h-5 w-5 shrink-0 items-center justify-center rounded border",
            active ? "border-slate-950 bg-slate-950 text-white" : "border-slate-300 bg-white"
          )}
          aria-hidden="true"
        >
          {active ? <Check className="h-3.5 w-3.5" /> : null}
        </span>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {option.professionalTerms.slice(0, 3).map((term) => (
          <span key={term} className="rounded-md bg-slate-100 px-2 py-1 text-xs text-slate-600">
            {term}
          </span>
        ))}
      </div>
      {option.usageHint ? (
        <div className="mt-2">
          <span className="inline-flex items-center rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-medium text-indigo-700 border border-indigo-100">
            {option.usageHint.zh}
          </span>
        </div>
      ) : null}
      {suggested ? (
        <div className="mt-2">
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-700 border border-amber-200">
            <Star className="h-3 w-3" />
            推荐
          </span>
        </div>
      ) : null}
      {option.riskHint ? <p className="mt-3 text-xs leading-5 text-amber-700">{option.riskHint.zh}</p> : null}
    </button>
  );
}

// ── Consumer Aesthetics Quick-Entry Tags ───────────────────────────────
const MAX_VISIBLE_TAGS = 20;

const PRIORITY_TERMS = new Map([
  ["高级感", 1], ["ins风", 2], ["大片感", 3], ["胶片感", 4], ["极简风", 5],
  ["国风", 6], ["新中式", 7], ["二次元", 8], ["赛博朋克", 9], ["科技感", 10],
  ["复古风", 11], ["手绘感", 12], ["水彩风", 13], ["水墨风", 14], ["油画风", 15],
  ["厚涂", 16], ["扁平风", 17], ["像素风", 18], ["街头风", 19], ["可爱风", 20]
]);

function ConsumerTagGroup({
  applicableOptions,
  selectedOptions,
  onToggle
}: {
  applicableOptions: { id: string; consumerTerms?: string[] }[];
  selectedOptions: string[];
  onToggle: (optionId: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);

  const consumerTermMap = useMemo(() => {
    const map = new Map<string, string>();
    for (const option of applicableOptions) {
      if (option.consumerTerms) {
        for (const term of option.consumerTerms) {
          map.set(term, option.id);
        }
      }
    }
    return map;
  }, [applicableOptions]);

  const terms = [...consumerTermMap.keys()];

  const sortedTerms = terms.sort((a, b) => {
    const pa = PRIORITY_TERMS.get(a) ?? 999;
    const pb = PRIORITY_TERMS.get(b) ?? 999;
    return pa - pb;
  });
  const visibleTerms = sortedTerms.slice(0, MAX_VISIBLE_TAGS);
  const hiddenTerms = expanded ? sortedTerms.slice(MAX_VISIBLE_TAGS) : [];

  function renderTag(term: string) {
    const optionId = consumerTermMap.get(term);
    const active = optionId ? selectedOptions.includes(optionId) : false;
    return (
      <button
        key={term}
        type="button"
        onClick={() => optionId && onToggle(optionId)}
        aria-pressed={active}
        className={cn(
          "inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs font-normal transition-colors duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900",
          active
            ? "bg-teal-700 text-white shadow-lg ring-1 ring-teal-700/20"
            : "bg-slate-100 text-slate-700 hover:bg-slate-200"
        )}
      >
        {term}
      </button>
    );
  }

  return (
    <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="消费者风格快捷入口">
      {visibleTerms.map(renderTag)}
      {sortedTerms.length > MAX_VISIBLE_TAGS && (
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="inline-flex items-center gap-1 rounded-full px-3 py-2 text-xs font-normal bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
        >
          {expanded ? "收起" : `+ ${sortedTerms.length - MAX_VISIBLE_TAGS} 更多`}
        </button>
      )}
      {hiddenTerms.map(renderTag)}
    </div>
  );
}

// ── Category Tabs ─────────────────────────────────────────────────────
function CategoryTabs({
  categories,
  applicableOptions,
  selectedOptions,
  onToggle,
  suggestedIds
}: {
  categories: { id: string; label: { zh: string; en: string }; optionIds: string[] }[];
  applicableOptions: {
    id: string;
    label: { zh: string; en: string };
    plain: { zh: string; en: string };
    professionalTerms: string[];
    promptFragment: { zh: string; en: string };
    riskHint?: { zh: string; en: string };
  }[];
  selectedOptions: string[];
  onToggle: (optionId: string) => void;
  suggestedIds: Set<string>;
}) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  // null = "全部" (All) mode

  const visibleOptions = activeCategory
    ? applicableOptions.filter((opt) =>
        categories.find((c) => c.id === activeCategory)?.optionIds.includes(opt.id)
      )
    : applicableOptions;

  return (
    <>
      <div className="mt-3 flex flex-wrap gap-2" role="tablist" aria-label="选项分类">
        <button
          type="button"
          role="tab"
          aria-selected={activeCategory === null}
          onClick={() => setActiveCategory(null)}
          className={cn(
            "rounded-md px-3 py-1.5 text-xs font-normal transition-colors duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900",
            activeCategory === null
              ? "bg-slate-950 text-white shadow-md"
              : "bg-white/60 backdrop-blur-md text-slate-600 hover:bg-white/80"
          )}
        >
          全部
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            role="tab"
            aria-selected={activeCategory === cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={cn(
              "rounded-md px-3 py-1.5 text-xs font-normal transition-colors duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900",
              activeCategory === cat.id
                ? "bg-slate-950 text-white shadow-md"
                : "bg-white/60 backdrop-blur-md text-slate-600 hover:bg-white/80"
            )}
          >
            {cat.label.zh}
          </button>
        ))}
      </div>
      {/* Render option grid based on active category */}
      {activeCategory === null ? (
        // "全部" mode: group by category with headers
        categories.map((cat) => {
          const catOptions = applicableOptions.filter((opt) => cat.optionIds.includes(opt.id));
          if (catOptions.length === 0) return null;
          return (
            <div key={cat.id}>
              <h3 className="mt-4 mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                {cat.label.zh}
              </h3>
              <div className="grid gap-3 sm:grid-cols-2">
                {catOptions.map((option) => {
                  const active = selectedOptions.includes(option.id);
                  return <OptionCard key={option.id} option={option} active={active} onToggle={onToggle} suggested={suggestedIds.has(option.id)} />;
                })}
              </div>
            </div>
          );
        })
      ) : (
        // Single category: flat grid
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {visibleOptions.map((option) => {
            const active = selectedOptions.includes(option.id);
            return <OptionCard key={option.id} option={option} active={active} onToggle={onToggle} suggested={suggestedIds.has(option.id)} />;
          })}
        </div>
      )}
    </>
  );
}

function QuestionBlock({
  question,
  selections,
  onChange,
  targetToolId
}: {
  question: QuestionSchema;
  selections: PromptSelections;
  onChange: (questionId: string, value: SelectionValue) => void;
  targetToolId: TargetToolId;
}) {
  const current = selections[question.id];
  const selected = selectionArray(current);
  const optionSet = question.optionSetId ? getOptionSet(question.optionSetId) : null;
  const applicableOptions = question.optionSetId
    ? getOptionsForTarget(question.optionSetId, targetToolId)
    : [];

  function toggleOption(optionId: string) {
    if (question.mode === "single") {
      onChange(question.id, optionId);
      return;
    }

    const exists = selected.includes(optionId);
    const next = exists ? selected.filter((id) => id !== optionId) : [...selected, optionId];
    const limited = question.maxSelections ? next.slice(0, question.maxSelections) : next;
    onChange(question.id, limited);
  }

  // Compute suggested option IDs from selected use case(s)
  const suggestedIds = useMemo(() => {
    const ids = new Set<string>();
    const useCaseSelections = selectionArray(selections["use_case"]);
    const useCaseSet = getOptionSet("use_case");
    if (!useCaseSet) return ids;
    for (const useCaseId of useCaseSelections) {
      const useCaseOption = useCaseSet.options.find((o) => o.id === useCaseId);
      if (useCaseOption?.suggests) {
        for (const suggestedOptionIds of Object.values(useCaseOption.suggests)) {
          for (const id of suggestedOptionIds) {
            ids.add(id);
          }
        }
      }
    }
    return ids;
  }, [selections]);

  return (
    <section className="border-b border-slate-200 py-6 last:border-b-0">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold text-slate-950">{question.title.zh}</h2>
          <p className="mt-1 text-sm leading-6 text-slate-600">{question.helper.zh}</p>
        </div>
        {question.required ? (
          <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600">
            {question.mode === "multi" && question.minSelections
              ? `已选 ${selected.length}/${question.minSelections}+`
              : question.mode === "multi"
                ? `已选 ${selected.length}`
                : selected.length > 0
                  ? "已选"
                  : "必选"}
          </span>
        ) : (
          <span className="rounded-md bg-slate-50 px-2 py-1 text-xs font-medium text-slate-400">可选</span>
        )}
      </div>

      {/* Consumer aesthetics quick-entry tags (DIFF-01) */}
      {applicableOptions.some(opt => opt.consumerTerms?.length) ? (
        <ConsumerTagGroup
          applicableOptions={applicableOptions}
          selectedOptions={selected}
          onToggle={toggleOption}
        />
      ) : null}

      {/* Category tabs (DIFF-04) */}
      {optionSet?.categories && applicableOptions.length > 0 ? (
        <CategoryTabs
          categories={optionSet.categories}
          applicableOptions={applicableOptions}
          selectedOptions={selected}
          onToggle={toggleOption}
          suggestedIds={suggestedIds}
        />
      ) : null}


      {question.mode === "free_text" ? (
        <textarea
          value={typeof current === "string" ? current : ""}
          onChange={(event) => onChange(question.id, event.target.value)}
          placeholder={question.placeholder?.zh}
          className="mt-4 min-h-24 w-full resize-y rounded-md border border-slate-200 bg-white p-3 text-sm leading-6 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-500 focus:ring-4 focus:ring-slate-100"
        />
      ) : null}

      {optionSet && applicableOptions.length > 0 && !optionSet.categories ? (
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {applicableOptions.map((option) => {
            const active = selected.includes(option.id);
            return <OptionCard key={option.id} option={option} active={active} onToggle={toggleOption} suggested={suggestedIds.has(option.id)} />;
          })}
        </div>
      ) : optionSet && applicableOptions.length === 0 ? (
        <p className="mt-4 text-sm leading-6 text-amber-700 rounded-md border border-amber-200 bg-amber-50 p-3">
          当前目标工具不支持此维度的选项。请切换到其他目标工具以展开选择。
        </p>
      ) : null}
    </section>
  );
}

// ── URL/LocalStorage Persistence Helpers ────────────────────────────────

function rebuildSelectionsFromOptionIds(
  optionIds: string[],
  workTypeId: WorkTypeId
): PromptSelections {
  const workType = resolveWorkType(workTypeId);
  const selections: PromptSelections = {};

  // Build optionSetId → questionId map from work type
  const setToQuestion = new Map<string, string>();
  for (const q of workType.questions) {
    if (q.optionSetId) {
      setToQuestion.set(q.optionSetId, q.id);
    }
  }

  // Build optionId → optionSetId map by checking all option sets
  const optionToSet = new Map<string, string>();
  const allSets = getAllOptionSets();
  for (const set of allSets) {
    for (const opt of set.options) {
      optionToSet.set(opt.id, set.id);
    }
  }

  // Group option IDs by question
  for (const optionId of optionIds) {
    const setId = optionToSet.get(optionId);
    if (!setId) continue; // invalid option ID, skip
    const questionId = setToQuestion.get(setId);
    if (!questionId) continue; // option set not used by this work type, skip

    if (!selections[questionId]) {
      selections[questionId] = [];
    }
    (selections[questionId] as string[]).push(optionId);
  }

  return selections;
}

function readFromURL(): { workTypeId: WorkTypeId; targetToolId: TargetToolId; selections: PromptSelections; advancedOpen: boolean } | null {
  try {
    if (typeof window === "undefined") return null;
    const params = new URLSearchParams(window.location.search);
    const wt = params.get("wt");
    const t = params.get("t");
    const sel = params.get("sel");
    const adv = params.get("adv");

    // Must have at least a work type to restore from URL
    if (!wt) return null;

    // Validate work type
    try { resolveWorkType(wt); } catch { return null; }
    const workTypeId = wt as WorkTypeId;

    // Validate target — must support the work type
    let targetToolId: TargetToolId;
    if (t) {
      const target = getAllTargets().find(tg => tg.id === t && tg.supportedWorkTypes.includes(workTypeId));
      if (target) {
        targetToolId = t as TargetToolId;
      } else {
        // Invalid target for this work type, use first compatible
        const first = getAllTargets().find(tg => tg.supportedWorkTypes.includes(workTypeId));
        if (!first) return null;
        targetToolId = first.id;
      }
    } else {
      const first = getAllTargets().find(tg => tg.supportedWorkTypes.includes(workTypeId));
      if (!first) return null;
      targetToolId = first.id;
    }

    // Rebuild selections
    let selections: PromptSelections = {};
    if (sel) {
      const optionIds = sel.split(",").filter(Boolean);
      selections = rebuildSelectionsFromOptionIds(optionIds, workTypeId);
    }

    const advancedOpen = adv === "1";

    return { workTypeId, targetToolId, selections, advancedOpen };
  } catch {
    return null;
  }
}

/** Stub — full implementation in Task 2 */
function readFromLocalStorage(): { workTypeId: WorkTypeId; targetToolId: TargetToolId; selections: PromptSelections; advancedOpen: boolean } | null {
  return null;
}

function resolveInitialState(): { workTypeId: WorkTypeId; targetToolId: TargetToolId; selections: PromptSelections; advancedOpen: boolean } {
  // Priority 1: URL params
  const fromURL = readFromURL();
  if (fromURL) {
    // Apply defaults if selections are empty
    if (Object.keys(fromURL.selections).length === 0) {
      fromURL.selections = fromURL.workTypeId === "image_prompt" ? { ...imageDefaults } : { ...defaults };
    }
    return fromURL;
  }

  // Priority 2: localStorage
  const fromStorage = readFromLocalStorage();
  if (fromStorage) {
    if (Object.keys(fromStorage.selections).length === 0) {
      fromStorage.selections = fromStorage.workTypeId === "image_prompt" ? { ...imageDefaults } : { ...defaults };
    }
    return fromStorage;
  }

  // Priority 3: hardcoded defaults — always start in video mode
  const firstVideoTarget = getAllTargets().find(t => t.supportedWorkTypes.includes("video_prompt"));
  return {
    workTypeId: "video_prompt",
    targetToolId: firstVideoTarget?.id ?? "seedance",
    selections: { ...defaults },
    advancedOpen: false
  };
}

export function PromptGuide() {
  const [state, dispatch] = useReducer(
    promptGuideReducer,
    null as unknown as PromptGuideState,
    (): PromptGuideState => {
      const initial = resolveInitialState();
      return {
        ...createInitialState(initial.workTypeId, initial.targetToolId, initial.selections),
        advancedOpen: initial.advancedOpen
      };
    }
  );
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const pendingWorkTypeRef = useRef<WorkTypeId | null>(null);
  const [zeroTargetError, setZeroTargetError] = useState(false);
  const { targetToolId, selections, advancedOpen, deselectedSafety } = state;
  const workType = resolveWorkType(state.workTypeId);

  const coreQuestions = workType.questions.filter((question) => question.level === "core");
  const advancedQuestions = workType.questions.filter((question) => question.level === "advanced");
  const completedCore = coreQuestions.filter((question) => isComplete(question, selections)).length;

  const rendered = useMemo(
    () =>
      renderPrompt({
        workType: workType,
        targetToolId,
        rawIntent: "",
        selections
      }),
    [selections, targetToolId, workType]
  );

  const jsonBrief = useMemo(() => JSON.stringify(rendered.brief, null, 2), [rendered.brief]);
  const markdownBrief = useMemo(() => renderMarkdown(rendered), [rendered]);

  // URL encoding: replaceState on every state change (D-15, D-16)
  useEffect(() => {
    const params = new URLSearchParams();

    // Work type
    params.set("wt", state.workTypeId);

    // Target tool
    params.set("t", state.targetToolId);

    // Selections — compact comma-separated option IDs
    const selParts: string[] = [];
    for (const [, value] of Object.entries(state.selections)) {
      const ids = Array.isArray(value) ? value : [value];
      for (const id of ids) {
        selParts.push(id);
      }
    }
    if (selParts.length > 0) {
      params.set("sel", selParts.join(","));
    }

    // Advanced open (only when true — keep URLs clean)
    if (state.advancedOpen) {
      params.set("adv", "1");
    }

    const qs = params.toString();
    const url = qs ? `${window.location.pathname}?${qs}` : window.location.pathname;
    window.history.replaceState(null, "", url);
  }, [state.workTypeId, state.targetToolId, state.selections, state.advancedOpen]);

  function updateSelection(questionId: string, value: SelectionValue) {
    const question = workType.questions.find((q) => q.id === questionId);
    if (question?.mode === "free_text") {
      dispatch({ type: "OPTION_SELECTED", questionId, optionId: value as string });
      return;
    }
    // For choice questions — diff old vs new and dispatch individual actions
    const newArray = selectionArray(value);
    const prevArray = selectionArray(selections[questionId]);
    const added = newArray.filter((id) => !prevArray.includes(id));
    const removed = prevArray.filter((id) => !newArray.includes(id));
    // For single mode, just dispatch OPTION_SELECTED for the new value (replaces old)
    if (question?.mode === "single") {
      if (added.length === 0 && removed.length === 0) return;
      if (added.length > 0)
        dispatch({ type: "OPTION_SELECTED", questionId, optionId: added[0] });
      else if (removed.length > 0)
        dispatch({ type: "OPTION_DESELECTED", questionId, optionId: removed[0] });
      return;
    }
    // For multi mode, dispatch add/remove individually
    for (const id of added) {
      dispatch({ type: "OPTION_SELECTED", questionId, optionId: id });
    }
    for (const id of removed) {
      dispatch({ type: "OPTION_DESELECTED", questionId, optionId: id });
    }
  }

  return (
    <main className="min-h-screen px-4 py-5 text-slate-950 md:px-6 lg:px-8">
      <div className="mx-auto flex max-w-[1500px] flex-col gap-4">
        <header className="flex flex-col gap-4 border-b border-slate-200 pb-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
              {state.workTypeId === "image_prompt" ? (
                <Image className="h-4 w-4" />
              ) : (
                <Clapperboard className="h-4 w-4" />
              )}
              {workType.label.zh} · v{workType.version}
            </div>
            <h1 className="mt-2 text-2xl font-semibold tracking-normal text-slate-950 md:text-3xl">可控提示词向导</h1>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
              用选择题补齐专业维度，输出可复制的结构化 brief、中文提示词和英文提示词。
            </p>
            <p className="mt-1 text-xs text-slate-400">
              当前模式：{state.workTypeId === "image_prompt" ? "图片提示词" : "视频提示词"}
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-md border border-slate-200 bg-white p-2">
            <ShieldCheck className="h-4 w-4 text-emerald-700" />
            <span className="text-sm text-slate-700">本地模板渲染，不调用生成模型</span>
          </div>
        </header>

        {/* Work Type Switcher */}
        <div className="flex items-center justify-center gap-2" role="radiogroup" aria-label="作品类型">
          <button
            type="button"
            aria-pressed={state.workTypeId === "video_prompt"}
            onClick={() => {
              if (state.workTypeId === "video_prompt") return;
              if (Object.keys(state.selections).length > 0) {
                pendingWorkTypeRef.current = "video_prompt";
                setShowConfirmDialog(true);
              } else {
                dispatch({ type: "WORK_TYPE_CHANGED", from: state.workTypeId, to: "video_prompt" });
              }
            }}
            className={cn(
              "inline-flex items-center gap-2 rounded-md px-4 py-2 text-xs font-normal transition-colors duration-150",
              "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900",
              state.workTypeId === "video_prompt"
                ? "bg-slate-950 text-white shadow-md ring-1 ring-slate-950/10"
                : "bg-white/60 backdrop-blur-md text-slate-600 hover:bg-white/80"
            )}
          >
            <Clapperboard className="h-4 w-4" />
            <span>视频</span>
          </button>
          <button
            type="button"
            aria-pressed={state.workTypeId === "image_prompt"}
            onClick={() => {
              if (state.workTypeId === "image_prompt") return;
              if (Object.keys(state.selections).length > 0) {
                pendingWorkTypeRef.current = "image_prompt";
                setShowConfirmDialog(true);
              } else {
                dispatch({ type: "WORK_TYPE_CHANGED", from: state.workTypeId, to: "image_prompt" });
              }
            }}
            className={cn(
              "inline-flex items-center gap-2 rounded-md px-4 py-2 text-xs font-normal transition-colors duration-150",
              "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900",
              state.workTypeId === "image_prompt"
                ? "bg-slate-950 text-white shadow-md ring-1 ring-slate-950/10"
                : "bg-white/60 backdrop-blur-md text-slate-600 hover:bg-white/80"
            )}
          >
            <Image className="h-4 w-4" />
            <span>图片</span>
          </button>
        </div>

        {/* Zero-target error banner */}
        {zeroTargetError && (
          <div className="mx-auto mt-3 max-w-md rounded-md border border-amber-200 bg-amber-50 p-3 text-center text-sm text-amber-800">
            当前作品类型没有可用的目标工具。
            <button
              type="button"
              onClick={() => {
                dispatch({ type: "WORK_TYPE_CHANGED", from: state.workTypeId, to: "video_prompt" });
                setZeroTargetError(false);
              }}
              className="ml-2 underline hover:text-amber-900"
            >
              切换回视频模式
            </button>
          </div>
        )}

        <div className="grid gap-4 lg:grid-cols-[230px_minmax(0,1fr)_430px]">
          <aside className="self-start rounded-md border border-slate-200 bg-white p-4 lg:sticky lg:top-4">
            <div className="text-sm font-semibold text-slate-950">流程进度</div>
            <div
              className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100"
              role="progressbar"
              aria-valuenow={completedCore}
              aria-valuemin={0}
              aria-valuemax={coreQuestions.length}
            >
              <div
                className="h-full rounded-full bg-emerald-600 transition-all"
                style={{ width: `${Math.round((completedCore / coreQuestions.length) * 100)}%` }}
              />
            </div>
            <div className="mt-2 text-xs text-slate-500">
              核心项 {completedCore}/{coreQuestions.length}
            </div>
            <nav className="mt-5 space-y-2" role="navigation">
              {workType.questions.map((question, index) => {
                const done = isComplete(question, selections);
                return (
                  <a
                    key={question.id}
                    href={`#${question.id}`}
                    className="flex items-center gap-3 rounded-md px-2 py-2 text-sm text-slate-700 hover:bg-slate-100"
                  >
                    <span
                      className={cn(
                        "flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-xs font-semibold",
                        done ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-500"
                      )}
                    >
                      {done ? <Check className="h-3.5 w-3.5" /> : index + 1}
                    </span>
                    <span className="truncate">{question.title.zh}</span>
                  </a>
                );
              })}
            </nav>
          </aside>

          <div className="rounded-md border border-slate-200 bg-white">
            <section className="border-b border-slate-200 p-5">
              <div className="text-sm font-semibold text-slate-950">目标工具</div>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {getAllTargets().filter(t => t.supportedWorkTypes.includes(state.workTypeId)).map((tool) => {
                  const active = tool.id === targetToolId;
                  return (
                    <button
                      key={tool.id}
                      type="button"
                      onClick={() => {
                        dispatch({ type: "TARGET_CHANGED", from: targetToolId, to: tool.id });
                      }}
                      className={cn(
                        "rounded-md border bg-white p-4 text-left transition hover:border-slate-400",
                        active ? "border-slate-950 ring-4 ring-slate-100" : "border-slate-200"
                      )}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="font-semibold text-slate-950">{tool.label.zh}</div>
                        {active ? <Check className="h-4 w-4 text-emerald-700" /> : null}
                      </div>
                      <p className="mt-2 text-sm leading-6 text-slate-600">{tool.description.zh}</p>
                    </button>
                  );
                })}
              </div>
            </section>

            <div className="px-5">
              {coreQuestions.map((question) => (
                <div id={question.id} key={question.id}>
                  <QuestionBlock question={question} selections={selections} onChange={updateSelection} targetToolId={targetToolId} />
                </div>
              ))}

              <section className="py-5">
                <button
                  type="button"
                  onClick={() => dispatch({ type: "TOGGLE_ADVANCED" })}
                  className="flex w-full items-center justify-between rounded-md border border-slate-200 bg-slate-50 px-4 py-3 text-left"
                >
                  <span className="flex items-center gap-2 text-sm font-semibold text-slate-950">
                    <SlidersHorizontal className="h-4 w-4" />
                    高级选项
                  </span>
                  <ChevronDown className={cn("h-4 w-4 transition", advancedOpen ? "rotate-180" : "")} />
                </button>
                {advancedOpen ? (
                  <div className="mt-2 border-t border-slate-200">
                    {advancedQuestions.map((question) => (
                      <div id={question.id} key={question.id}>
                        <QuestionBlock question={question} selections={selections} onChange={updateSelection} targetToolId={targetToolId} />
                      </div>
                    ))}
                  </div>
                ) : null}
              </section>
            </div>
          </div>

          <aside className="self-start rounded-md border border-slate-200 bg-white p-4 lg:sticky lg:top-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-sm font-semibold text-slate-950">实时输出</div>
                <p className="mt-1 text-xs leading-5 text-slate-500">{rendered.adaptationNote.zh}</p>
              </div>
              <Clipboard className="h-5 w-5 text-slate-500" />
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <CopyButton label="复制中文" value={rendered.zhPrompt} />
              <CopyButton label="复制英文" value={rendered.enPrompt} />
              <CopyButton label="复制 JSON" value={jsonBrief} />
              <CopyButton label="复制 Markdown" value={markdownBrief} />
            </div>

            {rendered.warnings.length > 0 ? (
              <div className="mt-4 rounded-md border border-amber-200 bg-amber-50 p-3 text-xs leading-5 text-amber-800">
                {Array.from(new Set(rendered.warnings.map((warning) => warning.zh))).map((warning) => (
                  <p key={warning}>{warning}</p>
                ))}
              </div>
            ) : null}

            <div className="mt-5 space-y-5">
              <section>
                <div className="mb-2 text-xs font-semibold uppercase text-slate-500">Brief</div>
                <BriefPreview rendered={rendered} />
              </section>

              <section>
                <div className="mb-2 text-xs font-semibold uppercase text-slate-500">中文 Prompt</div>
                <pre className="max-h-72 overflow-auto whitespace-pre-wrap rounded-md border border-slate-200 bg-slate-950 p-4 text-sm leading-6 text-slate-50">
                  {rendered.zhPrompt}
                </pre>
              </section>

              <section>
                <div className="mb-2 text-xs font-semibold uppercase text-slate-500">English Prompt</div>
                <pre className="max-h-72 overflow-auto whitespace-pre-wrap rounded-md border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-800">
                  {rendered.enPrompt}
                </pre>
              </section>
            </div>
          </aside>
        </div>
      </div>

      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30"
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              setShowConfirmDialog(false);
              pendingWorkTypeRef.current = null;
            }
            if (e.key === "Enter" && pendingWorkTypeRef.current) {
              dispatch({ type: "WORK_TYPE_CHANGED", from: state.workTypeId, to: pendingWorkTypeRef.current });
              setShowConfirmDialog(false);
              pendingWorkTypeRef.current = null;
            }
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowConfirmDialog(false);
              pendingWorkTypeRef.current = null;
            }
          }}
        >
          <div className="mx-4 w-full max-w-sm rounded-xl bg-white p-6 shadow-2xl">
            <div className="flex flex-col items-center gap-4 text-center">
              <AlertTriangle className="h-5 w-5 text-amber-600" />
              <div>
                <h3 className="text-base font-semibold text-slate-950">切换作品类型</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  切换作品类型将清除当前所有选择。确认切换？
                </p>
                <p className="mt-1 text-xs text-slate-400">
                  Switching work type will clear all current selections. Continue?
                </p>
              </div>
            </div>
            <div className="mt-6 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setShowConfirmDialog(false);
                  pendingWorkTypeRef.current = null;
                }}
                className="h-8 rounded-md border border-slate-200 bg-white px-4 text-sm font-normal text-slate-700 transition hover:bg-slate-50"
              >
                保留选择
              </button>
              <button
                type="button"
                onClick={() => {
                  if (pendingWorkTypeRef.current) {
                    dispatch({ type: "WORK_TYPE_CHANGED", from: state.workTypeId, to: pendingWorkTypeRef.current });
                  }
                  setShowConfirmDialog(false);
                  pendingWorkTypeRef.current = null;
                }}
                className="h-8 rounded-md bg-slate-950 px-4 text-sm font-normal text-white transition hover:bg-slate-800"
              >
                确认切换
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
