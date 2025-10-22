import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const data = await req.json();
  // Forward the settings to the FastAPI backend
  const apiRes = await fetch("http://localhost:8000/config", {
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
