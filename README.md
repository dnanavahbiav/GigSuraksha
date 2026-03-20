## Inspiration

India’s quick-commerce and grocery delivery partners keep urban life running, but their income is extremely fragile. A rider working for Zepto, Blinkit, or Instamart does not just lose money when they stop working for an entire day — they lose money when a 2-hour evening rainburst, waterlogging near a dark store, a severe AQI spike, or a sudden zone restriction wipes out their most profitable earning window.

That insight shaped our idea.

Instead of building a generic “weather insurance” concept, we focused on a sharper problem: **how do we protect the exact earning windows that matter most to a q-commerce delivery partner?** These workers usually think in weekly cash flow, weekly incentives, and weekly expenses, so we designed a solution that matches that reality.

This led us to build **GigSuraksha**, an AI-enabled parametric insurance platform that protects **loss of income only** from measurable external disruptions. It does not try to cover health, life, accident, or vehicle repair. It is a narrow, practical safety net for weekly earnings disruption.

---

## What it does

GigSuraksha is a **mobile-first, shift-aware parametric insurance platform** for urban quick-commerce delivery partners.

The worker can:
- onboard quickly with city, work zone, and weekly earnings profile
- declare typical earning windows such as 7–11 AM or 6–10 PM
- receive a dynamically calculated **weekly premium**
- activate weekly income protection
- get automatically covered against measurable external disruptions such as:
 - heavy rain
 - flood / waterlogging
 - extreme heat
 - severe AQI / air pollution
 - dark-store unavailability
 - sudden zone closures / curfews
 - platform outages

The key idea is that we do **not** insure vague monthly income. We insure **pre-declared earning windows in specific operating zones**.

When a disruption overlaps with an insured shift, the system:
1. validates that the weekly policy is active  
2. checks if the rider is mapped to the affected zone / store  
3. detects whether the trigger threshold has been crossed  
4. runs fraud and duplication checks  
5. estimates lost hours and protected hourly income  
6. auto-initiates a claim and simulates payout

This creates a zero-touch claims experience with explainable logic.

---

## How we built it

For Phase 1, we focused on building a strong product foundation instead of rushing into a generic prototype.

First, we narrowed the persona to **q-commerce delivery partners** because their work is hyperlocal, tied to dark stores, highly exposed to short-duration disruptions, and naturally suited to weekly pricing.

Then we designed the platform around five core layers:

### 1. Shift-aware policy design  
Workers insure their likely earning windows instead of broad income ranges. This makes pricing and payout more realistic.

### 2. Weekly pricing engine  
We created a simple and explainable model:

**Weekly Premium = Base Premium + Zone Risk + Shift Exposure + Coverage Factor - Safe Zone Discount**

The quote depends on:
- work zone
- weather and flood exposure
- AQI and heat risk
- time-of-day shift pattern
- selected weekly coverage tier

### 3. Parametric trigger engine  
We defined payout-eligible disruptions using a normalized taxonomy with categories like:
- Weather
- Access
- Platform
- Infrastructure
- Regulatory

We also separated:
- **direct triggers** like heavy rain or zone closure
- **composite triggers** like waterlogging confirmed with traffic/access signals
- **analytics-only signals** like low order demand, which affect pricing but should not trigger payout

### 4. AI + rules architecture  
We intentionally split responsibilities:
- **AI/ML** for risk scoring, pricing recommendations, anomaly detection, and classifying alerts
- **Rules engine** for threshold validation, eligibility checks, payout logic, and final claim decisions

This makes the system both smarter and more explainable.

### 5. Product flow and prototype planning  
We mapped the end-to-end journey:
- onboarding
- shift and zone selection
- weekly quote generation
- policy activation
- disruption detection
- automatic claim initiation
- payout preview
- worker and admin dashboards

---

## Challenges we ran into

One major challenge was resisting the temptation to build something too broad. “Insurance for gig workers” sounds exciting, but the challenge strictly focuses on **loss of income only**, so we had to consciously exclude health, life, accident, and vehicle repair features.

The second challenge was defining what is actually insurable. Not every earnings drop should trigger a payout. For example, low order demand or rider oversupply may affect income, but they are not clean parametric triggers. We had to carefully separate:
- measurable external disruptions
from
- noisy business or market fluctuations

The third challenge was balancing automation with fairness. If triggers are too broad, payouts become inaccurate. If they are too strict, genuine income loss gets missed. That pushed us toward multi-signal trigger logic and shift-overlap validation.

Another challenge was making AI meaningful instead of cosmetic. We did not want to say “AI-powered” without a real role, so we grounded AI in three practical areas: weekly risk scoring, premium personalization, and fraud/anomaly detection.

