import { Link } from 'react-router-dom'

import { useAuth } from '../../features/authentication/useAuth'

function WardrobeIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="h-8 w-8"
      aria-hidden="true"
    >
      <path d="M9 5a3 3 0 0 1 6 0" />
      <path d="M5 8h14" />
      <path d="M5 8v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8" />
      <path d="M8 8v12" />
      <path d="M16 8v12" />
      <path d="M8 5h8" />
    </svg>
  )
}

function AddClothingIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="h-8 w-8"
      aria-hidden="true"
    >
      <path d="M9 5a3 3 0 0 1 6 0" />
      <path d="M5 8h14" />
      <path d="M5 8v10a2 2 0 0 0 2 2h4" />
      <path d="M19 8v7" />
      <path d="M8 8v12" />
      <path d="M16 8v4" />
      <path d="M16 17h6" />
      <path d="M19 14v6" />
    </svg>
  )
}

function OutfitIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="h-8 w-8"
      aria-hidden="true"
    >
      <path d="m12 3 2 3 3 1.5 3 4.5-3 2-2-3v9H9v-9l-2 3-3-2 3-4.5L10 6l2-3Z" />
      <path d="M9 20h6" />
    </svg>
  )
}

function SpacesIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="h-8 w-8"
      aria-hidden="true"
    >
      <rect x="4" y="4" width="7" height="7" rx="1" />
      <rect x="13" y="4" width="7" height="7" rx="1" />
      <rect x="4" y="13" width="7" height="7" rx="1" />
      <rect x="13" y="13" width="7" height="7" rx="1" />
    </svg>
  )
}

function ProfileIcon() {
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

function ArrowIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  )
}

const actions = [
  {
    to: '/wardrobe',
    eyebrow: 'YOUR CLOSET',
    title: 'My Wardrobe',
    description:
      'Everything you own, beautifully organized in one place.',
    action: 'Explore wardrobe',
    icon: <WardrobeIcon />,
    light:
      'bg-white hover:bg-pink-50',
    dark:
      'dark:bg-[#242027] dark:hover:bg-[#2c2731]',
    iconBackground:
      'bg-[#ffe0ea] dark:bg-[#3a2631]',
  },
  {
    to: '/wardrobe/add',
    eyebrow: 'DIGITIZE',
    title: 'Add Clothing',
    description:
      'Turn something from your physical closet into a digital item.',
    action: 'Add an item',
    icon: <AddClothingIcon />,
    light:
      'bg-[#c9f5df] hover:bg-[#b8f0d3]',
    dark:
      'dark:bg-[#20352d] dark:hover:bg-[#274238]',
    iconBackground:
      'bg-white dark:bg-[#29362f]',
  },
  {
    to: '/outfit',
    eyebrow: 'CREATE',
    title: 'Create Outfit',
    description:
      'Mix your pieces together and build a look you love.',
    action: 'Open Outfit Studio',
    icon: <OutfitIcon />,
    light:
      'bg-[#ddd0ff] hover:bg-[#d3c3ff]',
    dark:
      'dark:bg-[#30283d] dark:hover:bg-[#3a304a]',
    iconBackground:
      'bg-white dark:bg-[#393041]',
  },
  {
    to: '/spaces',
    eyebrow: 'ORGANIZE',
    title: 'My Spaces',
    description:
      'Keep outfits together by occasion, mood, trip, or anything you imagine.',
    action: 'Explore Spaces',
    icon: <SpacesIcon />,
    light:
      'bg-[#ffd1e3] hover:bg-[#ffc1d8]',
    dark:
      'dark:bg-[#3a2631] dark:hover:bg-[#472d3b]',
    iconBackground:
      'bg-white dark:bg-[#44303a]',
  },
]

