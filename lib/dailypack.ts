// Define the cooldown duration in milliseconds
const DAILY_COOLDOWN_MS = 10 * 1000 // 10 seconds

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
  const timeDiff = now.getTime() - lastClaim.getTime() // Difference in milliseconds

  if (timeDiff >= DAILY_COOLDOWN_MS) {
    return { canClaim: true }
  }

  const timeLeftMs = DAILY_COOLDOWN_MS - timeDiff
  const seconds = Math.ceil(timeLeftMs / 1000) // Round up to ensure full seconds are displayed

  // For a 10-second cooldown, displaying only seconds is sufficient.
  // If you want minutes/hours for longer cooldowns, you'd adjust this formatting.
  return {
    canClaim: false,
    timeUntilNext: `${seconds}s`,
  }
}

export function setDailyPackClaimed(userId: string) {
  const lastClaimKey = `dailypack_${userId}_lastClaim`
  localStorage.setItem(lastClaimKey, new Date().toISOString())
}
