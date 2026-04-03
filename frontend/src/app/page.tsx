import Link from 'next/link';
import Header from '@/components/Header';
import {
  Shield,
  CloudRain,
  Waves,
  Thermometer,
  Wind,
  WifiOff,
  Store,
  ShieldCheck,
  ArrowRight,
  Clock,
  MapPin,
  IndianRupee,
  Cpu,
  Scale,
  CalendarCheck,
} from 'lucide-react';

const triggers = [
  { icon: CloudRain, label: 'Heavy Rainfall', desc: 'IMD-verified rainfall exceeding 64mm/hr' },
  { icon: Waves, label: 'Waterlogging', desc: 'Road inundation blocking delivery routes' },
  { icon: Thermometer, label: 'Extreme Heat', desc: 'Temperature crossing 42°C threshold' },
  { icon: Wind, label: 'Severe AQI', desc: 'Air quality index exceeding 400' },
  { icon: WifiOff, label: 'Platform Outage', desc: 'App-wide service disruption' },
  { icon: Store, label: 'Dark Store Down', desc: 'Infrastructure closure or forced shutdown' },
];

const steps = [
  {
    step: '01',
    title: 'Declare your earning window',
    desc: 'Register your city, zone, platform, and the shift windows where you earn.',
    icon: Clock,
  },
  {
    step: '02',
    title: 'Get your weekly quote',
    desc: 'Our risk engine scores your zone and shifts. You see the exact premium breakdown.',
    icon: IndianRupee,
  },
  {
    step: '03',
    title: 'Automatic claim on disruption',
    desc: 'When a verified disruption hits your zone during your shift, payout is calculated automatically.',
    icon: ShieldCheck,
  },
];

