export type ClothingCategory =
  | 'Tops'
  | 'Bottoms'
  | 'Outerwear'
  | 'Dresses'
  | 'Accessories'

export type ClothingItem = {
  id: string
  userId: string
  name: string
  category: ClothingCategory
  color: string
  pattern: string
  notes: string
  image: string
  createdAt: number
}