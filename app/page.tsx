"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { TelemetryBanner } from "@/components/TelemetryBanner";
import { PerceptionHUD } from "@/components/PerceptionHUD";
import { AdaptiveSafetyBubble } from "@/components/AdaptiveSafetyBubble";
import { OccupancyCostmap } from "@/components/OccupancyCostmap";
import { TrajectoryRollout, SplineCandidate } from "@/components/TrajectoryRollout";
import { ActuationController } from "@/components/ActuationController";
import { ScenarioSim } from "@/components/ScenarioSim";
import { EmergencyOverrideModal } from "@/components/EmergencyOverrideModal";
import { useSupabaseTelemetry } from "@/hooks/useSupabaseTelemetry";

const INITIAL_CANDIDATES: SplineCandidate[] = [
  {
    id: "spline-alpha",
    name: "Spline Alpha (A-1)",
    maneuver: "Left Bypass with Micro-Pinch",
    clearance: "94 / 100",
    clearanceScore: 94,
    jerkComfort: "88 / 100",
    jerkScore: 88,
    headway: "+18.4m",
    riskPenalty: "-4.2",
    compositeScore: 91.2,
    status: "ENGAGED",
    statusReason: "SELECTED & ENGAGED",
    color: "secondary",
  },
  {
    id: "spline-beta",
    name: "Spline Beta (B-4)",
    maneuver: "Aggressive Right Overtake",
    clearance: "48 / 100",
    clearanceScore: 48,
    jerkComfort: "64 / 100",
    jerkScore: 64,
    headway: "+4.2m (Low)",
    riskPenalty: "-38.6",
    compositeScore: 52.4,
    status: "REJECTED",
    statusReason: "REJECTED [TTC BREACH]",
    color: "error",
  },
  {
    id: "spline-gamma",
    name: "Spline Gamma (G-2)",
    maneuver: "Emergency In-Lane Stop",
    clearance: "78 / 100",
    clearanceScore: 78,
    jerkComfort: "41 / 100 (Harsh)",
    jerkScore: 41,
    headway: "0.0m",
    riskPenalty: "-18.0",
    compositeScore: 64.0,
    status: "STANDBY",
    statusReason: "STANDBY REDUNDANCY",
    color: "tertiary",
  },
  {
    id: "spline-delta",
    name: "Spline Delta (D-5)",
    maneuver: "Shoulder Creep & Yield",
    clearance: "82 / 100",
    clearanceScore: 82,
    jerkComfort: "79 / 100",
    jerkScore: 79,
    headway: "+12.0m",
    riskPenalty: "-9.4",
    compositeScore: 81.6,
    status: "STANDBY",
    statusReason: "STANDBY ALTERNATE",
    color: "secondary",
  },
];

