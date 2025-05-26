"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart/CartContext";
import { OrderSummary } from "@/components/checkout/OrderSummary";
import { useExchangeRate } from "@/hooks/useExchangeRate";

// Declare IntaSend types to match the JS SDK
declare global {
  interface Window {
    IntaSend: any;
  }
}

export interface CheckoutFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  postalCode: string;
}

export function CheckoutForm() {
  const router = useRouter();
  const { items, total, clearCart } = useCart();
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
  const [formData, setFormData] = useState<CheckoutFormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    country: "Kenya",
    postalCode: "",
  });
  const [formValid, setFormValid] = useState(false);

  // Fixed shipping fee in USD
  const shippingFee = 2.5;
  const finalTotal = total + shippingFee;
  // Convert final total to KES using real-time exchange rate
  const finalAmountInKES = Math.round(finalTotal * exchangeRate);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Check form validity whenever form data changes
  useEffect(() => {
    const isValid =
      formData.firstName.trim() !== "" &&
      formData.lastName.trim() !== "" &&
      formData.email.trim() !== "" &&
      formData.phone.trim() !== "" &&
      formData.address.trim() !== "" &&
      formData.city.trim() !== "" &&
      formData.country.trim() !== "" &&
      formData.postalCode.trim() !== "";

    setFormValid(isValid);

    // If we already have the pay button loaded, update its disabled state
    if (paymentButtonRef.current && paymentButtonRef.current.firstChild) {
      const payButton = paymentButtonRef.current
        .firstChild as HTMLButtonElement;
      payButton.disabled = !isValid;

      // Update button styling based on validity
      if (isValid) {
        payButton.style.backgroundColor = "#382f21";
        payButton.style.cursor = "pointer";
        payButton.style.opacity = "1";
      } else {
        payButton.style.backgroundColor = "#ccc";
        payButton.style.cursor = "not-allowed";
        payButton.style.opacity = "0.7";
      }
    }
  }, [formData]);

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

  // Initialize IntaSend when script is loaded and form is valid
  useEffect(() => {
    if (!isScriptLoaded || !paymentButtonRef.current) return;

    // Clear any existing buttons first
    if (paymentButtonRef.current.firstChild) {
      paymentButtonRef.current.innerHTML = "";
    }

    // Create the button element
    const button = document.createElement("button");
    button.className = "intaSendPayButton";
    button.setAttribute("data-amount", finalAmountInKES.toString());
    button.setAttribute("data-currency", "KES");
    button.setAttribute("data-email", formData.email || "customer@example.com");
    button.setAttribute("data-first_name", formData.firstName || "Customer");
    button.setAttribute("data-last_name", formData.lastName || "");
    button.setAttribute("data-phone_number", formData.phone);
    button.setAttribute(
      "data-country",
      (formData.country || "Kenya").substring(0, 2).toUpperCase()
    );
    button.textContent = "Pay Now";

    // Initially disable the button if form is not valid
    button.disabled = !formValid;

    // Style the button to match our design
    button.style.width = "100%";
    button.style.marginTop = "1rem";
    button.style.padding = "0.5rem 1rem";
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

    // Append button to container
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
          // Create the order after successful payment
          const response = await fetch("/api/orders", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              customer: {
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                phone: formData.phone,
              },
              shippingAddress: {
                address: formData.address,
                city: formData.city,
                country: formData.country,
                postalCode: formData.postalCode,
              },
              items: items.map((item) => ({
                id: item.id,
                name: item.name,
                price: item.price,
                quantity: item.quantity,
                image: item.image,
              })),
              subtotal: total,
              shippingFee,
              total: finalTotal,
              payment: {
                method: results.method ?? "card",
                transactionId: results.transactionId ?? results.id,
                status: "complete",
                details: results,
              },
              status: "paid",
            }),
          });

          if (!response.ok) {
            throw new Error("Failed to create order");
          }

          const order = await response.json();

          // Clear cart and redirect to confirmation page
          clearCart();
          router.push(`/checkout/confirmation?order=${order.id}`);
        } catch (error) {
          console.error("Error creating order:", error);
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
    formData,
    finalAmountInKES,
    router,
    clearCart,
    total,
    finalTotal,
    shippingFee,
    items,
    formValid,
    exchangeRate,
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Form submission is handled by the IntaSend payment button
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-6'>
      <div className='bg-white rounded-sm border border-[#e0d8c9] p-4'>
        <h2 className='font-cinzel text-lg text-[#382f21] mb-4'>
          Customer Info
        </h2>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
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
              value={formData.firstName}
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
              value={formData.lastName}
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
              value={formData.email}
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
              value={formData.phone}
              onChange={handleChange}
              className='w-full border border-[#e0d8c9] rounded-sm px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#8a7d65]'
              required
            />
          </div>
        </div>
      </div>

      <div className='bg-white rounded-sm border border-[#e0d8c9] p-4'>
        <h2 className='font-cinzel text-lg text-[#382f21] mb-4'>
          Shipping Address
        </h2>

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
              value={formData.address}
              onChange={handleChange}
              className='w-full border border-[#e0d8c9] rounded-sm px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#8a7d65]'
              required
            />
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
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
                value={formData.city}
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
                value={formData.postalCode}
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
                value={formData.country}
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

      {/* Show order summary on mobile devices before payment section */}
      <div className='lg:hidden'>
        <OrderSummary />
      </div>

      <div className='bg-white rounded-sm border border-[#e0d8c9] p-4'>
        <h2 className='font-cinzel text-lg text-[#382f21] mb-4'>Payment</h2>

        <div className='text-sm text-[#8a7d65] mb-4'>
          <p>
            Total Amount: KES {finalAmountInKES.toFixed(2)} ($
            {finalTotal.toFixed(2)})
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

        <div className='mt-4 text-xs text-[#8a7d65] text-center'>
          {!formValid && (
            <p className='mt-1 text-amber-600'>
              Please fill in all required fields to enable payment
            </p>
          )}
        </div>
      </div>
    </form>
  );
}
