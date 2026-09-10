"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { User, AlertTriangle, Activity, Wifi, ShieldAlert, Menu, X } from "lucide-react";

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onEmergencyOverride: () => void;
  isEmergencyActive: boolean;
  isMobileMenuOpen?: boolean;
  onToggleMobileMenu?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onEmergencyOverride,
  isEmergencyActive,
  isMobileMenuOpen,
  onToggleMobileMenu,
}) => {
  const [timeString, setTimeString] = useState<string>("08:42:19.402");

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const hours = String(now.getUTCHours()).padStart(2, "0");
      const minutes = String(now.getUTCMinutes()).padStart(2, "0");
      const seconds = String(now.getUTCSeconds()).padStart(2, "0");
      const millis = String(now.getUTCMilliseconds()).padStart(3, "0");
      setTimeString(`${hours}:${minutes}:${seconds}.${millis}`);
    }, 47);

    return () => clearInterval(interval);
  }, []);

  const navItems = [
    { id: "perception", label: "Perception & Fusion" },
    { id: "safety-bubble", label: "Adaptive Safety Bubble" },
    { id: "path-generator", label: "Dynamic Path Generator" },
    { id: "risk-matrix", label: "Risk Matrix & Costmap" },
    { id: "actuation", label: "Actuation & CAN-Bus" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-surface-container-lowest/85 backdrop-blur-xl border-b border-surface-container-high/60 shadow-[0_4px_24px_rgba(0,0,0,0.6)]">
      <div className="h-16 w-full px-4 lg:px-6 flex items-center justify-between gap-4">
        {/* Mobile Hamburger Menu Toggle + Brand */}
        <div className="flex items-center gap-3 shrink-0">
          {onToggleMobileMenu && (
            <button
              onClick={onToggleMobileMenu}
              aria-label="Toggle Navigation Drawer"
              className="lg:hidden p-2 rounded-lg bg-surface-container-low border border-surface-container-high text-on-surface hover:text-primary transition-colors cursor-pointer"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5 text-primary" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          )}
          <div className="relative w-9 h-9 flex items-center justify-center rounded-lg bg-surface-container-low border border-primary/30 shadow-[0_0_12px_rgba(0,240,255,0.25)]">
            <Image
              src="/logo.svg"
              alt="SafeDrive Logo"
              width={28}
              height={28}
              className="object-contain"
            />
          </div>
          <div className="flex flex-col">
            <span className="font-headline font-bold text-sm lg:text-base text-primary tracking-tight uppercase leading-none">
              SafeDrive AI Perception Core
            </span>
            <span className="font-mono text-[9px] sm:text-[10px] text-on-surface-variant tracking-wider uppercase">
              Unstructured Road AV Stack // v4.8-IND
            </span>
          </div>
        </div>

        {/* Live HUD Status Pill */}
        <div className="hidden xl:flex items-center gap-3 bg-surface-container-low/90 px-4 py-1.5 rounded-full border border-surface-container-high/80 shadow-[0_0_12px_rgba(0,219,233,0.08)]">
          <div className="flex items-center gap-2">
            <span
              className={`inline-block w-2 h-2 rounded-full ${
                isEmergencyActive
                  ? "bg-error animate-ping shadow-[0_0_8px_rgba(255,180,171,0.9)]"
                  : "bg-secondary shadow-[0_0_8px_rgba(78,222,163,0.8)] animate-pulse"
              }`}
            />
            <span
              className={`font-label-telemetry uppercase text-xs ${
                isEmergencyActive ? "text-error font-bold" : "text-secondary"
              }`}
            >
              {isEmergencyActive ? "OVERRIDE ENGAGED" : "HUD Telemetry Online"}
            </span>
          </div>
          <span className="text-outline-variant font-mono text-xs">|</span>
          <span className="font-mono text-xs text-primary-fixed">120 FPS</span>
          <span className="text-outline-variant font-mono text-xs">|</span>
          <div className="flex items-center gap-1 font-mono text-xs text-on-surface-variant">
            <Wifi className="w-3 h-3 text-secondary" />
            <span>CAN-Bus Linked</span>
          </div>
          <span className="text-outline-variant font-mono text-xs">|</span>
          <span className="font-mono text-xs text-outline tracking-wider">
            UTC {timeString}
          </span>
        </div>

        {/* Desktop Quick Subsystem Navigation */}
        <nav className="hidden 2xl:flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`px-3 py-1.5 font-label-caps text-[11px] rounded transition-all cursor-pointer ${
                  isActive
                    ? "bg-primary-container text-on-primary-container font-bold shadow-[0_0_14px_rgba(0,240,255,0.4)]"
                    : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high"
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Action Controls & Emergency Override */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onEmergencyOverride}
            className={`px-3.5 py-1.5 rounded font-label-caps text-xs tracking-wider transition-all flex items-center gap-1.5 cursor-pointer ${
              isEmergencyActive
                ? "bg-secondary text-surface-container-lowest font-bold shadow-[0_0_16px_rgba(78,222,163,0.7)] animate-bounce"
                : "bg-error-container hover:bg-error text-on-error-container hover:text-on-error shadow-[0_0_14px_rgba(239,68,68,0.45)] active:scale-95"
            }`}
          >
            {isEmergencyActive ? (
              <>
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>Resume Autonomous</span>
              </>
            ) : (
              <>
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Emergency Override</span>
              </>
            )}
          </button>

          <div
            title="Tele-Operations Operator #IND-409"
            className="w-8 h-8 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center text-primary shadow-[0_0_8px_rgba(0,240,255,0.3)]"
          >
            <User className="w-4 h-4" />
          </div>
        </div>
      </div>
    </header>
  );
};
