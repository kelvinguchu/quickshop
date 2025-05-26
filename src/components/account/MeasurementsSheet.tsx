"use client";

import React, { useState, useEffect } from "react";
import { Ruler, Save, Loader2, Edit3 } from "lucide-react";
import { useAuth } from "@/lib/auth/AuthContext";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface MeasurementsSheetProps {
  children: React.ReactNode;
}

export function MeasurementsSheet({
  children,
}: Readonly<MeasurementsSheetProps>) {
  const { user, refreshUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<"abaya" | "qamis">(
    "abaya"
  );

  const [measurementData, setMeasurementData] = useState({
    chest: "",
    shoulder: "",
    sleeve: "",
    length: "",
    waist: "",
    hip: "",
  });

  const [shippingData, setShippingData] = useState({
    address: "",
    city: "",
    country: "Kenya",
    postalCode: "",
  });

  // Load saved data when component mounts or user/category changes
  useEffect(() => {
    if (user?.savedMeasurements) {
      const categoryMeasurements = user.savedMeasurements[selectedCategory];
      setMeasurementData({
        chest: categoryMeasurements?.chest?.toString() || "",
        shoulder: categoryMeasurements?.shoulder?.toString() || "",
        sleeve: categoryMeasurements?.sleeve?.toString() || "",
        length: categoryMeasurements?.length?.toString() || "",
        waist: categoryMeasurements?.waist?.toString() || "",
        hip: categoryMeasurements?.hip?.toString() || "",
      });
    } else {
      // Reset if no measurements for this category
      setMeasurementData({
        chest: "",
        shoulder: "",
        sleeve: "",
        length: "",
        waist: "",
        hip: "",
      });
    }

    if (user?.savedShippingAddress) {
      setShippingData({
        address: user.savedShippingAddress.address || "",
        city: user.savedShippingAddress.city || "",
        country: user.savedShippingAddress.country || "Kenya",
        postalCode: user.savedShippingAddress.postalCode || "",
      });
    }
  }, [user, selectedCategory]);

  const handleMeasurementChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setMeasurementData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear messages when user starts typing
    if (error) setError(null);
    if (success) setSuccess(false);
  };

  const handleShippingChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setShippingData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear messages when user starts typing
    if (error) setError(null);
    if (success) setSuccess(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    // Validate that at least some measurements are provided
    const hasValidMeasurements = Object.values(measurementData).some(
      (value) => value && value.trim() !== "" && Number(value) > 0
    );

    if (!hasValidMeasurements) {
      setError("Please enter at least one measurement");
      setIsLoading(false);
      return;
    }


    try {
      const response = await fetch("/api/users/measurements", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          category: selectedCategory,
          measurements: {
            chest: Number(measurementData.chest) || 0,
            shoulder: Number(measurementData.shoulder) || 0,
            sleeve: Number(measurementData.sleeve) || 0,
            length: Number(measurementData.length) || 0,
            waist: Number(measurementData.waist) || 0,
            hip: Number(measurementData.hip) || 0,
          },
          shippingAddress: {
            address: shippingData.address,
            city: shippingData.city,
            country: shippingData.country,
            postalCode: shippingData.postalCode,
          },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("API Error:", errorData);
        throw new Error(errorData.message || "Failed to save measurements");
      }

      const result = await response.json();

      setSuccess(true);
      setIsEditing(false);
      // Refresh user data in context
      await refreshUser();

      // Auto-hide success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to save measurements"
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Reset form when sheet opens
  const handleOpenChange = (open: boolean) => {
    if (open) {
      setError(null);
      setSuccess(false);
      setIsEditing(false);
      setSelectedCategory("abaya"); // Reset to default category
    }
  };

  // Check if we have measurements either from user data or current form state
  const hasMeasurements =
    (user?.savedMeasurements?.[selectedCategory] &&
      Object.values(user.savedMeasurements[selectedCategory]).some(
        (value) => value !== undefined && value !== null && value !== 0
      )) ||
    Object.values(measurementData).some(
      (value) => value && value.trim() !== "" && Number(value) > 0
    );

  const hasShippingAddress =
    user?.savedShippingAddress &&
    Object.values(user.savedShippingAddress).some(
      (value) => value !== undefined && value !== null && value !== ""
    );

  return (
    <Sheet onOpenChange={handleOpenChange}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent
        side='right'
        className='w-full sm:max-w-[40vw] max-w-full bg-white p-0 overflow-y-auto'>
        <SheetHeader className='border-b border-[#e0d8c9]/40 py-2 sm:py-3'>
          <SheetTitle className='font-cinzel text-sm md:text-lg text-[#382f21] px-3 sm:px-4 flex items-center gap-2'>
            <Ruler className='w-4 h-4 sm:w-5 sm:h-5' />
            Fill & Save
          </SheetTitle>
        </SheetHeader>

        <div className='flex-1 overflow-y-auto p-3 sm:p-4 md:p-6'>
          {!user ? (
            <div className='flex flex-col items-center justify-center h-48 sm:h-64 text-center px-4'>
              <div className='w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-[#f5f2ec] flex items-center justify-center mb-3 sm:mb-4'>
                <Ruler className='w-6 h-6 sm:w-8 sm:h-8 text-[#8a7d65]' />
              </div>
              <h3 className='font-cinzel text-base sm:text-lg text-[#382f21] mb-2'>
                Sign in required
              </h3>
              <p className='text-[#8a7d65] text-xs sm:text-sm'>
                Please sign in to view your saved measurements
              </p>
            </div>
          ) : (
            <div className='space-y-4 sm:space-y-6'>
              {/* Success Message */}
              {success && (
                <div className='bg-green-50 border border-green-200 rounded-sm p-3 sm:p-4'>
                  <div className='flex items-start gap-2'>
                    <Save className='w-4 h-4 text-green-600 mt-0.5 flex-shrink-0' />
                    <span className='text-xs sm:text-sm font-medium text-green-800'>
                      Measurements and shipping address saved successfully for{" "}
                      {selectedCategory}!
                    </span>
                  </div>
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className='bg-red-50 border border-red-200 rounded-sm p-3 sm:p-4'>
                  <p className='text-xs sm:text-sm text-red-600'>{error}</p>
                </div>
              )}

              {/* Category Selector and Edit Toggle */}
              <div className='flex flex-col sm:flex-row sm:items-center justify-between mb-3 sm:mb-4 gap-2 sm:gap-3'>
                <h3 className='font-cinzel text-base sm:text-lg text-[#382f21]'>
                  Your Saved Information
                </h3>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className='inline-flex items-center gap-2 px-3 py-1.5 sm:py-1 border border-[#382f21] text-[#382f21] rounded-sm hover:bg-[#382f21] hover:text-white transition-colors text-xs sm:text-sm self-start sm:self-auto'>
                  <Edit3 className='w-3 h-3 sm:w-4 sm:h-4' />
                  {isEditing ? "Cancel" : "Edit"}
                </button>
              </div>

              {/* Category Selector */}
              <div className='mb-4 sm:mb-6'>
                <label className='block text-xs sm:text-sm font-medium text-[#382f21] mb-2'>
                  Category
                </label>
                <div className='flex gap-2 w-full'>
                  <button
                    type='button'
                    onClick={() => setSelectedCategory("abaya")}
                    className={`flex-1 px-3 sm:px-4 py-2 rounded-sm text-xs sm:text-sm font-medium transition-colors ${
                      selectedCategory === "abaya"
                        ? "bg-[#382f21] text-white"
                        : "bg-[#f5f2ec] text-[#382f21] hover:bg-[#e0d8c9]"
                    }`}>
                    Abaya
                  </button>
                  <button
                    type='button'
                    onClick={() => setSelectedCategory("qamis")}
                    className={`flex-1 px-3 sm:px-4 py-2 rounded-sm text-xs sm:text-sm font-medium transition-colors ${
                      selectedCategory === "qamis"
                        ? "bg-[#382f21] text-white"
                        : "bg-[#f5f2ec] text-[#382f21] hover:bg-[#e0d8c9]"
                    }`}>
                    Qamis
                  </button>
                </div>
              </div>

              <form onSubmit={handleSubmit} className='space-y-4 sm:space-y-6'>
                {/* Measurements Section */}
                <div className='bg-[#f9f6f2] rounded-sm p-3 sm:p-4'>
                  <h4 className='font-medium text-sm sm:text-base text-[#382f21] mb-3 sm:mb-4'>
                    Body Measurements (cm) -{" "}
                    {selectedCategory.charAt(0).toUpperCase() +
                      selectedCategory.slice(1)}
                  </h4>

                  {!hasMeasurements && !isEditing ? (
                    <p className='text-[#8a7d65] text-xs sm:text-sm italic'>
                      No measurements saved yet for {selectedCategory}
                    </p>
                  ) : (
                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4'>
                      {[
                        { key: "chest", label: "Chest/Bust" },
                        { key: "shoulder", label: "Shoulder Width" },
                        { key: "sleeve", label: "Sleeve Length" },
                        { key: "length", label: "Total Length" },
                        { key: "waist", label: "Waist" },
                        { key: "hip", label: "Hip" },
                      ].map((field) => (
                        <div key={field.key}>
                          <label className='block text-xs text-[#8a7d65] mb-1'>
                            {field.label}
                          </label>
                          {isEditing ? (
                            <input
                              type='number'
                              name={field.key}
                              value={
                                measurementData[
                                  field.key as keyof typeof measurementData
                                ]
                              }
                              onChange={handleMeasurementChange}
                              className='w-full border border-[#e0d8c9] rounded-sm px-2 sm:px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#8a7d65]'
                              placeholder='e.g. 96'
                            />
                          ) : (
                            <div className='w-full border border-[#e0d8c9] rounded-sm px-2 sm:px-3 py-2 bg-white text-[#382f21] text-sm'>
                              {measurementData[
                                field.key as keyof typeof measurementData
                              ] || "—"}
                              {measurementData[
                                field.key as keyof typeof measurementData
                              ] && " cm"}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Shipping Address Section */}
                <div className='bg-[#f9f6f2] rounded-sm p-3 sm:p-4'>
                  <h4 className='font-medium text-sm sm:text-base text-[#382f21] mb-3 sm:mb-4'>
                    Shipping Address
                  </h4>

                  {!hasShippingAddress && !isEditing ? (
                    <p className='text-[#8a7d65] text-xs sm:text-sm italic'>
                      No shipping address saved yet
                    </p>
                  ) : (
                    <div className='space-y-3 sm:space-y-4'>
                      <div>
                        <label className='block text-xs text-[#8a7d65] mb-1'>
                          Address
                        </label>
                        {isEditing ? (
                          <input
                            type='text'
                            name='address'
                            value={shippingData.address}
                            onChange={handleShippingChange}
                            className='w-full border border-[#e0d8c9] rounded-sm px-2 sm:px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#8a7d65]'
                            placeholder='Enter your address'
                          />
                        ) : (
                          <div className='w-full border border-[#e0d8c9] rounded-sm px-2 sm:px-3 py-2 bg-white text-[#382f21] text-sm'>
                            {shippingData.address || "—"}
                          </div>
                        )}
                      </div>

                      <div className='grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4'>
                        <div>
                          <label className='block text-xs text-[#8a7d65] mb-1'>
                            City
                          </label>
                          {isEditing ? (
                            <input
                              type='text'
                              name='city'
                              value={shippingData.city}
                              onChange={handleShippingChange}
                              className='w-full border border-[#e0d8c9] rounded-sm px-2 sm:px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#8a7d65]'
                              placeholder='Enter city'
                            />
                          ) : (
                            <div className='w-full border border-[#e0d8c9] rounded-sm px-2 sm:px-3 py-2 bg-white text-[#382f21] text-sm'>
                              {shippingData.city || "—"}
                            </div>
                          )}
                        </div>

                        <div>
                          <label className='block text-xs text-[#8a7d65] mb-1'>
                            Postal Code
                          </label>
                          {isEditing ? (
                            <input
                              type='text'
                              name='postalCode'
                              value={shippingData.postalCode}
                              onChange={handleShippingChange}
                              className='w-full border border-[#e0d8c9] rounded-sm px-2 sm:px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#8a7d65]'
                              placeholder='Enter postal code'
                            />
                          ) : (
                            <div className='w-full border border-[#e0d8c9] rounded-sm px-2 sm:px-3 py-2 bg-white text-[#382f21] text-sm'>
                              {shippingData.postalCode || "—"}
                            </div>
                          )}
                        </div>
                      </div>

                      <div>
                        <label className='block text-xs text-[#8a7d65] mb-1'>
                          Country
                        </label>
                        {isEditing ? (
                          <select
                            name='country'
                            value={shippingData.country}
                            onChange={handleShippingChange}
                            className='w-full border border-[#e0d8c9] rounded-sm px-2 sm:px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#8a7d65]'>
                            <option value='Kenya'>Kenya</option>
                            <option value='Uganda'>Uganda</option>
                            <option value='Tanzania'>Tanzania</option>
                            <option value='Rwanda'>Rwanda</option>
                            <option value='Ethiopia'>Ethiopia</option>
                          </select>
                        ) : (
                          <div className='w-full border border-[#e0d8c9] rounded-sm px-2 sm:px-3 py-2 bg-white text-[#382f21] text-sm'>
                            {shippingData.country || "—"}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Submit Button */}
                {isEditing && (
                  <div className='pt-3 sm:pt-4'>
                    <button
                      type='submit'
                      disabled={isLoading}
                      className='w-full bg-[#382f21] text-white px-3 sm:px-4 py-2.5 sm:py-3 rounded-sm font-montserrat text-xs sm:text-sm uppercase tracking-wider hover:bg-[#4e4538] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2'>
                      {isLoading ? (
                        <>
                          <Loader2 className='w-3 h-3 sm:w-4 sm:h-4 animate-spin' />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className='w-3 h-3 sm:w-4 sm:h-4' />
                          Save Changes
                        </>
                      )}
                    </button>
                  </div>
                )}

                {/* Info */}
                <div className='bg-[#f9f6f2] border border-[#e0d8c9] rounded-sm p-3 sm:p-4'>
                  <h4 className='text-xs sm:text-sm font-medium text-[#382f21] mb-2'>
                    Saved Information
                  </h4>
                  <div className='space-y-1 text-xs text-[#8a7d65]'>
                    <p className='font-montserrat'>
                      <strong>Category-specific measurements</strong>
                      <span className='italic'>
                        {" "}
                        - separate storage for abaya and qamis
                      </span>
                    </p>
                    <p className='font-montserrat'>
                      <strong>Auto-fill shipping address</strong>
                      <span className='italic'>
                        {" "}
                        - speeds up checkout process
                      </span>
                    </p>
                    <p className='font-montserrat'>
                      <strong>Secure and private</strong>
                      <span className='italic'> - only visible to you</span>
                    </p>
                  </div>
                </div>
              </form>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
