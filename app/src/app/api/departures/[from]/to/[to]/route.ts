import { NextResponse } from "next/server";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ from: string; to: string }> },
) {
  try {
    const { from, to } = await params;
    const apiUrl = `${process.env.SERVER_URL || "http://localhost:8000"}/rail/departures/${from}/to/${to}`;

    const res = await fetch(apiUrl);

    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to fetch departures from backend." },
        { status: res.status },
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Departures fetch error:", error);
    return NextResponse.json(
      { error: "Departures fetch failed." },
      { status: 500 },
    );
  }
}
