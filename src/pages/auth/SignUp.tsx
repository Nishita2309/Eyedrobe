import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

import { useAuth } from '../../features/authentication/useAuth'

export default function SignUp() {
  const navigate = useNavigate()
  const { signUp } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] =
    useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault()

    setError('')
    setMessage('')

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    if (password.length < 6) {
      setError(
        'Password must be at least 6 characters.',
      )
      return
    }

    setLoading(true)

    const { error } = await signUp(
      email,
      password,
    )

    setLoading(false)

    if (error) {
      setError(error.message)
      return
    }

    setMessage(
      'Account created! Check your email if confirmation is required.',
    )

    setTimeout(() => {
      navigate('/login')
    }, 1500)
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#faf9f7] px-5 py-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="mb-8 text-center">
          <div className="mb-4 text-5xl">✨</div>

          <h1 className="text-4xl font-bold">
            EyeDrope
          </h1>

          <p className="mt-2 text-gray-500">
            Create your personal styling space.
          </p>
        </div>

        <div className="rounded-3xl bg-white p-7 shadow-sm">
          <h2 className="text-2xl font-semibold">
            Create account
          </h2>

          <form
            onSubmit={handleSubmit}
            className="mt-7 space-y-5"
          >
            <div>
              <label
                htmlFor="signup-email"
                className="mb-2 block text-sm font-medium"
              >
                Email
              </label>

              <input
                id="signup-email"
                type="email"
                required
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                placeholder="you@example.com"
                className="w-full rounded-2xl border border-gray-200 bg-[#faf9f7] px-4 py-3 outline-none transition focus:border-gray-400"
              />
            </div>

            <div>
              <label
                htmlFor="signup-password"
                className="mb-2 block text-sm font-medium"
              >
                Password
              </label>

              <input
                id="signup-password"
                type="password"
                required
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                placeholder="••••••••"
                className="w-full rounded-2xl border border-gray-200 bg-[#faf9f7] px-4 py-3 outline-none transition focus:border-gray-400"
              />
            </div>

            <div>
              <label
                htmlFor="confirm-password"
                className="mb-2 block text-sm font-medium"
              >
                Confirm password
              </label>

              <input
                id="confirm-password"
                type="password"
                required
                value={confirmPassword}
                onChange={(event) =>
                  setConfirmPassword(
                    event.target.value,
                  )
                }
                placeholder="••••••••"
                className="w-full rounded-2xl border border-gray-200 bg-[#faf9f7] px-4 py-3 outline-none transition focus:border-gray-400"
              />
            </div>

            {error && (
              <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </p>
            )}

            {message && (
              <p className="rounded-xl bg-green-50 px-4 py-3 text-sm text-green-600">
                {message}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-[#252525] px-5 py-3 font-medium text-white transition hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-50"
            >
              {loading
                ? 'Creating account...'
                : 'Create Account'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-medium text-[#252525] underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </main>
  )
}