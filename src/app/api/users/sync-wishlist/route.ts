import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'

export async function POST(request: NextRequest) {
  try {
    const payload = await getPayload({ config })
    
    // Get the authenticated user
    const { user } = await payload.auth({ headers: request.headers })
    
    if (!user) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { wishlistItems } = await request.json()

    // Update user's wishlist data
    await payload.update({
      collection: 'users',
      id: user.id,
      data: {
        wishlist: wishlistItems,
      },
    })

    return NextResponse.json({ 
      message: 'Wishlist synced successfully',
      wishlistItems 
    })
  } catch (error) {
    console.error('Wishlist sync error:', error)
    return NextResponse.json(
      { message: 'Failed to sync wishlist' },
      { status: 500 }
    )
  }
} 