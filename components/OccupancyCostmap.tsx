"use client";

import React, { useState } from "react";
import { Grid, Compass } from "lucide-react";

export const OccupancyCostmap: React.FC = () => {
  const [selectedZone, setSelectedZone] = useState<string | null>(null);

  return (
    <div className="bg-surface-container border border-surface-container-high/80 p-5 lg:p-6 rounded-2xl shadow-xl flex flex-col justify-between">
      <div>
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-surface-container-low border border-tertiary-fixed-dim/30">
              <Grid className="w-5 h-5 text-tertiary-fixed-dim" />
            </div>
            <div>
              <h2 className="font-headline font-bold text-base lg:text-lg text-on-surface uppercase tracking-tight">
                Occupancy Costmap & Risk Matrix
              </h2>
              <span className="font-mono text-[11px] text-outline">
                3D Dynamic Probabilistic Potential Fields
              </span>
            </div>
          </div>
          <span className="bg-surface-container-highest px-3 py-1 text-primary font-mono text-xs rounded-full border border-primary/30 flex items-center gap-1.5 shadow-[0_0_8px_rgba(0,240,255,0.2)]">
            <Compass className="w-3.5 h-3.5" />
            250Hz OCCUPANCY
          </span>
        </div>

        <p className="text-body-md text-on-surface-variant mb-4 leading-relaxed">
          Synthesizing unpaved road shoulders, open drainage pits, and sudden actor direction flips into high-density 3D risk gradient maps to extract viable non-standard lanes.
        </p>

        {/* Costmap SVG Visualization */}
        <div className="w-full bg-surface-container-lowest border border-surface-container-high p-4 rounded-xl mb-4 relative overflow-hidden">
          <div className="flex justify-between items-center text-outline font-mono text-xs mb-2">
            <span className="text-tertiary-fixed-dim font-bold">GRID RESOLUTION: 5cm VOXEL</span>
            <span className="text-secondary font-bold">COST PENALTY: EXPONENTIAL</span>
          </div>

          <div className="w-full h-44 sm:h-48 relative">
            <svg className="w-full h-full" viewBox="0 0 400 190" preserveAspectRatio="xMidYMid meet">
              <defs>
                <radialGradient id="pothole-chasm" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#ef4444" stopOpacity="0.8" />
                  <stop offset="60%" stopColor="#f59e0b" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
                </radialGradient>
                <radialGradient id="auto-sway" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#ffb95f" stopOpacity="0.7" />
                  <stop offset="80%" stopColor="#ffb95f" stopOpacity="0.1" />
                  <stop offset="100%" stopColor="#ffb95f" stopOpacity="0" />
                </radialGradient>
              </defs>

              {/* Base Road Bed */}
              <rect x="10" y="10" width="380" height="170" rx="6" fill="#0f131c" stroke="#1c2028" strokeWidth="2" />

              {/* Unpaved Shoulder Risk (Left) */}
              <rect
                x="10"
                y="10"
                width="65"
                height="170"
                fill="rgba(255, 185, 95, 0.18)"
                stroke="#ffb95f"
                strokeWidth="1"
                strokeDasharray="4 2"
                className="cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => setSelectedZone("Dirt Shoulder: Gravel / Rutting Risk 0.42")}
              />
              <text
                x="22"
                y="95"
                fill="#ffb95f"
                transform="rotate(-90 22,95)"
                className="font-mono text-[9px] font-bold tracking-widest"
              >
                DIRT SHOULDER
              </text>

              {/* Pothole Hotspot */}
              <g
                className="cursor-pointer group"
                onClick={() => setSelectedZone("Chasm SEV-3: 14cm Deep Void // Avoidance Mandated")}
              >
                <circle cx="160" cy="120" r="32" fill="url(#pothole-chasm)" className="animate-pulse" />
                <circle cx="160" cy="120" r="14" fill="#ef4444" opacity="0.8" />
                <circle cx="160" cy="120" r="4" fill="#ffffff" />
                <text x="120" y="166" fill="#ffb4ab" className="font-mono text-[9px] font-bold">
                  CHASM SEV-3
                </text>
              </g>

              {/* Erratic Rickshaw Path Envelope */}
              <g
                className="cursor-pointer group"
                onClick={() => setSelectedZone("Swerve Auto-Rickshaw: Dynamic 3.4s Trajectory Sweep")}
              >
                <ellipse cx="260" cy="65" rx="55" ry="30" fill="url(#auto-sway)" />
                <circle cx="260" cy="65" r="8" fill="#ffb95f" />
                <text x="215" y="32" fill="#ffddb8" className="font-mono text-[9px] font-bold">
                  SWERVING AUTO
                </text>
              </g>

              {/* Safe Navigation Corridor (Green channel) */}
              <path
                d="M 180 180 C 190 130, 210 100, 205 20"
                fill="none"
                stroke="#4edea3"
                strokeWidth="26"
                strokeLinecap="round"
                opacity="0.3"
              />
              <path
                d="M 180 180 C 190 130, 210 100, 205 20"
                fill="none"
                stroke="#00f0ff"
                strokeWidth="2.5"
                strokeDasharray="5 3"
              />
              <text x="220" y="115" fill="#4edea3" className="font-mono text-[10px] font-bold">
                ACTIVE TUNNEL
              </text>
            </svg>
          </div>

          {selectedZone && (
            <div className="mt-2 text-xs font-mono text-primary bg-surface-container-low p-2 rounded border border-primary/40 flex justify-between items-center">
              <span>{selectedZone}</span>
              <button onClick={() => setSelectedZone(null)} className="text-outline hover:text-white">✕</button>
            </div>
          )}
        </div>
      </div>

      {/* Real-time Surface Telemetry Metrics */}
      <div className="bg-surface-container-low border border-surface-container-high p-3.5 rounded-lg flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="font-label-caps text-[10px] text-outline">
            ROAD SURFACE FRICTION (μ)
          </span>
          <span className="font-mono text-xs text-primary font-bold">
            0.68 [DRY DUSTY ASPHALT]
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="font-label-caps text-[10px] text-outline">
            UNMARKED EDGE CONFIDENCE
          </span>
          <span className="font-mono text-xs text-secondary font-bold">
            94.2% [EDGE DETECTED]
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="font-label-caps text-[10px] text-outline">
            COLLISION PROBABILITY (5.0s HORIZON)
          </span>
          <span className="font-mono text-xs text-secondary font-bold">
            0.004 [PASS NOMINAL]
          </span>
        </div>
      </div>
    </div>
  );
};
