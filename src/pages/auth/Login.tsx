import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

import { useAuth } from '../../features/authentication/useAuth'

export default function Login() {
  const navigate = useNavigate()
  const { signIn } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault()

    setError('')
    setLoading(true)

    const { error } = await signIn(
      email,
      password,
    )

    setLoading(false)

    if (error) {
      setError(error.message)
      return
    }

    navigate('/')
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#faf9f7] px-5 py-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="mb-8 text-center">
          <div className="mb-4 text-5xl">👗</div>

          <h1 className="text-4xl font-bold">
            EyeDrope
          </h1>

          <p className="mt-2 text-gray-500">
            Your wardrobe. Your canvas. Your style.
          </p>
        </div>

        <div className="rounded-3xl bg-white p-7 shadow-sm">
          <h2 className="text-2xl font-semibold">
            Welcome back
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Sign in to continue styling.
          </p>

          <form
            onSubmit={handleSubmit}
            className="mt-7 space-y-5"
          >
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium"
              >
                Email
              </label>

              <input
                id="email"
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
                htmlFor="password"
                className="mb-2 block text-sm font-medium"
              >
                Password
              </label>

              <input
                id="password"
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

            {error && (
              <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-[#252525] px-5 py-3 font-medium text-white transition hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading
                ? 'Signing in...'
                : 'Sign In'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            Don't have an account?{' '}
            <Link
              to="/signup"
              className="font-medium text-[#252525] underline"
            >
              Create one
            </Link>
          </p>
        </div>
      </motion.div>
    </main>
  )
}