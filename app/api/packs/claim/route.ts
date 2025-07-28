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
    const packsToAdd = 1 // Assuming each claim adds 1 pack

    // Check if user already has this pack type
    const { data: existingPack, error: fetchError } = await supabase
      .from('inventory')
      .select('id, user_id, pack_name, quantity') // No need for last_claimed_at here if cooldown is external
      .eq('user_id', userId)
      .eq('pack_name', packName)
      .single()

    // PGRST116 means "no rows found" - this is expected for a new entry.
    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error('Database fetch error:', fetchError.message); // Log actual error
      return NextResponse.json({ error: 'Database error occurred while checking inventory.' }, { status: 500 })
    }

    if (existingPack) {
      // If a row exists, update its quantity
      const newQuantity = existingPack.quantity + packsToAdd
      const { error: updateError } = await supabase
        .from('inventory')
        .update({ quantity: newQuantity })
        .eq('id', existingPack.id)

      if (updateError) {
        console.error('Failed to update pack quantity:', update.message); // Log actual error
        return NextResponse.json({ error: 'Failed to update pack quantity.' }, { status: 500 })
      }

      return NextResponse.json({
        message: `Successfully updated ${packName} quantity. New total: ${newQuantity}`,
        quantity: newQuantity,
        cards: ['Card 1', 'Card 2', 'Card 3'] // Mock cards
      })
    } else {
      // If no row exists, create a new one
      const { error: insertError } = await supabase
        .from('inventory')
        .insert({
          user_id: userId,
          pack_name: packName,
          quantity: packsToAdd // Initial quantity is 1
        })

      if (insertError) {
        console.error('Failed to create pack entry:', insertError.message); // Log actual error
        return NextResponse.json({ error: 'Failed to create pack entry.' }, { status: 500 })
      }

      return NextResponse.json({
        message: `Successfully claimed ${packName} for the first time. Quantity: ${packsToAdd}`,
        quantity: packsToAdd,
        cards: ['Card 1', 'Card 2', 'Card 3'] // Mock cards
      })
    }
  } catch (error: any) { // Catch any unexpected errors
    console.error('Internal server error in POST /api/claimPack:', error.message);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 })
  }
}
