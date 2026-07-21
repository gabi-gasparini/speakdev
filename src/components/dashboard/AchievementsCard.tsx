import { Link } from 'react-router-dom'

interface Achievement {
  id: string
  icon: string
  title: string
  description: string
  unlocked: boolean
}

interface AchievementsCardProps {
  achievements: Achievement[]
}

export function AchievementsCard({ achievements }: AchievementsCardProps) {
  return (
    <div className="rounded-2xl border-2 border-border bg-surface p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg">🏆</span>
          <p className="font-extrabold">Achievements</p>
        </div>
        <Link
          to="/dashboard#achievements"
          className="text-xs font-bold text-text-secondary hover:text-text-primary"
        >
          See all
        </Link>
      </div>

      <div className="mt-4 grid grid-cols-4 gap-3">
        {achievements.map((achievement) => (
          <div key={achievement.id} className="flex flex-col items-center gap-1.5 text-center">
            <div
              className={`flex h-14 w-14 items-center justify-center rounded-2xl border-2 text-2xl ${
                achievement.unlocked
                  ? 'border-accent-everyday bg-accent-everyday/10'
                  : 'border-border bg-bg text-text-secondary'
              }`}
            >
              {achievement.unlocked ? achievement.icon : '🔒'}
            </div>
            <p className="text-[11px] font-extrabold leading-tight">{achievement.title}</p>
            <p className="text-[10px] leading-tight text-text-secondary">
              {achievement.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}