export interface Space {
  id: string
  userId: string
  name: string
  description: string
  createdAt: number
  updatedAt: number
}

export interface SpaceOutfit {
  id: string
  spaceId: string
  outfitId: string
  createdAt: number
}