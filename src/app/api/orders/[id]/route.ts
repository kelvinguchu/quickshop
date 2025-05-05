import { getPayload } from 'payload'
import { NextResponse } from 'next/server'
import config from '@/payload.config'

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const payload = await getPayload({ config })
    const { id } = params

    const order = await payload.findByID({
      collection: 'orders',
      id,
    })

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    return NextResponse.json(order)
  } catch (error) {
    console.error('Error fetching order:', error)
    return NextResponse.json({ error: 'Failed to fetch order' }, { status: 500 })
  }
}
