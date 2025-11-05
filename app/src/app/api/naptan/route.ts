import { NextResponse } from "next/server";

export async function GET() {
  const res = await fetch(`${process.env.SERVER_URL}/naptan-id`);
  if (!res.ok) {
    return NextResponse.json(
      { error: "Failed to fetch NAPTAN IDs" },
      { status: 500 },
    );
  }
  const data = await res.json();
  return NextResponse.json(data);
}
