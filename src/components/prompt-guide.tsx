"use client";

import "@/lib/prompt/init";
import { Check, ChevronDown, Clapperboard, Clipboard, Copy, ShieldCheck, SlidersHorizontal, Star } from "lucide-react";
import React, { useMemo, useReducer, useState } from "react";
import { Button } from "@/components/ui/button";
import { renderPrompt } from "@/lib/prompt/adapters";
import { renderMarkdown } from "@/lib/prompt/brief";
import { getAllTargets, getOptionSet, getOptionsByConsumerTerm, getOptionsForTarget, resolveWorkType } from "@/lib/prompt/registry";
import { createInitialState, promptGuideReducer } from "@/lib/prompt/reducer";
import type { PromptSelections, QuestionSchema, RenderedPrompt, SelectionValue, TargetToolId } from "@/lib/prompt/types";
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
function ConsumerTagGroup({
  applicableOptions,
  selectedOptions,
  onToggle
}: {
  applicableOptions: { id: string; consumerTerms?: string[] }[];
  selectedOptions: string[];
  onToggle: (optionId: string) => void;
}) {
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

  return (
    <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="消费者风格快捷入口">
      {terms.map((term) => {
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
      })}
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
      {question.optionSetId === "style" && applicableOptions.length > 0 ? (
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

export function PromptGuide() {
  const [state, dispatch] = useReducer(
    promptGuideReducer,
    "seedance" as TargetToolId,
    (id: TargetToolId) => createInitialState("video_prompt", id, defaults)
  );
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
              <Clapperboard className="h-4 w-4" />
              {workType.label.zh} · v{workType.version}
            </div>
            <h1 className="mt-2 text-2xl font-semibold tracking-normal text-slate-950 md:text-3xl">可控提示词向导</h1>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
              用选择题补齐专业维度，输出可复制的结构化 brief、中文提示词和英文提示词。
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-md border border-slate-200 bg-white p-2">
            <ShieldCheck className="h-4 w-4 text-emerald-700" />
            <span className="text-sm text-slate-700">本地模板渲染，不调用生成模型</span>
          </div>
        </header>

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
    </main>
  );
}
