import { Link, NavLink, Navigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { createPortal } from "react-dom";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { ErrorPanel } from "@/components/system/ErrorPanel";
import { Button } from "@/components/ui/Button";
import { TalkToTeamModal } from "@/components/contact/TalkToTeamModal";
import { fetchJobs } from "@/lib/mockApi";

type WorkspaceTab = "batch" | "api" | "props" | "assets" | "downloads";

type EnvironmentMeta = {
  slug: string;
  name: string;
  status: "live" | "in-progress";
  accentClass: string;
  heroImage: string;
};

const ENVIRONMENTS: Record<string, EnvironmentMeta> = {
  kitchen: {
    slug: "kitchen",
    name: "Kitchen",
    status: "live",
    accentClass: "bg-[var(--green-500)]",
    heroImage: "/assets/environments/kitchen.jpg",
  },
  "living-room": {
    slug: "living-room",
    name: "Living Room",
    status: "in-progress",
    accentClass: "bg-[#eab308]",
    heroImage: "/assets/environments/livingroom.png",
  },
  warehouse: {
    slug: "warehouse",
    name: "Warehouse",
    status: "in-progress",
    accentClass: "bg-[#eab308]",
    heroImage: "/assets/environments/warehouse.png",
  },
  "retail-store": {
    slug: "retail-store",
    name: "Retail Store",
    status: "in-progress",
    accentClass: "bg-[#eab308]",
    heroImage: "/assets/environments/store.png",
  },
};

const tabs: { id: WorkspaceTab; label: string }[] = [
  { id: "batch", label: "Batch Variations" },
  { id: "api", label: "API" },
  { id: "props", label: "Props" },
  { id: "assets", label: "Assets" },
  { id: "downloads", label: "Downloads" },
];

type BatchFilterGroup = {
  label: string;
  options: string[];
};

const BATCH_FILTERS: BatchFilterGroup[] = [
  { label: "Lighting", options: ["Bright Daylight", "Warm Evening", "Dim Artificial"] },
  { label: "Clutter Density", options: ["Empty", "Moderate", "Dense"] },
  { label: "Camera Angle", options: ["Wide", "Counter", "Top-down"] },
];

const VARIATION_CARDS = Array.from({ length: 16 }).map((_, idx) => ({
  id: `VAR-${String(idx + 1).padStart(4, "0")}`,
  subtitle: idx % 2 === 0 ? "L-Shaped · Slab · Black Acrylic" : "U-Shaped · Shaker · Quartz Cloud",
  lighting: idx % 3 === 0 ? "Bright Daylight" : idx % 3 === 1 ? "Warm Evening" : "Dim Artificial",
  clutter: idx % 2 === 0 ? "Moderate" : "Dense",
}));

function WorkspaceNav({ environmentSlug }: { environmentSlug: string }) {
  return (
    <nav className="border-b border-[var(--border-default-secondary)]">
      <ul className="flex flex-wrap gap-[var(--s-200)]">
        {tabs.map((tab) => (
          <li key={tab.id}>
            <NavLink
              to={`/environments/${environmentSlug}/${tab.id}`}
              className={({ isActive }) =>
                [
                  "inline-flex items-center border-b-2 px-[var(--s-200)] py-[var(--s-200)] text-[13px] font-medium transition-colors",
                  isActive
                    ? "border-[var(--papaya-500)] text-[var(--text-default-heading)]"
                    : "border-transparent text-[var(--text-default-body)] hover:text-[var(--text-default-heading)]",
                ].join(" ")
              }
            >
              {tab.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}

function BatchVariationsPanel({ environmentSlug }: { environmentSlug: string }) {
  const [filters, setFilters] = useState<Record<string, string[]>>({
    Lighting: ["Bright Daylight"],
    "Clutter Density": ["Moderate"],
    "Camera Angle": [],
  });
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const filteredCards = VARIATION_CARDS.filter((card) => {
    const lighting = filters.Lighting ?? [];
    const clutter = filters["Clutter Density"] ?? [];
    const camera = filters["Camera Angle"] ?? [];
    const lightingMatch = lighting.length === 0 || lighting.includes(card.lighting);
    const clutterMatch = clutter.length === 0 || clutter.includes(card.clutter);
    const cameraMatch = camera.length === 0 || camera.includes("Wide");
    return lightingMatch && clutterMatch && cameraMatch;
  });

  const toggleFilter = (group: string, value: string) => {
    setFilters((prev) => {
      const set = new Set(prev[group] ?? []);
      if (set.has(value)) set.delete(value);
      else set.add(value);
      return { ...prev, [group]: Array.from(set) };
    });
  };

  const toggleCard = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const selectAll = () => {
    setSelectedIds(filteredCards.map((c) => c.id));
  };

  const clearAll = () => setSelectedIds([]);

  const generateSelected = () => {
    if (!selectedIds.length || isGenerating) return;
    setIsGenerating(true);
    window.setTimeout(() => {
      setIsGenerating(false);
      alert(`Generation started for ${selectedIds.length} variation(s) in ${environmentSlug}.`);
    }, 450);
  };

  return (
    <div className="space-y-[var(--s-300)]">
      <div className="flex flex-wrap items-center gap-[var(--s-200)] rounded-br200 border border-[var(--border-default-secondary)] bg-[var(--surface-default)] p-[var(--s-300)]">
        <p className="text-[13px] text-[var(--text-default-body)]">
          <span className="font-medium text-[var(--text-default-heading)]">{selectedIds.length}</span> selected
        </p>
        <Button variant="primary" onClick={generateSelected} disabled={!selectedIds.length || isGenerating}>
          {isGenerating ? "Generating..." : "Generate Selected"}
        </Button>
        <Button variant="secondary" onClick={selectAll}>
          Select All
        </Button>
        <Button variant="secondary" onClick={clearAll}>
          Clear
        </Button>
      </div>

      <div className="grid gap-[var(--s-300)] lg:grid-cols-[280px_minmax(0,1fr)]">
        <div className="space-y-[var(--s-300)]">
          {BATCH_FILTERS.map((group) => (
            <Card key={group.label} title={group.label}>
              <div className="space-y-[var(--s-200)]">
                {group.options.map((opt) => {
                  const checked = (filters[group.label] ?? []).includes(opt);
                  return (
                    <label key={opt} className="flex cursor-pointer items-center gap-[var(--s-200)] text-[13px] text-[var(--text-default-heading)]">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleFilter(group.label, opt)}
                        className="h-4 w-4 rounded border-[var(--border-default-secondary)]"
                      />
                      {opt}
                    </label>
                  );
                })}
              </div>
            </Card>
          ))}
        </div>

        <div className="grid gap-[var(--s-300)] sm:grid-cols-2 xl:grid-cols-4">
          {filteredCards.map((card) => {
            const selected = selectedIds.includes(card.id);
            return (
              <button
                type="button"
                key={card.id}
                onClick={() => toggleCard(card.id)}
                className={`overflow-hidden rounded-br200 border text-left transition-[border-color,box-shadow,transform] duration-200 ${
                  selected
                    ? "border-[var(--border-primary-default)] shadow-[0_0_0_1px_var(--border-primary-default)]"
                    : "border-[var(--border-default-secondary)]"
                }`}
              >
                <div className="flex h-[96px] items-center justify-center bg-[var(--surface-page-secondary)]">
                  <span className="material-symbols-outlined text-[24px] text-[var(--text-default-placeholder)]">deployed_code</span>
                </div>
                <div className="space-y-[6px] p-[var(--s-300)]">
                  <div className="flex items-center justify-between">
                    <p className="text-[12px] font-semibold text-[var(--text-default-heading)]">{card.id}</p>
                    <input type="checkbox" readOnly checked={selected} className="h-4 w-4 rounded" />
                  </div>
                  <p className="text-[12px] text-[var(--text-default-body)]">{card.subtitle}</p>
                  <p className="text-[12px] text-[var(--text-default-placeholder)]">
                    {card.lighting} · {card.clutter}
                  </p>
                  <p className="text-[12px] font-medium text-[var(--text-success-default)]">Ready</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function WorkspacePanel({ section, environmentSlug }: { section: WorkspaceTab; environmentSlug: string }) {
  const jobs = useQuery({ queryKey: ["jobs"], queryFn: fetchJobs, enabled: section === "downloads" });

  if (section === "batch") {
    return <BatchVariationsPanel environmentSlug={environmentSlug} />;
  }

  if (section === "api") {
    return (
      <Card title="API">
        <p className="text-[14px] leading-[22px] text-[var(--text-default-body)]">
          Manage API keys and integration references for this environment workflow.
        </p>
        <Link
          to="/api"
          className="mt-[var(--s-300)] inline-flex items-center gap-[var(--s-200)] text-[14px] font-medium text-[var(--text-primary-default)] hover:underline"
        >
          Open API docs
          <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
        </Link>
      </Card>
    );
  }

  if (section === "props") {
    return (
      <Card title="Props library">
        <p className="text-[14px] leading-[22px] text-[var(--text-default-body)]">
          Browse and filter simulation-ready props used by environment configurations.
        </p>
        <Link
          to="/assets/props"
          className="mt-[var(--s-300)] inline-flex items-center gap-[var(--s-200)] text-[14px] font-medium text-[var(--text-primary-default)] hover:underline"
        >
          Open props
          <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
        </Link>
      </Card>
    );
  }

  if (section === "assets") {
    return (
      <Card title="Assets">
        <p className="text-[14px] leading-[22px] text-[var(--text-default-body)]">
          Open the asset libraries used by this environment workflow.
        </p>
        <div className="mt-[var(--s-300)] grid gap-[var(--s-300)] md:grid-cols-2">
          <Link
            to="/assets/props"
            className="group overflow-hidden rounded-br200 border border-[var(--border-default-secondary)] bg-[var(--surface-page-secondary)]"
          >
            <img src="/assets/Props/Dining Chair.png" alt="Props" className="h-[120px] w-full object-cover" />
            <div className="flex items-center justify-between px-[var(--s-300)] py-[var(--s-300)]">
              <span className="text-[15px] font-medium text-[var(--text-default-heading)]">Props</span>
              <span className="material-symbols-outlined text-[18px] text-[var(--text-default-body)] transition-transform duration-200 group-hover:translate-x-0.5">
                arrow_forward
              </span>
            </div>
          </Link>
          <Link
            to="/assets/materials"
            className="group overflow-hidden rounded-br200 border border-[var(--border-default-secondary)] bg-[var(--surface-page-secondary)]"
          >
            <img src="/assets/Materials/Carrara Marble.png" alt="Materials" className="h-[120px] w-full object-cover" />
            <div className="flex items-center justify-between px-[var(--s-300)] py-[var(--s-300)]">
              <span className="text-[15px] font-medium text-[var(--text-default-heading)]">Materials</span>
              <span className="material-symbols-outlined text-[18px] text-[var(--text-default-body)] transition-transform duration-200 group-hover:translate-x-0.5">
                arrow_forward
              </span>
            </div>
          </Link>
        </div>
        <div className="mt-[var(--s-300)]">
          <Link
            to="/assets"
            className="inline-flex items-center gap-[var(--s-200)] text-[14px] font-medium text-[var(--text-primary-default)] hover:underline"
          >
            Open all assets
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </Link>
        </div>
      </Card>
    );
  }

  return (
    <Card title="Downloads">
      {jobs.isError ? (
        <ErrorPanel message="Could not load downloads." onRetry={() => jobs.refetch()} />
      ) : jobs.isLoading ? (
        <div className="space-y-[var(--s-200)]">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      ) : jobs.data?.length ? (
        <ul className="space-y-[var(--s-200)] text-[13px]">
          {jobs.data.slice(0, 6).map((job) => (
            <li key={job.id} className="flex items-center justify-between gap-[var(--s-300)] border-b border-[var(--border-default-secondary)] pb-[var(--s-200)] last:border-0">
              <span className="font-mono text-[12px] text-[var(--text-default-heading)]">{job.id}</span>
              <span className="capitalize text-[var(--text-default-body)]">{job.status}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-[14px] text-[var(--text-default-body)]">No downloads yet.</p>
      )}
    </Card>
  );
}

export function EnvironmentWorkspacePage() {
  const { environmentSlug, section } = useParams();
  const meta = environmentSlug ? ENVIRONMENTS[environmentSlug] : null;
  const [talkOpen, setTalkOpen] = useState(false);

  if (!meta) {
    return <Navigate to="/environments" replace />;
  }

  const activeSection = (section ?? "batch") as WorkspaceTab;
  if (!tabs.some((t) => t.id === activeSection)) {
    return <Navigate to={`/environments/${meta.slug}/batch`} replace />;
  }

  const gatedShell = meta.status === "live" ? "" : "pointer-events-none select-none";

  /**
   * Full-access veil must render via `createPortal(document.body)`: `PageTransition` applies
   * `transform` for route enter animation, which creates a containing block — `position: fixed`
   * inside the page tree would only cover the max-width content column, not the full main pane.
   */
  const fullAccessVeil =
    meta.status !== "live" && typeof document !== "undefined"
      ? createPortal(
          <div
            className="fixed inset-0 z-[48] flex items-center justify-center bg-[rgba(255,255,255,0.68)] px-[var(--s-300)] backdrop-blur-[10px] sm:px-[var(--s-400)] md:left-[272px]"
            role="presentation"
          >
            <div
              className="w-full max-w-[430px] rounded-br200 border border-[#ececec] bg-[var(--surface-default)] px-[var(--s-500)] py-[var(--s-500)] shadow-[0_10px_24px_rgba(0,0,0,0.14)]"
              role="dialog"
              aria-modal="true"
              aria-labelledby="full-access-title"
            >
              <h2
                id="full-access-title"
                className="text-[22px] font-semibold leading-[1.25] tracking-[-0.02em] text-[var(--text-default-heading)]"
              >
                Full Access Required
              </h2>
              <div className="mt-[var(--s-300)] space-y-[var(--s-200)] text-left text-[15px] leading-[1.55] text-[var(--text-default-body)]">
                <p>{meta.name} environments are available with full platform access.</p>
                <p>Contact our team to enable access.</p>
              </div>
              <Button
                variant="primary"
                className="mt-[var(--s-400)] h-[42px] w-full rounded-br100 text-[14px] font-semibold"
                onClick={() => setTalkOpen(true)}
              >
                Talk to Team
              </Button>
            </div>
          </div>,
          document.body
        )
      : null;

  return (
    <>
      <div className="space-y-[var(--s-400)]">
        <div className={gatedShell}>
          <section className="relative overflow-hidden rounded-br200 border border-[var(--border-default-secondary)]">
            <img src={meta.heroImage} alt={`${meta.name}`} className="h-[220px] w-full object-cover md:h-[260px]" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-black/20" />
          </section>

          <PageHeader
            title={
              <span className="inline-flex items-center gap-[var(--s-200)]">
                <span className={`h-2.5 w-2.5 rounded-full ${meta.accentClass}`} aria-hidden />
                {meta.name}
              </span>
            }
            description={
              meta.status === "live"
                ? "Environment workspace with generation, APIs, asset libraries, and downloads."
                : "Environment workspace is available for planning flows and asset/API setup."
            }
          />
          <WorkspaceNav environmentSlug={meta.slug} />
          <WorkspacePanel section={activeSection} environmentSlug={meta.slug} />
        </div>
      </div>
      {fullAccessVeil}
      <TalkToTeamModal open={talkOpen} onClose={() => setTalkOpen(false)} context="general" />
    </>
  );
}
