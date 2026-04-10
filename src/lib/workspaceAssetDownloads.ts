/** Tracks which catalog assets the user has already pulled into their workspace (demo). */
const KEY = "imagine.physicalai.workspace.assets.v1";

function readIds(): Set<string> {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return new Set();
    const arr = JSON.parse(raw) as unknown;
    if (!Array.isArray(arr)) return new Set();
    return new Set(arr.filter((x): x is string => typeof x === "string"));
  } catch {
    return new Set();
  }
}

function writeIds(ids: Set<string>) {
  try {
    localStorage.setItem(KEY, JSON.stringify([...ids]));
  } catch {
    /* ignore */
  }
}

export function isAssetInWorkspace(assetId: string): boolean {
  return readIds().has(assetId);
}

export function recordAssetDownloaded(assetId: string) {
  const ids = readIds();
  ids.add(assetId);
  writeIds(ids);
}
