'use client'

import { useEffect } from 'react'
import { useAuth } from '@/lib/auth/AuthContext'
import { useCart } from '@/lib/cart/CartContext'
import { useWishlistStore } from '@/lib/wishlist/wishlistStore'

export function useAuthSync() {
  const { user } = useAuth()
  const { items: cartItems, clearCart } = useCart()
  const { items: wishlistItems, clearWishlist } = useWishlistStore()

  useEffect(() => {
    if (!user) return

    const syncUserData = async () => {
      try {
        // Sync cart data
        if (cartItems.length > 0) {
          await fetch('/api/users/sync-cart', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ cartItems }),
          })
        }

        // Sync wishlist data
        if (wishlistItems.length > 0) {
          await fetch('/api/users/sync-wishlist', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ wishlistItems }),
          })
        }

        // Load user's saved cart and wishlist from server
        const userDataResponse = await fetch('/api/users/me', {
          credentials: 'include',
        })

        if (userDataResponse.ok) {
          const userData = await userDataResponse.json()
          
          // If user has saved cart/wishlist on server and local storage is empty,
          // we could load the server data here
          // For now, we prioritize local storage data over server data
          
          console.log('User data synced successfully')
        }
      } catch (error) {
        console.error('Failed to sync user data:', error)
      }
    }

    // Only sync if user just logged in and has local data
    syncUserData()
  }, [user, cartItems, wishlistItems])

  return { user }
} 