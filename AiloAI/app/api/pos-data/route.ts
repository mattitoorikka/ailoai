import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@auth0/nextjs-auth0/edge";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  try {
    const session = await getSession(req, NextResponse.next());
    const token = session?.user?.["https://yourdomain.com/solmio_api_token"];


    if (!token) {
      return NextResponse.json(
        { error: "Authorization token missing" },
        { status: 401 }
      );
    }

    // Lue query-parametrit
    const { searchParams } = new URL(req.url);
    const timeScale = searchParams.get("time_scale") || "day";
    const datetimeRequest = searchParams.get("datetime_request") || "";

    // Rakennetaan Solmio API -osoite
    const apiUrl = `https://api.solmio.net/api/hq-dashboard-v3/?time_scale=${encodeURIComponent(
      timeScale
    )}&datetime_request=${encodeURIComponent(datetimeRequest)}`;

    // Kutsutaan Solmio APIa tokenilla
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
