// app/api/inventory-status/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@auth0/nextjs-auth0/edge";

// Tämä tiedosto käyttää edge-runtimea, jotta session-luku on mahdollista 
export const runtime = "edge";

export async function GET(req: NextRequest) {
  try {
    // 1. Hae sessio
    const session = await getSession(req, NextResponse.next());

    // 2. Hae token custom claimista
    const token = session?.user?.["https://yourdomain.com/solmio_api_token"];

    if (!token) {
      console.error("Authorization token is missing from custom claim");
      return NextResponse.json(
        { error: "Authorization token is missing" },
        { status: 401 }
      );
    }

    // 3. Lue query-parametrit
    const { searchParams } = new URL(req.url);
    const today = new Date().toISOString().split("T")[0] + "T06:00:00+02";
    const date = searchParams.get("date") || today;


    // 4. Rakenna Solmio API -url
    const apiUrl = `https://api.solmio.net/api/calculated-inventory-status-v2/?date=${encodeURIComponent(
      date
    )}`;

    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    // 6. Tarkista vastaus
    console.log("External API response status:", response.status);
    console.log(
      "Response Content-Type:",
      response.headers.get("Content-Type")
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error response from Solmio API:", errorText);
      return NextResponse.json(
        { error: "Failed to fetch inventory data", details: errorText },
        { status: response.status }
      );
    }

    // 7. Palauta data JSONina
    const data = await response.json();

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Unexpected error in /api/inventory-status route:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}
