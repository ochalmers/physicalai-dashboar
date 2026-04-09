import { useRef } from "react";
import { Button } from "@/components/ui/Button";
import { TOPICS, type TalkToTeamContext } from "./topics";
import { useTalkToTeamFlow } from "./useTalkToTeamFlow";

type Flow = ReturnType<typeof useTalkToTeamFlow>;

function StepIndicator({ step }: { step: number }) {
  const labels = ["Topic", "Contact", "Details"];
  return (
    <div className="flex items-center gap-[var(--s-200)]" aria-hidden>
      {labels.map((label, i) => (
        <div key={label} className="flex items-center gap-[var(--s-200)]">
          {i > 0 ? <span className="h-px w-4 bg-[var(--border-default-secondary)]" /> : null}
          <span
            className={`flex h-7 min-w-[1.75rem] items-center justify-center rounded-full text-[11px] font-semibold ${
              step === i
                ? "bg-[var(--surface-primary-default)] text-[var(--text-on-color-body)]"
                : step > i
                  ? "bg-[var(--surface-page-secondary)] text-[var(--text-default-heading)] ring-1 ring-[var(--border-default-secondary)]"
                  : "bg-[var(--surface-page-secondary)] text-[var(--text-default-placeholder)] ring-1 ring-[var(--border-default-secondary)]"
            }`}
          >
            {i + 1}
          </span>
          <span className={`hidden text-[11px] font-medium sm:inline ${step === i ? "text-[var(--text-default-heading)]" : "text-[var(--text-default-body)]"}`}>
            {label}
          </span>
        </div>
      ))}
    </div>
  );
}

function SuccessBody({ flow, onClose }: { flow: Flow; onClose: () => void }) {
  const refLine = useRef<string | null>(null);
  if (refLine.current === null) {
    refLine.current = `${flow.topic.slice(0, 3)}-${flow.email ? (flow.email.split("@")[0] ?? "anon").slice(0, 6) : "anon"}-${String(Date.now()).slice(-4)}`;
  }

  return (
    <div className="space-y-[var(--s-400)]">
      <p className="text-[14px] leading-[22px] text-[var(--text-default-body)]">
        Thanks{flow.name ? `, ${flow.name}` : ""}. In production we&apos;d route this to your workspace owner and reply within one business day.
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
}: {
  primaryLabel: string;
  onBack?: () => void;
  showBack?: boolean;
}) {
  return (
    <div className="flex flex-col gap-[var(--s-200)] border-t border-[var(--border-default-secondary)] pt-[var(--s-400)] sm:flex-row sm:justify-between">
      {showBack ? (
        <Button variant="secondary" type="button" onClick={onBack}>
          Back
        </Button>
      ) : (
        <span />
      )}
      <Button variant="primary" type="submit">
        {primaryLabel}
      </Button>
    </div>
  );
}

function TopicRadiosVertical({
  topic,
  setTopic,
}: {
  topic: TalkToTeamContext;
  setTopic: (t: TalkToTeamContext) => void;
}) {
  return (
    <fieldset className="space-y-[var(--s-200)]">
      <legend className="sr-only">What do you need?</legend>
      {TOPICS.map((t) => (
        <label
          key={t.id}
          className={`flex cursor-pointer gap-[var(--s-300)] rounded-br200 border px-[var(--s-400)] py-[var(--s-300)] transition-[border-color,background-color] duration-200 ${
            topic === t.id
              ? "border-[var(--border-primary-default)] bg-[var(--surface-primary-default-subtle)]"
              : "border-[var(--border-default-secondary)] bg-[var(--surface-page-secondary)] hover:bg-[var(--surface-default)]"
          }`}
        >
          <input
            type="radio"
            name="topic"
            value={t.id}
            checked={topic === t.id}
            onChange={() => setTopic(t.id)}
            className="mt-[3px] text-[var(--text-primary-default)]"
          />
          <span>
            <span className="block text-[14px] font-semibold text-[var(--text-default-heading)]">{t.label}</span>
            <span className="mt-[var(--s-100)] block text-[13px] text-[var(--text-default-body)]">{t.hint}</span>
          </span>
        </label>
      ))}
    </fieldset>
  );
}

function TopicGrid({
  topic,
  setTopic,
}: {
  topic: TalkToTeamContext;
  setTopic: (t: TalkToTeamContext) => void;
}) {
  return (
    <fieldset>
      <legend className="sr-only">What do you need?</legend>
      <div className="grid grid-cols-1 gap-[var(--s-200)] sm:grid-cols-2">
        {TOPICS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTopic(t.id)}
            className={`rounded-br200 border px-[var(--s-300)] py-[var(--s-300)] text-left transition-[border-color,background-color,box-shadow] duration-200 ${
              topic === t.id
                ? "border-[var(--border-primary-default)] bg-[var(--surface-primary-default-subtle)] shadow-[0_0_0_1px_var(--border-primary-default)]"
                : "border-[var(--border-default-secondary)] bg-[var(--surface-page-secondary)] hover:border-[var(--border-default-primary)] hover:bg-[var(--surface-default)]"
            }`}
          >
            <span className="block text-[13px] font-semibold leading-snug text-[var(--text-default-heading)]">{t.label}</span>
            <span className="mt-[var(--s-100)] block text-[12px] leading-relaxed text-[var(--text-default-body)]">{t.hint}</span>
          </button>
        ))}
      </div>
    </fieldset>
  );
}

