import Dexie, {
  type Table,
} from 'dexie'

import type { ClothingItem } from '../../types/clothing'
import type { Outfit } from '../../types/outfit'
import type {
  Space,
  SpaceOutfit,
} from '../../types/space'

export type SyncOperation =
  | 'create'
  | 'update'
  | 'delete'

export type SyncEntity =
  | 'clothing'
  | 'outfit'
  | 'outfitItem'
  | 'space'
  | 'spaceOutfit'

export interface SyncQueueItem {
  id: string
  userId: string
  entity: SyncEntity
  entityId: string
  operation: SyncOperation
  payload?: unknown
  createdAt: number
  attempts: number
  lastAttemptAt?: number
  error?: string
}

export class EyeDropeDatabase
  extends Dexie
{
  clothing!: Table<
    ClothingItem,
    string
  >

  outfits!: Table<
    Outfit,
    string
  >

  spaces!: Table<
    Space,
    string
  >

  spaceOutfits!: Table<
    SpaceOutfit,
    string
  >

  syncQueue!: Table<
    SyncQueueItem,
    string
  >

  constructor() {
    super('EyeDropeDatabase')

    this.version(1).stores({
      clothing:
        'id, userId, category, createdAt',
    })

    this.version(2).stores({
      clothing:
        'id, userId, category, createdAt',

      outfits:
        'id, userId, createdAt, updatedAt',
    })

    this.version(3).stores({
      clothing:
        'id, userId, category, createdAt',

      outfits:
        'id, userId, createdAt, updatedAt',

      spaces:
        'id, userId, createdAt, updatedAt',

      spaceOutfits:
        'id, spaceId, outfitId, createdAt',
    })

    this.version(4).stores({
      clothing:
        'id, userId, category, createdAt',

      outfits:
        'id, userId, createdAt, updatedAt',

      spaces:
        'id, userId, createdAt, updatedAt',

      spaceOutfits:
        'id, spaceId, outfitId, createdAt',

      syncQueue:
        'id, userId, entity, entityId, operation, createdAt',
    })
  }
}

export const db =
  new EyeDropeDatabase()