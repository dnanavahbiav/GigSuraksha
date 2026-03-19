# GigSuraksha

**AI-Enabled Parametric Income Protection for Quick-Commerce Delivery Partners**

_Guidewire DEVTrails 2026 — Phase 1 Submission_

---

## Problem Statement

India's quick-commerce delivery partners (Blinkit, Zepto, Instamart, BigBasket Now) earn within narrow time windows in hyperlocal zones around dark stores. When external disruptions — heavy rain, waterlogging, extreme heat, severe air pollution, zone closures, or platform outages — reduce their working hours, they lose income with no safety net.

A 3-hour rain event during the evening rush can cost a rider ₹400–₹600 in lost earnings, roughly 8–10% of their weekly income. These disruptions are frequent, measurable, and completely outside the rider's control.

Traditional insurance products (health, accident, vehicle) do not address this. **GigSuraksha** fills this gap with parametric income protection — covering **loss of income only**, triggered automatically by verified external events.

---

## Target Persona

**Primary**: Urban quick-commerce delivery riders operating in micro-zones around dark stores.

| Attribute | Value |
|---|---|
| Name | Ravi Kumar |
| City | Bengaluru |
| Platform | Blinkit |
| Work Pattern | 7–11 AM and 6–10 PM |
| Weekly Earnings | ₹5,500–₹6,500 |
| Problem | Loses earnings when rain, flooding, AQI spikes, or platform outages affect his shifts |

**Secondary**: Insurer/admin operators who monitor active policies, disruption triggers, claims, anomaly flags, and zone risk distribution.

---

## Why Quick-Commerce Riders

- **Hyperlocal dependency**: Earnings are tied to a specific dark store cluster and zone
- **Shift-sensitive income**: Disruptions during peak hours (evening rush) have disproportionate impact
- **High frequency of small disruptions**: 2–4 hour events are common and measurable
- **Structured data availability**: Weather APIs, AQI monitors, platform status feeds enable parametric triggers
- **Underserved segment**: No existing product protects gig workers against income loss from external disruptions

---

## What GigSuraksha Does

GigSuraksha is a **mobile-first, shift-aware parametric income protection platform**.

We do not insure vague monthly income. We insure **pre-declared earning windows** in **specific operating zones** on a **weekly protection plan**.

**How it works:**

1. **Declare your earning window** — Register your city, zone, platform, and the shift windows where you earn
2. **Get your weekly quote** — Our risk engine scores your zone and shifts. You see the exact premium breakdown
3. **Automatic payout on disruption** — When a verified disruption hits your zone during your shift, payout is calculated automatically

---

## Why Mobile-First PWA

- Delivery partners are smartphone-first users
- Progressive Web App is faster to build and deploy during a hackathon
- No app store dependency or approval delays
- Easier demo and judging experience
- Still provides a native mobile product feel

---

## Weekly Premium Model

The premium is calculated weekly with full transparency:

```
Weekly Premium = Base Premium
               + Zone Risk Loading
               + Shift Exposure Loading
               + Coverage Factor
               - Safe Zone Discount
```

**Example calculation:**

| Component | Amount |
|---|---|
| Base Premium | ₹29 |
| Zone Risk Loading (Medium) | ₹8 |
| Shift Exposure Loading (Morning + Evening) | ₹8 |
| Coverage Factor (Standard, ₹6K earnings) | ₹7 |
| Safe Zone Discount | -₹3 |
| **Final Weekly Premium** | **₹49** |

**Coverage tiers:**

| Tier | Coverage | Max Weekly Payout |
|---|---|---|
| Basic | 50% | ₹2,000 |
| Standard | 70% | ₹3,500 |
| Comprehensive | 90% | ₹5,000 |

---

## Payout Logic

Claims are calculated using a deterministic formula — never by an AI model:

```
Payout = min(
  ProtectedHourlyIncome × AffectedHours × SeverityMultiplier,
  WeeklyCapRemaining
)
```

**Severity multipliers:**

| Severity | Multiplier |
|---|---|
| Low | 0.4x |
| Moderate | 0.65x |
| High | 0.85x |
| Severe | 1.0x |

The system verifies:
- Zone match between event and policy
- Shift overlap between event timing and insured windows
- No duplicate claims for the same event
- Event validation against independent data source
- ML anomaly score below threshold

---

## Disruption Taxonomy

The platform uses a normalized disruption classification system:

### Payout Triggers (Phase 1)

| Event Type | Category | Data Source |
|---|---|---|
| Heavy Rainfall (>64mm/hr) | WEATHER | IMD Weather Stations |
| Waterlogging | WEATHER | BMC Flood Monitoring + Satellite |
| Extreme Heat (>42°C) | WEATHER | IMD Heat Wave Alerts |
| Severe AQI (>400) | WEATHER | CPCB Real-Time Monitoring |
| Zone Access Restriction | ACCESS | Municipal/Police Alerts |
| Dark Store Unavailable | INFRASTRUCTURE | Platform APIs |
| Platform Outage | PLATFORM | Platform Status + DownDetector |

