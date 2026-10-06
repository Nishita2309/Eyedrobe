import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'

import { supabase } from '../../lib/supabase/client'
import { useAuth } from '../../features/authentication/useAuth'

function UserIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8" />
    </svg>
  )
}

function MailIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  )
}

function ArrowLeftIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path d="M19 12H5" />
      <path d="m11 18-6-6 6-6" />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path d="m5 12 4 4L19 6" />
    </svg>
  )
}

export default function ProfileInformation() {
  const { user } = useAuth()

const [displayName, setDisplayName] = useState(
  () =>
    typeof user?.user_metadata?.display_name ===
    'string'
      ? user.user_metadata.display_name
      : '',
)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault()

    if (saving) return

    const trimmedName = displayName.trim()

    if (!trimmedName) {
      setError('Please enter a display name.')
      setSaved(false)
      return
    }

    if (trimmedName.length > 50) {
      setError(
        'Display name must be 50 characters or less.',
      )
      setSaved(false)
      return
    }

    setError('')
    setSaved(false)
    setSaving(true)

    try {
      const { error: updateError } =
        await supabase.auth.updateUser({
          data: {
            display_name: trimmedName,
          },
        })

      if (updateError) {
        throw updateError
      }

      setDisplayName(trimmedName)
      setSaved(true)
    } catch (error) {
      console.error(
        'Failed to update profile:',
        error,
      )

      setError(
        error instanceof Error
          ? error.message
          : 'Failed to update your profile. Please try again.',
      )
    } finally {
      setSaving(false)
    }
  }

  if (!user) {
    return null
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-emerald-300 via-yellow-200 via-30% to-fuchsia-400 text-black">
      {/* Background decoration */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-cyan-300/70 blur-3xl"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-40 -right-32 h-[30rem] w-[30rem] rounded-full bg-purple-400/60 blur-3xl"
      />

      <div className="relative z-10 mx-auto max-w-3xl px-4 py-6 sm:px-6 sm:py-10">
        {/* Header */}
        <header className="flex items-center justify-between">
          <Link
            to="/profile"
            className="inline-flex items-center gap-2 rounded-full border-2 border-black bg-white px-4 py-2.5 text-sm font-black shadow-[3px_3px_0px_#000] transition hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_#000]"
          >
            <ArrowLeftIcon />
            Profile
          </Link>

          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border-3 border-black bg-white shadow-[3px_3px_0px_#000]">
            <img
              src="/images/eyedrobe-logo.png"
              alt="EyeDrope"
              className="h-9 w-9 object-contain"
            />
          </div>
        </header>

        {/* Heading */}
        <section className="mt-8">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-black/55">
            Account
          </p>

          <h1 className="mt-2 text-4xl font-black tracking-tight sm:text-5xl">
            Profile information
          </h1>

          <p className="mt-2 text-sm font-medium text-black/60 sm:text-base">
            Update the information shown on your
            EyeDrope profile.
          </p>
        </section>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="mt-7 rounded-[2rem] border-4 border-black bg-white p-5 shadow-[7px_7px_0px_#000] sm:p-7"
        >
          {/* Display name */}
          <div>
            <label
              htmlFor="displayName"
              className="mb-2 block text-sm font-black"
            >
              Display name
            </label>

            <div className="relative">
              <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-black/50">
                <UserIcon />
              </div>

              <input
                id="displayName"
                type="text"
                value={displayName}
                onChange={(event) => {
                  setDisplayName(event.target.value)
                  setSaved(false)
                  setError('')
                }}
                placeholder="Enter your name"
                maxLength={50}
                autoComplete="name"
                className="w-full rounded-2xl border-2 border-black bg-white py-3.5 pl-12 pr-4 text-sm font-semibold outline-none transition placeholder:text-black/35 focus:bg-[#fffdf2] focus:ring-4 focus:ring-pink-200"
              />
            </div>

            <p className="mt-2 text-xs font-medium text-black/45">
              This name will appear on your EyeDrope
              profile and home page.
            </p>
          </div>

          {/* Email */}
          <div className="mt-6">
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-black"
            >
              Email address
            </label>

            <div className="relative">
              <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-black/50">
                <MailIcon />
              </div>

              <input
                id="email"
                type="email"
                value={user.email ?? ''}
                readOnly
                className="w-full rounded-2xl border-2 border-black/20 bg-gray-100 py-3.5 pl-12 pr-4 text-sm font-semibold text-black/55 outline-none"
              />
            </div>

            <p className="mt-2 text-xs font-medium text-black/45">
              Email changes will be handled separately
              through account security.
            </p>
          </div>

          {/* Provider */}
          <div className="mt-6 rounded-2xl border-2 border-black/10 bg-[#f7f5f2] p-4">
            <p className="text-xs font-black uppercase tracking-wider text-black/45">
              Sign-in method
            </p>

            <p className="mt-1 text-sm font-bold">
              {user.app_metadata?.provider ===
              'google'
                ? 'Google'
                : 'Email'}
            </p>
          </div>

          {/* Error */}
          {error && (
            <div
              role="alert"
              className="mt-5 rounded-2xl border-2 border-red-300 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700"
            >
              {error}
            </div>
          )}

          {/* Success */}
          {saved && (
            <div
              role="status"
              className="mt-5 flex items-center gap-2 rounded-2xl border-2 border-emerald-400 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700"
            >
              <CheckIcon />
              Profile updated successfully.
            </div>
          )}

          {/* Save */}
          <button
            type="submit"
            disabled={saving}
            className="mt-6 w-full rounded-2xl border-2 border-black bg-gradient-to-r from-pink-400 via-orange-300 to-yellow-300 px-5 py-3.5 text-sm font-black shadow-[4px_4px_0px_#000] transition hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_#000] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving
              ? 'Saving changes...'
              : 'Save changes'}
          </button>
        </form>
      </div>
    </main>
  )
}