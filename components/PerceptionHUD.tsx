"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Crosshair, RefreshCw } from "lucide-react";

interface Actor {
  id: string;
  name: string;
  type: "bovine" | "rickshaw" | "wrong-way" | "pedestrian" | "pothole";
  top: string;
  left: string;
  width: string;
  height: string;
  color: "cyan" | "amber" | "error" | "secondary";
  badge: string;
  confidence: number;
  distance: string;
  velocity: string;
  evasionRecommendation: string;
  ttc?: string;
}

const ACTORS: Actor[] = [
  {
    id: "bovine-08",
    name: "Indian Cow (Bos Indicus)",
    type: "bovine",
    top: "52%",
    left: "13%",
    width: "w-24 lg:w-28",
    height: "h-16 lg:h-20",
    color: "amber",
    badge: "[BOVINE #08] STATIC // DWELL: 84%",
    confidence: 96.4,
    distance: "14.2m Ahead-Left",
    velocity: "0.4 km/h (Unpredictable)",
    evasionRecommendation: "Lateral Elastic Buffer Expand (+1.8m Right Pinch)",
    ttc: "N/A (Stationary in Median)",
  },
  {
    id: "rickshaw-34",
    name: "Bajaj CNG Auto-Rickshaw",
    type: "rickshaw",
    top: "40%",
    left: "30%",
    width: "w-28 lg:w-32",
    height: "h-28 lg:h-36",
    color: "cyan",
    badge: "[RICKSHAW #34] V: 32 km/h | TTC: 3.4s",
    confidence: 99.1,
    distance: "21.6m Ahead-Center",
    velocity: "32.0 km/h (Constant Swerve)",
    evasionRecommendation: "Micro-Gap Follow & Quintic Polynomial Left Bypass",
    ttc: "3.4s",
  },
  {
    id: "wrong-way-12",
    name: "125cc Motorbike (Contra-flow)",
    type: "wrong-way",
    top: "35%",
    left: "45%",
    width: "w-16 lg:w-20",
    height: "h-24 lg:h-28",
    color: "error",
    badge: "[WRONG-WAY 2-WHEELER #12] CLOSING: +42 km/h",
    confidence: 98.7,
    distance: "38.5m Closing Fast",
    velocity: "+42.0 km/h (Opposite Vector)",
    evasionRecommendation: "CRITICAL: Throttle Cut & Pre-fill Hydraulic Line Pressure",
    ttc: "1.9s",
  },
  {
    id: "pedestrian-19",
    name: "Pedestrian Crossing Blind-spot",
    type: "pedestrian",
    top: "46%",
    left: "72%",
    width: "w-16 lg:w-20",
    height: "h-24 lg:h-30",
    color: "cyan",
    badge: "[PEDESTRIAN #19] LATERAL OFFSET: 3.8m",
    confidence: 94.8,
    distance: "18.3m Ahead-Right",
    velocity: "4.2 km/h Walking",
    evasionRecommendation: "Corridor Safe: Maintain Nominal Headway",
    ttc: "5.2s",
  },
  {
    id: "pothole-02",
    name: "Unmarked Severe Asphalt Chasm",
    type: "pothole",
    top: "68%",
    left: "35%",
    width: "w-32 lg:w-36",
    height: "h-8 lg:h-10",
    color: "amber",
    badge: "POTHOLE #02 [DEPTH: 14cm // AVOIDANCE MANDATE]",
    confidence: 97.2,
    distance: "11.0m Direct Wheelpath",
    velocity: "0.0 km/h Road Defect",
    evasionRecommendation: "Immediate Steer Deflection: -4.2° Alpha Bypass",
    ttc: "1.0s at Current Speed",
  },
];

interface PerceptionHUDProps {
  egoSpeed: number;
  ttcSeconds: number;
  dracValue: number;
  erraticIndex: number;
  activeSpline: string;
  onRecalculate: () => void;
  isRecalculating: boolean;
}

