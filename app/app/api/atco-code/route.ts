import { NextResponse } from "next/server";

export async function GET() {
  const res = await fetch(`${process.env.SERVER_URL}/atco-code`);
  if (!res.ok) {
    return NextResponse.json(
      { error: "Failed to fetch ATCO codes" },
      { status: 500 }
    );
  }
  const data = await res.json();
  return NextResponse.json(data);
}
