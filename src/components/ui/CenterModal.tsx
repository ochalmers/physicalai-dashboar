import { useEffect, useId, type ReactNode } from "react";
import { tx } from "@/components/layout/motion";

type CenterModalProps = {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
  /** Wider panel for dense spec tables */
  size?: "md" | "lg";
};

export function CenterModal({ open, title, onClose, children, size = "md" }: CenterModalProps) {
  const titleId = useId();

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const maxW = size === "lg" ? "max-w-[560px]" : "max-w-[440px]";

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-[var(--s-400)]">
      <button
        type="button"
        aria-label="Close dialog"
        className={`absolute inset-0 bg-[var(--grey-900)]/35 backdrop-blur-sm transition-opacity duration-250 ease-out ${tx}`}
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={`relative z-[81] w-full ${maxW} rounded-br200 border border-[var(--border-default-secondary)] bg-[var(--surface-default)] shadow-xl ${tx}`}
      >
        <div className="flex items-start justify-between gap-[var(--s-300)] border-b border-[var(--border-default-secondary)] px-[var(--s-500)] py-[var(--s-400)]">
          <h2 id={titleId} className="text-[18px] font-semibold leading-tight text-[var(--text-default-heading)]">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-br200 text-[var(--text-default-body)] hover:bg-[var(--surface-page-secondary)] ${tx}`}
            aria-label="Close"
          >
            <span className="material-symbols-outlined text-[22px]">close</span>
          </button>
        </div>
        <div className="max-h-[min(72vh,720px)] overflow-y-auto px-[var(--s-500)] py-[var(--s-500)]">{children}</div>
      </div>
    </div>
  );
}
