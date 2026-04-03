// ─── API Client ──────────────────────────────────────────────
// Centralised fetch wrapper for the GigSuraksha backend.
// Base URL is read from NEXT_PUBLIC_API_BASE_URL with a safe default.

const BASE_URL =
  (typeof window !== 'undefined'
    ? process.env.NEXT_PUBLIC_API_BASE_URL
    : process.env.NEXT_PUBLIC_API_BASE_URL) || 'https://gigsuraksha-backend.fly.dev';

// ─── Generic helpers ─────────────────────────────────────────

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(options?.headers as Record<string, string>) },
    ...options,
  });

  if (!res.ok) {
    let detail = res.statusText;
    try {
      const body = await res.json();
      detail = body.detail || body.message || JSON.stringify(body);
    } catch {
      // ignore JSON parse errors
    }
    throw new Error(`API ${res.status}: ${detail}`);
  }

  return res.json() as Promise<T>;
}

function get<T>(path: string) {
  return request<T>(path, { method: 'GET' });
}

function post<T>(path: string, body: unknown) {
  return request<T>(path, { method: 'POST', body: JSON.stringify(body) });
}

// ─── Health ──────────────────────────────────────────────────

export function checkHealth() {
  return get<{ status: string }>('/health');
}

// ─── Workers ─────────────────────────────────────────────────

export interface RegisterWorkerPayload {
  name: string;
  phone: string;
  city: string;
  platform: string;
  zone: string;
  shift_type: string;
  weekly_earnings: number;
  weekly_active_hours: number;
  upi_id: string;
}

export function registerWorker(data: RegisterWorkerPayload) {
  return post<Record<string, unknown>>('/api/workers/register', data);
}

export function getWorker(workerId: string) {
  return get<Record<string, unknown>>(`/api/workers/${workerId}`);
}

// ─── Quotes ──────────────────────────────────────────────────

export interface QuotePayload {
  worker_profile: {
    city: string;
    zone: string;
    shift_type: string;
    coverage_tier: string;
    weekly_earnings: number;
    weekly_active_hours: number;
  };
  feature_context: {
    reference_date: string;
  };
}

export interface QuoteRiskSummary {
  risk_score: number;
  risk_band: string;
  expected_disrupted_hours: number;
  premium_loading: number;
  top_risk_drivers: Array<{ driver: string; score: number }>;
  zone_risk_band: string;
  zone_baseline_risk_score: number;
}

export interface QuotePremiumBreakdown {
  base_premium: number;
  zone_risk_loading: number;
  shift_exposure_loading: number;
  coverage_factor: number;
  ml_risk_loading: number;
  safe_zone_discount: number;
  final_weekly_premium: number;
}

export interface QuoteCoverageSummary {
  coverage_tier: string;
  coverage_percent: number;
  max_weekly_payout: number;
  insured_shift_hours_per_week: number;
  protected_hours_basis: string;
  protected_weekly_income: number;
  protected_hourly_income: number;
}

export interface QuoteResponse {
  model_version: string;
  worker_profile: Record<string, unknown>;
  risk_summary: QuoteRiskSummary;
  premium_breakdown: QuotePremiumBreakdown;
  coverage_summary: QuoteCoverageSummary;
}

export function generateQuote(payload: QuotePayload) {
  return post<QuoteResponse>('/api/quote/generate', payload);
}

// ─── Policies ────────────────────────────────────────────────

export interface CreatePolicyByWorkerPayload {
  worker_id: string;
  coverage_tier: string;
  feature_context?: { reference_date: string };
}

export interface CreatePolicyInlinePayload {
  worker_profile: {
    name: string;
    phone: string;
    city: string;
    platform: string;
    zone: string;
    shift_type: string;
    weekly_earnings: number;
    weekly_active_hours: number;
    upi_id: string;
  };
  coverage_tier: string;
  feature_context?: { reference_date: string };
}

export function createPolicy(payload: CreatePolicyByWorkerPayload | CreatePolicyInlinePayload) {
  return post<Record<string, unknown>>('/api/policies/create', payload);
}

export function getPolicy(policyId: string) {
  return get<Record<string, unknown>>(`/api/policies/${policyId}`);
}

export function getWorkerPolicies(workerId: string) {
  return get<Record<string, unknown>>(`/api/policies/worker/${workerId}`);
}

// ─── Events / Simulation ────────────────────────────────────

export interface SimulateEventPayload {
  event_type: string;
  city: string;
  zone: string;
  severity: string;
  start_time: string;
  duration_hours: number;
  source: string;
  verified: boolean;
  metadata: Record<string, string>;
}

export function simulateEvent(payload: SimulateEventPayload) {
  return post<Record<string, unknown>>('/api/events/simulate', payload);
}

// ─── Claims ──────────────────────────────────────────────────

export function getClaim(claimId: string) {
  return get<Record<string, unknown>>(`/api/claims/${claimId}`);
}

export function getWorkerClaims(workerId: string) {
  return get<Record<string, unknown>>(`/api/claims/worker/${workerId}`);
}

export function getAllClaims() {
  return get<Record<string, unknown>>('/api/claims');
}

// ─── Admin ───────────────────────────────────────────────────

export interface AdminSummary {
  total_workers: number;
  total_active_policies: number;
  total_events: number;
  total_claims: number;
  claims_by_status: Record<string, number>;
  claims_by_event_type: Record<string, number>;
  recent_events: Array<Record<string, unknown>>;
  recent_claims: Array<Record<string, unknown>>;
  forecast_cards: Array<{
    city: string;
    zone: string;
    shift_type: string;
    coverage_tier: string;
    risk_band: string;
    risk_score: number;
    expected_disrupted_hours: number;
    suggested_weekly_premium: number;
    model_version: string;
  }>;
}

export function getAdminSummary() {
  return get<AdminSummary>('/api/admin/summary');
}
