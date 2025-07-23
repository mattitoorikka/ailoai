import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  try {
    console.log("Incoming request:", req.url);

    // Kovakoodattu token
    const token = "bNgMy8BbrqsTCIW09eeu6NFyWvIgAP";

    // Lue query-parametrit
    const { searchParams } = new URL(req.url);
    const startDate = searchParams.get("start_date");
    const endDate = searchParams.get("end_date");

    console.log("Query parameters:", { startDate, endDate });

    if (!startDate || !endDate) {
      return NextResponse.json(
        { error: "Start date and end date are required" },
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
        { error: "Failed to fetch data" },
        { status: response.status }
      );
    }

    const data = await response.json();

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Error:", error);
    return NextResponse.json({ error: error.message || "Internal error" }, {
      status: 500,
    });
  }
}
