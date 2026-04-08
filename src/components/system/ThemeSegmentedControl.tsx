import { tx } from "@/components/layout/motion";
import type { ThemePreference } from "@/lib/theme";

type ThemeSegmentedControlProps = {
  value: ThemePreference;
  onChange: (t: ThemePreference) => void;
  className?: string;
};

const seg =
  "inline-flex min-h-[44px] flex-1 items-center justify-center gap-[var(--s-200)] rounded-br100 px-[var(--s-400)] py-[var(--s-200)] text-[14px] font-medium transition-[color,background-color,box-shadow] duration-250 ease-out";

export function ThemeSegmentedControl({ value, onChange, className = "" }: ThemeSegmentedControlProps) {
  return (
    <div
      className={`inline-flex w-full max-w-md rounded-br200 border border-[var(--border-default-secondary)] bg-[var(--surface-page-secondary)] p-[3px] ${className}`}
      role="group"
      aria-label="Appearance"
    >
      <button
        type="button"
        aria-pressed={value === "light"}
        className={`${seg} ${tx} ${
          value === "light"
            ? "bg-[var(--surface-default)] text-[var(--text-default-heading)] shadow-sm"
            : "text-[var(--text-default-body)] hover:text-[var(--text-default-heading)]"
        }`}
        onClick={() => onChange("light")}
      >
        <span className="material-symbols-outlined text-[20px]" aria-hidden>
          light_mode
        </span>
        Light
      </button>
      <button
        type="button"
        aria-pressed={value === "dark"}
        className={`${seg} ${tx} ${
          value === "dark"
            ? "bg-[var(--surface-default)] text-[var(--text-default-heading)] shadow-sm"
            : "text-[var(--text-default-body)] hover:text-[var(--text-default-heading)]"
        }`}
        onClick={() => onChange("dark")}
      >
        <span className="material-symbols-outlined text-[20px]" aria-hidden>
          dark_mode
        </span>
        Dark
      </button>
    </div>
  );
}
