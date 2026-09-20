import { NextResponse } from "next/server";

export async function GET() {
  const token = process.env.FOOTBALL_DATA_TOKEN;

  if (!token) {
    return NextResponse.json(
      { error: "FOOTBALL_DATA_TOKEN is not configured" },
      { status: 500 }
    );
  }

  try {
    const response = await fetch(
      "https://api.football-data.org/v4/competitions/PL/matches?status=SCHEDULED",
      {
        headers: {
          "X-Auth-Token": token,
        },
        next: {
          revalidate: 3600,
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        {
          error: "football-data.org request failed",
          details: data,
        },
        { status: response.status }
      );
    }

    // Find upcoming Arsenal matches
    const arsenalMatches = (data.matches || []).filter(
      (match: any) =>
        match.homeTeam?.name === "Arsenal FC" ||
        match.awayTeam?.name === "Arsenal FC"
    );

    // Sort by date
    arsenalMatches.sort(
      (a: any, b: any) =>
        new Date(a.utcDate).getTime() -
        new Date(b.utcDate).getTime()
    );

    // Convert to the format our current frontend expects
    const fixtures = arsenalMatches.map((match: any) => ({
      fixture: {
        id: match.id,
        date: match.utcDate,
        status: {
          short: "NS",
          long: "Not Started",
        },
      },
      league: {
        id: match.competition?.id,
        name: match.competition?.name,
        country: "England",
      },
      teams: {
        home: {
          id: match.homeTeam?.id,
          name: match.homeTeam?.name,
          logo: match.homeTeam?.crest,
        },
        away: {
          id: match.awayTeam?.id,
          name: match.awayTeam?.name,
          logo: match.awayTeam?.crest,
        },
      },
    }));

    return NextResponse.json({
      response: fixtures,
      results: fixtures.length,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Server error",
        details:
          error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
