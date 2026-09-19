"use client";

import React, { useEffect, useState } from "react";
import { Sliders, Cpu, Activity } from "lucide-react";
import type { SplineCandidate } from "@/types/trajectory";

interface ActuationControllerProps {
  steeringAngle: number;
  throttlePercent: number;
  brakeStatus: string;
  lateralG: number;
  xteMeters: number;
  activeCandidate?: SplineCandidate;
}

export const ActuationController: React.FC<ActuationControllerProps> = ({
  steeringAngle,
  throttlePercent,
  brakeStatus,
  lateralG,
  xteMeters,
}) => {
  const [points, setPoints] = useState<number[]>([
    24, 20, 24, 22, 26, 24, 21, 25, 23, 24, 22, 26, 24, 23, 24,
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setPoints((prev) => {
        const nextVal = 24 + (Math.random() - 0.5) * 8;
        return [...prev.slice(1), nextVal];
      });
    }, 200);

    return () => clearInterval(interval);
  }, []);

  // Generate SVG path string from points array
  const pathD = points.reduce((acc, curr, idx) => {
    const x = idx * (600 / (points.length - 1));
    return `${acc} ${idx === 0 ? "M" : "L"} ${x} ${curr}`;
  }, "");

  return (
    <div className="bg-surface-container border border-surface-container-high/80 p-5 lg:p-6 rounded-2xl shadow-xl flex flex-col justify-between">
      <div>
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-surface-container-low border border-primary-fixed/30">
              <Sliders className="w-5 h-5 text-primary-fixed" />
            </div>
            <div>
              <h2 className="font-headline font-bold text-base lg:text-lg text-on-surface uppercase tracking-tight">
                Vehicle Controller & CAN-Bus Actuation Layer
              </h2>
              <span className="font-mono text-[11px] text-outline">
                Deterministic Drive-by-Wire Closed Loop Execution
              </span>
            </div>
          </div>

          <span className="bg-surface-container-high px-3 py-1 text-secondary font-mono text-xs rounded-full border border-secondary/30 flex items-center gap-1.5 shadow-[0_0_8px_rgba(78,222,163,0.2)]">
            <Cpu className="w-3.5 h-3.5" />
            STEER/DRIVE-BY-WIRE ACTIVE
          </span>
        </div>

        {/* 4 Dials / Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
          {/* Steering Angle */}
          <div className="bg-surface-container-low border border-surface-container-high p-3.5 rounded-xl flex flex-col justify-between">
            <span className="font-label-caps text-[9px] text-outline">
              TARGET STEERING
            </span>
            <div className="my-1.5">
              <span className="font-mono text-2xl lg:text-3xl text-primary font-bold">
                {steeringAngle.toFixed(1)}°
              </span>
            </div>
            <div className="w-full bg-surface-container-highest h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-primary-container h-full transition-all duration-300"
                style={{ width: `${Math.min(100, Math.abs(steeringAngle) * 5 + 30)}%` }}
              />
            </div>
            <span className="font-mono text-[10px] text-on-surface-variant mt-1.5">
              RATE: 18.5 deg/sec
            </span>
          </div>

          {/* Throttle Output */}
          <div className="bg-surface-container-low border border-surface-container-high p-3.5 rounded-xl flex flex-col justify-between">
            <span className="font-label-caps text-[9px] text-outline">
              THROTTLE ACTUATION
            </span>
            <div className="my-1.5">
              <span className="font-mono text-2xl lg:text-3xl text-secondary font-bold">
                {throttlePercent.toFixed(1)}%
              </span>
            </div>
            <div className="w-full bg-surface-container-highest h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-secondary h-full transition-all duration-300"
                style={{ width: `${throttlePercent}%` }}
              />
            </div>
            <span className="font-mono text-[10px] text-on-surface-variant mt-1.5">
              TORQUE: 180 Nm
            </span>
          </div>

          {/* Brake Pre-Fill */}
          <div className="bg-surface-container-low border border-surface-container-high p-3.5 rounded-xl flex flex-col justify-between">
            <span className="font-label-caps text-[9px] text-outline">
              BRAKE PRE-FILL
            </span>
            <div className="my-1.5">
              <span className="font-mono text-xl lg:text-2xl text-tertiary-fixed-dim font-bold">
                {brakeStatus}
              </span>
            </div>
            <div className="w-full bg-surface-container-highest h-1.5 rounded-full overflow-hidden">
              <div className="bg-tertiary-fixed-dim h-full w-[25%]" />
            </div>
            <span className="font-mono text-[10px] text-on-surface-variant mt-1.5">
              LINE PRESS: 4.8 BAR
            </span>
          </div>

          {/* Lateral Acceleration */}
          <div className="bg-surface-container-low border border-surface-container-high p-3.5 rounded-xl flex flex-col justify-between">
            <span className="font-label-caps text-[9px] text-outline">
              LATERAL ACCEL
            </span>
            <div className="my-1.5">
              <span className="font-mono text-2xl lg:text-3xl text-primary-fixed font-bold">
                {lateralG.toFixed(2)}g
              </span>
            </div>
            <div className="w-full bg-surface-container-highest h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-primary-fixed h-full transition-all duration-300"
                style={{ width: `${Math.min(100, lateralG * 200)}%` }}
              />
            </div>
            <span className="font-mono text-[10px] text-on-surface-variant mt-1.5">
              LIMIT: &lt; 0.35g COMFORT
            </span>
          </div>
        </div>

        {/* Real-time Sparkline Controller Drift Tracker */}
        <div className="bg-surface-container-lowest border border-surface-container-high p-3.5 rounded-xl flex flex-col gap-2">
          <div className="flex justify-between items-center text-outline font-mono text-xs">
            <div className="flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-primary" />
              <span>TRAJECTORY TRACKING CROSS-TRACK ERROR (XTE)</span>
            </div>
            <span className="text-secondary font-bold">
              XTE: {xteMeters.toFixed(3)}m [ALLOWABLE: ±0.15m]
            </span>
          </div>

          <div className="w-full h-12 relative overflow-hidden bg-surface-container-low/50 rounded p-1">
            <svg className="w-full h-full" viewBox="0 0 600 48" preserveAspectRatio="none">
              {/* Baseline reference */}
              <line x1="0" y1="24" x2="600" y2="24" stroke="#31353e" strokeWidth="1" strokeDasharray="4 4" />
              {/* Animated Cross-Track Error Waveform */}
              <path d={pathD} fill="none" stroke="#00f0ff" strokeWidth="2.5" />
              {/* Current end point pulse */}
              <circle cx="600" cy={points[points.length - 1]} r="4" fill="#00f0ff" className="animate-ping" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};
