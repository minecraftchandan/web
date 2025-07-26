"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { LoadingSpinner } from "@/components/loading-spinner"

export default function AuthCallback() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { login } = useAuth()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const code = searchParams.get("code")
    const errorParam = searchParams.get("error")

    if (errorParam) {
      setError("Authentication was cancelled or failed")
      setTimeout(() => router.push("/"), 3000)
      return
    }

    if (code) {
      handleDiscordCallback(code)
    } else {
      setError("No authentication code received")
      setTimeout(() => router.push("/"), 3000)
    }
  }, [searchParams, router])

  const handleDiscordCallback = async (code: string) => {
    try {
      const response = await fetch("/api/auth/discord", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code }),
      })

      const data = await response.json()

      if (data.success) {
        login(data.user)
        router.push("/")
      } else {
        setError(data.error || "Login failed")
        setTimeout(() => router.push("/"), 3000)
      }
    } catch (error) {
      console.error("Login error:", error)
      setError("Network error occurred")
      setTimeout(() => router.push("/"), 3000)
    }
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 text-2xl mb-4">❌ {error}</div>
          <p className="text-gray-400">Redirecting to home page...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="text-center">
        <LoadingSpinner size="large" />
        <p className="text-xl mt-4">Authenticating with Discord...</p>
        <p className="text-gray-400 mt-2">Please wait while we log you in...</p>
      </div>
    </div>
  )
}
