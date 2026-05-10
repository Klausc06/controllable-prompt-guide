"use client";

import "@/lib/prompt/init";
import { Check, ChevronDown, Clapperboard, Clipboard, Copy, ShieldCheck, SlidersHorizontal } from "lucide-react";
import React, { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { renderPrompt } from "@/lib/prompt/adapters";
import { renderMarkdown } from "@/lib/prompt/brief";
import { getAllTargets, getOptionSet, getOptionsForTarget, resolveWorkType } from "@/lib/prompt/registry";
import type { PromptSelections, QuestionSchema, RenderedPrompt, SelectionValue, TargetToolId } from "@/lib/prompt/types";
import { cn } from "@/lib/utils";

// Resolved lazily to avoid SSR module-evaluation ordering issues
let _workType: ReturnType<typeof resolveWorkType> | undefined;
function getWorkType() {
  if (!_workType) {
    _workType = resolveWorkType("video_prompt");
  }
  return _workType;
}

const defaults: PromptSelections = {
  use_case: "gym_opening",
  subject: "local_storefront",
  scene: "bright_commercial_interior",
  motion: "three_beat_story",
  shot_type: "medium_shot",
  camera_movement: "slow_push_in",
  lighting: "studio_clean",
  style: "cinematic_realism",
  constraints: ["no_ip_or_celebrity", "stable_identity", "readable_text"],
  audio: "upbeat_music",
  format: "vertical_10s",
  text_handling: "short_title_only"
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

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1200);
    } catch {
      // Clipboard denied — silently ignore
    }
  }

  return (
    <Button type="button" onClick={handleCopy} className="h-9">
      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
      {copied ? "已复制" : label}
    </Button>
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

  return (
    <section className="border-b border-slate-200 py-6 last:border-b-0">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold text-slate-950">{question.title.zh}</h2>
          <p className="mt-1 text-sm leading-6 text-slate-600">{question.helper.zh}</p>
        </div>
        {question.required ? (
          <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600">必选</span>
        ) : null}
      </div>

      {question.mode === "free_text" ? (
        <textarea
          value={typeof current === "string" ? current : ""}
          onChange={(event) => onChange(question.id, event.target.value)}
          placeholder={question.placeholder?.zh}
          className="mt-4 min-h-24 w-full resize-y rounded-md border border-slate-200 bg-white p-3 text-sm leading-6 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-500 focus:ring-4 focus:ring-slate-100"
        />
      ) : null}

      {optionSet && applicableOptions.length > 0 ? (
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {applicableOptions.map((option) => {
            const active = selected.includes(option.id);
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => toggleOption(option.id)}
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
                {option.riskHint ? <p className="mt-3 text-xs leading-5 text-amber-700">{option.riskHint.zh}</p> : null}
              </button>
            );
          })}
        </div>
      ) : optionSet ? (
        <p className="mt-4 text-sm leading-6 text-amber-700 rounded-md border border-amber-200 bg-amber-50 p-3">
          当前目标工具不支持此维度的选项。请切换到其他目标工具以展开选择。
        </p>
      ) : null}
    </section>
  );
}

export function PromptGuide() {
  const [targetToolId, setTargetToolId] = useState<TargetToolId>("seedance");
  const [selections, setSelections] = useState<PromptSelections>(defaults);
  const [advancedOpen, setAdvancedOpen] = useState(false);

  const coreQuestions = getWorkType().questions.filter((question) => question.level === "core");
  const advancedQuestions = getWorkType().questions.filter((question) => question.level === "advanced");
  const completedCore = coreQuestions.filter((question) => isComplete(question, selections)).length;

  const rendered = useMemo(
    () =>
      renderPrompt({
        workType: getWorkType(),
        targetToolId,
        rawIntent: "",
        selections
      }),
    [selections, targetToolId]
  );

  const jsonBrief = useMemo(() => JSON.stringify(rendered.brief, null, 2), [rendered.brief]);
  const markdownBrief = useMemo(() => renderMarkdown(rendered), [rendered]);

  function updateSelection(questionId: string, value: SelectionValue) {
    setSelections((current) => ({ ...current, [questionId]: value }));
  }

  return (
    <main className="min-h-screen px-4 py-5 text-slate-950 md:px-6 lg:px-8">
      <div className="mx-auto flex max-w-[1500px] flex-col gap-4">
        <header className="flex flex-col gap-4 border-b border-slate-200 pb-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
              <Clapperboard className="h-4 w-4" />
              {getWorkType().label.zh} · v{getWorkType().version}
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
              {getWorkType().questions.map((question, index) => {
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
                {getAllTargets().map((tool) => {
                  const active = tool.id === targetToolId;
                  return (
                    <button
                      key={tool.id}
                      type="button"
                      onClick={() => {
                        setTargetToolId(tool.id);
                        setSelections((current) => {
                          const currentConstraints = selectionArray(current.constraints);
                          const merged = [...new Set([...currentConstraints, ...tool.safetyDefaults])];
                          return { ...current, constraints: merged };
                        });
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
                  onClick={() => setAdvancedOpen((open) => !open)}
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
