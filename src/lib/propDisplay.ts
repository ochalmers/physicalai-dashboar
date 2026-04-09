import type { PropTagKind, SimReadyTier } from "@/types";

const PROP_SHELF_CATEGORY: Record<string, string> = {
  tableware: "Kitchenware",
  cabinetry: "Furniture",
  appliance: "Appliance",
  decor: "Decor",
  lighting: "Lighting",
  furniture: "Furniture",
  seating: "Seating",
};

export function tagLabel(kind: PropTagKind) {
  switch (kind) {
    case "manipulation":
      return "Manipulation";
    case "articulated":
      return "Articulated";
    case "navigation":
      return "Navigation";
  }
}

export function shelfCategory(slug: string) {
  return PROP_SHELF_CATEGORY[slug] ?? slug.charAt(0).toUpperCase() + slug.slice(1);
}

export function simReadyLabel(t: SimReadyTier) {
  if (t === "certified") return "Certified";
  if (t === "pending") return "Pending";
  return "Unsupported";
}
