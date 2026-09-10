"use client";

import React, { useState } from "react";
import { Shield, Sparkles, Sliders, CheckCircle2, AlertTriangle } from "lucide-react";

export const AdaptiveSafetyBubble: React.FC = () => {
  const [pinchFactor, setPinchFactor] = useState<number>(35); // 0 - 100
  const [cattleClearance, setCattleClearance] = useState<number>(50); // 0 - 100
  const [showRigidBox, setShowRigidBox] = useState<boolean>(true);

  // Dynamic SVG path calculations based on pinch and clearance sliders
  const pinchY = 70 + (pinchFactor / 100) * 30; // 70 -> 100
  const cattleY = 170 + (cattleClearance / 100) * 35; // 170 -> 205

  return (
    <div className="bg-surface-container border border-surface-container-high/80 p-5 lg:p-6 rounded-2xl shadow-xl flex flex-col justify-between">
      <div>
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-surface-container-low border border-primary/30">
              <Shield className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="font-headline font-bold text-base lg:text-lg text-on-surface uppercase tracking-tight">
                Adaptive Safety Bubble: Elastic Morphing Envelope
              </h2>
              <span className="font-mono text-[11px] text-outline">
                Non-Euclidean Dynamic Buffer Optimization
              </span>
            </div>
          </div>
          <span className="bg-surface-container-highest px-3 py-1 text-secondary font-mono text-xs rounded-full border border-secondary/30 flex items-center gap-1.5 shadow-[0_0_8px_rgba(78,222,163,0.2)]">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Zero False Hard-Brakes
          </span>
        </div>

        <p className="text-body-md text-on-surface-variant mb-4 leading-relaxed">
          Unlike Western AV rigid axis-aligned bounding boxes (which freeze continuously in dense Indian traffic), the SafeDrive AI Elastic Envelope dynamically <strong className="text-primary font-semibold">pinches around predictable micro-gaps</strong> and balloons laterally when passing unpredictable actors like weaving two-wheelers and cattle.
        </p>

        {/* Morphing Envelope SVG Visualizer */}
        <div className="w-full bg-surface-container-lowest border border-surface-container-high p-4 rounded-xl mb-4 relative overflow-hidden">
          <div className="flex flex-wrap items-center justify-between text-outline font-mono text-xs mb-2">
            <span className="text-primary-fixed">LATERAL ELASTIC BUFFER: ±2.4m</span>
            <span className="text-secondary">LONGITUDINAL BRAKING CONE: 32.8m @ 38 km/h</span>
          </div>

          <div className="relative w-full h-48 sm:h-56">
            <svg className="w-full h-full" viewBox="0 0 700 240" preserveAspectRatio="xMidYMid meet">
              <defs>
                <pattern id="grid-pattern" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
                </pattern>
                <linearGradient id="bubble-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="rgba(0, 240, 255, 0.1)" />
                  <stop offset="50%" stopColor="rgba(78, 222, 163, 0.3)" />
                  <stop offset="100%" stopColor="rgba(0, 240, 255, 0.1)" />
                </linearGradient>
                <linearGradient id="rigid-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="rgba(239, 68, 68, 0.15)" />
                  <stop offset="100%" stopColor="rgba(239, 68, 68, 0.03)" />
                </linearGradient>
              </defs>

              <rect width="100%" height="100%" fill="url(#grid-pattern)" />

              {/* Traditional Rigid Box (Ghost Red Failures) */}
              {showRigidBox && (
                <g>
                  <rect
                    x="210"
                    y="50"
                    width="280"
                    height="140"
                    rx="4"
                    fill="url(#rigid-gradient)"
                    stroke="rgba(255,180,171,0.4)"
                    strokeWidth="1.5"
                    strokeDasharray="4 4"
                  />
                  <text x="220" y="68" fill="#ffb4ab" className="font-mono text-[10px]">
                    Legacy AV Rigid Bounding Envelope [Freeze Threshold]
                  </text>
                </g>
              )}

              {/* Dynamic Morphing Elastic Bubble Contour */}
              <path
                d={`M 170 120 C 180 50, 310 40, 370 ${pinchY} C 430 ${pinchY + 20}, 520 85, 545 120 C 520 155, 430 150, 370 ${cattleY} C 310 200, 180 190, 170 120 Z`}
                fill="url(#bubble-gradient)"
                stroke="#00f0ff"
                strokeWidth="2.5"
                className="transition-all duration-300"
              />

              {/* Actor Incursions: Cut-in Scooter */}
              <g transform="translate(430, 65)">
                <circle cx="0" cy="0" r="8" fill="#ffb95f" className="animate-pulse" />
                <circle cx="0" cy="0" r="14" fill="none" stroke="#ffb95f" strokeWidth="1" opacity="0.6" />
                <text x="18" y="4" fill="#ffb95f" className="font-mono text-[11px] font-bold">
                  Cut-In Scooter (Pinch Factor: {pinchFactor}%)
                </text>
                <line x1="0" y1="0" x2="-40" y2="20" stroke="#ffb95f" strokeWidth="1.5" strokeDasharray="3 3" />
              </g>

              {/* Bovine Obstacle: Lateral Expansion */}
              <g transform="translate(210, 185)">
                <circle cx="0" cy="0" r="9" fill="#ffb95f" />
                <circle cx="0" cy="0" r="16" fill="none" stroke="#ffb95f" strokeWidth="1" opacity="0.6" />
                <text x="20" y="4" fill="#ffb95f" className="font-mono text-[11px] font-bold">
                  Cattle Standstill (Clearance: +{(cattleClearance / 25).toFixed(1)}m)
                </text>
              </g>

              {/* Ego AV Center Vehicle Model */}
              <g transform="translate(325, 105)">
                <rect
                  x="0"
                  y="0"
                  width="54"
                  height="32"
                  rx="4"
                  fill="#1c2028"
                  stroke="#00dbe9"
                  strokeWidth="2"
                  className="shadow-lg"
                />
                <circle cx="12" cy="16" r="4" fill="#00f0ff" />
                <circle cx="42" cy="8" r="2" fill="#4edea3" />
                <circle cx="42" cy="24" r="2" fill="#4edea3" />
                <path d="M 54 16 L 85 16" stroke="#4edea3" strokeWidth="2.5" strokeDasharray="3 2" />
                <text x="6" y="-6" fill="#dbfcff" className="font-mono text-[10px] font-bold">
                  EGO AV
                </text>
              </g>
            </svg>
          </div>

          {/* Real-time Interactive Sliders for Envelope Morphing */}
          <div className="mt-3 pt-3 border-t border-surface-container-high grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-on-surface-variant">Scooter Pinch Dynamics:</span>
                <span className="text-primary font-bold">{pinchFactor}% Pinch</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={pinchFactor}
                onChange={(e) => setPinchFactor(Number(e.target.value))}
                className="w-full accent-primary-container h-1.5 bg-surface-container-high rounded cursor-pointer"
              />
            </div>

            <div className="flex flex-col gap-1">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-on-surface-variant">Cattle Lateral Ballooning:</span>
                <span className="text-tertiary-fixed-dim font-bold">{cattleClearance}% Clearance</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={cattleClearance}
                onChange={(e) => setCattleClearance(Number(e.target.value))}
                className="w-full accent-tertiary-fixed-dim h-1.5 bg-surface-container-high rounded cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Comparative Metrics Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-surface-container-low border border-surface-container-high p-3 rounded-lg flex flex-col">
          <span className="font-label-caps text-[10px] text-outline">
            FALSE EMERGENCY STOPS
          </span>
          <span className="font-mono text-xl font-bold text-secondary my-0.5">
            0.02 / km
          </span>
          <span className="font-mono text-[10px] text-on-surface-variant">
            vs 14.8 / km (Rigid Stack)
          </span>
        </div>

        <div className="bg-surface-container-low border border-surface-container-high p-3 rounded-lg flex flex-col">
          <span className="font-label-caps text-[10px] text-outline">
            CLEARANCE EFFICIENCY
          </span>
          <span className="font-mono text-xl font-bold text-primary my-0.5">
            96.4%
          </span>
          <span className="font-mono text-[10px] text-on-surface-variant">
            Continuous Flow Preserved
          </span>
        </div>

        <div className="bg-surface-container-low border border-surface-container-high p-3 rounded-lg flex flex-col">
          <span className="font-label-caps text-[10px] text-outline">
            PASSING CONFIDENCE
          </span>
          <span className="font-mono text-xl font-bold text-secondary my-0.5">
            98.1%
          </span>
          <span className="font-mono text-[10px] text-on-surface-variant">
            Micro-gap Penetration
          </span>
        </div>
      </div>
    </div>
  );
};
