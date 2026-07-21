import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useDashboardData } from '@/hooks/useDashboardData'
import { useHomeStats } from '@/hooks/useHomeStats'
import { StatCard } from '@/components/dashboard/StatCard'
import { AccuracyChart } from '@/components/dashboard/AccuracyChart'
import { Mascot } from '@/components/common/Mascot'

const allAchievementDefs = [
  { id: 'first-steps', icon: '🎉', title: 'First Steps', description: 'Complete your first lesson' },
  { id: 'streak-3', icon: '🔥', title: 'Streak 3', description: 'Study 3 days in a row' },
  { id: 'speaker', icon: '🎤', title: 'Speaker', description: 'Practice speaking 5 times' },
  { id: 'tech-lover', icon: '💻', title: 'Tech Lover', description: 'Complete 5 tech lessons' },
  { id: 'streak-7', icon: '⚡', title: 'Streak 7', description: 'Study 7 days in a row' },
  { id: 'dedicated', icon: '📚', title: 'Dedicated', description: 'Complete 20 lessons' },
]

export function DashboardPage() {
  const location = useLocation()
  const { progress, recentSessions, isLoading, error } = useDashboardData()
  const stats = useHomeStats()

  useEffect(() => {
    if (location.hash === '#achievements') {
      const el = document.getElementById('achievements')
      el?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [location.hash])

  const everyday = progress.find((p) => p.track === 'everyday')
  const tech = progress.find((p) => p.track === 'tech')

  const totalSessions = (everyday?.total_sessions ?? 0) + (tech?.total_sessions ?? 0)
  const bestStreak = Math.max(everyday?.current_streak ?? 0, tech?.current_streak ?? 0)

  const overallAccuracy = (() => {
    const accuracies = [everyday?.average_accuracy, tech?.average_accuracy].filter(
      (value): value is number => typeof value === 'number'
    )
    if (accuracies.length === 0) return 0
    return Math.round(accuracies.reduce((a, b) => a + b, 0) / accuracies.length)
  })()

  const unlockedMap: Record<string, boolean> = {
    'first-steps': stats.lessonsDone >= 1,
    'streak-3': stats.dayStreak >= 3,
    speaker: stats.lessonsDone >= 5,
    'tech-lover': stats.techProgressPercent >= 25,
    'streak-7': stats.dayStreak >= 7,
    dedicated: stats.lessonsDone >= 20,
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center gap-3 py-12 text-center">
        <Mascot mood="thinking" size={100} />
        <p className="text-text-secondary">Loading your progress...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center gap-3 py-12 text-center">
        <Mascot mood="sad" size={100} />
        <p className="font-bold text-danger">Could not load your progress</p>
        <p className="text-sm text-text-secondary">{error}</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-extrabold">Your progress</h1>
        <p className="text-text-secondary">
          Track your accuracy, streak and vocabulary growth over time.
        </p>
      </div>

      {totalSessions === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border-2 border-border bg-surface py-12 text-center">
          <Mascot mood="encouraging" size={100} />
          <p className="font-bold">No sessions yet</p>
          <p className="text-sm text-text-secondary">
            Complete a dialogue in Everyday or Tech to see your stats here.
          </p>
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-3">
            <StatCard icon="🔥" label="Best streak" value={bestStreak} color="streak" />
            <StatCard icon="🎯" label="Avg. accuracy" value={`${overallAccuracy}%`} color="everyday" />
            <StatCard icon="📚" label="Total sessions" value={totalSessions} color="tech" />
          </div>

          <div>
            <h2 className="mb-3 text-xl font-extrabold">Accuracy over time</h2>
            <AccuracyChart sessions={recentSessions} />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border-2 border-border bg-surface p-5">
              <p className="text-sm font-extrabold uppercase tracking-wide text-accent-everyday">
                Everyday
              </p>
              <p className="mt-2 text-2xl font-extrabold">
                {everyday?.total_sessions ?? 0} sessions
              </p>
              <p className="text-sm text-text-secondary">
                {Math.round(everyday?.average_accuracy ?? 0)}% average accuracy
              </p>
            </div>

            <div className="rounded-2xl border-2 border-border bg-surface p-5">
              <p className="text-sm font-extrabold uppercase tracking-wide text-accent-tech">
                Tech
              </p>
              <p className="mt-2 text-2xl font-extrabold">{tech?.total_sessions ?? 0} sessions</p>
              <p className="text-sm text-text-secondary">
                {Math.round(tech?.average_accuracy ?? 0)}% average accuracy
              </p>
            </div>
          </div>
        </>
      )}

      <div id="achievements">
        <h2 className="mb-3 text-xl font-extrabold">All achievements</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {allAchievementDefs.map((achievement) => {
            const unlocked = unlockedMap[achievement.id]
            return (
              <div
                key={achievement.id}
                className="flex flex-col items-center gap-2 rounded-2xl border-2 border-border bg-surface p-4 text-center"
              >
                <div
                  className={`flex h-14 w-14 items-center justify-center rounded-2xl border-2 text-2xl ${
                    unlocked
                      ? 'border-accent-everyday bg-accent-everyday/10'
                      : 'border-border bg-bg text-text-secondary'
                  }`}
                >
                  {unlocked ? achievement.icon : '🔒'}
                </div>
                <p className="text-sm font-extrabold">{achievement.title}</p>
                <p className="text-xs text-text-secondary">{achievement.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}