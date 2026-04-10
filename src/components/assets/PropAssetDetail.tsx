import { useEffect, useState } from "react";
import { AssetDetailPreviewPane } from "@/components/assets/AssetDetailPreviewPane";
import { Callout } from "@/components/system/Callout";
import { Button } from "@/components/ui/Button";
import { isAssetInWorkspace, recordAssetDownloaded } from "@/lib/workspaceAssetDownloads";
import type { PropAsset } from "@/types";

const txInteract =
  "transition-[color,background-color,border-color,box-shadow,transform] duration-250 ease-out";

const txBtn =
  "inline-flex items-center justify-center gap-[var(--s-200)] transition-[color,background-color,opacity] duration-250 ease-out";

export function PropAssetDetail({
  asset,
  exportAllowed,
  onGatedExport,
}: {
  asset: PropAsset;
  exportAllowed: boolean;
  onGatedExport: () => void;
}) {
  const downloadOk = exportAllowed;
  const inWorkspace = isAssetInWorkspace(asset.id);
  const [downloadMenuOpen, setDownloadMenuOpen] = useState(false);

  useEffect(() => {
    setDownloadMenuOpen(false);
  }, [asset.id]);

  const dims = `${asset.dimensionsMm.w} × ${asset.dimensionsMm.h} × ${asset.dimensionsMm.d} mm`;
  return (
    <div className="grid min-h-0 items-stretch gap-[var(--s-500)] lg:grid-cols-[minmax(420px,1.5fr)_minmax(300px,400px)]">
      <AssetDetailPreviewPane
        previewModelUrl={asset.previewModelUrl}
        thumbnailUrl={asset.thumbnailUrl}
        alt={asset.name}
      />

      <div className="min-w-0 space-y-[var(--s-500)] px-[var(--s-400)] py-[var(--s-400)] sm:px-[var(--s-600)] sm:py-[var(--s-500)] lg:px-[var(--s-600)] lg:py-[var(--s-600)]">
        {inWorkspace ? (
          <Callout variant="info" title="In your workspace">
            This asset is already in your workspace.
          </Callout>
        ) : null}

        <h3 className="text-[34px] font-semibold leading-tight text-[var(--text-default-heading)]">{asset.name}</h3>

        <div>
          <p className="text-[14px] font-semibold uppercase tracking-[0.04em] text-[var(--text-default-heading)]">
            Dimensions
          </p>
          <table className="mt-[var(--s-200)] w-full border-collapse text-[13px]">
            <tbody>
              <tr className="border-b border-[var(--border-default-secondary)]">
                <td className="py-[var(--s-200)] text-[var(--text-default-body)]">W x H x D</td>
                <td className="py-[var(--s-200)] text-right font-mono text-[var(--text-default-heading)]">{dims}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div>
          <p className="text-[14px] font-semibold uppercase tracking-[0.04em] text-[var(--text-default-heading)]">
            Physics Properties
          </p>
          <table className="mt-[var(--s-200)] w-full border-collapse text-[13px]">
            <tbody>
              {(
                [
                  ["Mass", `${asset.massKg} kg`],
                  ["Material", asset.materialType],
                  ["Static Friction", String(asset.physics.frictionStatic)],
                  ["Dynamic Friction", String(asset.physics.frictionDynamic)],
                  ["Restitution", String(asset.physics.restitution)],
                  ["Density", `${asset.densityKgM3} kg/m3`],
                  ["Collision", asset.collisionLabel],
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

        <div className="space-y-[var(--s-300)] pt-[var(--s-200)]">
          <Button
            variant="primary"
            className={`w-full ${txBtn}`}
            aria-expanded={downloadOk ? downloadMenuOpen : undefined}
            aria-haspopup={!exportAllowed ? "dialog" : undefined}
            onClick={() => {
              if (!downloadOk) {
                onGatedExport();
                return;
              }
              setDownloadMenuOpen((o) => !o);
            }}
          >
            {!downloadOk ? (
              <span className="material-symbols-outlined text-[20px]" aria-hidden>
                lock
              </span>
            ) : (
              <span className="material-symbols-outlined text-[20px]" aria-hidden>
                {downloadMenuOpen ? "expand_less" : "expand_more"}
              </span>
            )}
            Download
          </Button>

          {downloadOk && downloadMenuOpen ? (
            <div
              className="flex flex-row flex-wrap items-stretch gap-[var(--s-200)]"
              role="group"
              aria-label="Download format options"
            >
              <Button
                variant="secondary"
                className={`min-h-[44px] min-w-0 flex-1 border-[var(--border-primary-default)] text-[var(--text-primary-default)] hover:bg-[var(--surface-primary-default-subtle)] sm:min-w-[160px] ${txBtn}`}
                onClick={() => {
                  recordAssetDownloaded(asset.id);
                  alert("Download queued: SimReady USD");
                }}
              >
                SimReady USD
              </Button>
              <Button
                variant="secondary"
                className={`min-h-[44px] min-w-0 flex-1 border-[var(--border-primary-default)] text-[var(--text-primary-default)] hover:bg-[var(--surface-primary-default-subtle)] sm:min-w-[160px] ${txBtn}`}
                onClick={() => {
                  recordAssetDownloaded(asset.id);
                  alert("Download queued: GLB");
                }}
              >
                GLB
              </Button>
              <button
                type="button"
                className={`inline-flex min-h-[44px] min-w-0 flex-1 items-center justify-center rounded-br100 border border-[var(--border-primary-default)] px-[var(--s-300)] text-[14px] font-medium text-[var(--text-primary-default)] hover:bg-[var(--surface-primary-default-subtle)] sm:min-w-[160px] ${txInteract}`}
                onClick={() => {
                  recordAssetDownloaded(asset.id);
                  alert("Metadata JSON — download queued");
                }}
              >
                Metadata
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
