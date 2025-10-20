import { NextResponse } from "next/server";
import * as z from "zod";

// Type for TFL line status response
export type TflLineStatusType = {
  name: string;
  status: string | null;
  statusSeverity: number;
};

export async function GET() {
  try {
    const res = await fetch(`${process.env.SERVER_URL}/tfl/line-status`);
    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to fetch TFL line status" },
        { status: 500 }
      );
    }
    const data = await res.json();
    const LineStatuses = z.array(
      z.object({
        name: z.string(),
        status: z.string(),
        statusSeverity: z.number(),
      })
    );
    const lineStatusData = LineStatuses.parse(data);

    return NextResponse.json(lineStatusData);
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Unknown error";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
