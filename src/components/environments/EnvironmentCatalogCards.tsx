import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/Badge";
import { PreviewModeBadge } from "@/components/kitchen/PreviewModeBadge";
import { tx } from "@/components/layout/motion";
import type { EnvironmentEntity } from "@/types";
import { canUseFeature } from "@/lib/access";
import type { AccessTier } from "@/lib/access";

const cardShell =
  "flex flex-col overflow-hidden rounded-br200 border border-[var(--border-default-secondary)] bg-[var(--surface-default)] text-left";

const heroSoon = "relative flex min-h-[140px] shrink-0 items-center justify-center bg-[var(--surface-page-secondary)] md:min-h-[160px]";
const heroActive =
  "relative flex min-h-[140px] shrink-0 items-center justify-center bg-[color-mix(in_srgb,var(--papaya-500)_12%,var(--surface-page-secondary))] md:min-h-[160px]";

const txPrimaryCta =
  "inline-flex items-center justify-center gap-[var(--s-200)] rounded-br100 bg-[var(--surface-primary-default)] px-[var(--s-400)] py-[var(--s-200)] text-[14px] font-medium text-[var(--text-on-color-body)] transition-[background-color,opacity,transform] duration-250 ease-out hover:bg-[var(--surface-primary-default-hover)] active:scale-[0.99]";

type EnvironmentCatalogCardsProps = {
  environments: EnvironmentEntity[];
  accessTier: AccessTier;
  /** Show dashed “Request a Custom Scene” tile (hide on `/environments/request-custom`) */
  showRequestCard?: boolean;
  requestCustomHref?: string;
};

export function EnvironmentCatalogCards({
  environments,
  accessTier,
  showRequestCard = true,
  requestCustomHref = "/environments/request-custom",
}: EnvironmentCatalogCardsProps) {
  const fullExport = canUseFeature(accessTier, "full_export");

  return (
    <div className="grid gap-[var(--s-400)] sm:grid-cols-2 xl:grid-cols-3">
      {environments.map((e) => {
        const isActive = e.status === "active";
        const title = `${e.name} Environment`;
        const description =
          e.catalogDescription ??
          (isActive
            ? "Configure parameters, generate scenes, and export SimReady assets."
            : "We are building this environment. Get notified when it is ready.");
        const eyebrow = e.catalogEyebrow;
        const icon = e.catalogIcon ?? "view_in_ar";

        return (
          <article key={e.id} className={cardShell}>
            <div className={isActive ? heroActive : heroSoon}>
              <div className="absolute left-[var(--s-300)] top-[var(--s-300)] z-[1]">
                {isActive ? (
                  <Badge variant="live">Available</Badge>
                ) : (
                  <Badge variant="soon">Coming Soon</Badge>
                )}
              </div>
              {isActive ? (
                <span
                  className="material-symbols-outlined text-[64px] text-[var(--papaya-500)]/90"
                  aria-hidden
                >
                  {icon}
                </span>
              ) : null}
            </div>

            <div className="flex flex-1 flex-col gap-[var(--s-200)] p-[var(--s-400)]">
              <div className="flex flex-wrap items-center gap-[var(--s-200)]">
                <h2 className="text-[16px] font-semibold leading-snug text-[var(--text-default-heading)]">
                  {title}
                </h2>
                {e.id === "env-kitchen-v2" && !fullExport ? <PreviewModeBadge /> : null}
              </div>

              {eyebrow ? (
                <p className="text-[12px] font-medium leading-[18px] text-[var(--text-primary-default)]">
                  {eyebrow}
                </p>
              ) : null}

              <p className="flex-1 text-[13px] leading-[20px] text-[var(--text-default-body)]">{description}</p>

              <div className="pt-[var(--s-100)]">
                {isActive && e.id === "env-kitchen-v2" ? (
                  <Link to="/environments/kitchen/configure" className={txPrimaryCta}>
                    Open Kitchen
                    <span className="material-symbols-outlined text-[18px]" aria-hidden>
                      arrow_forward
                    </span>
                  </Link>
                ) : null}
                {isActive && e.id !== "env-kitchen-v2" ? (
                  <Link to="/environments" className={txPrimaryCta}>
                    Open
                    <span className="material-symbols-outlined text-[18px]" aria-hidden>
                      arrow_forward
                    </span>
                  </Link>
                ) : null}
                {!isActive ? (
                  <button
                    type="button"
                    className={`text-[13px] font-medium text-[var(--text-default-body)] underline underline-offset-2 hover:text-[var(--text-default-heading)] ${tx}`}
                  >
                    Get notified
                  </button>
                ) : null}
              </div>
            </div>
          </article>
        );
      })}

      {showRequestCard ? (
        <Link
          to={requestCustomHref}
          className={`${cardShell} border-2 border-dashed border-[var(--border-primary-default)] transition-[background-color,box-shadow] duration-200 hover:bg-[var(--surface-primary-default-subtle)]`}
        >
          <div className="relative flex min-h-[140px] shrink-0 items-center justify-center border-b border-dashed border-[var(--border-primary-default)] bg-[var(--surface-default)] md:min-h-[160px]">
            <span
              className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-[var(--border-primary-default)] text-[var(--text-primary-default)]"
              aria-hidden
            >
              <span className="material-symbols-outlined text-[36px]">add</span>
            </span>
          </div>
          <div className="flex flex-1 flex-col gap-[var(--s-200)] p-[var(--s-400)]">
            <h2 className="text-[16px] font-semibold text-[var(--text-default-heading)]">Request a Custom Scene</h2>
            <p className="flex-1 text-[13px] leading-[20px] text-[var(--text-default-body)]">
              Need a specific environment for your training pipeline? Tell us what you need.
            </p>
            <div className="pt-[var(--s-100)]">
              <span className={txPrimaryCta}>
                Submit Request
                <span className="material-symbols-outlined text-[18px]" aria-hidden>
                  arrow_forward
                </span>
              </span>
            </div>
          </div>
        </Link>
      ) : null}
    </div>
  );
}
