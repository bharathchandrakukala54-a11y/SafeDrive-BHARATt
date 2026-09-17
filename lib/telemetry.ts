import { supabase } from "./supabase";
import { Database } from "@/types/supabase";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type TelemetryInsert = any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type TelemetryRow = any;

const DEFAULT_TEST_VEHICLE_ID = "00000000-0000-0000-0000-000000000001";

/**
 * Ensures a test vehicle exists before inserting telemetry
 * (to satisfy foreign key constraint on vehicle_telemetry.vehicle_id)
 */
export async function ensureTestVehicleExists(vehicleId = DEFAULT_TEST_VEHICLE_ID): Promise<string> {
  const { data: existing } = await supabase
    .from("vehicles")
    .select("id")
    .eq("id", vehicleId)
    .maybeSingle();

  if (existing?.id) {
    return existing.id;
  }

  const { data: created, error } = await (supabase as any)
    .from("vehicles")
    .upsert({
      id: vehicleId,
      name: "SafeDrive Test Rig Alpha",
      sensor_rig: "Camera (1080p) + Ultrasonic Array + IMU v2",
    })
    .select("id")
    .single();

  if (error) {
    // If upsert fails (e.g. RLS or permissions), try to fetch any existing vehicle
    const { data: fallbackVehicle } = await supabase.from("vehicles").select("id").limit(1).maybeSingle();
    if (fallbackVehicle?.id) {
      return fallbackVehicle.id;
    }
    throw new Error(`Failed to ensure test vehicle exists: ${error.message}`);
  }

  return created.id;
}

/**
 * Inserts a test row into the vehicle_telemetry table
 */
export async function insertTestTelemetryRow(overrides?: Partial<TelemetryInsert>): Promise<TelemetryRow> {
  // Ensure we have a valid vehicle ID
  const vehicleId = overrides?.vehicle_id || (await ensureTestVehicleExists());

  const payload: TelemetryInsert = {
    vehicle_id: vehicleId,
    speed_kmph: overrides?.speed_kmph ?? 42.5,
    steering_angle_deg: overrides?.steering_angle_deg ?? -2.8,
    brake_applied: overrides?.brake_applied ?? false,
    latitude: overrides?.latitude ?? 28.6139,
    longitude: overrides?.longitude ?? 77.2090,
    recorded_at: overrides?.recorded_at ?? new Date().toISOString(),
    ...overrides,
  };

  const { data, error } = await (supabase as any)
    .from("vehicle_telemetry")
    .insert(payload)
    .select()
    .single();

  if (error) {
    console.error("Error inserting telemetry row:", error);
    throw error;
  }

  return data;
}

/**
 * Fetch the latest telemetry records
 */
export async function fetchLatestTelemetry(limit = 10): Promise<TelemetryRow[]> {
  const { data, error } = await (supabase as any)
    .from("vehicle_telemetry")
    .select("*")
    .order("recorded_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Error fetching telemetry rows:", error);
    throw error;
  }

  return data || [];
}
