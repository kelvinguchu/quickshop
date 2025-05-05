import { getPayload } from "payload";
import { NextResponse } from "next/server";
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
    let paymentMethod = body.payment?.method || "card"; // Default to card
    if (paymentMethod) {
      if (paymentMethod.toLowerCase().includes("mpesa")) {
        paymentMethod = "mpesa";
      } else if (paymentMethod.toLowerCase().includes("bank")) {
        paymentMethod = "bank";
      } else {
        paymentMethod = "card"; // Default
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
          image: item.image || null,
        })),
        subtotal: body.subtotal,
        shippingFee: body.shippingFee,
        total: body.total,
        status: body.status || "pending",
        payment: {
          method: paymentMethod,
          transactionId: body.payment?.transactionId || null,
          status: body.payment?.status || "pending",
          details: body.payment?.details || {},
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

export async function GET(request: Request) {
  try {
    const payload = await getPayload({ config });
    const orders = await payload.find({
      collection: "orders",
    });

    return NextResponse.json(orders.docs);
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}
