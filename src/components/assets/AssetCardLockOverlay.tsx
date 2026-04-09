/** Shown on library cards when no 3D preview model is available yet (flat thumbnail stays visible underneath). */
export function AssetCardLockOverlay() {
  return (
    <div className="pointer-events-none absolute inset-0 z-[2] flex flex-col items-center justify-center gap-[var(--s-100)] bg-[var(--surface-default)]/82 backdrop-blur-[3px] dark:bg-[var(--surface-default)]/72">
      <span className="material-symbols-outlined text-[30px] text-[var(--text-default-heading)]" aria-hidden>
        lock
      </span>
      <span className="max-w-[148px] px-[var(--s-200)] text-center text-[11px] font-semibold leading-snug text-[var(--text-default-heading)]">
        No 3D file yet
      </span>
      <span className="max-w-[160px] px-[var(--s-200)] text-center text-[10px] leading-snug text-[var(--text-default-body)]">
        Preview locked until a model is published
      </span>
    </div>
  );
}
