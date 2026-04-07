import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { fetchMaterialById, fetchMaterials } from "@/lib/mockApi";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { CenterModal } from "@/components/ui/CenterModal";
import { Skeleton } from "@/components/ui/Skeleton";
import type { MaterialRecord } from "@/types";

const txInteract =
  "transition-[color,background-color,border-color,box-shadow,transform] duration-250 ease-out";

function formatLine(m: MaterialRecord) {
  const us = m.staticFriction.toFixed(2);
  const ud = m.dynamicFriction.toFixed(2);
  const e = m.restitution.toFixed(2);
  return `us: ${us} | ud: ${ud} | e: ${e}`;
}

export function MaterialsPage() {
  const [q, setQ] = useState("");
  const [type, setType] = useState("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const query = useMemo(() => ({ q: q || undefined, type }), [q, type]);
  const list = useQuery({ queryKey: ["materials", query], queryFn: () => fetchMaterials(query) });
  const detail = useQuery({
    queryKey: ["material", selectedId],
    queryFn: () => fetchMaterialById(selectedId!),
    enabled: Boolean(selectedId),
  });
  const selected = detail.data ?? null;

  return (
    <div className="space-y-[var(--s-400)]">
      <header className="flex flex-col gap-[var(--s-300)] sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[12px] font-medium uppercase tracking-[var(--text-caption-ls)] text-[var(--text-default-body)]">
            Asset library
          </p>
          <h1 className="text-page-title mt-[var(--s-200)]">Materials</h1>
          <p className="mt-[var(--s-200)] max-w-[720px] text-[14px] text-[var(--text-default-body)]">
            Physics presets: friction, restitution, density. Used by collision and grip simulation.
          </p>
        </div>
        <button
          type="button"
          className={`inline-flex items-center gap-[var(--s-200)] self-start rounded-br100 border border-[var(--border-default-secondary)] bg-[var(--surface-default)] px-[var(--s-400)] py-[var(--s-200)] text-[14px] font-medium text-[var(--text-default-heading)] hover:bg-[var(--surface-page-secondary)] ${txInteract}`}
        >
          <span className="material-symbols-outlined text-[20px] text-[var(--text-default-body)]">tune</span>
          Filters
        </button>
      </header>

      <Card>
        <div className="flex flex-col gap-[var(--s-300)] md:flex-row md:items-end">
          <label className="flex flex-1 flex-col gap-[var(--s-100)] text-[12px] uppercase tracking-[var(--text-caption-ls)] text-[var(--text-default-body)]">
            Search
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className={`rounded-br100 border border-[var(--border-default-secondary)] px-[var(--s-300)] py-[var(--s-200)] text-[14px] ${txInteract}`}
            />
          </label>
          <label className="flex flex-col gap-[var(--s-100)] text-[12px] uppercase tracking-[var(--text-caption-ls)] text-[var(--text-default-body)]">
            Type
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className={`rounded-br100 border border-[var(--border-default-secondary)] px-[var(--s-300)] py-[var(--s-200)] text-[14px] ${txInteract}`}
            >
              <option value="all">All</option>
              <option value="wood">wood</option>
              <option value="metal">metal</option>
              <option value="glass">glass</option>
              <option value="stone">stone</option>
              <option value="tile">tile</option>
            </select>
          </label>
        </div>
      </Card>

      {list.isLoading ? (
        <div className="grid gap-[var(--s-400)] sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6">
          {Array.from({ length: 12 }).map((_, i) => (
            <Skeleton key={i} className="h-40" />
          ))}
        </div>
      ) : (
        <div className="grid gap-[var(--s-400)] sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6">
          {list.data?.map((m) => (
            <MaterialCard key={m.id} material={m} onOpen={() => setSelectedId(m.id)} />
          ))}
        </div>
      )}

      <CenterModal
        open={Boolean(selectedId)}
        title={selected?.name ?? "Material"}
        onClose={() => setSelectedId(null)}
        size="lg"
      >
        {detail.isLoading ? (
          <Skeleton className="h-40 w-full" />
        ) : selected ? (
          <MaterialDetail material={selected} />
        ) : (
          <p className="text-[14px] text-[var(--text-error-default)]">Material not found.</p>
        )}
      </CenterModal>
    </div>
  );
}

function MaterialCard({ material, onOpen }: { material: MaterialRecord; onOpen: () => void }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className={`flex flex-col rounded-br200 border border-[var(--border-default-secondary)] bg-[var(--surface-default)] text-left hover:shadow-md active:scale-[0.99] ${txInteract}`}
    >
      {material.thumbnailUrl ? (
        <img
          src={material.thumbnailUrl}
          alt=""
          className="h-[88px] w-full rounded-t-[var(--br-200)] object-cover"
        />
      ) : null}
      <div className="space-y-[var(--s-200)] p-[var(--s-300)]">
        <h2 className="text-[15px] font-semibold leading-tight text-[var(--text-default-heading)]">
          {material.name}
        </h2>
        <p className="font-mono text-[12px] leading-[16px] text-[var(--text-default-body)]">{formatLine(material)}</p>
      </div>
    </button>
  );
}

function MaterialDetail({ material }: { material: MaterialRecord }) {
  return (
    <div className="space-y-[var(--s-500)]">
      <div>
        <h3 className="text-[12px] font-medium uppercase tracking-[var(--text-caption-ls)] text-[var(--text-default-body)]">
          Physics properties
        </h3>
        <table className="mt-[var(--s-200)] w-full border-collapse text-[13px]">
          <tbody>
            {(
              [
                ["Static friction", String(material.staticFriction)],
                ["Dynamic friction", String(material.dynamicFriction)],
                ["Restitution", String(material.restitution)],
                ["Density", `${material.densityKgM3} kg/m³`],
              ] as const
            ).map(([k, v]) => (
              <tr key={k} className="border-b border-[var(--border-default-secondary)]">
                <td className="py-[var(--s-200)] text-[var(--text-default-body)]">{k}</td>
                <td className="py-[var(--s-200)] text-right font-mono text-[var(--text-default-heading)]">{v}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="space-y-[var(--s-300)]">
        <Button
          variant="primary"
          className="w-full"
          onClick={() => alert("Download queued: Material USD — mock")}
        >
          Download material USD
        </Button>
        <Button
          variant="secondary"
          className="w-full border-[var(--border-primary-default)] text-[var(--text-primary-default)] hover:bg-[var(--surface-primary-default-subtle)]"
          onClick={() => alert("Download queued: PBR textures — mock")}
        >
          Download PBR textures
        </Button>
      </div>
    </div>
  );
}
