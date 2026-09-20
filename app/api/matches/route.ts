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
    const url =
      "https://v3.football.api-sports.io/fixtures?team=42&league=39&season=2026&next=1";

    const response = await fetch(url, {
      headers: {
        "x-apisports-key": apiKey,
      },
      next: {
        revalidate: 3600,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        {
          error: "API-Football request failed",
          details: data,
        },
        { status: response.status }
      );
    }

    if (data.errors && Object.keys(data.errors).length > 0) {
      return NextResponse.json(
        {
          error: "API-Football returned an error",
          details: data.errors,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      {
        error: "Server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
