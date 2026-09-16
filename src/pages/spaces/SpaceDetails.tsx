import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'

import { useAuth } from '../../features/authentication/useAuth'
import {
  getOutfit,
  getOutfits,
} from '../../services/outfitService'
import {
  addOutfitToSpace,
  deleteSpace,
  getSpace,
  getSpaceOutfits,
  removeOutfitFromSpace,
  updateSpace,
} from '../../services/spaceService'
import type { Outfit } from '../../types/outfit'
import type { Space } from '../../types/space'

export default function SpaceDetails() {
  const { spaceId } = useParams<{ spaceId: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()

  const [space, setSpace] = useState<Space | null>(null)
  const [outfits, setOutfits] = useState<Outfit[]>([])
  const [allOutfits, setAllOutfits] = useState<Outfit[]>([])

  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const [addingOutfit, setAddingOutfit] = useState(false)
  const [removingOutfitId, setRemovingOutfitId] = useState<string | null>(
    null,
  )
  const [selectedOutfitId, setSelectedOutfitId] = useState('')

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')

  useEffect(() => {
    if (!spaceId || !user?.id) {
      navigate('/spaces')
      return
    }

    const currentSpaceId = spaceId
    const currentUserId = user.id

    let cancelled = false

    async function loadSpace() {
      try {
        const currentSpace = await getSpace(currentSpaceId)

        if (cancelled) return

        if (
          !currentSpace ||
          currentSpace.userId !== currentUserId
        ) {
          alert('This space could not be found.')
          navigate('/spaces')
          return
        }

        setSpace(currentSpace)
        setName(currentSpace.name)
        setDescription(currentSpace.description)

        const relationships = await getSpaceOutfits(
          currentSpaceId,
        )

        if (cancelled) return

        const loadedOutfits = await Promise.all(
          relationships.map((relationship) =>
            getOutfit(relationship.outfitId),
          ),
        )

        if (cancelled) return

        const validSpaceOutfits = loadedOutfits.filter(
          (outfit): outfit is Outfit =>
            outfit !== undefined &&
            outfit.userId === currentUserId,
        )

        setOutfits(validSpaceOutfits)

        const userOutfits = await getOutfits(currentUserId)

        if (cancelled) return

        setAllOutfits(userOutfits)
      } catch (error) {
        if (!cancelled) {
          console.error('Failed to load space:', error)
          alert('Something went wrong while loading this space.')
          navigate('/spaces')
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    void loadSpace()

    return () => {
      cancelled = true
    }
  }, [spaceId, user?.id, navigate])

  async function handleAddOutfit() {
    if (!space || !selectedOutfitId || addingOutfit) {
      return
    }

    const selectedOutfit = allOutfits.find(
      (outfit) => outfit.id === selectedOutfitId,
    )

    if (
      !selectedOutfit ||
      selectedOutfit.userId !== space.userId
    ) {
      alert('This outfit could not be added.')
      return
    }

    if (
      outfits.some(
        (outfit) => outfit.id === selectedOutfitId,
      )
    ) {
      alert('This outfit is already in this space.')
      return
    }

    try {
      setAddingOutfit(true)

      await addOutfitToSpace({
        id: crypto.randomUUID(),
        spaceId: space.id,
        outfitId: selectedOutfit.id,
        createdAt: Date.now(),
      })

      setOutfits((current) => [
        ...current,
        selectedOutfit,
      ])

      setSelectedOutfitId('')
    } catch (error) {
      console.error('Failed to add outfit to space:', error)
      alert('Failed to add this outfit. Please try again.')
    } finally {
      setAddingOutfit(false)
    }
  }

  async function handleRemoveOutfit(outfitId: string) {
    if (!space || removingOutfitId) {
      return
    }

    try {
      setRemovingOutfitId(outfitId)

      await removeOutfitFromSpace(
        space.id,
        outfitId,
      )

      setOutfits((current) =>
        current.filter(
          (outfit) => outfit.id !== outfitId,
        ),
      )
    } catch (error) {
      console.error(
        'Failed to remove outfit from space:',
        error,
      )

      alert(
        'Failed to remove this outfit. Please try again.',
      )
    } finally {
      setRemovingOutfitId(null)
    }
  }

  async function handleSave() {
    if (!space || saving) {
      return
    }

    const trimmedName = name.trim()

    if (!trimmedName) {
      alert('Please enter a name for this space.')
      return
    }

    try {
      setSaving(true)

      const updatedSpace: Space = {
        ...space,
        name: trimmedName,
        description: description.trim(),
        updatedAt: Date.now(),
      }

      await updateSpace(updatedSpace)

      setSpace(updatedSpace)
      setName(updatedSpace.name)
      setDescription(updatedSpace.description)
      setEditing(false)
    } catch (error) {
      console.error('Failed to update space:', error)
      alert('Failed to save your changes. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  function handleCancel() {
    if (!space) {
      return
    }

    setName(space.name)
    setDescription(space.description)
    setEditing(false)
  }

  async function handleDelete() {
    if (!space || deleting) {
      return
    }

    const confirmed = window.confirm(
      `Delete "${space.name}"?\n\nThe outfits inside this space will not be deleted. This action cannot be undone.`,
    )

    if (!confirmed) {
      return
    }

    try {
      setDeleting(true)

      await deleteSpace(space.id)

      navigate('/spaces')
    } catch (error) {
      console.error('Failed to delete space:', error)
      alert('Failed to delete this space. Please try again.')
      setDeleting(false)
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#faf9f7] px-4 py-6 sm:px-6 sm:py-10">
        <div className="mx-auto max-w-6xl">
          <div className="h-8 w-40 animate-pulse rounded-xl bg-gray-200" />

          <div className="mt-8 space-y-6">
            <div className="h-32 animate-pulse rounded-3xl bg-gray-200" />

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div className="h-48 animate-pulse rounded-3xl bg-gray-200" />
              <div className="h-48 animate-pulse rounded-3xl bg-gray-200" />
              <div className="h-48 animate-pulse rounded-3xl bg-gray-200" />
            </div>
          </div>
        </div>
      </main>
    )
  }

  if (!space) {
    return null
  }

  const availableOutfits = allOutfits.filter(
    (outfit) =>
      !outfits.some(
        (spaceOutfit) =>
          spaceOutfit.id === outfit.id,
      ),
  )

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#faf9f7] px-4 py-6 sm:px-6 sm:py-10">
      <div className="mx-auto w-full max-w-6xl min-w-0">
        <Link
          to="/spaces"
          className="inline-flex min-h-10 items-center rounded-xl px-3 py-2 text-sm font-medium text-gray-600 transition hover:bg-white hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
        >
          ← Back to Spaces
        </Link>

        {/* SPACE HEADER */}
        <section className="mt-6 rounded-3xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7">
          {!editing ? (
            <div className="flex min-w-0 flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <p className="text-sm font-medium uppercase tracking-wider text-gray-400">
                  Space
                </p>

                <h1 className="mt-1 break-words text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
                  {space.name}
                </h1>

                <p className="mt-3 whitespace-pre-wrap break-words text-sm leading-6 text-gray-600">
                  {space.description ||
                    'No description added yet.'}
                </p>

                <p className="mt-4 text-sm text-gray-400">
                  {outfits.length}{' '}
                  {outfits.length === 1
                    ? 'outfit'
                    : 'outfits'}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setEditing(true)}
                className="min-h-12 w-full rounded-2xl bg-gray-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 sm:w-auto sm:shrink-0"
              >
                Edit Space
              </button>
            </div>
          ) : (
            <div>
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Edit Space
                </p>

                <h1 className="mt-1 break-words text-3xl font-semibold tracking-tight text-gray-900">
                  Update your space
                </h1>
              </div>

              <div className="mt-6 space-y-5">
                <div>
                  <label
                    htmlFor="space-name"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Space name
                  </label>

                  <input
                    id="space-name"
                    type="text"
                    value={name}
                    onChange={(event) =>
                      setName(event.target.value)
                    }
                    maxLength={100}
                    className="min-h-12 w-full rounded-2xl border border-gray-200 bg-[#faf9f7] px-4 py-3 text-sm outline-none transition focus:border-gray-400 focus:ring-2 focus:ring-gray-200"
                    placeholder="e.g. College Looks"
                  />
                </div>

                <div>
                  <label
                    htmlFor="space-description"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Description
                  </label>

                  <textarea
                    id="space-description"
                    value={description}
                    onChange={(event) =>
                      setDescription(event.target.value)
                    }
                    rows={4}
                    maxLength={500}
                    className="w-full resize-none rounded-2xl border border-gray-200 bg-[#faf9f7] px-4 py-3 text-sm outline-none transition focus:border-gray-400 focus:ring-2 focus:ring-gray-200"
                    placeholder="Describe what this space is for..."
                  />
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={handleCancel}
                    disabled={saving}
                    className="min-h-12 flex-1 rounded-2xl border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    onClick={() => void handleSave()}
                    disabled={saving}
                    className="min-h-12 flex-1 rounded-2xl bg-gray-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {saving
                      ? 'Saving...'
                      : 'Save Changes'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* OUTFITS */}
        <section className="mt-8 min-w-0">
          <div>
            <p className="text-sm font-medium text-gray-500">
              Collection
            </p>

            <h2 className="mt-1 text-2xl font-semibold text-gray-900">
              Outfits
            </h2>
          </div>

          {/* ADD OUTFIT */}
          <div className="mt-5 rounded-3xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
            <div>
              <h3 className="text-base font-semibold text-gray-900">
                Add an existing outfit
              </h3>

              <p className="mt-1 text-sm leading-6 text-gray-500">
                Choose an outfit from your collection to
                add it to this space.
              </p>
            </div>

            {availableOutfits.length === 0 ? (
              <div className="mt-4 rounded-2xl bg-[#faf9f7] px-4 py-3 text-sm leading-6 text-gray-500">
                {allOutfits.length === 0
                  ? 'You do not have any saved outfits yet.'
                  : 'All your saved outfits are already in this space.'}
              </div>
            ) : (
              <div className="mt-4 flex min-w-0 flex-col gap-3 sm:flex-row">
                <label
                  htmlFor="space-outfit-select"
                  className="sr-only"
                >
                  Choose an outfit to add
                </label>

                <select
                  id="space-outfit-select"
                  value={selectedOutfitId}
                  onChange={(event) =>
                    setSelectedOutfitId(
                      event.target.value,
                    )
                  }
                  aria-label="Choose an outfit to add"
                  className="min-h-12 min-w-0 flex-1 rounded-2xl border border-gray-200 bg-[#faf9f7] px-4 py-3 text-sm outline-none transition focus:border-gray-400 focus:ring-2 focus:ring-gray-200"
                >
                  <option value="">
                    Choose an outfit...
                  </option>

                  {availableOutfits.map((outfit) => (
                    <option
                      key={outfit.id}
                      value={outfit.id}
                    >
                      {outfit.name}
                    </option>
                  ))}
                </select>

                <button
                  type="button"
                  onClick={() =>
                    void handleAddOutfit()
                  }
                  disabled={
                    !selectedOutfitId ||
                    addingOutfit
                  }
                  className="min-h-12 rounded-2xl bg-gray-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:shrink-0"
                >
                  {addingOutfit
                    ? 'Adding...'
                    : 'Add Outfit'}
                </button>
              </div>
            )}
          </div>

          {/* EMPTY STATE */}
          {outfits.length === 0 ? (
            <div className="mt-5 rounded-3xl border border-dashed border-gray-300 bg-white px-5 py-12 text-center sm:px-6">
              <h3 className="text-lg font-semibold text-gray-900">
                No outfits in this space yet
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
                Add an existing outfit above or create
                a new outfit to start building your
                collection.
              </p>

              <Link
                to="/outfit"
                className="mt-6 inline-flex min-h-12 items-center justify-center rounded-2xl bg-gray-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
              >
                Create Outfit
              </Link>
            </div>
          ) : (
            /* OUTFIT GRID */
            <div className="mt-5 grid min-w-0 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {outfits.map((outfit) => (
                <div
                  key={outfit.id}
                  className="min-w-0 overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm"
                >
                  <Link
                    to={`/outfit/${outfit.id}/view`}
                    aria-label={`Open saved outfit ${outfit.name}`}
                    className="group block min-w-0 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-inset"
                  >
                    <div className="aspect-[4/3] bg-[#f4f1ee]">
                      <div className="flex h-full items-center justify-center px-4 text-center text-sm text-gray-400">
                        {outfit.items.length}{' '}
                        {outfit.items.length === 1
                          ? 'piece'
                          : 'pieces'}
                      </div>
                    </div>

                    <div className="min-w-0 p-5">
                      <h3 className="break-words text-base font-semibold leading-6 text-gray-900">
                        {outfit.name}
                      </h3>

                      <p className="mt-1 text-sm text-gray-500">
                        Open saved outfit →
                      </p>
                    </div>
                  </Link>

                  <div className="border-t border-gray-100 p-4">
                    <button
                      type="button"
                      onClick={() =>
                        void handleRemoveOutfit(
                          outfit.id,
                        )
                      }
                      disabled={
                        removingOutfitId ===
                        outfit.id
                      }
                      aria-label={`Remove ${outfit.name} from this space`}
                      className="min-h-11 w-full rounded-2xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {removingOutfitId ===
                      outfit.id
                        ? 'Removing...'
                        : 'Remove from Space'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* DANGER ZONE */}
        <section className="mt-10 rounded-3xl border border-red-100 bg-white p-5 sm:p-7">
          <div>
            <h2 className="text-base font-semibold text-gray-900">
              Danger Zone
            </h2>

            <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">
              Deleting this space removes the collection,
              but does not delete the outfits inside it.
            </p>
          </div>

          <button
            type="button"
            onClick={() => void handleDelete()}
            disabled={deleting}
            className="mt-5 min-h-12 w-full rounded-2xl border border-red-200 px-5 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
          >
            {deleting
              ? 'Deleting...'
              : 'Delete Space'}
          </button>
        </section>
      </div>
    </main>
  )
}