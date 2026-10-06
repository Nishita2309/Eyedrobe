import {
  useState,
  type FormEvent,
  type ReactNode,
} from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

import { useAuth } from '../../features/authentication/useAuth'

function GoogleIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path
        fill="#4285F4"
        d="M21.35 12.27c0-.68-.06-1.35-.18-1.99H12v3.77h5.24a4.48 4.48 0 0 1-1.94 2.94v2.45h3.14c1.84-1.7 2.91-4.2 2.91-7.17Z"
      />
      <path
        fill="#34A853"
        d="M12 21.75c2.63 0 4.84-.87 6.46-2.35l-3.14-2.45c-.87.58-1.98.93-3.32.93-2.55 0-4.71-1.72-5.49-4.03H3.27v2.53A9.75 9.75 0 0 0 12 21.75Z"
      />
      <path
        fill="#FBBC05"
        d="M6.51 13.85A5.86 5.86 0 0 1 6.2 12c0-.64.11-1.26.31-1.85V7.62H3.27A9.75 9.75 0 0 0 2.25 12c0 1.57.38 3.06 1.02 4.38l3.24-2.53Z"
      />
      <path
        fill="#EA4335"
        d="M12 6.12c1.43 0 2.71.49 3.72 1.45l2.79-2.79C16.83 3.2 14.63 2.25 12 2.25a9.75 9.75 0 0 0-8.73 5.37l3.24 2.53C7.29 7.84 9.45 6.12 12 6.12Z"
      />
    </svg>
  )
}

function SocialButton({
  label,
  icon,
  onClick,
  loading = false,
}: {
  label: string
  icon: ReactNode
  onClick: () => void
  loading?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading}
      className="flex w-full items-center justify-center gap-3 rounded-2xl border-2 border-black bg-white px-5 py-3.5 text-sm font-bold text-black shadow-[3px_3px_0px_#000] transition hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_#000] disabled:cursor-not-allowed disabled:opacity-60"
    >
      {icon}

      <span>
        {loading ? 'Connecting...' : label}
      </span>
    </button>
  )
}

export default function SignUp() {
  const navigate = useNavigate()

  const {
    signUp,
    signInWithGoogle,
  } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] =
    useState('')

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] =
    useState(false)

  async function handleGoogleSignUp() {
    if (googleLoading) return

    setError('')
    setGoogleLoading(true)

    try {
      const { error: signInError } =
        await signInWithGoogle()

      if (signInError) {
        setError(signInError.message)
        setGoogleLoading(false)
      }
    } catch (error) {
      console.error(
        'Google sign-up failed:',
        error,
      )

      setError(
        'Unable to continue with Google. Please try again.',
      )

      setGoogleLoading(false)
    }
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault()

    if (loading) return

    setError('')

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    if (password.length < 6) {
      setError(
        'Password must be at least 6 characters long.',
      )
      return
    }

    setLoading(true)

    try {
      const { error: signUpError } = await signUp(
        email,
        password,
      )

      if (signUpError) {
        setError(signUpError.message)
        setLoading(false)
        return
      }

      navigate('/login')
    } catch (error) {
      console.error(
        'Email sign-up failed:',
        error,
      )

      setError(
        'Unable to create your account. Please try again.',
      )

      setLoading(false)
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-emerald-300 via-yellow-200 via-30% to-fuchsia-400 px-4 py-8 sm:px-6">
      {/* Decorative background shapes */}
      <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-cyan-300/70 blur-3xl" />

      <div className="pointer-events-none absolute -bottom-32 -right-20 h-96 w-96 rounded-full bg-purple-400/70 blur-3xl" />

      <div className="pointer-events-none absolute left-1/2 top-1/4 h-64 w-64 -translate-x-1/2 rounded-full bg-orange-300/50 blur-3xl" />

      <motion.div
        initial={{
          opacity: 0,
          y: 20,
          scale: 0.98,
        }}
        animate={{
          opacity: 1,
          y: 0,
          scale: 1,
        }}
        transition={{ duration: 0.45 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="rounded-[2rem] border-4 border-black bg-white p-6 shadow-[8px_8px_0px_#000] sm:p-8">
          {/* Logo */}
          <div className="flex justify-center">
            <img
              src="/images/eyedrobe-logo.png"
              alt="EyeDrope"
              className="h-24 w-24 object-contain sm:h-28 sm:w-28"
            />
          </div>

          {/* Heading */}
          <div className="mt-3 text-center">
            <h1 className="text-4xl font-black tracking-tight text-black sm:text-5xl">
              Create Account
            </h1>

            <p className="mt-2 text-sm font-medium text-gray-500">
              Start building your digital wardrobe.
            </p>
          </div>

          {/* Google */}
          <div className="mt-8">
            <SocialButton
              label="Continue with Google"
              icon={<GoogleIcon />}
              onClick={() =>
                void handleGoogleSignUp()
              }
              loading={googleLoading}
            />
          </div>

          {/* Divider */}
          <div className="my-6 flex items-center gap-4">
            <div className="h-px flex-1 bg-gray-300" />

            <span className="text-sm font-bold text-gray-500">
              or
            </span>

            <div className="h-px flex-1 bg-gray-300" />
          </div>

          {/* Email signup */}
          <form
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            <div>
              <label
                htmlFor="email"
                className="sr-only"
              >
                Email
              </label>

              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                placeholder="Enter your Mail"
                autoComplete="email"
                required
                className="w-full rounded-2xl border-2 border-black bg-white px-5 py-3.5 text-sm font-medium text-black outline-none transition placeholder:text-gray-400 focus:ring-4 focus:ring-pink-200"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="sr-only"
              >
                Password
              </label>

              <input
                id="password"
                type="password"
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                placeholder="Enter your Password"
                autoComplete="new-password"
                required
                className="w-full rounded-2xl border-2 border-black bg-white px-5 py-3.5 text-sm font-medium text-black outline-none transition placeholder:text-gray-400 focus:ring-4 focus:ring-pink-200"
              />
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="sr-only"
              >
                Confirm Password
              </label>

              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(event) =>
                  setConfirmPassword(
                    event.target.value,
                  )
                }
                placeholder="Confirm your Password"
                autoComplete="new-password"
                required
                className="w-full rounded-2xl border-2 border-black bg-white px-5 py-3.5 text-sm font-medium text-black outline-none transition placeholder:text-gray-400 focus:ring-4 focus:ring-pink-200"
              />
            </div>

            {error && (
              <div
                role="alert"
                className="rounded-2xl border-2 border-red-300 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl border-2 border-black bg-gradient-to-r from-pink-400 via-orange-300 to-yellow-300 px-5 py-3.5 text-sm font-black text-black shadow-[3px_3px_0px_#000] transition hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_#000] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading
                ? 'Creating Account...'
                : 'Create Account'}
            </button>
          </form>

          {/* Login */}
          <p className="mt-7 text-center text-sm font-medium text-gray-600">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-black text-black underline decoration-2 underline-offset-4 transition hover:text-pink-600"
            >
              Log In
            </Link>
          </p>
        </div>
      </motion.div>
    </main>
  )
}