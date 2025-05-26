import { NextRequest, NextResponse } from "next/server";
import { getPayload } from "payload";
import config from "@/payload.config";

export async function GET(request: NextRequest) {
  try {
    const payload = await getPayload({ config });

    // Get headers from the request
    const headers = new Headers();
    request.headers.forEach((value, key) => {
      headers.set(key, value);
    });

    // Use Payload's built-in auth method to get current user
    const { user } = await payload.auth({ headers });

    if (!user) {
      return NextResponse.json(
        { message: "Not authenticated" },
        { status: 401 }
      );
    }

    // Return user data in the same format as Payload's built-in endpoints
    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        cart: user.cart ?? [],
        wishlist: user.wishlist ?? [],
        savedMeasurements: user.savedMeasurements,
        savedShippingAddress: user.savedShippingAddress,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    console.error("Error in /api/users/me:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
