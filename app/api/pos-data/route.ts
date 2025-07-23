import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  try {
    // Kovakoodattu Solmio API -token
    const token = "bNgMy8BbrqsTCIW09eeu6NFyWvIgAP";

    // Lue query-parametrit
    const { searchParams } = new URL(req.url);
    const timeScale = searchParams.get("time_scale") || "day";
    const datetimeRequest = searchParams.get("datetime_request") || "";

    // Rakennetaan Solmio API -osoite
    const apiUrl = `https://api.solmio.net/api/hq-dashboard-v3/?time_scale=${encodeURIComponent(
      timeScale
    )}&datetime_request=${encodeURIComponent(datetimeRequest)}`;

    // Kutsutaan Solmio APIa kovakoodatulla tokenilla
    const response = await fetch(apiUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to call Solmio API" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Error in pos-data route:", error);
    return NextResponse.json(
      { error: error.message || "Internal error" },
      { status: 500 }
    );
  }
}
