import { NextResponse } from "next/server";
import { getBaseUrl } from "../../utils/endpointLocation";

export async function GET(
  _request: Request,
  { params }: { params: { from: string; to: string } }
) {
  const { from } = params;
  if (!from) {
    return NextResponse.json(
      { error: "Missing required path parameters: from" },
      { status: 400 }
    );
  }
  try {
    const res = await fetch(`http://${getBaseUrl()}:8000/departures/${from}`);
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
