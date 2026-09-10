export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      vehicles: {
        Row: {
          id: string;
          name: string;
          sensor_rig: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          sensor_rig?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          sensor_rig?: string | null;
          created_at?: string;
        };
      };
      camera_frames: {
        Row: {
          id: string;
          vehicle_id: string;
          captured_at: string;
          frame_url: string;
          resolution: string | null;
          road_type: string | null;
          lighting_condition: string | null;
          weather: string | null;
          labels: Json | null;
        };
        Insert: {
          id?: string;
          vehicle_id: string;
          captured_at?: string;
          frame_url: string;
          resolution?: string | null;
          road_type?: string | null;
          lighting_condition?: string | null;
          weather?: string | null;
          labels?: Json | null;
        };
        Update: {
          id?: string;
          vehicle_id?: string;
          captured_at?: string;
          frame_url?: string;
          resolution?: string | null;
          road_type?: string | null;
          lighting_condition?: string | null;
          weather?: string | null;
          labels?: Json | null;
        };
      };
      sensor_readings: {
        Row: {
          id: string;
          vehicle_id: string;
          captured_at: string;
          sensor_type: 'ultrasonic' | 'lidar' | 'radar' | 'imu' | 'gps';
          value: Json;
          unit: string | null;
        };
        Insert: {
          id?: string;
          vehicle_id: string;
          captured_at?: string;
          sensor_type: 'ultrasonic' | 'lidar' | 'radar' | 'imu' | 'gps';
          value: Json;
          unit?: string | null;
        };
        Update: {
          id?: string;
          vehicle_id?: string;
          captured_at?: string;
          sensor_type?: 'ultrasonic' | 'lidar' | 'radar' | 'imu' | 'gps';
          value?: Json;
          unit?: string | null;
        };
      };
      motion_events: {
        Row: {
          id: string;
          vehicle_id: string;
          detected_at: string;
          object_class: string;
          bbox: { x: number; y: number; w: number; h: number } | Json | null;
          confidence: number | null;
          relative_distance_m: number | null;
          relative_velocity_mps: number | null;
          source: string | null;
        };
        Insert: {
          id?: string;
          vehicle_id: string;
          detected_at?: string;
          object_class: string;
          bbox?: { x: number; y: number; w: number; h: number } | Json | null;
          confidence?: number | null;
          relative_distance_m?: number | null;
          relative_velocity_mps?: number | null;
          source?: string | null;
        };
        Update: {
          id?: string;
          vehicle_id?: string;
          detected_at?: string;
          object_class?: string;
          bbox?: { x: number; y: number; w: number; h: number } | Json | null;
          confidence?: number | null;
          relative_distance_m?: number | null;
          relative_velocity_mps?: number | null;
          source?: string | null;
        };
      };
      vehicle_telemetry: {
        Row: {
          id: string;
          vehicle_id: string;
          recorded_at: string;
          speed_kmph: number | null;
          steering_angle_deg: number | null;
          brake_applied: boolean;
          latitude: number | null;
          longitude: number | null;
        };
        Insert: {
          id?: string;
          vehicle_id: string;
          recorded_at?: string;
          speed_kmph?: number | null;
          steering_angle_deg?: number | null;
          brake_applied?: boolean;
          latitude?: number | null;
          longitude?: number | null;
        };
        Update: {
          id?: string;
          vehicle_id?: string;
          recorded_at?: string;
          speed_kmph?: number | null;
          steering_angle_deg?: number | null;
          brake_applied?: boolean;
          latitude?: number | null;
          longitude?: number | null;
        };
      };
    };
  };
}

export type Vehicle = Database['public']['Tables']['vehicles']['Row'];
export type CameraFrame = Database['public']['Tables']['camera_frames']['Row'];
export type SensorReading = Database['public']['Tables']['sensor_readings']['Row'];
export type MotionEvent = Database['public']['Tables']['motion_events']['Row'];
export type VehicleTelemetry = Database['public']['Tables']['vehicle_telemetry']['Row'];
