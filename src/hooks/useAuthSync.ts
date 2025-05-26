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
            Promise.race([
              fetch("/api/users/sync-cart", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({ cartItems }),
              }),
              new Promise((_, reject) =>
                setTimeout(() => reject(new Error("Cart sync timeout")), 10000)
              ),
            ]).catch((error) => {
              console.error("Cart sync failed:", error);
              return null; // Continue with other operations
            })
          );
        }

        if (wishlistItems.length > 0) {
          syncPromises.push(
            Promise.race([
              fetch("/api/users/sync-wishlist", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({ wishlistItems }),
              }),
              new Promise((_, reject) =>
                setTimeout(
                  () => reject(new Error("Wishlist sync timeout")),
                  10000
                )
              ),
            ]).catch((error) => {
              console.error("Wishlist sync failed:", error);
              return null; // Continue with other operations
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
            userData.user.cart.forEach((item: unknown) => {
              try {
                // Validate item structure before adding
                if (
                  item &&
                  typeof item === "object" &&
                  "id" in item &&
                  "name" in item &&
                  "price" in item &&
                  "quantity" in item
                ) {
                  addCartItem(item as any); // Type assertion after validation
                }
              } catch (error) {
                console.error("Failed to add cart item:", error, item);
              }
            });
          }

          if (
            wishlistItems.length === 0 &&
            userData.user?.wishlist?.length > 0
          ) {
            // Load server wishlist data into local state
            userData.user.wishlist.forEach((item: unknown) => {
              try {
                // Validate item structure before adding
                if (item && typeof item === "object" && "id" in item) {
                  addWishlistItem(item as any); // Type assertion after validation
                }
              } catch (error) {
                console.error("Failed to add wishlist item:", error, item);
              }
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
