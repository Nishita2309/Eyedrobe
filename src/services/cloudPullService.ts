import { supabase } from '../lib/supabase/client'
import { db } from '../lib/database/db'
import type { ClothingCategory, ClothingItem } from '../types/clothing'
import type { Outfit, OutfitItem } from '../types/outfit'
import type { Space, SpaceOutfit } from '../types/space'

function timestampFromIso(value: string): number {
  return new Date(value).getTime()
}

interface CloudClothingItem {
  id: string
  user_id: string
  name: string
  category: ClothingCategory
  color: string
  pattern: string
  notes: string
  image_url: string
  created_at: string
}

interface CloudOutfit {
  id: string
  user_id: string
  name: string
  created_at: string
  updated_at: string
}

interface CloudOutfitItem {
  id: string
  outfit_id: string
  clothing_id: string
  x: number
  y: number
  width: number
  height: number
  rotation: number
  z_index: number
}

interface CloudSpace {
  id: string
  user_id: string
  name: string
  description: string
  created_at: string
  updated_at: string
}

interface CloudSpaceOutfit {
  id: string
  space_id: string
  outfit_id: string
  created_at: string
}

async function pullClothing(
  userId: string,
): Promise<void> {
  const { data, error } = await supabase
    .from('clothing_items')
    .select(
      'id, user_id, name, category, color, pattern, notes, image_url, created_at',
    )
    .eq('user_id', userId)

  if (error) {
    throw error
  }

  const items: ClothingItem[] = (
    (data ?? []) as CloudClothingItem[]
  ).map((item) => ({
    id: item.id,
    userId: item.user_id,
    name: item.name,
    category: item.category,
    color: item.color,
    pattern: item.pattern,
    notes: item.notes,
    image: item.image_url,
    createdAt: timestampFromIso(item.created_at),
  }))

  await db.clothing
    .where('userId')
    .equals(userId)
    .delete()

  if (items.length > 0) {
    await db.clothing.bulkPut(items)
  }
}

async function pullOutfits(
  userId: string,
): Promise<void> {
  const { data: outfitData, error: outfitError } =
    await supabase
      .from('outfits')
      .select(
        'id, user_id, name, created_at, updated_at',
      )
      .eq('user_id', userId)

  if (outfitError) {
    throw outfitError
  }

  const cloudOutfits =
    (outfitData ?? []) as CloudOutfit[]

  const outfitIds = cloudOutfits.map(
    (outfit) => outfit.id,
  )

  let cloudItems: CloudOutfitItem[] = []

  if (outfitIds.length > 0) {
    const { data: itemData, error: itemError } =
      await supabase
        .from('outfit_items')
        .select(
          'id, outfit_id, clothing_id, x, y, width, height, rotation, z_index',
        )
        .in('outfit_id', outfitIds)

    if (itemError) {
      throw itemError
    }

    cloudItems = (itemData ?? []) as CloudOutfitItem[]
  }

  const outfits: Outfit[] = cloudOutfits.map(
    (outfit) => ({
      id: outfit.id,
      userId: outfit.user_id,
      name: outfit.name,
      items: cloudItems
        .filter(
          (item) => item.outfit_id === outfit.id,
        )
        .map(
          (item): OutfitItem => ({
            id: item.id,
            clothingId: item.clothing_id,
            x: item.x,
            y: item.y,
            width: item.width,
            height: item.height,
            rotation: item.rotation,
            zIndex: item.z_index,
          }),
        ),
      createdAt: timestampFromIso(
        outfit.created_at,
      ),
      updatedAt: timestampFromIso(
        outfit.updated_at,
      ),
    }),
  )

  await db.outfits
    .where('userId')
    .equals(userId)
    .delete()

  if (outfits.length > 0) {
    await db.outfits.bulkPut(outfits)
  }
}

async function pullSpaces(
  userId: string,
): Promise<void> {
  const { data: spaceData, error: spaceError } =
    await supabase
      .from('spaces')
      .select(
        'id, user_id, name, description, created_at, updated_at',
      )
      .eq('user_id', userId)

  if (spaceError) {
    throw spaceError
  }

  const spaces =
    (spaceData ?? []) as CloudSpace[]

  const spaceIds = spaces.map(
    (space) => space.id,
  )

  let relationships: CloudSpaceOutfit[] = []

  if (spaceIds.length > 0) {
    const {
      data: relationshipData,
      error: relationshipError,
    } = await supabase
      .from('space_outfits')
      .select(
        'id, space_id, outfit_id, created_at',
      )
      .in('space_id', spaceIds)

    if (relationshipError) {
      throw relationshipError
    }

    relationships =
      (relationshipData ?? []) as CloudSpaceOutfit[]
  }

  const localSpaces: Space[] = spaces.map(
    (space) => ({
      id: space.id,
      userId: space.user_id,
      name: space.name,
      description: space.description,
      createdAt: timestampFromIso(
        space.created_at,
      ),
      updatedAt: timestampFromIso(
        space.updated_at,
      ),
    }),
  )

  const localRelationships: SpaceOutfit[] =
    relationships.map((relationship) => ({
      id: relationship.id,
      spaceId: relationship.space_id,
      outfitId: relationship.outfit_id,
      createdAt: timestampFromIso(
        relationship.created_at,
      ),
    }))

  await db.spaces
    .where('userId')
    .equals(userId)
    .delete()

  if (localSpaces.length > 0) {
    await db.spaces.bulkPut(localSpaces)
  }

  const existingRelationships =
    await db.spaceOutfits.toArray()

  const relationshipsToDelete =
    existingRelationships.filter((relationship) =>
      spaceIds.includes(relationship.spaceId),
    )

  if (relationshipsToDelete.length > 0) {
    await db.spaceOutfits.bulkDelete(
      relationshipsToDelete.map(
        (relationship) => relationship.id,
      ),
    )
  }

  if (localRelationships.length > 0) {
    await db.spaceOutfits.bulkPut(
      localRelationships,
    )
  }
}

export async function pullCloudData(
  userId: string,
): Promise<void> {
  await pullClothing(userId)
  await pullOutfits(userId)
  await pullSpaces(userId)
}