export default function Home() {
  const { user, signOut } = useAuth()

  const username =
    typeof user?.user_metadata?.display_name ===
      'string' &&
    user.user_metadata.display_name.trim()
      ? user.user_metadata.display_name
      : user?.email?.split('@')[0] ||
        'Fashion lover'

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-emerald-300 via-yellow-200 via-30% to-fuchsia-400 text-black transition-colors duration-300 dark:from-[#17151b] dark:via-[#242027] dark:to-[#30213a] dark:text-white">
      {/* Background decorations */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-cyan-300/70 blur-3xl dark:bg-cyan-900/25"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-40 -right-32 h-[30rem] w-[30rem] rounded-full bg-purple-400/60 blur-3xl dark:bg-purple-950/40"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/3 h-80 w-80 -translate-x-1/2 rounded-full bg-orange-300/40 blur-3xl dark:bg-orange-900/20"
      />

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-5 sm:px-6 sm:py-8 lg:px-10 lg:py-10">
        {/* Header */}
        <header className="flex items-center justify-between gap-4">
          <Link
            to="/"
            className="group flex items-center gap-3"
            aria-label="EyeDrope Home"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border-3 border-black bg-white shadow-[4px_4px_0px_#000] transition duration-200 group-hover:-translate-y-0.5 group-hover:shadow-[6px_6px_0px_#000] dark:border-white dark:bg-[#242027] dark:shadow-[4px_4px_0px_#fff] dark:group-hover:shadow-[6px_6px_0px_#fff]">
              <img
                src="/images/eyedrobe-logo.png"
                alt="EyeDrope"
                className="h-11 w-11 object-contain"
              />
            </div>

            <div className="hidden sm:block">
              <p className="text-lg font-black tracking-tight">
                EyeDrope
              </p>

              <p className="text-xs font-semibold text-black/55 dark:text-white/50">
                Own it. Imagine it. Wear it.
              </p>
            </div>
          </Link>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              to="/profile"
              aria-label="Open profile"
              className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-black bg-white shadow-[3px_3px_0px_#000] transition duration-200 hover:-translate-y-0.5 hover:bg-[#ddd0ff] hover:shadow-[5px_5px_0px_#000] dark:border-white dark:bg-[#242027] dark:shadow-[3px_3px_0px_#fff] dark:hover:bg-[#393041] dark:hover:shadow-[5px_5px_0px_#fff] sm:h-auto sm:w-auto sm:gap-2 sm:rounded-full sm:px-4 sm:py-2.5"
            >
              <ProfileIcon />

              <span className="hidden text-sm font-black sm:block">
                Profile
              </span>
            </Link>

            <button
              type="button"
              onClick={() => void signOut()}
              aria-label="Log out"
              className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-black bg-white shadow-[3px_3px_0px_#000] transition duration-200 hover:-translate-y-0.5 hover:bg-black hover:text-white hover:shadow-[5px_5px_0px_#000] dark:border-white dark:bg-[#242027] dark:shadow-[3px_3px_0px_#fff] dark:hover:bg-white dark:hover:text-black dark:hover:shadow-[5px_5px_0px_#fff] sm:h-auto sm:w-auto sm:gap-2 sm:rounded-full sm:px-4 sm:py-2.5"
            >
              <LogoutIcon />

              <span className="hidden text-sm font-black sm:block">
                Logout
              </span>
            </button>
          </div>
        </header>

        {/* Greeting */}
        <section className="mt-7 sm:mt-9">
          <p className="text-sm font-bold text-black/55 dark:text-white/50">
            Welcome back
          </p>

          <h1 className="mt-1 text-4xl font-black tracking-[-0.04em] sm:text-5xl">
            {username}
          </h1>

          <p className="mt-2 text-sm font-semibold text-black/55 dark:text-white/50 sm:text-base">
            Own it. Imagine it. Wear it.
          </p>
        </section>

        {/* Hero */}
        <section className="relative mt-6 overflow-hidden rounded-[2rem] border-4 border-black bg-white p-6 shadow-[7px_7px_0px_#000] transition-colors duration-300 dark:border-white dark:bg-[#242027] dark:shadow-[7px_7px_0px_#fff] sm:mt-8 sm:p-9">
          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border-2 border-black bg-[#c9f5df] px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.18em] shadow-[2px_2px_0px_#000] dark:border-white dark:bg-[#29362f] dark:shadow-[2px_2px_0px_#fff]">
              <span
                aria-hidden="true"
                className="h-2 w-2 rounded-full bg-black dark:bg-white"
              />

              Your personal styling studio
            </div>

            <h2 className="mt-5 max-w-xl text-4xl font-black leading-[0.95] tracking-[-0.04em] sm:text-6xl">
              What are you
              <br />
              wearing today?
            </h2>

            <p className="mt-5 max-w-lg text-sm font-medium leading-6 text-black/60 dark:text-white/55 sm:text-base">
              Start with the clothes you already own
              and create something completely yours.
            </p>

            <Link
              to="/outfit"
              className="group mt-6 inline-flex items-center gap-3 rounded-2xl border-2 border-black bg-gradient-to-r from-pink-400 via-orange-300 to-yellow-300 px-5 py-3.5 text-sm font-black text-black shadow-[4px_4px_0px_#000] transition duration-200 hover:-translate-y-1 hover:shadow-[6px_6px_0px_#000]"
            >
              Create an outfit
              <ArrowIcon />
            </Link>
          </div>

          <div
            aria-hidden="true"
            className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-pink-300 blur-2xl dark:bg-pink-900/30"
          />

          <div
            aria-hidden="true"
            className="absolute -bottom-20 right-20 h-52 w-52 rounded-full bg-cyan-300/70 blur-3xl dark:bg-cyan-900/25"
          />

          <div
            aria-hidden="true"
            className="absolute right-10 top-10 hidden h-24 w-24 rotate-12 rounded-[2rem] border-4 border-black bg-[#ddd0ff] shadow-[5px_5px_0px_#000] dark:border-white dark:bg-[#393041] dark:shadow-[5px_5px_0px_#fff] sm:block"
          >
            <div className="flex h-full items-center justify-center">
              <OutfitIcon />
            </div>
          </div>
        </section>

        {/* Main actions */}
        <section className="mt-7 grid gap-5 sm:grid-cols-2">
          {actions.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`group relative min-h-[230px] overflow-hidden rounded-[1.75rem] border-4 border-black p-6 shadow-[6px_6px_0px_#000] transition duration-300 hover:-translate-y-1 hover:shadow-[9px_9px_0px_#000] dark:border-white dark:shadow-[6px_6px_0px_#fff] dark:hover:shadow-[9px_9px_0px_#fff] sm:p-7 ${item.light} ${item.dark}`}
            >
              <div className="relative z-10 flex h-full flex-col">
                <div className="flex items-start justify-between">
                  <span className="rounded-full border-2 border-black bg-white/80 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] shadow-[2px_2px_0px_#000] dark:border-white dark:bg-black/30 dark:shadow-[2px_2px_0px_#fff]">
                    {item.eyebrow}
                  </span>

                  <div
                    className={`flex h-14 w-14 items-center justify-center rounded-2xl border-2 border-black shadow-[3px_3px_0px_#000] transition duration-300 group-hover:rotate-6 group-hover:scale-110 dark:border-white dark:shadow-[3px_3px_0px_#fff] ${item.iconBackground}`}
                  >
                    {item.icon}
                  </div>
                </div>

                <div className="mt-auto">
                  <h2 className="text-2xl font-black tracking-[-0.025em] sm:text-3xl">
                    {item.title}
                  </h2>

                  <p className="mt-2 max-w-md text-sm font-medium leading-5 text-black/60 dark:text-white/55">
                    {item.description}
                  </p>

                  <div className="mt-5 inline-flex items-center gap-2 rounded-full border-2 border-black bg-white px-4 py-2 text-sm font-black text-black shadow-[2px_2px_0px_#000] transition group-hover:translate-x-1 dark:border-white dark:bg-[#17151b] dark:text-white dark:shadow-[2px_2px_0px_#fff]">
                    {item.action}
                    <ArrowIcon />
                  </div>
                </div>
              </div>

              <div
                aria-hidden="true"
                className="absolute -bottom-16 -right-12 h-40 w-40 rounded-full bg-white/50 blur-2xl transition-transform duration-500 group-hover:scale-150 dark:bg-white/5"
              />
            </Link>
          ))}
        </section>
      </div>
    </main>
  )
}