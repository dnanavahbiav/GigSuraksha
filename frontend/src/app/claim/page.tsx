'use client';

import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Card, { CardHeader } from '@/components/Card';
import Badge from '@/components/Badge';
import Button from '@/components/Button';
import { DISRUPTION_TYPE_INFO, SEVERITY_CONFIG } from '@/lib/constants';
import { getWorkerClaims } from '@/lib/api';
import { getWorker } from '@/lib/store';
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  Shield,
  ArrowRight,
  FileText,
  Loader2,
  Zap,
} from 'lucide-react';
import Link from 'next/link';

function formatCurrency(n: number) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(n);
}

function ClaimStatusBadge({ status }: { status: string }) {
  const variant =
    status === 'approved' || status === 'paid'
      ? 'success'
      : status === 'processing' || status === 'eligible'
      ? 'warning'
      : status === 'rejected'
      ? 'danger'
      : 'muted';
  return <Badge variant={variant}>{status}</Badge>;
}

export default function ClaimPage() {
  const [claims, setClaims] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const worker = getWorker();
        if (!worker?.worker_id) {
          setError('No registered worker found.');
          setLoading(false);
          return;
        }

        const result = await getWorkerClaims(worker.worker_id);
        // Response may be array or { claims: [...] }
        let list: Record<string, unknown>[] = [];
        if (Array.isArray(result)) {
          list = result as Record<string, unknown>[];
        } else if ((result as Record<string, unknown[]>).claims) {
          list = (result as Record<string, unknown[]>).claims as Record<string, unknown>[];
        } else {
          list = [result as Record<string, unknown>];
        }

        // Sort by created_at descending (newest first)
        list.sort((a, b) => {
          const aDate = String(a.created_at || a.timestamp || '');
          const bDate = String(b.created_at || b.timestamp || '');
          return bDate.localeCompare(aDate);
        });

        setClaims(list);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load claims');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <>
        <Header />
        <main className="flex-1 max-w-4xl mx-auto px-4 py-16 w-full flex flex-col items-center justify-center gap-4">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
          <p className="text-[14px] text-text-secondary">Loading your claims…</p>
        </main>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <main className="flex-1 max-w-4xl mx-auto px-4 py-16 w-full flex flex-col items-center justify-center gap-4">
          <AlertTriangle className="w-8 h-8 text-danger" />
          <p className="text-[14px] text-danger">{error}</p>
          <Link href="/onboarding">
            <Button variant="outline">Complete Registration</Button>
          </Link>
        </main>
      </>
    );
  }

  if (claims.length === 0) {
    return (
      <>
        <Header />
        <main className="flex-1 max-w-4xl mx-auto px-4 py-16 w-full flex flex-col items-center justify-center gap-4">
          <FileText className="w-10 h-10 text-text-muted opacity-60" />
          <p className="text-[16px] font-semibold text-text-primary">No claims yet</p>
          <p className="text-[14px] text-text-secondary">
            Simulate a disruption event to see automated claims generated.
          </p>
          <Link href="/simulate">
            <Button>
              <Zap className="w-4 h-4" />
              Simulate a Disruption
            </Button>
          </Link>
        </main>
      </>
    );
  }

  const latest = claims[0];
  const older = claims.slice(1);

  // Derive display fields from latest claim
  const latestId = (latest.claim_id || latest.id || '—') as string;
  const latestStatus = (latest.status || 'eligible') as string;
  const latestEventType = (latest.event_type || '') as string;
  const latestPayout = Number(latest.estimated_payout || latest.payout_amount || 0);
  const latestZone = (latest.zone || '') as string;
  const latestCity = (latest.city || '') as string;
  const latestSeverity = (latest.severity || 'high') as string;
  const latestDuration = Number(latest.duration_hours || 0);
  const latestPolicyId = (latest.policy_id || '') as string;
  const validationChecks = (latest.validation_checks as Array<{ check: string; passed: boolean; detail?: string }>) || [];
  const allPassed = validationChecks.length > 0 ? validationChecks.every((c) => c.passed) : latestPayout > 0;

  // Find matching disruption type info if available
  const matchedDTKey = Object.keys(DISRUPTION_TYPE_INFO).find((k) => {
    const mapped = latestEventType.replace(/_/g, '').toLowerCase();
    return k.toLowerCase().replace(/_/g, '').includes(mapped) || mapped.includes(k.toLowerCase().replace(/_/g, ''));
  });
  const dtInfo = matchedDTKey ? DISRUPTION_TYPE_INFO[matchedDTKey as keyof typeof DISRUPTION_TYPE_INFO] : null;

  return (
    <>
      <Header />
      <main className="flex-1 max-w-4xl mx-auto px-4 py-6 sm:py-10 w-full">
        <div className="mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-text-primary">Claims</h1>
          <p className="text-[14px] text-text-secondary mt-1">
            {claims.length} claim{claims.length !== 1 ? 's' : ''} found — showing newest first
          </p>
        </div>

        {/* Latest Claim — Full Detail */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Event Details */}
            <Card padding="lg">
              <CardHeader
                title="Latest Claim"
                action={<ClaimStatusBadge status={latestStatus} />}
              />
              <div className="p-4 rounded-lg bg-background border border-border mb-4">
                <p className="text-[14px] font-semibold text-text-primary">
                  {dtInfo?.label || latestEventType || 'Disruption Event'}
                </p>
                {dtInfo?.description && (
                  <p className="text-[13px] text-text-secondary mt-1">{dtInfo.description}</p>
                )}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3 text-[12px]">
                  <div>
                    <span className="text-text-muted">Zone</span>
                    <p className="font-medium text-text-primary">{latestZone || '—'}</p>
                  </div>
                  <div>
                    <span className="text-text-muted">City</span>
                    <p className="font-medium text-text-primary">{latestCity || '—'}</p>
                  </div>
                  <div>
                    <span className="text-text-muted">Duration</span>
                    <p className="font-medium text-text-primary">{latestDuration ? `${latestDuration}h` : '—'}</p>
                  </div>
                  <div>
                    <span className="text-text-muted">Severity</span>
                    <p className="font-medium text-text-primary capitalize">{latestSeverity}</p>
                  </div>
                </div>
              </div>

              {/* Linked Policy */}
              {latestPolicyId && (
                <div className="flex items-center gap-3 p-3 rounded-lg border border-border">
                  <Shield className="w-4 h-4 text-primary flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-medium text-text-primary">{latestPolicyId}</p>
                    <p className="text-[12px] text-text-secondary">Linked policy</p>
                  </div>
                  <Badge variant="success">Active</Badge>
                </div>
              )}
            </Card>

            {/* Validation Checks */}
            {validationChecks.length > 0 && (
              <Card padding="lg">
                <CardHeader
                  title="Validation Checks"
                  subtitle="Automated verification pipeline"
                  action={
                    allPassed ? (
                      <Badge variant="success">All Passed</Badge>
                    ) : (
                      <Badge variant="danger">Failed</Badge>
                    )
                  }
                />
                <div className="space-y-2">
                  {validationChecks.map((check, i) => (
                    <div
                      key={i}
                      className={`flex items-start gap-3 p-3 rounded-lg border ${
                        check.passed ? 'border-border bg-surface' : 'border-danger/30 bg-danger-light'
                      }`}
                    >
                      {check.passed ? (
                        <CheckCircle className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
                      ) : (
                        <XCircle className="w-4 h-4 text-danger flex-shrink-0 mt-0.5" />
                      )}
                      <div>
                        <p className="text-[13px] font-medium text-text-primary">{check.check}</p>
                        {check.detail && (
                          <p className="text-[12px] text-text-secondary">{check.detail}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 px-3 py-2.5 rounded-lg bg-border-light flex items-start gap-2">
                  <FileText className="w-4 h-4 text-text-muted flex-shrink-0 mt-0.5" />
                  <p className="text-[12px] text-text-secondary">
                    Validation is performed by the rules engine. AI models assist with anomaly scoring
                    and event classification but do not determine eligibility.
                  </p>
                </div>
              </Card>
            )}
          </div>

          {/* Payout Sidebar */}
          <div className="space-y-6">
            <Card padding="lg" className={allPassed ? 'ring-1 ring-success' : ''}>
              <CardHeader title="Payout Estimate" />
              {allPassed && latestPayout > 0 ? (
                <div className="text-center">
                  <CheckCircle className="w-8 h-8 text-success mx-auto mb-2" />
                  <p className="text-[28px] font-bold text-success">{formatCurrency(latestPayout)}</p>
                  <p className="text-[12px] text-text-secondary mt-1">Estimated payout amount</p>
                </div>
              ) : (
                <div className="text-center py-4">
                  <AlertTriangle className="w-8 h-8 text-warning mx-auto mb-2" />
                  <p className="text-[14px] font-semibold text-warning">Pending Assessment</p>
                  <p className="text-[13px] text-text-secondary mt-1">Claim is being processed.</p>
                </div>
              )}
              <div className="mt-3 pt-3 border-t border-border text-center">
                <ClaimStatusBadge status={latestStatus} />
              </div>
            </Card>

            <Link href="/dashboard">
              <Button variant="outline" fullWidth>
                Go to Dashboard
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Older Claims History */}
        {older.length > 0 && (
          <Card padding="lg">
            <CardHeader title="Previous Claims" subtitle="Older claims sorted by date" />
            <div className="overflow-x-auto -mx-4 sm:-mx-5 px-4 sm:px-5">
              <table className="w-full text-[13px]">
                <thead>
                  <tr className="text-left text-text-muted text-[11px] uppercase tracking-wider">
                    <th className="pb-2 pr-3 font-medium">Claim ID</th>
                    <th className="pb-2 pr-3 font-medium">Event Type</th>
                    <th className="pb-2 pr-3 font-medium">Zone</th>
                    <th className="pb-2 pr-3 font-medium">Payout</th>
                    <th className="pb-2 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {older.map((claim, i) => (
                    <tr key={i}>
                      <td className="py-3 pr-3 text-text-secondary truncate max-w-[120px]">
                        {(claim.claim_id || claim.id || `#${i + 2}`) as string}
                      </td>
                      <td className="py-3 pr-3 font-medium text-text-primary capitalize">
                        {String(claim.event_type || '').replace(/_/g, ' ')}
                      </td>
                      <td className="py-3 pr-3 text-text-secondary">{(claim.zone || '—') as string}</td>
                      <td className="py-3 pr-3 font-medium text-text-primary">
                        {Number(claim.estimated_payout || claim.payout_amount || 0) > 0
                          ? formatCurrency(Number(claim.estimated_payout || claim.payout_amount))
                          : '—'}
                      </td>
                      <td className="py-3">
                        <ClaimStatusBadge status={(claim.status || 'processing') as string} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </main>
    </>
  );
}
