import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'

import { getClothingItems } from '../../services/clothingService'
import {
  getSpace,
  getSpaceOutfits,
  removeOutfitFromSpace,
} from '../../services/spaceService'
import { getOutfit } from '../../services/outfitService'

import type { ClothingItem } from '../../types/clothing'
import type { Outfit, OutfitItem } from '../../types/outfit'
import type { Space } from '../../types/space'

interface SavedOutfit {
  outfit: Outfit
  items: Array<{
    outfitItem: OutfitItem
    clothing: ClothingItem
  }>
}

export default function SpaceDetails() {
  const { spaceId } = useParams()
  const navigate = useNavigate()

  const [space, setSpace] = useState<Space | null>(null)
  const [savedOutfits, setSavedOutfits] = useState<SavedOutfit[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!spaceId) {
      return
    }

    const currentSpaceId = spaceId
    let cancelled = false

    async function loadSpace() {
      try {
        setLoading(true)

        const currentSpace = await getSpace(currentSpaceId)

        if (cancelled) {
          return
        }

        if (!currentSpace) {
          setSpace(null)
          return
        }

        setSpace(currentSpace)

        const relationships = await getSpaceOutfits(currentSpaceId)

        if (cancelled) {
          return
        }

        const clothing = await getClothingItems(currentSpace.userId)

        if (cancelled) {
          return
        }

        const clothingMap = new Map(
          clothing.map((item) => [item.id, item]),
        )

        const outfits: SavedOutfit[] = []

        for (const relationship of relationships) {
          const outfit = await getOutfit(relationship.outfitId)

          if (!outfit) {
            continue
          }

          const outfitItems = outfit.items
            .map((outfitItem) => {
              const clothingItem = clothingMap.get(outfitItem.clothingId)

              if (!clothingItem) {
                return null
              }

              return {
                outfitItem,
                clothing: clothingItem,
              }
            })
            .filter(
              (
                item,
              ): item is {
                outfitItem: OutfitItem
                clothing: ClothingItem
              } => item !== null,
            )

          outfits.push({
            outfit,
            items: outfitItems,
          })
        }

        if (!cancelled) {
          setSavedOutfits(outfits)
        }
      } catch (error) {
        if (!cancelled) {
          console.error('Failed to load Space:', error)
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
  }, [spaceId])

  const outfitCountLabel = useMemo(() => {
    if (savedOutfits.length === 1) {
      return '1 outfit'
    }

    return `${savedOutfits.length} outfits`
  }, [savedOutfits.length])

  async function handleRemoveOutfit(outfitId: string) {
    if (!spaceId) {
      return
    }

    const confirmed = window.confirm(
      'Remove this outfit from this Space?',
    )

    if (!confirmed) {
      return
    }

    try {
      await removeOutfitFromSpace(spaceId, outfitId)

      setSavedOutfits((current) =>
        current.filter((item) => item.outfit.id !== outfitId),
      )
    } catch (error) {
      console.error('Failed to remove outfit from Space:', error)
      alert('Something went wrong while removing the outfit.')
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#faf8f6] px-6 py-10 text-[#292524]">
        <div className="mx-auto max-w-6xl">
          <div className="rounded-3xl border border-black/5 bg-white p-8 shadow-sm">
            <p className="text-sm text-black/50">
              Loading Space...
            </p>
          </div>
        </div>
      </main>
    )
  }

  if (!space) {
    return (
      <main className="min-h-screen bg-[#faf8f6] px-6 py-10 text-[#292524]">
        <div className="mx-auto max-w-6xl">
          <Link
            to="/spaces"
            className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-black/60 transition hover:text-black"
          >
            <span aria-hidden="true">←</span>
            Back to Spaces
          </Link>

          <div className="rounded-3xl border border-black/5 bg-white p-8 text-center shadow-sm">
            <h1 className="text-2xl font-semibold">
              Space not found
            </h1>

            <p className="mt-2 text-sm text-black/50">
              This Space may have been deleted or is no longer available.
            </p>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#faf8f6] px-6 py-8 text-[#292524]">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <Link
                to="/spaces"
                className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-black/60 transition hover:text-black"
              >
                <span aria-hidden="true">←</span>
                Back to Spaces
              </Link>

              <h1 className="text-3xl font-semibold tracking-tight">
                {space.name}
              </h1>

              {space.description && (
                <p className="mt-2 max-w-2xl text-sm text-black/55">
                  {space.description}
                </p>
              )}

              <p className="mt-3 text-sm text-black/40">
                {outfitCountLabel}
              </p>
            </div>

            <button
              type="button"
              onClick={() => navigate('/')}
              className="rounded-2xl border border-black/10 bg-white px-4 py-2.5 text-sm font-medium shadow-sm transition hover:bg-black/[0.03]"
            >
              Home
            </button>
          </div>
        </header>

        {savedOutfits.length === 0 ? (
          <section className="rounded-3xl border border-dashed border-black/10 bg-white p-10 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#f4eef8] text-3xl">
              ✨
            </div>

            <h2 className="mt-5 text-xl font-semibold">
              No outfits in this Space yet
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-black/50">
              Create an outfit in Outfit Studio and save it to this Space.
            </p>

            <Link
              to="/outfit"
              className="mt-6 inline-flex rounded-2xl bg-[#292524] px-5 py-3 text-sm font-medium text-white transition hover:opacity-90"
            >
              Create Outfit
            </Link>
          </section>
        ) : (
          <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {savedOutfits.map(({ outfit, items }) => (
              <article
                key={outfit.id}
                className="overflow-hidden rounded-3xl border border-black/5 bg-white shadow-sm"
              >
                <Link
                  to={`/outfit/${outfit.id}`}
                  className="block"
                  aria-label={`Edit ${outfit.name}`}
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-[#f7f4f1]">
                    {items.length === 0 ? (
                      <div className="flex h-full items-center justify-center">
                        <div className="text-center">
                          <div className="text-4xl">👚</div>
                          <p className="mt-2 text-xs text-black/40">
                            No clothing preview available
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="absolute inset-0">
                        {items.map(({ outfitItem, clothing }) => (
                          <img
                            key={outfitItem.id}
                            src={clothing.image}
                            alt={clothing.name}
                            className="absolute object-contain"
                            style={{
                              left: `${(outfitItem.x / 900) * 100}%`,
                              top: `${(outfitItem.y / 675) * 100}%`,
                              width: `${(outfitItem.width / 900) * 100}%`,
                              height: `${(outfitItem.height / 675) * 100}%`,
                              transform: `rotate(${outfitItem.rotation}deg)`,
                              zIndex: outfitItem.zIndex,
                            }}
                          />
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="p-5">
                    <h2 className="font-semibold">
                      {outfit.name}
                    </h2>

                    <p className="mt-1 text-xs text-black/45">
                      {items.length}{' '}
                      {items.length === 1 ? 'piece' : 'pieces'}
                    </p>
                  </div>
                </Link>

                <div className="flex gap-2 border-t border-black/5 px-5 py-4">
                  <Link
                    to={`/outfit/${outfit.id}`}
                    className="flex-1 rounded-xl bg-black/[0.04] px-3 py-2 text-center text-xs font-medium transition hover:bg-black/[0.08]"
                  >
                    Edit Outfit
                  </Link>

                  <button
                    type="button"
                    onClick={() => void handleRemoveOutfit(outfit.id)}
                    className="rounded-xl px-3 py-2 text-xs font-medium text-red-500 transition hover:bg-red-50"
                  >
                    Remove
                  </button>
                </div>
              </article>
            ))}
          </section>
        )}
      </div>
    </main>
  )
}