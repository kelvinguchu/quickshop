"use client";

import React, { useState, useRef } from "react";
import { User, Save, Loader2, Camera, X } from "lucide-react";
import { useAuth } from "@/lib/auth/AuthContext";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface ProfileSheetProps {
  children: React.ReactNode;
}

export function ProfileSheet({ children }: Readonly<ProfileSheetProps>) {
  const { user, refreshUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear messages when user starts typing
    if (error) setError(null);
    if (success) setSuccess(false);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        setError("Please select an image file");
        return;
      }

      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size must be less than 5MB");
        return;
      }

      setSelectedFile(file);

      // Create preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);

      // Clear any existing errors
      setError(null);
    }
  };

  const removeSelectedFile = () => {
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Create FormData for file upload
      const submitData = new FormData();
      submitData.append("firstName", formData.firstName);
      submitData.append("lastName", formData.lastName);
      submitData.append("email", formData.email);

      if (selectedFile) {
        submitData.append("profilePhoto", selectedFile);
      }

      const response = await fetch("/api/users/profile", {
        method: "PATCH",
        credentials: "include",
        body: submitData, // Don't set Content-Type header for FormData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update profile");
      }

      setSuccess(true);
      // Clear selected file after successful upload
      removeSelectedFile();
      // Refresh user data in context
      await refreshUser();

      // Auto-hide success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  // Reset form when sheet opens
  const handleOpenChange = (open: boolean) => {
    if (open && user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
      });
      setError(null);
      setSuccess(false);
      removeSelectedFile();
    }
  };

  // Get user initials and current profile photo
  const initials = user
    ? `${user.firstName?.charAt(0) || ""}${user.lastName?.charAt(0) || ""}`.toUpperCase()
    : "";
  const currentProfilePhotoUrl =
    user?.profilePhoto &&
    typeof user.profilePhoto === "object" &&
    "url" in user.profilePhoto
      ? user.profilePhoto.url
      : null;

  return (
    <Sheet onOpenChange={handleOpenChange}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent
        side='right'
        className='sm:min-w-[40vw] min-w-[95vw] bg-white p-0 overflow-y-auto'>
        <SheetHeader className='border-b border-[#e0d8c9]/40 py-3'>
          <SheetTitle className='font-cinzel text-lg text-[#382f21] px-4 flex items-center gap-2'>
            <User className='w-5 h-5' />
            Edit Profile
          </SheetTitle>
        </SheetHeader>

        <div className='flex-1 overflow-y-auto p-6'>
          {!user ? (
            <div className='flex flex-col items-center justify-center h-64 text-center'>
              <div className='w-16 h-16 rounded-full bg-[#f5f2ec] flex items-center justify-center mb-4'>
                <User className='w-8 h-8 text-[#8a7d65]' />
              </div>
              <h3 className='font-cinzel text-lg text-[#382f21] mb-2'>
                Sign in required
              </h3>
              <p className='text-[#8a7d65] text-sm'>
                Please sign in to edit your profile
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className='space-y-6'>
              {/* Success Message */}
              {success && (
                <div className='bg-green-50 border border-green-200 rounded-sm p-4'>
                  <div className='flex items-center gap-2'>
                    <Save className='w-4 h-4 text-green-600' />
                    <span className='text-sm font-medium text-green-800'>
                      Profile updated successfully!
                    </span>
                  </div>
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className='bg-red-50 border border-red-200 rounded-sm p-4'>
                  <p className='text-sm text-red-600'>{error}</p>
                </div>
              )}

              {/* Profile Photo Section */}
              <div className='text-center'>
                <label className='block text-sm font-medium text-[#382f21] mb-4'>
                  Profile Photo
                </label>

                <div className='flex flex-col items-center gap-4'>
                  {/* Avatar Display */}
                  <div className='relative'>
                    <Avatar className='w-24 h-24'>
                      {previewUrl ? (
                        <AvatarImage src={previewUrl} alt='Preview' />
                      ) : currentProfilePhotoUrl ? (
                        <AvatarImage
                          src={currentProfilePhotoUrl}
                          alt={`${user.firstName} ${user.lastName}`}
                        />
                      ) : null}
                      <AvatarFallback className='bg-[#382f21] text-white text-lg font-medium'>
                        {initials || <User className='w-8 h-8' />}
                      </AvatarFallback>
                    </Avatar>

                    {/* Remove button for selected file */}
                    {previewUrl && (
                      <button
                        type='button'
                        onClick={removeSelectedFile}
                        className='absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors'>
                        <X className='w-3 h-3' />
                      </button>
                    )}
                  </div>

                  {/* File Input */}
                  <div className='flex flex-col items-center gap-2'>
                    <input
                      ref={fileInputRef}
                      type='file'
                      accept='image/*'
                      onChange={handleFileSelect}
                      className='hidden'
                      id='profilePhoto'
                    />
                    <label
                      htmlFor='profilePhoto'
                      className='cursor-pointer inline-flex items-center gap-2 px-4 py-2 border border-[#382f21] text-[#382f21] rounded-sm hover:bg-[#382f21] hover:text-white transition-colors text-sm'>
                      <Camera className='w-4 h-4' />
                      {currentProfilePhotoUrl || previewUrl
                        ? "Change Photo"
                        : "Upload Photo"}
                    </label>
                    <p className='text-xs text-[#8a7d65]'>
                      JPG, PNG or GIF. Max size 5MB.
                    </p>
                  </div>
                </div>
              </div>

              {/* First Name */}
              <div>
                <label
                  htmlFor='firstName'
                  className='block text-sm font-medium text-[#382f21] mb-2'>
                  First Name
                </label>
                <input
                  type='text'
                  id='firstName'
                  name='firstName'
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                  className='w-full px-3 py-2 border border-[#e0d8c9] rounded-sm focus:outline-none focus:ring-2 focus:ring-[#382f21] focus:border-transparent text-[#382f21]'
                  placeholder='Enter your first name'
                />
              </div>

              {/* Last Name */}
              <div>
                <label
                  htmlFor='lastName'
                  className='block text-sm font-medium text-[#382f21] mb-2'>
                  Last Name
                </label>
                <input
                  type='text'
                  id='lastName'
                  name='lastName'
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                  className='w-full px-3 py-2 border border-[#e0d8c9] rounded-sm focus:outline-none focus:ring-2 focus:ring-[#382f21] focus:border-transparent text-[#382f21]'
                  placeholder='Enter your last name'
                />
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor='email'
                  className='block text-sm font-medium text-[#382f21] mb-2'>
                  Email Address
                </label>
                <input
                  type='email'
                  id='email'
                  name='email'
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className='w-full px-3 py-2 border border-[#e0d8c9] rounded-sm focus:outline-none focus:ring-2 focus:ring-[#382f21] focus:border-transparent text-[#382f21]'
                  placeholder='Enter your email address'
                />
              </div>

              {/* Submit Button */}
              <div className='pt-4'>
                <button
                  type='submit'
                  disabled={isLoading}
                  className='w-full bg-[#382f21] text-white px-4 py-3 rounded-sm font-montserrat text-sm uppercase tracking-wider hover:bg-[#4e4538] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2'>
                  {isLoading ? (
                    <>
                      <Loader2 className='w-4 h-4 animate-spin' />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Save className='w-4 h-4' />
                      Update Profile
                    </>
                  )}
                </button>
              </div>

              {/* Additional Info */}
              <div className='bg-blue-50 border border-blue-200 rounded-sm p-4 mt-6'>
                <h4 className='text-sm font-medium text-blue-800 mb-2'>
                  Account Information
                </h4>
                <div className='space-y-1 text-xs text-blue-700'>
                  <p>• Changes to your email may require verification</p>
                  <p>
                    • Your profile information is used for orders and shipping
                  </p>
                  <p>• Profile photos help personalize your account</p>
                  <p>• All fields are required for a complete profile</p>
                </div>
              </div>
            </form>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
