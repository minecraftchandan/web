import { NextResponse } from "next/server"
import fs from 'fs'
import path from 'path'

export async function GET() {
  try {
    // Read cards.json from public folder
    const filePath = path.join(process.cwd(), 'public', 'cards.json')
    const fileContents = fs.readFileSync(filePath, 'utf8')
    const cards = JSON.parse(fileContents)
    
    // Simulate API delay for more realistic experience
    await new Promise((resolve) => setTimeout(resolve, Math.random() * 1000 + 500))
    
    return NextResponse.json(cards)
  } catch (error) {
    console.error('Error reading cards.json:', error)
    return NextResponse.json({ error: 'Failed to load cards' }, { status: 500 })
  }
}
