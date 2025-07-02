import { getSession } from "@auth0/nextjs-auth0/edge";
import { NextRequest, NextResponse } from "next/server";

let cachedToken: { token: string; expiresAt: number } | null = null;

// Hakee Access Tokenin Auth0 Management API:lta ja tallentaa sen välimuistiin
async function getManagementApiToken() {
  const now = Date.now();
  if (cachedToken && cachedToken.expiresAt > now) {
    return cachedToken.token;
  }

  const response = await fetch(`${process.env.AUTH0_ISSUER_BASE_URL}/oauth/token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      client_id: process.env.AUTH0_CLIENT_ID,
      client_secret: process.env.AUTH0_CLIENT_SECRET,
      audience: `${process.env.AUTH0_ISSUER_BASE_URL}/api/v2/`,
      grant_type: "client_credentials",
    }),
  });

  if (!response.ok) {
    console.error("Failed to fetch Management API token", await response.text());
    throw new Error("Failed to fetch Management API token");
  }

  const { access_token, expires_in } = await response.json();
  cachedToken = {
    token: access_token,
    expiresAt: now + expires_in * 1000,
  };

  return access_token;
}

export async function GET(req: NextRequest) {
  try {
    // Muunna Next.js-pyyntö Node.js-yhteensopivaksi
    const nodeReq: any = {
      headers: Object.fromEntries(req.headers.entries()),
      method: req.method,
      url: req.url,
    };

    const nodeRes: any = {
      statusCode: 200,
      headers: {},
      body: null,
      setHeader: (key: string, value: string) => {
        nodeRes.headers[key] = value;
      },
      getHeader: (key: string) => nodeRes.headers[key],
      end: (data: any) => {
        nodeRes.body = data;
      },
    };

    // Tarkista käyttäjän sessio
    const session = await getSession(nodeReq, nodeRes);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Hae Access Token Management API:lle
    const accessToken = await getManagementApiToken();

    // Hae käyttäjän metatiedot Auth0 Management API:sta
    const response = await fetch(
      `${process.env.AUTH0_ISSUER_BASE_URL}/api/v2/users/${session.user.sub}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) {
      console.error("Failed to fetch user metadata", await response.text());
      return NextResponse.json(
        { error: "Failed to fetch user metadata" },
        { status: response.status }
      );
    }

    const userData = await response.json();
    return NextResponse.json({
      app_metadata: userData.app_metadata,
      user_metadata: userData.user_metadata,
    });
  } catch (err) {
    console.error("Error fetching user metadata:", err);
    return NextResponse.json(
      { error: "Internal Server Error", details: (err as Error).message },
      { status: 500 }
    );
  }
}
