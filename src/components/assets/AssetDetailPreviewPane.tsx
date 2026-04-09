import { AssetModelViewer } from "@/components/assets/AssetModelViewer";
import { hasPreviewModel } from "@/lib/assetPreview";

type AssetDetailPreviewPaneProps = {
  previewModelUrl?: string | null;
  /** Flat image for cards / modal fallback; omit when only 3D is available. */
  thumbnailUrl?: string | null;
  alt: string;
};

/** Left column for asset/material modals: interactive GLB in 16:9, else flat thumbnail. */
export function AssetDetailPreviewPane({ previewModelUrl, thumbnailUrl, alt }: AssetDetailPreviewPaneProps) {
  if (hasPreviewModel(previewModelUrl)) {
    return (
      <div className="relative w-full min-w-0 overflow-hidden rounded-br200 bg-[var(--surface-page-secondary)] shadow-[inset_0_0_0_1px_var(--border-default-secondary)]">
        <div className="aspect-video w-full">
          <AssetModelViewer url={previewModelUrl!.trim()} />
        </div>
      </div>
    );
  }

  if (thumbnailUrl) {
    return (
      <div className="relative w-full min-w-0 overflow-hidden rounded-br200 bg-[var(--surface-page-secondary)] shadow-[inset_0_0_0_1px_var(--border-default-secondary)]">
        <div className="aspect-video w-full">
          <img src={thumbnailUrl} alt={alt} className="h-full w-full object-contain object-center p-[var(--s-300)]" />
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex aspect-video w-full min-w-0 items-center justify-center overflow-hidden rounded-br200 bg-[var(--surface-page-secondary)]">
      <span className="material-symbols-outlined text-[72px] text-[var(--text-default-placeholder)]/40" aria-hidden>
        texture
      </span>
    </div>
  );
}
