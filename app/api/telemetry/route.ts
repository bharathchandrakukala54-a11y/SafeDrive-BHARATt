import { NextResponse } from "next/server";
import { insertTestTelemetryRow, fetchLatestTelemetry } from "@/lib/telemetry";

export async function GET() {
  try {
    const rows = await fetchLatestTelemetry(10);
    return NextResponse.json({ success: true, count: rows.length, data: rows });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch telemetry";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const newRow = await insertTestTelemetryRow(body);
    return NextResponse.json({ success: true, data: newRow }, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to insert telemetry row";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
