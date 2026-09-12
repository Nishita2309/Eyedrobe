import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'

import OutfitCanvas from '../../components/outfit/OutfitCanvas'
import { getClothingItems } from '../../services/clothingService'
import {
  deleteOutfit,
  getOutfit,
  saveOutfit,
} from '../../services/outfitService'

import type { ClothingItem } from '../../types/clothing'
import type { Outfit } from '../../types/outfit'
import { useAuth } from '../../features/authentication/useAuth'

export default function SavedOutfit() {
  const { user } = useAuth()
  const { outfitId } = useParams<{ outfitId: string }>()
  const navigate = useNavigate()

  const [outfit, setOutfit] = useState<Outfit | null>(null)
  const [clothing, setClothing] = useState<ClothingItem[]>([])
  const [loading, setLoading] = useState(true)

  const [editingName, setEditingName] = useState(false)
  const [name, setName] = useState('')
  const [savingName, setSavingName] = useState(false)
  const [duplicating, setDuplicating] = useState(false)
const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    if (!user?.id || !outfitId) {
      navigate('/spaces')
      return
    }

    const currentUserId = user.id
    const currentOutfitId = outfitId
    let cancelled = false

    async function loadOutfit() {
      try {
        const [loadedOutfit, clothingItems] = await Promise.all([
          getOutfit(currentOutfitId),
          getClothingItems(currentUserId),
        ])

        if (cancelled) return

        if (!loadedOutfit) {
          alert('This outfit could not be found.')
          navigate('/spaces')
          return
        }

        if (loadedOutfit.userId !== currentUserId) {
          alert('You do not have access to this outfit.')
          navigate('/spaces')
          return
        }

        setOutfit(loadedOutfit)
        setName(loadedOutfit.name)
        setClothing(clothingItems)
      } catch (error) {
        if (!cancelled) {
          console.error('Failed to load saved outfit:', error)
          alert('Something went wrong while loading this outfit.')
          navigate('/spaces')
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    void loadOutfit()

    return () => {
      cancelled = true
    }
  }, [user?.id, outfitId, navigate])

  async function handleRename() {
    if (!outfit || savingName) return

    const trimmedName = name.trim()

    if (!trimmedName) {
      alert('Please enter a name for this outfit.')
      return
    }

    if (trimmedName === outfit.name) {
      setEditingName(false)
      return
    }

    try {
      setSavingName(true)

      const updatedOutfit: Outfit = {
        ...outfit,
        name: trimmedName,
        updatedAt: Date.now(),
      }

      await saveOutfit(updatedOutfit)

      setOutfit(updatedOutfit)
      setName(updatedOutfit.name)
      setEditingName(false)
    } catch (error) {
      console.error('Failed to rename outfit:', error)
      alert('Failed to rename this outfit. Please try again.')
    } finally {
      setSavingName(false)
    }
  }

  function handleCancelRename() {
    if (!outfit || savingName) return

    setName(outfit.name)
    setEditingName(false)
  }

  async function handleDuplicate() {
    if (!outfit || duplicating) return

    try {
      setDuplicating(true)

      const now = Date.now()

      const duplicatedOutfit: Outfit = {
        id: crypto.randomUUID(),
        userId: outfit.userId,
        name: `${outfit.name} (Copy)`,
        items: outfit.items.map((item) => ({
          ...item,
          id: crypto.randomUUID(),
        })),
        createdAt: now,
        updatedAt: now,
      }

      await saveOutfit(duplicatedOutfit)

      navigate(`/outfit/${duplicatedOutfit.id}/view`)
    } catch (error) {
      console.error('Failed to duplicate outfit:', error)
      alert('Failed to duplicate this outfit. Please try again.')
      setDuplicating(false)
    }
  }

  async function handleDelete() {
  if (!outfit || deleting) return

  const confirmed = window.confirm(
    `Delete "${outfit.name}"?\n\nThis will permanently remove this outfit from your wardrobe. This action cannot be undone.`,
  )

  if (!confirmed) return

  try {
    setDeleting(true)

    await deleteOutfit(outfit.id)

    navigate('/spaces')
  } catch (error) {
    console.error('Failed to delete outfit:', error)
    alert('Failed to delete this outfit. Please try again.')
    setDeleting(false)
  }
}

  if (loading) {
    return (
      <main className="min-h-screen bg-[#faf9f7] px-4 py-8 text-[#242424] sm:px-6 sm:py-10">
        <div className="mx-auto max-w-5xl">
          <div className="h-8 w-40 animate-pulse rounded-xl bg-gray-200" />

          <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
            <div className="aspect-[4/3] animate-pulse rounded-[1.75rem] bg-gray-200" />

            <div className="space-y-4">
              <div className="h-10 animate-pulse rounded-xl bg-gray-200" />
              <div className="h-24 animate-pulse rounded-2xl bg-gray-200" />
              <div className="h-12 animate-pulse rounded-2xl bg-gray-200" />
            </div>
          </div>
        </div>
      </main>
    )
  }

  if (!outfit) {
    return null
  }

  const createdDate = new Date(outfit.createdAt)
  const updatedDate = new Date(outfit.updatedAt)

  return (
    <main className="min-h-screen bg-[#faf9f7] px-4 py-6 text-[#242424] sm:px-6 sm:py-10">
      <div className="mx-auto max-w-5xl">
        <Link
          to="/spaces"
className="inline-flex w-full items-center justify-center rounded-full bg-[#242424] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg sm:w-auto"        >
          <span aria-hidden="true">←</span>
          <span className="ml-1.5">Back to Spaces</span>
        </Link>

        <div className="mt-6">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#aaa]">
            Saved Outfit
          </p>

          <div className="mt-1 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0 flex-1">
              {editingName ? (
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <label
                    htmlFor="outfit-name"
                    className="sr-only"
                  >
                    Outfit name
                  </label>

                  <input
                    id="outfit-name"
                    type="text"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter') {
                        void handleRename()
                      }

                      if (event.key === 'Escape') {
                        handleCancelRename()
                      }
                    }}
                    autoFocus
                    disabled={savingName}
                    className="min-w-0 flex-1 rounded-2xl border border-[#ded8d2] bg-white px-4 py-3 text-2xl font-bold tracking-[-0.03em] outline-none transition focus:border-[#999] focus:ring-2 focus:ring-[#eee] sm:text-3xl"
                  />

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => void handleRename()}
                      disabled={savingName}
                      className="rounded-full bg-[#242424] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#333] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {savingName ? 'Saving...' : 'Save'}
                    </button>

                    <button
                      type="button"
                      onClick={handleCancelRename}
                      disabled={savingName}
                      className="rounded-full border border-[#ded8d2] bg-white px-4 py-2 text-sm font-semibold text-[#555] transition hover:bg-[#f7f4f1] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-wrap items-center gap-3">
<h1 className="break-words text-3xl font-bold tracking-[-0.03em] sm:text-4xl">                    {outfit.name}
                  </h1>

                  <button
  type="button"
  aria-label={`Rename ${outfit.name}`}
  onClick={() => setEditingName(true)}
                    className="rounded-full border border-[#ded8d2] bg-white px-4 py-2 text-xs font-semibold text-[#666] transition hover:bg-[#f7f4f1] hover:text-[#242424]"
                  >
                    Rename
                  </button>
                </div>
              )}

              <p className="mt-2 text-sm text-[#999]">
                {outfit.items.length}{' '}
                {outfit.items.length === 1 ? 'piece' : 'pieces'} in this look
              </p>
            </div>

            <Link
              to={`/outfit/${outfit.id}`}
              className="inline-flex items-center justify-center rounded-full bg-[#242424] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
            >
              Edit Outfit
            </Link>
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <section
            aria-label="Outfit preview"
            className="min-w-0"
          >
