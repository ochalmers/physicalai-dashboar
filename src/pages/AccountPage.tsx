import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Link } from "react-router-dom";
import { tx } from "@/components/layout/motion";

export function AccountPage() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = () => {
    signOut();
    navigate("/sign-in", { replace: true, state: { signedOut: true } });
  };

  return (
    <div className="space-y-[var(--s-400)]">
      <header>
        <p className="text-[12px] font-medium uppercase tracking-[var(--text-caption-ls)] text-[var(--text-default-body)]">
          Account
        </p>
        <h1 className="text-page-title mt-[var(--s-200)]">
          Organization access
        </h1>
      </header>

      <div className="grid gap-[var(--s-400)] md:grid-cols-2">
        <Card title="User">
          <dl className="space-y-[var(--s-200)] text-[14px]">
            <div>
              <dt className="text-[12px] uppercase text-[var(--text-default-body)]">Name</dt>
              <dd className="font-medium">{user?.name ?? "—"}</dd>
            </div>
            <div>
              <dt className="text-[12px] uppercase text-[var(--text-default-body)]">Email</dt>
              <dd className="font-mono text-[13px]">{user?.email ?? "—"}</dd>
            </div>
            <div>
              <dt className="text-[12px] uppercase text-[var(--text-default-body)]">Organization</dt>
              <dd>{user?.orgLabel ?? "—"}</dd>
            </div>
          </dl>
        </Card>
        <Card title="Session">
          <p className="text-[14px] text-[var(--text-default-body)]">
            You’re signed in on this device. Signing out clears your session here.
          </p>
          <Button
            variant="secondary"
            className={`mt-[var(--s-400)] ${tx}`}
            onClick={handleSignOut}
          >
            Sign out
          </Button>
        </Card>
      </div>

      <Card title="Credentials">
        <p className="text-[14px] text-[var(--text-default-body)]">
          API keys are managed on the API page.
        </p>
        <Link to="/api" className={`mt-[var(--s-200)] inline-block text-[14px] text-[var(--text-primary-default)] ${tx}`}>
          Open API keys →
        </Link>
      </Card>
    </div>
  );
}
