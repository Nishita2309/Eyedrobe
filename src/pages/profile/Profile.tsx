import { useState } from 'react'
import { Link } from 'react-router-dom'

import { useAuth } from '../../features/authentication/useAuth'

function UserIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="h-7 w-7"
      aria-hidden="true"
    >
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8" />
    </svg>
  )
}

function ChevronIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  )
}

function UserCircleIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="h-6 w-6"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="9" r="3" />
      <path d="M6.8 18c1.3-2.1 3.1-3.2 5.2-3.2s3.9 1.1 5.2 3.2" />
    </svg>
  )
}

function ShieldIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="h-6 w-6"
      aria-hidden="true"
    >
      <path d="M12 3 20 6v5c0 5-3.4 8.8-8 10-4.6-1.2-8-5-8-10V6l8-3Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  )
}

function PaletteIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="h-6 w-6"
      aria-hidden="true"
    >
      <path d="M12 3a9 9 0 1 0 0 18h1.5a2 2 0 0 0 0-4H12a2 2 0 0 1 0-4h4a5 5 0 0 0 0-10h-4Z" />
      <circle cx="7.5" cy="10" r="1" />
      <circle cx="10" cy="6.5" r="1" />
      <circle cx="14" cy="6.5" r="1" />
    </svg>
  )
}

function BellIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="h-6 w-6"
      aria-hidden="true"
    >
      <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
      <path d="M10 21h4" />
    </svg>
  )
}

function DatabaseIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="h-6 w-6"
      aria-hidden="true"
    >
      <ellipse cx="12" cy="5" rx="8" ry="3" />
      <path d="M4 5v7c0 1.7 3.6 3 8 3s8-1.3 8-3V5" />
      <path d="M4 12v7c0 1.7 3.6 3 8 3s8-1.3 8-3v-7" />
    </svg>
  )
}

function LogoutIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path d="M10 17l5-5-5-5" />
      <path d="M15 12H3" />
      <path d="M21 3v18" />
    </svg>
  )
}

