import { useMutation } from "@tanstack/react-query";
import { useEffect, useMemo, useRef, useState } from "react";
import { defaultKitchenValues, KITCHEN_PARAMETER_GROUPS } from "@/kitchen/params";
import type { KitchenParamKey } from "@/kitchen/params";
import { kitchenOptionThumbnail } from "@/kitchen/kitchenConfigThumbnails";
import { computeKitchenSceneSummary } from "@/kitchen/sceneSummary";
import { generateScene } from "@/lib/mockApi";
import { KITCHEN_LIMITS, remaining, tryConsume } from "@/lib/kitchenLimits";
import { TalkToTeamModal } from "@/components/contact/TalkToTeamModal";
import { Button } from "@/components/ui/Button";
import type { SceneGenerationResult } from "@/types";

const groupLabelClass =
  "text-[11px] font-semibold uppercase tracking-[0.1em] text-[var(--text-default-placeholder)]";

const paramLabelClass =
  "text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--text-default-heading)]";

const thumbBtn = (active: boolean) =>
  [
    "group flex flex-col items-center gap-[6px] rounded-br100 border p-[6px] text-center transition-[border-color,box-shadow,transform] duration-200",
    active
      ? "border-[var(--papaya-500)] bg-[color-mix(in_srgb,var(--papaya-500)_10%,var(--surface-default))] shadow-[0_0_0_1px_var(--papaya-500)]"
      : "border-[var(--border-default-secondary)] bg-[var(--surface-default)] hover:border-[var(--grey-300)]",
  ].join(" ");

function cn(...parts: (string | false | undefined)[]) {
  return parts.filter(Boolean).join(" ");
}

function OptionThumbnails({
  param,
  options,
  value,
  onPick,
}: {
  param: KitchenParamKey;
  options: readonly string[];
  value: string;
  onPick: (v: string) => void;
}) {
  return (
    <div className="grid grid-cols-3 gap-[var(--s-200)] sm:grid-cols-4">
      {options.map((opt) => {
        const active = value === opt;
        const src = kitchenOptionThumbnail(param, opt);
        return (
          <button
            key={opt}
            type="button"
            onClick={() => onPick(opt)}
            className={thumbBtn(active)}
            title={opt}
          >
            <span className="relative flex aspect-square w-full min-h-0 items-center justify-center overflow-hidden rounded-[6px] bg-[var(--surface-page-secondary)]">
              <img src={src} alt="" className="max-h-full max-w-full object-contain" />
            </span>
            <span className="line-clamp-2 w-full px-[2px] text-[10px] font-medium leading-tight text-[var(--text-default-body)]">
              {opt}
            </span>
          </button>
        );
      })}
    </div>
  );
}

