import { Fragment, useRef } from "react";
import { Button } from "@/components/ui/Button";
import { useTalkToTeamFlow } from "./useTalkToTeamFlow";

type Flow = ReturnType<typeof useTalkToTeamFlow>;

const EXPECT_ITEMS = [
  "A validated OpenUSD scene you can load directly in your simulator",
  "Working articulation: doors open, drawers slide, physics runs",
  "Sub-millimeter accurate geometry from real-world products",
  "A conversation about your specific pipeline needs",
] as const;

function ThinCheckIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      className="mt-[3px] shrink-0 text-[var(--text-default-placeholder)]"
      aria-hidden
    >
      <path
        d="M4.5 9.25 7.5 12.25 13.5 5.25"
        stroke="currentColor"
        strokeWidth="1.35"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Partner badge — stylized mark + wordmark (no bundled NVIDIA artwork). */
function NvidiaInceptionBadge() {
  return (
    <div className="inline-flex max-w-full items-stretch gap-[var(--s-300)] rounded-br100 border border-[var(--border-default-secondary)] bg-[var(--surface-default)] px-[var(--s-300)] py-[var(--s-250)] shadow-[inset_0_0_0_1px_rgba(0,0,0,0.04)]">
      <div className="flex w-[52px] shrink-0 items-center justify-center rounded-br100 border border-black/[0.12] bg-white">
        <svg viewBox="0 0 40 28" className="h-7 w-9" aria-hidden>
          <title>NVIDIA</title>
          <rect x="4" y="4" width="5" height="20" rx="0.5" fill="#76B900" />
          <rect x="13" y="8" width="5" height="16" rx="0.5" fill="#76B900" />
          <rect x="22" y="6" width="5" height="18" rx="0.5" fill="#76B900" />
          <rect x="31" y="10" width="5" height="14" rx="0.5" fill="#76B900" />
        </svg>
      </div>
      <div className="flex min-w-0 flex-col justify-center py-[2px]">
        <p className="text-[12px] font-bold leading-none tracking-[-0.02em] text-[var(--text-default-heading)]">NVIDIA</p>
        <p className="mt-[6px] text-[10px] font-medium leading-snug text-[var(--text-default-body)]">Inception Program</p>
      </div>
    </div>
  );
}

const inputClass =
  "w-full rounded-br100 border border-[var(--border-default-secondary)] bg-[var(--surface-page-secondary)] px-[var(--s-300)] py-[var(--s-250)] text-[14px] text-[var(--text-default-heading)] placeholder:text-[var(--text-default-placeholder)] outline-none transition-[box-shadow,border-color] duration-200 focus:border-[var(--border-primary-default)] focus:ring-1 focus:ring-[var(--border-primary-default)]";

