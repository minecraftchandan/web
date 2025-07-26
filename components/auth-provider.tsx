"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface User {
  id: string
  username: string
  discriminator?: string
  avatar?: string
}

interface AuthContextType {
  user: User | null
  isLoggedIn: boolean
  login: (user: User) => void
  logout: () => void
  loading: boolean
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for saved session on mount
    const savedSession = localStorage.getItem("userSession")
    if (savedSession) {
      try {
        const session = JSON.parse(savedSession)
        if (session.isLoggedIn && session.user) {
          setUser(session.user)
          setIsLoggedIn(true)
        }
      } catch (error) {
        console.error("Failed to parse saved session:", error)
        localStorage.removeItem("userSession")
      }
    }
    setLoading(false)
  }, [])

  const login = (userData: User) => {
    setUser(userData)
    setIsLoggedIn(true)
    localStorage.setItem(
      "userSession",
      JSON.stringify({
        isLoggedIn: true,
        user: userData,
      }),
    )
  }

  const logout = () => {
    setUser(null)
    setIsLoggedIn(false)
    localStorage.removeItem("userSession")
    // Also clear user data
    if (user?.id) {
      localStorage.removeItem(`user_${user.id}_data`)
    }
  }

  return <AuthContext.Provider value={{ user, isLoggedIn, login, logout, loading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
