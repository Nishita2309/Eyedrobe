import { useEffect, useState } from 'react'

import { getPendingSyncCount } from '../services/syncQueueService'
import { useOnlineStatus } from './useOnlineStatus'

export function useSyncQueue(
  userId: string | undefined,
) {
  const isOnline = useOnlineStatus()
  const [pendingCount, setPendingCount] = useState(0)

  useEffect(() => {
    if (!userId) {
      return
    }

    const currentUserId = userId
    let cancelled = false

    async function loadPendingCount() {
      try {
        const count =
          await getPendingSyncCount(currentUserId)

        if (!cancelled) {
          setPendingCount(count)
        }
      } catch (error) {
        if (!cancelled) {
          console.error(
            'Failed to read sync queue:',
            error,
          )
        }
      }
    }

    void loadPendingCount()

    const interval = window.setInterval(
      () => {
        void loadPendingCount()
      },
      2000,
    )

    return () => {
      cancelled = true
      window.clearInterval(interval)
    }
  }, [userId, isOnline])

  return {
    pendingCount: userId ? pendingCount : 0,
    isOnline,
  }
}