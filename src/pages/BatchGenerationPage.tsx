import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import {
  allKitchenBatchSelections,
  KITCHEN_BATCH_RULE_DISPLAY,
  KITCHEN_PARAMETER_GROUPS,
} from "@/kitchen/params";
import type { KitchenParamKey } from "@/kitchen/params";
import { getBatchCombinationStats } from "@/kitchen/batchCombinatorics";
import { fetchJobs, runBatchJob } from "@/lib/mockApi";
import { KITCHEN_LIMITS, remaining, tryConsume } from "@/lib/kitchenLimits";
import { TalkToTeamModal } from "@/components/contact/TalkToTeamModal";
import { PageHeader } from "@/components/layout/PageHeader";
import { PreviewModeBadge } from "@/components/kitchen/PreviewModeBadge";
import { ErrorPanel } from "@/components/system/ErrorPanel";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Skeleton";
import { useAuth } from "@/context/AuthContext";
import { canUseFeature, FULL_ACCESS_TOOLTIP } from "@/lib/access";

const BATCH_GENERATE_COUNT = 500;

const COMBO_BRUTE_FORCE_CAP = 2_500_000;

const GRID_PREVIEW = 12;

const BATCH_GROUP_LABEL: Partial<Record<string, string>> = {
  "Layout & flow": "LAYOUT",
  Cabinets: "CABINETS",
  "Doors & hardware": "STYLE",
  Appliances: "APPLIANCES",
  Finishes: "FINISHES",
  "Scene conditions": "SCENE CONDITIONS",
};

function initialSelections(): Record<KitchenParamKey, string[]> {
  return allKitchenBatchSelections();
}

function OrangeCheckbox({
  checked,
  onToggle,
  label,
}: {
  checked: boolean;
  onToggle: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      onClick={onToggle}
      className="flex w-full cursor-pointer items-start gap-[var(--s-200)] rounded-br100 py-[6px] text-left text-[13px] text-[var(--text-default-body)] transition-colors hover:bg-[var(--surface-page-secondary)]"
    >
      <span
        className={[
          "mt-[2px] flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-[5px] border-2 transition-[background-color,border-color] duration-200",
          checked
            ? "border-[var(--papaya-500)] bg-[var(--papaya-500)] text-white"
            : "border-[var(--border-default-secondary)] bg-[var(--surface-default)]",
        ].join(" ")}
        aria-hidden
      >
        {checked ? (
          <span className="material-symbols-outlined !text-[14px] leading-none">check</span>
        ) : null}
      </span>
      <span className="leading-snug">{label}</span>
    </button>
  );
}

export type BatchGenerationPageProps = {
  embedded?: boolean;
};

