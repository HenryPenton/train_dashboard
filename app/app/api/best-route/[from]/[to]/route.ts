// Next.js API route proxy for /api/best_route
import { NextResponse } from "next/server";
import { getBaseUrl } from "../../../utils/endpointLocation";

export async function GET(
  _request: Request,
  { params }: { params: { from: string; to: string } }
) {
  const { from, to } = params;
  if (!from || !to) {
    return NextResponse.json(
      { error: "Missing required path parameters: from, to" },
      { status: 400 }
    );
  }
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
