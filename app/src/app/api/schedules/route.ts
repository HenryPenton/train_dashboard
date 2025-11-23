import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const apiUrl = `${process.env.SERVER_URL || "http://localhost:8000"}/schedules`;
    const res = await fetch(apiUrl);

    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to fetch schedules from backend." },
        { status: res.status },
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Schedules fetch error:", error);
    return NextResponse.json(
      { error: "Schedules fetch failed." },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    const apiRes = await fetch(
      `${process.env.SERVER_URL || "http://localhost:8000"}/schedules`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      },
    );

    if (apiRes.ok) {
      return NextResponse.json({ status: "ok" });
    } else {
      return NextResponse.json({ status: "error" }, { status: apiRes.status });
    }
  } catch (error) {
    console.error("Schedules save error:", error);
    return NextResponse.json(
      { error: "Failed to save schedules." },
      { status: 500 },
    );
  }
}