---

## Accomplishments that we're proud of

We are proud that our solution is not just aligned with the problem statement, but specifically shaped around the operating reality of q-commerce riders.

Our strongest accomplishments in Phase 1 are:
- narrowing the persona to a highly insurable delivery segment
- defining a **shift-aware** income protection model
- designing a **weekly pricing structure** that fits gig-worker cash flow
- creating a normalized disruption taxonomy for automated claims
- separating payout-eligible signals from analytics-only signals
- building an explainable **AI + rules** architecture instead of a black-box approach
- keeping the product tightly focused on **income-loss only**, exactly as required by the challenge

We are also proud that the concept is realistic to demonstrate in later phases using public APIs, simulated disruptions, and sandbox payouts.

---

## What we learned

We learned that the best insurance ideas are not the broadest ones — they are the most measurable ones.

A big lesson for us was that gig-worker protection becomes more practical when it is tied to:
- a specific persona
- a specific earning cycle
- a specific operating zone
- a specific measurable disruption

We also learned that affordability and trust matter as much as technical sophistication. A rider is far more likely to adopt a product that is:
- weekly
- low-friction
- transparent
- automatic
- clearly scoped

Another major learning was that fraud prevention starts with product design, not just claim rejection. By insuring defined shift windows in defined zones, the system becomes easier to price and harder to misuse.

Finally, we learned that AI works best in insurance when it supports decision-making, but does not replace explainable rules where money is involved.

---

## What's next for GigSuraksha

In the next phase, we will turn the concept into a working product by building:

- worker registration and onboarding
- zone and shift capture
- weekly policy creation and management
- dynamic premium calculation
- disruption trigger monitoring through public APIs and mocks
- auto-generated claims based on trigger and shift overlap

In the final phase, we will add:

- advanced fraud detection for suspicious or duplicated claims
- GPS / zone validation
- instant payout simulation using UPI or payment sandbox tools
- worker dashboard showing active coverage, protected earnings, and claim history
- admin dashboard showing trigger frequency, claims trends, anomaly alerts, and predictive risk insights

Longer term, GigSuraksha can evolve into a broader **livelihood resilience layer** for India’s delivery economy, where measurable external shocks no longer translate directly into unprotected income loss.

---
## Adversarial Defense & Anti-Spoofing Strategy



### Why This Is Necessary

A parametric insurance system can be drained if it treats a single GPS point as proof that a worker was genuinely stranded inside a disruption zone.



The Market Crash scenario assumes a sophisticated syndicate using:

- fake GPS / mock-location apps

- coordinated claim timing

- payout handle reuse

- weak account histories

- zone switching into live disruption areas
 

GigSuraksha is designed so that **simple GPS verification is never sufficient**.



Our anti-spoofing principle is:

> **A payout requires confidence in both the disruption event and the worker’s genuine operating presence.**

---

### Threat Model

We assume the platform can be attacked by both individual spoofers and coordinated fraud rings.



#### Likely Attack Patterns

- spoofing location into a red-alert zone

- staying at home while claiming to be stranded in a disruption cluster

- synchronized mass claims immediately after an alert becomes visible

- multiple accounts linked to the same payout path or device

- last-minute zone switching to chase active weather events

- piggybacking on a real event without actually being active in the affected area



---

### Multi-Signal Presence Model

Instead of asking only:

> “Was the rider’s GPS inside the zone?”



GigSuraksha evaluates four confidence layers:



#### 1. Event Confidence

Was there a real disruption?



Signals:

- weather feed confirmation

- AQI feed confirmation

- civic restriction confirmation

- dark-store outage confirmation

- platform outage confirmation


 

#### 2. Zone Affinity Confidence

Does the worker genuinely operate in that zone?


 

Signals:

- insured primary zone

- dark-store mapping

- recurring shift history

- historical quote and renewal pattern

- recent zone-change behavior


 

#### 3. Presence Continuity Confidence

Does available evidence support real presence before and during the event?


 

Signals:

- recent browser geolocation samples

- timestamped session continuity

- pre-event zone consistency

- platform activity near shift window

- contradiction checks between claimed zone and server-side network/IP context


 

#### 4. Coordination Risk

Does the claim resemble a ring pattern?


 

Signals:

- synchronized claim bursts

- many low-history accounts claiming together

- shared payout handles

- repeated browser/device patterns

- repeated network signatures

- sudden cluster-level spikes after alert publication



---

### The Differentiation: Genuine Worker vs Spoofer
 

GigSuraksha will distinguish a genuinely stranded worker from a bad actor using **signal consistency**, not a single location sample.
 

| Signal Family | Genuine Worker | Spoofer / Fraud Ring |

