import { NextRequest, NextResponse } from "next/server";
import { getPayload } from "payload";
import config from "@/payload.config";

export async function POST(request: NextRequest) {
  try {
    const payload = await getPayload({ config });
    const body = await request.json();

    // Validate required fields
    const {
      product,
      measurements,
      customer,
      shippingAddress,
      depositAmount,
      remainingAmount,
      totalAmount,
      payment,
      notes,
      status = "deposit-paid",
    } = body;

    // Basic validation
    if (!product || !measurements || !customer || !shippingAddress) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Generate unique order number
    const orderNumber = `CO-${Date.now()}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;

    // Create the custom order
    const customOrder = await payload.create({
      collection: "custom-orders",
      data: {
        orderNumber,
        product: {
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
        },
        measurements: {
          chest: parseFloat(measurements.chest),
          shoulder: parseFloat(measurements.shoulder),
          sleeve: parseFloat(measurements.sleeve),
          length: parseFloat(measurements.length),
          waist: parseFloat(measurements.waist),
          hip: parseFloat(measurements.hip),
        },
        customer: {
          firstName: customer.firstName,
          lastName: customer.lastName,
          email: customer.email,
          phone: customer.phone,
        },
        shippingAddress: {
          address: shippingAddress.address,
          city: shippingAddress.city,
          country: shippingAddress.country,
          postalCode: shippingAddress.postalCode,
        },
        depositAmount: parseFloat(depositAmount),
        remainingAmount: parseFloat(remainingAmount),
        totalAmount: parseFloat(totalAmount),
        payment: {
          method: payment.method,
          transactionId: payment.transactionId,
          status: payment.status,
          details: payment.details,
        },
        finalPayment: {
          status: "pending",
        },
        status,
        notes: notes ?? "",
        // Set estimated completion date to 2 weeks from now
        estimatedCompletionDate: new Date(
          Date.now() + 14 * 24 * 60 * 60 * 1000
        ).toISOString(),
      },
    });

    return NextResponse.json({
      success: true,
      order: customOrder,
      id: customOrder.id,
    });
  } catch (error) {
    console.error("Error creating custom order:", error);
    return NextResponse.json(
      { error: "Failed to create custom order" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const payload = await getPayload({ config });
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get("id");

    // Get the authenticated user
    const { user } = await payload.auth({ headers: request.headers });

    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (orderId) {
      // Get specific order - ensure it belongs to the user
      const order = await payload.findByID({
        collection: "custom-orders",
        id: orderId,
      });

      // Check if the order belongs to the authenticated user
      if (order.customer.email !== user.email) {
        return NextResponse.json({ message: "Forbidden" }, { status: 403 });
      }

      return NextResponse.json({ order });
    } else {
      // Get user's orders only
      const page = parseInt(searchParams.get("page") ?? "1");
      const limit = parseInt(searchParams.get("limit") ?? "50");

      const orders = await payload.find({
        collection: "custom-orders",
        where: {
          "customer.email": {
            equals: user.email,
          },
        },
        page,
        limit,
        sort: "-createdAt",
        depth: 1, // Reduce depth to avoid session issues
      });

      return NextResponse.json(orders);
    }
  } catch (error) {
    console.error("Error fetching custom orders:", error);

    // If it's a session error, try to return empty result instead of error
    if (
      error instanceof Error &&
      (error.message?.includes("session") || error.message?.includes("Session"))
    ) {
      console.warn(
        "Session error detected, returning empty custom orders list"
      );
      return NextResponse.json({ docs: [], totalDocs: 0, limit: 50, page: 1 });
    }

    return NextResponse.json(
      { error: "Failed to fetch custom orders" },
      { status: 500 }
    );
  }
}
