import { useEffect, useRef } from 'react'
import { pullCloudData } from '../services/cloudPullService'
import { processSyncQueue } from '../services/syncService'
import { useOnlineStatus } from './useOnlineStatus'

export function useCloudSync(
  userId: string | undefined,
): void {
  const isOnline = useOnlineStatus()
  const hasPulledRef = useRef(false)

  useEffect(() => {
    if (!userId || !isOnline) {
      return
    }

    const currentUserId = userId
    let cancelled = false

    async function initialSync() {
      try {
        const syncSucceeded =
          await processSyncQueue(currentUserId)

        if (cancelled || !syncSucceeded) {
          return
        }

        await pullCloudData(currentUserId)

        if (!cancelled) {
          hasPulledRef.current = true
        }
      } catch (error) {
        if (!cancelled) {
          console.error(
            'Initial cloud sync failed:',
            error,
          )
        }
      }
    }

    if (!hasPulledRef.current) {
      void initialSync()
    }

    const interval = window.setInterval(() => {
      void processSyncQueue(currentUserId).catch(
        (error) => {
          if (!cancelled) {
            console.error(
              'Cloud sync failed:',
              error,
            )
          }
        },
      )
    }, 5000)

    return () => {
      cancelled = true
      window.clearInterval(interval)
    }
  }, [userId, isOnline])
}