import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Link } from "react-router-dom";
import { createApiKey, fetchApiKeys, revokeApiKey } from "@/lib/mockApi";
import { ApiAccessModal } from "@/components/access/ApiAccessModal";
import { PageHeader } from "@/components/layout/PageHeader";
import { Callout } from "@/components/system/Callout";
import { ErrorPanel } from "@/components/system/ErrorPanel";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Skeleton";
import { useAuth } from "@/context/AuthContext";
import { ACCESS_COPY, canUseFeature, FULL_ACCESS_TOOLTIP } from "@/lib/access";
import type { ApiKeyRecord } from "@/types";

const BASE = "https://api.imagine.io/physical-ai/v1";

const txBtn =
  "inline-flex items-center justify-center gap-[var(--s-200)] transition-[color,background-color,opacity] duration-250 ease-out";

const txIcon =
  "inline-flex h-9 w-9 items-center justify-center rounded-br100 border border-[var(--border-default-secondary)] bg-[var(--surface-default)] text-[var(--text-default-body)] hover:bg-[var(--surface-page-secondary)]";

/** Show last 4 chars of obfuscated key for display */
function keyFingerprint(masked: string): string {
  const afterEllipsis = masked.match(/…([a-z0-9]{4})$/i);
  if (afterEllipsis) return `••••${afterEllipsis[1]}`;
  const tail = masked.match(/([a-z0-9]{4})$/i);
  if (tail) return `••••${tail[1]}`;
  return masked.slice(-8);
}

