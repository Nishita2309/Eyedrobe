import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

import { getClothingItems } from '../../services/clothingService'
import type {
  ClothingCategory,
  ClothingItem,
} from '../../types/clothing'
import { useAuth } from '../../features/authentication/useAuth'

const categories: ClothingCategory[] = [
  'Tops',
  'Bottoms',
  'Outerwear',
  'Dresses',
  'Accessories',
]

export default function Wardrobe() {
  const { user } = useAuth()

  const [items, setItems] = useState<ClothingItem[]>([])
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] =
    useState<ClothingCategory | 'All'>('All')

  useEffect(() => {
    if (!user?.id) {
      return
    }

    const currentUserId = user.id
    let cancelled = false

    async function loadItems() {
      try {
        const clothing = await getClothingItems(currentUserId)

        if (!cancelled) {
          setItems(clothing)
        }
      } catch (error) {
        if (!cancelled) {
          console.error(
            'Failed to load wardrobe items:',
            error,
          )
        }
      }
    }

    void loadItems()

    return () => {
      cancelled = true
    }
  }, [user?.id])

  const filteredItems = useMemo(() => {
    const searchValue = search.trim().toLowerCase()

    return items.filter((item) => {
      const matchesSearch =
        searchValue.length === 0 ||
        item.name.toLowerCase().includes(searchValue) ||
        item.color.toLowerCase().includes(searchValue) ||
        item.category.toLowerCase().includes(searchValue)

      const matchesCategory =
        selectedCategory === 'All' ||
        item.category === selectedCategory

      return matchesSearch && matchesCategory
    })
  }, [items, search, selectedCategory])

  return (
    <main className="min-h-screen bg-[#faf9f7] text-[#242424]">
      <div className="mx-auto max-w-7xl px-5 py-6 sm:px-8 lg:px-10 lg:py-8">
        {/* Back navigation */}
        <Link
          to="/"
          className="group inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium text-[#777] transition hover:bg-white hover:text-[#242424] hover:shadow-sm"
        >
          <span
            aria-hidden="true"
            className="transition-transform group-hover:-translate-x-0.5"
          >
            ←
          </span>
          Back to Home
        </Link>

        {/* Header */}
        <header className="mt-7 flex flex-col gap-5 sm:mt-8 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <span
                className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#eee9f5] text-xl"
                aria-hidden="true"
              >
                👗
              </span>

              <p className="text-sm font-semibold text-[#9a8fa0]">
                Your digital closet
              </p>
            </div>

            <h1 className="mt-4 text-4xl font-bold tracking-[-0.04em] sm:text-5xl">
              My Wardrobe
            </h1>

            <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-[#777]">
              <span>
                Everything you own, in one place.
              </span>

              <span
                aria-hidden="true"
                className="hidden text-[#ccc] sm:inline"
              >
                •
              </span>

              <span className="font-medium text-[#555]">
                {items.length}{' '}
                {items.length === 1 ? 'item' : 'items'}
              </span>
            </div>
          </div>

          <Link
            to="/wardrobe/add"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[#242424] px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
          >
            <span className="text-lg leading-none">+</span>
            Add Clothing
          </Link>
        </header>

        {/* Search */}
        <section className="mt-8">
          <label htmlFor="wardrobe-search" className="sr-only">
            Search your wardrobe
          </label>

          <div className="relative">
            <span
              aria-hidden="true"
              className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-lg text-[#aaa]"
            >
              ⌕
            </span>

            <input
              id="wardrobe-search"
              type="search"
              placeholder="Search by name, colour, or category..."
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              className="h-14 w-full rounded-2xl border border-[#e5dfda] bg-white pl-12 pr-5 text-sm outline-none transition placeholder:text-[#aaa] focus:border-[#b8ada5] focus:ring-4 focus:ring-[#242424]/5"
            />
          </div>
        </section>

        {/* Category filters */}
        <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
          <button
            type="button"
            onClick={() =>
              setSelectedCategory('All')
            }
            className={`whitespace-nowrap rounded-full px-5 py-2.5 text-sm font-medium transition ${
              selectedCategory === 'All'
                ? 'bg-[#242424] text-white shadow-sm'
                : 'bg-white text-[#666] hover:bg-[#eeeae6]'
            }`}
          >
            All
          </button>

          {categories.map((category) => (
            <button
              type="button"
              key={category}
              onClick={() =>
                setSelectedCategory(category)
              }
              className={`whitespace-nowrap rounded-full px-5 py-2.5 text-sm font-medium transition ${
                selectedCategory === category
                  ? 'bg-[#242424] text-white shadow-sm'
                  : 'bg-white text-[#666] hover:bg-[#eeeae6]'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Result summary */}
        {items.length > 0 && (
          <div className="mb-4 mt-5 flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#aaa]">
              {selectedCategory === 'All'
                ? 'All pieces'
                : selectedCategory}
            </p>

            <p className="text-xs text-[#999]">
              {filteredItems.length}{' '}
              {filteredItems.length === 1
                ? 'result'
                : 'results'}
            </p>
          </div>
        )}

        {/* Empty / no results state */}
        {filteredItems.length === 0 && (
          <div className="flex min-h-[360px] flex-col items-center justify-center rounded-[2rem] border border-dashed border-[#ddd5cf] bg-white px-6 text-center">
            <div
              className="flex h-16 w-16 items-center justify-center rounded-3xl bg-[#f1ebf4] text-3xl"
              aria-hidden="true"
            >
              {items.length === 0 ? '👗' : '⌕'}
            </div>

            <h2 className="mt-5 text-xl font-bold">
              {items.length === 0
                ? 'Your wardrobe is empty'
                : 'Nothing matches your search'}
            </h2>

            <p className="mt-2 max-w-md text-sm leading-6 text-[#777]">
              {items.length === 0
                ? 'Add your first clothing item and start building your digital closet.'
                : 'Try another search term or switch to a different category.'}
            </p>

            {items.length === 0 ? (
              <Link
                to="/wardrobe/add"
                className="mt-6 rounded-full bg-[#242424] px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:shadow-lg"
              >
                Add your first item
              </Link>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setSearch('')
                  setSelectedCategory('All')
                }}
                className="mt-6 rounded-full bg-[#242424] px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:shadow-lg"
              >
                Clear filters
              </button>
            )}
          </div>
        )}

        {/* Clothing grid */}
        {filteredItems.length > 0 && (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-5">
            {filteredItems.map((item, index) => (
              <motion.article
                key={item.id}
                initial={{
                  opacity: 0,
                  y: 12,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  duration: 0.25,
                  delay: Math.min(index * 0.035, 0.3),
                }}
                className="group overflow-hidden rounded-[1.5rem] border border-[#ebe5e0] bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-[#ddd5cf] hover:shadow-xl"
              >
                <div className="relative aspect-[4/5] overflow-hidden bg-[#f2efeb]">
                  <img
                    src={item.image}
                    alt={item.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.035]"
                  />

                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                </div>

                <div className="p-4">
                  <h3 className="truncate text-sm font-bold sm:text-base">
                    {item.name}
                  </h3>

                  <div className="mt-2 flex items-center justify-between gap-2">
                    <span className="truncate text-xs font-medium text-[#8d8490]">
                      {item.category}
                    </span>

                    <span
                      className="max-w-[45%] truncate text-right text-xs text-[#aaa]"
                      title={item.color}
                    >
                      {item.color}
                    </span>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}