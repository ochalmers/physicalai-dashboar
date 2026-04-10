import type { KitchenParamKey } from "@/kitchen/params";
import { defaultKitchenValues, KITCHEN_PARAM_KEYS } from "@/kitchen/params";

const DEFAULTS = defaultKitchenValues();

function effectiveOptions(k: KitchenParamKey, sel: Record<KitchenParamKey, string[]>): string[] {
  const o = sel[k];
  if (o && o.length > 0) return o;
  return [DEFAULTS[k]];
}

/** Deterministic PRNG for stable Monte Carlo estimates (same selections → same counts). */
function mulberry32(a: number) {
  return function () {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hashSelections(sel: Record<KitchenParamKey, string[]>): number {
  let h = 2166136261;
  const json = JSON.stringify(KITCHEN_PARAM_KEYS.map((k) => [k, [...effectiveOptions(k, sel)].sort()]));
  for (let i = 0; i < json.length; i++) {
    h ^= json.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function combinationProduct(sel: Record<KitchenParamKey, string[]>): number {
  let n = 1;
  for (const k of KITCHEN_PARAM_KEYS) {
    n *= effectiveOptions(k, sel).length;
  }
  return n;
}

/** Single kitchen configuration tuple — must satisfy layout / appliance compatibility rules. */
export function isValidKitchenTuple(t: Record<KitchenParamKey, string>): boolean {
  if (t.Layout === "Galley" && (t.Island === "Standard Island" || t.Island === "Large Island")) {
    return false;
  }
  if (t["Wall Cabinet"] === "Microwave Cabinet" && t["Appliance Preset"] === "Minimal (Sink Only)") {
    return false;
  }
  if (
    t["Appliance Preset"] === "Minimal (Sink Only)" &&
    (t["Base Cabinet"] === "Oven Cabinet" || t["Tall Cabinet"] === "Oven Cabinet")
  ) {
    return false;
  }
  if (t["Door Handle"] === "None" && t["Door Style"] !== "Slab") {
    return false;
  }
  return true;
}

function* iterateTuples(sel: Record<KitchenParamKey, string[]>): Generator<Record<KitchenParamKey, string>> {
  const keys = [...KITCHEN_PARAM_KEYS];
  const arrays = keys.map((k) => effectiveOptions(k, sel));
  const cur: Record<KitchenParamKey, string> = {} as Record<KitchenParamKey, string>;

  function* dfs(depth: number): Generator<Record<KitchenParamKey, string>> {
    if (depth === keys.length) {
      yield { ...cur };
      return;
    }
    const key = keys[depth]!;
    for (const v of arrays[depth]!) {
      cur[key] = v;
      yield* dfs(depth + 1);
    }
  }
  yield* dfs(0);
}

function randomTuple(sel: Record<KitchenParamKey, string[]>, rng: () => number): Record<KitchenParamKey, string> {
  const t = {} as Record<KitchenParamKey, string>;
  for (const k of KITCHEN_PARAM_KEYS) {
    const opts = effectiveOptions(k, sel);
    t[k] = opts[Math.floor(rng() * opts.length)]!;
  }
  return t;
}

const BRUTE_FORCE_CAP = 2_500_000;
const MC_SAMPLES = 120_000;

export function getBatchCombinationStats(sel: Record<KitchenParamKey, string[]>): {
  raw: number;
  valid: number;
  invalid: number;
} {
  const raw = combinationProduct(sel);
  if (raw === 0) return { raw: 0, valid: 0, invalid: 0 };

  if (raw <= BRUTE_FORCE_CAP) {
    let valid = 0;
    for (const tuple of iterateTuples(sel)) {
      if (isValidKitchenTuple(tuple)) valid++;
    }
    return { raw, valid, invalid: raw - valid };
  }

  const rng = mulberry32(hashSelections(sel));
  let validHits = 0;
  for (let i = 0; i < MC_SAMPLES; i++) {
    if (isValidKitchenTuple(randomTuple(sel, rng))) validHits++;
  }
  const valid = Math.round((validHits / MC_SAMPLES) * raw);
  const invalid = Math.max(0, raw - valid);
  return { raw, valid, invalid };
}
