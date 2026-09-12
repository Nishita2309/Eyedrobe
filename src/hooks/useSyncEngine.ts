import { useEffect, useRef } from 'react'

import { processSyncQueue } from '../services/syncService'
import { useOnlineStatus } from './useOnlineStatus'

export function useSyncEngine(
  userId: string | undefined,
) {
  const isOnline = useOnlineStatus()
  const isSyncingRef = useRef(false)

  useEffect(() => {
    if (!userId || !isOnline) {
      return
    }

    const currentUserId = userId
    let cancelled = false

    async function sync() {
      if (isSyncingRef.current || cancelled) {
        return
      }

      isSyncingRef.current = true

      try {
        await processSyncQueue(currentUserId)
      } catch (error) {
        console.error(
          'Sync engine failed:',
          error,
        )
      } finally {
        isSyncingRef.current = false
      }
    }

    void sync()

    const interval = window.setInterval(() => {
      void sync()
    }, 10000)

    return () => {
      cancelled = true
      window.clearInterval(interval)
    }
  }, [userId, isOnline])
}