import { Link } from 'react-router-dom'

interface WeeklyProgressCardProps {
  xpByDay: number[]
  totalXp: number
}

const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export function WeeklyProgressCard({ xpByDay, totalXp }: WeeklyProgressCardProps) {
  const maxXp = Math.max(...xpByDay, 1)

  return (
    <div className="rounded-2xl border-2 border-border bg-surface p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg">📈</span>
          <p className="font-extrabold">Your progress</p>
        </div>
        <Link to="/dashboard" className="text-xs font-bold text-text-secondary hover:text-text-primary">
          View all
        </Link>
      </div>

      <div className="mt-3 flex items-baseline gap-1">
        <p className="text-xs font-bold text-text-secondary">XP this week</p>
        <span className="ml-auto text-xl font-extrabold text-accent-everyday">{totalXp}</span>
        <span className="text-xs font-bold text-text-secondary">XP</span>
      </div>

      <div className="mt-3 flex items-end justify-between gap-2">
        {dayLabels.map((day, index) => {
          const xp = xpByDay[index] ?? 0
          const heightPercent = Math.max((xp / maxXp) * 100, 6)
          return (
            <div key={day} className="flex flex-1 flex-col items-center gap-1">
              <div className="flex h-20 w-full items-end rounded-md bg-bg">
                <div
                  className="w-full rounded-md bg-accent-everyday"
                  style={{ height: `${heightPercent}%` }}
                />
              </div>
              <span className="text-[11px] font-bold text-text-secondary">{day}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}