import {
  useEffect,
  useState,
} from 'react'
import {
  Link,
  useNavigate,
} from 'react-router-dom'

import { useAuth } from '../../features/authentication/useAuth'
import {
  createSpace,
  deleteSpace,
  getSpaces,
} from '../../services/spaceService'
import type { Space } from '../../types/space'

const suggestions = [
  {
    name: 'College',
    description:
      'Everyday outfits for college and campus.',
  },
  {
    name: 'Party',
    description:
      'Fun outfits for parties and celebrations.',
  },
  {
    name: 'Friends',
    description:
      'Casual looks for hanging out with friends.',
  },
  {
    name: 'Vacation',
    description:
      'Looks for trips, travel, and holidays.',
  },
  {
    name: 'Internship',
    description:
      'Smart and polished outfits for work.',
  },
  {
    name: 'Date',
    description:
      'Outfits for special evenings and dates.',
  },
]

function getSuggestedSpace(
  suggestion: string,
) {
  return (
    suggestions.find(
      (item) => item.name === suggestion,
    ) ?? {
      name: suggestion,
      description: '',
    }
  )
}

export default function Spaces() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [spaces, setSpaces] =
    useState<Space[]>([])

  const [loading, setLoading] =
    useState(true)

  const [creating, setCreating] =
    useState(false)

  const [name, setName] =
    useState('')

  const [description, setDescription] =
    useState('')

  useEffect(() => {
    if (!user?.id) {
      return
    }

    const userId = user.id

    let cancelled = false

    async function loadSpaces() {
      try {
        const result =
          await getSpaces(userId)

        if (cancelled) {
          return
        }

        setSpaces(result)
      } catch (error) {
        if (!cancelled) {
          console.error(
            'Failed to load spaces:',
            error,
          )
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    loadSpaces()

    return () => {
      cancelled = true
    }
  }, [user?.id])

  async function handleCreateSpace() {
    if (!user) {
      return
    }

    const trimmedName =
      name.trim()

    if (!trimmedName) {
      return
    }

    const now = Date.now()

    const newSpace: Space = {
      id: crypto.randomUUID(),
      userId: user.id,
      name: trimmedName,
      description:
        description.trim(),
      createdAt: now,
      updatedAt: now,
    }

    setCreating(true)

    try {
      await createSpace(newSpace)

      setSpaces((current) => [
        newSpace,
        ...current,
      ])

      setName('')
      setDescription('')
    } catch (error) {
      console.error(
        'Failed to create space:',
        error,
      )
    } finally {
      setCreating(false)
    }
  }

  async function handleDeleteSpace(
    spaceId: string,
  ) {
    const confirmed =
      window.confirm(
        'Delete this space? The outfits themselves will not be deleted.',
      )

    if (!confirmed) {
      return
    }

    try {
      await deleteSpace(spaceId)

      setSpaces((current) =>
        current.filter(
          (space) =>
            space.id !== spaceId,
        ),
      )
    } catch (error) {
      console.error(
        'Failed to delete space:',
        error,
      )
    }
  }

  function handleSuggestion(
    suggestion: string,
  ) {
    const suggestedSpace =
      getSuggestedSpace(
        suggestion,
      )

    setName(suggestedSpace.name)

    setDescription(
      suggestedSpace.description,
    )
  }

  return (
    <main className="min-h-screen bg-[#faf9f7] text-[#242424]">
      {/* Header */}
      <header className="border-b border-[#e8e3de] bg-white px-5 py-4 md:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <div>
            <Link
              to="/"
              className="text-sm text-[#888] transition hover:text-[#242424]"
            >
              ← Home
            </Link>

            <h1 className="mt-1 text-2xl font-bold">
              My Spaces
            </h1>

            <p className="mt-1 text-sm text-[#888]">
              Organize outfits by occasion,
              mood, or purpose.
            </p>
          </div>

          <Link
            to="/outfit"
            className="rounded-2xl bg-[#242424] px-4 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:shadow-lg"
          >
            Create Outfit
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-5 py-8 md:px-8">
        {/* Create Space */}
        <section className="rounded-3xl border border-[#e8e3de] bg-white p-6 shadow-sm">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#999]">
              New Space
            </p>

            <h2 className="mt-2 text-xl font-bold">
              Create a collection
            </h2>

            <p className="mt-1 max-w-xl text-sm leading-6 text-[#888]">
              Create a space for a specific
              occasion, mood, trip, or part
              of your life.
            </p>
          </div>

          {/* Suggestions */}
          <div className="mt-5">
            <p className="mb-3 text-sm font-semibold">
              Quick suggestions
            </p>

            <div className="flex flex-wrap gap-2">
              {suggestions.map(
                (suggestion) => (
                  <button
                    key={
                      suggestion.name
                    }
                    type="button"
                    onClick={() =>
                      handleSuggestion(
                        suggestion.name,
                      )
                    }
                    className="rounded-full border border-[#e5e0db] bg-[#faf9f7] px-4 py-2 text-sm transition hover:border-[#242424] hover:bg-white"
                  >
                    {suggestion.name}
                  </button>
                ),
              )}
            </div>
          </div>

          {/* Form */}
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div>
              <label
                htmlFor="space-name"
                className="mb-2 block text-sm font-semibold"
              >
                Space name
              </label>

              <input
                id="space-name"
                value={name}
                onChange={(event) =>
                  setName(
                    event.target.value,
                  )
                }
                placeholder="e.g. College"
                className="w-full rounded-2xl border border-[#e5e0db] bg-[#faf9f7] px-4 py-3 text-sm outline-none transition focus:border-[#242424]"
              />
            </div>

            <div>
              <label
                htmlFor="space-description"
                className="mb-2 block text-sm font-semibold"
              >
                Description
              </label>

              <input
                id="space-description"
                value={description}
                onChange={(event) =>
                  setDescription(
                    event.target.value,
                  )
                }
                placeholder="What is this space for?"
                className="w-full rounded-2xl border border-[#e5e0db] bg-[#faf9f7] px-4 py-3 text-sm outline-none transition focus:border-[#242424]"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={handleCreateSpace}
            disabled={
              creating ||
              !name.trim()
            }
            className="mt-5 rounded-2xl bg-[#242424] px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
          >
            {creating
              ? 'Creating...'
              : 'Create Space'}
          </button>
        </section>

        {/* Spaces */}
        <section className="mt-10">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#999]">
                Collections
              </p>

              <h2 className="mt-2 text-xl font-bold">
                Your Spaces
              </h2>
            </div>

            <span className="text-sm text-[#888]">
              {spaces.length}{' '}
              {spaces.length === 1
                ? 'space'
                : 'spaces'}
            </span>
          </div>

          {loading ? (
            <div className="mt-6 rounded-3xl border border-[#e8e3de] bg-white p-10 text-center">
              <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-[#ddd] border-t-[#242424]" />

              <p className="mt-4 text-sm text-[#888]">
                Loading your spaces...
              </p>
            </div>
          ) : spaces.length === 0 ? (
            <div className="mt-6 rounded-3xl border border-dashed border-[#dcd6d0] bg-white p-10 text-center">
              <div className="text-5xl">
                ✨
              </div>

              <h3 className="mt-4 text-lg font-semibold">
                No spaces yet
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#888]">
                Create your first space
                above to start organizing
                your saved outfits.
              </p>
            </div>
          ) : (
            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {spaces.map((space) => (
                <article
                  key={space.id}
                  className="group rounded-3xl border border-[#e8e3de] bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <button
                    type="button"
                    onClick={() =>
                      navigate(
                        `/spaces/${space.id}`,
                      )
                    }
                    className="w-full text-left"
                  >
                    <div className="flex h-32 items-center justify-center rounded-2xl bg-[#f3f0ec]">
                      <span className="text-5xl transition group-hover:scale-110">
                        ✨
                      </span>
                    </div>

                    <h3 className="mt-5 text-lg font-bold">
                      {space.name}
                    </h3>

                    <p className="mt-2 min-h-10 text-sm leading-5 text-[#888]">
                      {space.description ||
                        'A collection of your outfits.'}
                    </p>
                  </button>

                  <div className="mt-5 flex items-center justify-between border-t border-[#eee9e4] pt-4">
                    <Link
                      to={`/spaces/${space.id}`}
                      className="text-sm font-semibold hover:underline"
                    >
                      Open Space →
                    </Link>

                    <button
                      type="button"
                      onClick={() =>
                        handleDeleteSpace(
                          space.id,
                        )
                      }
                      className="text-xs font-medium text-red-500 transition hover:text-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  )
}