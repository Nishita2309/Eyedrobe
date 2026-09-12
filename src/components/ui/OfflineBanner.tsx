import { useOnlineStatus } from '../../hooks/useOnlineStatus'

export default function OfflineBanner() {
  const isOnline =
    useOnlineStatus()

  if (isOnline) {
    return null
  }

  return (
    <div className="fixed left-0 right-0 top-0 z-[100] border-b border-[#e8d8b8] bg-[#fff8e8] px-4 py-2.5 text-center text-sm font-medium text-[#6f5a32] shadow-sm">
      <div className="flex items-center justify-center gap-2">
        <span
          className="h-2 w-2 rounded-full bg-[#c99a3d]"
          aria-hidden="true"
        />

        <span>
          You're offline. Your changes
          are being saved on this device.
        </span>
      </div>
    </div>
  )
}