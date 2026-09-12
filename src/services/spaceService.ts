import { db } from '../lib/database/db'
import type { Space, SpaceOutfit } from '../types/space'
import { addSyncOperation } from './syncQueueService'

export async function getSpaces(userId: string): Promise<Space[]> {
  return db.spaces
    .where('userId')
    .equals(userId)
    .reverse()
    .sortBy('updatedAt')
}

export async function getSpace(id: string): Promise<Space | undefined> {
  return db.spaces.get(id)
}

export async function createSpace(space: Space): Promise<void> {
  await db.spaces.add(space)

  await addSyncOperation({
    userId: space.userId,
    entity: 'space',
    entityId: space.id,
    operation: 'create',
    payload: space,
  })
}

export async function updateSpace(space: Space): Promise<void> {
  await db.spaces.put(space)

  await addSyncOperation({
    userId: space.userId,
    entity: 'space',
    entityId: space.id,
    operation: 'update',
    payload: space,
  })
}

export async function deleteSpace(id: string): Promise<void> {
  const space = await db.spaces.get(id)

  if (!space) {
    return
  }

  await db.spaces.delete(id)

  const relationships = await db.spaceOutfits
    .where('spaceId')
    .equals(id)
    .toArray()

  if (relationships.length > 0) {
    await db.spaceOutfits.bulkDelete(
      relationships.map((relationship) => relationship.id),
    )
  }

  await addSyncOperation({
    userId: space.userId,
    entity: 'space',
    entityId: space.id,
    operation: 'delete',
  })
}

export async function getSpaceOutfits(
  spaceId: string,
): Promise<SpaceOutfit[]> {
  return db.spaceOutfits
    .where('spaceId')
    .equals(spaceId)
    .sortBy('createdAt')
}

export async function addOutfitToSpace(
  spaceOutfit: SpaceOutfit,
): Promise<void> {
  // Prevent the same outfit from being added to the same Space twice.
  const existingRelationship = await db.spaceOutfits
    .where('spaceId')
    .equals(spaceOutfit.spaceId)
    .filter((relationship) => relationship.outfitId === spaceOutfit.outfitId)
    .first()

  if (existingRelationship) {
    return
  }

  await db.spaceOutfits.add(spaceOutfit)

  const space = await db.spaces.get(spaceOutfit.spaceId)

  if (!space) {
    return
  }

  await addSyncOperation({
    userId: space.userId,
    entity: 'spaceOutfit',
    entityId: spaceOutfit.id,
    operation: 'create',
    payload: spaceOutfit,
  })
}

export async function removeOutfitFromSpace(
  spaceId: string,
  outfitId: string,
): Promise<void> {
  const relationship = await db.spaceOutfits
    .where('spaceId')
    .equals(spaceId)
    .filter((item) => item.outfitId === outfitId)
    .first()

  if (!relationship) {
    return
  }

  const space = await db.spaces.get(spaceId)

  await db.spaceOutfits.delete(relationship.id)

  if (!space) {
    return
  }

  await addSyncOperation({
    userId: space.userId,
    entity: 'spaceOutfit',
    entityId: relationship.id,
    operation: 'delete',
  })
}