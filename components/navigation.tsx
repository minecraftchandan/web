"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/hooks/use-auth"
import { LogOut, Menu, X, Database, Gift } from "lucide-react"
import { useState } from "react"

export function Navigation() {
  const pathname = usePathname()
  const { user, isLoggedIn, logout } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleDiscordLogin = () => {
    const CLIENT_ID = process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID
    const REDIRECT_URI = encodeURIComponent(`${window.location.origin}/auth/callback`)
    const SCOPE = "identify"

    const discordAuthUrl = `https://discord.com/api/oauth2/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=${SCOPE}`
    window.location.href = discordAuthUrl
  }

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  return (
    <nav className="sticky top-0 z-50 bg-black/20 backdrop-blur-md border-b border-white/10">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-white hover:text-gray-300 transition-colors">
              🕹️ NOT_BOT
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            <Link
              href="/data"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                pathname === "/data"
                  ? "bg-white/20 text-white shadow-sm backdrop-blur-sm"
                  : "text-gray-300 hover:text-white hover:bg-white/10"
              }`}
            >
              <Database className="h-4 w-4" />
              View Cards
            </Link>
            {isLoggedIn && (
              <Link
                href="/daily"
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  pathname === "/daily"
                    ? "bg-white/20 text-white shadow-sm backdrop-blur-sm"
                    : "text-gray-300 hover:text-white hover:bg-white/10"
                }`}
              >
                <Gift className="h-4 w-4" />
                Daily Pack
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMobileMenu}
              className="text-gray-300 hover:text-white hover:bg-white/10"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center space-x-3">
            {!isLoggedIn ? (
              <Button
                onClick={handleDiscordLogin}
                className="bg-[#5865F2] hover:bg-[#4752C4] text-white font-medium px-6 py-2 rounded-lg shadow-sm transition-all duration-200"
              >
                Login with Discord
              </Button>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full hover:bg-white/10">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={
                          user?.avatar ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png` : undefined
                        }
                        alt={user?.username || "User"}
                      />
                      <AvatarFallback className="bg-gray-700 text-white text-sm">
                        {user?.username?.[0]?.toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-56 bg-gray-900/95 backdrop-blur-md border-gray-700 shadow-lg"
                  align="end"
                >
                  <div className="flex items-center justify-start gap-2 p-3">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium text-white">{user?.username}</p>
                      <p className="text-xs text-gray-400">#{user?.discriminator || "0000"}</p>
                    </div>
                  </div>
                  <DropdownMenuSeparator className="bg-gray-700" />
                  <DropdownMenuItem
                    onClick={logout}
                    className="text-red-400 hover:text-red-300 hover:bg-red-900/20 cursor-pointer"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-white/10 bg-black/30 backdrop-blur-md">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link
                href="/data"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-base font-medium transition-all ${
                  pathname === "/data"
                    ? "bg-white/20 text-white backdrop-blur-sm"
                    : "text-gray-300 hover:text-white hover:bg-white/10"
                }`}
              >
                <Database className="h-4 w-4" />
                View Cards
              </Link>
              {isLoggedIn && (
                <Link
                  href="/daily"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-base font-medium transition-all ${
                    pathname === "/daily"
                      ? "bg-white/20 text-white backdrop-blur-sm"
                      : "text-gray-300 hover:text-white hover:bg-white/10"
                  }`}
                >
                  <Gift className="h-4 w-4" />
                  Daily Pack
                </Link>
              )}

              {/* Mobile Auth */}
              <div className="pt-4 border-t border-white/10 mt-4">
                {!isLoggedIn ? (
                  <Button
                    onClick={() => {
                      handleDiscordLogin()
                      setMobileMenuOpen(false)
                    }}
                    className="w-full bg-[#5865F2] hover:bg-[#4752C4] text-white font-medium"
                  >
                    Login with Discord
                  </Button>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 px-3 py-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={
                            user?.avatar
                              ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`
                              : undefined
                          }
                          alt={user?.username || "User"}
                        />
                        <AvatarFallback className="bg-gray-700 text-white text-sm">
                          {user?.username?.[0]?.toUpperCase() || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-white text-sm">{user?.username}</p>
                        <p className="text-xs text-gray-400">#{user?.discriminator || "0000"}</p>
                      </div>
                    </div>
                    <Button
                      onClick={() => {
                        logout()
                        setMobileMenuOpen(false)
                      }}
                      variant="outline"
                      className="w-full border-red-600/50 text-red-400 hover:bg-red-900/20 hover:text-red-300"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
