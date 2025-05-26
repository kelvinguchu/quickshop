import { getPayload } from "payload";
import { NextResponse, NextRequest } from "next/server";
import config from "@/payload.config";

// Generate a unique order number
function generateOrderNumber() {
  const date = new Date();
  const year = date.getFullYear().toString().slice(2);
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const random = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0");

  return `QS${year}${month}${day}-${random}`;
}

export async function POST(request: Request) {
  try {
    const payload = await getPayload({ config });
    const body = await request.json();

    // Map payment method from IntaSend to our internal format if needed
    let paymentMethod = body.payment?.method ?? "card"; 
    if (paymentMethod) {
      if (paymentMethod.toLowerCase().includes("mpesa")) {
        paymentMethod = "mpesa";
      } else if (paymentMethod.toLowerCase().includes("bank")) {
        paymentMethod = "bank";
      } else {
        paymentMethod = "card"; 
      }
    }

    // Create the order with payment information
    const order = await payload.create({
      collection: "orders",
      data: {
        orderNumber: generateOrderNumber(),
        customer: {
          firstName: body.customer.firstName,
          lastName: body.customer.lastName,
          email: body.customer.email,
          phone: body.customer.phone,
        },
        shippingAddress: {
          address: body.shippingAddress.address,
          city: body.shippingAddress.city,
          country: body.shippingAddress.country,
          postalCode: body.shippingAddress.postalCode,
        },
        items: body.items.map((item: any) => ({
          productId: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image ?? null,
        })),
        subtotal: body.subtotal,
        shippingFee: body.shippingFee,
        total: body.total,
        status: body.status ?? "pending",
        payment: {
          method: paymentMethod,
          transactionId: body.payment?.transactionId ?? null,
          status: body.payment?.status ?? "pending",
          details: body.payment?.details ?? {},
        },
      },
    });

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const payload = await getPayload({ config });

    // Get the authenticated user
    const { user } = await payload.auth({ headers: request.headers });

    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Fetch orders for the authenticated user
    const orders = await payload.find({
      collection: "orders",
      where: {
        "customer.email": {
          equals: user.email,
        },
      },
      sort: "-createdAt",
      limit: 50,
      depth: 1, // Reduce depth to avoid session issues
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error("Orders fetch error:", error);

    // If it's a session error, try to return empty result instead of error
    if (
      error instanceof Error &&
      (error.message?.includes("session") || error.message?.includes("Session"))
    ) {
      console.warn("Session error detected, returning empty orders list");
      return NextResponse.json({ docs: [], totalDocs: 0, limit: 50, page: 1 });
    }

    return NextResponse.json(
      { message: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}
