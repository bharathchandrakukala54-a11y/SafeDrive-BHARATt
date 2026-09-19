import { supabase } from "./supabase";

export interface TelemetryInsert {
  vehicle_id?: string;
  speed_kmph?: number;
  steering_angle_deg?: number;
  brake_applied?: boolean;
  latitude?: number;
  longitude?: number;
  recorded_at?: string;
  [key: string]: unknown;
}

export interface TelemetryRow {
  id: string;
  vehicle_id: string;
  recorded_at: string;
  speed_kmph: number | null;
  steering_angle_deg: number | null;
  brake_applied: boolean | null;
  latitude: number | null;
  longitude: number | null;
  [key: string]: unknown;
}

interface DynamicQueryResult<T> {
  data: T;
  error: { message: string } | null;
}

interface DynamicQueryChain<T> {
  select: (columns?: string) => DynamicQueryChain<T>;
  order: (column: string, options?: { ascending: boolean }) => DynamicQueryChain<T>;
  limit: (count: number) => Promise<DynamicQueryResult<T[]>>;
  single: () => Promise<DynamicQueryResult<T>>;
}

interface DynamicTableClient {
  upsert: (values: Record<string, unknown>) => DynamicQueryChain<{ id: string }>;
  insert: (values: Record<string, unknown>) => DynamicQueryChain<TelemetryRow>;
  select: (columns?: string) => {
    order: (column: string, options?: { ascending: boolean }) => {
      limit: (count: number) => Promise<DynamicQueryResult<TelemetryRow[]>>;
    };
  };
}

interface DynamicSupabaseClient {
  from: (table: string) => DynamicTableClient;
}

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

  const client = supabase as unknown as DynamicSupabaseClient;
  const { data: created, error } = await client
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

  const payload: Record<string, unknown> = {
    vehicle_id: vehicleId,
    speed_kmph: overrides?.speed_kmph ?? 42.5,
    steering_angle_deg: overrides?.steering_angle_deg ?? -2.8,
    brake_applied: overrides?.brake_applied ?? false,
    latitude: overrides?.latitude ?? 28.6139,
    longitude: overrides?.longitude ?? 77.2090,
    recorded_at: overrides?.recorded_at ?? new Date().toISOString(),
    ...overrides,
  };

  const client = supabase as unknown as DynamicSupabaseClient;
  const { data, error } = await client
    .from("vehicle_telemetry")
    .insert(payload)
    .select()
    .single();

  if (error) {
    console.error("Error inserting telemetry row:", error);
    throw new Error(error.message);
  }

  return data;
}

/**
 * Fetch the latest telemetry records
 */
export async function fetchLatestTelemetry(limit = 10): Promise<TelemetryRow[]> {
  const client = supabase as unknown as DynamicSupabaseClient;
  const { data, error } = await client
    .from("vehicle_telemetry")
    .select("*")
    .order("recorded_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Error fetching telemetry rows:", error);
    throw new Error(error.message);
  }

  return data || [];
}
