import { useSyncQueue } from '../../hooks/useSyncQueue'

interface SyncStatusProps {
  userId: string | undefined
}

export default function SyncStatus({
  userId,
}: SyncStatusProps) {
  const {
    pendingCount,
    isOnline,
  } = useSyncQueue(userId)

  if (!isOnline) {
    return (
      <div className="flex items-center gap-2 text-xs text-[#8a6b35]">
        <span
          className="h-2 w-2 rounded-full bg-[#c99a3d]"
          aria-hidden="true"
        />

        <span>
          Offline
          {pendingCount > 0
            ? ` • ${pendingCount} pending`
            : ''}
        </span>
      </div>
    )
  }

  if (pendingCount > 0) {
    return (
      <div className="flex items-center gap-2 text-xs text-[#777]">
        <span
          className="h-2 w-2 animate-pulse rounded-full bg-[#888]"
          aria-hidden="true"
        />

        <span>
          {pendingCount}{' '}
          {pendingCount === 1
            ? 'change'
            : 'changes'}{' '}
          waiting to sync
        </span>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2 text-xs text-[#777]">
      <span
        className="h-2 w-2 rounded-full bg-[#7caa83]"
        aria-hidden="true"
      />

      <span>Synced</span>
    </div>
  )
}