import { SplineCandidate, SplineStatus } from "@/types/trajectory";
export type { SplineStatus };

/**
 * Trajectory optimization weights derived from multi-attribute utility theory:
 * - Spatial Clearance: 60%
 * - Jerk / Passenger Comfort: 40%
 * - Dynamic Risk Penalty: scaled damping factor
 */
export const WEIGHT_CLEARANCE = 0.60;
export const WEIGHT_JERK_COMFORT = 0.40;
export const WEIGHT_RISK_PENALTY = 0.05;

/**
 * Computes the composite score for a trajectory spline candidate.
 * Pure function: calculates the weighted sum of clearanceScore, jerkComfortScore,
 * and accounts for dynamic risk penalty.
 */
export function computeCompositeScore(
  candidate: Pick<SplineCandidate, "clearanceScore" | "jerkComfortScore" | "riskPenalty">
): number {
  const clearance = candidate.clearanceScore ?? 0;
  const jerk = candidate.jerkComfortScore ?? 0;
  const rawRisk = candidate.riskPenalty ?? 0;

  // If risk penalty is already negative (e.g., -4.2), adding it applies penalty
  const riskAdjustment = rawRisk < 0 ? rawRisk * WEIGHT_RISK_PENALTY : -rawRisk * WEIGHT_RISK_PENALTY;

  const score = clearance * WEIGHT_CLEARANCE + jerk * WEIGHT_JERK_COMFORT + riskAdjustment;
  return Number(Math.max(0, Math.min(100, score)).toFixed(1));
}

/**
 * Evaluates candidates and derives statuses dynamically:
 * - The candidate with the highest composite score (passing minimum clearance >= 50) is "ENGAGED"
 * - Candidates with severe risk / low clearance (< 50) or TTC breach are "REJECTED"
 * - All other valid alternate trajectories are set to "STANDBY"
 */
export function deriveCandidateStatuses(candidates: SplineCandidate[]): SplineCandidate[] {
  // Score all candidates first
  const scored = candidates.map((c) => ({
    ...c,
    compositeScore: computeCompositeScore(c),
  }));

  // Find candidate eligible for ENGAGED (highest score among non-rejected)
  let bestId: string | null = null;
  let highestScore = -Infinity;

  scored.forEach((c) => {
    const isRejected = c.clearanceScore < 50 || c.riskPenalty < -30;
    if (!isRejected && c.compositeScore > highestScore) {
      highestScore = c.compositeScore;
      bestId = c.id;
    }
  });

  return scored.map((c): SplineCandidate => {
    const isHardRejected = c.clearanceScore < 50 || c.riskPenalty < -30;

    if (isHardRejected) {
      return {
        ...c,
        status: "REJECTED",
        statusReason: c.statusReason.includes("REJECTED")
          ? c.statusReason
          : "REJECTED [SAFETY THRESHOLD]",
        color: "error",
      };
    }

    if (c.id === bestId) {
      return {
        ...c,
        status: "ENGAGED",
        statusReason: "SELECTED & ENGAGED",
        color: "secondary",
      };
    }

    return {
      ...c,
      status: "STANDBY",
      statusReason: c.statusReason.includes("STANDBY")
        ? c.statusReason
        : "STANDBY ALTERNATE",
      color: c.color === "error" ? "secondary" : c.color,
    };
  });
}
