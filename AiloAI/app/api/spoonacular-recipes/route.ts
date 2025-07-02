import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query");
    const number = searchParams.get("number") || "3";

    const apiKey = process.env.SPOONACULAR_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "SPOONACULAR_API_KEY is missing in environment variables." },
        { status: 500 }
      );
    }

    if (!query) {
      return NextResponse.json(
        { error: "Missing required parameter: query" },
        { status: 400 }
      );
    }

    const apiUrl = `https://api.spoonacular.com/recipes/complexSearch?query=${encodeURIComponent(
      query
    )}&number=${encodeURIComponent(
      number
    )}&addRecipeInformation=true&apiKey=${apiKey}`;

    const response = await fetch(apiUrl);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error from Spoonacular API:", errorText);
      return NextResponse.json(
        { error: "Failed to fetch recipes from Spoonacular API." },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Error in spoonacular-recipes route:", error.message);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}
