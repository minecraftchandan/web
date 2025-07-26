"use client"

import Image from "next/image"
import type { Card } from "@/app/data/page"

interface CardItemProps {
  card: Card
  onClick: () => void
}

export function CardItem({ card, onClick }: CardItemProps) {
  const getRarityColor = (rarity: string) => {
    switch (rarity.toLowerCase()) {
      case "common":
        return "text-gray-400 bg-gray-600/20 border-gray-600/30"
      case "uncommon":
        return "text-green-400 bg-green-600/20 border-green-600/30"
      case "rare":
        return "text-blue-400 bg-blue-600/20 border-blue-600/30"
      case "epic":
        return "text-purple-400 bg-purple-600/20 border-purple-600/30"
      case "legendary":
        return "text-yellow-400 bg-yellow-600/20 border-yellow-600/30"
      default:
        return "text-gray-400 bg-gray-600/20 border-gray-600/30"
    }
  }

  return (
    <div
      onClick={onClick}
      className="bg-gray-900 border border-gray-700 rounded-lg p-4 cursor-pointer card-hover group transition-all duration-300"
    >
      <div className="aspect-[3/4] relative mb-4 overflow-hidden rounded-md">
        <Image
          src={card.image || "/placeholder.svg"}
          alt={card.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Card Information */}
      <div className="space-y-3">
        {/* Card Name */}
        <h3 className="text-white font-bold text-lg leading-tight line-clamp-2">{card.name}</h3>

        {/* Rarity Badge */}
        <div className="flex justify-center">
          <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${getRarityColor(card.rarity)}`}>
            {card.rarity}
          </span>
        </div>

        {/* Types */}
        <div className="text-center">
          {card.types && card.types.length > 0 ? (
            <div className="flex flex-wrap justify-center gap-1">
              {card.types.map((type, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-gray-800 text-gray-300 text-xs rounded border border-gray-600"
                >
                  {type}
                </span>
              ))}
            </div>
          ) : (
            <span className="text-gray-500 text-xs italic">No type specified</span>
          )}
        </div>
      </div>
    </div>
  )
}
