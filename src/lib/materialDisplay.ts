import type { MaterialRecord } from "@/types";

export function categoryLabel(m: MaterialRecord) {
  if (m.categoryLabel) return m.categoryLabel;
  return m.type.charAt(0).toUpperCase() + m.type.slice(1);
}