export default function LandingPage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        {/* ── Hero ──────────────────────────────── */}
        <section className="bg-surface border-b border-border">
          <div className="max-w-6xl mx-auto px-4 py-16 sm:py-24">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2 mb-5">
                <Shield className="w-6 h-6 text-primary" />
                <span className="text-[13px] font-semibold text-primary uppercase tracking-wider">
                  GigSuraksha
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-bold text-text-primary leading-tight tracking-tight">
                Income protection for{' '}
                <span className="text-primary">quick-commerce</span> delivery
                partners
              </h1>
              <p className="mt-5 text-[16px] sm:text-[17px] text-text-secondary leading-relaxed max-w-xl">
                When heavy rain, extreme heat, or platform outages reduce your working
                hours, GigSuraksha protects your weekly earnings. Weekly plans starting
                at ₹29.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <Link
                  href="/onboarding"
                  className="inline-flex items-center justify-center gap-2 bg-primary text-white px-5 py-2.5 rounded-lg text-[15px] font-medium hover:bg-primary-dark transition-colors shadow-sm"
                >
                  Get Protected
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/simulate"
                  className="inline-flex items-center justify-center gap-2 bg-surface border border-border text-text-primary px-5 py-2.5 rounded-lg text-[15px] font-medium hover:bg-border-light transition-colors"
                >
                  Try Simulation
                </Link>
              </div>
              <div className="mt-8 flex items-center gap-6 text-[13px] text-text-muted">
                <span className="flex items-center gap-1.5">
                  <CalendarCheck className="w-4 h-4" /> Weekly plans
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4" /> Zone-specific
                </span>
                <span className="flex items-center gap-1.5">
                  <Cpu className="w-4 h-4" /> AI-assisted
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ── Problem ──────────────────────────── */}
        <section className="py-16 sm:py-20">
          <div className="max-w-6xl mx-auto px-4">
            <div className="max-w-2xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-text-primary tracking-tight">
                The problem
              </h2>
              <p className="mt-4 text-[15px] text-text-secondary leading-relaxed">
                Quick-commerce delivery partners earn within narrow time windows in
                hyperlocal zones. A 3-hour rain event during the evening rush can cost a
                rider ₹400–₹600 in lost earnings — roughly 8–10% of their weekly
                income. These disruptions are frequent, measurable, and completely
                outside the rider&apos;s control.
              </p>
              <p className="mt-3 text-[15px] text-text-secondary leading-relaxed">
                Traditional insurance does not address this. Health and accident
                products exist, but no product protects the income that delivery
                partners lose when external conditions prevent them from working their
                declared shifts.
              </p>
            </div>
          </div>
        </section>

        {/* ── How It Works ─────────────────────── */}
        <section className="py-16 sm:py-20 bg-surface border-y border-border">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-text-primary tracking-tight">
              How it works
            </h2>
            <p className="mt-3 text-[15px] text-text-secondary max-w-xl">
              Three steps from registration to automatic payout. No paperwork, no
              manual claim filing.
            </p>
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-6">
              {steps.map((s) => (
                <div
                  key={s.step}
                  className="bg-background border border-border rounded-lg p-5"
                >
                  <div className="w-9 h-9 rounded-lg bg-primary-light flex items-center justify-center mb-4">
                    <s.icon className="w-4.5 h-4.5 text-primary" />
                  </div>
                  <p className="text-[11px] font-bold text-text-muted uppercase tracking-wider mb-1">
                    Step {s.step}
                  </p>
                  <h3 className="text-[15px] font-semibold text-text-primary">
                    {s.title}
                  </h3>
                  <p className="mt-2 text-[13px] text-text-secondary leading-relaxed">
                    {s.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Weekly Pricing ───────────────────── */}
        <section className="py-16 sm:py-20">
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-text-primary tracking-tight">
                  Transparent weekly pricing
                </h2>
                <p className="mt-4 text-[15px] text-text-secondary leading-relaxed">
                  Your premium is calculated based on your zone risk, shift timing, and
                  coverage level. Every component is visible — no hidden fees.
                </p>
                <div className="mt-6 space-y-3">
                  <PriceRow label="Base Premium" value="₹29" />
                  <PriceRow label="Zone Risk Loading" value="₹8" sub="Medium-risk zone" />
                  <PriceRow label="Shift Exposure Loading" value="₹8" sub="Morning + Evening" />
                  <PriceRow label="Coverage Factor" value="₹7" sub="Standard tier" />
                  <PriceRow label="Safe Zone Discount" value="-₹3" sub="Applicable credit" isDiscount />
                  <div className="border-t border-border pt-3 flex justify-between items-baseline">
                    <span className="text-[14px] font-semibold text-text-primary">
                      Weekly Premium
                    </span>
                    <span className="text-[20px] font-bold text-primary">₹49/week</span>
                  </div>
                </div>
              </div>
              <div className="bg-surface border border-border rounded-lg p-5 sm:p-6">
                <h3 className="text-[14px] font-semibold text-text-primary mb-1">
                  Payout formula
                </h3>
                <p className="text-[13px] text-text-secondary mb-4">
                  Claims are calculated automatically using verified event data.
                </p>
                <div className="bg-background border border-border rounded-lg p-4 font-mono text-[13px] text-text-primary leading-relaxed">
                  <p className="text-text-muted text-[11px] mb-2">// Payout calculation</p>
                  <p>
                    Payout = min(
                  </p>
                  <p className="pl-4">
                    HourlyIncome × AffectedHours × SeverityMultiplier,
                  </p>
                  <p className="pl-4">WeeklyCapRemaining</p>
                  <p>)</p>
                </div>
                <div className="mt-4 space-y-2 text-[13px]">
                  <div className="flex justify-between text-text-secondary">
                    <span>Protected hourly income</span>
                    <span className="font-medium text-text-primary">₹150/hr</span>
                  </div>
                  <div className="flex justify-between text-text-secondary">
                    <span>Severity multiplier range</span>
                    <span className="font-medium text-text-primary">0.4x – 1.0x</span>
                  </div>
                  <div className="flex justify-between text-text-secondary">
                    <span>Max weekly payout (Standard)</span>
                    <span className="font-medium text-text-primary">₹3,500</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Disruption Triggers ──────────────── */}
        <section className="py-16 sm:py-20 bg-surface border-y border-border">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-text-primary tracking-tight">
              What triggers a payout
            </h2>
            <p className="mt-3 text-[15px] text-text-secondary max-w-xl">
              Disruptions are validated against independent data sources. Only
              verified, measurable events that overlap with your insured shift
              and zone trigger a payout.
            </p>
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {triggers.map((t) => (
                <div
                  key={t.label}
                  className="bg-background border border-border rounded-lg p-4 flex items-start gap-3"
                >
                  <div className="w-8 h-8 rounded-lg bg-primary-light flex items-center justify-center flex-shrink-0">
                    <t.icon className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-[14px] font-medium text-text-primary">
                      {t.label}
                    </p>
                    <p className="text-[12px] text-text-secondary mt-0.5">
                      {t.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── AI + Rules Engine ────────────────── */}
        <section className="py-16 sm:py-20">
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-text-primary tracking-tight">
                  AI-assisted, rules-governed
                </h2>
                <p className="mt-4 text-[15px] text-text-secondary leading-relaxed">
                  Machine learning models handle risk scoring, disruption classification,
                  and anomaly detection. But payout decisions are always made by a
                  deterministic rules engine — never by an LLM.
                </p>
                <div className="mt-6 space-y-4">
                  <InfoRow
                    icon={Cpu}
                    title="AI handles"
                    items={[
                      'Weekly risk scoring per zone',
                      'Disruption event classification',
                      'Anomaly and fraud signal detection',
                      'Next-week exposure forecasting',
                    ]}
                  />
                  <InfoRow
                    icon={Scale}
                    title="Rules engine handles"
                    items={[
                      'Trigger validation and eligibility',
                      'Payout calculation',
                      'Duplicate claim detection',
                      'Zone and shift overlap verification',
                    ]}
                  />
                </div>
              </div>
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-text-primary tracking-tight">
                  Fraud and validation
                </h2>
                <p className="mt-4 text-[15px] text-text-secondary leading-relaxed">
                  Every claim is validated through multiple automated checks before
                  payout is approved. Suspicious patterns are flagged for review.
                </p>
                <div className="mt-6 bg-surface border border-border rounded-lg divide-y divide-border">
                  <CheckRow label="Zone Match" desc="Rider zone matches event zone" />
                  <CheckRow label="Shift Overlap" desc="Event overlaps with insured shift window" />
                  <CheckRow label="Duplicate Check" desc="No prior claim for same event and period" />
                  <CheckRow label="Event Validation" desc="Cross-verified against independent data source" />
                  <CheckRow label="Anomaly Score" desc="ML-driven anomaly score is below threshold" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── CTA ──────────────────────────────── */}
        <section className="py-16 sm:py-20 bg-surface border-t border-border">
          <div className="max-w-6xl mx-auto px-4 text-center">
            <Shield className="w-8 h-8 text-primary mx-auto mb-4" />
            <h2 className="text-2xl sm:text-3xl font-bold text-text-primary tracking-tight">
              Start protecting your weekly income
            </h2>
            <p className="mt-3 text-[15px] text-text-secondary max-w-md mx-auto">
              Set up your profile in 2 minutes. See your personalized risk score and
              weekly premium instantly.
            </p>
            <div className="mt-8">
              <Link
                href="/onboarding"
                className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg text-[15px] font-medium hover:bg-primary-dark transition-colors shadow-sm"
              >
                Get Started
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* ── Footer ───────────────────────────── */}
        <footer className="border-t border-border py-8">
          <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-[13px] text-text-muted">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              <span>GigSuraksha — Phase 2</span>
            </div>
            <div>Guidewire DEVTrails 2026 Submission</div>
          </div>
        </footer>
      </main>
    </>
  );
}

// ─── Sub-components ──────────────────────────────────────────

function PriceRow({
  label,
  value,
  sub,
  isDiscount,
}: {
  label: string;
  value: string;
  sub?: string;
  isDiscount?: boolean;
}) {
  return (
    <div className="flex justify-between items-baseline">
      <div>
        <span className="text-[14px] text-text-primary">{label}</span>
        {sub && (
          <span className="text-[12px] text-text-muted ml-2">{sub}</span>
        )}
      </div>
      <span
        className={`text-[14px] font-medium ${
          isDiscount ? 'text-success' : 'text-text-primary'
        }`}
      >
        {value}
      </span>
    </div>
  );
}

function CheckRow({ label, desc }: { label: string; desc: string }) {
  return (
    <div className="px-4 py-3 flex items-start gap-3">
      <ShieldCheck className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
      <div>
        <p className="text-[13px] font-medium text-text-primary">{label}</p>
        <p className="text-[12px] text-text-secondary">{desc}</p>
      </div>
    </div>
  );
}

function InfoRow({
  icon: Icon,
  title,
  items,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  items: string[];
}) {
  return (
    <div className="bg-surface border border-border rounded-lg p-4">
      <div className="flex items-center gap-2 mb-2">
        <Icon className="w-4 h-4 text-primary" />
        <p className="text-[13px] font-semibold text-text-primary">{title}</p>
      </div>
      <ul className="space-y-1">
        {items.map((item) => (
          <li key={item} className="text-[13px] text-text-secondary flex items-center gap-2">
            <span className="w-1 h-1 rounded-full bg-text-muted flex-shrink-0" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
