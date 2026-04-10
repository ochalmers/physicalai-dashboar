import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { fetchMaterialById, fetchMaterials } from "@/lib/mockApi";
import { AssetLibraryTabs } from "@/components/assets/AssetLibraryTabs";
import { PageHeader } from "@/components/layout/PageHeader";
import { StaggerFadeGroup } from "@/components/layout/StaggerFadeGroup";
import { ExportAccessModal } from "@/components/access/ExportAccessModal";
import { TalkToTeamModal } from "@/components/contact/TalkToTeamModal";
import { EmptyState } from "@/components/system/EmptyState";
import { ErrorPanel } from "@/components/system/ErrorPanel";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { CenterModal } from "@/components/ui/CenterModal";
import { Skeleton } from "@/components/ui/Skeleton";
import { useAuth } from "@/context/AuthContext";
import { canUseFeature } from "@/lib/access";
import { MaterialAssetDetail } from "@/components/assets/MaterialAssetDetail";
import { categoryLabel } from "@/lib/materialDisplay";
import { materialTypeWash } from "@/lib/prismSurfaces";
import type { MaterialRecord } from "@/types";

const txInteract =
  "transition-[color,background-color,border-color,box-shadow,transform] duration-250 ease-out";

const txBtn =
  "inline-flex items-center justify-center gap-[var(--s-200)] transition-[color,background-color,opacity] duration-250 ease-out";

function materialFrictionLine(m: MaterialRecord) {
  const us = m.staticFriction.toFixed(2);
  const ud = m.dynamicFriction.toFixed(2);
  const e = m.restitution.toFixed(2);
  return `us ${us} · ud ${ud} · e ${e}`;
}

function useMaterialSearchParams() {
  const [searchParams, setSearchParams] = useSearchParams();
  const q = searchParams.get("q") ?? "";
  const type = searchParams.get("type") ?? "all";

  const setParam = (key: string, value: string) => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (!value || value === "all") next.delete(key);
        else next.set(key, value);
        return next;
      },
      { replace: true },
    );
  };

  return { q, type, setParam };
}

