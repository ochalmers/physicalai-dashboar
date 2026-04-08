import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { defaultKitchenValues, KITCHEN_PARAMETER_GROUPS } from "@/kitchen/params";
import type { KitchenParamKey } from "@/kitchen/params";
import { fetchJobs, runBatchJob } from "@/lib/mockApi";
import { BatchGenerationAccessModal } from "@/components/batch/BatchGenerationAccessModal";
import { PageHeader } from "@/components/layout/PageHeader";
import { PreviewModeBadge } from "@/components/kitchen/PreviewModeBadge";
import { Callout } from "@/components/system/Callout";
import { ErrorPanel } from "@/components/system/ErrorPanel";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Skeleton";
import { useAuth } from "@/context/AuthContext";
import { ACCESS_COPY, canUseFeature, FULL_ACCESS_TOOLTIP } from "@/lib/access";

const ALL_KEYS = Object.keys(defaultKitchenValues()) as KitchenParamKey[];

function initialSelections(): Record<KitchenParamKey, string[]> {
  const base = defaultKitchenValues();
  const out = {} as Record<KitchenParamKey, string[]>;
  for (const k of ALL_KEYS) {
    out[k] = [base[k]];
  }
  return out;
}

function combinationCount(sel: Record<KitchenParamKey, string[]>) {
  let n = 1;
  for (const k of ALL_KEYS) {
    const arr = sel[k] ?? [];
    n *= Math.max(1, arr.length);
  }
  return n;
}

function groupCombinationCount(
  groupParams: Record<string, readonly string[]>,
  selections: Record<KitchenParamKey, string[]>,
): number {
  let n = 1;
  for (const key of Object.keys(groupParams) as KitchenParamKey[]) {
    n *= Math.max(1, selections[key]?.length ?? 1);
  }
  return n;
}

const PREVIEW_RULES = [
  {
    id: "CR-09",
    test: (s: Record<KitchenParamKey, string[]>) =>
      s.Layout?.includes("U-Shape") && s.Island?.includes("true"),
    message: "U-Shape + island violates clearance rule CR-09",
  },
];

