import type { ClothingItem } from './clothing'

export interface OutfitItem {
  id: string
  clothingId: string
  x: number
  y: number
  width: number
  height: number
  rotation: number
  zIndex: number
}

export interface Outfit {
  id: string
  userId: string
  name: string
  items: OutfitItem[]
  createdAt: number
  updatedAt: number
}

export interface OutfitItemWithClothing extends OutfitItem {
  clothing?: ClothingItem
}