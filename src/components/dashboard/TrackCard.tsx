import { Link } from 'react-router-dom'
import type { Track } from '@/types/practice'

interface TrackCardProps {
  to: string
  track: Track
  icon: string
  title: string
  description: string
}

const bgClasses: Record<Track, string> = {
  everyday: 'bg-accent-everyday',
  tech: 'bg-accent-tech',
}

export function TrackCard({ to, track, icon, title, description }: TrackCardProps) {
  return (
    <Link
      to={to}
      className={`group flex flex-col justify-between rounded-2xl border-2 border-text-primary p-5 text-white shadow-[0_4px_0_0_rgba(38,38,40,1)] transition-transform active:translate-y-1 active:shadow-none ${bgClasses[track]}`}
    >
      <div className="flex items-start justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/25 text-lg">
          {icon}
        </div>
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-lg text-text-primary transition-transform group-hover:translate-x-0.5">
          →
        </div>
      </div>

      <div className="mt-4">
        <p className="text-xs font-extrabold uppercase tracking-wide opacity-90">
          {track === 'everyday' ? 'Everyday' : 'Tech'}
        </p>
        <p className="mt-0.5 text-lg font-extrabold">{title}</p>
        <p className="mt-0.5 text-sm opacity-90">{description}</p>
      </div>
    </Link>
  )
}