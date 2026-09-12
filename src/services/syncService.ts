import { supabase } from '../lib/supabase/client'
import {
  getSyncQueue,
  markSyncOperationAttempt,
  removeSyncOperation,
} from './syncQueueService'
import type { SyncQueueItem } from '../lib/database/db'
import type { Outfit } from '../types/outfit'

function toIsoTimestamp(timestamp: number): string {
  return new Date(timestamp).toISOString()
}

async function syncClothingItem(
  operation: SyncQueueItem,
): Promise<void> {
  if (operation.operation === 'delete') {
    const { error } = await supabase
      .from('clothing_items')
      .delete()
      .eq('id', operation.entityId)
      .eq('user_id', operation.userId)

    if (error) throw error
    return
  }

  const payload = operation.payload as {
    id: string
    userId: string
    name: string
    category: string
    color: string
    pattern: string
    notes: string
    image: string
    createdAt: number
    updatedAt?: number
  }

  const { error } = await supabase
    .from('clothing_items')
    .upsert({
      id: payload.id,
      user_id: payload.userId,
      name: payload.name,
      category: payload.category,
      color: payload.color,
      pattern: payload.pattern,
      notes: payload.notes,
      image_url: payload.image,
      created_at: toIsoTimestamp(payload.createdAt),
      updated_at: toIsoTimestamp(
        payload.updatedAt ?? payload.createdAt,
      ),
    })

  if (error) throw error
}

async function syncOutfit(
  operation: SyncQueueItem,
): Promise<void> {
  if (operation.operation === 'delete') {
    const { error: itemError } = await supabase
      .from('outfit_items')
      .delete()
      .eq('outfit_id', operation.entityId)

    if (itemError) throw itemError

    const { error } = await supabase
      .from('outfits')
      .delete()
      .eq('id', operation.entityId)
      .eq('user_id', operation.userId)

    if (error) throw error
    return
  }

  const payload = operation.payload as Outfit

  const { error: outfitError } = await supabase
    .from('outfits')
    .upsert({
      id: payload.id,
      user_id: payload.userId,
      name: payload.name,
      created_at: toIsoTimestamp(payload.createdAt),
      updated_at: toIsoTimestamp(payload.updatedAt),
    })

  if (outfitError) throw outfitError

  const { error: deleteItemsError } = await supabase
    .from('outfit_items')
    .delete()
    .eq('outfit_id', payload.id)

  if (deleteItemsError) throw deleteItemsError

  if (payload.items.length === 0) return

  const outfitItems = payload.items.map((item) => ({
    id: item.id,
    outfit_id: payload.id,
    clothing_id: item.clothingId,
    x: item.x,
    y: item.y,
    width: item.width,
    height: item.height,
    rotation: item.rotation,
    z_index: item.zIndex,
  }))

  const { error: itemsError } = await supabase
    .from('outfit_items')
    .insert(outfitItems)

  if (itemsError) throw itemsError
}

async function syncSpace(
  operation: SyncQueueItem,
): Promise<void> {
  if (operation.operation === 'delete') {
    const { error } = await supabase
      .from('spaces')
      .delete()
      .eq('id', operation.entityId)
      .eq('user_id', operation.userId)

    if (error) throw error
    return
  }

  const payload = operation.payload as {
    id: string
    userId: string
    name: string
    description: string
    createdAt: number
    updatedAt: number
  }

  const { error } = await supabase
    .from('spaces')
    .upsert({
      id: payload.id,
      user_id: payload.userId,
      name: payload.name,
      description: payload.description,
      created_at: toIsoTimestamp(payload.createdAt),
      updated_at: toIsoTimestamp(payload.updatedAt),
    })

  if (error) throw error
}

async function syncSpaceOutfit(
  operation: SyncQueueItem,
): Promise<void> {
  if (operation.operation === 'delete') {
    const { error } = await supabase
      .from('space_outfits')
      .delete()
      .eq('id', operation.entityId)

    if (error) throw error
    return
  }

  const payload = operation.payload as {
    id: string
    spaceId: string
    outfitId: string
    createdAt: number
  }

  const { error } = await supabase
    .from('space_outfits')
    .upsert({
      id: payload.id,
      space_id: payload.spaceId,
      outfit_id: payload.outfitId,
      created_at: toIsoTimestamp(payload.createdAt),
    })

  if (error) throw error
}

async function syncOperation(
  operation: SyncQueueItem,
): Promise<void> {
  switch (operation.entity) {
    case 'clothing':
      await syncClothingItem(operation)
      break

    case 'outfit':
      await syncOutfit(operation)
      break

    case 'space':
      await syncSpace(operation)
      break

    case 'spaceOutfit':
      await syncSpaceOutfit(operation)
      break

    default:
      throw new Error(
        `Unsupported sync entity: ${operation.entity}`,
      )
  }
}

export async function processSyncQueue(
  userId: string,
): Promise<boolean> {
  const operations = await getSyncQueue(userId)

  if (operations.length === 0) {
    return true
  }

  let allSucceeded = true

  for (const operation of operations) {
    try {
      await syncOperation(operation)
      await removeSyncOperation(operation.id)
    } catch (error) {
      allSucceeded = false

      const message =
        error instanceof Error
          ? error.message
          : 'Unknown sync error'

      await markSyncOperationAttempt(
        operation.id,
        message,
      )

      console.error(
        'Failed to sync operation:',
        operation,
        error,
      )
    }
  }

  return allSucceeded
}