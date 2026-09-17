"use client";

import React from "react";
import { ShieldCheck, Flame, Radio, Database } from "lucide-react";
import type { DbStatus } from "@/hooks/useSupabaseTelemetry";

interface TelemetryBannerProps {
  chaosFlux: number;
  safetyState: string;
  latencyMs: number;
  dbStatus?: DbStatus;
  lastPersistedAt?: Date | null;
}

const DB_STATUS_CONFIG: Record<
  DbStatus,
  { label: string; dotClass: string; textClass: string }
> = {
  connecting: {
    label: "CONNECTING",
    dotClass: "bg-on-surface-variant animate-pulse",
    textClass: "text-on-surface-variant",
  },
  live: {
    label: "SUPABASE LIVE",
    dotClass:
      "bg-secondary shadow-[0_0_8px_rgba(78,222,163,0.9)] animate-ping",
    textClass: "text-secondary",
  },
  idle: {
    label: "SUPABASE IDLE",
    dotClass: "bg-secondary/50",
    textClass: "text-secondary/70",
  },
  error: {
    label: "DB ERROR",
    dotClass:
      "bg-error shadow-[0_0_8px_rgba(239,68,68,0.9)] animate-pulse",
    textClass: "text-error",
  },
};

export const TelemetryBanner: React.FC<TelemetryBannerProps> = ({
  chaosFlux,
  safetyState,
  latencyMs,
  dbStatus,
  lastPersistedAt,
}) => {
  const dbCfg = dbStatus ? DB_STATUS_CONFIG[dbStatus] : null;

  return (
    <div className="w-full bg-surface-container-lowest border-b border-surface-container-high/80 px-4 lg:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 shadow-md">
      <div className="flex items-center flex-wrap gap-2.5">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-secondary shadow-[0_0_10px_rgba(78,222,163,0.9)] animate-pulse" />
          <span className="font-headline font-bold text-xs lg:text-sm text-primary tracking-tight">
            ADAPTIVE COLLISION ENGINE
          </span>
        </div>

        <span className="bg-surface-container-high border border-surface-container-highest px-2 py-0.5 text-secondary font-mono text-[10px] rounded uppercase flex items-center gap-1">
          <Radio className="w-3 h-3 text-secondary" />
          CAN 2.0B LOCKED
        </span>

        <span className="bg-surface-container-high border border-surface-container-highest px-2 py-0.5 text-primary-fixed-dim font-mono text-[10px] rounded uppercase">
          LATENCY: {latencyMs.toFixed(1)}ms
        </span>

        <span className="hidden sm:inline-flex bg-surface-container-high border border-surface-container-highest px-2 py-0.5 text-on-surface-variant font-mono text-[10px] rounded uppercase">
          SEED: IND-URBAN-BETA.09
        </span>

        {/* Supabase live DB badge */}
        {dbCfg && (
          <span className="hidden md:inline-flex items-center gap-1.5 bg-surface-container-high border border-surface-container-highest px-2 py-0.5 font-mono text-[10px] rounded uppercase">
            <Database className={`w-3 h-3 ${dbCfg.textClass}`} />
            <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${dbCfg.dotClass}`} />
            <span className={dbCfg.textClass}>{dbCfg.label}</span>
            {lastPersistedAt && dbStatus === "live" && (
              <span className="text-outline ml-0.5">
                {lastPersistedAt.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                })}
              </span>
            )}
          </span>
        )}
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center bg-surface-container-low border border-surface-container-high px-2.5 py-1 rounded gap-1.5">
          <Flame className="w-3.5 h-3.5 text-tertiary-fixed-dim" />
          <span className="font-label-caps text-[10px] text-on-surface-variant">
            CHAOS FLUX
          </span>
          <span className="font-mono text-xs text-tertiary-fixed-dim font-bold">
            {chaosFlux.toFixed(1)} / 100
          </span>
        </div>

        <div className="flex items-center bg-surface-container-low border border-surface-container-high px-2.5 py-1 rounded gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-secondary" />
          <span className="font-label-caps text-[10px] text-on-surface-variant">
            SAFETY
          </span>
          <span className="font-mono text-xs text-secondary font-bold">
            {safetyState}
          </span>
        </div>
      </div>
    </div>
  );
};
