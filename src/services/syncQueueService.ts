import { db } from '../lib/database/db'
import type {
  SyncEntity,
  SyncOperation,
  SyncQueueItem,
} from '../lib/database/db'

export interface AddSyncOperationInput {
  userId: string
  entity: SyncEntity
  entityId: string
  operation: SyncOperation
  payload?: unknown
}

export async function addSyncOperation(
  input: AddSyncOperationInput,
): Promise<void> {
  const existingOperations = await db.syncQueue
    .where('userId')
    .equals(input.userId)
    .filter(
      (operation) =>
        operation.entity === input.entity &&
        operation.entityId === input.entityId,
    )
    .toArray()

  const latestOperation = existingOperations
    .sort((a, b) => b.createdAt - a.createdAt)[0]

  /*
   * If the item was created locally and then deleted
   * before synchronization, there is nothing to send
   * to the cloud.
   */
  if (
    latestOperation?.operation === 'create' &&
    input.operation === 'delete'
  ) {
    await db.syncQueue.bulkDelete(
      existingOperations.map((operation) => operation.id),
    )
    return
  }

  /*
   * A create followed by an update is still just a create,
   * but we keep the newest payload.
   */
  if (
    latestOperation?.operation === 'create' &&
    input.operation === 'update'
  ) {
    await db.syncQueue.bulkDelete(
      existingOperations.map((operation) => operation.id),
    )

    await db.syncQueue.add({
      id: crypto.randomUUID(),
      userId: input.userId,
      entity: input.entity,
      entityId: input.entityId,
      operation: 'create',
      payload: input.payload,
      createdAt: Date.now(),
      attempts: 0,
    })

    return
  }

  /*
   * Multiple updates can be reduced to the newest update.
   */
  if (
    latestOperation &&
    latestOperation.operation === 'update' &&
    input.operation === 'update'
  ) {
    await db.syncQueue.bulkDelete(
      existingOperations.map((operation) => operation.id),
    )

    await db.syncQueue.add({
      id: crypto.randomUUID(),
      userId: input.userId,
      entity: input.entity,
      entityId: input.entityId,
      operation: 'update',
      payload: input.payload,
      createdAt: Date.now(),
      attempts: 0,
    })

    return
  }

  /*
   * If an item is updated and then deleted,
   * only the delete needs to reach the cloud.
   */
  if (
    latestOperation &&
    latestOperation.operation !== 'delete' &&
    input.operation === 'delete'
  ) {
    await db.syncQueue.bulkDelete(
      existingOperations.map((operation) => operation.id),
    )

    await db.syncQueue.add({
      id: crypto.randomUUID(),
      userId: input.userId,
      entity: input.entity,
      entityId: input.entityId,
      operation: 'delete',
      createdAt: Date.now(),
      attempts: 0,
    })

    return
  }

  /*
   * No compatible existing operation.
   * Add a normal queue entry.
   */
  const operation: SyncQueueItem = {
    id: crypto.randomUUID(),
    userId: input.userId,
    entity: input.entity,
    entityId: input.entityId,
    operation: input.operation,
    payload: input.payload,
    createdAt: Date.now(),
    attempts: 0,
  }

  await db.syncQueue.add(operation)
}

export async function getSyncQueue(
  userId: string,
): Promise<SyncQueueItem[]> {
  return db.syncQueue
    .where('userId')
    .equals(userId)
    .sortBy('createdAt')
}

export async function getPendingSyncCount(
  userId: string,
): Promise<number> {
  return db.syncQueue
    .where('userId')
    .equals(userId)
    .count()
}

export async function removeSyncOperation(
  id: string,
): Promise<void> {
  await db.syncQueue.delete(id)
}

export async function markSyncOperationAttempt(
  id: string,
  error?: string,
): Promise<void> {
  const operation = await db.syncQueue.get(id)

  if (!operation) return

  await db.syncQueue.update(id, {
    attempts: operation.attempts + 1,
    lastAttemptAt: Date.now(),
    error,
  })
}

export async function clearSyncQueue(
  userId: string,
): Promise<void> {
  const operations = await getSyncQueue(userId)

  if (operations.length === 0) return

  await db.syncQueue.bulkDelete(
    operations.map((operation) => operation.id),
  )
}