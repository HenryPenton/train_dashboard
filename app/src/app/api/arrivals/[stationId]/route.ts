import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { stationId: string } },
) {
  const { stationId } = await params;

  try {
    const response = await fetch(
      `${process.env.SERVER_URL}/tfl/arrivals/${stationId}`,
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching arrivals:", error);
    return NextResponse.json(
      { error: "Failed to fetch arrivals" },
      { status: 500 },
    );
  }
}