export default function Profile() {
  const { user, signOut } = useAuth()

  const [loggingOut, setLoggingOut] =
    useState(false)

  const username =
    user?.email?.split('@')[0] || 'Fashion lover'

  const email = user?.email || 'No email available'

  async function handleLogout() {
    if (loggingOut) return

    try {
      setLoggingOut(true)
      await signOut()
    } catch (error) {
      console.error(
        'Failed to log out:',
        error,
      )
      setLoggingOut(false)
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-emerald-300 via-yellow-200 via-30% to-fuchsia-400 text-black">
      {/* Decorative background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-cyan-300/70 blur-3xl"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-40 -right-32 h-[30rem] w-[30rem] rounded-full bg-purple-400/60 blur-3xl"
      />

      <div className="relative z-10 mx-auto max-w-4xl px-4 py-6 sm:px-6 sm:py-10">
        {/* Header */}
        <header className="flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-full border-2 border-black bg-white px-4 py-2.5 text-sm font-black shadow-[3px_3px_0px_#000] transition hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_#000]"
          >
            <span aria-hidden="true">←</span>
            Home
          </Link>

          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border-3 border-black bg-white shadow-[3px_3px_0px_#000]">
            <img
              src="/images/eyedrobe-logo.png"
              alt="EyeDrope"
              className="h-9 w-9 object-contain"
            />
          </div>
        </header>

        {/* Title */}
        <section className="mt-8">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-black/55">
            Account
          </p>

          <h1 className="mt-2 text-4xl font-black tracking-tight sm:text-5xl">
            Profile
          </h1>

          <p className="mt-2 max-w-xl text-sm font-medium text-black/60 sm:text-base">
            Manage your EyeDrope account and
            preferences.
          </p>
        </section>

        {/* Profile card */}
        <section className="mt-7 rounded-[2rem] border-4 border-black bg-white p-5 shadow-[7px_7px_0px_#000] sm:p-7">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-[1.5rem] border-3 border-black bg-gradient-to-br from-pink-300 via-orange-200 to-yellow-200 shadow-[4px_4px_0px_#000]">
              <UserIcon />
            </div>

            <div className="min-w-0">
              <p className="text-2xl font-black tracking-tight">
                {username}
              </p>

              <p className="mt-1 truncate text-sm font-medium text-black/55">
                {email}
              </p>
            </div>
          </div>
        </section>

        {/* Account */}
        <SettingsSection title="Account">
          <SettingsRow
            icon={<UserCircleIcon />}
            title="Profile information"
            description="Manage your name and account details."
            background="bg-[#c9f5df]"
          />

          <Link
  to="/profile/security"
  className="block"
>
  <SettingsRow
    icon={<ShieldIcon />}
    title="Account & security"
    description="Manage authentication and account security."
    background="bg-[#ddd0ff]"
  />
</Link>
        </SettingsSection>

        {/* Preferences */}
        <SettingsSection title="Preferences">
          <Link
  to="/profile/appearance"
  className="block"
>
  <SettingsRow
    icon={<PaletteIcon />}
    title="Appearance"
    description="Customize how EyeDrope looks."
    background="bg-[#ffd1e3]"
  />
</Link>
          <SettingsRow
            icon={<BellIcon />}
            title="Notifications"
            description="Control your notification preferences."
            background="bg-[#ffe4a8]"
          />
        </SettingsSection>

        {/* Data */}
        <SettingsSection title="Data">
          <Link
  to="/profile/information"
  className="block"
>
  <SettingsRow
    icon={<UserCircleIcon />}
    title="Profile information"
    description="Manage your name and account details."
    background="bg-[#c9f5df]"
  />
</Link>
        </SettingsSection>
        <SettingsSection title="Data">
  <SettingsRow
    icon={<DatabaseIcon />}
    title="Your data"
    description="Manage your wardrobe and stored data."
    background="bg-[#cfe8ff]"
  />
</SettingsSection>

        {/* Logout */}
        <section className="mt-7">
          <button
            type="button"
            onClick={() => void handleLogout()}
            disabled={loggingOut}
            className="flex w-full items-center justify-center gap-3 rounded-[1.5rem] border-3 border-black bg-white px-5 py-4 text-sm font-black text-red-600 shadow-[4px_4px_0px_#000] transition hover:-translate-y-0.5 hover:bg-red-50 hover:shadow-[6px_6px_0px_#000] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <LogoutIcon />

            {loggingOut
              ? 'Logging out...'
              : 'Log out'}
          </button>
        </section>

        <p className="mt-7 text-center text-xs font-medium text-black/40">
          EyeDrope · Your wardrobe. Your canvas.
          Your style.
        </p>
      </div>
    </main>
  )
}

function SettingsSection({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="mt-8">
      <h2 className="mb-3 px-1 text-xs font-black uppercase tracking-[0.2em] text-black/50">
        {title}
      </h2>

      <div className="overflow-hidden rounded-[1.75rem] border-4 border-black bg-white shadow-[5px_5px_0px_#000]">
        {children}
      </div>
    </section>
  )
}

function SettingsRow({
  icon,
  title,
  description,
  background,
}: {
  icon: React.ReactNode
  title: string
  description: string
  background: string
}) {
  return (
    <button
      type="button"
      className="group flex w-full items-center gap-4 border-b-2 border-black/10 p-4 text-left transition last:border-b-0 hover:bg-black/[0.025] sm:p-5"
    >
      <div
        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border-2 border-black ${background} transition group-hover:-rotate-3 group-hover:scale-105`}
      >
        {icon}
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-black sm:text-base">
          {title}
        </p>

        <p className="mt-1 text-xs font-medium leading-5 text-black/50 sm:text-sm">
          {description}
        </p>
      </div>

      <ChevronIcon />
    </button>
  )
}