export default function Home() {
  const [activeTab, setActiveTab] = useState<string>("perception");
  const [isSimRunning, setIsSimRunning] = useState<boolean>(true);
  const [threatLevel, setThreatLevel] = useState<number>(12);
  const [chaosFlux, setChaosFlux] = useState<number>(88.4);
  const [safetyState, setSafetyState] = useState<string>("OPTIMAL // L4 ACTIVE");
  const [latencyMs, setLatencyMs] = useState<number>(11.8);

  // Ego Dynamics
  const [egoSpeed, setEgoSpeed] = useState<number>(38.4);
  const [ttcSeconds, setTtcSeconds] = useState<number>(2.84);
  const [dracValue, setDracValue] = useState<number>(1.42);
  const [erraticIndex, setErraticIndex] = useState<number>(87);
  const [steeringAngle, setSteeringAngle] = useState<number>(-4.2);
  const [throttlePercent, setThrottlePercent] = useState<number>(28.0);
  const [lateralG, setLateralG] = useState<number>(0.18);
  const [xteMeters, setXteMeters] = useState<number>(0.042);
  const [brakeStatus, setBrakeStatus] = useState<string>("STANDBY");

  // Trajectory Candidates
  const [candidates, setCandidates] = useState<SplineCandidate[]>(INITIAL_CANDIDATES);
  const [selectedSplineId, setSelectedSplineId] = useState<string>("spline-alpha");
  const [activeSpline, setActiveSpline] = useState<string>("SPLINE ALPHA [LEFT BYPASS]");
  const [isRecalculating, setIsRecalculating] = useState<boolean>(false);

  // Simulation & Weather Presets
  const [weather, setWeather] = useState<string>("HEAVY SMOG");
  const [selectedSector, setSelectedSector] = useState<string>("IND-DEL-NH48");
  const [isChaosActive, setIsChaosActive] = useState<boolean>(false);

  // Emergency Modal & Mobile Navigation
  const [isOverrideModalOpen, setIsOverrideModalOpen] = useState<boolean>(false);
  const [isOverrideActive, setIsOverrideActive] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  // ── Supabase Integration ────────────────────────────────────────────────
  const telemetrySnapshot = useMemo(
    () => ({
      speed_kmph: egoSpeed,
      steering_angle_deg: steeringAngle,
      brake_applied: brakeStatus !== "STANDBY",
    }),
    [egoSpeed, steeringAngle, brakeStatus]
  );
  const { dbStatus, lastPersistedAt, flushNow } = useSupabaseTelemetry(
    telemetrySnapshot,
    isSimRunning
  );

  // Dynamic Telemetry Loop
  useEffect(() => {
    if (!isSimRunning) return;

    const interval = setInterval(() => {
      // Small realistic fluctuations
      setEgoSpeed((prev) => +(prev + (Math.random() - 0.5) * 0.6).toFixed(1));
      setTtcSeconds((prev) => {
        const next = prev + (Math.random() - 0.5) * 0.05;
        return +(Math.max(1.8, Math.min(3.8, next))).toFixed(2);
      });
      setLatencyMs(+(11.8 + (Math.random() - 0.5) * 0.8).toFixed(1));
      setSteeringAngle((prev) => +(-4.2 + (Math.random() - 0.5) * 0.4).toFixed(1));
      setThrottlePercent((prev) => +(28.0 + (Math.random() - 0.5) * 1.5).toFixed(1));
      setLateralG((prev) => +(0.18 + (Math.random() - 0.5) * 0.02).toFixed(2));
      setXteMeters((prev) => +(0.042 + (Math.random() - 0.5) * 0.006).toFixed(3));
    }, 400);

    return () => clearInterval(interval);
  }, [isSimRunning]);

  // Recalculate Mesh Simulation
  const handleRecalculate = () => {
    setIsRecalculating(true);
    setTimeout(() => {
      setCandidates((prev) =>
        prev.map((c) => ({
          ...c,
          compositeScore:
            c.id === "spline-alpha"
              ? +(91.0 + Math.random() * 2).toFixed(1)
              : +(c.compositeScore + (Math.random() - 0.5) * 2).toFixed(1),
        }))
      );
      setSelectedSplineId("spline-alpha");
      setActiveSpline("SPLINE ALPHA [LEFT BYPASS]");
      setIsRecalculating(false);
      setIsChaosActive(false);
      setThreatLevel(12);
      setSafetyState("OPTIMAL // L4 ACTIVE");
      setBrakeStatus("STANDBY");
      // Persist recalculated state immediately
      flushNow();
    }, 600);
  };

  // Spline Selection
  const handleSelectSpline = (id: string) => {
    setSelectedSplineId(id);
    const chosen = candidates.find((c) => c.id === id);
    if (chosen) {
      setActiveSpline(chosen.name.toUpperCase());
    }
  };

  // Trigger Chaotic Edge-Case Injection
  const handleTriggerChaos = () => {
    setIsChaosActive(true);
    setThreatLevel(88);
    setChaosFlux(96.2);
    setSafetyState("EVASION ENGAGED // HARD AVOIDANCE");
    setTtcSeconds(1.42);
    setDracValue(3.18);
    setBrakeStatus("ACTIVE (24 BAR)");
    setEgoSpeed(24.5);
    setSteeringAngle(-12.8);

    // Swap active trajectory to emergency bypass
    setCandidates((prev) =>
      prev.map((c) => {
        if (c.id === "spline-gamma") {
          return {
            ...c,
            status: "ENGAGED",
            statusReason: "EMERGENCY ENGAGED",
            color: "secondary",
            compositeScore: 95.8,
          };
        }
        if (c.id === "spline-alpha") {
          return {
            ...c,
            status: "STANDBY",
            statusReason: "STANDBY BYPASS",
            color: "tertiary",
          };
        }
        return c;
      })
    );
    setSelectedSplineId("spline-gamma");
    setActiveSpline("SPLINE GAMMA [EMERGENCY EVASION]");

    // Persist chaos state immediately
    flushNow();

    // Auto-normalize after 6 seconds
    setTimeout(() => {
      handleRecalculate();
    }, 6000);
  };

  // Emergency Override Confirmation
  const handleConfirmOverride = () => {
    setIsOverrideActive((prev) => !prev);
    setIsOverrideModalOpen(false);
    if (!isOverrideActive) {
      setSafetyState("MANUAL TELE-OP OVERRIDE");
      setThreatLevel(45);
      setBrakeStatus("PRE-FILLED");
    } else {
      setSafetyState("OPTIMAL // L4 ACTIVE");
      setThreatLevel(12);
      setBrakeStatus("STANDBY");
    }
  };

  return (
    <div className="min-h-screen bg-background text-on-surface flex flex-col antialiased">
      {/* Top HUD Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onEmergencyOverride={() => setIsOverrideModalOpen(true)}
        isEmergencyActive={isOverrideActive}
        isMobileMenuOpen={isMobileMenuOpen}
        onToggleMobileMenu={() => setIsMobileMenuOpen((prev) => !prev)}
      />

      {/* Left HUD Telemetry Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isSimRunning={isSimRunning}
        setIsSimRunning={setIsSimRunning}
        threatLevel={threatLevel}
        roadSector={selectedSector}
        isMobileOpen={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Subsystem Rails Container */}
      <div className="pl-0 lg:pl-72 flex-1 flex flex-col pt-16">
        <main className="w-full bg-background min-h-screen pb-12">
          {/* Primary Telemetry Banner */}
          <TelemetryBanner
            chaosFlux={chaosFlux}
            safetyState={safetyState}
            latencyMs={latencyMs}
            dbStatus={dbStatus}
            lastPersistedAt={lastPersistedAt}
          />

          {/* Core HUD Content Array */}
          <div className="p-4 lg:p-6 flex flex-col gap-6 max-w-7xl mx-auto w-full">
            {/* SECTION 1: HERO HUD & PERCEPTION COCKPIT */}
            <section id="perception">
              <PerceptionHUD
                egoSpeed={egoSpeed}
                ttcSeconds={ttcSeconds}
                dracValue={dracValue}
                erraticIndex={erraticIndex}
                activeSpline={activeSpline}
                onRecalculate={handleRecalculate}
                isRecalculating={isRecalculating}
              />
            </section>

            {/* SECTION 2: ADAPTIVE SAFETY BUBBLE vs RIGID BOX & COSTMAP */}
            <section
              id="safety-bubble"
              className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch"
            >
              {/* Left: Elastic Safety Envelope Visual Explainer (7 cols) */}
              <div className="lg:col-span-7 flex flex-col">
                <AdaptiveSafetyBubble />
              </div>

              {/* Right: Real-time Costmap & Risk Matrix (5 cols) */}
              <div id="risk-matrix" className="lg:col-span-5 flex flex-col">
                <OccupancyCostmap />
              </div>
            </section>

            {/* SECTION 3: MULTI-TRAJECTORY ROLLOUT CANDIDATES */}
            <section id="path-generator">
              <TrajectoryRollout
                candidates={candidates}
                selectedSplineId={selectedSplineId}
                onSelectSpline={handleSelectSpline}
              />
            </section>

            {/* SECTION 4: VEHICLE CONTROLLER & CAN-BUS ACTUATION + SIMULATION */}
            <section
              id="actuation"
              className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-stretch"
            >
              {/* CAN-BUS Actuation Telemetry (8 cols) */}
              <div className="xl:col-span-8 flex flex-col">
                <ActuationController
                  steeringAngle={steeringAngle}
                  throttlePercent={throttlePercent}
                  brakeStatus={brakeStatus}
                  lateralG={lateralG}
                  xteMeters={xteMeters}
                />
              </div>

              {/* Live Simulation Scenarios & Weather Injection (4 cols) */}
              <div className="xl:col-span-4 flex flex-col">
                <ScenarioSim
                  weather={weather}
                  setWeather={setWeather}
                  selectedSector={selectedSector}
                  setSelectedSector={setSelectedSector}
                  onTriggerChaos={handleTriggerChaos}
                  isChaosActive={isChaosActive}
                />
              </div>
            </section>
          </div>
        </main>
      </div>

      {/* Emergency Override Modal */}
      <EmergencyOverrideModal
        isOpen={isOverrideModalOpen}
        onClose={() => setIsOverrideModalOpen(false)}
        onConfirmOverride={handleConfirmOverride}
        isOverrideActive={isOverrideActive}
      />
    </div>
  );
}
