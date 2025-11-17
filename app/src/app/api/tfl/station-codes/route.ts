import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const stationType = searchParams.get("station_type") || "naptan";
  
  const res = await fetch(`${process.env.SERVER_URL}/tfl/station-codes?station_type=${stationType}`);
  if (!res.ok) {
    return NextResponse.json(
      { error: "Failed to fetch station codes" },
      { status: 500 },
    );
  }
  const data = await res.json();
  return NextResponse.json(data);
}