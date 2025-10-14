import { NextResponse } from "next/server";
import { getBaseUrl } from "../utils/endpointLocation";

export async function GET() {
  // Hardcoded for demo: RDG to PADTON
  try {
    const res = await fetch(
      `http://${getBaseUrl()}:8000/departures/RDG/PADTON`
    );
    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to fetch departures" },
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
