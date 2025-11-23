import { NextResponse } from "next/server";

export async function GET() {
  try {
    const apiUrl = `${process.env.SERVER_URL || "http://localhost:8000"}/tfl/line-status`;
    const res = await fetch(apiUrl);

    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to fetch line status from backend." },
        { status: res.status },
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Line status fetch error:", error);
    return NextResponse.json(
      { error: "Line status fetch failed." },
      { status: 500 },
    );
  }
}
