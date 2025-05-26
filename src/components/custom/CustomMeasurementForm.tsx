"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, CreditCard } from "lucide-react";
import Link from "next/link";
import type { Product, User } from "@/payload-types";
import { useExchangeRate } from "@/hooks/useExchangeRate";
import { useAuth } from "@/lib/auth/AuthContext";
import { useCSRF } from "@/hooks/useCSRF";
import { ProductSummaryCard } from "./ProductSummaryCard";
import { MeasurementsSection } from "./MeasurementsSection";
import { CustomerInfoSection } from "./CustomerInfoSection";
import { ShippingAddressSection } from "./ShippingAddressSection";
import { AuthenticationPrompt } from "./AuthenticationPrompt";
import type { MeasurementData } from "./types";

// Extended User interface until types are regenerated
interface ExtendedUser {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  savedMeasurements?: {
    abaya?: {
      chest?: number;
      shoulder?: number;
      sleeve?: number;
      length?: number;
      waist?: number;
      hip?: number;
    };
    qamis?: {
      chest?: number;
      shoulder?: number;
      sleeve?: number;
      length?: number;
      waist?: number;
      hip?: number;
    };
  };
  savedShippingAddress?: {
    address?: string;
    city?: string;
    country?: string;
    postalCode?: string;
  };
}

// Declare IntaSend types
declare global {
  interface Window {
    IntaSend: any;
  }
}

interface CustomMeasurementFormProps {
  product: Product;
}

