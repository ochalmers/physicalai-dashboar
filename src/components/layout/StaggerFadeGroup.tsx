import { Children, type ReactNode } from "react";
import { useLocation } from "react-router-dom";

function childKey(child: ReactNode, index: number): string | number {
  if (typeof child === "object" && child !== null && "key" in child && child.key != null) {
    return String(child.key);
  }
  return index;
}

type StaggerFadeGroupProps = {
  children: ReactNode;
  /** Delay between each child in milliseconds (default 150). */
  staggerMs?: number;
  className?: string;
  /** Root element for layout (grid, flex column, etc.). */
  as?: "div" | "section" | "ul";
};

/**
 * Wraps each child in a staggered fade-in (opacity + slight lift). Re-runs when the route changes.
 * Use for asset grids (`className="grid ..."`) or page sections (`flex flex-col gap-...`).
 */
export function StaggerFadeGroup({
  children,
  staggerMs = 150,
  className = "",
  as: Tag = "div",
}: StaggerFadeGroupProps) {
  const { pathname } = useLocation();
  const items = Children.toArray(children);

  return (
    <Tag key={pathname} className={className}>
      {items.map((child, i) => (
        <div
          key={childKey(child, i)}
          className="min-w-0 w-full animate-stagger-fade-in opacity-0 [animation-fill-mode:forwards]"
          style={{ animationDelay: `${i * staggerMs}ms` }}
        >
          {child}
        </div>
      ))}
    </Tag>
  );
}
