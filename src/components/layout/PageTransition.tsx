import { useLocation } from "react-router-dom";
import type { ReactNode } from "react";

function cn(...parts: (string | false | undefined)[]) {
  return parts.filter(Boolean).join(" ");
}

/** Fades/slides main content when the route changes. */
export function PageTransition({ children, className }: { children: ReactNode; className?: string }) {
  const location = useLocation();
  return (
    <div key={location.pathname} className={cn("animate-page-in", className)}>
      {children}
    </div>
  );
}
