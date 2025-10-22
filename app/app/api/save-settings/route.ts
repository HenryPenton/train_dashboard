import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const data = await req.json();
  console.log("Received settings:", JSON.stringify(data, null, 2));
  return NextResponse.json({ status: "ok" });
}
