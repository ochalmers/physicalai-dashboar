/**
 * Only these environment slugs navigate to the full workspace detail experience.
 * All others should open “Talk to Team” instead of routing to `/environments/:slug/...`.
 */
export function isLiveEnvironmentWorkspace(slug: string): boolean {
  return slug === "kitchen";
}
