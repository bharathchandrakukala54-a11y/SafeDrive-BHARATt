-- =====================================================================
-- Dataset schema: Adaptive Path Planning & Collision Avoidance (SIH26037)
-- Target: Supabase (PostgreSQL). Paste into Supabase SQL Editor and Run.
-- =====================================================================

-- Needed for gen_random_uuid()
create extension if not exists pgcrypto;

-- 1. Vehicles / test rigs -----------------------------------------------
create table if not exists vehicles (
    id            uuid primary key default gen_random_uuid(),
    name          text not null,
    sensor_rig    text,                 -- e.g. "Camera+Ultrasonic v1"
    created_at    timestamptz not null default now()
);

-- 2. Camera frames --------------------------------------------------------
create table if not exists camera_frames (
    id                uuid primary key default gen_random_uuid(),
    vehicle_id        uuid not null references vehicles(id) on delete cascade,
    captured_at       timestamptz not null default now(),
    frame_url         text not null,     -- Supabase Storage path/URL
    resolution        text,              -- "1280x720"
    road_type         text,              -- unpaved / pothole / urban / highway
    lighting_condition text,             -- day / night / low-light / glare
    weather           text,              -- clear / rain / fog / dust
    labels            jsonb              -- flexible: {"potholes":2,"pedestrian":1}
);
create index if not exists idx_camera_frames_vehicle_time
    on camera_frames (vehicle_id, captured_at);

-- 3. Raw sensor readings (ultrasonic / lidar / radar / imu / gps) --------
create table if not exists sensor_readings (
    id            uuid primary key default gen_random_uuid(),
    vehicle_id    uuid not null references vehicles(id) on delete cascade,
    captured_at   timestamptz not null default now(),
    sensor_type   text not null check (sensor_type in
                    ('ultrasonic','lidar','radar','imu','gps')),
    value         jsonb not null,        -- shape depends on sensor_type
    unit          text                   -- "cm", "m/s2", "deg", etc.
);
create index if not exists idx_sensor_readings_vehicle_time
    on sensor_readings (vehicle_id, captured_at);
create index if not exists idx_sensor_readings_type
    on sensor_readings (sensor_type);

-- 4. Motion / obstacle detection events -----------------------------------
create table if not exists motion_events (
    id                    uuid primary key default gen_random_uuid(),
    vehicle_id            uuid not null references vehicles(id) on delete cascade,
    detected_at           timestamptz not null default now(),
    object_class          text not null,     -- pedestrian, animal, vehicle, pothole...
    bbox                  jsonb,             -- {"x":.., "y":.., "w":.., "h":..}
    confidence            numeric check (confidence between 0 and 1),
    relative_distance_m   numeric,
    relative_velocity_mps numeric,
    source                text               -- "camera-cnn", "lidar-cluster", etc.
);
create index if not exists idx_motion_events_vehicle_time
    on motion_events (vehicle_id, detected_at);

-- 5. Vehicle telemetry (for path planning / collision avoidance logic) ----
create table if not exists vehicle_telemetry (
    id               uuid primary key default gen_random_uuid(),
    vehicle_id       uuid not null references vehicles(id) on delete cascade,
    recorded_at      timestamptz not null default now(),
    speed_kmph       numeric,
    steering_angle_deg numeric,
    brake_applied    boolean default false,
    latitude         double precision,
    longitude        double precision
);
create index if not exists idx_vehicle_telemetry_vehicle_time
    on vehicle_telemetry (vehicle_id, recorded_at);

-- =====================================================================
-- Row Level Security (Supabase enables RLS-required access by default)
-- Without this step every request from your app will fail with a
-- permission error even though the tables exist.
-- =====================================================================
alter table vehicles enable row level security;
alter table camera_frames enable row level security;
alter table sensor_readings enable row level security;
alter table motion_events enable row level security;
alter table vehicle_telemetry enable row level security;

-- Simple open policy for hackathon/dev use — tighten before production.
create policy "Allow all - dev" on vehicles for all using (true) with check (true);
create policy "Allow all - dev" on camera_frames for all using (true) with check (true);
create policy "Allow all - dev" on sensor_readings for all using (true) with check (true);
create policy "Allow all - dev" on motion_events for all using (true) with check (true);
create policy "Allow all - dev" on vehicle_telemetry for all using (true) with check (true);

-- =====================================================================
-- Optional Seed Data for SIH26037 Testing
-- =====================================================================
-- Insert test vehicle
insert into vehicles (id, name, sensor_rig)
values ('00000000-0000-0000-0000-000000000001', 'SafeDrive Test Rig Alpha', 'Camera (1080p) + Ultrasonic Array + IMU v2')
on conflict (id) do nothing;

-- Insert initial telemetry
insert into vehicle_telemetry (vehicle_id, speed_kmph, steering_angle_deg, brake_applied, latitude, longitude)
values ('00000000-0000-0000-0000-000000000001', 38.4, -4.2, false, 28.6139, 77.2090);

-- Insert sample motion obstacle event
insert into motion_events (vehicle_id, object_class, bbox, confidence, relative_distance_m, relative_velocity_mps, source)
values ('00000000-0000-0000-0000-000000000001', 'pedestrian', '{"x": 420, "y": 280, "w": 65, "h": 140}'::jsonb, 0.94, 18.4, -1.2, 'camera-cnn');