export function ApiDocsPage() {
  const { accessTier } = useAuth();
  const qc = useQueryClient();
  const keys = useQuery({ queryKey: ["apiKeys"], queryFn: fetchApiKeys });
  const keysWrite = canUseFeature(accessTier, "api_keys_write");
  const [label, setLabel] = useState("");
  const [newSecret, setNewSecret] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [apiModalOpen, setApiModalOpen] = useState(false);

  const create = useMutation({
    mutationFn: () => createApiKey(label || "unnamed"),
    onSuccess: (data) => {
      setNewSecret(data.secret);
      setError(null);
      qc.invalidateQueries({ queryKey: ["apiKeys"] });
    },
    onError: () => setError("Could not create key"),
  });

  const revoke = useMutation({
    mutationFn: (id: string) => revokeApiKey(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["apiKeys"] }),
  });

  const copyKey = (text: string) => {
    void navigator.clipboard?.writeText(text);
  };

  return (
    <div className="space-y-[var(--s-500)]">
      <PageHeader
        title="API"
        description="HTTP reference is always available. Credentials require Full access."
        actions={
          keysWrite ? (
            <Button
              variant="primary"
              className={`shrink-0 ${txBtn}`}
              disabled={create.isPending}
              onClick={() => create.mutate()}
            >
              <span className="material-symbols-outlined text-[20px]" aria-hidden>
                add
              </span>
              {create.isPending ? "Generating…" : "New API key"}
            </Button>
          ) : (
            <Button
              variant="secondary"
              className={`shrink-0 border-[var(--border-primary-default)] text-[var(--text-primary-default)] ${txBtn}`}
              type="button"
              title={FULL_ACCESS_TOOLTIP}
              onClick={() => setApiModalOpen(true)}
            >
              <span className="material-symbols-outlined text-[20px]" aria-hidden>
                lock
              </span>
              API keys (Full)
            </Button>
          )
        }
      />

      <div className="grid gap-[var(--s-500)] lg:grid-cols-2">
        <Card title="Reference · Endpoints">
          <ul className="space-y-[var(--s-200)] break-words font-mono text-[12px] text-[var(--text-default-heading)]">
            <li>POST {BASE}/configs</li>
            <li>POST {BASE}/variations/generate</li>
            <li>GET {BASE}/jobs/{"{id}"}</li>
            <li>GET {BASE}/exports/{"{id}"}</li>
          </ul>
        </Card>

        <Card title="Reference · Example · curl">
          <pre className="overflow-x-auto rounded-br100 bg-[var(--surface-page-secondary)] p-[var(--s-300)] text-[12px] leading-[18px]">
            {`curl -X POST ${BASE}/variations/generate \\
  -H "Authorization: Bearer $IMAGINE_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{"environmentId":"env-kitchen-v2","selections":{...},"count":96}'`}
          </pre>
        </Card>
      </div>

      <Card title="Reference · Python">
        <pre className="overflow-x-auto rounded-br100 bg-[var(--surface-page-secondary)] p-[var(--s-300)] text-[12px] leading-[18px]">
          {`import requests
r = requests.post(
  "${BASE}/variations/generate",
  headers={"Authorization": f"Bearer {token}"},
  json={"environmentId": "env-kitchen-v2", "count": 96},
  timeout=30,
)
r.raise_for_status()
print(r.json())`}
        </pre>
      </Card>

      <section className="space-y-[var(--s-300)]">
        <h2 className="text-[16px] font-semibold text-[var(--text-default-heading)]">API keys</h2>

        {!keysWrite ? (
          <div className="rounded-br200 border border-[var(--border-default-secondary)] bg-[var(--surface-default)] p-[var(--s-500)]">
            <div className="flex flex-col items-center gap-[var(--s-300)] text-center">
              <Badge variant="locked">Locked</Badge>
              <p className="max-w-[48ch] text-[14px] leading-[22px] text-[var(--text-default-body)]">{ACCESS_COPY.apiKeysGated}</p>
              <Button variant="primary" type="button" onClick={() => setApiModalOpen(true)}>
                Request access
              </Button>
              <p className="text-[12px] text-[var(--text-default-placeholder)]">
                <Link to="/account" className="font-medium text-[var(--text-primary-default)] underline underline-offset-2">
                  Full access
                </Link>{" "}
                on this device
              </p>
            </div>
          </div>
        ) : (
          <>
            <Callout variant="info" title="Credentials">
              <p className="text-[14px]">{ACCESS_COPY.apiModalIntro}</p>
            </Callout>

            <section className="overflow-hidden rounded-br200 border border-[var(--border-default-secondary)] bg-[var(--surface-default)]">
              <div className="flex flex-col gap-[var(--s-200)] border-b border-[var(--border-default-secondary)] px-[var(--s-400)] py-[var(--s-400)] sm:flex-row sm:items-center sm:justify-between sm:px-[var(--s-500)]">
                <h3 className="text-[15px] font-semibold text-[var(--text-default-heading)]">
                  {keys.isLoading ? "—" : `${keys.data?.length ?? 0} keys`}
                </h3>
                <label className="flex flex-col gap-[var(--s-100)] text-[13px] font-medium text-[var(--text-default-body)]">
                  Label (optional)
                  <input
                    value={label}
                    onChange={(e) => setLabel(e.target.value)}
                    className="min-w-[200px] rounded-br100 border border-[var(--border-default-secondary)] px-[var(--s-300)] py-[var(--s-200)] text-[14px]"
                  />
                </label>
              </div>

              {keys.isError ? (
                <div className="p-[var(--s-500)]">
                  <ErrorPanel message="Could not load API keys." onRetry={() => keys.refetch()} />
                </div>
              ) : null}
              {keys.isLoading ? (
                <div className="p-[var(--s-500)]">
                  <Skeleton className="h-40 w-full" />
                </div>
              ) : null}
              {!keys.isLoading && !keys.isError && keys.data?.length === 0 ? (
                <p className="p-[var(--s-500)] text-[14px] text-[var(--text-default-body)]">No keys yet. Create one above.</p>
              ) : null}
              {!keys.isLoading && !keys.isError && keys.data && keys.data.length > 0 ? (
                <div className="w-full overflow-x-auto">
                  <table className="w-full min-w-[640px] border-collapse text-left text-[13px]">
                    <thead>
                      <tr className="border-b border-[var(--border-default-secondary)] bg-[var(--surface-page-secondary)] text-[12px] font-semibold text-[var(--text-default-body)]">
                        <th className="px-[var(--s-400)] py-[var(--s-300)] sm:px-[var(--s-500)]">Fingerprint</th>
                        <th className="px-[var(--s-300)] py-[var(--s-300)]">Created</th>
                        <th className="px-[var(--s-300)] py-[var(--s-300)]">Last used</th>
                        <th className="px-[var(--s-300)] py-[var(--s-300)]">Requests (month)</th>
                        <th className="px-[var(--s-400)] py-[var(--s-300)] text-right sm:px-[var(--s-500)]">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {keys.data.map((k: ApiKeyRecord) => (
                        <tr key={k.id} className="border-b border-[var(--border-default-secondary)] last:border-0">
                          <td className="max-w-[1px] px-[var(--s-400)] py-[var(--s-400)] sm:px-[var(--s-500)]">
                            <div className="font-mono text-[12px] text-[var(--text-default-heading)]">{keyFingerprint(k.maskedKey)}</div>
                            <div className="mt-[var(--s-100)] text-[11px] text-[var(--text-default-body)]">{k.label}</div>
                          </td>
                          <td className="whitespace-nowrap px-[var(--s-300)] py-[var(--s-400)] text-[var(--text-default-body)]">
                            {new Date(k.createdAt).toLocaleDateString(undefined, {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </td>
                          <td className="whitespace-nowrap px-[var(--s-300)] py-[var(--s-400)] text-[var(--text-default-body)]">
                            {k.lastUsedAt
                              ? new Date(k.lastUsedAt).toLocaleDateString(undefined, {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                })
                              : "—"}
                          </td>
                          <td className="whitespace-nowrap px-[var(--s-300)] py-[var(--s-400)] font-mono text-[var(--text-default-heading)]">
                            {k.requestsThisMonth.toLocaleString()}
                          </td>
                          <td className="px-[var(--s-400)] py-[var(--s-400)] text-right sm:px-[var(--s-500)]">
                            <div className="inline-flex justify-end gap-[var(--s-200)]">
                              <button
                                type="button"
                                className={txIcon}
                                aria-label="Copy fingerprint"
                                onClick={() => copyKey(k.maskedKey)}
                              >
                                <span className="material-symbols-outlined text-[18px]">content_copy</span>
                              </button>
                              <button
                                type="button"
                                className={`${txIcon} text-[var(--text-error-default)] hover:bg-[var(--surface-error-default-subtle)]`}
                                aria-label="Revoke key"
                                disabled={revoke.isPending}
                                onClick={() => revoke.mutate(k.id)}
                              >
                                <span className="material-symbols-outlined text-[18px]">delete</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : null}

              {error ? <p className="px-[var(--s-500)] pb-[var(--s-400)] text-[13px] text-[var(--text-error-default)]">{error}</p> : null}
              {newSecret ? (
                <p className="break-all px-[var(--s-500)] pb-[var(--s-500)] font-mono text-[12px] text-[var(--text-success-default)]">
                  New secret (copy now): {newSecret}
                </p>
              ) : null}
            </section>
          </>
        )}
      </section>

      <ApiAccessModal open={apiModalOpen} onClose={() => setApiModalOpen(false)} />
    </div>
  );
}
