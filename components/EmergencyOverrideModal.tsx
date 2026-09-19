"use client";

import React from "react";
import { AlertTriangle, ShieldOff, RotateCcw } from "lucide-react";

interface EmergencyOverrideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmOverride: () => void;
  isOverrideActive: boolean;
}

export const EmergencyOverrideModal: React.FC<EmergencyOverrideModalProps> = ({
  isOpen,
  onClose,
  onConfirmOverride,
  isOverrideActive,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-surface-container-lowest border-2 border-error p-6 rounded-2xl shadow-[0_0_50px_rgba(239,68,68,0.5)] flex flex-col gap-4">
        <div className="flex items-center gap-3 text-error pb-3 border-b border-surface-container-high">
          <div className="p-3 bg-error/20 rounded-xl">
            <AlertTriangle className="w-7 h-7 text-error animate-pulse" />
          </div>
          <div>
            <h3 className="font-headline font-bold text-lg uppercase tracking-tight text-error">
              {isOverrideActive
                ? "Autonomous Stack Disengaged"
                : "Confirm Manual Emergency Override"}
            </h3>
            <span className="font-mono text-xs text-on-surface-variant">
              CAN-Bus Arbitration Level 0 // Hard Kill-Switch
            </span>
          </div>
        </div>

        <p className="text-body-md text-on-surface leading-relaxed">
          {isOverrideActive
            ? "Vehicle drive-by-wire controller is currently locked to Tele-Operations Remote Station #IND-409. Autonomous spline planner is idling in passive observation mode."
            : "Triggering Emergency Override will instantly sever the autonomous spline planner actuators, pre-fill hydraulic line pressure to 24 BAR, and hand off steering to Remote Tele-Operations."}
        </p>

        <div className="bg-surface-container-low p-3.5 rounded-xl border border-surface-container-high flex flex-col gap-2 font-mono text-xs">
          <div className="flex justify-between items-center">
            <span className="text-outline">ARBITRATION STATUS:</span>
            <span className="text-primary font-bold">
              {isOverrideActive ? "TELE-OP OVERRIDE" : "AUTONOMOUS L4 PRIMARY"}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-outline">HYDRAULIC PRE-FILL:</span>
            <span className="text-error font-bold">
              {isOverrideActive ? "24.0 BAR (STANDBY)" : "4.8 BAR (NOMINAL)"}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-outline">WATCHDOG LATENCY:</span>
            <span className="text-secondary font-bold">0.8 ms HARDWARE DEDICATED</span>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-mono text-xs font-semibold cursor-pointer transition-colors"
          >
            Dismiss
          </button>

          <button
            onClick={onConfirmOverride}
            className={`px-5 py-2.5 rounded-lg font-headline font-bold text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-lg transition-all ${
              isOverrideActive
                ? "bg-secondary hover:bg-secondary-fixed text-surface-container-lowest shadow-[0_0_16px_rgba(78,222,163,0.5)]"
                : "bg-error hover:bg-red-600 text-white shadow-[0_0_20px_rgba(239,68,68,0.6)]"
            }`}
          >
            {isOverrideActive ? (
              <>
                <RotateCcw className="w-4 h-4" />
                <span>Re-Engage Autonomous L4</span>
              </>
            ) : (
              <>
                <ShieldOff className="w-4 h-4" />
                <span>Execute Emergency Override</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
