import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    // Replace with your actual FastAPI backend URL if needed
    const apiUrl = `${process.env.SERVER_URL}/config`;
    const res = await fetch(apiUrl);
    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to fetch config from backend." },
        { status: res.status },
      );
    }
    const data = await res.json();

    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Config fetch failed." },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  const data = await req.json();

  // Forward the settings to the FastAPI backend
  const apiRes = await fetch(`${process.env.SERVER_URL}/config`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (apiRes.ok) {
    return NextResponse.json({ status: "ok" });
  } else {
    return NextResponse.json({ status: "error" }, { status: apiRes.status });
  }
}
