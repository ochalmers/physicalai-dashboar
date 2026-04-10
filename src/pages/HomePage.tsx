import { useState } from "react";
import { Link } from "react-router-dom";
import { TalkToTeamModal } from "@/components/contact/TalkToTeamModal";
import { StaggerFadeGroup } from "@/components/layout/StaggerFadeGroup";
import { Card } from "@/components/ui/Card";

const tx = "transition-[color,background-color,box-shadow,transform] duration-250 ease-out";
const teaserShell =
  "group relative overflow-hidden rounded-br200 border border-[var(--border-default-secondary)] bg-[var(--surface-default)]";

function daypartGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

export function HomePage() {
  const [talkOpen, setTalkOpen] = useState(false);
  const greeting = daypartGreeting();

  return (
    <>
    <StaggerFadeGroup staggerMs={100} className="flex flex-col gap-[var(--s-600)] pb-[var(--s-400)]">
      <header>
        <h1 className="text-[clamp(1.5rem,2.5vw,1.75rem)] font-semibold leading-tight text-[var(--text-default-heading)]">
          {greeting}
        </h1>
      </header>

      <section className="space-y-[var(--s-300)]">
        <h2 className="text-[18px] font-semibold text-[var(--text-default-heading)]">Environments</h2>
        <StaggerFadeGroup staggerMs={150} className="grid gap-[var(--s-300)] sm:grid-cols-2 xl:grid-cols-5">
          {[
            { name: "Kitchen", href: "/environments/kitchen/configure", active: true },
            {
              name: "Living Room",
              href: "/environments/living-room/configure",
              active: false,
            },
            { name: "Warehouse", href: "/environments/warehouse/configure", active: false },
            { name: "Retail Store", href: "/environments/retail-store/configure", active: false },
          ].map((env) => {
            const inner = (
              <>
                <img
                  src={
                    env.name === "Kitchen"
                      ? "/assets/environments/kitchen.jpg"
                      : env.name === "Living Room"
                        ? "/assets/environments/livingroom.png"
                        : env.name === "Warehouse"
                          ? "/assets/environments/warehouse.png"
                          : "/assets/environments/store.png"
                  }
                  alt={env.name}
                  className="absolute inset-0 block h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/5 to-black/10" />
                <div className="absolute left-[var(--s-200)] top-[var(--s-200)] z-[1]">
                  {env.active ? (
                    <span className="inline-flex items-center gap-[6px] rounded-full bg-[var(--green-500)]/90 px-[10px] py-[4px] text-[11px] font-semibold uppercase tracking-[0.06em] text-white">
                      Active
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-[6px] rounded-full bg-black/45 px-[10px] py-[4px] text-[11px] font-semibold uppercase tracking-[0.06em] text-white backdrop-blur-[2px]">
                      <span className="material-symbols-outlined text-[14px]" aria-hidden>
                        lock
                      </span>
                      Locked
                    </span>
                  )}
                </div>
                <div className="absolute inset-x-[var(--s-200)] bottom-[var(--s-200)] z-[1]">
                  <p className="text-[16px] font-semibold text-white">{env.name}</p>
                  {!env.active ? (
                    <p className="mt-[var(--s-100)] text-[12px] leading-snug text-white/85">
                      Available with full access
                    </p>
                  ) : null}
                </div>
              </>
            );
            if (env.active) {
              return (
                <Link key={env.name} to={env.href} className={`${teaserShell} group h-[146px]`}>
                  {inner}
                </Link>
              );
            }
            return (
              <Link
                key={env.name}
                to={env.href}
                className={`${teaserShell} group h-[146px] cursor-pointer text-left ${tx}`}
              >
                {inner}
              </Link>
            );
          })}
          <button type="button" onClick={() => setTalkOpen(true)} className={`${teaserShell} h-[146px] text-left ${tx}`}>
            <div className="absolute inset-0 flex h-full w-full items-center justify-center bg-[var(--surface-page-secondary)]">
              <span className="material-symbols-outlined text-[34px] text-[var(--text-primary-default)]">add_circle</span>
            </div>
            <div className="absolute inset-x-[var(--s-200)] bottom-[var(--s-200)] z-[1]">
              <p className="text-[16px] font-semibold text-[var(--text-default-heading)]">Request New Environment</p>
              <span className="mt-[var(--s-200)] inline-flex text-[13px] font-medium text-[var(--text-primary-default)]">
                Talk to Team
              </span>
            </div>
          </button>
        </StaggerFadeGroup>
      </section>

      <div className="grid gap-[var(--s-500)] lg:grid-cols-[1fr_minmax(260px,340px)] lg:items-start lg:gap-[var(--s-600)]">
        <div className="space-y-[var(--s-500)]">
          <section className="rounded-br200 border border-[var(--border-default-secondary)] bg-[var(--surface-default)] p-[var(--s-400)] sm:p-[var(--s-500)]">
            <div className="flex items-start gap-[var(--s-300)]">
              <span
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-br100 bg-[var(--surface-primary-default-subtle)] text-[var(--papaya-500)]"
                aria-hidden
              >
                <span className="material-symbols-outlined text-[24px]">workspaces</span>
              </span>
              <div className="min-w-0 flex-1">
                <h2 className="text-[18px] font-semibold text-[var(--text-default-heading)]">Your Workspace</h2>
                <p className="mt-[var(--s-200)] text-[14px] font-medium text-[var(--text-default-heading)]">Kitchen Scene</p>
                <p className="mt-[var(--s-100)] text-[13px] text-[var(--text-default-body)]">Last activity — placeholder</p>
              </div>
            </div>

            <div className="mt-[var(--s-500)] border-t border-[var(--border-default-secondary)] pt-[var(--s-500)]">
              <Link
                to="/environments/kitchen/configure"
                className={`flex w-full items-center justify-between rounded-br100 bg-[var(--surface-primary-default)] px-[var(--s-300)] py-[var(--s-300)] text-[15px] font-medium text-[var(--text-on-color-body)] hover:bg-[var(--surface-primary-default-hover)] ${tx}`}
              >
                <span className="inline-flex items-center gap-[var(--s-200)]">
                  <span className="material-symbols-outlined text-[20px]" aria-hidden>
                    tune
                  </span>
                  Continue Configuring
                </span>
                <span className="material-symbols-outlined text-[20px]" aria-hidden>
                  arrow_forward
                </span>
              </Link>
            </div>
          </section>

          <section className="space-y-[var(--s-300)]">
            <h2 className="text-[18px] font-semibold text-[var(--text-default-heading)]">Capabilities</h2>
            <Card className="p-[var(--s-400)] sm:p-[var(--s-500)]">
              <ul className="space-y-[var(--s-300)] text-[14px] leading-[22px] text-[var(--text-default-body)]">
                <li className="flex gap-[var(--s-300)]">
                  <span className="material-symbols-outlined mt-[2px] shrink-0 text-[20px] text-[var(--text-primary-default)]" aria-hidden>
                    view_in_ar
                  </span>
                  <span>Configure environments</span>
                </li>
                <li className="flex gap-[var(--s-300)]">
                  <span className="material-symbols-outlined mt-[2px] shrink-0 text-[20px] text-[var(--text-primary-default)]" aria-hidden>
                    auto_awesome
                  </span>
                  <span>Generate variations</span>
                </li>
                <li className="flex gap-[var(--s-300)]">
                  <span className="material-symbols-outlined mt-[2px] shrink-0 text-[20px] text-[var(--text-primary-default)]" aria-hidden>
                    download
                  </span>
                  <span>Download simulation-ready outputs</span>
                </li>
              </ul>
            </Card>
          </section>
        </div>

        <aside className="flex flex-col gap-[var(--s-300)] lg:sticky lg:top-[calc(3.5rem+var(--s-400)+env(safe-area-inset-top))]">
          <Card className="p-[var(--s-300)] sm:p-[var(--s-400)]">
            <div>
              <h2 className="text-[15px] font-semibold text-[var(--text-default-heading)]">Asset Library</h2>
              <p className="mt-[var(--s-200)] text-[13px] leading-[20px] text-[var(--text-default-body)]">
                Browse props and materials for your scenes.
              </p>
              <Link
                to="/assets"
                className={`mt-[var(--s-300)] inline-flex items-center text-[13px] font-medium text-[var(--text-primary-default)] hover:text-[var(--text-default-body)] ${tx}`}
              >
                Browse Assets
              </Link>
            </div>
          </Card>

          <Card className="border-[color-mix(in_srgb,var(--papaya-500)_35%,var(--border-default-secondary))] bg-[color-mix(in_srgb,var(--papaya-500)_8%,var(--surface-default))] p-[var(--s-400)] sm:p-[var(--s-500)]">
            <div>
              <h2 className="text-[16px] font-semibold text-[var(--text-default-heading)]">Need full access?</h2>
              <p className="mt-[var(--s-200)] text-[13px] leading-[18px] text-[var(--text-default-body)]">
                Unlock batch generation, higher limits, and full environment access.
              </p>
              <button
                type="button"
                onClick={() => setTalkOpen(true)}
                className={`mt-[var(--s-400)] inline-flex items-center text-[14px] font-medium text-[var(--text-primary-default)] hover:text-[var(--text-default-body)] ${tx}`}
              >
                Talk to Team
              </button>
            </div>
          </Card>
        </aside>
      </div>
    </StaggerFadeGroup>
      <TalkToTeamModal open={talkOpen} onClose={() => setTalkOpen(false)} context="general" />
    </>
  );
}
