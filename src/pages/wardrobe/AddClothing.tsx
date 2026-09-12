import {
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from 'react'
import { useNavigate } from 'react-router-dom'

import { addClothingItem } from '../../services/clothingService'
import type { ClothingCategory } from '../../types/clothing'
import { useAuth } from '../../features/authentication/useAuth'

const categories: ClothingCategory[] = [
  'Tops',
  'Bottoms',
  'Outerwear',
  'Dresses',
  'Accessories',
]

const MAX_FILE_SIZE = 10 * 1024 * 1024

export default function AddClothing() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const fileInputRef = useRef<HTMLInputElement>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)

  const [name, setName] = useState('')
  const [category, setCategory] =
    useState<ClothingCategory>('Tops')
  const [color, setColor] = useState('')
  const [pattern, setPattern] = useState('')
  const [notes, setNotes] = useState('')

  const [image, setImage] = useState('')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  function processImage(file: File) {
    setError('')

    if (!file.type.startsWith('image/')) {
      setError('Please select an image file.')
      return
    }

    if (file.size > MAX_FILE_SIZE) {
      setError('Image must be smaller than 10MB.')
      return
    }

    const reader = new FileReader()

    reader.onload = () => {
      const result = reader.result

      if (typeof result === 'string') {
        setImage(result)
      }
    }

    reader.onerror = () => {
      setError('Unable to read this image.')
    }

    reader.readAsDataURL(file)
  }

  function handleFileChange(
    event: ChangeEvent<HTMLInputElement>,
  ) {
    const file = event.target.files?.[0]

    if (!file) return

    processImage(file)

    event.target.value = ''
  }

  function removeImage() {
    setImage('')
    setError('')
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault()

    if (!user) {
      setError('You must be logged in.')
      return
    }

    if (!image) {
      setError('Please add a photo of your clothing.')
      return
    }

    if (!name.trim()) {
      setError('Please enter a clothing name.')
      return
    }

    setSaving(true)
    setError('')

    try {
      await addClothingItem({
        id: crypto.randomUUID(),
        userId: user.id,
        name: name.trim(),
        category,
        color: color.trim(),
        pattern: pattern.trim(),
        notes: notes.trim(),
        image,
        createdAt: Date.now(),
      })

      navigate('/wardrobe')
    } catch (err) {
      console.error(err)
      setError('Unable to save this clothing item.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#faf9f7] px-5 py-8 text-[#242424] md:px-10">
      <div className="mx-auto max-w-3xl">

        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 text-sm font-medium text-[#777] transition hover:text-[#242424]"
        >
          ← Back
        </button>

        {/* Header */}
        <div>
          <p className="text-sm font-medium text-[#9a8fa0]">
            Build your digital closet
          </p>

          <h1 className="mt-1 text-4xl font-bold tracking-tight">
            Add Clothing
          </h1>

          <p className="mt-2 text-sm text-[#777]">
            Take a photo or choose one from your device.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-6"
        >

          {/* Photo section */}
          <section className="rounded-3xl bg-white p-5 shadow-sm">
            <div className="mb-4">
              <h2 className="font-semibold">
                1. Add a photo
              </h2>

              <p className="mt-1 text-xs text-[#999]">
                Use a clear photo of the clothing item.
              </p>
            </div>

            {image ? (
              <div className="relative overflow-hidden rounded-3xl bg-[#f3f1ee]">
                <img
                  src={image}
                  alt="Selected clothing preview"
                  className="mx-auto max-h-[450px] w-full object-contain"
                />

                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute right-4 top-4 rounded-full bg-white px-4 py-2 text-xs font-semibold shadow-md transition hover:scale-105"
                >
                  Remove
                </button>
              </div>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">

                {/* Camera */}
                <button
                  type="button"
                  onClick={() =>
                    cameraInputRef.current?.click()
                  }
                  className="flex min-h-[220px] flex-col items-center justify-center rounded-3xl border-2 border-dashed border-[#ddd] bg-[#faf9f7] transition hover:border-[#aaa] hover:bg-[#f5f3f0]"
                >
                  <span className="text-5xl">
                    📷
                  </span>

                  <span className="mt-4 font-semibold">
                    Take a photo
                  </span>

                  <span className="mt-1 text-xs text-[#999]">
                    Use your camera
                  </span>
                </button>

                {/* Gallery */}
                <button
                  type="button"
                  onClick={() =>
                    fileInputRef.current?.click()
                  }
                  className="flex min-h-[220px] flex-col items-center justify-center rounded-3xl border-2 border-dashed border-[#ddd] bg-[#faf9f7] transition hover:border-[#aaa] hover:bg-[#f5f3f0]"
                >
                  <span className="text-5xl">
                    🖼️
                  </span>

                  <span className="mt-4 font-semibold">
                    Choose a photo
                  </span>

                  <span className="mt-1 text-xs text-[#999]">
                    From your device
                  </span>
                </button>

                {/* Gallery input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />

                {/* Camera input */}
                <input
                  ref={cameraInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleFileChange}
                  className="hidden"
                />

              </div>
            )}
          </section>

          {/* Details */}
          <section className="rounded-3xl bg-white p-5 shadow-sm">

            <div className="mb-5">
              <h2 className="font-semibold">
                2. Tell us about it
              </h2>

              <p className="mt-1 text-xs text-[#999]">
                You can change these details later.
              </p>
            </div>

            <div className="space-y-5">

              {/* Name */}
              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Name
                </label>

                <input
                  value={name}
                  onChange={(event) =>
                    setName(event.target.value)
                  }
                  placeholder="e.g. White oversized shirt"
                  className="w-full rounded-2xl border border-[#e5e0db] px-4 py-3 outline-none transition focus:border-[#999] focus:ring-2 focus:ring-[#eee]"
                />
              </div>

              {/* Category */}
              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Category
                </label>

                <select
                  value={category}
                  onChange={(event) =>
                    setCategory(
                      event.target.value as ClothingCategory,
                    )
                  }
                  className="w-full rounded-2xl border border-[#e5e0db] bg-white px-4 py-3 outline-none transition focus:border-[#999] focus:ring-2 focus:ring-[#eee]"
                >
                  {categories.map((item) => (
                    <option
                      key={item}
                      value={item}
                    >
                      {item}
                    </option>
                  ))}
                </select>
              </div>

              {/* Colour */}
              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Colour
                </label>

                <input
                  value={color}
                  onChange={(event) =>
                    setColor(event.target.value)
                  }
                  placeholder="e.g. White"
                  className="w-full rounded-2xl border border-[#e5e0db] px-4 py-3 outline-none transition focus:border-[#999] focus:ring-2 focus:ring-[#eee]"
                />
              </div>

              {/* Pattern */}
              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Pattern
                </label>

                <input
                  value={pattern}
                  onChange={(event) =>
                    setPattern(event.target.value)
                  }
                  placeholder="e.g. Plain, Striped, Floral"
                  className="w-full rounded-2xl border border-[#e5e0db] px-4 py-3 outline-none transition focus:border-[#999] focus:ring-2 focus:ring-[#eee]"
                />
              </div>

              {/* Notes */}
              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Notes
                </label>

                <textarea
                  value={notes}
                  onChange={(event) =>
                    setNotes(event.target.value)
                  }
                  placeholder="Anything you want to remember..."
                  rows={4}
                  className="w-full resize-none rounded-2xl border border-[#e5e0db] px-4 py-3 outline-none transition focus:border-[#999] focus:ring-2 focus:ring-[#eee]"
                />
              </div>

            </div>
          </section>

          {/* Error */}
          {error && (
            <div
              role="alert"
              className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600"
            >
              {error}
            </div>
          )}

          {/* Save */}
          <button
            type="submit"
            disabled={saving}
            className="w-full rounded-2xl bg-[#242424] py-4 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving
              ? 'Saving to your wardrobe...'
              : 'Save to My Wardrobe'}
          </button>

        </form>
      </div>
    </main>
  )
}