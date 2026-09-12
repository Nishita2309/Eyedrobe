import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'

import {
  deleteClothingItem,
  getClothingItem,
} from '../../services/clothingService'
import type { ClothingItem } from '../../types/clothing'

export default function ClothingDetails() {
  const { clothingId } = useParams<{ clothingId: string }>()
  const navigate = useNavigate()

  const [item, setItem] = useState<ClothingItem | null>(null)
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    if (!clothingId) {
      navigate('/wardrobe')
      return
    }

    const currentClothingId = clothingId
    let cancelled = false

    async function loadItem() {
      try {
        const clothingItem = await getClothingItem(currentClothingId)

        if (cancelled) return

        if (!clothingItem) {
          alert('This clothing item could not be found.')
          navigate('/wardrobe')
          return
        }

        setItem(clothingItem)
      } catch (error) {
        if (!cancelled) {
          console.error('Failed to load clothing item:', error)
          alert('Something went wrong while loading this clothing item.')
          navigate('/wardrobe')
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    void loadItem()

    return () => {
      cancelled = true
    }
  }, [clothingId, navigate])

  async function handleDelete() {
    if (!item || deleting) return

    const confirmed = window.confirm(
      `Delete "${item.name}" from your wardrobe?\n\nThis action cannot be undone.`,
    )

    if (!confirmed) return

    try {
      setDeleting(true)

      await deleteClothingItem(item.id)

      navigate('/wardrobe')
    } catch (error) {
      console.error('Failed to delete clothing item:', error)
      alert('Failed to delete this item. Please try again.')
      setDeleting(false)
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#faf9f7] px-6 py-10">
        <div className="mx-auto max-w-4xl">
          <div className="h-8 w-48 animate-pulse rounded-xl bg-gray-200" />

          <div className="mt-8 grid gap-8 md:grid-cols-2">
            <div className="aspect-square animate-pulse rounded-3xl bg-gray-200" />

            <div className="space-y-4">
              <div className="h-10 w-3/4 animate-pulse rounded-xl bg-gray-200" />
              <div className="h-6 w-1/2 animate-pulse rounded-xl bg-gray-200" />
              <div className="h-32 animate-pulse rounded-2xl bg-gray-200" />
            </div>
          </div>
        </div>
      </main>
    )
  }

  if (!item) {
    return null
  }

  return (
    <main className="min-h-screen bg-[#faf9f7] px-4 py-6 sm:px-6 sm:py-10">
      <div className="mx-auto max-w-5xl">
        <Link
          to="/wardrobe"
          className="inline-flex items-center rounded-xl px-3 py-2 text-sm font-medium text-gray-600 transition hover:bg-white hover:text-gray-900"
        >
          ← Back to Wardrobe
        </Link>

        <div className="mt-6 grid gap-8 md:grid-cols-2">
          <section className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
            <div className="aspect-square bg-gray-100">
              {item.image ? (
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-full w-full object-contain"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-gray-400">
                  No image available
                </div>
              )}
            </div>
          </section>

          <section className="flex flex-col">
            <div>
              <p className="text-sm font-medium uppercase tracking-wider text-gray-500">
                {item.category}
              </p>

              <h1 className="mt-2 text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
                {item.name}
              </h1>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-4">
              <DetailCard
                label="Colour"
                value={item.color || 'Not specified'}
              />

              <DetailCard
                label="Pattern"
                value={item.pattern || 'Not specified'}
              />
            </div>

            <div className="mt-4 rounded-2xl border border-gray-200 bg-white p-5">
              <h2 className="text-sm font-semibold text-gray-900">
                Notes
              </h2>

              <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-gray-600">
                {item.notes || 'No notes added for this item.'}
              </p>
            </div>

            <div className="mt-auto flex flex-col gap-3 pt-8 sm:flex-row">
              <button
                type="button"
                onClick={() => navigate(`/wardrobe/${item.id}/edit`)}
                className="flex-1 rounded-2xl bg-gray-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
              >
                Edit Item
              </button>

              <button
                type="button"
                onClick={() => void handleDelete()}
                disabled={deleting}
                className="flex-1 rounded-2xl border border-red-200 bg-white px-5 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {deleting ? 'Deleting...' : 'Delete Item'}
              </button>
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}

function DetailCard({
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
        {label}
      </p>

      <p className="mt-1 text-sm font-medium text-gray-900">
        {value}
      </p>
    </div>
  )
}