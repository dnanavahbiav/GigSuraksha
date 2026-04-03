'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Card, { CardHeader } from '@/components/Card';
import Badge from '@/components/Badge';
import Button from '@/components/Button';
import { ZONES, DISRUPTION_TYPE_INFO, SEVERITY_CONFIG, SHIFT_WINDOWS, EVENT_TYPE_MAP } from '@/lib/constants';
import { calculateShiftOverlap } from '@/lib/calculations';
import { simulateEvent } from '@/lib/api';
import { getWorker, saveEvent } from '@/lib/store';
import type { DisruptionType, Severity } from '@/lib/types';
import {
  CloudRain,
  Waves,
  Thermometer,
  Wind,
  ShieldOff,
  Store,
  WifiOff,
  AlertTriangle,
  CheckCircle,
  Zap,
  Clock,
  Loader2,
  Info,
} from 'lucide-react';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  CloudRain, Waves, Thermometer, Wind, ShieldOff, Store, WifiOff,
};

const DISRUPTION_TYPES = Object.keys(DISRUPTION_TYPE_INFO) as DisruptionType[];
const SEVERITIES: Severity[] = ['low', 'moderate', 'high', 'severe'];

export default function SimulatePage() {
  const [type, setType] = useState<DisruptionType>('RAIN_EVENT');
  const [severity, setSeverity] = useState<Severity>('high');
  const [duration, setDuration] = useState(3);
  const [eventStartHour, setEventStartHour] = useState(18);
  const [zoneId, setZoneId] = useState('blr-kora');
  const [selectedShifts, setSelectedShifts] = useState(['morning', 'evening']);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Record<string, unknown> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [claims, setClaims] = useState<Record<string, unknown>[]>([]);

  const zone = ZONES.find((z) => z.id === zoneId);
  const info = DISRUPTION_TYPE_INFO[type];
  const sevConfig = SEVERITY_CONFIG[severity];
  const Icon = iconMap[info.icon] || CloudRain;

  const shifts = SHIFT_WINDOWS.filter((sw) => selectedShifts.includes(sw.id));
  const shiftOverlap = calculateShiftOverlap(eventStartHour, duration, shifts);

  const backendEventType = EVENT_TYPE_MAP[type];
  const isUnsupported = backendEventType === null;

  async function handleTrigger() {
    if (isUnsupported) return;
    setLoading(true);
    setError(null);
    setResult(null);
    setClaims([]);

    try {
      const worker = getWorker();
      const city = zone?.city || worker?.city || 'Bengaluru';

      // Build ISO start_time for today at eventStartHour
      const now = new Date();
      now.setHours(eventStartHour, 0, 0, 0);
      const startTime = now.toISOString().replace('.000Z', '').replace('Z', '');

      const payload = {
        event_type: backendEventType!,
        city,
        zone: zone?.name || 'Koramangala',
        severity,
        start_time: startTime,
        duration_hours: duration,
        source: 'frontend_demo',
        verified: true,
        metadata: { trigger: 'frontend_demo' },
      };

      const res = await simulateEvent(payload);
      saveEvent(res);
      setResult(res);

      // Extract auto-created claims from response
      const autoClaims = (res.claims || res.auto_claims || res.created_claims || []) as Record<string, unknown>[];
      setClaims(autoClaims);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Simulation failed');
    } finally {
      setLoading(false);
    }
  }

  function handleReset() {
    setResult(null);
    setError(null);
    setClaims([]);
    setType('RAIN_EVENT');
    setSeverity('high');
    setDuration(3);
    setEventStartHour(18);
    setZoneId('blr-kora');
    setSelectedShifts(['morning', 'evening']);
  }

  return (
    <>
      <Header />
      <main className="flex-1 max-w-5xl mx-auto px-4 py-6 sm:py-10 w-full">
        <div className="mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-text-primary">Disruption Trigger Simulation</h1>
          <p className="text-[14px] text-text-secondary mt-1">
            Simulate a disruption event to see how the parametric engine calculates eligibility and payout.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Configuration Panel */}
          <div className="lg:col-span-3 space-y-5">
            <Card padding="lg">
              <CardHeader title="Event Configuration" subtitle="Define the disruption parameters" />

              {/* Disruption Type */}
              <div className="mb-5">
                <label className="block text-[13px] font-medium text-text-primary mb-2">Disruption Type</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {DISRUPTION_TYPES.map((dt) => {
                    const dtInfo = DISRUPTION_TYPE_INFO[dt];
                    const DtIcon = iconMap[dtInfo.icon] || CloudRain;
                    const unsupported = EVENT_TYPE_MAP[dt] === null;
                    return (
                      <button
                        key={dt}
                        onClick={() => { setType(dt); setResult(null); }}
                        className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg border text-left text-[13px] transition-colors cursor-pointer ${
                          type === dt
                            ? 'border-primary bg-primary-light'
                            : 'border-border bg-surface hover:border-primary/40'
                        } ${unsupported ? 'opacity-60' : ''}`}
                      >
                        <DtIcon className={`w-4 h-4 flex-shrink-0 ${type === dt ? 'text-primary' : 'text-text-muted'}`} />
                        <div className="flex-1 min-w-0">
                          <span className={`font-medium block ${type === dt ? 'text-primary' : 'text-text-secondary'}`}>
                            {dtInfo.label}
                          </span>
                          {unsupported && (
                            <span className="text-[10px] text-text-muted">Live API not yet available</span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {isUnsupported && (
                <div className="mb-5 px-3 py-2.5 rounded-lg bg-warning-light border border-warning/20 flex items-start gap-2">
                  <Info className="w-4 h-4 text-warning flex-shrink-0 mt-0.5" />
                  <p className="text-[12px] text-warning">
                    <strong>Heat Stress</strong> events are not yet supported in the live simulation API. Select a different event type to run a live simulation.
                  </p>
                </div>
              )}

              {/* Severity */}
              <div className="mb-5">
                <label className="block text-[13px] font-medium text-text-primary mb-2">Severity</label>
                <div className="grid grid-cols-4 gap-2">
                  {SEVERITIES.map((s) => (
                    <button
                      key={s}
                      onClick={() => { setSeverity(s); setResult(null); }}
                      className={`px-3 py-2 rounded-lg border text-[13px] font-medium text-center transition-colors cursor-pointer ${
                        severity === s
                          ? 'border-primary bg-primary-light text-primary'
                          : 'border-border bg-surface text-text-secondary hover:border-primary/40'
                      }`}
                    >
                      {SEVERITY_CONFIG[s].label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Duration & Start */}
              <div className="grid grid-cols-2 gap-4 mb-5">
                <div>
                  <label className="block text-[13px] font-medium text-text-primary mb-1.5">Duration (hours)</label>
                  <input
                    type="range"
                    min={1}
                    max={8}
                    step={0.5}
                    value={duration}
                    onChange={(e) => { setDuration(Number(e.target.value)); setResult(null); }}
                    className="w-full accent-primary"
                  />
                  <p className="text-[13px] text-text-secondary mt-1">{duration} hours</p>
                </div>
                <div>
                  <label className="block text-[13px] font-medium text-text-primary mb-1.5">Event Start Hour</label>
                  <select
                    value={eventStartHour}
                    onChange={(e) => { setEventStartHour(Number(e.target.value)); setResult(null); }}
                    className="w-full px-3 py-2 border border-border rounded-lg text-[13px] text-text-primary bg-surface outline-none focus:border-primary"
                  >
                    {Array.from({ length: 24 }, (_, i) => (
                      <option key={i} value={i}>
                        {i === 0 ? '12 AM' : i < 12 ? `${i} AM` : i === 12 ? '12 PM' : `${i - 12} PM`}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Zone */}
              <div className="mb-5">
                <label className="block text-[13px] font-medium text-text-primary mb-1.5">Zone</label>
                <select
                  value={zoneId}
                  onChange={(e) => { setZoneId(e.target.value); setResult(null); }}
                  className="w-full px-3 py-2 border border-border rounded-lg text-[13px] text-text-primary bg-surface outline-none focus:border-primary"
                >
                  {ZONES.map((z) => (
                    <option key={z.id} value={z.id}>
                      {z.name}, {z.city} ({z.riskLevel} risk)
                    </option>
                  ))}
                </select>
              </div>

              {/* Shift Selection */}
              <div className="mb-5">
                <label className="block text-[13px] font-medium text-text-primary mb-2">Insured Shift Windows</label>
                <div className="space-y-2">
                  {SHIFT_WINDOWS.map((sw) => (
                    <label key={sw.id} className="flex items-center gap-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedShifts.includes(sw.id)}
                        onChange={() => {
                          setSelectedShifts((prev) =>
                            prev.includes(sw.id) ? prev.filter((s) => s !== sw.id) : [...prev, sw.id]
                          );
                          setResult(null);
                        }}
                        className="w-4 h-4 accent-primary rounded"
                      />
                      <span className="text-[13px] text-text-secondary">{sw.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <Button onClick={handleTrigger} fullWidth disabled={loading || isUnsupported}>
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Simulating…
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4" />
                    {isUnsupported ? 'Event Type Not Supported' : 'Trigger Simulation'}
                  </>
                )}
              </Button>
            </Card>
          </div>

          {/* Result Panel */}
          <div className="lg:col-span-2 space-y-5">
            {/* Event Summary */}
            <Card padding="md">
              <CardHeader title="Event Summary" />
              <div className="flex items-center gap-3 mb-4 p-3 rounded-lg bg-background border border-border">
                <Icon className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-[14px] font-semibold text-text-primary">{info.label}</p>
                  <p className="text-[12px] text-text-secondary">{zone?.name}, {zone?.city}</p>
                </div>
                <Badge variant={severity === 'severe' ? 'danger' : severity === 'high' ? 'warning' : 'muted'} className="ml-auto">
                  {sevConfig.label}
                </Badge>
              </div>
              <div className="space-y-2 text-[13px]">
                <div className="flex justify-between">
                  <span className="text-text-secondary">Duration</span>
                  <span className="font-medium text-text-primary">{duration} hours</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Shift Overlap</span>
                  <span className="font-medium text-text-primary">{shiftOverlap} hours</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Backend Event Type</span>
                  <span className="font-medium text-text-primary">{backendEventType || 'N/A'}</span>
                </div>
              </div>
            </Card>

            {/* Error */}
            {error && (
              <Card padding="md" className="ring-1 ring-danger">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-5 h-5 text-danger" />
                  <p className="text-[14px] font-semibold text-danger">Simulation Failed</p>
                </div>
                <p className="text-[13px] text-text-secondary">{error}</p>
              </Card>
            )}

            {/* Result */}
            {result && (
              <Card padding="md" className="ring-1 ring-success">
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle className="w-5 h-5 text-success" />
                  <p className="text-[15px] font-semibold text-text-primary">Event Simulated</p>
                </div>
                <div className="space-y-2 text-[13px] mb-4">
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Event ID</span>
                    <span className="font-medium text-text-primary text-right max-w-[60%] truncate">
                      {(result.event_id || result.id || '—') as string}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Status</span>
                    <span className="font-medium text-text-primary">{(result.status || 'created') as string}</span>
                  </div>
                  {(result.affected_policies_count !== undefined) && (
                    <div className="flex justify-between">
                      <span className="text-text-secondary">Affected Policies</span>
                      <span className="font-medium text-text-primary">{result.affected_policies_count as number}</span>
                    </div>
                  )}
                </div>

                {/* Auto-created claims */}
                {claims.length > 0 && (
                  <div className="border-t border-border pt-3">
                    <p className="text-[12px] font-semibold text-text-primary mb-2">
                      Auto-created Claims ({claims.length})
                    </p>
                    <div className="space-y-2">
                      {claims.map((claim, i) => (
                        <div key={i} className="p-2.5 rounded-lg bg-background border border-border text-[12px]">
                          <div className="flex justify-between">
                            <span className="text-text-muted">Claim ID</span>
                            <span className="font-medium text-text-primary truncate max-w-[60%]">
                              {(claim.claim_id || claim.id || `CLM-${i}`) as string}
                            </span>
                          </div>
                          {claim.estimated_payout !== undefined && (
                            <div className="flex justify-between mt-1">
                              <span className="text-text-muted">Est. Payout</span>
                              <span className="font-semibold text-success">
                                ₹{Number(claim.estimated_payout).toLocaleString('en-IN')}
                              </span>
                            </div>
                          )}
                          {claim.status && (
                            <div className="flex justify-between mt-1">
                              <span className="text-text-muted">Status</span>
                              <span>{claim.status as string}</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </Card>
            )}

            {!result && !error && !loading && (
              <div className="text-center py-10 text-text-muted">
                <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-[13px]">Configure the event and click &quot;Trigger Simulation&quot; to see results</p>
              </div>
            )}

            {(result || error) && (
              <Button variant="outline" fullWidth onClick={handleReset}>
                Reset Simulation
              </Button>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