### Analytics-Only (Not Payout Triggers)

- Low order demand → affects risk scoring, not payouts
- Rider oversupply → does not trigger claims
- Incentive changes → does not trigger claims

---

## AI/ML Integration Strategy

AI is used for assistance, not for final decisions.

### AI Handles
- **Weekly risk scoring** per zone based on historical and forecast data
- **Disruption event classification** from structured and unstructured alerts
- **Anomaly and fraud signal detection** (pattern-based)
- **Next-week exposure forecasting** for reserve allocation

### Rules Engine Handles
- **Trigger validation** and eligibility determination
- **Payout calculation** using the deterministic formula
- **Duplicate claim detection**
- **Zone and shift overlap verification**

> The LLM is never the final payout decider. This separation is by design.

---

## Fraud Detection Strategy

Every claim passes through automated validation before payout:

1. **Zone Match** — Rider's registered zone matches the event zone
2. **Shift Overlap** — Event timing overlaps with insured shift windows
3. **Duplicate Check** — No prior claim for the same event and period
4. **Event Validation** — Cross-verified against independent data sources (IMD, CPCB, platform APIs)
5. **Anomaly Score** — ML-driven anomaly score must be below threshold (0.60)

Suspicious patterns (clustered claims, earnings mismatches, location anomalies) are flagged for manual review.

---

## Phase 1 Scope

This prototype includes:

- Landing page with product positioning
- Multi-step worker onboarding flow
- Risk assessment and personalized weekly quote
- Policy summary with coverage details
- Interactive disruption trigger simulation
- Automated claim preview with validation checks
- Worker dashboard with active policy and claim history
- Admin dashboard with KPIs, charts, anomaly alerts, and forecasts

**Not included in Phase 1:**
- Real authentication or OTP verification
- Production payment gateway
- Real-time weather API integration
- Production database
- Push notifications

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Charts | Recharts |
| Icons | Lucide React |
| Font | Geist (Sans + Mono) |
| Data | Local mock data (TypeScript constants) |

---

## Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout (font, metadata, PWA)
│   ├── globals.css         # Design tokens, Tailwind config
│   ├── page.tsx            # Landing page
│   ├── onboarding/page.tsx # Multi-step onboarding flow
│   ├── quote/page.tsx      # Risk assessment & weekly quote
│   ├── policy/page.tsx     # Policy summary
│   ├── simulate/page.tsx   # Disruption trigger simulation
│   ├── claim/page.tsx      # Claim preview & validation
│   ├── dashboard/page.tsx  # Worker dashboard
│   └── admin/page.tsx      # Admin dashboard
├── components/
│   ├── Header.tsx          # Responsive nav header
│   ├── Card.tsx            # Card container + header
│   ├── StatCard.tsx        # KPI metric card
│   ├── Button.tsx          # Styled button variants
│   └── Badge.tsx           # Status badges
└── lib/
    ├── types.ts            # TypeScript interfaces
    ├── constants.ts        # Zones, platforms, disruption taxonomy
    ├── calculations.ts     # Premium, payout, risk scoring logic
    └── mock-data.ts        # Sample data for all screens
```

---

## Running Locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Future Roadmap

### Phase 2 — Integration & Intelligence
- Real-time weather and AQI API integration (IMD, OpenWeather, CPCB)
- Platform status monitoring (Blinkit, Zepto API hooks)
- GPS-based zone verification
- Production database (PostgreSQL) with Prisma ORM
- User authentication with OTP (Firebase Auth)
- UPI payout integration
- Guidewire ClaimCenter / PolicyCenter API integration
- ML model training for risk scoring and anomaly detection

### Phase 3 — Scale & Operations
- Multi-city rollout with dynamic zone management
- Real-time claim processing pipeline
- Rider mobile app (React Native or Flutter)
- Insurer portal with underwriting controls
- Regulatory compliance layer
- Historical analytics and actuarial reporting
- Embedded distribution via platform partnerships

---

## Assumptions & Mock Data

- **Ravi Kumar** is used as the primary demo persona
- Zone risk levels are pre-assigned based on historical patterns
- Weather risk scores are simulated per city
- Premium calculation uses the documented formula with example loadings
- All claim and disruption data is static mock data representing realistic scenarios
- Admin dashboard stats represent a sample week across 6 cities
- Anomaly alerts are pre-generated examples of realistic fraud signals
- Forecast insights are simulated AI predictions for the next week

---

## Team(loopify)

Built for **Guidewire DEVTrails 2026** — Phase 1 Ideation & Foundation.

---

_GigSuraksha: Protect weekly earnings from measurable external disruptions._
