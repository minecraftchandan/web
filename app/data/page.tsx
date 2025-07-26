"use client"

import { useState, useEffect, useCallback } from "react"
import { CardGrid } from "@/components/card-grid"
import { CardFilters } from "@/components/card-filters"
import { CardModal } from "@/components/card-modal"
import { Pagination } from "@/components/pagination"
import { LoadingSpinner } from "@/components/loading-spinner"
import { useToast } from "@/hooks/use-toast"

export interface Card {
  id: string
  name: string
  image: string
  rarity: string
  types?: string[]
  supertype?: string
  description?: string
  attack?: number
  defense?: number
  cost?: number
}

export default function DataPage() {
  const [allCards, setAllCards] = useState<Card[]>([])
  const [filteredCards, setFilteredCards] = useState<Card[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedCard, setSelectedCard] = useState<Card | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()
  const cardsPerPage = 12

  useEffect(() => {
    loadCards()
  }, [])

  const loadCards = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch("/api/cards")

      if (!response.ok) {
        throw new Error("Failed to fetch cards")
      }

      const data = await response.json()
      setAllCards(data)
      setFilteredCards(data)
    } catch (error) {
      console.error("Failed to load cards:", error)
      setError("Failed to load cards. Please try again.")
      toast({
        title: "Error loading cards",
        description: "Please refresh the page and try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleFilter = useCallback(
    (searchTerm: string, rarity: string, type: string) => {
      const filtered = allCards.filter((card) => {
        const matchesSearch = card.name.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesRarity = !rarity || card.rarity === rarity
        const matchesType = !type || (card.types && card.types.includes(type))
        return matchesSearch && matchesRarity && matchesType
      })
      setFilteredCards(filtered)
      setCurrentPage(1)
    },
    [allCards],
  )

  const totalPages = Math.ceil(filteredCards.length / cardsPerPage)
  const startIndex = (currentPage - 1) * cardsPerPage
  const currentCards = filteredCards.slice(startIndex, startIndex + cardsPerPage)

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <LoadingSpinner size="large" />
            <p className="text-xl mt-4">Loading cards...</p>
          </div>
        </div>
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

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col">
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="text-center max-w-md">
            <div className="text-2xl mb-4">⚠️ {error}</div>
            <button
              onClick={loadCards}
              className="px-6 py-3 bg-white text-black rounded-lg hover:bg-gray-200 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
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

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <div className="flex-1">
        <div className="container mx-auto px-4 py-6 md:py-8">
          <div className="text-center mb-6 md:mb-8">
            <h1 className="text-3xl md:text-4xl lg:text-6xl font-bold mb-4 leading-tight">
              <span className="bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
                Card
              </span>
              <br />
              <span className="saas-text saas-glow">Collection</span>
            </h1>
            <p className="text-gray-400 text-base md:text-lg px-4">
              Discover all the available cards 
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-6 md:gap-8">
            {/* Filters - Mobile: Full width, Desktop: Sidebar */}
            <div className="lg:w-1/4">
              <div className="lg:sticky lg:top-24">
                <CardFilters cards={allCards} onFilter={handleFilter} resultsCount={filteredCards.length} />
              </div>
            </div>

            {/* Cards Grid */}
            <div className="lg:w-3/4">
              <CardGrid cards={currentCards} onCardClick={setSelectedCard} />

              {totalPages > 1 && (
                <div className="mt-6 md:mt-8">
                  <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <footer className="bg-gray-900/50 border-t border-gray-800/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="text-center">
            <p className="text-gray-500 text-xs">Fan-made project • Not affiliated with any official TCG • No money is earned</p>
          </div>
        </div>
      </footer>

      {selectedCard && <CardModal card={selectedCard} onClose={() => setSelectedCard(null)} />}
    </div>
  )
}
