import { useState } from 'react'
import type { FormEvent, ReactNode } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

import { useAuth } from '../../features/authentication/useAuth'

function GoogleIcon() {
  return (
    <span className="text-xl font-bold leading-none">
      G
    </span>
  )
}

function AppleIcon() {
  return (
    <span className="text-2xl leading-none">
      
    </span>
  )
}

function MicrosoftIcon() {
  return (
    <span className="grid grid-cols-2 gap-[2px]">
      <span className="h-[7px] w-[7px] bg-[#f35325]" />
      <span className="h-[7px] w-[7px] bg-[#81bc06]" />
      <span className="h-[7px] w-[7px] bg-[#05a6f0]" />
      <span className="h-[7px] w-[7px] bg-[#ffba08]" />
    </span>
  )
}

function SocialButton({
  icon,
  label,
}: {
  icon: ReactNode
  label: string
}) {
  return (
    <button
      type="button"
      disabled
      title={`${label} authentication will be available soon`}
      className="flex min-h-[52px] items-center justify-center gap-2 rounded-2xl border-2 border-black bg-white px-2 text-sm font-bold text-black opacity-70 transition sm:px-3"
    >
      {icon}

      <span className="hidden sm:inline">
        {label}
      </span>
    </button>
  )
}

export default function SignUp() {
  const navigate = useNavigate()
  const { signUp } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] =
    useState('')

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault()

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

    const { error } = await signUp(
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
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-8 sm:px-6">
      {/* Background */}
      <div className="absolute inset-0 bg-[linear-gradient(135deg,#7ee8a5_0%,#f9e27d_20%,#ff9f68_38%,#ff7eb6_55%,#7bdff2_72%,#8ca6ff_86%,#c89bff_100%)]" />

      {/* Decorative background blobs */}
      <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-[#a8ff78]/50 blur-3xl" />

      <div className="absolute -bottom-32 -right-24 h-96 w-96 rounded-full bg-[#d8a4ff]/50 blur-3xl" />

      <div className="absolute left-1/2 top-1/3 h-64 w-64 -translate-x-1/2 rounded-full bg-white/20 blur-3xl" />

      {/* Sign Up Card */}
      <motion.div
        initial={{
          opacity: 0,
          y: 25,
          scale: 0.97,
        }}
        animate={{
          opacity: 1,
          y: 0,
          scale: 1,
        }}
        transition={{
          duration: 0.5,
          ease: 'easeOut',
        }}
        className="relative z-10 w-full max-w-[480px]"
      >
        <div className="rounded-[2rem] border-[4px] border-black bg-white px-6 py-8 shadow-[10px_10px_0px_rgba(0,0,0,0.9)] sm:px-10 sm:py-10">
          {/* Logo and heading */}
          <div className="text-center">
            <img
              src="/images/eyedrobe-logo.png"
              alt="EyeDrope"
              className="mx-auto h-24 w-auto object-contain sm:h-28"
            />

            <motion.h1
              initial={{
                opacity: 0,
                y: 8,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: 0.1,
                duration: 0.4,
              }}
              className="mt-2 text-4xl font-black tracking-tight text-black sm:text-5xl"
            >
              Create Account
            </motion.h1>

            <p className="mt-2 text-sm font-medium text-gray-500 sm:text-base">
              Start building your digital wardrobe.
            </p>
          </div>

          {/* Social login */}
          <div className="mt-8 grid grid-cols-3 gap-3">
            <SocialButton
              icon={<GoogleIcon />}
              label="Google"
            />

            <SocialButton
              icon={<AppleIcon />}
              label="Apple"
            />

            <SocialButton
              icon={<MicrosoftIcon />}
              label="Microsoft"
            />
          </div>

          {/* Divider */}
          <div className="my-7 flex items-center gap-4">
            <div className="h-px flex-1 bg-gray-300" />

            <span className="text-sm font-semibold text-gray-400">
              or
            </span>

            <div className="h-px flex-1 bg-gray-300" />
          </div>

          {/* Email Sign Up */}
          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-bold text-black"
              >
                Email
              </label>

              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                placeholder="Enter your Mail"
                className="w-full rounded-2xl border-[2px] border-black bg-white px-4 py-3.5 text-sm font-medium text-black outline-none transition placeholder:text-gray-400 focus:-translate-y-0.5 focus:shadow-[4px_4px_0px_rgba(0,0,0,0.9)]"
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-bold text-black"
              >
                Password
              </label>

              <input
                id="password"
                type="password"
                required
                autoComplete="new-password"
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                placeholder="Create a password"
                className="w-full rounded-2xl border-[2px] border-black bg-white px-4 py-3.5 text-sm font-medium text-black outline-none transition placeholder:text-gray-400 focus:-translate-y-0.5 focus:shadow-[4px_4px_0px_rgba(0,0,0,0.9)]"
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="mb-2 block text-sm font-bold text-black"
              >
                Confirm Password
              </label>

              <input
                id="confirmPassword"
                type="password"
                required
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(event) =>
                  setConfirmPassword(
                    event.target.value,
                  )
                }
                placeholder="Confirm your password"
                className="w-full rounded-2xl border-[2px] border-black bg-white px-4 py-3.5 text-sm font-medium text-black outline-none transition placeholder:text-gray-400 focus:-translate-y-0.5 focus:shadow-[4px_4px_0px_rgba(0,0,0,0.9)]"
              />
            </div>

            {/* Error */}
            {error && (
              <motion.p
                initial={{
                  opacity: 0,
                  y: -5,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                className="rounded-2xl border-2 border-red-300 bg-red-50 px-4 py-3 text-sm font-medium text-red-600"
              >
                {error}
              </motion.p>
            )}

            {/* Create Account */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl border-[2px] border-black bg-[linear-gradient(90deg,#ff7eb3_0%,#ff9a6a_25%,#ffd166_50%,#7ee8a5_72%,#8ca6ff_100%)] px-5 py-4 text-sm font-black text-black shadow-[4px_4px_0px_rgba(0,0,0,0.9)] transition hover:-translate-y-1 hover:shadow-[6px_6px_0px_rgba(0,0,0,0.9)] active:translate-y-0 active:shadow-[2px_2px_0px_rgba(0,0,0,0.9)] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading
                ? 'Creating account...'
                : 'Create Account'}
            </button>
          </form>

          {/* Sign In */}
          <p className="mt-7 text-center text-sm text-gray-500">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-bold text-black underline decoration-2 underline-offset-4 transition hover:text-purple-600"
            >
              Sign In
            </Link>
          </p>
        </div>

        {/* Branding */}
        <p className="mt-5 text-center text-xs font-semibold text-black/60">
          EyeDrope · Own → Imagine → Wear
        </p>
      </motion.div>
    </main>
  )
}