// app/api/auth/[auth0]/route.ts

import { NextRequest } from 'next/server';
import { handleAuth } from '@auth0/nextjs-auth0/edge';


export const runtime = 'edge';


export async function GET(
  request: NextRequest,
  context: { params: Promise<{ auth0: string }> }
) {

  const params = await context.params;
  

  return handleAuth()(request, { params });
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ auth0: string }> }
) {

  const params = await context.params;
  
  return handleAuth()(request, { params });
}

