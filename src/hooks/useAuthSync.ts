"use client";

import { useEffect, useRef } from "react";
import { useAuth } from "@/lib/auth/AuthContext";
import { useCart } from "@/lib/cart/CartContext";
import { useWishlistStore } from "@/lib/wishlist/wishlistStore";

export function useAuthSync() {
  const { user } = useAuth();
  const { items: cartItems, addItem: addCartItem } = useCart();
  const { items: wishlistItems, addItem: addWishlistItem } = useWishlistStore();
  const hasSyncedRef = useRef(false);

  useEffect(() => {
    if (!user || hasSyncedRef.current) return;

    const syncUserData = async () => {
      try {
        // Sync local data to server first
        const syncPromises = [];

        if (cartItems.length > 0) {
          syncPromises.push(
            fetch("/api/users/sync-cart", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              credentials: "include",
              body: JSON.stringify({ cartItems }),
            })
          );
        }

        if (wishlistItems.length > 0) {
          syncPromises.push(
            fetch("/api/users/sync-wishlist", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              credentials: "include",
              body: JSON.stringify({ wishlistItems }),
            })
          );
        }

        // Wait for sync operations to complete
        await Promise.all(syncPromises);

        // Fetch updated user data using Payload's built-in endpoint
        const userDataResponse = await fetch("/api/users/me", {
          credentials: "include",
        });

        if (userDataResponse.ok) {
          const userData = await userDataResponse.json();

          // Merge server data with local data if local is empty
          if (cartItems.length === 0 && userData.user?.cart?.length > 0) {
            // Load server cart data into local state
            userData.user.cart.forEach((item: any) => {
              addCartItem(item);
            });
          }

          if (
            wishlistItems.length === 0 &&
            userData.user?.wishlist?.length > 0
          ) {
            // Load server wishlist data into local state
            userData.user.wishlist.forEach((item: any) => {
              addWishlistItem(item);
            });
          }

        }
      } catch (error) {
        console.error("Failed to sync user data:", error);
      } finally {
        // Mark as synced to prevent repeated calls
        hasSyncedRef.current = true;
      }
    };

    syncUserData();
  }, [user]); // Removed cartItems and wishlistItems from dependencies to prevent unnecessary calls

  // Reset sync flag when user logs out
  useEffect(() => {
    if (!user) {
      hasSyncedRef.current = false;
    }
  }, [user]);

  return { user };
}