export function BatchGenerationPage({ embedded = false }: BatchGenerationPageProps) {
  const { accessTier } = useAuth();
  const qc = useQueryClient();
  const [selections, setSelections] = useState<Record<KitchenParamKey, string[]>>(initialSelections);
  const [talkOpen, setTalkOpen] = useState(false);
  const batchAllowed = canUseFeature(accessTier, "batch_submit");

  const [simProgress, setSimProgress] = useState(0);
  const [simActive, setSimActive] = useState(false);

  const jobs = useQuery({
    queryKey: ["jobs"],
    queryFn: fetchJobs,
    refetchInterval: batchAllowed ? 4000 : false,
    enabled: batchAllowed,
  });

  const comboStats = useMemo(() => getBatchCombinationStats(selections), [selections]);
  const { raw: rawCount, valid: validCombinations, invalid: invalidCombinations } = comboStats;
  const generateCap = Math.min(BATCH_GENERATE_COUNT, Math.max(0, validCombinations));

  const mutation = useMutation({
    mutationFn: () =>
      runBatchJob({
        environmentId: "env-kitchen-v2",
        selections: selections as unknown as Record<string, string[]>,
      }),
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ["jobs"] });
      if (data.validCombinations > 0 && data.status !== "failed") {
        setSimActive(true);
        setSimProgress(0);
      }
    },
  });

  useEffect(() => {
    if (!simActive) return;
    if (simProgress >= BATCH_GENERATE_COUNT) {
      setSimActive(false);
      return;
    }
    const id = window.setTimeout(() => {
      setSimProgress((p) => Math.min(BATCH_GENERATE_COUNT, p + Math.max(1, Math.ceil((BATCH_GENERATE_COUNT - p) / 25))));
    }, 45);
    return () => window.clearTimeout(id);
  }, [simActive, simProgress]);

  const toggleValue = (key: KitchenParamKey, value: string) => {
    setSelections((prev) => {
      const cur = new Set(prev[key] ?? []);
      if (cur.has(value)) cur.delete(value);
      else cur.add(value);
      const next = Array.from(cur);
      return { ...prev, [key]: next.length ? next : [value] };
    });
  };

  const batchLeft = remaining("batchRuns");

  const headerBlock =
    embedded ? null : (
      <PageHeader
        title="Batch variations"
        titleAfter={!batchAllowed ? <PreviewModeBadge title={FULL_ACCESS_TOOLTIP} /> : null}
        description="Pick parameter ranges to define combinations. The system checks layout rules before you queue runs."
      />
    );

  const showGenGrid = simActive || simProgress >= BATCH_GENERATE_COUNT;

  return (
    <div className={embedded ? "space-y-[var(--s-400)]" : "space-y-[var(--s-500)]"}>
      {headerBlock}

      <div
        className={
          embedded
            ? "flex flex-col gap-[var(--s-400)] lg:flex-row lg:items-start"
            : "grid gap-[var(--s-400)] lg:grid-cols-[minmax(280px,340px)_minmax(0,1fr)] lg:items-start"
        }
      >
        <aside
          className={`order-2 w-full shrink-0 lg:order-1 ${embedded ? "lg:max-w-[min(100%,380px)] lg:min-w-[280px]" : ""}`}
        >
          <div className="max-h-[min(560px,calc(100dvh-14rem))] space-y-[var(--s-500)] overflow-y-auto pr-[var(--s-200)] [-webkit-overflow-scrolling:touch] lg:max-h-[calc(100dvh-12rem)]">
            {(Object.entries(KITCHEN_PARAMETER_GROUPS) as [string, Record<string, readonly string[]>][]).map(
              ([group, params]) => (
                <section key={group} className="space-y-[var(--s-300)]">
                  <h3 className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[var(--text-default-placeholder)]">
                    {BATCH_GROUP_LABEL[group] ?? group}
                  </h3>
                  <div className="space-y-[var(--s-400)]">
                    {Object.entries(params).map(([param, opts]) => {
                      const key = param as KitchenParamKey;
                      return (
                        <div key={param}>
                          <p className="mb-[var(--s-200)] text-[12px] font-semibold uppercase tracking-[0.06em] text-[var(--text-default-heading)]">
                            {param}
                          </p>
                          <div className="flex flex-col gap-[2px]">
                            {opts.map((opt) => (
                              <OrangeCheckbox
                                key={opt}
                                label={opt}
                                checked={Boolean(selections[key]?.includes(opt))}
                                onToggle={() => toggleValue(key, opt)}
                              />
                            ))}
                          </div>
                          {param === "Appliance Preset" ? (
                            <p className="mt-[var(--s-200)] text-[11px] leading-[16px] text-[var(--text-default-placeholder)]">
                              Presets are fixed configs to avoid 2<sup>7</sup> appliance combinations.
                            </p>
                          ) : null}
                        </div>
                      );
                    })}
                  </div>
                </section>
              ),
            )}
          </div>
        </aside>

        <main className="order-1 min-w-0 flex-1 space-y-[var(--s-400)] lg:order-2">
          {embedded ? (
            <div className="rounded-br200 border border-[var(--border-default-secondary)] bg-[var(--surface-default)] p-[var(--s-400)]">
              {!showGenGrid ? (
                <div className="flex min-h-[min(320px,50vh)] flex-col items-center justify-center gap-[var(--s-400)] px-[var(--s-200)] text-center">
                  <span className="material-symbols-outlined text-[44px] text-[var(--text-default-placeholder)]" aria-hidden>
                    grid_view
                  </span>
                  <p className="max-w-[40ch] text-[15px] font-medium text-[var(--text-default-heading)]">
                    Select parameters and generate variations
                  </p>
                  <p className="max-w-[min(52ch,100%)] text-[13px] leading-[22px] text-[var(--text-default-placeholder)]">
                    Batch variations let you generate thousands of unique kitchen configurations for domain randomization in
                    robot training pipelines.
                  </p>
                </div>
              ) : (
                <>
                  <div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-[var(--grey-100)]">
                      <div
                        className="h-full rounded-full bg-[var(--papaya-500)] transition-[width] duration-200 ease-out"
                        style={{
                          width: `${Math.min(100, (simProgress / BATCH_GENERATE_COUNT) * 100)}%`,
                        }}
                      />
                    </div>
                    <p className="mt-[var(--s-200)] text-[13px] text-[var(--text-default-body)]">
                      {simProgress >= BATCH_GENERATE_COUNT ? (
                        <>Complete — {BATCH_GENERATE_COUNT.toLocaleString()} / {BATCH_GENERATE_COUNT.toLocaleString()}</>
                      ) : (
                        <>
                          Generating… {simProgress.toLocaleString()} / {BATCH_GENERATE_COUNT.toLocaleString()}
                        </>
                      )}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-[var(--s-300)] sm:grid-cols-3 xl:grid-cols-4">
                    {Array.from({ length: GRID_PREVIEW }).map((_, i) => {
                      const n = i + 1;
                      const id = `VAR-${String(n).padStart(4, "0")}`;
                      const threshold = ((n - 1) / GRID_PREVIEW) * BATCH_GENERATE_COUNT;
                      const ready = simProgress > threshold || simProgress >= BATCH_GENERATE_COUNT;
                      return (
                        <div
                          key={id}
                          className="flex flex-col items-center overflow-hidden rounded-br200 border border-[var(--border-default-secondary)] bg-[var(--surface-page-secondary)] px-[var(--s-200)] py-[var(--s-400)] text-center"
                        >
                          <span className="material-symbols-outlined text-[22px] text-[var(--text-default-placeholder)]" aria-hidden>
                            kitchen
                          </span>
                          <p className="mt-[var(--s-200)] font-mono text-[12px] text-[var(--text-default-body)]">{id}</p>
                          <p
                            className={`mt-[var(--s-200)] text-[12px] font-semibold ${
                              ready ? "text-[var(--text-success-default)]" : "text-[var(--text-default-placeholder)]"
                            }`}
                          >
                            {ready ? "Ready" : "Queued"}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          ) : (
            <Card title="Batch output">
              {!showGenGrid ? (
                <p className="text-[13px] text-[var(--text-default-body)]">
                  Queue a valid batch to simulate variation tiles and progress here.
                </p>
              ) : (
                <>
                  <div className="mb-[var(--s-400)]">
                    <div className="h-2 w-full overflow-hidden rounded-full bg-[var(--grey-100)]">
                      <div
                        className="h-full rounded-full bg-[var(--papaya-500)] transition-[width] duration-200 ease-out"
                        style={{
                          width: `${Math.min(100, (simProgress / BATCH_GENERATE_COUNT) * 100)}%`,
                        }}
                      />
                    </div>
                    <p className="mt-[var(--s-200)] text-[13px] text-[var(--text-default-body)]">
                      Generating… {simProgress.toLocaleString()} / {BATCH_GENERATE_COUNT.toLocaleString()}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-[var(--s-300)] sm:grid-cols-3 lg:grid-cols-4">
                    {Array.from({ length: GRID_PREVIEW }).map((_, i) => {
                      const n = i + 1;
                      const id = `VAR-${String(n).padStart(4, "0")}`;
                      const threshold = ((n - 1) / GRID_PREVIEW) * BATCH_GENERATE_COUNT;
                      const ready = simProgress > threshold || simProgress >= BATCH_GENERATE_COUNT;
                      return (
                        <div
                          key={id}
                          className="flex flex-col items-center rounded-br200 border border-[var(--border-default-secondary)] bg-[var(--surface-page-secondary)] px-[var(--s-200)] py-[var(--s-400)] text-center"
                        >
                          <span className="material-symbols-outlined text-[22px] text-[var(--text-default-placeholder)]" aria-hidden>
                            kitchen
                          </span>
                          <p className="mt-[var(--s-200)] font-mono text-[12px] text-[var(--text-default-body)]">{id}</p>
                          <p
                            className={`mt-[var(--s-200)] text-[12px] font-semibold ${
                              ready ? "text-[var(--text-success-default)]" : "text-[var(--text-default-placeholder)]"
                            }`}
                          >
                            {ready ? "Ready" : "Queued"}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </Card>
          )}
        </main>
      </div>

      <section
        className="space-y-[var(--s-400)] border-t border-[var(--border-default-secondary)] pt-[var(--s-500)]"
        aria-label="Batch summary and generate"
      >
        <div className="flex flex-col gap-[var(--s-400)] lg:flex-row lg:items-start lg:justify-between lg:gap-[var(--s-600)]">
          <div className="min-w-0 flex-1 space-y-[var(--s-200)] text-[13px] leading-snug text-[var(--text-default-body)]">
            <p>
              <span className="font-semibold text-[var(--text-default-heading)]">Valid combinations count: </span>
              {validCombinations.toLocaleString()}
            </p>
            <p>
              <span className="font-semibold text-[var(--text-default-heading)]">Cartesian product (raw): </span>
              {rawCount.toLocaleString()}
            </p>
            <p>
              <span className="font-semibold text-[var(--text-default-heading)]">Invalid combos: </span>
              <span className="text-[var(--text-default-body)]">− {invalidCombinations.toLocaleString()} invalid</span>
            </p>
            {rawCount > COMBO_BRUTE_FORCE_CAP ? (
              <p className="text-[12px] text-[var(--text-default-placeholder)]">
                Exact counts above {COMBO_BRUTE_FORCE_CAP.toLocaleString()} combinations use deterministic sampling for speed;
                totals update when you change selections.
              </p>
            ) : null}
          </div>
          <div className="w-full shrink-0 space-y-[var(--s-300)] lg:max-w-[min(100%,380px)]">
            {!batchAllowed ? (
              <div className="space-y-[var(--s-300)]">
                <p className="text-[13px] leading-[20px] text-[var(--text-default-body)]">
                  You can explore parameter combinations and validation here. Executing a batch requires full access.
                </p>
                <Button variant="primary" type="button" className="w-full justify-center" onClick={() => setTalkOpen(true)}>
                  Talk to Team
                </Button>
                <Button variant="secondary" type="button" className="w-full justify-center border-dashed opacity-80" disabled title={FULL_ACCESS_TOOLTIP}>
                  Generate batch
                </Button>
              </div>
            ) : (
              <Button
                variant="primary"
                className="w-full justify-center px-[var(--s-300)] py-[var(--s-300)] text-[14px] font-semibold"
                disabled={mutation.isPending || batchLeft === 0 || validCombinations === 0}
                onClick={() => {
                  if (!tryConsume("batchRuns")) {
                    setTalkOpen(true);
                    return;
                  }
                  mutation.reset();
                  setSimProgress(0);
                  setSimActive(false);
                  mutation.mutate();
                }}
              >
                {mutation.isPending
                  ? "Queueing…"
                  : `Generate ${generateCap.toLocaleString()} of ${validCombinations.toLocaleString()} Variations`}
              </Button>
            )}
            {batchAllowed ? (
              <p className="text-center text-[12px] text-[var(--text-default-body)]">
                Batch runs left:{" "}
                <span className="font-mono font-medium text-[var(--text-default-heading)]">
                  {batchLeft} / {KITCHEN_LIMITS.batchRuns}
                </span>
              </p>
            ) : null}
            {mutation.isError ? (
              <p className="text-center text-[13px] text-[var(--text-error-default)]" role="alert">
                Could not queue the job.{" "}
                <button type="button" className="font-medium underline underline-offset-2" onClick={() => mutation.reset()}>
                  Dismiss
                </button>
              </p>
            ) : null}
            {mutation.data ? (
              <p className="text-center font-mono text-[11px] text-[var(--text-default-body)]">
                Job {mutation.data.jobId}
                {mutation.data.invalidRules.length ? ` · ${mutation.data.invalidRules.join("; ")}` : ""}
              </p>
            ) : null}
          </div>
        </div>

        <div>
          <p className="mb-[var(--s-200)] text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--text-default-placeholder)]">
            Rules
          </p>
          <ul className="space-y-[var(--s-200)] text-[12px] leading-[18px] text-[var(--text-default-body)]">
            {KITCHEN_BATCH_RULE_DISPLAY.map((rule) => (
              <li
                key={rule}
                className="rounded-br100 border border-[var(--border-default-secondary)] bg-[var(--surface-page-secondary)] px-[var(--s-300)] py-[var(--s-200)]"
              >
                {rule}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {!embedded ? (
        <section aria-labelledby="job-queue-heading" className="space-y-[var(--s-300)]">
          <h2 id="job-queue-heading" className="text-[15px] font-semibold text-[var(--text-default-heading)]">
            Job queue
          </h2>
          {!batchAllowed ? (
            <div className="flex flex-col items-center gap-[var(--s-300)] rounded-br200 border border-dashed border-[var(--border-default-secondary)] bg-[var(--surface-page-secondary)] px-[var(--s-400)] py-[var(--s-500)] text-center">
              <Badge variant="locked">Locked</Badge>
              <p className="max-w-[40ch] text-[13px] leading-[20px] text-[var(--text-default-body)]">
                Job queue requires full access.
              </p>
              <button
                type="button"
                className="text-[14px] font-medium text-[var(--text-primary-default)] underline underline-offset-2"
                onClick={() => setTalkOpen(true)}
              >
                Talk to Team
              </button>
            </div>
          ) : jobs.isError ? (
            <ErrorPanel message="Could not load the job queue." onRetry={() => jobs.refetch()} />
          ) : jobs.isLoading ? (
            <div className="space-y-[var(--s-300)]" aria-busy="true" aria-live="polite">
              <p className="text-[12px] text-[var(--text-default-body)]">Loading queue…</p>
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
          ) : jobs.data?.length === 0 ? (
            <div className="rounded-br200 border border-dashed border-[var(--border-default-secondary)] bg-[var(--surface-page-secondary)] px-[var(--s-400)] py-[var(--s-500)] text-center">
              <span
                className="material-symbols-outlined mx-auto mb-[var(--s-200)] block text-[28px] text-[var(--text-default-placeholder)]"
                aria-hidden
              >
                inventory_2
              </span>
              <p className="text-[14px] font-medium text-[var(--text-default-heading)]">No jobs yet</p>
              <p className="mt-[var(--s-200)] text-[13px] leading-[20px] text-[var(--text-default-body)]">
                Queued runs appear here with status and progress.
              </p>
            </div>
          ) : (
            <ul className="space-y-[var(--s-200)] text-[13px]">
              {jobs.data?.map((j) => (
                <li key={j.id} className="border-b border-[var(--border-default-secondary)] pb-[var(--s-200)] last:border-0">
                  <div className="flex justify-between gap-[var(--s-200)]">
                    <span className="font-mono text-[12px]">{j.id}</span>
                    <span className="capitalize">{j.status}</span>
                  </div>
                  <div className="mt-[var(--s-100)] h-1 w-full overflow-hidden rounded-full bg-[var(--grey-100)]">
                    <div
                      className={`h-full ${j.status === "failed" ? "bg-[var(--text-error-default)]" : "bg-[var(--text-primary-default)]"}`}
                      style={{ width: `${j.progress}%` }}
                    />
                  </div>
                  {j.errorCode ? (
                    <p className="mt-[var(--s-100)] text-[12px] text-[var(--text-error-default)]">{j.errorCode}</p>
                  ) : null}
                </li>
              ))}
            </ul>
          )}
        </section>
      ) : null}

      <TalkToTeamModal open={talkOpen} onClose={() => setTalkOpen(false)} context="batch" />
    </div>
  );
}
