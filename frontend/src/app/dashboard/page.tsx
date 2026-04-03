'use client';

import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Card, { CardHeader } from '@/components/Card';
import StatCard from '@/components/StatCard';
import Badge from '@/components/Badge';
import Button from '@/components/Button';
import { getWorkerPolicies, getWorkerClaims } from '@/lib/api';
import { getWorker, getEvent } from '@/lib/store';
import { DISRUPTION_TYPE_INFO } from '@/lib/constants';
import {
  Shield,
  IndianRupee,
  Clock,
  AlertTriangle,
  ArrowRight,
  CalendarCheck,
  TrendingUp,
  Loader2,
  Zap,
} from 'lucide-react';
import Link from 'next/link';

function formatCurrency(n: number) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(n);
}

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [worker, setWorker] = useState<ReturnType<typeof getWorker>>(null);
  const [policy, setPolicy] = useState<Record<string, unknown> | null>(null);
  const [claims, setClaims] = useState<Record<string, unknown>[]>([]);
  const [lastEvent, setLastEvent] = useState<Record<string, unknown> | null>(null);

  useEffect(() => {
    const w = getWorker();
    setWorker(w);

    const evt = getEvent();
    setLastEvent(evt);

    if (!w?.worker_id) {
      setLoading(false);
      return;
    }

    async function fetchData() {
      try {
        // Fetch policy
        const policyRes = await getWorkerPolicies(w!.worker_id);
        const policyList = Array.isArray(policyRes)
          ? policyRes
          : (policyRes as Record<string, unknown[]>).policies ?? [policyRes];
        if (policyList.length > 0) {
          setPolicy(policyList[0] as Record<string, unknown>);
        }
      } catch { /* silently ignore */ }

      try {
        // Fetch claims
        const claimsRes = await getWorkerClaims(w!.worker_id);
        const claimsList = Array.isArray(claimsRes)
          ? claimsRes
          : (claimsRes as Record<string, unknown[]>).claims ?? [claimsRes];
        setClaims(claimsList as Record<string, unknown>[]);
      } catch { /* silently ignore */ }

      setLoading(false);
    }

    fetchData();
  }, []);

  if (loading) {
    return (
      <>
        <Header />
        <main className="flex-1 max-w-5xl mx-auto px-4 py-16 w-full flex flex-col items-center justify-center gap-4">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
          <p className="text-[14px] text-text-secondary">Loading dashboard…</p>
        </main>
      </>
    );
  }

  if (!worker) {
    return (
      <>
        <Header />
        <main className="flex-1 max-w-5xl mx-auto px-4 py-16 w-full flex flex-col items-center justify-center gap-4">
          <Shield className="w-10 h-10 text-text-muted opacity-60" />
          <p className="text-[16px] font-semibold text-text-primary">Not registered yet</p>
          <p className="text-[14px] text-text-secondary">Complete registration to access your dashboard.</p>
          <Link href="/onboarding">
            <Button>Get Started <ArrowRight className="w-4 h-4" /></Button>
          </Link>
        </main>
      </>
    );
  }

  // Derive stats
  const weeklyPremium = Number(policy?.weekly_premium || policy?.final_weekly_premium || 0);
  const maxPayout = Number(policy?.max_weekly_payout || 0);
  const protectedIncome = Number(policy?.protected_weekly_income || 0);
  const coverageTier = (policy?.coverage_tier || 'standard') as string;
  const policyStatus = (policy?.status || 'active') as string;
  const policyId = (policy?.policy_id || policy?.id || '—') as string;
  const zone = (policy?.zone || worker.zone || '—') as string;
  const shiftType = (policy?.shift_type || worker.shift_type || '—') as string;

  const paidClaims = claims.filter((c) => ['paid', 'approved'].includes((c.status as string) || ''));
  const totalPaid = paidClaims.reduce((s, c) => s + Number(c.estimated_payout || c.payout_amount || 0), 0);

  // Recent disruptions: from lastEvent OR from claims event info
  const hasEvents = lastEvent !== null;
  const recentClaimsWithEvents = claims.slice(0, 3).filter((c) => c.event_type);

  return (
    <>
      <Header />
      <main className="flex-1 max-w-5xl mx-auto px-4 py-6 sm:py-10 w-full">
        {/* Greeting */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-text-primary">
              Welcome back, {worker.name || 'Worker'}
            </h1>
            <p className="text-[14px] text-text-secondary mt-0.5">
              {policy ? 'Your income protection dashboard' : 'No active policy — get protected today'}
            </p>
          </div>
          {policy && (
            <Link href="/policy">
              <Button variant="outline" size="sm">
                View Policy
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
          <StatCard
            label="Weekly Premium"
            value={weeklyPremium ? formatCurrency(weeklyPremium) : '—'}
            icon={<IndianRupee className="w-4 h-4 text-primary" />}
            subtitle={`${coverageTier} plan`}
          />
          <StatCard
            label="Protected Income"
            value={protectedIncome ? formatCurrency(protectedIncome) : '—'}
            icon={<Shield className="w-4 h-4 text-primary" />}
            subtitle="Per week"
          />
          <StatCard
            label="Total Payouts"
            value={totalPaid > 0 ? formatCurrency(totalPaid) : '₹0'}
            icon={<TrendingUp className="w-4 h-4 text-primary" />}
            subtitle={`${paidClaims.length} claim${paidClaims.length !== 1 ? 's' : ''} paid`}
          />
          <StatCard
            label="Max Weekly Payout"
            value={maxPayout ? formatCurrency(maxPayout) : '—'}
            icon={<CalendarCheck className="w-4 h-4 text-primary" />}
            subtitle="Weekly cap"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Active Policy */}
            {policy ? (
              <Card padding="lg">
                <CardHeader
                  title="Active Policy"
                  action={
                    <Badge variant={policyStatus === 'active' ? 'success' : 'muted'}>
                      {policyStatus}
                    </Badge>
                  }
                />
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-[13px]">
                  <div>
                    <span className="text-text-muted text-[11px] uppercase tracking-wide">Policy ID</span>
                    <p className="font-medium text-text-primary mt-0.5 truncate">{policyId}</p>
                  </div>
                  <div>
                    <span className="text-text-muted text-[11px] uppercase tracking-wide">Zone</span>
                    <p className="font-medium text-text-primary mt-0.5">{zone}</p>
                  </div>
                  <div>
                    <span className="text-text-muted text-[11px] uppercase tracking-wide">Shift</span>
                    <p className="font-medium text-text-primary mt-0.5 capitalize">{shiftType.replace(/_/g, ' ')}</p>
                  </div>
                  <div>
                    <span className="text-text-muted text-[11px] uppercase tracking-wide">Coverage</span>
                    <p className="font-medium text-text-primary mt-0.5 capitalize">{coverageTier}</p>
                  </div>
                </div>
              </Card>
            ) : (
              <Card padding="lg">
                <div className="py-6 text-center">
                  <Shield className="w-10 h-10 text-text-muted opacity-40 mx-auto mb-3" />
                  <p className="text-[15px] font-semibold text-text-primary mb-1">No Active Policy</p>
                  <p className="text-[13px] text-text-secondary mb-4">Get a weekly protection quote to get started.</p>
                  <Link href="/quote">
                    <Button>Get a Quote <ArrowRight className="w-4 h-4" /></Button>
                  </Link>
                </div>
              </Card>
            )}

            {/* Claim History */}
            {claims.length > 0 && (
              <Card padding="lg">
                <CardHeader
                  title="Claim History"
                  subtitle="Your recent disruption claims and payouts"
                  action={
                    <Link href="/claim">
                      <Button variant="ghost" size="sm">View All</Button>
                    </Link>
                  }
                />
                <div className="overflow-x-auto -mx-4 sm:-mx-5 px-4 sm:px-5">
                  <table className="w-full text-[13px]">
                    <thead>
                      <tr className="text-left text-text-muted text-[11px] uppercase tracking-wider">
                        <th className="pb-2 pr-3 font-medium">Event</th>
                        <th className="pb-2 pr-3 font-medium">Zone</th>
                        <th className="pb-2 pr-3 font-medium">Payout</th>
                        <th className="pb-2 font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {claims.slice(0, 5).map((claim, i) => (
                        <tr key={i}>
                          <td className="py-3 pr-3 font-medium text-text-primary capitalize">
                            {String(claim.event_type || '').replace(/_/g, ' ') || 'Disruption'}
                          </td>
                          <td className="py-3 pr-3 text-text-secondary">{(claim.zone || '—') as string}</td>
                          <td className="py-3 pr-3 font-medium text-text-primary">
                            {Number(claim.estimated_payout || claim.payout_amount || 0) > 0
                              ? formatCurrency(Number(claim.estimated_payout || claim.payout_amount))
                              : '—'}
                          </td>
                          <td className="py-3">
                            <Badge
                              variant={
                                ['paid', 'approved'].includes((claim.status as string) || '')
                                  ? 'success'
                                  : (claim.status as string) === 'processing' || (claim.status as string) === 'eligible'
                                  ? 'warning'
                                  : (claim.status as string) === 'rejected'
                                  ? 'danger'
                                  : 'muted'
                              }
                            >
                              {(claim.status || '—') as string}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recent Disruptions — only if events exist */}
            {hasEvents && (
              <Card padding="md">
                <CardHeader title="Recent Disruptions" subtitle="Latest simulated event" />
                <div className="space-y-3">
                  {lastEvent && (
                    <div className="p-3 rounded-lg border border-border bg-background">
                      <div className="flex items-start justify-between mb-1">
                        <p className="text-[13px] font-medium text-text-primary capitalize">
                          {String(lastEvent.event_type || '').replace(/_/g, ' ')}
                        </p>
                        <Badge variant={(lastEvent.severity as string) === 'severe' ? 'danger' : (lastEvent.severity as string) === 'high' ? 'warning' : 'muted'}>
                          {(lastEvent.severity || 'high') as string}
                        </Badge>
                      </div>
                      <p className="text-[12px] text-text-secondary">{(lastEvent.zone || '') as string}, {(lastEvent.city || '') as string}</p>
                      {lastEvent.duration_hours && (
                        <p className="text-[11px] text-text-muted mt-1">{lastEvent.duration_hours as number}h duration</p>
                      )}
                    </div>
                  )}
                  {recentClaimsWithEvents.map((claim, i) => (
                    <div key={i} className="p-3 rounded-lg border border-border bg-background">
                      <div className="flex items-start justify-between mb-1">
                        <p className="text-[13px] font-medium text-text-primary capitalize">
                          {String(claim.event_type || '').replace(/_/g, ' ')}
                        </p>
                        <Badge variant={(claim.severity as string) === 'high' ? 'warning' : 'muted'}>
                          {(claim.severity || 'high') as string}
                        </Badge>
                      </div>
                      <p className="text-[12px] text-text-secondary">{(claim.zone || '—') as string}</p>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {!hasEvents && recentClaimsWithEvents.length === 0 && (
              <Card padding="md">
                <CardHeader title="Recent Disruptions" />
                <div className="py-4 text-center">
                  <p className="text-[13px] text-text-muted">No disruptions recorded yet</p>
                </div>
              </Card>
            )}

            {/* Quick Actions */}
            <Card padding="md">
              <CardHeader title="Quick Actions" />
              <div className="space-y-2">
                <Link href="/simulate" className="block">
                  <Button variant="outline" size="sm" fullWidth>
                    <AlertTriangle className="w-3.5 h-3.5" />
                    Simulate Disruption
                  </Button>
                </Link>
                <Link href="/claim" className="block">
                  <Button variant="outline" size="sm" fullWidth>
                    <Clock className="w-3.5 h-3.5" />
                    View Latest Claim
                  </Button>
                </Link>
                {!policy && (
                  <Link href="/quote" className="block">
                    <Button size="sm" fullWidth>
                      <Zap className="w-3.5 h-3.5" />
                      Get Protected
                    </Button>
                  </Link>
                )}
              </div>
            </Card>
          </div>
        </div>
      </main>
    </>
  );
}
