import { NextResponse } from "next/server";
import { getBaseUrl } from "../utils/endpointLocation";

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
    return NextResponse.json(data);
  } catch (e: any) {
    return NextResponse.json(
      { error: e.message || "Unknown error" },
      { status: 500 }
    );
  }
}
