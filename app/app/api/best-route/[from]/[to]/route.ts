// Next.js API route proxy for /api/best_route
import { NextResponse } from "next/server";
import * as z from "zod";

const BackendLegSchema = z.object({
  mode: z.string(),
  instruction: z.string(),
  departure: z.string(),
  arrival: z.string(),
  line: z.string(),
});

const BackendResponseSchema = z.object({
  duration: z.number(),
  arrival: z.string(),
  legs: z.array(BackendLegSchema),
  fare: z.number().nullable(),
});

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ from: string; to: string }> }
) {
  const { from, to } = await params;
  if (!from || !to) {
    return NextResponse.json(
      { error: "Missing required path parameters: from, to" },
      { status: 400 }
    );
  }
  try {
    const res = await fetch(
      `${process.env.SERVER_URL}/tfl/best-route/${from}/${to}`
    );
    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to fetch best route" },
        { status: 500 }
      );
    }
    const rawData = await res.json();
    // Validate backend response with Zod
    const data = BackendResponseSchema.parse(rawData);

    // Transform backend response to match frontend expectations
    return NextResponse.json({
      route: data.legs.map((leg) => `${leg.mode}: ${leg.instruction}`),
      duration: data.duration,
      arrival: data.arrival,
      fare: data.fare,
    });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Unknown error";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
