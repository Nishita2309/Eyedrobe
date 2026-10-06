import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'

import { supabase } from '../../lib/supabase/client'
import { useAuth } from '../../features/authentication/useAuth'

function LockIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <rect
        x="5"
        y="10"
        width="14"
        height="11"
        rx="2"
      />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
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
      <rect
        x="3"
        y="5"
        width="18"
        height="14"
        rx="2"
      />
      <path d="m3 7 9 6 9-6" />
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

export default function AccountSecurity() {
  const { user } = useAuth()

  const provider =
    user?.app_metadata?.provider === 'google'
      ? 'Google'
      : 'Email and password'

  const isEmailAccount =
    user?.app_metadata?.provider !== 'google'

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] =
    useState('')

  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  async function handlePasswordChange(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault()

    if (saving) return

    setError('')
    setSaved(false)

    if (password.length < 6) {
      setError(
        'Password must be at least 6 characters long.',
      )
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setSaving(true)

    try {
      const { error: updateError } =
        await supabase.auth.updateUser({
          password,
        })

      if (updateError) {
        throw updateError
      }

      setPassword('')
      setConfirmPassword('')
      setSaved(true)
    } catch (error) {
      console.error(
        'Failed to update password:',
        error,
      )

      setError(
        error instanceof Error
          ? error.message
          : 'Failed to update your password. Please try again.',
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
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-cyan-300/70 blur-3xl"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-40 -right-32 h-[30rem] w-[30rem] rounded-full bg-purple-400/60 blur-3xl"
      />

      <div className="relative z-10 mx-auto max-w-3xl px-4 py-6 sm:px-6 sm:py-10">
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

        <section className="mt-8">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-black/55">
            Account
          </p>

          <h1 className="mt-2 text-4xl font-black tracking-tight sm:text-5xl">
            Account & security
          </h1>

          <p className="mt-2 text-sm font-medium text-black/60 sm:text-base">
            Manage how you sign in to EyeDrope.
          </p>
        </section>

        {/* Current account */}
        <section className="mt-7 rounded-[2rem] border-4 border-black bg-white p-5 shadow-[7px_7px_0px_#000] sm:p-7">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border-2 border-black bg-[#ddd0ff]">
              <ShieldIcon />
            </div>

            <div className="min-w-0">
              <p className="text-xs font-black uppercase tracking-wider text-black/45">
                Sign-in method
              </p>

              <p className="mt-1 text-lg font-black">
                {provider}
              </p>

              <p className="mt-1 break-all text-sm font-medium text-black/50">
                {user.email}
              </p>
            </div>
          </div>
        </section>

        {/* Password */}
        {isEmailAccount && (
          <form
            onSubmit={handlePasswordChange}
            className="mt-7 rounded-[2rem] border-4 border-black bg-white p-5 shadow-[7px_7px_0px_#000] sm:p-7"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border-2 border-black bg-[#c9f5df]">
                <LockIcon />
              </div>

              <div>
                <h2 className="text-xl font-black">
                  Change password
                </h2>

                <p className="text-sm font-medium text-black/50">
                  Choose a new password for your account.
                </p>
              </div>
            </div>

            <div className="mt-6">
              <label
                htmlFor="newPassword"
                className="mb-2 block text-sm font-black"
              >
                New password
              </label>

              <input
                id="newPassword"
                type="password"
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value)
                  setError('')
                  setSaved(false)
                }}
                placeholder="Enter a new password"
                autoComplete="new-password"
                minLength={6}
                required
                className="w-full rounded-2xl border-2 border-black px-4 py-3.5 text-sm font-semibold outline-none transition placeholder:text-black/35 focus:bg-[#fffdf2] focus:ring-4 focus:ring-pink-200"
              />
            </div>

            <div className="mt-4">
              <label
                htmlFor="confirmPassword"
                className="mb-2 block text-sm font-black"
              >
                Confirm new password
              </label>

              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(event) => {
                  setConfirmPassword(
                    event.target.value,
                  )
                  setError('')
                  setSaved(false)
                }}
                placeholder="Confirm your new password"
                autoComplete="new-password"
                minLength={6}
                required
                className="w-full rounded-2xl border-2 border-black px-4 py-3.5 text-sm font-semibold outline-none transition placeholder:text-black/35 focus:bg-[#fffdf2] focus:ring-4 focus:ring-pink-200"
              />
            </div>

            {error && (
              <div
                role="alert"
                className="mt-5 rounded-2xl border-2 border-red-300 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700"
              >
                {error}
              </div>
            )}

            {saved && (
              <div
                role="status"
                className="mt-5 flex items-center gap-2 rounded-2xl border-2 border-emerald-400 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700"
              >
                <CheckIcon />
                Password updated successfully.
              </div>
            )}

            <button
              type="submit"
              disabled={saving}
              className="mt-6 w-full rounded-2xl border-2 border-black bg-gradient-to-r from-pink-400 via-orange-300 to-yellow-300 px-5 py-3.5 text-sm font-black shadow-[4px_4px_0px_#000] transition hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_#000] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving
                ? 'Updating password...'
                : 'Update password'}
            </button>
          </form>
        )}

        {/* Google information */}
        {!isEmailAccount && (
          <section className="mt-7 rounded-[2rem] border-4 border-black bg-white p-5 shadow-[7px_7px_0px_#000] sm:p-7">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border-2 border-black bg-[#ffe4a8]">
                <MailIcon />
              </div>

              <div>
                <h2 className="text-xl font-black">
                  Google account
                </h2>

                <p className="mt-1 text-sm font-medium leading-6 text-black/55">
                  Your EyeDrope account is connected
                  through Google. Password management is
                  handled by Google.
                </p>
              </div>
            </div>
          </section>
        )}

        <p className="mt-7 text-center text-xs font-medium text-black/40">
          Keep your account secure and never share
          your password.
        </p>
      </div>
    </main>
  )
}