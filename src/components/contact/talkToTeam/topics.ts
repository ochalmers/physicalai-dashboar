export type TalkToTeamContext = "export" | "api" | "batch" | "general";

export const TOPICS: { id: TalkToTeamContext; label: string; hint: string }[] = [
  { id: "export", label: "Export & SimReady assets", hint: "USD, GLB, manifests, bulk jobs" },
  { id: "api", label: "API & keys", hint: "Bearer auth, quotas, integration" },
  { id: "batch", label: "Batch generation", hint: "Combinatorial runs, training outputs" },
  { id: "general", label: "Something else", hint: "Partnerships, scoping, roadmap" },
];

export type TalkToTeamLayoutId = "split" | "grid" | "stepper";
