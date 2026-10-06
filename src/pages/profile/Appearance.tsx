import { Link } from 'react-router-dom'

import {
  useTheme,
  type ThemePreference,
} from '../../context/ThemeContext'

function SunIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="h-6 w-6"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2" />
      <path d="M12 20v2" />
      <path d="m4.93 4.93 1.41 1.41" />
      <path d="m17.66 17.66 1.41 1.41" />
      <path d="M2 12h2" />
      <path d="M20 12h2" />
      <path d="m6.34 17.66-1.41 1.41" />
      <path d="m19.07 4.93-1.41 1.41" />
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="h-6 w-6"
      aria-hidden="true"
    >
      <path d="M20 15.5A8.5 8.5 0 0 1 8.5 4 8.5 8.5 0 1 0 20 15.5Z" />
    </svg>
  )
}

function MonitorIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="h-6 w-6"
      aria-hidden="true"
    >
      <rect
        x="3"
        y="4"
        width="18"
        height="14"
        rx="2"
      />
      <path d="M8 21h8" />
      <path d="M12 18v3" />
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

const themes: {
  value: ThemePreference
  title: string
  description: string
  background: string
  icon: React.ReactNode
}[] = [
  {
    value: 'light',
    title: 'Light',
    description:
      'Use the colorful EyeDrope theme.',
    background: 'bg-[#ffe0ea]',
    icon: <SunIcon />,
  },
  {
    value: 'dark',
    title: 'Dark',
    description:
      'Use a darker version of the EyeDrope theme.',
    background: 'bg-[#ddd0ff]',
    icon: <MoonIcon />,
  },
  {
    value: 'system',
    title: 'System',
    description:
      'Follow your device appearance setting.',
    background: 'bg-[#c9f5df]',
    icon: <MonitorIcon />,
  },
]

export default function Appearance() {
  const { theme, resolvedTheme, setTheme } =
    useTheme()

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-emerald-300 via-yellow-200 via-30% to-fuchsia-400 text-black dark:from-[#17151b] dark:via-[#242027] dark:to-[#30213a] dark:text-white">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-cyan-300/50 blur-3xl dark:bg-cyan-900/30"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-40 -right-32 h-[30rem] w-[30rem] rounded-full bg-purple-400/50 blur-3xl dark:bg-purple-950/40"
      />

      <div className="relative z-10 mx-auto max-w-3xl px-4 py-6 sm:px-6 sm:py-10">
        <header className="flex items-center justify-between">
          <Link
            to="/profile"
            className="inline-flex items-center gap-2 rounded-full border-2 border-black bg-white px-4 py-2.5 text-sm font-black shadow-[3px_3px_0px_#000] transition hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_#000] dark:border-white dark:bg-[#242027] dark:text-white dark:shadow-[3px_3px_0px_#fff]"
          >
            <ArrowLeftIcon />
            Profile
          </Link>

          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border-3 border-black bg-white shadow-[3px_3px_0px_#000] dark:border-white dark:bg-[#242027] dark:shadow-[3px_3px_0px_#fff]">
            <img
              src="/images/eyedrobe-logo.png"
              alt="EyeDrope"
              className="h-9 w-9 object-contain"
            />
          </div>
        </header>

        <section className="mt-8">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-black/55 dark:text-white/50">
            Preferences
          </p>

          <h1 className="mt-2 text-4xl font-black tracking-tight sm:text-5xl">
            Appearance
          </h1>

          <p className="mt-2 text-sm font-medium text-black/60 dark:text-white/60 sm:text-base">
            Choose how EyeDrope looks across your
            devices.
          </p>
        </section>

        <section className="mt-7 rounded-[2rem] border-4 border-black bg-white p-5 shadow-[7px_7px_0px_#000] dark:border-white dark:bg-[#242027] dark:shadow-[7px_7px_0px_#fff] sm:p-7">
          <div className="grid gap-4">
            {themes.map((item) => {
              const selected =
                theme === item.value

              return (
                <button
                  key={item.value}
                  type="button"
                  onClick={() =>
                    setTheme(item.value)
                  }
                  aria-pressed={selected}
                  className={`flex w-full items-center gap-4 rounded-2xl border-3 p-4 text-left transition sm:p-5 ${
                    selected
                      ? 'border-black bg-[#fff8d9] shadow-[4px_4px_0px_#000] dark:border-white dark:bg-[#332e25] dark:shadow-[4px_4px_0px_#fff]'
                      : 'border-black/15 bg-black/[0.02] hover:border-black hover:bg-black/[0.04] dark:border-white/15 dark:bg-white/[0.03] dark:hover:border-white dark:hover:bg-white/[0.06]'
                  }`}
                >
                  <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border-2 border-black dark:border-white ${item.background}`}
                  >
                    {item.icon}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-base font-black">
                      {item.title}
                    </p>

                    <p className="mt-1 text-sm font-medium text-black/50 dark:text-white/50">
                      {item.description}
                    </p>
                  </div>

                  <div
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 ${
                      selected
                        ? 'border-black bg-black dark:border-white dark:bg-white'
                        : 'border-black/30 dark:border-white/30'
                    }`}
                  >
                    {selected && (
                      <div className="h-2 w-2 rounded-full bg-white dark:bg-black" />
                    )}
                  </div>
                </button>
              )
            })}
          </div>
        </section>

        <section className="mt-6 rounded-[1.75rem] border-3 border-black bg-white/80 p-5 dark:border-white/20 dark:bg-white/[0.06]">
          <p className="text-xs font-black uppercase tracking-wider text-black/45 dark:text-white/40">
            Current appearance
          </p>

          <p className="mt-2 text-lg font-black capitalize">
            {resolvedTheme}
          </p>

          <p className="mt-1 text-sm font-medium text-black/50 dark:text-white/50">
            {theme === 'system'
              ? 'EyeDrope is following your device preference.'
              : `EyeDrope is using ${theme} mode.`}
          </p>
        </section>
      </div>
    </main>
  )
}