import { db } from '../lib/database/db'
import type { ClothingItem } from '../types/clothing'
import { addSyncOperation } from './syncQueueService'

export async function getClothingItems(
  userId: string,
): Promise<ClothingItem[]> {
  return db.clothing
    .where('userId')
    .equals(userId)
    .reverse()
    .sortBy('createdAt')
}

export async function getClothingItem(
  id: string,
): Promise<ClothingItem | undefined> {
  return db.clothing.get(id)
}

export async function addClothingItem(
  item: ClothingItem,
): Promise<void> {
  await db.clothing.add(item)

  await addSyncOperation({
    userId: item.userId,
    entity: 'clothing',
    entityId: item.id,
    operation: 'create',
    payload: item,
  })
}

export async function updateClothingItem(
  item: ClothingItem,
): Promise<void> {
  await db.clothing.put(item)

  await addSyncOperation({
    userId: item.userId,
    entity: 'clothing',
    entityId: item.id,
    operation: 'update',
    payload: item,
  })
}

export async function deleteClothingItem(
  id: string,
): Promise<void> {
  const item = await db.clothing.get(id)

  if (!item) {
    return
  }

  await db.clothing.delete(id)

  await addSyncOperation({
    userId: item.userId,
    entity: 'clothing',
    entityId: item.id,
    operation: 'delete',
  })
}