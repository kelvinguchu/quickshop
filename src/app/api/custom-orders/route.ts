import { NextRequest, NextResponse } from "next/server";
import { getPayload } from "payload";
import config from "@/payload.config";
import { validateCSRFFromRequest } from "@/lib/csrf";

export async function POST(request: NextRequest) {
  try {
    const payload = await getPayload({ config });

    // Validate CSRF token
    if (!validateCSRFFromRequest(request)) {
      return NextResponse.json(
        { error: "Invalid or missing CSRF token" },
        { status: 403 }
      );
    }

    // Authenticate the user
    const { user } = await payload.auth({ headers: request.headers });

    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

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

    // Validate measurements
    const validatedMeasurements = {
      chest: parseFloat(measurements.chest),
      shoulder: parseFloat(measurements.shoulder),
      sleeve: parseFloat(measurements.sleeve),
      length: parseFloat(measurements.length),
      waist: parseFloat(measurements.waist),
      hip: parseFloat(measurements.hip),
    };

    // Check for NaN values
    const measurementValues = Object.values(validatedMeasurements);
    if (measurementValues.some((val) => isNaN(val) || val <= 0)) {
      return NextResponse.json(
        {
          error:
            "Invalid measurement values. All measurements must be positive numbers.",
        },
        { status: 400 }
      );
    }

    // Validate amounts
    const validatedAmounts = {
      depositAmount: parseFloat(depositAmount),
      remainingAmount: parseFloat(remainingAmount),
      totalAmount: parseFloat(totalAmount),
    };

    if (Object.values(validatedAmounts).some((val) => isNaN(val) || val < 0)) {
      return NextResponse.json(
        {
          error:
            "Invalid amount values. All amounts must be non-negative numbers.",
        },
        { status: 400 }
      );
    }

    // Verify amounts add up correctly
    if (
      Math.abs(
        validatedAmounts.depositAmount +
          validatedAmounts.remainingAmount -
          validatedAmounts.totalAmount
      ) > 0.01
    ) {
      return NextResponse.json(
        { error: "Deposit and remaining amounts must equal total amount" },
        { status: 400 }
      );
    }

    // Generate unique order number using nanoid
    const { nanoid } = await import("nanoid");
    const orderNumber = `CO-${nanoid(12).toUpperCase()}`;

    // Create the custom order
    const customOrder = await payload.create({
      collection: "custom-orders",
      data: {
        orderNumber,
        userId: user.id, // Store user ID for secure ownership verification
        product: {
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
        },
        measurements: validatedMeasurements,
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
        depositAmount: validatedAmounts.depositAmount,
        remainingAmount: validatedAmounts.remainingAmount,
        totalAmount: validatedAmounts.totalAmount,
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

      // Check if the order belongs to the authenticated user using user ID
      if (order.userId !== user.id) {
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
          userId: {
            equals: user.id,
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

    // If it's a session error, return proper authentication error
    if (
      error instanceof Error &&
      (error.message?.includes("session") || error.message?.includes("Session"))
    ) {
      console.warn("Session error detected, user needs to re-authenticate");
      return NextResponse.json(
        { error: "Session expired. Please log in again." },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: "Failed to fetch custom orders" },
      { status: 500 }
    );
  }
}
