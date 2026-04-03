'use client';

import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Card, { CardHeader } from '@/components/Card';
import StatCard from '@/components/StatCard';
import Badge from '@/components/Badge';
import { getAdminSummary } from '@/lib/api';
import type { AdminSummary } from '@/lib/api';
import { formatCurrencyShort } from '@/lib/calculations';
import {
  Shield,
  FileWarning,
  IndianRupee,
  Calendar,
  Loader2,
  AlertTriangle,
  Eye,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const PIE_COLORS = ['#1D4ED8', '#2563EB', '#3B82F6', '#60A5FA', '#93C5FD', '#BFDBFE', '#DBEAFE'];

export default function AdminPage() {
  const [summary, setSummary] = useState<AdminSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await getAdminSummary();
        setSummary(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load admin summary');
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
        <main className="flex-1 max-w-6xl mx-auto px-4 py-16 w-full flex flex-col items-center gap-4 justify-center">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
          <p className="text-[14px] text-text-secondary">Loading admin dashboard…</p>
        </main>
      </>
    );
  }

  if (error || !summary) {
    return (
      <>
        <Header />
        <main className="flex-1 max-w-6xl mx-auto px-4 py-16 w-full flex flex-col items-center gap-4 justify-center">
          <AlertTriangle className="w-8 h-8 text-danger" />
          <p className="text-[14px] text-danger">{error || 'No data available'}</p>
        </main>
      </>
    );
  }

  // Build charts data from claims_by_event_type
  const claimsByTypeData = Object.entries(summary.claims_by_event_type || {}).map(([type, count]) => ({
    type: type.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()),
    count: count as number,
  }));

  const claimsByStatusData = Object.entries(summary.claims_by_status || {}).map(([status, count]) => ({
    status: status.charAt(0).toUpperCase() + status.slice(1),
    count: count as number,
  }));

  return (
    <>
      <Header />
      <main className="flex-1 max-w-6xl mx-auto px-4 py-6 sm:py-10 w-full">
        <div className="mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-text-primary">Admin Dashboard</h1>
          <p className="text-[14px] text-text-secondary mt-1">
            Live operational overview from the GigSuraksha backend
          </p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
          <StatCard
            label="Total Workers"
            value={(summary.total_workers || 0).toLocaleString('en-IN')}
            icon={<Shield className="w-4 h-4 text-primary" />}
          />
          <StatCard
            label="Active Policies"
            value={(summary.total_active_policies || 0).toLocaleString('en-IN')}
            icon={<Calendar className="w-4 h-4 text-primary" />}
          />
          <StatCard
            label="Total Claims"
            value={(summary.total_claims || 0).toLocaleString('en-IN')}
            icon={<FileWarning className="w-4 h-4 text-primary" />}
          />
          <StatCard
            label="Total Events"
            value={(summary.total_events || 0).toLocaleString('en-IN')}
            icon={<IndianRupee className="w-4 h-4 text-primary" />}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Claims by Event Type */}
          <div className="lg:col-span-2">
            <Card padding="lg">
              <CardHeader
                title="Claims by Event Type"
                subtitle="Distribution of claims across disruption types"
              />
              {claimsByTypeData.length > 0 ? (
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={claimsByTypeData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                      <XAxis
                        dataKey="type"
                        tick={{ fontSize: 10, fill: '#94A3B8' }}
                        tickLine={false}
                        axisLine={{ stroke: '#E2E8F0' }}
                        interval={0}
                        angle={-25}
                        textAnchor="end"
                        height={60}
                      />
                      <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} tickLine={false} axisLine={false} />
                      <Tooltip
                        contentStyle={{
                          background: '#FFFFFF',
                          border: '1px solid #E2E8F0',
                          borderRadius: '8px',
                          fontSize: '12px',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                        }}
                      />
                      <Bar dataKey="count" fill="#2563EB" radius={[4, 4, 0, 0]} maxBarSize={40} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-64 flex items-center justify-center text-text-muted text-[13px]">
                  No claims data yet
                </div>
              )}
            </Card>
          </div>

          {/* Claims by Status Pie */}
          <Card padding="lg">
            <CardHeader title="Claims by Status" subtitle="Status distribution" />
            {claimsByStatusData.length > 0 ? (
              <>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={claimsByStatusData}
                        dataKey="count"
                        nameKey="status"
                        cx="50%"
                        cy="50%"
                        outerRadius={70}
                        innerRadius={40}
                      >
                        {claimsByStatusData.map((_, i) => (
                          <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          background: '#FFFFFF',
                          border: '1px solid #E2E8F0',
                          borderRadius: '8px',
                          fontSize: '12px',
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-1 mt-2">
                  {claimsByStatusData.map((item, i) => (
                    <div key={item.status} className="flex items-center gap-2 text-[11px]">
                      <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: PIE_COLORS[i] }} />
                      <span className="text-text-secondary">{item.status}</span>
                      <span className="ml-auto font-medium text-text-primary">{item.count}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="h-48 flex items-center justify-center text-text-muted text-[13px]">
                No status data yet
              </div>
            )}
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Recent Events */}
          <Card padding="lg">
            <CardHeader title="Recent Events" subtitle="Latest simulated disruptions" />
            {(summary.recent_events || []).length > 0 ? (
              <div className="space-y-3">
                {(summary.recent_events || []).slice(0, 5).map((evt, i) => {
                  const e = evt as Record<string, unknown>;
                  return (
                    <div key={i} className="flex items-start gap-3 p-3 rounded-lg border border-border bg-background">
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-medium text-text-primary capitalize">
                          {String(e.event_type || '').replace(/_/g, ' ')}
                        </p>
                        <p className="text-[12px] text-text-secondary">
                          {(e.zone || '') as string}{e.city ? `, ${e.city}` : ''}
                        </p>
                      </div>
                      <Badge variant={(e.severity as string) === 'high' || (e.severity as string) === 'severe' ? 'warning' : 'muted'}>
                        {(e.severity || 'N/A') as string}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-[13px] text-text-muted py-4 text-center">No events yet</p>
            )}
          </Card>

          {/* Recent Claims */}
          <Card padding="lg">
            <CardHeader title="Recent Claims" subtitle="Latest auto-generated claims" />
            {(summary.recent_claims || []).length > 0 ? (
              <div className="overflow-x-auto -mx-4 sm:-mx-5 px-4 sm:px-5">
                <table className="w-full text-[12px]">
                  <thead>
                    <tr className="text-left text-text-muted text-[10px] uppercase tracking-wider">
                      <th className="pb-2 pr-3 font-medium">Event</th>
                      <th className="pb-2 pr-3 font-medium">Payout</th>
                      <th className="pb-2 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {(summary.recent_claims || []).slice(0, 6).map((claim, i) => {
                      const c = claim as Record<string, unknown>;
                      return (
                        <tr key={i}>
                          <td className="py-2.5 pr-3 font-medium text-text-primary capitalize">
                            {String(c.event_type || '').replace(/_/g, ' ') || 'Disruption'}
                          </td>
                          <td className="py-2.5 pr-3 text-text-primary">
                            {Number(c.estimated_payout || 0) > 0
                              ? `₹${Number(c.estimated_payout).toLocaleString('en-IN')}`
                              : '—'}
                          </td>
                          <td className="py-2.5">
                            <Badge
                              variant={
                                ['paid', 'approved'].includes((c.status as string) || '')
                                  ? 'success'
                                  : (c.status as string) === 'processing' || (c.status as string) === 'eligible'
                                  ? 'warning'
                                  : (c.status as string) === 'rejected'
                                  ? 'danger'
                                  : 'muted'
                              }
                            >
                              {(c.status || '—') as string}
                            </Badge>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-[13px] text-text-muted py-4 text-center">No claims yet</p>
            )}
          </Card>
        </div>

        {/* Forecast Cards */}
        {(summary.forecast_cards || []).length > 0 && (
          <Card padding="lg" className="mb-6">
            <CardHeader
              title="Risk Forecast Snapshots"
              subtitle="ML-generated risk assessments from the backend"
              action={<Badge variant="info">AI Forecast</Badge>}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {(summary.forecast_cards || []).slice(0, 4).map((card, i) => {
                const c = card as Record<string, unknown>;
                const riskBand = (c.risk_band as string) || 'MODERATE';
                return (
                  <div key={i} className="p-3 rounded-lg border border-border bg-background">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-[13px] font-medium text-text-primary truncate">{(c.zone || 'Zone') as string}</p>
                      <span
                        className={`text-[12px] font-bold ${
                          riskBand === 'HIGH' ? 'text-danger' : riskBand === 'MODERATE' ? 'text-warning' : 'text-success'
                        }`}
                      >
                        {Math.round(Number(c.risk_score || 0))}
                      </span>
                    </div>
                    <p className="text-[12px] text-text-secondary capitalize">
                      {(c.city || '') as string} · {String(c.shift_type || '').replace(/_/g, ' ')}
                    </p>
                    <p className="text-[11px] text-text-muted mt-1">
                      ~{Number(c.expected_disrupted_hours || 0).toFixed(1)}h disruption expected
                    </p>
                    <div className="mt-2 w-full h-1.5 bg-border-light rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${Math.min(Number(c.risk_score || 0), 100)}%`,
                          backgroundColor: riskBand === 'HIGH' ? '#DC2626' : riskBand === 'MODERATE' ? '#D97706' : '#059669',
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-4 px-3 py-2.5 rounded-lg bg-border-light flex items-start gap-2">
              <Eye className="w-4 h-4 text-text-muted flex-shrink-0 mt-0.5" />
              <p className="text-[12px] text-text-secondary">
                Forecasts are generated by ML models using real backend data. They inform risk pricing and reserve
                allocation — not direct payout decisions.
              </p>
            </div>
          </Card>
        )}

        {/* Roadmap Features — clearly labelled */}
        <Card padding="lg" className="opacity-70">
          <CardHeader
            title="Anomaly Alerts & Zone Exposure"
            subtitle="Not backed by the current API"
            action={<Badge variant="muted">Phase 3 Roadmap</Badge>}
          />
          <div className="p-4 rounded-lg border border-dashed border-border bg-background text-center">
            <p className="text-[13px] text-text-muted">
              <strong>Illustrative — Phase 3 roadmap feature.</strong> Real-time anomaly detection and zone exposure
              heatmaps will be introduced in the next backend release.
            </p>
          </div>
        </Card>
      </main>
    </>
  );
}
