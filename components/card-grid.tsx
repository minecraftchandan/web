"use client"

import type { Card } from "@/app/data/page"
import { CardItem } from "./card-item"

interface CardGridProps {
  cards: Card[]
  onCardClick: (card: Card) => void
}

export function CardGrid({ cards, onCardClick }: CardGridProps) {
  if (cards.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400 text-xl">No cards found matching your criteria.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {cards.map((card) => (
        <CardItem key={card.id} card={card} onClick={() => onCardClick(card)} />
      ))}
    </div>
  )
}
