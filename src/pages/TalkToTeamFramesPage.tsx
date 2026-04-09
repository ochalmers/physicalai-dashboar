import {
  TalkToTeamOverlayGrid,
  TalkToTeamOverlaySplit,
  TalkToTeamOverlayStepper,
} from "@/components/contact/talkToTeam/TalkToTeamOverlayBodies";
import { useTalkToTeamFlow } from "@/components/contact/talkToTeam/useTalkToTeamFlow";
import type { TalkToTeamLayoutId } from "@/components/contact/talkToTeam/topics";

function FramePreview({
  label,
  description,
  handoff,
  layout,
}: {
  label: string;
  description: string;
  handoff: string;
  layout: TalkToTeamLayoutId;
}) {
  const flow = useTalkToTeamFlow(true, "general");

  const inner =
    layout === "grid" ? (
      <TalkToTeamOverlayGrid flow={flow} onClose={flow.reset} />
    ) : layout === "stepper" ? (
      <TalkToTeamOverlayStepper flow={flow} onClose={flow.reset} />
    ) : (
      <TalkToTeamOverlaySplit flow={flow} onClose={flow.reset} />
    );

  return (
    <section className="flex flex-col gap-[var(--s-300)]">
      <header>
        <h2 className="text-[16px] font-semibold tracking-tight text-[var(--text-default-heading)]">{label}</h2>
        <p className="mt-[var(--s-150)] text-[13px] leading-relaxed text-[var(--text-default-body)]">{description}</p>
        <p className="mt-[var(--s-200)] text-[12px] leading-relaxed text-[var(--text-default-placeholder)]">{handoff}</p>
      </header>
      <div
        className="relative overflow-hidden rounded-br200 border border-[var(--border-default-secondary)] bg-[var(--surface-default)] shadow-[0_20px_50px_rgba(15,23,42,0.12)]"
        style={{ minHeight: layout === "split" ? 560 : 520 }}
      >
        <div className="pointer-events-auto max-h-[min(78vh,720px)] overflow-y-auto overscroll-contain">{inner}</div>
      </div>
    </section>
  );
}

/**
 * Design handoff: three self-contained “frames” of the Talk to Team overlay (Paper / Figma).
 * Route: /dev/talk-to-team-frames
 */
export function TalkToTeamFramesPage() {
  return (
    <div className="mx-auto max-w-[1400px] space-y-[var(--s-500)] px-[var(--s-400)] py-[var(--s-500)] pb-[var(--s-800)]">
      <header className="max-w-[72ch] space-y-[var(--s-300)] border-b border-[var(--border-default-secondary)] pb-[var(--s-500)]">
        <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[var(--text-default-placeholder)]">
          Design frames
        </p>
        <h1 className="text-[clamp(22px,3vw,28px)] font-semibold leading-tight text-[var(--text-default-heading)]">
          Talk to Team — layout options
        </h1>
        <p className="text-[14px] leading-relaxed text-[var(--text-default-body)]">
          Each frame is a working copy of the flow with independent state. Use full-height screenshots for Paper or Figma;
          the production modal defaults to the{" "}
          <span className="font-medium text-[var(--text-default-heading)]">Split</span> layout.
        </p>
      </header>

      <div className="grid gap-[var(--s-800)] xl:grid-cols-3 xl:gap-[var(--s-500)]">
        <FramePreview
          label="Frame A — Split editorial"
          description="Left rail for narrative and reassurance; form column stays calm. Best for first contact and marketing-adjacent surfaces."
          handoff="Recommended default in-app. Pair with xl modal + hidden top bar on steps 1–2."
          layout="split"
        />
        <FramePreview
          label="Frame B — Compact grid"
          description="Topic selection as a 2×2 tile grid with a contained stepper. Fits tighter modals and dense dashboards."
          handoff="Use when vertical space is scarce or users already know their topic."
          layout="grid"
        />
        <FramePreview
          label="Frame C — Stepped single column"
          description="Horizontal step indicator + the original single-column rhythm. Lowest structural change from the legacy overlay."
          handoff="Safe migration path; emphasize the stepped header band for scanability."
          layout="stepper"
        />
      </div>
    </div>
  );
}
