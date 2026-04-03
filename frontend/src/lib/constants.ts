import {
  City,
  CoverageTier,
  DisruptionCategory,
  DisruptionType,
  Platform,
  Severity,
  ShiftWindow,
  Zone,
} from './types';

// ─── Platforms ───────────────────────────────────────────────

export const PLATFORMS: Platform[] = ['Blinkit', 'Zepto', 'Instamart', 'BigBasket Now'];

// ─── Cities ──────────────────────────────────────────────────

export const CITIES: City[] = [
  'Bengaluru',
  'Mumbai',
  'Delhi NCR',
  'Hyderabad',
  'Pune',
  'Chennai',
];

// ─── Shift Windows ───────────────────────────────────────────

export const SHIFT_WINDOWS: ShiftWindow[] = [
  { id: 'morning', label: 'Morning Rush (7 AM – 11 AM)', startHour: 7, endHour: 11 },
  { id: 'afternoon', label: 'Afternoon (12 PM – 4 PM)', startHour: 12, endHour: 16 },
  { id: 'evening', label: 'Evening Rush (6 PM – 10 PM)', startHour: 18, endHour: 22 },
  { id: 'night', label: 'Late Night (10 PM – 1 AM)', startHour: 22, endHour: 1 },
];

// ─── Zones by City ──────────────────────────────────────────

export const ZONES: Zone[] = [
  // -- Bengaluru
  { id: 'blr-kora', name: 'Koramangala', city: 'Bengaluru', riskLevel: 'medium', darkStores: ['DS-K1', 'DS-K2', 'DS-K3'] },
  { id: 'blr-indira', name: 'Indiranagar', city: 'Bengaluru', riskLevel: 'low', darkStores: ['DS-I1', 'DS-I2'] },
  { id: 'blr-hsr', name: 'HSR Layout', city: 'Bengaluru', riskLevel: 'medium', darkStores: ['DS-H1', 'DS-H2'] },
  { id: 'blr-whitefield', name: 'Whitefield', city: 'Bengaluru', riskLevel: 'high', darkStores: ['DS-W1', 'DS-W2', 'DS-W3'] },
  { id: 'blr-jp', name: 'JP Nagar', city: 'Bengaluru', riskLevel: 'low', darkStores: ['DS-JP1'] },
  // -- Mumbai
  { id: 'mum-andheri', name: 'Andheri East', city: 'Mumbai', riskLevel: 'high', darkStores: ['DS-A1', 'DS-A2'] },
  { id: 'mum-bandra', name: 'Bandra West', city: 'Mumbai', riskLevel: 'medium', darkStores: ['DS-B1', 'DS-B2'] },
  { id: 'mum-powai', name: 'Powai', city: 'Mumbai', riskLevel: 'medium', darkStores: ['DS-P1'] },
  // -- Delhi NCR
  { id: 'del-gurgaon', name: 'Gurgaon Sec 49', city: 'Delhi NCR', riskLevel: 'high', darkStores: ['DS-G1', 'DS-G2'] },
  { id: 'del-noida', name: 'Noida Sec 18', city: 'Delhi NCR', riskLevel: 'high', darkStores: ['DS-N1', 'DS-N2'] },
  { id: 'del-dwarka', name: 'Dwarka', city: 'Delhi NCR', riskLevel: 'medium', darkStores: ['DS-D1'] },
  // -- Hyderabad
  { id: 'hyd-madhapur', name: 'Madhapur', city: 'Hyderabad', riskLevel: 'medium', darkStores: ['DS-M1', 'DS-M2'] },
  { id: 'hyd-gachi', name: 'Gachibowli', city: 'Hyderabad', riskLevel: 'low', darkStores: ['DS-GA1'] },
  // -- Pune
  { id: 'pun-koregaon', name: 'Koregaon Park', city: 'Pune', riskLevel: 'medium', darkStores: ['DS-KP1', 'DS-KP2'] },
  { id: 'pun-hinjewadi', name: 'Hinjewadi', city: 'Pune', riskLevel: 'low', darkStores: ['DS-HJ1'] },
  // -- Chennai
  { id: 'chn-anna', name: 'Anna Nagar', city: 'Chennai', riskLevel: 'medium', darkStores: ['DS-AN1', 'DS-AN2'] },
  { id: 'chn-adyar', name: 'Adyar', city: 'Chennai', riskLevel: 'high', darkStores: ['DS-AD1'] },
];

// ─── Disruption Taxonomy ─────────────────────────────────────

export const DISRUPTION_TYPE_INFO: Record<
  DisruptionType,
  {
    label: string;
    category: DisruptionCategory;
    isPayoutTrigger: boolean;
    description: string;
    icon: string;
  }