function ContactFields({ flow }: { flow: Flow }) {
  return (
    <div className="space-y-[var(--s-300)]">
      <label className="flex flex-col gap-[var(--s-100)] text-[13px] font-medium text-[var(--text-default-body)]">
        Full name
        <input
          required
          value={flow.name}
          onChange={(e) => flow.setName(e.target.value)}
          autoComplete="name"
          className="rounded-br100 border border-[var(--border-default-secondary)] px-[var(--s-300)] py-[var(--s-200)] text-[14px] text-[var(--text-default-heading)]"
        />
      </label>
      <label className="flex flex-col gap-[var(--s-100)] text-[13px] font-medium text-[var(--text-default-body)]">
        Work email
        <input
          required
          type="email"
          value={flow.email}
          onChange={(e) => flow.setEmail(e.target.value)}
          autoComplete="email"
          className="rounded-br100 border border-[var(--border-default-secondary)] px-[var(--s-300)] py-[var(--s-200)] text-[14px] text-[var(--text-default-heading)]"
        />
      </label>
      <label className="flex flex-col gap-[var(--s-100)] text-[13px] font-medium text-[var(--text-default-body)]">
        Company <span className="font-normal text-[var(--text-default-placeholder)]">(optional)</span>
        <input
          value={flow.company}
          onChange={(e) => flow.setCompany(e.target.value)}
          autoComplete="organization"
          className="rounded-br100 border border-[var(--border-default-secondary)] px-[var(--s-300)] py-[var(--s-200)] text-[14px] text-[var(--text-default-heading)]"
        />
      </label>
    </div>
  );
}

function MessageField({ flow }: { flow: Flow }) {
  return (
    <label className="flex flex-col gap-[var(--s-100)] text-[13px] font-medium text-[var(--text-default-body)]">
      What should we know?
      <textarea
        required
        rows={5}
        value={flow.message}
        onChange={(e) => flow.setMessage(e.target.value)}
        placeholder="Timeline, datasets, environments, or constraints…"
        className="rounded-br100 border border-[var(--border-default-secondary)] px-[var(--s-300)] py-[var(--s-200)] text-[14px] text-[var(--text-default-heading)] placeholder:text-[var(--text-default-placeholder)]"
      />
    </label>
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
      <aside className="flex flex-col border-[var(--border-default-secondary)] bg-[var(--surface-page-secondary)] md:w-[min(42%,320px)] md:border-b-0 md:border-r md:px-[var(--s-500)] md:py-[var(--s-500)] px-[var(--s-500)] py-[var(--s-400)]">
        <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--text-default-placeholder)]">Contact</p>
        <h3 className="mt-[var(--s-200)] text-[20px] font-semibold leading-tight text-[var(--text-default-heading)]">Talk to the team</h3>
        <p className="mt-[var(--s-300)] text-[13px] leading-relaxed text-[var(--text-default-body)]">
          Tell us what you&apos;re building. We typically reply within one business day.
        </p>
        <ul className="mt-[var(--s-400)] space-y-[var(--s-200)] text-[13px] text-[var(--text-default-body)]">
          <li className="flex gap-[var(--s-200)]">
            <span className="material-symbols-outlined text-[18px] text-[var(--text-primary-default)]">check_circle</span>
            <span>Scoped follow-up from product & solutions</span>
          </li>
          <li className="flex gap-[var(--s-200)]">
            <span className="material-symbols-outlined text-[18px] text-[var(--text-primary-default)]">check_circle</span>
            <span>API, batch, and asset workflows</span>
          </li>
        </ul>
        <div className="mt-auto hidden pt-[var(--s-500)] md:block">
          <StepIndicator step={flow.step} />
        </div>
      </aside>

      <div className="flex flex-1 flex-col border-t border-[var(--border-default-secondary)] md:border-t-0">
        <div className="border-b border-[var(--border-default-secondary)] px-[var(--s-500)] py-[var(--s-300)] md:hidden">
          <StepIndicator step={flow.step} />
        </div>
        <div className="flex flex-1 flex-col px-[var(--s-500)] py-[var(--s-500)]">
          <p className="text-[12px] font-medium text-[var(--text-default-placeholder)]">
            Step {flow.step + 1} of 3 — {flow.step === 0 ? "Choose a topic" : flow.step === 1 ? "Your details" : "Context"}
          </p>

          {flow.step === 0 ? (
            <form className="mt-[var(--s-400)] flex flex-1 flex-col" onSubmit={flow.handleSubmit}>
              <TopicRadiosVertical topic={flow.topic} setTopic={flow.setTopic} />
              <div className="mt-auto pt-[var(--s-500)]">
                <FormFooter primaryLabel="Continue" />
              </div>
            </form>
          ) : null}

          {flow.step === 1 ? (
            <form className="mt-[var(--s-400)] flex flex-1 flex-col" onSubmit={flow.handleSubmit}>
              <p className="mb-[var(--s-300)] text-[13px] text-[var(--text-default-body)]">
                Topic: <span className="font-medium text-[var(--text-default-heading)]">{flow.topicLabel}</span>
              </p>
              <ContactFields flow={flow} />
              <div className="mt-auto pt-[var(--s-500)]">
                <FormFooter primaryLabel="Continue" showBack onBack={() => flow.setStep(0)} />
              </div>
            </form>
          ) : null}

          {flow.step === 2 ? (
            <form className="mt-[var(--s-400)] flex flex-1 flex-col" onSubmit={flow.handleSubmit}>
              <MessageField flow={flow} />
              <div className="mt-auto pt-[var(--s-500)]">
                <FormFooter primaryLabel="Submit" showBack onBack={() => flow.setStep(1)} />
              </div>
            </form>
          ) : null}
        </div>
      </div>
    </div>
  );
}

