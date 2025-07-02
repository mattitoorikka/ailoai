import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@auth0/nextjs-auth0/edge";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  try {
    console.log("Incoming request:", req.url);

    const session = await getSession(req, NextResponse.next());
    const token = session?.user?.["https://yourdomain.com/solmio_api_token"];

    if (!token) {
      console.log("Authorization token missing");
      return NextResponse.json(
        JSON.stringify({ error: "Authorization token missing" }),
        { status: 401 }
      );
    }

    // Lue query-parametrit
    const { searchParams } = new URL(req.url);
    const startDate = searchParams.get("start_date");
    const endDate = searchParams.get("end_date");

    console.log("Query parameters:", { startDate, endDate });

    if (!startDate || !endDate) {
      console.log("Start date and end date are required");
      return NextResponse.json(
        JSON.stringify({ error: "Start date and end date are required" }),
        { status: 400 }
      );
    }

    const apiUrl = `https://api.solmio.net/api/transactions/product-group-report-v2/?start_date=${encodeURIComponent(
      startDate
    )}&end_date=${encodeURIComponent(endDate)}&use_dynamic_group_connections=false`;

    console.log("Calling API with URL:", apiUrl);

    const response = await fetch(apiUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      console.error("Failed to fetch data. Status:", response.status);
      return NextResponse.json(
        JSON.stringify({ error: "Failed to fetch data" }),
        { status: response.status }
      );
    }

    const data = await response.json();

    // Palauta data merkkijonona
    return NextResponse.json(JSON.stringify(data)); // Tämä varmistaa oikean palautusmuodon
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
