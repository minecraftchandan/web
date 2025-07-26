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

    // Check if user exists in coins table
    const { data: existingUser, error: fetchError } = await supabase
      .from('coins')
      .select('user_id, balance')
      .eq('user_id', userId)
      .single()

    if (fetchError && fetchError.code !== 'PGRST116') {
      return NextResponse.json({ error: 'Database error' }, { status: 500 })
    }

    const coinsToAdd = 10

    if (existingUser) {
      // Update existing user's balance
      const newBalance = existingUser.balance + coinsToAdd
      const { error: updateError } = await supabase
        .from('coins')
        .update({ balance: newBalance })
        .eq('user_id', userId)

      if (updateError) {
        return NextResponse.json({ error: 'Failed to update balance' }, { status: 500 })
      }

      return NextResponse.json({
        coins: coinsToAdd,
        balance: newBalance
      })
    } else {
      // Create new user with initial balance
      const { error: insertError } = await supabase
        .from('coins')
        .insert({ user_id: userId, balance: coinsToAdd })

      if (insertError) {
        return NextResponse.json({ error: 'Failed to create user' }, { status: 500 })
      }

      return NextResponse.json({
        coins: coinsToAdd,
        balance: coinsToAdd
      })
    }
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}