/** Dense 2×2 topic grid + stepped chrome. */
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
      <div className="rounded-br200 border border-[var(--border-default-secondary)] bg-[var(--surface-page-secondary)] px-[var(--s-400)] py-[var(--s-300)]">
        <StepIndicator step={flow.step} />
      </div>
      <p className="text-[12px] text-[var(--text-default-placeholder)]">
        Step {flow.step + 1} of 3 — how can we help?
      </p>

      {flow.step === 0 ? (
        <form className="space-y-[var(--s-400)]" onSubmit={flow.handleSubmit}>
          <TopicGrid topic={flow.topic} setTopic={flow.setTopic} />
          <FormFooter primaryLabel="Continue" />
        </form>
      ) : null}

      {flow.step === 1 ? (
        <form className="space-y-[var(--s-300)]" onSubmit={flow.handleSubmit}>
          <p className="text-[13px] text-[var(--text-default-body)]">
            Selected: <span className="font-medium text-[var(--text-default-heading)]">{flow.topicLabel}</span>
          </p>
          <ContactFields flow={flow} />
          <FormFooter primaryLabel="Continue" showBack onBack={() => flow.setStep(0)} />
        </form>
      ) : null}

      {flow.step === 2 ? (
        <form className="space-y-[var(--s-300)]" onSubmit={flow.handleSubmit}>
          <MessageField flow={flow} />
          <FormFooter primaryLabel="Submit" showBack onBack={() => flow.setStep(1)} />
        </form>
      ) : null}
    </div>
  );
}

/** Horizontal stepper + single-column flow (original rhythm, clearer hierarchy). */
export function TalkToTeamOverlayStepper({ flow, onClose }: { flow: Flow; onClose: () => void }) {
  if (flow.step === 3) {
    return (
      <div className="space-y-[var(--s-400)]">
        <SuccessBody flow={flow} onClose={onClose} />
      </div>
    );
  }

  return (
    <div className="space-y-[var(--s-400)]">
      <div className="flex flex-col gap-[var(--s-300)] sm:flex-row sm:items-center sm:justify-between">
        <StepIndicator step={flow.step} />
        <span className="text-[12px] text-[var(--text-default-placeholder)]">
          Step {flow.step + 1} of 3
        </span>
      </div>

      {flow.step === 0 ? (
        <form className="space-y-[var(--s-300)]" onSubmit={flow.handleSubmit}>
          <TopicRadiosVertical topic={flow.topic} setTopic={flow.setTopic} />
          <FormFooter primaryLabel="Continue" />
        </form>
      ) : null}

      {flow.step === 1 ? (
        <form className="space-y-[var(--s-300)]" onSubmit={flow.handleSubmit}>
          <p className="text-[13px] text-[var(--text-default-body)]">
            Selected: <span className="font-medium text-[var(--text-default-heading)]">{flow.topicLabel}</span>
          </p>
          <ContactFields flow={flow} />
          <FormFooter primaryLabel="Continue" showBack onBack={() => flow.setStep(0)} />
        </form>
      ) : null}

      {flow.step === 2 ? (
        <form className="space-y-[var(--s-300)]" onSubmit={flow.handleSubmit}>
          <MessageField flow={flow} />
          <FormFooter primaryLabel="Submit" showBack onBack={() => flow.setStep(1)} />
        </form>
      ) : null}
    </div>
  );
}
