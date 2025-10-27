import { NextResponse } from 'next/server'
import { 
  getAllOffers, 
  createOffer, 
  getActiveOffers,
  getOffersByType 
} from '@/lib/offers-database'
import type { Offer } from '@/lib/database-types'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    const activeOnly = searchParams.get('active') === 'true'
    
    let offers: Offer[]
    
    if (activeOnly) {
      offers = await getActiveOffers()
    } else if (type) {
      offers = await getOffersByType(type as Offer['type'])
    } else {
      offers = await getAllOffers()
    }
    
    return NextResponse.json(offers)
  } catch (error) {
    console.error('Error fetching offers:', error)
    return NextResponse.json(
      { error: 'Failed to fetch offers' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // Validate required fields
    const requiredFields = ['name', 'description', 'type', 'discountType', 'discountValue', 'startDate', 'endDate', 'priority', 'createdBy']
    const missingFields = requiredFields.filter(field => !(field in body))
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      )
    }
    
    // Set default isActive if not provided
    if (body.isActive === undefined) {
      body.isActive = true
    }
    
    const newOffer = await createOffer(body)
    
    return NextResponse.json(newOffer, { status: 201 })
  } catch (error) {
    console.error('Error creating offer:', error)
    return NextResponse.json(
      { error: 'Failed to create offer' },
      { status: 500 }
    )
  }
}
