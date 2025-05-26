import { NextRequest, NextResponse } from "next/server";
import { getPayload } from "payload";
import config from "@/payload.config";

// Validation functions to reduce cognitive complexity
async function validateFormData(formData: FormData) {
  const firstName = formData.get("firstName") as string;
  const lastName = formData.get("lastName") as string;
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;
  const profilePhotoFile = formData.get("profilePhoto") as File | null;

  // Validate required fields
  if (!firstName || !lastName || !email) {
    return {
      error: {
        message: "First name, last name, and email are required",
        status: 400,
      },
    };
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return {
      error: { message: "Please enter a valid email address", status: 400 },
    };
  }

  return {
    data: { firstName, lastName, email, phone, profilePhotoFile },
  };
}

async function validateEmailUniqueness(
  payload: any,
  email: string,
  userId: string
) {
  const existingUser = await payload.find({
    collection: "users",
    where: {
      email: { equals: email },
      id: { not_equals: userId },
    },
    limit: 1,
  });

  if (existingUser.docs.length > 0) {
    return {
      error: { message: "This email address is already in use", status: 400 },
    };
  }

  return { success: true };
}

async function validateFileUpload(profilePhotoFile: File) {
  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

  // Validate filename length
  if (profilePhotoFile.name.length > 255) {
    return {
      error: { message: "Filename is too long", status: 400 },
    };
  }

  // Validate file type from client
  if (!allowedTypes.includes(profilePhotoFile.type)) {
    return {
      error: {
        message: "Profile photo must be a JPEG, PNG, or WebP image",
        status: 400,
      },
    };
  }

  // Validate file size (5MB limit)
  if (profilePhotoFile.size > 5 * 1024 * 1024) {
    return {
      error: { message: "Profile photo must be less than 5MB", status: 400 },
    };
  }

  return { success: true };
}

async function validateFileContent(buffer: Buffer) {
  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

  // Additional security: Validate file headers/magic numbers
  const { fileTypeFromBuffer } = await import("file-type");
  const detectedType = await fileTypeFromBuffer(buffer);

  if (!detectedType || !allowedTypes.includes(detectedType.mime)) {
    return {
      error: { message: "Invalid image file format detected", status: 400 },
    };
  }

  // Validate image dimensions and content (basic check)
  if (buffer.length < 100) {
    return {
      error: { message: "Invalid image file - file too small", status: 400 },
    };
  }

  // Basic security check: Look for suspicious patterns in file content
  const bufferString = buffer.toString(
    "ascii",
    0,
    Math.min(buffer.length, 1024)
  );
  const suspiciousPatterns = ["<script", "<?php", "<%", "javascript:", "data:"];

  if (
    suspiciousPatterns.some((pattern) =>
      bufferString.toLowerCase().includes(pattern)
    )
  ) {
    return {
      error: {
        message: "Invalid image file - suspicious content detected",
        status: 400,
      },
    };
  }

  return { detectedType };
}

async function processFileUpload(
  profilePhotoFile: File,
  user: any,
  firstName: string,
  lastName: string
) {
  // Validate file upload
  const fileValidation = await validateFileUpload(profilePhotoFile);
  if (fileValidation.error) {
    return { error: fileValidation.error };
  }

  try {
    // Convert File to Buffer
    const arrayBuffer = await profilePhotoFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Validate file content
    const contentValidation = await validateFileContent(buffer);
    if (contentValidation.error) {
      return { error: contentValidation.error };
    }

    const { detectedType } = contentValidation;

    // Generate secure filename
    const fileExtension = detectedType.ext;
    const timestamp = Date.now();
    const randomSuffix = Math.random().toString(36).substring(2, 8);
    const secureFilename = `profile-${user.id}-${timestamp}-${randomSuffix}.${fileExtension}`;

    // Create media document
    const payload = await getPayload({ config });
    const mediaDoc = await payload.create({
      collection: "media",
      data: {
        alt: `${firstName} ${lastName} profile photo`,
      },
      file: {
        data: buffer,
        mimetype: detectedType.mime,
        name: secureFilename,
        size: profilePhotoFile.size,
      },
    });

    return { mediaId: mediaDoc.id };
  } catch (uploadError) {
    console.error("Profile photo upload error:", uploadError);

    // Provide more specific error messages
    if (uploadError instanceof Error) {
      if (uploadError.message.includes("file-type")) {
        return {
          error: { message: "Unable to verify image file type", status: 400 },
        };
      }
      if (
        uploadError.message.includes("size") ||
        uploadError.message.includes("limit")
      ) {
        return {
          error: {
            message: "Image file is too large or corrupted",
            status: 400,
          },
        };
      }
    }

    return {
      error: {
        message:
          "Failed to upload profile photo. Please try again with a different image.",
        status: 500,
      },
    };
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const payload = await getPayload({ config });

    // Get the authenticated user
    const { user } = await payload.auth({ headers: request.headers });
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Parse and validate form data
    const formData = await request.formData();
    const formValidation = await validateFormData(formData);
    if (formValidation.error) {
      return NextResponse.json(
        { message: formValidation.error.message },
        { status: formValidation.error.status }
      );
    }

    const { firstName, lastName, email, phone, profilePhotoFile } =
      formValidation.data;

    // Check email uniqueness if email changed
    if (email !== user.email) {
      const emailValidation = await validateEmailUniqueness(
        payload,
        email,
        user.id
      );
      if (emailValidation.error) {
        return NextResponse.json(
          { message: emailValidation.error.message },
          { status: emailValidation.error.status }
        );
      }
    }

    // Prepare update data
    const updateData: any = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim().toLowerCase(),
      phone: phone?.trim() || null,
    };

    // Handle profile photo upload if provided
    if (profilePhotoFile && profilePhotoFile.size > 0) {
      const uploadResult = await processFileUpload(
        profilePhotoFile,
        user,
        firstName,
        lastName
      );
      if (uploadResult.error) {
        return NextResponse.json(
          { message: uploadResult.error.message },
          { status: uploadResult.error.status }
        );
      }
      updateData.profilePhoto = uploadResult.mediaId;
    }

    // Update the user profile
    const updatedUser = await payload.update({
      collection: "users",
      id: user.id,
      data: updateData,
      depth: 2,
    });

    // Return the updated user data (excluding sensitive fields)
    const { password, ...safeUserData } = updatedUser;

    return NextResponse.json({
      message: "Profile updated successfully",
      user: safeUserData,
    });
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json(
      { message: "Failed to update profile" },
      { status: 500 }
    );
  }
}
