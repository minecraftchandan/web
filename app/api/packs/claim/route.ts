import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json()

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    const packName = 'daily pack'
    const packsToAdd = 1

    // Check if user already has this pack type
    const { data: existingPack, error: fetchError } = await supabase
      .from('inventory')
      .select('id, user_id, pack_name, quantity')
      .eq('user_id', userId)
      .eq('pack_name', packName)
      .single()

    if (fetchError && fetchError.code !== 'PGRST116') {
      return NextResponse.json({ error: 'Database error' }, { status: 500 })
    }

    if (existingPack) {
      // Update existing pack quantity
      const newQuantity = existingPack.quantity + packsToAdd
      const { error: updateError } = await supabase
        .from('inventory')
        .update({ quantity: newQuantity })
        .eq('id', existingPack.id)

      if (updateError) {
        return NextResponse.json({ error: 'Failed to update pack quantity' }, { status: 500 })
      }

      return NextResponse.json({
        quantity: newQuantity,
        cards: ['Card 1', 'Card 2', 'Card 3'] // Mock cards
      })
    } else {
      // Create new pack entry
      const { error: insertError } = await supabase
        .from('inventory')
        .insert({ 
          user_id: userId, 
          pack_name: packName, 
          quantity: packsToAdd 
        })

      if (insertError) {
        return NextResponse.json({ error: 'Failed to create pack' }, { status: 500 })
      }

      return NextResponse.json({
        quantity: packsToAdd,
        cards: ['Card 1', 'Card 2', 'Card 3'] // Mock cards
      })
    }
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
