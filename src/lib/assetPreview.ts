/**
 * True when the catalog entry has an interactive glTF/GLB under `public/` (e.g. `/assets/3d/foo.glb`).
 * Add the file, then set `previewModelUrl` on the prop or material in `mockCatalog.ts`.
 */
export function hasPreviewModel(url?: string | null): boolean {
  return typeof url === "string" && url.trim().length > 0;
}
