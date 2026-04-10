/**
 * Explore-access limits for the Kitchen workflow (demo counters in localStorage).
 * Not a security boundary — product direction: limited but real interaction.
 */
const STORAGE_KEY = "imagine.physicalai.kitchen.usage.v1";

export const KITCHEN_LIMITS = {
  sceneDownloads: 25,
  batchRuns: 12,
  configChanges: 50,
} as const;

type Usage = {
  sceneDownloads: number;
  batchRuns: number;
  configChanges: number;
};

function read(): Usage {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { sceneDownloads: 0, batchRuns: 0, configChanges: 0 };
    const p = JSON.parse(raw) as Partial<Usage>;
    return {
      sceneDownloads: Math.max(0, Number(p.sceneDownloads) || 0),
      batchRuns: Math.max(0, Number(p.batchRuns) || 0),
      configChanges: Math.max(0, Number(p.configChanges) || 0),
    };
  } catch {
    return { sceneDownloads: 0, batchRuns: 0, configChanges: 0 };
  }
}

function write(u: Usage) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
  } catch {
    /* ignore quota */
  }
}

export function remaining(kind: keyof typeof KITCHEN_LIMITS): number {
  const u = read();
  const used =
    kind === "sceneDownloads" ? u.sceneDownloads : kind === "batchRuns" ? u.batchRuns : u.configChanges;
  const cap = KITCHEN_LIMITS[kind];
  return Math.max(0, cap - used);
}

/** Returns false if limit reached (caller should show Talk to Team / upgrade). */
export function tryConsume(kind: keyof typeof KITCHEN_LIMITS): boolean {
  const u = read();
  const key =
    kind === "sceneDownloads" ? "sceneDownloads" : kind === "batchRuns" ? "batchRuns" : "configChanges";
  if (u[key] >= KITCHEN_LIMITS[kind]) return false;
  write({ ...u, [key]: u[key] + 1 });
  return true;
}
