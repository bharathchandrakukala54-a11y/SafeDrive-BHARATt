"use client";

import React from "react";
import {
  Radar,
  Shield,
  GitBranch,
  AlertTriangle,
  Sliders,
  Play,
  Pause,
  MapPin,
  Cpu,
  Layers,
} from "lucide-react";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isSimRunning: boolean;
  setIsSimRunning: (val: boolean | ((prev: boolean) => boolean)) => void;
  threatLevel: number;
  roadSector: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  isSimRunning,
  setIsSimRunning,
  threatLevel,
  roadSector,
}) => {
  const menuItems = [
    { id: "perception", label: "Perception Fusion", icon: Radar },
    { id: "safety-bubble", label: "Safety Bubble", icon: Shield },
    { id: "path-generator", label: "Path Generator", icon: GitBranch },
    { id: "risk-matrix", label: "Risk Matrix & Costmap", icon: AlertTriangle },
    { id: "actuation", label: "Actuation Rails", icon: Sliders },
  ];

  return (
    <aside className="fixed left-0 top-16 bottom-0 w-64 lg:w-72 bg-surface-container-lowest/95 backdrop-blur-2xl z-40 flex flex-col justify-between py-4 border-r border-surface-container-high/80 shadow-[4px_0_24px_rgba(0,0,0,0.6)]">
      <div className="flex flex-col gap-5 px-4">
        {/* Subsystem Telemetry Mini Box */}
        <div className="flex flex-col gap-2 bg-surface-container-low/80 p-3 rounded-lg border border-surface-container-high/70 shadow-inner">
          <div className="flex items-center justify-between">
            <span className="font-label-caps text-on-surface-variant text-[10px]">
              Cockpit Mode
            </span>
            <span className="font-mono text-xs text-primary font-bold px-1.5 py-0.5 rounded bg-surface-container-highest">
              AUTONOMOUS L4
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="font-label-caps text-on-surface-variant text-[10px]">
              Threat Index
            </span>
            <span
              className={`font-mono text-xs font-bold ${
                threatLevel > 60
                  ? "text-error animate-pulse"
                  : threatLevel > 30
                  ? "text-tertiary-fixed-dim"
                  : "text-secondary"
              }`}
            >
              {threatLevel > 60
                ? `CRITICAL // ${threatLevel}%`
                : threatLevel > 30
                ? `ELEVATED // ${threatLevel}%`
                : `NOMINAL // ${threatLevel}%`}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="font-label-caps text-on-surface-variant text-[10px]">
              Dynamic Latency
            </span>
            <span className="font-mono text-xs text-primary-fixed">4.2 ms</span>
          </div>
        </div>

        {/* Primary Subsystem Navigation */}
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-mono text-outline uppercase px-2 mb-1 tracking-wider">
            Subsystem Rails
          </span>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-md transition-all text-left cursor-pointer group ${
                  isActive
                    ? "bg-primary-container text-on-primary-container font-bold shadow-[0_0_18px_rgba(0,240,255,0.35)]"
                    : "text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface"
                }`}
              >
                <Icon
                  className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                    isActive ? "text-on-primary-container" : "text-primary/70"
                  }`}
                />
                <span className="font-mono text-xs tracking-tight">
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Road Sector & Sim Trigger Bottom Rail */}
      <div className="px-4 flex flex-col gap-3">
        <div className="bg-surface-container-low/90 p-3 rounded-lg border border-surface-container-high/80 flex flex-col gap-1.5">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-1 text-[10px] font-label-caps text-outline">
              <MapPin className="w-3 h-3 text-primary-fixed" />
              <span>ROAD SECTOR</span>
            </div>
            <span className="font-mono text-[11px] text-primary-fixed font-semibold">
              {roadSector}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-1 text-[10px] font-label-caps text-outline">
              <Cpu className="w-3 h-3 text-tertiary-fixed-dim" />
              <span>DENSITY FLUX</span>
            </div>
            <span className="font-mono text-[11px] text-tertiary-fixed-dim font-bold">
              CRITICAL (HIGH)
            </span>
          </div>
        </div>

        <button
          onClick={() => setIsSimRunning((prev) => !prev)}
          className={`w-full py-2.5 px-3 rounded-md font-headline font-bold text-xs uppercase flex items-center justify-center gap-2 cursor-pointer transition-all shadow-[0_0_16px_rgba(0,240,255,0.3)] ${
            isSimRunning
              ? "bg-primary-container hover:bg-primary-fixed text-on-primary-container hover:shadow-[0_0_24px_rgba(0,240,255,0.6)]"
              : "bg-surface-container-high hover:bg-surface-container-highest text-primary border border-primary/40"
          }`}
        >
          {isSimRunning ? (
            <>
              <Pause className="w-4 h-4" />
              <span>Sim Active (Live)</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4" />
              <span>Launch Live Sim</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
};