<div className="w-full overflow-hidden rounded-[1.75rem] border border-[#e4ddd7] bg-white p-2 shadow-sm sm:p-3">              <OutfitCanvas
                items={outfit.items}
                clothing={clothing}
                selectedItemId={null}
                onSelectItem={() => undefined}
                onMoveItem={() => undefined}
              />
            </div>

            <p className="mt-3 text-center text-[10px] font-medium text-[#aaa]">
              Preview of your saved look
            </p>
          </section>

          <aside className="space-y-4">
            <section className="rounded-3xl border border-[#e5dfd9] bg-white p-5 shadow-sm">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#aaa]">
                Outfit information
              </p>

              <div className="mt-4 space-y-4">
                <InfoRow
                  label="Pieces"
                  value={`${outfit.items.length}`}
                />

                <InfoRow
                  label="Created"
                  value={createdDate.toLocaleDateString()}
                />

                <InfoRow
                  label="Last updated"
                  value={updatedDate.toLocaleDateString()}
                />
              </div>
            </section>

            <section className="rounded-3xl border border-[#e5dfd9] bg-white p-5 shadow-sm">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#aaa]">
                Items used
              </p>

              <div className="mt-4 space-y-3">
                {outfit.items.map((outfitItem) => {
                  const clothingItem = clothing.find(
                    (item) => item.id === outfitItem.clothingId,
                  )

                  return (
                    <div
                      key={outfitItem.id}
                      className="flex items-center gap-3 rounded-2xl bg-[#faf9f7] p-2.5"
                    >
                      {clothingItem?.image ? (
                        <img
  src={clothingItem.image}
  alt={clothingItem.name}
  className="h-12 w-12 shrink-0 rounded-xl object-cover"
/>
                      ) : (
                        <div
                          aria-hidden="true"
                          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#eeeae5] text-xs text-[#aaa]"
                        >
                          ?
                        </div>
                      )}

                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold">
                          {clothingItem?.name || 'Clothing item'}
                        </p>

                        <p className="mt-0.5 truncate text-[10px] text-[#999]">
                          {clothingItem?.category || 'Unknown category'}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </section>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              <button
                type="button"
                onClick={() => void handleDuplicate()}
                disabled={duplicating}
                className="flex w-full items-center justify-center rounded-2xl bg-[#242424] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#333] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {duplicating ? 'Duplicating...' : 'Duplicate Outfit'}
              </button>

              <Link
                to={`/outfit/${outfit.id}`}
                className="flex w-full items-center justify-center rounded-2xl border border-[#ded8d2] bg-white px-5 py-3 text-sm font-semibold text-[#555] transition hover:bg-[#f7f4f1]"
              >
                Open in Outfit Studio
              </Link>

              <button
  type="button"
  aria-label={`Delete ${outfit.name}`}
  onClick={() => void handleDelete()}
    disabled={deleting || duplicating}
    className="flex w-full items-center justify-center rounded-2xl border border-red-200 bg-white px-5 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
  >
    {deleting ? 'Deleting...' : 'Delete Outfit'}
  </button>
            </div>
          </aside>
        </div>
      </div>
    </main>
  )
}

function InfoRow({
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-xs font-medium text-[#999]">
        {label}
      </span>

      <span className="text-right text-sm font-semibold text-[#242424]">
        {value}
      </span>
    </div>
  )
}