export function MaterialsPage() {
  const { accessTier } = useAuth();
  const fullExport = canUseFeature(accessTier, "full_export");
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [talkOpen, setTalkOpen] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const { q, type, setParam } = useMaterialSearchParams();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const query = useMemo(
    () => ({
      q: q.trim() || undefined,
      type,
    }),
    [q, type],
  );

  const list = useQuery({
    queryKey: ["materials", q.trim(), type] as const,
    queryFn: () => fetchMaterials(query),
  });

  const detail = useQuery({
    queryKey: ["material", selectedId],
    queryFn: () => fetchMaterialById(selectedId!),
    enabled: Boolean(selectedId),
  });
  const selected = detail.data ?? null;

  return (
    <>
    <StaggerFadeGroup staggerMs={100} className="flex flex-col gap-[var(--s-400)]">
      <AssetLibraryTabs />

      <PageHeader
        title="Materials"
        description="PBR surfaces with friction and restitution presets for Kitchen environments — wood, metal, glass, stone, tile, and fabrics."
        actions={
          <div className="flex flex-wrap gap-[var(--s-200)] lg:justify-end">
            <Button variant="secondary" type="button" className={txBtn} onClick={() => setTalkOpen(true)}>
              <span className="material-symbols-outlined text-[18px]" aria-hidden>
                upload
              </span>
              Upload / Add New
            </Button>
            <button
              type="button"
              aria-expanded={filtersOpen}
              onClick={() => setFiltersOpen((o) => !o)}
              className={`inline-flex items-center gap-[var(--s-200)] rounded-br100 border border-[var(--border-default-secondary)] bg-[var(--surface-default)] px-[var(--s-400)] py-[var(--s-200)] text-[14px] font-medium text-[var(--text-default-heading)] hover:bg-[var(--surface-page-secondary)] ${txInteract}`}
            >
              <span className="material-symbols-outlined text-[20px] text-[var(--text-default-body)]">tune</span>
              {filtersOpen ? "Hide filters" : "Filters"}
            </button>
            <Button
              variant="secondary"
              type="button"
              className={txBtn}
              aria-haspopup={!fullExport ? "dialog" : undefined}
              onClick={() => {
                if (!fullExport) {
                  setExportModalOpen(true);
                  return;
                }
                alert("Bulk export queued: material library manifest");
              }}
            >
              {!fullExport ? (
                <span className="material-symbols-outlined text-[18px]" aria-hidden>
                  lock
                </span>
              ) : null}
              Bulk export
            </Button>
          </div>
        }
      />

      {filtersOpen ? (
        <div id="material-filters">
          <Card className="p-[var(--s-300)] sm:p-[var(--s-400)]">
          <label className="flex max-w-xs flex-col gap-[var(--s-100)] text-[13px] font-medium text-[var(--text-default-body)]">
            Type
            <select
              value={type}
              onChange={(e) => setParam("type", e.target.value)}
              className={`rounded-br100 border border-[var(--border-default-secondary)] px-[var(--s-300)] py-[var(--s-200)] text-[14px] ${txInteract}`}
            >
              <option value="all">All</option>
              <option value="wood">Wood</option>
              <option value="metal">Metal</option>
              <option value="glass">Glass</option>
              <option value="stone">Stone</option>
              <option value="tile">Tile / ceramic</option>
              <option value="plastic">Plastic</option>
              <option value="fabric">Fabric</option>
            </select>
          </label>
          </Card>
        </div>
      ) : null}

      {list.isError ? (
        <ErrorPanel message="Materials couldn’t be loaded." onRetry={() => list.refetch()} />
      ) : list.isLoading ? (
        <div className="grid w-full grid-cols-[repeat(auto-fill,minmax(min(100%,200px),1fr))] gap-[var(--s-300)]">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-56 w-full min-w-0" />
          ))}
        </div>
      ) : list.data?.length === 0 ? (
        <EmptyState
          title="No materials match"
          description="Try clearing search or type filters to see the full library."
        />
      ) : (
        <StaggerFadeGroup
          staggerMs={150}
          className="grid w-full grid-cols-[repeat(auto-fill,minmax(min(100%,200px),1fr))] gap-[var(--s-300)]"
        >
          {list.data?.map((m) => (
            <MaterialCard key={m.id} material={m} onOpen={() => setSelectedId(m.id)} />
          ))}
        </StaggerFadeGroup>
      )}
    </StaggerFadeGroup>

      <CenterModal
        open={Boolean(selectedId)}
        title={selected?.name ?? "Material"}
        onClose={() => setSelectedId(null)}
        size="2xl"
        contentAlign="start"
        hideHeader
      >
        {detail.isLoading ? (
          <Skeleton className="h-40 w-full" />
        ) : selected ? (
          <MaterialAssetDetail
            material={selected}
            exportAllowed={fullExport}
            onGatedExport={() => setExportModalOpen(true)}
          />
        ) : (
          <p className="text-[14px] text-[var(--text-error-default)]">Material not found.</p>
        )}
      </CenterModal>

      <ExportAccessModal open={exportModalOpen} onClose={() => setExportModalOpen(false)} />
      <TalkToTeamModal open={talkOpen} onClose={() => setTalkOpen(false)} context="general" />
    </>
  );
}

function MaterialCard({ material, onOpen }: { material: MaterialRecord; onOpen: () => void }) {
  const accent = materialTypeWash(material.type);
  return (
    <button
      type="button"
      onClick={onOpen}
      className={`flex w-full min-w-0 flex-col overflow-hidden rounded-br200 border border-[var(--border-default-secondary)] bg-[var(--surface-default)] text-left shadow-sm hover:shadow-md active:scale-[0.99] ${txInteract}`}
    >
      <div className={`relative aspect-[4/3] w-full overflow-hidden rounded-t-[var(--br-200)] ${accent}`}>
        {material.thumbnailUrl ? (
          <img
            src={material.thumbnailUrl}
            alt=""
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover object-center"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="material-symbols-outlined text-[44px] text-[var(--text-default-heading)] opacity-[0.14]">
              grid_on
            </span>
          </div>
        )}
      </div>
      <div className="space-y-[var(--s-200)] px-[var(--s-300)] pb-[var(--s-400)] pt-[var(--s-400)]">
        <h2 className="text-[16px] font-semibold leading-snug text-[var(--text-default-heading)]">{material.name}</h2>
        <p className="text-[13px] leading-[18px] text-[var(--text-default-body)]">{categoryLabel(material)}</p>
        <p className="font-mono text-[12px] leading-[18px] text-[var(--text-default-placeholder)]">{materialFrictionLine(material)}</p>
        {material.physicsLineOverride ? (
          <p className="text-[12px] leading-[16px] text-[var(--text-default-body)]">{material.physicsLineOverride}</p>
        ) : null}
      </div>
    </button>
  );
}

