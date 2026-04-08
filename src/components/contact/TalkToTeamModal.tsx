import { useEffect, useState } from "react";
import { CenterModal } from "@/components/ui/CenterModal";
import { Button } from "@/components/ui/Button";

export type TalkToTeamContext = "export" | "api" | "batch" | "general";

type TalkToTeamModalProps = {
  open: boolean;
  onClose: () => void;
  /** Preselect topic when opened from a gated flow */
  context?: TalkToTeamContext;
};

const TOPICS: { id: TalkToTeamContext; label: string; hint: string }[] = [
  { id: "export", label: "Export & SimReady assets", hint: "USD, GLB, manifests, bulk jobs" },
  { id: "api", label: "API & keys", hint: "Bearer auth, quotas, integration" },
  { id: "batch", label: "Batch generation", hint: "Combinatorial runs, training outputs" },
  { id: "general", label: "Something else", hint: "Partnerships, scoping, roadmap" },
];

export function TalkToTeamModal({ open, onClose, context = "general" }: TalkToTeamModalProps) {
  const [step, setStep] = useState(0);
  const [topic, setTopic] = useState<TalkToTeamContext>(context);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!open) {
      setStep(0);
      setName("");
      setEmail("");
      setCompany("");
      setMessage("");
      return;
    }
    setStep(0);
    setTopic(context);
  }, [open, context]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 0) {
      setStep(1);
      return;
    }
    if (step === 1) {
      setStep(2);
      return;
    }
    if (step === 2) {
      setStep(3);
    }
  };

  const topicLabel = TOPICS.find((t) => t.id === topic)?.label ?? "General";

  return (
    <CenterModal open={open} title={step === 3 ? "You’re all set" : "Talk to the team"} onClose={onClose} size="lg">
      <div className="space-y-[var(--s-400)] text-left">
        {step < 3 ? (
          <p className="text-[13px] text-[var(--text-default-body)]">
            Step {step + 1} of 3 — how can we help?
          </p>
        ) : null}

        {step === 0 ? (
          <form className="space-y-[var(--s-300)]" onSubmit={handleSubmit}>
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
            <div className="flex flex-col gap-[var(--s-200)] sm:flex-row sm:justify-end">
              <Button variant="primary" type="submit">
                Continue
              </Button>
            </div>
          </form>
        ) : null}

        {step === 1 ? (
          <form className="space-y-[var(--s-300)]" onSubmit={handleSubmit}>
            <p className="text-[13px] text-[var(--text-default-body)]">
              Selected: <span className="font-medium text-[var(--text-default-heading)]">{topicLabel}</span>
            </p>
            <label className="flex flex-col gap-[var(--s-100)] text-[13px] font-medium text-[var(--text-default-body)]">
              Full name
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
                className="rounded-br100 border border-[var(--border-default-secondary)] px-[var(--s-300)] py-[var(--s-200)] text-[14px] text-[var(--text-default-heading)]"
              />
            </label>
            <label className="flex flex-col gap-[var(--s-100)] text-[13px] font-medium text-[var(--text-default-body)]">
              Work email
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                className="rounded-br100 border border-[var(--border-default-secondary)] px-[var(--s-300)] py-[var(--s-200)] text-[14px] text-[var(--text-default-heading)]"
              />
            </label>
            <label className="flex flex-col gap-[var(--s-100)] text-[13px] font-medium text-[var(--text-default-body)]">
              Company <span className="font-normal text-[var(--text-default-placeholder)]">(optional)</span>
              <input
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                autoComplete="organization"
                className="rounded-br100 border border-[var(--border-default-secondary)] px-[var(--s-300)] py-[var(--s-200)] text-[14px] text-[var(--text-default-heading)]"
              />
            </label>
            <div className="flex flex-col gap-[var(--s-200)] sm:flex-row sm:justify-between">
              <Button variant="secondary" type="button" onClick={() => setStep(0)}>
                Back
              </Button>
              <Button variant="primary" type="submit">
                Continue
              </Button>
            </div>
          </form>
        ) : null}

        {step === 2 ? (
          <form className="space-y-[var(--s-300)]" onSubmit={handleSubmit}>
            <label className="flex flex-col gap-[var(--s-100)] text-[13px] font-medium text-[var(--text-default-body)]">
              What should we know?
              <textarea
                required
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Timeline, datasets, environments, or constraints…"
                className="rounded-br100 border border-[var(--border-default-secondary)] px-[var(--s-300)] py-[var(--s-200)] text-[14px] text-[var(--text-default-heading)] placeholder:text-[var(--text-default-placeholder)]"
              />
            </label>
            <div className="flex flex-col gap-[var(--s-200)] sm:flex-row sm:justify-between">
              <Button variant="secondary" type="button" onClick={() => setStep(1)}>
                Back
              </Button>
              <Button variant="primary" type="submit">
                Submit
              </Button>
            </div>
          </form>
        ) : null}

        {step === 3 ? (
          <div className="space-y-[var(--s-400)]">
            <p className="text-[14px] leading-[22px] text-[var(--text-default-body)]">
              Thanks{name ? `, ${name}` : ""}. In production we&apos;d route this to your workspace owner and reply within
              one business day.
            </p>
            <div className="rounded-br100 border border-[var(--border-default-secondary)] bg-[var(--surface-page-secondary)] px-[var(--s-400)] py-[var(--s-300)] text-[13px] text-[var(--text-default-body)]">
              <p className="font-mono text-[12px] text-[var(--text-default-heading)]">
                ref:{" "}
                {`${topic.slice(0, 3)}-${email ? (email.split("@")[0] ?? "anon").slice(0, 6) : "anon"}-${String(Date.now()).slice(-4)}`}
              </p>
              <p className="mt-[var(--s-200)]">Demo — no data was transmitted.</p>
            </div>
            <div className="flex justify-end">
              <Button variant="primary" type="button" onClick={onClose}>
                Done
              </Button>
            </div>
          </div>
        ) : null}
      </div>
    </CenterModal>
  );
}