export default function CustomMeasurementForm({
  product,
}: Readonly<CustomMeasurementFormProps>) {
  const router = useRouter();
  const { user, isLoading: isAuthLoading } = useAuth();
  const {
    exchangeRate,
    isLoading: isExchangeLoading,
    isCached,
    cacheAge,
  } = useExchangeRate();
  const { token: csrfToken, isLoading: isCSRFLoading } = useCSRF();
  const paymentButtonRef = useRef<HTMLDivElement>(null);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [formValid, setFormValid] = useState(false);
  const [initialMeasurements, setInitialMeasurements] =
    useState<MeasurementData | null>(null);

  // Calculate 30% deposit
  const depositAmount = product.price * 0.3;
  const amountInKES =
    exchangeRate > 0 ? Math.round(depositAmount * exchangeRate * 100) / 100 : 0;

  // Handle image source
  let imageSource: string | undefined;
  if (
    product.mainImage &&
    typeof product.mainImage === "object" &&
    "url" in product.mainImage &&
    product.mainImage.url
  ) {
    imageSource = product.mainImage.url;
  }
  const finalImageSource = imageSource ?? "Quick Shop";

  const [measurementData, setMeasurementData] = useState<MeasurementData>({
    // Measurements
    chest: "",
    shoulder: "",
    sleeve: "",
    length: "",
    waist: "",
    hip: "",
    // Customer info
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    // Shipping
    address: "",
    city: "",
    country: "Kenya",
    postalCode: "",
    // Notes
    notes: "",
  });

  // Get category slug from product
  const getCategorySlug = (): string => {
    if (typeof product.category === "string") {
      return product.category;
    }
    return product.category?.slug || "abaya";
  };

  const categorySlug = getCategorySlug();

  // Pre-fill user data when authenticated user is loaded
  useEffect(() => {
    if (user && !isAuthLoading) {
      // Cast user to extended interface
      const extendedUser = user as ExtendedUser;

      // Get category-specific measurements
      const categoryMeasurements =
        extendedUser.savedMeasurements?.[categorySlug as "abaya" | "qamis"];

      const newMeasurementData = {
        ...measurementData,
        firstName: user.firstName ?? "",
        lastName: user.lastName ?? "",
        email: user.email ?? "",
        phone: extendedUser.phone ?? "",
        // Pre-fill saved measurements if available for this category
        chest: categoryMeasurements?.chest?.toString() ?? "",
        shoulder: categoryMeasurements?.shoulder?.toString() ?? "",
        sleeve: categoryMeasurements?.sleeve?.toString() ?? "",
        length: categoryMeasurements?.length?.toString() ?? "",
        waist: categoryMeasurements?.waist?.toString() ?? "",
        hip: categoryMeasurements?.hip?.toString() ?? "",
        // Pre-fill saved shipping address if available
        address: extendedUser.savedShippingAddress?.address ?? "",
        city: extendedUser.savedShippingAddress?.city ?? "",
        country: extendedUser.savedShippingAddress?.country ?? "Kenya",
        postalCode: extendedUser.savedShippingAddress?.postalCode ?? "",
      };

      setMeasurementData(newMeasurementData);

      // Store initial measurements to detect changes later
      setInitialMeasurements(newMeasurementData);
    }
  }, [user, isAuthLoading, categorySlug]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setMeasurementData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Function to save measurements and shipping address to user profile
  const saveMeasurementsAndShipping = async () => {
    if (!user) return;

    // Check if measurements have changed from initial values
    const measurementsChanged =
      initialMeasurements &&
      (measurementData.chest !== initialMeasurements.chest ||
        measurementData.shoulder !== initialMeasurements.shoulder ||
        measurementData.sleeve !== initialMeasurements.sleeve ||
        measurementData.length !== initialMeasurements.length ||
        measurementData.waist !== initialMeasurements.waist ||
        measurementData.hip !== initialMeasurements.hip);

    // Check if shipping address has changed from initial values
    const shippingChanged =
      initialMeasurements &&
      (measurementData.address !== initialMeasurements.address ||
        measurementData.city !== initialMeasurements.city ||
        measurementData.country !== initialMeasurements.country ||
        measurementData.postalCode !== initialMeasurements.postalCode);

    // Only save if there are changes or if it's the first time (no initial measurements)
    if (!initialMeasurements || measurementsChanged || shippingChanged) {
      try {
        const requestBody: any = {
          category: categorySlug,
        };

        // Only include measurements if they changed or it's first time
        if (!initialMeasurements || measurementsChanged) {
          requestBody.measurements = {
            chest: measurementData.chest,
            shoulder: measurementData.shoulder,
            sleeve: measurementData.sleeve,
            length: measurementData.length,
            waist: measurementData.waist,
            hip: measurementData.hip,
          };
        }

        // Only include shipping if it changed or it's first time
        if (!initialMeasurements || shippingChanged) {
          requestBody.shippingAddress = {
            address: measurementData.address,
            city: measurementData.city,
            country: measurementData.country,
            postalCode: measurementData.postalCode,
          };
        }

        const response = await fetch("/api/users/measurements", {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
          // Silent failure - measurements saving is not critical for order flow
        }
      } catch (error) {
        // Silent failure - measurements saving is not critical for order flow
      }
    }
  };

  // Check form validity
  useEffect(() => {
    const isValid =
      measurementData.chest.trim() !== "" &&
      measurementData.shoulder.trim() !== "" &&
      measurementData.sleeve.trim() !== "" &&
      measurementData.length.trim() !== "" &&
      measurementData.waist.trim() !== "" &&
      measurementData.hip.trim() !== "" &&
      measurementData.firstName.trim() !== "" &&
      measurementData.lastName.trim() !== "" &&
      measurementData.email.trim() !== "" &&
      measurementData.phone.trim() !== "" &&
      measurementData.address.trim() !== "" &&
      measurementData.city.trim() !== "" &&
      measurementData.country.trim() !== "" &&
      measurementData.postalCode.trim() !== "" &&
      !!csrfToken; // Ensure CSRF token is available

    setFormValid(isValid);

    // Update payment button state
    const payButton = paymentButtonRef.current?.firstChild as HTMLButtonElement;
    if (payButton) {
      payButton.disabled = !isValid;
      payButton.style.backgroundColor = isValid ? "#382f21" : "#ccc";
      payButton.style.cursor = isValid ? "pointer" : "not-allowed";
      payButton.style.opacity = isValid ? "1" : "0.7";
    }
  }, [measurementData, csrfToken]);

  // Load IntaSend script
  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "https://unpkg.com/intasend-inlinejs-sdk@3.0.3/build/intasend-inline.js";
    script.async = true;
    script.onload = () => setIsScriptLoaded(true);
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  // Initialize IntaSend payment
  useEffect(() => {
    if (!isScriptLoaded || !paymentButtonRef.current) return;

    // Clear existing buttons
    if (paymentButtonRef.current.firstChild) {
      paymentButtonRef.current.innerHTML = "";
    }

    // Create payment button
    const button = document.createElement("button");
    button.className = "intaSendPayButton";
    button.setAttribute("data-amount", amountInKES.toString());
    button.setAttribute("data-currency", "KES");

    // Only set attributes when actual values are available
    if (measurementData.email) {
      button.setAttribute("data-email", measurementData.email);
    }
    if (measurementData.firstName) {
      button.setAttribute("data-first_name", measurementData.firstName);
    }
    if (measurementData.lastName) {
      button.setAttribute("data-last_name", measurementData.lastName);
    }
    if (measurementData.phone) {
      button.setAttribute("data-phone_number", measurementData.phone);
    }
    if (measurementData.country) {
      button.setAttribute(
        "data-country",
        measurementData.country.substring(0, 2).toUpperCase()
      );
    }
    button.textContent = `Pay Deposit - KES ${amountInKES.toFixed(2)}`;

    // Style the button
    button.disabled = !formValid;
    button.style.width = "100%";
    button.style.padding = "0.75rem 1rem";
    button.style.backgroundColor = formValid ? "#382f21" : "#ccc";
    button.style.color = "white";
    button.style.border = "none";
    button.style.borderRadius = "0.125rem";
    button.style.fontFamily = "Montserrat, sans-serif";
    button.style.fontWeight = "500";
    button.style.fontSize = "0.875rem";
    button.style.letterSpacing = "0.05em";
    button.style.textTransform = "uppercase";
    button.style.cursor = formValid ? "pointer" : "not-allowed";
    button.style.opacity = formValid ? "1" : "0.7";
    button.style.transition = "all 0.2s ease";

    paymentButtonRef.current.appendChild(button);

    // Initialize IntaSend
    const intaSend = new window.IntaSend({
      publicAPIKey: process.env.NEXT_PUBLIC_INTASEND_PUBLIC_KEY,
      live: false,
    });

    intaSend
      .on("COMPLETE", async (results: any) => {
        setIsProcessing(true);

        try {
          // Save measurements and shipping address to user profile
          await saveMeasurementsAndShipping();

          // Create custom order
          const headers: Record<string, string> = {
            "Content-Type": "application/json",
          };

          // Add CSRF token if available
          if (csrfToken) {
            headers["x-csrf-token"] = csrfToken;
          }

          const response = await fetch("/api/custom-orders", {
            method: "POST",
            headers,
            credentials: "include", // Include authentication cookies
            body: JSON.stringify({
              product: {
                id: product.id,
                name: product.name,
                price: product.price,
                image: finalImageSource,
              },
              measurements: {
                chest: measurementData.chest,
                shoulder: measurementData.shoulder,
                sleeve: measurementData.sleeve,
                length: measurementData.length,
                waist: measurementData.waist,
                hip: measurementData.hip,
              },
              customer: {
                firstName: measurementData.firstName,
                lastName: measurementData.lastName,
                email: measurementData.email,
                phone: measurementData.phone,
              },
              shippingAddress: {
                address: measurementData.address,
                city: measurementData.city,
                country: measurementData.country,
                postalCode: measurementData.postalCode,
              },
              depositAmount,
              remainingAmount: product.price - depositAmount,
              totalAmount: product.price,
              payment: {
                method: results.method ?? "card",
                transactionId: results.transactionId ?? results.id,
                status: "complete",
                details: results,
              },
              notes: measurementData.notes,
              status: "deposit-paid",
            }),
          });

          if (!response.ok) {
            if (response.status === 401) {
              throw new Error(
                "Authentication required. Please log in and try again."
              );
            }
            if (response.status === 403) {
              throw new Error(
                "Security validation failed. Please refresh the page and try again."
              );
            }
            throw new Error("Failed to create custom order");
          }

          const order = await response.json();
          router.push(`/custom/confirmation?order=${order.id}`);
        } catch (error) {
          setPaymentError(
            "Payment received but failed to create order. Please contact support immediately with reference: " +
              (results.transactionId ?? results.id)
          );
          setIsProcessing(false);
        }
      })
      .on("FAILED", (results: any) => {
        setPaymentError(
          "Payment failed. Please try again or use a different payment method."
        );
      })
      .on("IN-PROGRESS", (results: any) => {
        setIsProcessing(true);
      });
  }, [
    isScriptLoaded,
    measurementData,
    amountInKES,
    router,
    product,
    depositAmount,
    finalImageSource,
    formValid,
    exchangeRate,
  ]);

  // Show loading state while checking authentication or CSRF
  if (isAuthLoading || isCSRFLoading) {
    return (
      <div className='space-y-6'>
        {/* Back Button */}

        <div className='flex items-center justify-center py-12'>
          <div className='text-center'>
            <div className='inline-block h-8 w-8 animate-spin rounded-full border-2 border-[#8a7d65] border-t-transparent mb-4'></div>
            <p className='text-[#8a7d65]'>Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show authentication required message if user is not logged in
  if (!user) {
    return <AuthenticationPrompt productId={product.id} />;
  }

  return (
    <div className='space-y-6'>
      {/* Back Button */}

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        {/* Product Info */}
        <div className='lg:col-span-1'>
          <ProductSummaryCard
            product={product}
            depositAmount={depositAmount}
            finalImageSource={finalImageSource}
          />
        </div>

        {/* Measurement Form */}
        <div className='lg:col-span-2 space-y-6'>
          {/* Measurements Section */}
          <MeasurementsSection
            measurementData={measurementData}
            handleChange={handleChange}
            product={product}
          />

          {/* Customer Info Section */}
          <CustomerInfoSection
            measurementData={measurementData}
            handleChange={handleChange}
            user={user}
          />

          {/* Shipping Address Section */}
          <ShippingAddressSection
            measurementData={measurementData}
            handleChange={handleChange}
          />

          {/* Payment Section */}
          <div className='bg-white rounded-sm border border-[#e0d8c9] p-4'>
            <h3 className='font-cinzel text-sm md:text-lg text-[#382f21] mb-4 flex items-center gap-2'>
              <CreditCard className='h-5 w-5' />
              Payment - Deposit (30%)
            </h3>

            <div className='mb-4 p-3 bg-amber-50 border border-amber-200 rounded-sm'>
              <p className='text-sm text-amber-800'>
                <strong>Payment Process:</strong> Pay 30% deposit now ($
                {depositAmount.toFixed(2)}). The remaining 70% ($
                {(product.price - depositAmount).toFixed(2)}) will be collected
                upon completion.
              </p>
            </div>

            <div className='text-sm text-[#8a7d65] mb-4'>
              <p>
                Deposit Amount: KES {amountInKES.toFixed(2)} ($
                {depositAmount.toFixed(2)})
              </p>
              {!isExchangeLoading && (
                <p className='text-xs mt-1'>
                  Exchange Rate: 1 USD = {exchangeRate.toFixed(2)} KES
                  {isCached && (
                    <span className='text-amber-600'>
                      {" "}
                      (Cached {cacheAge}min ago)
                    </span>
                  )}
                </p>
              )}
            </div>

            {paymentError && (
              <div className='bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-sm mb-4'>
                {paymentError}
              </div>
            )}

            {isProcessing ? (
              <div className='text-center py-4'>
                <div className='inline-block h-6 w-6 animate-spin rounded-full border-2 border-[#8a7d65] border-t-transparent'></div>
                <p className='mt-2 text-sm text-[#8a7d65]'>
                  Processing your payment...
                </p>
              </div>
            ) : (
              <div ref={paymentButtonRef} className='w-full'>
                {!isScriptLoaded && (
                  <div className='text-center py-4'>
                    <div className='inline-block h-6 w-6 animate-spin rounded-full border-2 border-[#8a7d65] border-t-transparent'></div>
                    <p className='mt-2 text-sm text-[#8a7d65]'>
                      Loading payment options...
                    </p>
                  </div>
                )}
              </div>
            )}

            {!formValid && (
              <p className='mt-2 text-xs text-amber-600 text-center'>
                {!csrfToken
                  ? "Loading security token..."
                  : "Please fill in all required fields to enable payment"}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
