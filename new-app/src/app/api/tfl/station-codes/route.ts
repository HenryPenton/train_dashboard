import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const stationType = searchParams.get("station_type") || "naptan";

    const apiUrl = `${process.env.SERVER_URL || 'http://localhost:8000'}/tfl/station-codes?station_type=${stationType}`;
    const res = await fetch(apiUrl);
    
    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to fetch station codes from backend." },
        { status: res.status },
      );
    }
    
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('TfL station codes fetch error:', error);
    return NextResponse.json(
      { error: "TfL station codes fetch failed." },
      { status: 500 },
    );
  }
}