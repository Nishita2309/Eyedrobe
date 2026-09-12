import {
  useEffect,
  useMemo,
  useState,
} from 'react'

import {
  Link,
  useNavigate,
  useParams,
} from 'react-router-dom'

import OutfitCanvas from '../../components/outfit/OutfitCanvas'

import {
  getClothingItems,
} from '../../services/clothingService'

import {
  getOutfit,
  saveOutfit,
} from '../../services/outfitService'

import {
  getSpaces,
  addOutfitToSpace,
} from '../../services/spaceService'

import type {
  ClothingItem,
  ClothingCategory,
} from '../../types/clothing'

import type {
  OutfitItem,
  Outfit,
} from '../../types/outfit'

import type {
  Space,
} from '../../types/space'

import { useAuth } from '../../features/authentication/useAuth'

const categories: Array<
  ClothingCategory | 'All'
> = [
  'All',
  'Tops',
  'Bottoms',
  'Outerwear',
  'Dresses',
  'Accessories',
]

const CANVAS_WIDTH = 900
const CANVAS_HEIGHT = 675

export default function OutfitStudio() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const { outfitId } = useParams<{
    outfitId: string
  }>()

  const [clothing, setClothing] =
    useState<ClothingItem[]>([])

  const [items, setItems] =
    useState<OutfitItem[]>([])

  const [selectedItemId, setSelectedItemId] =
    useState<string | null>(null)

  const [name, setName] =
    useState('Untitled Outfit')

  const [search, setSearch] =
    useState('')

  const [category, setCategory] =
    useState<ClothingCategory | 'All'>('All')

  const [saving, setSaving] =
    useState(false)

  const [saved, setSaved] =
    useState(false)

  const [loadingOutfit, setLoadingOutfit] =
    useState(false)

  const [spaces, setSpaces] =
    useState<Space[]>([])

  const [selectedSpaceId, setSelectedSpaceId] =
    useState('')

  /*
   * LOAD CLOTHING
   */

  useEffect(() => {
    if (!user?.id) {
      return
    }

    const currentUserId = user.id
    let cancelled = false

    async function loadClothing() {
      try {
        const result =
          await getClothingItems(currentUserId)

        if (!cancelled) {
          setClothing(result)
        }
      } catch (error) {
        if (!cancelled) {
          console.error(
            'Failed to load clothing:',
            error,
          )
        }
      }
    }

    void loadClothing()

    return () => {
      cancelled = true
    }
  }, [user?.id])

  /*
   * LOAD EXISTING OUTFIT
   */

  useEffect(() => {
    if (!user?.id || !outfitId) {
      return
    }

    const currentOutfitId = outfitId
    const currentUserId = user.id

    let cancelled = false

    async function loadOutfit() {
      try {
        setLoadingOutfit(true)

        const outfit =
          await getOutfit(currentOutfitId)

        if (cancelled) {
          return
        }

        if (!outfit) {
          alert(
            'This outfit could not be found.',
          )

          return
        }

        if (
          outfit.userId !== currentUserId
        ) {
          alert(
            'You do not have access to this outfit.',
          )

          return
        }

        setName(outfit.name)
        setItems(outfit.items)

        if (outfit.items.length > 0) {
          setSelectedItemId(
            outfit.items[0].id,
          )
        } else {
          setSelectedItemId(null)
        }
      } catch (error) {
        if (!cancelled) {
          console.error(
            'Failed to load outfit:',
            error,
          )

          alert(
            'Something went wrong while loading the outfit.',
          )
        }
      } finally {
        if (!cancelled) {
          setLoadingOutfit(false)
        }
      }
    }

    void loadOutfit()

    return () => {
      cancelled = true
    }
  }, [user?.id, outfitId])

  /*
   * LOAD SPACES
   */

  useEffect(() => {
    if (!user?.id) {
      return
    }

    const currentUserId = user.id
    let cancelled = false

    async function loadSpaces() {
      try {
        const result =
          await getSpaces(currentUserId)

        if (!cancelled) {
          setSpaces(result)
        }
      } catch (error) {
        if (!cancelled) {
          console.error(
            'Failed to load spaces:',
            error,
          )
        }
      }
    }

    void loadSpaces()

    return () => {
      cancelled = true
    }
  }, [user?.id])

  /*
   * FILTER CLOTHING
   */

  const filteredClothing =
    useMemo(() => {
      const searchValue =
        search.trim().toLowerCase()

      return clothing.filter((item) => {
        const matchesSearch =
          searchValue.length === 0 ||
          item.name
            .toLowerCase()
            .includes(searchValue) ||
          item.color
            .toLowerCase()
            .includes(searchValue) ||
          item.category
            .toLowerCase()
            .includes(searchValue)

        const matchesCategory =
          category === 'All' ||
          item.category === category

        return (
          matchesSearch &&
          matchesCategory
        )
      })
    }, [
      clothing,
      search,
      category,
    ])

  /*
   * SELECTED ITEM
   */

  const selectedItem =
    items.find(
      (item) =>
        item.id === selectedItemId,
    )

  const selectedClothing =
    selectedItem
      ? clothing.find(
          (item) =>
            item.id ===
            selectedItem.clothingId,
        )
      : undefined

  /*
   * ADD CLOTHING
   */

  function addClothing(
    clothingItem: ClothingItem,
  ) {
    const existing =
      items.find(
        (item) =>
          item.clothingId ===
          clothingItem.id,
      )

    if (existing) {
      setSelectedItemId(existing.id)
      return
    }

    const newItem: OutfitItem = {
      id: crypto.randomUUID(),
      clothingId: clothingItem.id,
      x: 320,
      y: 180,
      width: 220,
      height: 220,
      rotation: 0,
      zIndex: items.length + 1,
    }

    setItems((current) => [
      ...current,
      newItem,
    ])

    setSelectedItemId(newItem.id)
  }

  /*
   * MOVE ITEM
   */

  function moveItem(
    id: string,
    deltaX: number,
    deltaY: number,
  ) {
    setItems((current) =>
      current.map((item) => {
        if (item.id !== id) {
          return item
        }

        return {
          ...item,

          x: Math.max(
            0,
            Math.min(
              CANVAS_WIDTH -
                item.width,
              item.x + deltaX,
            ),
          ),

          y: Math.max(
            0,
            Math.min(
              CANVAS_HEIGHT -
                item.height,
              item.y + deltaY,
            ),
          ),
        }
      }),
    )
  }

  /*
   * UPDATE SELECTED ITEM
   */

  function updateSelectedItem(
    changes: Partial<OutfitItem>,
  ) {
    if (!selectedItemId) {
      return
    }

    setItems((current) =>
      current.map((item) =>
        item.id === selectedItemId
          ? {
              ...item,
              ...changes,
            }
          : item,
      ),
    )
  }

  /*
   * RESIZE
   */

  function resizeSelected(
    amount: number,
  ) {
    if (!selectedItem) {
      return
    }

    const newWidth =
      Math.max(
        80,
        Math.min(
          400,
          selectedItem.width +
            amount,
        ),
      )

    const newHeight =
      Math.max(
        80,
        Math.min(
          400,
          selectedItem.height +
            amount,
        ),
      )

    updateSelectedItem({
      width: newWidth,
      height: newHeight,
    })
  }

  /*
   * ROTATE
   */

  function rotateSelected(
    amount: number,
  ) {
    if (!selectedItem) {
      return
    }

    updateSelectedItem({
      rotation:
        selectedItem.rotation +
        amount,
    })
  }

  /*
   * DELETE
   */

  function deleteSelected() {
    if (!selectedItemId) {
      return
    }

    setItems((current) =>
      current.filter(
        (item) =>
          item.id !==
          selectedItemId,
      ),
    )

    setSelectedItemId(null)
  }

  /*
   * LAYERS
   */

  function moveLayer(
    direction: 'up' | 'down',
  ) {
    if (!selectedItemId) {
      return
    }

    const currentItem =
      items.find(
        (item) =>
          item.id === selectedItemId,
      )

    if (!currentItem) {
      return
    }

    const sorted =
      [...items].sort(
        (a, b) =>
          a.zIndex -
          b.zIndex,
      )

    const index =
      sorted.findIndex(
        (item) =>
          item.id ===
          selectedItemId,
      )

    const swapIndex =
      direction === 'up'
        ? index + 1
        : index - 1

    if (
      swapIndex < 0 ||
      swapIndex >=
        sorted.length
    ) {
      return
    }

    const otherItem =
      sorted[swapIndex]

    setItems((current) =>
      current.map((item) => {
        if (
          item.id ===
          currentItem.id
        ) {
          return {
            ...item,
            zIndex:
              otherItem.zIndex,
          }
        }

        if (
          item.id ===
          otherItem.id
        ) {
          return {
            ...item,
            zIndex:
              currentItem.zIndex,
          }
        }

        return item
      }),
    )
  }

  /*
   * SAVE OUTFIT
   */

  async function handleSave() {
    if (!user) {
      return
    }

    if (items.length === 0) {
      alert(
        'Add at least one clothing item before saving your outfit.',
      )

      return
    }

    setSaving(true)
    setSaved(false)

    try {
      const now = Date.now()
      const currentUserId =
        user.id

      const existingOutfit =
        outfitId
          ? await getOutfit(outfitId)
          : undefined

      const outfit: Outfit = {
        id:
          outfitId ||
          crypto.randomUUID(),

        userId:
          currentUserId,

        name:
          name.trim() ||
          'Untitled Outfit',

        items,

        createdAt:
          existingOutfit?.createdAt ||
          now,

        updatedAt: now,
      }

      await saveOutfit(outfit)

      if (selectedSpaceId) {
        await addOutfitToSpace({
          id: crypto.randomUUID(),

          spaceId:
            selectedSpaceId,

          outfitId:
            outfit.id,

          createdAt: now,
        })

        setSaved(true)

        window.setTimeout(() => {
          navigate(
            `/spaces/${selectedSpaceId}`,
          )
        }, 500)

        return
      }

      setSaved(true)

      window.setTimeout(() => {
        navigate('/spaces')
      }, 500)
    } catch (error) {
      console.error(
        'Failed to save outfit:',
        error,
      )

      alert(
        'Something went wrong while saving the outfit.',
      )
    } finally {
      setSaving(false)
    }
  }

  /*
   * LOADING
   */

  if (loadingOutfit) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#faf9f7] text-[#242424]">
        <div className="rounded-3xl bg-white px-8 py-7 text-center shadow-sm">
          <div className="mx-auto h-9 w-9 animate-spin rounded-full border-2 border-[#e6e1dc] border-t-[#242424]" />

          <p className="mt-4 text-sm font-medium text-[#777]">
            Loading your outfit...
          </p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#faf9f7] text-[#242424]">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-[#e8e3de] bg-white/95 px-4 py-3 backdrop-blur-md sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-3">
          <div className="min-w-0">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-[#888] transition hover:text-[#242424]"
            >
              <span aria-hidden="true">
                ←
              </span>
              Home
            </Link>

            <h1 className="mt-0.5 truncate text-xl font-bold tracking-[-0.025em] sm:text-2xl">
              {outfitId
                ? 'Edit Outfit'
                : 'Outfit Studio'}
            </h1>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {saved && (
              <span className="hidden items-center gap-1.5 rounded-full bg-[#edf5ed] px-3 py-2 text-xs font-semibold text-[#617661] sm:inline-flex">
                <span aria-hidden="true">
                  ✓
                </span>
                Saved
              </span>
            )}

            <button
              type="button"
              onClick={() => void handleSave()}
              disabled={
                saving ||
                items.length === 0
              }
              className="rounded-full bg-[#242424] px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-45 sm:px-5 sm:text-sm"
            >
              {saving
                ? 'Saving...'
                : outfitId
                  ? 'Save Changes'
                  : 'Save Outfit'}
            </button>
          </div>
        </div>
      </header>

      {/* Studio */}
      <div className="mx-auto grid max-w-[1600px] lg:grid-cols-[290px_minmax(500px,1fr)_290px]">
        {/* LEFT — Wardrobe */}
        <aside className="order-2 border-t border-[#e8e3de] bg-white lg:order-1 lg:min-h-[calc(100vh-69px)] lg:border-r lg:border-t-0">
          <div className="p-4 sm:p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#aaa]">
                  Your closet
                </p>

                <h2 className="mt-1 text-lg font-bold">
                  Wardrobe
                </h2>
              </div>

              <span className="rounded-full bg-[#f3f1ee] px-2.5 py-1 text-[10px] font-semibold text-[#777]">
                {clothing.length}
              </span>
            </div>

            <p className="mt-1 text-xs leading-5 text-[#999]">
              Tap a piece to add it to your outfit.
            </p>

            {/* Search */}
            <div className="relative mt-4">
              <span
                aria-hidden="true"
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-base text-[#aaa]"
              >
                ⌕
              </span>

              <label
                htmlFor="outfit-search"
                className="sr-only"
              >
                Search wardrobe
              </label>

              <input
                id="outfit-search"
                value={search}
                onChange={(event) =>
                  setSearch(
                    event.target.value,
                  )
                }
                placeholder="Search wardrobe..."
                className="h-11 w-full rounded-xl border border-[#e5e0db] bg-[#faf9f7] pl-10 pr-3 text-xs outline-none transition focus:border-[#aaa] focus:bg-white focus:ring-4 focus:ring-[#242424]/5"
              />
            </div>

            {/* Categories */}
            <div className="mt-3 flex gap-1.5 overflow-x-auto pb-1">
              {categories.map(
                (item) => (
                  <button
                    type="button"
                    key={item}
                    onClick={() =>
                      setCategory(
                        item,
                      )
                    }
                    className={`whitespace-nowrap rounded-full px-3 py-1.5 text-[10px] font-semibold transition ${
                      category === item
                        ? 'bg-[#242424] text-white'
                        : 'bg-[#f3f1ee] text-[#777] hover:bg-[#e8e4df]'
                    }`}
                  >
                    {item}
                  </button>
                ),
              )}
            </div>

            {/* Clothing */}
            <div className="mt-5 grid grid-cols-2 gap-2.5">
              {filteredClothing.map(
                (item) => {
                  const isAdded =
                    items.some(
                      (outfitItem) =>
                        outfitItem.clothingId ===
                        item.id,
                    )

                  const isSelected =
                    selectedItemId !==
                      null &&
                    items.some(
                      (outfitItem) =>
                        outfitItem.id ===
                          selectedItemId &&
                        outfitItem.clothingId ===
                          item.id,
                    )

                  return (
                    <button
                      type="button"
                      key={item.id}
                      onClick={() =>
                        addClothing(
                          item,
                        )
                      }
                      className={`group overflow-hidden rounded-2xl border bg-[#faf9f7] text-left transition duration-200 hover:-translate-y-0.5 hover:shadow-md ${
                        isSelected
                          ? 'border-[#242424] ring-2 ring-[#242424]/10'
                          : isAdded
                            ? 'border-[#cfc8c1]'
                            : 'border-transparent'
                      }`}
                    >
                      <div className="relative aspect-square overflow-hidden bg-[#f1eeea]">
                        <img
                          src={item.image}
                          alt={item.name}
                          loading="lazy"
                          draggable={false}
                          className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.035]"
                        />

                        {isAdded && (
                          <span className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-white text-xs font-bold shadow-sm">
                            ✓
                          </span>
                        )}
                      </div>

                      <div className="p-2.5">
                        <p className="truncate text-[11px] font-bold">
                          {item.name}
                        </p>

                        <p className="mt-1 truncate text-[10px] text-[#999]">
                          {isAdded
                            ? 'In outfit'
                            : item.category}
                        </p>
                      </div>
                    </button>
                  )
                },
              )}
            </div>

            {filteredClothing.length === 0 && (
              <div className="mt-8 rounded-2xl bg-[#faf9f7] px-4 py-8 text-center">
                <div className="text-3xl">
                  ⌕
                </div>

                <p className="mt-3 text-sm font-semibold">
                  No clothing found
                </p>

                <p className="mt-1 text-xs leading-5 text-[#999]">
                  Try another search or category.
                </p>
              </div>
            )}
          </div>
        </aside>

        {/* CENTER — Canvas */}
        <section className="order-1 min-w-0 border-b border-[#e8e3de] bg-[#f5f2ef] p-3 sm:p-5 lg:order-2 lg:border-b-0 lg:p-8">
          <div className="mx-auto w-full max-w-4xl">
            {/* Canvas toolbar */}
            <div className="mb-3 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <label
                  htmlFor="outfit-name"
                  className="sr-only"
                >
                  Outfit name
                </label>

                <input
                  id="outfit-name"
                  value={name}
                  onChange={(event) =>
                    setName(
                      event.target.value,
                    )
                  }
                  className="w-full max-w-[280px] truncate border-b border-transparent bg-transparent text-base font-bold outline-none transition hover:border-[#ccc] focus:border-[#242424] sm:text-lg"
                />
              </div>

              <div className="flex shrink-0 items-center gap-2">
                <span className="rounded-full bg-white px-3 py-1.5 text-[10px] font-semibold text-[#777] shadow-sm">
                  {items.length}{' '}
                  {items.length === 1
                    ? 'piece'
                    : 'pieces'}
                </span>
              </div>
            </div>

            {/* Canvas card */}
            <div className="rounded-[1.75rem] border border-[#e4ddd7] bg-white p-2 shadow-sm sm:p-3">
              <OutfitCanvas
                items={items}
                clothing={clothing}
                selectedItemId={
                  selectedItemId
                }
                onSelectItem={
                  setSelectedItemId
                }
                onMoveItem={
                  moveItem
                }
              />
            </div>

            <p className="mt-3 text-center text-[10px] font-medium text-[#aaa]">
              Drag pieces around the canvas to build your look
            </p>
          </div>
        </section>

        {/* RIGHT — Controls */}
        <aside className="order-3 bg-white lg:min-h-[calc(100vh-69px)] lg:border-l lg:border-[#e8e3de]">
          <div className="p-4 sm:p-5">
            {/* Save section */}
            <section className="rounded-2xl bg-[#faf9f7] p-4">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#eee9f5] text-lg">
                  ✦
                </div>

                <div>
                  <h2 className="text-sm font-bold">
                    Organize your look
                  </h2>

                  <p className="mt-1 text-[11px] leading-5 text-[#999]">
                    Save this outfit to a Space if you want to keep it organized.
                  </p>
                </div>
              </div>

              <label
                htmlFor="space"
                className="mt-4 block text-[10px] font-bold uppercase tracking-[0.16em] text-[#999]"
              >
                Add to Space
              </label>

              <select
                id="space"
                value={selectedSpaceId}
                onChange={(event) =>
                  setSelectedSpaceId(
                    event.target.value,
                  )
                }
                className="mt-2 h-11 w-full rounded-xl border border-[#e2dcd6] bg-white px-3 text-xs font-medium outline-none transition focus:border-[#242424] focus:ring-4 focus:ring-[#242424]/5"
              >
                <option value="">
                  No Space
                </option>

                {spaces.map(
                  (space) => (
                    <option
                      key={space.id}
                      value={space.id}
                    >
                      {space.name}
                    </option>
                  ),
                )}
              </select>

              {spaces.length === 0 && (
                <Link
                  to="/spaces"
                  className="mt-3 inline-flex text-[10px] font-semibold text-[#777] underline underline-offset-2 transition hover:text-[#242424]"
                >
                  Create a Space first →
                </Link>
              )}
            </section>

            {/* Item controls */}
            <section className="mt-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#aaa]">
                    Editing
                  </p>

                  <h2 className="mt-1 text-base font-bold">
                    Item Controls
                  </h2>
                </div>

                {selectedItem && (
                  <span className="rounded-full bg-[#f3f1ee] px-2.5 py-1 text-[10px] font-semibold text-[#777]">
                    Active
                  </span>
                )}
              </div>

              {!selectedItem && (
                <div className="mt-5 rounded-2xl border border-dashed border-[#ded8d2] bg-[#faf9f7] px-5 py-8 text-center">
                  <div className="text-3xl">
                    🪄
                  </div>

                  <p className="mt-3 text-sm font-bold">
                    Select a piece
                  </p>

                  <p className="mx-auto mt-1 max-w-[210px] text-[11px] leading-5 text-[#999]">
                    Select something on the canvas to change its size, rotation, or layer.
                  </p>
                </div>
              )}

              {selectedItem && (
                <div className="mt-5 space-y-5">
                  {/* Selected item */}
                  <div className="flex items-center gap-3 rounded-2xl border border-[#ebe5df] bg-white p-3 shadow-sm">
                    {selectedClothing && (
                      <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-[#f3f0ec]">
                        <img
                          src={
                            selectedClothing.image
                          }
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      </div>
                    )}

                    <div className="min-w-0">
                      <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-[#aaa]">
                        Selected
                      </p>

                      <p className="mt-1 truncate text-sm font-bold">
                        {selectedClothing?.name ||
                          'Clothing item'}
                      </p>

                      <p className="mt-0.5 truncate text-[10px] text-[#999]">
                        {selectedClothing?.category}
                      </p>
                    </div>
                  </div>

                  {/* Size */}
                  <div>
                    <div className="mb-2.5 flex items-center justify-between">
                      <p className="text-xs font-bold">
                        Size
                      </p>

                      <span className="text-[10px] text-[#aaa]">
                        {Math.round(
                          selectedItem.width,
                        )}{' '}
                        px
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          resizeSelected(
                            -20,
                          )
                        }
                        className="rounded-xl bg-[#f3f1ee] py-2.5 text-lg font-medium transition hover:bg-[#e8e4df] active:scale-[0.98]"
                        aria-label="Make item smaller"
                      >
                        −
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          resizeSelected(
                            20,
                          )
                        }
                        className="rounded-xl bg-[#f3f1ee] py-2.5 text-lg font-medium transition hover:bg-[#e8e4df] active:scale-[0.98]"
                        aria-label="Make item larger"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Rotation */}
                  <div>
                    <div className="mb-2.5 flex items-center justify-between">
                      <p className="text-xs font-bold">
                        Rotate
                      </p>

                      <span className="text-[10px] text-[#aaa]">
                        {selectedItem.rotation}°
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          rotateSelected(
                            -15,
                          )
                        }
                        className="rounded-xl bg-[#f3f1ee] py-2.5 text-xs font-medium transition hover:bg-[#e8e4df] active:scale-[0.98]"
                      >
                        ↶ 15°
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          rotateSelected(
                            15,
                          )
                        }
                        className="rounded-xl bg-[#f3f1ee] py-2.5 text-xs font-medium transition hover:bg-[#e8e4df] active:scale-[0.98]"
                      >
                        ↷ 15°
                      </button>
                    </div>
                  </div>

                  {/* Layers */}
                  <div>
                    <p className="mb-2.5 text-xs font-bold">
                      Layer
                    </p>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          moveLayer(
                            'down',
                          )
                        }
                        className="rounded-xl bg-[#f3f1ee] py-2.5 text-xs font-medium transition hover:bg-[#e8e4df] active:scale-[0.98]"
                      >
                        ↓ Back
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          moveLayer(
                            'up',
                          )
                        }
                        className="rounded-xl bg-[#f3f1ee] py-2.5 text-xs font-medium transition hover:bg-[#e8e4df] active:scale-[0.98]"
                      >
                        ↑ Front
                      </button>
                    </div>
                  </div>

                  {/* Delete */}
                  <button
                    type="button"
                    onClick={
                      deleteSelected
                    }
                    className="w-full rounded-xl border border-red-100 bg-red-50 py-2.5 text-xs font-bold text-red-600 transition hover:bg-red-100 active:scale-[0.99]"
                  >
                    Remove Item
                  </button>
                </div>
              )}
            </section>
          </div>
        </aside>
      </div>
    </main>
  )
}