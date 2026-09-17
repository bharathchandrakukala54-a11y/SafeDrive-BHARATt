/**
 * useSupabaseTelemetry
 *
 * Periodically persists live simulation telemetry to Supabase
 * (vehicle_telemetry table) every PERSIST_INTERVAL_MS milliseconds.
 *
 * Also provides `dbStatus` so the UI can show a live connection badge.
 */

"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { insertTestTelemetryRow, ensureTestVehicleExists } from "@/lib/telemetry";

export type DbStatus = "connecting" | "live" | "error" | "idle";

export interface TelemetrySnapshot {
  speed_kmph: number;
  steering_angle_deg: number;
  brake_applied: boolean;
  latitude?: number;
  longitude?: number;
}

const PERSIST_INTERVAL_MS = 5000; // write to Supabase every 5 seconds
const DEFAULT_COORDS = { latitude: 28.6139, longitude: 77.209 }; // New Delhi

export function useSupabaseTelemetry(
  snapshot: TelemetrySnapshot,
  isSimRunning: boolean
) {
  const [dbStatus, setDbStatus] = useState<DbStatus>("connecting");
  const [lastPersistedAt, setLastPersistedAt] = useState<Date | null>(null);
  const vehicleIdRef = useRef<string | null>(null);
  const snapshotRef = useRef(snapshot);

  // Keep ref in sync so the interval always reads the latest values
  useEffect(() => {
    snapshotRef.current = snapshot;
  }, [snapshot]);

  // Ensure vehicle row exists once on mount
  useEffect(() => {
    let cancelled = false;
    ensureTestVehicleExists()
      .then((id) => {
        if (!cancelled) {
          vehicleIdRef.current = id;
          setDbStatus("idle");
        }
      })
      .catch((err) => {
        console.error("[useSupabaseTelemetry] vehicle bootstrap error:", err);
        if (!cancelled) setDbStatus("error");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Periodic persist loop
  useEffect(() => {
    if (!isSimRunning) return;
    if (dbStatus === "connecting" || dbStatus === "error") return;

    const interval = setInterval(async () => {
      if (!vehicleIdRef.current) return;
      const snap = snapshotRef.current;
      try {
        setDbStatus("live");
        await insertTestTelemetryRow({
          vehicle_id: vehicleIdRef.current,
          speed_kmph: snap.speed_kmph,
          steering_angle_deg: snap.steering_angle_deg,
          brake_applied: snap.brake_applied,
          latitude: snap.latitude ?? DEFAULT_COORDS.latitude,
          longitude: snap.longitude ?? DEFAULT_COORDS.longitude,
        });
        setLastPersistedAt(new Date());
      } catch (err) {
        console.error("[useSupabaseTelemetry] persist error:", err);
        setDbStatus("error");
      }
    }, PERSIST_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [isSimRunning, dbStatus]);

  // Manual flush (e.g., on chaos trigger or recalculate)
  const flushNow = useCallback(async () => {
    if (!vehicleIdRef.current) return;
    const snap = snapshotRef.current;
    try {
      setDbStatus("live");
      await insertTestTelemetryRow({
        vehicle_id: vehicleIdRef.current,
        speed_kmph: snap.speed_kmph,
        steering_angle_deg: snap.steering_angle_deg,
        brake_applied: snap.brake_applied,
        latitude: snap.latitude ?? DEFAULT_COORDS.latitude,
        longitude: snap.longitude ?? DEFAULT_COORDS.longitude,
      });
      setLastPersistedAt(new Date());
    } catch (err) {
      console.error("[useSupabaseTelemetry] manual flush error:", err);
      setDbStatus("error");
    }
  }, []);

  return { dbStatus, lastPersistedAt, flushNow };
}
