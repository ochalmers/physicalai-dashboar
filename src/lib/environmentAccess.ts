/**
 * Kitchen is the only environment with a full interactive workspace.
 */
export function isLiveEnvironmentWorkspace(slug: string): boolean {
  return slug === "kitchen";
}

const LOCKED_ENVIRONMENT_SLUGS = ["living-room", "warehouse", "retail-store"] as const;

/** Catalog environments that are visible but require full access to use. */
export function isLockedEnvironmentWorkspace(slug: string): boolean {
  return (LOCKED_ENVIRONMENT_SLUGS as readonly string[]).includes(slug);
}
