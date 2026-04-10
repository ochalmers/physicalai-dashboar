import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { tx, txOverlayPanel } from "@/components/layout/motion";
import { usePresence } from "@/hooks/usePresence";

function cn(...parts: (string | false | undefined)[]) {
  return parts.filter(Boolean).join(" ");
}

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

type AskImagineContextValue = {
  open: boolean;
  setOpen: (v: boolean | ((b: boolean) => boolean)) => void;
  expanded: boolean;
  setExpanded: (v: boolean | ((b: boolean) => boolean)) => void;
  panelId: string;
  toggle: () => void;
};

const AskImagineContext = createContext<AskImagineContextValue | null>(null);

export function useAskImagine() {
  const ctx = useContext(AskImagineContext);
  if (!ctx) {
    throw new Error("useAskImagine must be used within AskImagineProvider");
  }
  return ctx;
}

function AskImaginePanel() {
  const { open, setOpen, expanded, setExpanded, panelId } = useAskImagine();
  const { mounted, show } = usePresence(open);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const close = useCallback(() => setOpen(false), [setOpen]);

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

  if (!mounted || typeof document === "undefined") return null;

  return createPortal(
    <div
      id={panelId}
      role="dialog"
      aria-modal="true"
      aria-label="Ask Imagine"
      className="pointer-events-none fixed bottom-[max(12px,env(safe-area-inset-bottom))] left-1/2 z-[60] w-[min(420px,calc(100vw-2rem))] -translate-x-1/2 md:left-[296px] md:translate-x-0"
      aria-hidden={!mounted}
    >
      <div
        className={`pointer-events-auto flex w-full flex-col overflow-hidden rounded-br200 border border-[var(--border-default-secondary)] bg-[var(--surface-default)] shadow-[0_12px_40px_rgba(0,0,0,0.12)] dark:shadow-[0_12px_40px_rgba(0,0,0,0.45)] ${txOverlayPanel} ${
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
    </div>,
    document.body,
  );
}

/** Primary trigger — sits in the left nav above the account row */
export function AskImagineSidebarButton() {
  const { open, toggle, panelId } = useAskImagine();

  return (
    <button
      type="button"
      onClick={toggle}
      aria-expanded={open}
      aria-controls={panelId}
      className={cn(
        tx,
        "group flex w-full min-w-0 items-center gap-[var(--s-200)] rounded-[6px] bg-[rgba(255,255,255,0.04)] px-[var(--s-400)] py-[10px] text-left text-[13px] font-medium leading-[18px] text-[#e8e8e8] max-md:min-h-[44px] max-md:items-center",
        "hover:bg-[rgba(255,255,255,0.07)] hover:text-white",
      )}
    >
      <img src="/logos/Mark.svg" alt="" className="h-5 w-5 shrink-0 opacity-90" />
      <span className="min-w-0 flex-1 truncate">Ask Imagine</span>
      <kbd className="hidden shrink-0 rounded border border-[#3f3f3f] bg-[#141414] px-[6px] py-[1px] font-mono text-[11px] text-[#737373] sm:inline">
        {shortcutLabel()}
      </kbd>
    </button>
  );
}

export function AskImagineProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const panelId = useId();

  const toggle = useCallback(() => setOpen((v) => !v), []);

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
    if (!open) setExpanded(false);
  }, [open]);

  const value = useMemo(
    () => ({
      open,
      setOpen,
      expanded,
      setExpanded,
      panelId,
      toggle,
    }),
    [open, expanded, panelId, toggle],
  );

  return (
    <AskImagineContext.Provider value={value}>
      {children}
      <AskImaginePanel />
    </AskImagineContext.Provider>
  );
}
