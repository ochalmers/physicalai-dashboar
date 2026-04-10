import { useMutation } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { defaultKitchenValues, KITCHEN_PARAMETER_GROUPS } from "@/kitchen/params";
import type { KitchenParamKey } from "@/kitchen/params";
import { generateScene } from "@/lib/mockApi";
import { KITCHEN_LIMITS, remaining, tryConsume } from "@/lib/kitchenLimits";
import { KitchenScenePreview } from "@/components/kitchen/KitchenScenePreview";
import { TalkToTeamModal } from "@/components/contact/TalkToTeamModal";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import type { SceneGenerationResult } from "@/types";

const txBtn =
  "inline-flex items-center justify-center gap-[var(--s-200)] transition-[color,background-color,opacity,transform] duration-250 ease-out";

const tabClass = ({ isActive }: { isActive: boolean }) =>
  [
    "inline-flex items-center border-b-2 px-[var(--s-200)] py-[var(--s-200)] text-[13px] transition-colors",
    isActive
      ? "border-[var(--papaya-500)] font-semibold text-[var(--text-default-heading)]"
      : "border-transparent font-medium text-[var(--text-default-body)] hover:text-[var(--text-default-heading)]",
  ].join(" ");

const labelClass =
  "text-[11px] font-semibold uppercase tracking-[0.06em] text-[var(--text-default-placeholder)]";

const selectClass =
  "mt-[var(--s-100)] w-full rounded-br100 border border-[var(--border-default-secondary)] bg-[var(--surface-default)] px-[var(--s-300)] py-[var(--s-200)] text-[14px] text-[var(--text-default-heading)]";

function formatIslandLabel(value: string) {
  if (value === "true") return "Standard Island";
  if (value === "false") return "No island";
  return value;
}

