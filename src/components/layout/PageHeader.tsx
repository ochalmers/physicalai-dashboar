import type { ReactNode } from "react";

type PageHeaderProps = {
  title: ReactNode;
  description?: ReactNode;
  /** Renders inline after the title (e.g. status badge) */
  titleAfter?: ReactNode;
  /** Right-aligned actions (filters, CTAs) */
  actions?: ReactNode;
};

/**
 * Consistent page title + description. No eyebrow / category line above the title.
 */
export function PageHeader({ title, description, titleAfter, actions }: PageHeaderProps) {
  return (
    <header className="flex flex-col gap-[var(--s-400)] lg:flex-row lg:items-end lg:justify-between">
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-[var(--s-300)]">
          <h1 className="text-page-title">{title}</h1>
          {titleAfter}
        </div>
        {description ? (
          <div className="mt-[var(--s-200)] max-w-[720px] text-[14px] leading-[22px] text-[var(--text-default-body)]">
            {description}
          </div>
        ) : null}
      </div>
      {actions ? <div className="flex shrink-0 flex-wrap gap-[var(--s-200)] lg:justify-end">{actions}</div> : null}
    </header>
  );
}
