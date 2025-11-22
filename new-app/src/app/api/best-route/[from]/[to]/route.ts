import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ from: string; to: string }> },
) {
  try {
    const { from, to } = await params;
    const apiUrl = `${process.env.SERVER_URL || 'http://localhost:8000'}/tfl/best-route/${from}/${to}`;
    const res = await fetch(apiUrl);
    
    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to fetch best route from backend." },
        { status: res.status },
      );
    }
    
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Best route fetch error:', error);
    return NextResponse.json(
      { error: "Best route fetch failed." },
      { status: 500 },
    );
  }
}