export function KitchenConfigureWorkspace() {
  const [values, setValues] = useState<Record<KitchenParamKey, string>>(defaultKitchenValues);
  const [error, setError] = useState<string | null>(null);
  const [sceneResult, setSceneResult] = useState<SceneGenerationResult | null>(null);
  const [talkOpen, setTalkOpen] = useState(false);
  const [summaryOpen, setSummaryOpen] = useState(true);
  const [summaryFlash, setSummaryFlash] = useState(false);
  const skipSummaryFlash = useRef(true);

  const snapshot = useMemo(() => JSON.stringify(values), [values]);

  const sceneSummary = useMemo(() => computeKitchenSceneSummary(values), [values]);

  useEffect(() => {
    if (skipSummaryFlash.current) {
      skipSummaryFlash.current = false;
      return;
    }
    setSummaryFlash(true);
  }, [snapshot]);

  const mutation = useMutation({
    mutationFn: (opts: { fail?: boolean }) => generateScene(values as unknown as Record<string, string>, opts),
    onMutate: () => {
      setSceneResult(null);
      setError(null);
    },
    onSuccess: (data: SceneGenerationResult) => {
      setError(null);
      setSceneResult(data);
    },
    onError: (e: Error) => {
      setSceneResult(null);
      setError(e.message);
    },
  });

  const runGenerate = () => {
    if (!tryConsume("configChanges")) {
      setTalkOpen(true);
      return;
    }
    mutation.mutate({});
  };

  const runExport = (kind: "usd" | "glb") => {
    if (!sceneResult) return;
    if (!tryConsume("sceneDownloads")) {
      setTalkOpen(true);
      return;
    }
    alert(
      kind === "usd"
        ? `Download queued: kitchen.usd\n${sceneResult.sceneId}`
        : `Download queued: kitchen.glb preview\n${sceneResult.checksum.slice(0, 24)}…`,
    );
  };

  const set = (key: KitchenParamKey, v: string) => {
    setValues((prev) => ({ ...prev, [key]: v }));
  };

  const dlLeft = remaining("sceneDownloads");
  const cfgLeft = remaining("configChanges");

  return (
    <div className="flex h-full min-h-0 w-full flex-col overflow-hidden rounded-br200 border border-[var(--border-default-secondary)] bg-[var(--surface-default)] lg:flex-row">
      {/* Single scene preview — no duplicate background plate */}
      <div className="relative flex min-h-[min(280px,40vh)] w-full flex-1 flex-col bg-[var(--surface-page-secondary)] lg:min-h-0 lg:overflow-hidden">
        <div className="flex flex-1 items-center justify-center px-[var(--s-400)] py-[var(--s-500)]">
          <img
            src="/assets/kitchen-scene-placeholder.png"
            alt="Kitchen configuration preview"
            className="max-h-[min(56vh,520px)] w-full max-w-[min(96%,720px)] object-contain drop-shadow-[0_12px_36px_rgba(0,0,0,0.12)]"
          />
        </div>
      </div>

      <aside className="flex min-h-0 w-full shrink-0 flex-col border-t border-[var(--border-default-secondary)] bg-[var(--surface-default)] lg:w-[min(100%,440px)] lg:border-l lg:border-t-0">
        <div className="min-h-0 flex-1 overflow-y-auto px-[var(--s-400)] py-[var(--s-400)] [-webkit-overflow-scrolling:touch]">
          <div className="space-y-[var(--s-500)]">
            {(Object.entries(KITCHEN_PARAMETER_GROUPS) as [string, Record<string, readonly string[]>][]).map(
              ([group, params]) => (
                <section key={group} className="space-y-[var(--s-400)]">
                  <h2 className={groupLabelClass}>{group}</h2>
                  <div className="space-y-[var(--s-400)]">
                    {Object.entries(params).map(([key, opts]) => {
                      const k = key as KitchenParamKey;
                      return (
                        <div key={key}>
                          <p className={paramLabelClass}>{key}</p>
                          <div className="mt-[var(--s-200)]">
                            <OptionThumbnails
                              param={k}
                              options={opts}
                              value={values[k]}
                              onPick={(v) => set(k, v)}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>
              ),
            )}
          </div>
        </div>
      </aside>

      <div
        className="fixed bottom-[max(12px,env(safe-area-inset-bottom))] right-[max(12px,env(safe-area-inset-right))] z-[50] flex max-h-[min(72vh,680px)] w-[min(420px,calc(100vw-1.5rem))] flex-col overflow-hidden rounded-br200 border border-[var(--border-default-secondary)] bg-[var(--surface-default)] shadow-[0_12px_40px_rgba(0,0,0,0.12)]"
        role="region"
        aria-label="Scene summary and actions"
      >
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
          <div
            className={cn(
              "rounded-b-[10px] transition-shadow duration-200",
              summaryFlash && "animate-summaryRing",
            )}
            onAnimationEnd={() => setSummaryFlash(false)}
          >
            <div className="space-y-[var(--s-300)] px-[var(--s-400)] pb-[var(--s-300)] pt-[var(--s-400)]">
              <div className="flex flex-wrap items-center justify-between gap-[var(--s-200)]">
                <div className="flex min-w-0 flex-wrap items-baseline gap-x-[var(--s-200)] gap-y-[var(--s-100)]">
                  <h2 className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--text-default-heading)]">
                    Scene summary
                  </h2>
                  <span className="rounded-full bg-[color-mix(in_srgb,var(--papaya-500)_12%,transparent)] px-[var(--s-200)] py-[2px] text-[10px] font-semibold uppercase tracking-[0.08em] text-[var(--text-primary-default)]">
                    Live
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setSummaryOpen((o) => !o)}
                  className="text-[13px] font-semibold text-[var(--text-primary-default)] underline-offset-2 hover:underline"
                >
                  {summaryOpen ? "Hide details" : "Show details"}
                </button>
              </div>

              {summaryOpen ? (
                <dl className="space-y-[var(--s-200)] text-[13px]">
                  {(
                    [
                      ["Models", String(sceneSummary.models)],
                      ["Articulated assets", String(sceneSummary.articulatedAssets)],
                      ["Total joints", String(sceneSummary.totalJoints)],
                      ["Isaac Sim FPS", sceneSummary.isaacFps],
                      ["Appliances", String(sceneSummary.appliances)],
                      ["Lighting", values.Lighting],
                      ["Clutter", values["Clutter Density"]],
                    ] as const
                  ).map(([dt, dd]) => (
                    <div key={dt} className="flex justify-between gap-[var(--s-400)]">
                      <dt className="text-[var(--text-default-body)]">{dt}</dt>
                      <dd className="text-right font-medium tabular-nums text-[var(--text-default-heading)]">{dd}</dd>
                    </div>
                  ))}
                </dl>
              ) : null}
            </div>
          </div>

          <div className="space-y-[var(--s-300)] px-[var(--s-400)] py-[var(--s-400)]">
            <p className="text-[12px] text-[var(--text-default-body)]">
              Preview generations remaining:{" "}
              <span className="font-mono font-medium text-[var(--text-default-heading)]">
                {cfgLeft} / {KITCHEN_LIMITS.configChanges}
              </span>
              {" · "}
              Scene downloads remaining:{" "}
              <span className="font-mono font-medium text-[var(--text-default-heading)]">
                {dlLeft} / {KITCHEN_LIMITS.sceneDownloads}
              </span>
            </p>

            <div className="flex flex-col gap-[var(--s-200)]">
              <Button
                variant="primary"
                disabled={mutation.isPending}
                onClick={runGenerate}
                className="min-h-[44px] w-full px-[var(--s-400)]"
              >
                {mutation.isPending ? "Generating…" : "Generate preview"}
              </Button>
              <div className="flex flex-col gap-[var(--s-200)]">
                <Button
                  variant="primary"
                  disabled={!sceneResult}
                  onClick={() => runExport("usd")}
                  className="inline-flex min-h-[44px] w-full items-center justify-center gap-[var(--s-200)] px-[var(--s-300)] text-[14px] font-semibold"
                >
                  <span className="material-symbols-outlined text-[20px]" aria-hidden>
                    download
                  </span>
                  Download USD Scene
                </Button>
                <Button
                  variant="secondary"
                  disabled={!sceneResult}
                  onClick={() => runExport("glb")}
                  className="inline-flex min-h-[44px] w-full items-center justify-center gap-[var(--s-200)] border-[var(--border-primary-default)] bg-[var(--surface-default)] px-[var(--s-300)] text-[14px] font-semibold text-[var(--text-primary-default)] hover:bg-[var(--surface-primary-default-subtle)]"
                >
                  <span className="material-symbols-outlined text-[20px]" aria-hidden>
                    download
                  </span>
                  Download GLB Preview
                </Button>
              </div>
            </div>
            {error ? <p className="text-[13px] text-[var(--text-error-default)]">{error}</p> : null}
            {mutation.isSuccess && !error && sceneResult ? (
              <p className="text-[13px] text-[var(--text-success-default)]">
                Preview ready — <span className="font-mono">{sceneResult.sceneId}</span>
              </p>
            ) : null}
          </div>
        </div>
      </div>

      <TalkToTeamModal open={talkOpen} onClose={() => setTalkOpen(false)} context="general" />
    </div>
  );
}
