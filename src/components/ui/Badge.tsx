import type { ReactNode } from "react";

export function Badge({
  children,
  variant = "neutral",
}: {
  children: ReactNode;
  /** `live` / `soon` / `locked` are semantic labels for environment and access UI */
  variant?:
    | "neutral"
    | "success"
    | "warning"
    | "error"
    | "live"
    | "soon"
    | "locked";
}) {
  const map = {
    neutral: "bg-[#2a2a2a] text-[var(--grey-200)]",
    success: "bg-[#0d2a1a] text-[var(--text-success-default)]",
    warning: "bg-[var(--yellow-100)] text-[var(--yellow-800)]",
    error: "bg-[var(--surface-error-default-subtle)] text-[var(--text-error-default)]",
    live: "bg-[#0d2a1a] text-[var(--text-success-default)]",
    soon: "bg-[#2a2a2a] text-[#a3a3a3]",
    locked: "border border-[var(--border-default-secondary)] bg-[var(--surface-page-secondary)] text-[var(--text-default-body)]",
  } as const;
  return (
    <span
      className={`inline-flex items-center rounded-full px-s200 py-s100 text-[10px] font-medium uppercase leading-none transition-[color,background-color] duration-250 ease-out ${map[variant]}`}
    >
      {children}
    </span>
  );
}
