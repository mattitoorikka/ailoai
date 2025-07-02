import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const city = searchParams.get("city");
    const date = searchParams.get("date");
    const units = searchParams.get("units") || "metric";
    const lang = searchParams.get("lang") || "en";
    const apiKey = process.env.OPENWEATHER_API_KEY;

    // Check if required parameters are provided
    if (!city || !date) {
      return NextResponse.json(
        { error: "City and Date are required." },
        { status: 400 }
      );
    }

    // Step 1: Fetch city coordinates using Geocoding API
    const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(city)}&limit=1&appid=${apiKey}`;
    const geoResponse = await fetch(geoUrl);

    if (!geoResponse.ok) {
      const errorText = await geoResponse.text();
      console.error("Error fetching city coordinates:", errorText);
      throw new Error(`Failed to fetch coordinates for the city.`);
    }

    const geoData = await geoResponse.json();

    if (geoData.length === 0) {
      throw new Error(`City not found: ${city}`);
    }

    const { lat, lon } = geoData[0];

    // Step 2: Convert date to UNIX timestamp
    const timestamp = Math.floor(new Date(date).getTime() / 1000);

    // Step 3: Fetch historical weather data
    const historicalUrl = `https://api.openweathermap.org/data/3.0/onecall/timemachine?lat=${lat}&lon=${lon}&dt=${timestamp}&units=${units}&lang=${lang}&appid=${apiKey}`;

    const historicalResponse = await fetch(historicalUrl);

    if (!historicalResponse.ok) {
      const errorText = await historicalResponse.text();
      console.error("Error fetching historical weather:", errorText);
      throw new Error(
        `Failed to fetch historical weather: ${historicalResponse.statusText}`
      );
    }

    const historicalData = await historicalResponse.json();
    return NextResponse.json(historicalData);
  } catch (error) {
    console.error("Error in weather-data route:", error.message);
    return NextResponse.json(
      { error: "Failed to fetch weather data", details: error.message },
      { status: 500 }
    );
  }
}
