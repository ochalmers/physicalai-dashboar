import { useState } from "react";
import { Link } from "react-router-dom";
import { PageHeader } from "@/components/layout/PageHeader";
import { Callout } from "@/components/system/Callout";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export function SimReadyPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  return (
    <div className="space-y-[var(--s-500)]">
      <PageHeader
        title={
          <span className="inline-flex items-center gap-[var(--s-300)]">
            <span className="material-symbols-outlined text-[32px] text-[var(--text-primary-default)]" aria-hidden>
              auto_awesome
            </span>
            SimReady
          </span>
        }
        description={
          <>
            <p>
              Upload meshes (GLB, OBJ, FBX) and receive a physics-ready USD asset: collision proxies, material bindings,
              articulation metadata, and SimReady tier validation.
            </p>
            <p className="mt-[var(--s-200)]">Private preview — join the waitlist for availability.</p>
          </>
        }
      />

      <Callout variant="info" title="Roadmap">
        <p>
          In-product batch processing is not available yet.{" "}
          <Link to="/environments/request-custom" className="font-medium text-[var(--text-primary-default)] underline underline-offset-2">
            Contact us
          </Link>{" "}
          for custom pipelines.
        </p>
      </Callout>

      <Card title="Pipeline output">
        <ol className="list-decimal space-y-[var(--s-200)] pl-[var(--s-500)] text-[14px] text-[var(--text-default-body)]">
          <li>Ingest mesh package + textures + manifest</li>
          <li>Repair, scale checks, collision proxy</li>
          <li>Validate against SimReady tier rules</li>
          <li>Deliver OpenUSD + sidecar metadata</li>
        </ol>
      </Card>

      <Card title="Waitlist">
        {sent ? (
          <p className="text-[14px] text-[var(--text-success-default)]">Recorded. You will be contacted when slots open.</p>
        ) : (
          <form
            className="flex flex-col gap-[var(--s-300)] sm:flex-row sm:items-end"
            onSubmit={(e) => {
              e.preventDefault();
              setSent(true);
            }}
          >
            <label className="flex flex-1 flex-col gap-[var(--s-100)] text-[13px] font-medium text-[var(--text-default-body)]">
              Email
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="rounded-br100 border border-[var(--border-default-secondary)] px-[var(--s-300)] py-[var(--s-200)] text-[14px]"
              />
            </label>
            <Button variant="primary" type="submit">
              Join waitlist
            </Button>
          </form>
        )}
      </Card>
    </div>
  );
}