export function KitchenConfiguratorPage() {
  const [values, setValues] = useState<Record<KitchenParamKey, string>>(defaultKitchenValues);
  const [error, setError] = useState<string | null>(null);
  const [sceneResult, setSceneResult] = useState<SceneGenerationResult | null>(null);
  const [talkOpen, setTalkOpen] = useState(false);

  const summary = useMemo(() => {
    const entries = Object.entries(values) as [KitchenParamKey, string][];
    return entries.map(([k, v]) => `${k}: ${v}`).join(" · ");
  }, [values]);

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

  const runExport = (kind: "usd" | "package") => {
    if (!sceneResult) return;
    if (!tryConsume("sceneDownloads")) {
      setTalkOpen(true);
      return;
    }
    alert(
      kind === "usd"
        ? `Download queued: scene.usd\n${sceneResult.sceneId}`
        : `Download queued: simulation package zip\n${sceneResult.checksum}`,
    );
  };

  const dlLeft = remaining("sceneDownloads");
  const cfgLeft = remaining("configChanges");

  return (
    <div className="space-y-[var(--s-400)] pb-[var(--s-500)]">
      <nav
        className="flex flex-wrap items-center gap-x-[var(--s-200)] gap-y-[var(--s-100)] text-[13px] text-[var(--text-default-body)]"
        aria-label="Breadcrumb"
      >
        <Link to="/" className="transition-colors hover:text-[var(--text-default-heading)]">
          Dashboard
        </Link>
        <span className="text-[var(--text-default-placeholder)]" aria-hidden>
          /
        </span>
        <Link to="/environments" className="transition-colors hover:text-[var(--text-default-heading)]">
          Environments
        </Link>
        <span className="text-[var(--text-default-placeholder)]" aria-hidden>
          /
        </span>
        <Link to="/environments/kitchen/configure" className="transition-colors hover:text-[var(--text-default-heading)]">
          Kitchen
        </Link>
        <span className="text-[var(--text-default-placeholder)]" aria-hidden>
          /
        </span>
        <span className="text-[var(--text-default-heading)]">Scene</span>
      </nav>

      <header className="space-y-[var(--s-300)]">
        <h1 className="text-page-title">Kitchen Environment</h1>
        <p className="max-w-[52rem] text-[13px] leading-[20px] text-[var(--text-default-body)]">
          Limited access includes preview generations and downloads. Higher limits ship with full access.
        </p>
        <nav className="border-b border-[var(--border-default-secondary)]" aria-label="Kitchen sections">
          <ul className="flex flex-wrap gap-[var(--s-200)]">
            <li>
              <NavLink to="/environments/kitchen/scene" end className={tabClass}>
                Scene
              </NavLink>
            </li>
            <li>
              <NavLink to="/environments/kitchen/configure" className={tabClass}>
                Configure
              </NavLink>
            </li>
            <li>
              <NavLink to="/environments/kitchen/downloads" className={tabClass}>
                Downloads
              </NavLink>
            </li>
          </ul>
        </nav>
      </header>

      <p className="text-[13px] text-[var(--text-default-body)]">
        Only geometry parameters update the preview. Scene conditions are applied during generation.
      </p>

      <div className="grid gap-[var(--s-500)] lg:grid-cols-[minmax(0,1fr)_minmax(300px,420px)] lg:items-start">
        <div className="lg:sticky lg:top-[calc(3.5rem+var(--s-400)+env(safe-area-inset-top))] lg:self-start">
          <KitchenScenePreview values={values} />
        </div>

        <div className="space-y-[var(--s-300)] lg:max-h-[calc(100dvh-13rem)] lg:overflow-y-auto lg:overscroll-contain lg:pr-[var(--s-100)]">
          {(Object.entries(KITCHEN_PARAMETER_GROUPS) as [string, Record<string, readonly string[]>][]).map(
            ([group, params]) => (
              <Card key={group} title={group.toUpperCase()}>
                <div className="space-y-[var(--s-400)]">
                  {Object.entries(params).map(([key, opts]) => {
                    const k = key as KitchenParamKey;
                    return (
                      <label key={key} className="block">
                        <span className={labelClass}>{key}</span>
                        <select
                          value={values[k]}
                          onChange={(e) => setValues((prev) => ({ ...prev, [k]: e.target.value }))}
                          className={selectClass}
                        >
                          {opts.map((o) => (
                            <option key={o} value={o}>
                              {k === "Island" ? formatIslandLabel(o) : o}
                            </option>
                          ))}
                        </select>
                      </label>
                    );
                  })}
                </div>
              </Card>
            ),
          )}

          <Card title="Current configuration">
            <p className="font-mono text-[12px] leading-[18px] text-[var(--text-default-heading)]">{summary}</p>
            <p className="mt-[var(--s-200)] text-[12px] text-[var(--text-default-body)]">
              Preview generations remaining: {cfgLeft} / {KITCHEN_LIMITS.configChanges}
            </p>
            <div className="mt-[var(--s-400)] flex flex-wrap gap-[var(--s-200)]">
              <Button variant="primary" disabled={mutation.isPending} onClick={runGenerate}>
                {mutation.isPending ? "Generating…" : "Generate preview"}
              </Button>
            </div>
            {error ? (
              <p className="mt-[var(--s-300)] text-[13px] text-[var(--text-error-default)]">{error}</p>
            ) : null}
            {mutation.isSuccess && !error && sceneResult ? (
              <p className="mt-[var(--s-300)] text-[13px] text-[var(--text-success-default)]">
                Preview ready — scene <span className="font-mono">{sceneResult.sceneId}</span>.
              </p>
            ) : null}
          </Card>

          <Card title="Download scene">
            <p className="text-[13px] leading-[18px] text-[var(--text-default-body)]">
              After a successful preview, download the USD stage or the full simulation package.
            </p>
            <p className="mt-[var(--s-200)] text-[12px] text-[var(--text-default-body)]">
              Scene downloads remaining: {dlLeft} / {KITCHEN_LIMITS.sceneDownloads}
            </p>
            <div className="mt-[var(--s-400)] flex flex-col gap-[var(--s-300)]">
              <Button
                variant="primary"
                className={`w-full ${txBtn}`}
                disabled={!sceneResult}
                onClick={() => runExport("usd")}
              >
                <span className="material-symbols-outlined text-[20px]" aria-hidden>
                  download
                </span>
                Download USD
              </Button>
              <Button
                variant="secondary"
                className={`w-full border-[var(--border-primary-default)] text-[var(--text-primary-default)] ${txBtn}`}
                disabled={!sceneResult}
                onClick={() => runExport("package")}
              >
                <span className="material-symbols-outlined text-[20px]" aria-hidden>
                  archive
                </span>
                Download package
              </Button>
            </div>
            {!sceneResult ? (
              <p className="mt-[var(--s-300)] text-[12px] text-[var(--text-default-body)]">
                Generate a preview first to enable downloads.
              </p>
            ) : null}
          </Card>
        </div>
      </div>

      <TalkToTeamModal open={talkOpen} onClose={() => setTalkOpen(false)} context="general" />
    </div>
  );
}
