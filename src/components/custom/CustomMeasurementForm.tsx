"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowLeft, Ruler, CreditCard } from "lucide-react";
import Link from "next/link";
import type { Product } from "@/payload-types";
import { useExchangeRate } from "@/hooks/useExchangeRate";

// Declare IntaSend types
declare global {
  interface Window {
    IntaSend: any;
  }
}

interface MeasurementData {
  // Basic measurements
  chest: string;
  shoulder: string;
  sleeve: string;
  length: string;
  waist: string;
  hip: string;
  // Customer info
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  // Shipping address
  address: string;
  city: string;
  country: string;
  postalCode: string;
  // Additional notes
  notes: string;
}

interface CustomMeasurementFormProps {
  product: Product;
}

export default function CustomMeasurementForm({
  product,
}: Readonly<CustomMeasurementFormProps>) {
  const router = useRouter();
  const {
    exchangeRate,
    isLoading: isExchangeLoading,
    isCached,
    cacheAge,
  } = useExchangeRate();
  const paymentButtonRef = useRef<HTMLDivElement>(null);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [formValid, setFormValid] = useState(false);

  // Calculate 30% deposit
  const depositAmount = product.price * 0.3;
  const amountInKES = Math.round(depositAmount * exchangeRate); // Convert to KES using real-time rate

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
      measurementData.postalCode.trim() !== "";

    setFormValid(isValid);

    // Update payment button state
    const payButton = paymentButtonRef.current?.firstChild as HTMLButtonElement;
    if (payButton) {
      payButton.disabled = !isValid;
      payButton.style.backgroundColor = isValid ? "#382f21" : "#ccc";
      payButton.style.cursor = isValid ? "pointer" : "not-allowed";
      payButton.style.opacity = isValid ? "1" : "0.7";
    }
  }, [measurementData]);

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
    button.setAttribute(
      "data-email",
      measurementData.email || "customer@example.com"
    );
    button.setAttribute(
      "data-first_name",
      measurementData.firstName || "Customer"
    );
    button.setAttribute("data-last_name", measurementData.lastName || "");
    button.setAttribute("data-phone_number", measurementData.phone);
    button.setAttribute(
      "data-country",
      measurementData.country.substring(0, 2).toUpperCase()
    );
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
          // Create custom order
          const response = await fetch("/api/custom-orders", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
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
            throw new Error("Failed to create custom order");
          }

          const order = await response.json();
          router.push(`/custom/confirmation?order=${order.id}`);
        } catch (error) {
          console.error("Error creating custom order:", error);
          setPaymentError(
            "Payment received but failed to create order. Please contact support."
          );
          setIsProcessing(false);
        }
      })
      .on("FAILED", (results: any) => {
        console.error("Payment failed", results);
        setPaymentError(
          "Payment failed. Please try again or use a different payment method."
        );
      })
      .on("IN-PROGRESS", (results: any) => {
        console.log("Payment in progress", results);
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

  return (
    <div className='space-y-6'>
      {/* Back Button */}
      <Link
        href='/custom'
        className='inline-flex items-center gap-2 text-[#8a7d65] hover:text-[#382f21] transition-colors text-sm'>
        <ArrowLeft className='h-4 w-4' />
        Back to Products
      </Link>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        {/* Product Info */}
        <div className='lg:col-span-1'>
          <div className='bg-white rounded-sm border border-[#e0d8c9] p-4 sticky top-4'>
            <div className='aspect-[4/5] w-full bg-[#f9f6f2] rounded-sm overflow-hidden mb-4'>
              <Image
                src={finalImageSource}
                alt={product.name}
                width={300}
                height={375}
                className='w-full h-full object-cover'
              />
            </div>
            <h3 className='font-cinzel text-lg text-[#382f21] mb-2'>
              {product.name}
            </h3>
            <div className='space-y-1 text-sm text-[#8a7d65]'>
              <p>
                Full Price:{" "}
                <span className='font-medium'>${product.price.toFixed(2)}</span>
              </p>
              <p>
                Deposit (30%):{" "}
                <span className='font-medium text-amber-600'>
                  ${depositAmount.toFixed(2)}
                </span>
              </p>
              <p>
                Remaining:{" "}
                <span className='font-medium'>
                  ${(product.price - depositAmount).toFixed(2)}
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Measurement Form */}
        <div className='lg:col-span-2 space-y-6'>
          {/* Measurements Section */}
          <div className='bg-white rounded-sm border border-[#e0d8c9] p-4'>
            <h3 className='font-cinzel text-sm md:text-lg text-[#382f21] mb-4 flex items-center gap-2'>
              <Ruler className='h-5 w-5' />
              Body Measurements (cm)
            </h3>

            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
              <div>
                <label
                  htmlFor='chest'
                  className='block text-xs text-[#8a7d65] mb-1'>
                  Chest/Bust*
                </label>
                <input
                  type='number'
                  id='chest'
                  name='chest'
                  value={measurementData.chest}
                  onChange={handleChange}
                  className='w-full border border-[#e0d8c9] rounded-sm px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#8a7d65]'
                  placeholder='e.g. 96'
                  required
                />
              </div>

              <div>
                <label
                  htmlFor='shoulder'
                  className='block text-xs text-[#8a7d65] mb-1'>
                  Shoulder Width*
                </label>
                <input
                  type='number'
                  id='shoulder'
                  name='shoulder'
                  value={measurementData.shoulder}
                  onChange={handleChange}
                  className='w-full border border-[#e0d8c9] rounded-sm px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#8a7d65]'
                  placeholder='e.g. 42'
                  required
                />
              </div>

              <div>
                <label
                  htmlFor='sleeve'
                  className='block text-xs text-[#8a7d65] mb-1'>
                  Sleeve Length*
                </label>
                <input
                  type='number'
                  id='sleeve'
                  name='sleeve'
                  value={measurementData.sleeve}
                  onChange={handleChange}
                  className='w-full border border-[#e0d8c9] rounded-sm px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#8a7d65]'
                  placeholder='e.g. 60'
                  required
                />
              </div>

              <div>
                <label
                  htmlFor='length'
                  className='block text-xs text-[#8a7d65] mb-1'>
                  Total Length*
                </label>
                <input
                  type='number'
                  id='length'
                  name='length'
                  value={measurementData.length}
                  onChange={handleChange}
                  className='w-full border border-[#e0d8c9] rounded-sm px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#8a7d65]'
                  placeholder='e.g. 140'
                  required
                />
              </div>

              <div>
                <label
                  htmlFor='waist'
                  className='block text-xs text-[#8a7d65] mb-1'>
                  Waist*
                </label>
                <input
                  type='number'
                  id='waist'
                  name='waist'
                  value={measurementData.waist}
                  onChange={handleChange}
                  className='w-full border border-[#e0d8c9] rounded-sm px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#8a7d65]'
                  placeholder='e.g. 80'
                  required
                />
              </div>

              <div>
                <label
                  htmlFor='hip'
                  className='block text-xs text-[#8a7d65] mb-1'>
                  Hip*
                </label>
                <input
                  type='number'
                  id='hip'
                  name='hip'
                  value={measurementData.hip}
                  onChange={handleChange}
                  className='w-full border border-[#e0d8c9] rounded-sm px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#8a7d65]'
                  placeholder='e.g. 100'
                  required
                />
              </div>
            </div>

            <div className='mt-4'>
              <label
                htmlFor='notes'
                className='block text-xs text-[#8a7d65] mb-1'>
                Additional Notes (Optional)
              </label>
              <textarea
                id='notes'
                name='notes'
                value={measurementData.notes}
                onChange={handleChange}
                rows={3}
                className='w-full border border-[#e0d8c9] rounded-sm px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#8a7d65]'
                placeholder='Any special requirements or notes...'
              />
            </div>
          </div>

          {/* Customer Info Section */}
          <div className='bg-white rounded-sm border border-[#e0d8c9] p-4'>
            <h3 className='font-cinzel text-sm md:text-lg text-[#382f21] mb-4'>
              Customer Information
            </h3>

            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
              <div>
                <label
                  htmlFor='firstName'
                  className='block text-xs text-[#8a7d65] mb-1'>
                  First Name*
                </label>
                <input
                  type='text'
                  id='firstName'
                  name='firstName'
                  value={measurementData.firstName}
                  onChange={handleChange}
                  className='w-full border border-[#e0d8c9] rounded-sm px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#8a7d65]'
                  required
                />
              </div>

              <div>
                <label
                  htmlFor='lastName'
                  className='block text-xs text-[#8a7d65] mb-1'>
                  Last Name*
                </label>
                <input
                  type='text'
                  id='lastName'
                  name='lastName'
                  value={measurementData.lastName}
                  onChange={handleChange}
                  className='w-full border border-[#e0d8c9] rounded-sm px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#8a7d65]'
                  required
                />
              </div>

              <div>
                <label
                  htmlFor='email'
                  className='block text-xs text-[#8a7d65] mb-1'>
                  Email Address*
                </label>
                <input
                  type='email'
                  id='email'
                  name='email'
                  value={measurementData.email}
                  onChange={handleChange}
                  className='w-full border border-[#e0d8c9] rounded-sm px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#8a7d65]'
                  required
                />
              </div>

              <div>
                <label
                  htmlFor='phone'
                  className='block text-xs text-[#8a7d65] mb-1'>
                  Phone Number*
                </label>
                <input
                  type='tel'
                  id='phone'
                  name='phone'
                  value={measurementData.phone}
                  onChange={handleChange}
                  className='w-full border border-[#e0d8c9] rounded-sm px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#8a7d65]'
                  required
                />
              </div>
            </div>
          </div>

          {/* Shipping Address Section */}
          <div className='bg-white rounded-sm border border-[#e0d8c9] p-4'>
            <h3 className='font-cinzel text-sm md:text-lg text-[#382f21] mb-4'>
              Shipping Address
            </h3>

            <div className='space-y-4'>
              <div>
                <label
                  htmlFor='address'
                  className='block text-xs text-[#8a7d65] mb-1'>
                  Address*
                </label>
                <input
                  type='text'
                  id='address'
                  name='address'
                  value={measurementData.address}
                  onChange={handleChange}
                  className='w-full border border-[#e0d8c9] rounded-sm px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#8a7d65]'
                  required
                />
              </div>

              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                <div>
                  <label
                    htmlFor='city'
                    className='block text-xs text-[#8a7d65] mb-1'>
                    City*
                  </label>
                  <input
                    type='text'
                    id='city'
                    name='city'
                    value={measurementData.city}
                    onChange={handleChange}
                    className='w-full border border-[#e0d8c9] rounded-sm px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#8a7d65]'
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor='postalCode'
                    className='block text-xs text-[#8a7d65] mb-1'>
                    Postal Code*
                  </label>
                  <input
                    type='text'
                    id='postalCode'
                    name='postalCode'
                    value={measurementData.postalCode}
                    onChange={handleChange}
                    className='w-full border border-[#e0d8c9] rounded-sm px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#8a7d65]'
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor='country'
                    className='block text-xs text-[#8a7d65] mb-1'>
                    Country*
                  </label>
                  <select
                    id='country'
                    name='country'
                    value={measurementData.country}
                    onChange={handleChange}
                    className='w-full border border-[#e0d8c9] rounded-sm px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#8a7d65]'
                    required>
                    <option value='Kenya'>Kenya</option>
                    <option value='Uganda'>Uganda</option>
                    <option value='Tanzania'>Tanzania</option>
                    <option value='Rwanda'>Rwanda</option>
                    <option value='Ethiopia'>Ethiopia</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

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
                Please fill in all required fields to enable payment
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
