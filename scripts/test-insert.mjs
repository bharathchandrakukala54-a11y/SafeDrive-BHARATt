import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";

// Load .env.local if present
const envLocalPath = path.resolve(process.cwd(), ".env.local");
let envUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
let envKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

if (fs.existsSync(envLocalPath)) {
  const envContent = fs.readFileSync(envLocalPath, "utf-8");
  for (const line of envContent.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const [k, ...v] = trimmed.split("=");
    const val = v.join("=").replace(/^["']|["']$/g, "");
    if (k === "NEXT_PUBLIC_SUPABASE_URL" && !envUrl) envUrl = val;
    if (k === "NEXT_PUBLIC_SUPABASE_ANON_KEY" && !envKey) envKey = val;
  }
}

// Allow passing URL and Key as CLI arguments: node scripts/test-insert.mjs <URL> <KEY>
const args = process.argv.slice(2);
const supabaseUrl = args[0] || envUrl;
const supabaseAnonKey = args[1] || envKey;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("\x1b[31m%s\x1b[0m", "Error: Missing Supabase URL or Anon Key.");
  console.log("\nUsage options:");
  console.log("  1. Pass via CLI: node scripts/test-insert.mjs <YOUR_SUPABASE_URL> <YOUR_SUPABASE_ANON_KEY>");
  console.log("  2. Or set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local\n");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function run() {
  console.log("\x1b[36m%s\x1b[0m", `Connecting to Supabase at: ${supabaseUrl}`);

  const testVehicleId = "00000000-0000-0000-0000-000000000001";

  // 1. Ensure test vehicle exists
  console.log("Checking test vehicle in 'vehicles' table...");
  const { data: vehicle, error: vehicleErr } = await supabase
    .from("vehicles")
    .upsert({
      id: testVehicleId,
      name: "SafeDrive Test Rig Alpha",
      sensor_rig: "Camera (1080p) + Ultrasonic Array + IMU v2",
    })
    .select("id, name")
    .single();

  if (vehicleErr) {
    console.warn("\x1b[33m%s\x1b[0m", `Warning upserting vehicle: ${vehicleErr.message}`);
  } else {
    console.log("\x1b[32m%s\x1b[0m", `Vehicle ready: ${vehicle.name} (${vehicle.id})`);
  }

  // 2. Insert test telemetry row
  console.log("Inserting test row into 'vehicle_telemetry' table...");
  const testTelemetryData = {
    vehicle_id: testVehicleId,
    speed_kmph: 48.6,
    steering_angle_deg: -3.4,
    brake_applied: false,
    latitude: 28.6139,
    longitude: 77.2090,
    recorded_at: new Date().toISOString(),
  };

  const { data: telemetry, error: telemetryErr } = await supabase
    .from("vehicle_telemetry")
    .insert(testTelemetryData)
    .select()
    .single();

  if (telemetryErr) {
    console.error("\x1b[31m%s\x1b[0m", `Failed to insert telemetry row: ${telemetryErr.message}`);
    process.exit(1);
  }

  console.log("\x1b[32m%s\x1b[0m", "Successfully inserted test row into 'vehicle_telemetry'!");
  console.table(telemetry);
}

run().catch((err) => {
  console.error("\x1b[31m%s\x1b[0m", "Unexpected error:", err);
  process.exit(1);
});
