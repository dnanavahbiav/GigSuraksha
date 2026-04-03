// ─── Local State Persistence ─────────────────────────────────
// Simple localStorage wrappers for demo-safe state management.
// No auth exists — all user state is persisted client-side.

const KEYS = {
  worker: 'gigsuraksha_worker',
  quote: 'gigsuraksha_quote',
  policy: 'gigsuraksha_policy',
  event: 'gigsuraksha_event',
} as const;

// ─── Generic helpers ─────────────────────────────────────────

function save(key: string, data: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch {
    // localStorage full or unavailable
  }
}

function load<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function remove(key: string) {
  try {
    localStorage.removeItem(key);
  } catch {
    // ignore
  }
}

// ─── Worker ──────────────────────────────────────────────────

export interface StoredWorker {
  worker_id: string;
  name: string;
  phone: string;
  city: string;
  platform: string;
  zone: string;
  shift_type: string;
  weekly_earnings: number;
  weekly_active_hours: number;
  upi_id: string;
  [key: string]: unknown;
}

export function saveWorker(worker: StoredWorker) {
  save(KEYS.worker, worker);
}

export function getWorker(): StoredWorker | null {
  return load<StoredWorker>(KEYS.worker);
}

// ─── Quote ───────────────────────────────────────────────────

export function saveQuote(quote: Record<string, unknown>) {
  save(KEYS.quote, quote);
}

export function getQuote(): Record<string, unknown> | null {
  return load<Record<string, unknown>>(KEYS.quote);
}

// ─── Policy ──────────────────────────────────────────────────

export function savePolicy(policy: Record<string, unknown>) {
  save(KEYS.policy, policy);
}

export function getPolicy(): Record<string, unknown> | null {
  return load<Record<string, unknown>>(KEYS.policy);
}

// ─── Event ───────────────────────────────────────────────────

export function saveEvent(event: Record<string, unknown>) {
  save(KEYS.event, event);
}

export function getEvent(): Record<string, unknown> | null {
  return load<Record<string, unknown>>(KEYS.event);
}

// ─── Reset ───────────────────────────────────────────────────

export function clearAll() {
  Object.values(KEYS).forEach(remove);
}
