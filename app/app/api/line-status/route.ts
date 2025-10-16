import { NextResponse } from "next/server";

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
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Unknown error";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
