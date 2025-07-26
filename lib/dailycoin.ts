export async function handleDailyCoinClaim(userId: string) {
  // Immediately set as claimed for better UX
  setDailyCoinClaimed(userId)
  
  try {
    const response = await fetch('/api/coins/claim', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId }),
    })

    const data = await response.json()
    
    if (!response.ok) {
      // Revert the claim if API fails
      localStorage.removeItem(`dailycoin_${userId}_lastClaim`)
      return {
        success: false,
        message: data.error || 'Failed to claim daily coin',
        coins: 0,
      }
    }

    return {
      success: true,
      message: 'Daily coin claimed successfully!',
      coins: data.coins,
      balance: data.balance,
    }
  } catch (error) {
    // Revert the claim if network fails
    localStorage.removeItem(`dailycoin_${userId}_lastClaim`)
    return {
      success: false,
      message: 'Network error occurred',
      coins: 0,
    }
  }
}

export function canClaimDailyCoin(userId: string): { canClaim: boolean; timeUntilNext?: string } {
  const lastClaimKey = `dailycoin_${userId}_lastClaim`
  const lastClaimStr = localStorage.getItem(lastClaimKey)

  if (!lastClaimStr) {
    return { canClaim: true }
  }

  const lastClaim = new Date(lastClaimStr)
  const now = new Date()
  const timeDiff = now.getTime() - lastClaim.getTime()
  const hoursDiff = timeDiff / (1000 * 3600)

  if (hoursDiff >= 12) {
    return { canClaim: true }
  }

  const hoursLeft = 12 - hoursDiff
  const hours = Math.floor(hoursLeft)
  const minutes = Math.floor((hoursLeft - hours) * 60)

  return {
    canClaim: false,
    timeUntilNext: `${hours}h ${minutes}m`,
  }
}

export function setDailyCoinClaimed(userId: string) {
  const lastClaimKey = `dailycoin_${userId}_lastClaim`
  localStorage.setItem(lastClaimKey, new Date().toISOString())
}
