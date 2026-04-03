'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Card, { CardHeader } from '@/components/Card';
import Badge from '@/components/Badge';
import Button from '@/components/Button';
import { COVERAGE_TIERS, DISRUPTION_TYPE_INFO } from '@/lib/constants';
import { generateQuote } from '@/lib/api';
import type { QuoteResponse } from '@/lib/api';
import { getWorker, saveQuote, getQuote, savePolicy } from '@/lib/store';
import { createPolicy } from '@/lib/api';
import { ArrowRight, Shield, TrendingUp, Info, Loader2, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

function formatCurrency(n: number) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(n);
}

export default function QuotePage() {
  const router = useRouter();
  const [quote, setQuote] = useState<QuoteResponse | null>(null);
  const [tierIdx, setTierIdx] = useState(1); // default Standard
  const [loading, setLoading] = useState(true);
  const [activating, setActivating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [featureContext, setFeatureContext] = useState<{ reference_date: string } | null>(null);

  const tier = COVERAGE_TIERS[tierIdx];

  const worker = getWorker();

  const fetchQuote = useCallback(async (coverageTier: string) => {
    setLoading(true);
    setError(null);
    try {
      const w = getWorker();
      if (!w) {
        setError('No worker profile found. Please complete registration first.');
        setLoading(false);
        return;
      }

      const today = new Date().toISOString().split('T')[0];
      const ctx = { reference_date: today };
      setFeatureContext(ctx);

      const payload = {
        worker_profile: {
          city: w.city,
          zone: w.zone as string,
          shift_type: w.shift_type,
          coverage_tier: coverageTier,
          weekly_earnings: w.weekly_earnings as number,
          weekly_active_hours: w.weekly_active_hours as number,
        },
        feature_context: ctx,
      };

      const result = await generateQuote(payload);
      setQuote(result);
      saveQuote({ ...result, _feature_context: ctx });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate quote');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchQuote(COVERAGE_TIERS[tierIdx].id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleTierChange(idx: number) {
    setTierIdx(idx);
    fetchQuote(COVERAGE_TIERS[idx].id);
  }

  async function handleActivate() {
    setActivating(true);
    setError(null);
    try {
      const w = getWorker();
      if (!w?.worker_id) throw new Error('Worker not registered');

      const payload: { worker_id: string; coverage_tier: string; feature_context?: { reference_date: string } } = {
        worker_id: w.worker_id,
        coverage_tier: tier.id,
      };
      if (featureContext) payload.feature_context = featureContext;

      const policy = await createPolicy(payload);
      savePolicy(policy);
      router.push('/policy');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create policy');
    } finally {
      setActivating(false);
    }
  }

  const rs = quote?.risk_summary;
  const pb = quote?.premium_breakdown;
  const cs = quote?.coverage_summary;

  const riskColor = rs?.risk_band === 'HIGH' ? '#DC2626' : rs?.risk_band === 'MODERATE' ? '#D97706' : '#059669';
  const riskVariant: 'danger' | 'warning' | 'success' =
    rs?.risk_band === 'HIGH' ? 'danger' : rs?.risk_band === 'MODERATE' ? 'warning' : 'success';

  if (loading) {
    return (
      <>
        <Header />
        <main className="flex-1 max-w-4xl mx-auto px-4 py-16 w-full flex flex-col items-center justify-center gap-4">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
          <p className="text-[14px] text-text-secondary">Generating your personalised risk assessment…</p>
        </main>
      </>
    );
  }

  if (error && !quote) {
    return (
      <>
        <Header />
        <main className="flex-1 max-w-4xl mx-auto px-4 py-16 w-full flex flex-col items-center justify-center gap-4">
          <AlertTriangle className="w-8 h-8 text-danger" />
          <p className="text-[14px] text-danger font-medium">{error}</p>
          <Link href="/onboarding">
            <Button variant="outline">Complete Registration</Button>
          </Link>
        </main>
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="flex-1 max-w-4xl mx-auto px-4 py-6 sm:py-10 w-full">
        <div className="mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-text-primary">Your Risk Assessment & Quote</h1>
          <p className="text-[14px] text-text-secondary mt-1">
            Based on your zone, shift timing, and earnings — here is your personalized weekly protection quote.
          </p>
        </div>

        {error && (
          <div className="mb-4 px-3 py-2.5 rounded-lg bg-warning-light border border-warning/20 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-warning flex-shrink-0" />
            <p className="text-[13px] text-warning">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Risk Profile */}
          <Card padding="lg">
            <CardHeader
              title="Risk Profile"
              subtitle={rs ? `${quote?.worker_profile?.zone ?? worker?.zone ?? ''}, ${quote?.worker_profile?.city ?? worker?.city ?? ''}` : ''}
              action={
                rs ? (
                  <Badge variant={riskVariant}>{rs.risk_band} risk</Badge>
                ) : null
              }
            />
            {rs && (
              <>
                <div className="flex items-center gap-4 mb-5">
                  <div className="relative w-20 h-20 flex-shrink-0">
                    <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                      <circle cx="50" cy="50" r="42" fill="none" stroke="#E2E8F0" strokeWidth="8" />
                      <circle
                        cx="50"
                        cy="50"
                        r="42"
                        fill="none"
                        stroke={riskColor}
                        strokeWidth="8"
                        strokeDasharray={`${rs.risk_score * 2.64} 264`}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-[18px] font-bold text-text-primary">{Math.round(rs.risk_score)}</span>
                    </div>
                  </div>
                  <div className="text-[13px] text-text-secondary leading-relaxed">
                    {rs.risk_band} risk profile. Expected disrupted hours: <strong>{rs.expected_disrupted_hours?.toFixed(1)}h/week</strong>.
                    Zone baseline: <strong>{rs.zone_risk_band}</strong>.
                  </div>
                </div>
                <div className="space-y-2.5">
                  {rs.top_risk_drivers?.map((d) => (
                    <div key={d.driver}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[12px] font-medium text-text-secondary">{d.driver}</span>
                        <span className="text-[12px] font-semibold text-text-primary">{Math.round(d.score)}/100</span>
                      </div>
                      <div className="w-full h-1.5 bg-border-light rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{ width: `${d.score}%`, backgroundColor: riskColor }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </Card>

          {/* Premium Quote */}
          <div className="space-y-6">
            {/* Coverage Tier Selector */}
            <Card padding="lg">
              <CardHeader title="Coverage Tier" subtitle="Select your protection level" />
              <div className="grid grid-cols-3 gap-2">
                {COVERAGE_TIERS.map((t, i) => (
                  <button
                    key={t.id}
                    onClick={() => handleTierChange(i)}
                    className={`p-3 rounded-lg border text-center transition-colors cursor-pointer ${
                      i === tierIdx
                        ? 'border-primary bg-primary-light'
                        : 'border-border bg-surface hover:border-primary/40'
                    }`}
                  >
                    <p className="text-[13px] font-semibold text-text-primary">{t.name}</p>
                    <p className="text-[11px] text-text-secondary mt-0.5">
                      {cs?.coverage_percent ?? t.coveragePercent}% coverage
                    </p>
                    <p className="text-[12px] font-bold text-primary mt-1">
                      Up to {formatCurrency(cs?.max_weekly_payout ?? t.maxWeeklyPayout)}
                    </p>
                  </button>
                ))}
              </div>
            </Card>

            {/* Premium Breakdown */}
            {pb && (
              <Card padding="lg">
                <CardHeader title="Weekly Premium Breakdown" />
                <div className="space-y-2">
                  <PremiumLine label="Base Premium" value={pb.base_premium} />
                  <PremiumLine label="Zone Risk Loading" value={pb.zone_risk_loading} />
                  <PremiumLine label="Shift Exposure Loading" value={pb.shift_exposure_loading} />
                  <PremiumLine label="Coverage Factor" value={pb.coverage_factor} />
                  <PremiumLine label="ML Risk Loading" value={pb.ml_risk_loading} />
                  <PremiumLine label="Safe Zone Discount" value={-pb.safe_zone_discount} isDiscount />
                  <div className="border-t border-border pt-3 mt-3 flex justify-between items-baseline">
                    <span className="text-[14px] font-semibold text-text-primary">Weekly Premium</span>
                    <span className="text-[22px] font-bold text-primary">
                      {formatCurrency(pb.final_weekly_premium)}
                    </span>
                  </div>
                </div>
              </Card>
            )}

            {/* Protected Income */}
            {cs && (
              <Card padding="md" className="bg-primary-light border-primary/20">
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[13px] font-semibold text-primary">Protected Weekly Income</p>
                    <p className="text-[22px] font-bold text-text-primary mt-0.5">
                      {formatCurrency(cs.protected_weekly_income)}
                    </p>
                    <p className="text-[12px] text-text-secondary mt-1">
                      {cs.coverage_percent}% of weekly earnings · {formatCurrency(cs.protected_hourly_income)}/hr · {cs.insured_shift_hours_per_week}h/week insured
                    </p>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>

        {/* Eligible Disruptions */}
        <Card padding="lg" className="mt-6">
          <CardHeader
            title="Eligible Disruption Triggers"
            subtitle={`${tier.name} tier covers ${tier.eligibleDisruptions.length} disruption types`}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {tier.eligibleDisruptions.map((dt) => {
              const info = DISRUPTION_TYPE_INFO[dt];
              return (
                <div key={dt} className="flex items-start gap-2.5 p-3 rounded-lg border border-border bg-background">
                  <TrendingUp className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[13px] font-medium text-text-primary">{info.label}</p>
                    <p className="text-[11px] text-text-secondary mt-0.5">{info.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-4 px-3 py-2.5 rounded-lg bg-border-light flex items-start gap-2">
            <Info className="w-4 h-4 text-text-muted flex-shrink-0 mt-0.5" />
            <p className="text-[12px] text-text-secondary">
              Market analytics events are tracked for risk modelling but do not directly trigger payouts.
            </p>
          </div>
        </Card>

        {/* Action */}
        <div className="mt-6 flex justify-end">
          <Button onClick={handleActivate} disabled={activating || !quote}>
            {activating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Activating…
              </>
            ) : (
              <>
                Activate Weekly Protection
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </Button>
        </div>
      </main>
    </>
  );
}

function PremiumLine({ label, value, isDiscount }: { label: string; value: number; isDiscount?: boolean }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-[13px] text-text-secondary">{label}</span>
      <span className={`text-[13px] font-medium ${isDiscount && value < 0 ? 'text-success' : 'text-text-primary'}`}>
        {isDiscount && value < 0 ? '-' : '+'}₹{Math.abs(value)}
      </span>
    </div>
  );
}
