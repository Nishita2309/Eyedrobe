import { Link } from 'react-router-dom'

import { useAuth } from '../../features/authentication/useAuth'

const actions = [
  {
    to: '/wardrobe',
    eyebrow: 'YOUR CLOSET',
    icon: '👗',
    title: 'My Wardrobe',
    description: 'Everything you own, beautifully organized in one place.',
    action: 'Explore wardrobe',
    className: 'bg-white',
  },
  {
    to: '/wardrobe/add',
    eyebrow: 'DIGITIZE',
    icon: '✦',
    title: 'Add Clothing',
    description: 'Turn something from your physical closet into a digital item.',
    action: 'Add an item',
    className: 'bg-[#242424] text-white',
    descriptionClass: 'text-white/65',
    eyebrowClass: 'text-white/50',
  },
  {
    to: '/outfit',
    eyebrow: 'CREATE',
    icon: '✨',
    title: 'Create Outfit',
    description: 'Mix your pieces together and build a look you love.',
    action: 'Open Outfit Studio',
    className: 'bg-[#eee9f5]',
  },
  {
    to: '/spaces',
    eyebrow: 'ORGANIZE',
    icon: '🪄',
    title: 'My Spaces',
    description: 'Keep outfits together by occasion, mood, trip, or anything you imagine.',
    action: 'Explore Spaces',
    className: 'bg-[#f7edf2]',
  },
]

export default function Home() {
  const { user, signOut } = useAuth()

  const username =
    user?.email?.split('@')[0] || 'Fashion lover'

  return (
    <main className="min-h-screen bg-[#faf9f7] text-[#242424]">
      <div className="mx-auto max-w-7xl px-5 py-7 sm:px-8 lg:px-10 lg:py-9">
        {/* Header */}
        <header className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium tracking-wide text-[#9a8fa0]">
              Welcome back
            </p>

            <h1 className="mt-1 text-3xl font-bold tracking-[-0.03em] sm:text-4xl">
              {username}
              <span className="ml-2">✨</span>
            </h1>

            <p className="mt-2 hidden text-sm text-[#888] sm:block">
              Own it. Imagine it. Wear it.
            </p>
          </div>

          <button
            type="button"
            onClick={() => void signOut()}
            className="rounded-full border border-[#e5e0dc] bg-white px-4 py-2 text-sm font-medium text-[#666] shadow-sm transition hover:-translate-y-0.5 hover:border-[#d8d1cc] hover:text-[#242424] hover:shadow-md"
          >
            Logout
          </button>
        </header>

        {/* Hero */}
        <section className="relative mt-8 overflow-hidden rounded-[2rem] bg-[#242424] px-6 py-7 text-white shadow-sm sm:px-9 sm:py-8">
          <div className="relative z-10 max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/45">
              Your personal styling studio
            </p>

            <h2 className="mt-3 max-w-xl text-3xl font-bold leading-tight tracking-[-0.035em] sm:text-4xl">
              What are you wearing today?
            </h2>

            <p className="mt-3 max-w-lg text-sm leading-6 text-white/65 sm:text-base">
              Start with the clothes you already own and create something
              completely yours.
            </p>

            <Link
              to="/outfit"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-[#242424] transition hover:-translate-y-0.5 hover:bg-[#f8f6f3] hover:shadow-lg"
            >
              Create an outfit
              <span aria-hidden="true">→</span>
            </Link>
          </div>

          <div
            aria-hidden="true"
            className="absolute -right-10 -top-16 h-48 w-48 rounded-full bg-[#e9dff0]/20 blur-2xl"
          />

          <div
            aria-hidden="true"
            className="absolute -bottom-20 right-24 h-44 w-44 rounded-full bg-[#f6cfdc]/15 blur-3xl"
          />

          <div
            aria-hidden="true"
            className="absolute right-8 top-8 hidden text-7xl opacity-90 sm:block"
          >
            ✦
          </div>
        </section>

        {/* Main actions */}
        <section className="mt-6 grid gap-4 sm:grid-cols-2">
          {actions.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`group relative min-h-[220px] overflow-hidden rounded-[1.75rem] p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl sm:p-7 ${item.className}`}
            >
              <div className="relative z-10 flex h-full flex-col">
                <div className="flex items-start justify-between">
                  <span
                    className={`text-[10px] font-bold uppercase tracking-[0.2em] text-[#9a8fa0] ${item.eyebrowClass ?? ''}`}
                  >
                    {item.eyebrow}
                  </span>

                  <span
                    className="text-4xl transition duration-300 group-hover:rotate-6 group-hover:scale-110"
                    aria-hidden="true"
                  >
                    {item.icon}
                  </span>
                </div>

                <div className="mt-auto">
                  <h2 className="text-2xl font-bold tracking-[-0.025em]">
                    {item.title}
                  </h2>

                  <p
                    className={`mt-2 max-w-md text-sm leading-5 text-[#777] ${item.descriptionClass ?? ''}`}
                  >
                    {item.description}
                  </p>

                  <div className="mt-5 inline-flex items-center gap-2 text-sm font-semibold">
                    {item.action}
                    <span
                      aria-hidden="true"
                      className="transition-transform duration-200 group-hover:translate-x-1"
                    >
                      →
                    </span>
                  </div>
                </div>
              </div>

              <div
                aria-hidden="true"
                className="absolute -bottom-12 -right-12 h-36 w-36 rounded-full bg-white/30 blur-2xl transition-transform duration-500 group-hover:scale-125"
              />
            </Link>
          ))}
        </section>

        {/* Quick access */}
        <section className="mt-6 rounded-[1.75rem] border border-[#ebe6e1] bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#9a8fa0]">
                Quick access
              </p>

              <p className="mt-1 text-sm text-[#777]">
                Jump straight back into your styling flow.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Link
                to="/wardrobe"
                className="rounded-full bg-[#f3f1ee] px-4 py-2.5 text-sm font-medium transition hover:bg-[#e9e5e0]"
              >
                Wardrobe
              </Link>

              <Link
                to="/outfit"
                className="rounded-full bg-[#eee9f5] px-4 py-2.5 text-sm font-medium transition hover:bg-[#e5deed]"
              >
                Outfit Studio
              </Link>

              <Link
                to="/spaces"
                className="rounded-full bg-[#f7edf2] px-4 py-2.5 text-sm font-medium transition hover:bg-[#f0dfe7]"
              >
                Spaces
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}