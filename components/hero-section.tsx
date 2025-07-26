"use client"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Bot, MessageCircle, Gift } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import ProfileCard from "./profile-card"
import { BackgroundBeams } from "./background-beams"

export function HeroSection() {
  const { isLoggedIn } = useAuth()

  const openInviteBot = () => {
    window.open(
      `https://discord.com/api/oauth2/authorize?client_id=${process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID}&permissions=0&scope=bot`,
      "_blank",
    )
  }

  const openDiscordServer = () => {
    window.open("https://discord.gg/YOUR_SERVER_INVITE", "_blank")
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col overflow-hidden">
      {/* Hero Section */}
      <section className="relative flex-1 flex items-center justify-center py-10 md:py-20">
        <BackgroundBeams />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
            {/* Left Side - Text Content */}
            <div className="text-center lg:text-left order-2 lg:order-1">
              {/* Badge */}
              <Badge className="mb-4 md:mb-6 bg-gradient-to-r from-purple-600 to-blue-600 text-white border-0 px-3 py-1 md:px-4 md:py-2 text-xs md:text-sm font-medium animate-fade-in">
                🚀 Now with 1000+ Cards Available
              </Badge>

              {/* Main Heading */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 leading-tight animate-fade-in">
                <span className="bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
                  The Ultimate Discord
                </span>
                <br />
                <span className="saas-text saas-glow">Card Collection</span>
                <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent"> Bot</span>
              </h1>

              {/* Subtitle */}
              <p
                className="text-base md:text-lg lg:text-xl text-gray-300 mb-6 md:mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed animate-fade-in px-4 lg:px-0"
                style={{ animationDelay: "0.2s" }}
              >
                Transform your Discord server into a thriving card trading community. Collect rare cards, battle
                friends, and build the ultimate collection.
              </p>

              {/* CTA Buttons */}
              <div
                className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center lg:justify-start animate-fade-in px-4 lg:px-0"
                style={{ animationDelay: "0.4s" }}
              >
                {isLoggedIn && (
                  <Button
                    onClick={() => (window.location.href = "/daily")}
                    size="lg"
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold px-6 py-2 md:px-8 md:py-3 text-sm md:text-lg group transition-all duration-300"
                  >
                    <Gift className="mr-2 h-4 w-4 md:h-5 md:w-5 group-hover:animate-bounce" />
                    Daily Pack
                  </Button>
                )}

                <Button
                  onClick={openInviteBot}
                  size="lg"
                  variant="outline"
                  className="border-2 border-gray-600 text-white hover:bg-white hover:text-black font-semibold px-6 py-2 md:px-8 md:py-3 text-sm md:text-lg group transition-all duration-300 bg-transparent"
                >
                  <Bot className="mr-2 h-4 w-4 md:h-5 md:w-5 group-hover:animate-bounce" />
                  Add to Discord
                </Button>

                <Button
                  onClick={openDiscordServer}
                  size="lg"
                  variant="outline"
                  className="border-2 border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white font-semibold px-6 py-2 md:px-8 md:py-3 text-sm md:text-lg group transition-all duration-300 bg-transparent"
                >
                  <MessageCircle className="mr-2 h-4 w-4 md:h-5 md:w-5 group-hover:animate-pulse" />
                  Join Community
                </Button>
              </div>
            </div>

            {/* Right Side - Profile Card */}
            <div
              className="flex justify-center lg:justify-end animate-fade-in order-1 lg:order-2"
              style={{ animationDelay: "0.6s" }}
            >
              <div className="w-full max-w-xs sm:max-w-sm lg:ml-32 xl:ml-48 2xl:ml-64">
                <ProfileCard
                  name="NOT-MOD"
                  title="OWNER"
                  handle="developer"
                  status="Online"
                  avatarUrl="/avatar.png"
                  contactText="View Profile"
                  onContactClick={() => {
                    console.log("Viewing TCG Master's profile")
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Thin Footer */}
      <footer className="bg-gray-900/50 border-t border-gray-800/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="text-center">
            <p className="text-gray-500 text-xs">Fan-made project • Not affiliated with any official TCG • No money is earned</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
