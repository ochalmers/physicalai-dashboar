import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { PageHeader } from "@/components/layout/PageHeader";
import { Callout } from "@/components/system/Callout";
import { ThemeSegmentedControl } from "@/components/system/ThemeSegmentedControl";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { tx } from "@/components/layout/motion";
import type { AccessTier } from "@/lib/access";

export function AccountPage() {
  const { user, signOut, accessTier, setAccessTier } = useAuth();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();

  const handleSignOut = () => {
    signOut();
    navigate("/sign-in", { replace: true, state: { signedOut: true } });
  };

  return (
    <div className="space-y-[var(--s-600)]">
      <div className="max-w-[640px]">
        <PageHeader
          title="Organization & appearance"
          description="Workspace entitlements and how the dashboard is rendered on this device — aligned with your team&apos;s rollout."
        />
      </div>

      <Card className="overflow-hidden !p-0">
        <div className="border-b border-[var(--border-default-secondary)] bg-[var(--surface-page-secondary)] px-[var(--s-400)] py-[var(--s-300)] sm:px-[var(--s-500)] sm:py-[var(--s-400)]">
          <h2 className="text-[14px] font-semibold text-[var(--text-default-heading)]">Appearance</h2>
          <p className="mt-[var(--s-200)] max-w-[48ch] text-[14px] leading-[22px] text-[var(--text-default-body)]">
            Light keeps the default bright surfaces; Dark uses deep neutrals with the same papaya accent. Preference is saved
            on this browser.
          </p>
        </div>
        <div className="px-[var(--s-400)] py-[var(--s-500)] sm:px-[var(--s-500)]">
          <ThemeSegmentedControl value={theme} onChange={setTheme} />
        </div>
      </Card>

      <Card title="Access (demo)">
        <Callout variant="info" title="Explore vs Full">
          <p className="text-[14px] leading-[22px]">
            <strong>Explore</strong> — browse, configure, and preview. <strong>Full</strong> — batch variations, exports, and
            API keys. This device stores the selection locally.
          </p>
        </Callout>
        <label className="mt-[var(--s-500)] flex max-w-md flex-col gap-[var(--s-200)] text-[13px] font-medium text-[var(--text-default-body)]">
          Access level
          <select
            value={accessTier}
            onChange={(e) => setAccessTier(e.target.value as AccessTier)}
            className="rounded-br100 border border-[var(--border-default-secondary)] bg-[var(--surface-default)] px-[var(--s-300)] py-[var(--s-200)] text-[14px] text-[var(--text-default-heading)]"
          >
            <option value="explore">Explore</option>
            <option value="full">Full</option>
          </select>
        </label>
      </Card>

      <div className="grid gap-[var(--s-400)] md:grid-cols-2">
        <Card title="User">
          <dl className="space-y-[var(--s-300)] text-[14px]">
            <div>
              <dt className="text-[13px] font-medium text-[var(--text-default-body)]">Name</dt>
              <dd className="mt-[var(--s-100)] font-medium text-[var(--text-default-heading)]">{user?.name ?? "—"}</dd>
            </div>
            <div>
              <dt className="text-[13px] font-medium text-[var(--text-default-body)]">Email</dt>
              <dd className="mt-[var(--s-100)] font-mono text-[13px] text-[var(--text-default-heading)]">{user?.email ?? "—"}</dd>
            </div>
            <div>
              <dt className="text-[13px] font-medium text-[var(--text-default-body)]">Organization</dt>
              <dd className="mt-[var(--s-100)] text-[var(--text-default-heading)]">{user?.orgLabel ?? "—"}</dd>
            </div>
          </dl>
        </Card>
        <Card title="Session">
          <p className="text-[14px] leading-[22px] text-[var(--text-default-body)]">
            You&apos;re signed in on this device. Signing out clears your session here.
          </p>
          <Button variant="secondary" className={`mt-[var(--s-400)] ${tx}`} onClick={handleSignOut}>
            Sign out
          </Button>
        </Card>
      </div>

      <Card title="Credentials">
        <p className="text-[14px] leading-[22px] text-[var(--text-default-body)]">API keys are managed on the API page.</p>
        <Link
          to="/api"
          className={`mt-[var(--s-300)] inline-flex items-center gap-[var(--s-200)] text-[14px] font-medium text-[var(--text-primary-default)] ${tx}`}
        >
          Open API keys
          <span className="material-symbols-outlined text-[18px]" aria-hidden>
            arrow_forward
          </span>
        </Link>
      </Card>
    </div>
  );
}
