import { NextRequest, NextResponse } from "next/server";
import { getPayload } from "payload";
import config from "@/payload.config";

interface MeasurementData {
  chest: number;
  shoulder: number;
  sleeve: number;
  length: number;
  waist: number;
  hip: number;
}

interface ShippingData {
  address: string;
  city: string;
  country: string;
  postalCode: string;
}

async function validateMeasurementData(
  data: any,
  category: string
): Promise<{
  success?: boolean;
  error?: { message: string; status: number };
  measurements?: MeasurementData;
}> {
  const { chest, shoulder, sleeve, length, waist, hip } = data;

  // Validate category
  if (!["abaya", "qamis"].includes(category)) {
    return {
      error: {
        message: "Invalid category. Must be 'abaya' or 'qamis'.",
        status: 400,
      },
    };
  }

  // Validate that all measurements are provided and are positive numbers
  const measurements = [
    { name: "chest", value: chest },
    { name: "shoulder", value: shoulder },
    { name: "sleeve", value: sleeve },
    { name: "length", value: length },
    { name: "waist", value: waist },
    { name: "hip", value: hip },
  ];

  for (const measurement of measurements) {
    const numValue = Number(measurement.value);
    if (isNaN(numValue) || numValue < 0 || numValue > 300) {
      return {
        error: {
          message: `Invalid ${measurement.name} measurement for ${category}. Must be a number between 0 and 300 cm.`,
          status: 400,
        },
      };
    }
  }

  return {
    success: true,
    measurements: {
      chest: Number(chest),
      shoulder: Number(shoulder),
      sleeve: Number(sleeve),
      length: Number(length),
      waist: Number(waist),
      hip: Number(hip),
    },
  };
}

async function validateShippingData(data: any): Promise<{
  success?: boolean;
  error?: { message: string; status: number };
  shipping?: ShippingData;
}> {
  const { address, city, country, postalCode } = data;

  // Validate required fields
  if (!address || !city || !country || !postalCode) {
    return {
      error: {
        message: "All shipping address fields are required",
        status: 400,
      },
    };
  }

  // Validate field lengths
  if (
    address.length > 200 ||
    city.length > 100 ||
    country.length > 100 ||
    postalCode.length > 20
  ) {
    return {
      error: {
        message: "One or more shipping address fields are too long",
        status: 400,
      },
    };
  }

  return {
    success: true,
    shipping: {
      address: address.trim(),
      city: city.trim(),
      country: country.trim(),
      postalCode: postalCode.trim(),
    },
  };
}

export async function PATCH(request: NextRequest) {
  try {
    const payload = await getPayload({ config });

    // Get the authenticated user
    const { user } = await payload.auth({ headers: request.headers });
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { measurements, shippingAddress, category } = body;

    const updateData: any = {};

    // Validate and prepare measurements if provided
    if (measurements && category) {
      const measurementValidation = await validateMeasurementData(
        measurements,
        category
      );
      if (measurementValidation.error) {
        return NextResponse.json(
          { message: measurementValidation.error.message },
          { status: measurementValidation.error.status }
        );
      }

      // Get current user data to preserve existing measurements for other categories
      const currentUser = await payload.findByID({
        collection: "users",
        id: user.id,
        depth: 2,
      });

      // Preserve existing measurements structure
      const existingMeasurements = currentUser.savedMeasurements || {};

      updateData.savedMeasurements = {
        ...existingMeasurements,
        [category]: measurementValidation.measurements,
      };
    }

    // Validate and prepare shipping address if provided
    if (shippingAddress) {
      const shippingValidation = await validateShippingData(shippingAddress);
      if (shippingValidation.error) {
        return NextResponse.json(
          { message: shippingValidation.error.message },
          { status: shippingValidation.error.status }
        );
      }
      updateData.savedShippingAddress = shippingValidation.shipping;
    }

    // Update the user with new data
    const updatedUser = await payload.update({
      collection: "users",
      id: user.id,
      data: updateData,
      depth: 2,
    });

    return NextResponse.json({
      message: `Data saved successfully${category ? ` for ${category}` : ""}`,
      user: {
        id: updatedUser.id,
        savedMeasurements: updatedUser.savedMeasurements,
        savedShippingAddress: updatedUser.savedShippingAddress,
      },
    });
  } catch (error) {
    console.error("Error saving user data:", error);
    return NextResponse.json(
      { message: "Failed to save data" },
      { status: 500 }
    );
  }
}
