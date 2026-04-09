import { useCallback, useEffect, useId, useRef, useState } from "react";
import { tx, txOverlayPanel } from "@/components/layout/motion";
import { usePresence } from "@/hooks/usePresence";

const QUICK_PROMPTS = [
  "Configure a kitchen scene",
  "Explain batch generation",
  "Draft an API integration",
] as const;

function shortcutLabel() {
  if (typeof navigator !== "undefined" && /Mac|iPhone|iPod|iPad/i.test(navigator.userAgent)) {
    return "⌘J";
  }
  return "Ctrl+J";
}

export function AskImagineDock() {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const { mounted, show } = usePresence(open);
  const panelId = useId();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!(e.metaKey || e.ctrlKey) || e.key.toLowerCase() !== "j") return;
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) return;
      e.preventDefault();
      setOpen((v) => !v);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (!mounted || !show) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [mounted, show, close]);

  useEffect(() => {
    if (show && textareaRef.current) {
      const id = requestAnimationFrame(() => textareaRef.current?.focus());
      return () => cancelAnimationFrame(id);
    }
  }, [show]);

  return (
    <div
      className="pointer-events-none fixed inset-x-0 bottom-0 z-[60] flex justify-end p-[var(--s-300)] pb-[max(var(--s-300),env(safe-area-inset-bottom))] pt-0 sm:p-[var(--s-400)] sm:pb-[max(var(--s-400),env(safe-area-inset-bottom))]"
      aria-hidden={!mounted}
    >
      <div className="pointer-events-auto flex w-full max-w-[420px] flex-col items-end gap-[var(--s-300)]">
        {mounted ? (
          <div
            id={panelId}
            role="dialog"
            aria-modal="true"
            aria-label="Ask Imagine"
            className={`flex w-full flex-col overflow-hidden rounded-br200 border border-[var(--border-default-secondary)] bg-[var(--surface-default)] shadow-[0_12px_40px_rgba(0,0,0,0.12)] dark:shadow-[0_12px_40px_rgba(0,0,0,0.45)] ${txOverlayPanel} ${
              expanded ? "max-h-[min(85vh,720px)]" : "max-h-[min(70vh,560px)]"
            } ${show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-2 opacity-0"}`}
          >
            <header className="flex shrink-0 items-center justify-between gap-[var(--s-300)] border-b border-[var(--border-default-secondary)] px-[var(--s-400)] py-[var(--s-300)]">
              <div className="flex min-w-0 items-center gap-[var(--s-200)]">
                <span className="shrink-0 rounded-full border border-[var(--border-default-secondary)] bg-[var(--surface-page-secondary)] px-[var(--s-200)] py-[1px] text-[11px] font-semibold uppercase tracking-wide text-[var(--text-default-body)]">
                  Beta
                </span>
                <span className="truncate text-[15px] font-semibold text-[var(--text-default-heading)]">New chat</span>
              </div>
              <div className="flex shrink-0 items-center gap-[var(--s-100)]">
                <button
                  type="button"
                  onClick={() => setExpanded((e) => !e)}
                  className={`flex h-9 w-9 items-center justify-center rounded-br200 text-[var(--text-default-body)] hover:bg-[var(--surface-page-secondary)] ${tx}`}
                  aria-label={expanded ? "Shrink panel" : "Expand panel"}
                >
                  <span className="material-symbols-outlined text-[20px]" aria-hidden>
                    {expanded ? "fullscreen_exit" : "open_in_full"}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={close}
                  className={`flex h-9 w-9 items-center justify-center rounded-br200 text-[var(--text-default-body)] hover:bg-[var(--surface-page-secondary)] ${tx}`}
                  aria-label="Close"
                >
                  <span className="material-symbols-outlined text-[20px]" aria-hidden>
                    close
                  </span>
                </button>
              </div>
            </header>

            <div className="flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain">
              <div className="flex flex-col items-center px-[var(--s-400)] pb-[var(--s-400)] pt-[var(--s-500)] text-center">
                <img src="/logos/Mark.svg" alt="" className="h-10 w-10 opacity-90" />
                <h2 className="mt-[var(--s-400)] text-[18px] font-semibold text-[var(--text-default-heading)]">
                  Welcome to Imagine
                </h2>
                <p className="mt-[var(--s-200)] max-w-[320px] text-[14px] leading-[22px] text-[var(--text-default-body)]">
                  Ask anything or tell Imagine what you need in your simulation workflow.
                </p>
                <div className="mt-[var(--s-500)] flex w-full flex-col gap-[var(--s-200)]">
                  {QUICK_PROMPTS.map((label) => (
                    <button
                      key={label}
                      type="button"
                      onClick={() => {
                        if (textareaRef.current) {
                          textareaRef.current.value = label;
                          textareaRef.current.focus();
                        }
                      }}
                      className={`rounded-br200 border border-[var(--border-default-secondary)] bg-[var(--surface-page-secondary)] px-[var(--s-300)] py-[var(--s-300)] text-left text-[13px] font-medium text-[var(--text-default-heading)] hover:border-[var(--border-primary-default)] hover:bg-[var(--surface-default)] ${tx}`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
                <p className="mt-[var(--s-500)] max-w-[300px] text-[12px] leading-[18px] text-[var(--text-default-placeholder)]">
                  <span className="font-medium text-[var(--text-default-body)]">@</span> to mention an environment, asset, or
                  document.{" "}
                  <span className="font-medium text-[var(--text-default-body)]">Tab</span> to add the current view to
                  context.
                </p>
              </div>
            </div>

            <footer className="shrink-0 border-t border-[var(--border-default-secondary)] bg-[var(--surface-page-secondary)] p-[var(--s-300)]">
              <label className="sr-only" htmlFor="ask-imagine-input">
                Message
              </label>
              <textarea
                id="ask-imagine-input"
                ref={textareaRef}
                rows={2}
                placeholder="Ask Imagine…"
                className="w-full resize-none rounded-br200 border border-[var(--border-default-secondary)] bg-[var(--surface-default)] px-[var(--s-300)] py-[var(--s-300)] text-[14px] text-[var(--text-default-heading)] placeholder:text-[var(--text-default-placeholder)] focus:border-[var(--border-primary-default)] focus:outline-none focus:ring-2 focus:ring-[var(--surface-primary-default-subtle)]"
              />
              <div className="mt-[var(--s-300)] flex items-center justify-between gap-[var(--s-300)]">
                <button
                  type="button"
                  className={`inline-flex items-center gap-[var(--s-200)] rounded-br200 border border-[var(--border-default-secondary)] bg-[var(--surface-default)] px-[var(--s-300)] py-[var(--s-200)] text-[13px] font-medium text-[var(--text-default-heading)] hover:bg-[var(--surface-page)] ${tx}`}
                >
                  <span className="material-symbols-outlined text-[18px] text-[var(--text-default-body)]" aria-hidden>
                    tune
                  </span>
                  Skills
                </button>
                <div className="flex items-center gap-[var(--s-100)]">
                  <button
                    type="button"
                    className={`flex h-9 w-9 items-center justify-center rounded-br200 text-[var(--text-default-body)] hover:bg-[var(--surface-default)] ${tx}`}
                    aria-label="Attach"
                  >
                    <span className="material-symbols-outlined text-[20px]" aria-hidden>
                      attach_file
                    </span>
                  </button>
                  <button
                    type="button"
                    className={`flex h-9 w-9 items-center justify-center rounded-br200 bg-[var(--surface-primary-default)] text-[var(--text-on-color-body)] hover:bg-[var(--surface-primary-default-hover)] ${tx}`}
                    aria-label="Send"
                  >
                    <span className="material-symbols-outlined text-[20px]" aria-hidden>
                      arrow_upward
                    </span>
                  </button>
                </div>
              </div>
            </footer>
          </div>
        ) : null}

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls={panelId}
          className={`inline-flex max-w-full items-center gap-[var(--s-200)] rounded-br200 border border-[var(--border-default-secondary)] bg-[var(--surface-default)] px-[var(--s-300)] py-[var(--s-300)] text-[13px] font-medium text-[var(--text-default-heading)] shadow-[0_4px_16px_rgba(0,0,0,0.08)] hover:bg-[var(--surface-page-secondary)] dark:shadow-[0_4px_16px_rgba(0,0,0,0.35)] ${tx}`}
        >
          <img src="/logos/Mark.svg" alt="" className="h-5 w-5 shrink-0" />
          <span className="truncate">Ask Imagine</span>
          <kbd className="hidden shrink-0 rounded border border-[var(--border-default-secondary)] bg-[var(--surface-page-secondary)] px-[6px] py-[1px] font-mono text-[11px] text-[var(--text-default-placeholder)] sm:inline">
            {shortcutLabel()}
          </kbd>
        </button>
      </div>
    </div>
  );
}
