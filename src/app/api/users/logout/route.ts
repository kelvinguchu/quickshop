import { NextRequest, NextResponse } from "next/server";
import { getPayload } from "payload";
import config from "@/payload.config";

export async function POST(request: NextRequest) {
  try {
    const payload = await getPayload({ config });

    // Get headers for authentication
    const headers = Object.fromEntries(request.headers.entries());

    // Perform logout using Payload's auth
    await payload.logout({
      headers,
    });

    // Create response with success message
    const response = NextResponse.json(
      { message: "Logout successful" },
      { status: 200 }
    );

    // Clear authentication cookies
    response.cookies.delete("payload-token");
    response.cookies.delete("payload-refresh-token");

    return response;
  } catch (error) {
    console.error("Logout error:", error);

    // Even if logout fails, clear cookies and return success
    const response = NextResponse.json(
      { message: "Logout completed" },
      { status: 200 }
    );

    response.cookies.delete("payload-token");
    response.cookies.delete("payload-refresh-token");

    return response;
  }
}
 