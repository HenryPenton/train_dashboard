import { NextResponse } from "next/server";

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
      `${process.env.SERVER_URL}/departures/${from}/${to}`
    );
    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to fetch departures" },
        { status: 500 }
      );
    }
    const data = await res.json();
    return NextResponse.json(data);
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Unknown error";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
