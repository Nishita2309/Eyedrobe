import {
  DndContext,
  PointerSensor,
  useDraggable,
  useSensor,
  useSensors,
} from '@dnd-kit/core'

import type {
  DragEndEvent,
} from '@dnd-kit/core'

import type {
  ClothingItem,
} from '../../types/clothing'

import type {
  OutfitItem,
} from '../../types/outfit'

interface OutfitCanvasProps {
  items: OutfitItem[]
  clothing: ClothingItem[]
  selectedItemId: string | null
  onSelectItem: (id: string) => void
  onMoveItem: (
    id: string,
    deltaX: number,
    deltaY: number,
  ) => void
}

interface CanvasClothingItemProps {
  outfitItem: OutfitItem
  clothing?: ClothingItem
  selected: boolean
  onSelect: () => void
}

function CanvasClothingItem({
  outfitItem,
  clothing,
  selected,
  onSelect,
}: CanvasClothingItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
  } = useDraggable({
    id: outfitItem.id,
  })

  if (!clothing) {
    return null
  }

  const transformX =
    transform?.x ?? 0

  const transformY =
    transform?.y ?? 0

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      onClick={(event) => {
        event.stopPropagation()
        onSelect()
      }}
      className={`absolute select-none touch-none ${
        selected
          ? 'cursor-grabbing'
          : 'cursor-grab'
      }`}
      style={{
        left: outfitItem.x,
        top: outfitItem.y,
        width: outfitItem.width,
        height: outfitItem.height,
        zIndex: outfitItem.zIndex,
        transform: `
          translate3d(${transformX}px, ${transformY}px, 0)
          rotate(${outfitItem.rotation}deg)
        `,
      }}
    >
      {/* Selection frame */}
      <div
        className={`relative h-full w-full rounded-2xl transition ${
          selected
            ? 'ring-2 ring-[#242424] ring-offset-4 ring-offset-white'
            : 'hover:ring-1 hover:ring-[#aaa] hover:ring-offset-2'
        }`}
      >
        <img
          src={clothing.image}
          alt={clothing.name}
          draggable={false}
          className={`h-full w-full rounded-2xl object-contain transition duration-200 ${
            selected
              ? 'drop-shadow-[0_10px_16px_rgba(36,36,36,0.14)]'
              : 'drop-shadow-[0_6px_10px_rgba(36,36,36,0.08)]'
          }`}
        />

        {selected && (
          <>
            <span
              aria-hidden="true"
              className="absolute -left-1.5 -top-1.5 h-3 w-3 rounded-full border-2 border-white bg-[#242424]"
            />

            <span
              aria-hidden="true"
              className="absolute -right-1.5 -top-1.5 h-3 w-3 rounded-full border-2 border-white bg-[#242424]"
            />

            <span
              aria-hidden="true"
              className="absolute -bottom-1.5 -left-1.5 h-3 w-3 rounded-full border-2 border-white bg-[#242424]"
            />

            <span
              aria-hidden="true"
              className="absolute -bottom-1.5 -right-1.5 h-3 w-3 rounded-full border-2 border-white bg-[#242424]"
            />
          </>
        )}
      </div>
    </div>
  )
}

export default function OutfitCanvas({
  items,
  clothing,
  selectedItemId,
  onSelectItem,
  onMoveItem,
}: OutfitCanvasProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
  )

  function handleDragEnd(
    event: DragEndEvent,
  ) {
    onMoveItem(
      String(event.active.id),
      event.delta.x,
      event.delta.y,
    )
  }

  return (
    <DndContext
      sensors={sensors}
      onDragEnd={handleDragEnd}
    >
      <div
        className="relative mx-auto aspect-[4/3] w-full max-w-4xl overflow-hidden rounded-2xl border border-[#e5dfd9] bg-[#fdfcfb] shadow-inner sm:rounded-3xl"
        onClick={() =>
          onSelectItem('')
        }
        role="application"
        aria-label="Outfit canvas"
      >
        {/* Soft background */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(#ddd7d0_1px,transparent_1px)] opacity-40 [background-size:22px_22px]"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.9),transparent_65%)]"
        />

        {/* Canvas label */}
        <div className="pointer-events-none absolute left-4 top-4 z-10">
          <span className="rounded-full border border-[#e8e2dc] bg-white/90 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.16em] text-[#999] shadow-sm backdrop-blur-sm">
            Outfit Canvas
          </span>
        </div>

        {/* Empty state */}
        {items.length === 0 && (
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-[#eee9f5] text-3xl shadow-sm">
              ✨
            </div>

            <h2 className="mt-5 text-base font-bold sm:text-lg">
              Start creating your look
            </h2>

            <p className="mt-2 max-w-xs text-xs leading-5 text-[#999] sm:text-sm">
              Choose pieces from your wardrobe and they'll appear here.
            </p>
          </div>
        )}

        {/* Clothing items */}
        {items.map((item) => {
          const clothingItem =
            clothing.find(
              (cloth) =>
                cloth.id ===
                item.clothingId,
            )

          return (
            <CanvasClothingItem
              key={item.id}
              outfitItem={item}
              clothing={
                clothingItem
              }
              selected={
                selectedItemId ===
                item.id
              }
              onSelect={() =>
                onSelectItem(
                  item.id,
                )
              }
            />
          )
        })}

        {/* Bottom hint */}
        {items.length > 0 && (
          <div className="pointer-events-none absolute bottom-3 left-1/2 z-10 -translate-x-1/2">
            <span className="rounded-full border border-[#e7e1db] bg-white/90 px-3 py-1.5 text-[9px] font-medium text-[#999] shadow-sm backdrop-blur-sm">
              Drag to move
            </span>
          </div>
        )}
      </div>
    </DndContext>
  )
}