"use client";

import React from "react";
import { GitBranch, Check, X, ShieldAlert } from "lucide-react";
import { SplineCandidate } from "@/types/trajectory";

export type { SplineCandidate };

interface TrajectoryRolloutProps {
  candidates: SplineCandidate[];
  selectedSplineId: string;
  onSelectSpline: (id: string) => void;
}

export const TrajectoryRollout: React.FC<TrajectoryRolloutProps> = ({
  candidates,
  selectedSplineId,
  onSelectSpline,
}) => {
  return (
    <div className="w-full bg-surface-container border border-surface-container-high/80 p-5 lg:p-6 rounded-2xl shadow-xl flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-surface-container-low border border-primary/30">
            <GitBranch className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="font-headline font-bold text-base lg:text-lg text-on-surface uppercase tracking-tight">
              Multi-Trajectory Rollout & Candidate Optimization
            </h2>
            <p className="font-mono text-xs text-on-surface-variant">
              Quintic Polynomial Splines calculated across parallel compute threads every 10ms.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-surface-container-low border border-surface-container-high px-3 py-1.5 rounded-full">
          <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
          <span className="font-mono text-xs text-on-surface">
            32 TRAJECTORIES SAMPLED // 1 WINNER
          </span>
        </div>
      </div>

      {/* Path Selection Breakdown Table */}
      <div className="w-full overflow-x-auto rounded-xl border border-surface-container-high/70">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-container-low text-outline font-label-caps text-[10px] tracking-wider border-b border-surface-container-high">
              <th className="p-3">TRAJECTORY SPLINE</th>
              <th className="p-3">MANEUVER PROFILE</th>
              <th className="p-3">SPATIAL CLEARANCE</th>
              <th className="p-3">JERK / COMFORT</th>
              <th className="p-3">TRAFFIC HEADWAY</th>
              <th className="p-3">RISK PENALTY</th>
              <th className="p-3">COMPOSITE SCORE</th>
              <th className="p-3">CONTROLLER STATUS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-container-high/40 text-xs font-mono">
            {candidates.map((candidate) => {
              const isSelected = selectedSplineId === candidate.id;
              return (
                <tr
                  key={candidate.id}
                  onClick={() => onSelectSpline(candidate.id)}
                  className={`cursor-pointer transition-colors ${
                    isSelected
                      ? "bg-surface-container-high/60 ring-1 ring-inset ring-primary-container/40"
                      : "bg-surface-container-lowest/40 hover:bg-surface-container-high/40"
                  }`}
                >
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-2.5 h-2.5 rounded-full ${
                          candidate.color === "secondary"
                            ? "bg-secondary shadow-[0_0_8px_rgba(78,222,163,0.8)]"
                            : candidate.color === "error"
                            ? "bg-error"
                            : "bg-tertiary-fixed-dim"
                        }`}
                      />
                      <span
                        className={`font-bold ${
                          candidate.color === "secondary"
                            ? "text-primary"
                            : "text-on-surface-variant"
                        }`}
                      >
                        {candidate.name}
                      </span>
                    </div>
                  </td>

                  <td className="p-3 text-on-surface font-sans text-xs">
                    {candidate.maneuver}
                  </td>

                  <td
                    className={`p-3 font-bold ${
                      candidate.clearanceScore > 80
                        ? "text-secondary"
                        : candidate.clearanceScore > 60
                        ? "text-tertiary-fixed-dim"
                        : "text-error"
                    }`}
                  >
                    {candidate.clearance ?? `${candidate.clearanceScore} / 100`}
                  </td>

                  <td className="p-3 text-on-surface-variant">
                    {candidate.jerkComfort ?? `${candidate.jerkComfortScore} / 100`}
                  </td>

                  <td
                    className={`p-3 ${
                      (candidate.headwayDisplay ?? String(candidate.headway)).includes("Low")
                        ? "text-error font-bold"
                        : "text-on-surface"
                    }`}
                  >
                    {candidate.headwayDisplay ?? `+${candidate.headway}m`}
                  </td>

                  <td
                    className={`p-3 font-bold ${
                      candidate.color === "secondary"
                        ? "text-secondary"
                        : candidate.color === "error"
                        ? "text-error"
                        : "text-tertiary-fixed-dim"
                    }`}
                  >
                    {typeof candidate.riskPenalty === "number"
                      ? (candidate.riskPenalty > 0 ? `+${candidate.riskPenalty.toFixed(1)}` : candidate.riskPenalty.toFixed(1))
                      : candidate.riskPenalty}
                  </td>

                  <td className="p-3">
                    <span
                      className={`font-mono font-bold text-base ${
                        candidate.color === "secondary"
                          ? "text-secondary"
                          : candidate.color === "error"
                          ? "text-error"
                          : "text-tertiary-fixed-dim"
                      }`}
                    >
                      {candidate.compositeScore.toFixed(1)}
                    </span>
                  </td>

                  <td className="p-3">
                    <span
                      className={`px-2.5 py-1 rounded font-label-caps text-[9px] font-bold tracking-wider inline-flex items-center gap-1 ${
                        candidate.status === "ENGAGED"
                          ? "bg-secondary-container text-on-secondary-container shadow-[0_0_8px_rgba(0,165,114,0.4)]"
                          : candidate.status === "REJECTED"
                          ? "bg-error-container text-on-error-container"
                          : "bg-surface-container-highest text-on-surface-variant"
                      }`}
                    >
                      {candidate.status === "ENGAGED" && <Check className="w-3 h-3" />}
                      {candidate.status === "REJECTED" && <X className="w-3 h-3" />}
                      {candidate.status === "STANDBY" && <ShieldAlert className="w-3 h-3" />}
                      {candidate.statusReason || candidate.status}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
