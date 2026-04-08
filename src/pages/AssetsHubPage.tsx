import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { fetchSystemOverview } from "@/lib/mockApi";
import { AssetLibraryTabs } from "@/components/assets/AssetLibraryTabs";
import { PageHeader } from "@/components/layout/PageHeader";
import { ErrorPanel } from "@/components/system/ErrorPanel";
import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { tx } from "@/components/layout/motion";

const txCardLink =
  "mt-[var(--s-400)] inline-flex items-center gap-0.5 text-[14px] font-medium text-[var(--text-primary-default)] hover:underline";

export function AssetsHubPage() {
  const overview = useQuery({ queryKey: ["overview"], queryFn: fetchSystemOverview });

  if (overview.isLoading) {
    return (
      <div className="space-y-[var(--s-400)]">
        <Skeleton className="h-10 w-64" />
        <div className="grid gap-[var(--s-400)] md:grid-cols-2">
          <Skeleton className="h-48" />
          <Skeleton className="h-48" />
        </div>
      </div>
    );
  }

  if (overview.isError || !overview.data) {
    return (
      <ErrorPanel
        message="We couldn’t load asset counts. Check your connection and try again."
        onRetry={() => overview.refetch()}
      />
    );
  }

  const { propsCount, materialsCount } = overview.data.assets;

  return (
    <div className="space-y-[var(--s-500)]">
      <AssetLibraryTabs />

      <PageHeader
        title="Assets"
        description="Browse physics-ready props and PBR materials for Kitchen environments. Open a library to filter and inspect assets."
      />

      <div className="grid gap-[var(--s-400)] md:grid-cols-2">
        <Card className="p-[var(--s-400)] sm:p-[var(--s-500)]">
          <div className="flex items-start gap-[var(--s-300)]">
            <span
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-br100 border border-[#7eb8ff]/40 bg-[#e8f2ff] text-[#2563eb]"
              aria-hidden
            >
              <span className="material-symbols-outlined text-[22px]">deployed_code</span>
            </span>
            <div className="min-w-0">
              <h2 className="text-[16px] font-semibold text-[var(--text-default-heading)]">Props</h2>
              <p className="mt-[var(--s-200)] text-[13px] leading-[20px] text-[var(--text-default-body)]">
                Kitchen-native props with collision proxies, articulation metadata, and SimReady tiers.
              </p>
              <p className="mt-[var(--s-300)] text-[28px] font-semibold tabular-nums text-[var(--text-default-heading)]">
                {propsCount.toLocaleString()}
                <span className="ml-[var(--s-200)] text-[13px] font-medium text-[var(--text-default-body)]">in library</span>
              </p>
              <Link to="/assets/props" className={`${txCardLink} ${tx}`}>
                Open props
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </Link>
            </div>
          </div>
        </Card>

        <Card className="p-[var(--s-400)] sm:p-[var(--s-500)]">
          <div className="flex items-start gap-[var(--s-300)]">
            <span
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-br100 border border-[#86efac]/40 bg-[#ecfdf5] text-[#15803d]"
              aria-hidden
            >
              <span className="material-symbols-outlined text-[22px]">texture</span>
            </span>
            <div className="min-w-0">
              <h2 className="text-[16px] font-semibold text-[var(--text-default-heading)]">Materials</h2>
              <p className="mt-[var(--s-200)] text-[13px] leading-[20px] text-[var(--text-default-body)]">
                PBR surfaces with friction, restitution, and density presets for simulation.
              </p>
              <p className="mt-[var(--s-300)] text-[28px] font-semibold tabular-nums text-[var(--text-default-heading)]">
                {materialsCount.toLocaleString()}
                <span className="ml-[var(--s-200)] text-[13px] font-medium text-[var(--text-default-body)]">in library</span>
              </p>
              <Link to="/assets/materials" className={`${txCardLink} ${tx}`}>
                Open materials
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </Link>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
