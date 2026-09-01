// Centralized Config & Data Store for PERSQFT Architectural Tools
// This structure is designed to connect directly to the Admin CMS / Database (Supabase / Sanity)

export interface EstimatorRates {
  standard: number;
  premium: number;
  luxury: number;
}

export interface ToolsConfig {
  estimatorRates: {
    residential: EstimatorRates;
    commercial: EstimatorRates;
    interior: EstimatorRates;
  };
  breakdownPercentages: {
    civil: number;      // e.g. 0.45
    mep: number;        // e.g. 0.20
    facade: number;     // e.g. 0.15
    finishes: number;   // e.g. 0.20
  };
  farDefaults: {
    road30: { ratio: number; maxGroundCoveragePct: number; frontSetback: number; rearSetback: number };
    road40: { ratio: number; maxGroundCoveragePct: number; frontSetback: number; rearSetback: number };
    road60: { ratio: number; maxGroundCoveragePct: number; frontSetback: number; rearSetback: number };
  };
}

export const defaultToolsConfig: ToolsConfig = {
  estimatorRates: {
    residential: { standard: 1850, premium: 2750, luxury: 4200 },
    commercial:  { standard: 2100, premium: 3200, luxury: 4800 },
    interior:    { standard: 1200, premium: 2100, luxury: 3500 },
  },
  breakdownPercentages: {
    civil: 0.45,
    mep: 0.20,
    facade: 0.15,
    finishes: 0.20,
  },
  farDefaults: {
    road30: { ratio: 1.50, maxGroundCoveragePct: 0.55, frontSetback: 7.5, rearSetback: 6 },
    road40: { ratio: 1.75, maxGroundCoveragePct: 0.60, frontSetback: 10.0, rearSetback: 8 },
    road60: { ratio: 2.25, maxGroundCoveragePct: 0.65, frontSetback: 15.0, rearSetback: 10 },
  },
};