export function BatchGenerationPage() {
  const { accessTier } = useAuth();
  const qc = useQueryClient();
  const [selections, setSelections] = useState<Record<KitchenParamKey, string[]>>(initialSelections);
  const [accessModalOpen, setAccessModalOpen] = useState(false);
  const batchAllowed = canUseFeature(accessTier, "batch_submit");

  const jobs = useQuery({
    queryKey: ["jobs"],
    queryFn: fetchJobs,
    refetchInterval: batchAllowed ? 4000 : false,
    enabled: batchAllowed,
  });

  const rawCount = useMemo(() => combinationCount(selections), [selections]);
  const brokenRules = useMemo(
    () => PREVIEW_RULES.filter((r) => r.test(selections)).map((r) => r.message),
    [selections],
  );

  const mutation = useMutation({
    mutationFn: () =>
      runBatchJob({
        environmentId: "env-kitchen-v2",
        selections: selections as unknown as Record<string, string[]>,
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["jobs"] }),
  });

  const toggleValue = (key: KitchenParamKey, value: string) => {
    setSelections((prev) => {
      const cur = new Set(prev[key] ?? []);
      if (cur.has(value)) cur.delete(value);
      else cur.add(value);
      const next = Array.from(cur);
      return { ...prev, [key]: next.length ? next : [value] };
    });
  };

  return (
    <div className="space-y-[var(--s-400)]">
      <PageHeader
        title="Batch variations"
        titleAfter={
          !batchAllowed ? (
            <PreviewModeBadge label="Explore" title={FULL_ACCESS_TOOLTIP} />
          ) : null
        }
        description="Select environment and parameter ranges, validate rules, then queue variation jobs."
      />

      <div
        className="flex flex-wrap gap-x-[var(--s-500)] gap-y-[var(--s-200)] rounded-br200 border border-[var(--border-default-secondary)] bg-[var(--surface-page-secondary)] px-[var(--s-400)] py-[var(--s-300)] text-[13px] text-[var(--text-default-body)]"
        aria-label="Workflow steps"
      >
        <span>
          <strong className="text-[var(--text-default-heading)]">1.</strong> Environment — Kitchen
        </span>
        <span>
          <strong className="text-[var(--text-default-heading)]">2.</strong> Parameter ranges
        </span>
        <span>
          <strong className="text-[var(--text-default-heading)]">3.</strong> Review combinations
        </span>
        <span>
          <strong className="text-[var(--text-default-heading)]">4.</strong> Queue job
          {!batchAllowed ? " (Full access)" : ""}
        </span>
      </div>

      {!batchAllowed ? (
        <Callout variant="info" title="Explore">
          <p className="text-[14px]">{ACCESS_COPY.batchGated}</p>
          <p className="mt-[var(--s-200)] text-[13px]">
            <Link to="/account" className="font-medium text-[var(--text-primary-default)] underline underline-offset-2">
              Enable Full
            </Link>{" "}
            under Account to queue jobs on this device.
          </p>
        </Callout>
      ) : null}

      <div className="grid gap-[var(--s-400)] lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-[var(--s-300)]">
          {(Object.entries(KITCHEN_PARAMETER_GROUPS) as [string, Record<string, readonly string[]>][]).map(
            ([group, params]) => {
              const groupN = groupCombinationCount(params, selections);
              return (
                <Card key={group} title={group}>
                  <p className="mb-[var(--s-300)] text-[12px] text-[var(--text-default-body)]">
                    Combinations from this group:{" "}
                    <span className="font-mono font-medium text-[var(--text-default-heading)]">
                      {groupN.toLocaleString()}
                    </span>
                  </p>
                  <div className="space-y-[var(--s-400)]">
                    {Object.entries(params).map(([param, opts]) => {
                      const key = param as KitchenParamKey;
                      return (
                        <div key={param}>
                          <p className="mb-[var(--s-200)] text-[13px] font-medium text-[var(--text-default-body)]">
                            {param}
                          </p>
                          <div className="flex flex-wrap gap-[var(--s-200)]">
                            {opts.map((opt) => {
                              const active = selections[key]?.includes(opt);
                              return (
                                <button
                                  key={opt}
                                  type="button"
                                  onClick={() => toggleValue(key, opt)}
                                  className={`rounded-br100 border px-[var(--s-300)] py-[var(--s-100)] text-[12px] transition-[color,background-color,border-color] duration-250 ease-out ${
                                    active
                                      ? "border-[var(--border-primary-default)] bg-[var(--surface-primary-default-subtle)] text-[var(--text-default-heading)]"
                                      : "border-[var(--border-default-secondary)] bg-[var(--surface-default)] text-[var(--text-default-body)]"
                                  }`}
                                >
                                  {opt}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </Card>
              );
            },
          )}
        </div>

        <div className="space-y-[var(--s-300)]">
          <Card title="Combinatorics">
            <dl className="space-y-[var(--s-200)] text-[13px]">
              <div className="flex justify-between gap-[var(--s-400)]">
                <dt className="text-[var(--text-default-body)]">Total combinations</dt>
                <dd className="font-mono text-[var(--text-default-heading)]">{rawCount.toLocaleString()}</dd>
              </div>
              <div className="flex justify-between gap-[var(--s-400)]">
                <dt className="text-[var(--text-default-body)]">Validation</dt>
                <dd className={brokenRules.length ? "text-[var(--text-error-default)]" : "text-[var(--text-success-default)]"}>
                  {brokenRules.length ? "blocked" : "pass"}
                </dd>
              </div>
            </dl>
            {brokenRules.length ? (
              <ul className="mt-[var(--s-300)] list-disc space-y-[var(--s-100)] pl-[var(--s-400)] text-[12px] text-[var(--text-error-default)]">
                {brokenRules.map((m) => (
                  <li key={m}>{m}</li>
                ))}
              </ul>
            ) : null}
            <Button
              variant="primary"
              className="mt-[var(--s-400)] inline-flex w-full items-center justify-center gap-[var(--s-200)]"
              disabled={mutation.isPending || Boolean(brokenRules.length)}
              aria-haspopup={!batchAllowed ? "dialog" : undefined}
              title={!batchAllowed ? "Locked (Full access required)" : undefined}
              onClick={() => {
                if (!batchAllowed) {
                  setAccessModalOpen(true);
                  return;
                }
                mutation.reset();
                mutation.mutate();
              }}
            >
              {!batchAllowed ? (
                <span className="material-symbols-outlined text-[20px]" aria-hidden>
                  lock
                </span>
              ) : null}
              {mutation.isPending ? "Queueing…" : "Queue job"}
            </Button>
            {!batchAllowed ? (
              <p className="mt-[var(--s-200)] text-[12px] text-[var(--text-default-body)]">Locked (Full access required)</p>
            ) : null}
            {mutation.isError ? (
              <p className="mt-[var(--s-300)] text-[13px] text-[var(--text-error-default)]" role="alert">
                Could not queue the job.{" "}
                <button
                  type="button"
                  className="font-medium underline underline-offset-2"
                  onClick={() => mutation.reset()}
                >
                  Dismiss
                </button>
              </p>
            ) : null}
            {mutation.data ? (
              <p className="mt-[var(--s-300)] font-mono text-[12px] text-[var(--text-default-body)]">
                job {mutation.data.jobId} · valid {mutation.data.validCombinations.toLocaleString()}
                {mutation.data.invalidRules.length ? ` · rules ${mutation.data.invalidRules.join("; ")}` : ""}
              </p>
            ) : null}
          </Card>

          <Card title="Job queue">
            {!batchAllowed ? (
              <div className="flex flex-col items-center gap-[var(--s-300)] rounded-br100 border border-dashed border-[var(--border-default-secondary)] bg-[var(--surface-page-secondary)] px-[var(--s-400)] py-[var(--s-500)] text-center">
                <Badge variant="locked">Locked</Badge>
                <p className="max-w-[40ch] text-[13px] leading-[20px] text-[var(--text-default-body)]">
                  Queue visibility and outputs require Full access.
                </p>
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
              <div className="rounded-br100 border border-dashed border-[var(--border-default-secondary)] bg-[var(--surface-page-secondary)] px-[var(--s-400)] py-[var(--s-500)] text-center">
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
                <p className="mt-[var(--s-300)] text-[12px] text-[var(--text-default-body)]">
                  Run a job from the combinatorics card when validation passes.
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
          </Card>
        </div>
      </div>

      <BatchGenerationAccessModal open={accessModalOpen} onClose={() => setAccessModalOpen(false)} />
    </div>
  );
}
