import { NextResponse } from 'next/server'
import { 
  getOfferById, 
  updateOffer, 
  deleteOffer,
  toggleOfferStatus,
  getOfferStats
} from '@/lib/offers-database'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url)
    const includeStats = searchParams.get('stats') === 'true'
    
    if (includeStats) {
      const stats = await getOfferStats(params.id)
      if (!stats) {
        return NextResponse.json(
          { error: 'Offer not found' },
          { status: 404 }
        )
      }
      return NextResponse.json(stats)
    }
    
    const offer = await getOfferById(params.id)
    
    if (!offer) {
      return NextResponse.json(
        { error: 'Offer not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(offer)
  } catch (error) {
    console.error('Error fetching offer:', error)
    return NextResponse.json(
      { error: 'Failed to fetch offer' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    
    const updatedOffer = await updateOffer(params.id, body)
    
    if (!updatedOffer) {
      return NextResponse.json(
        { error: 'Offer not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(updatedOffer)
  } catch (error) {
    console.error('Error updating offer:', error)
    return NextResponse.json(
      { error: 'Failed to update offer' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const success = await deleteOffer(params.id)
    
    if (!success) {
      return NextResponse.json(
        { error: 'Offer not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting offer:', error)
    return NextResponse.json(
      { error: 'Failed to delete offer' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { action } = await request.json()
    
    if (action === 'toggle') {
      const updatedOffer = await toggleOfferStatus(params.id)
      
      if (!updatedOffer) {
        return NextResponse.json(
          { error: 'Offer not found' },
          { status: 404 }
        )
      }
      
      return NextResponse.json(updatedOffer)
    }
    
    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Error updating offer status:', error)
    return NextResponse.json(
      { error: 'Failed to update offer status' },
      { status: 500 }
    )
  }
}