/** Reference-style: numbered circles connected by lines; uppercase labels below. */
function FormProgressSteps({ step }: { step: number }) {
  const labels = ["Details", "Schedule", "Confirm"] as const;
  return (
    <nav aria-label="Form progress" className="w-full">
      <div className="flex items-center px-[2px]">
        {labels.map((_, i) => (
          <Fragment key={labels[i]}>
            {i > 0 ? (
              <div
                className={`mx-2 h-px min-w-[8px] flex-1 ${step >= i ? "bg-[color-mix(in_srgb,var(--papaya-500)_45%,var(--border-default-secondary))]" : "bg-[var(--border-default-secondary)]"}`}
                aria-hidden
              />
            ) : null}
            <div
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[13px] font-semibold tabular-nums ${
                step === i
                  ? "bg-[var(--surface-primary-default)] text-[var(--text-on-color-body)]"
                  : step > i
                    ? "bg-[var(--surface-page-secondary)] text-[var(--text-default-heading)] ring-1 ring-[var(--border-default-secondary)]"
                    : "bg-[var(--surface-page-secondary)] text-[var(--text-default-placeholder)] ring-1 ring-[var(--border-default-secondary)]"
              }`}
              aria-current={step === i ? "step" : undefined}
            >
              {i + 1}
            </div>
          </Fragment>
        ))}
      </div>
      <div className="mt-[10px] grid grid-cols-3 gap-1 text-center">
        {labels.map((label, i) => (
          <span
            key={label}
            className={`text-[10px] font-bold uppercase leading-tight tracking-[0.08em] ${
              step === i ? "text-[var(--text-default-heading)]" : "text-[var(--text-default-placeholder)]"
            }`}
          >
            {label}
          </span>
        ))}
      </div>
    </nav>
  );
}

function SuccessBody({ flow, onClose }: { flow: Flow; onClose: () => void }) {
  const refLine = useRef<string | null>(null);
  if (refLine.current === null) {
    refLine.current = `${flow.topic.slice(0, 3)}-${flow.email ? (flow.email.split("@")[0] ?? "anon").slice(0, 6) : "anon"}-${String(Date.now()).slice(-4)}`;
  }

  const who = flow.displayName || flow.firstName || "there";

  return (
    <div className="space-y-[var(--s-400)]">
      <p className="text-[14px] leading-[22px] text-[var(--text-default-body)]">
        Thanks{who !== "there" ? `, ${who}` : ""}. In production we&apos;d route this to your workspace owner and reply within one business day.
      </p>
      <div className="rounded-br100 border border-[var(--border-default-secondary)] bg-[var(--surface-page-secondary)] px-[var(--s-400)] py-[var(--s-300)] text-[13px] text-[var(--text-default-body)]">
        <p className="font-mono text-[12px] text-[var(--text-default-heading)]">ref: {refLine.current ?? "—"}</p>
        <p className="mt-[var(--s-200)]">Demo — no data was transmitted.</p>
      </div>
      <div className="flex justify-end border-t border-[var(--border-default-secondary)] pt-[var(--s-400)]">
        <Button variant="primary" type="button" onClick={onClose}>
          Done
        </Button>
      </div>
    </div>
  );
}

function FormFooter({
  primaryLabel,
  onBack,
  showBack,
  primaryFullWidth,
}: {
  primaryLabel: string;
  onBack?: () => void;
  showBack?: boolean;
  primaryFullWidth?: boolean;
}) {
  const fullPrimary = primaryFullWidth || !showBack;
  return (
    <div
      className={`flex gap-[var(--s-300)] border-t border-[var(--border-default-secondary)] pt-[var(--s-400)] ${
        showBack ? "flex-col sm:flex-row sm:items-center sm:justify-between" : "flex-col"
      }`}
    >
      {showBack ? (
        <Button variant="secondary" type="button" onClick={onBack} className="order-2 w-full sm:order-1 sm:w-auto">
          Back
        </Button>
      ) : null}
      <Button variant="primary" type="submit" className={`order-1 ${fullPrimary ? "w-full" : ""}`}>
        {primaryLabel}
      </Button>
    </div>
  );
}

function DetailsFields({ flow }: { flow: Flow }) {
  return (
    <div className="space-y-[var(--s-400)]">
      <div className="grid grid-cols-1 gap-[var(--s-300)] sm:grid-cols-2">
        <label className="flex flex-col gap-[var(--s-100)] text-[13px] font-medium text-[var(--text-default-body)]">
          First name
          <input
            required
            name="firstName"
            value={flow.firstName}
            onChange={(e) => flow.setFirstName(e.target.value)}
            autoComplete="given-name"
            placeholder="Jane"
            className={inputClass}
          />
        </label>
        <label className="flex flex-col gap-[var(--s-100)] text-[13px] font-medium text-[var(--text-default-body)]">
          Last name
          <input
            required
            name="lastName"
            value={flow.lastName}
            onChange={(e) => flow.setLastName(e.target.value)}
            autoComplete="family-name"
            placeholder="Doe"
            className={inputClass}
          />
        </label>
      </div>
      <label className="flex flex-col gap-[var(--s-100)] text-[13px] font-medium text-[var(--text-default-body)]">
        Work email
        <input
          required
          type="email"
          name="email"
          value={flow.email}
          onChange={(e) => flow.setEmail(e.target.value)}
          autoComplete="email"
          placeholder="jane@company.com"
          className={inputClass}
        />
      </label>
      <label className="flex flex-col gap-[var(--s-100)] text-[13px] font-medium text-[var(--text-default-body)]">
        Company
        <input
          name="company"
          value={flow.company}
          onChange={(e) => flow.setCompany(e.target.value)}
          autoComplete="organization"
          placeholder="Acme Robotics"
          className={inputClass}
        />
      </label>
      <label className="flex flex-col gap-[var(--s-100)] text-[13px] font-medium text-[var(--text-default-body)]">
        What are you building?
        <textarea
          required
          name="message"
          rows={5}
          value={flow.message}
          onChange={(e) => flow.setMessage(e.target.value)}
          placeholder="Tell us about your project, timeline, or any specific requirements."
          className={`${inputClass} min-h-[120px] resize-y`}
        />
      </label>
    </div>
  );
}

function ScheduleFields({ flow }: { flow: Flow }) {
  return (
    <div className="space-y-[var(--s-400)]">
      <p className="text-[14px] leading-[22px] text-[var(--text-default-body)]">
        We&apos;ll email you a scheduling link after you submit. Add any timezone or availability notes so we can match you faster.
      </p>
      <label className="flex flex-col gap-[var(--s-100)] text-[13px] font-medium text-[var(--text-default-body)]">
        Availability or timezone <span className="font-normal text-[var(--text-default-placeholder)]">(optional)</span>
        <textarea
          name="scheduleNote"
          rows={4}
          value={flow.scheduleNote}
          onChange={(e) => flow.setScheduleNote(e.target.value)}
          placeholder="e.g. PT mornings, EU business hours, or link preferences"
          className={`${inputClass} min-h-[100px] resize-y`}
        />
      </label>
    </div>
  );
}

function ConfirmSummary({ flow }: { flow: Flow }) {
  return (
    <div className="space-y-[var(--s-400)] rounded-br200 border border-[var(--border-default-secondary)] bg-[var(--surface-page-secondary)] p-[var(--s-400)] text-[13px]">
      <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--text-default-placeholder)]">Summary</p>
      <dl className="space-y-[var(--s-200)]">
        <div className="flex justify-between gap-[var(--s-400)]">
          <dt className="text-[var(--text-default-body)]">Name</dt>
          <dd className="text-right font-medium text-[var(--text-default-heading)]">{flow.displayName || "—"}</dd>
        </div>
        <div className="flex justify-between gap-[var(--s-400)]">
          <dt className="text-[var(--text-default-body)]">Email</dt>
          <dd className="max-w-[60%] break-all text-right font-medium text-[var(--text-default-heading)]">{flow.email || "—"}</dd>
        </div>
        <div className="flex justify-between gap-[var(--s-400)]">
          <dt className="text-[var(--text-default-body)]">Company</dt>
          <dd className="text-right font-medium text-[var(--text-default-heading)]">{flow.company || "—"}</dd>
        </div>
        <div className="border-t border-[var(--border-default-secondary)] pt-[var(--s-200)]">
          <dt className="text-[var(--text-default-body)]">Project</dt>
          <dd className="mt-[var(--s-100)] whitespace-pre-wrap text-[var(--text-default-heading)]">{flow.message || "—"}</dd>
        </div>
        {flow.scheduleNote ? (
          <div className="border-t border-[var(--border-default-secondary)] pt-[var(--s-200)]">
            <dt className="text-[var(--text-default-body)]">Scheduling notes</dt>
            <dd className="mt-[var(--s-100)] whitespace-pre-wrap text-[var(--text-default-heading)]">{flow.scheduleNote}</dd>
          </div>
        ) : null}
        <div className="border-t border-[var(--border-default-secondary)] pt-[var(--s-200)]">
          <dt className="text-[var(--text-default-body)]">Interest</dt>
          <dd className="mt-[var(--s-100)] text-[var(--text-default-heading)]">{flow.topicLabel}</dd>
        </div>
      </dl>
    </div>
  );
}

/** Two-column: narrative left rail + focused form column. */
export function TalkToTeamOverlaySplit({ flow, onClose }: { flow: Flow; onClose: () => void }) {
  if (flow.step === 3) {
    return (
      <div className="px-[var(--s-500)] pb-[var(--s-500)] pt-[var(--s-400)]">
        <SuccessBody flow={flow} onClose={onClose} />
      </div>
    );
  }

  return (
    <div className="flex min-h-[min(72vh,640px)] flex-col md:flex-row">
      <aside className="flex min-h-0 flex-col border-[var(--border-default-secondary)] bg-[var(--surface-default)] px-[var(--s-500)] py-[var(--s-500)] md:w-[min(46%,400px)] md:max-w-[420px] md:border-b-0 md:border-r md:py-[var(--s-600)]">
        <h2 className="text-[clamp(1.25rem,2.2vw,1.5rem)] font-semibold leading-tight tracking-[-0.02em] text-[var(--text-default-heading)]">
          What to expect
        </h2>
        <ul className="mt-[var(--s-500)] space-y-[var(--s-400)] text-[14px] leading-[1.45] text-[var(--text-default-body)]">
          {EXPECT_ITEMS.map((line) => (
            <li key={line} className="flex gap-[var(--s-300)]">
              <ThinCheckIcon />
              <span>{line}</span>
            </li>
          ))}
        </ul>
        <div className="mt-auto flex flex-col gap-[var(--s-500)] pt-[var(--s-600)]">
          <NvidiaInceptionBadge />
          <p className="text-[10px] font-semibold uppercase leading-relaxed tracking-[var(--text-caption-ls)] text-[var(--text-default-placeholder)]">
            25,000+ products digitized
          </p>
          <div className="hidden md:block">
            <FormProgressSteps step={flow.step} />
          </div>
        </div>
      </aside>

      <div className="flex flex-1 flex-col border-t border-[var(--border-default-secondary)] md:border-t-0">
        <div className="border-b border-[var(--border-default-secondary)] px-[var(--s-500)] py-[var(--s-300)] md:hidden">
          <FormProgressSteps step={flow.step} />
        </div>
        <div className="flex flex-1 flex-col px-[var(--s-500)] py-[var(--s-500)]">
          {flow.step === 0 ? (
            <form className="flex flex-1 flex-col" onSubmit={flow.handleSubmit}>
              <DetailsFields flow={flow} />
              <div className="mt-auto pt-[var(--s-500)]">
                <FormFooter primaryLabel="Next: Pick a Time" primaryFullWidth />
              </div>
            </form>
          ) : null}

          {flow.step === 1 ? (
            <form className="flex flex-1 flex-col" onSubmit={flow.handleSubmit}>
              <ScheduleFields flow={flow} />
              <div className="mt-auto pt-[var(--s-500)]">
                <FormFooter primaryLabel="Next: Confirm" showBack onBack={() => flow.setStep(0)} primaryFullWidth />
              </div>
            </form>
          ) : null}

          {flow.step === 2 ? (
            <form className="flex flex-1 flex-col" onSubmit={flow.handleSubmit}>
              <ConfirmSummary flow={flow} />
              <div className="mt-auto pt-[var(--s-500)]">
                <FormFooter primaryLabel="Submit request" showBack onBack={() => flow.setStep(1)} />
              </div>
            </form>
          ) : null}
        </div>
      </div>
    </div>
  );
}

/** Single-column grid layout. */
export function TalkToTeamOverlayGrid({ flow, onClose }: { flow: Flow; onClose: () => void }) {
  if (flow.step === 3) {
    return (
      <div className="space-y-[var(--s-400)] px-[var(--s-100)]">
        <SuccessBody flow={flow} onClose={onClose} />
      </div>
    );
  }

  return (
    <div className="space-y-[var(--s-400)] px-[var(--s-100)]">
      <div className="rounded-br200 border border-[var(--border-default-secondary)] bg-[var(--surface-page-secondary)] px-[var(--s-400)] py-[var(--s-400)]">
        <FormProgressSteps step={flow.step} />
      </div>

      {flow.step === 0 ? (
        <form className="space-y-[var(--s-400)]" onSubmit={flow.handleSubmit}>
          <DetailsFields flow={flow} />
          <FormFooter primaryLabel="Next: Pick a Time" primaryFullWidth />
        </form>
      ) : null}

      {flow.step === 1 ? (
        <form className="space-y-[var(--s-400)]" onSubmit={flow.handleSubmit}>
          <ScheduleFields flow={flow} />
          <FormFooter primaryLabel="Next: Confirm" showBack onBack={() => flow.setStep(0)} primaryFullWidth />
        </form>
      ) : null}

      {flow.step === 2 ? (
        <form className="space-y-[var(--s-400)]" onSubmit={flow.handleSubmit}>
          <ConfirmSummary flow={flow} />
          <FormFooter primaryLabel="Submit request" showBack onBack={() => flow.setStep(1)} />
        </form>
      ) : null}
    </div>
  );
}

/** Horizontal stepper + single-column flow. */
export function TalkToTeamOverlayStepper({ flow, onClose }: { flow: Flow; onClose: () => void }) {
  if (flow.step === 3) {
    return (
      <div className="space-y-[var(--s-400)]">
        <SuccessBody flow={flow} onClose={onClose} />
      </div>
    );
  }

  return (
    <div className="space-y-[var(--s-500)]">
      <FormProgressSteps step={flow.step} />

      {flow.step === 0 ? (
        <form className="space-y-[var(--s-400)]" onSubmit={flow.handleSubmit}>
          <DetailsFields flow={flow} />
          <FormFooter primaryLabel="Next: Pick a Time" primaryFullWidth />
        </form>
      ) : null}

      {flow.step === 1 ? (
        <form className="space-y-[var(--s-400)]" onSubmit={flow.handleSubmit}>
          <ScheduleFields flow={flow} />
          <FormFooter primaryLabel="Next: Confirm" showBack onBack={() => flow.setStep(0)} primaryFullWidth />
        </form>
      ) : null}

      {flow.step === 2 ? (
        <form className="space-y-[var(--s-400)]" onSubmit={flow.handleSubmit}>
          <ConfirmSummary flow={flow} />
          <FormFooter primaryLabel="Submit request" showBack onBack={() => flow.setStep(1)} />
        </form>
      ) : null}
    </div>
  );
}
