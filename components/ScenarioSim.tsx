"use client";

import React from "react";
import {
  Thermometer,
  Sun,
  CloudFog,
  CloudRain,
  Flame,
  Radio,
  CheckCircle2,
  Circle,
} from "lucide-react";
import type { SplineCandidate } from "@/types/trajectory";

interface ScenarioSimProps {
  weather: string;
  setWeather: (w: string) => void;
  selectedSector: string;
  setSelectedSector: (s: string) => void;
  onTriggerChaos: () => void;
  isChaosActive: boolean;
  candidates?: SplineCandidate[];
}

export const ScenarioSim: React.FC<ScenarioSimProps> = ({
  weather,
  setWeather,
  selectedSector,
  setSelectedSector,
  onTriggerChaos,
  isChaosActive,
}) => {
  const weatherOptions = [
    { id: "DUSK GLARE", label: "DUSK GLARE", icon: Sun },
    { id: "HEAVY SMOG", label: "HEAVY SMOG", icon: CloudFog },
    { id: "MONSOON", label: "MONSOON", icon: CloudRain },
  ];

  const sectors = [
    {
      id: "IND-DEL-NH48",
      title: "NH48 Diversion Construction",
      desc: "Loose gravel, broken barricades & dust",
    },
    {
      id: "IND-DEL-BAZAAR",
      title: "Old Delhi Dense Bazaar",
      desc: "Pedestrian density > 120/100m² & handcarts",
    },
    {
      id: "IND-BLR-ORR",
      title: "Outer Ring Road Bangalore",
      desc: "Unmarked lane merges, high speed 2W swarms",
    },
    {
      id: "IND-BOM-WEH",
      title: "Mumbai Western Express Flyover",
      desc: "Monsoon hydroplaning risk & tight cut-ins",
    },
  ];

  return (
    <div className="bg-surface-container border border-surface-container-high/80 p-5 lg:p-6 rounded-2xl shadow-xl flex flex-col justify-between">
      <div>
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-surface-container-low border border-primary/30">
              <Thermometer className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="font-headline font-bold text-base lg:text-lg text-on-surface uppercase tracking-tight">
                Scenario & Sensor Sim
              </h2>
              <span className="font-mono text-[11px] text-outline">
                Environmental & Kinetic Stress Injector
              </span>
            </div>
          </div>
          <span className="bg-surface-container-highest px-3 py-1 text-tertiary-fixed-dim font-mono text-xs rounded-full border border-tertiary-fixed-dim/30 flex items-center gap-1.5 shadow-[0_0_8px_rgba(255,185,95,0.2)]">
            <Radio className="w-3.5 h-3.5" />
            LIVE INJECTION
          </span>
        </div>

        <p className="text-body-sm text-on-surface-variant mb-4">
          Test safety envelope algorithms under severe Indian environmental degraded perception regimes:
        </p>

        {/* Weather Injection Toggles */}
        <div className="flex flex-col gap-1.5 mb-4">
          <label className="font-label-caps text-[10px] text-outline">
            ENVIRONMENTAL WEATHER REGIME
          </label>
          <div className="grid grid-cols-3 gap-2">
            {weatherOptions.map((opt) => {
              const isSelected = weather === opt.id;
              const Icon = opt.icon;
              return (
                <button
                  key={opt.id}
                  onClick={() => setWeather(opt.id)}
                  className={`py-2 px-2.5 rounded-lg font-mono text-[11px] font-bold transition-all flex flex-col items-center justify-center gap-1 cursor-pointer ${
                    isSelected
                      ? "bg-primary-container text-on-primary-container shadow-[0_0_14px_rgba(0,240,255,0.4)]"
                      : "bg-surface-container-highest hover:bg-surface-container-high text-on-surface"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{opt.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Road Sector Selection */}
        <div className="flex flex-col gap-1.5 mb-4">
          <label className="font-label-caps text-[10px] text-outline">
            UNSTRUCTURED ROAD SECTOR REGIME
          </label>
          <div className="flex flex-col gap-1.5">
            {sectors.map((sector) => {
              const isSelected = selectedSector === sector.id;
              return (
                <div
                  key={sector.id}
                  onClick={() => setSelectedSector(sector.id)}
                  className={`flex items-center justify-between p-2.5 rounded-lg cursor-pointer transition-all border ${
                    isSelected
                      ? "bg-surface-container-low border-primary/40 shadow-[0_0_12px_rgba(0,240,255,0.15)]"
                      : "bg-surface-container-lowest border-surface-container-high hover:bg-surface-container-high/50"
                  }`}
                >
                  <div className="flex flex-col">
                    <span
                      className={`font-mono text-xs font-semibold ${
                        isSelected ? "text-primary" : "text-on-surface"
                      }`}
                    >
                      {sector.title}
                    </span>
                    <span className="font-mono text-[10px] text-outline">
                      {sector.desc}
                    </span>
                  </div>

                  {isSelected ? (
                    <CheckCircle2 className="w-4 h-4 text-secondary shrink-0" />
                  ) : (
                    <Circle className="w-4 h-4 text-outline shrink-0" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Chaotic Edge-Case Injection Trigger CTA */}
      <button
        onClick={onTriggerChaos}
        className={`w-full py-3 px-4 rounded-xl font-headline font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg active:scale-95 ${
          isChaosActive
            ? "bg-error text-surface-container-lowest shadow-[0_0_20px_rgba(239,68,68,0.7)] animate-bounce"
            : "bg-surface-container-highest hover:bg-error-container hover:text-on-error-container text-on-surface border border-error/30"
        }`}
      >
        <Flame className="w-4 h-4 text-tertiary-fixed-dim" />
        <span>
          {isChaosActive
            ? "CHAOS INJECTION TRIGGERED // HARD AVOIDANCE ACTIVE"
            : "Trigger Chaotic Edge-Case Injection"}
        </span>
      </button>
    </div>
  );
};
