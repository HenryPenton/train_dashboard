import { NextResponse } from "next/server";
import { ApiLineStatusesSchema } from "@/app/validators/api-validators/LineStatusSchema";

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
        { status: 500 },
      );
    }
    const data = await res.json();
    const lineStatusData = ApiLineStatusesSchema.parse(data);

    return NextResponse.json(lineStatusData);
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Unknown error";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
