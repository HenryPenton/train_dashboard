import { NextResponse } from "next/server";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ stationId: string }> },
) {
  try {
    const { stationId } = await params;
    const apiUrl = `${process.env.SERVER_URL || "http://localhost:8000"}/tfl/arrivals/${stationId}`;

    const res = await fetch(apiUrl);

    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to fetch arrivals from backend." },
        { status: res.status },
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Arrivals fetch error:", error);
    return NextResponse.json(
      { error: "Arrivals fetch failed." },
      { status: 500 },
    );
  }
}
