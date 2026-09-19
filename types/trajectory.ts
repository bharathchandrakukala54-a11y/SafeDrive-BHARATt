export type SplineStatus = "ENGAGED" | "REJECTED" | "STANDBY";

export interface SplineCandidate {
  id: string;
  name: string;
  maneuver: string;
  clearanceScore: number;
  jerkComfortScore: number;
  headway: number;
  headwayDisplay?: string;
  riskPenalty: number;
  compositeScore: number;
  status: SplineStatus;
  statusReason: string;
  color: string;
  // Optional display / backward-compatibility fields
  clearance?: string;
  jerkComfort?: string;
  jerkScore?: number;
}
