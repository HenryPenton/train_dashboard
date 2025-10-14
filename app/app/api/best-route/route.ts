// Next.js API route proxy for /api/best_route
import { NextResponse } from "next/server";
import { getBaseUrl } from "../utils/endpointLocation";

export async function GET(request: Request) {
  // For demo, hardcode from/to stations. In production, accept query params.
  const from = "940GZZLUTBY";
  const to = "940GZZLUPAC";
  try {
    const res = await fetch(
      `http://${getBaseUrl()}:8000/tfl/best-route/${from}/${to}`
    );
    if (!res.ok) {
      console.log(res);
      return NextResponse.json(
        { error: "Failed to fetch best route" },
        { status: 500 }
      );
    }
    const data = await res.json();
    // Transform backend response to match frontend expectations
    return NextResponse.json({
      origin: from,
      destination: to,
      route:
        data.legs?.map((leg: any) => `${leg.mode}: ${leg.instruction}`) || [],
      duration: data.duration,
      status: data.error ? data.error : "OK",
    });
  } catch (e: any) {
    return NextResponse.json(
      { error: e.message || "Unknown error" },
      { status: 500 }
    );
  }
}
