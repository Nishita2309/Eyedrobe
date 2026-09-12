import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'

import {
  getClothingItem,
  updateClothingItem,
} from '../../services/clothingService'
import type {
  ClothingCategory,
  ClothingItem,
} from '../../types/clothing'

const categories: ClothingCategory[] = [
  'Tops',
  'Bottoms',
  'Outerwear',
  'Dresses',
  'Accessories',
]

export default function EditClothing() {
  const { clothingId } = useParams<{ clothingId: string }>()
  const navigate = useNavigate()

  const [item, setItem] = useState<ClothingItem | null>(null)
  const [name, setName] = useState('')
  const [category, setCategory] = useState<ClothingCategory>('Tops')
  const [color, setColor] = useState('')
  const [pattern, setPattern] = useState('')
  const [notes, setNotes] = useState('')

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

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
        setName(clothingItem.name)
        setCategory(clothingItem.category)
        setColor(clothingItem.color)
        setPattern(clothingItem.pattern)
        setNotes(clothingItem.notes)
      } catch (error) {
        if (!cancelled) {
          console.error('Failed to load clothing item:', error)
          alert('Something went wrong while loading this item.')
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

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault()

    if (!item) return

    const trimmedName = name.trim()

    if (!trimmedName) {
      alert('Please enter a name for this clothing item.')
      return
    }

    try {
      setSaving(true)

      const updatedItem: ClothingItem = {
        ...item,
        name: trimmedName,
        category,
        color: color.trim(),
        pattern: pattern.trim(),
        notes: notes.trim(),
      }

      await updateClothingItem(updatedItem)

      navigate(`/wardrobe/${item.id}`)
    } catch (error) {
      console.error('Failed to update clothing item:', error)
      alert('Failed to save your changes. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#faf9f7] px-4 py-8 sm:px-6">
        <div className="mx-auto max-w-2xl">
          <div className="h-8 w-40 animate-pulse rounded-xl bg-gray-200" />

          <div className="mt-8 space-y-5 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="h-10 animate-pulse rounded-xl bg-gray-200" />
            <div className="h-10 animate-pulse rounded-xl bg-gray-200" />
            <div className="h-10 animate-pulse rounded-xl bg-gray-200" />
            <div className="h-32 animate-pulse rounded-xl bg-gray-200" />
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
      <div className="mx-auto max-w-2xl">
        <Link
          to={`/wardrobe/${item.id}`}
          className="inline-flex items-center rounded-xl px-3 py-2 text-sm font-medium text-gray-600 transition hover:bg-white hover:text-gray-900"
        >
          ← Back to Item
        </Link>

        <div className="mt-6 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
          <div>
            <p className="text-sm font-medium text-gray-500">
              Edit Clothing
            </p>

            <h1 className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
              {item.name}
            </h1>
          </div>

          <form
            onSubmit={handleSubmit}
            className="mt-8 space-y-5"
          >
            <div>
              <label
                htmlFor="clothing-name"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Name
              </label>

              <input
                id="clothing-name"
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="w-full rounded-2xl border border-gray-200 bg-[#faf9f7] px-4 py-3 text-sm outline-none transition focus:border-gray-400 focus:ring-2 focus:ring-gray-200"
                placeholder="e.g. White Oversized Shirt"
                required
              />
            </div>

            <div>
              <label
                htmlFor="clothing-category"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Category
              </label>

              <select
                id="clothing-category"
                value={category}
                onChange={(event) =>
                  setCategory(event.target.value as ClothingCategory)
                }
                className="w-full rounded-2xl border border-gray-200 bg-[#faf9f7] px-4 py-3 text-sm outline-none transition focus:border-gray-400 focus:ring-2 focus:ring-gray-200"
              >
                {categories.map((categoryOption) => (
                  <option
                    key={categoryOption}
                    value={categoryOption}
                  >
                    {categoryOption}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="clothing-color"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Colour
              </label>

              <input
                id="clothing-color"
                type="text"
                value={color}
                onChange={(event) => setColor(event.target.value)}
                className="w-full rounded-2xl border border-gray-200 bg-[#faf9f7] px-4 py-3 text-sm outline-none transition focus:border-gray-400 focus:ring-2 focus:ring-gray-200"
                placeholder="e.g. White"
              />
            </div>

            <div>
              <label
                htmlFor="clothing-pattern"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Pattern
              </label>

              <input
                id="clothing-pattern"
                type="text"
                value={pattern}
                onChange={(event) => setPattern(event.target.value)}
                className="w-full rounded-2xl border border-gray-200 bg-[#faf9f7] px-4 py-3 text-sm outline-none transition focus:border-gray-400 focus:ring-2 focus:ring-gray-200"
                placeholder="e.g. Solid, Striped, Floral"
              />
            </div>

            <div>
              <label
                htmlFor="clothing-notes"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Notes
              </label>

              <textarea
                id="clothing-notes"
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                rows={5}
                className="w-full resize-none rounded-2xl border border-gray-200 bg-[#faf9f7] px-4 py-3 text-sm outline-none transition focus:border-gray-400 focus:ring-2 focus:ring-gray-200"
                placeholder="Add any notes about this item..."
              />
            </div>

            <div className="flex flex-col gap-3 pt-4 sm:flex-row">
              <Link
                to={`/wardrobe/${item.id}`}
                className="flex-1 rounded-2xl border border-gray-200 px-5 py-3 text-center text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
              >
                Cancel
              </Link>

              <button
                type="submit"
                disabled={saving}
                className="flex-1 rounded-2xl bg-gray-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  )
}