export const PerceptionHUD: React.FC<PerceptionHUDProps> = ({
  egoSpeed,
  ttcSeconds,
  dracValue,
  erraticIndex,
  activeSpline,
  onRecalculate,
  isRecalculating,
}) => {
  const [selectedActor, setSelectedActor] = useState<Actor | null>(null);
  const [activeLayer, setActiveLayer] = useState<
    "all" | "vision" | "lidar" | "radar" | "segmentation"
  >("all");
  const [showScanlines] = useState(true);

  return (
    <div className="relative w-full rounded-2xl overflow-hidden bg-surface-container-lowest border border-surface-container-high/90 shadow-[0_8px_32px_rgba(0,0,0,0.8)] flex flex-col">
      {/* Perception Viewport Container */}
      <div className="relative w-full aspect-[16/9] sm:aspect-[21/9] min-h-[460px] max-h-[640px] overflow-hidden select-none bg-surface-container-lowest">
        {/* Background Perception Media */}
        <Image
          src="/lidar_city.webp"
          alt="SafeDrive AI Real-time Perception Stream"
          fill
          priority
          className={`object-cover object-center filter brightness-[0.88] contrast-[1.12] transition-all duration-500 ${
            activeLayer === "lidar"
              ? "hue-rotate-90 saturate-200"
              : activeLayer === "radar"
              ? "invert opacity-70"
              : activeLayer === "segmentation"
              ? "saturate-150 contrast-125"
              : ""
          }`}
        />

        {/* Cybernetic Scanline & Grid Micro-Overlay */}
        {showScanlines && (
          <div className="absolute inset-0 scanline-grid opacity-30 pointer-events-none" />
        )}

        {/* Ambient Dark Gradient Vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-transparent to-surface-container-lowest/60 pointer-events-none" />

        {/* TOP HUD RAIL */}
        <div className="absolute top-3 left-3 right-3 flex flex-wrap items-center justify-between gap-2 z-20">
          {/* Sensor Hardware Matrix */}
          <div className="bg-surface-container-lowest/90 backdrop-blur-xl px-3 py-1.5 rounded-lg border border-surface-container-high/90 flex items-center flex-wrap gap-3 shadow-xl">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[18px]">
                videocam
              </span>
              <div className="flex flex-col">
                <span className="font-label-caps text-[9px] text-outline">
                  8x HDR CAM
                </span>
                <span className="font-mono text-[11px] text-primary font-bold">
                  360° @ 60FPS
                </span>
              </div>
            </div>

            <span className="w-px h-5 bg-surface-container-high hidden sm:block" />

            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary-fixed text-[18px]">
                grain
              </span>
              <div className="flex flex-col">
                <span className="font-label-caps text-[9px] text-outline">
                  4x FMCW LiDAR
                </span>
                <span className="font-mono text-[11px] text-primary-fixed font-bold">
                  128-BEAM DUAL
                </span>
              </div>
            </div>

            <span className="w-px h-5 bg-surface-container-high hidden sm:block" />

            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary text-[18px]">
                sensors
              </span>
              <div className="flex flex-col">
                <span className="font-label-caps text-[9px] text-outline">
                  6x 4D RADAR
                </span>
                <span className="font-mono text-[11px] text-secondary font-bold">
                  300m RANGE
                </span>
              </div>
            </div>

            <span className="w-px h-5 bg-surface-container-high hidden sm:block" />

            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-tertiary-fixed-dim text-[18px]">
                wifi_tethering
              </span>
              <div className="flex flex-col">
                <span className="font-label-caps text-[9px] text-outline">
                  FUSION CONFIDENCE
                </span>
                <span className="font-mono text-[11px] text-secondary font-bold">
                  99.84%
                </span>
              </div>
            </div>
          </div>

          {/* Active Bubble Status & Layer Controls */}
          <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center gap-2 bg-surface-container-lowest/90 backdrop-blur-xl px-3 py-1.5 rounded-lg border border-primary/30 shadow-lg">
              <span className="w-2 h-2 rounded-full bg-primary-container shadow-[0_0_10px_rgba(0,240,255,1)] animate-ping" />
              <span className="font-headline font-bold text-xs text-primary tracking-wide uppercase">
                Elastic Safety Bubble: Engaged
              </span>
            </div>

            {/* Layer Filter Selector */}
            <div className="bg-surface-container-lowest/90 backdrop-blur-xl px-1.5 py-1 rounded-lg border border-surface-container-high flex items-center gap-1">
              {(["all", "vision", "lidar", "radar", "segmentation"] as const).map(
                (layer) => (
                  <button
                    key={layer}
                    onClick={() => setActiveLayer(layer)}
                    className={`px-2 py-0.5 font-label-caps text-[9px] rounded uppercase cursor-pointer transition-all ${
                      activeLayer === layer
                        ? "bg-primary-container text-on-primary-container font-bold shadow-[0_0_8px_rgba(0,240,255,0.4)]"
                        : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high"
                    }`}
                  >
                    {layer}
                  </button>
                )
              )}
            </div>
          </div>
        </div>

        {/* INTERACTIVE ACTOR RETICLES */}
        {ACTORS.map((actor) => {
          const isSelected = selectedActor?.id === actor.id;

          const colorClasses = {
            cyan: {
              badge: "text-primary-container shadow-[0_0_12px_rgba(0,240,255,0.4)]",
              dot: "bg-primary-container shadow-[0_0_6px_rgba(0,240,255,1)]",
              box: "border-primary-container/80 bg-primary-container/10",
            },
            amber: {
              badge: "text-tertiary-fixed-dim shadow-[0_0_12px_rgba(255,185,95,0.4)]",
              dot: "bg-tertiary-fixed-dim shadow-[0_0_6px_rgba(255,185,95,1)] animate-ping",
              box: "border-tertiary-fixed-dim/80 bg-tertiary-fixed-dim/15",
            },
            error: {
              badge: "text-error shadow-[0_0_14px_rgba(255,180,171,0.7)]",
              dot: "bg-error shadow-[0_0_8px_rgba(239,68,68,1)] animate-pulse",
              box: "border-error/90 bg-error/20",
            },
            secondary: {
              badge: "text-secondary shadow-[0_0_12px_rgba(78,222,163,0.4)]",
              dot: "bg-secondary shadow-[0_0_6px_rgba(78,222,163,1)]",
              box: "border-secondary/80 bg-secondary/10",
            },
          }[actor.color];

          return (
            <div
              key={actor.id}
              onClick={() => setSelectedActor(isSelected ? null : actor)}
              style={{ top: actor.top, left: actor.left }}
              className="absolute z-30 group cursor-crosshair transition-transform duration-200 hover:scale-105"
            >
              {/* Monospaced Floating Tag */}
              <div
                className={`bg-surface-container-lowest/95 backdrop-blur-md px-2 py-0.5 rounded border border-surface-container-high flex items-center gap-1.5 shadow-lg ${
                  isSelected ? "ring-2 ring-primary-container" : ""
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${colorClasses.dot}`} />
                <span className={`font-mono text-[10px] font-bold ${colorClasses.badge}`}>
                  {actor.badge}
                </span>
              </div>

              {/* 3D Bounding Target Box */}
              <div
                className={`${actor.width} ${actor.height} mt-1 rounded-sm border-2 ${colorClasses.box} relative overflow-hidden transition-all duration-300 group-hover:border-white`}
              >
                {/* Crosshair Corner Marks */}
                <span className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-white" />
                <span className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-white" />
                <span className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-white" />
                <span className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-white" />

                {/* Animated Scan Bar on Hover/Selection */}
                {(isSelected || isRecalculating) && (
                  <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-white to-transparent animate-pulse" />
                )}
              </div>
            </div>
          );
        })}

        {/* SELECTED ACTOR FLOATING INSPECTION CARD */}
        {selectedActor && (
          <div className="absolute top-16 right-4 z-40 w-80 bg-surface-container-lowest/95 backdrop-blur-2xl p-4 rounded-xl border border-primary/50 shadow-[0_0_30px_rgba(0,240,255,0.3)] animate-in fade-in duration-200">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-surface-container-high">
              <div className="flex items-center gap-2">
                <Crosshair className="w-4 h-4 text-primary-container" />
                <span className="font-headline text-xs text-primary font-bold uppercase">
                  Kinematic Inspector
                </span>
              </div>
              <button
                onClick={() => setSelectedActor(null)}
                className="text-on-surface-variant hover:text-primary font-mono text-xs cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="flex flex-col gap-2 font-mono text-xs">
              <div className="flex justify-between">
                <span className="text-outline">TARGET:</span>
                <span className="text-primary font-bold">
                  {selectedActor.name}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-outline">CONFIDENCE:</span>
                <span className="text-secondary font-bold">
                  {selectedActor.confidence}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-outline">DISTANCE:</span>
                <span className="text-on-surface">
                  {selectedActor.distance}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-outline">VELOCITY:</span>
                <span className="text-tertiary-fixed-dim font-bold">
                  {selectedActor.velocity}
                </span>
              </div>
              {selectedActor.ttc && (
                <div className="flex justify-between">
                  <span className="text-outline">TIME TO IMPACT:</span>
                  <span className="text-error font-bold">
                    {selectedActor.ttc}
                  </span>
                </div>
              )}
              <div className="mt-1 p-2 bg-surface-container-low rounded border border-surface-container-high">
                <span className="font-label-caps text-[9px] text-outline block mb-1">
                  TACTICAL RESOLUTION
                </span>
                <span className="text-primary-fixed text-[11px] leading-snug block">
                  {selectedActor.evasionRecommendation}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* BOTTOM HUD DOCK: EGO-VEHICLE ACTUATION & DYNAMICS */}
        <div className="absolute bottom-3 left-3 right-3 z-20 bg-surface-container-lowest/90 backdrop-blur-2xl px-4 py-3 rounded-xl border border-surface-container-high/90 flex flex-wrap items-center justify-between gap-4 shadow-2xl">
          {/* Ego Telemetry Metrics */}
          <div className="flex items-center flex-wrap gap-4 sm:gap-6">
            <div className="flex flex-col">
              <span className="font-label-caps text-[9px] text-outline">
                EGO SPEED
              </span>
              <div className="flex items-baseline gap-1">
                <span className="font-mono text-2xl lg:text-3xl text-primary font-bold tracking-tight">
                  {egoSpeed.toFixed(1)}
                </span>
                <span className="font-mono text-[10px] text-on-surface-variant">
                  KM/H
                </span>
              </div>
            </div>

            <div className="w-px h-8 bg-surface-container-high" />

            <div className="flex flex-col">
              <span className="font-label-caps text-[9px] text-outline">
                TIME-TO-COLLISION (MIN)
              </span>
              <div className="flex items-baseline gap-1">
                <span
                  className={`font-mono text-2xl lg:text-3xl font-bold tracking-tight ${
                    ttcSeconds < 2.0
                      ? "text-error animate-pulse"
                      : "text-secondary"
                  }`}
                >
                  {ttcSeconds.toFixed(2)}
                </span>
                <span className="font-mono text-[10px] text-secondary">
                  SEC
                </span>
              </div>
            </div>

            <div className="w-px h-8 bg-surface-container-high hidden sm:block" />

            <div className="flex flex-col">
              <span className="font-label-caps text-[9px] text-outline">
                DRAC REQUIRED
              </span>
              <div className="flex items-baseline gap-1">
                <span className="font-mono text-2xl lg:text-3xl text-primary-fixed-dim font-bold tracking-tight">
                  {dracValue.toFixed(2)}
                </span>
                <span className="font-mono text-[10px] text-on-surface-variant">
                  m/s²
                </span>
              </div>
            </div>

            <div className="w-px h-8 bg-surface-container-high hidden md:block" />

            <div className="flex flex-col">
              <span className="font-label-caps text-[9px] text-outline">
                ERRATIC BEHAVIOR INDEX
              </span>
              <div className="flex items-baseline gap-1">
                <span className="font-mono text-2xl lg:text-3xl text-tertiary-fixed-dim font-bold tracking-tight">
                  {erraticIndex}
                </span>
                <span className="font-mono text-[10px] text-tertiary-fixed-dim">
                  / 100
                </span>
              </div>
            </div>
          </div>

          {/* Active Tactical Spline Selector & Recalculate CTA */}
          <div className="flex items-center gap-3">
            <div className="flex flex-col items-end">
              <span className="font-label-caps text-[9px] text-outline">
                ACTIVE TACTICAL SPLINE
              </span>
              <span className="font-mono text-xs text-secondary font-bold">
                {activeSpline}
              </span>
            </div>

            <button
              onClick={onRecalculate}
              disabled={isRecalculating}
              className={`bg-primary-container hover:bg-primary-fixed text-on-primary-container px-4 py-2 rounded-md font-headline font-bold text-xs uppercase flex items-center gap-2 transition-all cursor-pointer shadow-[0_0_16px_rgba(0,240,255,0.4)] ${
                isRecalculating ? "opacity-75 animate-pulse" : "active:scale-95"
              }`}
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${
                  isRecalculating ? "animate-spin text-surface-container-lowest" : ""
                }`}
              />
              <span>{isRecalculating ? "SOLVING MESH..." : "RE-CALCULATE MESH"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
