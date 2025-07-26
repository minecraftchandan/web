"use client"

import Image from "next/image"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Heart, Share2, Sword, Shield, Coins } from "lucide-react"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import type { Card as CardType } from "@/app/data/page"

interface CardModalProps {
  card: CardType
  onClose: () => void
}

export function CardModal({ card, onClose }: CardModalProps) {
  const [isFavorited, setIsFavorited] = useState(false)
  const { toast } = useToast()

  const getRarityColor = (rarity: string) => {
    switch (rarity.toLowerCase()) {
      case "common":
        return "bg-gray-600 text-gray-100"
      case "uncommon":
        return "bg-green-600 text-green-100"
      case "rare":
        return "bg-blue-600 text-blue-100"
      case "epic":
        return "bg-purple-600 text-purple-100"
      case "legendary":
        return "bg-yellow-600 text-yellow-100"
      default:
        return "bg-gray-600 text-gray-100"
    }
  }

  const getRarityGradient = (rarity: string) => {
    switch (rarity.toLowerCase()) {
      case "legendary":
        return "from-yellow-400 to-orange-500"
      case "epic":
        return "from-purple-400 to-pink-500"
      case "rare":
        return "from-blue-400 to-cyan-500"
      case "uncommon":
        return "from-green-400 to-emerald-500"
      default:
        return "from-gray-400 to-gray-500"
    }
  }

  const handleFavorite = () => {
    setIsFavorited(!isFavorited)
    toast({
      title: isFavorited ? "Removed from favorites" : "Added to favorites",
      description: `${card.name} ${isFavorited ? "removed from" : "added to"} your collection`,
    })
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: card.name,
        text: `Check out this ${card.rarity} card: ${card.name}`,
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(`Check out this ${card.rarity} card: ${card.name}`)
      toast({
        title: "Link copied!",
        description: "Card link copied to clipboard",
      })
    }
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-3">
            <span className={`w-4 h-4 rounded-full bg-gradient-to-r ${getRarityGradient(card.rarity)}`}></span>
            {card.name}
          </DialogTitle>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Card Image */}
          <div className="space-y-4">
            <div
              className={`aspect-[3/4] relative overflow-hidden rounded-lg border-2 bg-gradient-to-br ${getRarityGradient(card.rarity)} p-1`}
            >
              <div className="w-full h-full bg-gray-800 rounded-md overflow-hidden">
                <Image src={card.image || "/placeholder.svg"} alt={card.name} fill className="object-cover" />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button
                onClick={handleFavorite}
                variant="outline"
                size="sm"
                className={`flex-1 border-gray-600 ${isFavorited ? "bg-red-600 border-red-600 text-white" : "text-white hover:bg-gray-800"}`}
              >
                <Heart className={`w-4 h-4 mr-2 ${isFavorited ? "fill-current" : ""}`} />
                {isFavorited ? "Favorited" : "Favorite"}
              </Button>
              <Button
                onClick={handleShare}
                variant="outline"
                size="sm"
                className="flex-1 border-gray-600 text-white hover:bg-gray-800 bg-transparent"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>
          </div>

          {/* Card Details */}
          <div className="space-y-6">
            <div>
              <h4 className="text-lg font-semibold mb-3 text-gray-300">Card Details</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Rarity:</span>
                  <Badge className={getRarityColor(card.rarity)}>{card.rarity}</Badge>
                </div>

                {card.supertype && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Supertype:</span>
                    <span className="text-white font-medium">{card.supertype}</span>
                  </div>
                )}

                {card.types && card.types.length > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Types:</span>
                    <div className="flex flex-wrap gap-1">
                      {card.types.map((type, index) => (
                        <Badge key={index} variant="outline" className="border-gray-600 text-gray-300 text-xs">
                          {type}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Stats */}
                <div className="grid grid-cols-3 gap-3 pt-3 border-t border-gray-700">
                  {card.attack !== undefined && (
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-1">
                        <Sword className="w-4 h-4 text-red-400" />
                      </div>
                      <div className="text-lg font-bold text-white">{card.attack}</div>
                      <div className="text-xs text-gray-400">Attack</div>
                    </div>
                  )}

                  {card.defense !== undefined && (
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-1">
                        <Shield className="w-4 h-4 text-blue-400" />
                      </div>
                      <div className="text-lg font-bold text-white">{card.defense}</div>
                      <div className="text-xs text-gray-400">Defense</div>
                    </div>
                  )}

                  {card.cost !== undefined && (
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-1">
                        <Coins className="w-4 h-4 text-yellow-400" />
                      </div>
                      <div className="text-lg font-bold text-white">{card.cost}</div>
                      <div className="text-xs text-gray-400">Cost</div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {card.description && (
              <div>
                <h4 className="text-lg font-semibold mb-3 text-gray-300">Description</h4>
                <p className="text-gray-400 leading-relaxed text-sm bg-gray-800 p-4 rounded-lg border border-gray-700">
                  {card.description}
                </p>
              </div>
            )}

            {/* Market Value (mock data) */}
            <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
              <h4 className="text-lg font-semibold mb-3 text-gray-300">Market Info</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-gray-400">Market Value</div>
                  <div className="text-white font-bold">
                    {card.rarity === "Legendary"
                      ? "500-1000"
                      : card.rarity === "Epic"
                        ? "100-300"
                        : card.rarity === "Rare"
                          ? "50-100"
                          : "10-25"}{" "}
                    coins
                  </div>
                </div>
                <div>
                  <div className="text-gray-400">Owned by</div>
                  <div className="text-white font-bold">{Math.floor(Math.random() * 1000) + 50} players</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
