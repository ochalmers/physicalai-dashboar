import { useState } from "react";
import { Button } from "@/components/ui/Button";

export function SimReadyPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  return (
    <section className="mx-auto flex min-h-[70vh] w-full max-w-[940px] items-center justify-center px-[var(--s-300)] py-[var(--s-700)]">
      <div className="w-full text-center">
        <span
          className="material-symbols-outlined text-[56px] leading-none text-[var(--text-default-placeholder)]"
          aria-hidden
        >
          auto_awesome
        </span>
        <h1 className="mt-[var(--s-300)] text-[42px] font-semibold leading-[1.1] tracking-tight text-[var(--text-default-heading)]">
          SimReady Generation
        </h1>
        <p className="mx-auto mt-[var(--s-400)] max-w-[760px] text-[17px] leading-[32px] text-[var(--text-default-body)]">
          Upload any 3D model (GLB, OBJ, FBX) and our pipeline will convert it into a physics-ready SimReady USD asset
          with collision meshes, material properties, and articulation.
        </p>
        <p className="mt-[var(--s-300)] text-[16px] text-[var(--text-default-placeholder)]">
          Currently in private beta. Join the waitlist to get notified.
        </p>

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
              Join Waitlist
            </Button>
          </form>
        )}
      </div>
    </section>
  );
}
