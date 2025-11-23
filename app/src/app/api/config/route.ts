import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const apiUrl = `${process.env.SERVER_URL || "http://localhost:8000"}/config`;
    const res = await fetch(apiUrl);

    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to fetch config from backend." },
        { status: res.status },
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Config fetch error:", error);
    return NextResponse.json(
      { error: "Config fetch failed." },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    const apiRes = await fetch(
      `${process.env.SERVER_URL || "http://localhost:8000"}/config`,
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
    console.error("Config save error:", error);
    return NextResponse.json(
      { error: "Failed to save config." },
      { status: 500 },
    );
  }
}
