import { useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { TalkToTeamModal } from "@/components/contact/TalkToTeamModal";

export function SimReadyPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [talkOpen, setTalkOpen] = useState(false);

  return (
    <section className="mx-auto flex min-h-[70vh] w-full max-w-[940px] items-center justify-center px-[var(--s-300)] py-[var(--s-700)]">
      <div className="w-full text-center">
        <div className="flex justify-center">
          <Badge variant="locked">Coming soon</Badge>
        </div>
        <span
          className="material-symbols-outlined mt-[var(--s-400)] block text-[56px] leading-none text-[var(--text-default-placeholder)]"
          aria-hidden
        >
          auto_awesome
        </span>
        <h1 className="mt-[var(--s-300)] text-[42px] font-semibold leading-[1.1] tracking-tight text-[var(--text-default-heading)]">
          SimReady Generation
        </h1>
        <p className="mx-auto mt-[var(--s-400)] max-w-[760px] text-[17px] leading-[32px] text-[var(--text-default-body)]">
          Convert your own assets into simulation-ready USD with physics and articulation.
        </p>
        <ul className="mx-auto mt-[var(--s-400)] max-w-[480px] list-disc space-y-[var(--s-100)] pl-[var(--s-500)] text-left text-[16px] leading-[28px] text-[var(--text-default-body)]">
          <li>collision and contact setup</li>
          <li>articulation and joints</li>
          <li>material and USD export</li>
        </ul>

        {sent ? (
          <p className="mt-[var(--s-500)] text-[15px] font-medium text-[var(--text-success-default)]">
            You are on the waitlist. We will notify you when access opens.
          </p>
        ) : (
          <form
            className="mx-auto mt-[var(--s-500)] flex max-w-[760px] flex-col gap-[var(--s-200)] sm:flex-row"
            onSubmit={(e) => {
              e.preventDefault();
              setSent(true);
            }}
          >
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="h-[62px] flex-1 rounded-br100 border border-[var(--border-default-secondary)] bg-[var(--surface-default)] px-[var(--s-400)] text-[16px] text-[var(--text-default-heading)] placeholder:text-[var(--text-default-placeholder)]"
            />
            <Button variant="primary" type="submit" className="h-[62px] px-[var(--s-500)] text-[16px] font-semibold">
              Join waitlist
            </Button>
          </form>
        )}

        <div className="mt-[var(--s-400)]">
          <Button variant="secondary" type="button" className="text-[15px] font-medium" onClick={() => setTalkOpen(true)}>
            Talk to Team
          </Button>
        </div>
      </div>
      <TalkToTeamModal open={talkOpen} onClose={() => setTalkOpen(false)} context="general" />
    </section>
  );
}
