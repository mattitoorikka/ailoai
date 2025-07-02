export async function GET() {
  return new Response(JSON.stringify({ message: "Auth is disabled in demo mode" }), {
    status: 200,
  });
}
