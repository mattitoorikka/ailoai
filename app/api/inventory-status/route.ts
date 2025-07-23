import { NextRequest, NextResponse } from "next/server";

// Ei käytetä enää sessionia, mutta edge-runtime on silti ok
export const runtime = "edge";

export async function GET(req: NextRequest) {
  try {
    // Kovakoodattu Solmio API -token
    const token = "bNgMy8BbrqsTCIW09eeu6NFyWvIgAP";

    // Lue query-parametrit
    const { searchParams } = new URL(req.url);
    const today = new Date().toISOString().split("T")[0] + "T06:00:00+02";
    const date = searchParams.get("date") || today;

    // Rakenna Solmio API -url
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

    console.log("External API response status:", response.status);
    console.log("Response Content-Type:", response.headers.get("Content-Type"));

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error response from Solmio API:", errorText);
      return NextResponse.json(
        { error: "Failed to fetch inventory data", details: errorText },
        { status: response.status }
      );
    }

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
