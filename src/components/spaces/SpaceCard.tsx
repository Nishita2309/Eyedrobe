import { Link } from 'react-router-dom'

import type { Space } from '../../types/space'

interface SpaceCardProps {
  space: Space
  outfitCount: number
}

const spaceIcons: Record<
  string,
  string
> = {
  College: '🎓',
  Party: '🎉',
  Friends: '🫶',
  Vacation: '✈️',
  Internship: '💼',
  Date: '💗',
  Birthday: '🎂',
}

export default function SpaceCard({
  space,
  outfitCount,
}: SpaceCardProps) {
  const icon =
    spaceIcons[space.name] ?? '✨'

  return (
    <Link
      to={`/spaces/${space.id}`}
      className="group block overflow-hidden rounded-3xl border border-[#e8e3de] bg-white transition duration-200 hover:-translate-y-1 hover:shadow-lg"
    >
      {/* Cover */}
      <div className="flex aspect-[16/9] items-center justify-center bg-[#f3f0f5]">
        <span className="text-6xl transition-transform duration-200 group-hover:scale-110">
          {icon}
        </span>
      </div>

      {/* Details */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold">
              {space.name}
            </h2>

            {space.description && (
              <p className="mt-1 line-clamp-2 text-sm text-[#888]">
                {space.description}
              </p>
            )}
          </div>

          <span className="text-xl text-[#999] transition-transform group-hover:translate-x-1">
            →
          </span>
        </div>

        <div className="mt-4">
          <span className="rounded-full bg-[#f5f2ef] px-3 py-1.5 text-xs font-medium text-[#777]">
            {outfitCount}{' '}
            {outfitCount === 1
              ? 'outfit'
              : 'outfits'}
          </span>
        </div>
      </div>
    </Link>
  )
}