import { MascotRoom } from '@/components/common/MascotRoom'
import { MiniStatBadge } from '@/components/dashboard/MiniStatBadge'
import { TrackCard } from '@/components/dashboard/TrackCard'
import { DailyGoalCard } from '@/components/dashboard/DailyGoalCard'
import { WeeklyProgressCard } from '@/components/dashboard/WeeklyProgressCard'
import { AchievementsCard } from '@/components/dashboard/AchievementsCard'
import { useHomeStats } from '@/hooks/useHomeStats'

function buildAchievements(stats: ReturnType<typeof useHomeStats>) {
  return [
    {
      id: 'first-steps',
      icon: '🎉',
      title: 'First Steps',
      description: 'Complete your first lesson',
      unlocked: stats.lessonsDone >= 1,
    },
    {
      id: 'streak-3',
      icon: '🔥',
      title: 'Streak 3',
      description: 'Study 3 days in a row',
      unlocked: stats.dayStreak >= 3,
    },
    {
      id: 'speaker',
      icon: '🎤',
      title: 'Speaker',
      description: 'Practice speaking 5 times',
      unlocked: stats.lessonsDone >= 5,
    },
    {
      id: 'tech-lover',
      icon: '💻',
      title: 'Tech Lover',
      description: 'Complete 5 tech lessons',
      unlocked: stats.techProgressPercent >= 25,
    },
  ]
}

export function HomePage() {
  const stats = useHomeStats()
  const achievements = buildAchievements(stats)

  return (
    <div className="flex flex-col gap-6">
      <MascotRoom />

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold">Welcome back, Gabi! 👋</h1>
          <p className="mt-1 text-text-secondary">
            Let's continue your journey and level up your English.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <MiniStatBadge icon="🔥" value={stats.dayStreak} label="Day streak" />
          <MiniStatBadge icon="🎯" value={stats.lessonsDone} label="Lessons done" />
          <MiniStatBadge icon="🏆" value={stats.totalXp} label="Total XP" />
          <MiniStatBadge icon="⭐" value={`Lv. ${stats.level}`} label={stats.levelTitle} />
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <TrackCard
          to="/everyday"
          track="everyday"
          icon="💬"
          title="Real-life conversations"
          description="Travel, small talk, restaurants and more."
        />
        <TrackCard
          to="/tech"
          track="tech"
          icon="</>"
          title="Talk about your projects"
          description="Interview prep, vocabulary and explaining your code."
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <DailyGoalCard
          currentXp={stats.xpByDay[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1] ?? 0}
        />
        <WeeklyProgressCard xpByDay={stats.xpByDay} totalXp={stats.xpThisWeek} />
        <AchievementsCard achievements={achievements} />
      </div>

      <div className="flex items-center gap-3 rounded-xl border-2 border-border bg-streak/10 px-5 py-3 text-sm text-text-secondary">
        <span className="text-lg">💡</span>
        <p>
          <span className="font-bold text-text-primary">Pro tip:</span> Practice a
          little every day and watch your English (and your code) improve! 🚀
        </p>
      </div>
    </div>
  )
}