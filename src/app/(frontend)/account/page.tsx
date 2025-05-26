import React from "react";
import { redirect } from "next/navigation";
import { headers as getHeaders } from "next/headers";
import { getPayload } from "payload";
import config from "@/payload.config";
import { AccountDashboard } from "@/components/account/AccountDashboard";

export const metadata = {
  title: "My Account - QuickShop",
  description: "Manage your QuickShop account",
};

export default async function AccountPage() {
  const headers = await getHeaders();
  const payload = await getPayload({ config });

  try {
    const { user } = await payload.auth({ headers });

    if (!user) {
      redirect(
        "/login?error=You must be logged in to access your account&redirect=/account"
      );
    }

    // Fetch user with profile photo data
    const userWithPhoto = await payload.findByID({
      collection: "users",
      id: user.id,
      depth: 2, // Include related media data
    });

    return ( 
      <div > 
    <AccountDashboard user={userWithPhoto} />
    </div> );
  } catch (error) {
    console.error("Auth error:", error);
    redirect("/login?error=Authentication failed&redirect=/account");
  }
}
