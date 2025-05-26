import { NextRequest, NextResponse } from "next/server";
import { getPayload } from "payload";
import config from "@/payload.config";

export async function PATCH(request: NextRequest) {
  try {
    const payload = await getPayload({ config });

    // Get the authenticated user
    const { user } = await payload.auth({ headers: request.headers });

    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Parse FormData for file uploads
    const formData = await request.formData();
    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;
    const email = formData.get("email") as string;
    const profilePhotoFile = formData.get("profilePhoto") as File | null;

    // Validate required fields
    if (!firstName || !lastName || !email) {
      return NextResponse.json(
        { message: "First name, last name, and email are required" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: "Please enter a valid email address" },
        { status: 400 }
      );
    }

    // Check if email is already taken by another user
    if (email !== user.email) {
      const existingUser = await payload.find({
        collection: "users",
        where: {
          email: {
            equals: email,
          },
          id: {
            not_equals: user.id,
          },
        },
        limit: 1,
      });

      if (existingUser.docs.length > 0) {
        return NextResponse.json(
          { message: "This email address is already in use" },
          { status: 400 }
        );
      }
    }

    // Prepare update data
    const updateData: any = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim().toLowerCase(),
    };

    // Handle profile photo upload if provided
    if (profilePhotoFile && profilePhotoFile.size > 0) {
      // Validate file type
      if (!profilePhotoFile.type.startsWith("image/")) {
        return NextResponse.json(
          { message: "Profile photo must be an image file" },
          { status: 400 }
        );
      }

      // Validate file size (5MB limit)
      if (profilePhotoFile.size > 5 * 1024 * 1024) {
        return NextResponse.json(
          { message: "Profile photo must be less than 5MB" },
          { status: 400 }
        );
      }

      try {
        // Convert File to Buffer
        const arrayBuffer = await profilePhotoFile.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Create media document
        const mediaDoc = await payload.create({
          collection: "media",
          data: {
            alt: `${firstName} ${lastName} profile photo`,
          },
          file: {
            data: buffer,
            mimetype: profilePhotoFile.type,
            name: `profile-${user.id}-${Date.now()}.${profilePhotoFile.type.split("/")[1]}`,
            size: profilePhotoFile.size,
          },
        });

        // Add profile photo ID to update data
        updateData.profilePhoto = mediaDoc.id;
      } catch (uploadError) {
        console.error("Profile photo upload error:", uploadError);
        return NextResponse.json(
          { message: "Failed to upload profile photo" },
          { status: 500 }
        );
      }
    }

    // Update the user profile
    const updatedUser = await payload.update({
      collection: "users",
      id: user.id,
      data: updateData,
      depth: 2, // Include related media data
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
