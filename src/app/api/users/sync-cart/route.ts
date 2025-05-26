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

    const { cartItems } = await request.json()

    // Update user's cart data
    await payload.update({
      collection: 'users',
      id: user.id,
      data: {
        cart: cartItems,
      },
    })

    return NextResponse.json({ 
      message: 'Cart synced successfully',
      cartItems 
    })
  } catch (error) {
    console.error('Cart sync error:', error)
    return NextResponse.json(
      { message: 'Failed to sync cart' },
      { status: 500 }
    )
  }
} 