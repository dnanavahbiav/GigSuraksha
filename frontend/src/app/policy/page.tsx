'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Card, { CardHeader } from '@/components/Card';
import Badge from '@/components/Badge';
import Button from '@/components/Button';
import { DISRUPTION_TYPE_INFO } from '@/lib/constants';
import { getPolicy as getStoredPolicy, savePolicy, getWorker } from '@/lib/store';
import { getPolicy, getWorkerPolicies } from '@/lib/api';
import {
  Shield,
  Calendar,
  MapPin,
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  ArrowRight,
  Loader2,
} from 'lucide-react';
import Link from 'next/link';

const exclusions = [
  'Low order demand or reduced incentives',
  'Rider oversupply in zone',
  'Self-reported disruptions without data source',
  'Planned maintenance or scheduled outages',
  'Events outside insured shift windows',
  'Disruptions in non-registered zones',
];

function formatCurrency(n: number) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(n);
}

export default function PolicyPage() {
  const [policy, setPolicy] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        // Try localStorage first
        const stored = getStoredPolicy();
        if (stored) {
          setPolicy(stored);
          setLoading(false);
          return;
        }

        // Try fetching by worker_id
        const worker = getWorker();
        if (worker?.worker_id) {
          const result = await getWorkerPolicies(worker.worker_id);
          const policies = Array.isArray(result) ? result : (result as Record<string, unknown[]>).policies ?? [result];
          if (policies.length > 0) {
            const p = policies[0] as Record<string, unknown>;
            savePolicy(p);
            setPolicy(p);
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load policy');
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
          <p className="text-[14px] text-text-secondary">Loading your policy…</p>
        </main>
      </>
    );
  }

  if (!policy) {
    return (
      <>
        <Header />
        <main className="flex-1 max-w-4xl mx-auto px-4 py-16 w-full flex flex-col items-center justify-center gap-4">
          <Shield className="w-10 h-10 text-text-muted" />
          <p className="text-[16px] font-semibold text-text-primary">No active policy</p>
          <p className="text-[14px] text-text-secondary">You don&apos;t have an active policy yet.</p>
          <Link href="/quote">
            <Button>Get a Quote <ArrowRight className="w-4 h-4" /></Button>
          </Link>
        </main>
      </>
    );
  }

  // Map backend fields
  const policyId = (policy.policy_id || policy.id || '') as string;
  const workerName = (policy.worker_name || policy.name || 'Worker') as string;
  const coverageTier = (policy.coverage_tier || 'standard') as string;
  const status = (policy.status || 'active') as string;
  const weeklyPremium = (policy.weekly_premium || policy.final_weekly_premium || 0) as number;
  const maxPayout = (policy.max_weekly_payout || 0) as number;
  const protectedIncome = (policy.protected_weekly_income || 0) as number;
  const protectedHourly = (policy.protected_hourly_income || 0) as number;
  const validFrom = (policy.valid_from || policy.start_date || '') as string;
  const validTo = (policy.valid_to || policy.end_date || '') as string;
  const zone = (policy.zone || '') as string;
  const shiftType = (policy.shift_type || '') as string;

  // Map coverage tier name to eligible disruptions
  const tierDef = ['basic', 'standard', 'comprehensive'].includes(coverageTier.toLowerCase())
    ? ['basic', 'standard', 'comprehensive'].indexOf(coverageTier.toLowerCase())
    : 1;
  const { COVERAGE_TIERS } = require('@/lib/constants');
  const coverageTierObj = COVERAGE_TIERS[tierDef];

  return (
    <>
      <Header />
      <main className="flex-1 max-w-4xl mx-auto px-4 py-6 sm:py-10 w-full">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-text-primary">Policy Summary</h1>
            <p className="text-[14px] text-text-secondary mt-1">
              {validFrom && validTo ? `Active: ${validFrom} → ${validTo}` : 'Active policy'}
            </p>
          </div>
          <Badge variant={status === 'active' ? 'success' : 'muted'}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
        </div>

        {error && (
          <div className="mb-4 px-3 py-2.5 rounded-lg bg-warning-light border border-warning/20">
            <p className="text-[13px] text-warning">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Policy Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Policy Card */}
            <Card padding="lg">
              <div className="flex items-start gap-3 mb-5">
                <div className="w-10 h-10 rounded-lg bg-primary-light flex items-center justify-center flex-shrink-0">
                  <Shield className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-[15px] font-semibold text-text-primary">{policyId}</p>
                  <p className="text-[13px] text-text-secondary">{workerName} — {coverageTier.charAt(0).toUpperCase() + coverageTier.slice(1)} Plan</p>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <PolicyDetail icon={Calendar} label="Valid From" value={validFrom || '—'} />
                <PolicyDetail icon={MapPin} label="Zone" value={zone || '—'} />
                <PolicyDetail icon={Clock} label="Shift Type" value={shiftType || '—'} />
                <PolicyDetail icon={Shield} label="Max Payout" value={maxPayout ? formatCurrency(maxPayout) : '—'} />
              </div>
            </Card>

            {/* Financial Summary */}
            <Card padding="lg">
              <CardHeader title="Financial Summary" />
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-3 rounded-lg bg-primary-light">
                  <p className="text-[11px] font-medium text-primary uppercase tracking-wide">Weekly Premium</p>
                  <p className="text-[20px] font-bold text-text-primary mt-1">
                    {weeklyPremium ? formatCurrency(weeklyPremium) : '—'}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-success-light">
                  <p className="text-[11px] font-medium text-success uppercase tracking-wide">Protected Income</p>
                  <p className="text-[20px] font-bold text-text-primary mt-1">
                    {protectedIncome ? formatCurrency(protectedIncome) : '—'}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-border-light">
                  <p className="text-[11px] font-medium text-text-secondary uppercase tracking-wide">Hourly Rate</p>
                  <p className="text-[20px] font-bold text-text-primary mt-1">
                    {protectedHourly ? formatCurrency(protectedHourly) + '/hr' : '—'}
                  </p>
                </div>
              </div>
            </Card>

            {/* Covered Triggers */}
            <Card padding="lg">
              <CardHeader
                title="Covered Disruptions"
                subtitle={`${coverageTierObj.eligibleDisruptions.length} event types covered under ${coverageTierObj.name} plan`}
              />
              <div className="space-y-2">
                {coverageTierObj.eligibleDisruptions.map((dt: string) => {
                  const info = DISRUPTION_TYPE_INFO[dt as keyof typeof DISRUPTION_TYPE_INFO];
                  return (
                    <div key={dt} className="flex items-center gap-3 px-3 py-2 rounded-lg border border-border">
                      <CheckCircle className="w-4 h-4 text-success flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-medium text-text-primary">{info?.label || dt}</p>
                      </div>
                      <Badge variant="muted">{info?.category || 'EVENT'}</Badge>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card padding="md">
              <CardHeader title="Quick Actions" />
              <div className="space-y-2">
                <Link href="/simulate" className="block">
                  <Button variant="outline" fullWidth>
                    Simulate Disruption
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <Link href="/claim" className="block">
                  <Button variant="outline" fullWidth>
                    View Claim Preview
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <Link href="/dashboard" className="block">
                  <Button variant="outline" fullWidth>
                    Go to Dashboard
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </Card>

            {/* Exclusions */}
            <Card padding="md">
              <CardHeader title="Exclusions" subtitle="Not covered under this plan" />
              <div className="space-y-2">
                {exclusions.map((ex) => (
                  <div key={ex} className="flex items-start gap-2">
                    <XCircle className="w-3.5 h-3.5 text-text-muted flex-shrink-0 mt-0.5" />
                    <p className="text-[12px] text-text-secondary">{ex}</p>
                  </div>
                ))}
              </div>
            </Card>

            {/* Important Note */}
            <Card padding="md" className="bg-warning-light border-warning/20">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-warning flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-[12px] font-semibold text-warning">Important</p>
                  <p className="text-[12px] text-text-secondary mt-0.5">
                    Payouts are determined by a rules engine using verified external data. AI models assist with
                    classification and anomaly detection but do not make final payout decisions.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </>
  );
}

function PolicyDetail({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div>
      <div className="flex items-center gap-1.5 mb-1">
        <Icon className="w-3.5 h-3.5 text-text-muted" />
        <span className="text-[11px] font-medium text-text-muted uppercase tracking-wide">{label}</span>
      </div>
      <p className="text-[13px] font-medium text-text-primary">{value}</p>
    </div>
  );
}
