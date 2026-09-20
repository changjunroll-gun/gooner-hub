import { NextResponse } from "next/server";

export async function GET() {
  const apiKey = process.env.API_FOOTBALL_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "API_FOOTBALL_KEY is not configured" },
      { status: 500 }
    );
  }

  try {
    const response = await fetch(
      "https://v3.football.api-sports.io/fixtures?team=42&next=1",
      {
        headers: {
          "x-apisports-key": apiKey,
        },
        next: {
          revalidate: 3600,
        },
      }
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch football data" },
        { status: response.status }
      );
    }

    const data = await response.json();

    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