> = {
  RAIN_EVENT: {
    label: 'Heavy Rainfall',
    category: 'WEATHER',
    isPayoutTrigger: true,
    description: 'Rainfall exceeding 64mm/hr as per IMD classification',
    icon: 'CloudRain',
  },
  WATERLOGGING_EVENT: {
    label: 'Waterlogging',
    category: 'WEATHER',
    isPayoutTrigger: true,
    description: 'Road inundation preventing last-mile delivery operations',
    icon: 'Waves',
  },
  HEAT_STRESS_EVENT: {
    label: 'Extreme Heat',
    category: 'WEATHER',
    isPayoutTrigger: true,
    description: 'Temperature exceeding safe operational threshold (>42°C)',
    icon: 'Thermometer',
  },
  AIR_QUALITY_EVENT: {
    label: 'Severe AQI',
    category: 'WEATHER',
    isPayoutTrigger: true,
    description: 'AQI exceeding 400 (Severe category)',
    icon: 'Wind',
  },
  ZONE_ACCESS_RESTRICTION: {
    label: 'Zone Access Restricted',
    category: 'ACCESS',
    isPayoutTrigger: true,
    description: 'Municipal or police-imposed access restriction in operating zone',
    icon: 'ShieldOff',
  },
  DARK_STORE_UNAVAILABLE: {
    label: 'Dark Store Down',
    category: 'INFRASTRUCTURE',
    isPayoutTrigger: true,
    description: 'Dark store closure due to infrastructure failure or forced shutdown',
    icon: 'Store',
  },
  PLATFORM_OUTAGE: {
    label: 'Platform Outage',
    category: 'PLATFORM',
    isPayoutTrigger: true,
    description: 'Platform-wide or regional delivery app service unavailability',
    icon: 'WifiOff',
  },
};

export const SEVERITY_CONFIG: Record<Severity, { label: string; multiplier: number; color: string }> = {
  low: { label: 'Low', multiplier: 0.4, color: '#059669' },
  moderate: { label: 'Moderate', multiplier: 0.65, color: '#D97706' },
  high: { label: 'High', multiplier: 0.85, color: '#EA580C' },
  severe: { label: 'Severe', multiplier: 1.0, color: '#DC2626' },
};

// ─── Coverage Tiers ──────────────────────────────────────────

export const COVERAGE_TIERS: CoverageTier[] = [
  {
    id: 'basic',
    name: 'Basic',
    maxWeeklyPayout: 2000,
    coveragePercent: 50,
    eligibleDisruptions: ['RAIN_EVENT', 'WATERLOGGING_EVENT', 'PLATFORM_OUTAGE'],
  },
  {
    id: 'standard',
    name: 'Standard',
    maxWeeklyPayout: 3500,
    coveragePercent: 70,
    eligibleDisruptions: [
      'RAIN_EVENT',
      'WATERLOGGING_EVENT',
      'HEAT_STRESS_EVENT',
      'AIR_QUALITY_EVENT',
      'PLATFORM_OUTAGE',
      'DARK_STORE_UNAVAILABLE',
    ],
  },
  {
    id: 'comprehensive',
    name: 'Comprehensive',
    maxWeeklyPayout: 5000,
    coveragePercent: 90,
    eligibleDisruptions: [
      'RAIN_EVENT',
      'WATERLOGGING_EVENT',
      'HEAT_STRESS_EVENT',
      'AIR_QUALITY_EVENT',
      'ZONE_ACCESS_RESTRICTION',
      'DARK_STORE_UNAVAILABLE',
      'PLATFORM_OUTAGE',
    ],
  },
];

// ─── Risk Parameters ─────────────────────────────────────────

export const ZONE_RISK_LOADINGS: Record<string, number> = {
  low: 3,
  medium: 8,
  high: 14,
};

export const SHIFT_RISK_LOADINGS: Record<string, number> = {
  morning: 3,
  afternoon: 2,
  evening: 5,
  night: 7,
};

// ─── Backend Mapping Constants ───────────────────────────────

/** Map frontend shift IDs → backend canonical shift_type values */
export const SHIFT_TYPE_MAP: Record<string, string> = {
  morning: 'morning_rush',
  afternoon: 'afternoon',
  evening: 'evening_rush',
  night: 'late_night',
};

/** Map frontend DisruptionType → backend event_type. null = unsupported by backend */
export const EVENT_TYPE_MAP: Record<string, string | null> = {
  RAIN_EVENT: 'heavy_rainfall',
  WATERLOGGING_EVENT: 'waterlogging',
  HEAT_STRESS_EVENT: null,
  AIR_QUALITY_EVENT: 'severe_aqi',
  PLATFORM_OUTAGE: 'platform_outage',
  DARK_STORE_UNAVAILABLE: 'dark_store_unavailable',
  ZONE_ACCESS_RESTRICTION: 'zone_access_restriction',
};
