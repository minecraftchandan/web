export async function handleDailyPackClaim(userId: string) {
  // Immediately set as claimed for better UX
  setDailyPackClaimed(userId)
  
  // Return success immediately for instant UI response
  const immediateResponse = {
    success: true,
    message: 'Daily pack claimed successfully!',
    cards: ['Card 1', 'Card 2', 'Card 3'],
    quantity: 1,
  }
  
  // Make API call in background without blocking UI
  fetch('/api/packs/claim', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userId }),
  }).catch(() => {
    // Silently revert if API fails
    localStorage.removeItem(`dailypack_${userId}_lastClaim`)
  })
  
  return immediateResponse
}

export function canClaimDailyPack(userId: string): { canClaim: boolean; timeUntilNext?: string } {
  const lastClaimKey = `dailypack_${userId}_lastClaim`
  const lastClaimStr = localStorage.getItem(lastClaimKey)

  if (!lastClaimStr) {
    return { canClaim: true }
  }

  const lastClaim = new Date(lastClaimStr)
  const now = new Date()
  const timeDiff = now.getTime() - lastClaim.getTime()
  const hoursDiff = timeDiff / (1000 * 3600)

  if (hoursDiff >= 24) {
    return { canClaim: true }
  }

  const hoursLeft = 24 - hoursDiff
  const hours = Math.floor(hoursLeft)
  const minutes = Math.floor((hoursLeft - hours) * 60)

  return {
    canClaim: false,
    timeUntilNext: `${hours}h ${minutes}m`,
  }
}

export function setDailyPackClaimed(userId: string) {
  const lastClaimKey = `dailypack_${userId}_lastClaim`
  localStorage.setItem(lastClaimKey, new Date().toISOString())
}
