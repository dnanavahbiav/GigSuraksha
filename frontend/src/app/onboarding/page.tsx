'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Card from '@/components/Card';
import Button from '@/components/Button';
import Badge from '@/components/Badge';
import { CITIES, PLATFORMS, SHIFT_WINDOWS, ZONES, SHIFT_TYPE_MAP } from '@/lib/constants';
import type { OnboardingData, City } from '@/lib/types';
import { registerWorker } from '@/lib/api';
import { saveWorker } from '@/lib/store';
import { User, Briefcase, MapPin, IndianRupee, CheckCircle, ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';

const STEPS = [
  { id: 0, label: 'Personal', icon: User },
  { id: 1, label: 'Work Profile', icon: Briefcase },
  { id: 2, label: 'Zone & Shifts', icon: MapPin },
  { id: 3, label: 'Earnings', icon: IndianRupee },
  { id: 4, label: 'Review', icon: CheckCircle },
];

const initial: OnboardingData = {
  name: '',
  mobile: '',
  city: '',
  platform: '',
  zoneId: '',
  shifts: [],
  weeklyEarnings: 0,
  weeklyActiveHours: 0,
  upiId: '',
};

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [data, setData] = useState<OnboardingData>(initial);
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cityZones = ZONES.filter((z) => z.city === data.city);
  const selectedZone = ZONES.find((z) => z.id === data.zoneId);

  function update(partial: Partial<OnboardingData>) {
    setData((prev) => ({ ...prev, ...partial }));
  }

  function toggleShift(shiftId: string) {
    setData((prev) => ({
      ...prev,
      shifts: prev.shifts.includes(shiftId)
        ? prev.shifts.filter((s) => s !== shiftId)
        : [...prev.shifts, shiftId],
    }));
  }

  function canProceed(): boolean {
    switch (step) {
      case 0:
        return data.name.length >= 2 && data.mobile.length >= 10;
      case 1:
        return !!data.city && !!data.platform;
      case 2:
        return !!data.zoneId && data.shifts.length > 0;
      case 3:
        return data.weeklyEarnings > 0 && data.weeklyActiveHours > 0 && data.upiId.length > 0;
      default:
        return true;
    }
  }

  async function handleSubmit() {
    setLoading(true);
    setError(null);
    try {
      // Map first selected shift to backend canonical value
      const primaryShift = data.shifts[0] || 'morning';
      const shiftType = SHIFT_TYPE_MAP[primaryShift] || 'morning_rush';

      const payload = {
        name: data.name,
        phone: data.mobile,
        city: data.city,
        platform: data.platform,
        zone: selectedZone?.name || data.zoneId,
        shift_type: shiftType,
        weekly_earnings: data.weeklyEarnings,
        weekly_active_hours: data.weeklyActiveHours,
        upi_id: data.upiId,
      };

      const result = await registerWorker(payload);

      // Save worker with worker_id to localStorage
      saveWorker({
        worker_id: (result.worker_id as string) || '',
        name: data.name,
        phone: data.mobile,
        city: data.city,
        platform: data.platform,
        zone: selectedZone?.name || data.zoneId,
        shift_type: shiftType,
        weekly_earnings: data.weeklyEarnings,
        weekly_active_hours: data.weeklyActiveHours,
        upi_id: data.upiId,
        ...result,
      });

      router.push('/quote');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Header />
      <main className="flex-1 max-w-2xl mx-auto px-4 py-6 sm:py-10 w-full">
        {/* Step Indicator */}
        <div className="flex items-center gap-1 mb-8 overflow-x-auto pb-2">
          {STEPS.map((s) => (
            <div key={s.id} className="flex items-center gap-1 flex-shrink-0">
              <button
                onClick={() => s.id < step && setStep(s.id)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[12px] font-medium transition-colors ${
                  s.id === step
                    ? 'bg-primary text-white'
                    : s.id < step
                    ? 'bg-primary-light text-primary cursor-pointer'
                    : 'bg-border-light text-text-muted'
                }`}
              >
                <s.icon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{s.label}</span>
              </button>
              {s.id < STEPS.length - 1 && (
                <div className={`w-4 h-px ${s.id < step ? 'bg-primary' : 'bg-border'}`} />
              )}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <Card padding="lg">
          {step === 0 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-[18px] font-semibold text-text-primary">Personal Information</h2>
                <p className="text-[13px] text-text-secondary mt-1">
                  We need basic details to set up your protection profile.
                </p>
              </div>
              <FieldGroup label="Full Name">
                <input
                  type="text"
                  value={data.name}
                  onChange={(e) => update({ name: e.target.value })}
                  placeholder="Enter your full name"
                  className="form-input"
                />
              </FieldGroup>
              <FieldGroup label="Mobile Number">
                <div className="flex gap-2">
                  <input
                    type="tel"
                    value={data.mobile}
                    onChange={(e) => update({ mobile: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="form-input flex-1"
                  />
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setOtpSent(true)}
                    disabled={data.mobile.length < 10}
                  >
                    {otpSent ? 'OTP Sent' : 'Send OTP'}
                  </Button>
                </div>
                {otpSent && (
                  <p className="text-[12px] text-success mt-1">
                    Demo: OTP verification simulated successfully
                  </p>
                )}
              </FieldGroup>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-[18px] font-semibold text-text-primary">Work Profile</h2>
                <p className="text-[13px] text-text-secondary mt-1">
                  Tell us which city and platform you operate on.
                </p>
              </div>
              <FieldGroup label="City">
                <select
                  value={data.city}
                  onChange={(e) => update({ city: e.target.value as City, zoneId: '' })}
                  className="form-input"
                >
                  <option value="">Select city</option>
                  {CITIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </FieldGroup>
              <FieldGroup label="Platform">
                <div className="grid grid-cols-2 gap-2">
                  {PLATFORMS.map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => update({ platform: p })}
                      className={`px-3 py-2.5 rounded-lg border text-[13px] font-medium transition-colors cursor-pointer ${
                        data.platform === p
                          ? 'border-primary bg-primary-light text-primary'
                          : 'border-border bg-surface text-text-secondary hover:border-primary/40'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </FieldGroup>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-[18px] font-semibold text-text-primary">Zone & Shift Selection</h2>
                <p className="text-[13px] text-text-secondary mt-1">
                  Select your operating zone and the shift windows you typically work.
                </p>
              </div>
              <FieldGroup label="Operating Zone">
                {cityZones.length === 0 ? (
                  <p className="text-[13px] text-text-muted">Select a city first</p>
                ) : (
                  <div className="space-y-2">
                    {cityZones.map((z) => (
                      <button
                        key={z.id}
                        type="button"
                        onClick={() => update({ zoneId: z.id })}
                        className={`w-full text-left px-3 py-2.5 rounded-lg border text-[13px] transition-colors cursor-pointer ${
                          data.zoneId === z.id
                            ? 'border-primary bg-primary-light'
                            : 'border-border bg-surface hover:border-primary/40'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-text-primary">{z.name}</span>
                          <Badge
                            variant={
                              z.riskLevel === 'high'
                                ? 'danger'
                                : z.riskLevel === 'medium'
                                ? 'warning'
                                : 'success'
                            }
                          >
                            {z.riskLevel} risk
                          </Badge>
                        </div>
                        <span className="text-[12px] text-text-muted">
                          {z.darkStores.length} dark stores
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </FieldGroup>
              <FieldGroup label="Shift Windows">
                <div className="space-y-2">
                  {SHIFT_WINDOWS.map((sw) => (
                    <button
                      key={sw.id}
                      type="button"
                      onClick={() => toggleShift(sw.id)}
                      className={`w-full text-left px-3 py-2.5 rounded-lg border text-[13px] transition-colors cursor-pointer ${
                        data.shifts.includes(sw.id)
                          ? 'border-primary bg-primary-light text-primary font-medium'
                          : 'border-border bg-surface text-text-secondary hover:border-primary/40'
                      }`}
                    >
                      {sw.label}
                    </button>
                  ))}
                </div>
              </FieldGroup>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-[18px] font-semibold text-text-primary">Earnings & Payout</h2>
                <p className="text-[13px] text-text-secondary mt-1">
                  Enter your average weekly earnings and payout details.
                </p>
              </div>
              <FieldGroup label="Average Weekly Earnings (₹)">
                <input
                  type="number"
                  value={data.weeklyEarnings || ''}
                  onChange={(e) => update({ weeklyEarnings: Number(e.target.value) })}
                  placeholder="e.g. 6000"
                  className="form-input"
                />
                <p className="text-[12px] text-text-muted mt-1">
                  Your total earnings across all shifts in a typical week
                </p>
              </FieldGroup>
              <FieldGroup label="Weekly Active Hours">
                <input
                  type="number"
                  value={data.weeklyActiveHours || ''}
                  onChange={(e) => update({ weeklyActiveHours: Number(e.target.value) })}
                  placeholder="e.g. 40"
                  className="form-input"
                />
              </FieldGroup>
              <FieldGroup label="UPI ID">
                <input
                  type="text"
                  value={data.upiId}
                  onChange={(e) => update({ upiId: e.target.value })}
                  placeholder="yourname@upi"
                  className="form-input"
                />
                <p className="text-[12px] text-text-muted mt-1">
                  Payouts will be sent to this UPI handle
                </p>
              </FieldGroup>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-[18px] font-semibold text-text-primary">Review Your Profile</h2>
                <p className="text-[13px] text-text-secondary mt-1">
                  Confirm your details before proceeding to your risk assessment and quote.
                </p>
              </div>
              <div className="bg-background border border-border rounded-lg divide-y divide-border">
                <ReviewRow label="Name" value={data.name} />
                <ReviewRow label="Mobile" value={data.mobile} />
                <ReviewRow label="City" value={data.city} />
                <ReviewRow label="Platform" value={data.platform} />
                <ReviewRow label="Zone" value={selectedZone?.name || '-'} />
                <ReviewRow
                  label="Shifts"
                  value={data.shifts
                    .map((s) => SHIFT_WINDOWS.find((sw) => sw.id === s)?.label || s)
                    .join(', ')}
                />
                <ReviewRow label="Weekly Earnings" value={`₹${data.weeklyEarnings.toLocaleString('en-IN')}`} />
                <ReviewRow label="Weekly Hours" value={`${data.weeklyActiveHours} hrs`} />
                <ReviewRow label="UPI ID" value={data.upiId} />
              </div>
              {error && (
                <div className="px-3 py-2.5 rounded-lg bg-danger-light border border-danger/20">
                  <p className="text-[13px] text-danger">{error}</p>
                </div>
              )}
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 pt-5 border-t border-border">
            {step > 0 ? (
              <Button variant="ghost" onClick={() => setStep(step - 1)} disabled={loading}>
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
            ) : (
              <div />
            )}
            {step < 4 ? (
              <Button onClick={() => setStep(step + 1)} disabled={!canProceed()}>
                Continue
                <ArrowRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button onClick={handleSubmit} disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Registering...
                  </>
                ) : (
                  <>
                    View My Quote
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </Button>
            )}
          </div>
        </Card>

        <style jsx>{`
          :global(.form-input) {
            width: 100%;
            padding: 0.5rem 0.75rem;
            border: 1px solid #E2E8F0;
            border-radius: 0.5rem;
            font-size: 14px;
            color: #0F172A;
            background: #FFFFFF;
            transition: border-color 0.15s;
            outline: none;
          }
          :global(.form-input:focus) {
            border-color: #2563EB;
            box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.1);
          }
          :global(.form-input::placeholder) {
            color: #94A3B8;
          }
        `}</style>
      </main>
    </>
  );
}

function FieldGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-[13px] font-medium text-text-primary mb-1.5">{label}</label>
      {children}
    </div>
  );
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="px-4 py-3 flex justify-between items-center">
      <span className="text-[13px] text-text-secondary">{label}</span>
      <span className="text-[13px] font-medium text-text-primary text-right max-w-[60%]">{value}</span>
    </div>
  );
}
