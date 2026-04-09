import { useState } from "react";
import { defaultKitchenValues, KITCHEN_PARAMETER_GROUPS } from "@/kitchen/params";
import type { KitchenParamKey } from "@/kitchen/params";
import { KitchenScenePreview } from "@/components/kitchen/KitchenScenePreview";

const sectionLabel = "text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--text-default-placeholder)]";

function thumbShell(active: boolean) {
  return [
    "relative flex aspect-square w-full min-w-0 max-w-[72px] flex-col items-center justify-center overflow-hidden rounded-br100 border text-center transition-[border-color,box-shadow,transform] duration-200",
    active
      ? "border-[var(--border-primary-default)] shadow-[0_0_0_1px_var(--border-primary-default)]"
      : "border-[var(--border-default-secondary)] bg-[var(--surface-default)] hover:border-[var(--grey-300)]",
  ].join(" ");
}

function OptionGrid({
  title,
  param: _param,
  options,
  value,
  onPick,
}: {
  title: string;
  param: KitchenParamKey;
  options: readonly string[];
  value: string;
  onPick: (v: string) => void;
}) {
  void _param;
  return (
    <section className="space-y-[var(--s-300)]">
      {title ? <h3 className={sectionLabel}>{title}</h3> : null}
      <div className="grid grid-cols-3 gap-[var(--s-200)] sm:grid-cols-4">
        {options.map((opt) => {
          const active = value === opt;
          return (
            <button
              key={opt}
              type="button"
              onClick={() => onPick(opt)}
              className={thumbShell(active)}
              title={opt}
            >
              <span className="pointer-events-none block h-8 w-full rounded-[4px] bg-[var(--surface-page-secondary)] opacity-90" aria-hidden />
              <span className="mt-[var(--s-100)] line-clamp-2 px-[4px] text-[10px] font-medium leading-tight text-[var(--text-default-heading)]">
                {opt}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}

/** Kitchen configure: left option columns + right interactive viewport (reference UI). */
export function KitchenConfigureWorkspace() {
  const [values, setValues] = useState<Record<KitchenParamKey, string>>(defaultKitchenValues);

  const set = (key: KitchenParamKey, v: string) => {
    setValues((prev) => ({ ...prev, [key]: v }));
  };

  const layoutOpts = KITCHEN_PARAMETER_GROUPS.Layout.Layout;
  const islandOpts = KITCHEN_PARAMETER_GROUPS.Layout.Island;
  const doorOpts = KITCHEN_PARAMETER_GROUPS.Style["Door Style"];
  const appOpts = KITCHEN_PARAMETER_GROUPS.Appliances.Appliances;

  return (
    <div className="grid gap-[var(--s-500)] lg:grid-cols-[minmax(260px,380px)_minmax(0,1fr)] lg:items-stretch">
      <div className="flex max-h-[min(720px,calc(100dvh-14rem))] min-h-0 flex-col gap-[var(--s-500)] overflow-y-auto pr-[var(--s-100)] [-webkit-overflow-scrolling:touch]">
        <section className="space-y-[var(--s-300)]">
          <h3 className={sectionLabel}>Layout</h3>
          <OptionGrid title="" param="Layout" options={layoutOpts} value={values.Layout} onPick={(v) => set("Layout", v)} />
          <p className={sectionLabel}>Island</p>
          <div className="grid grid-cols-2 gap-[var(--s-200)]">
            {islandOpts.map((opt) => {
              const active = values.Island === opt;
              const label = opt === "true" ? "Island" : "No island";
              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => set("Island", opt)}
                  className={thumbShell(active)}
                >
                  <span className="px-[var(--s-200)] text-[11px] font-medium text-[var(--text-default-heading)]">{label}</span>
                </button>
              );
            })}
          </div>
        </section>

        <section className="space-y-[var(--s-300)]">
          <h3 className={sectionLabel}>Option</h3>
          <div className="grid grid-cols-1 gap-[var(--s-400)] sm:grid-cols-2">
            <div className="space-y-[var(--s-200)]">
              <p className="text-[12px] font-medium text-[var(--text-default-body)]">Door style</p>
              <div className="grid grid-cols-2 gap-[var(--s-200)]">
                {doorOpts.map((opt) => {
                  const active = values["Door Style"] === opt;
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => set("Door Style", opt)}
                      className={thumbShell(active)}
                    >
                      <span className="line-clamp-3 px-[4px] text-[10px] font-medium leading-tight text-[var(--text-default-heading)]">
                        {opt}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="space-y-[var(--s-200)]">
              <p className="text-[12px] font-medium text-[var(--text-default-body)]">Appliances</p>
              <div className="grid grid-cols-1 gap-[var(--s-200)]">
                {appOpts.map((opt) => {
                  const active = values.Appliances === opt;
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => set("Appliances", opt)}
                      className={thumbShell(active)}
                    >
                      <span className="line-clamp-2 px-[4px] text-[10px] font-medium leading-tight text-[var(--text-default-heading)]">
                        {opt}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <OptionGrid
          title="Faucet"
          param="Hardware"
          options={KITCHEN_PARAMETER_GROUPS.Style.Hardware}
          value={values.Hardware}
          onPick={(v) => set("Hardware", v)}
        />

        <section className="space-y-[var(--s-300)]">
          <h3 className={sectionLabel}>Material</h3>
          <div className="grid grid-cols-2 gap-[var(--s-300)]">
            {(["Countertop", "Backsplash"] as const).map((k) => {
              const key = k as KitchenParamKey;
              const opts =
                k === "Countertop"
                  ? KITCHEN_PARAMETER_GROUPS.Style.Countertop
                  : KITCHEN_PARAMETER_GROUPS.Style.Backsplash;
              return (
                <div key={k} className="space-y-[var(--s-200)]">
                  <p className="text-[12px] font-medium text-[var(--text-default-body)]">{k}</p>
                  <div className="grid grid-cols-2 gap-[var(--s-200)]">
                    {opts.map((opt) => {
                      const active = values[key] === opt;
                      return (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => set(key, opt)}
                          className={thumbShell(active)}
                        >
                          <span className="line-clamp-3 px-[4px] text-[10px] font-medium leading-tight text-[var(--text-default-heading)]">
                            {opt}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <OptionGrid
          title="Cabinet finish"
          param="Cabinet Finish"
          options={KITCHEN_PARAMETER_GROUPS.Style["Cabinet Finish"]}
          value={values["Cabinet Finish"]}
          onPick={(v) => set("Cabinet Finish", v)}
        />
      </div>

      <div className="min-h-[min(480px,50vh)] lg:min-h-[min(720px,calc(100dvh-14rem))] min-w-0 lg:sticky lg:top-[var(--s-400)]">
        <KitchenScenePreview values={values} variant="light" />
      </div>
    </div>
  );
}