|---|---|---|

| Zone Affinity | Stable operating zone and dark-store relationship | Weak history or last-minute zone switching |

| Pre-Event Behavior | Plausible presence before disruption window | Sudden appearance only when event becomes payable |

| Movement Pattern | Realistic continuity or disruption-based stoppage | Teleport jumps, implausible movement, thin continuity |

| Platform Activity | Online/active around insured shift | No work-linked behavior near event time |

| Network Context | Broadly consistent with claimed zone | IP/network pattern inconsistent or suspicious |

| Identity Linkage | Distinct payout and usage pattern | Shared UPI/device/browser/network graph |

| Claim Timing | Independent timing | Coordinated burst timing across linked accounts |


 

### Fairness Principle

Bad weather can degrade network quality and GPS reliability.  

So GigSuraksha treats:

- **missing data** as uncertainty

- **contradictory data** as risk



This avoids unfairly penalizing honest workers affected by real connectivity issues.



---


 

### Phase 1: Web/PWA-Feasible Anti-Spoofing Signals



Because Phase 1 is a PWA, we only claim signals that are realistically available in a browser-based architecture.


 

#### Available in Phase 1

- browser geolocation with user consent

- timestamped location continuity while the app session is active

- insured zone and shift overlap validation

- server-side public IP enrichment

- ASN / ISP pattern checks

- VPN / proxy / datacenter IP detection via external IP reputation services

- historical zone affinity from onboarding, quote, renewal, and claim history

- session timing analysis to detect last-minute zone switching

- browser/device reuse patterns

- payout handle linkage

- platform-side activity correlation from mock or future order-assignment integrations


 

These signals are enough to build a strong **architectural** anti-spoofing model for Phase 1.



---


 

### Later-Phase Native / Hybrid Signals
 

For production-grade anti-spoofing, later versions of the worker app can add deeper mobile signals through a native Android or hybrid mobile layer.
 

#### Planned Later Signals

- device attestation

- mock-location risk indicators

- rooted / tampered device posture

- emulator detection

- stronger background location continuity

- richer sensor-assisted movement plausibility

- OS-level device integrity checks



These are intentionally **future-phase enhancements**, not overclaimed browser capabilities.
 

---



### How GigSuraksha Will Catch a Coordinated Fraud Ring
 

A fraud ring may defeat a simple GPS check. It is much harder to fake all of the following simultaneously:



- stable historical zone affinity

- realistic pre-event continuity

- genuine platform-side activity

- distinct payout paths

- distinct browser/device usage patterns

- non-synchronized claim timing

- low cluster-level anomaly score


 

Fraud rings usually expose themselves through:

- sudden synchronized claims

- weak-history accounts

- shared payout handles

- repeated browser/device/network patterns

- alert-chasing zone switches

- inconsistent activity relative to the claimed zone



That is the failure mode GigSuraksha is designed to detect.



---



### Claim Routing Logic



GigSuraksha will not use a binary approve/reject model for all suspicious cases.



#### Green Path — Auto Pay

Conditions:

- event confidence high

- zone affinity strong

- no major contradictions

- low coordination risk
 

Action:

- payout is processed automatically



#### Amber Path — Step-Up Verification

Conditions:

- event is verified

- one or two signals are weak or incomplete

- no strong contradiction



Action:

- claim is temporarily held

- worker sees “verification in progress,” not rejection

- passive corroboration is checked first

- trusted workers may receive capped provisional handling in future phases


 

#### Red Path — Quarantine / Manual Review

Conditions:

- strong contradictions

- suspicious linkage graph

- coordinated cluster pattern

- high-risk anomaly score



Action:

- claim is held

- related accounts are investigated as a cohort

- legitimate workers outside the suspicious cluster are not blanket-blocked



---


 

### UX Balance: Fighting Fraud Without Punishing Honest Workers

Anti-spoofing must not destroy trust for genuine delivery workers. GigSuraksha handles that through five principles:



#### 1. Missing Signal ≠ Fraud

Rain and poor networks can break perfect telemetry. A missing signal alone will not cause rejection.


 

#### 2. Passive Verification First

The system will first use:

- event validation

- zone history

- platform activity

- payout-path checks

- session continuity

before asking the worker for anything extra.


 

#### 3. Step-Up Review Instead of Instant Rejection

Borderline claims go to a review lane with clear status messaging.



#### 4. Trust-Aware Treatment

Workers with stable history and clean prior behavior face fewer false positives.



#### 5. Cluster Isolation, Not Blanket Blocking

If a fraud ring is suspected in one cluster, the suspicious cohort is isolated. Genuine workers in the same city should still receive legitimate payouts.

---
