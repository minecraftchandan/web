"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Gift, Coins, Clock, Zap, Lock } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { useToast } from "@/hooks/use-toast"
import { handleDailyPackClaim, canClaimDailyPack, setDailyPackClaimed } from "@/lib/dailypack"
import { handleDailyCoinClaim, canClaimDailyCoin, setDailyCoinClaimed } from "@/lib/dailycoin"
import { useRouter } from "next/navigation"

export default function DailyPage() {
  const [dailyPackStatus, setDailyPackStatus] = useState({ canClaim: true, timeUntilNext: "" })
  const [dailyCoinStatus, setDailyCoinStatus] = useState({ canClaim: true, timeUntilNext: "" })
  const { user, isLoggedIn, loading } = useAuth()
  const { toast } = useToast()
  const router = useRouter()

  // Redirect if not logged in
  useEffect(() => {
    if (!loading && !isLoggedIn) {
      router.push("/")
    }
  }, [isLoggedIn, loading, router])

  useEffect(() => {
    if (user?.id) {
      // Check daily pack status
      const packStatus = canClaimDailyPack(user.id)
      setDailyPackStatus(packStatus)

      // Check daily coin status
      const coinStatus = canClaimDailyCoin(user.id)
      setDailyCoinStatus(coinStatus)

      // Set up intervals to update cooldowns every minute
      const interval = setInterval(() => {
        const newPackStatus = canClaimDailyPack(user.id)
        setDailyPackStatus(newPackStatus)

        const newCoinStatus = canClaimDailyCoin(user.id)
        setDailyCoinStatus(newCoinStatus)
      }, 60000) // Update every minute

      return () => clearInterval(interval)
    }
  }, [user])

  const handleDailyPackClick = async () => {
    if (!user?.id || !dailyPackStatus.canClaim) return

    try {
      const result = await handleDailyPackClaim(user.id)

      if (result.success) {
        setDailyPackClaimed(user.id)
        const newStatus = canClaimDailyPack(user.id)
        setDailyPackStatus(newStatus)

        toast({
          title: "Daily Pack Claimed! 🎉",
          description: result.message,
        })
      }
    } catch (error) {
      console.error("Error claiming daily pack:", error)
      toast({
        title: "Error",
        description: "Failed to claim daily pack. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDailyCoinClick = async () => {
    if (!user?.id || !dailyCoinStatus.canClaim) return

    try {
      const result = await handleDailyCoinClaim(user.id)

      if (result.success) {
        setDailyCoinClaimed(user.id)
        const newStatus = canClaimDailyCoin(user.id)
        setDailyCoinStatus(newStatus)

        toast({
          title: "Daily Coin Claimed! 💰",
          description: result.message,
        })
      }
    } catch (error) {
      console.error("Error claiming daily coin:", error)
      toast({
        title: "Error",
        description: "Failed to claim daily coin. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Show loading or redirect message
  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-xl">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <Lock className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h1 className="text-2xl font-bold mb-4">Access Restricted</h1>
          <p className="text-gray-400 mb-6">Please log in with Discord to access daily rewards.</p>
          <Button onClick={() => router.push("/")} className="bg-[#5865F2] hover:bg-[#4752C4] text-white font-semibold">
            Go to Home
          </Button>
        </div>
      </div>
    )
  }

  // Determine badge text based on available rewards
  const getBadgeText = () => {
    const packAvailable = dailyPackStatus.canClaim
    const coinAvailable = dailyCoinStatus.canClaim

    if (packAvailable && coinAvailable) {
      return "Daily Rewards Available"
    } else if (packAvailable) {
      return "Daily Pack Available"
    } else if (coinAvailable) {
      return "Daily Coin Available"
    } else {
      return "Rewards on Cooldown"
    }
  }

  // Determine badge color based on available rewards
  const getBadgeColor = () => {
    const packAvailable = dailyPackStatus.canClaim
    const coinAvailable = dailyCoinStatus.canClaim

    if (packAvailable || coinAvailable) {
      return "bg-gradient-to-r from-purple-600 to-blue-600 text-white border-0"
    } else {
      return "bg-gradient-to-r from-gray-600 to-gray-700 text-gray-300 border-0"
    }
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <div className="flex-1 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-8 md:mb-16 relative">
            {/* Background Elements */}
            <div className="absolute inset-0 -z-10">
              <div className="absolute top-0 left-1/4 w-32 h-32 md:w-64 md:h-64 bg-purple-600 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
              <div
                className="absolute top-0 right-1/4 w-32 h-32 md:w-64 md:h-64 bg-blue-600 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"
                style={{ animationDelay: "2s" }}
              ></div>
            </div>

            {/* Badge */}
            <Badge
              className={`mb-4 md:mb-6 ${getBadgeColor()} px-3 py-1 md:px-4 md:py-2 text-xs md:text-sm font-medium animate-fade-in`}
            >
              <Zap className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
              {getBadgeText()}
            </Badge>

            {/* Main Heading */}
            <h1 className="text-3xl md:text-5xl lg:text-7xl font-black mb-4 md:mb-6 animate-fade-in">
              <span className="bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
                Claim Your
              </span>
              <br />
              <span className="bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent">
                Daily Rewards
              </span>
            </h1>

            {/* Subtitle */}
            <p
              className="text-base md:text-xl lg:text-2xl text-gray-300 mb-6 md:mb-8 max-w-3xl mx-auto leading-relaxed animate-fade-in px-4"
              style={{ animationDelay: "0.2s" }}
            >
              Unlock exclusive cards and coins every day. Build your collection with our reward system.
            </p>

            {/* Stats */}
            <div
              className="flex flex-wrap justify-center gap-3 md:gap-6 mb-8 md:mb-12 animate-fade-in px-4"
              style={{ animationDelay: "0.4s" }}
            >
              <div className="flex items-center gap-2 bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-full px-3 py-2 md:px-6 md:py-3">
                <Gift className="w-4 h-4 md:w-5 md:h-5 text-green-400" />
                <span className="text-gray-300 text-xs md:text-sm">Daily Bonuses</span>
              </div>
              <div className="flex items-center gap-2 bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-full px-3 py-2 md:px-6 md:py-3">
                <Coins className="w-4 h-4 md:w-5 md:h-5 text-blue-400" />
                <span className="text-gray-300 text-xs md:text-sm">Instant Rewards</span>
              </div>
            </div>
          </div>

          {/* Reward Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 max-w-5xl mx-auto px-4">
            {/* Daily Pack Card */}
            <Card className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-gray-700 hover:border-purple-500/50 transition-all duration-500 transform hover:scale-[1.02] hover:shadow-2xl hover:shadow-purple-500/10 group overflow-hidden">
              {/* Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/5 to-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              <CardHeader className="relative z-10 p-4 md:p-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl flex items-center justify-center">
                      <Gift className="w-5 h-5 md:w-6 md:h-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-white text-lg md:text-xl font-bold">Daily Pack</CardTitle>
                      <CardDescription className="text-gray-400 text-sm">Every 24 hours</CardDescription>
                    </div>
                  </div>
                  <Badge className="bg-green-600/20 text-green-400 border-green-600/30 text-xs">FREE</Badge>
                </div>
              </CardHeader>

              <CardContent className="relative z-10 space-y-4 md:space-y-6 p-4 md:p-6 pt-0">
                <div className="space-y-2 md:space-y-3">
                  <div className="flex items-center gap-3 text-gray-300">
                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                    <span className="text-sm">3 Random Cards</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-300">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span className="text-sm">Rare Card Chance</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-300">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                    <span className="text-sm">Collection Progress</span>
                  </div>
                </div>

                {!dailyPackStatus.canClaim && dailyPackStatus.timeUntilNext && (
                  <div className="flex items-center justify-center gap-2 bg-orange-500/10 border border-orange-500/20 rounded-lg p-3">
                    <Clock className="w-4 h-4 text-orange-400" />
                    <span className="text-sm text-orange-400 font-medium">Next in {dailyPackStatus.timeUntilNext}</span>
                  </div>
                )}

                <Button
                  onClick={handleDailyPackClick}
                  disabled={!dailyPackStatus.canClaim}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-2 md:py-3 text-sm md:text-lg disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-[1.02]"
                >
                  {dailyPackStatus.canClaim ? "Claim Daily Pack" : "Already Claimed"}
                </Button>
              </CardContent>
            </Card>

            {/* Daily Coin Card */}
            <Card className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-gray-700 hover:border-yellow-500/50 transition-all duration-500 transform hover:scale-[1.02] hover:shadow-2xl hover:shadow-yellow-500/10 group overflow-hidden">
              {/* Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-600/5 to-orange-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              <CardHeader className="relative z-10 p-4 md:p-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-r from-yellow-600 to-orange-600 rounded-xl flex items-center justify-center">
                      <Coins className="w-5 h-5 md:w-6 md:h-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-white text-lg md:text-xl font-bold">Daily Coin</CardTitle>
                      <CardDescription className="text-gray-400 text-sm">Every 12 hours</CardDescription>
                    </div>
                  </div>
                  <Badge className="bg-green-600/20 text-green-400 border-green-600/30 text-xs">FREE</Badge>
                </div>
              </CardHeader>

              <CardContent className="relative z-10 space-y-4 md:space-y-6 p-4 md:p-6 pt-0">
                <div className="space-y-2 md:space-y-3">
                  <div className="flex items-center gap-3 text-gray-300">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                    <span className="text-sm">1 Daily Coin</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-300">
                    <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                    <span className="text-sm">Instant Reward</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-300">
                    <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
                    <span className="text-sm">No Waiting Time</span>
                  </div>
                </div>

                {!dailyCoinStatus.canClaim && dailyCoinStatus.timeUntilNext && (
                  <div className="flex items-center justify-center gap-2 bg-orange-500/10 border border-orange-500/20 rounded-lg p-3">
                    <Clock className="w-4 h-4 text-orange-400" />
                    <span className="text-sm text-orange-400 font-medium">Next in {dailyCoinStatus.timeUntilNext}</span>
                  </div>
                )}

                <Button
                  onClick={handleDailyCoinClick}
                  disabled={!dailyCoinStatus.canClaim}
                  className="w-full bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white font-bold py-2 md:py-3 text-sm md:text-lg disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-[1.02]"
                >
                  {dailyCoinStatus.canClaim ? "Claim Daily Coin" : "Already Claimed"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900/50 border-t border-gray-800/50 backdrop-blur-sm mt-8 md:mt-16">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="text-center">
            <p className="text-gray-500 text-xs">Fan-made project • Not affiliated with any official TCG • No money is earned</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
