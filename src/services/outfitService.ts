import { db } from '../lib/database/db'
import type { Outfit } from '../types/outfit'
import { addSyncOperation } from './syncQueueService'

export async function getOutfits(
  userId: string,
): Promise<Outfit[]> {
  return db.outfits
    .where('userId')
    .equals(userId)
    .reverse()
    .sortBy('updatedAt')
}

export async function getOutfit(
  id: string,
): Promise<Outfit | undefined> {
  return db.outfits.get(id)
}

export async function saveOutfit(
  outfit: Outfit,
): Promise<void> {
  const existing = await db.outfits.get(outfit.id)

  await db.outfits.put(outfit)

  await addSyncOperation({
    userId: outfit.userId,
    entity: 'outfit',
    entityId: outfit.id,
    operation: existing ? 'update' : 'create',
    payload: outfit,
  })
}

export async function deleteOutfit(
  id: string,
): Promise<void> {
  const outfit = await db.outfits.get(id)

  if (!outfit) {
    return
  }

  const relationships = await db.spaceOutfits
    .where('outfitId')
    .equals(id)
    .toArray()

  await db.transaction(
    'rw',
    db.outfits,
    db.spaceOutfits,
    async () => {
      await db.outfits.delete(id)

      if (relationships.length > 0) {
        await db.spaceOutfits.bulkDelete(
          relationships.map((relationship) => relationship.id),
        )
      }
    },
  )

  for (const relationship of relationships) {
    await addSyncOperation({
      userId: outfit.userId,
      entity: 'spaceOutfit',
      entityId: relationship.id,
      operation: 'delete',
    })
  }

  await addSyncOperation({
    userId: outfit.userId,
    entity: 'outfit',
    entityId: outfit.id,
    operation: 'delete',
  })
}